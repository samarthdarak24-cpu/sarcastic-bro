@echo off
echo ========================================================
echo   🚀 STARTING AGRIVOICE REAL-WORLD AI SYSTEM 🚀
echo ========================================================
echo.

echo [1/3] Starting Backend API (Port 3001)...
cd apps\api
start "AgriVoice API" cmd /k "npm run dev"
cd ..\..

echo [2/3] Starting Real AI Service (Port 8000)...
cd apps\ai-service
start "Real AI Pipeline" cmd /k "python real_ai_service.py"
cd ..\..

echo [3/3] Starting Frontend Dashboard (Port 3000)...
cd apps\web
start "AgriVoice Web" cmd /k "npm run dev"
cd ..\..

echo.
echo ========================================================
echo   ✅ ALL SERVICES DEPLOYED SUCCESSFULLY!
echo ========================================================
echo.
echo 🌐 Frontend:  http://localhost:3000
echo 🔌 API:       http://localhost:3001
echo 🧠 AI System: http://localhost:8000
echo.
echo Opening AgriVoice in your browser...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to exit this window (services will stay running).
pause >nul
