#!/bin/bash

# AI Quality Shield - Start Services Script
# Starts both Quality Scan (8000) and AI Quality Shield (8001) services

set -e

echo "🚀 Starting AI Quality Shield Services..."
echo ""

# Check Python
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.8+"
    exit 1
fi

echo "✓ Python found: $(python --version)"
echo ""

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "✓ Setup complete!"
echo ""
echo "Starting services..."
echo ""

# Start Quality Scan Service (port 8000)
echo "🌾 Starting Quality Scan Service (port 8000)..."
python quality_scan.py &
QUALITY_SCAN_PID=$!

# Wait for service to start
sleep 2

# Start AI Quality Shield (port 8001)
echo "🛡️  Starting AI Quality Shield (port 8001)..."
python main.py &
SHIELD_PID=$!

# Wait for service to start
sleep 2

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📍 Endpoints:"
echo "   Quality Scan:      http://localhost:8000"
echo "   AI Quality Shield: http://localhost:8001"
echo ""
echo "📚 API Documentation:"
echo "   Quality Scan:      http://localhost:8000/docs"
echo "   AI Quality Shield: http://localhost:8001/docs"
echo ""
echo "🛑 To stop services, press Ctrl+C"
echo ""

# Wait for both processes
wait $QUALITY_SCAN_PID $SHIELD_PID
