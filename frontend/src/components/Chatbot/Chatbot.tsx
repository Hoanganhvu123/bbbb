import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Chatbot.css';
import { useCart } from '../../context/CartContext';
import OrderForm from '../OrderForm';
import { FiSend, FiShoppingCart } from 'react-icons/fi';

interface ProductDetails {
  name: string;
  price?: string;
  description?: string;
  image_url?: string;
  url?: string;
}

interface ChatResponse {
  message: string;
  product_details: ProductDetails[] | null;
  order_status?: boolean;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  response?: ChatResponse;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [retryCount, setRetryCount] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const MAX_RETRIES = 5;
  const RETRY_INTERVALS = [1000, 2000, 3000, 5000, 8000];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const shouldReconnect = useRef<boolean>(true);
  const { state: cartState } = useCart();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const addMessage = useCallback((text: string, isUser: boolean, response?: ChatResponse) => {
    setMessages(prev => [...prev, { 
      text, 
      isUser, 
      timestamp: new Date(), 
      response: response ? {
        message: response.message,
        product_details: response.product_details || null,
        order_status: response.order_status
      } : undefined
    }]);
  }, []);

  const connectWebSocket = useCallback(() => {
    if (!shouldReconnect.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      console.log(`Attempting to connect (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      setConnectionStatus('connecting');

      const websocket = new WebSocket('ws://localhost:8000/ws/chat');
      wsRef.current = websocket;

      websocket.onopen = () => {
        console.log('✅ Connected to WebSocket');
        setConnectionStatus('connected');
        setWs(websocket);
        setRetryCount(0);
      };

      websocket.onmessage = (event) => {
        console.log('📩 Received message:', event.data);
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'ping') {
            console.log('📍 Received ping, sending pong...');
            websocket.send(JSON.stringify({ type: 'pong' }));
            return;
          }

          if (data.type === 'message' && data.ai_response) {
            const response = data.ai_response.response;
            console.log('🤖 AI Response:', response);
            
            // Thêm message vào chat
            addMessage(response.message, false, {
              message: response.message,
              product_details: response.product_details,
              order_status: response.order_status
            });

            // Nếu là order_status = true thì cập nhật message cuối cùng thay vì thêm mới
            if (response.order_status === true) {
              console.log('🛍️ Order status is true, updating last message...');
              setMessages(prevMessages => {
                // Tìm message cuối cùng có order form
                const lastOrderFormIndex = [...prevMessages].reverse().findIndex(msg => 
                  !msg.isUser && msg.response?.order_status
                );
                
                if (lastOrderFormIndex !== -1) {
                  // Nếu đã có order form, cập nhật message đó
                  const messages = [...prevMessages];
                  const actualIndex = messages.length - 1 - lastOrderFormIndex;
                  messages[actualIndex] = {
                    ...messages[actualIndex],
                    response: {
                      ...messages[actualIndex].response!,
                      message: response.message
                    }
                  };
                  return messages;
                }
                
                // Nếu chưa có order form, thêm mới
                return [...prevMessages];
              });
            }
          }
        } catch (error) {
          console.error('❌ Error processing message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('disconnected');
      };

      websocket.onclose = (event) => {
        console.log('🔴 WebSocket connection closed', event);
        setConnectionStatus('disconnected');
        setWs(null);

        if (shouldReconnect.current && retryCount < MAX_RETRIES) {
          const timeout = RETRY_INTERVALS[retryCount] || RETRY_INTERVALS[RETRY_INTERVALS.length - 1];
          console.log(`🔄 Retrying in ${timeout}ms...`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            connectWebSocket();
          }, timeout);
        } else if (retryCount >= MAX_RETRIES) {
          console.log('❌ Max retries exceeded');
          shouldReconnect.current = false;
          addMessage('Xin lỗi, không thể kết nối đến server. Vui lòng thử lại sau.', false);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionStatus('disconnected');
    }
  }, [retryCount, addMessage]);

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      shouldReconnect.current = true;
      if (connectionStatus === 'disconnected') {
        setRetryCount(0);
        connectWebSocket();
      }
    } else {
      shouldReconnect.current = false;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      setConnectionStatus('disconnected');
      setWs(null);
      setRetryCount(0);
    }
  };

  useEffect(() => {
    if (isOpen && connectionStatus === 'disconnected' && shouldReconnect.current) {
      connectWebSocket();
    }

    return () => {
      shouldReconnect.current = false;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    if (connectionStatus !== 'connected') {
      console.error('WebSocket not connected!');
      addMessage('Đang kết nối lại với server...', false);
      return;
    }

    console.log('📤 Attempting to send message:', inputMessage);
    console.log('🔌 WebSocket state:', ws?.readyState);
    
    try {
      ws?.send(JSON.stringify({ 
        message: inputMessage,
        cart_items: cartState.items 
      }));
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
    
    addMessage(inputMessage, true);
    setInputMessage('');
  };

  const ProductWidget: React.FC<{ products: ProductDetails[] }> = ({ products }) => {
    const { dispatch } = useCart();
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const handlePrevious = () => {
      setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    const formatPrice = (price: string | undefined) => {
      if (!price) return "Liên hệ";
      const numericPrice = price.replace(/[^0-9]/g, '');
      if (!numericPrice) return price;
      
      try {
        return new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(Number(numericPrice));
      } catch (error) {
        console.error('Error formatting price:', error);
        return price;
      }
    };

    const handleAddToCart = (product: ProductDetails) => {
      dispatch({
        type: 'ADD_TO_CART',
        item: {
          id: product.url || String(Date.now()),
          title: product.name,
          price: product.price || '0',
          imageURL: product.image_url || '/placeholder.png',
          quantity: 1
        }
      });
    };

    if (!products || products.length === 0) {
      return null;
    }

    const currentProduct = products[currentIndex];

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden my-2 max-w-sm">
        <div className="w-full h-48 relative">
          {/* Navigation Buttons */}
          {products.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
                title="Previous product"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
                title="Next product"
              >
                →
              </button>
            </>
          )}
          
          {/* Product Image */}
          {currentProduct.image_url ? (
            <img 
              src={currentProduct.image_url}
              alt={currentProduct.name}
              onError={(e) => {
                console.log('Image failed to load for product:', currentProduct);
                e.currentTarget.src = '/placeholder.png';
              }}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          
          {/* Product Counter */}
          {products.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
              {currentIndex + 1} / {products.length}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h4 className="text-lg font-semibold mb-2 line-clamp-2">{currentProduct.name}</h4>
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-bold">
              {formatPrice(currentProduct.price)}
            </span>
            <button 
              onClick={() => handleAddToCart(currentProduct)}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              title="Thêm vào giỏ hàng"
            >
              <FiShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleAIResponse = (response: ChatResponse) => {
    // Hiển thị message và suggestions như bình thường
    addMessage(response.message, false);

    // Kiểm tra order_status
    if (response.order_status) {
      if (cartState.items.length === 0) {
        // Giỏ hàng trống
        addMessage("Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm trước khi đặt hàng!", false);
      } else {
        // Hiển thị form đặt hàng
        setShowOrderForm(true);
      }
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button className="chat-toggle" onClick={toggleChat} title="Mở chat">
        {isOpen ? '✕' : '💬'}
      </button>
      
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat với AI</h3>
            {cartState.items.length > 0 && (
              <div className="cart-info">
                🛒 {cartState.items.length} sản phẩm
              </div>
            )}
          </div>
          
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
                {msg.text && <div className="message-content">{msg.text}</div>}
                
                {!msg.isUser && msg.response?.product_details && (
                  <ProductWidget products={msg.response.product_details} />
                )}

                {!msg.isUser && msg.response?.order_status && cartState.items.length > 0 && (
                  <OrderForm 
                    onClose={() => {
                      addMessage("Đã hủy đặt hàng. Bạn cần gì thêm không ạ?", false);
                    }}
                    cartItems={cartState.items}
                    onSubmit={(formData) => {
                      const message = `Cảm ơn bạn đã đặt hàng!\n\nThông tin đơn hàng:\nHọ tên: ${formData.name}\nSĐT: ${formData.phone}\nĐịa chỉ: ${formData.address}\n${formData.note ? `Ghi chú: ${formData.note}` : ''}`;
                      addMessage(message, false);
                    }}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="message-input"
            />
            <button type="submit" className="send-button" title="Gửi tin nhắn">
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 