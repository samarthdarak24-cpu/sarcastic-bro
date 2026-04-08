@echo off
echo ========================================
echo   Starting All ODOP Connect Services
echo ========================================
echo.

echo [1/3] Checking Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Ollama is not running!
    echo Please start Ollama first:
    echo   1. Open a new terminal
    echo   2. Run: ollama serve
    echo   3. Then run this script again
    echo.
    pause
    exit /b 1
) else (
    echo ✓ Ollama is running
)

echo.
echo [2/3] Starting Backend API...
start "ODOP Backend API" cmd /k "cd apps\api && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Starting Frontend...
start "ODOP Frontend" cmd /k "cd apps\web && npm run dev"

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Backend API: http://localhost:3001
echo Frontend:    http://localhost:3000
echo Ollama:      http://localhost:11434
echo.
echo Press any key to exit (services will keep running)
pause >nul
