# ========================================================================
#  Recommendation Service — Buyer & Farmer matching engine
# ========================================================================

import random
import hashlib
from typing import List
from app.schemas import (
    ProductInput,
    BuyerMatch,
    BuyerRecommendationResponse,
    BuyerNeedsInput,
    FarmerMatch,
    FarmerRecommendationResponse,
)

# ─── Mock Data Pools ────────────────────────────────────────────────────

MOCK_BUYERS = [
    {"id": "b-001", "name": "Rajesh Kumar", "company": "Spice Exports Ltd.", "districts": ["Jaipur", "Jodhpur", "Kota"], "categories": ["Spices", "Handicrafts"]},
    {"id": "b-002", "name": "Priya Sharma", "company": "Green Valley Foods", "districts": ["Lucknow", "Varanasi", "Agra"], "categories": ["Fruits", "Vegetables", "Grains"]},
    {"id": "b-003", "name": "Mohamed Ali", "company": "Southern Traders", "districts": ["Chennai", "Madurai", "Coimbatore"], "categories": ["Textiles", "Spices", "Coffee"]},
    {"id": "b-004", "name": "Sunil Patel", "company": "Gujarat Agro Corp", "districts": ["Ahmedabad", "Surat", "Rajkot"], "categories": ["Cotton", "Grains", "Oilseeds"]},
    {"id": "b-005", "name": "Ananya Das", "company": "Eastern Organic Hub", "districts": ["Kolkata", "Darjeeling", "Siliguri"], "categories": ["Tea", "Jute", "Rice"]},
    {"id": "b-006", "name": "Vikram Singh", "company": "Punjab Harvest Co.", "districts": ["Amritsar", "Ludhiana", "Chandigarh"], "categories": ["Wheat", "Dairy", "Fruits"]},
    {"id": "b-007", "name": "Meera Nair", "company": "Kerala Naturals", "districts": ["Kochi", "Trivandrum", "Calicut"], "categories": ["Spices", "Coconut", "Rubber"]},
    {"id": "b-008", "name": "Arun Reddy", "company": "Deccan Fresh Pvt Ltd", "districts": ["Hyderabad", "Warangal", "Nizamabad"], "categories": ["Turmeric", "Chilli", "Cotton"]},
]

MOCK_FARMERS = [
    {"id": "f-001", "name": "Ramesh Yadav", "district": "Varanasi", "crops": ["Wheat", "Rice", "Vegetables"], "rating": 4.5},
    {"id": "f-002", "name": "Lakshmi Devi", "district": "Madurai", "crops": ["Spices", "Rice", "Fruits"], "rating": 4.8},
    {"id": "f-003", "name": "Kamal Nath", "district": "Jaipur", "crops": ["Spices", "Handicrafts", "Grains"], "rating": 4.2},
    {"id": "f-004", "name": "Savita Kumari", "district": "Kochi", "crops": ["Coconut", "Spices", "Rubber"], "rating": 4.7},
    {"id": "f-005", "name": "Bhushan Patil", "district": "Pune", "crops": ["Grains", "Oilseeds", "Fruits"], "rating": 4.3},
    {"id": "f-006", "name": "Geeta Rani", "district": "Amritsar", "crops": ["Wheat", "Dairy", "Cotton"], "rating": 4.6},
    {"id": "f-007", "name": "Vinod Kumar", "district": "Lucknow", "crops": ["Mango", "Vegetables", "Grains"], "rating": 4.1},
    {"id": "f-008", "name": "Padma Reddy", "district": "Hyderabad", "crops": ["Turmeric", "Chilli", "Rice"], "rating": 4.9},
]


def _score_seed(text: str) -> int:
    return int(hashlib.md5(text.encode()).hexdigest()[:8], 16)


def recommend_buyers(product: ProductInput) -> BuyerRecommendationResponse:
    """
    Score and rank buyers based on product category, district proximity, and price fit.
    Production version would use collaborative filtering or content-based ML models.
    """
    scored: List[BuyerMatch] = []

    for buyer in MOCK_BUYERS:
        score = 0.0
        reasons = []

        # Category match (40% weight)
        if product.category in buyer["categories"]:
            score += 40
            reasons.append(f"Deals in {product.category}")

        # District proximity (30% weight)
        if product.district in buyer["districts"]:
            score += 30
            reasons.append(f"Operates in {product.district}")
        elif product.state and any(d for d in buyer["districts"]):
            score += 10
            reasons.append("Regional presence")

        # Random affinity factor to simulate collaborative filtering (30% weight)
        seed = _score_seed(f"{buyer['id']}-{product.product_name}")
        random.seed(seed)
        affinity = random.uniform(10, 30)
        score += affinity

        score = min(99, round(score, 1))

        if score >= 25:
            scored.append(BuyerMatch(
                buyer_id=buyer["id"],
                buyer_name=buyer["name"],
                company=buyer["company"],
                match_score=score,
                reason="; ".join(reasons) if reasons else "General market interest",
            ))

    scored.sort(key=lambda b: b.match_score, reverse=True)

    return BuyerRecommendationResponse(
        product_name=product.product_name,
        recommended_buyers=scored[:5],
    )


def recommend_farmers(needs: BuyerNeedsInput) -> FarmerRecommendationResponse:
    """
    Score and rank farmers based on buyer needs — category, price, district.
    """
    scored: List[FarmerMatch] = []

    for farmer in MOCK_FARMERS:
        score = 0.0

        # Category match (50%)
        if needs.category in farmer["crops"]:
            score += 50

        # District match (25%)
        if needs.preferred_district and farmer["district"] == needs.preferred_district:
            score += 25
        else:
            score += 5  # general availability

        # Rating bonus (15%)
        score += farmer["rating"] * 3

        # Random quantity/availability (10%)
        seed = _score_seed(f"{farmer['id']}-{needs.category}")
        random.seed(seed)
        avail_qty = round(random.uniform(20, 500), 1)
        price = round(random.uniform(needs.max_price * 0.6, needs.max_price * 1.2), 2)

        score = min(99, round(score, 1))

        if score >= 20:
            scored.append(FarmerMatch(
                farmer_id=farmer["id"],
                farmer_name=farmer["name"],
                district=farmer["district"],
                match_score=score,
                available_quantity=avail_qty,
                price_per_unit=price,
            ))

    scored.sort(key=lambda f: f.match_score, reverse=True)

    return FarmerRecommendationResponse(
        category=needs.category,
        recommended_farmers=scored[:5],
    )
