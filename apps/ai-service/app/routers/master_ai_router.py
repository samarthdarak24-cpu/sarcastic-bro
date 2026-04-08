"""
Master AI Router - API endpoints for advanced AI chat
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import logging

from app.services.master_ai_service import master_ai_service, AICapability

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai/master", tags=["Master AI"])


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    user_id: str
    session_id: Optional[str] = None
    user_profile: Optional[Dict[str, Any]] = None
    stream: bool = False


class ChatResponse(BaseModel):
    success: bool
    message: str
    session_id: str
    capability: str
    metadata: Optional[Dict[str, Any]] = None


class SuggestionRequest(BaseModel):
    user_id: str
    context_type: str
    context_data: Dict[str, Any]


class SentimentRequest(BaseModel):
    message: str


class SessionHistoryResponse(BaseModel):
    success: bool
    history: Optional[List[Dict]] = None
    error: Optional[str] = None


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint - send a message and get AI response
    
    Example:
    ```json
    {
        "message": "What's the best time to plant wheat in Punjab?",
        "user_id": "user123",
        "user_profile": {
            "role": "FARMER",
            "location": "Punjab, India",
            "crops": ["wheat", "rice"]
        }
    }
    ```
    """
    try:
        if request.stream:
            raise HTTPException(
                status_code=400,
                detail="Use /chat/stream endpoint for streaming responses"
            )
        
        response = await master_ai_service.chat(
            message=request.message,
            user_id=request.user_id,
            session_id=request.session_id,
            user_profile=request.user_profile,
            stream=False
        )
        
        if not response.get("success"):
            raise HTTPException(status_code=500, detail=response.get("error"))
        
        return response
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint - get real-time AI responses
    
    Returns Server-Sent Events (SSE) stream
    """
    try:
        async def generate():
            try:
                context = await master_ai_service.get_or_create_session(
                    user_id=request.user_id,
                    session_id=request.session_id,
                    user_profile=request.user_profile
                )
                
                # Detect capability and enrich message
                capability = master_ai_service._detect_capability(request.message)
                context.add_capability(capability)
                
                enriched_message = await master_ai_service._enrich_context(
                    request.message, capability, context
                )
                
                from app.services.master_ai_service import ConversationRole
                context.add_message(ConversationRole.USER, enriched_message)
                
                # Stream response
                async for chunk in master_ai_service._stream_response(context):
                    yield f"data: {chunk}\n\n"
                
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                logger.error(f"Error in stream: {str(e)}")
                yield f"data: Error: {str(e)}\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
        
    except Exception as e:
        logger.error(f"Error in chat stream endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/suggestions")
async def get_suggestions(request: SuggestionRequest):
    """
    Get AI-powered suggestions based on context
    
    Example:
    ```json
    {
        "user_id": "user123",
        "context_type": "crop_selection",
        "context_data": {
            "location": "Punjab",
            "season": "Rabi",
            "soil_type": "Loamy"
        }
    }
    ```
    """
    try:
        suggestions = await master_ai_service.get_suggestions(
            user_id=request.user_id,
            context_type=request.context_type,
            context_data=request.context_data
        )
        
        return {
            "success": True,
            "suggestions": suggestions
        }
        
    except Exception as e:
        logger.error(f"Error getting suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-sentiment")
async def analyze_sentiment(request: SentimentRequest):
    """
    Analyze sentiment and intent of a message
    """
    try:
        analysis = await master_ai_service.analyze_sentiment(request.message)
        
        return {
            "success": True,
            "analysis": analysis
        }
        
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}/history", response_model=SessionHistoryResponse)
async def get_session_history(session_id: str):
    """
    Get conversation history for a session
    """
    try:
        history = master_ai_service.get_session_history(session_id)
        
        if history is None:
            return {
                "success": False,
                "error": "Session not found"
            }
        
        return {
            "success": True,
            "history": history
        }
        
    except Exception as e:
        logger.error(f"Error getting session history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """
    Clear a conversation session
    """
    try:
        master_ai_service.clear_session(session_id)
        
        return {
            "success": True,
            "message": "Session cleared successfully"
        }
        
    except Exception as e:
        logger.error(f"Error clearing session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/capabilities")
async def get_capabilities():
    """
    Get list of AI capabilities
    """
    return {
        "success": True,
        "capabilities": [
            {
                "id": cap.value,
                "name": cap.value.replace("_", " ").title(),
                "description": f"AI assistance for {cap.value.replace('_', ' ')}"
            }
            for cap in AICapability
        ]
    }


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Master AI",
        "version": "1.0.0"
    }
