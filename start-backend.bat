@echo off
echo ========================================
echo Starting AgriTrust Backend API
echo ========================================
echo.

cd apps\api

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting server on port 3001...
echo Press Ctrl+C to stop
echo.

call npm run dev
