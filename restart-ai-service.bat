@echo off
echo ========================================
echo    RESTARTING AI SERVICE WITH QWEN 2.5
echo ========================================

echo.
echo 🛑 Stopping existing AI service...
echo.

REM Kill any existing Python processes on port 8001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do (
    echo Killing process %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo 🚀 Starting AI service with Qwen 2.5...
echo.

REM Change to AI service directory and start
cd apps\ai-service

echo Starting AI service on port 8001...
echo Using Qwen 2.5 model for unlimited FREE AI!
echo.

REM Start the AI service
python -m uvicorn app.simple_main:app --reload --port 8001 --host 0.0.0.0

echo.
echo ✅ AI Service started successfully!
echo 🤖 Using Qwen 2.5 model - No more API limits!
echo 🌐 Available at: http://localhost:8001
echo 📚 API Docs: http://localhost:8001/docs
echo.

pause