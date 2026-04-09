@echo off
echo ===================================================
echo 🚀 STARTING AGRIVOICE REAL AI SERVICE (PORT 8000)
echo ===================================================
echo.
echo [1/3] Navigating to AI Service directory...
cd apps\ai-service

echo [2/3] Activating virtual environment (if exists)...
if exist venv\Scripts\activate (
    call venv\Scripts\activate
) else (
    echo [!] No venv found, using system python. 
    echo [!] Make sure requirements in requirements_advanced.txt are installed:
    echo [!] pip install -r requirements_advanced.txt
)

echo [3/3] Launching Python FastAPI Service...
python real_ai_service.py

pause
