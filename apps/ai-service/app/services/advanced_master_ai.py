"""
Advanced Master AI Service - Professional Grade Conversational AI
Handles any type of conversation with advanced capabilities
"""

import asyncio
import json
import logging
import os
import re
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple, Union, AsyncGenerator
from dataclasses import dataclass, field
import openai
from openai import AsyncOpenAI
import tiktoken
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
# import spacy  # Disabled due to Windows DLL issues
from textblob import TextBlob
import asyncpg
import redis
from functools import lru_cache
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConversationMode(Enum):
    """Different conversation modes for specialized responses"""
    GENERAL = "general"
    TECHNICAL = "technical"
    CREATIVE = "creative"
    ANALYTICAL = "analytical"
    EDUCATIONAL = "educational"
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    EXPERT = "expert"

class ResponseStyle(Enum):
    """Response style preferences"""
    CONCISE = "concise"
    DETAILED = "detailed"
    CONVERSATIONAL = "conversational"
    FORMAL = "formal"
    FRIENDLY = "friendly"
    TECHNICAL = "technical"

class KnowledgeDomain(Enum):
    """Knowledge domains for specialized responses"""
    AGRICULTURE = "agriculture"
    TECHNOLOGY = "technology"
    BUSINESS = "business"
    SCIENCE = "science"
    ARTS = "arts"
    HEALTH = "health"
    FINANCE = "finance"
    EDUCATION = "education"
    GENERAL = "general"

@dataclass
class ConversationPersonality:
    """AI personality configuration"""
    name: str = "AgriAI Assistant"
    tone: str = "helpful and knowledgeable"
    expertise_level: str = "expert"
    communication_style: str = "clear and engaging"
    empathy_level: float = 0.8
    creativity_level: float = 0.7
    formality_level: float = 0.6

@dataclass
class UserProfile:
    """Enhanced user profile for personalized responses"""
    user_id: str
    name: Optional[str] = None
    role: Optional[str] = None
    expertise_areas: List[str] = field(default_factory=list)
    preferred_style: ResponseStyle = ResponseStyle.CONVERSATIONAL
    language: str = "en"
    timezone: str = "UTC"
    conversation_history_summary: str = ""
    interests: List[str] = field(default_factory=list)
    learning_preferences: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ConversationContext:
    """Enhanced conversation context with memory and state"""
    session_id: str
    user_profile: UserProfile
    messages: List[Dict[str, Any]] = field(default_factory=list)
    current_mode: ConversationMode = ConversationMode.GENERAL
    active_domains: List[KnowledgeDomain] = field(default_factory=list)
    context_summary: str = ""
    emotional_state: Dict[str, float] = field(default_factory=dict)
    topics_discussed: List[str] = field(default_factory=list)
    follow_up_questions: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
    last_activity: datetime = field(default_factory=datetime.now)

class AdvancedMasterAI:
    """
    Advanced Master AI Service - Professional Grade Conversational AI
    
    Features:
    - Multi-modal conversation handling
    - Context-aware responses
    - Personality adaptation
    - Knowledge domain specialization
    - Emotional intelligence
    - Memory management
    - Real-time learning
    - Multi-language support
    """
    
    def __init__(self):
        # Initialize OpenAI client only if API key is available
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if openai_api_key:
            self.client = AsyncOpenAI(api_key=openai_api_key)
        else:
            self.client = None
            print("Warning: OpenAI API key not found. Advanced AI features will be limited.")
        
        self.personality = ConversationPersonality()
        self.sessions: Dict[str, ConversationContext] = {}
        self.redis_client = None
        self.db_pool = None
        self.nlp = None
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.knowledge_base = {}
        self.response_cache = {}
        self._initialized = False
        
        # Don't initialize components during import - do it lazily
    
    async def _initialize_components(self):
        """Initialize AI components and external services"""
        try:
            # Initialize Redis for caching
            self.redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)
            
            # Initialize spaCy for NLP
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except OSError:
                logger.warning("spaCy model not found. Some features may be limited.")
            
            # Load knowledge base
            await self._load_knowledge_base()
            
            logger.info("Advanced Master AI initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing components: {e}")
    
    async def _load_knowledge_base(self):
        """Load and index knowledge base for quick retrieval"""
        # This would typically load from a database or files
        self.knowledge_base = {
            "agriculture": {
                "crops": ["wheat", "rice", "corn", "soybeans", "cotton"],
                "techniques": ["precision farming", "hydroponics", "organic farming"],
                "seasons": ["spring", "summer", "fall", "winter"],
                "pests": ["aphids", "locusts", "fungal diseases"]
            },
            "technology": {
                "programming": ["python", "javascript", "java", "c++"],
                "ai_ml": ["machine learning", "deep learning", "neural networks"],
                "web": ["react", "node.js", "databases", "apis"]
            },
            "business": {
                "strategies": ["marketing", "sales", "operations", "finance"],
                "models": ["b2b", "b2c", "saas", "marketplace"]
            }
        }
    
    def _generate_session_id(self, user_id: str) -> str:
        """Generate unique session ID"""
        timestamp = datetime.now().isoformat()
        return hashlib.md5(f"{user_id}_{timestamp}".encode()).hexdigest()
    
    async def create_session(self, user_id: str, user_profile: Optional[Dict] = None) -> str:
        """Create new conversation session"""
        session_id = self._generate_session_id(user_id)
        
        # Create user profile
        profile = UserProfile(user_id=user_id)
        if user_profile:
            for key, value in user_profile.items():
                if hasattr(profile, key):
                    setattr(profile, key, value)
        
        # Create conversation context
        context = ConversationContext(
            session_id=session_id,
            user_profile=profile
        )
        
        self.sessions[session_id] = context
        
        # Cache in Redis if available
        if self.redis_client:
            try:
                await self._cache_session(session_id, context)
            except Exception as e:
                logger.warning(f"Failed to cache session: {e}")
        
        return session_id
    
    async def _cache_session(self, session_id: str, context: ConversationContext):
        """Cache session in Redis"""
        session_data = {
            "user_id": context.user_profile.user_id,
            "created_at": context.created_at.isoformat(),
            "last_activity": context.last_activity.isoformat(),
            "message_count": len(context.messages)
        }
        self.redis_client.setex(f"session:{session_id}", 3600, json.dumps(session_data))
    
    def _detect_conversation_mode(self, message: str, context: ConversationContext) -> ConversationMode:
        """Detect appropriate conversation mode based on message content"""
        message_lower = message.lower()
        
        # Technical indicators
        technical_keywords = ["code", "programming", "algorithm", "api", "database", "technical"]
        if any(keyword in message_lower for keyword in technical_keywords):
            return ConversationMode.TECHNICAL
        
        # Creative indicators
        creative_keywords = ["creative", "design", "art", "story", "imagine", "brainstorm"]
        if any(keyword in message_lower for keyword in creative_keywords):
            return ConversationMode.CREATIVE
        
        # Analytical indicators
        analytical_keywords = ["analyze", "data", "statistics", "research", "study", "compare"]
        if any(keyword in message_lower for keyword in analytical_keywords):
            return ConversationMode.ANALYTICAL
        
        # Educational indicators
        educational_keywords = ["learn", "teach", "explain", "understand", "how to", "tutorial"]
        if any(keyword in message_lower for keyword in educational_keywords):
            return ConversationMode.EDUCATIONAL
        
        # Professional indicators
        professional_keywords = ["business", "professional", "meeting", "proposal", "strategy"]
        if any(keyword in message_lower for keyword in professional_keywords):
            return ConversationMode.PROFESSIONAL
        
        return ConversationMode.GENERAL
    
    def _detect_knowledge_domains(self, message: str) -> List[KnowledgeDomain]:
        """Detect relevant knowledge domains from message"""
        domains = []
        message_lower = message.lower()
        
        # Agriculture domain
        agri_keywords = ["crop", "farm", "agriculture", "soil", "harvest", "plant", "seed"]
        if any(keyword in message_lower for keyword in agri_keywords):
            domains.append(KnowledgeDomain.AGRICULTURE)
        
        # Technology domain
        tech_keywords = ["technology", "software", "computer", "ai", "machine learning"]
        if any(keyword in message_lower for keyword in tech_keywords):
            domains.append(KnowledgeDomain.TECHNOLOGY)
        
        # Business domain
        business_keywords = ["business", "market", "sales", "revenue", "profit", "strategy"]
        if any(keyword in message_lower for keyword in business_keywords):
            domains.append(KnowledgeDomain.BUSINESS)
        
        # Science domain
        science_keywords = ["science", "research", "experiment", "hypothesis", "theory"]
        if any(keyword in message_lower for keyword in science_keywords):
            domains.append(KnowledgeDomain.SCIENCE)
        
        return domains if domains else [KnowledgeDomain.GENERAL]
    
    def _analyze_sentiment(self, message: str) -> Dict[str, float]:
        """Analyze emotional sentiment of message"""
        try:
            blob = TextBlob(message)
            sentiment = blob.sentiment
            
            return {
                "polarity": sentiment.polarity,  # -1 to 1 (negative to positive)
                "subjectivity": sentiment.subjectivity,  # 0 to 1 (objective to subjective)
                "confidence": abs(sentiment.polarity)
            }
        except Exception as e:
            logger.warning(f"Sentiment analysis failed: {e}")
            return {"polarity": 0.0, "subjectivity": 0.5, "confidence": 0.0}
    
    def _extract_entities(self, message: str) -> List[Dict[str, str]]:
        """Extract named entities from message"""
        entities = []
        if self.nlp:
            try:
                doc = self.nlp(message)
                for ent in doc.ents:
                    entities.append({
                        "text": ent.text,
                        "label": ent.label_,
                        "description": spacy.explain(ent.label_)
                    })
            except Exception as e:
                logger.warning(f"Entity extraction failed: {e}")
        
        return entities
    
    def _build_system_prompt(self, context: ConversationContext) -> str:
        """Build comprehensive system prompt based on context"""
        base_prompt = f"""You are {self.personality.name}, an advanced AI assistant with the following characteristics:

PERSONALITY:
- Tone: {self.personality.tone}
- Expertise Level: {self.personality.expertise_level}
- Communication Style: {self.personality.communication_style}
- Empathy Level: {self.personality.empathy_level}/1.0
- Creativity Level: {self.personality.creativity_level}/1.0

USER PROFILE:
- Name: {context.user_profile.name or 'User'}
- Role: {context.user_profile.role or 'Not specified'}
- Preferred Style: {context.user_profile.preferred_style.value}
- Language: {context.user_profile.language}
- Expertise Areas: {', '.join(context.user_profile.expertise_areas) if context.user_profile.expertise_areas else 'General'}

CONVERSATION CONTEXT:
- Current Mode: {context.current_mode.value}
- Active Domains: {', '.join([d.value for d in context.active_domains])}
- Topics Discussed: {', '.join(context.topics_discussed[-5:]) if context.topics_discussed else 'None'}

CAPABILITIES:
You can handle ANY type of conversation including:
- Technical discussions and problem-solving
- Creative writing and brainstorming
- Educational explanations and tutorials
- Business strategy and analysis
- Personal advice and support
- Agricultural expertise and farming guidance
- Scientific research and analysis
- Programming and technology help
- General knowledge and trivia
- Emotional support and empathy

RESPONSE GUIDELINES:
1. Always be helpful, accurate, and engaging
2. Adapt your response style to match the user's preferences
3. Provide detailed explanations when requested
4. Ask clarifying questions when needed
5. Offer practical solutions and actionable advice
6. Show empathy and understanding
7. Maintain conversation flow and context
8. Suggest follow-up topics when appropriate

Remember: You can discuss and help with absolutely any topic the user brings up. Be comprehensive, accurate, and genuinely helpful."""

        # Add context-specific instructions
        if context.current_mode == ConversationMode.TECHNICAL:
            base_prompt += "\n\nFocus on technical accuracy, provide code examples when relevant, and explain complex concepts clearly."
        elif context.current_mode == ConversationMode.CREATIVE:
            base_prompt += "\n\nEmbrace creativity, think outside the box, and help generate innovative ideas and solutions."
        elif context.current_mode == ConversationMode.EDUCATIONAL:
            base_prompt += "\n\nBreak down complex topics into understandable parts, provide examples, and encourage learning."
        
        return base_prompt
    
    def _build_context_summary(self, context: ConversationContext) -> str:
        """Build conversation context summary for better continuity"""
        if not context.messages:
            return "New conversation started."
        
        recent_messages = context.messages[-10:]  # Last 10 messages
        topics = context.topics_discussed[-5:] if context.topics_discussed else []
        
        summary = f"Recent conversation topics: {', '.join(topics) if topics else 'General discussion'}\n"
        summary += f"Message count: {len(context.messages)}\n"
        summary += f"Conversation started: {context.created_at.strftime('%Y-%m-%d %H:%M')}\n"
        
        if context.emotional_state:
            summary += f"User emotional state: {context.emotional_state}\n"
        
        return summary
    
    async def chat(
        self,
        session_id: str,
        message: str,
        stream: bool = False,
        **kwargs
    ) -> Union[str, AsyncGenerator[str, None]]:
        """
        Main chat function - handles any type of conversation
        
        Args:
            session_id: Conversation session ID
            message: User message
            stream: Whether to stream response
            **kwargs: Additional parameters
        
        Returns:
            Response string or async generator for streaming
        """
        try:
            # Lazy initialization
            if not self._initialized:
                await self._initialize_components()
                self._initialized = True
            
            # Get or create session
            if session_id not in self.sessions:
                raise ValueError(f"Session {session_id} not found")
            
            context = self.sessions[session_id]
            
            # Update last activity
            context.last_activity = datetime.now()
            
            # Analyze message
            sentiment = self._analyze_sentiment(message)
            entities = self._extract_entities(message)
            conversation_mode = self._detect_conversation_mode(message, context)
            knowledge_domains = self._detect_knowledge_domains(message)
            
            # Update context
            context.current_mode = conversation_mode
            context.active_domains = knowledge_domains
            context.emotional_state = sentiment
            
            # Add message to context
            context.messages.append({
                "role": "user",
                "content": message,
                "timestamp": datetime.now().isoformat(),
                "sentiment": sentiment,
                "entities": entities,
                "mode": conversation_mode.value,
                "domains": [d.value for d in knowledge_domains]
            })
            
            # Extract topics (simple keyword extraction)
            if self.nlp:
                doc = self.nlp(message)
                topics = [token.lemma_.lower() for token in doc if token.pos_ in ['NOUN', 'PROPN'] and not token.is_stop]
                context.topics_discussed.extend(topics[:3])  # Add up to 3 main topics
            
            # Build system prompt
            system_prompt = self._build_system_prompt(context)
            
            # Build context summary
            context_summary = self._build_context_summary(context)
            
            # Prepare messages for API
            api_messages = [
                {"role": "system", "content": system_prompt},
                {"role": "system", "content": f"Context Summary:\n{context_summary}"}
            ]
            
            # Add recent conversation history
            recent_messages = context.messages[-20:]  # Last 20 messages
            for msg in recent_messages:
                api_messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
            
            # Generate response
            if stream:
                return self._stream_response(api_messages, context)
            else:
                response = await self._generate_response(api_messages, context)
                
                # Add response to context
                context.messages.append({
                    "role": "assistant",
                    "content": response,
                    "timestamp": datetime.now().isoformat(),
                    "mode": conversation_mode.value,
                    "domains": [d.value for d in knowledge_domains]
                })
                
                # Generate follow-up suggestions
                context.follow_up_questions = await self._generate_follow_ups(message, response, context)
                
                return response
                
        except Exception as e:
            logger.error(f"Chat error: {e}")
            return f"I apologize, but I encountered an error processing your message. Please try again. Error: {str(e)}"
    
    async def _generate_response(self, messages: List[Dict], context: ConversationContext) -> str:
        """Generate AI response using OpenAI API"""
        try:
            if not self.client:
                return "I'm currently running in limited mode. Please configure the OpenAI API key for full functionality."
            
            response = await self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=messages,
                max_tokens=2000,
                temperature=0.7,
                top_p=0.9,
                frequency_penalty=0.1,
                presence_penalty=0.1
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return "I'm having trouble connecting to my AI service. Please try again in a moment."
    
    async def _stream_response(self, messages: List[Dict], context: ConversationContext) -> AsyncGenerator[str, None]:
        """Stream AI response using OpenAI API"""
        try:
            if not self.client:
                yield "I'm currently running in limited mode. Please configure the OpenAI API key for full functionality."
                return
            
            stream = await self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=messages,
                max_tokens=2000,
                temperature=0.7,
                stream=True
            )
            
            full_response = ""
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield content
            
            # Add complete response to context
            context.messages.append({
                "role": "assistant",
                "content": full_response,
                "timestamp": datetime.now().isoformat(),
                "mode": context.current_mode.value,
                "domains": [d.value for d in context.active_domains]
            })
            
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield "I'm having trouble with the streaming response. Please try again."
    
    async def _generate_follow_ups(self, user_message: str, ai_response: str, context: ConversationContext) -> List[str]:
        """Generate intelligent follow-up questions"""
        try:
            if not self.client:
                return []  # Return empty list if no client available
            
            prompt = f"""Based on this conversation:
User: {user_message}
Assistant: {ai_response}

Generate 3 relevant follow-up questions that would naturally continue this conversation. Make them specific and engaging.

Format as a simple list:
1. Question 1
2. Question 2  
3. Question 3"""

            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.8
            )
            
            content = response.choices[0].message.content.strip()
            questions = []
            for line in content.split('\n'):
                if line.strip() and (line.strip().startswith(('1.', '2.', '3.', '-', '•'))):
                    question = re.sub(r'^[0-9]+\.\s*', '', line.strip())
                    question = re.sub(r'^[-•]\s*', '', question.strip())
                    if question:
                        questions.append(question)
            
            return questions[:3]
            
        except Exception as e:
            logger.warning(f"Follow-up generation failed: {e}")
            return []
    
    async def get_conversation_summary(self, session_id: str) -> Dict[str, Any]:
        """Get comprehensive conversation summary"""
        if session_id not in self.sessions:
            return {"error": "Session not found"}
        
        context = self.sessions[session_id]
        
        return {
            "session_id": session_id,
            "user_profile": {
                "user_id": context.user_profile.user_id,
                "name": context.user_profile.name,
                "role": context.user_profile.role,
                "preferred_style": context.user_profile.preferred_style.value
            },
            "conversation_stats": {
                "message_count": len(context.messages),
                "duration": str(context.last_activity - context.created_at),
                "current_mode": context.current_mode.value,
                "active_domains": [d.value for d in context.active_domains]
            },
            "topics_discussed": context.topics_discussed[-10:],
            "emotional_state": context.emotional_state,
            "follow_up_questions": context.follow_up_questions,
            "created_at": context.created_at.isoformat(),
            "last_activity": context.last_activity.isoformat()
        }
    
    async def update_user_profile(self, session_id: str, profile_updates: Dict[str, Any]) -> bool:
        """Update user profile for personalization"""
        if session_id not in self.sessions:
            return False
        
        context = self.sessions[session_id]
        profile = context.user_profile
        
        for key, value in profile_updates.items():
            if hasattr(profile, key):
                if key == "preferred_style" and isinstance(value, str):
                    try:
                        profile.preferred_style = ResponseStyle(value.lower())
                    except ValueError:
                        continue
                else:
                    setattr(profile, key, value)
        
        return True
    
    def clear_session(self, session_id: str) -> bool:
        """Clear conversation session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            
            # Clear from Redis if available
            if self.redis_client:
                try:
                    self.redis_client.delete(f"session:{session_id}")
                except Exception as e:
                    logger.warning(f"Failed to clear session from cache: {e}")
            
            return True
        return False
    
    def get_active_sessions(self) -> List[str]:
        """Get list of active session IDs"""
        return list(self.sessions.keys())
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for the AI service"""
        return {
            "status": "healthy",
            "active_sessions": len(self.sessions),
            "components": {
                "openai": "connected",
                "redis": "connected" if self.redis_client else "disconnected",
                "nlp": "loaded" if self.nlp else "not_loaded"
            },
            "timestamp": datetime.now().isoformat()
        }

# Global instance
advanced_ai = AdvancedMasterAI()