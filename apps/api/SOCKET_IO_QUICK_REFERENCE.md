# Socket.IO Events Quick Reference Card

## 📡 Common Integration Patterns

### Pattern 1: Emit from Service

```typescript
// Import at top of service file
import { SocketEmitter } from "../../services/socketEmitter";

// In your method, after DB update:
SocketEmitter.emitOrderCreated(orderId, data, farmerId, buyerId);
```

### Pattern 2: Emit Notification Only

```typescript
SocketEmitter.emitNotification(userId, 'ORDER', {
  title: 'Order Received',
  message: 'New order for 100kg wheat',
  metadata: { orderId }
});
```

### Pattern 3: Emit to Specific Room

```typescript
SocketEmitter.emitToRoom(`conversation:${convId}`, 'message:new', {
  conversationId: convId,
  messageId,
  senderId,
  content
});
```

---

## 🎯 Event Reference

### Messages
```typescript
// Emit new message to conversation room
SocketEmitter.emitMessageNew(convId, messageData, recipientId);

// Mark message as read
SocketEmitter.emitMessageRead(convId, messageId, userId);

// Typing indicator
SocketEmitter.emitUserTyping(convId, userId, isTyping);
```

### Orders
```typescript
// New order
SocketEmitter.emitOrderCreated(orderId, {
  orderId, orderNumber, productName, quantity, totalPrice
}, farmerId, buyerId);

// Status changed
SocketEmitter.emitOrderStatus(orderId, 'SHIPPED', farmerId, buyerId, notes);

// Order cancelled
SocketEmitter.emitOrderCancelled(orderId, farmerId, buyerId, reason);
```

### Notifications
```typescript
// New notification
SocketEmitter.emitNotification(userId, 'ORDER', {
  title, message, metadata
});

// Mark read
SocketEmitter.emitNotificationRead(userId, notificationId);

// Delete
SocketEmitter.emitNotificationDeleted(userId, notificationId);
```

### Proposals
```typescript
// New proposal
SocketEmitter.emitProposalNew(proposalId, proposalData, receiverId);

// Accept
SocketEmitter.emitProposalAccepted(proposalId, orderId, senderId);

// Reject
SocketEmitter.emitProposalRejected(proposalId, senderId, reason);

// Counter
SocketEmitter.emitProposalCountered(proposalId, counterData, receiverId);
```

### Presence
```typescript
// User online
SocketEmitter.emitUserOnline(userId);

// User offline
SocketEmitter.emitUserOffline(userId);
```

---

## 🔧 Setup Checklist

- [ ] Verify `src/config/socket.ts` initialized in `src/index.ts`
- [ ] Add `import { SocketEmitter }` to services you're updating
- [ ] Add emission calls after DB operations
- [ ] Import and test in frontend
- [ ] Verify JWT tokens are included in socket connection
- [ ] Test with browser dev tools

---

## 🧪 Quick Test (Browser Console)

```javascript
// Connect
const socket = io('http://localhost:3000', {
  auth: { token: 'eyJhb...' }
});

// Listen
socket.on('connect', () => console.log('✓ Connected'));
socket.on('order:created', d => console.log('📦 Order:', d));
socket.on('message:new', d => console.log('💬 Message:', d));

// Send event
socket.emit('message:send', {
  conversationId: 'conv-1',
  receiverId: 'user-2',
  content: 'Test'
});
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Events not received | Check JWT token validity, verify room name |
| Connection refused | Check CORS_ORIGINS env var, verify port |
| Rate limited | Reduce event frequency or increase limit |
| Empty rooms | Verify client is calling `socket.emit('conversation:join')` |
| TypeScript errors | Check import paths, verify SocketEmitter export |

---

## 📍 Room Names Reference

```typescript
notifications:${userId}         // User's notifications
conversation:${conversationId}  // Chat conversations
order:${orderId}               // Order tracking
proposal:${proposalId}         // Proposal tracking
presence:${userId}             // User presence
```

---

## 💾 Implementation Time Estimate

| Task | Time |
|------|------|
| Read integration guide | 10 min |
| Integrate OrderService | 15 min |
| Integrate MessageService | 10 min |
| Integrate NotificationService | 10 min |
| Integrate ProposalService | 15 min |
| Frontend socket setup | 20 min |
| Testing | 30 min |
| **Total** | **~2 hours** |

---

## 🎓 Key Concepts

**Room:** A channel where events are broadcast to multiple users
- Example: `conversation:123` - all users in that chat

**Emission:** Sending an event through Socket.IO
- Server → Client: `socket.emit('event', data)`
- Client → Server: `socket.emit('event', data)`

**Listener:** Code that responds when an event is received
- `socket.on('event', (data) => { handle data })`

**Namespace:** Groups related events together
- Used for organization, not required for basic setup

---

## 🔐 Security Reminders

✓ Always validate JWT tokens (automatic in socket.ts)
✓ Never emit sensitive data (passwords, tokens)
✓ Verify user owns data before emitting (check ownership in service)
✓ Use rate limiting (automatic, adjusted in socket.ts)
✓ Log all emissions (automatic logging included)

---

## 📞 Quick Links

- Main Implementation: `src/config/socket.ts`
- Emission Helper: `src/services/socketEmitter.ts`
- Integration Guide: `SOCKET_IO_INTEGRATION_GUIDE.md`
- Implementation Summary: `SOCKET_IO_IMPLEMENTATION_SUMMARY.md`

---

**Last Updated:** April 3, 2026
**Status:** ✅ Production Ready

