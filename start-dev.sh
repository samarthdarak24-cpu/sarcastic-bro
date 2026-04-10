#!/bin/bash

echo "Starting FarmGuard Development Servers..."
echo ""

echo "Starting API Server (Port 3001)..."
cd apps/api && npm run dev &
API_PID=$!

sleep 3

echo "Starting Web App (Port 3000)..."
cd ../web && npm run dev &
WEB_PID=$!

echo ""
echo "========================================"
echo "Servers are running!"
echo "========================================"
echo "API Server: http://localhost:3001"
echo "Web App: http://localhost:3000"
echo ""
echo "Test Credentials:"
echo "  Farmer: farmer@test.com / Test@123"
echo "  Buyer:  buyer@test.com / Test@123"
echo "  FPO:    fpo@test.com / Test@123"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait $API_PID $WEB_PID
