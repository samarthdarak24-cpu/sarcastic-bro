@echo off
echo ========================================
echo Testing Advanced AI Chat
echo ========================================
echo.

echo Test 1: Health Check
curl -X GET http://localhost:8000/health
echo.
echo.

echo Test 2: Simple Chat Query
curl -X POST http://localhost:8000/ai/chat/context-aware ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"What is the price of wheat?\", \"user_type\": \"FARMER\"}"
echo.
echo.

echo Test 3: Advanced Query with Context
curl -X POST http://localhost:8000/ai/chat/context-aware ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"Should I grow tomatoes or onions this season?\", \"user_type\": \"FARMER\", \"user_context\": {\"location\": \"Nashik\", \"name\": \"Rajesh\"}}"
echo.
echo.

echo ========================================
echo Tests Complete!
echo ========================================
pause
