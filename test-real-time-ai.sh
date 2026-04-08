#!/bin/bash

# Test Real-Time AI Agent
# This script tests the enhanced AI chat with real-time data integration

echo "🧪 Testing Real-Time AI Agent..."
echo ""

AI_SERVICE_URL="http://localhost:8000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
curl -s "$AI_SERVICE_URL/api/v1/simple-chat/health" | jq '.'
echo ""

# Test 2: Simple Chat (General Question)
echo -e "${YELLOW}Test 2: General Question${NC}"
curl -s -X POST "$AI_SERVICE_URL/api/v1/simple-chat/chat/enhanced" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is photosynthesis?",
    "user_profile": {
      "language": "en"
    }
  }' | jq '.response'
echo ""

# Test 3: Data Query (English)
echo -e "${YELLOW}Test 3: Data Query - Show Orders (English)${NC}"
curl -s -X POST "$AI_SERVICE_URL/api/v1/simple-chat/chat/enhanced" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show my orders",
    "user_id": "test-user-123",
    "user_profile": {
      "role": "FARMER",
      "language": "en"
    }
  }' | jq '{response: .response, intent: .intent, data_fetched: .data_fetched}'
echo ""

# Test 4: Data Query (Hindi)
echo -e "${YELLOW}Test 4: Data Query - Show Orders (Hindi)${NC}"
curl -s -X POST "$AI_SERVICE_URL/api/v1/simple-chat/chat/enhanced" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "मेरे ऑर्डर दिखाओ",
    "user_id": "test-user-123",
    "user_profile": {
      "role": "FARMER",
      "language": "hi"
    }
  }' | jq '{response: .response, intent: .intent, data_fetched: .data_fetched}'
echo ""

# Test 5: Data Query with Real-Time Data
echo -e "${YELLOW}Test 5: Data Query with Real-Time Data${NC}"
curl -s -X POST "$AI_SERVICE_URL/api/v1/simple-chat/chat/enhanced" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Summarize my products",
    "user_id": "test-user-123",
    "real_time_data": {
      "products": [
        {"name": "Tomatoes", "quantity": 20, "unit": "kg", "price": 50, "status": "active"},
        {"name": "Onions", "quantity": 15, "unit": "kg", "price": 40, "status": "active"},
        {"name": "Wheat", "quantity": 100, "unit": "kg", "price": 25, "status": "active"}
      ]
    },
    "user_profile": {
      "role": "FARMER",
      "language": "en"
    }
  }' | jq '{response: .response, data_fetched: .data_fetched}'
echo ""

# Test 6: Create Action
echo -e "${YELLOW}Test 6: Create Action - Add Product${NC}"
curl -s -X POST "$AI_SERVICE_URL/api/v1/simple-chat/chat/enhanced" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add 20 kg tomatoes at 50 rupees",
    "user_id": "test-user-123",
    "user_profile": {
      "role": "FARMER",
      "language": "en"
    }
  }' | jq '{response: .response, intent: .intent, requires_confirmation: .requires_confirmation}'
echo ""

# Test 7: Payment Query
echo -e "${YELLOW}Test 7: Payment Query${NC}"
curl -s -X POST "$AI_SERVICE_URL/api/v1/simple-chat/chat/enhanced" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is my balance?",
    "user_id": "test-user-123",
    "user_profile": {
      "role": "FARMER",
      "language": "en"
    }
  }' | jq '{response: .response, intent: .intent}'
echo ""

# Test 8: Multi-language (Marathi)
echo -e "${YELLOW}Test 8: Multi-language - Marathi${NC}"
curl -s -X POST "$AI_SERVICE_URL/api/v1/simple-chat/chat/enhanced" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "माझे उत्पादन दाखवा",
    "user_id": "test-user-123",
    "user_profile": {
      "role": "FARMER",
      "language": "mr"
    }
  }' | jq '{response: .response, intent: .intent}'
echo ""

echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Check if all responses are natural and accurate"
echo "2. Verify data_fetched is true for data queries"
echo "3. Confirm multi-language support works"
echo "4. Test in the browser UI"
