@echo off
echo ========================================
echo   STARTING OLLAMA AI CHAT SYSTEM
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check if Ollama is installed
ollama --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Ollama is not installed!
    echo Please install Ollama first:
    echo 1. Visit: https://ollama.com/download
    echo 2. Download and install Ollama for Windows
    echo 3. Run this script again
    pause
    exit /b 1
) else (
    echo ✅ Ollama is installed
)

REM Check if llama3.2 model is available
ollama list | findstr "llama3.2" > nul
if errorlevel 1 (
    echo ❌ LLaMA 3.2 model not found!
    echo Downloading LLaMA 3.2 model (this may take a few minutes)...
    ollama pull llama3.2
    if errorlevel 1 (
        echo ❌ Failed to download model
        pause
        exit /b 1
    )
) else (
    echo ✅ LLaMA 3.2 model is available
)

REM Check if Ollama service is running
curl -s http://localhost:11434/api/tags > nul 2>&1
if errorlevel 1 (
    echo ❌ Ollama service is not running!
    echo Starting Ollama service...
    start "Ollama Service" ollama serve
    timeout /t 5 > nul
) else (
    echo ✅ Ollama service is running
)

echo.
echo ========================================
echo   STARTING ALL SERVICES
echo ========================================
echo.

REM Start AI Service
echo Starting AI Service on port 8000...
start "AI Service" cmd /k "cd apps\ai-service && python -m uvicorn app.main:app --reload --port 8000"
timeout /t 3 > nul

REM Start Backend API
echo Starting Backend API on port 3001...
start "Backend API" cmd /k "cd apps\api && npm run dev"
timeout /t 5 > nul

REM Start Frontend
echo Starting Frontend on port 3000...
start "Frontend" cmd /k "cd apps\web && npm run dev"
timeout /t 3 > nul

echo.
echo ========================================
echo   SERVICES STARTING...
echo ========================================
echo.
echo Please wait for all services to start (30-60 seconds)
echo.
echo Services:
echo ✅ Ollama Service: http://localhost:11434
echo 🔄 AI Service: http://localhost:8000 (starting...)
echo 🔄 Backend API: http://localhost:3001 (starting...)
echo 🔄 Frontend: http://localhost:3000 (starting...)
echo.
echo Once all services are running, open your browser to:
echo 🌐 http://localhost:3000/ollama-chat
echo.
echo ========================================
echo   TESTING COMMANDS
echo ========================================
echo.
echo Test the AI with these questions:
echo.
echo English:
echo - "What crops should I grow this season?"
echo - "Current market prices for tomatoes"
echo - "How to control pests in wheat?"
echo.
echo Hindi:
echo - "इस मौसम में कौन सी फसल उगानी चाहिए?"
echo - "टमाटर का आज का भाव क्या है?"
echo.
echo Marathi:
echo - "या हंगामात कोणते पीक लावावे?"
echo - "टोमॅटोचा आजचा भाव काय आहे?"
echo.
echo ========================================
echo   TROUBLESHOOTING
echo ========================================
echo.
echo If you encounter issues:
echo.
echo 1. Check Ollama: curl http://localhost:11434/api/tags
echo 2. Check AI Service: curl http://localhost:8000/ollama/health
echo 3. Check Backend: curl http://localhost:3001/ollama-chat/health
echo 4. Run test script: test-ollama-chat.bat
echo.
echo Press any key to open the chat interface...
pause > nul

REM Wait a bit more for services to fully start
timeout /t 10 > nul

REM Open browser to chat interface
start http://localhost:3000/ollama-chat

echo.
echo ========================================
echo   OLLAMA AI CHAT SYSTEM STARTED! 🎉
echo ========================================
echo.
echo Your local AI assistant is now ready!
echo.
echo Benefits:
echo ✅ 100%% FREE - No API costs ever
echo ✅ PRIVATE - Data stays on your computer
echo ✅ OFFLINE - Works without internet
echo ✅ FAST - Local processing
echo ✅ SMART - Agricultural expertise
echo ✅ MULTILINGUAL - Hindi, Marathi, English
echo.
echo Enjoy chatting with your AI assistant!
echo.