@echo off
echo ========================================
echo    TESTING OLLAMA AI - FREE & LOCAL
echo ========================================

echo.
echo 🧪 Testing Ollama Connection...
echo.

REM Test if Ollama is running
curl -s http://localhost:11434/api/tags
if %errorlevel% neq 0 (
    echo ❌ Ollama server not running!
    echo.
    echo Starting Ollama server...
    start /B ollama serve
    echo ⏳ Waiting for server to start...
    timeout /t 5 /nobreak >nul
)

echo.
echo 🤖 Testing AI Chat...
echo.

REM Test AI response
curl -X POST http://localhost:11434/api/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"qwen2.5:latest\",\"prompt\":\"Hello! Can you help farmers with agricultural advice?\",\"stream\":false}"

echo.
echo.
echo 🧪 Testing Your AI Service...
echo.

REM Test your AI service endpoint
curl -X POST http://localhost:8001/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"What crops should I plant this season?\",\"user_id\":\"test_farmer\"}"

echo.
echo.
echo ✅ OLLAMA TEST COMPLETE!
echo.
echo If you see JSON responses above, Ollama is working perfectly!
echo Your AI chat should now work without any API errors.
echo.

pause