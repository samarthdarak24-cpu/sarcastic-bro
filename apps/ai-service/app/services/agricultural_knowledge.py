"""
Agricultural Knowledge Base for AI Agents
"""

import json
import os
from typing import List, Dict, Any
import asyncio

class AgricultureKnowledgeBase:
    """Knowledge base for agricultural information"""
    
    def __init__(self):
        self.knowledge_data = []
        self.load_knowledge()
    
    def load_knowledge(self):
        """Load agricultural knowledge from various sources"""
        
        # Load from existing JSON file if available
        json_path = "app/data/agri-knowledge.json"
        if os.path.exists(json_path):
            try:
                with open(json_path, 'r') as f:
                    self.knowledge_data.extend(json.load(f))
            except Exception as e:
                print(f"Error loading knowledge from JSON: {e}")
        
        # Add comprehensive agricultural knowledge
        additional_knowledge = [
            {
                "title": "Rice Cultivation Best Practices",
                "content": "Rice requires flooded fields during growing season. Plant in well-prepared puddled fields. Maintain 2-5cm water depth. Use certified seeds. Apply fertilizers in splits: basal, tillering, and panicle initiation stages.",
                "category": "crop_cultivation",
                "crops": ["rice"],
                "season": "kharif",
                "keywords": ["rice", "paddy", "cultivation", "water", "fertilizer"]
            },
            {
                "title": "Wheat Planting Guidelines",
                "content": "Wheat is a rabi crop planted in October-December. Requires well-drained soil with pH 6.0-7.5. Seed rate: 100-125 kg/ha. Row spacing: 20-23 cm. Apply NPK fertilizers based on soil test. Irrigate at critical stages.",
                "category": "crop_cultivation", 
                "crops": ["wheat"],
                "season": "rabi",
                "keywords": ["wheat", "rabi", "planting", "irrigation", "NPK"]
            },
            {
                "title": "Tomato Disease Management",
                "content": "Common tomato diseases include early blight, late blight, and bacterial wilt. Use resistant varieties. Ensure proper spacing for air circulation. Apply copper-based fungicides preventively. Remove infected plants immediately.",
                "category": "disease_management",
                "crops": ["tomato"],
                "keywords": ["tomato", "disease", "blight", "fungicide", "resistant"]
            },
            {
                "title": "Onion Storage Techniques",
                "content": "Proper onion storage extends shelf life and reduces losses. Cure onions in field for 7-10 days. Store in well-ventilated areas with 65-70% humidity. Temperature should be 0-4°C for long-term storage. Avoid moisture and direct sunlight.",
                "category": "post_harvest",
                "crops": ["onion"],
                "keywords": ["onion", "storage", "curing", "humidity", "temperature"]
            },
            {
                "title": "Integrated Pest Management for Cotton",
                "content": "IPM for cotton includes monitoring pest levels, using pheromone traps, encouraging natural enemies, and judicious use of pesticides. Key pests: bollworm, aphids, whitefly. Use Bt cotton varieties and follow refuge requirements.",
                "category": "pest_management",
                "crops": ["cotton"],
                "keywords": ["cotton", "IPM", "bollworm", "Bt", "pheromone"]
            },
            {
                "title": "Soil Testing and Nutrient Management",
                "content": "Conduct soil tests every 2-3 years. Test for pH, organic carbon, available NPK, and micronutrients. Based on results, apply lime for acidic soils, gypsum for alkaline soils. Use organic manures to improve soil health.",
                "category": "soil_management",
                "keywords": ["soil", "testing", "pH", "nutrients", "organic", "lime"]
            },
            {
                "title": "Drip Irrigation Benefits and Setup",
                "content": "Drip irrigation saves 30-50% water compared to flood irrigation. Suitable for row crops, orchards, and vegetables. Components: water source, filtration, main line, sub-main, laterals, and emitters. Maintain proper pressure and clean filters regularly.",
                "category": "irrigation",
                "keywords": ["drip", "irrigation", "water", "emitters", "pressure", "filtration"]
            },
            {
                "title": "Organic Farming Principles",
                "content": "Organic farming avoids synthetic chemicals. Use organic manures, compost, and biofertilizers. Practice crop rotation and intercropping. Use biological pest control methods. Maintain soil health through organic matter addition.",
                "category": "organic_farming",
                "keywords": ["organic", "compost", "biofertilizers", "rotation", "biological"]
            },
            {
                "title": "Market Price Analysis for Farmers",
                "content": "Monitor daily market prices through government portals and apps. Consider transportation costs and market fees. Sell during peak demand periods. Use forward contracts for price security. Store produce when prices are low if storage facilities are available.",
                "category": "market_analysis",
                "keywords": ["market", "price", "selling", "contracts", "storage", "demand"]
            },
            {
                "title": "Climate-Smart Agriculture Practices",
                "content": "Adapt farming to climate change through drought-resistant varieties, water conservation, soil carbon sequestration, and diversified cropping systems. Use weather forecasts for planning. Implement conservation agriculture practices.",
                "category": "climate_smart",
                "keywords": ["climate", "drought", "conservation", "weather", "adaptation", "carbon"]
            },
            {
                "title": "Precision Agriculture Technologies",
                "content": "Use GPS, sensors, and drones for precise farming. Variable rate application of inputs based on field conditions. Soil mapping and yield monitoring. Remote sensing for crop health assessment. Data-driven decision making.",
                "category": "precision_agriculture",
                "keywords": ["precision", "GPS", "sensors", "drones", "mapping", "remote"]
            },
            {
                "title": "Livestock Integration with Crops",
                "content": "Integrate livestock with crop production for better resource utilization. Crop residues can feed animals. Animal manure improves soil fertility. Grazing can be managed in fallow fields. Mixed farming systems are more resilient.",
                "category": "integrated_farming",
                "keywords": ["livestock", "integration", "manure", "grazing", "mixed", "residues"]
            }
        ]
        
        self.knowledge_data.extend(additional_knowledge)
    
    async def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search knowledge base for relevant information"""
        query_lower = query.lower()
        scored_results = []
        
        for item in self.knowledge_data:
            score = 0
            
            # Search in title (highest weight)
            if query_lower in item.get('title', '').lower():
                score += 10
            
            # Search in content (medium weight)
            content = item.get('content', '').lower()
            query_words = query_lower.split()
            for word in query_words:
                if word in content:
                    score += 3
            
            # Search in keywords (high weight)
            keywords = item.get('keywords', [])
            for keyword in keywords:
                if keyword.lower() in query_lower:
                    score += 5
            
            # Search in category (medium weight)
            if query_lower in item.get('category', '').lower():
                score += 4
            
            # Search in crops (medium weight)
            crops = item.get('crops', [])
            for crop in crops:
                if crop.lower() in query_lower:
                    score += 4
            
            if score > 0:
                item_with_score = item.copy()
                item_with_score['relevance_score'] = score
                scored_results.append(item_with_score)
        
        # Sort by relevance score and return top results
        scored_results.sort(key=lambda x: x['relevance_score'], reverse=True)
        return scored_results[:limit]
    
    def get_categories(self) -> List[str]:
        """Get all available categories"""
        categories = set()
        for item in self.knowledge_data:
            if 'category' in item:
                categories.add(item['category'])
        return sorted(list(categories))
    
    def get_crops(self) -> List[str]:
        """Get all available crops"""
        crops = set()
        for item in self.knowledge_data:
            if 'crops' in item:
                crops.update(item['crops'])
        return sorted(list(crops))
    
    def get_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get all knowledge items by category"""
        return [item for item in self.knowledge_data if item.get('category') == category]
    
    def get_by_crop(self, crop: str) -> List[Dict[str, Any]]:
        """Get all knowledge items for a specific crop"""
        return [item for item in self.knowledge_data if crop.lower() in [c.lower() for c in item.get('crops', [])]]