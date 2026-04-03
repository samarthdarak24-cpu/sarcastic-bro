# Socket.IO Real-Time Integration Guide

## Overview

This guide explains how to integrate Socket.IO real-time events into existing endpoints and services for the ODOP CONNECT platform. The implementation uses two files:

- **`src/config/socket.ts`** - Socket.IO server initialization and event handlers
- **`src/services/socketEmitter.ts`** - Helper methods for emitting events from services

---

## Quick Start

### 1. Import SocketEmitter in Your Service

```typescript
import { SocketEmitter } from "../services/socketEmitter";
```

### 2. Emit Events from Service Methods

```typescript
// In your service method
const order = await prisma.order.create({...});

// Emit the event
SocketEmitter.emitOrderCreated(
  order.id,
  {
    orderId: order.id,
    orderNumber: order.orderNumber,
    productName: product.name,
    quantity: order.quantity,
    totalPrice: order.totalPrice
  },
  order.farmerId,
  order.buyerId
);
```

---

## Integration Points

### 1. Order Service (`src/modules/order/order.service.ts`)

#### Create Order

**Current Method:**
```typescript
static async create(buyerId: string, data: z.infer<typeof createOrderSchema>) {
  // ... existing code ...
  const order = await prisma.$transaction(async (tx) => {
    // ... create order ...
    return tx.order.create({...});
  });
  
  // ADD THIS:
  await prisma.notification.create({...}); // keep existing
  
  return order;
}
```

**Integration Code - Add at the end of create():**
```typescript
import { SocketEmitter } from "../../services/socketEmitter";

// After creating order and notification, add:
SocketEmitter.emitOrderCreated(
  order.id,
  {
    orderId: order.id,
    orderNumber: order.orderNumber,
    farmerId: order.farmerId,
    buyerId: order.buyerId,
    productName: order.product.name,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
  },
  order.farmerId,
  order.buyerId
);
```

#### Update Order Status

**Location:** Find `updateOrderStatus` or `changeStatus` method

**Integration Code:**
```typescript
static async updateStatus(
  orderId: string,
  status: string,
  notes?: string
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { farmer: true, buyer: true },
  });

  if (!order) throw ApiError.notFound("Order not found");

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status, updatedAt: new Date() },
  });

  // ADD THESE LINES:
  SocketEmitter.emitOrderStatus(
    orderId,
    status as any,
    order.farmerId,
    order.buyerId,
    notes
  );

  return updated;
}
```

#### Cancel Order

**Integration Code:**
```typescript
static async cancel(orderId: string, reason?: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { 
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancelReason: reason 
    },
  });

  // ADD THESE LINES:
  SocketEmitter.emitOrderCancelled(
    orderId,
    order.farmerId,
    order.buyerId,
    reason
  );

  return order;
}
```

---

### 2. Message Service (`src/modules/message/message.service.ts`)

#### Send Message

**Current Method - Locate:**
```typescript
static async sendMessage(senderId: string, data: SendMessageInput) {
  // ... existing code ...
  const message = await prisma.chatMessage.create({...});
  
  await prisma.chatConversation.update({...});
  await prisma.notification.create({...});
  
  return message;
}
```

**Integration Code - Add before return:**
```typescript
import { SocketEmitter } from "../../services/socketEmitter";

// Add these lines before return:
SocketEmitter.emitMessageNew(
  conversation.id,
  {
    conversationId: conversation.id,
    messageId: message.id,
    senderId: message.senderId,
    senderName: message.sender.name,
    content: message.content,
    type: (message.type as any) || "text",
    timestamp: message.createdAt,
    isRead: message.isRead,
    fileUrl: message.fileUrl,
  },
  data.receiverId
);
```

#### Mark Message as Read

**Integration Code:**
```typescript
static async markAsRead(messageId: string, conversationId: string, userId: string) {
  const message = await prisma.chatMessage.update({
    where: { id: messageId },
    data: { isRead: true, readAt: new Date() },
  });

  // ADD THESE LINES:
  SocketEmitter.emitMessageRead(conversationId, messageId, userId);

  return message;
}
```

---

### 3. Notification Service (`src/modules/notification/notification.service.ts`)

#### Create Notification

**Current Method:**
```typescript
static async create(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}) {
  const notification = await prisma.notification.create({...});

  // Already tries to emit, but replace with:
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

  return notification;
}
```

#### Mark Notification as Read

**Integration Code:**
```typescript
static async markAsRead(id: string, userId: string) {
  const notification = await prisma.notification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });

  // ADD THESE LINES:
  SocketEmitter.emitNotificationRead(userId, id);

  return notification;
}
```

#### Delete Notification

**Integration Code:**
```typescript
static async delete(id: string, userId: string) {
  const notification = await prisma.notification.delete({
    where: { id },
  });

  // ADD THESE LINES:
  SocketEmitter.emitNotificationDeleted(userId, id);

  return notification;
}
```

---

### 4. Proposal Service (`src/modules/proposal/proposal.service.ts`)

#### Send Proposal

**Current Method - Locate:**
```typescript
static async sendProposal(senderId: string, data: SendProposalInput) {
  // ... existing code ...
  const proposal = await prisma.proposal.create({...});
  
  await prisma.notification.create({...});
  
  return proposal;
}
```

**Integration Code - Add before return:**
```typescript
import { SocketEmitter } from "../../services/socketEmitter";

// Add these lines before return:
SocketEmitter.emitProposalNew(
  proposal.id,
  {
    proposalId: proposal.id,
    senderId: proposal.senderId,
    senderName: proposal.sender.name,
    receiverId: proposal.receiverId,
    pricePerUnit: proposal.pricePerUnit,
    quantity: proposal.quantity,
    totalPrice: proposal.totalPrice,
    productName: proposal.product.name,
    validUntil: proposal.validUntil,
  },
  proposal.receiverId
);
```

#### Accept Proposal

**Integration Code:**
```typescript
static async acceptProposal(proposalId: string, receiverId: string) {
  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: "ACCEPTED", acceptedAt: new Date() },
    include: { sender: true, product: true },
  });

  // Create order from proposal
  const order = await prisma.order.create({
    data: {
      buyerId: receiverId,
      farmerId: proposal.senderId,
      productId: proposal.productId,
      quantity: proposal.quantity,
      totalPrice: proposal.totalPrice,
      orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
    },
  });

  // ADD THESE LINES:
  SocketEmitter.emitProposalAccepted(proposalId, order.id, proposal.senderId);

  // Also emit order creation
  SocketEmitter.emitOrderCreated(
    order.id,
    {
      orderId: order.id,
      orderNumber: order.orderNumber,
      productName: proposal.product.name,
      quantity: proposal.quantity,
      totalPrice: proposal.totalPrice,
    },
    proposal.senderId,
    receiverId
  );

  return { proposal, order };
}
```

#### Reject Proposal

**Integration Code:**
```typescript
static async rejectProposal(proposalId: string, receiverId: string, reason?: string) {
  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: "REJECTED", rejectedAt: new Date() },
  });

  // ADD THESE LINES:
  SocketEmitter.emitProposalRejected(proposalId, proposal.senderId, reason);

  return proposal;
}
```

#### Counter Proposal

**Integration Code:**
```typescript
static async counterProposal(
  proposalId: string,
  senderId: string,
  newPrice: number,
  newQuantity: number,
  message?: string
) {
  // Update original proposal or create counter
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { sender: true },
  });

  if (!proposal) throw ApiError.notFound("Proposal not found");

  // Create counter (can store in a counters table or update status)
  const counter = await prisma.proposal.create({
    data: {
      senderId,
      receiverId: proposal.senderId, // Send back to original sender
      productId: proposal.productId,
      quantity: newQuantity,
      pricePerUnit: newPrice,
      totalPrice: newPrice * newQuantity,
      message,
      status: "COUNTERED",
      relatedProposalId: proposalId, // Store reference if your schema supports this
    },
    include: { sender: true },
  });

  // ADD THESE LINES:
  SocketEmitter.emitProposalCountered(
    proposalId,
    {
      proposalId: counter.id,
      senderId: senderId,
      senderName: counter.sender.name,
      newPrice,
      newQuantity,
      totalPrice: newPrice * newQuantity,
    },
    proposal.senderId
  );

  return counter;
}
```

---

### 5. Contract Service (`src/modules/contract/contract.service.ts`)

#### Sign Contract

**Integration Code:**
```typescript
import { SocketEmitter } from "../../services/socketEmitter";

static async signContract(contractId: string, userId: string) {
  const contract = await prisma.contract.update({
    where: { id: contractId },
    data: { 
      signedAt: new Date(),
      status: "SIGNED"
    },
    include: { order: true, initiator: true, receiver: true }
  });

  // Notify the other party
  const otherPartyId = 
    contract.initiatorId === userId 
      ? contract.receiverId 
      : contract.initiatorId;

  SocketEmitter.emitNotification(otherPartyId, "CONTRACT", {
    title: "Contract Signed",
    message: "A contract has been signed",
    metadata: { contractId, signedBy: userId },
    actionUrl: `/contracts/${contractId}`,
  });

  return contract;
}
```

---

## Event Flow Diagrams

### Message Event Flow
```
User A sends message
    ↓
MessageService.sendMessage()
    ↓
Create ChatMessage in DB
    ↓
SocketEmitter.emitMessageNew()
    ↓
Emit to `conversation:${conversationId}` room
Emit notification to User B
    ↓
User B receives message via Socket.IO
```

### Order Event Flow
```
Buyer creates order
    ↓
OrderService.create()
    ↓
Decrement stock + Create Order in DB
    ↓
SocketEmitter.emitOrderCreated()
    ↓
Emit to `order:${orderId}` room
Emit notification to Farmer
    ↓
Farmer receives order notification
```

### Proposal Acceptance Flow
```
Receiver accepts proposal
    ↓
ProposalService.acceptProposal()
    ↓
Update proposal status to ACCEPTED
Create Order from proposal
    ↓
SocketEmitter.emitProposalAccepted()
SocketEmitter.emitOrderCreated()
    ↓
Sender receives acceptance notification
Order event broadcast to both parties
    ↓
Both parties see order in real-time
```

---

## Client-Side Integration (Frontend)

### Connect to Socket.IO

```typescript
// src/lib/socket.ts (React/Next.js)
import io, { Socket } from "socket.io-client";

const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL, {
  auth: {
    token: localStorage.getItem("authToken"),
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

export default socket;
```

### Listen to Events

```typescript
// src/hooks/useRealtimeEvents.ts
import { useEffect } from "react";
import socket from "@/lib/socket";

export function useRealtimeEvents() {
  useEffect(() => {
    // Message Events
    socket.on("message:new", (data) => {
      console.log("New message:", data);
      // Update message state in component
    });

    socket.on("message:read", (data) => {
      console.log("Message read:", data);
    });

    socket.on("user:typing", (data) => {
      console.log("User typing:", data.isTyping);
    });

    // Order Events
    socket.on("order:created", (data) => {
      console.log("Order created:", data);
      // Update orders list
    });

    socket.on("order:status", (data) => {
      console.log("Order status changed:", data.status);
      // Update order status in UI
    });

    // Notification Events
    socket.on("notification:new", (data) => {
      console.log("New notification:", data);
      // Show notification toast/badge
    });

    // Proposal Events
    socket.on("proposal:new", (data) => {
      console.log("New proposal:", data);
    });

    socket.on("proposal:accepted", (data) => {
      console.log("Proposal accepted:", data);
    });

    // Presence Events
    socket.on("user:online", (data) => {
      console.log("User online:", data.userId);
    });

    socket.on("user:offline", (data) => {
      console.log("User offline:", data.userId);
    });

    return () => {
      socket.off("message:new");
      socket.off("message:read");
      socket.off("order:created");
      socket.off("order:status");
      socket.off("notification:new");
      socket.off("proposal:new");
      socket.off("user:online");
      socket.off("user:offline");
    };
  }, []);
}
```

### Join Rooms (Frontend)

```typescript
// Join conversation room when opening chat
useEffect(() => {
  if (conversationId) {
    socket.emit("conversation:join", { conversationId });
  }

  return () => {
    if (conversationId) {
      socket.emit("conversation:leave", { conversationId });
    }
  };
}, [conversationId]);

// Subscribe to order updates
useEffect(() => {
  if (orderId) {
    socket.emit("order:status:subscribe", { orderId });
  }
}, [orderId]);
```

---

## API Endpoint Changes

### No Breaking Changes Required

The implementation works alongside existing REST endpoints. Controllers can call services which now emit events:

```typescript
// src/modules/order/order.controller.ts
import { OrderService } from "./order.service";

export const createOrder = asyncHandler(async (req, res) => {
  const buyerId = req.user.userId;
  const order = await OrderService.create(buyerId, req.body);
  
  // Service handles Socket.IO emission
  // Controller just returns response
  
  res.status(201).json({
    success: true,
    data: order,
  });
});
```

---

## Testing Socket Events

### Using Socket.IO Test Client

```typescript
// test/socket.test.ts
import io from "socket.io-client";

describe("Socket Events", () => {
  let socket: any;

  beforeEach((done) => {
    socket = io("http://localhost:3000", {
      auth: {
        token: "test-token-here",
      },
    });
    socket.on("connect", done);
  });

  afterEach(() => {
    socket.close();
  });

  it("should receive message:new event", (done) => {
    socket.on("message:new", (data) => {
      expect(data.conversationId).toBeDefined();
      expect(data.senderId).toBeDefined();
      done();
    });

    // Simulate message sending from another client
    socket.emit("message:send", {
      conversationId: "conv-123",
      receiverId: "user-456",
      content: "Test message",
    });
  });

  it("should receive order:created event", (done) => {
    socket.on("order:created", (data) => {
      expect(data.orderId).toBeDefined();
      expect(data.orderNumber).toBeDefined();
      done();
    });
  });
});
```

---

## Monitoring & Logging

### Enable Socket.IO Debugging

```typescript
// In development environment
import debug from "debug";
debug("socket.io:*");
```

### Check Connected Users

```typescript
// In admin endpoints
import { SocketEmitter } from "../services/socketEmitter";

router.get("/admin/socket/users", (req, res) => {
  const onlineUsers = SocketEmitter.getOnlineUsers();
  const count = onlineUsers.length;

  res.json({
    connectedCount: count,
    users: onlineUsers,
  });
});
```

---

## Best Practices

✅ **DO:**
- Emit events from service layer, not controllers
- Include proper error handling in emitters
- Use appropriate room names for organization
- Validate data before emitting
- Log all critical events
- Clean up connections on disconnect
- Use rate limiting for high-frequency events

❌ **DON'T:**
- Emit sensitive data (passwords, tokens)
- Emit in controllers before data is persisted
- Forget to handle socket disconnect
- Emit without error handling
- Use generic room names that overlap
- Emit duplicate events
- Store credentials in socket.data

---

## Troubleshooting

### Events Not Received

1. Check JWT token is valid
2. Verify user is joined to correct room
3. Check browser console for connection errors
4. Verify backend is emitting (check logs)
5. Check CORS settings in socket.ts

### Rate Limiting Issues

Events are rate-limited to 60 per minute per user. For testing:
- Temporarily increase `MAX_EVENTS_PER_MINUTE` in socket.ts
- Monitor logs for rate limit messages

### Connection Drops

- Check `pingInterval` and `pingTimeout` settings
- Implement auto-reconnect on frontend
- Monitor network conditions
- Check server memory usage

---

## Production Checklist

- [ ] Set `env.NODE_ENV` to "production"
- [ ] Disable verbose logging in socket.ts
- [ ] Enable rate limiting for all events
- [ ] Configure proper CORS origins
- [ ] Set up Redis adapter for multiple server instances
- [ ] Monitor Socket.IO connections with metrics
- [ ] Test reconnection scenarios
- [ ] Set up error alerting for socket emissions
- [ ] Review security of all emitted data
- [ ] Load test with expected concurrent connections

