"""
Hitesh-style Stream Chat Router
Based on hiteshchoudhary/ai-chat-app-with-agents-getstream
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime

from ..services.hitesh_stream_chat_service import hitesh_stream_chat_service

router = APIRouter(prefix="/hitesh-stream-chat", tags=["Hitesh Stream AI Chat"])

# Request Models
class CreateUserRequest(BaseModel):
    user_id: str
    name: str
    role: str = "farmer"
    email: Optional[str] = None
    location: Optional[str] = None
    crops: Optional[List[str]] = None
    farm_size: Optional[str] = None

class CreateChannelRequest(BaseModel):
    channel_id: str
    channel_type: str = "messaging"
    name: str
    description: Optional[str] = None
    user_id: str

class StartAgentRequest(BaseModel):
    channel_id: str
    agent_type: str
    user_id: str

class StopAgentRequest(BaseModel):
    channel_id: str
    agent_type: str

class ProcessMessageRequest(BaseModel):
    channel_id: str
    message: str
    user_context: Optional[Dict[str, Any]] = None

class TokenRequest(BaseModel):
    user_id: str

@router.get("/")
async def health_check():
    """Health check endpoint - matches Hitesh's pattern"""
    return await hitesh_stream_chat_service.health_check()

@router.post("/token")
async def generate_token(request: TokenRequest):
    """Generate authentication token - matches Hitesh's /token endpoint"""
    try:
        token = hitesh_stream_chat_service.generate_user_token(request.user_id)
        
        return {
            "success": True,
            "token": token,
            "user_id": request.user_id,
            "expires_at": (datetime.now().replace(hour=23, minute=59, second=59)).isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/users")
async def create_user(request: CreateUserRequest):
    """Create user - enhanced version of Hitesh's user creation"""
    try:
        user_data = {
            "name": request.name,
            "role": request.role,
            "email": request.email,
            "location": request.location,
            "crops": request.crops or [],
            "farm_size": request.farm_size,
            "created_at": datetime.now().isoformat()
        }
        
        result = await hitesh_stream_chat_service.create_user(request.user_id, user_data)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/channels")
async def create_channel(request: CreateChannelRequest):
    """Create channel - enhanced version of Hitesh's channel creation"""
    try:
        channel_data = {
            "name": request.name,
            "description": request.description,
            "type": "agricultural_chat",
            "created_at": datetime.now().isoformat()
        }
        
        result = await hitesh_stream_chat_service.create_channel(
            request.channel_type,
            request.channel_id,
            request.user_id,
            channel_data
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/start-ai-agent")
async def start_agent(request: StartAgentRequest):
    """Start AI agent - matches Hitesh's /start-ai-agent endpoint"""
    try:
        valid_agent_types = [
            "crop_advisor",
            "market_analyst", 
            "pest_expert",
            "soil_scientist",
            "general_advisor"
        ]
        
        if request.agent_type not in valid_agent_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid agent type. Must be one of: {', '.join(valid_agent_types)}"
            )
        
        result = await hitesh_stream_chat_service.start_ai_agent(
            request.channel_id,
            request.agent_type,
            request.user_id
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop-ai-agent")
async def stop_agent(request: StopAgentRequest):
    """Stop AI agent - matches Hitesh's /stop-ai-agent endpoint"""
    try:
        result = await hitesh_stream_chat_service.stop_ai_agent(
            request.channel_id,
            request.agent_type
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agent-status")
async def get_agent_status(channel_id: str):
    """Get agent status - matches Hitesh's /agent-status endpoint"""
    try:
        result = await hitesh_stream_chat_service.get_agent_status(channel_id)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/agents/message")
async def process_message(request: ProcessMessageRequest):
    """Process message with active agents"""
    try:
        result = await hitesh_stream_chat_service.process_agent_message(
            request.channel_id,
            request.message,
            request.user_context
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agents/types")
async def get_agent_types():
    """Get available agent types and their descriptions"""
    return {
        "success": True,
        "agent_types": {
            "crop_advisor": {
                "name": "🌾 Crop Advisor",
                "description": "Expert in crop selection, planting, and cultivation techniques",
                "specialties": ["crop selection", "planting", "cultivation", "yield optimization"]
            },
            "market_analyst": {
                "name": "📈 Market Analyst",
                "description": "Specialist in agricultural market trends and pricing",
                "specialties": ["price analysis", "market trends", "selling strategies", "demand forecasting"]
            },
            "pest_expert": {
                "name": "🐛 Pest & Disease Expert", 
                "description": "Expert in pest control and disease management",
                "specialties": ["pest identification", "disease management", "IPM", "crop protection"]
            },
            "soil_scientist": {
                "name": "🧪 Soil Scientist",
                "description": "Specialist in soil health and fertility management",
                "specialties": ["soil testing", "fertility management", "soil health", "nutrient planning"]
            },
            "general_advisor": {
                "name": "🎯 General Agricultural Advisor",
                "description": "All-round agricultural consultant",
                "specialties": ["general farming", "best practices", "problem solving", "resource guidance"]
            }
        }
    }

@router.get("/demo")
async def demo_chat():
    """Demo endpoint to test the Hitesh-style Stream Chat functionality"""
    try:
        # Create demo user
        demo_user_id = "demo_farmer_hitesh"
        user_result = await hitesh_stream_chat_service.create_user(demo_user_id, {
            "name": "Demo Farmer (Hitesh Style)",
            "role": "farmer",
            "location": "Maharashtra, India",
            "crops": ["wheat", "rice", "cotton"],
            "farm_size": "10 acres"
        })
        
        if not user_result["success"]:
            return {"error": "Failed to create demo user", "details": user_result}
        
        # Create demo channel
        demo_channel_id = "demo_hitesh_agricultural_chat"
        channel_result = await hitesh_stream_chat_service.create_channel(
            "messaging",
            demo_channel_id,
            demo_user_id,
            {
                "name": "Demo Hitesh Agricultural Chat",
                "description": "Demo channel for testing Hitesh-style AI agents"
            }
        )
        
        if not channel_result["success"]:
            return {"error": "Failed to create demo channel", "details": channel_result}
        
        # Start demo agent
        agent_result = await hitesh_stream_chat_service.start_ai_agent(
            demo_channel_id,
            "crop_advisor",
            demo_user_id
        )
        
        # Test message processing
        message_result = await hitesh_stream_chat_service.process_agent_message(
            demo_channel_id,
            "What's the best time to plant wheat in Maharashtra?",
            {
                "location": "Maharashtra, India", 
                "farm_size": "10 acres",
                "crops": ["wheat", "rice", "cotton"]
            }
        )
        
        return {
            "success": True,
            "demo_setup": {
                "user": user_result,
                "channel": channel_result,
                "agent": agent_result,
                "test_message": message_result
            },
            "instructions": {
                "1": "This is based on Hitesh Choudhary's AI chat app architecture",
                "2": "Uses real Stream Chat API with your provided credentials",
                "3": "Integrates OpenAI for intelligent agricultural responses",
                "4": "Includes agricultural knowledge base for enhanced accuracy",
                "5": "Try different agent types for specialized agricultural advice"
            },
            "next_steps": [
                "Test with frontend: http://localhost:3000/stream-chat",
                "Try different agent types: crop_advisor, market_analyst, pest_expert, soil_scientist",
                "Send messages to see AI responses with agricultural context"
            ]
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/stats")
async def get_service_stats():
    """Get service statistics"""
    try:
        health = await hitesh_stream_chat_service.health_check()
        
        # Count agents by type
        agent_types = {}
        for agent in hitesh_stream_chat_service.active_agents.values():
            agent_type = agent.agent_type
            agent_types[agent_type] = agent_types.get(agent_type, 0) + 1
        
        return {
            "success": True,
            "stats": {
                "active_agents": len(hitesh_stream_chat_service.active_agents),
                "agent_types": agent_types,
                "stream_status": health.get("stream_chat", "unknown"),
                "openai_status": health.get("openai", "unknown"),
                "service_mode": "production" if hitesh_stream_chat_service.stream_client else "mock",
                "architecture": "Hitesh Choudhary inspired",
                "features_enabled": health.get("features", [])
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}