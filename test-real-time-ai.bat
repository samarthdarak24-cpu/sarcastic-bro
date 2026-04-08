@echo off
REM Test Real-Time AI Agent
REM This script tests the enhanced AI chat with real-time data integration

echo Testing Real-Time AI Agent...
echo.

set AI_SERVICE_URL=http://localhost:8000

REM Test 1: Health Check
echo Test 1: Health Check
curl -s "%AI_SERVICE_URL%/api/v1/simple-chat/health"
echo.
echo.

REM Test 2: Simple Chat (General Question)
echo Test 2: General Question
curl -s -X POST "%AI_SERVICE_URL%/api/v1/simple-chat/chat/enhanced" -H "Content-Type: application/json" -d "{\"message\": \"What is photosynthesis?\", \"user_profile\": {\"language\": \"en\"}}"
echo.
echo.

REM Test 3: Data Query (English)
echo Test 3: Data Query - Show Orders (English)
curl -s -X POST "%AI_SERVICE_URL%/api/v1/simple-chat/chat/enhanced" -H "Content-Type: application/json" -d "{\"message\": \"Show my orders\", \"user_id\": \"test-user-123\", \"user_profile\": {\"role\": \"FARMER\", \"language\": \"en\"}}"
echo.
echo.

REM Test 4: Data Query with Real-Time Data
echo Test 4: Data Query with Real-Time Data
curl -s -X POST "%AI_SERVICE_URL%/api/v1/simple-chat/chat/enhanced" -H "Content-Type: application/json" -d "{\"message\": \"Summarize my products\", \"user_id\": \"test-user-123\", \"real_time_data\": {\"products\": [{\"name\": \"Tomatoes\", \"quantity\": 20, \"unit\": \"kg\", \"price\": 50}]}, \"user_profile\": {\"role\": \"FARMER\", \"language\": \"en\"}}"
echo.
echo.

REM Test 5: Create Action
echo Test 5: Create Action - Add Product
curl -s -X POST "%AI_SERVICE_URL%/api/v1/simple-chat/chat/enhanced" -H "Content-Type: application/json" -d "{\"message\": \"Add 20 kg tomatoes at 50 rupees\", \"user_id\": \"test-user-123\", \"user_profile\": {\"role\": \"FARMER\", \"language\": \"en\"}}"
echo.
echo.

echo All tests completed!
echo.
echo Next steps:
echo 1. Check if all responses are natural and accurate
echo 2. Verify data_fetched is true for data queries
echo 3. Confirm multi-language support works
echo 4. Test in the browser UI
pause
