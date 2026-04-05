#!/bin/bash

echo "========================================"
echo "AI Chat Widget - Quick Start"
echo "========================================"
echo ""

echo "This will start the chat in FALLBACK MODE"
echo "(Works without OpenAI API key)"
echo ""
echo "Services starting:"
echo "- API Server (port 3001)"
echo "- Frontend (port 3000)"
echo ""
echo "Press Ctrl+C to stop all services"
echo "========================================"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup INT TERM

# Start API server
cd apps/api
npm run dev &
API_PID=$!

# Wait a bit
sleep 3

# Start frontend
cd ../web
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Services started!"
echo ""
echo "Open: http://localhost:3000"
echo "Login and click chat button (bottom-right)"
echo ""
echo "Chat will work with intelligent fallback responses"
echo "No OpenAI API key needed!"
echo "========================================"
echo ""

# Wait for processes
wait
