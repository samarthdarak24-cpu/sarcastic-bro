"""
ODOP CONNECT AI Service - FastAPI Application
Main entry point with all AI endpoints for agri-tech platform.

Endpoints:
- POST /ai/quality-grade - Product quality grading
- POST /ai/recommendations/buyer - Buyer recommendations
- POST /ai/recommendations/supplier - Supplier recommendations
- POST /ai/forecast - Demand forecasting
- POST /ai/pest-detection - Pest and disease detection
- POST /ai/yield-prediction - Agricultural yield simulation
- POST /ai/negotiation/assist - AI-driven negotiation support
- POST /ai/pricing/dynamic - Dynamic pricing optimization
- POST /ai/crop-rotation - Soil-aware crop rotation advice
- POST /ai/trust-score - Institutional reputation scoring
- GET /health - Health check
"""

import logging
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, status, Body, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError
import io
from PIL import Image

# Import models
from models import (
    QualityGradeRequest,
    QualityGradeResponse,
    BuyerRecommendationRequest,
    BuyerRecommendationResponse,
    SupplierRecommendationRequest,
    SupplierRecommendationResponse,
    DemandForecastRequest,
    DemandForecastResponse,
    PestDetectionRequest,
    PestDetectionResponse,
    HealthCheckResponse,
    ErrorResponse,
    YieldPredictionRequest,
    YieldPredictionResponse,
    NegotiationRequest,
    NegotiationResponse,
    PricingRequest,
    PricingResponse,
    RotationRequest,
    RotationResponse,
    TrustScoreRequest,
    TrustScoreResponse,
)

# Import services
from services.quality_grade_service import QualityGradeService
from services.recommendation_service import RecommendationService
from services.forecast_service import ForecastService
from services.pest_detection_service import PestDetectionService
from services.yield_service import YieldService
from services.negotiation_service import NegotiationService
from services.pricing_service import PricingService
from services.soil_service import SoilService
from services.trust_service import TrustService
from services.inference_service import inference_engine


# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


# ============================================================================
# LIFECYCLE MANAGEMENT
# ============================================================================


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifecycle - startup and shutdown.
    """
    # Startup event
    logger.info("=" * 80)
    logger.info("🚀 ODOP AI Service - Starting")
    logger.info(f"Service Version: 1.0.0")
    logger.info(f"Started at: {datetime.now().isoformat()}")
    logger.info("=" * 80)

    yield

    # Shutdown event
    logger.info("=" * 80)
    logger.info("🛑 ODOP AI Service - Shutting Down")
    logger.info(f"Stopped at: {datetime.now().isoformat()}")
    logger.info("=" * 80)


# ============================================================================
# FASTAPI APP INITIALIZATION
# ============================================================================

app = FastAPI(
    title="ODOP AI Service",
    description="Production-ready AI microservice for agri-tech platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZIP compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)


# ============================================================================
# CUSTOM EXCEPTION HANDLERS
# ============================================================================


@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    """Handle Pydantic validation errors."""
    logger.warning(f"Validation error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Request validation failed",
            "code": "VALIDATION_ERROR",
            "timestamp": datetime.utcnow().isoformat(),
            "details": {"errors": exc.errors()},
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions."""
    logger.error(f"HTTP error: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "code": "HTTP_ERROR",
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle all other exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "code": "INTERNAL_ERROR",
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================


@app.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    tags=["Health"],
    summary="Health Check",
    description="Check if the AI service is running and healthy",
)
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        HealthCheckResponse with service status
    """
    logger.info("Health check request received")
    return HealthCheckResponse(
        status="healthy",
        service="ODOP AI Service",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat(),
    )


# ============================================================================
# QUALITY GRADE ENDPOINT
# ============================================================================
@app.post(
    "/ai/quality-grade",
    response_model=QualityGradeResponse,
    status_code=status.HTTP_200_OK,
    tags=["Product Quality"],
    summary="Analyze Product Quality",
    description="Analyze product quality from uploaded image using YOLOv8 + Swin Transformer + EfficientNet",
)
async def analyze_quality(
    image: UploadFile = File(...),
    product_type: str = Form(...),
    product_name: str = Form(...)
):
    """
    Analyze product quality from uploaded image using AI pipeline.
    """
    try:
        logger.info(f"Quality grade analysis started for {product_name}")
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Run AI Inference Pipeline
        results = await inference_engine.predict_quality(pil_image)
        
        # Transform results to QualityGradeResponse
        response = QualityGradeResponse(
            grade=results["grade"],
            score=int(results["confidence"] * 100),
            defects=len(results["bboxes"]),
            color_quality="EXCELLENT" if results["grade"] == "A" else "GOOD",
            size_uniformity=92 if results["grade"] == "A" else 85,
            freshness_score=90 if results["grade"] == "A" else 75,
            damaged_percent=0.5 if results["grade"] == "A" else 4.2,
            recommendations=[results["analysis_notes"], "Store in 10-15°C for maximum shelf life"],
            confidence=int(results["confidence"] * 100),
            processing_time_ms=350,
            bboxes=results["bboxes"] if "bboxes" in results else [],
            disease=results.get("disease", "None")
        )
        logger.info(f"Quality analysis complete: {response.grade} ({response.confidence}%)")
        return response
    except Exception as e:
        logger.error(f"Error in quality-grade analysis: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze product quality: {str(e)}",
        )


# ============================================================================
# BUYER RECOMMENDATIONS ENDPOINT
# ============================================================================


@app.post(
    "/ai/recommendations/buyer",
    response_model=BuyerRecommendationResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Recommendations"],
    summary="Get Buyer Recommendations",
    description="Get buyer recommendations for suppliers based on requirements",
)
async def get_buyer_recommendations(
    request: BuyerRecommendationRequest = Body(
        ...,
        example={
            "buyer_id": "buyer_123",
            "search_query": "organic tomatoes",
            "budget_min": 10000,
            "budget_max": 50000,
            "quantity": 500,
            "location": "Maharashtra",
            "preferred_categories": ["Organic", "Pesticide-Free"],
        },
    ),
):
    """
    Get buyer recommendations for required products.
    
    This endpoint:
    - Analyzes buyer requirements
    - Matches with available suppliers/farmers
    - Rates based on reliability, delivery, quality
    - Provides cost estimates
    
    Args:
        request: BuyerRecommendationRequest with buyer criteria
        
    Returns:
        BuyerRecommendationResponse with recommended farmers
        
    Raises:
        HTTPException: If validation fails or processing error occurs
    """
    try:
        logger.info(f"Buyer recommendations requested - Buyer ID: {request.buyer_id}")

        # Validate budget range
        if (
            request.budget_min is not None
            and request.budget_max is not None
            and request.budget_min > request.budget_max
        ):
            raise ValueError("budget_min cannot be greater than budget_max")

        # Call service
        response = await RecommendationService.get_buyer_recommendations(request)

        logger.info(
            f"Buyer recommendations generated - Farmers recommended: {len(response.farmers)}"
        )
        return response

    except ValueError as e:
        logger.error(f"Validation error in buyer recommendations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error in buyer recommendations: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate buyer recommendations",
        )


# ============================================================================
# SUPPLIER RECOMMENDATIONS ENDPOINT
# ============================================================================


@app.post(
    "/ai/recommendations/supplier",
    response_model=SupplierRecommendationResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Recommendations"],
    summary="Get Supplier Recommendations",
    description="Get supplier recommendations for farmers to sell products",
)
async def get_supplier_recommendations(
    request: SupplierRecommendationRequest = Body(
        ...,
        example={
            "farmer_id": "farmer_456",
            "product_type": "Tomato",
            "current_area_managed": 2.5,
        },
    ),
):
    """
    Get supplier recommendations for farmers.
    
    This endpoint:
    - Analyzes farmer production capacity
    - Identifies best buyer matches
    - Highlights market opportunities
    - Suggests pricing strategies
    
    Args:
        request: SupplierRecommendationRequest with farmer details
        
    Returns:
        SupplierRecommendationResponse with recommended buyers and opportunities
        
    Raises:
        HTTPException: If validation fails or processing error occurs
    """
    try:
        logger.info(
            f"Supplier recommendations requested - Farmer ID: {request.farmer_id}, Product: {request.product_type}"
        )

        # Call service
        response = await RecommendationService.get_supplier_recommendations(request)

        logger.info(
            f"Supplier recommendations generated - Buyers recommended: {len(response.buyers)}"
        )
        return response

    except ValueError as e:
        logger.error(f"Validation error in supplier recommendations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error in supplier recommendations: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate supplier recommendations",
        )


# ============================================================================
# DEMAND FORECAST ENDPOINT
# ============================================================================


@app.post(
    "/ai/forecast",
    response_model=DemandForecastResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Forecasting"],
    summary="Get Demand Forecast",
    description="Generate demand forecast for product with pricing and quantity suggestions",
)
async def forecast_demand(
    request: DemandForecastRequest = Body(
        ...,
        example={
            "product_name": "Tomato",
            "district": "Nashik",
            "months_ahead": 6,
            "product_type": "VEGETABLE",
        },
    ),
):
    """
    Generate demand forecast for a product.
    
    This endpoint:
    - Analyzes historical demand patterns
    - Predicts future demand with confidence intervals
    - Provides seasonal trend analysis
    - Suggests optimal quantity and pricing
    
    Args:
        request: DemandForecastRequest with product details
        
    Returns:
        DemandForecastResponse with forecast data for requested months
        
    Raises:
        HTTPException: If validation fails or processing error occurs
    """
    try:
        logger.info(f"Demand forecast requested - Product: {request.product_name}, Months: {request.months_ahead}")

        # Validate months_ahead
        if not (1 <= request.months_ahead <= 12):
            raise ValueError("months_ahead must be between 1 and 12")

        # Call service
        response = await ForecastService.forecast_demand(request)

        logger.info(
            f"Demand forecast generated - Data points: {len(response.forecast_data)}"
        )
        return response

    except ValueError as e:
        logger.error(f"Validation error in forecast: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error in demand forecast: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate demand forecast",
        )


# ============================================================================
# PEST DETECTION ENDPOINT
# ============================================================================


@app.post(
    "/ai/pest-detection",
    response_model=PestDetectionResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Analysis"],
    summary="Detect Pests and Diseases",
    description="Analyze crop image to detect pests and diseases with treatment recommendations",
)
async def detect_pests(
    request: PestDetectionRequest = Body(
        ...,
        example={
            "image_url": "data:image/jpeg;base64,/9j/4AAQSkZ...",
            "crop_type": "Tomato",
            "disease_suspects": ["Early Blight", "Late Blight"],
        },
    ),
):
    """
    Detect pests and diseases in crop image.
    
    This endpoint:
    - Analyzes crop image for pest/disease presence
    - Identifies crop health issues
    - Provides treatment recommendations
    - Suggests prevention measures
    - Assesses urgency level
    
    Args:
        request: PestDetectionRequest with image and crop type
        
    Returns:
        PestDetectionResponse with detected pests and recommendations
        
    Raises:
        HTTPException: If validation fails or processing error occurs
    """
    try:
        logger.info(f"Pest detection started - Crop: {request.crop_type}")

        # Call service
        response = await PestDetectionService.detect_pests(
            image_url=request.image_url,
            crop_type=request.crop_type,
            disease_suspects=request.disease_suspects,
        )

        logger.info(
            f"Pest detection completed - Pests detected: {response.pest_detected}, Health: {response.overall_crop_health}"
        )
        return response

    except ValueError as e:
        logger.error(f"Validation error in pest detection: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error in pest detection: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to detect pests and diseases",
        )


# ============================================================================
# YIELD PREDICTION ENDPOINT
# ============================================================================


@app.post(
    "/ai/yield-prediction",
    response_model=YieldPredictionResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Analysis"],
    summary="Predict Crop Yield",
    description="Predict crop yield based on environmental and farm data",
)
async def predict_yield(
    request: YieldPredictionRequest = Body(...),
):
    """
    Predict crop yield for a specific area and crop type.
    """
    try:
        return await YieldService.predict_yield(
            crop_type=request.crop_type,
            district=request.district,
            area_ha=request.area_ha,
            soil_type=request.soil_type,
            rainfall_mm=request.rainfall_mm,
            fertilizer_used_kg=request.fertilizer_used_kg
        )
    except Exception as e:
        logger.error(f"Error in yield prediction: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to predict yield",
        )


# ============================================================================
# NEGOTIATION ASSISTANT ENDPOINT
# ============================================================================


@app.post(
    "/ai/negotiation/assist",
    response_model=NegotiationResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Recommendations"],
    summary="Negotiation Strategy Assistant",
    description="Get strategic counter-offers and market justifications",
)
async def assist_negotiation(
    request: NegotiationRequest = Body(...),
):
    """
    Get AI-driven negotiation tactics and price suggestions.
    """
    try:
        return await NegotiationService.get_negotiation_strategy(request)
    except Exception as e:
        logger.error(f"Error in negotiation assist: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate negotiation strategy",
        )


# ============================================================================
# DYNAMIC PRICING ENDPOINT
# ============================================================================


@app.post(
    "/ai/pricing/dynamic",
    response_model=PricingResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Forecasting"],
    summary="Dynamic Pricing Optimization",
    description="Optimize product pricing based on inventory and demand",
)
async def optimize_pricing(
    request: PricingRequest = Body(...),
):
    """
    Calculate optimal pricing for inventory management.
    """
    try:
        return await PricingService.optimize_pricing(request)
    except Exception as e:
        logger.error(f"Error in pricing optimization: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to optimize pricing",
        )


# ============================================================================
# CROP ROTATION ENDPOINT
# ============================================================================


@app.post(
    "/ai/crop-rotation",
    response_model=RotationResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Analysis"],
    summary="Crop Rotation Advisor",
    description="Get soil-aware crop rotation recommendations",
)
async def get_rotation_advice(
    request: RotationRequest = Body(...),
):
    """
    Get recommended crops for the next season.
    """
    try:
        return await SoilService.get_rotation_advice(request)
    except Exception as e:
        logger.error(f"Error in rotation advice: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to provide rotation advice",
        )


# ============================================================================
# TRUST SCORE ENDPOINT
# ============================================================================


@app.post(
    "/ai/trust-score",
    response_model=TrustScoreResponse,
    status_code=status.HTTP_200_OK,
    tags=["AI Analysis"],
    summary="Reputation Scoring",
    description="Calculate institutional trust score for reputation tracking",
)
async def get_trust_score(
    request: TrustScoreRequest = Body(...),
):
    """
    Calculate trust score and tier for a user.
    """
    try:
        return await TrustService.get_trust_score(request)
    except Exception as e:
        logger.error(f"Error in trust scoring: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate trust score",
        )


# ============================================================================
# ROOT ENDPOINT
# ============================================================================


@app.get(
    "/",
    tags=["Info"],
    summary="API Information",
    description="Get information about the AI service",
)
async def root():
    """
    Root endpoint with API information.
    
    Returns:
        API metadata and available endpoints
    """
    logger.info("Root endpoint accessed")
    return {
        "service": "ODOP AI Service",
        "version": "1.0.0",
        "description": "Production-ready AI microservice for agri-tech platform",
        "endpoints": {
            "health": "/health",
            "quality_grade": "/ai/quality-grade",
            "buyer_recommendations": "/ai/recommendations/buyer",
            "supplier_recommendations": "/ai/recommendations/supplier",
            "demand_forecast": "/ai/forecast",
            "pest_detection": "/ai/pest-detection",
            "yield_prediction": "/ai/yield-prediction",
            "negotiation_assist": "/ai/negotiation/assist",
            "dynamic_pricing": "/ai/pricing/dynamic",
            "crop_rotation": "/ai/crop-rotation",
            "trust_score": "/ai/trust-score",
            "docs": "/docs",
            "redoc": "/redoc",
        },
    }


# ============================================================================
# APPLICATION ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        access_log=True,
    )
