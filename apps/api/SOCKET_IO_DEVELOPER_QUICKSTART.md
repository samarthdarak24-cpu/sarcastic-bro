# Socket.IO Developer Quick-Start Guide

**For:** Implementation Team  
**Date:** April 3, 2026  
**Duration:** 2 hours to full integration  

---

## 🎯 Your Mission (Choose One)

### Option A: Full Integration (2 hours)
Integrate Socket.IO with all 5 services:
→ See `SOCKET_IO_INTEGRATION_GUIDE.md`

### Option B: Single Service (30 minutes)
Integrate one service first:
→ See service-specific section below

### Option C: Frontend Only (1 hour)
Setup Socket.IO on frontend:
→ Skip to "Frontend Setup" section

---

## 📍 Quick Navigation

**I need to:**
- [ ] Understand Socket.IO architecture → Architecture Diagram (Summary doc)
- [ ] Integrate OrderService → Integration Guide: Order Service
- [ ] Integrate MessageService → Integration Guide: Message Service
- [ ] Integrate ProposalService → Integration Guide: Proposal Service
- [ ] Setup frontend Socket.IO → Integration Guide: Client-Side Integration
- [ ] Debug connection issues → Quick Reference: Troubleshooting
- [ ] Test my implementation → Integration Guide: Testing Socket Events
- [ ] Setup monitoring → Summary: Monitoring & Admin Endpoints

---

## ⚡ 5-Minute Quick Start

### Step 1: Verify Setup
```bash
# ✓ Check these are installed:
npm list socket.io
npm list jsonwebtoken

# ✓ Check socket.ts is initialized:
# In src/index.ts, should see:
SocketService.initialize(server);
```

### Step 2: Add to One Service
**Example: OrderService**

```typescript
// At top of src/modules/order/order.service.ts
import { SocketEmitter } from "../../services/socketEmitter";

// In create() method, add at end:
SocketEmitter.emitOrderCreated(
  order.id,
  {
    orderId: order.id,
    orderNumber: order.orderNumber,
    productName: order.product.name,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
  },
  order.farmerId,
  order.buyerId
);
```

### Step 3: Test in Browser
```javascript
// Open DevTools Console and run:
const socket = io('http://localhost:3000', {
  auth: { token: localStorage.getItem('authToken') }
});

socket.on('connect', () => console.log('✓ Connected'));
socket.on('order:created', (data) => console.log('📦', data));
```

### Step 4: Create an Order
Go to your app and create an order. Check browser console for the event.

**That's it!** 🎉

---

## 📖 Service-by-Service Integration

### 1️⃣ OrderService (15 min)

**File:** `src/modules/order/order.service.ts`

**Add import:**
```typescript
import { SocketEmitter } from "../../services/socketEmitter";
```

**Add 3 emissions:**

a) In `create()` method - after order creation:
```typescript
SocketEmitter.emitOrderCreated(
  order.id,
  { orderId: order.id, orderNumber: order.orderNumber, 
    productName: order.product.name, quantity: order.quantity, 
    totalPrice: order.totalPrice },
  order.farmerId,
  order.buyerId
);
```

b) In `updateStatus()` method:
```typescript
SocketEmitter.emitOrderStatus(
  orderId, status, order.farmerId, order.buyerId, notes
);
```

c) In `cancel()` method:
```typescript
SocketEmitter.emitOrderCancelled(orderId, order.farmerId, order.buyerId, reason);
```

**Test:**
```javascript
// Create order → check console for 'order:created' event
```

---

### 2️⃣ MessageService (10 min)

**File:** `src/modules/message/message.service.ts`

**Add import:**
```typescript
import { SocketEmitter } from "../../services/socketEmitter";
```

**Add 2 emissions:**

a) In `sendMessage()` - before return:
```typescript
SocketEmitter.emitMessageNew(
  conversation.id,
  {
    conversationId: conversation.id,
    messageId: message.id,
    senderId: message.senderId,
    senderName: message.sender.name,
    content: message.content,
    type: message.type || "text",
    timestamp: message.createdAt,
    isRead: message.isRead,
  },
  data.receiverId
);
```

b) In `markAsRead()` method:
```typescript
SocketEmitter.emitMessageRead(conversationId, messageId, userId);
```

**Test:**
```javascript
// Send message → check console for 'message:new' event
```

---

### 3️⃣ NotificationService (10 min)

**File:** `src/modules/notification/notification.service.ts`

**Update `create()` method:**
```typescript
// Replace existing socket emit with:
try {
  SocketEmitter.emitNotification(data.userId, data.type, {
    title: data.title,
    message: data.message,
    metadata: data.metadata,
    notificationId: notification.id,
  });
} catch (err) {
  console.error("[Notification] Socket emit failed:", err);
}
```

**Add to `markAsRead()`:**
```typescript
SocketEmitter.emitNotificationRead(userId, id);
```

**Add to `delete()`:**
```typescript
SocketEmitter.emitNotificationDeleted(userId, id);
```

**Test:**
```javascript
// Create notification → check console for 'notification:new'
```

---

### 4️⃣ ProposalService (15 min)

**File:** `src/modules/proposal/proposal.service.ts`

**Add import:**
```typescript
import { SocketEmitter } from "../../services/socketEmitter";
```

**Add 4 emissions:**

a) In `sendProposal()` - before return:
```typescript
SocketEmitter.emitProposalNew(
  proposal.id,
  {
    proposalId: proposal.id,
    senderId: proposal.senderId,
    senderName: proposal.sender.name,
    pricePerUnit: proposal.pricePerUnit,
    quantity: proposal.quantity,
    totalPrice: proposal.totalPrice,
    productName: proposal.product.name,
    validUntil: proposal.validUntil,
  },
  proposal.receiverId
);
```

b) In `acceptProposal()`:
```typescript
SocketEmitter.emitProposalAccepted(proposalId, order.id, proposal.senderId);
```

c) In `rejectProposal()`:
```typescript
SocketEmitter.emitProposalRejected(proposalId, proposal.senderId, reason);
```

d) In `counterProposal()`:
```typescript
SocketEmitter.emitProposalCountered(
  proposalId,
  { proposalId: counter.id, senderId, senderName: counter.sender.name, 
    newPrice, newQuantity, totalPrice: newPrice * newQuantity },
  proposal.senderId
);
```

**Test:**
```javascript
// Send proposal → check console for 'proposal:new'
```

---

### 5️⃣ ContractService (5 min)

**File:** `src/modules/contract/contract.service.ts`

**Add import:**
```typescript
import { SocketEmitter } from "../../services/socketEmitter";
```

**Add to `signContract()` method:**
```typescript
const otherPartyId = 
  contract.initiatorId === userId 
    ? contract.receiverId 
    : contract.initiatorId;

SocketEmitter.emitNotification(otherPartyId, 'CONTRACT', {
  title: 'Contract Signed',
  message: 'A contract has been signed',
  metadata: { contractId, signedBy: userId },
  actionUrl: `/contracts/${contractId}`,
});
```

---

## 🖥️ Frontend Socket.IO Setup

**File:** Create `src/lib/socket.ts`

```typescript
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
  auth: {
    token: localStorage.getItem('authToken'),
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

export default socket;
```

**In your React component:**

```typescript
import { useEffect } from 'react';
import socket from '@/lib/socket';

export function MessageList() {
  useEffect(() => {
    socket.on('message:new', (data) => {
      console.log('New message:', data);
      // Update UI here
    });

    socket.on('user:typing', (data) => {
      console.log('User typing:', data);
    });

    return () => {
      socket.off('message:new');
      socket.off('user:typing');
    };
  }, []);

  return <div>Your message list</div>;
}
```

---

## 🧪 Testing Checklist

### Local Testing (10 min)
- [ ] Start backend server
- [ ] Open http://localhost:3000 in browser
- [ ] Open DevTools Console
- [ ] Paste socket connection code
- [ ] See "Connected" message
- [ ] Perform action that should emit event
- [ ] See event in console

### Multi-client Testing (15 min)
- [ ] Open two browser windows
- [ ] Login with different users
- [ ] Send message from user A
- [ ] Verify received by user B instantly
- [ ] Check both consoles show the event

### Error Testing (10 min)
- [ ] Use invalid JWT token → should show auth error
- [ ] Disconnect network → should show reconnection attempts
- [ ] Check browser console for any errors

---

## 🐛 Debugging Tips

### Event Not Showing?
```javascript
// In browser console
socket.on('*', (event, data) => {
  console.log('EVENT:', event, data);
});
// This will log ALL events
```

### Connection Issues?
```javascript
// Check connection status
console.log(socket.connected);  // true/false
console.log(socket.id);          // socket ID
```

### Backend Logs?
```bash
# Enable debug logging
DEBUG=socket.io:* npm run dev
```

### Rate Limited?
```typescript
// In socket.ts, temporarily increase:
const MAX_EVENTS_PER_MINUTE = 600; // was 60
```

---

## ⏱️ Implementation Timeline

### 10 minutes
- [ ] Read this quick-start guide
- [ ] Understand the 2 files created

### 15 minutes  
- [ ] Add import to first service
- [ ] Add one SocketEmitter call
- [ ] Test in browser

### 45 minutes
- [ ] Add to remaining services
- [ ] Test each integration

### 30 minutes
- [ ] Setup frontend Socket.IO
- [ ] Add event listeners
- [ ] Test multi-client communication

### 30 minutes
- [ ] Final testing
- [ ] Fix any issues
- [ ] Deploy

**Total: ~2 hours to production**

---

## 📞 Common Questions

**Q: Do I need to update all 5 services?**  
A: No, you can do them one at a time or in any order.

**Q: Will this break existing REST endpoints?**  
A: No, Socket.IO works alongside REST. No changes needed to endpoints.

**Q: How do I handle multiple server instances?**  
A: Add Redis adapter (advanced, not needed initially).

**Q: What if WebSocket connection fails?**  
A: Socket.IO automatically falls back to HTTP polling.

**Q: Can I test without all services integrated?**  
A: Yes, just integrate the ones you need first.

---

## ✅ Success Indicators

You'll know it's working when:

✓ Backend logs show `[Socket] ✓ User connected`  
✓ Browser console shows connection event  
✓ Creating order/message/proposal shows event in console  
✓ Multiple clients receive events instantly  
✓ User online/offline status updates  

---

## 📚 Reference Files

1. **SOCKET_IO_INTEGRATION_GUIDE.md** (1500 lines)
   - For detailed implementation of each service
   - Full code examples
   - Patterns and best practices

2. **SOCKET_IO_IMPLEMENTATION_SUMMARY.md**
   - For architecture understanding
   - Feature overview
   - Performance info

3. **SOCKET_IO_QUICK_REFERENCE.md**
   - For quick API reference
   - Event names
   - Troubleshooting

4. **This File**
   - For quick-start and step-by-step
   - Timeline and checkboxes

---

## 🚀 Deploy When Ready

```bash
# Test build
npm run build

# Test in staging
npm run start

# Monitor logs
tail -f logs/socket.io.log

# Deploy to production
git push production main
```

---

## 📝 Notes

- All code is TypeScript with full type safety
- Error handling is included in all methods
- Logging is built-in for debugging
- Rate limiting protects from abuse
- No database schema changes needed

---

## 💡 Pro Tips

1. **Start with one service** to understand the pattern
2. **Test in browser console** as you go
3. **Use multiple browser windows** for multi-client testing
4. **Check logs** when something doesn't work
5. **Read integration guide** for detailed explanations

---

## 🎯 Next Actions

1. ✅ Read this guide (you are here)
2. ⬜ Pick a service to start with
3. ⬜ Add import and emission
4. ⬜ Test in browser
5. ⬜ Repeat for other services
6. ⬜ Setup frontend
7. ⬜ Deploy

---

**Ready?** Pick a service above and start with the code example. 

**Questions?** Check the Troubleshooting section or reference documents.

**Need help?** All implementation code and examples are provided.

---

**You've got this! 🚀**

