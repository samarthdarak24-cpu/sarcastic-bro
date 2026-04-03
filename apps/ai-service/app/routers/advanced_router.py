# ========================================================================
#  Advanced AI Router — XAI, Yield, Pest, Pricing, Crop Rotation
# ========================================================================

from fastapi import APIRouter, UploadFile, File
from app.schemas import (
    HeatmapResponse,
    YieldInput,
    YieldPredictionResponse,
    PestDetectionResponse,
    PricingInput,
    DynamicPricingResponse,
    CropRotationInput,
    CropRotationResponse,
)
from app.services.advanced_service import (
    generate_xai_heatmap,
    predict_yield,
    detect_pest,
    calculate_dynamic_pricing,
    advise_crop_rotation,
)

router = APIRouter(prefix="/ai/advanced", tags=["AI Advanced"])


@router.post("/xai-heatmap", response_model=HeatmapResponse)
async def xai_heatmap(image: UploadFile = File(...)):
    """
    Generate Explainable AI attention heatmap overlay
    showing which regions the model focused on.
    """
    contents = await image.read()
    return generate_xai_heatmap(contents, image.filename or "unknown.jpg")


@router.post("/yield-prediction", response_model=YieldPredictionResponse)
async def yield_prediction(data: YieldInput):
    """
    Predict crop yield based on crop type, land area, soil,
    rainfall, irrigation, and fertilizer data.
    """
    return predict_yield(data)


@router.post("/pest-detection", response_model=PestDetectionResponse)
async def pest_detection(image: UploadFile = File(...)):
    """
    Analyze crop image for pest detection.
    Returns pest type, confidence, severity, and treatments.
    """
    contents = await image.read()
    return detect_pest(contents, image.filename or "unknown.jpg")


@router.post("/dynamic-pricing", response_model=DynamicPricingResponse)
async def dynamic_pricing(data: PricingInput):
    """
    Calculate optimal price and price curve based on
    supply-demand dynamics and seasonal factors.
    """
    return calculate_dynamic_pricing(data)


@router.post("/crop-rotation", response_model=CropRotationResponse)
async def crop_rotation(data: CropRotationInput):
    """
    Recommend next crops based on soil type, crop history,
    and current season for sustainable farming.
    """
    return advise_crop_rotation(data)
