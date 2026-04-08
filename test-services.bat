@echo off
echo ========================================
echo   Testing ODOP Connect Services
echo ========================================
echo.

echo [1/3] Testing Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Ollama is NOT running
    echo   Start it with: ollama serve
) else (
    echo ✓ Ollama is running
)

echo.
echo [2/3] Testing Backend API...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Backend API is NOT running
    echo   Start it with: start-backend.bat
) else (
    echo ✓ Backend API is running
)

echo.
echo [3/3] Testing Frontend...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Frontend is NOT running
    echo   Start it with: start-frontend.bat
) else (
    echo ✓ Frontend is running
)

echo.
echo ========================================
echo   Test Complete
echo ========================================
echo.
pause
