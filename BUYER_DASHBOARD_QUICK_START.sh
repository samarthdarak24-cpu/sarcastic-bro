#!/usr/bin/env bash
# ============================================================================
# BUYER DASHBOARD - QUICK START GUIDE FOR DEVELOPERS
# ============================================================================

# START HERE! This guide will get you up and running in minutes.

echo "🚀 ODOP Connect - Buyer Dashboard"
echo "=================================="
echo ""
echo "Read this first: BUYER_DASHBOARD_FINAL_SUMMARY.md"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# STEP 1: ENVIRONMENT SETUP
# ──────────────────────────────────────────────────────────────────────────

echo "STEP 1: Install Dependencies"
echo "────────────────────────────"
npm install
cd apps/web && npm install && cd ../api && npm install && cd ../..

echo ""
echo "✅ Done!"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# STEP 2: ENVIRONMENT VARIABLES
# ──────────────────────────────────────────────────────────────────────────

echo "STEP 2: Configure Environment Variables"
echo "───────────────────────────────────────"

# Backend .env
cat > apps/api/.env.local << 'EOF'
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="dev-secret-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-change-in-production"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
UPLOAD_DIR="./uploads"
EOF

echo "Created: apps/api/.env.local"

# Frontend .env
cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
EOF

echo "Created: apps/web/.env.local"
echo "✅ Done!"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# STEP 3: DATABASE SETUP
# ──────────────────────────────────────────────────────────────────────────

echo "STEP 3: Initialize Database"
echo "──────────────────────────"

cd apps/api
npx prisma migrate dev --name init
npx prisma db seed
cd ../..

echo "✅ Done!"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# STEP 4: START DEVELOPMENT SERVERS
# ──────────────────────────────────────────────────────────────────────────

echo "STEP 4: Start Development Servers"
echo "─────────────────────────────────"
echo ""
echo "Open two terminal windows:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd apps/api && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd apps/web && npm run dev"
echo ""
echo "✅ Backend will run on: http://localhost:3001"
echo "✅ Frontend will run on: http://localhost:3000"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# TESTING THE SETUP
# ──────────────────────────────────────────────────────────────────────────

echo "TESTING YOUR SETUP"
echo "─────────────────"
echo ""
echo "1. Health Check:"
echo "   curl http://localhost:3001/health"
echo ""
echo "2. API Test:"
echo "   curl http://localhost:3001/api/products"
echo ""
echo "3. Frontend:"
echo "   Open http://localhost:3000 in your browser"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# DOCUMENTATION REFERENCE
# ──────────────────────────────────────────────────────────────────────────

echo ""
echo "📚 DOCUMENTATION"
echo "═════════════════════════════════════════════════════════════"
echo ""
echo "1. PROJECT OVERVIEW"
echo "   📄 BUYER_DASHBOARD_FINAL_SUMMARY.md"
echo "   • Complete project status"
echo "   • Implementation breakdown"
echo "   • Performance metrics"
echo ""
echo "2. API REFERENCE"
echo "   📄 SOCKET_IO_REAL_TIME_IMPLEMENTATION.md"
echo "   • 82 API endpoints"
echo "   • Real-time Socket.IO events"
echo "   • Implementation examples"
echo ""
echo "3. REAL-TIME FEATURES"
echo "   📄 SOCKET_IO_REAL_TIME_IMPLEMENTATION.md"
echo "   • Real-time hooks guide"
echo "   • Socket.IO event patterns"
echo "   • Component integration"
echo ""
echo "4. TESTING & QA"
echo "   📄 COMPREHENSIVE_TESTING_GUIDE.md"
echo "   • Unit tests"
echo "   • Integration tests"
echo "   • E2E tests (Cypress)"
echo "   • Performance testing"
echo ""
echo "5. DEPLOYMENT"
echo "   📄 PRODUCTION_DEPLOYMENT_GUIDE.md"
echo "   • Pre-deployment checklist"
echo "   • Step-by-step deployment"
echo "   • Monitoring & scaling"
echo "   • Emergency procedures"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# KEY FILES & LOCATIONS
# ──────────────────────────────────────────────────────────────────────────

echo ""
echo "🗂️  KEY FILES & LOCATIONS"
echo "═════════════════════════════════════════════════════════════"
echo ""
echo "FRONTEND"
echo "────────"
echo "Routes:     apps/web/src/app/buyer/dashboard/"
echo "Services:   apps/web/src/services/buyer*.ts"
echo "Components: apps/web/src/components/dashboard/buyer/"
echo "Hooks:      apps/web/src/hooks/useBuyerRealtime.ts"
echo ""
echo "BACKEND"
echo "───────"
echo "Routes:     apps/api/src/modules/buyer/buyer.routes.ts"
echo "Controllers: apps/api/src/modules/buyer/*.controller.ts"
echo "Services:   apps/api/src/modules/buyer/*.service.ts"
echo "Database:   apps/api/prisma/schema.prisma"
echo "Utils:      apps/api/src/utils/errorHandling.ts"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# COMMON TASKS
# ──────────────────────────────────────────────────────────────────────────

echo ""
echo "⚡ COMMON TASKS"
echo "═════════════════════════════════════════════════════════════"
echo ""
echo "View API Documentation:"
echo "  curl http://localhost:3001/api/buyer/suppliers"
echo ""
echo "Run Tests:"
echo "  npm test -- --coverage"
echo ""
echo "View Database:"
echo "  npx prisma studio"
echo ""
echo "Reset Database:"
echo "  cd apps/api && npx prisma migrate reset && npx prisma db seed"
echo ""
echo "Build for Production:"
echo "  npm run build"
echo ""
echo "Type Checking:"
echo "  npm run typecheck"
echo ""
echo "Linting:"
echo "  npm run lint"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# ARCHITECTURE OVERVIEW
# ──────────────────────────────────────────────────────────────────────────

echo ""
echo "🏗️  ARCHITECTURE OVERVIEW"
echo "═════════════════════════════════════════════════════════════"
echo ""
echo "Frontend (Next.js 14)"
echo "  └─ 24 Routes (/buyer/dashboard/*)"
echo "     └─ 50+ React Components"
echo "        ├─ Sourcing (Supplier discovery)"
echo "        ├─ Bidding (Auction system)"
echo "        ├─ Orders (Order management)"
echo "        ├─ Escrow (Payment protection)"
echo "        ├─ Chat (AI assistance)"
echo "        ├─ Analytics (Market & behavioral)"
echo "        └─ More..."
echo ""
echo "Real-Time Layer (Socket.IO)"
echo "  └─ Bid Updates"
echo "  └─ Order Tracking"
echo "  └─ Notifications"
echo "  └─ Price Alerts"
echo "  └─ Chat Responses"
echo ""
echo "Backend (Node.js/Express)"
echo "  └─ 18 Buyer Modules"
echo "     └─ 82 API Endpoints"
echo "        ├─ Suppliers (6 endpoints)"
echo "        ├─ Bids (6 endpoints)"
echo "        ├─ Orders (3 endpoints)"
echo "        ├─ Escrow (5 endpoints)"
echo "        ├─ Reviews (5 endpoints)"
echo "        ├─ Chat (3 endpoints)"
echo "        ├─ Analytics (3 endpoints)"
echo "        └─ More..."
echo ""
echo "Database (Prisma ORM)"
echo "  └─ 25+ Models"
echo "     ├─ User, Product, Order"
echo "     ├─ Bid, Escrow, Payment"
echo "     ├─ ChatMessage, Notification"
echo "     ├─ BlockchainTrace"
echo "     └─ More..."
echo ""

# ──────────────────────────────────────────────────────────────────────────
# NEXT STEPS
# ──────────────────────────────────────────────────────────────────────────

echo ""
echo "🎯 NEXT STEPS FOR INTEGRATION"
echo "═════════════════════════════════════════════════════════════"
echo ""
echo "1. Start Development Servers"
echo "   Terminal 1: cd apps/api && npm run dev"
echo "   Terminal 2: cd apps/web && npm run dev"
echo ""
echo "2. Connect Components to Real APIs"
echo "   • Open apps/web/src/components/dashboard/buyer/SourcingSpace.tsx"
echo "   • Replace mock data with buyerSupplierService calls"
echo "   • Repeat for other components"
echo ""
echo "3. Integrate Real-Time Hooks"
echo "   • Import useBuyerRealtime hooks in components"
echo "   • Add to NegotiationHubPremium (bidding)"
echo "   • Add to OrderTracker (tracking)"
echo "   • Add to EscrowHubBuyer (escrow)"
echo ""
echo "4. Test & Verify"
echo "   • npm test for unit tests"
echo "   • npm run cypress:open for E2E tests"
echo "   • curl endpoints to verify APIs"
echo ""
echo "5. Deploy"
echo "   • See PRODUCTION_DEPLOYMENT_GUIDE.md"
echo "   • Configure production environment"
echo "   • Deploy backend & frontend"
echo "   • Run smoke tests"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# SUPPORT
# ──────────────────────────────────────────────────────────────────────────

echo ""
echo "💬 SUPPORT & RESOURCES"
echo "═════════════════════════════════════════════════════════════"
echo ""
echo "Documentation:"
echo "  🔗 See all .md files in root directory"
echo ""
echo "API Documentation:"
echo "  🔗 SOCKET_IO_REAL_TIME_IMPLEMENTATION.md"
echo ""
echo "Testing:"
echo "  🔗 COMPREHENSIVE_TESTING_GUIDE.md"
echo ""
echo "Deployment:"
echo "  🔗 PRODUCTION_DEPLOYMENT_GUIDE.md"
echo ""

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ You're ready to start developing!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "First steps:"
echo "1. npm install"
echo "2. cd apps/api && npm run dev"
echo "3. cd apps/web && npm run dev"
echo "4. Open http://localhost:3000"
echo ""
