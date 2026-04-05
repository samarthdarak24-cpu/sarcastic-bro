@echo off
echo ========================================
echo AI Chat Widget - Quick Start
echo ========================================
echo.

echo This will start the chat in FALLBACK MODE
echo (Works without OpenAI API key)
echo.
echo Services starting:
echo - API Server (port 3001)
echo - Frontend (port 3000)
echo.
echo Press Ctrl+C to stop all services
echo ========================================
echo.

cd apps\api
start "API Server" cmd /k "npm run dev"

timeout /t 3

cd ..\web
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Services started!
echo.
echo Open: http://localhost:3000
echo Login and click chat button (bottom-right)
echo.
echo Chat will work with intelligent fallback responses
echo No OpenAI API key needed!
echo ========================================
echo.
pause
