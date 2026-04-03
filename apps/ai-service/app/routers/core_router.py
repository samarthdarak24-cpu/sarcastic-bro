# ========================================================================
#  Core AI Router — Quality, Recommendations, Forecasting
# ========================================================================

from fastapi import APIRouter, UploadFile, File
from app.schemas import (
    ProductInput,
    BuyerRecommendationResponse,
    BuyerNeedsInput,
    FarmerRecommendationResponse,
    ForecastInput,
    DemandForecastResponse,
    QualityGradingResponse,
)
from app.services.quality_service import grade_product_quality
from app.services.recommendation_service import recommend_buyers, recommend_farmers
from app.services.forecast_service import forecast_demand

router = APIRouter(prefix="/ai", tags=["AI Core"])


@router.post("/quality-grade", response_model=QualityGradingResponse)
async def quality_grade(image: UploadFile = File(...)):
    """
    Analyze a product image and return quality grade (A/B/C),
    confidence score, and attention heatmap data.
    """
    contents = await image.read()
    result = grade_product_quality(contents, image.filename or "unknown.jpg")
    return result


@router.post("/recommend-buyers", response_model=BuyerRecommendationResponse)
async def get_buyer_recommendations(product: ProductInput):
    """
    Given product details, return ranked list of recommended buyers
    with match score percentages.
    """
    return recommend_buyers(product)


@router.post("/recommend-farmers", response_model=FarmerRecommendationResponse)
async def get_farmer_recommendations(needs: BuyerNeedsInput):
    """
    Given buyer needs (category, qty, price), return ranked farmers
    with availability and pricing.
    """
    return recommend_farmers(needs)


@router.post("/demand-forecast", response_model=DemandForecastResponse)
async def get_demand_forecast(input_data: ForecastInput):
    """
    Generate time-series demand forecast with confidence intervals.
    Returns daily predictions with trend analysis.
    """
    return forecast_demand(input_data)
