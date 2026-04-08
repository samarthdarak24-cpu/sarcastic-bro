#!/bin/bash

echo "========================================"
echo "AI Quality Shield - Starting Service"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo ""
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo ""

# Install/Update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt
echo ""

# Download YOLOv8 models if not present
if [ ! -f "yolov8n.pt" ]; then
    echo "YOLOv8 model will auto-download on first run"
fi

# Start the service
echo "========================================"
echo "Starting AI Quality Shield Service"
echo "Service will be available at:"
echo "http://localhost:8001"
echo "API Docs: http://localhost:8001/docs"
echo "========================================"
echo ""

python main.py
