@echo off
echo 🚀 Starting AI Quality Shield Scanner...
echo Technologies: YOLOv8 + EfficientNet + Transfer Learning + OpenCV
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements_quality_shield.txt

REM Create models directory
if not exist "models" mkdir models

REM Download YOLOv8 model
echo ⬇️  Downloading YOLOv8 model...
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

REM Start the server
echo.
echo ✅ Setup complete!
echo 🌐 Starting API server on http://localhost:8001
echo 📖 API docs available at http://localhost:8001/docs
echo.

uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
