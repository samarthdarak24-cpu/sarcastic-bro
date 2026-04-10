# Demo Data Successfully Added! 🎉

The database has been populated with realistic demo data to showcase all features.

## What Was Added

### Users (8 total)
- **1 FPO Admin**: fpo@test.com (password: Farmer123)
- **5 Farmers**: farmer@test.com, ganesh@test.com, prakash@test.com, dmore@test.com, ashok@test.com
- **2 Buyers**: buyer@test.com, nutrigrain@test.com

### Orders (2 orders with full tracking)

#### Order 1: DELIVERED ✅
- **Product**: Wheat (1300kg)
- **Buyer**: Agarwal Agro Industries
- **Status**: Delivered 2 days ago
- **Escrow**: Released
- **Tracking Events**: 7 events from placement to delivery
- **Delivery Proof**: Photos attached
- **Amount**: ₹35,594

#### Order 2: IN_TRANSIT 🚚
- **Product**: Soybean (900kg)
- **Buyer**: NutriGrain Pvt Ltd
- **Status**: Currently in transit at Indapur Hub
- **Escrow**: Held (₹45,603)
- **Tracking Events**: 5 events, last update 3 hours ago
- **Expected Delivery**: In 2 days

### Wallet Transactions
- **Buyer Wallet**: ₹500,000 initial deposit
- **Farmer Earnings**: Payments from completed orders
- **Escrow Transactions**: 1 released, 1 held

### Analytics Data
- **Market Prices**: 4,320 historical price records (6 months × 6 crops × 4 districts)
- **Farmer Earnings**: Revenue from completed orders
- **Order Statistics**: Active orders, pending payments, revenue trends

### Other Data
- **5 Farms**: Across Nanded, Latur, Pune, Nashik districts
- **10 Crops**: Wheat, Soybean, Cotton, Onion, Tomato, Rice
- **3 Aggregated Lots**: Wheat, Soybean, Onion
- **5 Quality Certificates**: Lab tests, FPO verified, Organic, Government
- **6 Chat Messages**: Between buyers and FPO
- **2 FPO Link Requests**: 1 pending, 1 approved
- **3 Logistics Tracking**: Full tracking with events

## How to View the Data

### 1. Login as Farmer
```
Email: farmer@test.com
Password: Farmer123
```

Then navigate to:
- **My Orders** → See your orders with tracking
- **Wallet** → See earnings and transactions
- **Analytics** → See revenue charts and statistics

### 2. Login as Buyer
```
Email: buyer@test.com
Password: Farmer123
```

Then navigate to:
- **My Orders** → See purchased orders
- **Wallet** → See balance and transactions
- **Analytics** → See purchase analytics

### 3. Login as FPO
```
Email: fpo@test.com
Password: Farmer123
```

Then navigate to:
- **My Orders** → Manage all FPO orders
- **Wallet** → See commission and payouts
- **Analytics** → See aggregation analytics

## Features Now Visible

### Order Tracking Page
- ✅ Order list with status badges
- ✅ Real-time tracking timeline
- ✅ Location updates with coordinates
- ✅ Delivery proof photos
- ✅ Escrow status indicators
- ✅ Estimated delivery dates

### Wallet Page
- ✅ Current balance display
- ✅ Transaction history
- ✅ Add funds (Buyer)
- ✅ Withdraw funds (Farmer/FPO)
- ✅ Escrow transactions
- ✅ Balance after each transaction

### Analytics Page
- ✅ Revenue charts (Line chart)
- ✅ Top products (Bar chart)
- ✅ Order distribution (Pie chart)
- ✅ Time range filters (7d, 30d, 90d, 1y)
- ✅ Key metrics cards
- ✅ Growth indicators

## Database Details

**Database**: PostgreSQL (running in Docker)
**Container**: odop-postgres
**Database Name**: agrivoice
**Connection**: localhost:5432

## Seed Script Location

`apps/api/prisma/seed.ts`

To re-seed the database:
```bash
cd apps/api
npx tsx prisma/seed.ts
```

## Next Steps

1. **Refresh your browser** to see the new data
2. **Login as farmer** (farmer@test.com / Farmer123)
3. **Click "My Orders"** in the sidebar
4. **Click on an order** to see full tracking details
5. **Navigate to Wallet** to see transactions
6. **Navigate to Analytics** to see charts

## Troubleshooting

If you don't see the data:
1. Make sure the API server is running (`npm run dev` in apps/api)
2. Check that PostgreSQL container is running (`docker ps`)
3. Clear browser cache and refresh
4. Check browser console for errors
5. Verify you're logged in as the correct user

## Password for All Users

All demo users have the same password for easy testing:
```
Password: Farmer123
```

Enjoy exploring the features! 🚀
