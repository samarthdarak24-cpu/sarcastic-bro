# Phase 2 Backend Services - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Service

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123!",
  "name": "John Farmer",
  "role": "FARMER",
  "phone": "+919876543210",
  "district": "Nashik",
  "state": "Maharashtra"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Farmer",
      "email": "farmer@example.com",
      "role": "FARMER",
      "phone": "+919876543210",
      "district": "Nashik",
      "state": "Maharashtra",
      "kycStatus": "PENDING",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123!"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

### Update Profile
```http
PATCH /auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+919876543211",
  "district": "Pune"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

---

## 2. Crop Management Service

### Create Crop
```http
POST /products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Organic Tomatoes",
  "category": "vegetable",
  "description": "Fresh organic tomatoes from our farm",
  "price": 45.50,
  "quantity": 100,
  "unit": "kg",
  "district": "Nashik",
  "state": "Maharashtra",
  "harvestDate": "2024-01-15"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Organic Tomatoes",
    "category": "vegetable",
    "price": 45.50,
    "quantity": 100,
    "unit": "kg",
    "qualityGrade": null,
    "qualityScore": null,
    "farmerId": "uuid",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get All Crops (with filters)
```http
GET /products?category=vegetable&minPrice=40&maxPrice=50&page=1&limit=20
```

### Get Crop by ID
```http
GET /products/:id
```

### Update Crop
```http
PATCH /products/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "price": 48.00,
  "quantity": 95
}
```

### Delete Crop
```http
DELETE /products/:id
Authorization: Bearer <access_token>
```

### Toggle Crop Status
```http
POST /products/:id/toggle-status
Authorization: Bearer <access_token>
```

---

## 3. Order Management Service

### Create Order
```http
POST /orders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "productId": "uuid",
  "quantity": 50,
  "notes": "Please deliver by 5 PM"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2024-001",
    "productId": "uuid",
    "farmerId": "uuid",
    "buyerId": "uuid",
    "quantity": 50,
    "totalPrice": 2275.00,
    "status": "PENDING",
    "notes": "Please deliver by 5 PM",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get All Orders
```http
GET /orders?status=PENDING&page=1&limit=20
Authorization: Bearer <access_token>
```

### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <access_token>
```

### Update Order Status
```http
PATCH /orders/:id/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "ACCEPTED",
  "notes": "Order accepted and will be shipped tomorrow"
}
```

### Add Tracking Update
```http
POST /orders/:id/tracking
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "IN_TRANSIT",
  "location": "Nashik, Maharashtra",
  "lat": 19.9975,
  "lng": 73.7898,
  "notes": "Package picked up from warehouse",
  "estimatedTime": "2024-01-16T18:00:00Z"
}
```

### Cancel Order
```http
POST /orders/:id/cancel
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

---

## 4. Chat Service (AgriChat)

### Send Message
```http
POST /api/agri-chat/send
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "receiverId": "uuid",
  "content": "Hi, are your tomatoes available?",
  "type": "TEXT",
  "orderId": "uuid"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "conversationId": "uuid",
    "senderId": "uuid",
    "receiverId": "uuid",
    "content": "Hi, are your tomatoes available?",
    "type": "TEXT",
    "isRead": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Conversations
```http
GET /api/agri-chat/conversations
Authorization: Bearer <access_token>
```

### Get Messages
```http
GET /api/agri-chat/messages/:conversationId?page=1&limit=50
Authorization: Bearer <access_token>
```

### Mark Message as Read
```http
PATCH /api/agri-chat/messages/:id/read
Authorization: Bearer <access_token>
```

### Search Messages
```http
GET /api/agri-chat/search?query=tomatoes&conversationId=uuid
Authorization: Bearer <access_token>
```

### Add Emoji Reaction
```http
POST /api/agri-chat/reactions
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "messageId": "uuid",
  "emoji": "👍"
}
```

---

## 5. Payment Service

### Initiate Payment
```http
POST /api/payments/initiate
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "orderId": "uuid",
  "amount": 2275.00,
  "method": "UPI"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderId": "uuid",
    "amount": 2275.00,
    "currency": "INR",
    "status": "PENDING",
    "razorpayOrderId": "order_1234567890",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "paymentId": "uuid",
  "signature": "signature_from_razorpay"
}
```

### Get Payment Status
```http
GET /api/payments/:id/status
Authorization: Bearer <access_token>
```

### Get Transaction History
```http
GET /api/payments/history?startDate=2024-01-01&endDate=2024-01-31&page=1&limit=20
Authorization: Bearer <access_token>
```

### Get Invoice
```http
GET /api/payments/:id/invoice
Authorization: Bearer <access_token>
```

---

## 6. Trust & Rating Service

### Submit Rating
```http
POST /api/trust-rating/submit
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "orderId": "uuid",
  "toUserId": "uuid",
  "stars": 5,
  "review": "Excellent quality tomatoes, very fresh!"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderId": "uuid",
    "fromUserId": "uuid",
    "toUserId": "uuid",
    "stars": 5,
    "review": "Excellent quality tomatoes, very fresh!",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User Ratings
```http
GET /api/trust-rating/user/:userId?limit=50
```

### Get Reputation Profile
```http
GET /api/trust-rating/profile/:userId
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Farmer",
      "email": "farmer@example.com",
      "role": "FARMER",
      "reputationScore": 4.8,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "reputationScore": 4.8,
    "totalRatings": 25,
    "recentRatings": [...],
    "ratingDistribution": {
      "fiveStar": 20,
      "fourStar": 4,
      "threeStar": 1,
      "twoStar": 0,
      "oneStar": 0
    }
  }
}
```

### Get Average Rating
```http
GET /api/trust-rating/average/:userId
```

### Get Top Rated Users
```http
GET /api/trust-rating/top?limit=10
```

### Get Reputation Score
```http
GET /api/trust-rating/score/:userId
```

---

## 7. Notification Service

### Create Notification
```http
POST /notifications
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "ORDER",
  "title": "New Order Received",
  "message": "You have received a new order for 50 kg of tomatoes",
  "metadata": {
    "orderId": "uuid",
    "productName": "Tomatoes"
  }
}
```

### Get Notifications
```http
GET /notifications?unreadOnly=true&page=1&limit=20
Authorization: Bearer <access_token>
```

### Mark as Read
```http
PATCH /notifications/:id/read
Authorization: Bearer <access_token>
```

### Update Preferences
```http
PATCH /notifications/preferences
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "orderNotifications": true,
  "messageNotifications": true,
  "paymentNotifications": true,
  "qualityNotifications": true,
  "ratingNotifications": true,
  "systemNotifications": true
}
```

### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <access_token>
```

---

## 8. Analytics Service

### Get Dashboard Analytics
```http
GET /analytics/dashboard?dateRange=30days
Authorization: Bearer <access_token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "totalProducts": 15,
    "activeProducts": 12,
    "totalOrders": 45,
    "completedOrders": 40,
    "pendingOrders": 5,
    "totalRevenue": 45000.00,
    "successRate": 88.9,
    "recentOrders": [...],
    "topSellingProducts": [...],
    "ordersByStatus": {
      "PENDING": 5,
      "ACCEPTED": 10,
      "IN_TRANSIT": 8,
      "DELIVERED": 22
    }
  }
}
```

### Get Revenue Analytics
```http
GET /analytics/revenue?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <access_token>
```

### Get Order Analytics
```http
GET /analytics/orders?dateRange=30days
Authorization: Bearer <access_token>
```

### Get Product Analytics
```http
GET /analytics/products?limit=10
Authorization: Bearer <access_token>
```

---

## 9. Favorites Service

### Add to Favorites
```http
POST /api/favorites
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "farmerId": "uuid",
  "notes": "Great quality tomatoes, reliable seller"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "buyerId": "uuid",
    "farmerId": "uuid",
    "farmer": {
      "id": "uuid",
      "name": "John Farmer",
      "email": "farmer@example.com",
      "reputationScore": 4.8,
      "avatarUrl": "https://..."
    },
    "notes": "Great quality tomatoes, reliable seller",
    "recentProducts": [...],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Favorites
```http
GET /api/favorites
Authorization: Bearer <access_token>
```

### Update Favorite Notes
```http
PATCH /api/favorites/:farmerId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "notes": "Updated notes about this farmer"
}
```

### Remove from Favorites
```http
DELETE /api/favorites/:farmerId
Authorization: Bearer <access_token>
```

### Check if Favorited
```http
GET /api/favorites/check/:farmerId
Authorization: Bearer <access_token>
```

### Get Favorite Count
```http
GET /api/favorites/count/:farmerId
```

### Get Top Farmers
```http
GET /api/favorites/top?limit=10
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Payment**: 10 requests per 15 minutes

---

## WebSocket Events

Real-time events are emitted via Socket.IO:

### Product Events
- `product:created` - New crop added
- `product:updated` - Crop details changed
- `product:deleted` - Crop removed
- `price:updated` - Price changed

### Order Events
- `order:new` - New order placed
- `order:status:updated` - Order status changed
- `order:location:updated` - Tracking location updated
- `order:cancelled` - Order cancelled

### Chat Events
- `message:new` - New message received
- `message:typing` - User is typing
- `message:read` - Message read
- `user:online` - User came online
- `user:offline` - User went offline

### Payment Events
- `payment:initiated` - Payment started
- `payment:success` - Payment completed
- `payment:failed` - Payment failed
- `invoice:generated` - Invoice created

### Notification Events
- `notification:new` - New notification
- `notification:read` - Notification read

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "SecurePass123!",
    "name": "John Farmer",
    "role": "FARMER"
  }'
```

### Create Crop
```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tomatoes",
    "category": "vegetable",
    "price": 45.50,
    "quantity": 100,
    "unit": "kg"
  }'
```

### Get Crops
```bash
curl -X GET "http://localhost:3000/products?category=vegetable&minPrice=40&maxPrice=50" \
  -H "Authorization: Bearer <token>"
```

---

## Postman Collection

A complete Postman collection is available at:
```
./postman/Phase2-Backend-Services.postman_collection.json
```

Import this collection into Postman to test all endpoints.

---

## Environment Variables

Required environment variables for Phase 2 services:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/farmguard

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRY=7d

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Environment
NODE_ENV=development
```

---

## Support

For issues or questions about the Phase 2 API:
1. Check the error message and error code
2. Review the API documentation above
3. Check the server logs for detailed error information
4. Contact the development team
