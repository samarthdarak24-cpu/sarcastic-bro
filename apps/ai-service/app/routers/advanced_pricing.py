"""
Advanced Dynamic Pricing API with Real ML Models
Production-grade pricing optimization using ensemble methods
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import sys
import os
from datetime import datetime, timedelta
import numpy as np

# Add ml_models to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from ml_models.price_predictor import get_price_predictor

router = APIRouter(prefix="/ai/pricing", tags=["Dynamic Pricing"])


class PricePredictionRequest(BaseModel):
    """Request model for price prediction"""
    product_name: str = Field(..., description="Product name")
    product_category: str = Field(..., description="Category: GRAIN, FRUIT, VEGETABLE, SPICE")
    quantity: float = Field(..., ge=0, description="Quantity in kg")
    quality_score: Optional[float] = Field(80.0, ge=0, le=100)
    district: Optional[str] = None
    state: Optional[str] = None
    current_price: Optional[float] = None
    harvest_date: Optional[str] = None


class DynamicPricingRequest(BaseModel):
    """Request for dynamic pricing optimization"""
    product_name: str
    current_price: float = Field(..., gt=0)
    inventory_level: float = Field(..., ge=0)
    competitor_price: Optional[float] = None
    demand_index: Optional[float] = Field(0.8, ge=0, le=2)
    season: Optional[str] = "kharif"


class MarketAnalysisRequest(BaseModel):
    """Request for comprehensive market analysis"""
    product_category: str
    district: str
    state: str
    time_horizon_days: int = Field(30, ge=7, le=90)


@router.post("/predict")
async def predict_price(request: PricePredictionRequest):
    """
    Predict optimal price using advanced ML models
    
    Features:
    - Ensemble prediction (GBM + Random Forest)
    - Confidence intervals
    - Market adjustment factors
    - Feature importance analysis
    """
    try:
        predictor = get_price_predictor()
        
        # Prepare input data
        input_data = {
            'product_name': request.product_name,
            'product_cate