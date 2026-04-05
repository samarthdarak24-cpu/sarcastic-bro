@echo off
echo ========================================
echo ODOP Connect - Complete Setup
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd apps\api
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend npm install failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

echo [2/4] Setting up Database...
call npx prisma generate
call npx prisma db push --accept-data-loss
call npm run db:seed
if %errorlevel% neq 0 (
    echo ERROR: Database setup failed
    pause
    exit /b 1
)
echo ✅ Database created and seeded
echo.

cd ..\..

echo [3/4] Installing Frontend Dependencies...
cd apps\web
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend npm install failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

cd ..\..

echo [4/4] Verifying Setup...
node verify-setup.js
echo.

echo ========================================
echo ✅ SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Run: start-backend.bat
echo 2. Run: start-frontend.bat (in another terminal)
echo 3. Go to: http://localhost:3000/login
echo 4. Login with: farmer@test.com / Farmer123
echo.
pause
