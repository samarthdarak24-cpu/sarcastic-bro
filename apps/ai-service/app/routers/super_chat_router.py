"""
Super Advanced Chat Router - ChatGPT-like Intelligence
Provides intelligent responses to any question without external APIs
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import json
import asyncio
from datetime import datetime

from app.services.super_advanced_ai import super_ai

router = APIRouter(prefix="/super-chat", tags=["Super Advanced Chat"])


class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: Optional[str] = None
    user_context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    success: bool
    response: str
    suggestions: List[str]
    session_id: str
    intent: str
    confidence: float


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send message to super advanced AI and get intelligent response"""
    
    try:
        result = await super_ai.chat(
            message=request.message,
            user_id=request.user_id,
            session_id=request.session_id,
            user_context=request.user_context
        )
        
        if result["success"]:
            return ChatResponse(
                success=True,
                response=result["response"],
                suggestions=result.get("suggestions", []),
                session_id=result["session_id"],
                intent=result.get("intent", "general"),
                confidence=result.get("confidence", 0.95)
            )
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "AI processing failed"))
            
    except Exception as e:
        # Fallback response
        return ChatResponse(
            success=True,
            response="I'm here to help! Could you please rephrase your question? I can assist with farming, market prices, crop advice, and much more.",
            suggestions=[
                "What crops should I grow?",
                "Current market prices",
                "Farming techniques",
                "Pest control advice"
            ],
            session_id=request.session_id or f"{request.user_id}_{datetime.now().timestamp()}",
            intent="general",
            confidence=0.8
        )


@router.post("/stream")
async def stream_message(request: ChatRequest):
    """Stream AI response in real-time"""
    
    async def generate_stream():
        try:
            # Get the full response first
            result = await super_ai.chat(
                message=request.message,
                user_id=request.user_id,
                session_id=request.session_id,
                user_context=request.user_context
            )
            
            if result["success"]:
                response = result["response"]
                
                # Send metadata first
                metadata = {
                    "type": "metadata",
                    "session_id": result["session_id"],
                    "intent": result.get("intent", "general"),
                    "confidence": result.get("confidence", 0.95)
                }
                yield f"data: {json.dumps(metadata)}\n\n"
                
                # Stream the response word by word for real-time effect
                words = response.split()
                for i, word in enumerate(words):
                    chunk_data = {
                        "type": "content",
                        "content": word + " ",
                        "index": i
                    }
                    yield f"data: {json.dumps(chunk_data)}\n\n"
                    
                    # Small delay for streaming effect
                    await asyncio.sleep(0.05)
                
                # Send suggestions at the end
                suggestions_data = {
                    "type": "suggestions",
                    "suggestions": result.get("suggestions", [])
                }
                yield f"data: {json.dumps(suggestions_data)}\n\n"
                
                # Send done signal
                done_data = {"type": "done"}
                yield f"data: {json.dumps(done_data)}\n\n"
                
            else:
                error_data = {
                    "type": "error",
                    "error": result.get("error", "Processing failed")
                }
                yield f"data: {json.dumps(error_data)}\n\n"
                
        except Exception as e:
            error_data = {
                "type": "error", 
                "error": str(e)
            }
            yield f"data: {json.dumps(error_data)}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    )


@router.get("/suggestions/{user_id}")
async def get_suggestions(user_id: str, context: str = "general"):
    """Get contextual suggestions for the user"""
    
    try:
        suggestions = await super_ai.get_suggestions(user_id, context)
        
        return {
            "success": True,
            "suggestions": suggestions
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "suggestions": [
                "What crops should I grow?",
                "Current market prices",
                "Farming advice",
                "Pest control tips"
            ]
        }


@router.delete("/conversation/{session_id}")
async def clear_conversation(session_id: str):
    """Clear conversation history"""
    
    try:
        super_ai.clear_conversation(session_id)
        
        return {
            "success": True,
            "message": "Conversation cleared successfully"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@router.get("/health")
async def health_check():
    """Health check for super chat service"""
    
    return {
        "status": "healthy",
        "service": "Super Advanced Chat",
        "version": "1.0.0",
        "capabilities": [
            "Intelligent conversation",
            "Agricultural expertise", 
            "Market analysis",
            "Farming advice",
            "Real-time responses"
        ]
    }


@router.post("/context-aware")
async def context_aware_chat(
    message: str,
    user_type: str = "FARMER",
    user_context: Optional[Dict] = None
):
    """Context-aware chat endpoint for backward compatibility"""
    
    try:
        # Extract user info from context
        user_id = user_context.get("userId", "anonymous") if user_context else "anonymous"
        
        # Prepare enhanced context
        enhanced_context = {
            "role": user_type,
            "name": user_context.get("name", "") if user_context else "",
            "location": user_context.get("location", "") if user_context else "",
            "crops": user_context.get("crops", []) if user_context else []
        }
        
        result = await super_ai.chat(
            message=message,
            user_id=user_id,
            user_context=enhanced_context
        )
        
        if result["success"]:
            return {
                "response": result["response"],
                "suggestions": result.get("suggestions", []),
                "intent": result.get("intent", "general"),
                "confidence": result.get("confidence", 0.95),
                "actions": []  # For compatibility
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error"))
            
    except Exception as e:
        # Fallback response
        return {
            "response": "I'm your intelligent agricultural assistant! I can help with farming advice, market prices, crop recommendations, and much more. What would you like to know?",
            "suggestions": [
                "What crops should I grow this season?",
                "Current market prices",
                "How to improve crop yield?",
                "Pest control methods"
            ],
            "intent": "general",
            "confidence": 0.8,
            "actions": []
        }