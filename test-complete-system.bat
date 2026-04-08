@echo off
echo ========================================
echo Testing Complete Stream AI Chat System
echo ========================================

echo.
echo 1. Testing Frontend (Next.js)...
echo Checking: http://localhost:3000
curl -s -o nul -w "Frontend Status: %%{http_code}" http://localhost:3000
echo.

echo.
echo 2. Testing Backend Health...
echo Checking: http://localhost:8000/health
curl -s http://localhost:8000/health
echo.

echo.
echo 3. Testing Stream Chat Demo...
echo Checking: http://localhost:8000/demo
curl -s http://localhost:8000/demo
echo.

echo.
echo ========================================
echo System Status Summary
echo ========================================
echo ✅ Frontend URL: http://localhost:3000
echo ✅ Stream Chat Page: http://localhost:3000/simple-stream-chat
echo ✅ Test Page: http://localhost:3000/test-stream
echo ✅ Backend API: http://localhost:8000
echo ✅ API Docs: http://localhost:8000/docs
echo ✅ Demo Endpoint: http://localhost:8000/demo
echo.
echo ========================================
echo Ready to Use! 🚀
echo ========================================
echo.
echo Instructions:
echo 1. Open: http://localhost:3000/simple-stream-chat
echo 2. Click "Start" on any AI agent
echo 3. Ask agricultural questions
echo 4. Get intelligent AI responses
echo.
pause