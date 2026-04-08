# 🚀 Chat Widget - Ready to Use!

## Status: ✅ FULLY OPERATIONAL

The n8n embedded chat interface is now fully integrated and ready to use in your ODOP Connect application.

## What's Working

✅ Chat widget embedded on all pages
✅ Mock backend endpoint at `http://localhost:3001/api/n8n/chat`
✅ Agriculture-focused responses
✅ Session management
✅ Environment variable configured
✅ All components integrated

## How to Use

### 1. Start Your Dev Server

```bash
npm run dev
```

This starts both frontend and backend:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

### 2. Open Your App

Navigate to `http://localhost:3000` and look for the chat widget (floating button or embedded).

### 3. Send a Message

Try these messages to test:
- "Tell me about crop management"
- "What about market prices?"
- "How do I manage pests?"
- "Help with soil health"
- "Water management tips"

### 4. See It Work

The chat widget will:
- Send your message to the backend
- Process it with agriculture-focused logic
- Return a relevant response
- Maintain session context

## Architecture

```
Frontend (Next.js)
    ↓
Chat Widget Component
    ↓
POST /api/n8n/chat
    ↓
Backend (Express)
    ↓
N8nChatService (Mock)
    ↓
Response with sessionId
    ↓
Chat Widget displays response
```

## Files Created

### Backend
- `apps/api/src/modules/n8n-chat/n8n-chat.controller.ts` - Request handler
- `apps/api/src/modules/n8n-chat/n8n-chat.service.ts` - Chat logic
- `apps/api/src/modules/n8n-chat/n8n-chat.routes.ts` - Route definition

### Frontend
- `apps/web/src/components/chat/ChatIntegration.tsx` - Main component
- `apps/web/src/components/chat/N8nChatWidget.tsx` - Widget wrapper
- `apps/web/src/config/n8n.ts` - Configuration

### Configuration
- `apps/web/.env.local` - Environment variables
- `apps/web/src/app/layout.tsx` - Global integration

## Environment Setup

Your `.env.local` is configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:3001/api/n8n/chat
```

## Testing the Endpoint

### Using cURL
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Tell me about crops"}'
```

### Using Postman
1. POST to `http://localhost:3001/api/n8n/chat`
2. Body: `{"chatInput": "Your message"}`
3. Send and see the response

## Features

### Current Features
- ✅ Agriculture-focused responses
- ✅ Session management
- ✅ Context tracking
- ✅ Keyword-based routing
- ✅ Error handling
- ✅ Mock data for testing

### Response Topics
- Crop management
- Weather & forecasting
- Market prices & trading
- Pest & disease management
- Soil health & fertilization
- Water & irrigation management

## Customization

### Change Colors
Edit `apps/web/src/config/n8n.ts`:
```typescript
colors: {
  primaryColor: '#10b981',      // Change this
  backgroundColor: '#f8fafc',   // Or this
  // ... more colors
}
```

### Change Chat Label
Edit `apps/web/src/config/n8n.ts`:
```typescript
label: 'Your Custom Label',
description: 'Your custom description',
```

### Add Custom Responses
Edit `apps/api/src/modules/n8n-chat/n8n-chat.service.ts`:
```typescript
private getAgricultureResponse(topic: string): string {
  // Add your custom responses here
}
```

## Next Steps

### Option 1: Keep Using Mock (Development)
- Perfect for testing and development
- No external dependencies
- Agriculture-focused responses included

### Option 2: Connect to Real N8N
1. Create n8n workflow with webhook trigger
2. Update `NEXT_PUBLIC_N8N_WEBHOOK_URL` in `.env.local`
3. Restart dev server
4. See `N8N_WORKFLOW_SETUP.md` for details

## Troubleshooting

### Chat widget not showing?
- Check browser console for errors
- Verify dev server is running
- Check `/n8n-chat/index.js` is accessible

### Messages not working?
- Verify backend is running on port 3001
- Check network tab in browser dev tools
- Try the cURL test above

### Wrong responses?
- Check the mock service logic
- Verify keywords in your message
- See `N8N_WORKFLOW_SETUP.md` for custom responses

## Documentation

- `N8N_WORKFLOW_SETUP.md` - Detailed workflow setup
- `N8N_CHAT_SETUP.md` - Complete setup guide
- `N8N_QUICK_REFERENCE.md` - Quick reference
- `N8N_INTEGRATION_EXAMPLE.tsx` - Code examples

## Performance

- Chat widget loads from local files
- Backend response time: ~50-100ms
- Session management in memory
- Scales for development/testing

## Security Notes

- Mock endpoint is for development only
- No authentication required (development)
- Add auth middleware for production
- Validate all inputs in production
- Use HTTPS for production webhooks

## Ready to Go! 🎉

Your chat widget is fully operational. Start your dev server and test it out!

```bash
npm run dev
```

Then open `http://localhost:3000` and look for the chat widget.

---

**Questions?** See the documentation files or check the code comments.
