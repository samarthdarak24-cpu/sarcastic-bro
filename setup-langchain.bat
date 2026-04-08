@echo off
echo Setting up LangChain Chatbot Dependencies...

cd apps\ai-service

echo Installing LangChain requirements...
pip install -r requirements_langchain.txt

echo Creating data directory...
if not exist "app\data" mkdir app\data

echo Setup complete!
echo.
echo To start the AI service with LangChain support:
echo 1. Make sure Ollama is running (run setup-ollama.bat first)
echo 2. Start the AI service: python -m app.main
echo 3. Access the chatbot at: http://localhost:3000/langchain-chat
echo.
pause