"""
Negotiation AI Service - ODOP CONNECT
Simulates AI-driven negotiation strategies and counter-offers.
"""

import logging
import random
from typing import List, Dict, Any
from models import NegotiationRequest, NegotiationResponse

logger = logging.getLogger(__name__)

class NegotiationService:
    """Service for assisting in negotiation."""

    @staticmethod
    async def get_negotiation_strategy(request: NegotiationRequest) -> NegotiationResponse:
        """
        Simulate negotiation strategy using market and user metrics.
        """
        logger.info(f"Negotiating for {request.item_name} - Asking: {request.asking_price}")

        ask = request.asking_price
        mkt = request.market_price
        target = request.user_budget_or_target
        
        # Calculate optimal counter-offer
        diff = ask - target
        # AI logic: Step-by-step reduction
        if diff > 0:
            suggested_offer = ask - (diff * 0.4) # Suggest 40% reduction of gap
        else:
            suggested_offer = ask # Target is higher than asking? Accept.

        # Ensure we don't go below target (unless target is the goal)
        suggested_offer = max(suggested_offer, target)
        
        # Strategies based on price delta
        delta_mkt = ((suggested_offer - mkt) / mkt) * 100
        
        strategy = ""
        justification = ""
        
        if delta_mkt < 0:
            strategy = "Aggressive Anchoring. Emphasize bulk purchase and immediate settlement."
            justification = f"Proposed price is {abs(round(delta_mkt, 1))}% below current market node in this cluster."
        elif delta_mkt > 10:
            strategy = "Quality-First Pivot. Highlight superior grading and logistics speed."
            justification = f"Proposed price accounts for premium logistics and A-grade quality guarantee."
        else:
            strategy = "Balanced Equilibrium. Focus on long-term partnership nodes."
            justification = "Price aligns with current wholesale index and supply chain reliability."

        return NegotiationResponse(
            suggested_counter_offer=round(suggested_offer, 2),
            negotiation_strategy=strategy,
            confidence_of_success=random.randint(60, 88),
            market_justification=justification
        )
