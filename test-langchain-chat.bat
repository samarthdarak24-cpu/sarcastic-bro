@echo off
echo Testing LangChain Chatbot API...

set AI_SERVICE_URL=http://localhost:8000

echo.
echo 1. Testing health check...
curl -X GET "%AI_SERVICE_URL%/langchain-chat/health"

echo.
echo.
echo 2. Creating chat session...
curl -X POST "%AI_SERVICE_URL%/langchain-chat/session" ^
  -H "Content-Type: application/json" ^
  -d "{\"user_id\": \"test-user-123\"}"

echo.
echo.
echo 3. Testing chat message...
curl -X POST "%AI_SERVICE_URL%/langchain-chat/chat" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"How do I improve my soil health?\", \"user_id\": \"test-user-123\"}"

echo.
echo.
echo 4. Getting suggestions...
curl -X GET "%AI_SERVICE_URL%/langchain-chat/suggestions?context=soil"

echo.
echo.
echo 5. Testing knowledge base stats...
curl -X GET "%AI_SERVICE_URL%/langchain-chat/knowledge-base/stats"

echo.
echo.
echo Test complete!
pause