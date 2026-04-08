@echo off
echo ========================================
echo   Advanced AI Chat System Startup
echo ========================================
echo.

echo 🚀 Starting Advanced AI Chat System...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.11+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo ✅ Python and Node.js detected
echo.

REM Start Redis (if available)
echo 🔄 Checking Redis...
redis-server --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Redis not found - some features may be limited
) else (
    echo ✅ Redis available
    start "Redis Server" redis-server
    timeout /t 2 >nul
)

echo.
echo 🔄 Starting AI Service Backend...
cd apps\ai-service

REM Install Python dependencies if needed
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

REM Install requirements
echo 📦 Installing Python dependencies...
pip install -r requirements.txt >nul 2>&1
pip install -r requirements_advanced.txt >nul 2>&1

REM Install spaCy model
echo 📦 Installing spaCy language model...
python -m spacy download en_core_web_sm >nul 2>&1

REM Start AI service
echo 🚀 Starting AI Service on port 8001...
start "AI Service" cmd /k "uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

cd ..\..

REM Wait a moment for backend to start
timeout /t 5 >nul

echo.
echo 🔄 Starting Frontend...
cd apps\web

REM Install Node.js dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    npm install
)

REM Start frontend
echo 🚀 Starting Frontend on port 3000...
start "Frontend" cmd /k "npm run dev"

cd ..\..

echo.
echo ========================================
echo   🎉 Advanced AI Chat System Started!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 AI Service: http://localhost:8001
echo 📚 API Docs: http://localhost:8001/docs
echo.
echo 🧪 To run tests:
echo    cd apps\ai-service
echo    python test_advanced_ai.py
echo.
echo 📖 Documentation: ADVANCED_AI_CHAT_DOCUMENTATION.md
echo.
echo Press any key to open the application...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo 🎯 System is ready! You can now:
echo    • Chat with the AI on any topic
echo    • Test different conversation modes
echo    • Try voice input/output
echo    • Export conversations
echo    • View analytics and insights
echo.
echo Press any key to exit...
pause >nul