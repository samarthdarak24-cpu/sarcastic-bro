@echo off
echo ========================================
echo Buyer Dashboard Login Fix Script
echo ========================================
echo.

echo Step 1: Checking if backend is running...
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is running on port 3001
) else (
    echo [ERROR] Backend is NOT running!
    echo Please start it with: cd apps/api ^&^& npm run dev
    pause
    exit /b 1
)

echo.
echo Step 2: Checking if frontend is running...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is running on port 3000
) else (
    echo [ERROR] Frontend is NOT running!
    echo Please start it with: cd apps/web ^&^& npm run dev
    pause
    exit /b 1
)

echo.
echo Step 3: Opening debug tool in browser...
start http://localhost:3000/debug-buyer-login.html

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. The debug tool should open in your browser
echo 2. Click "Check Current State" to see your login status
echo 3. Click "Clear ^& Login as Buyer" to test login
echo 4. Watch the console logs for any errors
echo.
echo If you see errors, check:
echo - Browser console (F12)
echo - Network tab for failed requests
echo - The BUYER_DASHBOARD_FIX.md file for detailed troubleshooting
echo.
pause
