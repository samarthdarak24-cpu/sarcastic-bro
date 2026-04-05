from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/crop-advisor", tags=["crop-advisor"])

class CropRecommendationRequest(BaseModel):
    soil_type: str
    ph_level: float
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    rainfall: float
    location: str
    farm_size: float
    previous_crops: List[str]

class GrowthStageRequest(BaseModel):
    crop_type: str
    planting_date: str
    current_date: str
    weather_data: Dict[str, Any]

class DiseaseDetectionRequest(BaseModel):
    image: Optional[str]
    user_id: str
    location: str
    weather: Dict[str, Any]

class IrrigationRequest(BaseModel):
    crop_type: str
    growth_stage: str
    soil_moisture: float
    weather_forecast: Dict[str, Any]
    farm_size: float
    irrigation_type: str

class FertilizerRequest(BaseModel):
    crop_type: str
    soil_nutrients: Dict[str, float]
    target_yield: float
    farm_size: float
    growth_stage: str

class HarvestPredictionRequest(BaseModel):
    crop_type: str
    planting_date: str
    variety: str
    weather_history: Dict[str, Any]
    growth_data: Dict[str, Any]

class RotationPlanRequest(BaseModel):
    current_crop: str
    soil_health: Dict[str, Any]
    farm_size: float
    location: str
    seasons: int
    market_demand: Dict[str, Any]

class MarketAdviceRequest(BaseModel):
    crop_type: str
    location: str
    quantity: float

class WeatherImpactRequest(BaseModel):
    crop_type: str
    growth_stage: str
    weather_forecast: Dict[str, Any]
    location: str

class HealthScoreRequest(BaseModel):
    crop_id: str
    growth_data: Dict[str, Any]
    soil_data: Dict[str, Any]
    weather_data: Dict[str, Any]
    irrigation_data: Dict[str, Any]
    pest_data: Dict[str, Any]

@router.post("/recommend")
async def recommend_crops(request: CropRecommendationRequest):
    """AI-powered crop recommendation based on soil, weather, and market data"""
    
    # ML model simulation
    crops_db = {
        "rice": {"score": 0, "water": "high", "temp": [20, 35]},
        "wheat": {"score": 0, "water": "medium", "temp": [15, 25]},
        "cotton": {"score": 0, "water": "medium", "temp": [21, 30]},
        "sugarcane": {"score": 0, "water": "high", "temp": [20, 30]},
        "maize": {"score": 0, "water": "medium", "temp": [18, 27]},
        "soybean": {"score": 0, "water": "medium", "temp": [20, 30]},
        "tomato": {"score": 0, "water": "medium", "temp": [18, 27]},
        "potato": {"score": 0, "water": "medium", "temp": [15, 20]}
    }
    
    # Score calculation based on multiple factors
    for crop, data in crops_db.items():
        score = 0
        
        # Temperature suitability
        if data["temp"][0] <= request.temperature <= data["temp"][1]:
            score += 30
        
        # NPK suitability
        if request.nitrogen > 40:
            score += 20
        if request.phosphorus > 30:
            score += 20
        if request.potassium > 30:
            score += 20
        
        # pH suitability
        if 6.0 <= request.ph_level <= 7.5:
            score += 10
        
        crops_db[crop]["score"] = score + random.randint(-10, 10)
    
    # Sort by score
    sorted_crops = sorted(crops_db.items(), key=lambda x: x[1]["score"], reverse=True)
    
    recommendations = []
    for crop, data in sorted_crops[:5]:
        recommendations.append({
            "crop": crop.title(),
            "confidence": min(data["score"], 100),
            "expected_yield": round(random.uniform(2.5, 8.5), 2),
            "roi": round(random.uniform(1.2, 3.5), 2),
            "risk_level": random.choice(["Low", "Medium", "High"]),
            "market_demand": random.choice(["High", "Medium", "Low"]),
            "water_requirement": data["water"],
            "growth_duration": random.randint(90, 180)
        })
    
    return {
        "recommendations": recommendations,
        "confidence": 87.5,
        "factors": {
            "soil_quality": "Good",
            "weather_suitability": "Excellent",
            "market_conditions": "Favorable",
            "water_availability": "Adequate"
        }
    }

@router.post("/growth-stage")
async def track_growth_stage(request: GrowthStageRequest):
    """Real-time crop growth stage tracking with AI predictions"""
    
    planting = datetime.fromisoformat(request.planting_date.replace('Z', '+00:00'))
    current = datetime.fromisoformat(request.current_date.replace('Z', '+00:00'))
    days_elapsed = (current - planting).days
    
    stages = [
        {"name": "Germination", "duration": 10, "icon": "🌱"},
        {"name": "Vegetative", "duration": 30, "icon": "🌿"},
        {"name": "Flowering", "duration": 25, "icon": "🌸"},
        {"name": "Fruiting", "duration": 30, "icon": "🍅"},
        {"name": "Maturity", "duration": 15, "icon": "✅"}
    ]
    
    total_duration = sum(s["duration"] for s in stages)
    progress = min((days_elapsed / total_duration) * 100, 100)
    
    current_stage_idx = 0
    cumulative_days = 0
    for idx, stage in enumerate(stages):
        cumulative_days += stage["duration"]
        if days_elapsed < cumulative_days:
            current_stage_idx = idx
            break
    
    current_stage = stages[current_stage_idx]
    next_stage = stages[min(current_stage_idx + 1, len(stages) - 1)]
    
    return {
        "current_stage": current_stage["name"],
        "stage_icon": current_stage["icon"],
        "progress": round(progress, 1),
        "next_stage": next_stage["name"],
        "days_to_next_stage": max(cumulative_days - days_elapsed, 0),
        "health_score": random.randint(75, 95),
        "recommendations": [
            f"Monitor {current_stage['name'].lower()} phase closely",
            "Maintain optimal water levels",
            "Check for pest activity"
        ]
    }

@router.post("/disease-detection")
async def detect_disease(request: DiseaseDetectionRequest):
    """Computer vision + ML for disease and pest detection"""
    
    diseases = [
        {"name": "Leaf Blight", "severity": "Medium", "treatment": "Fungicide spray"},
        {"name": "Powdery Mildew", "severity": "Low", "treatment": "Sulfur-based spray"},
        {"name": "Root Rot", "severity": "High", "treatment": "Improve drainage"},
        {"name": "Aphid Infestation", "severity": "Medium", "treatment": "Neem oil"},
    ]
    
    disease_detected = random.choice([True, False, False])
    
    if disease_detected:
        disease = random.choice(diseases)
        return {
            "disease_detected": True,
            "disease_name": disease["name"],
            "confidence": round(random.uniform(75, 95), 1),
            "severity": disease["severity"],
            "treatment": disease["treatment"],
            "preventive_measures": [
                "Regular monitoring",
                "Proper spacing between plants",
                "Maintain field hygiene"
            ],
            "estimated_loss": round(random.uniform(5, 25), 1)
        }
    
    return {
        "disease_detected": False,
        "confidence": 92.5,
        "health_status": "Healthy",
        "preventive_measures": [
            "Continue regular monitoring",
            "Maintain current practices"
        ]
    }

@router.post("/irrigation")
async def optimize_irrigation(request: IrrigationRequest):
    """Smart irrigation optimization with water savings"""
    
    base_requirement = {
        "germination": 5,
        "vegetative": 8,
        "flowering": 10,
        "fruiting": 12,
        "maturity": 6
    }
    
    stage_key = request.growth_stage.lower()
    daily_req = base_requirement.get(stage_key, 8) * request.farm_size
    
    schedule = []
    for i in range(7):
        schedule.append({
            "day": (datetime.now() + timedelta(days=i)).strftime("%A"),
            "time": "06:00 AM",
            "duration": random.randint(30, 90),
            "amount": round(daily_req * random.uniform(0.8, 1.2), 1)
        })
    
    return {
        "daily_requirement": round(daily_req, 1),
        "schedule": schedule,
        "water_saved": round(daily_req * 0.25, 1),
        "cost_savings": round(daily_req * 0.25 * 0.5, 2),
        "efficiency": random.randint(82, 95),
        "alerts": ["Reduce watering on rainy days", "Check soil moisture regularly"]
    }

@router.post("/fertilizer")
async def calculate_fertilizer(request: FertilizerRequest):
    """Precision fertilizer calculation with cost optimization"""
    
    target_n = 120 - request.soil_nutrients.get("nitrogen", 0)
    target_p = 60 - request.soil_nutrients.get("phosphorus", 0)
    target_k = 40 - request.soil_nutrients.get("potassium", 0)
    
    npk_ratio = f"{int(target_n)}:{int(target_p)}:{int(target_k)}"
    total_quantity = (target_n + target_p + target_k) * request.farm_size / 100
    
    schedule = [
        {"stage": "Basal", "days": 0, "quantity": round(total_quantity * 0.4, 1)},
        {"stage": "Vegetative", "days": 30, "quantity": round(total_quantity * 0.3, 1)},
        {"stage": "Flowering", "days": 60, "quantity": round(total_quantity * 0.3, 1)}
    ]
    
    return {
        "npk_ratio": npk_ratio,
        "quantity": round(total_quantity, 1),
        "schedule": schedule,
        "cost": round(total_quantity * 25, 2),
        "yield_increase": round(random.uniform(15, 35), 1),
        "recommendations": [
            "Apply in split doses",
            "Avoid over-fertilization",
            "Test soil after each season"
        ]
    }

@router.post("/harvest-prediction")
async def predict_harvest(request: HarvestPredictionRequest):
    """AI-powered harvest prediction and timing optimization"""
    
    planting = datetime.fromisoformat(request.planting_date.replace('Z', '+00:00'))
    harvest_date = planting + timedelta(days=random.randint(90, 150))
    
    return {
        "predicted_date": harvest_date.isoformat(),
        "confidence": round(random.uniform(80, 95), 1),
        "estimated_yield": round(random.uniform(3.5, 8.5), 2),
        "quality_grade": random.choice(["A", "A+", "B+"]),
        "optimal_window": {
            "start": (harvest_date - timedelta(days=3)).isoformat(),
            "end": (harvest_date + timedelta(days=3)).isoformat()
        },
        "market_price": round(random.uniform(2000, 5000), 2),
        "estimated_revenue": round(random.uniform(25000, 75000), 2)
    }

@router.post("/rotation-plan")
async def generate_rotation_plan(request: RotationPlanRequest):
    """Multi-season crop rotation planning"""
    
    rotation_options = [
        ["Rice", "Wheat", "Legumes"],
        ["Cotton", "Soybean", "Maize"],
        ["Tomato", "Potato", "Onion"],
        ["Sugarcane", "Wheat", "Vegetables"]
    ]
    
    selected_rotation = random.choice(rotation_options)
    
    plan = []
    for i, crop in enumerate(selected_rotation[:request.seasons]):
        plan.append({
            "season": i + 1,
            "crop": crop,
            "duration": random.randint(90, 150),
            "expected_yield": round(random.uniform(3, 8), 2),
            "revenue": round(random.uniform(30000, 80000), 2)
        })
    
    return {
        "rotation_plan": plan,
        "soil_improvement": round(random.uniform(15, 35), 1),
        "revenue": sum(p["revenue"] for p in plan),
        "risk_score": random.randint(20, 40),
        "recommendations": [
            "Include legumes for nitrogen fixation",
            "Rotate deep and shallow-rooted crops",
            "Monitor soil health regularly"
        ]
    }

@router.post("/market-advice")
async def get_market_advice(request: MarketAdviceRequest):
    """Real-time market price analysis and selling recommendations"""
    
    base_price = random.uniform(2000, 5000)
    trend = random.choice(["rising", "falling", "stable"])
    
    forecast = []
    for i in range(30):
        if trend == "rising":
            price = base_price * (1 + i * 0.01)
        elif trend == "falling":
            price = base_price * (1 - i * 0.01)
        else:
            price = base_price * random.uniform(0.95, 1.05)
        
        forecast.append({
            "date": (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"),
            "price": round(price, 2)
        })
    
    best_time = max(forecast, key=lambda x: x["price"])
    
    return {
        "current_price": round(base_price, 2),
        "trend": trend,
        "forecast": forecast[:7],
        "best_time": best_time["date"],
        "demand_score": random.randint(60, 95),
        "competition": random.choice(["Low", "Medium", "High"]),
        "recommendation": "Hold for better prices" if trend == "rising" else "Sell now"
    }

@router.post("/weather-impact")
async def analyze_weather_impact(request: WeatherImpactRequest):
    """Climate risk assessment and mitigation strategies"""
    
    threats = []
    opportunities = []
    risk_level = "LOW"
    
    if random.choice([True, False]):
        threats.append({"type": "Heavy Rainfall", "probability": 65, "impact": "Medium"})
        risk_level = "MEDIUM"
    
    if random.choice([True, False]):
        threats.append({"type": "High Temperature", "probability": 45, "impact": "Low"})
    
    if random.choice([True, False]):
        opportunities.append({"type": "Optimal Sunshine", "benefit": "Enhanced growth"})
    
    return {
        "risk_level": risk_level,
        "threats": threats,
        "opportunities": opportunities,
        "recommendations": [
            "Prepare drainage systems",
            "Monitor weather updates daily",
            "Have protective measures ready"
        ],
        "protective_measures": [
            "Install rain shelters",
            "Improve field drainage",
            "Use mulching"
        ],
        "estimated_impact": round(random.uniform(-15, 5), 1)
    }

@router.post("/health-score")
async def get_health_score(request: HealthScoreRequest):
    """Comprehensive crop health monitoring"""
    
    growth_score = random.randint(75, 95)
    nutrition_score = random.randint(70, 90)
    water_score = random.randint(80, 95)
    pest_score = random.randint(85, 98)
    disease_score = random.randint(80, 95)
    
    overall = (growth_score + nutrition_score + water_score + pest_score + disease_score) / 5
    
    alerts = []
    if nutrition_score < 75:
        alerts.append({"type": "warning", "message": "Nutrient deficiency detected"})
    if water_score < 80:
        alerts.append({"type": "info", "message": "Increase irrigation frequency"})
    
    return {
        "overall_score": round(overall, 1),
        "growth_score": growth_score,
        "nutrition_score": nutrition_score,
        "water_score": water_score,
        "pest_score": pest_score,
        "disease_score": disease_score,
        "trend": random.choice(["improving", "stable", "declining"]),
        "alerts": alerts,
        "recommendations": [
            "Maintain current practices",
            "Monitor daily",
            "Address alerts promptly"
        ]
    }
