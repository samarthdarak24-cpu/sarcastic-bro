@echo off
REM Test Buyer API Endpoints (Windows)
REM Run this after starting the API server

set API_URL=http://localhost:3001

echo Testing Buyer API Endpoints
echo ================================

REM 1. Login to get token
echo.
echo 1. Testing Login...
curl -s -X POST "%API_URL%/api/auth/login" -H "Content-Type: application/json" -d "{\"phone\":\"9876543220\",\"password\":\"password123\"}" > login_response.json

REM Extract token (simplified - you may need to parse JSON properly)
echo Please copy the token from login_response.json and set it manually
echo.
set /p TOKEN="Enter the token: "

if "%TOKEN%"=="" (
  echo Login failed. Please check credentials.
  exit /b 1
)

echo Login successful!

REM 2. Test KYC Status
echo.
echo 2. Testing KYC Status...
curl -s -X GET "%API_URL%/api/buyer/kyc/status" -H "Authorization: Bearer %TOKEN%"

REM 3. Test Wallet Balance
echo.
echo 3. Testing Wallet Balance...
curl -s -X GET "%API_URL%/api/buyer/wallet/balance" -H "Authorization: Bearer %TOKEN%"

REM 4. Test Marketplace Products
echo.
echo 4. Testing Marketplace Products...
curl -s -X GET "%API_URL%/api/buyer/marketplace/products?limit=5" -H "Authorization: Bearer %TOKEN%"

REM 5. Test Marketplace Filters
echo.
echo 5. Testing Marketplace Filters...
curl -s -X GET "%API_URL%/api/buyer/marketplace/filters" -H "Authorization: Bearer %TOKEN%"

REM 6. Test Orders
echo.
echo 6. Testing Orders...
curl -s -X GET "%API_URL%/api/buyer/bulk-orders?limit=5" -H "Authorization: Bearer %TOKEN%"

REM 7. Test Escrow
echo.
echo 7. Testing Escrow...
curl -s -X GET "%API_URL%/api/buyer/escrow?limit=5" -H "Authorization: Bearer %TOKEN%"

REM 8. Test Chat Conversations
echo.
echo 8. Testing Chat Conversations...
curl -s -X GET "%API_URL%/api/buyer/chat/conversations" -H "Authorization: Bearer %TOKEN%"

REM 9. Test Dashboard Stats
echo.
echo 9. Testing Dashboard Stats...
curl -s -X GET "%API_URL%/api/buyer/dashboard/stats" -H "Authorization: Bearer %TOKEN%"

REM 10. Test Suppliers
echo.
echo 10. Testing Suppliers...
curl -s -X GET "%API_URL%/api/buyer/suppliers" -H "Authorization: Bearer %TOKEN%"

echo.
echo ================================
echo All tests completed!
echo.
echo Note: If you see 'success: true' in responses, the endpoints are working correctly.

del login_response.json
pause
