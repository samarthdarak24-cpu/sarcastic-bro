#!/bin/bash

# ODOP AI Service - Startup Script
# This script starts the FastAPI AI service for the ODOP CONNECT platform

set -e

echo "=================================="
echo "ODOP AI Service - Startup Script"
echo "=================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed."
    exit 1
fi

echo "✓ Python version: $(python3 --version)"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

echo ""

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate
echo "✓ Virtual environment activated"

echo ""

# Install/upgrade dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt -q
echo "✓ Dependencies installed"

echo ""

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env from .env.example..."
    cp .env.example .env
    echo "✓ .env created (update with your settings if needed)"
else
    echo "✓ .env already exists"
fi

echo ""
echo "=================================="
echo "🚀 Starting ODOP AI Service"
echo "=================================="
echo ""
echo "Server will be available at:"
echo "  → http://localhost:8000"
echo ""
echo "Documentation:"
echo "  → Swagger UI: http://localhost:8000/docs"
echo "  → ReDoc: http://localhost:8000/redoc"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the service
python3 main.py
