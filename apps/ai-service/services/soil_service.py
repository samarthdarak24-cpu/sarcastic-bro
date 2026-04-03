"""
Crop Rotation Service - ODOP CONNECT
Simulates crop rotation advice based on soil and seasonal history.
"""

import logging
import random
from typing import List, Dict, Any, Optional
from models import RotationRequest, RotationResponse

logger = logging.getLogger(__name__)

class SoilService:
    """Service for crop rotation advice."""

    @staticmethod
    async def get_rotation_advice(request: RotationRequest) -> RotationResponse:
        """
        Simulate crop rotation logic.
        """
        logger.info(f"Advising rotation for {request.current_crop} in {request.season}")

        current = request.current_crop.lower()
        
        # Simple rotation pairs
        ROTATION_SUITABILITY = {
            "tomato": ["Onion", "Garlic", "Cabbage"],
            "wheat": ["Gram", "Mustard", "Peas"],
            "rice": ["Urad Dal", "Moong Dal", "Groundnut"],
            "potato": ["Maize", "Spices", "Leafy Vegetables"]
        }

        # Select candidates
        candidates = ROTATION_SUITABILITY.get(current, ["Legumes", "Root Vegetables", "Tubers"])
        
        recommended = []
        for c in candidates:
            suitability = random.randint(75, 98)
            # Add district/soil modifiers
            if request.soil_ph and 6.0 <= request.soil_ph <= 7.0:
                 suitability = min(100, suitability + 5)
            
            recommended.append({
                "crop": c,
                "suitability_score": suitability,
                "expected_yield_kg_per_acre": random.randint(1200, 4500)
            })

        # Soil recovery estimation
        recovery = random.randint(80, 95) if "dal" in [c.lower() for c in candidates] or "gram" in [c.lower() for c in candidates] else random.randint(60, 80)

        return RotationResponse(
            recommended_crops=recommended,
            soil_recovery_estimate=recovery,
            expected_yield_multiplier=round(1.1 + (random.random() * 0.2), 2)
        )
