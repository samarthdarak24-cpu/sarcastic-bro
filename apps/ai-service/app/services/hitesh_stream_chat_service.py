"""
Hitesh-style Stream Chat Service for Agriculture
Based on hiteshchoudhary/ai-chat-app-with-agents-getstream
"""

import os
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import jwt
from stream_chat import StreamChat
from openai import AsyncOpenAI
import httpx

from .agricultural_knowledge import AgricultureKnowledgeBase

logger = logging.getLogger(__name__)

class AgricultureAIAgent:
    """AI Agent for agricultural assistance based on Hitesh's design"""
    
    def __init__(self, agent_type: str, user_id: str, channel_id: str):
        self.agent_id = f"ai_agent_{agent_type}_{channel_id}"
        self.agent_type = agent_type
        self.user_id = user_id
        self.channel_id = channel_id
        self.created_at = datetime.now()
        self.last_activity = datetime.now()
        self.is_active = True
        
        # Initialize OpenAI client
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if openai_api_key:
            self.openai_client = AsyncOpenAI(api_key=openai_api_key)
        else:
            self.openai_client = None
            logger.warning("OpenAI API key not found")
        
        # Initialize knowledge base
        self.knowledge_base = AgricultureKnowledgeBase()
        
        # Agent configurations based on Hitesh's pattern
        self.agent_configs = {
            "crop_advisor": {
                "name": "🌾 Crop Advisor",
                "description": "Expert in crop selection, planting, and cultivation techniques",
                "system_prompt": """You are an expert agricultural crop advisor. You help farmers with:
- Crop selection based on soil, climate, and market conditions
- Planting schedules and techniques
- Cultivation best practices
- Yield optimization strategies
- Seasonal planning

Always provide practical, actionable advice based on scientific agricultural practices.""",
                "specialties": ["crop selection", "planting", "cultivation", "yield optimization"]
            },
            "market_analyst": {
                "name": "📈 Market Analyst", 
                "description": "Specialist in agricultural market trends and pricing",
                "system_prompt": """You are an agricultural market analyst. You help farmers with:
- Market price analysis and trends
- Demand forecasting
- Best selling strategies
- Market timing decisions
- Price risk management

Provide data-driven insights to help farmers maximize their profits.""",
                "specialties": ["price analysis", "market trends", "selling strategies", "demand forecasting"]
            },
            "pest_expert": {
                "name": "🐛 Pest & Disease Expert",
                "description": "Expert in pest control and disease management", 
                "system_prompt": """You are a plant pathology and pest management expert. You help farmers with:
- Pest identification and diagnosis
- Disease prevention and treatment
- Integrated Pest Management (IPM) strategies
- Organic and chemical control options
- Crop protection planning

Focus on sustainable, effective pest and disease management solutions.""",
                "specialties": ["pest identification", "disease management", "IPM", "crop protection"]
            },
            "soil_scientist": {
                "name": "🧪 Soil Scientist",
                "description": "Specialist in soil health and fertility management",
                "system_prompt": """You are a soil science expert. You help farmers with:
- Soil testing and analysis interpretation
- Fertility management and nutrient planning
- Soil health improvement strategies
- Organic matter management
- pH and nutrient corrections

Provide science-based recommendations for optimal soil management.""",
                "specialties": ["soil testing", "fertility management", "soil health", "nutrient planning"]
            },
            "general_advisor": {
                "name": "🎯 General Agricultural Advisor",
                "description": "All-round agricultural consultant",
                "system_prompt": """You are a comprehensive agricultural advisor. You help farmers with:
- General farming questions and problems
- Best practices across all agricultural areas
- Problem-solving and troubleshooting
- Resource recommendations
- Farming system optimization

Provide well-rounded agricultural guidance covering all aspects of farming.""",
                "specialties": ["general farming", "best practices", "problem solving", "resource guidance"]
            }
        }
    
    def get_config(self) -> Dict[str, Any]:
        """Get agent configuration"""
        return self.agent_configs.get(self.agent_type, self.agent_configs["general_advisor"])
    
    async def process_message(self, message: str, user_context: Optional[Dict] = None) -> Dict[str, Any]:
        """Process user message and generate AI response"""
        try:
            self.last_activity = datetime.now()
            
            if not self.openai_client:
                return {
                    "success": False,
                    "error": "OpenAI client not available",
                    "response": "I'm currently unable to process your message. Please check the API configuration."
                }
            
            # Get agent configuration
            config = self.get_config()
            
            # Search knowledge base for relevant information
            knowledge_results = await self.knowledge_base.search(message, limit=3)
            knowledge_context = ""
            
            if knowledge_results:
                knowledge_context = "\n\nRelevant agricultural knowledge:\n"
                for i, result in enumerate(knowledge_results, 1):
                    knowledge_context += f"{i}. {result.get('title', 'Unknown')}: {result.get('content', '')[:200]}...\n"
            
            # Build context
            context_info = ""
            if user_context:
                location = user_context.get('location', '')
                crops = user_context.get('crops', [])
                farm_size = user_context.get('farm_size', '')
                
                if location:
                    context_info += f"User location: {location}\n"
                if crops:
                    context_info += f"User crops: {', '.join(crops)}\n"
                if farm_size:
                    context_info += f"Farm size: {farm_size}\n"
            
            # Create messages for OpenAI
            messages = [
                {
                    "role": "system",
                    "content": f"{config['system_prompt']}\n\n{context_info}{knowledge_context}"
                },
                {
                    "role": "user", 
                    "content": message
                }
            ]
            
            # Generate AI response
            response = await self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Extract sources from knowledge results
            sources = []
            if knowledge_results:
                sources = [result.get('title', 'Agricultural Knowledge') for result in knowledge_results[:2]]
            
            return {
                "success": True,
                "response": ai_response,
                "agent_name": config["name"],
                "agent_type": self.agent_type,
                "sources": sources,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Agent message processing error: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": f"I encountered an error processing your message: {str(e)}"
            }

class HiteshStreamChatService:
    """Stream Chat service based on Hitesh Choudhary's architecture"""
    
    def __init__(self):
        # Initialize Stream Chat client
        self.stream_api_key = os.getenv("STREAM_API_KEY")
        self.stream_api_secret = os.getenv("STREAM_API_SECRET")
        
        if not self.stream_api_key or not self.stream_api_secret:
            logger.error("Stream API credentials not found")
            self.stream_client = None
        else:
            try:
                self.stream_client = StreamChat(
                    api_key=self.stream_api_key,
                    api_secret=self.stream_api_secret
                )
                logger.info("Stream Chat client initialized successfully")
            except Exception as e:
                logger.error(f"Stream Chat initialization failed: {e}")
                self.stream_client = None
        
        # Agent management
        self.active_agents: Dict[str, AgricultureAIAgent] = {}
        self.cleanup_task = None
        
        # Start cleanup task
        if self.stream_client:
            asyncio.create_task(self._start_cleanup_task())
    
    async def _start_cleanup_task(self):
        """Start the cleanup task for expired agents"""
        try:
            while True:
                await asyncio.sleep(300)  # Check every 5 minutes
                await self._cleanup_expired_agents()
        except Exception as e:
            logger.error(f"Cleanup task error: {e}")
    
    async def _cleanup_expired_agents(self):
        """Clean up expired agents (inactive for more than 30 minutes)"""
        try:
            current_time = datetime.now()
            expired_agents = []
            
            for agent_key, agent in self.active_agents.items():
                if current_time - agent.last_activity > timedelta(minutes=30):
                    expired_agents.append(agent_key)
            
            for agent_key in expired_agents:
                agent = self.active_agents.pop(agent_key, None)
                if agent:
                    logger.info(f"Cleaned up expired agent: {agent.agent_id}")
                    
        except Exception as e:
            logger.error(f"Agent cleanup error: {e}")
    
    def generate_user_token(self, user_id: str, expiration_time: Optional[datetime] = None) -> str:
        """Generate JWT token for Stream Chat authentication"""
        try:
            if not self.stream_client:
                # Generate mock token for testing
                payload = {
                    "user_id": user_id,
                    "exp": int((expiration_time or datetime.now() + timedelta(hours=24)).timestamp())
                }
                return jwt.encode(payload, "mock_secret", algorithm="HS256")
            
            # Generate real Stream token
            token = self.stream_client.create_token(user_id, expiration_time)
            return token
            
        except Exception as e:
            logger.error(f"Token generation error: {e}")
            raise
    
    async def create_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update user in Stream Chat"""
        try:
            if not self.stream_client:
                return {
                    "success": True,
                    "message": "User created (mock mode)",
                    "user_id": user_id,
                    "mode": "mock"
                }
            
            # Create user in Stream
            user_response = self.stream_client.update_user({
                "id": user_id,
                "name": user_data.get("name", user_id),
                "role": user_data.get("role", "farmer"),
                "image": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_id}",
                **user_data
            })
            
            return {
                "success": True,
                "message": "User created successfully",
                "user_id": user_id,
                "user_data": user_response
            }
            
        except Exception as e:
            logger.error(f"User creation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def create_channel(self, channel_type: str, channel_id: str, user_id: str, channel_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create channel in Stream Chat"""
        try:
            if not self.stream_client:
                return {
                    "success": True,
                    "message": "Channel created (mock mode)",
                    "channel_id": channel_id,
                    "mode": "mock"
                }
            
            # Create channel in Stream
            channel = self.stream_client.channel(channel_type, channel_id)
            channel_response = channel.create(user_id, {
                "name": channel_data.get("name", f"Agricultural Chat {channel_id}"),
                "created_by_id": user_id,
                **channel_data
            })
            
            return {
                "success": True,
                "message": "Channel created successfully", 
                "channel_id": channel_id,
                "channel_data": channel_response
            }
            
        except Exception as e:
            logger.error(f"Channel creation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def start_ai_agent(self, channel_id: str, agent_type: str, user_id: str) -> Dict[str, Any]:
        """Start AI agent for a channel"""
        try:
            agent_key = f"{channel_id}_{agent_type}"
            
            # Check if agent already exists
            if agent_key in self.active_agents:
                agent = self.active_agents[agent_key]
                agent.last_activity = datetime.now()
                config = agent.get_config()
                
                return {
                    "success": True,
                    "message": "Agent already active",
                    "agent_id": agent.agent_id,
                    "agent_type": agent_type,
                    "agent_name": config["name"],
                    "agent_description": config["description"]
                }
            
            # Create new agent
            agent = AgricultureAIAgent(agent_type, user_id, channel_id)
            self.active_agents[agent_key] = agent
            
            config = agent.get_config()
            
            # Send welcome message to channel if Stream client is available
            if self.stream_client:
                try:
                    channel = self.stream_client.channel("messaging", channel_id)
                    await asyncio.to_thread(
                        channel.send_message,
                        {
                            "text": f"👋 Hello! I'm {config['name']}, your {config['description'].lower()}. How can I help you today?",
                            "user": {"id": agent.agent_id, "name": config["name"]},
                            "type": "agent_welcome"
                        }
                    )
                except Exception as e:
                    logger.warning(f"Failed to send welcome message: {e}")
            
            return {
                "success": True,
                "message": "Agent started successfully",
                "agent_id": agent.agent_id,
                "agent_type": agent_type,
                "agent_name": config["name"],
                "agent_description": config["description"],
                "specialties": config["specialties"]
            }
            
        except Exception as e:
            logger.error(f"Agent start error: {e}")
            return {"success": False, "error": str(e)}
    
    async def stop_ai_agent(self, channel_id: str, agent_type: str) -> Dict[str, Any]:
        """Stop AI agent for a channel"""
        try:
            agent_key = f"{channel_id}_{agent_type}"
            
            if agent_key not in self.active_agents:
                return {
                    "success": False,
                    "message": "Agent not found or already stopped"
                }
            
            agent = self.active_agents.pop(agent_key)
            config = agent.get_config()
            
            # Send goodbye message if Stream client is available
            if self.stream_client:
                try:
                    channel = self.stream_client.channel("messaging", channel_id)
                    await asyncio.to_thread(
                        channel.send_message,
                        {
                            "text": f"👋 {config['name']} has been stopped. Thank you for using our agricultural assistance!",
                            "user": {"id": agent.agent_id, "name": config["name"]},
                            "type": "agent_goodbye"
                        }
                    )
                except Exception as e:
                    logger.warning(f"Failed to send goodbye message: {e}")
            
            return {
                "success": True,
                "message": "Agent stopped successfully",
                "agent_type": agent_type,
                "agent_name": config["name"]
            }
            
        except Exception as e:
            logger.error(f"Agent stop error: {e}")
            return {"success": False, "error": str(e)}
    
    async def process_agent_message(self, channel_id: str, message: str, user_context: Optional[Dict] = None) -> Dict[str, Any]:
        """Process message with active agents"""
        try:
            # Find active agents for this channel
            channel_agents = [
                agent for agent_key, agent in self.active_agents.items()
                if agent_key.startswith(f"{channel_id}_")
            ]
            
            if not channel_agents:
                return {
                    "success": False,
                    "message": "No active agents found for this channel"
                }
            
            # Process with the first active agent (can be enhanced for multi-agent)
            agent = channel_agents[0]
            response_data = await agent.process_message(message, user_context)
            
            # Send response to Stream channel if available
            if self.stream_client and response_data.get("success"):
                try:
                    channel = self.stream_client.channel("messaging", channel_id)
                    await asyncio.to_thread(
                        channel.send_message,
                        {
                            "text": response_data["response"],
                            "user": {"id": agent.agent_id, "name": response_data["agent_name"]},
                            "type": "agent_response",
                            "agent_type": response_data["agent_type"],
                            "sources": response_data.get("sources", [])
                        }
                    )
                except Exception as e:
                    logger.warning(f"Failed to send agent response to Stream: {e}")
            
            return response_data
            
        except Exception as e:
            logger.error(f"Message processing error: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_agent_status(self, channel_id: str) -> Dict[str, Any]:
        """Get status of agents for a channel"""
        try:
            channel_agents = []
            
            for agent_key, agent in self.active_agents.items():
                if agent_key.startswith(f"{channel_id}_"):
                    config = agent.get_config()
                    channel_agents.append({
                        "agent_id": agent.agent_id,
                        "agent_type": agent.agent_type,
                        "agent_name": config["name"],
                        "description": config["description"],
                        "created_at": agent.created_at.isoformat(),
                        "last_activity": agent.last_activity.isoformat(),
                        "is_active": agent.is_active
                    })
            
            return {
                "success": True,
                "channel_id": channel_id,
                "active_agents": channel_agents,
                "agent_count": len(channel_agents)
            }
            
        except Exception as e:
            logger.error(f"Agent status error: {e}")
            return {"success": False, "error": str(e)}
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for the service"""
        try:
            stream_status = "connected" if self.stream_client else "disconnected"
            openai_status = "available" if os.getenv("OPENAI_API_KEY") else "not configured"
            
            return {
                "success": True,
                "service": "Hitesh-style Stream AI Chat",
                "stream_chat": stream_status,
                "openai": openai_status,
                "active_agents": len(self.active_agents),
                "timestamp": datetime.now().isoformat(),
                "features": [
                    "Real-time messaging with Stream Chat",
                    "AI agricultural agents with OpenAI",
                    "Agricultural knowledge base integration",
                    "Agent lifecycle management",
                    "Automatic cleanup"
                ]
            }
            
        except Exception as e:
            logger.error(f"Health check error: {e}")
            return {"success": False, "error": str(e)}

# Create service instance
hitesh_stream_chat_service = HiteshStreamChatService()