# BUYER Dashboard - Navigation Features (10 Core Features)

## 🏢 BUYER CORE FEATURES

### 1. 💼 Business KYC
**Route:** `/buyer/kyc`
**API Endpoints:**
- POST `/api/buyer/kyc/submit` - Submit KYC documents
- GET `/api/buyer/kyc/status` - Get KYC verification status
- PUT `/api/buyer/kyc/update` - Update KYC information

**Features:**
- GST number verification
- Company information form
- Business registration documents
- PAN card upload
- Address proof
- Bank account verification
- KYC status tracking

---

### 2. 💰 Wallet System
**Route:** `/buyer/wallet`
**API Endpoints:**
- GET `/api/buyer/wallet/balance` - Get current balance
- POST `/api/buyer/wallet/add-money` - Add money to wallet
- GET `/api/buyer/wallet/transactions` - Transaction history
- POST `/api/buyer/wallet/withdraw` - Withdraw funds

**Features:**
- Real-time balance display
- Add money via Razorpay/payment gateway
- Transaction history with filters
- Wallet recharge
- Auto-debit for orders
- Low balance alerts

---

### 3. 🛒 Aggregated Marketplace
**Route:** `/buyer/marketplace`
**API Endpoints:**
- GET `/api/buyer/marketplace/lots` - Get all aggregated lots
- GET `/api/buyer/marketplace/lots/:id` - Get lot details
- GET `/api/buyer/marketplace/categories` - Get product categories

**Features:**
- Browse bulk crops (aggregated from farmers)
- View lot details (quantity, price, quality)
- See FPO information
- View farmer contributions
- Product images and certificates
- Real-time availability

---

### 4. 🔍 Filters & Search
**Route:** `/buyer/marketplace` (integrated)
**API Endpoints:**
- GET `/api/buyer/marketplace/lots?filters` - Filtered results

**Filter Options:**
- Crop type (wheat, rice, vegetables, etc.)
- Quality grade (A, B, C)
- Location (state, district)
- Price range
- Quantity available
- Delivery time
- FPO rating
- Certification status

---

### 5. 📜 Quality Viewer
**Route:** `/buyer/quality/:lotId`
**API Endpoints:**
- GET `/api/buyer/quality/certificate/:lotId` - Get quality certificate
- GET `/api/buyer/quality/ai-results/:lotId` - Get AI quality analysis

**Features:**
- View quality certificates (PDF/Image)
- AI quality score display
- Grade verification
- Lab test results
- Certification authority details
- Download certificates
- Quality comparison

---

### 6. 🛍️ Bulk Order
**Route:** `/buyer/orders/place`
**API Endpoints:**
- POST `/api/buyer/orders/create` - Place bulk order
- POST `/api/buyer/orders/calculate` - Calculate order amount
- GET `/api/buyer/wallet/check-balance` - Verify wallet balance

**Features:**
- Select aggregated lot
- Specify quantity
- Calculate total amount
- Wallet balance check
- Auto-deduct from wallet
- Order confirmation
- Delivery address selection
- Order summary

---

### 7. 🔒 Escrow System
**Route:** `/buyer/escrow`
**API Endpoints:**
- GET `/api/buyer/escrow/transactions` - Get escrow transactions
- GET `/api/buyer/escrow/order/:orderId` - Get order escrow status

**Features:**
- View escrow status (HELD, RELEASED, REFUNDED)
- Amount held in escrow
- Escrow timeline
- Automatic hold on order placement
- Release conditions display
- Refund policy information

---

### 8. ✅ Delivery Approval
**Route:** `/buyer/orders/:orderId/approve`
**API Endpoints:**
- POST `/api/buyer/orders/:orderId/approve-delivery` - Approve delivery
- POST `/api/buyer/orders/:orderId/raise-dispute` - Raise dispute
- POST `/api/buyer/orders/:orderId/rate` - Rate order

**Features:**
- Delivery confirmation button
- Quality inspection checklist
- Approve/Reject delivery
- Automatic escrow release on approval
- Dispute resolution
- Rating and review system
- Upload delivery photos

---

### 9. 💬 Chat System
**Route:** `/buyer/chat`
**API Endpoints:**
- GET `/api/buyer/chat/conversations` - Get all conversations
- GET `/api/buyer/chat/:fpoId` - Get messages with FPO
- POST `/api/buyer/chat/:fpoId` - Send message
- GET `/api/buyer/chat/unread/count` - Unread count

**Features:**
- Real-time chat with FPO/Farmers (Socket.IO)
- WhatsApp-style interface
- Message history
- Unread indicators
- Order-specific threads
- File sharing
- Typing indicators
- Online/offline status

---

### 10. 📦 Order Tracking
**Route:** `/buyer/orders/track`
**API Endpoints:**
- GET `/api/buyer/orders` - Get all orders
- GET `/api/buyer/orders/:orderId/track` - Track specific order
- GET `/api/buyer/orders/:orderId/timeline` - Get order timeline

**Features:**
- Order list with status
- Real-time tracking
- Order timeline:
  - Order Placed
  - Payment Held in Escrow
  - Order Confirmed by FPO
  - Shipped
  - In Transit
  - Out for Delivery
  - Delivered
- Estimated delivery date
- Supplier contact information
- Delivery partner details
- Live location tracking (if available)

---

## 📱 SIDEBAR NAVIGATION STRUCTURE

```
Buyer Dashboard
├── 🏠 Home
├── 💼 KYC Verification
├── 💰 Wallet
│   ├── Balance
│   ├── Add Money
│   └── Transactions
├── 🛒 Marketplace
│   ├── Browse Products
│   ├── Aggregated Lots
│   └── Categories
├── 📦 My Orders
│   ├── All Orders
│   ├── Pending
│   ├── In Transit
│   ├── Delivered
│   └── Track Order
├── 🔒 Escrow
│   ├── Active Escrow
│   └── Transaction History
├── 💬 Messages
│   ├── All Conversations
│   └── Unread
├── 📊 Analytics
│   ├── Purchase History
│   ├── Spending Analysis
│   └── Supplier Performance
├── ⭐ Reviews & Ratings
└── ⚙️ Settings
    ├── Profile
    ├── Business Details
    ├── Notifications
    └── Payment Methods
```

---

## 🔗 COMPLETE BUYER WORKFLOW

1. **KYC Verification** → Complete business verification
2. **Add Money to Wallet** → Load wallet balance
3. **Browse Marketplace** → View aggregated lots with filters
4. **View Quality Certificates** → Check AI scores and certifications
5. **Place Bulk Order** → Select lot, specify quantity, pay from wallet
6. **Escrow Hold** → Payment automatically held in escrow
7. **Chat with FPO** → Negotiate or clarify details
8. **Track Order** → Monitor delivery status in real-time
9. **Approve Delivery** → Confirm receipt and quality
10. **Escrow Release** → Payment automatically distributed to farmers

---

## 🎯 KEY FEATURES SUMMARY

| Feature | Status | Priority |
|---------|--------|----------|
| Business KYC | ✅ Backend Ready | High |
| Wallet System | ✅ Backend Ready | High |
| Aggregated Marketplace | ✅ Backend Ready | High |
| Filters & Search | ✅ Backend Ready | High |
| Quality Viewer | ✅ Backend Ready | Medium |
| Bulk Order | ✅ Backend Ready | High |
| Escrow System | ✅ Backend Ready | High |
| Delivery Approval | ✅ Backend Ready | High |
| Chat System | ✅ Backend Ready | High |
| Order Tracking | ✅ Backend Ready | High |

---

## 🚀 REAL-TIME FEATURES (Socket.IO)

1. **Chat Messages** - Instant messaging with FPO
2. **Order Updates** - Live order status changes
3. **Wallet Balance** - Real-time balance updates
4. **Delivery Tracking** - Live location updates
5. **New Lot Alerts** - Notifications for new products
6. **Price Changes** - Real-time price updates

---

## 🔐 SECURITY FEATURES

- JWT Authentication
- Role-based access (BUYER role only)
- Encrypted payment data
- Secure wallet transactions
- KYC verification required for large orders
- Two-factor authentication (optional)
- Session management
- API rate limiting

---

## 📊 ANALYTICS & INSIGHTS

- Total spending
- Order frequency
- Favorite suppliers
- Product preferences
- Delivery performance
- Cost savings analysis
- Seasonal trends
- Supplier ratings

---

## 💡 ADDITIONAL FEATURES

### RFQ (Request for Quote)
- Create RFQ for specific products
- Receive quotes from multiple FPOs
- Compare and select best offer

### Bulk Discounts
- Volume-based pricing
- Seasonal discounts
- Loyalty rewards

### Subscription Orders
- Recurring orders
- Auto-reorder at low stock
- Scheduled deliveries

### Quality Assurance
- Return policy
- Quality guarantee
- Dispute resolution
- Insurance options
