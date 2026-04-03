"""
Integration Tests for ODOP AI Service
Tests all 5 endpoints with mock requests
"""

import asyncio
import json
from main import app
from fastapi.testclient import TestClient
from models import (
    ProductType,
    QualityGradeRequest,
    BuyerRecommendationRequest,
    SupplierRecommendationRequest,
    DemandForecastRequest,
    PestDetectionRequest,
)


client = TestClient(app)


def test_health_check():
    """Test health check endpoint."""
    print("\n📋 Testing Health Check...")
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ODOP AI Service"
    assert data["version"] == "1.0.0"
    print("✓ Health check passed")


def test_quality_grade_analysis():
    """Test quality grade analysis endpoint."""
    print("\n📋 Testing Quality Grade Analysis...")
    payload = {
        "image_url": "data:image/jpeg;base64,fake_image_data",
        "product_type": "VEGETABLE",
        "product_name": "Tomato",
    }
    response = client.post("/ai/quality-grade", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "grade" in data
    assert "score" in data
    assert data["score"] >= 0 and data["score"] <= 100
    assert "recommendations" in data
    print(f"✓ Quality grade analysis passed - Grade: {data['grade']}, Score: {data['score']}")


def test_buyer_recommendations():
    """Test buyer recommendations endpoint."""
    print("\n📋 Testing Buyer Recommendations...")
    payload = {
        "buyer_id": "buyer_123",
        "quantity": 500,
        "budget_min": 10000,
        "budget_max": 50000,
        "preferred_categories": ["Organic"],
    }
    response = client.post("/ai/recommendations/buyer", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "farmers" in data
    assert len(data["farmers"]) > 0
    assert "estimated_cost" in data
    farmer = data["farmers"][0]
    assert "farmer_name" in farmer
    assert "match_score" in farmer
    print(f"✓ Buyer recommendations passed - {len(data['farmers'])} farmers recommended")


def test_supplier_recommendations():
    """Test supplier recommendations endpoint."""
    print("\n📋 Testing Supplier Recommendations...")
    payload = {
        "farmer_id": "farmer_456",
        "product_type": "Tomato",
        "current_area_managed": 2.5,
    }
    response = client.post("/ai/recommendations/supplier", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "buyers" in data
    assert "market_opportunities" in data
    assert len(data["buyers"]) > 0
    print(f"✓ Supplier recommendations passed - {len(data['buyers'])} buyers recommended")


def test_demand_forecast():
    """Test demand forecast endpoint."""
    print("\n📋 Testing Demand Forecast...")
    payload = {
        "product_name": "Tomato",
        "district": "Nashik",
        "months_ahead": 6,
        "product_type": "VEGETABLE",
    }
    response = client.post("/ai/forecast", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "forecast_data" in data
    assert len(data["forecast_data"]) == 6
    assert "historical_average" in data
    assert "growth_rate_percent" in data
    assert "peak_season" in data
    print(f"✓ Demand forecast passed - Generated {len(data['forecast_data'])} forecast points")


def test_pest_detection():
    """Test pest detection endpoint."""
    print("\n📋 Testing Pest Detection...")
    payload = {
        "image_url": "data:image/jpeg;base64,fake_image_data",
        "crop_type": "Tomato",
        "disease_suspects": ["Early Blight"],
    }
    response = client.post("/ai/pest-detection", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "pest_detected" in data
    assert "overall_crop_health" in data
    assert "recommendations" in data
    assert "urgency_level" in data
    print(
        f"✓ Pest detection passed - Health: {data['overall_crop_health']}, Urgency: {data['urgency_level']}"
    )


def test_invalid_quality_grade_request():
    """Test quality grade with invalid product type."""
    print("\n📋 Testing Invalid Quality Grade Request...")
    payload = {
        "image_url": "data:image/jpeg;base64,fake",
        "product_type": "INVALID",
        "product_name": "Test",
    }
    response = client.post("/ai/quality-grade", json=payload)
    assert response.status_code == 422  # Validation error
    print("✓ Validation error handling passed")


def test_invalid_forecast_months():
    """Test forecast with invalid months."""
    print("\n📋 Testing Invalid Forecast Months...")
    payload = {
        "product_name": "Tomato",
        "months_ahead": 24,  # Invalid: > 12
        "product_type": "VEGETABLE",
    }
    response = client.post("/ai/forecast", json=payload)
    assert response.status_code == 422  # Validation error
    print("✓ Invalid months validation passed")


def run_all_tests():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("🧪 ODOP AI Service - Integration Tests")
    print("=" * 60)

    try:
        test_health_check()
        test_quality_grade_analysis()
        test_buyer_recommendations()
        test_supplier_recommendations()
        test_demand_forecast()
        test_pest_detection()
        test_invalid_quality_grade_request()
        test_invalid_forecast_months()

        print("\n" + "=" * 60)
        print("✅ All tests passed successfully!")
        print("=" * 60 + "\n")

    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        raise
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        raise


if __name__ == "__main__":
    run_all_tests()
