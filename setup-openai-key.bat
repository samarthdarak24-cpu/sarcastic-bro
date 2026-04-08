@echo off
echo ========================================
echo   Setup OpenAI API Key
echo ========================================
echo.
echo This will enable your AI to answer ANYTHING!
echo.
echo Step 1: Get your FREE API key
echo Visit: https://platform.openai.com/api-keys
echo.
echo - Sign up (free account)
echo - New users get $5 free credit
echo - Click "Create new secret key"
echo - Copy the key (starts with sk-...)
echo.
pause
echo.
echo Step 2: Enter your API key
echo.
set /p API_KEY="Paste your OpenAI API key here: "
echo.

REM Create .env file
cd apps\ai-service
echo OPENAI_API_KEY=%API_KEY% > .env
echo AI_CORS_ORIGINS=http://localhost:3000,http://localhost:3001 >> .env
echo.

echo ========================================
echo   SUCCESS! API Key Added
echo ========================================
echo.
echo File created: apps\ai-service\.env
echo.
echo Your AI can now answer ANYTHING:
echo - Platform-specific questions
echo - General knowledge questions
echo - Weather, farming, technology, etc.
echo - Any topic you ask about!
echo.
echo The AI service will auto-reload in a few seconds...
echo.
echo Test it at: http://localhost:3000/ai-chat-test
echo.
echo Try asking:
echo - "How do I add products as a farmer?"
echo - "How do I see my payments?"
echo - "What's the weather like today?"
echo - "How do I grow tomatoes?"
echo - "What's 2+2?"
echo.
echo All questions will now get intelligent answers!
echo.
pause