# AI Chatbot Quick Start 🚀

## TL;DR - Just Run These Commands

```bash
# 1. Start Ollama (in terminal 1)
ollama serve

# 2. Start Backend (in terminal 2)
cd apps/api
npm run dev

# 3. Start Frontend (in terminal 3)
cd apps/web
npm run dev

# 4. Open browser
# Go to http://localhost:3000 and login
```

## Or Use the Automated Script

```bash
# This will start everything for you
START_ALL_SERVICES.bat
```

## Test If Everything Works

```bash
# Run this to check all services
test-services.bat
```

## What Was Fixed

✓ Fixed TypeScript error in ChatWidget component
✓ Created startup scripts for easy service management
✓ Added service health check script

## The Problem

The AI chatbot wasn't working because:
1. Backend API wasn't running (needed for chat endpoints)
2. Ollama service wasn't running (needed for AI responses)
3. Small TypeScript error in the chat component

## How It Works Now

```
User Message → Frontend → Backend API → Ollama → AI Response
```

- **Frontend** (Next.js on :3000): Chat UI
- **Backend** (Express on :3001): API endpoints
- **Ollama** (Local LLM on :11434): AI brain

## Troubleshooting

### "Ollama not found"
Install from: https://ollama.com/download

### "Model not found"
```bash
ollama pull qwen2.5:latest
```

### "Connection refused"
Make sure all 3 services are running (use test-services.bat)

### Chat widget not visible
You need to be logged in to see the chat widget

## Features

- ✓ Real-time streaming responses
- ✓ Context-aware conversations
- ✓ Role-based responses (Farmer/Buyer)
- ✓ Multi-language support (EN/HI/MR)
- ✓ Voice output (Text-to-Speech)
- ✓ Smart suggestions
- ✓ Fallback responses when offline

## Need Help?

Check the detailed guide: `FIX_AI_CHATBOT.md`
