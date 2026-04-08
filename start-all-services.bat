@echo off
echo ========================================
echo    STARTING ALL SERVICES WITH QWEN 2.5
echo ========================================

echo.
echo 🚀 Starting Backend API (Port 3001)...
echo.

cd apps\api
start "Backend API" cmd /k "npm run dev"

echo ⏳ Waiting for Backend API to start...
timeout /t 5 /nobreak >nul

echo.
echo 🤖 Starting AI Service (Port 8000)...
echo.

cd ..\ai-service
start "AI Service" cmd /k "python -m uvicorn app.simple_main:app --reload --port 8000 --host 0.0.0.0"

echo ⏳ Waiting for AI Service to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    ✅ ALL SERVICES STARTED!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend API: http://localhost:3001
echo 🤖 AI Service: http://localhost:8000
echo 🧠 Ollama: http://localhost:11434
echo.
echo 📚 API Documentation:
echo   - Backend: http://localhost:3001/api-docs
echo   - AI Service: http://localhost:8001/docs
echo.
echo 🎯 Using Qwen 2.5 Model:
echo   ✅ FREE and unlimited
echo   ✅ No API rate limits
echo   ✅ Multilingual support
echo   ✅ Works offline
echo.
echo 🧪 Test the AI Chat:
echo   1. Open http://localhost:3000
echo   2. Go to AgriChat AI
echo   3. Ask a question in English, Hindi, or Marathi
echo   4. No more Gemini API 429 errors!
echo.

pause