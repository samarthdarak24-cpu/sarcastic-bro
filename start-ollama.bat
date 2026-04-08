@echo off
echo ========================================
echo Starting Ollama for AI Chat
echo ========================================
echo.

REM Check if Ollama is installed
where ollama >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Ollama is not installed!
    echo.
    echo Please install Ollama from: https://ollama.ai/download
    echo.
    echo After installation:
    echo 1. Run: ollama pull qwen2.5
    echo 2. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Ollama is installed
echo.

REM Check if qwen2.5 model is available
echo Checking for qwen2.5 model...
ollama list | findstr "qwen2.5" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] qwen2.5 model not found. Pulling it now...
    echo This may take a few minutes...
    echo.
    ollama pull qwen2.5
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to pull qwen2.5 model
        pause
        exit /b 1
    )
    echo [OK] Model downloaded successfully
) else (
    echo [OK] qwen2.5 model is available
)
echo.

REM Start Ollama service
echo Starting Ollama service...
echo.
echo Ollama is now running on http://localhost:11434
echo.
echo You can now:
echo 1. Start the AI service: cd apps/ai-service && python app/simple_main.py
echo 2. Start the API: cd apps/api && npm run dev
echo 3. Start the frontend: cd apps/web && npm run dev
echo.
echo Press Ctrl+C to stop Ollama
echo.

ollama serve
