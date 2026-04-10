# AgriTrust Frontend Implementation Guide

## ✅ Backend Status: COMPLETE & RUNNING

**Backend Server**: http://localhost:3001 ✅
**Database**: SQLite with 4,320+ records ✅
**Socket.io**: Real-time ready ✅

## 🎯 Frontend Implementation Roadmap

The backend is fully functional with all APIs ready. The frontend structure exists but needs dashboard pages implemented.

### Current Frontend Structure

```
apps/web/src/
├── app/
│   ├── farmer/     # Farmer dashboard pages (needs implementation)
│   ├── buyer/      # Buyer dashboard pages (needs implementation)
│   ├── fpo/        # FPO dashboard pages (needs implementation)
│   ├── login/      # Login page (exists)
│   └── register/   # Register page (exists)
├── components/     # Shared UI components
├── services/       # API clients (auth.ts exists)
└── hooks/          # Custom hooks
```

## 📋 Implementation Checklist

### Phase 1: Core API Services (Priority: HIGH)

Create API service files to connect to backend:

#### 1. `apps/web/src/services/farmer.service.ts`
```typescript
// POST /api/farmer/farm - Add farm
// POST /api/farmer/crop - List crop
// GET /api/farmer/crops - Get my crops
// GET /api/farmer/orders - Get orders
// GET /api/farmer/earnings - Get earnings
// GET /api/farmer/market-prices - Get market prices
// GET /api/farmer/dashboard-stats - Get stats
```

#### 2. `apps/web/src/services/buyer.service.ts`
```typescript
// GET /api/buyer/marketplace - Browse marketplace
// POST /api/buyer/order - Place order
// GET /api/buyer/orders - Get my orders
// POST /api/buyer/wallet/add - Add funds
// GET /api/buyer/wallet - Get wallet
// POST /api/buyer/delivery/approve/:orderId - Approve delivery
// GET /api/buyer/dashboard-stats - Get stats
```

#### 3. `apps/web/src/services/fpo.service.ts`
```typescript
// POST /api/fpo/register - Register FPO
// POST /api/fpo/farmer/onboard - Onboard farmer
// GET /api/fpo/farmers - Get farmers
// POST /api/fpo/crop/list - List crop for farmer
// POST /api/fpo/aggregate - Create aggregated lot
// POST /api/fpo/certificate/upload - Upload certificate
// GET /api/fpo/orders - Get orders
// GET /api/fpo/dashboard-stats - Get stats
// GET /api/fpo/crops - Get all crops
// GET /api/fpo/lots - Get aggregated lots
```

#### 4. `apps/web/src/services/market.service.ts`
```typescript
// GET /api/market-prices - Get price history
// GET /api/market-prices/summary - Get current averages
// GET /api/market-prices/crops - Get crop list
// GET /api/market-prices/districts - Get district list
```

#### 5. `apps/web/src/services/chat.service.ts`
```typescript
// GET /api/chat/messages/:userId - Get messages
// POST /api/chat/send - Send message
// GET /api/chat/contacts - Get contacts
```

### Phase 2: Farmer Dashboard Pages (Priority: HIGH)

#### 1. `/farmer/page.tsx` - Home Dashboard
- Welcome card with farmer name
- KYC status indicator
- Quick stats: Total crops, Total quantity, Earnings, Pending orders
- Quick action buttons: Add Crop, View Market Prices, Check Orders

#### 2. `/farmer/crops/page.tsx` - My Crops
- Table showing all listed crops
- Columns: Crop Name, Variety, Grade, Quantity, Price/kg, Status, Actions
- "Add New Crop" button → opens modal/form
- Form fields: cropName, category, variety, quantity, pricePerKg, grade, qualityCert (file upload)

#### 3. `/farmer/market-prices/page.tsx` - Market Price Dashboard
- Dropdown to select crop
- Dropdown to select district
- Line chart (Recharts) showing 6 months price history
- Current average price card
- "Your listed price" comparison with green/red indicator

#### 4. `/farmer/orders/page.tsx` - Order Tracking
- Table with order status stepper
- Columns: Order ID, Crop, Quantity, Amount, Status, Buyer
- Status badges: PENDING → CONFIRMED → IN_TRANSIT → DELIVERED
- Real-time updates via Socket.io

#### 5. `/farmer/earnings/page.tsx` - Earnings Dashboard
- Total revenue card
- Total platform fees card
- Wallet balance card
- Monthly bar chart (Recharts)
- Transaction history table

#### 6. `/farmer/profile/page.tsx` - Profile & Farm
- User profile form
- Farm details form with photo upload
- Bank account details
- Language preference selector

### Phase 3: Buyer Dashboard Pages (Priority: HIGH)

#### 1. `/buyer/page.tsx` - Home Dashboard
- Welcome card
- Quick stats: Total orders, Total spent, Pending orders, Wallet balance
- Recent orders list

#### 2. `/buyer/marketplace/page.tsx` - Marketplace
- Filter sidebar: Crop type, Grade (A/B/C), District, Min quantity, Max price
- Grid of cards showing:
  - Aggregated lots (with FPO name)
  - Individual crops (with farmer name)
- Each card: Photo, Grade badge, Quantity, Price/kg, "View Certificate", "Buy Now"
- "Buy Now" → Modal with quantity input, delivery address, total calculation
- Razorpay payment button (can be simulated)

#### 3. `/buyer/orders/page.tsx` - My Orders
- Timeline view for each order
- Status: Payment Held → Shipped → Delivered
- "Approve Delivery" button (triggers escrow release)
- Order details: Crop, Quantity, Amount, Seller, Delivery address

#### 4. `/buyer/wallet/page.tsx` - Wallet
- Balance card (large display)
- "Add Funds" button → Razorpay modal (can be simulated)
- Transaction log table
- Filters: Date range, Transaction type

#### 5. `/buyer/chat/page.tsx` - Chat
- Contact list (FPOs/Farmers you've messaged)
- Chat window with real-time messages (Socket.io)
- Message input with send button
- Unread message indicators

### Phase 4: FPO Dashboard Pages (Priority: HIGH)

#### 1. `/fpo/page.tsx` - Admin Home
- Stats cards:
  - Total farmers
  - Total listed quantity
  - Pending orders
  - Held escrow amount
- Recent activity feed

#### 2. `/fpo/farmers/page.tsx` - Farmer Management
- "Onboard New Farmer" button → Form modal
- Form: name, phone, Aadhaar, bank details, farm photos
- Table: Farmer name, Phone, Crops count, Earnings, KYC status
- Click row → View farmer details

#### 3. `/fpo/crops/page.tsx` - Crop Listings
- "List Crop for Farmer" button → Form
- Dropdown to select farmer
- Crop form: cropName, category, variety, quantity, pricePerKg, grade
- Table showing all crops under FPO

#### 4. `/fpo/aggregate/page.tsx` - Bulk Aggregation Engine
- Multi-select table of crops (same type/grade)
- Shows: Farmer, Crop, Quantity, Price
- "Create Aggregated Lot" button
- Preview: Combined quantity, Weighted avg price
- Confirmation → Creates AggregatedLot

#### 5. `/fpo/marketplace/page.tsx` - Marketplace Listing
- List of aggregated lots
- "List on Marketplace" button
- Upload quality certificate
- Set final price

#### 6. `/fpo/orders/page.tsx` - Order Management
- Table of incoming orders
- Columns: Order ID, Buyer, Crop/Lot, Quantity, Amount, Status
- "Mark as Dispatched" button → Updates status to IN_TRANSIT
- Real-time notifications

#### 7. `/fpo/payouts/page.tsx` - Escrow Payout Distribution
- List of delivered orders
- Click order → Show payout breakdown
- Table: Farmer name, Crop contribution, Share amount, Platform fee
- "Trigger Payout" button (simulates bank transfer)

#### 8. `/fpo/certificates/page.tsx` - Quality Verification
- Upload certificate for crop/lot
- Mark as FPO-verified
- Optional: AI quality score (can be mocked)

### Phase 5: Shared Components (Priority: MEDIUM)

#### 1. `components/ui/` - shadcn/ui components
- Already exists, use as needed

#### 2. `components/dashboard/StatsCard.tsx`
- Reusable stats card component
- Props: title, value, icon, trend

#### 3. `components/dashboard/OrderStatusStepper.tsx`
- Visual stepper for order status
- Props: currentStatus

#### 4. `components/marketplace/ProductCard.tsx`
- Card for crop/lot display
- Props: item, onBuyClick, onViewCertificate

#### 5. `components/chat/ChatWindow.tsx`
- Real-time chat component
- Uses Socket.io

#### 6. `components/forms/CropForm.tsx`
- Reusable crop listing form
- File upload for quality certificate

### Phase 6: Real-time Features (Priority: MEDIUM)

#### 1. `hooks/useSocket.ts`
- Socket.io connection hook
- Auto-connect with JWT token
- Event listeners for notifications, messages, order updates

#### 2. `hooks/useNotifications.ts`
- Toast notifications
- Real-time notification display

#### 3. `components/layout/NotificationBell.tsx`
- Bell icon with unread count
- Dropdown showing recent notifications

### Phase 7: i18n Multi-language (Priority: LOW)

#### 1. `i18n/en.json` - English translations
```json
{
  "nav": {
    "home": "Home",
    "crops": "My Crops",
    "orders": "Orders",
    "earnings": "Earnings",
    "marketplace": "Marketplace",
    "wallet": "Wallet"
  },
  "common": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete"
  }
}
```

#### 2. `i18n/hi.json` - Hindi translations
```json
{
  "nav": {
    "home": "होम",
    "crops": "मेरी फसलें",
    "orders": "ऑर्डर",
    "earnings": "कमाई",
    "marketplace": "बाज़ार",
    "wallet": "वॉलेट"
  }
}
```

#### 3. `i18n/mr.json` - Marathi translations
```json
{
  "nav": {
    "home": "मुख्यपृष्ठ",
    "crops": "माझी पिके",
    "orders": "ऑर्डर",
    "earnings": "कमाई",
    "marketplace": "बाजार",
    "wallet": "वॉलेट"
  }
}
```

#### 4. Language switcher in navbar
- Dropdown: EN | हिं | मरा
- Saves preference to user profile

## 🚀 Quick Start Implementation

### Step 1: Create API Services (30 minutes)
Create the 5 service files listed in Phase 1. Use axios with the existing API config.

### Step 2: Implement Farmer Dashboard (2 hours)
Start with the home page, then crops, market prices, orders, earnings.

### Step 3: Implement Buyer Dashboard (2 hours)
Marketplace is the most complex. Start with home, then marketplace, orders, wallet.

### Step 4: Implement FPO Dashboard (3 hours)
Most complex dashboard. Start with home, farmers, crops, then aggregation.

### Step 5: Add Real-time Features (1 hour)
Socket.io connection, notifications, chat.

### Step 6: Polish & i18n (1 hour)
Add translations, test all flows.

## 📊 Data Flow Examples

### Example 1: Farmer Lists a Crop
1. Farmer fills form in `/farmer/crops`
2. Frontend calls `farmerService.createCrop(data)`
3. Backend POST `/api/farmer/crop` creates crop in DB
4. Socket.io emits `new-crop-listed` event
5. Buyers see real-time notification

### Example 2: Buyer Places Order
1. Buyer clicks "Buy Now" on marketplace
2. Frontend calls `buyerService.createOrder(data)`
3. Backend POST `/api/buyer/order`:
   - Checks wallet balance
   - Creates order
   - Creates escrow transaction (HELD)
   - Deducts from wallet
4. Socket.io notifies seller
5. Order appears in buyer's orders page

### Example 3: FPO Creates Aggregated Lot
1. FPO selects multiple crops in `/fpo/aggregate`
2. Frontend calls `fpoService.createAggregatedLot(cropIds)`
3. Backend POST `/api/fpo/aggregate`:
   - Validates crops (same type/grade)
   - Calculates weighted avg price
   - Creates AggregatedLot
   - Marks crops as aggregated
4. Lot appears in marketplace

### Example 4: Buyer Approves Delivery
1. Buyer clicks "Approve Delivery" in `/buyer/orders`
2. Frontend calls `buyerService.approveDelivery(orderId)`
3. Backend POST `/api/buyer/delivery/approve/:orderId`:
   - Updates order status to DELIVERED
   - Updates escrow status to RELEASED
   - Calculates farmer shares
   - Creates FarmerEarning records
   - Updates farmer wallets
4. Socket.io notifies farmers
5. Farmers see earnings in dashboard

## 🎨 UI/UX Guidelines

### Color Scheme
- Primary: Green (#10b981) - Agriculture theme
- Secondary: Blue (#3b82f6) - Trust theme
- Success: Green (#22c55e)
- Warning: Yellow (#eab308)
- Error: Red (#ef4444)

### Typography
- Headings: font-bold text-2xl
- Body: text-base
- Small: text-sm text-gray-600

### Components
- Use shadcn/ui components (already installed)
- Cards: rounded-lg border shadow-sm
- Buttons: rounded-md with hover effects
- Forms: proper validation and error messages

### Responsive Design
- Mobile-first approach
- Sidebar collapses on mobile
- Tables become scrollable on mobile
- Cards stack vertically on mobile

## 🔧 Development Tips

### 1. Use Existing Components
The project already has shadcn/ui installed. Use components like:
- `Button`, `Card`, `Input`, `Select`, `Table`, `Dialog`, `Tabs`

### 2. API Error Handling
```typescript
try {
  const data = await farmerService.getCrops();
  setCrops(data);
} catch (error) {
  toast.error('Failed to load crops');
  console.error(error);
}
```

### 3. Loading States
```typescript
const [loading, setLoading] = useState(false);
// Show skeleton or spinner while loading
```

### 4. Real-time Updates
```typescript
useEffect(() => {
  socket.on('order-updated', (data) => {
    // Update order in state
  });
  return () => socket.off('order-updated');
}, []);
```

## ✅ Testing Checklist

### Farmer Flow
- [ ] Register as farmer
- [ ] Add farm details
- [ ] List a crop
- [ ] View market prices
- [ ] Check orders
- [ ] View earnings

### Buyer Flow
- [ ] Register as buyer
- [ ] Browse marketplace
- [ ] Add funds to wallet
- [ ] Place an order
- [ ] Track order status
- [ ] Approve delivery
- [ ] Chat with FPO

### FPO Flow
- [ ] Register FPO
- [ ] Onboard a farmer
- [ ] List crop for farmer
- [ ] Create aggregated lot
- [ ] Upload quality certificate
- [ ] Manage orders
- [ ] Distribute payouts

## 📝 Summary

**Backend**: ✅ 100% Complete
- All APIs implemented
- Database seeded with realistic data
- Socket.io configured
- Escrow system working

**Frontend**: 🔄 30% Complete
- Structure exists
- Auth working
- Needs dashboard pages

**Estimated Time to Complete Frontend**: 8-10 hours

**Priority Order**:
1. API Services (30 min)
2. Farmer Dashboard (2 hrs)
3. Buyer Dashboard (2 hrs)
4. FPO Dashboard (3 hrs)
5. Real-time features (1 hr)
6. Polish & i18n (1 hr)

---

**Next Steps**: Start with Phase 1 (API Services) and work through each phase sequentially.
