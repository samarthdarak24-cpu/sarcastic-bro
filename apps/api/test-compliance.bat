@echo off
echo Testing Government Compliance APIs...
echo.
echo Make sure you have a valid JWT token and replace YOUR_TOKEN_HERE
echo.
pause

echo.
echo 1. Testing Family Links API...
curl -X GET http://localhost:3001/api/compliance/family-links ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
echo.
echo.

echo 2. Testing Subsidies API...
curl -X GET http://localhost:3001/api/compliance/subsidies ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
echo.
echo.

echo 3. Testing Blacklist Check API...
curl -X GET http://localhost:3001/api/compliance/blacklist-check ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
echo.
echo.

echo 4. Testing Re-KYC Timer API...
curl -X GET http://localhost:3001/api/compliance/rekyc-timer ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
echo.
echo.

echo Tests complete!
pause
