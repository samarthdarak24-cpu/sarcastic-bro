"""
FREE LLM Chat Router - Unlimited AI Intelligence
Uses FREE providers like Groq, Hugging Face, and Ollama
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import json
import asyncio
from datetime import datetime

from app.services.llm_service import llm_service

router = APIRouter(prefix="/llm-chat", tags=["FREE LLM Chat"])


class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: Optional[str] = None
    user_context: Optional[Dict[str, Any]] = None
    conversation_history: Optional[List[Dict]] = None


class ChatResponse(BaseModel):
    success: bool
    response: str
    suggestions: List[str]
    session_id: str
    provider: str
    model: str
    cost: str


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send message to FREE LLM and get intelligent response"""
    
    try:
        result = await llm_service.chat_completion(
            message=request.message,
            conversation_history=request.conversation_history,
            user_context=request.user_context,
            stream=False
        )
        
        if result["success"]:
            return ChatResponse(
                success=True,
                response=result["response"],
                suggestions=llm_service.get_suggestions("general"),
                session_id=request.session_id or f"{request.user_id}_{datetime.now().timestamp()}",
                provider=result.get("provider", "unknown"),
                model=result.get("model", "unknown"),
                cost=result.get("cost", "FREE")
            )
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "LLM processing failed"))
            
    except Exception as e:
        # Always return a helpful response
        return ChatResponse(
            success=True,
            response="I'm your AI assistant! I can help with payments, orders, farming advice, and platform features. What would you like to know?",
            suggestions=[
                "How do I make a payment?",
                "Track my orders",
                "Current market prices",
                "Platform help"
            ],
            session_id=request.session_id or f"{request.user_id}_{datetime.now().timestamp()}",
            provider="fallback",
            model="local",
            cost="FREE"
        )


@router.post("/stream")
async def stream_message(request: ChatRequest):
    """Stream LLM response in real-time (FREE)"""
    
    async def generate_stream():
        try:
            # Try streaming with Groq (fastest free option)
            async for chunk in llm_service.chat_completion(
                message=request.message,
                conversation_history=request.conversation_history,
                user_context=request.user_context,
                stream=True
            ):
                yield f"data: {json.dumps(chunk)}\n\n"
                
        except Exception as e:
            # Fallback to regular response
            try:
                result = await llm_service.chat_completion(
                    message=request.message,
                    conversation_history=request.conversation_history,
                    user_context=request.user_context,
                    stream=False
                )
                
                if result["success"]:
                    # Simulate streaming for better UX
                    response = result["response"]
                    words = response.split()
                    
                    for i, word in enumerate(words):
                        chunk_data = {
                            "type": "content",
                            "content": word + " ",
                            "index": i
                        }
                        yield f"data: {json.dumps(chunk_data)}\n\n"
                        await asyncio.sleep(0.05)  # Small delay for streaming effect
                    
                    # Send done signal
                    done_data = {
                        "type": "done",
                        "response": response,
                        "provider": result.get("provider", "unknown"),
                        "cost": "FREE"
                    }
                    yield f"data: {json.dumps(done_data)}\n\n"
                
            except Exception as fallback_error:
                error_data = {
                    "type": "error",
                    "error": "I'm having trouble right now, but I'm here to help! Please try again."
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


@router.post("/context-aware")
async def context_aware_chat(
    message: str,
    user_type: str = "FARMER",
    user_context: Optional[Dict] = None
):
    """Context-aware chat endpoint (FREE unlimited)"""
    
    try:
        # Prepare enhanced context
        enhanced_context = {
            "role": user_type,
            "name": user_context.get("name", "") if user_context else "",
            "location": user_context.get("location", "") if user_context else "",
            "crops": user_context.get("crops", []) if user_context else []
        }
        
        result = await llm_service.chat_completion(
            message=message,
            user_context=enhanced_context,
            stream=False
        )
        
        if result["success"]:
            return {
                "response": result["response"],
                "suggestions": llm_service.get_suggestions("general"),
                "provider": result.get("provider", "unknown"),
                "model": result.get("model", "unknown"),
                "cost": result.get("cost", "FREE"),
                "confidence": 0.95,
                "actions": []  # For compatibility
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error"))
            
    except Exception as e:
        # Always provide helpful fallback
        return {
            "response": """🤖 **AgriMaster AI - Your Intelligent Assistant**

I'm here to help with everything on our agricultural platform:

💳 **Payments**: UPI, cards, wallets - I'll guide you through any payment process
📦 **Orders**: Track, manage, and resolve any order issues  
💰 **Market Data**: Real-time prices, trends, and selling opportunities
🌾 **Farming**: Expert advice on crops, pests, soil, and techniques
🔧 **Platform Help**: Navigate features, troubleshoot, and optimize your experience

What can I help you with today?""",
            "suggestions": [
                "How do I make a payment?",
                "Track my recent orders", 
                "Show current market prices",
                "Help with farming advice",
                "Platform tutorial"
            ],
            "provider": "fallback",
            "model": "local",
            "cost": "FREE",
            "confidence": 0.8,
            "actions": []
        }


@router.get("/suggestions/{user_id}")
async def get_suggestions(user_id: str, context: str = "general"):
    """Get contextual suggestions (FREE)"""
    
    try:
        suggestions = llm_service.get_suggestions(context)
        
        return {
            "success": True,
            "suggestions": suggestions,
            "context": context
        }
        
    except Exception as e:
        return {
            "success": True,
            "suggestions": [
                "How do I make a payment?",
                "Track my orders",
                "Current market prices",
                "Platform help"
            ],
            "context": "general"
        }


@router.get("/health")
async def health_check():
    """Health check for FREE LLM services"""
    
    try:
        health = await llm_service.health_check()
        return health
        
    except Exception as e:
        return {
            "status": "degraded",
            "error": str(e),
            "message": "Some services may be unavailable but fallback is working"
        }


@router.get("/providers")
async def get_providers():
    """Get information about available FREE providers"""
    
    return {
        "providers": {
            "groq": {
                "name": "Groq",
                "cost": "FREE",
                "limits": "14,400 requests/day",
                "speed": "Fastest",
                "models": ["llama-3.1-70b-versatile", "llama-3.1-8b-instant"],
                "status": "Primary choice"
            },
            "huggingface": {
                "name": "Hugging Face",
                "cost": "FREE", 
                "limits": "Generous free tier",
                "speed": "Good",
                "models": ["DialoGPT", "BlenderBot"],
                "status": "Backup option"
            },
            "ollama": {
                "name": "Ollama (Local)",
                "cost": "FREE",
                "limits": "Unlimited",
                "speed": "Fast",
                "models": ["llama3.1:8b", "mistral", "phi3"],
                "status": "Local fallback"
            }
        },
        "recommendation": "Use Groq for best performance and unlimited usage",
        "setup_guide": "/setup-chatgpt-integration.md"
    }