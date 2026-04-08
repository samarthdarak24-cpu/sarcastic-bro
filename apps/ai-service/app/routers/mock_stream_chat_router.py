"""
Mock Stream Chat Router for Testing
Works without API credentials
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime

from ..services.mock_stream_chat_service import mock_stream_chat_service

router = APIRouter(prefix="/mock-stream-chat", tags=["Mock Stream AI Chat"])

# Request Models (same as original)
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

@router.get("/health")
async def health_check():
    """Health check for Mock Stream Chat service"""
    return {
        "status": "healthy",
        "service": "Mock Stream AI Chat",
        "mode": "testing",
        "timestamp": datetime.now().isoformat(),
        "features": [
            "Mock real-time messaging",
            "AI agricultural agents",
            "Knowledge base integration",
            "Agent lifecycle management"
        ]
    }

@router.post("/token")
async def generate_token(request: TokenRequest):
    """Generate mock authentication token"""
    try:
        token = mock_stream_chat_service.generate_user_token(request.user_id)
        
        return {
            "success": True,
            "token": token,
            "user_id": request.user_id,
            "expires_at": (datetime.now().replace(hour=23, minute=59, second=59)).isoformat(),
            "note": "This is a mock token for testing"
        }
    except Exception as e:
        return {
            "success": False,
            "user_id": request.user_id,
            "error": str(e)
        }

@router.post("/users")
async def create_user(request: CreateUserRequest):
    """Create mock user"""
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
        
        result = await mock_stream_chat_service.create_user(request.user_id, user_data)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/channels")
async def create_channel(request: CreateChannelRequest):
    """Create mock channel"""
    try:
        channel_data = {
            "name": request.name,
            "description": request.description,
            "type": "agricultural_chat",
            "created_at": datetime.now().isoformat()
        }
        
        result = await mock_stream_chat_service.create_channel(
            request.channel_type,
            request.channel_id,
            request.user_id,
            channel_data
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/agents/start")
async def start_agent(request: StartAgentRequest):
    """Start mock AI agent"""
    try:
        valid_agent_types = [
            "crop_advisor",
            "market_analyst", 
            "pest_expert",
            "soil_scientist",
            "general_advisor"
        ]
        
        if request.agent_type not in valid_agent_types:
            return {
                "success": False,
                "message": "Invalid agent type",
                "error": f"Agent type must be one of: {', '.join(valid_agent_types)}"
            }
        
        result = await mock_stream_chat_service.start_ai_agent(
            request.channel_id,
            request.agent_type,
            request.user_id
        )
        
        return result
        
    except Exception as e:
        return {
            "success": False,
            "message": "Failed to start agent",
            "error": str(e)
        }

@router.post("/agents/stop")
async def stop_agent(request: StopAgentRequest):
    """Stop mock AI agent"""
    try:
        result = await mock_stream_chat_service.stop_ai_agent(
            request.channel_id,
            request.agent_type
        )
        
        return result
        
    except Exception as e:
        return {
            "success": False,
            "message": "Failed to stop agent",
            "error": str(e)
        }

@router.post("/agents/message")
async def process_message(request: ProcessMessageRequest):
    """Process message with active agents"""
    try:
        result = await mock_stream_chat_service.process_agent_message(
            request.channel_id,
            request.message,
            request.user_context
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agents/status/{channel_id}")
async def get_agent_status(channel_id: str):
    """Get status of agents for a channel"""
    try:
        result = await mock_stream_chat_service.get_agent_status(channel_id)
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
                "name": "Crop Advisor",
                "description": "Expert in crop selection, planting, and cultivation",
                "specialties": ["Crop selection", "Planting schedules", "Cultivation practices", "Yield optimization"]
            },
            "market_analyst": {
                "name": "Market Analyst",
                "description": "Specialist in agricultural market trends and pricing",
                "specialties": ["Price analysis", "Market trends", "Demand forecasting", "Selling strategies"]
            },
            "pest_expert": {
                "name": "Pest & Disease Expert", 
                "description": "Expert in pest control and disease management",
                "specialties": ["Pest identification", "Disease diagnosis", "IPM strategies", "Treatment options"]
            },
            "soil_scientist": {
                "name": "Soil Scientist",
                "description": "Specialist in soil health and fertility management",
                "specialties": ["Soil testing", "Fertility management", "Soil health", "Nutrient planning"]
            },
            "general_advisor": {
                "name": "General Agricultural Advisor",
                "description": "All-round agricultural consultant",
                "specialties": ["General farming", "Best practices", "Problem solving", "Resource guidance"]
            }
        }
    }

@router.get("/demo")
async def demo_chat():
    """Demo endpoint to test the mock Stream Chat functionality"""
    try:
        # Create demo user
        demo_user_id = "demo_farmer_123"
        user_result = await mock_stream_chat_service.create_user(demo_user_id, {
            "name": "Demo Farmer",
            "role": "farmer",
            "location": "Maharashtra, India",
            "crops": ["wheat", "rice", "cotton"]
        })
        
        if not user_result["success"]:
            return {"error": "Failed to create demo user", "details": user_result}
        
        # Create demo channel
        demo_channel_id = "demo_agricultural_chat"
        channel_result = await mock_stream_chat_service.create_channel(
            "messaging",
            demo_channel_id,
            demo_user_id,
            {
                "name": "Demo Agricultural Chat",
                "description": "Demo channel for testing AI agents"
            }
        )
        
        if not channel_result["success"]:
            return {"error": "Failed to create demo channel", "details": channel_result}
        
        # Start demo agent
        agent_result = await mock_stream_chat_service.start_ai_agent(
            demo_channel_id,
            "general_advisor",
            demo_user_id
        )
        
        # Test message processing
        message_result = await mock_stream_chat_service.process_agent_message(
            demo_channel_id,
            "How do I improve my wheat yield?",
            {"location": "Maharashtra", "farm_size": "5 acres"}
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
                "1": "This is a mock implementation for testing",
                "2": "All functionality works without external APIs",
                "3": "Responses are generated using the knowledge base",
                "4": "Try different agent types for specialized advice"
            }
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/stats")
async def get_service_stats():
    """Get mock service statistics"""
    try:
        active_agents = len(mock_stream_chat_service.active_agents)
        
        # Count agents by type
        agent_types = {}
        for agent in mock_stream_chat_service.active_agents.values():
            agent_type = agent.agent_type
            agent_types[agent_type] = agent_types.get(agent_type, 0) + 1
        
        return {
            "success": True,
            "stats": {
                "active_agents": active_agents,
                "agent_types": agent_types,
                "mock_users": len(mock_stream_chat_service.mock_users),
                "mock_channels": len(mock_stream_chat_service.mock_channels),
                "service_mode": "mock/testing",
                "features_enabled": [
                    "Mock real-time messaging",
                    "AI agents with knowledge base",
                    "Agent lifecycle management",
                    "Auto cleanup"
                ]
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}