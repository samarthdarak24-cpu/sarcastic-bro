@echo off
echo ========================================
echo Starting AgriTrust Frontend
echo ========================================
echo.

cd apps\web

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting frontend on port 3000...
echo Press Ctrl+C to stop
echo.

call npm run dev
