#!/bin/bash

# Test Buyer API Endpoints
# Run this after starting the API server

API_URL="http://localhost:3001"
TOKEN=""

echo "🧪 Testing Buyer API Endpoints"
echo "================================"

# 1. Login to get token
echo ""
echo "1️⃣ Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543220","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Please check credentials."
  exit 1
fi

echo "✅ Login successful! Token obtained."

# 2. Test KYC Status
echo ""
echo "2️⃣ Testing KYC Status..."
curl -s -X GET "$API_URL/api/buyer/kyc/status" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 3. Test Wallet Balance
echo ""
echo "3️⃣ Testing Wallet Balance..."
curl -s -X GET "$API_URL/api/buyer/wallet/balance" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. Test Marketplace Products
echo ""
echo "4️⃣ Testing Marketplace Products..."
curl -s -X GET "$API_URL/api/buyer/marketplace/products?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 5. Test Marketplace Filters
echo ""
echo "5️⃣ Testing Marketplace Filters..."
curl -s -X GET "$API_URL/api/buyer/marketplace/filters" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 6. Test Orders
echo ""
echo "6️⃣ Testing Orders..."
curl -s -X GET "$API_URL/api/buyer/bulk-orders?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 7. Test Escrow
echo ""
echo "7️⃣ Testing Escrow..."
curl -s -X GET "$API_URL/api/buyer/escrow?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 8. Test Chat Conversations
echo ""
echo "8️⃣ Testing Chat Conversations..."
curl -s -X GET "$API_URL/api/buyer/chat/conversations" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 9. Test Dashboard Stats
echo ""
echo "9️⃣ Testing Dashboard Stats..."
curl -s -X GET "$API_URL/api/buyer/dashboard/stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 10. Test Suppliers
echo ""
echo "🔟 Testing Suppliers..."
curl -s -X GET "$API_URL/api/buyer/suppliers" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "================================"
echo "✅ All tests completed!"
echo ""
echo "Note: If you see 'success: true' in responses, the endpoints are working correctly."
