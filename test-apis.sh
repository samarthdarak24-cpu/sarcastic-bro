#!/bin/bash

# API Testing Script for ODOP Connect
# Tests critical endpoints to verify system functionality

API_URL="http://localhost:3001"
FARMER_EMAIL="farmer@test.com"
FARMER_PASSWORD="Test123!@#"
BUYER_EMAIL="buyer@test.com"
BUYER_PASSWORD="Test123!@#"

echo "================================"
echo "ODOP Connect API Testing"
echo "================================"
echo ""

# Test 1: Health Check
echo "TEST 1: Health Check"
curl -s "$API_URL/health" | jq . || echo "FAILED"
echo ""

# Test 2: Register Farmer
echo "TEST 2: Register Farmer"
FARMER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Farmer\",
    \"email\": \"$FARMER_EMAIL\",
    \"password\": \"$FARMER_PASSWORD\",
    \"role\": \"FARMER\",
    \"phone\": \"+91-9999999999\",
    \"district\": \"Test District\",
    \"state\": \"Test State\"
  }")
echo $FARMER_RESPONSE | jq . || echo "FAILED"
FARMER_TOKEN=$(echo $FARMER_RESPONSE | jq -r '.data.accessToken // empty')
echo "Farmer Token: $FARMER_TOKEN"
echo ""

# Test 3: Register Buyer
echo "TEST 3: Register Buyer"
BUYER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Buyer\",
    \"email\": \"$BUYER_EMAIL\",
    \"password\": \"$BUYER_PASSWORD\",
    \"role\": \"BUYER\",
    \"phone\": \"+91-8888888888\",
    \"district\": \"Test District\",
    \"state\": \"Test State\"
  }")
echo $BUYER_RESPONSE | jq . || echo "FAILED"
BUYER_TOKEN=$(echo $BUYER_RESPONSE | jq -r '.data.accessToken // empty')
echo "Buyer Token: $BUYER_TOKEN"
echo ""

# Test 4: Get All Products
echo "TEST 4: Get All Products"
curl -s "$API_URL/products" | jq . || echo "FAILED"
echo ""

# Test 5: Create Product (Farmer)
echo "TEST 5: Create Product (Farmer)"
PRODUCT_RESPONSE=$(curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FARMER_TOKEN" \
  -d "{
    \"name\": \"Test Wheat\",
    \"category\": \"Cereals\",
    \"price\": 45,
    \"quantity\": 500,
    \"unit\": \"kg\",
    \"description\": \"High quality wheat\",
    \"district\": \"Test District\",
    \"state\": \"Test State\"
  }")
echo $PRODUCT_RESPONSE | jq . || echo "FAILED"
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.data.id // empty')
echo "Product ID: $PRODUCT_ID"
echo ""

# Test 6: Get Product Details
if [ ! -z "$PRODUCT_ID" ]; then
  echo "TEST 6: Get Product Details"
  curl -s "$API_URL/products/$PRODUCT_ID" | jq . || echo "FAILED"
  echo ""
fi

# Test 7: Create Order (Buyer)
if [ ! -z "$PRODUCT_ID" ] && [ ! -z "$BUYER_TOKEN" ]; then
  echo "TEST 7: Create Order (Buyer)"
  ORDER_RESPONSE=$(curl -s -X POST "$API_URL/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $BUYER_TOKEN" \
    -d "{
      \"productId\": \"$PRODUCT_ID\",
      \"quantity\": 100,
      \"deliveryAddress\": \"Test Address\",
      \"deliveryDate\": \"2026-05-01\"
    }")
  echo $ORDER_RESPONSE | jq . || echo "FAILED"
  ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.data.id // empty')
  echo "Order ID: $ORDER_ID"
  echo ""
fi

echo "================================"
echo "API Testing Complete!"
echo "================================"
