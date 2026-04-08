# Chat Feature - Debugging & Testing Guide

## 🔍 Current Issue: Chat Showing "Loading" State

When you access the chat pages, you might see a loading spinner. This guide helps you debug and test the feature.

---

## ✅ Checklist - What to Verify

### 1. **Backend is Running** ✌
```bash
# Check if backend is running
curl http://localhost:3001/health
# Should return: 200 OK
```

### 2. **Environment Variable Configured** 🔧
Check that `NEXT_PUBLIC_API_URL` is set in your `.env.local` or environment:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

When undefined, it defaults to `http://localhost:3001` (which works for local dev)

### 3. **Authentication Token** 🔐
- Must be logged in (farmer or buyer account)
- Token stored in `localStorage.getItem('token')`
- Can verify in Browser DevTools → Application → localStorage → `token`

### 4. **Database Has Chat Rooms** 💾
Chat rooms are only created when:
- An order exists between a farmer and buyer
- The order status is not deleted
- Both users have valid IDs

**If you have no orders**: Chat list will be empty (which is normal!)

---

## 🧪 Testing Steps

### Step 1: Start Both Services ▶️
```bash
# Terminal 1: Backend
cd apps/api
npm run dev
# Should show: "Server running on port 3001"

# Terminal 2: Frontend  
cd apps/web
npm run dev
# Should show: "ready - started server on 0.0.0.0:3000"
```

### Step 2: Check Backend Health 💚
```bash
curl http://localhost:3001/health
# Returns: { "status": "ok" }
```

### Step 3: Access Chat Pages

**Farmer Chat:**
- URL: `http://localhost:3000/farmer/agrichat`
- Should load with "Loading AgriChat..." animation
- Then show empty state or list of conversations

**Buyer Chat:**
- URL: `http://localhost:3000/buyer/chat`
- Should load with "Loading your messages..." animation
- Then show empty state or list of conversations

### Step 4: Create Test Data 📊

To see actual chat conversations, you need orders:

**Option A: Manual Orders**
1. Create farmer account & login
2. Create buyer account & login (different window)
3. Farmer: List a product at `/farmer/products`
4. Buyer: Search for product and place order at `/buyer/products`
5. System creates ChatRoom automatically
6. Both can access chat now!

**Option B: Database Check**
```bash
cd apps/api
npx prisma studio
# Check:
# 1. Order table - see if any records exist
# 2. ChatRoom table - see if linked to Order.id
# 3. ChatRoomMessage table - see message records
```

---

## 🐛 Common Issues & Fixes

### Issue: "Loading your messages..." Never Finishes

**Cause**: API request failing silently

**Fixes**:
1. Open Browser DevTools → Console
2. Look for error message like:
   ```
   Error loading chat rooms: AxiosError...
   ```
3. Common causes:
   - Backend not running (restart with `npm run dev`)
   - No authentication token (refresh page after login)
   - Wrong API URL (check NEXT_PUBLIC_API_URL)

**Debug Command**:
```javascript
// In browser console
localStorage.getItem('token')
// Should return: "eyJ..." (JWT token)
```

---

### Issue: "No conversations yet"

**This is NORMAL!** ✓

It means:
- ✓ Chat system is working
- ✓ No orders exist yet
- ✓ User needs to create an order first

**Solution**: Create an order between farmer and buyer

---

### Issue: Chat List Shows But ChatRoom is Empty

**Cause**: Socket.IO connection issue

**Fixes**:
1. Check browser console for Socket.IO errors
2. Verify backend Socket.IO running:
   ```bash
   # Terminal where backend is running
   # Should show: "[Socket] ✅ Connection established..."
   ```
3. Firebase that ports are accessible:
   ```bash
   # Test Socket.IO port (same as API port 3001)
   curl http://localhost:3001/socket.io/?EIO=4&transport=polling
   ```

---

## 📊 API Response Format

The `/api/chat-rooms` endpoint should return:

```json
{
  "chatRooms": [
    {
      "id": "uuid",
      "orderId": "uuid",
      "productName": "Tomatoes",
      "orderAmount": 5000,
      "farmer": { "id": "...", "name": "...", "avatarUrl": "..." },
      "buyer": { "id": "...", "name": "...", "avatarUrl": "..." },
      "lastMessageAt": "2026-04-08T...",
      "messages": [{ "sender": {...}, "content": "..." }],
      "unreadCount": 0
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 50,
    "pages": 1
  }
}
```

---

## 🔧 Manual Testing with curl

```bash
# Get all your chat rooms
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/chat-rooms

# Get specific order's chat
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/chat-rooms/orders/ORDER_ID/chat

# Send a message
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello!","type":"text"}' \
  http://localhost:3001/api/chat-rooms/CHAT_ROOM_ID/messages
```

---

## 🎯 Expected Behavior

### ✅ Correct State
```
1. Login → User authenticated ✓
2. Navigate to /farmer/agrichat or /buyer/chat
3. "Loading..." animation appears ✓
4. Chat list loads (empty or with data) ✓
5. Can select conversation → ChatRoom shows ✓
6. Can type message + send ✓
7. Message appears in real-time ✓
```

### ❌ Incorrect State
```
- "Loading..." spinner never goes away
- Error message in browser console
- API returns 401/403 (authentication)
- API returns 500 (server error)
- ChatRoom component appears but is empty
```

---

## 📋 Quick Diagnostic

Copy-paste in browser console:

```javascript
// Check authentication
console.log('Token:', localStorage.getItem('token') ? '✓ Present' : '❌ Missing');

// Check API URL
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

// Verify backend connectivity
fetch('http://localhost:3001/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.log('Backend Error:', e.message));

// Check Socket.IO
console.log('Socket.IO Available:', !!window.io);
```

---

## 🚀 Expected Console Logs

When working correctly, you should see:

```
[Socket] ✅ Connected: socket-abc123...
Chat rooms loaded: { chatRooms: [...], pagination: {...} }
User authenticated successfully
Component mounted and ready
```

---

## 📞 Still Having Issues?

1. **Backend logs** - Check terminal where you ran `npm run dev`
2. **Browser console** - Check for errors (F12)
3. **Network tab** - Check API request/response
4. **Database** - Run `npx prisma studio` to see actual data

---

## ✨ When It Works

You should see:

```
📱 Chat List (Left)
├─ Rajesh Kumar
│  └─ "Premium tomatoes at ₹50/kg"
├─ Arjun Singh  
│  └─ "Can you deliver next week?"

💬 Chat Window (Right)  
├─ Message history
├─ Input box
└─ Send button
   Online indicator 🟢
   Typing animation ...
```

---

**Built for troubleshooting the WhatsApp-like chat system** 🎉
