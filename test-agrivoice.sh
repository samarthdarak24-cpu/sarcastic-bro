#!/bin/bash

# AgriVoice AI - Quick Test Script
# Tests if all components are properly configured

echo "🎤 AgriVoice AI - System Check"
echo "================================"
echo ""

# Check if Google credentials exist
echo "1️⃣ Checking Google Cloud credentials..."
if [ -f "apps/api/google-credentials.json" ]; then
    echo "   ✅ Credentials file found"
else
    echo "   ❌ Credentials file NOT found"
    echo "   📝 Please download from Google Cloud Console"
    echo "   📍 Place at: apps/api/google-credentials.json"
fi
echo ""

# Check if .env has credentials path
echo "2️⃣ Checking environment configuration..."
if grep -q "GOOGLE_APPLICATION_CREDENTIALS" apps/api/.env 2>/dev/null; then
    echo "   ✅ Environment variable configured"
else
    echo "   ⚠️  Environment variable NOT configured"
    echo "   📝 Add to apps/api/.env:"
    echo "   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json"
fi
echo ""

# Check if package is installed
echo "3️⃣ Checking Google Speech package..."
if grep -q "@google-cloud/speech" apps/api/package.json; then
    echo "   ✅ Package installed"
else
    echo "   ❌ Package NOT installed"
    echo "   📝 Run: cd apps/api && npm install @google-cloud/speech"
fi
echo ""

# Check if services are running
echo "4️⃣ Checking running services..."

# Check backend
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "   ✅ Backend API running (port 3001)"
else
    echo "   ❌ Backend API not running"
    echo "   📝 Run: cd apps/api && npm run dev"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend running (port 3000)"
else
    echo "   ❌ Frontend not running"
    echo "   📝 Run: cd apps/web && npm run dev"
fi

# Check AI service
if curl -s http://localhost:8000/docs > /dev/null 2>&1; then
    echo "   ✅ AI Service running (port 8000)"
else
    echo "   ❌ AI Service not running"
    echo "   📝 Run: cd apps/ai-service && python -m uvicorn app.main:app --reload --port 8000"
fi
echo ""

# Check voice routes
echo "5️⃣ Checking voice API endpoints..."
if curl -s http://localhost:3001/voice/analytics > /dev/null 2>&1; then
    echo "   ✅ Voice routes registered"
else
    echo "   ⚠️  Voice routes may not be accessible (requires auth)"
fi
echo ""

echo "================================"
echo "📊 System Status Summary"
echo "================================"
echo ""

# Count checks
TOTAL=5
PASSED=0

[ -f "apps/api/google-credentials.json" ] && ((PASSED++))
grep -q "GOOGLE_APPLICATION_CREDENTIALS" apps/api/.env 2>/dev/null && ((PASSED++))
grep -q "@google-cloud/speech" apps/api/package.json && ((PASSED++))
curl -s http://localhost:3001/health > /dev/null 2>&1 && ((PASSED++))
curl -s http://localhost:3000 > /dev/null 2>&1 && ((PASSED++))

echo "Checks passed: $PASSED/$TOTAL"
echo ""

if [ $PASSED -eq $TOTAL ]; then
    echo "🎉 All systems ready! AgriVoice AI is good to go!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Open http://localhost:3000"
    echo "   2. Login as farmer or buyer"
    echo "   3. Click microphone button"
    echo "   4. Say: '2 किलो प्याज कार्ट में जोड़ो'"
    echo "   5. Watch the magic! ✨"
else
    echo "⚠️  Some components need attention"
    echo ""
    echo "📚 Setup guide: AGRIVOICE_QUICK_SETUP.md"
    echo "📖 Full docs: AGRIVOICE_GOOGLE_SETUP_COMPLETE.md"
fi

echo ""
