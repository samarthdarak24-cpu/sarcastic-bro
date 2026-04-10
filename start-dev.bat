@echo off
echo Starting FarmGuard Development Servers...
echo.

echo Starting API Server (Port 3001)...
start cmd /k "cd apps/api && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Web App (Port 3000)...
start cmd /k "cd apps/web && npm run dev"

echo.
echo ========================================
echo Servers are starting...
echo ========================================
echo API Server: http://localhost:3001
echo Web App: http://localhost:3000
echo.
echo Test Credentials:
echo   Farmer: farmer@test.com / Test@123
echo   Buyer:  buyer@test.com / Test@123
echo   FPO:    fpo@test.com / Test@123
echo.
echo Press any key to close this window...
pause > nul
