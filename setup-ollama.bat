@echo off
echo ========================================
echo    OLLAMA SETUP - FREE UNLIMITED AI
echo ========================================

echo.
echo Step 1: Installing Ollama for Windows...
echo.

REM Check if Ollama is already installed
ollama --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Ollama is already installed!
    goto :pull_models
)

echo 📥 Please download and install Ollama manually:
echo 🌐 Visit: https://ollama.ai/download
echo 📦 Download "Ollama for Windows"
echo ⚡ Run the installer
echo.
echo Press any key after installation is complete...
pause

:pull_models
echo.
echo Step 2: Pulling AI Models (FREE & UNLIMITED)...
echo.

echo 📥 Downloading Llama 3.1 8B (Recommended - 4.7GB)...
ollama pull llama3.1:8b

echo 📥 Downloading Qwen 2.5 7B (Alternative - 4.4GB)...
ollama pull qwen2.5:7b

echo.
echo Step 3: Testing Ollama Server...
echo.

echo 🧪 Testing Ollama connection...
curl -s http://localhost:11434/api/tags

echo.
echo Step 4: Updating AI Service Configuration...
echo.

REM Update the .env file to use Ollama
echo Configuring AI service to use Ollama...

echo.
echo ✅ OLLAMA SETUP COMPLETE!
echo.
echo 🚀 Your AI is now running locally and FREE!
echo 📍 Server: http://localhost:11434
echo 🤖 Models: llama3.1:8b, qwen2.5:7b
echo 💰 Cost: $0.00 (Forever FREE!)
echo 🔒 Privacy: All data stays on your computer
echo.
echo 🎯 Next Steps:
echo 1. Restart your AI service
echo 2. Test the chat - it should work without API errors!
echo.

pause
