"""
Pydantic models for AI service request/response validation.
ODOP CONNECT - Agri-Tech Platform
"""

from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, validator
import re


# ============================================================================
# ENUMS
# ============================================================================

class ProductType(str, Enum):
    """Supported product types."""
    VEGETABLE = "VEGETABLE"
    FRUIT = "FRUIT"
    GRAIN = "GRAIN"
    PULSES = "PULSES"


class QualityGrade(str, Enum):
    """Quality grades for products."""
    A = "A"
    B = "B"
    C = "C"
    D = "D"


class ColorQuality(str, Enum):
    """Color quality levels."""
    EXCELLENT = "EXCELLENT"
    GOOD = "GOOD"
    FAIR = "FAIR"
    POOR = "POOR"


class HealthTrend(str, Enum):
    """Health trend indicators."""
    UP = "UP"
    DOWN = "DOWN"
    STABLE = "STABLE"


class DemandLevel(str, Enum):
    """Market demand levels."""
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class PestSeverity(str, Enum):
    """Pest severity levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class UrgencyLevel(str, Enum):
    """Urgency levels for pest detection."""
    NONE = "NONE"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


# ============================================================================
# QUALITY GRADE MODELS
# ============================================================================

class QualityGradeRequest(BaseModel):
    """Request model for quality grading endpoint."""
    image_url: str = Field(..., description="Base64 encoded image or URL")
    product_type: ProductType = Field(..., description="Type of product")
    product_name: str = Field(..., description="Name of the product", min_length=1, max_length=100)

    @validator("image_url")
    def validate_image_url(cls, v):
        """Validate image URL or base64 format."""
        if not v or len(v) == 0:
            raise ValueError("image_url cannot be empty")
        if len(v) > 10_000_000:  # 10MB limit
            raise ValueError("Image data exceeds 10MB limit")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "image_url": "data:image/jpeg;base64,/9j/4AAQSkZ...",
                "product_type": "VEGETABLE",
                "product_name": "Tomato"
            }
        }


class QualityGradeResponse(BaseModel):
    """Response model for quality grading."""
    grade: QualityGrade = Field(..., description="Quality grade A-D")
    score: int = Field(..., ge=0, le=100, description="Quality score 0-100")
    defects: int = Field(..., ge=0, description="Number of defects detected")
    color_quality: ColorQuality = Field(..., description="Color quality assessment")
    size_uniformity: int = Field(..., ge=0, le=100, description="Size uniformity score")
    freshness_score: int = Field(..., ge=0, le=100, description="Freshness assessment")
    damaged_percent: float = Field(..., ge=0, le=100, description="Percentage of damaged area")
    recommendations: List[str] = Field(..., description="Actionable recommendations")
    confidence: int = Field(..., ge=0, le=100, description="Confidence level of assessment")
    processing_time_ms: int = Field(..., ge=0, description="Processing time in milliseconds")
    bboxes: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Bounding boxes of detected objects/defects")
    disease: Optional[str] = Field("None", description="Detected disease name")

    class Config:
        json_schema_extra = {
            "example": {
                "grade": "A",
                "score": 92,
                "defects": 1,
                "color_quality": "EXCELLENT",
                "size_uniformity": 95,
                "freshness_score": 90,
                "damaged_percent": 2.5,
                "recommendations": [
                    "Store in cool environment",
                    "Rotate stock - FIFO"
                ],
                "confidence": 94,
                "processing_time_ms": 234
            }
        }


# ============================================================================
# BUYER RECOMMENDATIONS MODELS
# ============================================================================

class BuyerRecommendationRequest(BaseModel):
    """Request model for buyer recommendations."""
    buyer_id: str = Field(..., description="Unique buyer identifier", min_length=1)
    search_query: Optional[str] = Field(None, description="Search query for products")
    budget_min: Optional[float] = Field(None, ge=0, description="Minimum budget")
    budget_max: Optional[float] = Field(None, ge=0, description="Maximum budget")
    quantity: int = Field(..., gt=0, description="Quantity needed (in units)")
    location: Optional[str] = Field(None, description="Preferred location")
    preferred_categories: List[str] = Field(default_factory=list, description="Preferred product categories")

    @validator("budget_max")
    def validate_budget_range(cls, v, values):
        """Validate that budget_max >= budget_min."""
        if "budget_min" in values and values["budget_min"] is not None:
            if v is not None and v < values["budget_min"]:
                raise ValueError("budget_max must be >= budget_min")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "buyer_id": "buyer_123",
                "search_query": "organic tomatoes",
                "budget_min": 10000,
                "budget_max": 50000,
                "quantity": 500,
                "location": "Maharashtra",
                "preferred_categories": ["Organic", "Pesticide-Free"]
            }
        }


class RecommendedFarmer(BaseModel):
    """Model for recommended farmer details."""
    farmer_id: str = Field(..., description="Unique farmer identifier")
    farmer_name: str = Field(..., description="Farmer's name")
    distance_km: float = Field(..., ge=0, description="Distance from buyer")
    rating: float = Field(..., ge=0, le=5, description="Farmer rating 0-5")
    reviews_count: int = Field(..., ge=0, description="Number of reviews")
    avg_delivery_days: int = Field(..., ge=0, description="Average delivery time")
    products_count: int = Field(..., ge=0, description="Number of products available")
    match_score: int = Field(..., ge=0, le=100, description="Match score with buyer requirements")
    recommended_products: List[str] = Field(..., description="Recommended products from farmer")


class BuyerRecommendationResponse(BaseModel):
    """Response model for buyer recommendations."""
    farmers: List[RecommendedFarmer] = Field(..., description="List of recommended farmers")
    recommendations_reason: str = Field(..., description="Reason for recommendations")
    estimated_cost: float = Field(..., ge=0, description="Estimated total cost")

    class Config:
        json_schema_extra = {
            "example": {
                "farmers": [
                    {
                        "farmer_id": "f_001",
                        "farmer_name": "Rajesh Kumar",
                        "distance_km": 45.2,
                        "rating": 4.8,
                        "reviews_count": 128,
                        "avg_delivery_days": 2,
                        "products_count": 15,
                        "match_score": 96,
                        "recommended_products": ["Tomato", "Bell Pepper", "Cucumber"]
                    }
                ],
                "recommendations_reason": "High match with your requirements and excellent delivery record",
                "estimated_cost": 45000.00
            }
        }


# ============================================================================
# SUPPLIER RECOMMENDATIONS MODELS
# ============================================================================

class SupplierRecommendationRequest(BaseModel):
    """Request model for supplier recommendations."""
    farmer_id: str = Field(..., description="Unique farmer identifier")
    product_type: str = Field(..., description="Type of product cultivated")
    current_area_managed: float = Field(..., gt=0, description="Area managed in hectares")

    class Config:
        json_schema_extra = {
            "example": {
                "farmer_id": "farmer_456",
                "product_type": "Tomato",
                "current_area_managed": 2.5
            }
        }


class RecommendedBuyer(BaseModel):
    """Model for recommended buyer details."""
    buyer_id: str = Field(..., description="Unique buyer identifier")
    buyer_name: str = Field(..., description="Buyer's business name")
    annual_purchase: float = Field(..., ge=0, description="Annual purchase volume")
    avg_order_value: float = Field(..., ge=0, description="Average order value")
    reliability_score: int = Field(..., ge=0, le=100, description="Reliability score")
    payment_days: int = Field(..., ge=0, description="Days to settle payment")
    volume_needed: float = Field(..., ge=0, description="Volume buyer needs")


class MarketOpportunity(BaseModel):
    """Model for market opportunity."""
    opportunity: str = Field(..., description="Description of opportunity")
    demand_level: DemandLevel = Field(..., description="Market demand level")
    recommended_price_range: Dict[str, float] = Field(..., description="Min and max recommended price")
    seasonal_trend: str = Field(..., description="Seasonal market trend")


class SupplierRecommendationResponse(BaseModel):
    """Response model for supplier recommendations."""
    buyers: List[RecommendedBuyer] = Field(..., description="List of recommended buyers")
    market_opportunities: List[MarketOpportunity] = Field(..., description="Market opportunities")

    class Config:
        json_schema_extra = {
            "example": {
                "buyers": [
                    {
                        "buyer_id": "b_001",
                        "buyer_name": "Fresh Foods Ltd",
                        "annual_purchase": 500000,
                        "avg_order_value": 45000,
                        "reliability_score": 95,
                        "payment_days": 7,
                        "volume_needed": 2000
                    }
                ],
                "market_opportunities": [
                    {
                        "opportunity": "Organic certification premium market",
                        "demand_level": "HIGH",
                        "recommended_price_range": {"min": 50, "max": 75},
                        "seasonal_trend": "Peak demand in monsoon season"
                    }
                ]
            }
        }


# ============================================================================
# FORECAST MODELS
# ============================================================================

class DemandForecastRequest(BaseModel):
    """Request model for demand forecast."""
    product_name: str = Field(..., description="Name of the product", min_length=1)
    district: Optional[str] = Field(None, description="District name")
    months_ahead: int = Field(..., ge=1, le=12, description="Number of months to forecast")
    product_type: str = Field(..., description="Type of product")

    class Config:
        json_schema_extra = {
            "example": {
                "product_name": "Tomato",
                "district": "Nashik",
                "months_ahead": 6,
                "product_type": "VEGETABLE"
            }
        }


class ForecastDataPoint(BaseModel):
    """Model for single forecast data point."""
    month: int = Field(..., ge=1, le=12, description="Month number")
    year: int = Field(..., description="Year")
    predicted_demand: float = Field(..., ge=0, description="Predicted demand in units")
    confidence_interval: Dict[str, float] = Field(..., description="Confidence interval lower/upper")
    trend: HealthTrend = Field(..., description="Trend direction")
    seasonal_factor: float = Field(..., description="Seasonal adjustment factor")
    suggested_quantity: float = Field(..., ge=0, description="Suggested quantity to produce")
    suggested_price: float = Field(..., ge=0, description="Suggested price per unit")


class DemandForecastResponse(BaseModel):
    """Response model for demand forecast."""
    product_name: str = Field(..., description="Product name")
    district: str = Field(..., description="District for forecast")
    forecast_data: List[ForecastDataPoint] = Field(..., description="Forecast data points")
    historical_average: float = Field(..., ge=0, description="Historical average demand")
    growth_rate_percent: float = Field(..., description="Expected growth rate")
    peak_season: str = Field(..., description="Peak season description")
    best_selling_grade: QualityGrade = Field(..., description="Best selling quality grade")

    class Config:
        json_schema_extra = {
            "example": {
                "product_name": "Tomato",
                "district": "Nashik",
                "forecast_data": [
                    {
                        "month": 5,
                        "year": 2026,
                        "predicted_demand": 15000,
                        "confidence_interval": {"lower": 13500, "upper": 16500},
                        "trend": "UP",
                        "seasonal_factor": 1.15,
                        "suggested_quantity": 15500,
                        "suggested_price": 45.50
                    }
                ],
                "historical_average": 12500,
                "growth_rate_percent": 8.5,
                "peak_season": "April - June (Summer)",
                "best_selling_grade": "A"
            }
        }


# ============================================================================
# PEST DETECTION MODELS
# ============================================================================

class PestDetectionRequest(BaseModel):
    """Request model for pest detection."""
    image_url: str = Field(..., description="Base64 encoded image or URL")
    crop_type: str = Field(..., description="Type of crop", min_length=1)
    disease_suspects: Optional[List[str]] = Field(None, description="Suspected diseases")

    @validator("image_url")
    def validate_image_url(cls, v):
        """Validate image URL or base64 format."""
        if not v or len(v) == 0:
            raise ValueError("image_url cannot be empty")
        if len(v) > 10_000_000:  # 10MB limit
            raise ValueError("Image data exceeds 10MB limit")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "image_url": "data:image/jpeg;base64,/9j/4AAQSkZ...",
                "crop_type": "Tomato",
                "disease_suspects": ["Early Blight", "Late Blight"]
            }
        }


class DetectedPest(BaseModel):
    """Model for detected pest information."""
    name: str = Field(..., description="Pest or disease name")
    severity: PestSeverity = Field(..., description="Severity level")
    affected_area_percent: float = Field(..., ge=0, le=100, description="Percentage of affected area")
    confidence: int = Field(..., ge=0, le=100, description="Confidence of detection")
    description: str = Field(..., description="Description of the pest/disease")
    treatment: str = Field(..., description="Recommended treatment")
    organic_treatment: Optional[str] = Field(None, description="Organic treatment alternative")
    prevention_tips: List[str] = Field(..., description="Prevention and management tips")


class PestDetectionResponse(BaseModel):
    """Response model for pest detection."""
    pest_detected: bool = Field(..., description="Whether pests were detected")
    pests: List[DetectedPest] = Field(..., description="List of detected pests")
    overall_crop_health: int = Field(..., ge=0, le=100, description="Overall crop health score")
    recommendations: List[str] = Field(..., description="General recommendations")
    urgency_level: UrgencyLevel = Field(..., description="Urgency level of action")

    class Config:
        json_schema_extra = {
            "example": {
                "pest_detected": True,
                "pests": [
                    {
                        "name": "Early Blight",
                        "severity": "MEDIUM",
                        "affected_area_percent": 15.0,
                        "confidence": 88,
                        "description": "Fungal disease causing leaf spots on tomato plants",
                        "treatment": "Apply mancozeb or chlorothalonil fungicide",
                        "organic_treatment": "Sulfur-based fungicide or neem oil spray",
                        "prevention_tips": [
                            "Ensure proper plant spacing for air circulation",
                            "Remove infected leaves immediately",
                            "Avoid overhead irrigation"
                        ]
                    }
                ],
                "overall_crop_health": 72,
                "recommendations": [
                    "Monitor crop closely over next 7 days",
                    "Apply fungicide within 48 hours",
                    "Improve irrigation practices"
                ],
                "urgency_level": "MEDIUM"
            }
        }


# ============================================================================
# HEALTH CHECK MODELS
# ============================================================================

class HealthCheckResponse(BaseModel):
    """Response model for health check endpoint."""
    status: str = Field(..., description="Service status")
    service: str = Field(..., description="Service name")
    version: str = Field(..., description="API version")
    timestamp: str = Field(..., description="Check timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "service": "ODOP AI Service",
                "version": "1.0.0",
                "timestamp": "2024-04-03T10:30:00Z"
            }
        }


# ============================================================================
# ERROR MODELS
# ============================================================================

class ErrorResponse(BaseModel):
    """Response model for errors."""
    error: str = Field(..., description="Error message")
    code: str = Field(..., description="Error code")
    timestamp: str = Field(..., description="Error timestamp")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")

    class Config:
        json_schema_extra = {
            "example": {
                "error": "Invalid product type",
                "code": "VALIDATION_ERROR",
                "timestamp": "2024-04-03T10:30:00Z",
                "details": {"field": "product_type", "message": "Must be VEGETABLE, FRUIT, GRAIN, or PULSES"}
            }
        }


# ============================================================================
# NEW FEATURE MODELS (40-FEATURE EXPANSION)
# ============================================================================

class YieldPredictionRequest(BaseModel):
    """Request model for yield prediction."""
    crop_type: str = Field(..., description="Type of crop")
    district: str = Field(..., description="District for cultivation")
    area_ha: float = Field(..., gt=0, description="Area in hectares")
    soil_type: str = Field(..., description="Type of soil")
    rainfall_mm: float = Field(..., ge=0, description="Average annual rainfall")
    fertilizer_used_kg: float = Field(..., ge=0, description="Fertilizer amount in KG")


class YieldPredictionResponse(BaseModel):
    """Response model for yield prediction."""
    predicted_yield_kg: float = Field(..., ge=0, description="Predicted yield in KG")
    confidence_score: int = Field(..., ge=0, le=100, description="Confidence level")
    soil_health_score: int = Field(..., ge=0, le=100, description="Soil health assessment")
    suggested_adjustments: List[str] = Field(..., description="Actionable farm adjustments")


class NegotiationRequest(BaseModel):
    """Request model for AI negotiation assistant."""
    user_id: str = Field(..., description="User ID (Buyer or Farmer)")
    item_name: str = Field(..., description="Item being negotiated")
    asking_price: float = Field(..., gt=0, description="Original asking price")
    market_price: float = Field(..., gt=0, description="Current market price")
    user_budget_or_target: float = Field(..., gt=0, description="Target price to achieve")
    negotiation_history: List[str] = Field(default_factory=list, description="Recent chat history")


class NegotiationResponse(BaseModel):
    """Response model for AI negotiation assistant."""
    suggested_counter_offer: float = Field(..., gt=0, description="Recommended next offer")
    negotiation_strategy: str = Field(..., description="Tactical advice for negotiation")
    confidence_of_success: int = Field(..., ge=0, le=100, description="Probability of closing")
    market_justification: str = Field(..., description="Data points to justify the offer")


class PricingRequest(BaseModel):
    """Request model for dynamic pricing.")"""
    product_id: str = Field(..., description="Product ID")
    current_inventory: float = Field(..., ge=0, description="Current stock level")
    expiry_days: Optional[int] = Field(None, description="Days until product expiry")
    local_demand_score: int = Field(..., ge=0, le=100, description="Demand score 0-100")
    cost_price: float = Field(..., gt=0, description="Base cost price")


class PricingResponse(BaseModel):
    """Response model for dynamic pricing."""
    optimal_price: float = Field(..., gt=0, description="AI recommended price")
    price_delta_percent: float = Field(..., description="Change from standard price")
    reasoning: str = Field(..., description="Why this price was chosen")
    margin_estimate: float = Field(..., description="Estimated profit margin")


class RotationRequest(BaseModel):
    """Request model for crop rotation advisor."""
    current_crop: str = Field(..., description="Currently harvested crop")
    season: str = Field(..., description="Upcoming season")
    district: str = Field(..., description="Cultivation district")
    soil_ph: Optional[float] = Field(None, ge=0, le=14, description="Soil PH level")


class RotationResponse(BaseModel):
    """Response model for crop rotation advisor."""
    recommended_crops: List[Dict[str, Any]] = Field(..., description="List of crops with suitability score")
    soil_recovery_estimate: int = Field(..., ge=0, le=100, description="Soil health recovery %")
    expected_yield_multiplier: float = Field(..., ge=1.0, description="Yield boost estimate")


class TrustScoreRequest(BaseModel):
    """Request model for reputation/trust score.")"""
    user_id: str = Field(..., description="Target user ID")
    fulfillment_rate: float = Field(..., ge=0, le=1, description="Order completion rate")
    avg_quality_grade: float = Field(..., ge=0, le=100, description="Avg quality assessment")
    payment_punctuality: float = Field(..., ge=0, le=1, description="On-time payment rate")


class TrustScoreResponse(BaseModel):
    """Response model for reputation/trust score."""
    overall_score: int = Field(..., ge=0, le=100, description="Reputation score 0-100")
    tier: str = Field(..., description="Trust tier (Elite, Platinum, Gold, Silver)")
    verifiedNodes: List[str] = Field(..., description="Verified trust anchors")
    growth_potential: int = Field(..., description="Score improvement probability")


# ============================================================================
# CHAT AND CONTEXT-AWARE AI MODELS
# ============================================================================

class ChatMessage(BaseModel):
    """Model for a single chat message in a conversation."""
    role: str = Field(..., description="Role of the sender: user or assistant")
    content: str = Field(..., description="Message content")
    timestamp: Optional[str] = Field(None, description="ISO timestamp")


class ContextAwareChatRequest(BaseModel):
    """Request model for intelligent, context-aware chat."""
    message: str = Field(..., description="User's new message")
    user_type: str = Field("FARMER", description="User role: FARMER or BUYER")
    conversation_history: List[ChatMessage] = Field(default_factory=list, description="Previous messages")
    user_context: Dict[str, Any] = Field(default_factory=dict, description="Additional user data like location, products, etc.")


class ChatResponse(BaseModel):
    """Response model for intelligent chat."""
    response: str = Field(..., description="AI's text response")
    suggestions: List[str] = Field(default_factory=list, description="Smart follow-up suggestions")
    intent: str = Field("general", description="Detected user intent")
    confidence: float = Field(0.0, ge=0.0, le=1.0, description="Confidence in intent detection")
    actions: List[Dict[str, Any]] = Field(default_factory=list, description="Recommended platform actions")

    class Config:
        json_schema_extra = {
            "example": {
                "response": "Based on current market trends, wheat prices are expected to rise by 5% in Punjab. I recommend holding your stock for 2 more weeks.",
                "suggestions": ["Show price trends", "Find storage facilities", "Contact local buyers"],
                "intent": "PRICE_ADVICE",
                "confidence": 0.95,
                "actions": [{"type": "NAVIGATE", "target": "/dashboard/market-intel"}]
            }
        }
