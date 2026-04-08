"""
Mock Stream Chat Service for Testing
Works without API credentials
"""

import os
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import uuid

# Mock imports for testing
import jwt

# AI imports
try:
    from openai import AsyncOpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

# Agricultural knowledge
from .agricultural_knowledge import AgricultureKnowledgeBase

logger = logging.getLogger(__name__)

class MockAgricultureAgent:
    """Mock AI agent for testing without OpenAI"""
    
    def __init__(self, agent_type: str, user_id: str, channel_id: str):
        self.agent_type = agent_type
        self.user_id = user_id
        self.channel_id = channel_id
        self.agent_id = f"agent_{agent_type}_{uuid.uuid4().hex[:8]}"
        self.created_at = datetime.now()
        self.last_activity = datetime.now()
        self.knowledge_base = AgricultureKnowledgeBase()
        
        # Agent configurations
        self.agent_configs = {
            "crop_advisor": {
                "name": "Crop Advisor",
                "description": "Expert in crop selection, planting, and cultivation",
            },
            "market_analyst": {
                "name": "Market Analyst", 
                "description": "Specialist in agricultural market trends and pricing",
            },
            "pest_expert": {
                "name": "Pest & Disease Expert",
                "description": "Expert in pest control and disease management",
            },
            "soil_scientist": {
                "name": "Soil Scientist",
                "description": "Specialist in soil health and fertility management",
            },
            "general_advisor": {
                "name": "General Agricultural Advisor",
                "description": "All-round agricultural consultant",
            }
        }
    
    def get_config(self) -> Dict[str, str]:
        """Get agent configuration"""
        return self.agent_configs.get(self.agent_type, self.agent_configs["general_advisor"])
    
    async def process_message(self, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process user message and generate response"""
        try:
            self.last_activity = datetime.now()
            
            # Get agent configuration
            config = self.get_config()
            
            # Search knowledge base for relevant information
            relevant_knowledge = await self.knowledge_base.search(message, limit=3)
            
            # Generate mock response based on agent type and knowledge
            if relevant_knowledge:
                # Use knowledge base content
                best_match = relevant_knowledge[0]
                response = f"As your {config['name']}, I can help with {message.lower()}.\n\n"
                response += f"**{best_match.get('title', 'Agricultural Information')}**\n\n"
                response += f"{best_match.get('content', 'No content available')}\n\n"
                response += f"*Category: {best_match.get('category', 'general')}*"
            else:
                # Generate agent-specific response
                if self.agent_type == "crop_advisor":
                    response = f"As your Crop Advisor, I recommend considering factors like soil type, climate, and market demand when choosing crops. For specific advice about {message.lower()}, I'd need more details about your location and farming conditions."
                elif self.agent_type == "market_analyst":
                    response = f"From a market perspective regarding {message.lower()}, I suggest monitoring current price trends, seasonal demand patterns, and regional market conditions. Would you like specific market data for your area?"
                elif self.agent_type == "pest_expert":
                    response = f"For pest and disease management related to {message.lower()}, I recommend integrated pest management (IPM) approaches. Early detection and prevention are key strategies."
                elif self.agent_type == "soil_scientist":
                    response = f"Regarding soil management for {message.lower()}, proper soil testing and nutrient management are essential. I can help you understand soil requirements and improvement strategies."
                else:
                    response = f"As your General Agricultural Advisor, I can provide guidance on {message.lower()}. Agricultural success depends on many factors including soil, climate, market conditions, and proper management practices."
            
            return {
                "success": True,
                "response": response,
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

class MockStreamChatService:
    """Mock Stream Chat service for testing"""
    
    def __init__(self):
        self.active_agents: Dict[str, MockAgricultureAgent] = {}
        self.mock_channels: Dict[str, Dict] = {}
        self.mock_users: Dict[str, Dict] = {}
        self._cleanup_task = None
        
        # Don't start cleanup task during import - do it lazily
    
    def generate_user_token(self, user_id: str, expiration_time: Optional[datetime] = None) -> str:
        """Generate mock JWT token"""
        try:
            payload = {"user_id": user_id}
            
            if expiration_time:
                payload["exp"] = int(expiration_time.timestamp())
            else:
                payload["exp"] = int((datetime.now() + timedelta(hours=24)).timestamp())
            
            # Use a mock secret for testing
            token = jwt.encode(payload, "mock_secret", algorithm="HS256")
            return token
            
        except Exception as e:
            logger.error(f"Token generation error: {e}")
            raise
    
    async def create_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create mock user"""
        try:
            # Store user data
            self.mock_users[user_id] = {
                "id": user_id,
                "name": user_data.get("name", f"User {user_id}"),
                "role": user_data.get("role", "farmer"),
                **user_data
            }
            
            # Generate token
            token = self.generate_user_token(user_id)
            
            return {
                "success": True,
                "user": self.mock_users[user_id],
                "token": token
            }
            
        except Exception as e:
            logger.error(f"User creation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def create_channel(self, channel_type: str, channel_id: str, user_id: str, channel_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create mock channel"""
        try:
            self.mock_channels[channel_id] = {
                "id": channel_id,
                "type": channel_type,
                "name": channel_data.get("name", f"Agricultural Chat {channel_id}"),
                "created_by_id": user_id,
                "members": [user_id],
                **channel_data
            }
            
            return {
                "success": True,
                "channel": self.mock_channels[channel_id]
            }
            
        except Exception as e:
            logger.error(f"Channel creation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def start_ai_agent(self, channel_id: str, agent_type: str, user_id: str) -> Dict[str, Any]:
        """Start mock AI agent"""
        try:
            # Lazy initialization of cleanup task
            if self._cleanup_task is None:
                self._cleanup_task = asyncio.create_task(self._cleanup_expired_agents())
            
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
            agent = MockAgricultureAgent(agent_type, user_id, channel_id)
            self.active_agents[agent_key] = agent
            
            config = agent.get_config()
            
            return {
                "success": True,
                "message": "Agent started successfully",
                "agent_id": agent.agent_id,
                "agent_type": agent_type,
                "agent_name": config["name"]
            }
            
        except Exception as e:
            logger.error(f"Agent start error: {e}")
            return {"success": False, "error": str(e)}
    
    async def stop_ai_agent(self, channel_id: str, agent_type: str) -> Dict[str, Any]:
        """Stop mock AI agent"""
        try:
            agent_key = f"{channel_id}_{agent_type}"
            
            if agent_key in self.active_agents:
                del self.active_agents[agent_key]
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
                    logger.info(f"Cleaning up expired agent: {agent_key}")
                    del self.active_agents[agent_key]
                
                if expired_agents:
                    logger.info(f"Cleaned up {len(expired_agents)} expired agents")
                    
            except Exception as e:
                logger.error(f"Agent cleanup error: {e}")

# Global mock service instance
mock_stream_chat_service = MockStreamChatService()