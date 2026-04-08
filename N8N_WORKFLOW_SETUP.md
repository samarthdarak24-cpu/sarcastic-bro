# N8N Workflow Setup Guide

## Overview

The n8n embedded chat interface is now fully integrated into your ODOP Connect application. This guide shows you how to set up your n8n workflow to power the chat functionality.

## Current Setup Status

✅ **Frontend Integration**: Chat widget is embedded on all pages
✅ **Backend Endpoint**: Mock endpoint running at `http://localhost:3001/api/n8n/chat`
✅ **Environment Variable**: Set to `NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:3001/api/n8n/chat`

## Option 1: Use the Built-in Mock Endpoint (Development)

The application now includes a mock n8n chat endpoint that provides agriculture-focused responses. This is perfect for development and testing.

### Features of the Mock Endpoint

- ✅ Session management with context tracking
- ✅ Agriculture-focused responses
- ✅ Handles topics: crops, weather, market prices, pests, soil, water
- ✅ Intelligent response routing based on keywords
- ✅ Session persistence during conversation

### How It Works

1. **User sends message** → Chat widget sends to `/api/n8n/chat`
2. **Backend processes** → N8nChatService generates response
3. **Response returned** → Chat widget displays to user
4. **Session maintained** → Context preserved for follow-up messages

### Testing the Mock Endpoint

Try these messages:
- "Tell me about crop management"
- "What's the weather forecast?"
- "How do I check market prices?"
- "Help with pest control"
- "Soil health tips"
- "Water management advice"

## Option 2: Connect to Real N8N Instance (Production)

To connect to your actual n8n instance:

### Step 1: Create N8N Workflow

1. Open your n8n instance
2. Create a new workflow
3. Add a **Webhook Trigger** node:
   - HTTP Method: `POST`
   - Response Mode: `Response Node`
   - Copy the webhook URL

### Step 2: Add Chat Logic

Add nodes between the webhook trigger and response:

```
Webhook Trigger
    ↓
[Your AI Node - OpenAI, Claude, etc.]
    ↓
Response Node
```

### Step 3: Configure Response Format

Your workflow must return:
```json
{
  "output": "Your chatbot response",
  "sessionId": "session-id"
}
```

### Step 4: Update Environment Variable

Replace the mock endpoint with your n8n webhook:

```env
# apps/web/.env.local
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### Step 5: Restart Dev Server

```bash
npm run dev:web
```

## N8N Workflow Examples

### Example 1: OpenAI Integration

```
Webhook Trigger
    ↓
Set Variables (extract chatInput, sessionId)
    ↓
OpenAI Node (Chat Completion)
    ↓
Response Node (return output + sessionId)
```

### Example 2: Claude Integration

```
Webhook Trigger
    ↓
Set Variables
    ↓
Claude Node (Message)
    ↓
Response Node
```

### Example 3: Multi-Step Workflow

```
Webhook Trigger
    ↓
If/Else (check message type)
    ├─ Crop Question → Agriculture Database
    ├─ Market Question → Market API
    └─ General Question → OpenAI
    ↓
Response Node
```

## Request/Response Format

### Request Body (from Chat Widget)
```json
{
  "chatInput": "User's message here",
  "sessionId": "session_1712345678_abc123def"  // Present on subsequent messages
}
```

### Response Body (from N8N)
```json
{
  "output": "Your response text here",
  "sessionId": "session_1712345678_abc123def"
}
```

## Session Management

Sessions are used to maintain conversation context:

- **First message**: No sessionId provided
- **Subsequent messages**: sessionId included to maintain context
- **Session storage**: Can be stored in n8n variables or external database

### Example: Using Sessions in N8N

```javascript
// In n8n JavaScript node
const sessionId = $input.all()[0].json.sessionId || generateNewSessionId();
const chatHistory = getSessionHistory(sessionId);

// Process message with context
const response = await processWithContext(
  $input.all()[0].json.chatInput,
  chatHistory
);

// Return response with session
return {
  output: response,
  sessionId: sessionId
};
```

## Testing Your Workflow

### Using cURL

```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "Tell me about crop management",
    "sessionId": "test-session-123"
  }'
```

### Using Postman

1. Create new POST request
2. URL: `http://localhost:3001/api/n8n/chat`
3. Body (JSON):
```json
{
  "chatInput": "Your test message",
  "sessionId": "test-session"
}
```

## Troubleshooting

### Chat widget not responding

**Check:**
- ✅ N8N webhook is active
- ✅ Webhook URL is correct in `.env.local`
- ✅ Dev server restarted after env change
- ✅ Browser console for errors

### Wrong responses

**Check:**
- ✅ Response format matches expected JSON
- ✅ `output` field contains the response text
- ✅ `sessionId` is included in response

### Session not persisting

**Check:**
- ✅ sessionId is returned in response
- ✅ sessionId is used in subsequent requests
- ✅ Session storage is configured in n8n

## Advanced Features

### Context Window Management

Limit conversation history to prevent token overflow:

```javascript
const maxContextMessages = 10;
const recentHistory = chatHistory.slice(-maxContextMessages);
```

### Rate Limiting

Implement rate limiting in n8n:

```javascript
const userKey = $input.all()[0].json.userId;
const requestCount = getRequestCount(userKey);

if (requestCount > 100) {
  return {
    output: "Rate limit exceeded. Please try again later.",
    sessionId: sessionId
  };
}
```

### Error Handling

```javascript
try {
  const response = await callAI(chatInput);
  return {
    output: response,
    sessionId: sessionId
  };
} catch (error) {
  return {
    output: "Sorry, I encountered an error. Please try again.",
    sessionId: sessionId
  };
}
```

## Production Deployment

### Environment Variables

```env
# Production
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-production-n8n.com/webhook/prod-webhook-id
```

### Security Considerations

1. **HTTPS Only**: Use HTTPS for webhook URLs
2. **Authentication**: Add API keys if needed
3. **Rate Limiting**: Implement in n8n workflow
4. **Input Validation**: Validate chatInput in n8n
5. **Error Handling**: Don't expose sensitive errors

### Monitoring

Monitor your n8n workflow:
- Check execution logs
- Monitor response times
- Track error rates
- Monitor API usage

## Support & Resources

- [N8N Documentation](https://docs.n8n.io/)
- [N8N Webhook Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [N8N JavaScript Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.function/)
- [N8N Community](https://community.n8n.io/)

## Quick Start Checklist

- [ ] Mock endpoint is working (test with curl)
- [ ] Chat widget appears on all pages
- [ ] Can send messages and receive responses
- [ ] Sessions are maintained across messages
- [ ] Ready to connect to real n8n instance
- [ ] N8N workflow created with webhook trigger
- [ ] Response format matches expected JSON
- [ ] Environment variable updated with real webhook URL
- [ ] Dev server restarted
- [ ] Testing with real n8n workflow

## Next Steps

1. **Test the mock endpoint** - Verify chat is working
2. **Create n8n workflow** - Set up your automation
3. **Update webhook URL** - Point to your n8n instance
4. **Deploy to production** - Use production n8n URL

---

**Status**: ✅ Ready to use with mock endpoint or connect to real n8n instance
