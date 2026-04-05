"""
Advanced AI Chat Router - Real-time streaming chat with OpenAI GPT-4
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, AsyncGenerator
from datetime import datetime
import os
import json
from openai import AsyncOpenAI
from openai import OpenAIError, RateLimitError, APIConnectionError

router = APIRouter(prefix="/ai/chat", tags=["AI Chat"])

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
OPENAI_MAX_TOKENS = int(os.getenv("OPENAI_MAX_TOKENS", "1000"))
OPENAI_TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", "0.7"))

client = AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


class Message(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    message: str
    user_type: str
    conversation_history: Optional[List[Message]] = []
    user_context: Optional[Dict[str, Any]] = {}


class ChatResponse(BaseModel):
    response: str
    suggestions: List[str]
    intent: str
    confidence: float
    actions: Optional[List[Dict[str, Any]]] = []
    data: Optional[Dict[str, Any]] = None


class IntentClassifier:
    """Classify user intent from message"""
    
    FARMER_INTENTS = {
        'price_inquiry': ['price', 'rate', 'cost', 'selling', 'market price', 'how much'],
        'quality_check': ['quality', 'grade', 'defect', 'inspect', 'analyze'],
        'crop_advice': ['crop', 'plant', 'grow', 'season', 'soil', 'recommend'],
        'pest_disease': ['pest', 'disease', 'insect', 'bug', 'infection', 'treatment'],
        'weather': ['weather', 'rain', 'temperature', 'forecast', 'climate'],
        'market_trends': ['trend', 'demand', 'market', 'forecast', 'prediction'],
        'logistics': ['transport', 'delivery', 'shipping', 'logistics', 'warehouse'],
        'finance': ['loan', 'credit', 'insurance', 'subsidy', 'payment'],
        'buyer_matching': ['buyer', 'sell', 'customer', 'order', 'purchase'],
        'general': []
    }
    
    BUYER_INTENTS = {
        'supplier_search': ['supplier', 'farmer', 'source', 'find', 'vendor'],
        'price_comparison': ['price', 'compare', 'cost', 'rate', 'cheaper', 'expensive'],
        'quality_inquiry': ['quality', 'grade', 'certification', 'standard'],
        'bulk_order': ['bulk', 'wholesale', 'large quantity', 'ton', 'quintal'],
        'market_analysis': ['market', 'trend', 'analysis', 'forecast', 'demand'],
        'negotiation': ['negotiate', 'bargain', 'deal', 'discount', 'offer'],
        'logistics': ['delivery', 'transport', 'shipping', 'logistics'],
        'contract': ['contract', 'agreement', 'terms', 'conditions'],
        'payment': ['payment', 'escrow', 'transaction', 'invoice'],
        'general': []
    }
    
    @classmethod
    def classify(cls, message: str, user_type: str) -> tuple[str, float]:
        """Classify intent and return confidence score"""
        message_lower = message.lower()
        intents = cls.FARMER_INTENTS if user_type == 'FARMER' else cls.BUYER_INTENTS
        
        best_intent = 'general'
        best_score = 0.0
        
        for intent, keywords in intents.items():
            score = sum(1 for keyword in keywords if keyword in message_lower)
            if score > best_score:
                best_score = score
                best_intent = intent
        
        confidence = min(best_score / 3.0, 1.0) if best_score > 0 else 0.3
        return best_intent, confidence


def build_system_prompt(user_type: str, user_context: Dict[str, Any]) -> str:
    """Build system prompt based on user type and context"""
    
    base_context = f"""You are an expert AI assistant for an agricultural marketplace platform.
User Type: {user_type}
User Name: {user_context.get('name', 'User')}
Location: {user_context.get('location', 'Not specified')}

Your role is to provide helpful, accurate, and contextual information about:"""
    
    if user_type == 'FARMER':
        return base_context + """
- Market prices and price predictions
- Crop quality assessment and improvement
- Pest and disease identification and treatment
- Crop recommendations based on soil and season
- Finding buyers and negotiating deals
- Weather forecasts and farming best practices
- Logistics and delivery management
- Financial services (loans, insurance, subsidies)

Be supportive, practical, and focus on helping farmers maximize their profits and crop quality.
Keep responses concise (2-3 paragraphs max) and actionable."""
    else:
        return base_context + """
- Finding reliable suppliers and farmers
- Price comparisons and market analysis
- Quality verification and certifications
- Bulk order procurement
- Negotiation strategies
- Contract management
- Logistics and delivery tracking
- Market trends and forecasts

Be professional, data-driven, and focus on helping buyers source quality products at competitive prices.
Keep responses concise (2-3 paragraphs max) and actionable."""


def generate_suggestions(intent: str, user_type: str) -> List[str]:
    """Generate contextual suggestions based on intent"""
    
    farmer_suggestions = {
        'price_inquiry': [
            'Show me price trends for last 30 days',
            'Compare prices across nearby markets',
            'Get AI price prediction for my crop',
            'Find best buyers for my product'
        ],
        'quality_check': [
            'Upload crop image for quality check',
            'Learn about quality standards',
            'See quality improvement tips',
            'Compare with market standards'
        ],
        'crop_advice': [
            'What crops suit my soil type?',
            'Best crops for current season',
            'High-profit crop recommendations',
            'Crop rotation suggestions'
        ],
        'general': [
            'Check current market prices',
            'Analyze my crop quality',
            'Find buyers for my product',
            'Get crop recommendations'
        ]
    }
    
    buyer_suggestions = {
        'supplier_search': [
            'Find wheat suppliers in Punjab',
            'Show top-rated rice farmers',
            'Suppliers with organic certification',
            'Nearby suppliers for quick delivery'
        ],
        'price_comparison': [
            'Compare wheat prices across states',
            'Show bulk order pricing',
            'Price trends for last 3 months',
            'Best deals available now'
        ],
        'quality_inquiry': [
            'View quality certificates',
            'See quality grading system',
            'Request product samples',
            'Quality guarantee terms'
        ],
        'general': [
            'Find suppliers for my needs',
            'Compare market prices',
            'Place a bulk order',
            'Analyze market trends'
        ]
    }
    
    suggestions_map = farmer_suggestions if user_type == 'FARMER' else buyer_suggestions
    return suggestions_map.get(intent, suggestions_map['general'])


async def stream_openai_response(
    messages: List[Dict[str, str]],
    user_type: str,
    user_context: Dict[str, Any]
) -> AsyncGenerator[str, None]:
    """Stream response from OpenAI"""
    
    if not client:
        yield json.dumps({
            "type": "error",
            "error": "API_KEY_MISSING",
            "message": "OpenAI API key is not configured. Please contact support."
        }) + "\n"
        return
    
    try:
        stream = await client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            max_tokens=OPENAI_MAX_TOKENS,
            temperature=OPENAI_TEMPERATURE,
            stream=True
        )
        
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield json.dumps({
                    "type": "content",
                    "content": chunk.choices[0].delta.content
                }) + "\n"
        
        yield json.dumps({"type": "done"}) + "\n"
        
    except RateLimitError:
        yield json.dumps({
            "type": "error",
            "error": "RATE_LIMIT",
            "message": "Too many requests. Please wait a moment and try again."
        }) + "\n"
    except APIConnectionError:
        yield json.dumps({
            "type": "error",
            "error": "CONNECTION_ERROR",
            "message": "Unable to connect to AI service. Please check your internet connection."
        }) + "\n"
    except OpenAIError as e:
        yield json.dumps({
            "type": "error",
            "error": "API_ERROR",
            "message": f"AI service error: {str(e)}"
        }) + "\n"
    except Exception as e:
        yield json.dumps({
            "type": "error",
            "error": "UNKNOWN_ERROR",
            "message": "An unexpected error occurred. Please try again."
        }) + "\n"


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """
    Stream chat response in real-time using Server-Sent Events
    """
    
    # Classify intent
    intent, confidence = IntentClassifier.classify(request.message, request.user_type)
    
    # Build messages for OpenAI
    messages = [
        {"role": "system", "content": build_system_prompt(request.user_type, request.user_context)}
    ]
    
    # Add conversation history
    for msg in request.conversation_history[-5:]:  # Last 5 messages for context
        messages.append({
            "role": msg.role,
            "content": msg.content
        })
    
    # Add current message
    messages.append({
        "role": "user",
        "content": request.message
    })
    
    # Generate suggestions
    suggestions = generate_suggestions(intent, request.user_type)
    
    # Send metadata first
    async def generate():
        yield json.dumps({
            "type": "metadata",
            "intent": intent,
            "confidence": confidence,
            "suggestions": suggestions
        }) + "\n"
        
        # Stream the response
        async for chunk in stream_openai_response(messages, request.user_type, request.user_context):
            yield chunk
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.post("/context-aware", response_model=ChatResponse)
async def context_aware_chat(request: ChatRequest):
    """
    Non-streaming chat endpoint (fallback)
    """
    
    if not client:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "API_KEY_MISSING",
                "message": "OpenAI API key is not configured"
            }
        )
    
    try:
        # Classify intent
        intent, confidence = IntentClassifier.classify(request.message, request.user_type)
        
        # Build messages
        messages = [
            {"role": "system", "content": build_system_prompt(request.user_type, request.user_context)}
        ]
        
        for msg in request.conversation_history[-5:]:
            messages.append({"role": msg.role, "content": msg.content})
        
        messages.append({"role": "user", "content": request.message})
        
        # Get response
        response = await client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            max_tokens=OPENAI_MAX_TOKENS,
            temperature=OPENAI_TEMPERATURE
        )
        
        ai_response = response.choices[0].message.content
        suggestions = generate_suggestions(intent, request.user_type)
        
        return ChatResponse(
            response=ai_response,
            suggestions=suggestions,
            intent=intent,
            confidence=confidence,
            actions=[],
            data={"model": OPENAI_MODEL}
        )
        
    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "RATE_LIMIT",
                "message": "Too many requests. Please wait a moment."
            }
        )
    except APIConnectionError:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "CONNECTION_ERROR",
                "message": "Unable to connect to AI service"
            }
        )
    except OpenAIError as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "API_ERROR",
                "message": str(e)
            }
        )
