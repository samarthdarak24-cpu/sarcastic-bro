# ========================================================================
#  Advanced AI Services — XAI, Yield, Pest, Pricing, Crop Rotation
# ========================================================================

import random
import hashlib
import math
from typing import List
from app.schemas import (
    HeatmapResponse,
    YieldInput,
    YieldPredictionResponse,
    PestDetectionResponse,
    PricingInput,
    PriceCurvePoint,
    DynamicPricingResponse,
    CropRotationInput,
    CropSuggestion,
    CropRotationResponse,
)

# ─── Crop Yield Data (kg per acre baselines) ────────────────────────────

YIELD_BASELINES = {
    "wheat": 1800, "rice": 2200, "maize": 2500, "cotton": 600,
    "sugarcane": 30000, "potato": 8000, "tomato": 12000, "onion": 10000,
    "turmeric": 2500, "chilli": 1200, "mango": 4000, "banana": 15000,
    "soybean": 1000, "groundnut": 1200, "mustard": 800, "tea": 2000,
}

SOIL_MULTIPLIERS = {
    "alluvial": 1.15, "black": 1.10, "red": 0.95, "laterite": 0.85,
    "sandy": 0.75, "clay": 1.0, "loamy": 1.20, "saline": 0.60,
}

# ─── Pest Database ─────────────────────────────────────────────────────

PEST_TYPES = [
    {"name": "Aphids", "severity": "medium", "treatments": ["Neem oil spray", "Introduce ladybugs", "Insecticidal soap application"]},
    {"name": "Whitefly", "severity": "high", "treatments": ["Yellow sticky traps", "Imidacloprid spray", "Remove infected leaves"]},
    {"name": "Stem Borer", "severity": "high", "treatments": ["Trichogramma release", "Carbofuran application", "Light traps"]},
    {"name": "Leaf Miner", "severity": "low", "treatments": ["Remove affected leaves", "Spinosad spray", "Crop rotation"]},
    {"name": "Thrips", "severity": "medium", "treatments": ["Blue sticky traps", "Fipronil spray", "Reflective mulch"]},
    {"name": "Fruit Fly", "severity": "medium", "treatments": ["Methyl eugenol traps", "Bait sprays", "Bag fruits"]},
    {"name": "Army Worm", "severity": "high", "treatments": ["Chlorantraniliprole spray", "Early planting", "Biological control"]},
]

# ─── Crop Rotation Knowledge ───────────────────────────────────────────

ROTATION_DB = {
    "alluvial": {
        "kharif": [
            {"crop": "Rice", "yield": 2200, "price": 22, "reason": "Ideal for waterlogged alluvial plains during monsoon"},
            {"crop": "Maize", "yield": 2500, "price": 18, "reason": "High yield potential in nitrogen-rich alluvial soil"},
            {"crop": "Soybean", "yield": 1000, "price": 45, "reason": "Nitrogen-fixing legume, excellent rotation crop"},
            {"crop": "Cotton", "yield": 600, "price": 65, "reason": "Good cash crop with adequate irrigation"},
        ],
        "rabi": [
            {"crop": "Wheat", "yield": 1800, "price": 25, "reason": "Premier rabi crop for Indo-Gangetic alluvial belt"},
            {"crop": "Mustard", "yield": 800, "price": 55, "reason": "Low water requirement, good oil crop"},
            {"crop": "Potato", "yield": 8000, "price": 12, "reason": "High tonnage crop with quick turnaround"},
        ],
    },
    "black": {
        "kharif": [
            {"crop": "Cotton", "yield": 700, "price": 65, "reason": "Black soil retains moisture ideal for cotton"},
            {"crop": "Soybean", "yield": 1100, "price": 45, "reason": "Excellent in deep black soil with good drainage"},
            {"crop": "Sorghum", "yield": 1500, "price": 18, "reason": "Drought tolerant, suits black cotton soil"},
        ],
        "rabi": [
            {"crop": "Wheat", "yield": 1600, "price": 25, "reason": "Reliable second-season crop"},
            {"crop": "Chickpea", "yield": 900, "price": 50, "reason": "Pulse crop, fixes nitrogen for next season"},
        ],
    },
    "red": {
        "kharif": [
            {"crop": "Groundnut", "yield": 1200, "price": 55, "reason": "Well-drained red soil suits groundnut"},
            {"crop": "Finger Millet (Ragi)", "yield": 1500, "price": 35, "reason": "Nutritious superfood, high demand"},
            {"crop": "Turmeric", "yield": 2500, "price": 80, "reason": "Premium spice with export potential"},
        ],
        "rabi": [
            {"crop": "Sunflower", "yield": 800, "price": 48, "reason": "Oil crop suited to lighter red soils"},
            {"crop": "Lentils", "yield": 700, "price": 60, "reason": "Legume rotation improves soil health"},
        ],
    },
}

# Default fallback for unknown soil types
DEFAULT_CROPS = {
    "kharif": [
        {"crop": "Maize", "yield": 2000, "price": 18, "reason": "Versatile grain suitable for most soil types"},
        {"crop": "Green Gram (Moong)", "yield": 500, "price": 70, "reason": "Short duration pulse, nitrogen fixer"},
    ],
    "rabi": [
        {"crop": "Wheat", "yield": 1500, "price": 25, "reason": "Staple crop with guaranteed MSP"},
        {"crop": "Mustard", "yield": 700, "price": 55, "reason": "Low input oil crop"},
    ],
}


# ========================================================================
#  Service Functions
# ========================================================================


def generate_xai_heatmap(image_bytes: bytes, filename: str) -> HeatmapResponse:
    """Generate an Explainable AI attention heatmap overlay for image analysis."""
    random.seed(hash(filename) % 2**32)
    width, height = 12, 12

    # Create gaussian hotspots
    num_hotspots = random.randint(1, 3)
    hotspots = [(random.randint(2, width - 3), random.randint(2, height - 3)) for _ in range(num_hotspots)]

    matrix = []
    for y in range(height):
        row = []
        for x in range(width):
            val = 0.0
            for hx, hy in hotspots:
                dist = math.sqrt((x - hx) ** 2 + (y - hy) ** 2)
                val += max(0, 1.0 - dist / 5.0)
            val = min(1.0, val + random.uniform(-0.05, 0.05))
            row.append(round(max(0.0, val), 3))
        matrix.append(row)

    top_regions = []
    for i, (hx, hy) in enumerate(hotspots):
        top_regions.append({
            "region_id": i + 1,
            "center_x": hx,
            "center_y": hy,
            "attention_score": round(random.uniform(0.75, 0.98), 3),
            "label": random.choice(["Surface Defect", "Color Variance", "Texture Anomaly", "Shape Feature", "Quality Indicator"]),
        })

    return HeatmapResponse(
        width=width,
        height=height,
        overlay_matrix=matrix,
        top_regions=top_regions,
    )


def predict_yield(data: YieldInput) -> YieldPredictionResponse:
    """Predict crop yield based on land, soil, and environmental factors."""
    crop_key = data.crop.lower()
    base_yield = YIELD_BASELINES.get(crop_key, 1500)
    soil_mult = SOIL_MULTIPLIERS.get(data.soil_type.lower(), 1.0)

    # Rainfall impact
    optimal_rain = 800  # mm
    rain_factor = 1.0 - abs(data.rainfall_mm - optimal_rain) / (optimal_rain * 2)
    rain_factor = max(0.5, min(1.3, rain_factor))

    # Irrigation bonus
    irrigation_bonus = 1.15 if data.irrigation else 1.0

    # Fertilizer bonus
    fert_bonus = 1.10 if data.fertilizer_used else 0.85

    yield_per_acre = base_yield * soil_mult * rain_factor * irrigation_bonus * fert_bonus
    yield_per_acre = round(yield_per_acre, 1)
    total_yield = round(yield_per_acre * data.land_area_acres, 1)

    confidence = round(min(0.95, 0.70 + (rain_factor - 0.5) * 0.3 + (0.05 if data.irrigation else 0)), 3)

    recommendations = []
    if not data.irrigation:
        recommendations.append("Consider drip irrigation to boost yield by 15-20%")
    if not data.fertilizer_used:
        recommendations.append("Applying balanced NPK fertilizer can increase yield by 10-15%")
    if data.rainfall_mm < 500:
        recommendations.append("Low rainfall expected — drought-resistant variety recommended")
    if data.rainfall_mm > 1200:
        recommendations.append("Excess rainfall risk — ensure proper drainage to prevent waterlogging")
    if soil_mult < 0.9:
        recommendations.append(f"Soil type '{data.soil_type}' may limit yield — consider soil amendments")
    if not recommendations:
        recommendations.append("Conditions look favourable. Maintain current practices.")

    return YieldPredictionResponse(
        crop=data.crop,
        predicted_yield_kg=total_yield,
        yield_per_acre=yield_per_acre,
        confidence=confidence,
        recommendations=recommendations,
    )


def detect_pest(image_bytes: bytes, filename: str) -> PestDetectionResponse:
    """Mock pest detection from crop image."""
    random.seed(hash(filename) % 2**32)

    # 80% chance of pest detection for demo realism
    detected = random.random() < 0.80

    if detected:
        pest = random.choice(PEST_TYPES)
        confidence = round(random.uniform(0.65, 0.96), 3)
        return PestDetectionResponse(
            pest_detected=True,
            pest_type=pest["name"],
            confidence=confidence,
            severity=pest["severity"],
            treatment_suggestions=pest["treatments"],
        )
    else:
        return PestDetectionResponse(
            pest_detected=False,
            pest_type=None,
            confidence=round(random.uniform(0.85, 0.98), 3),
            severity="none",
            treatment_suggestions=["No treatment needed. Continue regular monitoring."],
        )


def calculate_dynamic_pricing(data: PricingInput) -> DynamicPricingResponse:
    """Generate dynamic price curve based on supply-demand equilibrium."""
    random.seed(hash(data.product_name) % 2**32)

    # Supply-demand ratio determines price direction
    sd_ratio = data.current_demand / max(data.current_supply, 1)

    # Price elasticity simulation
    if sd_ratio > 1.3:
        price_mult = 1.0 + (sd_ratio - 1.0) * 0.25
        signal = "sell"
    elif sd_ratio < 0.7:
        price_mult = 1.0 - (1.0 - sd_ratio) * 0.2
        signal = "buy"
    else:
        price_mult = 1.0 + random.uniform(-0.05, 0.05)
        signal = "hold"

    # Seasonal adjustment
    season_mult = {"kharif": 1.05, "rabi": 0.95, "zaid": 1.10}.get(data.season.lower(), 1.0)
    optimal = round(data.base_price * price_mult * season_mult, 2)
    min_price = round(optimal * 0.75, 2)
    max_price = round(optimal * 1.30, 2)

    # Generate price curve (price vs quantity)
    curve: List[PriceCurvePoint] = []
    for i in range(10):
        qty = round(data.current_supply * (0.2 + i * 0.15), 1)
        # Price decreases as quantity supplied increases (supply curve inverted for buyer)
        px = round(optimal * (1.3 - i * 0.06) + random.uniform(-1, 1), 2)
        curve.append(PriceCurvePoint(quantity=qty, suggested_price=max(min_price, px)))

    return DynamicPricingResponse(
        product_name=data.product_name,
        optimal_price=optimal,
        min_price=min_price,
        max_price=max_price,
        price_curve=curve,
        market_signal=signal,
    )


def advise_crop_rotation(data: CropRotationInput) -> CropRotationResponse:
    """Recommend next crops based on soil type, history, and season."""
    soil_key = data.soil_type.lower()
    season_key = data.season.lower()

    rotation_data = ROTATION_DB.get(soil_key, DEFAULT_CROPS)
    season_crops = rotation_data.get(season_key, rotation_data.get("kharif", []))

    # Filter out recently planted crops
    prev_lower = [c.lower() for c in data.previous_crops]
    filtered = [c for c in season_crops if c["crop"].lower() not in prev_lower]

    if not filtered:
        filtered = season_crops  # fallback if all filtered out

    suggestions: List[CropSuggestion] = []
    for i, entry in enumerate(filtered):
        # Score based on position, yield, and price
        base_score = 90 - i * 8
        # Bonus for crops not recently planted (rotation benefit)
        if entry["crop"].lower() not in prev_lower:
            base_score += 5
        score = min(99, max(30, base_score))

        suggestions.append(CropSuggestion(
            crop_name=entry["crop"],
            suitability_score=score,
            expected_yield_per_acre=entry["yield"],
            market_price_estimate=entry["price"],
            reason=entry["reason"],
        ))

    suggestions.sort(key=lambda s: s.suitability_score, reverse=True)

    return CropRotationResponse(
        soil_type=data.soil_type,
        suggestions=suggestions,
    )
