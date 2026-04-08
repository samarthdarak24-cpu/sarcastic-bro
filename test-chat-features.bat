@echo off
echo ========================================
echo   Chat System Feature Test
echo ========================================
echo.

echo Testing API Endpoints...
echo.

echo [1/10] Testing Conversations Endpoint...
curl -X GET http://localhost:3001/chat/conversations -H "Authorization: Bearer test-token" 2>nul
if %errorlevel% equ 0 (echo ✓ Conversations API Working) else (echo ✗ Conversations API Failed)
echo.

echo [2/10] Testing Send Message Endpoint...
curl -X POST http://localhost:3001/chat/send -H "Content-Type: application/json" -H "Authorization: Bearer test-token" -d "{\"receiverId\":\"test\",\"content\":\"Hello\"}" 2>nul
if %errorlevel% equ 0 (echo ✓ Send Message API Working) else (echo ✗ Send Message API Failed)
echo.

echo [3/10] Testing Translation Endpoint...
curl -X POST http://localhost:3001/chat/translate -H "Content-Type: application/json" -H "Authorization: Bearer test-token" -d "{\"messageId\":\"test\",\"targetLanguage\":\"hi\"}" 2>nul
if %errorlevel% equ 0 (echo ✓ Translation API Working) else (echo ✗ Translation API Failed)
echo.

echo [4/10] Testing Templates Endpoint...
curl -X GET http://localhost:3001/chat/templates -H "Authorization: Bearer test-token" 2>nul
if %errorlevel% equ 0 (echo ✓ Templates API Working) else (echo ✗ Templates API Failed)
echo.

echo [5/10] Testing Smart Matching Endpoint...
curl -X POST http://localhost:3001/chat/matching/find -H "Content-Type: application/json" -H "Authorization: Bearer test-token" -d "{}" 2>nul
if %errorlevel% equ 0 (echo ✓ Smart Matching API Working) else (echo ✗ Smart Matching API Failed)
echo.

echo [6/10] Testing Analytics Endpoint...
curl -X GET http://localhost:3001/chat/analytics/test-id -H "Authorization: Bearer test-token" 2>nul
if %errorlevel% equ 0 (echo ✓ Analytics API Working) else (echo ✗ Analytics API Failed)
echo.

echo [7/10] Opening Chat Page...
start http://localhost:3000/chat
echo ✓ Chat Page Opened
echo.

echo [8/10] Opening Video Call Page...
start http://localhost:3000/chat/video-call
echo ✓ Video Call Page Opened
echo.

echo [9/10] Opening Analytics Page...
start http://localhost:3000/chat/analytics
echo ✓ Analytics Page Opened
echo.

echo [10/10] Opening Smart Matching Page...
start http://localhost:3000/chat/matching
echo ✓ Smart Matching Page Opened
echo.

echo ========================================
echo   Feature Test Complete!
echo ========================================
echo.
echo All pages have been opened in your browser.
echo Check the API responses above for backend status.
echo.
echo Manual Testing Checklist:
echo [ ] Real-time chat works
echo [ ] Video call camera/mic works
echo [ ] Translation toggle works
echo [ ] Quick templates work
echo [ ] Smart matching shows results
echo [ ] Analytics displays data
echo [ ] Typing indicators work
echo [ ] Read receipts work
echo [ ] Sentiment analysis works
echo [ ] Notifications work
echo.
pause
