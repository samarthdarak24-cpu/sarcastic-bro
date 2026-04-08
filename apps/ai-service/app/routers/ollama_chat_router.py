"""
Ollama Chat Router
Provides intelligent agricultural chat using local Ollama LLM with streaming responses.
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import re

from app.services.ollama_service import (
    get_ollama_service, 
    OllamaService, 
    OllamaMessage, 
    StreamChunk
)
from app.services.agricultural_knowledge import (
    AgricultureKnowledgeBase
)

# Create knowledge base instance
knowledge_base = AgricultureKnowledgeBase()

def get_agricultural_knowledge() -> AgricultureKnowledgeBase:
    """Dependency to get agricultural knowledge base"""
    return knowledge_base

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ollama", tags=["Ollama Chat"])

class UserContext(BaseModel):
    """User context for personalized responses"""
    user_id: str
    role: str  # FARMER, BUYER
    location: str
    crops: Optional[List[str]] = []
    language: str = "en"  # en, hi, mr
    session_id: str

class ChatRequest(BaseModel):
    """Chat request with message and context"""
    message: str
    context: UserContext
    conversation_history: Optional[List[Dict[str, str]]] = []
    model: Optional[str] = None
    temperature: Optional[float] = None
    stream: bool = True

class ChatResponse(BaseModel):
    """Chat response"""
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = []

class LanguageDetector:
    """Simple language detection for Hindi, Marathi, and English"""
    
    @staticmethod
    def detect_language(text: str) -> str:
        """Detect language of input text"""
        # Hindi Unicode range
        hindi_pattern = re.compile(r'[\u0900-\u097F]')
        # Marathi uses same Devanagari script as Hindi
        # We'll use context clues for differentiation
        
        if hindi_pattern.search(text):
            # Check for Marathi-specific words/patterns
            marathi_words = ['आहे', 'आहेत', 'करतो', 'करते', 'मराठी', 'महाराष्ट्र']
            if any(word in text for word in marathi_words):
                return "mr"
            return "hi"
        return "en"

class AgriPromptBuilder:
    """Builds agricultural context-aware prompts"""
    
    def __init__(self, knowledge: AgriculturalKnowledge):
        self.knowledge = knowledge
        
    async def build_system_prompt(
        self, 
        user_context: UserContext,
        message: str
    ) -> str:
        """Build comprehensive system prompt with agricultural context"""
        
        # Base agricultural AI prompt
        base_prompt = """You are AgriConnect AI, an expert agricultural assistant for Indian farmers and buyers on the ODOP Connect platform.

CORE CAPABILITIES:
- Provide practical agricultural advice for Indian farming
- Help with crop selection, market prices, and farming techniques
- Support farmers with production, quality, and selling strategies
- Assist buyers with sourcing, quality assessment, and procurement
- Offer pest/disease identification and treatment solutions
- Provide weather-based farming recommendations
- Share market intelligence and price trends

COMMUNICATION STYLE:
- Be supportive, practical, and solution-focused
- Use simple, clear language appropriate for farmers
- Provide actionable advice with specific steps
- Include relevant local context and practices
- Be encouraging and positive in tone"""

        # Role-specific context
        if user_context.role == "FARMER":
            role_context = """
FARMER FOCUS:
- Help maximize crop yield and quality
- Provide market timing and pricing advice
- Suggest cost-effective farming methods
- Offer pest and disease management solutions
- Guide on post-harvest handling and storage
- Connect with potential buyers and markets
- Advise on government schemes and subsidies
- Focus on profitability and sustainability"""
        else:  # BUYER
            role_context = """
BUYER FOCUS:
- Help find reliable suppliers and quality products
- Provide market analysis and price comparisons
- Assist with bulk procurement strategies
- Guide on quality standards and verification
- Offer logistics and supply chain optimization
- Support contract negotiation and terms
- Provide seasonal availability information
- Focus on cost-effectiveness and reliability"""

        # Location-specific context
        location_context = f"\nUSER LOCATION: {user_context.location}"
        
        # Get market prices for location
        try:
            market_prices = await self.knowledge.get_market_prices(user_context.location)
            if market_prices:
                price_info = "\nCURRENT MARKET PRICES:\n"
                for price in market_prices[:5]:  # Top 5 prices
                    price_info += f"- {price.crop.title()}: ₹{price.price_modal}/kg ({price.trend})\n"
                location_context += price_info
        except Exception as e:
            logger.warning(f"Failed to get market prices: {e}")

        # Crop-specific context
        crop_context = ""
        if user_context.crops:
            crop_context = f"\nUSER'S CROPS: {', '.join(user_context.crops)}"
            
            # Add crop-specific information
            for crop in user_context.crops[:3]:  # Limit to 3 crops
                try:
                    crop_info = await self.knowledge.get_crop_info(crop)
                    if crop_info:
                        crop_context += f"\n{crop.title()} Info: {crop_info.growing_period} days, {crop_info.season} season, {crop_info.market_demand} demand"
                except Exception as e:
                    logger.warning(f"Failed to get crop info for {crop}: {e}")

        # Weather context
        weather_context = ""
        try:
            weather = await self.knowledge.get_weather_info(user_context.location)
            if weather:
                weather_context = f"\nWEATHER: {weather.conditions}, {weather.temperature_min}-{weather.temperature_max}°C, {weather.humidity}% humidity"
                if weather.advisory:
                    weather_context += f"\nADVISORY: {weather.advisory}"
        except Exception as e:
            logger.warning(f"Failed to get weather info: {e}")

        # Language context
        language_context = ""
        if user_context.language == "hi":
            language_context = "\nRESPOND IN HINDI: Use Hindi language with Devanagari script. Include English terms for technical words when helpful."
        elif user_context.language == "mr":
            language_context = "\nRESPOND IN MARATHI: Use Marathi language with Devanagari script. Include English terms for technical words when helpful."
        else:
            language_context = "\nRESPOND IN ENGLISH: Use clear, simple English suitable for Indian farmers and buyers."

        # Intent-specific context
        intent_context = self._get_intent_context(message)

        # Combine all contexts
        full_prompt = f"""{base_prompt}

{role_context}

{location_context}

{crop_context}

{weather_context}

{language_context}

{intent_context}

IMPORTANT GUIDELINES:
- Always provide practical, actionable advice
- Include specific numbers, prices, and timeframes when possible
- Mention relevant government schemes or subsidies
- Suggest next steps or follow-up actions
- Be encouraging and supportive
- If unsure about specific details, acknowledge limitations
- Focus on solutions that work in Indian agricultural context"""

        return full_prompt

    def _get_intent_context(self, message: str) -> str:
        """Get context based on message intent"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['price', 'rate', 'cost', 'भाव', 'दर', 'किंमत']):
            return "\nINTENT: Price inquiry - Provide current market rates, trends, and selling advice."
            
        elif any(word in message_lower for word in ['pest', 'disease', 'problem', 'कीड़े', 'बीमारी', 'समस्या']):
            return "\nINTENT: Pest/disease help - Identify issue and provide treatment solutions."
            
        elif any(word in message_lower for word in ['grow', 'plant', 'crop', 'उगाना', 'बोना', 'फसल']):
            return "\nINTENT: Crop guidance - Provide growing advice and best practices."
            
        elif any(word in message_lower for word in ['sell', 'buyer', 'market', 'बेचना', 'खरीदार', 'मंडी']):
            return "\nINTENT: Selling help - Connect with buyers and market opportunities."
            
        elif any(word in message_lower for word in ['weather', 'rain', 'मौसम', 'बारिश']):
            return "\nINTENT: Weather inquiry - Provide weather-based farming advice."
            
        else:
            return "\nINTENT: General agricultural assistance - Provide comprehensive help."

class ConversationManager:
    """Manages conversation history and context"""
    
    def __init__(self):
        self.conversations: Dict[str, List[Dict[str, str]]] = {}
        self.max_history = 10  # Keep last 10 messages
        
    def add_message(self, session_id: str, role: str, content: str):
        """Add message to conversation history"""
        if session_id not in self.conversations:
            self.conversations[session_id] = []
            
        self.conversations[session_id].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep only recent messages
        if len(self.conversations[session_id]) > self.max_history:
            self.conversations[session_id] = self.conversations[session_id][-self.max_history:]
            
    def get_history(self, session_id: str) -> List[Dict[str, str]]:
        """Get conversation history for session"""
        return self.conversations.get(session_id, [])
        
    def clear_history(self, session_id: str):
        """Clear conversation history for session"""
        if session_id in self.conversations:
            del self.conversations[session_id]

# Global instances
conversation_manager = ConversationManager()

@router.get("/health")
async def health_check(
    ollama_service: OllamaService = Depends(get_ollama_service)
):
    """Check Ollama service health"""
    is_healthy = await ollama_service.health_check()
    available_models = await ollama_service.get_available_models()
    
    return {
        "status": "healthy" if is_healthy else "unhealthy",
        "ollama_available": is_healthy,
        "available_models": available_models,
        "service": "Ollama Chat Service"
    }

@router.get("/models")
async def get_models(
    ollama_service: OllamaService = Depends(get_ollama_service)
):
    """Get available Ollama models"""
    models = await ollama_service.get_available_models()
    return {
        "success": True,
        "models": models
    }

@router.post("/chat/stream")
async def chat_stream(
    request: ChatRequest,
    ollama_service: OllamaService = Depends(get_ollama_service),
    knowledge: AgricultureKnowledgeBase = Depends(get_agricultural_knowledge)
):
    """Stream chat responses from Ollama with agricultural context"""
    
    async def generate_response():
        try:
            # Detect language if not specified
            if not request.context.language or request.context.language == "auto":
                detected_lang = LanguageDetector.detect_language(request.message)
                request.context.language = detected_lang
            
            # Build agricultural context prompt
            prompt_builder = AgriPromptBuilder(knowledge)
            system_prompt = await prompt_builder.build_system_prompt(
                request.context, 
                request.message
            )
            
            # Prepare conversation messages
            messages = [OllamaMessage(role="system", content=system_prompt)]
            
            # Add conversation history
            history = conversation_manager.get_history(request.context.session_id)
            for msg in history[-5:]:  # Last 5 messages for context
                messages.append(OllamaMessage(
                    role=msg["role"],
                    content=msg["content"]
                ))
            
            # Add current user message
            messages.append(OllamaMessage(role="user", content=request.message))
            
            # Stream response from Ollama
            full_response = ""
            async for chunk in ollama_service.chat_stream(
                messages=messages,
                model=request.model,
                temperature=request.temperature
            ):
                if chunk.type == "content":
                    full_response += chunk.content or ""
                    
                # Send chunk to client
                chunk_data = {
                    "type": chunk.type,
                    "content": chunk.content,
                    "metadata": chunk.metadata,
                    "error": chunk.error,
                    "timestamp": chunk.timestamp
                }
                yield f"data: {json.dumps(chunk_data)}\n\n"
                
                if chunk.type == "done":
                    # Save conversation
                    conversation_manager.add_message(
                        request.context.session_id, 
                        "user", 
                        request.message
                    )
                    conversation_manager.add_message(
                        request.context.session_id,
                        "assistant", 
                        full_response
                    )
                    
                    # Generate suggestions
                    suggestions = await _generate_suggestions(
                        request.context.role,
                        request.message,
                        knowledge
                    )
                    
                    # Send final metadata with suggestions
                    final_data = {
                        "type": "suggestions",
                        "suggestions": suggestions,
                        "metadata": {
                            "language": request.context.language,
                            "response_length": len(full_response),
                            "conversation_length": len(history) + 2
                        }
                    }
                    yield f"data: {json.dumps(final_data)}\n\n"
                    break
                    
                elif chunk.type == "error":
                    break
                    
        except Exception as e:
            logger.error(f"Chat stream error: {e}")
            error_data = {
                "type": "error",
                "error": "INTERNAL_ERROR",
                "metadata": {"message": str(e)}
            }
            yield f"data: {json.dumps(error_data)}\n\n"
    
    return StreamingResponse(
        generate_response(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream"
        }
    )

@router.post("/chat/complete", response_model=ChatResponse)
async def chat_complete(
    request: ChatRequest,
    ollama_service: OllamaService = Depends(get_ollama_service),
    knowledge: AgricultureKnowledgeBase = Depends(get_agricultural_knowledge)
):
    """Get complete chat response (non-streaming)"""
    
    try:
        # Detect language if not specified
        if not request.context.language or request.context.language == "auto":
            detected_lang = LanguageDetector.detect_language(request.message)
            request.context.language = detected_lang
        
        # Build agricultural context prompt
        prompt_builder = AgriPromptBuilder(knowledge)
        system_prompt = await prompt_builder.build_system_prompt(
            request.context, 
            request.message
        )
        
        # Prepare conversation messages
        messages = [OllamaMessage(role="system", content=system_prompt)]
        
        # Add conversation history
        history = conversation_manager.get_history(request.context.session_id)
        for msg in history[-5:]:  # Last 5 messages for context
            messages.append(OllamaMessage(
                role=msg["role"],
                content=msg["content"]
            ))
        
        # Add current user message
        messages.append(OllamaMessage(role="user", content=request.message))
        
        # Get complete response
        result = await ollama_service.chat_complete(
            messages=messages,
            model=request.model,
            temperature=request.temperature
        )
        
        if result["success"]:
            # Save conversation
            conversation_manager.add_message(
                request.context.session_id, 
                "user", 
                request.message
            )
            conversation_manager.add_message(
                request.context.session_id,
                "assistant", 
                result["response"]
            )
            
            # Generate suggestions
            suggestions = await _generate_suggestions(
                request.context.role,
                request.message,
                knowledge
            )
            
            return ChatResponse(
                success=True,
                response=result["response"],
                metadata={
                    **result["metadata"],
                    "language": request.context.language,
                    "conversation_length": len(history) + 2
                },
                suggestions=suggestions
            )
        else:
            return ChatResponse(
                success=False,
                error=result["error"],
                metadata=result["metadata"]
            )
            
    except Exception as e:
        logger.error(f"Chat complete error: {e}")
        return ChatResponse(
            success=False,
            error="INTERNAL_ERROR",
            metadata={"message": str(e)}
        )

@router.delete("/conversation/{session_id}")
async def clear_conversation(session_id: str):
    """Clear conversation history for a session"""
    conversation_manager.clear_history(session_id)
    return {"success": True, "message": "Conversation cleared"}

@router.get("/conversation/{session_id}")
async def get_conversation(session_id: str):
    """Get conversation history for a session"""
    history = conversation_manager.get_history(session_id)
    return {
        "success": True,
        "session_id": session_id,
        "history": history,
        "message_count": len(history)
    }

async def _generate_suggestions(
    user_role: str, 
    message: str, 
    knowledge: AgriculturalKnowledge
) -> List[str]:
    """Generate contextual suggestions based on user role and message"""
    
    suggestions = []
    message_lower = message.lower()
    
    if user_role == "FARMER":
        if any(word in message_lower for word in ['price', 'sell', 'भाव', 'बेचना']):
            suggestions = [
                "Show me current market trends",
                "Find buyers for my crops",
                "When is the best time to sell?",
                "How to improve crop quality?"
            ]
        elif any(word in message_lower for word in ['pest', 'disease', 'कीड़े', 'बीमारी']):
            suggestions = [
                "Show organic treatment options",
                "Identify pest from photo",
                "Prevention methods for next season",
                "Cost-effective treatments"
            ]
        else:
            suggestions = [
                "What crops should I grow next season?",
                "Current market prices in my area",
                "Weather forecast for farming",
                "Government schemes for farmers"
            ]
    else:  # BUYER
        if any(word in message_lower for word in ['supplier', 'quality', 'buy']):
            suggestions = [
                "Find reliable suppliers nearby",
                "Compare prices across regions",
                "Quality standards and grading",
                "Bulk purchase opportunities"
            ]
        else:
            suggestions = [
                "Seasonal availability calendar",
                "Price comparison across markets",
                "Quality verification methods",
                "Logistics and transportation"
            ]
    
    return suggestions[:4]  # Return top 4 suggestions