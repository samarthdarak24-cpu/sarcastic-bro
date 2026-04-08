@echo off
echo ========================================
echo Testing Stream AI Chat System
echo ========================================

echo.
echo 1. Testing Health Endpoint...
curl -s http://localhost:8000/health

echo.
echo.
echo 2. Testing Demo Endpoint...
curl -s http://localhost:8000/demo

echo.
echo.
echo 3. Testing Agent Start...
curl -s -X POST http://localhost:8000/start-ai-agent -H "Content-Type: application/json" -d "{\"channel_id\":\"test_channel\",\"agent_type\":\"crop_advisor\",\"user_id\":\"test_user\"}"

echo.
echo.
echo 4. Testing Message Processing...
curl -s -X POST http://localhost:8000/process-message -H "Content-Type: application/json" -d "{\"channel_id\":\"test_channel\",\"message\":\"How do I grow rice?\"}"

echo.
echo.
echo 5. Testing Agent Status...
curl -s "http://localhost:8000/agent-status?channel_id=test_channel"

echo.
echo.
echo ========================================
echo Stream AI Chat System Test Complete!
echo ========================================
echo.
echo Frontend URL: http://localhost:3000/simple-stream-chat
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
pause