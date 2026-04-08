@echo off
echo ========================================
echo   ODOP Connect - Chat System Launcher
echo ========================================
echo.

echo [1/3] Starting Backend API...
start "Backend API" cmd /k "cd apps\api && npm run dev"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend...
start "Frontend" cmd /k "cd apps\web && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Opening Chat System...
timeout /t 5 /nobreak >nul
start http://localhost:3000/chat

echo.
echo ========================================
echo   Chat System is Running!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo Chat:     http://localhost:3000/chat
echo.
echo Test Credentials:
echo   Farmer: farmer@test.com / password123
echo   Buyer:  buyer@test.com / password123
echo.
echo Press any key to stop all services...
pause >nul

echo.
echo Stopping services...
taskkill /FI "WINDOWTITLE eq Backend API*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend*" /T /F >nul 2>&1

echo.
echo All services stopped.
pause
