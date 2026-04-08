# Enable OpenAI AI for AgriVoice Chat

Your chat now supports **two modes**:

1. **Mock Mode** (Current) - Responds to agriculture keywords only
2. **OpenAI Mode** (Advanced) - Answers ANY question like ChatGPT!

---

## 🚀 Enable OpenAI Mode (3 Steps)

### Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### Step 2: Add to Backend .env

Edit `apps/api/.env` and add:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

Replace `sk-your-api-key-here` with your actual key.

### Step 3: Restart Backend

```bash
# Stop the running backend (Ctrl+C)
# Then restart it
cd apps/api && npm run dev
```

---

## ✅ Verify It's Working

1. Open http://localhost:3000
2. Click the green leaf button
3. Ask a general question like:
   - "What is Python?"
   - "How do I make pizza?"
   - "Explain quantum physics"
   - "Tell me a joke"
4. Should get intelligent responses!

---

## 🎯 What Changes

### Before (Mock Mode)
```
User: "What is payment?"
Bot: "Thank you for your question: 'what is payment'..."
(Generic fallback response)
```

### After (OpenAI Mode)
```
User: "What is payment?"
Bot: "Payment is the transfer of money or value in exchange for goods or services. 
In the context of agriculture, payments typically refer to..."
(Intelligent, contextual response)
```

---

## 💰 Pricing

OpenAI API is **pay-as-you-go**:
- **GPT-3.5-turbo**: ~$0.0005 per 1K tokens
- **Typical chat message**: 100-500 tokens
- **Cost per message**: ~$0.00005 - $0.00025

**Example**: 1000 messages = ~$0.05 - $0.25

---

## 🔒 Security Notes

- **Never commit** your API key to git
- **Keep it private** - treat like a password
- **Rotate regularly** if compromised
- Use environment variables (not hardcoded)

---

## 🛠️ Troubleshooting

### Issue: "Invalid API key"
- Check key is correct (starts with `sk-`)
- Verify it's in `apps/api/.env`
- Restart backend after adding key

### Issue: "Rate limit exceeded"
- OpenAI has rate limits
- Wait a few seconds between requests
- Check your usage at: https://platform.openai.com/account/usage

### Issue: "Still getting mock responses"
- Verify `OPENAI_API_KEY` is set in `apps/api/.env`
- Check backend logs for errors
- Restart backend

### Issue: "API key not working"
- Verify key is active at: https://platform.openai.com/api-keys
- Check you have credits/billing set up
- Try creating a new key

---

## 📊 How It Works

### Architecture

```
User Message
    ↓
Frontend (React)
    ↓
Backend (Express)
    ↓
N8N Chat Service
    ↓
OpenAI API (if key available)
    ↓
Response
    ↓
Frontend (Display)
```

### Logic

```typescript
if (OPENAI_API_KEY exists) {
  // Use OpenAI for intelligent responses
  response = await openai.chat.completions.create(...)
} else {
  // Fall back to mock agriculture responses
  response = generateMockResponse(input)
}
```

---

## 🎓 Advanced: Customize System Prompt

Edit `apps/api/src/modules/n8n-chat/n8n-chat.service.ts`:

```typescript
const systemPrompt = `You are AgriVoice, a helpful AI assistant for an agricultural marketplace platform. 
You can answer questions about:
- Agriculture and farming (crops, soil, weather, pests, irrigation, fertilizers)
- Market prices and trading
- General questions related to the platform
- Any other general knowledge questions

Be helpful, concise, and friendly.`;
```

Customize this to match your needs!

---

## 📈 Monitor Usage

Check your OpenAI usage:
1. Go to: https://platform.openai.com/account/usage
2. View tokens used and costs
3. Set spending limits if needed

---

## 🔄 Switch Between Modes

**To use Mock Mode** (no API key):
- Remove `OPENAI_API_KEY` from `apps/api/.env`
- Restart backend
- Chat will use agriculture keyword matching

**To use OpenAI Mode**:
- Add `OPENAI_API_KEY` to `apps/api/.env`
- Restart backend
- Chat will use OpenAI for all responses

---

## 🚀 Production Deployment

### Before Going Live

1. ✅ Set `OPENAI_API_KEY` in production environment
2. ✅ Set spending limits on OpenAI account
3. ✅ Monitor usage regularly
4. ✅ Test with various questions
5. ✅ Have fallback responses ready

### Environment Variables

```env
# Production
OPENAI_API_KEY=sk-your-production-key
NODE_ENV=production
```

---

## 📞 Support

- **OpenAI Issues**: https://help.openai.com
- **API Documentation**: https://platform.openai.com/docs
- **Status Page**: https://status.openai.com

---

## ✨ Features with OpenAI

Your chat can now:
- ✅ Answer agriculture questions intelligently
- ✅ Answer general knowledge questions
- ✅ Have multi-turn conversations
- ✅ Understand context from previous messages
- ✅ Provide detailed explanations
- ✅ Handle complex queries
- ✅ Maintain conversation history

---

**Status**: Ready to Enable
**Estimated Setup Time**: 5 minutes
**Cost**: Pay-as-you-go (very affordable)

---

Last Updated: April 8, 2024
