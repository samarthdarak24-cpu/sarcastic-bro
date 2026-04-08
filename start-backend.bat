@echo off
echo ========================================
echo   Starting ODOP Connect Backend API
echo ========================================
echo.

cd apps\api

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting backend server on http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
