@echo off
echo Testing Super Advanced AI Chat System...
echo.

echo Testing AI Service Health...
curl -X GET "http://localhost:8000/super-chat/health" -H "Content-Type: application/json"
echo.
echo.

echo Testing Super AI Chat - Name Question...
curl -X POST "http://localhost:8000/super-chat/context-aware" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"What is your name?\", \"user_type\": \"FARMER\", \"user_context\": {\"userId\": \"test123\", \"name\": \"Test User\"}}"
echo.
echo.

echo Testing Super AI Chat - Market Prices...
curl -X POST "http://localhost:8000/super-chat/context-aware" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"Current market prices\", \"user_type\": \"FARMER\", \"user_context\": {\"userId\": \"test123\", \"name\": \"Test User\"}}"
echo.
echo.

echo Testing Super AI Chat - Crop Advice...
curl -X POST "http://localhost:8000/super-chat/context-aware" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"What crops should I grow?\", \"user_type\": \"FARMER\", \"user_context\": {\"userId\": \"test123\", \"name\": \"Test User\"}}"
echo.
echo.

echo Testing complete!
pause