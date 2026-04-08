"""
Simplified LangChain-style Chatbot Service
Works without LangChain dependencies using existing infrastructure
"""

import os
import json
import asyncio
from typing import List, Dict, Any, Optional, AsyncGenerator
from datetime import datetime
import logging

# Use existing services (with fallback)
try:
    from .ollama_service import OllamaService
except ImportError:
    OllamaService = None

try:
    from .llm_service import LLMService
except ImportError:
    LLMService = None

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

class SimpleLangChainChatbot:
    """
    Simplified LangChain-style chatbot using existing services
    """
    
    def __init__(self):
        self.ollama_service = OllamaService() if OllamaService else None
        self.llm_service = LLMService() if LLMService else None
        self.sessions: Dict[str, ChatSession] = {}
        self.knowledge_base = []
        self.knowledge_base_path = "app/data/agri-knowledge.json"
        self._initialized = False
        
        # Load knowledge base synchronously
        self._load_knowledge_base_sync()
    
    async def _initialize(self):
        """Initialize all components"""
        if self._initialized:
            return
        
        try:
            await self._load_knowledge_base()
            self._initialized = True
            logger.info("Simple LangChain Chatbot initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Simple LangChain Chatbot: {e}")
    
    def _load_knowledge_base_sync(self):
        """Load agricultural knowledge base synchronously"""
        try:
            if os.path.exists(self.knowledge_base_path):
                with open(self.knowledge_base_path, 'r') as f:
                    self.knowledge_base = json.load(f)
                logger.info(f"Knowledge base loaded with {len(self.knowledge_base)} entries")
            else:
                logger.warning(f"Knowledge base not found at {self.knowledge_base_path}")
        except Exception as e:
            logger.error(f"Failed to load knowledge base: {e}")
    
    async def _load_knowledge_base(self):
        """Load agricultural knowledge base (async version)"""
        self._load_knowledge_base_sync()
    
    def _search_knowledge(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Simple keyword-based knowledge search"""
        query_lower = query.lower()
        relevant_docs = []
        
        for doc in self.knowledge_base:
            score = 0
            content = doc.get('content', '').lower()
            title = doc.get('title', '').lower()
            category = doc.get('category', '').lower()
            
            # Simple scoring based on keyword matches
            for word in query_lower.split():
                if word in content:
                    score += 2
                if word in title:
                    score += 3
                if word in category:
                    score += 1
            
            if score > 0:
                doc_with_score = doc.copy()
                doc_with_score['relevance_score'] = score
                relevant_docs.append(doc_with_score)
        
        # Sort by relevance and return top results
        relevant_docs.sort(key=lambda x: x['relevance_score'], reverse=True)
        return relevant_docs[:limit]
    
    def _build_context_prompt(self, query: str, relevant_docs: List[Dict[str, Any]]) -> str:
        """Build context-aware prompt with retrieved knowledge"""
        
        context_parts = []
        if relevant_docs:
            context_parts.append("Based on the following agricultural knowledge:")
            for i, doc in enumerate(relevant_docs, 1):
                context_parts.append(f"\n{i}. {doc.get('title', 'Agricultural Knowledge')}")
                context_parts.append(f"   Category: {doc.get('category', 'general')}")
                context_parts.append(f"   Content: {doc.get('content', '')}")
        
        context = "\n".join(context_parts)
        
        prompt = f"""You are an expert agricultural AI assistant. Use the provided context to answer questions about farming, crops, soil management, pest control, and agricultural best practices.

{context}

Human Question: {query}

Provide a helpful, accurate, and practical agricultural answer. If the context doesn't contain relevant information, use your general agricultural knowledge but mention that you're providing general guidance.

Answer:"""
        
        return prompt
    
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
        Process chat message and return response with RAG-like functionality
        """
        # Ensure initialization
        if not self._initialized:
            await self._initialize()
        
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
            
            # Search knowledge base
            relevant_docs = self._search_knowledge(message)
            
            # Build context-aware prompt
            context_prompt = self._build_context_prompt(message, relevant_docs)
            
            # Get response from available LLM service
            try:
                # Try Ollama first
                response_content = await self._get_ollama_response(context_prompt)
            except Exception as e:
                logger.warning(f"Ollama failed: {e}, trying LLM service")
                try:
                    # Fallback to LLM service
                    response_content = await self._get_llm_response(context_prompt)
                except Exception as e2:
                    logger.warning(f"LLM service failed: {e2}, using fallback")
                    response_content = await self._fallback_response(message, user_context)
            
            # Add assistant message to session
            assistant_msg = ChatMessage(
                role="assistant",
                content=response_content,
                timestamp=datetime.now(),
                metadata={
                    "sources": [
                        {
                            "title": doc.get("title", ""),
                            "category": doc.get("category", ""),
                            "relevance_score": doc.get("relevance_score", 0)
                        }
                        for doc in relevant_docs
                    ]
                }
            )
            session.messages.append(assistant_msg)
            session.updated_at = datetime.now()
            
            return {
                "response": response_content,
                "session_id": session_id,
                "sources": [
                    {
                        "source": doc.get("title", "Agricultural Knowledge"),
                        "category": doc.get("category", "general"),
                        "relevance_score": doc.get("relevance_score", 0)
                    }
                    for doc in relevant_docs
                ],
                "suggestions": self._get_suggestions(message, response_content)
            }
            
        except Exception as e:
            logger.error(f"Chat error: {e}")
            return {
                "error": f"Chat processing failed: {str(e)}",
                "session_id": session_id
            }
    
    async def _get_ollama_response(self, prompt: str) -> str:
        """Get response from Ollama service"""
        if not self.ollama_service:
            raise Exception("Ollama service not available")
        
        try:
            response = await self.ollama_service.chat_completion(
                messages=[{"role": "user", "content": prompt}],
                model="llama2"
            )
            return response.get("content", "I couldn't process your request.")
        except Exception as e:
            raise Exception(f"Ollama service error: {e}")
    
    async def _get_llm_response(self, prompt: str) -> str:
        """Get response from LLM service"""
        if not self.llm_service:
            raise Exception("LLM service not available")
        
        try:
            response = await self.llm_service.chat_completion(
                messages=[{"role": "user", "content": prompt}],
                provider="groq",
                model="llama2-70b-4096"
            )
            return response.get("content", "I couldn't process your request.")
        except Exception as e:
            raise Exception(f"LLM service error: {e}")
    
    async def _fallback_response(
        self, 
        message: str, 
        user_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Fallback response when AI services are not available"""
        
        # Search knowledge base for relevant information
        relevant_docs = self._search_knowledge(message)
        
        if relevant_docs:
            # Use knowledge base content
            best_match = relevant_docs[0]
            return f"""Based on our agricultural knowledge base:

**{best_match.get('title', 'Agricultural Information')}**

{best_match.get('content', 'No content available')}

*Category: {best_match.get('category', 'general')}*

Would you like more specific information about this topic?"""
        
        # Generic agricultural responses
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["crop", "plant", "grow", "cultivation"]):
            return """For successful crop cultivation, consider these key factors:

1. **Soil Preparation**: Test soil pH and nutrient levels
2. **Seed Selection**: Choose varieties suited to your climate
3. **Planting Time**: Follow local planting calendars
4. **Water Management**: Ensure proper irrigation scheduling
5. **Pest Control**: Implement integrated pest management

What specific crop are you interested in growing?"""
        
        elif any(word in message_lower for word in ["pest", "disease", "insect", "bug"]):
            return """For effective pest and disease management:

1. **Prevention**: Use resistant varieties and crop rotation
2. **Monitoring**: Regular field inspections
3. **Biological Control**: Encourage beneficial insects
4. **Cultural Practices**: Proper spacing and sanitation
5. **Chemical Control**: Use pesticides as last resort

What specific pest or disease are you dealing with?"""
        
        elif any(word in message_lower for word in ["soil", "fertilizer", "nutrient", "pH"]):
            return """For optimal soil health and nutrition:

1. **Soil Testing**: Regular analysis of pH and nutrients
2. **Organic Matter**: Add compost and organic materials
3. **Balanced Fertilization**: NPK based on soil test results
4. **Micronutrients**: Don't forget trace elements
5. **Soil Conservation**: Prevent erosion and compaction

Do you have recent soil test results to discuss?"""
        
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
    
    async def stream_chat(
        self, 
        message: str, 
        session_id: str,
        user_context: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Stream chat response (simplified version)
        """
        try:
            # Get regular response
            result = await self.chat(message, session_id, user_context)
            
            if "error" in result:
                yield {"error": result["error"]}
                return
            
            # Simulate streaming by yielding chunks
            response = result["response"]
            words = response.split()
            
            for i, word in enumerate(words):
                yield {
                    "type": "content",
                    "content": word + " ",
                    "is_final": i == len(words) - 1,
                    "session_id": session_id
                }
                await asyncio.sleep(0.05)  # Small delay for streaming effect
            
            # Yield final metadata
            yield {
                "type": "metadata",
                "sources": result.get("sources", []),
                "suggestions": result.get("suggestions", []),
                "session_id": session_id
            }
                
        except Exception as e:
            logger.error(f"Stream chat error: {e}")
            yield {"error": f"Streaming failed: {str(e)}"}
    
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
            "service": "SimpleLangChainChatbot",
            "ollama_available": await self._check_ollama(),
            "llm_service_available": await self._check_llm_service(),
            "knowledge_base_entries": len(self.knowledge_base),
            "active_sessions": len(self.sessions),
            "timestamp": datetime.now().isoformat()
        }
    
    async def _check_ollama(self) -> bool:
        """Check if Ollama service is available"""
        if not self.ollama_service:
            return False
        try:
            await self.ollama_service.health_check()
            return True
        except:
            return False
    
    async def _check_llm_service(self) -> bool:
        """Check if LLM service is available"""
        if not self.llm_service:
            return False
        try:
            await self.llm_service.health_check()
            return True
        except:
            return False

# Global instance
simple_langchain_chatbot = SimpleLangChainChatbot()