# 🚀 AgriVoice AI - LLM Integration Setup Guide

## Overview
Your AgriVoice chat system has been upgraded from keyword-based to a fully intelligent ChatGPT-like AI assistant powered by LLMs.

## ⚡ Quick Start (Choose One)

### Option 1: Ollama (FREE, LOCAL) ✅ RECOMMENDED FOR STUDENTS

**Step 1: Install Ollama**
- Download from: https://ollama.ai
- Install for your OS (Windows, Mac, Linux)
- Run the installer

**Step 2: Pull a Model**
```bash
# Open terminal/command prompt and run:
ollama pull llama2
# or for faster responses:
ollama pull mistral
```

**Step 3: Start Ollama**
```bash
# Ollama runs automatically in background
# Verify it's running:
curl http://localhost:11434/api/tags
```

**Step 4: Configure AgriVoice**
Add to `apps/api/.env`:
```env
# LLM Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
# Leave OPENAI_API_KEY empty to use Ollama
```

**Step 5: Start Backend**
```bash
cd apps/api
npm run dev
```

✅ Done! Your AI is now running locally, completely free!

---

### Option 2: OpenAI (CLOUD, PAID)

**Step 1: Get API Key**
- Go to: https://platform.openai.com/api/keys
- Create new secret key
- Copy the key

**Step 2: Configure AgriVoice**
Add to `apps/api/.env`:
```env
# LLM Configuration
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
# Ollama settings will be ignored
```

**Step 3: Start Backend**
```bash
cd apps/api
npm run dev
```

✅ Done! Your AI is now using OpenAI's powerful models.

---

## 📊 Comparison

| Feature | Ollama | OpenAI |
|---------|--------|--------|
| Cost | FREE | $0.15 per 1M input tokens |
| Speed | Medium (depends on hardware) | Fast |
| Quality | Good (llama2/mistral) | Excellent (GPT-4) |
| Privacy | 100% local | Cloud-based |
| Setup | 5 minutes | 2 minutes |
| Internet | Not needed | Required |
| Best For | Students, testing | Production |

---

## 🎯 What Changed

### Before (Keyword-Based)
```
User: "Tell me about AI"
Bot: ❌ "I don't know about that"

User: "Best fertilizer for wheat?"
Bot: ✅ "Use NPK fertilizer" (hardcoded)
```

### After (LLM-Powered)
```
User: "Tell me about AI"
Bot: ✅ "AI is artificial intelligence that..." (intelligent response)

User: "Best fertilizer for wheat?"
Bot: ✅ "For wheat, use 120 kg N, 60 kg P..." (expert advice)

User: "How do I place an order?"
Bot: ✅ "Go to dashboard, click Browse Products..." (platform-specific)
```

---

## 🧠 System Architecture

```
User Message
    ↓
[Intelligent Chat Service]
    ↓
├─ Is it about platform features? → Use platform knowledge
└─ Is it general/agriculture? → Use LLM
    ↓
[LLM Service]
    ├─ OpenAI API (if configured)
    └─ Ollama Local (if no OpenAI key)
    ↓
[Agriculture Knowledge Base]
    ├─ Crop-specific advice
    ├─ Pest management
    ├─ Soil health
    └─ Irrigation tips
    ↓
Response with Context Memory
```

---

## 🔧 Configuration Details

### Environment Variables

```env
# LLM Provider (choose one)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2              # or mistral, neural-chat
OPENAI_API_KEY=sk-...            # Leave empty for Ollama
OPENAI_MODEL=gpt-4o-mini         # or gpt-4, gpt-3.5-turbo

# Optional
LLM_TEMPERATURE=0.7              # 0-1, higher = more creative
LLM_MAX_TOKENS=1000              # Max response length
LLM_CONTEXT_MESSAGES=20          # How many past messages to remember
```

### Available Ollama Models

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| llama2 | 7B | Medium | Good | General purpose |
| mistral | 7B | Fast | Good | Fast responses |
| neural-chat | 7B | Fast | Good | Chat optimized |
| llama2:13b | 13B | Slow | Better | Better quality |

**Recommendation**: Start with `mistral` for speed, upgrade to `llama2:13b` if you have 16GB+ RAM.

---

## 🚀 Testing the System

### Test 1: Platform Features (Fast Path)
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "How do I place an order?",
    "userId": "user123",
    "userRole": "buyer"
  }'
```

Expected: Fast response about platform features

### Test 2: Agriculture Question (LLM)
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "What is the best fertilizer for wheat?",
    "userId": "user123",
    "userRole": "farmer"
  }'
```

Expected: Intelligent agriculture advice

### Test 3: General Knowledge (LLM)
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "Explain machine learning",
    "userId": "user123"
  }'
```

Expected: ChatGPT-like explanation

### Test 4: Conversation Memory
```bash
# First message
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "I farm wheat",
    "sessionId": "session123"
  }'

# Second message (should remember wheat)
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "What fertilizer should I use?",
    "sessionId": "session123"
  }'
```

Expected: Response mentions wheat specifically

---

## 📱 Frontend Integration

The chat widget automatically uses the new LLM system. No changes needed!

### Chat Widget Features
- ✅ Real-time responses
- ✅ Conversation memory
- ✅ Typing animation
- ✅ Message history
- ✅ Multi-language support (coming soon)

### Example Usage
```typescript
// Frontend automatically sends:
{
  chatInput: "Your question",
  sessionId: "auto-generated",
  userId: "from-auth",
  userRole: "farmer|buyer"
}

// Gets back:
{
  response: "AI response",
  sessionId: "session-id",
  model: "llama2|gpt-4o-mini",
  provider: "ollama|openai"
}
```

---

## 🐛 Troubleshooting

### Issue: "LLM Service unavailable"
**Solution**: 
- For Ollama: Make sure Ollama is running (`ollama serve`)
- For OpenAI: Check API key is correct

### Issue: Slow responses
**Solution**:
- For Ollama: Use `mistral` instead of `llama2`
- For OpenAI: Already fast, check internet connection

### Issue: Out of memory
**Solution**:
- For Ollama: Use smaller model (`mistral` instead of `llama2:13b`)
- Reduce `LLM_CONTEXT_MESSAGES` in .env

### Issue: Responses are generic
**Solution**:
- Increase `LLM_TEMPERATURE` to 0.8-0.9
- Make sure agriculture knowledge base is loaded
- Check user role is set correctly

---

## 📊 Performance Metrics

### Ollama (Local)
- First response: 2-5 seconds
- Subsequent responses: 1-3 seconds
- Memory usage: 4-8GB
- CPU usage: 50-100%

### OpenAI
- First response: 0.5-1 second
- Subsequent responses: 0.3-0.5 seconds
- Memory usage: Minimal
- Cost: ~$0.0001 per message

---

## 🎓 Learning Resources

### Understanding LLMs
- https://www.youtube.com/watch?v=jkrNMKz9pWU (LLM Basics)
- https://huggingface.co/course (Hugging Face Course)

### Ollama Documentation
- https://github.com/ollama/ollama
- https://ollama.ai/library

### OpenAI Documentation
- https://platform.openai.com/docs
- https://platform.openai.com/examples

---

## 🚀 Next Steps

1. **Choose your LLM** (Ollama or OpenAI)
2. **Configure .env** with your choice
3. **Test the endpoints** using curl commands above
4. **Monitor responses** and adjust temperature if needed
5. **Deploy to production** when satisfied

---

## 💡 Pro Tips

### For Best Results:
1. **Set user role** (farmer/buyer) for personalized responses
2. **Keep session ID** for conversation continuity
3. **Monitor token usage** (especially with OpenAI)
4. **Cache repeated questions** for faster responses
5. **Use agriculture knowledge base** for domain expertise

### For Production:
1. Use OpenAI for reliability and quality
2. Implement rate limiting
3. Add response caching
4. Monitor API costs
5. Set up error alerts

---

## 📞 Support

If you encounter issues:
1. Check logs: `npm run dev` shows detailed errors
2. Test endpoints with curl
3. Verify .env configuration
4. Check LLM service is running
5. Review troubleshooting section above

---

## ✅ Verification Checklist

- [ ] Ollama installed and running (or OpenAI key configured)
- [ ] .env file updated with LLM settings
- [ ] Backend started successfully
- [ ] Health check passes: `curl http://localhost:3001/api/n8n/health`
- [ ] Chat endpoint responds: `curl -X POST http://localhost:3001/api/n8n/chat ...`
- [ ] Responses are intelligent (not keyword-based)
- [ ] Conversation memory works (session ID maintained)
- [ ] Agriculture knowledge is included in responses

---

**🎉 Congratulations! Your AgriVoice AI is now ChatGPT-like and intelligent!**
