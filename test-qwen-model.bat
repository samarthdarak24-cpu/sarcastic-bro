@echo off
echo ========================================
echo Testing Qwen 2.5 Model with ODOP Connect
echo ========================================
echo.

echo Step 1: Checking Ollama status...
curl -s http://localhost:11434/api/tags
echo.
echo.

echo Step 2: Testing AI Service with Qwen 2.5...
echo.

curl -X POST http://localhost:8001/api/simple-chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"Hello! What is ODOP Connect?\", \"user_id\": \"test_user\"}"

echo.
echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.
echo If you see a response above, Qwen 2.5 is working!
echo.
pause
