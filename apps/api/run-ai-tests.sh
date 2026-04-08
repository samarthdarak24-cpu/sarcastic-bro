#!/bin/bash
# Script to run AI module integration tests on Linux/Mac

echo "========================================"
echo "AI Module Integration Tests"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if Prisma client is generated
echo "Checking Prisma setup..."
npm run db:generate
echo ""

# Run the AI integration tests
echo "Running AI module tests..."
echo ""
npm run test:ai

echo ""
echo "========================================"
echo "Tests completed!"
echo "========================================"
echo ""
echo "To run all tests: npm test"
echo "To run with coverage: npm run test:coverage"
echo "To run in watch mode: npm run test:watch"
echo ""
