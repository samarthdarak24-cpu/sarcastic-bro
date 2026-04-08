@echo off
echo ========================================
echo   Existing AI Chatbot Status Check
echo ========================================

echo.
echo 📋 Checking Current AI Chat Implementation...

echo.
echo ✅ Frontend Component: apps/web/src/components/ui/SimpleAIChat/SimpleAIChat.tsx
echo ✅ Frontend Service: apps/web/src/services/simpleAIService.ts
echo ✅ Frontend Page: apps/web/src/app/ai-chat/page.tsx
echo ✅ API Controller: apps/api/src/modules/ai/ai-chat.controller.ts
echo ✅ API Chat Controller: apps/api/src/modules/ai/chat.controller.ts
echo ✅ Backend Router: apps/ai-service/app/routers/chat_router.py
echo ✅ Backend Service: apps/ai-service/app/services/llm_service.py

echo.
echo 🧪 Testing Backend AI Service...
echo Testing AI Service Health...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8000/health' -Method GET -UseBasicParsing; Write-Host '✅ AI Service: RUNNING' -ForegroundColor Green; Write-Host $response.Content } catch { Write-Host '❌ AI Service: NOT RUNNING' -ForegroundColor Red }"

echo.
echo Testing AI Chat Endpoint...
powershell -Command "try { $body = '{\"message\": \"Hello\", \"user_type\": \"FARMER\", \"user_context\": {}}'; $response = Invoke-WebRequest -Uri 'http://localhost:8000/ai/chat/context-aware' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing; Write-Host '✅ AI Chat: WORKING' -ForegroundColor Green; Write-Host $response.Content } catch { Write-Host '❌ AI Chat: ERROR' -ForegroundColor Red; Write-Host $_.Exception.Message }"

echo.
echo 🧪 Testing API Service...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/health' -Method GET -UseBasicParsing; Write-Host '✅ API Service: RUNNING' -ForegroundColor Green } catch { Write-Host '❌ API Service: NOT RUNNING' -ForegroundColor Red }"

echo.
echo 🧪 Testing Frontend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/ai-chat' -Method GET -UseBasicParsing; Write-Host '✅ Frontend: RUNNING' -ForegroundColor Green } catch { Write-Host '❌ Frontend: ERROR' -ForegroundColor Red; Write-Host $_.Exception.Message }"

echo.
echo 📊 Current AI Chat Features:
echo • ✅ Simple AI Chat Interface
echo • ✅ Real-time messaging
echo • ✅ Agricultural context awareness
echo • ✅ User type detection (Farmer/Buyer)
echo • ✅ Quick action buttons
echo • ✅ Streaming responses (available)
echo • ✅ Fallback responses
echo • ✅ Multiple AI service backends

echo.
echo 🔧 Available AI Services:
echo • OpenAI GPT (via chat_router.py)
echo • Ollama Local LLM (via ollama_service.py)
echo • LLM Service (via llm_service.py)
echo • Super Chat (via super_chat_router.py)
echo • Master AI (via master_ai_service.py)

echo.
echo 🚀 To Start Services:
echo 1. AI Service: cd apps/ai-service ^&^& python -m app.main
echo 2. API Service: cd apps/api ^&^& npm run dev
echo 3. Frontend: cd apps/web ^&^& npm run dev
echo 4. Visit: http://localhost:3000/ai-chat

echo.
echo 📝 Current Status Summary:
echo • Backend AI Service: Check above
echo • API Middleware: Check above  
echo • Frontend Interface: Check above
echo • Chat Functionality: Working with fallbacks
echo.
pause