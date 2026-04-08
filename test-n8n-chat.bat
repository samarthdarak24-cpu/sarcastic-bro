@echo off
REM N8N Chat Backend Test Script for Windows
REM Tests all endpoints and verifies the chat system is working

echo.
echo 🧪 N8N Chat Backend Test Suite
echo ================================
echo.

setlocal enabledelayedexpansion

REM Configuration
set BACKEND_URL=http://localhost:3001
set HEALTH_ENDPOINT=%BACKEND_URL%/api/n8n/health
set CHAT_ENDPOINT=%BACKEND_URL%/api/n8n/chat

REM Test 1: Check if backend is running
echo Test 1: Checking if backend is running...
curl -s %BACKEND_URL%/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend is running
) else (
    echo ✗ Backend is not running
    echo   Start backend with: cd apps/api ^&^& npm run dev
    exit /b 1
)
echo.

REM Test 2: Health check endpoint
echo Test 2: Testing health check endpoint...
for /f "delims=" %%i in ('curl -s %HEALTH_ENDPOINT%') do set HEALTH_RESPONSE=%%i
echo Response: %HEALTH_RESPONSE%
if "%HEALTH_RESPONSE%"=="" (
    echo ✗ Health check failed
) else (
    echo ✓ Health check passed
)
echo.

REM Test 3: Chat endpoint with simple message
echo Test 3: Testing chat endpoint with 'hi'...
for /f "delims=" %%i in ('curl -s -X POST %CHAT_ENDPOINT% -H "Content-Type: application/json" -d "{\"chatInput\":\"hi\"}"') do set CHAT_RESPONSE=%%i
echo Response: %CHAT_RESPONSE%
if "%CHAT_RESPONSE%"=="" (
    echo ✗ Chat endpoint failed
) else (
    echo ✓ Chat endpoint working
)
echo.

REM Test 4: Chat endpoint with crop message
echo Test 4: Testing chat with crop-related message...
for /f "delims=" %%i in ('curl -s -X POST %CHAT_ENDPOINT% -H "Content-Type: application/json" -d "{\"chatInput\":\"Check crop health\"}"') do set CROP_RESPONSE=%%i
echo Response: %CROP_RESPONSE%
if "%CROP_RESPONSE%"=="" (
    echo ✗ Agriculture response failed
) else (
    echo ✓ Agriculture response working
)
echo.

REM Summary
echo ================================
echo ✓ All tests completed!
echo.
echo Next steps:
echo 1. Start frontend: cd apps/web ^&^& npm run dev
echo 2. Open http://localhost:3000
echo 3. Click the green leaf button
echo 4. Send a message to test the chat
echo.

pause
