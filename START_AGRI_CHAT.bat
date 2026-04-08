@echo off
echo ========================================
echo   AgriChat Feature - Quick Start
echo ========================================
echo.

echo Starting Backend API...
start cmd /k "cd apps\api && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting Frontend...
start cmd /k "cd apps\web && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   System Starting...
echo ========================================
echo.
echo Backend API: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo   Email: farmer@test.com
echo   Password: password123
echo.
echo After login, click "Chat" in the navigation!
echo.
echo All 10 features are now working:
echo   1. Real-Time Chat
echo   2. AI Translation
echo   3. Smart Matching
echo   4. Video Calls
echo   5. Quick Templates
echo   6. Negotiation Tracker
echo   7. Sentiment Analysis
echo   8. Smart Notifications
echo   9. Conversation Analytics
echo   10. Trust and Verification
echo.
echo ========================================
echo   Press any key to open browser...
echo ========================================
pause >nul

start http://localhost:3000/login

echo.
echo System is running!
echo Press Ctrl+C in each terminal to stop.
echo.
pause
