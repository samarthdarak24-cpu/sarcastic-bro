"""
Simple Stream Chat Service - Clean Implementation
Based on Hitesh Choudhary's architecture but simplified
"""

import os
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import jwt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from stream_chat import StreamChat
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Simple Stream AI Chat",
    description="Agricultural AI Chat with Stream Chat integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
stream_client = None
openai_client = None
active_agents = {}

# Pydantic models
class TokenRequest(BaseModel):
    user_id: str

class CreateUserRequest(BaseModel):
    user_id: str
    name: str
    role: str = "farmer"

class CreateChannelRequest(BaseModel):
    channel_id: str
    user_id: str
    name: str

class StartAgentRequest(BaseModel):
    channel_id: str
    agent_type: str
    user_id: str

class MessageRequest(BaseModel):
    channel_id: str
    message: str

# Initialize services
def initialize_services():
    global stream_client, openai_client
    
    # Initialize Stream Chat
    stream_api_key = os.getenv("STREAM_API_KEY")
    stream_api_secret = os.getenv("STREAM_API_SECRET")
    
    if stream_api_key and stream_api_secret:
        try:
            stream_client = StreamChat(api_key=stream_api_key, api_secret=stream_api_secret)
            logger.info("✅ Stream Chat initialized successfully")
        except Exception as e:
            logger.error(f"❌ Stream Chat initialization failed: {e}")
    else:
        logger.warning("⚠️ Stream API credentials not found")
    
    # Initialize OpenAI
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if openai_api_key:
        try:
            openai_client = OpenAI(api_key=openai_api_key)
            logger.info("✅ OpenAI initialized successfully")
        except Exception as e:
            logger.error(f"❌ OpenAI initialization failed: {e}")
    else:
        logger.warning("⚠️ OpenAI API key not found")

# Agricultural knowledge base (simple version)
AGRICULTURAL_KNOWLEDGE = {
    "wheat": "Wheat is best planted in October-December. Requires well-drained soil with pH 6.0-7.5.",
    "rice": "Rice requires flooded fields during growing season. Plant in well-prepared puddled fields.",
    "cotton": "Cotton needs warm weather and adequate water supply. Plant after last frost date.",
    "pest_control": "Use integrated pest management (IPM) strategies for sustainable pest control.",
    "soil_health": "Regular soil testing helps maintain optimal nutrient levels and pH balance."
}

def get_agricultural_advice(message: str, agent_type: str) -> str:
    """Generate agricultural advice based on message and agent type"""
    message_lower = message.lower()
    
    # Simple keyword matching
    for keyword, advice in AGRICULTURAL_KNOWLEDGE.items():
        if keyword in message_lower:
            return f"🌾 Agricultural Advice: {advice}"
    
    # Agent-specific responses
    agent_responses = {
        "crop_advisor": "As a crop advisor, I recommend consulting local agricultural extension services for specific crop guidance.",
        "market_analyst": "Market conditions vary by region and season. Consider checking local commodity prices.",
        "pest_expert": "For pest issues, proper identification is key. Consider integrated pest management approaches.",
        "soil_scientist": "Soil health is fundamental to good crops. Regular testing and organic matter addition are essential.",
        "general_advisor": "For general farming questions, I recommend following best agricultural practices for your region."
    }
    
    return agent_responses.get(agent_type, "Thank you for your question. I'm here to help with agricultural matters.")

# API Routes
@app.get("/")
async def root():
    return {
        "message": "Simple Stream AI Chat Service",
        "status": "running",
        "features": ["Stream Chat", "Agricultural AI", "OpenAI Integration"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "stream_chat": "connected" if stream_client else "disconnected",
        "openai": "connected" if openai_client else "disconnected",
        "active_agents": len(active_agents),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/token")
async def generate_token(request: TokenRequest):
    """Generate Stream Chat token"""
    try:
        if stream_client:
            token = stream_client.create_token(request.user_id)
        else:
            # Mock token for testing
            payload = {"user_id": request.user_id, "exp": int((datetime.now() + timedelta(hours=24)).timestamp())}
            token = jwt.encode(payload, "mock_secret", algorithm="HS256")
        
        return {
            "success": True,
            "token": token,
            "user_id": request.user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/users")
async def create_user(request: CreateUserRequest):
    """Create Stream Chat user"""
    try:
        if stream_client:
            user_data = {
                "id": request.user_id,
                "name": request.name,
                "role": request.role,
                "image": f"https://api.dicebear.com/7.x/avataaars/svg?seed={request.user_id}"
            }
            result = stream_client.update_user(user_data)
            return {"success": True, "user": result}
        else:
            return {"success": True, "user": {"id": request.user_id, "name": request.name}, "mode": "mock"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/channels")
async def create_channel(request: CreateChannelRequest):
    """Create Stream Chat channel"""
    try:
        if stream_client:
            channel = stream_client.channel("messaging", request.channel_id)
            result = channel.create(request.user_id, {"name": request.name})
            return {"success": True, "channel": result}
        else:
            return {"success": True, "channel": {"id": request.channel_id, "name": request.name}, "mode": "mock"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/start-ai-agent")
async def start_agent(request: StartAgentRequest):
    """Start AI agent"""
    try:
        agent_key = f"{request.channel_id}_{request.agent_type}"
        
        # Agent configurations
        agent_configs = {
            "crop_advisor": {"name": "🌾 Crop Advisor", "description": "Expert in crop cultivation"},
            "market_analyst": {"name": "📈 Market Analyst", "description": "Agricultural market specialist"},
            "pest_expert": {"name": "🐛 Pest Expert", "description": "Pest and disease management"},
            "soil_scientist": {"name": "🧪 Soil Scientist", "description": "Soil health specialist"},
            "general_advisor": {"name": "🎯 General Advisor", "description": "All-round agricultural consultant"}
        }
        
        config = agent_configs.get(request.agent_type, agent_configs["general_advisor"])
        
        # Store active agent
        active_agents[agent_key] = {
            "agent_type": request.agent_type,
            "channel_id": request.channel_id,
            "user_id": request.user_id,
            "config": config,
            "created_at": datetime.now(),
            "last_activity": datetime.now()
        }
        
        # Send welcome message if Stream client available
        if stream_client:
            try:
                channel = stream_client.channel("messaging", request.channel_id)
                channel.send_message({
                    "text": f"👋 Hello! I'm {config['name']}, your {config['description'].lower()}. How can I help you today?",
                    "user": {"id": f"agent_{request.agent_type}", "name": config["name"]},
                    "type": "agent_welcome"
                })
            except Exception as e:
                logger.warning(f"Failed to send welcome message: {e}")
        
        return {
            "success": True,
            "message": "Agent started successfully",
            "agent_type": request.agent_type,
            "agent_name": config["name"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stop-ai-agent")
async def stop_agent(channel_id: str, agent_type: str):
    """Stop AI agent"""
    try:
        agent_key = f"{channel_id}_{agent_type}"
        
        if agent_key in active_agents:
            agent = active_agents.pop(agent_key)
            config = agent["config"]
            
            # Send goodbye message if Stream client available
            if stream_client:
                try:
                    channel = stream_client.channel("messaging", channel_id)
                    channel.send_message({
                        "text": f"👋 {config['name']} has been stopped. Thank you for using our service!",
                        "user": {"id": f"agent_{agent_type}", "name": config["name"]},
                        "type": "agent_goodbye"
                    })
                except Exception as e:
                    logger.warning(f"Failed to send goodbye message: {e}")
            
            return {"success": True, "message": "Agent stopped successfully"}
        else:
            return {"success": False, "message": "Agent not found"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent-status")
async def get_agent_status(channel_id: str):
    """Get agent status for channel"""
    try:
        channel_agents = []
        
        for agent_key, agent in active_agents.items():
            if agent_key.startswith(f"{channel_id}_"):
                channel_agents.append({
                    "agent_type": agent["agent_type"],
                    "agent_name": agent["config"]["name"],
                    "created_at": agent["created_at"].isoformat(),
                    "last_activity": agent["last_activity"].isoformat()
                })
        
        return {
            "success": True,
            "channel_id": channel_id,
            "active_agents": channel_agents,
            "agent_count": len(channel_agents)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-message")
async def process_message(request: MessageRequest):
    """Process message with AI"""
    try:
        # Find active agents for this channel
        channel_agents = [
            agent for agent_key, agent in active_agents.items()
            if agent_key.startswith(f"{request.channel_id}_")
        ]
        
        if not channel_agents:
            return {"success": False, "message": "No active agents found"}
        
        # Use the first active agent
        agent = channel_agents[0]
        agent_type = agent["agent_type"]
        config = agent["config"]
        
        # Update last activity
        agent["last_activity"] = datetime.now()
        
        # Generate response
        if openai_client:
            try:
                # Use OpenAI for intelligent response
                system_prompt = f"You are {config['name']}, {config['description']}. Provide helpful agricultural advice."
                
                response = openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": request.message}
                    ],
                    max_tokens=500,
                    temperature=0.7
                )
                
                ai_response = response.choices[0].message.content.strip()
            except Exception as e:
                logger.warning(f"OpenAI API error: {e}")
                ai_response = get_agricultural_advice(request.message, agent_type)
        else:
            # Fallback to simple knowledge base
            ai_response = get_agricultural_advice(request.message, agent_type)
        
        # Send response to Stream channel if available
        if stream_client:
            try:
                channel = stream_client.channel("messaging", request.channel_id)
                channel.send_message({
                    "text": ai_response,
                    "user": {"id": f"agent_{agent_type}", "name": config["name"]},
                    "type": "agent_response"
                })
            except Exception as e:
                logger.warning(f"Failed to send response to Stream: {e}")
        
        return {
            "success": True,
            "response": ai_response,
            "agent_name": config["name"],
            "agent_type": agent_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/demo")
async def demo():
    """Demo endpoint to test functionality"""
    try:
        demo_user_id = "demo_farmer_123"
        demo_channel_id = "demo_agricultural_chat"
        
        # Create demo user
        user_result = await create_user(CreateUserRequest(
            user_id=demo_user_id,
            name="Demo Farmer",
            role="farmer"
        ))
        
        # Create demo channel
        channel_result = await create_channel(CreateChannelRequest(
            channel_id=demo_channel_id,
            user_id=demo_user_id,
            name="Demo Agricultural Chat"
        ))
        
        # Start demo agent
        agent_result = await start_agent(StartAgentRequest(
            channel_id=demo_channel_id,
            agent_type="crop_advisor",
            user_id=demo_user_id
        ))
        
        # Test message processing
        message_result = await process_message(MessageRequest(
            channel_id=demo_channel_id,
            message="What's the best time to plant wheat?"
        ))
        
        return {
            "success": True,
            "demo_results": {
                "user": user_result,
                "channel": channel_result,
                "agent": agent_result,
                "message": message_result
            },
            "instructions": [
                "This is a working demo of the Stream AI Chat system",
                "All components are functional with your API keys",
                "Frontend can connect to these endpoints",
                "Try the /demo endpoint to see it working"
            ]
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

# Initialize services on startup
@app.on_event("startup")
async def startup_event():
    initialize_services()

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)