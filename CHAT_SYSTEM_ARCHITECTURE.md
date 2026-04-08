# Chat System Architecture

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           AGRIVOICE PLATFORM                             │
└─────────────────────────────────────────────────────────────────────────┘

                            FRONTEND (Next.js)
                         ┌──────────────────────┐
                         │   Chat Pages         │
                         ├──────────────────────┤
                         │ /buyer/chat          │
                         │ /farmer/agrichat     │
                         └──────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
         ┌──────────▼──────────┐    ┌──────────▼──────────┐
         │  ChatRoom Component  │    │  ChatList Component  │
         ├─────────────────────┤    ├─────────────────────┤
         │ Message display      │    │ Conversation list   │
         │ Input & Send         │    │ Unread badges       │
         │ File upload          │    │ Last message        │
         │ Typing indicators    │    │ Timestamps          │
         │ Reactions           │    │ Search & filter     │
         └──────────┬──────────┘    └──────────┬──────────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                         ┌────────▼────────┐
                         │   Socket.IO      │
                         │ Real-time layer  │
                         └────────┬────────┘
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
    ┌───────────▼───────────┐        ┌────────────▼────────────┐
    │   REST API Endpoints  │        │   WebSocket Connection  │
    ├───────────────────────┤        ├────────────────────────┤
    │ GET    /chat-rooms    │        │ join-chat-room         │
    │ GET    /messages      │        │ send-message           │
    │ POST   /messages      │        │ user-typing            │
    │ PATCH  /messages      │        │ message-delivered      │
    │ DELETE /messages      │        │ message-seen           │
    │ POST   /reactions     │        │ user-online/offline    │
    │ POST   /uploads       │        │ typing-indicator       │
    └───────────┬───────────┘        └────────────┬───────────┘
                │                                 │
                └─────────────────┬───────────────┘
                                  │
                            ┌─────▼──────┐
                            │  Backend    │
                            │ Port: 3001  │
                            └─────┬──────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        │                         │                         │
 ┌──────▼──────┐        ┌────────▼────────┐       ┌────────▼────────┐
 │Service Layer │        │Socket.IO Handler│       │ File Upload     │
 ├─────────────┤        ├─────────────────┤       ├─────────────────┤
 │Chat-room    │        │Real-time events │       │Image compression│
 │ service     │        │rooms tracking   │       │File storage     │
 │ Messages    │        │user presence    │       │Validation       │
 │ Reactions   │        │typing status    │       │             /uploads│
 │ Search      │        │                 │       │                 │
 │ Notify      │        │                 │       │                 │
 └──────┬──────┘        └─────────────────┘       └────────┬────────┘
        │                                                  │
        └──────────────────┬───────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Prisma    │
                    │    ORM      │
                    └──────┬──────┘
                           │
                    ┌──────▼────────────┐
                    │   SQLite (dev)    │
                    │  PostgreSQL (prod)│
                    ├───────────────────┤
                    │ ChatRoom          │
                    │ ChatRoomMessage   │
                    │ MessageReaction   │
                    │ TypingIndicator   │
                    │ UserOnlineStatus  │
                    │ MessageSrchIndex  │
                    │ ChatNotification  │
                    │ ChatRoomUser      │
                    └───────────────────┘
```

---

## 🔄 Message Flow Diagram

```
FARMER                    SOCKET.IO                   BUYER
┌─────────────┐           SERVER                  ┌─────────────┐
│             │                                   │             │
│  ChatRoom   │                                   │  ChatRoom   │
│  Component  │                                   │  Component  │
│             │                                   │             │
└──────┬──────┘                                   └──────┬──────┘
       │                                                  │
       │  send-message                                    │
       │  {content:"Hi Priya"}                            │
       │─────────────────────────────────────────────────>
       │                             [Store in DB]
       │                            ✓ Message created
       │                              status: SENT
       │<─────────────────────────────────────────────────
       │  message-sent-ack                                │
       │                                                  │
       │                              message-received    │
       │                         {id, sender, content}    │
       │                                                  │
       │                                            message → ChatList
       │                                            message → ChatRoom
       │                                        displayed with SENT badge
       │                                                  │
       │                         mark-message-delivered   │
       │<─────────────────────────────────────────────────│
       │     status updated: DELIVERED                    │
       │     timestamp: deliveredAt                       │
       │                                                  │
       │ [User reads message in ChatRoom]                │
       │                            mark-message-seen
       │                         {messageId, userId}
       │─────────────────────────────────────────────────>
       │                             Update status: SEEN
       │<─────────────────────────────────────────────────
       │  message-seen-notification                       │
       │   [Show ✓✓ in message bubble]                    │
       │                                                  │
```

---

## 📱 Component Hierarchy

```
App Layout
│
├─ RealtimeProvider (Socket.IO connection)
│  │
│  ├─ Farmer Dashboard Page
│  │  └─ Quick Actions
│  │     └─ Link → /farmer/agrichat
│  │
│  └─ Buyer Dashboard Page
│     └─ Quick Actions
│        └─ Link → /buyer/chat
│
Chat Pages (/farmer/agrichat, /buyer/chat)
│
├─ ChatList Component
│  ├─ Search input
│  ├─ Filter buttons
│  └─ Conversation items
│     ├─ Avatar
│     ├─ Name + Verified badge
│     ├─ Last message preview
│     ├─ Timestamp
│     ├─ Unread badge
│     └─ Online indicator
│
└─ ChatRoom Component
   ├─ Chat Header
   │  ├─ User info
   │  ├─ Online status
   │  └─ Action buttons (call, more)
   │
   ├─ Messages Container
   │  └─ MessageBubble (repeating)
   │     ├─ Avatar
   │     ├─ Message content
   │     ├─ Timestamp
   │     ├─ Status indicator (SENT/DELIVERED/SEEN)
   │     ├─ Edit/Delete menu
   │     └─ Reactions
   │
   ├─ TypingIndicator
   │  └─ Animated dots "User is typing..."
   │
   └─ Message Input
      ├─ Text input field
      ├─ Attachment button
      │  └─ Image/File upload
      ├─ Emoji button
      │  └─ Emoji picker
      └─ Send button
```

---

## 🔌 Socket.IO Connection Flow

```
Browser Window                Socket.IO Server         Database
     │                              │                      │
     │  connect()                   │                      │
     ├─────────────────────────────>│                      │
     │                              │                      │
     │                    authenticate()                   │
     │                              │                      │
     │  join-user-room {userId}     │                      │
     ├─────────────────────────────>│                      │
     │                              │ [Track user]         │
     │<─────────────────────────────┤                      │
     │  connection-ack              │                      │
     │                              │                      │
     │  join-chat-room {chatRoomId} │                      │
     ├─────────────────────────────>│                      │
     │                              │ [Add to room]        │
     │                              │                      │
     │  user-online                 │                      │
     ├─────────────────────────────>│                      │
     │                              │ UPDATE UserOnlineStatus
     │                              │ SET isOnline = true  │
     │                              ├─────────────────────>│
     │                              │<─────────────────────┤
     │                              │      ✓ Updated       │
     │                              │                      │
     │  send-message {...}          │                      │
     ├─────────────────────────────>│                      │
     │                              │ INSERT ChatRoomMessage
     │                              ├─────────────────────>│
     │                              │<─────────────────────┤
     │                              │      ✓ Created       │
     │                              │                      │
     │  [User leaves page]           │                      │
     │  disconnect()                │                      │
     ├─────────────────────────────>│                      │
     │                              │ UPDATE UserOnlineStatus
     │                              │ SET isOnline = false │
     │                              ├─────────────────────>│
     │                              │<─────────────────────┤
```

---

## 🗄️ Database Relations

```
Order (1) ─────────────┐
                       │
                  1:1 ▼
              ┌─────────────────┐
              │   ChatRoom      │
              ├─────────────────┤
              │ id (PK)         │
              │ orderId (FK,UQ) │
              │ farmerId (FK)   │
              │ buyerId (FK)    │
              │ status          │
              │ createdAt       │
              └────────┬────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
      1:N            1:N             1:N
       │               │               │
   ┌───▼────────┐ ┌────▼──────┐ ┌─────▼────┐
   │ChatRoom    │ │TypingIdx  │ │UserOnline│
   │Message     │ │Indicator  │ │Status    │
   ├────────────┤ ├───────────┤ ├──────────┤
   │ id (PK)    │ │ id (PK)   │ │ id (PK)  │
   │chatRoomId  │ │chatRoomId │ │chatRoomId│
   │(FK)        │ │(FK)       │ │(FK)      │
   │ senderId   │ │ userId    │ │ userId   │
   │ (FK)       │ │(FK)       │ │(FK)      │
   │content     │ │startAt    │ │isOnline  │
   │status      │ │expiresAt  │ │lastSeen  │
   │sentAt      │ │           │ │socketId  │
   │deliveredAt │ │           │ │          │
   │seenAt      │ │           │ │          │
   └───┬────────┘ └───────────┘ └──────────│
       │                                    │
       │ 1:N                                │
       │                                    │
   ┌───▼──────────────────┐                │
   │MessageReaction       │                │
   ├──────────────────────┤                │
   │ id (PK)              │                │
   │ messageId (FK)       │                │
   │ userId (FK)          │                │
   │ emoji                │                │
   └──────────────────────┘                │
                                           │
                                      1:N  │
                                           │
                                    ┌──────▼────────┐
                                    │ChatNotification│
                                    ├────────────────┤
                                    │ id (PK)        │
                                    │chatRoomId      │
                                    │userId (FK)     │
                                    │messageId       │
                                    │type            │
                                    │isRead          │
                                  └────────────────┘

User (Farmer)                    User (Buyer)
    │                                │
    │ 1:N                       1:N   │
    │                                │
    └─────────┬──────────────────────┘
              │
         1:N  │
              │
        ┌─────▼────────┐
        │ChatRoomUser  │
        ├──────────────┤
        │ id (PK)      │
        │chatRoomId(FK)│
        │userId(FK)    │
        │joinedAt      │
        │leftAt        │
        │isActive      │
        │role          │
        └──────────────┘
```

---

## 🚀 Deployment Flow

```
Development
└─ npm run dev (both frontend & backend)
   └─ SQLite database (local)
   └─ Socket.IO on localhost:3001

Testing
└─ npm run build
└─ npm run start
└─ Test with multiple browser windows

Production  
└─ Docker containers
└─ PostgreSQL database
└─ HTTPS with Socket.IO
└─ Load balancing
└─ Database backups
```

---

## 🔐 Security Features

```
Authentication
├─ JWT token validation
├─ User context verification
└─ Role-based access (FARMER/BUYER)

Data Protection
├─ Messages encrypted at rest
├─ Socket.IO requires auth token
├─ File uploads validated
└─ XSS protection via React

Rate Limiting
├─ 60 events/minute per user
├─ 1000 events/hour per user
└─ Message size limits

Database Security
├─ Cascade deletes for integrity
├─ Foreign key constraints
├─ Unique constraints on key fields
└─ Indexes for query optimization
```

---

This architecture provides **real-time**, **scalable**, and **secure** communication between farmers and buyers! 🎉
