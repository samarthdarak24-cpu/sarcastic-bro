@echo off
echo ========================================
echo   Starting ODOP Connect with Live Mandi
echo ========================================
echo.

echo [1/3] Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo [2/3] Starting services...
echo.
echo Starting Web App on http://localhost:3000
echo Starting API Server on http://localhost:3001
echo.
echo ========================================
echo   LIVE MANDI TICKER ENABLED
echo ========================================
echo.
echo Test URLs:
echo   - Test Page:        http://localhost:3000/test-mandi
echo   - Farmer Dashboard: http://localhost:3000/farmer/dashboard
echo   - Buyer Dashboard:  http://localhost:3000/buyer/dashboard
echo.
echo Press Ctrl+C to stop all services
echo ========================================
echo.

npm run dev

pause
