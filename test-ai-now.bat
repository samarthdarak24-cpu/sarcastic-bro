@echo off
echo ========================================
echo   TESTING AI - CAN IT ANSWER ANYTHING?
echo ========================================
echo.
echo Testing AI with different questions...
echo.

echo Test 1: General Knowledge Question
echo Question: "What is the capital of France?"
echo.
curl -X POST "http://localhost:8001/api/v1/simple-chat/chat" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"What is the capital of France?\"}"
echo.
echo.

echo ========================================
echo Test 2: Platform Question
echo Question: "How do I add products as a farmer?"
echo.
curl -X POST "http://localhost:8001/api/v1/simple-chat/chat" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"How do I add products as a farmer?\"}"
echo.
echo.

echo ========================================
echo Test 3: Math Question
echo Question: "What is 25 times 47?"
echo.
curl -X POST "http://localhost:8001/api/v1/simple-chat/chat" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"What is 25 times 47?\"}"
echo.
echo.

echo ========================================
echo   TESTS COMPLETE!
echo ========================================
echo.
echo If you see intelligent, different responses for each question,
echo your AI is working perfectly! 🎉
echo.
pause
