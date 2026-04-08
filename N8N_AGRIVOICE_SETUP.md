# AgriVoice n8n Integration Setup Guide

## Overview
Your AgriVoice chatbot now connects to n8n for intelligent chat processing. The system will:
1. Send user messages to your n8n workflow
2. Use n8n's Router Agent to detect intent (BOOK vs CONVERSATION)
3. Route to appropriate handlers (Appointment Booking or Conversational Agent)
4. Return responses back to the chatbot

## Current Setup

### ✅ What's Configured
- **n8n Webhook URL**: `https://vikkkiii.app.n8n.cloud/webhook/42597bc2-1be7-4527-bb29-35473fb3a6cf`
- **Environment Variable**: `N8N_WEBHOOK_URL` in `apps/api/.env`
- **Fallback System**: If n8n is unavailable, uses local intelligent responses

### 🔧 How It Works

```
User Message
    ↓
AgriVoice Chat Widget
    ↓
API Endpoint (n8n-chat.controller.ts)
    ↓
N8nChatService.processChat()
    ↓
sendToN8n() → n8n Webhook
    ↓
n8n Workflow:
  - Router Agent (detects intent)
  - If BOOK → Appointment Booking Agent
  - If CONVERSATION → Conversational Agent
    ↓
Response back to API
    ↓
Chat Widget displays response
```

## Important: Update Your n8n Workflow

Your current n8n workflow is configured for **clinic booking**. You need to update it for **AgriVoice agriculture**:

### 1. Update the Router Agent System Message
Replace the clinic-specific prompt with agriculture context:

```
You are an expert intent detection system for an agriculture marketplace.
Your task is to analyze the user's message and determine their intent.

Intent Categories:
- BOOK: User wants to place an order, check prices, or perform trading
- CONVERSATION: User is asking general questions about farming, agriculture, or platform features

Examples:
- "How do I place an order?" → BOOK
- "What's the price of rice?" → BOOK
- "How do I manage pests?" → CONVERSATION
- "Tell me about soil health" → CONVERSATION

Output: BOOK or CONVERSATION (one word only)
```

### 2. Update the Conversational Agent System Message
Replace with agriculture knowledge base:

```
You are AgriVoice, an AI assistant for farmers and agricultural traders.

Knowledge Base:
- Platform Features: Orders, payments, shipping, quality verification, blockchain trace
- Farming: Crop management, pest control, soil health, irrigation, weather planning
- Market: Price trends, bulk orders, pre-booking, bidding, supplier insights
- Quality: AI quality scanner, certifications, ratings, reviews

Answer questions about farming and the platform. Be helpful and specific.
```

### 3. Update the Appointment Booking Agent
Rename to "Order Booking Agent" and update for agricultural orders:

```
You are an order booking assistant for AgriVoice.

Help users:
1. Browse available products
2. Select quantity and specifications
3. Choose delivery date
4. Confirm order details
5. Complete the booking

Gather: Product type, quantity, delivery date, buyer details
```

## Testing the Integration

### 1. Start Your Backend
```bash
cd apps/api
npm install
npm run dev
```

### 2. Test via API
```bash
curl -X POST http://localhost:3001/api/n8n-chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "How do I place an order?",
    "sessionId": "test-session-123",
    "userRole": "farmer"
  }'
```

### 3. Expected Response
```json
{
  "output": "Response from n8n workflow",
  "sessionId": "test-session-123"
}
```

## Troubleshooting

### Issue: "N8N_WEBHOOK_URL not configured"
**Solution**: Make sure `N8N_WEBHOOK_URL` is set in `apps/api/.env`

### Issue: n8n webhook returns error
**Solution**: 
1. Check your n8n workflow is active
2. Verify webhook URL is correct
3. Check n8n logs for errors
4. The system will automatically fallback to local responses

### Issue: Getting generic responses instead of n8n responses
**Solution**: 
1. Check API logs: `[N8N Chat] Sending to n8n webhook`
2. Verify n8n workflow is receiving requests
3. Check n8n workflow connections are correct

## Fallback Behavior

If n8n is unavailable, the system automatically uses local intelligent responses with:
- Agriculture-specific knowledge
- Platform feature information
- Farming best practices
- Market intelligence

This ensures the chatbot always works, even if n8n is down.

## Next Steps

1. **Update n8n workflow** for agriculture (see above)
2. **Test the integration** with sample messages
3. **Monitor logs** to ensure n8n is receiving requests
4. **Customize responses** in n8n agents as needed
5. **Deploy to production** when ready

## API Endpoint

**POST** `/api/n8n-chat`

**Request Body**:
```json
{
  "chatInput": "Your question here",
  "sessionId": "optional-session-id",
  "userId": "optional-user-id",
  "userRole": "farmer|buyer"
}
```

**Response**:
```json
{
  "output": "Response text",
  "sessionId": "session-id"
}
```

## Environment Variables

Add to `apps/api/.env`:
```
# n8n Webhook Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/your-webhook-id
```

---

**Status**: ✅ Integration Ready
**Last Updated**: April 8, 2026
