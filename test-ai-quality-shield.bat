@echo off
echo ========================================
echo AI Quality Shield - System Test
echo ========================================
echo.

echo [1/3] Testing Python AI Service...
curl -s http://localhost:8001/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Python AI Service is NOT running
    echo    Start it with: start-ai-service.bat
    echo    Or use fallback mode (Node.js only)
) else (
    echo ✅ Python AI Service is running
    curl -s http://localhost:8001/health
)

echo.
echo [2/3] Testing Node.js Backend...
curl -s http://localhost:3001/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js Backend is NOT running
    echo    Start it with: start-backend.bat
) else (
    echo ✅ Node.js Backend is running
)

echo.
echo [3/3] Testing Frontend...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend is NOT running
    echo    Start it with: start-frontend.bat
) else (
    echo ✅ Frontend is running
)

echo.
echo ========================================
echo Test Complete
echo ========================================
echo.
echo Next Steps:
echo 1. Navigate to: http://localhost:3000
echo 2. Login as farmer
echo 3. Go to AI Quality Shield
echo 4. Upload a crop image
echo 5. See instant AI analysis!
echo.
pause
