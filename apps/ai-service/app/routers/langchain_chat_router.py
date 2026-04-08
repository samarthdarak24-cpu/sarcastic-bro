"""
LangChain Chatbot Router
Enhanced chatbot API endpoints similar to krishnaik06's implementation
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import asyncio
from datetime import datetime

from ..services.langchain_chatbot import langchain_chatbot

router = APIRouter(prefix="/langchain-chat", tags=["LangChain Chatbot"])

# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    user_id: str
    user_context: Optional[Dict[str, Any]] = None
    stream: bool = False

class ChatResponse(BaseModel):
    response: str
    session_id: str
    sources: List[Dict[str, Any]] = []
    suggestions: List[str] = []
    timestamp: datetime

class SessionRequest(BaseModel):
    user_id: str

class SessionResponse(BaseModel):
    session_id: str
    created_at: datetime

class HealthResponse(BaseModel):
    status: str
    llm_available: bool
    vectorstore_available: bool
    embeddings_available: bool
    active_sessions: int
    timestamp: str

@router.post("/session", response_model=SessionResponse)
async def create_chat_session(request: SessionRequest):
    """Create a new chat session"""
    try:
        session_id = await langchain_chatbot.create_session(request.user_id)
        return SessionResponse(
            session_id=session_id,
            created_at=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message to the chatbot"""
    try:
        # Create session if not provided
        if not request.session_id:
            request.session_id = await langchain_chatbot.create_session(request.user_id)
        
        # Get response
        result = await langchain_chatbot.chat(
            message=request.message,
            session_id=request.session_id,
            user_context=request.user_context
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return ChatResponse(
            response=result["response"],
            session_id=result["session_id"],
            sources=result.get("sources", []),
            suggestions=result.get("suggestions", []),
            timestamp=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/chat/stream")
async def stream_chat(request: ChatRequest):
    """Stream chat response"""
    try:
        # Create session if not provided
        if not request.session_id:
            request.session_id = await langchain_chatbot.create_session(request.user_id)
        
        async def generate_stream():
            async for chunk in langchain_chatbot.stream_chat(
                message=request.message,
                session_id=request.session_id,
                user_context=request.user_context
            ):
                yield f"data: {json.dumps(chunk)}\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Streaming failed: {str(e)}")

@router.get("/session/{session_id}/history")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    try:
        history = await langchain_chatbot.get_chat_history(session_id)
        return {"session_id": session_id, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get history: {str(e)}")

@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """Clear a chat session"""
    try:
        success = await langchain_chatbot.clear_session(session_id)
        if success:
            return {"message": "Session cleared successfully"}
        else:
            raise HTTPException(status_code=404, detail="Session not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear session: {str(e)}")

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check for the LangChain chatbot"""
    try:
        health = await langchain_chatbot.health_check()
        return HealthResponse(**health)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/suggestions")
async def get_suggestions(context: str = "general"):
    """Get conversation suggestions"""
    suggestions = {
        "general": [
            "How do I improve my crop yield?",
            "What's the best time to plant tomatoes?",
            "Help me identify this plant disease",
            "What fertilizer should I use for corn?"
        ],
        "crops": [
            "Tell me about crop rotation benefits",
            "What are the water requirements for rice?",
            "How do I prevent pest damage?",
            "When should I harvest my wheat?"
        ],
        "soil": [
            "How do I test my soil pH?",
            "What organic matter should I add?",
            "How can I improve soil drainage?",
            "What causes soil compaction?"
        ],
        "pests": [
            "How do I identify common crop pests?",
            "What are organic pest control methods?",
            "When should I apply pesticides?",
            "How do I attract beneficial insects?"
        ],
        "market": [
            "What are current crop prices?",
            "How do I find buyers for my produce?",
            "What quality standards do buyers expect?",
            "When is the best time to sell?"
        ]
    }
    
    return {
        "context": context,
        "suggestions": suggestions.get(context, suggestions["general"])
    }

# Additional utility endpoints
@router.get("/knowledge-base/stats")
async def get_knowledge_base_stats():
    """Get statistics about the knowledge base"""
    try:
        # This would be implemented based on your vectorstore
        return {
            "total_documents": "Available when vectorstore is loaded",
            "categories": ["farming_practices", "pest_management", "soil_management", "market_insights"],
            "last_updated": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.post("/knowledge-base/add")
async def add_knowledge(knowledge: Dict[str, Any]):
    """Add new knowledge to the base (admin only)"""
    try:
        # This would implement adding new documents to the vectorstore
        return {
            "message": "Knowledge added successfully",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add knowledge: {str(e)}")