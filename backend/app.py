from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from backend.prompt import SALES_AGENT_PROMPT
from backend.process import product_search
from openai import OpenAI
import os
import signal
import sys
from dotenv import load_dotenv
import json
import logging
import asyncio

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Đường dẫn tới file data.json
DATA_FILE = "data/data.json"

@app.get("/products")
async def get_products():
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            products = json.load(f)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"✅ WebSocket connection accepted. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket disconnected. Remaining connections: {len(self.active_connections)}")

    async def send_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
            logger.info("Message sent successfully")
        except Exception as e:
            logger.error(f"Error sending message: {e}")
            raise

manager = ConnectionManager()

async def keep_connection_alive(websocket: WebSocket):
    try:
        while True:
            await asyncio.sleep(20)  # Giảm thời gian ping xuống 15 giây
            try:
                await websocket.send_text(json.dumps({"type": "ping"}))
                logger.info("Ping sent successfully")
            except Exception as e:
                logger.error(f"Error sending ping: {e}")
                break
    except asyncio.CancelledError:
        logger.info("Keep-alive task cancelled")
    except Exception as e:
        logger.error(f"Error in keep_connection_alive: {e}")

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    
    # Start the keep-alive task
    keep_alive_task = asyncio.create_task(keep_connection_alive(websocket))
    
    try:
        while True:
            try:
                # Receive message with timeout
                data = await asyncio.wait_for(websocket.receive_text())
                logger.info("📥 RECEIVED FROM FRONTEND:")
                logger.info("-" * 50)
                logger.info(json.dumps(json.loads(data), indent=2, ensure_ascii=False))
                logger.info("-" * 50)
                
                try:
                    message_data = json.loads(data)
                    
                    if message_data.get("type") == "pong":
                        logger.info("Received pong message")
                        continue
                        
                    # Get cart items if available
                    cart_items = message_data.get("cart_items", [])
                    logger.info("🛒 CART ITEMS:")
                    logger.info("-" * 50)
                    logger.info(json.dumps(cart_items, indent=2, ensure_ascii=False))
                    logger.info("-" * 50)
                    
                    # Search for products
                    results = product_search.search(message_data["message"])
                    logger.info("📦 PRODUCTS FOUND:")
                    logger.info("-" * 50)
                    logger.info(json.dumps(results, indent=2, ensure_ascii=False))
                    logger.info("-" * 50)
                    
                    # Format context for prompt
                    context = f"[{json.dumps(results, ensure_ascii=False)}]"
                    cart_items_str = json.dumps(cart_items, ensure_ascii=False)
                    prompt_context = {
                        "input": message_data["message"],
                        "context": context,
                        "cart_items": cart_items_str
                    }

                    try:
                        # Get response from OpenAI
                        completion = client.chat.completions.create(
                            model="gpt-4o-mini",
                            messages=[
                                {"role": "system", "content": SALES_AGENT_PROMPT.format(**prompt_context)},
                                {"role": "user", "content": message_data["message"]}
                            ],
                            temperature=0
                        )
                        
                        # Parse response with detailed error handling
                        try:
                            ai_response = json.loads(completion.choices[0].message.content)
                            logger.info("🤖 AI RESPONSE:")
                            logger.info("-" * 50)
                            logger.info(json.dumps(ai_response, indent=2, ensure_ascii=False))
                            logger.info("-" * 50)
                        except json.JSONDecodeError as e:
                            logger.error(f"Failed to parse OpenAI response: {e}")
                            logger.error(f"Raw response: {completion.choices[0].message.content}")
                            raise Exception("Invalid JSON response from OpenAI")
                        
                        # Prepare response to send to frontend
                        frontend_response = {
                            "type": "message",
                            "ai_response": ai_response
                        }
                        logger.info("📤 SENDING TO FRONTEND:")
                        logger.info("-" * 50)
                        logger.info(json.dumps(frontend_response, indent=2, ensure_ascii=False))
                        logger.info("-" * 50)
                        
                        # Send response
                        await manager.send_message(
                            json.dumps(frontend_response, ensure_ascii=False),
                            websocket
                        )
                        logger.info("✅ Response sent to client successfully")
                        
                    except Exception as e:
                        logger.error(f"Error processing message: {e}")
                        error_response = {
                            "type": "message",
                            "ai_response": {
                                "response": {
                                    "message": f"Xin lỗi, có lỗi xảy ra: {str(e)}",
                                    "product_details": None,
                                    "suggestions": [
                                        "Bạn có thể thử lại sau",
                                        "Hoặc thử tìm kiếm với từ khóa khác"
                                    ]
                                }
                            }
                        }
                        logger.error("❌ ERROR RESPONSE:")
                        logger.error("-" * 50)
                        logger.error(json.dumps(error_response, indent=2, ensure_ascii=False))
                        logger.error("-" * 50)
                        await manager.send_message(json.dumps(error_response, ensure_ascii=False), websocket)
                        
                except json.JSONDecodeError as e:
                    logger.error(f"❌ Failed to parse message as JSON: {e}")
                    continue
                    
            except asyncio.TimeoutError:
                logger.info("No message received within timeout period")
                continue
                
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected by client")
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
    finally:
        # Cancel the keep-alive task
        keep_alive_task.cancel()
        try:
            await keep_alive_task
        except asyncio.CancelledError:
            pass
        logger.info("WebSocket connection cleanup completed")

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print('\nShutting down gracefully...')
    sys.exit(0)

if __name__ == "__main__":
    # Register signal handler
    signal.signal(signal.SIGINT, signal_handler)
    
    # Run server with reload
    import uvicorn
    config = uvicorn.Config(
        app="app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["./"]
    )
    server = uvicorn.Server(config)
    server.run()