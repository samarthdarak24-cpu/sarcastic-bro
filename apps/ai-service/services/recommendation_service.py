"""
Recommendation Service - Buyer and supplier matching using ML simulation.
ODOP CONNECT - Agri-Tech Platform
"""

import random
import time
from typing import List
from models import (
    BuyerRecommendationResponse,
    BuyerRecommendationRequest,
    RecommendedFarmer,
    SupplierRecommendationResponse,
    SupplierRecommendationRequest,
    RecommendedBuyer,
    MarketOpportunity,
    DemandLevel,
)


class RecommendationService:
    """Service for generating buyer and supplier recommendations."""

    # Mock farmer database
    MOCK_FARMERS = [
        {
            "id": "farmer_001",
            "name": "Rajesh Kumar",
            "distance": random.uniform(10, 200),
            "rating": random.uniform(3.5, 5.0),
            "reviews": random.randint(20, 300),
            "delivery_days": random.randint(1, 5),
            "products": ["Tomato", "Onion", "Bell Pepper", "Cucumber", "Carrot"],
        },
        {
            "id": "farmer_002",
            "name": "Priya Singh",
            "distance": random.uniform(10, 200),
            "rating": random.uniform(3.5, 5.0),
            "reviews": random.randint(20, 300),
            "delivery_days": random.randint(1, 5),
            "products": ["Mango", "Banana", "Orange", "Guava", "Papaya"],
        },
        {
            "id": "farmer_003",
            "name": "Manoj Patel",
            "distance": random.uniform(10, 200),
            "rating": random.uniform(3.5, 5.0),
            "reviews": random.randint(20, 300),
            "delivery_days": random.randint(1, 5),
            "products": ["Wheat", "Rice", "Corn", "Barley", "Oats"],
        },
        {
            "id": "farmer_004",
            "name": "Sunita Desai",
            "distance": random.uniform(10, 200),
            "rating": random.uniform(3.5, 5.0),
            "reviews": random.randint(20, 300),
            "delivery_days": random.randint(1, 5),
            "products": ["Arhar", "Gram", "Moong", "Urad", "Masoor"],
        },
        {
            "id": "farmer_005",
            "name": "Vikram Rao",
            "distance": random.uniform(10, 200),
            "rating": random.uniform(3.5, 5.0),
            "reviews": random.randint(20, 300),
            "delivery_days": random.randint(1, 5),
            "products": ["Tomato", "Capsicum", "Broccoli", "Cauliflower", "Spinach"],
        },
    ]

    # Mock buyer database
    MOCK_BUYERS = [
        {
            "id": "buyer_001",
            "name": "Fresh Foods Ltd",
            "annual_purchase": 500000,
            "avg_order": random.uniform(30000, 100000),
            "reliability": random.randint(85, 100),
            "payment_days": random.randint(5, 30),
        },
        {
            "id": "buyer_002",
            "name": "Organic Markets",
            "annual_purchase": 300000,
            "avg_order": random.uniform(25000, 75000),
            "reliability": random.randint(80, 100),
            "payment_days": random.randint(7, 30),
        },
        {
            "id": "buyer_003",
            "name": "Retail Chain India",
            "annual_purchase": 1000000,
            "avg_order": random.uniform(50000, 150000),
            "reliability": random.randint(90, 100),
            "payment_days": random.randint(3, 15),
        },
        {
            "id": "buyer_004",
            "name": "Restaurant Group",
            "annual_purchase": 200000,
            "avg_order": random.uniform(15000, 50000),
            "reliability": random.randint(75, 95),
            "payment_days": random.randint(10, 40),
        },
        {
            "id": "buyer_005",
            "name": "Export Merchants",
            "annual_purchase": 800000,
            "avg_order": random.uniform(60000, 120000),
            "reliability": random.randint(88, 100),
            "payment_days": random.randint(5, 20),
        },
    ]

    # Market opportunities patterns
    MARKET_OPPORTUNITIES = [
        {
            "opportunity": "Organic certification premium market",
            "demand": "HIGH",
            "price_range": {"min": 50, "max": 100},
            "trend": "Peak demand in monsoon season",
        },
        {
            "opportunity": "Export markets (Gulf/Southeast Asia)",
            "demand": "HIGH",
            "price_range": {"min": 60, "max": 120},
            "trend": "Year-round demand with seasonal peaks",
        },
        {
            "opportunity": "Direct-to-consumer (D2C) channels",
            "demand": "MEDIUM",
            "price_range": {"min": 40, "max": 80},
            "trend": "Growing trend in urban areas",
        },
        {
            "opportunity": "Food processing industry",
            "demand": "MEDIUM",
            "price_range": {"min": 25, "max": 50},
            "trend": "Steady demand with bulk orders",
        },
        {
            "opportunity": "Hotel and restaurant supply",
            "demand": "MEDIUM",
            "price_range": {"min": 35, "max": 70},
            "trend": "Fluctuates with tourism seasons",
        },
    ]

    @staticmethod
    def _calculate_farmer_match_score(
        farmer: dict,
        budget_min: float = None,
        budget_max: float = None,
        location: str = None,
        categories: List[str] = None,
        search_query: str = None,
    ) -> int:
        """
        Calculate match score for a farmer based on buyer criteria.
        
        Args:
            farmer: Farmer data dictionary
            budget_min: Minimum budget
            budget_max: Maximum budget
            location: Preferred location
            categories: Preferred categories
            search_query: Search query string
            
        Returns:
            Match score 0-100
        """
        score = 50  # Base score

        # Rating bonus
        score += (farmer["rating"] / 5.0) * 20

        # Review count bonus
        score += min(15, (farmer["reviews"] / 100) * 15)

        # Delivery days bonus
        delivery_bonus = max(0, (5 - farmer["delivery_days"]) * 3)
        score += delivery_bonus

        # Product match bonus
        if categories:
            matching_products = sum(1 for p in farmer["products"] if p.lower() in [c.lower() for c in categories])
            score += (matching_products / max(len(categories), 1)) * 15

        # Search query match
        if search_query:
            query_lower = search_query.lower()
            for product in farmer["products"]:
                if query_lower in product.lower():
                    score += 10
                    break

        # Budget match (if specified)
        if budget_min and budget_max:
            farmer_avg_price = random.uniform(budget_min * 0.8, budget_max * 1.2)
            if budget_min <= farmer_avg_price <= budget_max:
                score += 15

        return min(100, int(score))

    @staticmethod
    def _calculate_buyer_attractiveness(
        buyer: dict, quantity: int, product_type: str
    ) -> int:
        """
        Calculate attractiveness score for a buyer from farmer perspective.
        
        Args:
            buyer: Buyer data dictionary
            quantity: Required quantity
            product_type: Type of product
            
        Returns:
            Attractiveness score 0-100
        """
        score = 50  # Base score

        # Reliability bonus
        score += (buyer["reliability"] / 100) * 25

        # Payment days score (lower = better)
        payment_bonus = max(0, (30 - buyer["payment_days"]) / 30 * 20)
        score += payment_bonus

        # Order value alignment
        if buyer["avg_order"] >= quantity * 30:  # Assumes 30 as average unit price
            score += 15

        # Annual volume capacity
        if buyer["annual_purchase"] > 500000:
            score += 10

        return min(100, int(score))

    @staticmethod
    async def get_buyer_recommendations(
        request: BuyerRecommendationRequest,
    ) -> BuyerRecommendationResponse:
        """
        Generate buyer recommendations for farmers.
        
        Args:
            request: BuyerRecommendationRequest
            
        Returns:
            BuyerRecommendationResponse with recommended farmers
        """
        start_time = time.time()

        recommended_farmers = []

        # Calculate match scores for all mock farmers
        farmers_with_scores = []
        for farmer in RecommendationService.MOCK_FARMERS:
            match_score = RecommendationService._calculate_farmer_match_score(
                farmer,
                budget_min=request.budget_min,
                budget_max=request.budget_max,
                location=request.location,
                categories=request.preferred_categories,
                search_query=request.search_query,
            )
            farmers_with_scores.append((farmer, match_score))

        # Sort by match score and take top 3-5
        farmers_with_scores.sort(key=lambda x: x[1], reverse=True)
        top_farmers = farmers_with_scores[:random.randint(3, 5)]

        # Build recommendations
        for farmer, match_score in top_farmers:
            recommended_farmers.append(
                RecommendedFarmer(
                    farmer_id=farmer["id"],
                    farmer_name=farmer["name"],
                    distance_km=round(farmer["distance"], 1),
                    rating=round(farmer["rating"], 2),
                    reviews_count=farmer["reviews"],
                    avg_delivery_days=farmer["delivery_days"],
                    products_count=len(farmer["products"]),
                    match_score=match_score,
                    recommended_products=random.sample(
                        farmer["products"], min(3, len(farmer["products"]))
                    ),
                )
            )

        # Calculate estimated cost
        estimated_cost = request.quantity * random.uniform(20, 80)

        # Generate recommendation reason
        reasons = [
            f"High match ({random.randint(85, 100)}%) with your requirements",
            "Excellent delivery record and customer satisfaction",
            "Competitive pricing and reliable supply",
            "Optimal location and logistics advantage",
            "Strong product quality history",
        ]
        recommendations_reason = random.choice(reasons)

        return BuyerRecommendationResponse(
            farmers=recommended_farmers,
            recommendations_reason=recommendations_reason,
            estimated_cost=round(estimated_cost, 2),
        )

    @staticmethod
    async def get_supplier_recommendations(
        request: SupplierRecommendationRequest,
    ) -> SupplierRecommendationResponse:
        """
        Generate supplier recommendations for farmers.
        
        Args:
            request: SupplierRecommendationRequest
            
        Returns:
            SupplierRecommendationResponse with recommended buyers
        """
        start_time = time.time()

        recommended_buyers = []

        # Calculate attractiveness scores for all mock buyers
        buyers_with_scores = []
        for buyer in RecommendationService.MOCK_BUYERS:
            attractiveness_score = RecommendationService._calculate_buyer_attractiveness(
                buyer, int(request.current_area_managed * 5000), request.product_type
            )
            buyers_with_scores.append((buyer, attractiveness_score))

        # Sort by attractiveness and take top 3-5
        buyers_with_scores.sort(key=lambda x: x[1], reverse=True)
        top_buyers = buyers_with_scores[:random.randint(3, 5)]

        # Build buyer recommendations
        for buyer, attractiveness_score in top_buyers:
            volume_needed = int(request.current_area_managed * random.uniform(3000, 8000))
            recommended_buyers.append(
                RecommendedBuyer(
                    buyer_id=buyer["id"],
                    buyer_name=buyer["name"],
                    annual_purchase=int(buyer["annual_purchase"]),
                    avg_order_value=int(buyer["avg_order"]),
                    reliability_score=buyer["reliability"],
                    payment_days=buyer["payment_days"],
                    volume_needed=volume_needed,
                )
            )

        # Generate market opportunities
        market_opportunities = []
        selected_opportunities = random.sample(
            RecommendationService.MARKET_OPPORTUNITIES, random.randint(2, 4)
        )
        for opp in selected_opportunities:
            market_opportunities.append(
                MarketOpportunity(
                    opportunity=opp["opportunity"],
                    demand_level=DemandLevel(opp["demand"]),
                    recommended_price_range=opp["price_range"],
                    seasonal_trend=opp["trend"],
                )
            )

        return SupplierRecommendationResponse(
            buyers=recommended_buyers,
            market_opportunities=market_opportunities,
        )
