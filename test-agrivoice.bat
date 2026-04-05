@echo off
REM AgriVoice AI - Quick Test Script for Windows
REM Tests if all components are properly configured

echo.
echo 🎤 AgriVoice AI - System Check
echo ================================
echo.

REM Check if Google credentials exist
echo 1️⃣ Checking Google Cloud credentials...
if exist "apps\api\google-credentials.json" (
    echo    ✅ Credentials file found
) else (
    echo    ❌ Credentials file NOT found
    echo    📝 Please download from Google Cloud Console
    echo    📍 Place at: apps\api\google-credentials.json
)
echo.

REM Check if .env has credentials path
echo 2️⃣ Checking environment configuration...
findstr /C:"GOOGLE_APPLICATION_CREDENTIALS" apps\api\.env >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Environment variable configured
) else (
    echo    ⚠️  Environment variable NOT configured
    echo    📝 Add to apps\api\.env:
    echo    GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
)
echo.

REM Check if package is installed
echo 3️⃣ Checking Google Speech package...
findstr /C:"@google-cloud/speech" apps\api\package.json >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Package installed
) else (
    echo    ❌ Package NOT installed
    echo    📝 Run: cd apps\api ^&^& npm install @google-cloud/speech
)
echo.

REM Check if services are running
echo 4️⃣ Checking running services...

REM Check backend
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Backend API running ^(port 3001^)
) else (
    echo    ❌ Backend API not running
    echo    📝 Run: cd apps\api ^&^& npm run dev
)

REM Check frontend
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Frontend running ^(port 3000^)
) else (
    echo    ❌ Frontend not running
    echo    📝 Run: cd apps\web ^&^& npm run dev
)

REM Check AI service
curl -s http://localhost:8000/docs >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ AI Service running ^(port 8000^)
) else (
    echo    ❌ AI Service not running
    echo    📝 Run: cd apps\ai-service ^&^& python -m uvicorn app.main:app --reload --port 8000
)
echo.

echo ================================
echo 📊 System Status Summary
echo ================================
echo.

echo 📚 Setup guide: AGRIVOICE_QUICK_SETUP.md
echo 📖 Full docs: AGRIVOICE_GOOGLE_SETUP_COMPLETE.md
echo.

echo 🚀 Next steps:
echo    1. Open http://localhost:3000
echo    2. Login as farmer or buyer
echo    3. Click microphone button
echo    4. Say: "2 किलो प्याज कार्ट में जोड़ो"
echo    5. Watch the magic! ✨
echo.

pause
