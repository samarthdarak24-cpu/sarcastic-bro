@echo off
echo Setting up Stream AI Chat with Agents...

cd apps\ai-service

echo Installing Stream Chat requirements...
pip install -r requirements_stream.txt

echo.
echo Installing frontend dependencies...
cd ..\web
npm install stream-chat stream-chat-react

echo.
echo Setup complete!
echo.
echo Required Environment Variables:
echo ================================
echo Backend (.env in apps/ai-service):
echo STREAM_API_KEY=your_stream_api_key
echo STREAM_API_SECRET=your_stream_api_secret  
echo OPENAI_API_KEY=your_openai_api_key
echo.
echo Frontend (.env.local in apps/web):
echo NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
echo.
echo Get your Stream API keys from: https://getstream.io/dashboard
echo Get your OpenAI API key from: https://platform.openai.com/api-keys
echo.
echo To start the services:
echo 1. AI Service: cd apps/ai-service && python -m app.main
echo 2. API Service: cd apps/api && npm run dev
echo 3. Frontend: cd apps/web && npm run dev
echo 4. Visit: http://localhost:3000/stream-chat
echo.
pause