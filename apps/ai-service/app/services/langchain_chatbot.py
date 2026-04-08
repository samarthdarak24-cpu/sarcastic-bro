"""
Enhanced LangChain-based Chatbot Service
Similar to krishnaik06's implementation but tailored for agricultural platform
"""

import os
import json
import asyncio
from typing import List, Dict, Any, Optional, AsyncGenerator
from datetime import datetime
import logging

# LangChain imports
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

# Pydantic models
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

class ChatSession(BaseModel):
    session_id: str
    user_id: str
    messages: List[ChatMessage] = []
    created_at: datetime
    updated_at: datetime

class StreamingCallbackHandler(BaseCallbackHandler):
    """Custom callback handler for streaming responses"""
    
    def __init__(self):
        self.tokens = []
        
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.tokens.append(token)

class LangChainChatbot:
    """
    Enhanced LangChain-based chatbot with RAG capabilities
    """
    
    def __init__(self):
        self.llm = None
        self.embeddings = None
        self.vectorstore = None
        self.memory = None
        self.qa_chain = None
        self.sessions: Dict[str, ChatSession] = {}
        self.knowledge_base_path = "app/data/agri-knowledge.json"
        self.vector_db_path = "app/data/vectorstore"
        
        # Initialize the chatbot
        asyncio.create_task(self._initialize())
    
    async def _initialize(self):
        """Initialize all components"""
        try:
            await self._setup_llm()
            await self._setup_embeddings()
            await self._load_knowledge_base()
            await self._setup_memory()
            await self._create_qa_chain()
            logger.info("LangChain Chatbot initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize LangChain Chatbot: {e}")
    
    async def _setup_llm(self):
        """Setup the language model"""
        try:
            # Try Ollama first
            self.llm = ChatOllama(
                model="llama2",
                temperature=0.7,
                base_url="http://localhost:11434",
                callbacks=[StreamingStdOutCallbackHandler()]
            )
            logger.info("Ollama LLM initialized")
        except Exception as e:
            logger.warning(f"Ollama not available: {e}")
            # Fallback to a simple implementation
            self.llm = None
    
    async def _setup_embeddings(self):
        """Setup embeddings model"""
        try:
            self.embeddings = OllamaEmbeddings(
                model="llama2",
                base_url="http://localhost:11434"
            )
            logger.info("Ollama embeddings initialized")
        except Exception as e:
            logger.warning(f"Ollama embeddings not available: {e}")
            self.embeddings = None
    
    async def _load_knowledge_base(self):
        """Load and process agricultural knowledge base"""
        try:
            # Load agricultural knowledge
            documents = []
            
            # Load from JSON file if exists
            if os.path.exists(self.knowledge_base_path):
                with open(self.knowledge_base_path, 'r') as f:
                    agri_data = json.load(f)
                
                # Convert to documents
                for item in agri_data:
                    if isinstance(item, dict):
                        content = json.dumps(item, indent=2)
                        doc = Document(
                            page_content=content,
                            metadata={"source": "agri_knowledge", "type": "json"}
                        )
                        documents.append(doc)
            
            # Add default agricultural knowledge
            default_knowledge = [
                {
                    "content": "Crop rotation is essential for soil health and pest management. Common rotations include legumes followed by cereals.",
                    "category": "farming_practices",
                    "crops": ["wheat", "corn", "soybeans", "rice"]
                },
                {
                    "content": "Integrated Pest Management (IPM) combines biological, cultural, physical and chemical tools to minimize pest damage.",
                    "category": "pest_management",
                    "methods": ["biological_control", "crop_rotation", "resistant_varieties"]
                },
                {
                    "content": "Soil pH affects nutrient availability. Most crops prefer slightly acidic to neutral pH (6.0-7.0).",
                    "category": "soil_management",
                    "nutrients": ["nitrogen", "phosphorus", "potassium"]
                }
            ]
            
            for item in default_knowledge:
                doc = Document(
                    page_content=json.dumps(item, indent=2),
                    metadata={"source": "default_knowledge", "category": item["category"]}
                )
                documents.append(doc)
            
            if documents and self.embeddings:
                # Split documents
                text_splitter = RecursiveCharacterTextSplitter(
                    chunk_size=1000,
                    chunk_overlap=200
                )
                splits = text_splitter.split_documents(documents)
                
                # Create vector store
                self.vectorstore = FAISS.from_documents(splits, self.embeddings)
                logger.info(f"Knowledge base loaded with {len(splits)} document chunks")
            
        except Exception as e:
            logger.error(f"Failed to load knowledge base: {e}")
    
    async def _setup_memory(self):
        """Setup conversation memory"""
        self.memory = ConversationBufferWindowMemory(
            k=10,  # Remember last 10 exchanges
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
    
    async def _create_qa_chain(self):
        """Create the QA chain with retrieval"""
        if not self.llm or not self.vectorstore:
            logger.warning("Cannot create QA chain - missing LLM or vectorstore")
            return
        
        # Custom prompt template
        template = """You are an expert agricultural AI assistant. Use the following context and chat history to answer questions about farming, crops, soil management, pest control, and agricultural best practices.

Context: {context}

Chat History: {chat_history}
Human: {question}

Provide helpful, accurate, and practical agricultural advice. If you don't know something, say so clearly.

Answer:"""

        prompt = PromptTemplate(
            template=template,
            input_variables=["context", "chat_history", "question"]
        )
        
        # Create retrieval QA chain
        self.qa_chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": 3}),
            memory=self.memory,
            combine_docs_chain_kwargs={"prompt": prompt},
            return_source_documents=True,
            verbose=True
        )
    
    async def create_session(self, user_id: str) -> str:
        """Create a new chat session"""
        session_id = f"session_{user_id}_{datetime.now().timestamp()}"
        session = ChatSession(
            session_id=session_id,
            user_id=user_id,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        self.sessions[session_id] = session
        return session_id
    
    async def get_session(self, session_id: str) -> Optional[ChatSession]:
        """Get chat session by ID"""
        return self.sessions.get(session_id)
    
    async def chat(
        self, 
        message: str, 
        session_id: str,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process chat message and return response
        """
        try:
            session = await self.get_session(session_id)
            if not session:
                return {
                    "error": "Session not found",
                    "session_id": session_id
                }
            
            # Add user message to session
            user_msg = ChatMessage(
                role="user",
                content=message,
                timestamp=datetime.now(),
                metadata=user_context
            )
            session.messages.append(user_msg)
            
            # Get response from QA chain
            if self.qa_chain:
                result = await self._get_qa_response(message)
                response_content = result.get("answer", "I'm sorry, I couldn't process your request.")
                sources = result.get("source_documents", [])
            else:
                response_content = await self._fallback_response(message, user_context)
                sources = []
            
            # Add assistant message to session
            assistant_msg = ChatMessage(
                role="assistant",
                content=response_content,
                timestamp=datetime.now(),
                metadata={"sources": [doc.metadata for doc in sources]}
            )
            session.messages.append(assistant_msg)
            session.updated_at = datetime.now()
            
            return {
                "response": response_content,
                "session_id": session_id,
                "sources": [doc.metadata for doc in sources],
                "suggestions": self._get_suggestions(message, response_content)
            }
            
        except Exception as e:
            logger.error(f"Chat error: {e}")
            return {
                "error": f"Chat processing failed: {str(e)}",
                "session_id": session_id
            }
    
    async def stream_chat(
        self, 
        message: str, 
        session_id: str,
        user_context: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Stream chat response
        """
        try:
            session = await self.get_session(session_id)
            if not session:
                yield {"error": "Session not found"}
                return
            
            # Add user message
            user_msg = ChatMessage(
                role="user",
                content=message,
                timestamp=datetime.now(),
                metadata=user_context
            )
            session.messages.append(user_msg)
            
            # Stream response
            if self.qa_chain and self.llm:
                async for chunk in self._stream_qa_response(message):
                    yield chunk
            else:
                response = await self._fallback_response(message, user_context)
                yield {
                    "type": "content",
                    "content": response,
                    "session_id": session_id
                }
            
        except Exception as e:
            logger.error(f"Stream chat error: {e}")
            yield {"error": f"Streaming failed: {str(e)}"}
    
    async def _get_qa_response(self, message: str) -> Dict[str, Any]:
        """Get response from QA chain"""
        try:
            result = await self.qa_chain.acall({"question": message})
            return result
        except Exception as e:
            logger.error(f"QA chain error: {e}")
            return {"answer": "I'm experiencing technical difficulties. Please try again."}
    
    async def _stream_qa_response(self, message: str) -> AsyncGenerator[Dict[str, Any], None]:
        """Stream response from QA chain"""
        try:
            # This is a simplified streaming implementation
            # In a real implementation, you'd need to modify the chain for streaming
            result = await self._get_qa_response(message)
            response = result.get("answer", "")
            
            # Simulate streaming by yielding chunks
            words = response.split()
            for i, word in enumerate(words):
                yield {
                    "type": "content",
                    "content": word + " ",
                    "is_final": i == len(words) - 1
                }
                await asyncio.sleep(0.05)  # Small delay for streaming effect
                
        except Exception as e:
            logger.error(f"Stream QA error: {e}")
            yield {"error": "Streaming failed"}
    
    async def _fallback_response(
        self, 
        message: str, 
        user_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Fallback response when LLM is not available"""
        
        # Simple keyword-based responses for agricultural queries
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["crop", "plant", "grow"]):
            return """For successful crop cultivation, consider these key factors:
            
1. **Soil Preparation**: Test soil pH and nutrient levels
2. **Seed Selection**: Choose varieties suited to your climate
3. **Planting Time**: Follow local planting calendars
4. **Water Management**: Ensure proper irrigation scheduling
5. **Pest Control**: Implement integrated pest management

Would you like specific advice for a particular crop?"""
        
        elif any(word in message_lower for word in ["pest", "disease", "insect"]):
            return """For effective pest and disease management:
            
1. **Prevention**: Use resistant varieties and crop rotation
2. **Monitoring**: Regular field inspections
3. **Biological Control**: Encourage beneficial insects
4. **Chemical Control**: Use pesticides as last resort
5. **Cultural Practices**: Proper spacing and sanitation

What specific pest or disease are you dealing with?"""
        
        elif any(word in message_lower for word in ["soil", "fertilizer", "nutrient"]):
            return """For optimal soil health and nutrition:
            
1. **Soil Testing**: Regular analysis of pH and nutrients
2. **Organic Matter**: Add compost and organic materials
3. **Balanced Fertilization**: NPK based on soil test results
4. **Micronutrients**: Don't forget trace elements
5. **Soil Conservation**: Prevent erosion and compaction

Do you have recent soil test results to discuss?"""
        
        elif any(word in message_lower for word in ["price", "market", "sell"]):
            return """For better market outcomes:
            
1. **Market Research**: Track local and regional prices
2. **Quality Standards**: Meet buyer requirements
3. **Timing**: Understand seasonal price patterns
4. **Storage**: Proper post-harvest handling
5. **Direct Marketing**: Consider farmer's markets or CSA

What crops are you looking to market?"""
        
        else:
            return """I'm here to help with agricultural questions! I can assist with:
            
• Crop cultivation and management
• Pest and disease control
• Soil health and fertilization
• Market insights and pricing
• Sustainable farming practices
• Weather and climate considerations

What specific agricultural topic would you like to discuss?"""
    
    def _get_suggestions(self, user_message: str, response: str) -> List[str]:
        """Generate follow-up suggestions based on conversation"""
        
        message_lower = user_message.lower()
        
        if any(word in message_lower for word in ["crop", "plant"]):
            return [
                "What's the best planting time for this crop?",
                "How much water does this crop need?",
                "What are common pests for this crop?",
                "What's the expected yield per acre?"
            ]
        
        elif any(word in message_lower for word in ["pest", "disease"]):
            return [
                "What are organic treatment options?",
                "How can I prevent this in the future?",
                "When is the best time to treat?",
                "Are there resistant varieties available?"
            ]
        
        elif any(word in message_lower for word in ["soil", "fertilizer"]):
            return [
                "How often should I test my soil?",
                "What organic amendments do you recommend?",
                "How do I improve soil drainage?",
                "What's the ideal pH for my crops?"
            ]
        
        else:
            return [
                "Tell me about crop rotation benefits",
                "How do I improve my soil health?",
                "What are the current market trends?",
                "Help me plan my planting schedule"
            ]
    
    async def get_chat_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get chat history for a session"""
        session = await self.get_session(session_id)
        if not session:
            return []
        
        return [
            {
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat(),
                "metadata": msg.metadata
            }
            for msg in session.messages
        ]
    
    async def clear_session(self, session_id: str) -> bool:
        """Clear chat session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for the chatbot service"""
        return {
            "status": "healthy",
            "llm_available": self.llm is not None,
            "vectorstore_available": self.vectorstore is not None,
            "embeddings_available": self.embeddings is not None,
            "active_sessions": len(self.sessions),
            "timestamp": datetime.now().isoformat()
        }

# Global instance
langchain_chatbot = LangChainChatbot()