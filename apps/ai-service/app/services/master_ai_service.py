"""
Master AI Service - Advanced ChatGPT-like AI for Agricultural Platform
Handles real-time problem solving, context management, and intelligent responses
"""

import asyncio
import json
import logging
from typing import List, Dict, Any, Optional, AsyncGenerator
from datetime import datetime
import httpx
from openai import AsyncOpenAI
import os
from enum import Enum

logger = logging.getLogger(__name__)


class ConversationRole(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    FUNCTION = "function"


class AICapability(str, Enum):
    MARKET_ANALYSIS = "market_analysis"
    PRICE_PREDICTION = "price_prediction"
    QUALITY_ASSESSMENT = "quality_assessment"
    PEST_DETECTION = "pest_detection"
    WEATHER_INSIGHTS = "weather_insights"
    FINANCIAL_PLANNING = "financial_planning"
    LOGISTICS_OPTIMIZATION = "logistics_optimization"
    NEGOTIATION_SUPPORT = "negotiation_support"
    GENERAL_QUERY = "general_query"


class ConversationContext:
    """Manages conversation context and memory"""
    
    def __init__(self, user_id: str, session_id: str, max_history: int = 50):
        self.user_id = user_id
        self.session_id = session_id
        self.max_history = max_history
        self.messages: List[Dict[str, Any]] = []
        self.metadata: Dict[str, Any] = {
            "created_at": datetime.utcnow().isoformat(),
            "user_profile": {},
            "context_tags": [],
            "capabilities_used": []
        }
    
    def add_message(self, role: ConversationRole, content: str, metadata: Optional[Dict] = None):
        """Add a message to conversation history"""
        message = {
            "role": role.value,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "metadata": metadata or {}
        }
        self.messages.append(message)
        
        # Trim history if exceeds max
        if len(self.messages) > self.max_history:
            # Keep system message and recent messages
            system_msgs = [m for m in self.messages if m["role"] == "system"]
            recent_msgs = self.messages[-(self.max_history - len(system_msgs)):]
            self.messages = system_msgs + recent_msgs
    
    def get_messages_for_api(self) -> List[Dict[str, str]]:
        """Get messages formatted for OpenAI API"""
        return [{"role": m["role"], "content": m["content"]} for m in self.messages]
    
    def add_capability(self, capability: AICapability):
        """Track which capabilities have been used"""
        if capability.value not in self.metadata["capabilities_used"]:
            self.metadata["capabilities_used"].append(capability.value)


class MasterAIService:
    """
    Master AI Service - ChatGPT-like intelligence for agricultural platform
    Provides real-time problem solving with context awareness
    """
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY", "sk-test-placeholder")
        if not api_key or api_key == "sk-test-placeholder":
            print("WARNING: OPENAI_API_KEY not set. AI features will not work until you set a valid API key.")
        
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")
        self.sessions: Dict[str, ConversationContext] = {}
        self.system_prompt = self._build_system_prompt()
        
    def _build_system_prompt(self) -> str:
        """Build comprehensive system prompt for agricultural AI"""
        return """You are AgriMaster AI, an advanced agricultural intelligence assistant for the ODOP Connect platform.

Your capabilities include:
1. **Market Analysis**: Analyze market trends, demand-supply dynamics, and pricing patterns
2. **Price Prediction**: Forecast crop prices based on historical data and market conditions
4. **Quality Assessment**: Evaluate crop quality and provide grading recommendations
5. **Pest & Disease Detection**: Identify pests/diseases and suggest treatment plans
6. **Weather Insights**: Provide weather-based farming recommendations
7. **Financial Planning**: Help with budgeting, loan planning, and ROI calculations
8. **Logistics Optimization**: Optimize transportation and supply chain decisions
9. **Negotiation Support**: Assist in price negotiations and deal structuring
10. **General Agricultural Knowledge**: Answer any farming-related questions

Your personality:
- Professional yet friendly and approachable
- Data-driven but explain concepts simply
- Proactive in suggesting solutions
- Culturally aware of Indian agricultural practices
- Supportive of both farmers and buyers

Response guidelines:
- Provide actionable, specific advice
- Use data and examples when possible
- Consider local context (region, season, market conditions)
- Offer multiple options when applicable
- Be concise but comprehensive
- Use simple language, avoid jargon unless necessary
- Include relevant warnings or cautions
- Suggest follow-up actions

Always prioritize:
1. User's economic benefit
2. Sustainable farming practices
3. Food safety and quality
4. Regulatory compliance
5. Risk mitigation
"""

    async def get_or_create_session(
        self, 
        user_id: str, 
        session_id: Optional[str] = None,
        user_profile: Optional[Dict] = None
    ) -> ConversationContext:
        """Get existing session or create new one"""
        if not session_id:
            session_id = f"{user_id}_{datetime.utcnow().timestamp()}"
        
        if session_id not in self.sessions:
            context = ConversationContext(user_id, session_id)
            
            # Add system prompt
            context.add_message(ConversationRole.SYSTEM, self.system_prompt)
            
            # Add user profile context if available
            if user_profile:
                context.metadata["user_profile"] = user_profile
                profile_context = self._format_user_profile(user_profile)
                context.add_message(
                    ConversationRole.SYSTEM, 
                    f"User Profile: {profile_context}"
                )
            
            self.sessions[session_id] = context
        
        return self.sessions[session_id]
    
    def _format_user_profile(self, profile: Dict) -> str:
        """Format user profile for context"""
        parts = []
        if profile.get("role"):
            parts.append(f"Role: {profile['role']}")
        if profile.get("location"):
            parts.append(f"Location: {profile['location']}")
        if profile.get("crops"):
            parts.append(f"Crops: {', '.join(profile['crops'])}")
        if profile.get("farm_size"):
            parts.append(f"Farm Size: {profile['farm_size']} acres")
        return " | ".join(parts)
    
    def _detect_capability(self, message: str) -> AICapability:
        """Detect which capability is needed based on message"""
        message_lower = message.lower()
        
        keywords_map = {
            AICapability.MARKET_ANALYSIS: ["market", "demand", "supply", "trend", "buyer"],
            AICapability.PRICE_PREDICTION: ["price", "cost", "rate", "forecast", "predict"],
            AICapability.QUALITY_ASSESSMENT: ["quality", "grade", "standard", "certification"],
            AICapability.PEST_DETECTION: ["pest", "disease", "insect", "fungus", "infection"],
            AICapability.WEATHER_INSIGHTS: ["weather", "rain", "temperature", "climate", "season"],
            AICapability.FINANCIAL_PLANNING: ["loan", "finance", "budget", "investment", "profit"],
            AICapability.LOGISTICS_OPTIMIZATION: ["transport", "logistics", "delivery", "shipping"],
            AICapability.NEGOTIATION_SUPPORT: ["negotiate", "deal", "offer", "bargain", "contract"],
        }
        
        for capability, keywords in keywords_map.items():
            if any(keyword in message_lower for keyword in keywords):
                return capability
        
        return AICapability.GENERAL_QUERY
    
    async def _enrich_context(
        self, 
        message: str, 
        capability: AICapability,
        context: ConversationContext
    ) -> str:
        """Enrich message with relevant context data"""
        enriched_parts = [message]
        
        # Add capability-specific context
        if capability == AICapability.PRICE_PREDICTION:
            # Could fetch real-time market data
            enriched_parts.append("\n[Context: Current market conditions available]")
        
        elif capability == AICapability.WEATHER_INSIGHTS:
            # Could fetch weather data
            enriched_parts.append("\n[Context: Weather data available for analysis]")
        
        return " ".join(enriched_parts)
    
    def _get_season(self, month: int) -> str:
        """Get agricultural season based on month"""
        if month in [6, 7, 8, 9]:
            return "Kharif (Monsoon)"
        elif month in [10, 11, 12, 1, 2, 3]:
            return "Rabi (Winter)"
        else:
            return "Zaid (Summer)"
    
    async def chat(
        self,
        message: str,
        user_id: str,
        session_id: Optional[str] = None,
        user_profile: Optional[Dict] = None,
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Main chat interface - handles user messages and returns AI responses
        """
        try:
            # Get or create session
            context = await self.get_or_create_session(user_id, session_id, user_profile)
            
            # Detect capability needed
            capability = self._detect_capability(message)
            context.add_capability(capability)
            
            # Enrich message with context
            enriched_message = await self._enrich_context(message, capability, context)
            
            # Add user message to context
            context.add_message(ConversationRole.USER, enriched_message)
            
            # Get AI response
            if stream:
                return await self._stream_response(context)
            else:
                return await self._get_response(context, capability)
                
        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "message": "I apologize, but I encountered an error. Please try again."
            }
    
    async def _get_response(
        self, 
        context: ConversationContext,
        capability: AICapability
    ) -> Dict[str, Any]:
        """Get non-streaming response from AI"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=context.get_messages_for_api(),
                temperature=0.7,
                max_tokens=2000,
                top_p=0.9,
                frequency_penalty=0.3,
                presence_penalty=0.3
            )
            
            assistant_message = response.choices[0].message.content
            
            # Add assistant response to context
            context.add_message(ConversationRole.ASSISTANT, assistant_message)
            
            return {
                "success": True,
                "message": assistant_message,
                "session_id": context.session_id,
                "capability": capability.value,
                "metadata": {
                    "model": response.model,
                    "tokens_used": response.usage.total_tokens,
                    "finish_reason": response.choices[0].finish_reason
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting AI response: {str(e)}")
            raise
    
    async def _stream_response(
        self, 
        context: ConversationContext
    ) -> AsyncGenerator[str, None]:
        """Stream response from AI"""
        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=context.get_messages_for_api(),
                temperature=0.7,
                max_tokens=2000,
                stream=True
            )
            
            full_response = ""
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield content
            
            # Add complete response to context
            context.add_message(ConversationRole.ASSISTANT, full_response)
            
        except Exception as e:
            logger.error(f"Error streaming AI response: {str(e)}")
            yield f"Error: {str(e)}"
    
    async def get_suggestions(
        self,
        user_id: str,
        context_type: str,
        context_data: Dict[str, Any]
    ) -> List[str]:
        """Get AI-powered suggestions based on context"""
        try:
            prompt = f"""Based on the following context, provide 3-5 helpful suggestions or questions:

Context Type: {context_type}
Context Data: {json.dumps(context_data, indent=2)}

Provide practical, actionable suggestions that would help the user."""

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=500
            )
            
            suggestions_text = response.choices[0].message.content
            # Parse suggestions (assuming they're numbered or bulleted)
            suggestions = [
                line.strip().lstrip("0123456789.-•* ")
                for line in suggestions_text.split("\n")
                if line.strip() and len(line.strip()) > 10
            ]
            
            return suggestions[:5]
            
        except Exception as e:
            logger.error(f"Error getting suggestions: {str(e)}")
            return []
    
    async def analyze_sentiment(self, message: str) -> Dict[str, Any]:
        """Analyze sentiment and intent of user message"""
        try:
            prompt = f"""Analyze the following message and provide:
1. Sentiment (positive/neutral/negative)
2. Urgency level (low/medium/high)
3. Primary intent
4. Key topics

Message: {message}

Respond in JSON format."""

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a sentiment analysis expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=300
            )
            
            analysis_text = response.choices[0].message.content
            # Try to parse JSON response
            try:
                return json.loads(analysis_text)
            except:
                return {"raw_analysis": analysis_text}
                
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return {}
    
    def clear_session(self, session_id: str):
        """Clear a conversation session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
    
    def get_session_history(self, session_id: str) -> Optional[List[Dict]]:
        """Get conversation history for a session"""
        if session_id in self.sessions:
            return self.sessions[session_id].messages
        return None


# Global instance
master_ai_service = MasterAIService()
