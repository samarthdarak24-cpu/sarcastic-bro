# Buyer Features API Documentation

Complete API documentation for all 10 buyer features in the AgriTrust B2B Marketplace.

## Base URL
```
/api/buyer
```

All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Business KYC (GST & Company Info)

### Get KYC Status
```http
GET /api/buyer/kyc/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "gst": "27AADCM1234F1Z5",
    "bankAccount": "****1234",
    "ifsc": "SBIN0001234",
    "bankName": "State Bank of India",
    "completionPercentage": 100
  }
}
```

### Submit KYC Details
```http
POST /api/buyer/kyc/submit
```

**Request Body:**
```json
{
  "gst": "27AADCM1234F1Z5",
  "companyName": "Agarwal Agro Industries",
  "companyAddress": "Mumbai, Maharashtra",
  "bankAccount": "12345678901234",
  "ifsc": "SBIN0001234",
  "bankName": "State Bank of India"
}
```

**Response:**
```json
{
  "success": true,
  "message": "KYC submitted successfully",
  "data": {
    "verified": true,
    "message": "KYC details submitted and verified successfully"
  }
}
```

### Verify GST Number
```http
POST /api/buyer/kyc/verify-gst
```

**Request Body:**
```json
{
  "gst": "27AADCM1234F1Z5"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "gst": "27AADCM1234F1Z5",
    "companyName": "Sample Company Pvt Ltd",
    "registeredAddress": "Mumbai, Maharashtra",
    "status": "Active",
    "registrationDate": "2020-01-15"
  }
}
```

---

## 2. Wallet System

### Get Wallet Details
```http
GET /api/buyer/wallet
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "wallet-id",
    "userId": "user-id",
    "balance": 500000,
    "currency": "INR",
    "transactions": [...]
  }
}
```

### Get Wallet Balance
```http
GET /api/buyer/wallet/balance
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 500000,
    "currency": "INR"
  }
}
```

### Add Funds to Wallet
```http
POST /api/buyer/wallet/add-funds
```

**Request Body:**
```json
{
  "amount": 100000,
  "razorpayPaymentId": "pay_xxxxx",
  "razorpayOrderId": "order_xxxxx",
  "method": "UPI"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Funds added successfully",
  "data": {
    "wallet": {
      "balance": 600000
    },
    "transaction": {
      "amount": 100000,
      "balanceBefore": 500000,
      "balanceAfter": 600000,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Get Transaction History
```http
GET /api/buyer/wallet/transactions?type=ADD_FUNDS&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

## 3. Aggregated Marketplace

### Get Marketplace Products (with Filters)
```http
GET /api/buyer/marketplace/products?cropName=wheat&category=grains&minGrade=B&district=Pune&page=1&limit=20
```

**Query Parameters:**
- `cropName` (optional): Filter by crop name
- `category` (optional): Filter by category (Vegetables, Fruits, Grains)
- `minGrade` (optional): Minimum quality grade (A, B, C)
- `district` (optional): Filter by district
- `state` (optional): Filter by state
- `minQuantity` (optional): Minimum quantity in kg
- `maxPrice` (optional): Maximum price per kg
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "aggregatedLots": [
      {
        "id": "lot-id",
        "type": "AGGREGATED",
        "cropName": "Wheat",
        "totalQuantity": 5000,
        "pricePerKg": 25,
        "fpo": {
          "id": "fpo-id",
          "name": "Maharashtra FPO",
          "district": "Pune",
          "state": "Maharashtra"
        },
        "qualityCertUrl": "https://...",
        "numberOfFarmers": 15,
        "averageGrade": "A",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "individualCrops": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalLots": 10,
      "totalCrops": 25,
      "totalPages": 2
    }
  }
}
```

### Get Product Details
```http
GET /api/buyer/marketplace/products/:type/:id
```

**Parameters:**
- `type`: Either "crop" or "lot"
- `id`: Product ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product-id",
    "type": "AGGREGATED",
    "cropName": "Wheat",
    "totalQuantity": 5000,
    "pricePerKg": 25,
    "fpo": {...},
    "numberOfFarmers": 15,
    "averageGrade": "A"
  }
}
```

### Get Available Filters
```http
GET /api/buyer/marketplace/filters
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": ["Vegetables", "Fruits", "Grains"],
    "locations": [
      { "district": "Pune", "state": "Maharashtra" }
    ],
    "crops": ["Wheat", "Rice", "Tomato"],
    "grades": ["A", "B", "C"]
  }
}
```

---

## 4. Quality Viewer (Certificate + AI Results)

### Get Quality Certificate
```http
GET /api/buyer/marketplace/products/:type/:id/quality
```

**Parameters:**
- `type`: Either "crop" or "lot"
- `id`: Product ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cert-id",
      "fileUrl": "https://cloudinary.com/...",
      "verifiedByFPO": true,
      "aiScore": 92.5,
      "uploadedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## 5. Bulk Order (Place Order → Deduct from Wallet)

### Create Bulk Order
```http
POST /api/buyer/bulk-orders
```

**Request Body:**
```json
{
  "productId": "product-id",
  "productType": "lot",
  "quantity": 1000,
  "deliveryAddress": "123 Main St, Mumbai, Maharashtra",
  "deliveryDate": "2024-02-01",
  "notes": "Please deliver before 10 AM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "id": "order-id",
      "buyerId": "buyer-id",
      "quantity": 1000,
      "totalAmount": 25000,
      "status": "PENDING",
      "escrowStatus": "HELD"
    },
    "message": "Order placed successfully. Funds held in escrow."
  }
}
```

### Get All Orders
```http
GET /api/buyer/bulk-orders?status=PENDING&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### Get Order Details
```http
GET /api/buyer/bulk-orders/:orderId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-id",
    "quantity": 1000,
    "totalAmount": 25000,
    "status": "IN_TRANSIT",
    "escrowStatus": "HELD",
    "crop": {...},
    "lot": {...},
    "escrowTransaction": {...}
  }
}
```

---

## 6. Escrow System (Amount Goes to "Held")

Escrow is automatically handled when placing an order. The funds are held in escrow until delivery is confirmed.

### Get Escrow Orders
```http
GET /api/buyer/escrow?status=HELD&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "escrows": [
      {
        "id": "escrow-id",
        "orderId": "order-id",
        "amount": 25000,
        "status": "HELD",
        "heldAt": "2024-01-15T10:00:00Z",
        "order": {...}
      }
    ],
    "pagination": {...}
  }
}
```

---

## 7. Delivery Approval (Button → Releases Payment)

### Confirm Delivery
```http
POST /api/buyer/bulk-orders/:orderId/confirm-delivery
```

**Response:**
```json
{
  "success": true,
  "message": "Delivery confirmed successfully",
  "data": {
    "order": {
      "status": "DELIVERED",
      "escrowStatus": "RELEASED"
    },
    "message": "Delivery confirmed. Payment released to seller."
  }
}
```

### Cancel Order
```http
POST /api/buyer/bulk-orders/:orderId/cancel
```

**Request Body:**
```json
{
  "reason": "Changed requirements"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "message": "Order cancelled. Funds refunded to wallet."
  }
}
```

---

## 8. Chat System (Real-time with Farmer/FPO)

### Send Message
```http
POST /api/buyer/chat/send
```

**Request Body:**
```json
{
  "receiverId": "farmer-id",
  "content": "Hello, I have a question about the wheat quality",
  "orderId": "order-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "message-id",
    "senderId": "buyer-id",
    "receiverId": "farmer-id",
    "content": "Hello, I have a question about the wheat quality",
    "orderId": "order-id",
    "read": false,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get Chat History
```http
GET /api/buyer/chat/history/:otherUserId?orderId=order-id
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "message-id",
      "content": "Hello",
      "sender": {...},
      "receiver": {...},
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get All Conversations
```http
GET /api/buyer/chat/conversations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "partnerId": "farmer-id",
      "partnerName": "Rajesh Kumar",
      "partnerRole": "FARMER",
      "lastMessage": "Thank you for your order",
      "lastMessageTime": "2024-01-15T10:00:00Z",
      "unreadCount": 2
    }
  ]
}
```

### Get Unread Count
```http
GET /api/buyer/chat/unread-count
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

### Mark Messages as Read
```http
POST /api/buyer/chat/mark-read/:senderId
```

**Response:**
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

---

## 9. Order Tracking (Track Delivery + Supplier Info)

### Get Order Tracking
```http
GET /api/buyer/orders/:orderId/track
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order-id",
      "status": "IN_TRANSIT",
      "quantity": 1000,
      "totalAmount": 25000
    },
    "supplier": {
      "id": "supplier-id",
      "name": "Rajesh Kumar",
      "phone": "9876543210",
      "district": "Pune"
    },
    "tracking": [
      {
        "status": "PENDING",
        "location": "Warehouse",
        "actualTime": "2024-01-15T10:00:00Z",
        "notes": "Order confirmed"
      },
      {
        "status": "IN_TRANSIT",
        "location": "Mumbai Hub",
        "lat": 19.0760,
        "lng": 72.8777,
        "actualTime": "2024-01-16T08:00:00Z",
        "notes": "Out for delivery"
      }
    ],
    "currentStatus": {
      "status": "IN_TRANSIT",
      "location": "Mumbai Hub"
    }
  }
}
```

---

## 10. Dashboard & Analytics

### Get Dashboard Stats
```http
GET /api/buyer/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSpent": 250000,
    "totalOrders": 15,
    "activeOrders": 3,
    "completedOrders": 10,
    "activeSuppliers": 5,
    "walletBalance": 500000,
    "recentOrders": [...]
  }
}
```

### Get Orders Summary
```http
GET /api/buyer/dashboard/orders-summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pending": 2,
    "confirmed": 1,
    "inTransit": 3,
    "delivered": 10,
    "cancelled": 1
  }
}
```

### Get Spending Analytics
```http
GET /api/buyer/dashboard/analytics/spending?period=month
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "totalSpent": 150000,
    "orderCount": 8,
    "averageOrderValue": 18750,
    "categoryBreakdown": [
      {
        "category": "Grains",
        "amount": 100000,
        "percentage": 66.67
      },
      {
        "category": "Vegetables",
        "amount": 50000,
        "percentage": 33.33
      }
    ]
  }
}
```

### Get Top Suppliers
```http
GET /api/buyer/dashboard/top-suppliers?limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "supplier-id",
      "name": "Maharashtra FPO",
      "orders": 5,
      "totalSpent": 125000
    }
  ]
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error information"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## WebSocket Events (for Real-time Chat)

Connect to: `ws://localhost:5000`

### Events to Listen:
- `message:new` - New message received
- `message:read` - Message marked as read
- `order:update` - Order status updated
- `order:location` - Real-time location update

### Events to Emit:
- `message:send` - Send a message
- `message:typing` - User is typing
