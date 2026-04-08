# ⚡ Quick Start - AgriVoice AI LLM Setup (5 Minutes)

## 🎯 Choose Your Path

### Path A: Ollama (FREE) - 5 minutes ✅ RECOMMENDED
### Path B: OpenAI (PAID) - 2 minutes

---

## 🚀 Path A: Ollama Setup (FREE)

### Step 1: Install Ollama (2 min)
1. Go to https://ollama.ai
2. Download for your OS
3. Install and run

### Step 2: Pull a Model (2 min)
```bash
# Open terminal/command prompt
ollama pull mistral
```

### Step 3: Configure AgriVoice (1 min)
Edit `apps/api/.env`:
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### Step 4: Start Backend
```bash
cd apps/api
npm run dev
```

✅ **Done!** Your AI is running locally, completely free!

---

## 🚀 Path B: OpenAI Setup (PAID)

### Step 1: Get API Key (1 min)
1. Go to https://platform.openai.com/api/keys
2. Create new secret key
3. Copy it

### Step 2: Configure AgriVoice (1 min)
Edit `apps/api/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
```

### Step 3: Start Backend
```bash
cd apps/api
npm run dev
```

✅ **Done!** Your AI is using OpenAI's powerful models!

---

## 🧪 Test It Works

### Test 1: Agriculture Question
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "What is the best fertilizer for wheat?",
    "userRole": "farmer"
  }'
```

### Test 2: Platform Question
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "How do I place an order?",
    "userRole": "buyer"
  }'
```

### Test 3: General Knowledge
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "Explain machine learning"
  }'
```

---

## 📊 What Changed

| Before | After |
|--------|-------|
| Keyword-based bot | ChatGPT-like AI |
| Limited topics | Answers anything |
| Robotic responses | Natural, intelligent |
| No memory | Remembers conversation |
| Hardcoded answers | Dynamic, expert advice |

---

## 🎯 Next Steps

1. ✅ Choose Ollama or OpenAI
2. ✅ Configure .env
3. ✅ Start backend
4. ✅ Test endpoints
5. 📖 Read full guide: `LLM_IMPLEMENTATION_GUIDE.md`
6. 🚀 Deploy to production

---

## 💡 Tips

- **Ollama**: Free, local, good for testing
- **OpenAI**: Fast, reliable, best for production
- **Both**: Can switch anytime by changing .env

---

## ❓ Issues?

- **Ollama not working**: Make sure `ollama serve` is running
- **OpenAI not working**: Check API key is correct
- **Slow responses**: Use `mistral` model instead of `llama2`

---

**🎉 Your AgriVoice AI is now intelligent and ChatGPT-like!**
