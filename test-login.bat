@echo off
echo Testing Login API...
echo.

echo Testing Farmer Login:
curl -X POST http://localhost:3001/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"farmer@test.com\",\"password\":\"Farmer123\"}"

echo.
echo.
echo Testing Buyer Login:
curl -X POST http://localhost:3001/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"buyer@test.com\",\"password\":\"Buyer123\"}"

echo.
echo.
pause
