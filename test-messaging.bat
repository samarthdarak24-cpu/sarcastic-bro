@echo off
echo ========================================
echo Testing Messaging Feature
echo ========================================

echo.
echo 1. Testing health endpoint...
curl -s http://localhost:3001/health
if %errorlevel% neq 0 (
    echo ERROR: Backend is not running!
    echo Please start backend: cd apps/api ^&^& npm run dev
    pause
    exit /b 1
)

echo.
echo.
echo 2. Logging in as farmer...
curl -s -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d "{\"email\":\"farmer@test.com\",\"password\":\"password123\"}" > temp_login.json

echo.
echo.
echo 3. Getting conversations...
for /f "tokens=2 delims=:," %%a in ('type temp_login.json ^| findstr /C:"token"') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

curl -s -H "Authorization: Bearer %TOKEN%" http://localhost:3001/messages/conversations

echo.
echo.
echo 4. Getting unread count...
curl -s -H "Authorization: Bearer %TOKEN%" http://localhost:3001/messages/unread-count

del temp_login.json

echo.
echo.
echo ========================================
echo Test complete!
echo ========================================
echo.
echo If you see JSON responses above, the messaging API is working!
echo If you see errors, check:
echo   1. Backend is running (npm run dev in apps/api)
echo   2. Database is seeded (npm run db:seed in apps/api)
echo   3. Test accounts exist (farmer@test.com / password123)
echo.
pause
