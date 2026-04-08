# Chat Widget - Where to Find It

The N8N chat widget has been added to your frontend pages. Here's where you can use it:

## 📍 Chat Widget Locations

### 1. **Farmer Dashboard** ✅
**URL:** `http://localhost:3000/farmer/dashboard`

The chat widget appears on the Farmer Command Center and all farmer dashboard sections.

**Features:**
- Available on all farmer dashboard pages
- Helps with crop management, market prices, weather, etc.
- Integrated globally in the dashboard layout

### 2. **Buyer Dashboard** ✅
**URL:** `http://localhost:3000/buyer/dashboard`

The chat widget appears on the Buyer Command Center and all buyer dashboard sections.

**Features:**
- Available on all buyer dashboard pages
- Helps with sourcing, procurement, market intelligence, etc.
- Integrated globally in the dashboard layout

### 3. **Chat Test Page** ✅
**URL:** `http://localhost:3000/chat-test`

Dedicated test page to verify the chat widget is working.

**Features:**
- Shows configuration status
- Displays webhook URL
- Perfect for testing and debugging

### 4. **Global Layout** ✅
**Location:** `apps/web/src/app/layout.tsx`

The chat widget is integrated in the root layout, so it appears on **all pages** of your application.

## 🎯 How to Use

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Navigate to Any Page
- Farmer Dashboard: `http://localhost:3000/farmer/dashboard`
- Buyer Dashboard: `http://localhost:3000/buyer/dashboard`
- Or any other page in your app

### Step 3: Look for Chat Widget
The chat widget should appear as a floating element on the page.

### Step 4: Send a Message
Click the chat widget and type a message:
- "Tell me about crop management"
- "What's the weather forecast?"
- "How do I check market prices?"
- "Help with pest control"

### Step 5: Get Response
The widget will respond with agriculture-focused advice.

## 📁 Files Modified

### Frontend Pages
- ✅ `apps/web/src/app/farmer/dashboard/page.tsx` - Added ChatIntegration
- ✅ `apps/web/src/app/buyer/dashboard/page.tsx` - Added ChatIntegration
- ✅ `apps/web/src/app/layout.tsx` - Global integration (already done)

### Components
- ✅ `apps/web/src/components/chat/ChatIntegration.tsx` - Main component
- ✅ `apps/web/src/components/chat/N8nChatWidget.tsx` - Widget wrapper
- ✅ `apps/web/src/app/chat-test/page.tsx` - Test page

## 🔍 What to Look For

### Visual Indicators
- **Floating element** on the page
- **Emerald green color** (#10b981)
- **Chat icon** or text input area
- Usually appears in **bottom-right area**

### Browser Console
Open DevTools (F12) and check:
- "Webhook URL: http://localhost:3001/api/n8n/chat"
- "N8N chat script loaded"

### Network Tab
Send a message and check:
- POST request to `/api/n8n/chat`
- Response with `output` and `sessionId`

## 🧪 Test Messages

Try these to verify it's working:

| Message | Expected Response |
|---------|-------------------|
| "Tell me about crop management" | Crop management tips |
| "What's the weather forecast?" | Weather guidance |
| "How do I check market prices?" | Market price information |
| "Help with pest control" | Pest management advice |
| "Soil health tips" | Soil health guidance |
| "Water management advice" | Irrigation tips |
| "Help" | General help menu |

## 🚀 Quick Start

```bash
# 1. Start dev server
npm run dev

# 2. Open farmer dashboard
http://localhost:3000/farmer/dashboard

# 3. Look for chat widget on the page

# 4. Send a test message
"Tell me about crop management"

# 5. See the response
```

## ⚙️ Configuration

### Environment Variable
```env
# apps/web/.env.local
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:3001/api/n8n/chat
```

### Chat Settings
Edit `apps/web/src/components/chat/ChatIntegration.tsx` to customize:
- Label: "AgriVoice AI Assistant"
- Colors: Agriculture theme (emerald green)
- Description: "Get instant help with your agricultural needs"

## 🐛 Troubleshooting

### Chat widget not visible?
1. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Check browser console for errors (F12)
3. Verify backend is running: `npm run dev:api`
4. Check `.env.local` has webhook URL

### Messages not working?
1. Verify backend is running on port 3001
2. Check Network tab in DevTools
3. Look for POST request to `/api/n8n/chat`
4. Check response status and body

### Widget appears but looks wrong?
1. Clear browser cache
2. Hard refresh the page
3. Check console for CSS loading errors
4. Verify `/n8n-chat/index.js` is accessible

## 📚 Documentation

- `CHAT_WIDGET_FIX.md` - How the issue was fixed
- `CHAT_WIDGET_READY.md` - Detailed quick start
- `N8N_WORKFLOW_SETUP.md` - Connect to real n8n
- `IMPLEMENTATION_COMPLETE.md` - Full implementation details

## ✨ Features

✅ Chat widget on all pages
✅ Session management
✅ Agriculture-focused responses
✅ Keyword-based routing
✅ Error handling
✅ Theme customization
✅ Environment configuration

## 🎉 Ready to Use!

The chat widget is now integrated into your frontend pages. Start your dev server and navigate to any page to see it in action!

---

**Questions?** Check the troubleshooting section or see the documentation files.
