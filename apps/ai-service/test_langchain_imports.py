#!/usr/bin/env python3
"""
Test script to check LangChain imports and basic functionality
"""

import sys
import os
import json

def test_basic_imports():
    """Test basic Python imports"""
    try:
        import asyncio
        import json
        from datetime import datetime
        from typing import List, Dict, Any, Optional, AsyncGenerator
        print("✅ Basic Python imports successful")
        return True
    except ImportError as e:
        print(f"❌ Basic Python imports failed: {e}")
        return False

def test_pydantic_imports():
    """Test Pydantic imports"""
    try:
        from pydantic import BaseModel
        print("✅ Pydantic imports successful")
        return True
    except ImportError as e:
        print(f"❌ Pydantic imports failed: {e}")
        return False

def test_langchain_imports():
    """Test LangChain imports (optional)"""
    try:
        from langchain.llms import Ollama
        from langchain.chat_models import ChatOllama
        from langchain.embeddings import OllamaEmbeddings
        from langchain.vectorstores import FAISS, Chroma
        from langchain.document_loaders import JSONLoader, TextLoader
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain.chains import ConversationalRetrievalChain, RetrievalQA
        from langchain.memory import ConversationBufferWindowMemory
        from langchain.prompts import PromptTemplate
        from langchain.schema import Document
        from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
        from langchain.callbacks.base import BaseCallbackHandler
        print("✅ LangChain imports successful")
        return True
    except ImportError as e:
        print(f"⚠️  LangChain imports failed (optional): {e}")
        print("   Run 'pip install -r requirements_langchain.txt' to install LangChain")
        return False

def test_fastapi_imports():
    """Test FastAPI imports"""
    try:
        from fastapi import APIRouter, HTTPException, Depends
        from fastapi.responses import StreamingResponse
        print("✅ FastAPI imports successful")
        return True
    except ImportError as e:
        print(f"❌ FastAPI imports failed: {e}")
        return False

def test_knowledge_base():
    """Test knowledge base file"""
    try:
        knowledge_path = "app/data/agri-knowledge.json"
        if os.path.exists(knowledge_path):
            with open(knowledge_path, 'r') as f:
                data = json.load(f)
            print(f"✅ Knowledge base loaded: {len(data)} entries")
            return True
        else:
            print(f"⚠️  Knowledge base not found at {knowledge_path}")
            return False
    except Exception as e:
        print(f"❌ Knowledge base test failed: {e}")
        return False

def test_ollama_connection():
    """Test Ollama connection (optional)"""
    try:
        import requests
        response = requests.get("http://localhost:11434/api/version", timeout=5)
        if response.status_code == 200:
            print("✅ Ollama service is running")
            return True
        else:
            print("⚠️  Ollama service not responding")
            return False
    except Exception as e:
        print(f"⚠️  Ollama connection test failed: {e}")
        print("   Make sure Ollama is installed and running")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing LangChain Chatbot Dependencies\n")
    
    tests = [
        ("Basic Python Imports", test_basic_imports),
        ("Pydantic Imports", test_pydantic_imports),
        ("FastAPI Imports", test_fastapi_imports),
        ("LangChain Imports", test_langchain_imports),
        ("Knowledge Base", test_knowledge_base),
        ("Ollama Connection", test_ollama_connection),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}:")
        result = test_func()
        results.append((test_name, result))
    
    print("\n" + "="*50)
    print("📊 Test Summary:")
    print("="*50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 {passed}/{len(tests)} tests passed")
    
    if passed >= 4:  # Basic requirements met
        print("\n🚀 LangChain Chatbot is ready to run!")
        print("   Start the AI service: python -m app.main")
    else:
        print("\n⚠️  Some dependencies are missing. Install them with:")
        print("   pip install -r requirements_langchain.txt")

if __name__ == "__main__":
    main()