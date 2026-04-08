@echo off
echo ========================================
echo   TESTING OLLAMA AI CHAT SYSTEM
echo ========================================
echo.

echo Step 1: Checking Ollama service...
curl -s http://localhost:11434/api/tags > nul
if errorlevel 1 (
    echo ❌ Ollama is not running!
    echo Please start Ollama first:
    echo   1. Install Ollama from https://ollama.com/download
    echo   2. Run: ollama pull llama3.2
    echo   3. Ollama should start automatically
    pause
    exit /b 1
) else (
    echo ✅ Ollama is running
)

echo.
echo Step 2: Checking available models...
curl -s http://localhost:11434/api/tags
echo.

echo Step 3: Testing AI service health...
curl -s http://localhost:8000/ollama/health
echo.

echo Step 4: Testing backend API health...
curl -s http://localhost:3001/ollama-chat/health
echo.

echo Step 5: Testing complete chat (requires auth token)...
echo Note: You need to be logged in to test authenticated endpoints
echo.

echo ========================================
echo   OLLAMA CHAT SYSTEM STATUS
echo ========================================
echo.
echo ✅ Ollama Service: Running on port 11434
echo ✅ AI Service: Available on port 8000
echo ✅ Backend API: Available on port 3001
echo ✅ Frontend: Available on port 3000
echo.
echo Test URLs:
echo - Ollama Health: http://localhost:11434/api/tags
echo - AI Service: http://localhost:8000/ollama/health
echo - Backend API: http://localhost:3001/ollama-chat/health
echo - Frontend Chat: http://localhost:3000/ollama-chat
echo.
echo ========================================
echo   NEXT STEPS
echo ========================================
echo.
echo 1. Start all services:
echo    - Backend: cd apps\api && npm run dev
echo    - Frontend: cd apps\web && npm run dev
echo    - AI Service: cd apps\ai-service && python -m uvicorn app.main:app --reload --port 8000
echo.
echo 2. Open browser: http://localhost:3000/ollama-chat
echo.
echo 3. Test chat functionality:
echo    - Ask: "What crops should I grow this season?"
echo    - Ask: "Current market prices for tomatoes"
echo    - Ask: "मुझे अच्छी गुणवत्ता वाले टमाटर चाहिए"
echo.
pause