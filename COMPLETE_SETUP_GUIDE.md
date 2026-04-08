# Complete AI Chatbot Setup Guide

## 🔴 Current Status: NOT WORKING

The AI chatbot is not working because required services are not running.

## ✅ What I Fixed

1. **TypeScript Error** - Fixed metadata.actions type error in ChatWidget.tsx
2. **Created Startup Scripts** - Easy commands to start all services
3. **Created Test Scripts** - Verify services are running

## 🚀 Step-by-Step Setup

### Step 1: Install Ollama (Required - Not Currently Installed)

Ollama is a free, local AI service that powers the chatbot.

**Windows Installation:**
1. Download from: https://ollama.com/download/windows
2. Run the installer
3. Ollama will start automatically as a Windows service

**Verify Installation:**
```bash
ollama --version
```

**Pull the AI Model:**
```bash
ollama pull qwen2.5:latest
```

This downloads the AI model (about 1.5GB). It's free and runs locally.

### Step 2: Start Backend API

Open a new terminal:

```bash
cd apps/api
npm install  # First time only
npm run dev
```

You should see:
```
Server running on http://localhost:3001
```

### Step 3: Start Frontend

Open another terminal:

```bash
cd apps/web
npm install  # First time only
npm run dev
```

You should see:
```
Ready on http://localhost:3000
```

### Step 4: Test the Chatbot

1. Open browser: http://localhost:3000
2. Login with your credentials
3. Look for the chat icon (💬) in the bottom-right corner
4. Click it and type: "Hello, what can you help me with?"

## 🎯 Quick Start (After Ollama is Installed)

```bash
# Use the automated script
START_ALL_SERVICES.bat
```

This will:
- Check if Ollama is running
- Start the backend API
- Start the frontend
- Open new terminal windows for each service

## 🧪 Verify Everything Works

```bash
# Run the test script
test-services.bat
```

This checks:
- ✓ Ollama is running on port 11434
- ✓ Backend API is running on port 3001
- ✓ Frontend is running on port 3000

## 📋 Manual Verification

```bash
# Test Ollama
curl http://localhost:11434/api/tags

# Test Backend
curl http://localhost:3001/health

# Test Frontend
curl http://localhost:3000
```

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │─────▶│  Backend    │─────▶│   Ollama    │
│  (Next.js)  │      │  (Express)  │      │  (Local AI) │
│   :3000     │◀─────│   :3001     │◀─────│   :11434    │
└─────────────┘      └─────────────┘      └─────────────┘
```

**Flow:**
1. User types message in chat widget
2. Frontend sends to `/ai/chat/message` endpoint
3. Backend calls OllamaService
4. OllamaService queries local Ollama
5. AI response streams back to user

## 🔧 Configuration Files

### Backend API Config
- `apps/api/src/config/env.ts` - Environment configuration
- `apps/api/.env` - Environment variables

### AI Service Config
- `apps/ai-service/.env` - AI service settings
  ```
  OLLAMA_URL=http://localhost:11434
  OLLAMA_MODEL=qwen2.5:latest
  ```

### Frontend Config
- `apps/web/.env.local` - Frontend environment
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3001
  ```

## 🐛 Troubleshooting

### Issue: "Ollama not found"
**Solution:** Install Ollama from https://ollama.com/download

### Issue: "Connection refused to localhost:11434"
**Solution:** 
```bash
# Start Ollama service
ollama serve
```

### Issue: "Model 'qwen2.5:latest' not found"
**Solution:**
```bash
ollama pull qwen2.5:latest
```

### Issue: "Backend API not responding"
**Solution:**
```bash
cd apps/api
npm install
npm run dev
```

### Issue: "Chat widget not visible"
**Solution:** You must be logged in. The chat widget only appears for authenticated users.

### Issue: "Cannot find module" errors
**Solution:**
```bash
# In apps/api
npm install

# In apps/web
npm install
```

## 📝 What Each Service Does

### Ollama (Port 11434)
- Runs AI models locally
- Free and unlimited
- No API keys needed
- Works offline

### Backend API (Port 3001)
- Handles authentication
- Routes chat requests
- Manages user context
- Connects to Ollama

### Frontend (Port 3000)
- User interface
- Chat widget component
- Real-time streaming
- Voice output

## 🎨 Chat Features

- ✅ Real-time streaming responses
- ✅ Context-aware conversations
- ✅ Role-based prompts (Farmer/Buyer)
- ✅ Multi-language support (English, Hindi, Marathi)
- ✅ Text-to-speech output
- ✅ Smart suggestions
- ✅ Conversation history
- ✅ Fallback responses when offline

## 📚 Additional Resources

- **Ollama Documentation:** https://ollama.com/docs
- **Qwen2.5 Model Info:** https://ollama.com/library/qwen2.5
- **Project Documentation:** See other .md files in root

## ✨ Next Steps

1. **Install Ollama** (most important!)
2. **Pull the AI model** (`ollama pull qwen2.5:latest`)
3. **Start all services** (use `START_ALL_SERVICES.bat`)
4. **Test the chatbot** (login and click chat icon)

## 🆘 Still Not Working?

If you've followed all steps and it's still not working:

1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify Ollama is running: `ollama list`
4. Test Ollama directly: `ollama run qwen2.5:latest "Hello"`
5. Check if ports are already in use:
   ```bash
   netstat -ano | findstr "3000 3001 11434"
   ```

## 📞 Support

For issues specific to:
- **Ollama:** https://github.com/ollama/ollama/issues
- **Project:** Check the project repository issues

---

**Summary:** The chatbot needs Ollama installed and running. Once you install Ollama and start all services, the chatbot will work perfectly with free, unlimited AI responses.
