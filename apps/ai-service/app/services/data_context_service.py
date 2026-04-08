"""
Data Context Service - Fetches real-time data from backend APIs
Enables AI to access live system data for intelligent responses
"""

import httpx
import logging
from typing import Any, Dict, List, Optional
from enum import Enum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IntentType(Enum):
    """Types of user intents"""
    GENERAL_QUESTION = "general_question"
    DATA_QUERY = "data_query"
    CREATE_ACTION = "create_action"
    UPDATE_ACTION = "update_action"
    DELETE_ACTION = "delete_action"

class EntityType(Enum):
    """Types of entities in the system"""
    PRODUCT = "product"
    ORDER = "order"
    PAYMENT = "payment"
    USER = "user"
    TENDER = "tender"
    MARKET = "market"
    CART = "cart"

class DataContextService:
    """Service to fetch real-time data from backend APIs"""
    
    def __init__(self, api_base_url: str = "http://localhost:3001"):
        self.api_base_url = api_base_url
        self.http_client = httpx.AsyncClient(timeout=10.0)
    
    async def detect_intent(self, message: str) -> Dict[str, Any]:
        """
        Detect user intent from message
        Returns intent type, entity type, and action flags
        """
        message_lower = message.lower()
        
        # Data query patterns (READ operations)
        data_query_keywords = {
            "show", "display", "view", "get", "find", "check", "list", "see",
            "दिखाओ", "देखो", "खोजो", "चेक करो", "देखें",
            "दाखवा", "पहा", "शोधा", "तपासा"
        }
        
        # Create action patterns (CREATE operations)
        create_keywords = {
            "add", "create", "new", "list", "post", "sell", "make",
            "जोड़ो", "बनाओ", "नया", "बेचो", "बनाएं",
            "जोडा", "तयार करा", "नवीन", "विक्री"
        }
        
        # Update action patterns (UPDATE operations)
        update_keywords = {
            "update", "edit", "change", "modify", "set", "alter",
            "अपडेट", "बदलो", "सेट करो", "बदलें",
            "अपडेट", "बदला", "सेट करा"
        }
        
        # Delete action patterns (DELETE operations)
        delete_keywords = {
            "delete", "remove", "cancel", "drop", "clear",
            "हटाओ", "रद्द करो", "मिटाओ", "हटाएं",
            "हटवा", "रद्द करा", "काढा"
        }
        
        # Entity detection keywords
        entity_keywords = {
            EntityType.PRODUCT: ["product", "item", "crop", "produce", "listing", "प्रोडक्ट", "उत्पादन", "वस्तु"],
            EntityType.ORDER: ["order", "purchase", "buy", "booking", "ऑर्डर", "खरीदी", "खरीद"],
            EntityType.PAYMENT: ["payment", "money", "pay", "transaction", "balance", "escrow", "पेमेंट", "पैसे", "लेनदेन"],
            EntityType.USER: ["profile", "account", "user", "details", "प्रोफाइल", "खाता", "विवरण"],
            EntityType.TENDER: ["tender", "bid", "proposal", "टेंडर", "बोली", "प्रस्ताव"],
            EntityType.MARKET: ["price", "market", "rate", "trend", "forecast", "कीमत", "बाजार", "दर"],
            EntityType.CART: ["cart", "basket", "कार्ट", "टोकरी"]
        }
        
        # Detect intent type
        intent_type = IntentType.GENERAL_QUESTION
        
        if any(keyword in message_lower for keyword in data_query_keywords):
            intent_type = IntentType.DATA_QUERY
        elif any(keyword in message_lower for keyword in create_keywords):
            intent_type = IntentType.CREATE_ACTION
        elif any(keyword in message_lower for keyword in update_keywords):
            intent_type = IntentType.UPDATE_ACTION
        elif any(keyword in message_lower for keyword in delete_keywords):
            intent_type = IntentType.DELETE_ACTION
        
        # Detect entity type
        entity_type = None
        for entity, keywords in entity_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                entity_type = entity
                break
        
        return {
            "intent_type": intent_type.value,
            "entity_type": entity_type.value if entity_type else None,
            "requires_data": intent_type == IntentType.DATA_QUERY,
            "requires_confirmation": intent_type in [
                IntentType.CREATE_ACTION, 
                IntentType.UPDATE_ACTION, 
                IntentType.DELETE_ACTION
            ],
            "is_safe_operation": intent_type == IntentType.DATA_QUERY
        }
    
    async def fetch_user_data(
        self, 
        user_id: str, 
        entity_type: str, 
        auth_token: Optional[str] = None,
        filters: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Fetch user-specific data from backend APIs
        Supports products, orders, payments, market data, etc.
        """
        headers = {}
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        
        try:
            if entity_type == EntityType.PRODUCT.value:
                response = await self.http_client.get(
                    f"{self.api_base_url}/api/products",
                    params={"userId": user_id, **(filters or {})},
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True, 
                        "data": data.get("data", data),
                        "count": len(data.get("data", data)) if isinstance(data.get("data", data), list) else 1
                    }
            
            elif entity_type == EntityType.ORDER.value:
                response = await self.http_client.get(
                    f"{self.api_base_url}/api/orders",
                    params={"userId": user_id, **(filters or {})},
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True, 
                        "data": data.get("data", data),
                        "count": len(data.get("data", data)) if isinstance(data.get("data", data), list) else 1
                    }
            
            elif entity_type == EntityType.PAYMENT.value:
                response = await self.http_client.get(
                    f"{self.api_base_url}/api/payment/transactions",
                    params={"userId": user_id, **(filters or {})},
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True, 
                        "data": data.get("data", data),
                        "count": len(data.get("data", data)) if isinstance(data.get("data", data), list) else 1
                    }
            
            elif entity_type == EntityType.MARKET.value:
                response = await self.http_client.get(
                    f"{self.api_base_url}/api/market/rates",
                    params=filters or {},
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True, 
                        "data": data.get("data", data)
                    }
            
            elif entity_type == EntityType.TENDER.value:
                response = await self.http_client.get(
                    f"{self.api_base_url}/api/tender/list",
                    params=filters or {},
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True, 
                        "data": data.get("data", data),
                        "count": len(data.get("data", data)) if isinstance(data.get("data", data), list) else 1
                    }
            
            elif entity_type == EntityType.USER.value:
                response = await self.http_client.get(
                    f"{self.api_base_url}/api/users/{user_id}",
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True, 
                        "data": data.get("data", data)
                    }
            
            return {"success": False, "error": "Entity type not supported"}
            
        except httpx.TimeoutException:
            logger.error(f"Timeout fetching {entity_type} data for user {user_id}")
            return {"success": False, "error": "Request timeout"}
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching {entity_type} data: {e}")
            return {"success": False, "error": f"HTTP error: {str(e)}"}
        except Exception as e:
            logger.error(f"Error fetching {entity_type} data: {e}")
            return {"success": False, "error": str(e)}
    
    async def close(self):
        """Close HTTP client"""
        await self.http_client.aclose()

# Global instance
data_context_service = DataContextService()
