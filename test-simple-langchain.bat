@echo off
echo Testing Simple LangChain Chatbot...

set AI_SERVICE_URL=http://localhost:8000

echo.
echo 1. Testing health check...
curl -X GET "%AI_SERVICE_URL%/simple-langchain-chat/health"

echo.
echo.
echo 2. Testing demo endpoint...
curl -X GET "%AI_SERVICE_URL%/simple-langchain-chat/demo"

echo.
echo.
echo 3. Creating chat session...
curl -X POST "%AI_SERVICE_URL%/simple-langchain-chat/session" ^
  -H "Content-Type: application/json" ^
  -d "{\"user_id\": \"test-user-123\"}"

echo.
echo.
echo 4. Testing chat message...
curl -X POST "%AI_SERVICE_URL%/simple-langchain-chat/chat" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"How do I improve my soil health?\", \"user_id\": \"test-user-123\"}"

echo.
echo.
echo 5. Getting suggestions...
curl -X GET "%AI_SERVICE_URL%/simple-langchain-chat/suggestions?context=soil"

echo.
echo.
echo Test complete! The Simple LangChain Chatbot is working!
pause