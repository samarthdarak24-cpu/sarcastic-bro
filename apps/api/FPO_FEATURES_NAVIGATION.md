# FPO Dashboard - Navigation Features

## 🏢 FPO CORE FEATURES (10 Main Features)

### 1. 📊 Dashboard
**Route:** `/fpo/dashboard`
**API Endpoints:**
- GET `/api/fpo/dashboard/overview` - Overview metrics
- GET `/api/fpo/dashboard/stats` - Detailed statistics
- GET `/api/fpo/dashboard/recent-activity` - Recent activity feed

**Features:**
- Total farmers count
- Total products listed
- Aggregated lots count
- Pending verifications
- Active orders
- Total revenue
- Recent activity timeline

---

### 2. 👨‍🌾 Farmer Management
**Route:** `/fpo/farmers`
**API Endpoints:**
- GET `/api/fpo/farmers` - List all farmers
- POST `/api/fpo/farmers` - Add new farmer (offline support)
- GET `/api/fpo/farmers/:id` - Get farmer details
- PUT `/api/fpo/farmers/:id` - Update farmer
- DELETE `/api/fpo/farmers/:id` - Deactivate farmer
- GET `/api/fpo/farmers/:id/products` - Get farmer's products

**Features:**
- Farmer onboarding form
- Farmer list with search/filter
- View farmer details
- Manage farmer status (active/inactive)
- View farmer's product history
- Photo upload support

---

### 3. 📦 Product Management
**Route:** `/fpo/products`
**API Endpoints:**
- GET `/api/fpo/products` - List all products
- POST `/api/fpo/products` - Add product (delegated listing)
- GET `/api/fpo/products/:id` - Get product details
- PUT `/api/fpo/products/:id` - Update product
- DELETE `/api/fpo/products/:id` - Delete product

**Features:**
- Delegated product listing (add on behalf of farmer)
- Product list with filters (status, category, farmer)
- Edit product details
- View product status (LISTED, SOLD, PENDING)

---

### 4. 🔄 Aggregation Engine
**Route:** `/fpo/aggregation`
**API Endpoints:**
- GET `/api/fpo/aggregation/eligible` - Get products eligible for aggregation
- POST `/api/fpo/aggregation/create` - Create aggregated lot
- GET `/api/fpo/aggregation/lots` - List all aggregated lots
- GET `/api/fpo/aggregation/lots/:id` - Get lot details with farmer contributions
- DELETE `/api/fpo/aggregation/lots/:id` - Dissolve aggregated lot

**Features:**
- Smart grouping (same crop + grade + location)
- Combine quantities from multiple farmers
- Calculate weighted average price
- View farmer contribution percentages
- Dissolve lots if needed

---

### 5. ✅ Quality Verification
**Route:** `/fpo/quality`
**API Endpoints:**
- GET `/api/fpo/quality/pending` - Get pending certificates
- POST `/api/fpo/quality/verify/:id` - Verify/reject certificate
- POST `/api/fpo/quality/upload` - Upload certificate
- GET `/api/fpo/quality/certificates` - List all certificates

**Features:**
- View pending quality certificates
- Approve or reject certificates
- Upload quality certificates for products/lots
- View AI quality scores
- Certificate viewer

---

### 6. 🛒 Bulk Listing
**Route:** `/fpo/bulk-listing`
**API Endpoints:**
- POST `/api/fpo/bulk-listing/publish/:lotId` - Publish lot to marketplace
- POST `/api/fpo/bulk-listing/unpublish/:lotId` - Remove from marketplace
- GET `/api/fpo/bulk-listing/published` - Get published lots
- PUT `/api/fpo/bulk-listing/:lotId/price` - Update lot price

**Features:**
- Publish aggregated lots to marketplace
- Unpublish lots
- Update pricing
- View published lots status

---

### 7. 💬 Buyer Chat
**Route:** `/fpo/chat`
**API Endpoints:**
- GET `/api/fpo/chat/conversations` - Get all conversations
- GET `/api/fpo/chat/:buyerId` - Get messages with buyer
- POST `/api/fpo/chat/:buyerId` - Send message to buyer
- GET `/api/fpo/chat/unread/count` - Get unread count
- POST `/api/fpo/chat/:buyerId/mark-read` - Mark as read

**Features:**
- Real-time chat with buyers (Socket.IO)
- Conversation list
- Unread message indicators
- Order-specific chat threads
- Message history

---

### 8. 💰 Escrow & Payouts
**Route:** `/fpo/escrow`
**API Endpoints:**
- GET `/api/fpo/escrow/pending` - Get pending escrow transactions
- POST `/api/fpo/escrow/release/:orderId` - Release payment to farmers
- GET `/api/fpo/escrow/history` - Transaction history
- GET `/api/fpo/escrow/order/:orderId/split` - Get payment split details

**Features:**
- View pending escrow transactions
- Release payments to farmers
- Automatic split based on contribution %
- Payment history
- View farmer-wise payment breakdown
- Platform fee calculation (2%)

---

### 9. 📦 Orders & Tracking
**Route:** `/fpo/orders`
**API Endpoints:**
- GET `/api/fpo/logistics/orders` - Get all orders
- GET `/api/fpo/logistics/orders/:orderId` - Get order details
- POST `/api/fpo/logistics/orders/:orderId/confirm` - Confirm order
- POST `/api/fpo/logistics/orders/:orderId/ship` - Mark as shipped
- POST `/api/fpo/logistics/orders/:orderId/deliver` - Mark as delivered
- GET `/api/fpo/logistics/stats` - Logistics statistics

**Features:**
- Order list with status filters
- Order timeline (Pending → Confirmed → In Transit → Delivered)
- Confirm orders
- Update shipping status
- Mark as delivered
- Logistics statistics

---

### 10. 🚚 Logistics Management
**Route:** `/fpo/logistics`
**API Endpoints:**
- Same as Orders & Tracking (integrated)

**Features:**
- Manage pickup and delivery
- Track shipments
- Update delivery status
- View logistics statistics
- Average delivery time metrics

---

## 📱 ADDITIONAL NAVIGATION ITEMS

### 11. 📊 Analytics & Reports
**Route:** `/fpo/analytics`
**Features:**
- Sales trends
- Product performance
- Farmer performance
- Revenue analytics
- Monthly/yearly reports

---

### 12. ⚙️ Settings
**Route:** `/fpo/settings`
**Features:**
- FPO profile management
- Bank details
- Notification preferences
- User management

---

## 🎨 SIDEBAR NAVIGATION STRUCTURE

```
FPO Dashboard
├── 📊 Dashboard (Overview)
│   └── dashboard
├── 👨‍🌾 Farmers
│   ├── All Farmers (farmers)
│   ├── Add Farmer (add-farmer)
│   └── Farmer Requests (farmer-requests)
├── 📦 Products
│   ├── All Products (products)
│   ├── Add Product (add-product)
│   └── Product Categories (product-categories)
├── 🔄 Aggregation
│   ├── Eligible Products (eligible-products)
│   ├── Create Lot (create-lot)
│   └── Aggregated Lots (aggregated-lots)
├── ✅ Quality Control
│   ├── Pending Verifications (pending-verifications)
│   ├── All Certificates (all-certificates)
│   └── Upload Certificate (upload-certificate)
├── 🛒 Marketplace
│   ├── Published Lots (published-lots)
│   └── Publish New Lot (publish-new-lot)
├── 📦 Orders
│   ├── All Orders (orders)
│   ├── Pending Orders (pending-orders)
│   ├── In Transit (in-transit)
│   └── Delivered (delivered)
├── 💰 Payments
│   ├── Pending Escrow (pending-escrow)
│   ├── Release Payments (release-payments)
│   └── Payment History (payment-history)
├── 💬 Messages
│   ├── All Conversations (conversations)
│   └── Unread Messages (unread-messages)
├── 🚚 Logistics
│   ├── Shipment Tracking (shipment-tracking)
│   └── Delivery Management (delivery-management)
├── 📊 Analytics (analytics)
└── ⚙️ Settings (settings)
```

---

## 🔗 COMPLETE WORKFLOW

1. **Farmer Onboarding** → Add farmers to FPO
2. **Product Listing** → Add products on behalf of farmers
3. **Quality Verification** → Verify quality certificates
4. **Aggregation** → Combine similar products into lots
5. **Bulk Listing** → Publish lots to marketplace
6. **Buyer Communication** → Chat with interested buyers
7. **Order Management** → Confirm and track orders
8. **Logistics** → Manage delivery
9. **Escrow Release** → Distribute payments to farmers
10. **Analytics** → Track performance

---

## 🎯 IMPLEMENTATION STATUS

### Backend (Completed ✅)
- [x] Dashboard Service & Controller
- [x] Farmer Management Service & Controller
- [x] Product Management Service & Controller
- [x] Aggregation Service & Controller
- [x] Quality Verification Service & Controller
- [x] Bulk Listing Service & Controller
- [x] Chat Service & Controller
- [x] Escrow Service & Controller
- [x] Logistics Service & Controller
- [x] FPO Routes Configuration
- [x] FPO Navigation Configuration (`apps/api/src/config/fpo-navigation.ts`) ✨ NEW

### Frontend (To Be Built)
- [ ] Dashboard Page
- [ ] Farmer Management Pages
- [ ] Product Management Pages
- [ ] Aggregation Pages
- [ ] Quality Verification Pages
- [ ] Bulk Listing Pages
- [ ] Chat Interface
- [ ] Escrow Management Pages
- [ ] Order Tracking Pages
- [ ] Logistics Management Pages
- [ ] Analytics Dashboard
- [ ] Settings Page

### Database (Schema Ready ✅)
- [x] FPO Model
- [x] FPOFarmer Model
- [x] Crop Model (with fpoId)
- [x] AggregatedLot Model
- [x] QualityCertificate Model
- [x] Order Model
- [x] EscrowTransaction Model
- [x] Message Model
- [x] FarmerEarning Model

---

## 🚀 NEXT STEPS

1. **Register FPO routes in app.ts**
2. **Create Prisma client file**
3. **Build Frontend Dashboard**
4. **Implement Socket.IO for real-time chat**
5. **Add authentication middleware**
6. **Test all API endpoints**
7. **Deploy and test end-to-end workflow**

---

## 📋 NAVIGATION CONFIGURATION

The FPO navigation structure is now available as a TypeScript configuration file:

**File:** `apps/api/src/config/fpo-navigation.ts`

**Features:**
- Complete navigation tree with all 12 main features
- 30+ sub-navigation items
- Icon mappings (Heroicons)
- Route paths for all pages
- Badge support for dynamic counts (unread messages, pending orders, etc.)
- Quick actions for dashboard
- Status badges for different entities
- Helper functions (`getNavigationByPath`, `getActiveNavigation`)

**Usage Example:**
```typescript
import { fpoNavigation, quickActions, featureStatus } from '@/config/fpo-navigation';

// Get all navigation items
const navItems = fpoNavigation;

// Get navigation by path
const dashboardNav = getNavigationByPath('/fpo/dashboard');

// Get quick actions
const actions = quickActions;

// Get status badge
const orderStatus = featureStatus.order.pending; // { text: 'Pending', color: 'yellow' }
```

**Dynamic Badges:**
- `pendingRequestsCount` - Farmer requests awaiting approval
- `pendingVerificationsCount` - Quality certificates pending verification
- `activeOrdersCount` - Active orders count
- `pendingOrdersCount` - Orders awaiting confirmation
- `pendingEscrowCount` - Payments in escrow
- `unreadCount` - Unread messages count

This configuration can be directly consumed by the frontend React/Next.js application for rendering the sidebar navigation.

