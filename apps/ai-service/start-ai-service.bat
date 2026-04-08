@echo off
echo ========================================
echo AI Quality Shield - Starting Service
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo.

REM Install/Update dependencies
echo Installing dependencies...
pip install -r requirements.txt
echo.

REM Download YOLOv8 models if not present
if not exist "yolov8n.pt" (
    echo Downloading YOLOv8 nano model...
    echo Model will auto-download on first run
)

REM Start the service
echo ========================================
echo Starting AI Quality Shield Service
echo Service will be available at:
echo http://localhost:8001
echo API Docs: http://localhost:8001/docs
echo ========================================
echo.

python main.py

pause
