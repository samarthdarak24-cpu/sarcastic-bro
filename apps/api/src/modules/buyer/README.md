# Buyer Module - Complete Implementation

This module contains all 10 buyer features for the AgriTrust B2B Marketplace platform.

## 📁 Module Structure

```
buyer/
├── README.md                          # This file
├── buyer.routes.ts                    # Main router mounting all sub-routes
│
├── kyc.controller.ts                  # 1. Business KYC endpoints
├── kyc.service.ts                     # KYC business logic
│
├── wallet.controller.ts               # 2. Wallet System endpoints
├── wallet.service.ts                  # Wallet management logic
│
├── marketplace.controller.ts          # 3. Aggregated Marketplace endpoints
├── marketplace.service.ts             # Product browsing & filtering logic
│
├── bulk-order.controller.ts           # 6. Bulk Order endpoints
├── bulk-order.service.ts              # Order placement & management
│
├── escrow.controller.ts               # 7. Escrow System endpoints
├── escrow.service.ts                  # Escrow payment logic
│
├── chat.controller.ts                 # 9. Chat System endpoints
├── chat.service.ts                    # Real-time messaging logic
│
├── order-tracking.controller.ts       # 10. Order Tracking endpoints
├── order-tracking.service.ts          # Delivery tracking logic
│
├── dashboard.controller.ts            # Dashboard & Analytics
├── dashboard.service.ts               # Stats and analytics logic
│
└── __tests__/
    └── buyer-features.test.ts         # Integration tests
```

## 🎯 Features Overview

### 1. Business KYC ✅
- GST number validation and verification
- Company information management
- Bank account details storage
- Auto-verification system
- Completion percentage tracking

**Routes:** `/api/buyer/kyc/*`

### 2. Wallet System ✅
- Real-time balance tracking
- Add funds via payment gateway
- Transaction history with pagination
- Multiple transaction types
- Automatic balance updates

**Routes:** `/api/buyer/wallet/*`

### 3. Aggregated Marketplace ✅
- Browse bulk crops from FPOs
- Individual farmer crops
- Product details with supplier info
- Real-time availability

**Routes:** `/api/buyer/marketplace/*`

### 4. Filters ✅
- Multi-criteria filtering (crop, quality, location)
- Dynamic filter options
- Grade-based filtering
- Price range filtering

**Integrated in:** Marketplace endpoints

### 5. Quality Viewer ✅
- Quality certificates display
- AI quality scores
- FPO verification status
- Multiple certificates per product

**Routes:** `/api/buyer/marketplace/products/:type/:id/quality`

### 6. Bulk Order ✅
- Place orders with wallet deduction
- Quantity validation
- Order status tracking
- Cancel orders with refund

**Routes:** `/api/buyer/bulk-orders/*`

### 7. Escrow System ✅
- Automatic escrow on order placement
- Secure payment holding
- Status tracking (HELD, RELEASED, REFUNDED)
- Integrated with order lifecycle

**Routes:** `/api/buyer/escrow/*`

### 8. Delivery Approval ✅
- One-click delivery confirmation
- Automatic payment release
- Farmer earning calculation
- Platform fee deduction (2%)

**Routes:** `/api/buyer/bulk-orders/:orderId/confirm-delivery`

### 9. Chat System ✅
- Real-time messaging with farmers/FPOs
- Conversation management
- Unread message tracking
- Order-specific chat
- Socket.IO integration ready

**Routes:** `/api/buyer/chat/*`

### 10. Order Tracking ✅
- Real-time delivery tracking
- Supplier information display
- Location coordinates
- Tracking history timeline
- Live updates via Socket.IO

**Routes:** `/api/buyer/orders/:orderId/track`

## 🔌 API Endpoints

### Authentication
All endpoints require JWT authentication:
```
Authorization: Bearer <token>
```

### Base URL
```
/api/buyer
```

### Endpoint Summary

| Feature | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| **KYC** | GET | `/kyc/status` | Get KYC status |
| | POST | `/kyc/submit` | Submit KYC details |
| | POST | `/kyc/verify-gst` | Verify GST number |
| **Wallet** | GET | `/wallet` | Get wallet details |
| | GET | `/wallet/balance` | Get balance |
| | POST | `/wallet/add-funds` | Add funds |
| | GET | `/wallet/transactions` | Transaction history |
| **Marketplace** | GET | `/marketplace/products` | Browse products |
| | GET | `/marketplace/products/:type/:id` | Product details |
| | GET | `/marketplace/products/:type/:id/quality` | Quality certificates |
| | GET | `/marketplace/filters` | Available filters |
| **Orders** | POST | `/bulk-orders` | Create order |
| | GET | `/bulk-orders` | Get all orders |
| | GET | `/bulk-orders/:id` | Order details |
| | POST | `/bulk-orders/:id/confirm-delivery` | Confirm delivery |
| | POST | `/bulk-orders/:id/cancel` | Cancel order |
| **Escrow** | GET | `/escrow` | Get escrow orders |
| **Chat** | POST | `/chat/send` | Send message |
| | GET | `/chat/history/:userId` | Chat history |
| | GET | `/chat/conversations` | All conversations |
| | GET | `/chat/unread-count` | Unread count |
| | POST | `/chat/mark-read/:senderId` | Mark as read |
| **Tracking** | GET | `/orders/:id/track` | Track order |
| **Dashboard** | GET | `/dashboard/stats` | Dashboard stats |
| | GET | `/dashboard/orders-summary` | Orders summary |
| | GET | `/dashboard/analytics/spending` | Spending analytics |
| | GET | `/dashboard/top-suppliers` | Top suppliers |

## 🗄️ Database Models

### Primary Models
- `User` - Buyer account with KYC fields
- `Wallet` - Wallet balance
- `WalletTransaction` - Transaction records
- `Crop` - Individual crops
- `AggregatedLot` - FPO bulk crops
- `Order` - Order details
- `EscrowTransaction` - Escrow records
- `Message` - Chat messages
- `QualityCertificate` - Quality certificates
- `FarmerEarning` - Seller payments

### Relationships
```
User (Buyer)
  ├── Wallet (1:1)
  │   └── WalletTransaction (1:N)
  ├── Order (1:N)
  │   ├── EscrowTransaction (1:1)
  │   ├── Crop or AggregatedLot (N:1)
  │   └── OrderTracking (1:N)
  └── Message (1:N)
```

## 🧪 Testing

Run tests:
```bash
npm test -- buyer-features.test.ts
```

Test coverage includes:
- All 10 features
- Happy path scenarios
- Error handling
- Authentication/authorization
- Data validation

## 🚀 Usage Examples

### 1. Add Funds to Wallet
```typescript
const response = await fetch('/api/buyer/wallet/add-funds', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 100000,
    razorpayPaymentId: 'pay_xxxxx'
  })
});
```

### 2. Browse Marketplace with Filters
```typescript
const response = await fetch(
  '/api/buyer/marketplace/products?' + 
  'cropName=wheat&minGrade=B&district=Pune&page=1&limit=20',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
```

### 3. Place Bulk Order
```typescript
const response = await fetch('/api/buyer/bulk-orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productId: 'lot-id',
    productType: 'lot',
    quantity: 1000,
    deliveryAddress: '123 Main St, Mumbai'
  })
});
```

### 4. Confirm Delivery
```typescript
const response = await fetch(
  `/api/buyer/bulk-orders/${orderId}/confirm-delivery`,
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
```

### 5. Send Chat Message
```typescript
const response = await fetch('/api/buyer/chat/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    receiverId: 'farmer-id',
    content: 'Hello, I have a question',
    orderId: 'order-id'
  })
});
```

## 🔐 Security

- All endpoints require JWT authentication
- Role-based access control (BUYER role required)
- Input validation on all endpoints
- SQL injection prevention via Prisma
- XSS protection
- Rate limiting recommended for production

## 📊 Performance

- Pagination on all list endpoints
- Database indexes on frequently queried fields
- Efficient aggregation queries
- Transaction batching where applicable
- Caching recommendations:
  - Marketplace filters (5 min)
  - Dashboard stats (1 min)
  - Product details (2 min)

## 🐛 Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error info"
}
```

Common errors:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🔄 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Export reports (PDF/Excel)
- [ ] Bulk order templates
- [ ] Favorite suppliers
- [ ] Order scheduling
- [ ] Price alerts

## 📝 Notes

- Platform fee: 2% on all transactions
- Escrow auto-release after 7 days (configurable)
- Wallet minimum balance: ₹0
- Maximum order quantity: Based on product availability
- Chat message retention: 90 days
- Transaction history: Unlimited

## 🤝 Contributing

When adding new features:
1. Create service file with business logic
2. Create controller file with route handlers
3. Add routes to `buyer.routes.ts`
4. Update this README
5. Add integration tests
6. Update API documentation

## 📞 Support

For issues or questions:
- Check API documentation: `BUYER_FEATURES_API.md`
- Review test cases: `__tests__/buyer-features.test.ts`
- Contact: dev@agritrust.com
