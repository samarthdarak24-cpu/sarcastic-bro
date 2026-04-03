"""
Dynamic Pricing Service - ODOP CONNECT
Simulates dynamic pricing optimization based on inventory, expiry, and demand.
"""

import logging
import random
from typing import List, Optional, Dict, Any
from models import PricingRequest, PricingResponse

logger = logging.getLogger(__name__)

class PricingService:
    """Service for dynamic pricing."""

    @staticmethod
    async def optimize_pricing(request: PricingRequest) -> PricingResponse:
        """
        Simulate pricing optimization.
        """
        logger.info(f"Optimizing pricing for {request.product_id} - Inventory: {request.current_inventory}")

        base_price = request.cost_price * 1.2 # 20% default markup
        
        # Demand adjustments
        demand_factor = 1.0 + (request.local_demand_score - 50) / 100 # -0.5 to +0.5
        
        # Expiry/Perishability adjustments
        expiry_factor = 1.0
        if request.expiry_days is not None:
            if request.expiry_days <= 3:
                expiry_factor = 0.7 # 30% discount for near expiry
                reasoning = "High perishability risk detected. Liquidation pricing mode active."
            elif request.expiry_days <= 7:
                expiry_factor = 0.85
                reasoning = "Shelf-life optimization. Encouraging faster turnover."
            else:
                reasoning = "Healthy shelf-life node. Focus on margin maximization."
        else:
            reasoning = "Non-perishable inventory node detected. Stabilizing yield."

        # Final Price
        optimal_price = base_price * demand_factor * expiry_factor
        # Ensure we don't go below cost unless critical
        if expiry_factor > 0.7:
             optimal_price = max(optimal_price, request.cost_price * 1.05)
        
        delta_percent = ((optimal_price - base_price) / base_price) * 100
        margin = optimal_price - request.cost_price

        return PricingResponse(
            optimal_price=round(optimal_price, 2),
            price_delta_percent=round(delta_percent, 1),
            reasoning=reasoning,
            margin_estimate=round(margin, 2)
        )
