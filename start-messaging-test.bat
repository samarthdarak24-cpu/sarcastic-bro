@echo off
echo ========================================
echo ODOP Connect - Messaging Feature Setup
echo ========================================
echo.

echo This script will:
echo 1. Check if backend is running
echo 2. Check if frontend is running  
echo 3. Test the messaging API
echo 4. Open the application in your browser
echo.
pause

echo.
echo Step 1: Checking backend (port 3001)...
curl -s http://localhost:3001/health > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Backend is NOT running!
    echo.
    echo Please start the backend first:
    echo   1. Open a new terminal
    echo   2. cd apps/api
    echo   3. npm run dev
    echo.
    echo Then run this script again.
    pause
    exit /b 1
) else (
    echo [OK] Backend is running on port 3001
)

echo.
echo Step 2: Checking frontend (port 3000)...
curl -s http://localhost:3000 > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Frontend is NOT running!
    echo.
    echo Please start the frontend first:
    echo   1. Open a new terminal
    echo   2. cd apps/web
    echo   3. npm run dev
    echo.
    echo Then run this script again.
    pause
    exit /b 1
) else (
    echo [OK] Frontend is running on port 3000
)

echo.
echo Step 3: Testing messaging API...
echo.

echo Logging in as farmer...
curl -s -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d "{\"email\":\"farmer@test.com\",\"password\":\"password123\"}" > temp_login.json

findstr /C:"token" temp_login.json > nul
if %errorlevel% neq 0 (
    echo [ERROR] Login failed!
    echo.
    echo Please seed the database first:
    echo   1. cd apps/api
    echo   2. npm run db:seed
    echo.
    type temp_login.json
    del temp_login.json
    pause
    exit /b 1
) else (
    echo [OK] Login successful
)

echo.
echo Getting conversations...
for /f "tokens=2 delims=:," %%a in ('type temp_login.json ^| findstr /C:"token"') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

curl -s -H "Authorization: Bearer %TOKEN%" http://localhost:3001/messages/conversations > temp_conversations.json
type temp_conversations.json
echo.

del temp_login.json
del temp_conversations.json

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your messaging feature is ready to use!
echo.
echo Test Accounts:
echo   Farmer: farmer@test.com / password123
echo   Buyer:  buyer@test.com / password123
echo.
echo Opening application in browser...
timeout /t 2 > nul
start http://localhost:3000/login
echo.
echo Instructions:
echo   1. Login as farmer (farmer@test.com / password123)
echo   2. Click "AgriChat" in the sidebar
echo   3. You'll see "Direct Messages" tab
echo   4. Start chatting with buyers!
echo.
echo To test real-time messaging:
echo   1. Open another browser window (incognito mode)
echo   2. Login as buyer (buyer@test.com / password123)
echo   3. Go to AgriChat ^> Direct Messages
echo   4. Send messages between farmer and buyer
echo   5. Watch messages appear instantly!
echo.
pause
