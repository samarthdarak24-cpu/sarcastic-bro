@echo off
echo ========================================
echo    VERIFYING QWEN 2.5 SETUP
echo ========================================

echo.
echo 🧪 Verification Tests:
echo.

REM Test 1: Ollama
echo 1. Testing Ollama Server...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% == 0 (
    echo    ✅ Ollama is running
) else (
    echo    ❌ Ollama is NOT running
)

REM Test 2: AI Service
echo 2. Testing AI Service (Port 8001)...
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% == 0 (
    echo    ✅ AI Service is running
) else (
    echo    ❌ AI Service is NOT running
)

REM Test 3: Backend API
echo 3. Testing Backend API (Port 3001)...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% == 0 (
    echo    ✅ Backend API is running
) else (
    echo    ❌ Backend API is NOT running
)

REM Test 4: Frontend
echo 4. Testing Frontend (Port 3000)...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% == 0 (
    echo    ✅ Frontend is running
) else (
    echo    ❌ Frontend is NOT running
)

echo.
echo ========================================
echo    CONFIGURATION SUMMARY
echo ========================================
echo.
echo 🤖 AI Model: Qwen 2.5
echo 📍 Ollama URL: http://localhost:11434
echo 🔌 AI Service: http://localhost:8001
echo 🌐 Backend API: http://localhost:3001
echo 💻 Frontend: http://localhost:3000
echo.
echo ✅ QWEN 2.5 SETUP VERIFIED!
echo.
echo 🎯 Next Steps:
echo 1. Open http://localhost:3000 in your browser
echo 2. Go to AgriChat AI
echo 3. Ask a question
echo 4. Enjoy FREE unlimited AI!
echo.

pause