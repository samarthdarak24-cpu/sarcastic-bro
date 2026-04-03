#!/bin/bash

# ODOP AI Service - Curl Command Examples
# Complete examples for testing all API endpoints

BASE_URL="http://localhost:8000"

echo "=========================================="
echo "ODOP AI Service - API Test Examples"
echo "=========================================="
echo ""

# ============================================================================
# 1. HEALTH CHECK
# ============================================================================

echo "1️⃣  Health Check"
echo "─────────────────────────────────────────"
curl -X GET "$BASE_URL/health" \
  -H "Content-Type: application/json" \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

# ============================================================================
# 2. QUALITY GRADE ANALYSIS
# ============================================================================

echo "2️⃣  Quality Grade Analysis (Tomato)"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/quality-grade" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k",
    "product_type": "VEGETABLE",
    "product_name": "Tomato"
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

# ============================================================================
# 3. BUYER RECOMMENDATIONS
# ============================================================================

echo "3️⃣  Buyer Recommendations"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/recommendations/buyer" \
  -H "Content-Type: application/json" \
  -d '{
    "buyer_id": "buyer_001",
    "search_query": "organic tomatoes",
    "budget_min": 10000,
    "budget_max": 50000,
    "quantity": 500,
    "location": "Maharashtra",
    "preferred_categories": ["Organic", "Pesticide-Free"]
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

# ============================================================================
# 4. SUPPLIER RECOMMENDATIONS
# ============================================================================

echo "4️⃣  Supplier Recommendations"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/recommendations/supplier" \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_id": "farmer_001",
    "product_type": "Tomato",
    "current_area_managed": 2.5
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

# ============================================================================
# 5. DEMAND FORECAST
# ============================================================================

echo "5️⃣  Demand Forecast (6 Months)"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/forecast" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Tomato",
    "district": "Nashik",
    "months_ahead": 6,
    "product_type": "VEGETABLE"
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

# ============================================================================
# 6. PEST DETECTION
# ============================================================================

echo "6️⃣  Pest Detection (Tomato Crop)"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/pest-detection" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k",
    "crop_type": "Tomato",
    "disease_suspects": ["Early Blight", "Late Blight"]
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

# ============================================================================
# 7. FORECASTING OTHER PRODUCTS
# ============================================================================

echo "7️⃣  Forecast - Wheat Demand"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/forecast" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Wheat",
    "district": "Punjab",
    "months_ahead": 12,
    "product_type": "GRAIN"
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

echo "8️⃣  Forecast - Mango Demand"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/forecast" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Mango",
    "district": "Ratnagiri",
    "months_ahead": 3,
    "product_type": "FRUIT"
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

# ============================================================================
# 9. QUALITY GRADING - OTHER PRODUCTS
# ============================================================================

echo "9️⃣  Quality Grade - Apple"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/quality-grade" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k",
    "product_type": "FRUIT",
    "product_name": "Apple"
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

echo "🔟 Quality Grade - Wheat"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/quality-grade" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k",
    "product_type": "GRAIN",
    "product_name": "Wheat"
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

# ============================================================================
# ADDITIONAL PEST DETECTION EXAMPLES
# ============================================================================

echo "🐛 Pest Detection - Rice Crop"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/pest-detection" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "data:image/jpeg;base64,fake",
    "crop_type": "Rice",
    "disease_suspects": ["Brown Spot", "Blast"]
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

echo "🐛 Pest Detection - Mango Tree"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/pest-detection" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "data:image/jpeg;base64,fake",
    "crop_type": "Mango",
    "disease_suspects": ["Anthracnose", "Powdery Mildew"]
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

# ============================================================================
# BULK RECOMMENDATION EXAMPLES
# ============================================================================

echo "👥 Buyer Recommendations - Large Quantity"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/recommendations/buyer" \
  -H "Content-Type: application/json" \
  -d '{
    "buyer_id": "bulk_buyer_001",
    "quantity": 5000,
    "budget_min": 100000,
    "budget_max": 500000,
    "preferred_categories": ["Bulk", "Wholesale"]
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

echo "🌾 Supplier Recommendations - Large Farm"
echo "─────────────────────────────────────────"
curl -X POST "$BASE_URL/ai/recommendations/supplier" \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_id": "large_farm_001",
    "product_type": "Rice",
    "current_area_managed": 10.0
  }' \
  -w "\n\nStatus: %{http_code}\n"

echo -e "\n\n"

echo "=========================================="
echo "✅ Test Examples Complete"
echo "=========================================="
echo ""
echo "Documentation available at:"
echo "  📖 Swagger UI: $BASE_URL/docs"
echo "  📖 ReDoc: $BASE_URL/redoc"
echo ""
