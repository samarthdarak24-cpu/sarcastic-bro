@echo off
REM AI Quality Shield - Start Services Script (Windows)
REM Starts both Quality Scan (8000) and AI Quality Shield (8001) services

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting AI Quality Shield Services...
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✓ Python found: %PYTHON_VERSION%
echo.

REM Create virtual environment if not exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -q -r requirements.txt

echo.
echo ✓ Setup complete!
echo.
echo Starting services...
echo.

REM Start Quality Scan Service (port 8000)
echo 🌾 Starting Quality Scan Service (port 8000)...
start "Quality Scan Service" python quality_scan.py

REM Wait for service to start
timeout /t 2 /nobreak

REM Start AI Quality Shield (port 8001)
echo 🛡️  Starting AI Quality Shield (port 8001)...
start "AI Quality Shield" python main.py

REM Wait for service to start
timeout /t 2 /nobreak

echo.
echo ✅ Services started successfully!
echo.
echo 📍 Endpoints:
echo    Quality Scan:      http://localhost:8000
echo    AI Quality Shield: http://localhost:8001
echo.
echo 📚 API Documentation:
echo    Quality Scan:      http://localhost:8000/docs
echo    AI Quality Shield: http://localhost:8001/docs
echo.
echo 🛑 To stop services, close the command windows
echo.
pause
