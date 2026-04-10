# BUYER FEATURES - AgriTrust Platform

## 10 Core Buyer Features

### 1. Business KYC
**Description:** Business verification and onboarding
- GST number verification
- Company information collection
- Business registration details
- Bank account verification
- Document upload (GST certificate, business license)
- KYC approval workflow

**API Endpoints:**
- `POST /api/buyer/kyc/submit` - Submit KYC documents
- `GET /api/buyer/kyc/status` - Check KYC verification status
- `PUT /api/buyer/kyc/update` - Update business information

---

### 2. Wallet System
**Description:** Digital wallet for managing funds
- Add money to wallet (Razorpay/Stripe integration)
- Real-time balance updates
- Transaction history
- Wallet recharge
- Auto-debit for orders
- Low balance alerts

**API Endpoints:**
- `GET /api/buyer/wallet/balance` - Get current wallet balance
- `POST /api/buyer/wallet/add-funds` - Add money to wallet
- `GET /api/buyer/wallet/transactions` - Get transaction history
- `POST /api/buyer/wallet/withdraw` - Withdraw funds

---

### 3. Aggregated Marketplace
**Description:** Browse bulk crops from FPOs
- View aggregated lots from multiple farmers
- Product listings with images
- Quantity available
- Price per kg
- FPO information
- Quality grade display
- Minimum order quantity

**API Endpoints:**
- `GET /api/buyer/marketplace/lots` - Get all aggregated lots
- `GET /api/buyer/marketplace/lots/:id` - Get lot details
- `GET /api/buyer/marketplace/fpos` - Get list of FPOs
- `GET /api/buyer/marketplace/categories` - Get product categories

---

### 4. Filters
**Description:** Advanced search and filtering
- Filter by crop type
- Filter by quality grade (A, B, C)
- Filter by location (district, state)
- Filter by price range
- Filter by quantity available
- Sort by price, date, rating
- Search by keyword

**API Endpoints:**
- `GET /api/buyer/marketplace/lots?crop=wheat&grade=A&district=Pune` - Filtered results
- `GET /api/buyer/marketplace/filters/options` - Get available filter options

---

### 5. Quality Viewer
**Description:** View quality certificates and AI analysis
- Display quality certificates
- AI quality score
- Lab test results
- Certificate verification status
- Image gallery of products
- Quality parameters (moisture, purity, etc.)
- Download certificates

**API Endpoints:**
- `GET /api/buyer/quality/certificate/:lotId` - Get quality certificate
- `GET /api/buyer/quality/ai-score/:lotId` - Get AI quality analysis
- `GET /api/buyer/quality/verify/:certificateId` - Verify certificate authenticity

---

### 6. Bulk Order
**Description:** Place orders and payment processing
- Add to cart
- Select quantity
- View total price
- Wallet payment deduction
- Order confirmation
- Invoice generation
- Order summary

**API Endpoints:**
- `POST /api/buyer/orders/create` - Create new order
- `POST /api/buyer/orders/:id/pay` - Process payment from wallet
- `GET /api/buyer/orders/:id/invoice` - Download invoice
- `GET /api/buyer/orders` - Get all orders

---

### 7. Escrow System
**Description:** Secure payment holding
- Payment held in escrow on order placement
- Amount locked until delivery
- Escrow status tracking
- Automatic release on delivery confirmation
- Refund on cancellation
- Escrow transaction history

**API Endpoints:**
- `GET /api/buyer/escrow/status/:orderId` - Get escrow status
- `GET /api/buyer/escrow/transactions` - Get escrow history
- `POST /api/buyer/escrow/dispute/:orderId` - Raise dispute

---

### 8. Delivery Approval
**Description:** Confirm delivery and release payment
- View delivery status
- Delivery confirmation button
- Quality inspection checklist
- Accept/Reject delivery
- Release payment to FPO
- Delivery proof upload
- Rating and review

**API Endpoints:**
- `POST /api/buyer/orders/:id/confirm-delivery` - Confirm delivery
- `POST /api/buyer/orders/:id/reject-delivery` - Reject delivery
- `POST /api/buyer/orders/:id/review` - Submit review and rating
- `POST /api/buyer/orders/:id/upload-proof` - Upload delivery proof

---

### 9. Chat System
**Description:** Real-time communication with FPO/Farmers
- Socket.IO integration
- Real-time messaging
- Chat with FPO
- Chat with farmers
- Order-specific chats
- Message notifications
- Chat history
- File sharing (images, documents)

**API Endpoints:**
- `GET /api/buyer/chat/conversations` - Get all conversations
- `GET /api/buyer/chat/:fpoId/messages` - Get messages with FPO
- `POST /api/buyer/chat/:fpoId/send` - Send message
- `GET /api/buyer/chat/unread` - Get unread message count
- `POST /api/buyer/chat/:conversationId/mark-read` - Mark as read

**Socket Events:**
- `message:send` - Send message
- `message:receive` - Receive message
- `typing:start` - User typing
- `typing:stop` - User stopped typing

---

### 10. Order Tracking
**Description:** Track order delivery status
- Real-time order status
- Delivery timeline
- GPS tracking (if available)
- Estimated delivery date
- Shipment details
- Carrier information
- Delivery updates
- Notification on status change

**API Endpoints:**
- `GET /api/buyer/orders/:id/track` - Get tracking information
- `GET /api/buyer/orders/:id/timeline` - Get order timeline
- `GET /api/buyer/orders/:id/location` - Get current location (if GPS enabled)
- `GET /api/buyer/orders/active` - Get all active orders

---

## Navigation Structure

```
Buyer Dashboard
├── Dashboard (Overview)
├── Business KYC
├── Wallet
├── Marketplace
│   ├── Browse Products
│   └── Filters
├── Quality Certificates
├── Orders
│   ├── Place Order
│   ├── My Orders
│   └── Order Tracking
├── Escrow
│   ├── Pending Payments
│   └── Transaction History
├── Delivery Management
│   ├── Pending Deliveries
│   └── Delivery History
├── Chat
│   ├── Conversations
│   └── Messages
└── Profile
    ├── Business Info
    └── Settings
```

---

## Database Models Required

### Buyer (extends User model)
- Business name
- GST number
- Company registration
- KYC status
- Verified status

### Wallet
- User ID
- Balance
- Currency
- Transactions

### Order
- Buyer ID
- Lot ID
- Quantity
- Total amount
- Status
- Escrow status
- Delivery address

### EscrowTransaction
- Order ID
- Amount
- Status (HELD, RELEASED, REFUNDED)
- Payment gateway details

### Message
- Sender ID
- Receiver ID
- Content
- Order ID (optional)
- Read status
- Timestamp

### DeliveryProof
- Order ID
- Images
- Notes
- Uploaded by
- Timestamp

---

## Technology Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO (for chat)
- Razorpay/Stripe (payment gateway)

### Frontend
- React/Next.js
- Socket.IO Client
- State Management (Redux/Zustand)
- Real-time updates

---

## Implementation Priority

1. **Phase 1 (Core)**
   - Business KYC
   - Wallet System
   - Aggregated Marketplace
   - Filters

2. **Phase 2 (Ordering)**
   - Quality Viewer
   - Bulk Order
   - Escrow System

3. **Phase 3 (Post-Order)**
   - Order Tracking
   - Delivery Approval
   - Chat System

---

## Notes
- All features require authentication
- Role-based access control (BUYER role)
- Real-time updates using WebSockets where applicable
- Mobile-responsive design
- Offline support for critical features
