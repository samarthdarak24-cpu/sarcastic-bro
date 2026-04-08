@echo off
echo ========================================
echo AgriVoice Platform - Automated Setup
echo ========================================
echo.

echo [1/5] Setting up Backend...
cd apps\api
if not exist ".env" (
    copy .env.example .env
    echo Created .env file. Please configure it before continuing.
    pause
)
call npm install
call npx prisma generate
call npx prisma migrate dev
echo Backend setup complete!
echo.

echo [2/5] Setting up Frontend...
cd ..\web
if not exist ".env.local" (
    copy .env.production.example .env.local
    echo Created .env.local file.
)
call npm install
echo Frontend setup complete!
echo.

echo [3/5] Setting up AI Service...
cd ..\ai-service
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
echo AI Service setup complete!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure .env files in each service
echo 2. Start services:
echo    - Backend: cd apps\api ^&^& npm run dev
echo    - Frontend: cd apps\web ^&^& npm run dev
echo    - AI Service: cd apps\ai-service ^&^& python main.py
echo.
echo Or use the individual start scripts:
echo    - start-backend.bat
echo    - start-frontend.bat
echo    - cd apps\ai-service ^&^& start-ai-service.bat
echo.
pause
