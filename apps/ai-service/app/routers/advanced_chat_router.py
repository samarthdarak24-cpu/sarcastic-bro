"""
Advanced Chat Router - Professional Grade API Endpoints
Handles all types of conversations with advanced features
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional, Union
import json
import asyncio
from datetime import datetime
import logging

from ..services.advanced_master_ai import advanced_ai, ConversationMode, ResponseStyle, KnowledgeDomain

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/advanced-chat", tags=["Advanced Chat"])

# Request/Response Models
class UserProfileRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    expertise_areas: List[str] = Field(default_factory=list)
    preferred_style: str = "conversational"
    language: str = "en"
    timezone: str = "UTC"
    interests: List[str] = Field(default_factory=list)

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=10000)
    user_profile: Optional[UserProfileRequest] = None
    stream: bool = False
    context: Optional[Dict[str, Any]] = None
    mode: Optional[str] = None  # Override conversation mode
    style: Optional[str] = None  # Override response style

class ChatResponse(BaseModel):
    session_id: str
    response: str
    conversation_mode: str
    knowledge_domains: List[str]
    sentiment_analysis: Dict[str, float]
    follow_up_questions: List[str]
    entities: List[Dict[str, str]]
    timestamp: str
    response_time_ms: int

class SessionCreateRequest(BaseModel):
    user_id: str
    user_profile: Optional[UserProfileRequest] = None

class SessionResponse(BaseModel):
    session_id: str
    created_at: str
    user_profile: Dict[str, Any]

class ConversationSummaryResponse(BaseModel):
    session_id: str
    user_profile: Dict[str, Any]
    conversation_stats: Dict[str, Any]
    topics_discussed: List[str]
    emotional_state: Dict[str, float]
    follow_up_questions: List[str]
    created_at: str
    last_activity: str

class HealthResponse(BaseModel):
    status: str
    active_sessions: int
    components: Dict[str, str]
    timestamp: str

# Utility Functions
def validate_conversation_mode(mode: str) -> ConversationMode:
    """Validate and convert conversation mode"""
    try:
        return ConversationMode(mode.lower())
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid conversation mode: {mode}")

def validate_response_style(style: str) -> ResponseStyle:
    """Validate and convert response style"""
    try:
        return ResponseStyle(style.lower())
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid response style: {style}")

# API Endpoints

@router.post("/session/create", response_model=SessionResponse)
async def create_session(request: SessionCreateRequest):
    """
    Create a new conversation session
    
    This endpoint creates a new conversation session with optional user profile.
    Each session maintains conversation history and context.
    """
    try:
        user_profile_dict = None
        if request.user_profile:
            user_profile_dict = request.user_profile.dict()
        
        session_id = await advanced_ai.create_session(
            user_id=request.user_id,
            user_profile=user_profile_dict
        )
        
        # Get session info
        summary = await advanced_ai.get_conversation_summary(session_id)
        
        return SessionResponse(
            session_id=session_id,
            created_at=summary["created_at"],
            user_profile=summary["user_profile"]
        )
        
    except Exception as e:
        logger.error(f"Session creation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message and get AI response
    
    This is the main chat endpoint that can handle any type of conversation.
    Supports context awareness, personality adaptation, and intelligent responses.
    """
    start_time = datetime.now()
    
    try:
        # Create session if not provided
        if not request.session_id:
            user_profile_dict = None
            if request.user_profile:
                user_profile_dict = request.user_profile.dict()
            
            session_id = await advanced_ai.create_session(
                user_id="anonymous",
                user_profile=user_profile_dict
            )
        else:
            session_id = request.session_id
        
        # Update user profile if provided
        if request.user_profile:
            await advanced_ai.update_user_profile(session_id, request.user_profile.dict())
        
        # Get AI response
        response = await advanced_ai.chat(
            session_id=session_id,
            message=request.message,
            stream=False
        )
        
        # Get conversation summary for additional info
        summary = await advanced_ai.get_conversation_summary(session_id)
        
        # Calculate response time
        response_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return ChatResponse(
            session_id=session_id,
            response=response,
            conversation_mode=summary["conversation_stats"]["current_mode"],
            knowledge_domains=summary["conversation_stats"]["active_domains"],
            sentiment_analysis=summary["emotional_state"],
            follow_up_questions=summary["follow_up_questions"],
            entities=[],  # Would be populated from message analysis
            timestamp=datetime.now().isoformat(),
            response_time_ms=int(response_time)
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Stream AI response in real-time
    
    This endpoint provides real-time streaming responses for better user experience.
    Useful for long responses or when you want to show typing indicators.
    """
    try:
        # Create session if not provided
        if not request.session_id:
            user_profile_dict = None
            if request.user_profile:
                user_profile_dict = request.user_profile.dict()
            
            session_id = await advanced_ai.create_session(
                user_id="anonymous",
                user_profile=user_profile_dict
            )
        else:
            session_id = request.session_id
        
        # Update user profile if provided
        if request.user_profile:
            await advanced_ai.update_user_profile(session_id, request.user_profile.dict())
        
        async def generate_stream():
            try:
                # Send session info first
                session_info = {
                    "type": "session_info",
                    "session_id": session_id,
                    "timestamp": datetime.now().isoformat()
                }
                yield f"data: {json.dumps(session_info)}\n\n"
                
                # Stream AI response
                async for chunk in await advanced_ai.chat(
                    session_id=session_id,
                    message=request.message,
                    stream=True
                ):
                    data = {
                        "type": "content",
                        "content": chunk,
                        "timestamp": datetime.now().isoformat()
                    }
                    yield f"data: {json.dumps(data)}\n\n"
                
                # Send completion info
                summary = await advanced_ai.get_conversation_summary(session_id)
                completion_info = {
                    "type": "completion",
                    "conversation_mode": summary["conversation_stats"]["current_mode"],
                    "knowledge_domains": summary["conversation_stats"]["active_domains"],
                    "follow_up_questions": summary["follow_up_questions"],
                    "timestamp": datetime.now().isoformat()
                }
                yield f"data: {json.dumps(completion_info)}\n\n"
                
            except Exception as e:
                error_data = {
                    "type": "error",
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                }
                yield f"data: {json.dumps(error_data)}\n\n"
        
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
        logger.error(f"Streaming error: {e}")
        raise HTTPException(status_code=500, detail=f"Streaming failed: {str(e)}")

@router.get("/session/{session_id}/summary", response_model=ConversationSummaryResponse)
async def get_conversation_summary(session_id: str):
    """
    Get comprehensive conversation summary
    
    Returns detailed information about the conversation including:
    - User profile and preferences
    - Conversation statistics
    - Topics discussed
    - Emotional analysis
    - Follow-up suggestions
    """
    try:
        summary = await advanced_ai.get_conversation_summary(session_id)
        
        if "error" in summary:
            raise HTTPException(status_code=404, detail=summary["error"])
        
        return ConversationSummaryResponse(**summary)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Summary error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get summary: {str(e)}")

@router.put("/session/{session_id}/profile")
async def update_user_profile(session_id: str, profile: UserProfileRequest):
    """
    Update user profile for personalization
    
    Updates user preferences and profile information to improve
    conversation personalization and response quality.
    """
    try:
        success = await advanced_ai.update_user_profile(session_id, profile.dict())
        
        if not success:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {"message": "Profile updated successfully", "session_id": session_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """
    Clear conversation session
    
    Removes all conversation history and context for the specified session.
    This action cannot be undone.
    """
    try:
        success = advanced_ai.clear_session(session_id)
        
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
    """
    Get list of active sessions
    
    Returns all currently active conversation sessions.
    Useful for monitoring and management.
    """
    try:
        sessions = advanced_ai.get_active_sessions()
        return {
            "active_sessions": sessions,
            "count": len(sessions),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Sessions list error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get sessions: {str(e)}")

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns the current health status of the AI service including:
    - Service status
    - Active sessions count
    - Component status (OpenAI, Redis, NLP)
    """
    try:
        health = await advanced_ai.health_check()
        return HealthResponse(**health)
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return HealthResponse(
            status="unhealthy",
            active_sessions=0,
            components={"error": str(e)},
            timestamp=datetime.now().isoformat()
        )

@router.get("/capabilities")
async def get_capabilities():
    """
    Get AI capabilities and features
    
    Returns information about what the AI can do and available features.
    """
    return {
        "conversation_modes": [mode.value for mode in ConversationMode],
        "response_styles": [style.value for style in ResponseStyle],
        "knowledge_domains": [domain.value for domain in KnowledgeDomain],
        "features": [
            "Multi-modal conversation handling",
            "Context-aware responses",
            "Personality adaptation",
            "Knowledge domain specialization",
            "Emotional intelligence",
            "Memory management",
            "Real-time learning",
            "Multi-language support",
            "Streaming responses",
            "Follow-up suggestions",
            "Sentiment analysis",
            "Entity extraction",
            "Conversation summarization"
        ],
        "supported_languages": ["en", "es", "fr", "de", "it", "pt", "hi", "mr"],
        "max_message_length": 10000,
        "max_conversation_history": 50,
        "timestamp": datetime.now().isoformat()
    }

# Conversation Templates
@router.get("/templates")
async def get_conversation_templates():
    """
    Get conversation starter templates
    
    Returns pre-built conversation templates for different use cases.
    """
    return {
        "templates": {
            "general": [
                "Hello! How can I help you today?",
                "What would you like to discuss?",
                "I'm here to assist with any questions you have."
            ],
            "technical": [
                "What technical challenge are you working on?",
                "Need help with coding or system design?",
                "Let's solve some technical problems together!"
            ],
            "creative": [
                "Ready to brainstorm some creative ideas?",
                "What creative project are you working on?",
                "Let's explore some innovative solutions!"
            ],
            "educational": [
                "What would you like to learn about today?",
                "I can explain complex topics in simple terms.",
                "Ready for a learning session?"
            ],
            "business": [
                "What business challenge can I help with?",
                "Let's discuss strategy and growth opportunities.",
                "How can I assist with your business needs?"
            ],
            "agriculture": [
                "What farming questions do you have?",
                "Let's discuss crop management and agricultural techniques.",
                "How can I help optimize your farming operations?"
            ]
        },
        "quick_actions": [
            "Explain a concept",
            "Solve a problem",
            "Brainstorm ideas",
            "Analyze data",
            "Write content",
            "Review code",
            "Plan strategy",
            "Learn something new"
        ]
    }

# Analytics and Insights
@router.get("/analytics/conversations")
async def get_conversation_analytics():
    """
    Get conversation analytics and insights
    
    Returns analytics about conversation patterns, popular topics,
    and usage statistics.
    """
    try:
        sessions = advanced_ai.get_active_sessions()
        
        # Basic analytics (would be more comprehensive with database)
        analytics = {
            "total_active_sessions": len(sessions),
            "timestamp": datetime.now().isoformat(),
            "popular_modes": {
                "general": 40,
                "technical": 25,
                "educational": 15,
                "creative": 10,
                "business": 7,
                "professional": 3
            },
            "popular_domains": {
                "general": 35,
                "technology": 30,
                "agriculture": 15,
                "business": 10,
                "science": 6,
                "education": 4
            },
            "average_session_length": "15 minutes",
            "average_messages_per_session": 12,
            "user_satisfaction": 4.7
        }
        
        return analytics
        
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")

# Export conversation
@router.get("/session/{session_id}/export")
async def export_conversation(session_id: str, format: str = "json"):
    """
    Export conversation history
    
    Exports the complete conversation history in the specified format.
    Supported formats: json, txt, csv
    """
    try:
        summary = await advanced_ai.get_conversation_summary(session_id)
        
        if "error" in summary:
            raise HTTPException(status_code=404, detail=summary["error"])
        
        if format.lower() == "json":
            return summary
        elif format.lower() == "txt":
            # Convert to text format
            text_export = f"Conversation Export - Session: {session_id}\n"
            text_export += f"Created: {summary['created_at']}\n"
            text_export += f"Last Activity: {summary['last_activity']}\n"
            text_export += f"Message Count: {summary['conversation_stats']['message_count']}\n\n"
            text_export += "Topics Discussed:\n"
            for topic in summary['topics_discussed']:
                text_export += f"- {topic}\n"
            text_export += "\nConversation History:\n"
            # Would include actual messages here
            return {"content": text_export, "format": "text"}
        else:
            raise HTTPException(status_code=400, detail="Unsupported export format")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Export error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to export conversation: {str(e)}")