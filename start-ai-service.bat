@echo off
echo ========================================
echo Starting ODOP AI Service
echo ========================================
echo.

cd apps\ai-service

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found
    echo Please run install-ai-service.bat first
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting AI Service on http://localhost:8000
echo Press Ctrl+C to stop
echo.
echo API Documentation: http://localhost:8000/docs
echo.

python main.py
