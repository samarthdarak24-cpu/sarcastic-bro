@echo off
echo ========================================
echo Ollama Setup for ODOP Connect
echo ========================================
echo.
echo This script will help you set up Ollama with qwen2.5 model
echo.
echo Step 1: Check if Ollama is installed
echo ========================================
where ollama >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Ollama is installed!
    ollama --version
    echo.
) else (
    echo [ERROR] Ollama is NOT installed
    echo.
    echo Please install Ollama:
    echo 1. Download from: https://ollama.ai/download
    echo 2. Run the installer
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
)

echo Step 2: Check if Ollama service is running
echo ========================================
curl -s http://localhost:11434/api/tags >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Ollama service is running!
    echo.
) else (
    echo [WARNING] Ollama service is not running
    echo Starting Ollama service...
    start "" ollama serve
    timeout /t 3 /nobreak >nul
    echo.
)

echo Step 3: Pull qwen2.5 model (BEST for multilingual)
echo ========================================
echo This will download the qwen2.5 model (~4.7GB)
echo It's the BEST model for Hindi, Marathi, and English!
echo.
set /p CONFIRM="Do you want to download qwen2.5? (Y/N): "
if /i "%CONFIRM%"=="Y" (
    echo.
    echo Downloading qwen2.5... This may take a few minutes...
    ollama pull qwen2.5
    echo.
    echo [OK] qwen2.5 model downloaded!
) else (
    echo Skipping download...
)
echo.

echo Step 4: Test qwen2.5 model
echo ========================================
echo Testing with a simple question...
echo.
ollama run qwen2.5 "Hello, what is your name?" --verbose
echo.

echo Step 5: List all installed models
echo ========================================
ollama list
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your AI service will now use Ollama with qwen2.5 model
echo.
echo Benefits:
echo - 100%% FREE
echo - Works OFFLINE
echo - No rate limits
echo - Excellent multilingual support (Hindi, Marathi, English)
echo - Fast local inference
echo.
echo To start using:
echo 1. Make sure Ollama is running (ollama serve)
echo 2. Restart your AI service
echo 3. Test with: test-voice-ai-connection.bat
echo.
pause
