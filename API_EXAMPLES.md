# 📡 AgriVoice AI - API Examples

## Base URL
```
http://localhost:3001/api/n8n
```

---

## 1. Send Chat Message

### Endpoint
```
POST /api/n8n/chat
```

### Request Examples

#### Example 1: Farmer Asking About Crops
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "What is the best fertilizer for wheat?",
    "userId": "farmer_123",
    "userRole": "farmer",
    "sessionId": "session_abc123"
  }'
```

**Response:**
```json
{
  "response": "For wheat farming, I recommend:\n\n- Nitrogen (N): 120 kg/hectare\n- Phosphorus (P): 60 kg/hectare\n- Potassium (K): 40 kg/hectare\n\nApply nitrogen in 3-4 splits during the season. Phosphorus at planting time. Potassium for better grain quality.\n\nHave you done a soil test? That would help me give more specific recommendations.",
  "sessionId": "session_abc123",
  "model": "llama2",
  "provider": "ollama"
}
```

#### Example 2: Buyer Asking About Platform
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "How do I place a bulk order?",
    "userId": "buyer_456",
    "userRole": "buyer"
  }'
```

**Response:**
```json
{
  "response": "To place a bulk order on AgriVoice:\n\n1. Go to Dashboard → Browse Products\n2. Search for your desired crop\n3. Filter by quantity and price\n4. Click 'Bulk Order' option\n5. Enter quantity needed\n6. Get special bulk discount (15-20% off)\n7. Proceed to checkout\n8. Choose payment method\n9. Confirm order\n\nBulk orders typically get 15-20% discount and faster processing. Would you like help finding specific products?",
  "sessionId": "session_xyz789",
  "model": "gpt-4o-mini",
  "provider": "openai"
}
```

#### Example 3: General Knowledge Question
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "Explain machine learning in simple terms"
  }'
```

**Response:**
```json
{
  "response": "Machine learning is a type of artificial intelligence where computers learn from data without being explicitly programmed.\n\nThink of it like this:\n- Traditional programming: You write rules, computer follows them\n- Machine learning: You give examples, computer learns the rules\n\nKey concepts:\n1. Training: Feed data to the model\n2. Learning: Model finds patterns\n3. Prediction: Use patterns to make decisions\n\nIn agriculture, ML helps with:\n- Crop disease detection\n- Yield prediction\n- Pest identification\n- Irrigation optimization\n\nAgriVoice uses ML for quality scanning and market analysis!",
  "sessionId": "session_new123",
  "model": "llama2",
  "provider": "ollama"
}
```

#### Example 4: Conversation with Memory
```bash
# First message
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "I farm wheat in Punjab",
    "sessionId": "session_memory_001"
  }'

# Response: "Great! Wheat farming in Punjab is a major agricultural activity..."

# Second message (AI remembers wheat and Punjab)
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "What fertilizer should I use?",
    "sessionId": "session_memory_001"
  }'

# Response: "For wheat in Punjab, I recommend..."
# Notice it mentions wheat and Punjab specifically!
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatInput` | string | Yes | User's question or message |
| `sessionId` | string | No | Session ID for conversation continuity |
| `userId` | string | No | User ID for persistence |
| `userRole` | string | No | `farmer`, `buyer`, or `general` |

### Response Format

```json
{
  "response": "string - AI-generated response",
  "sessionId": "string - Session ID for continuity",
  "model": "string - Model used (llama2, gpt-4o-mini, etc)",
  "provider": "string - Provider (ollama or openai)"
}
```

---

## 2. Get Chat History

### Endpoint
```
GET /api/n8n/chat/history/:userId
```

### Request Example
```bash
curl -X GET "http://localhost:3001/api/n8n/chat/history/farmer_123?limit=10" \
  -H "Content-Type: application/json"
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Number of messages to retrieve |

### Response Example
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is the best fertilizer for wheat?",
      "timestamp": "2024-04-08T16:09:00Z"
    },
    {
      "role": "assistant",
      "content": "For wheat farming, I recommend...",
      "timestamp": "2024-04-08T16:09:05Z"
    },
    {
      "role": "user",
      "content": "How much nitrogen should I use?",
      "timestamp": "2024-04-08T16:10:00Z"
    },
    {
      "role": "assistant",
      "content": "For wheat, use 120 kg N per hectare...",
      "timestamp": "2024-04-08T16:10:05Z"
    }
  ],
  "total": 4
}
```

---

## 3. Clear Chat History

### Endpoint
```
DELETE /api/n8n/chat/history/:userId
```

### Request Example
```bash
curl -X DELETE http://localhost:3001/api/n8n/chat/history/farmer_123 \
  -H "Content-Type: application/json"
```

### Response Example
```json
{
  "success": true,
  "message": "Chat history cleared"
}
```

---

## 4. Health Check

### Endpoint
```
GET /api/n8n/health
```

### Request Example
```bash
curl http://localhost:3001/api/n8n/health
```

### Response Example
```json
{
  "success": true,
  "message": "N8N Chat service is running",
  "timestamp": "2024-04-08T16:09:00.000Z"
}
```

---

## 🧪 Complete Test Suite

### Test 1: Basic Chat
```bash
#!/bin/bash

echo "Test 1: Basic Chat"
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "Hello, how are you?",
    "userId": "test_user_1"
  }'
```

### Test 2: Agriculture Question
```bash
echo "Test 2: Agriculture Question"
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "How do I manage pests in my cotton field?",
    "userId": "farmer_001",
    "userRole": "farmer"
  }'
```

### Test 3: Platform Question
```bash
echo "Test 3: Platform Question"
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "How do I track my order?",
    "userId": "buyer_001",
    "userRole": "buyer"
  }'
```

### Test 4: Conversation Memory
```bash
echo "Test 4: Conversation Memory"

# First message
SESSION_ID="session_$(date +%s)"
echo "Creating session: $SESSION_ID"

curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d "{
    \"chatInput\": \"I grow rice in Tamil Nadu\",
    \"sessionId\": \"$SESSION_ID\",
    \"userId\": \"farmer_002\"
  }"

# Second message (should remember rice and Tamil Nadu)
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d "{
    \"chatInput\": \"What's the best irrigation method?\",
    \"sessionId\": \"$SESSION_ID\",
    \"userId\": \"farmer_002\"
  }"
```

### Test 5: Get History
```bash
echo "Test 5: Get Chat History"
curl -X GET "http://localhost:3001/api/n8n/chat/history/farmer_002?limit=5" \
  -H "Content-Type: application/json"
```

### Test 6: Clear History
```bash
echo "Test 6: Clear Chat History"
curl -X DELETE http://localhost:3001/api/n8n/chat/history/farmer_002 \
  -H "Content-Type: application/json"
```

---

## 🔄 Common Workflows

### Workflow 1: New User Chat
```
1. User sends message (no sessionId)
2. System creates new session
3. Response includes sessionId
4. Frontend stores sessionId
5. Next message uses same sessionId
```

### Workflow 2: Farmer Getting Advice
```
1. User: "I'm growing wheat"
2. AI: "Great! Wheat farming tips..."
3. User: "What fertilizer?"
4. AI: "For wheat, use 120 kg N..." (remembers wheat)
5. User: "How much water?"
6. AI: "For wheat irrigation..." (remembers wheat)
```

### Workflow 3: Buyer Sourcing
```
1. User: "I need bulk rice"
2. AI: "How much rice do you need?"
3. User: "1000 kg"
4. AI: "Here are suppliers with 1000 kg rice..."
5. User: "What's the price?"
6. AI: "Current prices for 1000 kg rice..." (remembers quantity)
```

---

## 📊 Response Examples by Role

### Farmer Role
```json
{
  "chatInput": "Best time to plant wheat?",
  "userRole": "farmer"
}
```
Response focuses on: Crop timing, soil preparation, weather, irrigation

### Buyer Role
```json
{
  "chatInput": "How to find quality suppliers?",
  "userRole": "buyer"
}
```
Response focuses on: Supplier evaluation, quality checks, pricing, logistics

### General Role
```json
{
  "chatInput": "What is blockchain?",
  "userRole": "general"
}
```
Response focuses on: General knowledge, with agriculture context if relevant

---

## 🚀 Integration Examples

### React Frontend
```typescript
const sendMessage = async (message: string) => {
  const response = await fetch('/api/n8n/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatInput: message,
      sessionId: sessionId,
      userId: userId,
      userRole: userRole
    })
  });
  
  const data = await response.json();
  setMessages([...messages, {
    role: 'user',
    content: message
  }, {
    role: 'assistant',
    content: data.response
  }]);
};
```

### Node.js Backend
```typescript
const axios = require('axios');

const sendChat = async (message: string) => {
  const response = await axios.post('http://localhost:3001/api/n8n/chat', {
    chatInput: message,
    userId: 'user_123',
    userRole: 'farmer'
  });
  
  return response.data.response;
};
```

### Python Backend
```python
import requests

def send_chat(message):
    response = requests.post('http://localhost:3001/api/n8n/chat', json={
        'chatInput': message,
        'userId': 'user_123',
        'userRole': 'farmer'
    })
    return response.json()['response']
```

---

## ⚠️ Error Handling

### Missing Required Parameter
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "error": "chatInput is required"
}
```

### LLM Service Unavailable
```json
{
  "error": "Failed to process chat message"
}
```

**Solution**: Check if Ollama is running or OpenAI API key is valid

### Invalid User ID
```bash
curl -X GET "http://localhost:3001/api/n8n/chat/history/invalid_user"
```

**Response:**
```json
{
  "messages": [],
  "total": 0
}
```

---

## 📈 Performance Tips

### Optimize Response Time
1. Use `mistral` model instead of `llama2`
2. Reduce `LLM_CONTEXT_MESSAGES` to 10
3. Use OpenAI for production

### Reduce Token Usage
1. Keep messages concise
2. Clear old sessions
3. Cache repeated questions

### Improve Quality
1. Set user role (farmer/buyer)
2. Increase `LLM_TEMPERATURE` to 0.8
3. Provide more context in messages

---

## 🔐 Security Best Practices

1. **Validate Input**: Always validate `chatInput`
2. **Rate Limiting**: Implement rate limiting per user
3. **API Keys**: Keep OpenAI key secure
4. **User Isolation**: Ensure users only see their own history
5. **Session Timeout**: Sessions expire after 24 hours

---

## 📞 Debugging

### Enable Detailed Logging
```bash
cd apps/api
DEBUG=* npm run dev
```

### Check LLM Status
```bash
# For Ollama
curl http://localhost:11434/api/tags

# For OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-your-key"
```

### Monitor Response Time
```bash
time curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Hello"}'
```

---

**Happy coding! 🚀**
