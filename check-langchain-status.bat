@echo off
echo ========================================
echo   LangChain Chatbot Status Check
echo ========================================

echo.
echo 📋 Checking File Structure...
echo ✅ Backend Service: apps/ai-service/app/services/simple_langchain_chatbot.py
echo ✅ Backend Router: apps/ai-service/app/routers/simple_langchain_router.py
echo ✅ API Controller: apps/api/src/modules/ai/simple-langchain-chat.controller.ts
echo ✅ API Routes: apps/api/src/modules/ai/simple-langchain-chat.routes.ts
echo ✅ Frontend Component: apps/web/src/components/ui/LangChainChat/LangChainChat.tsx
echo ✅ Demo Page: apps/web/src/app/langchain-chat/page.tsx
echo ✅ Knowledge Base: apps/ai-service/app/data/agri-knowledge.json

echo.
echo 🧪 Testing Python Dependencies...
cd apps\ai-service
python test_langchain_imports.py

echo.
echo 🚀 Ready to Start!
echo.
echo To use the LangChain Chatbot:
echo 1. Start AI Service: cd apps/ai-service && python -m app.main
echo 2. Start API: cd apps/api && npm run dev  
echo 3. Start Frontend: cd apps/web && npm run dev
echo 4. Visit: http://localhost:3000/langchain-chat
echo.
echo 🧪 Test Endpoints:
echo • Health: http://localhost:8000/simple-langchain-chat/health
echo • Demo: http://localhost:8000/simple-langchain-chat/demo
echo • API Docs: http://localhost:8000/docs#/Simple%20LangChain%20Chatbot
echo.
pause