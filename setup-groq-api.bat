@echo off
echo ========================================
echo   SETUP FREE GROQ API KEY
echo ========================================
echo.
echo This will help you setup FREE Groq API for your AI
echo.
echo Step 1: Get your FREE API key
echo   Visit: https://console.groq.com/keys
echo   - Sign up (takes 30 seconds, no credit card!)
echo   - Click "Create API Key"
echo   - Copy the key (starts with gsk_...)
echo.
echo Step 2: Enter your API key below
echo.
set /p GROQ_KEY="Paste your Groq API key here: "

if "%GROQ_KEY%"=="" (
    echo.
    echo ERROR: No key entered!
    echo Please run this script again and paste your key.
    pause
    exit /b 1
)

echo.
echo Updating .env file...

cd apps\ai-service

REM Backup existing .env
if exist .env (
    copy .env .env.backup >nul
    echo Created backup: .env.backup
)

REM Update or create .env file
(
echo # AI API Keys - Choose ONE ^(Groq is FREE!^)
echo.
echo # Option 1: FREE Groq API ^(RECOMMENDED - No payment required!^)
echo # Get free key from: https://console.groq.com/keys
echo GROQ_API_KEY=%GROQ_KEY%
echo.
echo # Option 2: OpenAI API ^(Paid - $5 free credit for new users^)
echo # Get from: https://platform.openai.com/api-keys
echo OPENAI_API_KEY=sk-proj-replace-this-with-your-actual-key
echo.
echo # CORS Origins
echo AI_CORS_ORIGINS=http://localhost:3000,http://localhost:3001
) > .env

cd ..\..

echo.
echo ========================================
echo   SUCCESS! AI IS READY!
echo ========================================
echo.
echo Your AI can now answer ANYTHING!
echo.
echo The AI service will auto-reload with the new key.
echo If it doesn't, restart it with:
echo   cd apps\ai-service
echo   python -m uvicorn app.simple_main:app --reload --port 8001
echo.
echo Test your AI by asking:
echo   - "What is the capital of France?"
echo   - "How do I add products?"
echo   - "Explain machine learning"
echo.
echo Your AI will answer anything! 🎉
echo.
pause
