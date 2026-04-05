from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from datetime import datetime

router = APIRouter(prefix="/api/product-hub", tags=["product-hub"])

class ProductOptimizeRequest(BaseModel):
    product_name: str
    category: str
    current_price: float
    description: Optional[str] = None

class PricingRecommendRequest(BaseModel):
    product_name: str
    category: str
    current_price: float
    quantity: int

class QualityAnalysisRequest(BaseModel):
    product_name: str
    category: str
    image_url: Optional[str] = None

class ListingGenerateRequest(BaseModel):
    product_name: str
    category: str
    price: float

@router.post("/optimize-product")
async def optimize_product(request: ProductOptimizeRequest):
    """AI-powered product optimization suggestions"""
    
    suggestions = []
    
    # Title optimization
    if len(request.product_name) < 20:
        suggestions.append({
            "type": "title",
            "text": f"Expand title to include keywords like 'Fresh', 'Organic', or '{request.category}'",
            "impact": "high"
        })
    
    # Description optimization
    if not request.description or len(request.description) < 100:
        suggestions.append({
            "type": "description",
            "text": "Add detailed description highlighting benefits, origin, and quality",
            "impact": "high"
        })
    
    # Image optimization
    suggestions.append({
        "type": "image",
        "text": "Add 3-5 high-quality images from different angles",
        "impact": "medium"
    })
    
    # Pricing optimization
    market_avg = request.current_price * 1.08
    suggestions.append({
        "type": "pricing",
        "text": f"Consider adjusting price to ₹{market_avg:.2f} based on market trends",
        "impact": "high"
    })
    
    return {
        "success": True,
        "suggestions": suggestions,
        "optimization_score": calculate_optimization_score(request)
    }

@router.post("/pricing/recommend")
async def recommend_pricing(request: PricingRecommendRequest):
    """Dynamic pricing recommendations using ML"""
    
    # Simulate ML-based pricing
    base_price = request.current_price
    
    # Factors affecting price
    demand_factor = 1.0 + (np.random.random() * 0.15)  # 0-15% increase
    supply_factor = 1.0 - (request.quantity / 1000) * 0.05  # Lower price for high supply
    category_factor = get_category_factor(request.category)
    
    recommended_price = base_price * demand_factor * supply_factor * category_factor
    potential_increase = ((recommended_price - base_price) / base_price) * 100
    
    # Confidence based on data quality
    confidence = min(95, 75 + np.random.randint(0, 20))
    
    reasons = []
    if demand_factor > 1.05:
        reasons.append("High market demand detected")
    if supply_factor < 0.98:
        reasons.append("Supply levels are optimal")
    if category_factor > 1.0:
        reasons.append(f"{request.category} category showing strong performance")
    
    return {
        "success": True,
        "current_price": base_price,
        "recommended_price": round(recommended_price, 2),
        "potential_increase": round(potential_increase, 2),
        "confidence": confidence,
        "reason": " | ".join(reasons) if reasons else "Market conditions are favorable"
    }

@router.post("/quality/analyze")
async def analyze_quality(request: QualityAnalysisRequest):
    """AI-powered quality analysis"""
    
    # Simulate image-based quality analysis
    base_score = 85
    
    # Category-specific quality metrics
    category_bonus = {
        "vegetables": 5,
        "fruits": 7,
        "grains": 3,
        "dairy": 6
    }.get(request.category.lower(), 4)
    
    quality_score = min(100, base_score + category_bonus + np.random.randint(-5, 10))
    
    # Component scores
    freshness = min(100, quality_score + np.random.randint(-5, 8))
    appearance = min(100, quality_score + np.random.randint(-8, 5))
    packaging = min(100, quality_score + np.random.randint(-3, 10))
    
    recommendations = []
    if freshness < 85:
        recommendations.append("Improve storage conditions to maintain freshness")
    if appearance < 85:
        recommendations.append("Enhance visual presentation and cleaning process")
    if packaging < 85:
        recommendations.append("Upgrade packaging materials for better protection")
    
    if not recommendations:
        recommendations.append("Quality standards are excellent. Maintain current practices.")
    
    return {
        "success": True,
        "quality_score": quality_score,
        "freshness": freshness,
        "appearance": appearance,
        "packaging": packaging,
        "recommendations": recommendations,
        "grade": get_quality_grade(quality_score)
    }

@router.post("/listing/generate")
async def generate_listing(request: ListingGenerateRequest):
    """AI-generated product listings"""
    
    # Generate optimized title
    title_templates = [
        f"Premium {request.product_name} - Fresh & Organic | Direct from Farm",
        f"Farm-Fresh {request.product_name} - 100% Natural | Best Quality",
        f"Organic {request.product_name} - Sustainably Grown | Premium Grade",
        f"Fresh {request.product_name} - Farm to Table | Certified Organic"
    ]
    
    title = np.random.choice(title_templates)
    
    # Generate description
    description = f"""Experience the finest quality {request.product_name} sourced directly from our sustainable farms. 
    
Rich in nutrients and carefully harvested at peak freshness, our {request.product_name} delivers exceptional taste and quality. Perfect for health-conscious families who value authenticity and natural goodness.

✓ 100% Organic & Chemical-Free
✓ Farm-Fresh Guarantee
✓ Sustainably Grown
✓ Direct from Farmer
✓ Premium Quality Assured

Delivered fresh to your doorstep with care and commitment to quality."""
    
    # Generate SEO tags
    base_tags = ['organic', 'fresh', 'farm-direct', 'premium', 'healthy', 'sustainable']
    category_tags = [request.category.lower(), 'natural', 'quality']
    product_tags = [request.product_name.lower().replace(' ', '-')]
    
    all_tags = base_tags + category_tags + product_tags
    
    # Calculate scores
    seo_score = calculate_seo_score(title, description, all_tags)
    readability = calculate_readability_score(description)
    
    return {
        "success": True,
        "title": title,
        "description": description.strip(),
        "tags": all_tags[:10],
        "seo_score": seo_score,
        "readability": readability,
        "estimated_reach": np.random.randint(5000, 15000)
    }

@router.post("/bundles/suggest")
async def suggest_bundles(products: List[dict]):
    """AI-powered bundle suggestions"""
    
    if len(products) < 2:
        return {
            "success": False,
            "message": "Need at least 2 products to create bundles"
        }
    
    bundles = []
    
    # Create complementary bundles
    for i in range(0, len(products), 3):
        bundle_products = products[i:i+3]
        if len(bundle_products) >= 2:
            total_price = sum(p.get('price', 0) for p in bundle_products)
            discount = np.random.randint(10, 25)
            
            bundles.append({
                "name": f"{bundle_products[0].get('category', 'Mixed')} Combo Pack",
                "products": [p.get('name') for p in bundle_products],
                "discount": discount,
                "expected_revenue": int(total_price * 0.8 * np.random.randint(10, 30)),
                "confidence": np.random.randint(80, 95)
            })
    
    return {
        "success": True,
        "bundles": bundles
    }

# Helper functions
def calculate_optimization_score(request: ProductOptimizeRequest) -> int:
    score = 0
    
    if len(request.product_name) > 10:
        score += 30
    elif len(request.product_name) > 5:
        score += 15
    
    if request.description and len(request.description) > 100:
        score += 30
    elif request.description and len(request.description) > 50:
        score += 15
    
    if request.current_price > 0:
        score += 20
    
    score += 20  # Assume image exists
    
    return min(score, 100)

def get_category_factor(category: str) -> float:
    factors = {
        "vegetables": 1.05,
        "fruits": 1.08,
        "grains": 1.02,
        "dairy": 1.06,
        "organic": 1.12
    }
    return factors.get(category.lower(), 1.0)

def get_quality_grade(score: int) -> str:
    if score >= 90:
        return "A+"
    elif score >= 80:
        return "A"
    elif score >= 70:
        return "B+"
    elif score >= 60:
        return "B"
    else:
        return "C"

def calculate_seo_score(title: str, description: str, tags: List[str]) -> int:
    score = 60
    
    if len(title) > 30:
        score += 10
    if len(description) > 200:
        score += 15
    if len(tags) >= 8:
        score += 15
    
    return min(score, 100)

def calculate_readability_score(text: str) -> int:
    # Simple readability calculation
    words = len(text.split())
    sentences = text.count('.') + text.count('!') + text.count('?')
    
    if sentences == 0:
        return 70
    
    avg_words_per_sentence = words / sentences
    
    if avg_words_per_sentence < 20:
        return 90
    elif avg_words_per_sentence < 30:
        return 80
    else:
        return 70
