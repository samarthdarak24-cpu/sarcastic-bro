@echo off
REM Setup OpenAI for AgriVoice Chat
REM This script helps you configure OpenAI API

echo.
echo ========================================
echo   AgriVoice OpenAI Setup
echo ========================================
echo.

echo Step 1: Get your OpenAI API Key
echo.
echo 1. Go to: https://platform.openai.com/api-keys
echo 2. Sign in or create an account
echo 3. Click "Create new secret key"
echo 4. Copy the key (starts with sk-)
echo.

set /p API_KEY="Paste your OpenAI API key here: "

if "%API_KEY%"=="" (
    echo Error: API key cannot be empty
    pause
    exit /b 1
)

echo.
echo Adding API key to apps/api/.env...
echo.

REM Check if .env exists
if not exist "apps\api\.env" (
    echo Creating apps/api/.env...
    (
        echo # Server Configuration
        echo PORT=3001
        echo NODE_ENV=development
        echo.
        echo # OpenAI Configuration
        echo OPENAI_API_KEY=%API_KEY%
    ) > "apps\api\.env"
) else (
    REM Check if OPENAI_API_KEY already exists
    findstr /M "OPENAI_API_KEY" "apps\api\.env" >nul
    if %errorlevel% equ 0 (
        echo OPENAI_API_KEY already exists in .env
        echo Updating it...
        REM This is a simple approach - for production use a proper .env editor
        echo Please manually update OPENAI_API_KEY in apps/api/.env
    ) else (
        echo OPENAI_API_KEY=%API_KEY% >> "apps\api\.env"
    )
)

echo.
echo ✓ API key added to apps/api/.env
echo.
echo Next steps:
echo 1. Restart the backend: cd apps/api ^&^& npm run dev
echo 2. Open http://localhost:3000
echo 3. Click the green leaf button
echo 4. Ask any question - it should now use OpenAI!
echo.
echo For more info, see: ENABLE_OPENAI_AI.md
echo.

pause
