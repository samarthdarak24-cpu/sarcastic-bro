"""
Simple Chat Router - Lightweight API endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from datetime import datetime
import logging

try:
    from ..services.project_trained_ai import project_ai
except ImportError:
    project_ai = None

try:
    from ..services.universal_ai import universal_ai
except ImportError:
    universal_ai = None

# simple_ai_service was removed — provide stub
simple_ai = None

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/simple-chat", tags=["Simple Chat"])

# Request/Response Models
class UserProfileRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    preferred_style: str = "conversational"
    language: str = "en"

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=5000)
    user_profile: Optional[UserProfileRequest] = None

class ChatResponse(BaseModel):
    session_id: str
    response: str
    conversation_mode: str
    timestamp: str

class SessionCreateRequest(BaseModel):
    user_id: str
    user_profile: Optional[UserProfileRequest] = None

class SessionResponse(BaseModel):
    session_id: str
    created_at: str

@router.post("/session/create", response_model=SessionResponse)
async def create_session(request: SessionCreateRequest):
    """Create a new conversation session"""
    try:
        user_profile_dict = None
        if request.user_profile:
            user_profile_dict = request.user_profile.dict()
        
        # Use universal AI that can answer ANYTHING
        session_id = await universal_ai.create_session(
            user_id=request.user_id,
            user_profile=user_profile_dict
        )
        
        return SessionResponse(
            session_id=session_id,
            created_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Session creation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message and get AI response"""
    try:
        # Create session if not provided
        if not request.session_id:
            user_profile_dict = None
            if request.user_profile:
                user_profile_dict = request.user_profile.dict()
            
            session_id = await universal_ai.create_session(
                user_id="anonymous",
                user_profile=user_profile_dict
            )
        else:
            session_id = request.session_id
        
        # Get AI response using universal AI (answers ANYTHING!)
        response = await universal_ai.chat(
            session_id=session_id,
            message=request.message
        )
        
        # Get conversation summary
        summary = await universal_ai.get_conversation_summary(session_id)
        
        return ChatResponse(
            session_id=session_id,
            response=response,
            conversation_mode="universal",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.get("/session/{session_id}/summary")
async def get_conversation_summary(session_id: str):
    """Get conversation summary"""
    try:
        summary = await simple_ai.get_conversation_summary(session_id)
        
        if "error" in summary:
            raise HTTPException(status_code=404, detail=summary["error"])
        
        return summary
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Summary error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get summary: {str(e)}")

@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """Clear conversation session"""
    try:
        success = simple_ai.clear_session(session_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {"message": "Session cleared successfully", "session_id": session_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Session clear error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to clear session: {str(e)}")

@router.get("/sessions")
async def get_active_sessions():
    """Get list of active sessions"""
    try:
        sessions = simple_ai.get_active_sessions()
        return {
            "active_sessions": sessions,
            "count": len(sessions),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Sessions list error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get sessions: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        health = await simple_ai.health_check()
        return health
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

class EnhancedChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=5000)
    user_id: Optional[str] = None
    auth_token: Optional[str] = None
    real_time_data: Optional[Dict[str, Any]] = None
    user_profile: Optional[UserProfileRequest] = None
    system_prompt: Optional[str] = None

class EnhancedChatResponse(BaseModel):
    session_id: str
    response: str
    intent: Dict[str, Any]
    data_fetched: bool
    requires_confirmation: bool
    data_summary: Optional[str] = None
    timestamp: str

@router.post("/chat/enhanced", response_model=EnhancedChatResponse)
async def enhanced_chat(request: EnhancedChatRequest):
    """
    Enhanced chat with real-time data integration
    Automatically fetches system data when needed
    """
    try:
        # Create session if not provided
        if not request.session_id:
            user_profile_dict = None
            if request.user_profile:
                user_profile_dict = request.user_profile.dict()
            
            session_id = await universal_ai.create_session(
                user_id=request.user_id or "anonymous",
                user_profile=user_profile_dict
            )
        else:
            session_id = request.session_id
        
        # Get enhanced AI response with real-time data
        result = await universal_ai.chat_with_context(
            session_id=session_id,
            message=request.message,
            user_id=request.user_id,
            auth_token=request.auth_token,
            real_time_data=request.real_time_data,
            system_prompt=request.system_prompt
        )
        
        return EnhancedChatResponse(
            session_id=session_id,
            response=result["response"],
            intent=result["intent"],
            data_fetched=result["data_fetched"],
            requires_confirmation=result["requires_confirmation"],
            data_summary=result.get("data_summary"),
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Enhanced chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.get("/test")
async def test_endpoint():
    """Simple test endpoint"""
    return {
        "message": "Simple AI Chat API is working!",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }