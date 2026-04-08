#!/bin/bash

# N8N Chat Backend Test Script
# Tests all endpoints and verifies the chat system is working

echo "🧪 N8N Chat Backend Test Suite"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3001"
HEALTH_ENDPOINT="$BACKEND_URL/api/n8n/health"
CHAT_ENDPOINT="$BACKEND_URL/api/n8n/chat"

# Test 1: Check if backend is running
echo -e "${YELLOW}Test 1: Checking if backend is running...${NC}"
if curl -s "$BACKEND_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "  Start backend with: cd apps/api && npm run dev"
    exit 1
fi
echo ""

# Test 2: Health check endpoint
echo -e "${YELLOW}Test 2: Testing health check endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s "$HEALTH_ENDPOINT")
if echo "$HEALTH_RESPONSE" | grep -q "N8N Chat service is running"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "  Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}✗ Health check failed${NC}"
    echo "  Response: $HEALTH_RESPONSE"
fi
echo ""

# Test 3: Chat endpoint with simple message
echo -e "${YELLOW}Test 3: Testing chat endpoint with 'hi'...${NC}"
CHAT_RESPONSE=$(curl -s -X POST "$CHAT_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"chatInput":"hi"}')

if echo "$CHAT_RESPONSE" | grep -q "output"; then
    echo -e "${GREEN}✓ Chat endpoint working${NC}"
    echo "  Response: $CHAT_RESPONSE"
else
    echo -e "${RED}✗ Chat endpoint failed${NC}"
    echo "  Response: $CHAT_RESPONSE"
fi
echo ""

# Test 4: Chat endpoint with crop-related message
echo -e "${YELLOW}Test 4: Testing chat with crop-related message...${NC}"
CROP_RESPONSE=$(curl -s -X POST "$CHAT_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"chatInput":"Check crop health"}')

if echo "$CROP_RESPONSE" | grep -q "crop"; then
    echo -e "${GREEN}✓ Agriculture response working${NC}"
    echo "  Response: $CROP_RESPONSE"
else
    echo -e "${RED}✗ Agriculture response failed${NC}"
    echo "  Response: $CROP_RESPONSE"
fi
echo ""

# Test 5: Chat endpoint with weather message
echo -e "${YELLOW}Test 5: Testing chat with weather message...${NC}"
WEATHER_RESPONSE=$(curl -s -X POST "$CHAT_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"chatInput":"weather forecast"}')

if echo "$WEATHER_RESPONSE" | grep -q "weather\|Weather"; then
    echo -e "${GREEN}✓ Weather response working${NC}"
    echo "  Response: $WEATHER_RESPONSE"
else
    echo -e "${RED}✗ Weather response failed${NC}"
    echo "  Response: $WEATHER_RESPONSE"
fi
echo ""

# Summary
echo -e "${YELLOW}================================${NC}"
echo -e "${GREEN}✓ All tests completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Start frontend: cd apps/web && npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Click the green leaf button"
echo "4. Send a message to test the chat"
echo ""
