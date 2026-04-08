"""
LLM Service - FREE Unlimited AI Integration
Connects to FREE AI providers for unlimited intelligent responses
"""

import os
import asyncio
import logging
from typing import List, Dict, Any, Optional, AsyncGenerator
from datetime import datetime
import json
import aiohttp
from groq import AsyncGroq
import openai
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)


class LLMService:
    """
    FREE LLM Service with unlimited usage
    Supports Groq (free), Hugging Face (free), and local models
    """
    
    def __init__(self):
        self.groq_client = None
        self.openai_client = None
        self.hf_client = None
        
        # Provider configuration
        self.provider = os.getenv("LLM_PROVIDER", "ollama")  # ollama, groq, huggingface, openai
        self.model = os.getenv("LLM_MODEL", "qwen2.5:latest")
        
        # API Keys
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY") 
        self.hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
        
        # Base URLs
        self.groq_base_url = "https://api.groq.com/openai/v1"
        self.hf_base_url = "https://api-inference.huggingface.co/models"
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        
        # Initialize clients
        self._initialize_clients()
        
        # Enhanced system prompt for comprehensive platform assistance
        self.system_prompt = """You are AgriMaster AI, the intelligent assistant for an advanced agricultural marketplace platform. You have comprehensive knowledge about:

🌾 AGRICULTURAL EXPERTISE:
- Crop cultivation, planning, and management
- Soil health, fertilizers, and nutrition  
- Pest and disease identification and treatment
- Weather-based farming decisions
- Organic and sustainable farming practices
- Modern agricultural technology and equipment

💰 PLATFORM FEATURES & ASSISTANCE:
- Order management and tracking
- Payment processing and methods
- Product listings and marketplace navigation
- Buyer-seller connections and negotiations
- Account management and settings
- Platform tutorials and feature explanations

📊 BUSINESS & FINANCIAL:
- Farm financial planning and profitability
- Market analysis and pricing strategies
- Government schemes and subsidies
- Export opportunities and regulations
- Investment advice and ROI calculations
- Risk management and insurance

🔧 TECHNICAL SUPPORT:
- Platform navigation and usage
- Troubleshooting common issues
- Feature explanations and tutorials
- Account setup and management
- Mobile app guidance
- Integration with other tools

💳 PAYMENTS & TRANSACTIONS:
- Payment method setup and usage
- Transaction history and tracking
- Refund and dispute resolution
- Security and fraud prevention
- Digital wallet integration
- Bank transfer procedures

📦 ORDER MANAGEMENT:
- Creating and managing orders
- Order status tracking and updates
- Delivery and logistics coordination
- Quality assurance and returns
- Bulk order processing
- Tender and bidding processes

You can answer ANY question about:
- Platform functionality and features
- Agricultural practices and advice
- Market data and business strategies
- Technical support and troubleshooting
- General knowledge and information
- Step-by-step guidance for any task

Always provide detailed, practical, and actionable responses. Be conversational, helpful, and professional. When helping with platform features, offer to guide users through processes step-by-step."""

    def _initialize_clients(self):
        """Initialize FREE AI clients"""
        try:
            # Initialize Groq (FREE - Primary choice)
            if self.groq_api_key:
                self.groq_client = AsyncGroq(api_key=self.groq_api_key)
                logger.info("✅ Groq client initialized (FREE unlimited)")
            
            # Initialize OpenAI (if available)
            if self.openai_api_key:
                self.openai_client = AsyncOpenAI(api_key=self.openai_api_key)
                logger.info("✅ OpenAI client initialized")
            
            # Hugging Face will be initialized per request
            if self.hf_api_key:
                logger.info("✅ Hugging Face API key available (FREE unlimited)")
                
        except Exception as e:
            logger.error(f"Failed to initialize LLM clients: {e}")

    async def chat_completion(
        self,
        message: str,
        conversation_history: List[Dict] = None,
        user_context: Dict = None,
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Get chat completion from FREE LLM providers
        """
        try:
            # Prepare messages
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add conversation history
            if conversation_history:
                for msg in conversation_history[-8:]:  # Last 8 messages to save tokens
                    if msg.get("role") in ["user", "assistant"]:
                        messages.append({
                            "role": msg["role"],
                            "content": msg["content"]
                        })
            
            # Add user context
            if user_context:
                context_info = self._format_user_context(user_context)
                if context_info:
                    messages.append({
                        "role": "system", 
                        "content": f"User context: {context_info}"
                    })
            
            # Add current message
            messages.append({"role": "user", "content": message})

            # Try providers in order of preference (all FREE)
            providers = [
                ("groq", self._groq_completion),
                ("huggingface", self._huggingface_completion),
                ("ollama", self._ollama_completion),
                ("fallback", self._fallback_response)
            ]
            
            for provider_name, provider_func in providers:
                try:
                    if stream and provider_name == "groq":
                        return await self._groq_stream_completion(messages)
                    else:
                        result = await provider_func(messages)
                        if result.get("success"):
                            result["provider"] = provider_name
                            return result
                except Exception as e:
                    logger.warning(f"{provider_name} failed: {e}")
                    continue
            
            # If all fail, use fallback
            return await self._fallback_response(message)

        except Exception as e:
            logger.error(f"LLM completion error: {e}")
            return await self._fallback_response(message)

    async def _groq_completion(self, messages: List[Dict]) -> Dict[str, Any]:
        """FREE Groq completion (fastest and unlimited)"""
        if not self.groq_client:
            raise Exception("Groq client not available")
        
        try:
            response = await self.groq_client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=1000,
                temperature=0.7,
                top_p=0.9
            )
            
            content = response.choices[0].message.content
            
            return {
                "success": True,
                "response": content,
                "model": self.model,
                "provider": "groq",
                "cost": "FREE",
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
                    "completion_tokens": response.usage.completion_tokens if response.usage else 0,
                    "total_tokens": response.usage.total_tokens if response.usage else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Groq completion error: {e}")
            raise

    async def _groq_stream_completion(self, messages: List[Dict]) -> AsyncGenerator[Dict[str, Any], None]:
        """FREE Groq streaming completion"""
        if not self.groq_client:
            raise Exception("Groq client not available")
        
        try:
            stream = await self.groq_client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=1000,
                temperature=0.7,
                top_p=0.9,
                stream=True
            )
            
            full_response = ""
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield {
                        "type": "content",
                        "content": content,
                        "full_response": full_response
                    }
            
            yield {
                "type": "done",
                "response": full_response,
                "model": self.model,
                "provider": "groq",
                "cost": "FREE"
            }
            
        except Exception as e:
            logger.error(f"Groq stream error: {e}")
            yield {
                "type": "error",
                "error": str(e)
            }

    async def _huggingface_completion(self, messages: List[Dict]) -> Dict[str, Any]:
        """FREE Hugging Face completion"""
        if not self.hf_api_key:
            raise Exception("Hugging Face API key not available")
        
        try:
            # Use a good free model
            model = "microsoft/DialoGPT-large"  # or "facebook/blenderbot-400M-distill"
            url = f"{self.hf_base_url}/{model}"
            
            # Convert messages to single prompt
            prompt = self._messages_to_prompt(messages)
            
            headers = {
                "Authorization": f"Bearer {self.hf_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 500,
                    "temperature": 0.7,
                    "do_sample": True
                }
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=headers, json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        if isinstance(result, list) and len(result) > 0:
                            content = result[0].get("generated_text", "").replace(prompt, "").strip()
                        else:
                            content = str(result)
                        
                        return {
                            "success": True,
                            "response": content,
                            "model": model,
                            "provider": "huggingface",
                            "cost": "FREE"
                        }
                    else:
                        raise Exception(f"HF API error: {response.status}")
                        
        except Exception as e:
            logger.error(f"Hugging Face completion error: {e}")
            raise

    async def _ollama_completion(self, messages: List[Dict]) -> Dict[str, Any]:
        """FREE Local Ollama completion"""
        try:
            url = f"{self.ollama_base_url}/api/chat"
            
            payload = {
                "model": "qwen2.5:latest",  # Use your installed model
                "messages": messages,
                "stream": False
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        content = result.get("message", {}).get("content", "")
                        
                        return {
                            "success": True,
                            "response": content,
                            "model": "qwen2.5:latest",
                            "provider": "ollama",
                            "cost": "FREE"
                        }
                    else:
                        raise Exception(f"Ollama error: {response.status}")
                        
        except Exception as e:
            logger.error(f"Ollama completion error: {e}")
            raise

    def _messages_to_prompt(self, messages: List[Dict]) -> str:
        """Convert messages to single prompt for simple models"""
        prompt_parts = []
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            
            if role == "system":
                prompt_parts.append(f"System: {content}")
            elif role == "user":
                prompt_parts.append(f"User: {content}")
            elif role == "assistant":
                prompt_parts.append(f"Assistant: {content}")
        
        prompt_parts.append("Assistant:")
        return "\n".join(prompt_parts)

    def _format_user_context(self, user_context: Dict) -> str:
        """Format user context for the LLM"""
        context_parts = []
        
        if user_context.get("name"):
            context_parts.append(f"User name: {user_context['name']}")
        
        if user_context.get("role"):
            context_parts.append(f"Role: {user_context['role']}")
        
        if user_context.get("location"):
            context_parts.append(f"Location: {user_context['location']}")
        
        if user_context.get("crops"):
            crops = user_context["crops"]
            if isinstance(crops, list) and crops:
                context_parts.append(f"Crops: {', '.join(crops)}")
        
        return "; ".join(context_parts) if context_parts else ""

    async def _fallback_response(self, message: str) -> Dict[str, Any]:
        """Enhanced fallback response when all LLMs fail"""
        message_lower = message.lower()
        
        # Smart pattern matching for common queries
        if any(word in message_lower for word in ["payment", "pay", "money", "transaction"]):
            response = """💳 **Payment Help**

I can help you with payments on our platform:

**Available Payment Methods:**
• UPI (PhonePe, Google Pay, Paytm)
• Net Banking
• Debit/Credit Cards
• Digital Wallets

**How to Make Payment:**
1. Go to your order/cart
2. Click "Proceed to Payment"
3. Select payment method
4. Enter details and confirm
5. Payment confirmation will be sent

**Payment Issues?**
• Check internet connection
• Verify payment details
• Contact support if payment fails
• Refunds processed in 3-5 days

Need help with a specific payment issue?"""

        elif any(word in message_lower for word in ["order", "track", "delivery", "status"]):
            response = """📦 **Order Management**

I can help you with orders:

**Track Your Order:**
• Go to "My Orders" section
• Click on order ID for details
• Real-time tracking available
• SMS/email updates sent

**Order Status Meanings:**
• Confirmed: Order received
• Processing: Being prepared
• Shipped: On the way
• Delivered: Completed

**Order Issues:**
• Cancellation within 24 hours
• Return/refund policy applies
• Quality issues reported
• Contact seller directly

What specific order help do you need?"""

        elif any(word in message_lower for word in ["price", "market", "rate", "cost"]):
            response = """💰 **Market Prices & Information**

Current market insights:

**Today's Rates:**
• Tomatoes: ₹40-50/kg (Rising)
• Onions: ₹25-35/kg (Stable)  
• Potatoes: ₹20-30/kg (Declining)
• Wheat: ₹22-25/kg (Stable)

**Price Factors:**
• Seasonal demand
• Weather conditions
• Transportation costs
• Quality grades

**Get Better Prices:**
• Compare multiple buyers
• Improve quality grading
• Time your sales right
• Join farmer groups

Need specific crop price information?"""

        else:
            response = """🤖 **AgriMaster AI Assistant**

I'm here to help with your agricultural marketplace needs!

**I can assist with:**
• 💳 Payments and transactions
• 📦 Orders and delivery tracking
• 💰 Market prices and trends
• 🌾 Farming advice and tips
• 🔧 Platform features and navigation
• 📞 Technical support

**Popular Questions:**
• "How do I track my order?"
• "What payment methods are available?"
• "Show me current market prices"
• "Help me list my products"

What would you like help with today?"""

        return {
            "success": True,
            "response": response,
            "model": "fallback",
            "provider": "local",
            "cost": "FREE"
        }

    def get_suggestions(self, context: str = "general") -> List[str]:
        """Get contextual suggestions"""
        suggestions = {
            "general": [
                "How do I make a payment?",
                "Track my recent orders",
                "Current market prices",
                "Help me sell my crops",
                "Platform tutorial",
                "Contact support"
            ],
            "payment": [
                "Payment methods available",
                "How to add payment method",
                "Payment failed - what to do?",
                "Refund status check"
            ],
            "orders": [
                "Track my order",
                "Cancel an order",
                "Return/refund policy",
                "Order history"
            ],
            "farming": [
                "Best crops for this season",
                "Market price trends",
                "Quality improvement tips",
                "Find buyers for my crops"
            ]
        }
        
        return suggestions.get(context, suggestions["general"])

    async def health_check(self) -> Dict[str, Any]:
        """Check all FREE LLM services health"""
        health_status = {
            "status": "healthy",
            "providers": {},
            "primary_provider": self.provider
        }
        
        # Check Groq
        if self.groq_client:
            try:
                test_response = await self.groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant",  # Fastest free model
                    messages=[{"role": "user", "content": "Hi"}],
                    max_tokens=5
                )
                health_status["providers"]["groq"] = {
                    "status": "healthy",
                    "model": "llama-3.1-8b-instant",
                    "cost": "FREE"
                }
            except Exception as e:
                health_status["providers"]["groq"] = {
                    "status": "error",
                    "error": str(e)
                }
        
        # Check Hugging Face
        if self.hf_api_key:
            health_status["providers"]["huggingface"] = {
                "status": "available",
                "cost": "FREE"
            }
        
        # Check Ollama
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.ollama_base_url}/api/tags") as response:
                    if response.status == 200:
                        health_status["providers"]["ollama"] = {
                            "status": "healthy",
                            "cost": "FREE"
                        }
        except:
            health_status["providers"]["ollama"] = {
                "status": "unavailable"
            }
        
        return health_status


# Global instance
llm_service = LLMService()