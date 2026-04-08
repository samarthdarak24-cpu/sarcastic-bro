"""
GetStream AI Chat Service with Agricultural Agents
Similar to hiteshchoudhary's implementation but for agriculture
"""

import os
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import uuid

# Stream Chat imports
import jwt
import httpx
from stream_chat import StreamChat

# AI imports
import openai
from openai import AsyncOpenAI

# Agricultural knowledge
from .agricultural_knowledge import AgricultureKnowledgeBase

logger = logging.getLogger(__name__)

class AgricultureAgent:
    """Specialized AI agent for agricultural assistance"""
    
    def __init__(self, agent_type: str, user_id: str, channel_id: str):
        self.agent_type = agent_type
        self.user_id = user_id
        self.channel_id = channel_id
        self.agent_id = f"agent_{agent_type}_{uuid.uuid4().hex[:8]}"
        self.created_at = datetime.now()
        self.last_activity = datetime.now()
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.knowledge_base = AgricultureKnowledgeBase()
        
        # Agent specializations
        self.agent_configs = {
            "crop_advisor": {
                "name": "Crop Advisor",
                "description": "Expert in crop selection, planting, and cultivation",
                "system_prompt": """You are an expert agricultural crop advisor. You help farmers with:
                - Crop selection based on soil, climate, and market conditions
                - Planting schedules and techniques
                - Cultivation best practices
                - Yield optimization strategies
                Provide practical, actionable advice based on scientific agricultural knowledge."""
            },
            "market_analyst": {
                "name": "Market Analyst", 
                "description": "Specialist in agricultural market trends and pricing",
                "system_prompt": """You are an agricultural market analyst. You help with:
                - Market price analysis and trends
                - Demand forecasting
                - Best selling strategies
                - Market timing advice
                Provide data-driven insights for better market decisions."""
            },
            "pest_expert": {
                "name": "Pest & Disease Expert",
                "description": "Expert in pest control and disease management",
                "system_prompt": """You are a plant pathology and pest management expert. You help with:
                - Pest identification and control
                - Disease diagnosis and treatment
                - Integrated pest management (IPM)
                - Organic and chemical solutions
                Provide safe, effective pest and disease management advice."""
            },
            "soil_scientist": {
                "name": "Soil Scientist",
                "description": "Specialist in soil health and fertility management",
                "system_prompt": """You are a soil scientist specializing in agricultural soils. You help with:
                - Soil testing and analysis
                - Fertility management
                - Soil health improvement
                - Nutrient management plans
                Provide scientific soil management recommendations."""
            },
            "general_advisor": {
                "name": "General Agricultural Advisor",
                "description": "All-round agricultural consultant",
                "system_prompt": """You are a comprehensive agricultural advisor. You help farmers with:
                - General farming questions
                - Best practices across all areas
                - Problem-solving and troubleshooting
                - Connecting farmers to specialized resources
                Provide helpful, practical agricultural guidance."""
            }
        }
    
    def get_config(self) -> Dict[str, str]:
        """Get agent configuration"""
        return self.agent_configs.get(self.agent_type, self.agent_configs["general_advisor"])
    
    async def process_message(self, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process user message and generate AI response"""
        try:
            self.last_activity = datetime.now()
            
            # Get agent configuration
            config = self.get_config()
            
            # Search knowledge base for relevant information
            relevant_knowledge = await self.knowledge_base.search(message, limit=3)
            
            # Build context-aware prompt
            system_prompt = config["system_prompt"]
            
            if relevant_knowledge:
                knowledge_context = "\n\nRelevant Agricultural Knowledge:\n"
                for item in relevant_knowledge:
                    knowledge_context += f"- {item.get('title', '')}: {item.get('content', '')}\n"
                system_prompt += knowledge_context
            
            # Add user context if available
            if context:
                user_context = f"\n\nUser Context: {json.dumps(context, indent=2)}"
                system_prompt += user_context
            
            # Generate AI response
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            return {
                "success": True,
                "response": ai_response,
                "agent_type": self.agent_type,
                "agent_name": config["name"],
                "sources": [item.get('title', '') for item in relevant_knowledge],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Agent processing error: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "I'm experiencing technical difficulties. Please try again.",
                "agent_type": self.agent_type,
                "timestamp": datetime.now().isoformat()
            }
    
    def is_expired(self, timeout_minutes: int = 30) -> bool:
        """Check if agent has expired due to inactivity"""
        return datetime.now() - self.last_activity > timedelta(minutes=timeout_minutes)

class StreamChatService:
    """GetStream Chat service with AI agents"""
    
    def __init__(self):
        self.api_key = os.getenv("STREAM_API_KEY")
        self.api_secret = os.getenv("STREAM_API_SECRET")
        
        if not self.api_key or not self.api_secret:
            raise ValueError("Stream API credentials not configured")
        
        self.client = StreamChat(api_key=self.api_key, api_secret=self.api_secret)
        self.active_agents: Dict[str, AgricultureAgent] = {}
        
        # Start cleanup task
        asyncio.create_task(self._cleanup_expired_agents())
    
    def generate_user_token(self, user_id: str, expiration_time: Optional[datetime] = None) -> str:
        """Generate JWT token for Stream Chat user authentication"""
        try:
            payload = {"user_id": user_id}
            
            if expiration_time:
                payload["exp"] = int(expiration_time.timestamp())
            else:
                # Default 24 hour expiration
                payload["exp"] = int((datetime.now() + timedelta(hours=24)).timestamp())
            
            token = jwt.encode(payload, self.api_secret, algorithm="HS256")
            return token
            
        except Exception as e:
            logger.error(f"Token generation error: {e}")
            raise
    
    async def create_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update Stream Chat user"""
        try:
            # Prepare user data
            stream_user_data = {
                "id": user_id,
                "name": user_data.get("name", f"User {user_id}"),
                "role": user_data.get("role", "farmer"),
                **user_data
            }
            
            # Create/update user in Stream
            response = self.client.update_user(stream_user_data)
            
            # Generate token
            token = self.generate_user_token(user_id)
            
            return {
                "success": True,
                "user": response["users"][user_id],
                "token": token
            }
            
        except Exception as e:
            logger.error(f"User creation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def create_channel(self, channel_type: str, channel_id: str, user_id: str, channel_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create Stream Chat channel"""
        try:
            channel = self.client.channel(channel_type, channel_id)
            
            # Channel configuration
            channel_config = {
                "name": channel_data.get("name", f"Agricultural Chat {channel_id}"),
                "created_by_id": user_id,
                "members": [user_id],
                **channel_data
            }
            
            response = channel.create(user_id, channel_config)
            
            return {
                "success": True,
                "channel": response["channel"]
            }
            
        except Exception as e:
            logger.error(f"Channel creation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def start_ai_agent(self, channel_id: str, agent_type: str, user_id: str) -> Dict[str, Any]:
        """Start AI agent for a channel"""
        try:
            # Check if agent already exists
            agent_key = f"{channel_id}_{agent_type}"
            
            if agent_key in self.active_agents:
                agent = self.active_agents[agent_key]
                agent.last_activity = datetime.now()
                return {
                    "success": True,
                    "message": "Agent already active",
                    "agent_id": agent.agent_id,
                    "agent_type": agent_type,
                    "agent_name": agent.get_config()["name"]
                }
            
            # Create new agent
            agent = AgricultureAgent(agent_type, user_id, channel_id)
            self.active_agents[agent_key] = agent
            
            # Send welcome message to channel
            channel = self.client.channel("messaging", channel_id)
            welcome_config = agent.get_config()
            
            welcome_message = {
                "text": f"🤖 {welcome_config['name']} is now active!\n\n{welcome_config['description']}\n\nHow can I help you today?",
                "user_id": f"agent_{agent_type}",
                "type": "agent_message",
                "agent_type": agent_type
            }
            
            channel.send_message(welcome_message)
            
            return {
                "success": True,
                "message": "Agent started successfully",
                "agent_id": agent.agent_id,
                "agent_type": agent_type,
                "agent_name": welcome_config["name"]
            }
            
        except Exception as e:
            logger.error(f"Agent start error: {e}")
            return {"success": False, "error": str(e)}
    
    async def stop_ai_agent(self, channel_id: str, agent_type: str) -> Dict[str, Any]:
        """Stop AI agent for a channel"""
        try:
            agent_key = f"{channel_id}_{agent_type}"
            
            if agent_key in self.active_agents:
                agent = self.active_agents[agent_key]
                del self.active_agents[agent_key]
                
                # Send goodbye message
                channel = self.client.channel("messaging", channel_id)
                goodbye_message = {
                    "text": f"👋 {agent.get_config()['name']} has been deactivated. Thank you for using our agricultural assistance!",
                    "user_id": f"agent_{agent_type}",
                    "type": "agent_message"
                }
                
                channel.send_message(goodbye_message)
                
                return {
                    "success": True,
                    "message": "Agent stopped successfully"
                }
            else:
                return {
                    "success": False,
                    "error": "Agent not found"
                }
                
        except Exception as e:
            logger.error(f"Agent stop error: {e}")
            return {"success": False, "error": str(e)}
    
    async def process_agent_message(self, channel_id: str, message: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process message with active agents"""
        try:
            responses = []
            
            # Find active agents for this channel
            channel_agents = {k: v for k, v in self.active_agents.items() if k.startswith(channel_id)}
            
            if not channel_agents:
                return {
                    "success": False,
                    "error": "No active agents found. Please start an agent first."
                }
            
            # Process message with each active agent
            for agent_key, agent in channel_agents.items():
                response = await agent.process_message(message, user_context)
                responses.append(response)
                
                # Send response to channel if successful
                if response["success"]:
                    channel = self.client.channel("messaging", channel_id)
                    
                    agent_message = {
                        "text": response["response"],
                        "user_id": f"agent_{agent.agent_type}",
                        "type": "agent_response",
                        "agent_type": agent.agent_type,
                        "agent_name": response["agent_name"],
                        "sources": response.get("sources", [])
                    }
                    
                    channel.send_message(agent_message)
            
            return {
                "success": True,
                "responses": responses,
                "agents_count": len(responses)
            }
            
        except Exception as e:
            logger.error(f"Message processing error: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_agent_status(self, channel_id: str) -> Dict[str, Any]:
        """Get status of agents for a channel"""
        try:
            channel_agents = {k: v for k, v in self.active_agents.items() if k.startswith(channel_id)}
            
            agents_info = []
            for agent_key, agent in channel_agents.items():
                config = agent.get_config()
                agents_info.append({
                    "agent_id": agent.agent_id,
                    "agent_type": agent.agent_type,
                    "agent_name": config["name"],
                    "description": config["description"],
                    "created_at": agent.created_at.isoformat(),
                    "last_activity": agent.last_activity.isoformat(),
                    "is_active": not agent.is_expired()
                })
            
            return {
                "success": True,
                "channel_id": channel_id,
                "active_agents": len(agents_info),
                "agents": agents_info
            }
            
        except Exception as e:
            logger.error(f"Agent status error: {e}")
            return {"success": False, "error": str(e)}
    
    async def _cleanup_expired_agents(self):
        """Background task to cleanup expired agents"""
        while True:
            try:
                await asyncio.sleep(300)  # Check every 5 minutes
                
                expired_agents = []
                for agent_key, agent in self.active_agents.items():
                    if agent.is_expired():
                        expired_agents.append(agent_key)
                
                for agent_key in expired_agents:
                    agent = self.active_agents[agent_key]
                    logger.info(f"Cleaning up expired agent: {agent.agent_id}")
                    
                    # Send cleanup message to channel
                    try:
                        channel = self.client.channel("messaging", agent.channel_id)
                        cleanup_message = {
                            "text": f"🔄 {agent.get_config()['name']} has been automatically deactivated due to inactivity.",
                            "user_id": f"agent_{agent.agent_type}",
                            "type": "agent_cleanup"
                        }
                        channel.send_message(cleanup_message)
                    except:
                        pass  # Ignore channel message errors during cleanup
                    
                    del self.active_agents[agent_key]
                
                if expired_agents:
                    logger.info(f"Cleaned up {len(expired_agents)} expired agents")
                    
            except Exception as e:
                logger.error(f"Agent cleanup error: {e}")

# Global service instance
stream_chat_service = StreamChatService()