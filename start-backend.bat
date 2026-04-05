@echo off
echo ========================================
echo Starting ODOP Connect Backend API
echo ========================================
echo.
echo Backend will run on: http://localhost:3001
echo.

cd apps\api
call npm run dev
