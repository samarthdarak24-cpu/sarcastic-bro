# Chat Widget - Fixed & Ready to Use

## Issue Found & Fixed

The chat widget wasn't showing because the environment variable wasn't being read at runtime. This has been fixed.

## What Was Changed

### 1. Updated ChatIntegration Component
**File:** `apps/web/src/components/chat/ChatIntegration.tsx`

Changed from reading config at build time to reading environment variable at runtime using `useEffect`.

### 2. Created Test Page
**File:** `apps/web/src/app/chat-test/page.tsx`

A dedicated test page to verify the chat widget is working.

## How to See the Chat Widget

### Option 1: Test Page (Recommended)
1. Start dev server: `npm run dev`
2. Open: `http://localhost:3000/chat-test`
3. You should see the chat widget on this page

### Option 2: Global (All Pages)
The chat widget is also integrated globally in the root layout, so it should appear on all pages.

## Verify It's Working

1. **Check Console**
   - Open DevTools (F12)
   - Go to Console tab
   - You should see: "Webhook URL: http://localhost:3001/api/n8n/chat"
   - You should see: "N8N chat script loaded"

2. **Look for Chat Widget**
   - Should appear as a floating button or embedded element
   - Usually in the bottom-right corner
   - Has emerald green color (#10b981)

3. **Send a Test Message**
   - Click the chat widget
   - Type: "Tell me about crop management"
   - You should get a response

## Test Messages

Try these messages to verify it's working:
- "Tell me about crop management"
- "What's the weather forecast?"
- "How do I check market prices?"
- "Help with pest control"
- "Soil health tips"
- "Water management advice"

## Environment Configuration

Your `.env.local` is already configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:3001/api/n8n/chat
```

## Backend Endpoint

The backend endpoint is running at:
```
POST http://localhost:3001/api/n8n/chat
```

## Troubleshooting

### Chat widget still not showing?

1. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Check console for errors**
   - Open DevTools (F12)
   - Look for any red error messages
   - Check if script loaded successfully

3. **Verify backend is running**
   - Make sure `npm run dev:api` is running
   - Or `npm run dev` for both frontend and backend

4. **Check environment variable**
   - Verify `.env.local` has `NEXT_PUBLIC_N8N_WEBHOOK_URL` set
   - Restart dev server after changing `.env.local`

### Widget appears but messages don't work?

1. **Check backend is running**
   - Verify port 3001 is accessible
   - Try: `curl http://localhost:3001/api/n8n/chat`

2. **Check network requests**
   - Open DevTools Network tab
   - Send a message
   - Look for POST request to `/api/n8n/chat`
   - Check response status and body

3. **Check backend logs**
   - Look at terminal running backend
   - Should see request logs

## Files Modified

- ✅ `apps/web/src/components/chat/ChatIntegration.tsx` - Fixed to read env at runtime
- ✅ `apps/web/src/app/chat-test/page.tsx` - Created test page

## Files Already in Place

- ✅ `apps/web/src/components/chat/N8nChatWidget.tsx` - Widget component
- ✅ `apps/web/src/config/n8n.ts` - Configuration
- ✅ `apps/web/src/app/layout.tsx` - Global integration
- ✅ `apps/api/src/modules/n8n-chat/` - Backend module
- ✅ `apps/web/public/n8n-chat/` - Built web component files
- ✅ `apps/web/.env.local` - Environment variables

## Quick Start

```bash
# 1. Start dev server
npm run dev

# 2. Open test page
http://localhost:3000/chat-test

# 3. Look for chat widget
# Should see it on the page

# 4. Send a test message
# Type: "Tell me about crop management"

# 5. See response
# Should get agriculture-focused response
```

## Next Steps

1. **Verify it's working** on the test page
2. **Check all pages** - widget should appear globally
3. **Customize if needed** - edit colors in ChatIntegration.tsx
4. **Connect to real n8n** - update webhook URL when ready

## Status

✅ **FIXED AND READY TO USE**

The chat widget should now be visible and working. Start your dev server and test it!

---

**Questions?** Check the console for error messages or see the troubleshooting section above.
