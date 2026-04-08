@echo off
echo ========================================
echo   SERVICE STATUS CHECKER
echo ========================================
echo.

echo Checking services...
echo.

REM Check Ollama
echo [1/4] Checking Ollama...
ollama --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Ollama: NOT INSTALLED
    echo    Install from: https://ollama.com/download
) else (
    echo ✅ Ollama: INSTALLED
    
    REM Check if Ollama is running
    curl -s http://localhost:11434/api/tags >nul 2>&1
    if errorlevel 1 (
        echo ⚠️  Ollama: NOT RUNNING
        echo    Start with: ollama run qwen2.5:latest
    ) else (
        echo ✅ Ollama: RUNNING
        
        REM Check if Qwen model is available
        ollama list | findstr "qwen2.5" >nul 2>&1
        if errorlevel 1 (
            echo ⚠️  Qwen 2.5: NOT DOWNLOADED
            echo    Download with: ollama pull qwen2.5:latest
        ) else (
            echo ✅ Qwen 2.5: READY
        )
    )
)
echo.

REM Check AI Service
echo [2/4] Checking AI Service (Port 8001)...
curl -s http://localhost:8001/health >nul 2>&1
if errorlevel 1 (
    echo ❌ AI Service: NOT RUNNING
    echo    Start with: cd apps\ai-service ^&^& python app/simple_main.py
) else (
    echo ✅ AI Service: RUNNING
    
    REM Check Whisper endpoint
    curl -s http://localhost:8001/api/v1/whisper/health >nul 2>&1
    if errorlevel 1 (
        echo ⚠️  Whisper API: NOT AVAILABLE
    ) else (
        echo ✅ Whisper API: AVAILABLE
    )
    
    REM Check Simple Chat endpoint
    curl -s http://localhost:8001/api/v1/simple-chat/health >nul 2>&1
    if errorlevel 1 (
        echo ⚠️  Chat API: NOT AVAILABLE
    ) else (
        echo ✅ Chat API: AVAILABLE
    )
)
echo.

REM Check Frontend
echo [3/4] Checking Frontend (Port 3000)...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend: NOT RUNNING
    echo    Start with: cd apps\web ^&^& npm run dev
) else (
    echo ✅ Frontend: RUNNING
)
echo.

REM Check Browser Support
echo [4/4] Checking Browser Support...
echo ℹ️  Voice Assistant works best in:
echo    • Chrome (Recommended)
echo    • Edge
echo    • Safari
echo.

echo ========================================
echo   SUMMARY
echo ========================================
echo.

REM Count running services
set /a running=0
curl -s http://localhost:11434/api/tags >nul 2>&1
if not errorlevel 1 set /a running+=1

curl -s http://localhost:8001/health >nul 2>&1
if not errorlevel 1 set /a running+=1

curl -s http://localhost:3000 >nul 2>&1
if not errorlevel 1 set /a running+=1

echo Services running: %running%/3
echo.

if %running%==3 (
    echo ✅ ALL SERVICES RUNNING!
    echo.
    echo Voice Assistant is ready to use:
    echo 1. Open: http://localhost:3000
    echo 2. Login and click voice button (🎤)
    echo 3. Speak and enjoy!
) else (
    echo ⚠️  SOME SERVICES NOT RUNNING
    echo.
    echo To start all services:
    echo   start-voice-assistant.bat
    echo.
    echo Or start individually:
    if not %running% geq 1 (
        echo   1. ollama run qwen2.5:latest
    )
    if not %running% geq 2 (
        echo   2. cd apps\ai-service ^&^& python app/simple_main.py
    )
    if not %running% geq 3 (
        echo   3. cd apps\web ^&^& npm run dev
    )
)

echo.
echo ========================================
pause
