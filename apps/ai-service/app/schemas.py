# ========================================================================
#  Pydantic Schemas — ODOP Connect AI Service
# ========================================================================

from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
import datetime


# ─── Quality Grading ────────────────────────────────────────────────────

class QualityGrade(str, Enum):
    A = "A"
    B = "B"
    C = "C"

class QualityGradingResponse(BaseModel):
    grade: QualityGrade
    confidence: float = Field(..., ge=0, le=1)
    heatmap_data: List[List[float]]
    analysis_notes: str

# ─── Buyer Recommendation ──────────────────────────────────────────────

class ProductInput(BaseModel):
    product_name: str
    category: str
    price: float
    district: str
    state: str
    quantity: float = 100.0

class BuyerMatch(BaseModel):
    buyer_id: str
    buyer_name: str
    company: str
    match_score: float = Field(..., ge=0, le=100)
    reason: str

class BuyerRecommendationResponse(BaseModel):
    product_name: str
    recommended_buyers: List[BuyerMatch]

# ─── Farmer Recommendation ─────────────────────────────────────────────

class BuyerNeedsInput(BaseModel):
    category: str
    quantity_needed: float
    max_price: float
    preferred_district: Optional[str] = None

class FarmerMatch(BaseModel):
    farmer_id: str
    farmer_name: str
    district: str
    match_score: float = Field(..., ge=0, le=100)
    available_quantity: float
    price_per_unit: float

class FarmerRecommendationResponse(BaseModel):
    category: str
    recommended_farmers: List[FarmerMatch]

# ─── Demand Forecasting ────────────────────────────────────────────────

class ForecastInput(BaseModel):
    product_name: str
    category: str
    time_range_days: int = 30

class ForecastDataPoint(BaseModel):
    date: str
    predicted_demand: float
    confidence_lower: float
    confidence_upper: float

class DemandForecastResponse(BaseModel):
    product_name: str
    time_range_days: int
    forecast: List[ForecastDataPoint]
    trend: str  # "rising" | "falling" | "stable"
    peak_date: str

# ─── XAI Heatmaps ──────────────────────────────────────────────────────

class HeatmapResponse(BaseModel):
    width: int
    height: int
    overlay_matrix: List[List[float]]
    top_regions: List[dict]

# ─── Yield Prediction ──────────────────────────────────────────────────

class YieldInput(BaseModel):
    crop: str
    land_area_acres: float
    soil_type: str
    rainfall_mm: float
    irrigation: bool = False
    fertilizer_used: bool = True

class YieldPredictionResponse(BaseModel):
    crop: str
    predicted_yield_kg: float
    yield_per_acre: float
    confidence: float
    recommendations: List[str]

# ─── Pest Detection ────────────────────────────────────────────────────

class PestDetectionResponse(BaseModel):
    pest_detected: bool
    pest_type: Optional[str]
    confidence: float
    severity: str  # "low" | "medium" | "high" | "none"
    treatment_suggestions: List[str]

# ─── Dynamic Pricing ───────────────────────────────────────────────────

class PricingInput(BaseModel):
    product_name: str
    category: str
    current_supply: float
    current_demand: float
    base_price: float
    season: str = "kharif"

class PriceCurvePoint(BaseModel):
    quantity: float
    suggested_price: float

class DynamicPricingResponse(BaseModel):
    product_name: str
    optimal_price: float
    min_price: float
    max_price: float
    price_curve: List[PriceCurvePoint]
    market_signal: str  # "buy" | "sell" | "hold"

# ─── Crop Rotation ─────────────────────────────────────────────────────

class CropRotationInput(BaseModel):
    soil_type: str
    previous_crops: List[str]
    season: str = "kharif"
    land_area_acres: float = 5.0

class CropSuggestion(BaseModel):
    crop_name: str
    suitability_score: float = Field(..., ge=0, le=100)
    expected_yield_per_acre: float
    market_price_estimate: float
    reason: str

class CropRotationResponse(BaseModel):
    soil_type: str
    suggestions: List[CropSuggestion]
