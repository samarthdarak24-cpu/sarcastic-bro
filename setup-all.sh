#!/bin/bash

echo "========================================"
echo "AgriVoice Platform - Automated Setup"
echo "========================================"
echo ""

echo "[1/5] Setting up Backend..."
cd apps/api
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file. Please configure it before continuing."
    read -p "Press enter to continue..."
fi
npm install
npx prisma generate
npx prisma migrate dev
echo "Backend setup complete!"
echo ""

echo "[2/5] Setting up Frontend..."
cd ../web
if [ ! -f ".env.local" ]; then
    cp .env.production.example .env.local
    echo "Created .env.local file."
fi
npm install
echo "Frontend setup complete!"
echo ""

echo "[3/5] Setting up AI Service..."
cd ../ai-service
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
echo "AI Service setup complete!"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Configure .env files in each service"
echo "2. Start services:"
echo "   - Backend: cd apps/api && npm run dev"
echo "   - Frontend: cd apps/web && npm run dev"
echo "   - AI Service: cd apps/ai-service && python main.py"
echo ""
echo "Or use the individual start scripts"
echo ""
