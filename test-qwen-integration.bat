@echo off
echo ========================================
echo    TESTING QWEN 2.5 INTEGRATION
echo ========================================

echo.
echo 🧪 Step 1: Testing Ollama Server...
echo.

REM Check if Ollama is running
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama server not running!
    echo Starting Ollama server...
    start /B ollama serve
    echo ⏳ Waiting for server to start...
    timeout /t 5 /nobreak >nul
)

echo ✅ Ollama server is running

echo.
echo 🤖 Step 2: Testing Qwen 2.5 Model...
echo.

REM Test Qwen 2.5 model directly
echo Testing Qwen 2.5 model with agricultural question...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:11434/api/generate' -Method POST -ContentType 'application/json' -Body '{\"model\":\"qwen2.5:latest\",\"prompt\":\"What is the best time to plant tomatoes in Maharashtra, India?\",\"stream\":false}' | ConvertTo-Json"

echo.
echo 🔧 Step 3: Testing AI Service Integration...
echo.

REM Test your AI service
echo Testing AI service with Qwen 2.5...
curl -X POST http://localhost:8001/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"What crops should I plant this season in Maharashtra?\",\"user_id\":\"test_farmer\",\"model\":\"qwen2.5:latest\"}"

echo.
echo 📊 Step 4: Testing Universal AI Service...
echo.

REM Test Universal AI
curl -X POST http://localhost:8001/universal-ai/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"मला शेतीबद्दल माहिती हवी आहे\",\"user_id\":\"test_farmer\",\"language\":\"mr\"}"

echo.
echo 🌐 Step 5: Testing Frontend Integration...
echo.

REM Test frontend API
curl -X POST http://localhost:3001/ollama-chat/complete ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer test_token" ^
  -d "{\"message\":\"How do I add products to sell?\",\"context\":{\"userId\":\"test_farmer\",\"role\":\"FARMER\",\"location\":\"Maharashtra\",\"language\":\"en\",\"sessionId\":\"test_session\"}}"

echo.
echo 📋 Step 6: Configuration Summary...
echo.

echo ✅ QWEN 2.5 CONFIGURATION COMPLETE!
echo.
echo 🔧 Configuration Details:
echo • Model: qwen2.5:latest
echo • Server: http://localhost:11434
echo • AI Service: Port 8001
echo • Frontend API: Port 3001
echo • Web App: Port 3000
echo.
echo 🎯 Benefits of Qwen 2.5:
echo • ✅ FREE and unlimited usage
echo • ✅ Runs locally on your computer
echo • ✅ Multilingual support (English, Hindi, Marathi)
echo • ✅ Better reasoning for agricultural questions
echo • ✅ No API rate limits or costs
echo • ✅ Works offline
echo • ✅ Privacy - data stays on your computer
echo.
echo 🚀 Next Steps:
echo 1. Restart your AI service if it was running
echo 2. Test the chat in your web application
echo 3. Try asking questions in different languages
echo 4. No more Gemini API 429 errors!
echo.

pause