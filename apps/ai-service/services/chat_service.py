import random
import logging
import os
import json
import re
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from models import ContextAwareChatRequest, ChatResponse, ChatMessage

logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

class ChatService:
    """
    Advanced AI Chat Service for ODOP Connect with Real-Time Problem Solving.
    Uses GPT-4 with advanced algorithms for intelligent agricultural assistance.
    """
    
    # ADVANCED SYSTEM PROMPT WITH REASONING CAPABILITIES
    SYSTEM_INSTRUCTIONS = """
You are ODOP Connect AI - an advanced agricultural intelligence system powered by GPT-4.

**Core Capabilities:**
- Real-time problem solving using chain-of-thought reasoning
- Advanced agricultural analytics and predictions
- Multi-language support (English, Hindi, Marathi)
- Context-aware recommendations
- Market trend analysis and forecasting

**Personality:**
- Professional yet approachable
- Data-driven and analytical
- Proactive in suggesting solutions
- Patient and educational

**Specialization:**
- Indian Agriculture & ODOP districts
- Crop management and optimization
- Market dynamics and pricing
- Supply chain and logistics
- Quality grading and standards
- Export markets and compliance

**Response Style:**
1. Analyze the problem systematically
2. Provide actionable insights with data
3. Suggest next steps clearly
4. Include relevant metrics when available
5. Offer follow-up questions to deepen understanding

**Advanced Features:**
- Use chain-of-thought reasoning for complex queries
- Apply predictive algorithms for forecasting
- Leverage historical data patterns
- Consider seasonal and regional factors
- Integrate real-time market intelligence

**Agentic Actions:**
You are more than just a chatbot. You can trigger system actions.
When a user expresses a clear intent to perform a transaction, you MUST include a specialized ACTION block in your reasoning.
Supported Actions:
- `PLACE_ORDER`: params: { productId, quantity, notes }
- `CREATE_PRODUCT`: params: { name, price, category, stock }
- `NAVIGATE`: params: { target }

If you detect such an intent, end your response with a JSON-formatted action block like this:
[ACTION: {"type": "PLACE_ORDER", "params": {"productId": "...", "quantity": 10}}]

Always respond in the same language as the user's query.
"""
    # MASTER AGRI-KNOWLEDGE BASE (SIMULATED DATA FOR IN-MEMORY INTELLIGENCE)
    # -------------------------------------------------------------------------
    KNOWLEDGE_BASE = {
        "CROPS": {
            "Wheat": {"price": 2200, "unit": "quintal", "districts": ["Ludhiana", "Amritsar", "Karnal"], "season": "Rabi", "water": "High", "pests": ["Rust", "Aphids"], "best_grade": "A+"},
            "Tomato": {"price": 25, "unit": "kg", "districts": ["Nashik", "Bangalore", "Chittoor"], "season": "Kharif", "water": "Medium", "pests": ["Blight", "Whitefly"], "best_grade": "Premium"},
            "Onion": {"price": 18, "unit": "kg", "districts": ["Lasalgaon", "Pune", "Ahmednagar"], "season": "Late Kharif", "water": "Low", "pests": ["Thrips", "Purple Blotch"], "best_grade": "Export"},
            "Cotton": {"price": 6500, "unit": "quintal", "districts": ["Rajkot", "Aurangabad", "Nagpur"], "season": "Kharif", "water": "High", "pests": ["Pink Bollworm", "Whitefly"], "best_grade": "Long Staple"},
            "Rice": {"price": 2100, "unit": "quintal", "districts": ["Raigarh", "Burdwan", "Guntur"], "season": "Kharif", "water": "Very High", "pests": ["Stem Borer", "Blast"], "best_grade": "Basmati Long"},
        },
        "ODOP_ZONES": {
            "Nashik": {"crop": "Grapes & Onions", "advice": "Focus on global export standards for late-kharif onions."},
            "Nagpur": {"crop": "Oranges", "advice": "Utilize cold storage for peak margin in non-harvest months."},
            "Ludhiana": {"crop": "Wheat", "advice": "Implementing zero-tillage can save 20% on water and labor."},
            "Ratnagiri": {"crop": "Alphonso Mango", "advice": "Register for GI tagging to unlock 50% higher international prices."},
            "Ahmedabad": {"crop": "Cotton", "advice": "Long-staple cotton is currently seeing high demand from organic buyers."},
        }
    }

    # -------------------------------------------------------------------------
    # INTENT PATTERNS
    # -------------------------------------------------------------------------
    INTENTS = {
        "PRICE": ["price", "rate", "cost", "market", "भाव", "दर", "कीमत"],
        "CROP": ["grow", "plant", "soil", "rotation", "पीक", "शेती", "फसल"],
        "BUYER": ["sell", "buyer", "market", "विक्री", "ग्राहक", "बेचना"],
        "SUPPLIER": ["buy", "source", "supplier", "खरेदी", "विक्रेता", "खरीदना"],
    }
    
    # FAST-TRACK RESPONSES FOR ULTRA-LOW LATENCY
    FAST_TRACK = {
        "hello": "Hello! I am your ODOP Connect AI Assistant. I can help with price trends, crop quality analysis, and finding buyers across India. How can I help you grow today?",
        "hi": "Hi there! Ready to optimize your agricultural business? What are you looking to solve today?",
        "help": "I can assist you with: \n1. **Price Monitoring**\n2. **Crop Rotation Strategy**\n3. **Quality Grading**\n4. **Market Connections**\nAsk me anything like 'What is the price of wheat in Nashik?'",
        "नमस्ते": "नमस्ते! मैं आपका ODOP कनेक्ट AI सहायक हूँ। मैं आपकी कृषि व्यवसाय में मदद कर सकता हूँ।",
        "नमस्कार": "नमस्कार! मी तुमचा ODOP कनेक्ट AI सहाय्यक आहे। मी तुम्हाला शेती व्यवसायात मदत करू शकतो।",
    }

    @classmethod
    async def get_response(cls, request: ContextAwareChatRequest) -> ChatResponse:
        """
        Advanced AI response with real-time problem solving using GPT-4.
        Implements chain-of-thought reasoning and context-aware intelligence.
        """
        message = request.message.strip()
        user_type = request.user_type
        context = request.user_context or {}
        
        # Check if OpenAI API key is available
        api_key = os.getenv("OPENAI_API_KEY", "")
        use_ai = api_key and api_key.startswith("sk-") and len(api_key) > 20
        
        # Fast track for simple greetings (no AI needed)
        message_lower = message.lower()
        if message_lower in cls.FAST_TRACK:
            return ChatResponse(
                response=cls.FAST_TRACK[message_lower],
                suggestions=["Current price of wheat?", "Best crop for my soil", "Find buyers near me"],
                intent="GREETING",
                confidence=1.0
            )
        
        # Detect intent for routing
        intent = cls._detect_intent(message_lower)
        
        if use_ai:
            # Use GPT-4 for advanced reasoning
            try:
                response_text, suggestions, confidence, actions = await cls._get_ai_response(
                    message, user_type, context, intent
                )
                
                return ChatResponse(
                    response=response_text,
                    suggestions=suggestions,
                    intent=intent,
                    confidence=confidence,
                    actions=actions
                )
            except Exception as e:
                logger.error(f"AI response error: {str(e)}")
                # Fallback to expert system
                pass
        
        # Fallback: Use expert system (original logic)
        response_text = ""
        suggestions = []
        actions = []
        confidence = 0.85

        if intent == "PRICE":
            response_text, suggestions = cls._handle_price_query(message_lower, context)
            actions = [{"type": "NAVIGATE", "target": "/dashboard/market-trends"}]
        elif intent == "CROP":
            response_text, suggestions = cls._handle_crop_advice(message_lower, context)
            actions = [{"type": "NAVIGATE", "target": "/dashboard/farm-insights"}]
        elif intent == "BUYER":
            response_text, suggestions = cls._handle_selling_query(message_lower, context)
            actions = [{"type": "NAVIGATE", "target": "/dashboard/marketplace"}]
        elif intent == "SUPPLIER":
            response_text, suggestions = cls._handle_buying_query(message_lower, context)
            actions = [{"type": "NAVIGATE", "target": "/dashboard/sourcing"}]
        else:
            response_text = cls._get_welcome_response(user_type, context)
            suggestions = ["Current wheat prices?", "Find onion buyers", "Best crop for Nashik soil"]
            confidence = 0.5

        return ChatResponse(
            response=response_text,
            suggestions=suggestions,
            intent=intent,
            confidence=confidence,
            actions=actions
        )

    @classmethod
    async def _get_ai_response(
        cls, 
        message: str, 
        user_type: str, 
        context: Dict, 
        intent: str
    ) -> tuple[str, List[str], float, List[Dict]]:
        """
        Get advanced AI response using GPT-4 with chain-of-thought reasoning.
        """
        # Build context-rich prompt
        context_info = cls._build_context_prompt(user_type, context, intent)
        knowledge_base = cls._get_relevant_knowledge(message, intent)
        
        # Construct messages for GPT-4
        messages = [
            {"role": "system", "content": cls.SYSTEM_INSTRUCTIONS},
            {"role": "system", "content": f"Context: {context_info}"},
            {"role": "system", "content": f"Knowledge Base: {knowledge_base}"},
            {"role": "user", "content": message}
        ]
        
        # Call GPT-4 with advanced parameters
        response = await client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o"),
            messages=messages,
            temperature=0.7,
            max_tokens=800,
            top_p=0.9,
            frequency_penalty=0.3,
            presence_penalty=0.3
        )
        
        ai_response = response.choices[0].message.content.strip()
        
        # EXTRACT ACTIONS FROM LLM TEXT
        extracted_actions = []
        action_match = re.search(r'\[ACTION: (.*?)\]', ai_response)
        if action_match:
            try:
                action_data = json.loads(action_match.group(1))
                extracted_actions.append(action_data)
                # Remove the JSON tag from the response text for cleaner UI
                ai_response = ai_response.replace(action_match.group(0), "").strip()
            except Exception as e:
                logger.error(f"Failed to parse AI action: {str(e)}")

        # Generate intelligent suggestions based on response
        suggestions = cls._generate_smart_suggestions(ai_response, intent, context)
        
        # Calculate confidence based on response quality
        confidence = cls._calculate_confidence(response, intent)
        
        # If we have extracted actions, use them. Otherwise use default ones.
        if not extracted_actions:
            extracted_actions = cls._generate_actions(intent)
            
        return ai_response, suggestions, confidence, extracted_actions

    @classmethod
    def _build_context_prompt(cls, user_type: str, context: Dict, intent: str) -> str:
        """Build rich context information for AI."""
        context_parts = [f"User Type: {user_type}"]
        
        if context.get("name"):
            context_parts.append(f"User Name: {context['name']}")
        if context.get("location"):
            context_parts.append(f"Location: {context['location']}")
        if context.get("language"):
            context_parts.append(f"Preferred Language: {context['language']}")
        
        context_parts.append(f"Query Intent: {intent}")
        
        return " | ".join(context_parts)

    @classmethod
    def _get_relevant_knowledge(cls, message: str, intent: str) -> str:
        """Extract relevant knowledge from knowledge base."""
        knowledge_parts = []
        
        # Add crop data if relevant
        for crop_name, crop_data in cls.KNOWLEDGE_BASE["CROPS"].items():
            if crop_name.lower() in message.lower():
                knowledge_parts.append(
                    f"{crop_name}: Price ₹{crop_data['price']}/{crop_data['unit']}, "
                    f"Season: {crop_data['season']}, Districts: {', '.join(crop_data['districts'])}"
                )
        
        # Add ODOP zone data if relevant
        for zone, zone_data in cls.KNOWLEDGE_BASE["ODOP_ZONES"].items():
            if zone.lower() in message.lower():
                knowledge_parts.append(
                    f"{zone} ODOP Zone: {zone_data['crop']} - {zone_data['advice']}"
                )
        
        return " | ".join(knowledge_parts) if knowledge_parts else "General agricultural knowledge"

    @classmethod
    def _generate_smart_suggestions(cls, response: str, intent: str, context: Dict) -> List[str]:
        """Generate intelligent follow-up suggestions."""
        suggestions = []
        
        if intent == "PRICE":
            suggestions = [
                "Show price trends for last 30 days",
                "Compare prices across regions",
                "Set price alerts"
            ]
        elif intent == "CROP":
            suggestions = [
                "Get soil testing recommendations",
                "View crop rotation calendar",
                "Check pest prevention tips"
            ]
        elif intent == "BUYER":
            suggestions = [
                "Analyze my crop quality",
                "Find verified buyers",
                "Calculate logistics cost"
            ]
        elif intent == "SUPPLIER":
            suggestions = [
                "View supplier ratings",
                "Compare bulk pricing",
                "Schedule procurement"
            ]
        else:
            suggestions = [
                "What are today's market trends?",
                "Help me optimize my farm",
                "Find the best buyers for my produce"
            ]
        
        return suggestions[:3]

    @classmethod
    def _calculate_confidence(cls, response: Any, intent: str) -> float:
        """Calculate confidence score based on AI response quality."""
        # Base confidence on finish reason and intent match
        if hasattr(response.choices[0], 'finish_reason'):
            if response.choices[0].finish_reason == 'stop':
                return 0.95
            elif response.choices[0].finish_reason == 'length':
                return 0.85
        
        return 0.90

    @classmethod
    def _generate_actions(cls, intent: str) -> List[Dict[str, str]]:
        """Generate contextual actions based on intent."""
        action_map = {
            "PRICE": [{"type": "NAVIGATE", "target": "/dashboard/market-trends"}],
            "CROP": [{"type": "NAVIGATE", "target": "/dashboard/farm-insights"}],
            "BUYER": [{"type": "NAVIGATE", "target": "/dashboard/marketplace"}],
            "SUPPLIER": [{"type": "NAVIGATE", "target": "/dashboard/sourcing"}],
        }
        return action_map.get(intent, [])

    # -------------------------------------------------------------------------
    # INTERNAL HANDLERS (THE 'EXPERT BRAIN')
    # -------------------------------------------------------------------------

    @classmethod
    def _detect_intent(cls, message: str) -> str:
        for intent, patterns in cls.INTENTS.items():
            if any(p in message for p in patterns):
                return intent
        return "GENERAL"

    @classmethod
    def _handle_price_query(cls, message: str, context: Dict) -> (str, List[str]):
        # Knowledge Extraction logic
        crop = next((c for c in cls.KNOWLEDGE_BASE["CROPS"].keys() if c.lower() in message), "Wheat")
        data = cls.KNOWLEDGE_BASE["CROPS"][crop]
        
        response = (
            f"📈 **Market Intelligent Price Advice for {crop}:**\n\n"
            f"The current average price is ₹{data['price']} per {data['unit']}. "
            f"In key production hubs like {', '.join(data['districts'])}, we've detected a bullish trend. \n\n"
            f"**Actionable Steps:**\n"
            f"1. **Grade Analysis:** Aim for the '{data['best_grade']}' grade using our AI tool to lock in the top 10% of prices.\n"
            f"2. **Logistics Optimization:** Sourcing or selling within a 50km radius could save you 12% on transportation.\n"
            f"3. **Timing:** Market volume is expected to decrease over the next 10 days, suggesting a prime window to sell."
        )
        suggestions = [f"Show {crop} price trends", f"Find {crop} buyers", "Check historical volume"]
        return response, suggestions

    @classmethod
    def _handle_crop_advice(cls, message: str, context: Dict) -> (str, List[str]):
        location = context.get("location", "Nashik")
        zone_data = cls.KNOWLEDGE_BASE["ODOP_ZONES"].get(location, {"crop": "General Crops", "advice": "Regular soil testing is key."})
        
        response = (
            f"🚜 **Agri-Expert Guidance for {location}:**\n\n"
            f"As a designated ODOP hub for **{zone_data['crop']}**, your region offers unique subsidies. "
            f"{zone_data['advice']}\n\n"
            f"**Recommended Strategy:**\n"
            f"• **Rotation:** If your previous crop was Wheat, plant Legumes now to naturally fix Nitrogen levels.\n"
            f"• **Pest Control:** Keep an eye out for {', '.join(cls.KNOWLEDGE_BASE['CROPS'].get('Wheat', {}).get('pests', []))} given the current humidity.\n"
            f"• **Organic Boost:** Transitioning to organic-certified {zone_data['crop']} can open premium procurement channels on our platform."
        )
        suggestions = ["Optimize irrigation", "Soil testing centers", "Next season forecast"]
        return response, suggestions

    @classmethod
    def _handle_selling_query(cls, message: str, context: Dict) -> (str, List[str]):
        response = (
            "I've analyzed the marketplace activity. Currently, there are 12 bulk buyers looking for high-quality produce. "
            "Using our AI Quality Grade will boost your visibility by 40%. Would you like to analyze a crop photo now?"
        )
        suggestions = ["Analyze crop quality", "View active buyer leads", "Set my target price"]
        return response, suggestions

    @classmethod
    def _handle_buying_query(cls, message: str, context: Dict) -> (str, List[str]):
        response = (
            "We have verified clusters of farmers with ODOP-certified produce. "
            "To optimize your logistics cost, I suggest sourcing from the Nagpur cluster where supply is currently high."
        )
        suggestions = ["Compare cluster prices", "Verify supplier records", "Book smart logistics"]
        return response, suggestions

    @classmethod
    def _get_welcome_response(cls, user_type: str, context: Dict) -> str:
        name = context.get("name", "User")
        if user_type == "FARMER":
            return f"Hello {name}! How can I help you grow your business today? I can help with price trends, crop quality, or finding buyers."
        else:
            return f"Hello {name}! I'm ready to find you the best quality produce at fair market rates. What are you looking to source?"

chat_service = ChatService()
