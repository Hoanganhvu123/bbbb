import os
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

class VectorStoreManager:
    def __init__(self):
        self.data_path = "data/luxy.txt"
        self.store_directory = "vectorstore"
        # Sử dụng OpenAI text-embedding-3-small
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        self.vectorstore = self.load_or_create_vectorstore()

    def load_vectorstore(self):
        return FAISS.load_local(
            self.store_directory,
            self.embeddings,
            allow_dangerous_deserialization=True
        )

    def create_vectorstore(self):
        # Load text file
        loader = TextLoader(self.data_path, encoding='utf8')
        documents = loader.load()
        
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.split_documents(documents)

        # Create and save vectorstore
        vectorstore = FAISS.from_documents(chunks, self.embeddings)
        vectorstore.save_local(self.store_directory)
        return vectorstore

    def check_existing_vectorstore(self):
        return os.path.exists(os.path.join(self.store_directory, "index.faiss"))

    def load_or_create_vectorstore(self):
        if self.check_existing_vectorstore():
            return self.load_vectorstore()
        return self.create_vectorstore()

    def search(self, query: str, k: int = 5) -> List[str]:
        """Tìm kiếm k đoạn văn bản liên quan nhất"""
        results = self.vectorstore.similarity_search(query, k=k)
        return [doc.page_content for doc in results] 