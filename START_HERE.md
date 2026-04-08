# 🚀 START HERE - Chat Widget Quick Start

## What's Ready

✅ Chat widget embedded on all pages
✅ Backend endpoint running at `http://localhost:3001/api/n8n/chat`
✅ Mock responses for agriculture topics
✅ Session management
✅ Environment configured

## Get Started in 30 Seconds

### 1. Start Your Dev Server
```bash
npm run dev
```

This starts:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

### 2. Open Your App
Go to `http://localhost:3000` in your browser

### 3. Find the Chat Widget
Look for the chat widget (floating button or embedded on the page)

### 4. Send a Message
Try: "Tell me about crop management"

### 5. See It Work
The widget will respond with agriculture-focused advice

## Test Messages

Try these to see different responses:
- "Tell me about crop management" → Crop advice
- "What's the weather forecast?" → Weather tips
- "How do I check market prices?" → Market guidance
- "Help with pest control" → Pest management
- "Soil health tips" → Soil advice
- "Water management advice" → Irrigation tips
- "Help" → General help menu

## What's Happening

```
You type message
    ↓
Chat widget sends to backend
    ↓
Backend processes with mock service
    ↓
Returns agriculture-focused response
    ↓
Chat widget displays response
    ↓
Session maintained for follow-up messages
```

## Files to Know

### Frontend
- `apps/web/src/app/layout.tsx` - Chat widget added here
- `apps/web/src/components/chat/ChatIntegration.tsx` - Main component
- `apps/web/src/config/n8n.ts` - Configuration

### Backend
- `apps/api/src/modules/n8n-chat/n8n-chat.service.ts` - Mock responses
- `apps/api/src/modules/n8n-chat/n8n-chat.controller.ts` - Request handler
- `apps/api/src/app.ts` - Routes registered here

### Configuration
- `apps/web/.env.local` - Environment variables

## Customize

### Change Chat Label
Edit `apps/web/src/config/n8n.ts`:
```typescript
label: 'Your Custom Label',
```

### Change Colors
Edit `apps/web/src/config/n8n.ts`:
```typescript
colors: {
  primaryColor: '#your-color',
}
```

### Add Custom Responses
Edit `apps/api/src/modules/n8n-chat/n8n-chat.service.ts`:
```typescript
private getAgricultureResponse(topic: string): string {
  // Add your responses here
}
```

## Test the API

### Using cURL
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Tell me about crops"}'
```

### Using Postman
1. POST to `http://localhost:3001/api/n8n/chat`
2. Body: `{"chatInput": "Your message"}`
3. Send

## Troubleshooting

### Chat widget not showing?
- Restart dev server
- Check browser console (F12)
- Verify port 3000 is accessible

### Messages not working?
- Check backend is running on port 3001
- Try the cURL test above
- Check browser Network tab

### Wrong responses?
- Check keywords in your message
- Review mock service logic
- See documentation for custom responses

## Next Steps

### Option 1: Keep Using Mock
Perfect for development and testing. No additional setup needed.

### Option 2: Connect to Real N8N
1. Create n8n workflow with webhook trigger
2. Update `NEXT_PUBLIC_N8N_WEBHOOK_URL` in `.env.local`
3. Restart dev server
4. See `N8N_WORKFLOW_SETUP.md` for details

## Documentation

- `CHAT_WIDGET_READY.md` - Detailed quick start
- `IMPLEMENTATION_COMPLETE.md` - Full implementation details
- `N8N_WORKFLOW_SETUP.md` - Connect to real n8n
- `N8N_CHAT_SETUP.md` - Complete setup guide

## Quick Commands

```bash
# Start everything
npm run dev

# Start just frontend
npm run dev:web

# Start just backend
npm run dev:api

# Test the endpoint
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Tell me about crops"}'
```

## Architecture

```
Browser
  ↓
Chat Widget (Web Component)
  ↓
POST /api/n8n/chat
  ↓
Express Backend
  ↓
N8nChatService (Mock)
  ↓
Response
  ↓
Chat Widget displays
```

## Status

✅ **READY TO USE**

Everything is set up and working. Start your dev server and test it out!

---

**That's it!** Your chat widget is ready. Start with `npm run dev` and open `http://localhost:3000`.

For more details, see the other documentation files.
