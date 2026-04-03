"""
Yield Prediction Service - ODOP CONNECT
Simulates crop yield prediction based on environmental and farm data.
"""

import logging
import random
from typing import List, Dict, Any
from models import YieldPredictionResponse

logger = logging.getLogger(__name__)

class YieldService:
    """Service for predicting agricultural yield."""

    @staticmethod
    async def predict_yield(
        crop_type: str,
        district: str,
        area_ha: float,
        soil_type: str,
        rainfall_mm: float,
        fertilizer_used_kg: float
    ) -> YieldPredictionResponse:
        """
        Simulate yield prediction using environmental factors.
        In a real scenario, this would call a ML model (Scikit-Learn/TensorFlow).
        """
        logger.info(f"Predicting yield for {crop_type} in {district} (Area: {area_ha}ha)")

        # Base yield constants (KG per hectare)
        BASE_YIELDS = {
            "Tomato": 25000,
            "Wheat": 3500,
            "Rice": 4000,
            "Potato": 20000,
            "Onion": 18000
        }

        base_yield = BASE_YIELDS.get(crop_type, 5000)
        
        # Environmental multipliers
        soil_multiplier = 1.1 if soil_type.lower() in ["black", "alluvial"] else 0.9
        rain_multiplier = 1.05 if 600 <= rainfall_mm <= 1200 else 0.85
        fert_multiplier = 1.15 if fertilizer_used_kg / area_ha >= 100 else 0.95

        # Calculate final yield
        total_yield_kg = base_yield * area_ha * soil_multiplier * rain_multiplier * fert_multiplier
        # Add random noise for "AI" feel
        total_yield_kg *= (1 + (random.random() * 0.1 - 0.05))

        # Soil health logic
        soil_health = int(soil_multiplier * 80 + (random.random() * 10))

        # Recommendations
        adjustments = []
        if rain_multiplier < 1.0:
            adjustments.append("Increase micro-irrigation frequency during dry spells")
        if fert_multiplier < 1.0:
            adjustments.append("Consider NPK 19-19-19 fertilization for better root development")
        if soil_health < 75:
            adjustments.append("Apply organic mulch to improve soil moisture retention")
        
        if not adjustments:
            adjustments.append("Maintain current cultivation protocol - optimal conditions detected")

        return YieldPredictionResponse(
            predicted_yield_kg=round(total_yield_kg, 2),
            confidence_score=random.randint(85, 96),
            soil_health_score=min(100, soil_health),
            suggested_adjustments=adjustments
        )
