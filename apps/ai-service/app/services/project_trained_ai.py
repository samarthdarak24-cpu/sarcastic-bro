"""
Project-Trained AI Service - Specifically trained on ODOP Connect Platform
Knows everything about the agricultural marketplace platform
"""

import os
import json
import logging
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
import openai
from openai import AsyncOpenAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ODOP Connect Platform Knowledge Base
PLATFORM_KNOWLEDGE = {
    "platform_name": "ODOP Connect",
    "description": "Agricultural marketplace connecting farmers and buyers with AI-powered features",
    
    "farmer_features": {
        "product_management": {
            "description": "Manage and list agricultural products for sale",
            "how_to": "Go to Farmer Dashboard → Product Management → Click 'Add Product' → Fill in product details (name, category, quantity, price, quality grade) → Upload photos → Submit",
            "features": ["Add products", "Edit listings", "Set prices", "Upload photos", "Quality grading", "Inventory tracking"]
        },
        "order_management": {
            "description": "View and manage incoming orders from buyers",
            "how_to": "Go to Farmer Dashboard → Order Control → View pending orders → Accept/Reject orders → Update order status → Track delivery",
            "features": ["View orders", "Accept/reject orders", "Track status", "Manage deliveries", "Order history"]
        },
        "smart_product_hub": {
            "description": "AI-powered product listing with smart recommendations",
            "how_to": "Go to Smart Product Hub → AI suggests optimal pricing → Get quality predictions → Receive market insights → Auto-optimize listings",
            "features": ["AI pricing", "Quality detection", "Market insights", "Demand forecasting", "Smart recommendations"]
        },
        "farm_insights": {
            "description": "Comprehensive farm analytics and insights",
            "how_to": "Go to Farm Insights → View dashboard → Check soil health → Monitor weather → Track finances → Analyze performance",
            "features": ["Soil health monitoring", "Weather forecasts", "Financial analytics", "Pest detection", "Performance metrics"]
        },
        "tender_participation": {
            "description": "Participate in bulk purchase tenders",
            "how_to": "Go to Tender Bids Hub → Browse available tenders → Submit proposals → Track bid status → Win contracts",
            "features": ["Browse tenders", "Submit bids", "Track proposals", "Contract management", "Bulk orders"]
        },
        "auto_sell": {
            "description": "Automated selling based on market conditions",
            "how_to": "Go to Auto Sell Settings → Set price rules → Define conditions → Enable auto-sell → Monitor automated sales",
            "features": ["Price triggers", "Market conditions", "Automated listing", "Smart pricing", "Rule-based selling"]
        },
        "escrow_hub": {
            "description": "Secure payment escrow for transactions",
            "how_to": "Go to Escrow Hub → View escrow transactions → Track payment status → Release funds after delivery → Dispute resolution",
            "features": ["Secure payments", "Escrow management", "Payment tracking", "Dispute handling", "Transaction history"]
        },
        "trust_identity": {
            "description": "Build trust score and verify identity",
            "how_to": "Go to Trust & Identity → Complete verification → Build reputation → Earn trust badges → View trust score",
            "features": ["Identity verification", "Trust score", "Reputation badges", "Review management", "Credibility building"]
        }
    },
    
    "buyer_features": {
        "sourcing": {
            "description": "Search and source agricultural products",
            "how_to": "Go to Buyer Dashboard → Sourcing Space → Search products → Filter by criteria → View farmer profiles → Place orders",
            "features": ["Product search", "Advanced filters", "Farmer profiles", "Price comparison", "Quality ratings"]
        },
        "bulk_orders": {
            "description": "Place large quantity orders",
            "how_to": "Go to Bulk Orders → Specify requirements → Request quotes → Compare offers → Place bulk order → Track delivery",
            "features": ["Bulk purchasing", "Quote requests", "Price negotiation", "Volume discounts", "Contract management"]
        },
        "tender_creation": {
            "description": "Create tenders for bulk procurement",
            "how_to": "Go to Tender Hub → Create New Tender → Specify requirements → Set deadline → Review proposals → Award contract",
            "features": ["Create tenders", "Manage proposals", "Evaluate bids", "Award contracts", "Tender tracking"]
        },
        "ai_procurement": {
            "description": "AI-powered procurement assistant",
            "how_to": "Go to AI Procurement → Get sourcing recommendations → Optimize purchasing → Predict demand → Smart supplier matching",
            "features": ["Smart recommendations", "Demand forecasting", "Supplier matching", "Price optimization", "Procurement insights"]
        },
        "supplier_insights": {
            "description": "Analyze and evaluate suppliers",
            "how_to": "Go to Supplier Insights → View supplier ratings → Check reliability → Analyze performance → Compare suppliers",
            "features": ["Supplier ratings", "Performance analytics", "Reliability scores", "Comparison tools", "Historical data"]
        },
        "negotiation_hub": {
            "description": "Negotiate prices and terms with farmers",
            "how_to": "Go to Negotiation Hub → Start negotiation → Make offers → Counter-offers → Reach agreement → Finalize deal",
            "features": ["Price negotiation", "Terms discussion", "Offer management", "Agreement tracking", "Deal closure"]
        },
        "order_tracking": {
            "description": "Track order status and delivery",
            "how_to": "Go to Order Tracker → View active orders → Track delivery → Monitor status → Confirm receipt",
            "features": ["Real-time tracking", "Status updates", "Delivery monitoring", "Receipt confirmation", "Order history"]
        }
    },
    
    "common_features": {
        "ai_chat": {
            "description": "AI-powered chat assistant for platform help",
            "how_to": "Click the chat icon → Ask any question → Get instant help → Platform guidance → Feature explanations",
            "features": ["24/7 support", "Platform guidance", "Feature help", "Troubleshooting", "Smart suggestions"]
        },
        "notifications": {
            "description": "Real-time notifications for important events",
            "how_to": "Check notification bell → View alerts → Manage preferences → Stay updated",
            "features": ["Order updates", "Price alerts", "Tender notifications", "Payment alerts", "System updates"]
        },
        "profile": {
            "description": "Manage user profile and settings",
            "how_to": "Go to Profile → Edit information → Update preferences → Manage security → View activity",
            "features": ["Profile editing", "Preferences", "Security settings", "Activity history", "Account management"]
        }
    },
    
    "getting_started": {
        "farmer": [
            "1. Register as a Farmer on the platform",
            "2. Complete your profile and verification",
            "3. Add your first product in Product Management",
            "4. Set competitive prices using AI recommendations",
            "5. Wait for buyer orders or participate in tenders",
            "6. Manage orders and track deliveries",
            "7. Build your trust score and reputation"
        ],
        "buyer": [
            "1. Register as a Buyer on the platform",
            "2. Complete your business profile",
            "3. Browse products in Sourcing Space",
            "4. Place orders or create tenders for bulk purchases",
            "5. Negotiate prices with farmers",
            "6. Track orders and manage deliveries",
            "7. Rate farmers and build relationships"
        ]
    },
    
    "common_questions": {
        "how_to_add_product": "As a farmer, go to your Dashboard → Product Management → Click 'Add Product' button → Fill in product details (name, category, quantity, price) → Upload product photos → Click 'Submit'. Your product will be listed for buyers to see.",
        
        "how_to_place_order": "As a buyer, go to Sourcing Space → Search for products → Click on a product → Review details → Click 'Place Order' → Enter quantity → Confirm order → Make payment through escrow.",
        
        "how_to_manage_orders": "Farmers: Go to Order Control → View pending orders → Click 'Accept' or 'Reject' → Update order status → Mark as delivered. Buyers: Go to Order Tracker → View active orders → Track delivery → Confirm receipt.",
        
        "how_to_use_ai_features": "The platform has multiple AI features: 1) AI Chat for instant help, 2) Smart Product Hub for pricing recommendations, 3) Farm Insights for farming guidance, 4) AI Procurement for buying insights, 5) Quality Detection for product grading.",
        
        "how_to_participate_tender": "Farmers: Go to Tender Bids Hub → Browse available tenders → Click on a tender → Review requirements → Click 'Submit Proposal' → Enter your offer → Submit. Buyers: Go to Tender Hub → Create New Tender → Specify requirements → Review proposals → Award contract.",
        
        "payment_security": "All payments go through secure escrow. Money is held safely until delivery is confirmed. Both parties are protected. Disputes can be raised if there are issues.",
        
        "trust_score": "Your trust score is built through: 1) Completing transactions, 2) Getting positive reviews, 3) Timely deliveries, 4) Identity verification, 5) Consistent quality. Higher trust scores attract more business.",
        
        "pricing_help": "Use the Smart Product Hub for AI-powered pricing recommendations based on: 1) Current market rates, 2) Product quality, 3) Demand forecasts, 4) Seasonal trends, 5) Competition analysis."
    }
}

class ProjectTrainedAI:
    """AI Service trained specifically on ODOP Connect platform"""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            self.client = AsyncOpenAI(api_key=api_key)
            self.has_openai = True
        else:
            self.client = None
            self.has_openai = False
            logger.warning("OPENAI_API_KEY not set. Using project-trained responses.")
        
        self.sessions: Dict[str, Any] = {}
        self.knowledge = PLATFORM_KNOWLEDGE
    
    async def create_session(self, user_id: str, user_profile: Optional[Dict] = None) -> str:
        """Create new conversation session"""
        session_id = f"session_{datetime.now().timestamp()}"
        
        self.sessions[session_id] = {
            "user_id": user_id,
            "user_profile": user_profile or {},
            "messages": [],
            "created_at": datetime.now(),
            "last_activity": datetime.now()
        }
        
        return session_id
    
    def _get_project_context(self) -> str:
        """Get comprehensive project context for AI"""
        return f"""You are an AI assistant for ODOP Connect, an agricultural marketplace platform that connects farmers and buyers.

PLATFORM OVERVIEW:
{self.knowledge['description']}

KEY FEATURES FOR FARMERS:
- Product Management: List and manage agricultural products
- Order Management: Handle incoming orders from buyers
- Smart Product Hub: AI-powered pricing and recommendations
- Farm Insights: Monitor soil, weather, finances, and performance
- Tender Participation: Bid on bulk purchase contracts
- Auto Sell: Automated selling based on market conditions
- Escrow Hub: Secure payment handling
- Trust & Identity: Build reputation and credibility

KEY FEATURES FOR BUYERS:
- Sourcing Space: Search and find agricultural products
- Bulk Orders: Place large quantity orders
- Tender Creation: Create tenders for bulk procurement
- AI Procurement: Get smart purchasing recommendations
- Supplier Insights: Analyze and evaluate farmers
- Negotiation Hub: Negotiate prices and terms
- Order Tracking: Track deliveries in real-time

COMMON FEATURES:
- AI Chat Assistant (that's you!)
- Real-time Notifications
- Profile Management
- Secure Payments via Escrow
- Trust Score System
- Multi-language Support

HOW TO HELP USERS:
1. Understand their role (Farmer or Buyer)
2. Provide specific, actionable guidance
3. Reference exact dashboard locations and buttons
4. Explain features in simple terms
5. Give step-by-step instructions
6. Be encouraging and supportive

IMPORTANT: Always provide practical, platform-specific answers. Don't give generic advice - tell users exactly where to click and what to do on the ODOP Connect platform."""
    
    def _find_best_answer(self, question: str) -> Optional[str]:
        """Find the best answer from knowledge base"""
        question_lower = question.lower()
        
        # Check common questions first
        for key, answer in self.knowledge["common_questions"].items():
            if any(word in question_lower for word in key.split("_")):
                return answer
        
        # Check for specific feature questions
        if any(word in question_lower for word in ["add", "create", "list", "product", "item"]):
            if "farmer" in question_lower or "sell" in question_lower:
                return self.knowledge["farmer_features"]["product_management"]["how_to"]
        
        if any(word in question_lower for word in ["order", "purchase", "buy"]):
            if "farmer" in question_lower or "manage" in question_lower or "accept" in question_lower:
                return self.knowledge["farmer_features"]["order_management"]["how_to"]
            else:
                return "As a buyer, you can place orders by: 1) Go to Sourcing Space, 2) Search for products you need, 3) Click on a product to view details, 4) Click 'Place Order' button, 5) Enter the quantity you want, 6) Review the total price, 7) Click 'Confirm Order', 8) Complete payment through secure escrow. Your order will be sent to the farmer for acceptance."
        
        if any(word in question_lower for word in ["tender", "bid", "bulk"]):
            return self.knowledge["farmer_features"]["tender_participation"]["how_to"]
        
        if any(word in question_lower for word in ["price", "pricing", "cost"]):
            return self.knowledge["common_questions"]["pricing_help"]
        
        if any(word in question_lower for word in ["payment", "pay", "money", "escrow"]):
            return self.knowledge["common_questions"]["payment_security"]
        
        if any(word in question_lower for word in ["trust", "reputation", "score", "rating"]):
            return self.knowledge["common_questions"]["trust_score"]
        
        if any(word in question_lower for word in ["start", "begin", "getting started", "new"]):
            return "Welcome to ODOP Connect! Here's how to get started:\n\nFor Farmers:\n" + "\n".join(self.knowledge["getting_started"]["farmer"]) + "\n\nFor Buyers:\n" + "\n".join(self.knowledge["getting_started"]["buyer"])
        
        return None
    
    async def chat(self, session_id: str, message: str) -> str:
        """Main chat function with project-specific knowledge"""
        try:
            if session_id not in self.sessions:
                raise ValueError(f"Session {session_id} not found")
            
            session = self.sessions[session_id]
            session["last_activity"] = datetime.now()
            
            # Add user message
            session["messages"].append({
                "role": "user",
                "content": message,
                "timestamp": datetime.now().isoformat()
            })
            
            # Try to find answer in knowledge base first
            kb_answer = self._find_best_answer(message)
            if kb_answer:
                response = kb_answer
            elif self.has_openai and self.client:
                # Use OpenAI with project context
                response = await self._generate_openai_response(session, message)
            else:
                # Generate smart project-specific response
                response = self._generate_smart_response(message)
            
            # Add response to session
            session["messages"].append({
                "role": "assistant",
                "content": response,
                "timestamp": datetime.now().isoformat()
            })
            
            return response
            
        except Exception as e:
            logger.error(f"Chat error: {e}")
            return "I apologize for the confusion. Could you please rephrase your question? I'm here to help you with the ODOP Connect platform - whether it's about adding products, managing orders, using AI features, or anything else related to our agricultural marketplace."
    
    async def _generate_openai_response(self, session: Dict, message: str) -> str:
        """Generate response using OpenAI with project context"""
        try:
            messages = [
                {"role": "system", "content": self._get_project_context()},
                {"role": "system", "content": "Always provide specific, actionable answers about the ODOP Connect platform. Include exact steps and dashboard locations."}
            ]
            
            # Add recent conversation history
            for msg in session["messages"][-10:]:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
            
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"OpenAI error: {e}")
            return self._generate_smart_response(message)
    
    def _generate_smart_response(self, message: str) -> str:
        """Generate intelligent project-specific response"""
        message_lower = message.lower()
        
        # Greetings
        if any(word in message_lower for word in ["hello", "hi", "hey", "greetings"]):
            return "Hello! Welcome to ODOP Connect, your agricultural marketplace assistant! 🌾\n\nI can help you with:\n• Adding and managing products (for farmers)\n• Placing and tracking orders (for buyers)\n• Using AI features like Smart Product Hub and Crop Advisor\n• Participating in tenders and bulk orders\n• Understanding payments and escrow\n• Building your trust score\n• And much more!\n\nWhat would you like to know about?"
        
        # Product/Order management for farmers
        if any(word in message_lower for word in ["add", "create", "list"]) and any(word in message_lower for word in ["product", "item", "crop"]):
            return "📦 To add products as a farmer:\n\n1. Go to your Farmer Dashboard\n2. Click on 'Product Management' in the sidebar\n3. Click the 'Add Product' or '+ New Product' button\n4. Fill in the product details:\n   • Product name (e.g., 'Organic Tomatoes')\n   • Category (select from dropdown)\n   • Quantity available\n   • Price per unit\n   • Quality grade (or use AI detection)\n   • Description\n5. Upload clear photos of your product\n6. Click 'Submit' or 'Publish'\n\nYour product will be immediately visible to buyers! You can also use the Smart Product Hub for AI-powered pricing recommendations. 💡"
        
        # Order management
        if "order" in message_lower:
            if any(word in message_lower for word in ["farmer", "accept", "manage", "handle"]):
                return "📋 To manage orders as a farmer:\n\n1. Go to your Farmer Dashboard\n2. Click on 'Order Control' or 'Order Management'\n3. You'll see all pending orders\n4. For each order, you can:\n   • Click 'View Details' to see full information\n   • Click 'Accept' to confirm the order\n   • Click 'Reject' if you can't fulfill it\n5. After accepting:\n   • Update order status (Processing → Packed → Shipped)\n   • Add tracking information\n   • Mark as 'Delivered' when complete\n6. Payment will be released from escrow after delivery confirmation\n\nYou'll get notifications for new orders! 🔔"
            else:
                return "🛒 To place an order as a buyer:\n\n1. Go to 'Sourcing Space' from your Buyer Dashboard\n2. Search for products using filters:\n   • Product type\n   • Location\n   • Price range\n   • Quality grade\n3. Click on a product to view full details\n4. Review farmer's profile and trust score\n5. Click 'Place Order' button\n6. Enter the quantity you need\n7. Review total price and delivery terms\n8. Click 'Confirm Order'\n9. Complete payment (goes to secure escrow)\n\nThe farmer will receive your order and can accept or negotiate! 💰"
        
        # AI features
        if "ai" in message_lower or "smart" in message_lower or "intelligent" in message_lower:
            return "🤖 ODOP Connect has powerful AI features:\n\n**For Farmers:**\n• Smart Product Hub - AI pricing recommendations\n• Farm Insights - Farming guidance and analytics\n• Quality Detection - Automatic product grading\n• Yield Prediction - Forecast your harvest\n• Pest Detection - Identify crop diseases\n\n**For Buyers:**\n• AI Procurement - Smart purchasing recommendations\n• Demand Forecasting - Predict market needs\n• Supplier Matching - Find best farmers\n• Price Optimization - Get best deals\n\n**For Everyone:**\n• AI Chat Assistant (that's me!) - 24/7 help\n• Smart Notifications - Important alerts\n• Market Insights - Real-time analytics\n\nWhich AI feature would you like to learn more about?"
        
        # Tenders
        if "tender" in message_lower or "bid" in message_lower:
            return "📢 Tender System:\n\n**For Farmers (Bidding):**\n1. Go to 'Tender Bids Hub'\n2. Browse available tenders\n3. Click on a tender to see requirements\n4. Click 'Submit Proposal'\n5. Enter your offer (price, quantity, delivery time)\n6. Submit and wait for buyer's decision\n\n**For Buyers (Creating):**\n1. Go to 'Tender Hub'\n2. Click 'Create New Tender'\n3. Specify requirements:\n   • Product type and quantity\n   • Quality standards\n   • Delivery location and timeline\n   • Budget range\n4. Set proposal deadline\n5. Review incoming proposals\n6. Award contract to best farmer\n\nTenders are great for bulk purchases! 📦"
        
        # Payment/Escrow
        if any(word in message_lower for word in ["payment", "pay", "money", "escrow", "secure"]):
            return "💰 Payment & Escrow System:\n\n**How it works:**\n1. Buyer places order and pays\n2. Money goes to secure escrow (not to farmer yet)\n3. Farmer accepts order and prepares product\n4. Farmer ships the product\n5. Buyer receives and confirms delivery\n6. Money is released from escrow to farmer\n\n**Security Features:**\n• Funds held safely in escrow\n• Both parties protected\n• Dispute resolution available\n• Transaction history tracked\n• Refunds for issues\n\n**Access Escrow Hub:**\n• Farmers: Dashboard → Escrow Hub\n• Buyers: Dashboard → Payment Management\n\nYour money is always safe! 🔒"
        
        # Trust/Reputation
        if any(word in message_lower for word in ["trust", "reputation", "score", "rating", "review"]):
            return "⭐ Trust Score System:\n\n**How to build trust:**\n1. Complete your profile verification\n2. Upload identity documents\n3. Complete transactions successfully\n4. Deliver on time\n5. Maintain product quality\n6. Get positive reviews\n7. Respond quickly to messages\n8. Resolve issues professionally\n\n**Benefits of high trust score:**\n• More visibility in search\n• Higher buyer confidence\n• Better negotiation power\n• Access to premium features\n• Priority in tenders\n\n**Check your score:**\nGo to Dashboard → Trust & Identity\n\nBuild trust, grow your business! 🌟"
        
        # Getting started
        if any(word in message_lower for word in ["start", "begin", "new", "first time", "how to use"]):
            return "🚀 Getting Started with ODOP Connect:\n\n**For Farmers:**\n1. Complete your profile\n2. Add your first product\n3. Set competitive prices (use AI recommendations)\n4. Wait for orders or join tenders\n5. Manage orders and deliveries\n6. Build your trust score\n\n**For Buyers:**\n1. Complete your business profile\n2. Browse products in Sourcing Space\n3. Place your first order\n4. Track delivery\n5. Rate the farmer\n6. Build relationships\n\n**Need help?** Just ask me anything! I'm here 24/7 to guide you through the platform. What would you like to do first?"
        
        # Default helpful response
        return f"I understand you're asking about '{message[:50]}...'\n\nI'm your ODOP Connect assistant, and I can help you with:\n\n• **Product Management** - Adding, editing, listing products\n• **Order Management** - Placing, tracking, managing orders\n• **AI Features** - Smart pricing, crop advice, quality detection\n• **Tenders & Bulk Orders** - Bidding and procurement\n• **Payments & Escrow** - Secure transactions\n• **Trust & Reputation** - Building credibility\n• **Platform Navigation** - Finding features and tools\n\nCould you please be more specific about what you'd like to know? For example:\n- 'How do I add a product as a farmer?'\n- 'How do I place an order as a buyer?'\n- 'How does the escrow system work?'\n- 'How can I participate in tenders?'\n\nI'm here to help! 😊"
    
    async def get_conversation_summary(self, session_id: str) -> Dict[str, Any]:
        """Get conversation summary"""
        if session_id not in self.sessions:
            return {"error": "Session not found"}
        
        session = self.sessions[session_id]
        
        return {
            "session_id": session_id,
            "user_id": session["user_id"],
            "message_count": len(session["messages"]),
            "created_at": session["created_at"].isoformat(),
            "last_activity": session["last_activity"].isoformat()
        }
    
    def clear_session(self, session_id: str) -> bool:
        """Clear session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False
    
    def get_active_sessions(self) -> List[str]:
        """Get active sessions"""
        return list(self.sessions.keys())
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check"""
        return {
            "status": "healthy",
            "active_sessions": len(self.sessions),
            "has_openai": self.has_openai,
            "knowledge_loaded": True,
            "timestamp": datetime.now().isoformat()
        }

# Global instance
project_ai = ProjectTrainedAI()