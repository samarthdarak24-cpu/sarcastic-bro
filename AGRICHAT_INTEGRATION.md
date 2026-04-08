# AgriChat - WhatsApp-like Chat System Integration

## Overview
AgriChat is a real-time, WhatsApp-like messaging system integrated into the ODOP Connect dashboard for seamless communication between Farmers and Buyers.

## ✅ Features Implemented

### 1. **Real-Time Chat (Socket.IO)**
- Instant messaging without page refresh
- Socket.IO connection with JWT authentication
- Automatic reconnection handling
- Room-based architecture for scalability

### 2. **Chat List Sidebar**
- Shows all conversations
- Displays:
  - User name/avatar
  - Last message preview
  - Timestamp
  - Unread count badge
  - Online/offline status indicator
- Search functionality to filter conversations

### 3. **Online/Offline Status**
- Green dot indicator for online users
- "Last seen" timestamp for offline users
- Real-time status updates via Socket.IO

### 4. **Typing Indicator**
- Shows "typing..." when other user is typing
- Auto-hides after 3 seconds of inactivity
- Smooth animations

### 5. **Message Status**
- ✔ Sent
- ✔✔ Delivered
- ✔✔ Blue Seen (when recipient reads message)
- Real-time status updates

### 6. **File & Image Sharing**
- Upload crop images
- Send PDF invoices
- File preview in chat
- File size and type validation

### 7. **Chat History**
- Load previous messages
- Pagination support (lazy loading)
- Infinite scroll capability
- Message persistence in database

### 8. **Search Chat**
- Search users/conversations
- Search messages (indexed for performance)
- Full-text search support

### 9. **Notifications**
- New message alerts
- Unread badge count
- Sound notifications (optional)
- Push notifications (optional)

### 10. **Message Actions**
- Delete message
- Edit message
- Reply to message (with quote)
- Emoji reactions

## 📁 Project Structure

### Frontend
```
apps/web/src/
├── components/dashboard/AgriChat/
│   ├── AgriChat.tsx          # Main component
│   ├── ChatList.tsx          # Sidebar with conversations
│   ├── ChatWindow.tsx        # Active chat window
│   └── index.ts              # Exports
├── services/
│   └── agriChatService.ts    # Socket.IO client service
└── styles/
    └── agri-chat.css         # Styling
```

### Backend
```
apps/api/src/
├── modules/agri-chat/
│   ├── agri-chat.controller.ts   # API endpoints
│   ├── agri-chat.routes.ts       # Route definitions
│   └── agri-chat.socket.ts       # Socket.IO handlers
└── services/
    └── socketService.ts          # Socket service (updated)
```

### Database
```
Prisma Models:
- ChatRoom              # One per order
- ChatRoomMessage      # Individual messages
- MessageReaction      # Emoji reactions
- TypingIndicator      # Typing status
- UserOnlineStatus     # Online/offline status
- MessageSearchIndex   # For search functionality
- ChatNotification     # Notification tracking
- ChatRoomUser         # Permission tracking
```

## 🚀 Integration Steps

### 1. **Add to Dashboard Navigation**
In your dashboard sidebar, add:
```tsx
{
  label: 'AgriChat',
  href: '/dashboard',
  section: 'agriChat',
  icon: <MessageCircle />,
  badge: unreadCount,
}
```

### 2. **Render AgriChat Component**
In your dashboard page:
```tsx
import { AgriChat } from '@/components/dashboard/AgriChat';

if (activeTab === 'agriChat') {
  return <AgriChat />;
}
```

### 3. **API Endpoints**

#### Get Chat Rooms
```
GET /api/agri-chat/rooms
Authorization: Bearer {token}
```

#### Get Messages
```
GET /api/agri-chat/rooms/{roomId}/messages
Authorization: Bearer {token}
```

#### Send Message
```
POST /api/agri-chat/rooms/{roomId}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Hello!",
  "type": "text",
  "fileUrl": "optional",
  "fileName": "optional"
}
```

#### Create Chat Room
```
POST /api/agri-chat/rooms
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "order-123",
  "farmerId": "farmer-id",
  "farmerName": "Rajesh Kumar",
  "buyerId": "buyer-id",
  "buyerName": "Amit Patel"
}
```

### 4. **Socket.IO Events**

#### Client → Server
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message
- `typing` - Send typing indicator
- `message_seen` - Mark message as seen

#### Server → Client
- `message_received` - New message arrived
- `typing` - User is typing
- `user_online` - User came online
- `user_offline` - User went offline
- `message_seen` - Message was seen

## 🔐 Security

### Access Control
- Only farmer & buyer of an order can access that chat room
- User ID validation before joining room
- JWT token authentication required
- Role-based access control (FARMER/BUYER)

### Data Protection
- Messages encrypted in transit (HTTPS/WSS)
- Database encryption at rest (recommended)
- Rate limiting on API endpoints
- Input validation and sanitization

## 🎨 UI/UX Design

### Layout
- **Left Sidebar**: Chat list (360px width)
- **Right Panel**: Active chat window (flex: 1)
- **Bottom**: Message input area
- **Top**: User info and online status

### Colors
- Primary: #22c55e (Emerald Green)
- Secondary: #16a34a (Dark Green)
- Background: #fafafa (Light Gray)
- Text: #1e293b (Dark Slate)

### Responsive
- Desktop: Side-by-side layout
- Tablet: Stacked layout
- Mobile: Full-width chat window

## 📊 Database Schema

### ChatRoom
```sql
- id (UUID)
- orderId (FK to Order)
- farmerId (FK to User)
- buyerId (FK to User)
- productName (String)
- orderAmount (Float)
- status (ACTIVE | ARCHIVED | CLOSED)
- lastMessageAt (DateTime)
- unreadCount (Int)
- createdAt (DateTime)
```

### ChatRoomMessage
```sql
- id (UUID)
- chatRoomId (FK to ChatRoom)
- senderId (FK to User)
- content (String)
- type (text | image | file | voice)
- fileUrl (String, optional)
- status (SENT | DELIVERED | SEEN)
- sentAt, deliveredAt, seenAt (DateTime)
- isEdited, isDeleted (Boolean)
- createdAt (DateTime)
```

## 🔧 Configuration

### Environment Variables
```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Backend
SOCKET_CORS_ORIGINS=http://localhost:3000
DATABASE_URL=file:./dev.db
```

### Socket.IO Options
```typescript
{
  auth: { token, userId },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
}
```

## 📈 Performance Optimization

### Frontend
- Message virtualization for large lists
- Lazy loading of chat history
- Debounced typing indicator
- Optimistic UI updates

### Backend
- Database indexing on frequently queried fields
- Message pagination (50 messages per load)
- Socket.IO room-based broadcasting
- Connection pooling for database

### Caching
- Redis for online status (optional)
- In-memory cache for active rooms
- Browser cache for static assets

## 🐛 Troubleshooting

### Connection Issues
1. Check Socket.IO server is running
2. Verify CORS configuration
3. Check JWT token validity
4. Review browser console for errors

### Message Not Sending
1. Verify user has access to chat room
2. Check message content is not empty
3. Verify database connection
4. Check API endpoint is registered

### Typing Indicator Not Working
1. Verify Socket.IO connection
2. Check typing event is being emitted
3. Verify room subscription

## 🚀 Future Enhancements

### Phase 2
- [ ] Voice messages
- [ ] Video call integration
- [ ] Message encryption (E2E)
- [ ] Message forwarding
- [ ] Bulk message export

### Phase 3
- [ ] AI suggestions in chat
- [ ] Auto-translation (Hindi/English)
- [ ] Chatbot integration
- [ ] Message scheduling
- [ ] Chat analytics

### Phase 4
- [ ] Group chats
- [ ] Channel support
- [ ] Message threading
- [ ] Advanced search filters
- [ ] Chat backup & restore

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review Socket.IO logs
3. Check browser console
4. Review API response errors
5. Contact development team

## 📝 License

Part of ODOP Connect Platform
© 2024 All Rights Reserved
