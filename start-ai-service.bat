@echo off
echo Starting AI Quality Shield Service...
echo.

cd apps\ai-service

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo Installing dependencies...
pip install --upgrade pip
pip install fastapi uvicorn python-multipart pillow numpy opencv-python torch torchvision ultralytics timm

echo.
echo ========================================
echo AI Quality Shield Service Starting...
echo ========================================
echo Service URL: http://localhost:8001
echo Health Check: http://localhost:8001/health
echo API Docs: http://localhost:8001/docs
echo ========================================
echo.

REM Start the service
python main.py

pause
