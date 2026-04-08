# ⚡ Ollama ChatGPT Setup - 10 Minutes

## 🎯 Goal
Transform AgriVoice into a ChatGPT-like AI that works 100% locally using Ollama.

---

## 🚀 Step-by-Step Setup

### Step 1: Install Ollama (2 min)
```bash
# Download from https://ollama.ai
# Install and run
```

### Step 2: Pull Model (3 min)
```bash
# Option A: Mistral (FAST - RECOMMENDED)
ollama pull mistral

# Option B: Qwen (BETTER QUALITY)
ollama pull qwen:7b
```

### Step 3: Configure (1 min)
Edit `apps/api/.env`:
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### Step 4: Start Backend (1 min)
```bash
cd apps/api
npm run dev
```

### Step 5: Test (3 min)
```bash
# Test 1: Agriculture
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Best fertilizer for wheat?", "userRole": "farmer"}'

# Test 2: General Knowledge
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain machine learning"}'

# Test 3: Check Health
curl http://localhost:3001/api/chat/health
```

✅ **Done!** Your AI is now ChatGPT-like!

---

## 📊 Model Comparison

| Model | Speed | Quality | Memory | Best For |
|-------|-------|---------|--------|----------|
| Mistral | ⚡⚡⚡ | ⭐⭐⭐⭐ | 4GB | **Production** |
| Qwen 7B | ⚡⚡ | ⭐⭐⭐⭐⭐ | 4GB | Better Quality |
| Qwen 14B | ⚡ | ⭐⭐⭐⭐⭐ | 8GB | Best Quality |

---

## 🎯 What You Get

✅ ChatGPT-like responses
✅ Conversation memory
✅ Works 100% locally
✅ No API costs
✅ Answers ANY question
✅ Agriculture expertise

---

## 🔧 API Endpoints

### Send Message
```bash
POST /api/chat
{
  "message": "Your question",
  "sessionId": "optional",
  "userRole": "farmer|buyer|general"
}
```

### Check Health
```bash
GET /api/chat/health
```

### Get History
```bash
GET /api/chat/history/:sessionId
```

### Clear Session
```bash
DELETE /api/chat/session/:sessionId
```

---

## 🐛 Troubleshooting

### "Ollama not running"
```bash
ollama serve
```

### "Slow responses"
```bash
# Use faster model
OLLAMA_MODEL=mistral
```

### "Out of memory"
```bash
# Use smaller model
OLLAMA_MODEL=mistral
```

---

## 📚 Full Documentation
See `OLLAMA_CHATGPT_SETUP.md` for complete guide.

---

**Status**: ✅ Ready
**Time**: 10 minutes
**Cost**: FREE
