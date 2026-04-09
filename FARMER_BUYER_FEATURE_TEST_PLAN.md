# 🧪 FARMER-BUYER FEATURE TEST PLAN
## Complete End-to-End Testing with Valid Data

**Date:** April 9, 2026  
**Status:** Ready for Testing  
**Test Environment:** Development (localhost)

---

## 🎯 TEST OBJECTIVES

1. Verify all farmer features work with real-time updates
2. Verify all buyer features work with real-time updates
3. Test farmer-to-buyer interactions end-to-end
4. Validate data flow from frontend → backend → database → Socket.IO
5. Ensure smooth user experience with valid test data

---

## 📋 PRE-TEST SETUP

### 1. Database Setup ✅

**Seed Database with Test Data:**
```bash
cd apps/api
npm run db:push
npm run db:seed
```

**Test Users Created:**
- **Farmer:** farmer@test.com / Password: Farmer123
- **Buyer:** buyer@test.com / Password: Buyer123

**Test Data Includes:**
- 5 Farmers + 5 Buyers
- 22 Products (Banarasi Silk, Turmeric, Saffron, Mangoes, etc.)
- 15 Orders (various statuses)
- 12 Proposals (pending, accepted, rejected)
- 20 Reviews
- 5 Tenders with applications
- Chat conversations
- Contracts, Sample requests, Logistics

### 2. Start Services ✅

**Terminal 1 - Backend API:**
```bash
cd apps/api
npm run dev
# Should run on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
# Should run on http://localhost:3000
```

**Terminal 3 - Prisma Studio (Optional):**
```bash
cd apps/api
npm run db:studio
# Opens on http://localhost:5555
```

---

## 🧪 TEST SCENARIOS

### SCENARIO 1: FARMER PRODUCT MANAGEMENT ✅

**Feature:** SmartProductHub with Real-Time Updates

**Test Steps:**
1. Login as farmer (farmer@test.com / Farmer123)
2. Navigate to Dashboard → Product Hub
3. Click "Add New Product"
4. Fill form with valid data:
   ```
   Name: Premium Organic Wheat
   Category: Grains
   Price: 45
   Unit: kg
   Quantity: 5000
   Description: Organically grown wheat from Punjab
   District: Amritsar
   State: Punjab
   Quality Grade: A
   ```
5. Submit form
6. **Expected Result:**
   - Product appears instantly in list (no page refresh)
   - Toast notification: "Product created successfully"
   - Socket.IO event `product:created` emitted
   - Product visible to all buyers immediately

**Real-Time Verification:**
- Open buyer dashboard in another browser
- Product should appear in marketplace instantly
- No page refresh needed

**Status:** ⏳ Pending Test

---

### SCENARIO 2: BUYER PLACES ORDER ✅

**Feature:** Order Creation with Real-Time Farmer Notification

**Test Steps:**
1. Login as buyer (buyer@test.com / Buyer123)
2. Navigate to Marketplace
3. Search for "Banarasi Silk Saree"
4. Click on product
5. Click "Place Order"
6. Fill order form:
   ```
   Quantity: 10
   Shipping Address: 123 Main St, Delhi, Delhi - 110001
   Notes: Need before Diwali festival
   ```
7. Submit order
8. **Expected Result:**
   - Order created successfully
   - Buyer sees order in "My Orders"
   - Socket.IO event `order:new` emitted to farmer
   - Farmer receives instant notification

**Real-Time Verification:**
- Keep farmer dashboard open in another browser
- When buyer places order, farmer should see:
  - Toast notification: "New order received!"
  - Order appears in OrderControlCenter instantly
  - No page refresh needed

**Status:** ⏳ Pending Test

---

### SCENARIO 3: FARMER UPDATES ORDER STATUS ✅

**Feature:** Order Status Updates with Real-Time Buyer Notification

**Test Steps:**
1. Login as farmer (farmer@test.com / Farmer123)
2. Navigate to Dashboard → Order Control
3. Find pending order
4. Click "Confirm Order"
5. **Expected Result:**
   - Order status changes to CONFIRMED
   - Socket.IO event `order:status:updated` emitted
   - Buyer receives instant notification

**Real-Time Verification:**
- Keep buyer dashboard open in another browser
- When farmer confirms order, buyer should see:
  - Toast notification: "Order confirmed"
  - Order status updates instantly
  - No page refresh needed

**Test All Status Transitions:**
- PENDING → CONFIRMED ✅
- CONFIRMED → PROCESSING ✅
- PROCESSING → SHIPPED ✅
- SHIPPED → DELIVERED ✅

**Status:** ⏳ Pending Test

---

### SCENARIO 4: REAL-TIME CHAT MESSAGING ✅

**Feature:** AgriChat with Typing Indicators

**Test Steps:**
1. Login as farmer in Browser 1
2. Login as buyer in Browser 2
3. Buyer navigates to Chat → Select farmer
4. Buyer types message: "Hello, I'm interested in your products"
5. **Expected Result:**
   - Farmer sees "Buyer is typing..." indicator
   - Message appears instantly in farmer's chat
   - Socket.IO event `message:new` emitted

**Test Bidirectional Chat:**
1. Farmer replies: "Thank you for your interest!"
2. Buyer receives message instantly
3. Both see message history in real-time

**Status:** ⏳ Pending Test

---

### SCENARIO 5: PROPOSAL NEGOTIATION ✅

**Feature:** Buyer Sends Proposal to Farmer

**Test Steps:**
1. Login as buyer
2. Navigate to Marketplace → Select product
3. Click "Send Proposal"
4. Fill proposal form:
   ```
   Quantity: 100
   Price Per Unit: 40 (10% discount)
   Message: Bulk order for retail chain
   Valid Until: 15 days
   ```
5. Submit proposal
6. **Expected Result:**
   - Proposal created
   - Socket.IO event `proposal:new` emitted
   - Farmer receives instant notification

**Farmer Response:**
1. Login as farmer
2. Navigate to Proposals
3. Review proposal
4. Click "Accept" or "Counter Offer"
5. **Expected Result:**
   - Buyer receives instant notification
   - Proposal status updates in real-time

**Status:** ⏳ Pending Test

---

### SCENARIO 6: LIVE MANDI PRICE UPDATES ✅

**Feature:** Real-Time Market Price Ticker

**Test Steps:**
1. Login as farmer
2. Navigate to Dashboard → Live Mandi Feed
3. Observe price updates
4. **Expected Result:**
   - Prices update every 2.8 seconds
   - Trend indicators (up/down arrows) change
   - Colors change based on price movement
   - No page refresh needed

**Verification:**
- Watch for at least 30 seconds
- Verify prices are changing
- Check trend indicators update
- Verify smooth animations

**Status:** ⏳ Pending Test

---

### SCENARIO 7: TENDER PARTICIPATION ✅

**Feature:** Farmer Applies to Tender

**Test Steps:**
1. Login as farmer
2. Navigate to Tenders → Marketplace
3. Find open tender: "Bulk Organic Turmeric Supply"
4. Click "Apply"
5. Fill application:
   ```
   Price Offer: 280 (per kg)
   Message: We can supply 5000kg of premium organic turmeric
   ```
6. Submit application
7. **Expected Result:**
   - Application submitted
   - Socket.IO event `tender-update` emitted
   - Buyer (tender creator) receives notification

**Status:** ⏳ Pending Test

---

### SCENARIO 8: QUALITY SCAN WITH AI ✅

**Feature:** AI-Powered Quality Grading

**Test Steps:**
1. Login as farmer
2. Navigate to Dashboard → AI Quality Shield
3. Upload product image
4. **Expected Result:**
   - AI analyzes image
   - Quality grade assigned (A+, A, B+, B)
   - Score displayed (0-100)
   - Socket.IO event `quality-scan-complete` emitted
   - Certificate generated

**Status:** ⏳ Pending Test

---

### SCENARIO 9: PAYMENT & ESCROW ✅

**Feature:** Secure Payment with Escrow

**Test Steps:**
1. Buyer places order
2. Navigate to Payments
3. Initiate payment
4. **Expected Result:**
   - Payment held in escrow
   - Socket.IO event `payment-update` emitted
   - Both parties notified

**Release Payment:**
1. Farmer ships order
2. Buyer confirms delivery
3. Payment released from escrow
4. **Expected Result:**
   - Socket.IO event `escrow-update` emitted
   - Farmer receives payment notification

**Status:** ⏳ Pending Test

---

### SCENARIO 10: SHIPMENT TRACKING ✅

**Feature:** Real-Time GPS Tracking

**Test Steps:**
1. Farmer marks order as shipped
2. Enter tracking details:
   ```
   Tracking Number: ODOP123456
   Carrier: BlueDart
   ```
3. **Expected Result:**
   - Socket.IO event `shipment-location-update` emitted
   - Buyer can track shipment in real-time

**Status:** ⏳ Pending Test

---

### SCENARIO 11: REVIEW & RATING ✅

**Feature:** Post-Delivery Review System

**Test Steps:**
1. Order status: DELIVERED
2. Buyer navigates to Orders → Select delivered order
3. Click "Leave Review"
4. Fill review:
   ```
   Rating: 5 stars
   Comment: Excellent quality! Will order again.
   ```
5. Submit review
6. **Expected Result:**
   - Review saved
   - Socket.IO event `review:new` emitted
   - Farmer receives notification
   - Farmer's reputation score updates

**Status:** ⏳ Pending Test

---

### SCENARIO 12: BULK ORDER DISCOUNT ✅

**Feature:** Buyer Bulk Order System

**Test Steps:**
1. Login as buyer
2. Navigate to Bulk Orders
3. Select product
4. Enter quantity: 1000 kg
5. **Expected Result:**
   - Automatic discount calculation
   - Bulk pricing displayed
   - Multiple suppliers matched

**Status:** ⏳ Pending Test

---

### SCENARIO 13: SAMPLE REQUEST ✅

**Feature:** Buyer Requests Product Sample

**Test Steps:**
1. Login as buyer
2. Navigate to product page
3. Click "Request Sample"
4. Fill form:
   ```
   Quantity: 2
   Shipping Address: Mumbai office
   Message: Need to evaluate quality
   ```
5. Submit request
6. **Expected Result:**
   - Socket.IO event `sample:request` emitted
   - Farmer receives notification

**Farmer Approval:**
1. Farmer approves sample request
2. **Expected Result:**
   - Socket.IO event `sample:approved` emitted
   - Buyer receives notification

**Status:** ⏳ Pending Test

---

### SCENARIO 14: BLOCKCHAIN TRACEABILITY ✅

**Feature:** Supply Chain Transparency

**Test Steps:**
1. Farmer creates product
2. Order placed and shipped
3. Navigate to Blockchain Trace
4. **Expected Result:**
   - Harvest event recorded
   - Logistics event recorded
   - Delivery event recorded
   - Blockchain hash generated
   - Socket.IO event `blockchain:tx-confirmed` emitted

**Status:** ⏳ Pending Test

---

### SCENARIO 15: NOTIFICATIONS CENTER ✅

**Feature:** Real-Time Notification System

**Test Steps:**
1. Login as farmer
2. Perform various actions (create product, receive order, etc.)
3. Check notification bell icon
4. **Expected Result:**
   - Unread count updates in real-time
   - Notifications appear instantly
   - Click notification navigates to relevant page

**Notification Types to Test:**
- ORDER: New order received ✅
- MESSAGE: New chat message ✅
- PROPOSAL: New proposal received ✅
- TENDER: Tender application status ✅
- PAYMENT: Payment received ✅
- QUALITY: Quality scan complete ✅
- SYSTEM: Platform announcements ✅

**Status:** ⏳ Pending Test

---

## 🔄 REAL-TIME VERIFICATION CHECKLIST

For each scenario, verify:

- [ ] No page refresh required
- [ ] Toast notifications appear
- [ ] UI updates instantly
- [ ] Socket.IO events logged in console
- [ ] Data persists in database
- [ ] Both parties see updates simultaneously
- [ ] Animations are smooth
- [ ] No errors in console
- [ ] Network tab shows WebSocket connection
- [ ] Reconnection works after disconnect

---

## 📊 TEST DATA VALIDATION

### Valid Test Data Examples:

**Product Data:**
```json
{
  "name": "Premium Basmati Rice",
  "category": "Grains",
  "price": 120,
  "unit": "kg",
  "quantity": 5000,
  "description": "Extra-long grain aged Basmati",
  "district": "Dehradun",
  "state": "Uttarakhand",
  "qualityGrade": "A"
}
```

**Order Data:**
```json
{
  "productId": "uuid-here",
  "quantity": 100,
  "shippingAddress": "123 Main St, Delhi - 110001",
  "notes": "Urgent delivery needed"
}
```

**Proposal Data:**
```json
{
  "productId": "uuid-here",
  "quantity": 500,
  "pricePerUnit": 110,
  "message": "Bulk order for export",
  "validUntil": "2026-05-01"
}
```

**Message Data:**
```json
{
  "conversationId": "uuid-here",
  "content": "Hello, interested in your products",
  "type": "text"
}
```

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: Socket.IO Not Connecting
**Solution:**
- Check backend is running on port 3001
- Verify JWT token in localStorage
- Check CORS configuration
- Inspect Network tab for WebSocket connection

### Issue 2: Real-Time Updates Not Working
**Solution:**
- Check Socket.IO event names match
- Verify `getSocketService()` is called in backend
- Check user is in correct room
- Verify frontend hooks are properly mounted

### Issue 3: Database Connection Error
**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npm run db:push` to sync schema

### Issue 4: Build Errors
**Solution:**
- Clear Next.js cache: `rm -rf apps/web/.next`
- Check import statements (named vs default)
- Verify all dependencies installed

---

## 📈 SUCCESS CRITERIA

### Feature Completeness: 100%
- ✅ All 15 scenarios pass
- ✅ Real-time updates work for all features
- ✅ No console errors
- ✅ Data persists correctly
- ✅ UI is responsive and smooth

### Performance Metrics:
- Socket.IO connection time: <500ms
- Event latency: <100ms
- Page load time: <2s
- No memory leaks
- Smooth animations (60fps)

### User Experience:
- Intuitive navigation
- Clear feedback on actions
- Helpful error messages
- Responsive design works on mobile
- Accessibility compliant

---

## 📝 TEST EXECUTION LOG

### Test Session 1: [Date/Time]

| Scenario | Status | Notes | Issues |
|----------|--------|-------|--------|
| 1. Product Management | ⏳ | | |
| 2. Order Creation | ⏳ | | |
| 3. Order Status Update | ⏳ | | |
| 4. Chat Messaging | ⏳ | | |
| 5. Proposal Negotiation | ⏳ | | |
| 6. Live Prices | ⏳ | | |
| 7. Tender Participation | ⏳ | | |
| 8. Quality Scan | ⏳ | | |
| 9. Payment & Escrow | ⏳ | | |
| 10. Shipment Tracking | ⏳ | | |
| 11. Review & Rating | ⏳ | | |
| 12. Bulk Orders | ⏳ | | |
| 13. Sample Request | ⏳ | | |
| 14. Blockchain Trace | ⏳ | | |
| 15. Notifications | ⏳ | | |

**Legend:**
- ⏳ Pending
- ✅ Passed
- ❌ Failed
- ⚠️ Partial

---

## 🎯 NEXT STEPS

1. **Run Database Seed:**
   ```bash
   cd apps/api && npm run db:seed
   ```

2. **Start Both Services:**
   ```bash
   # Terminal 1
   cd apps/api && npm run dev
   
   # Terminal 2
   cd apps/web && npm run dev
   ```

3. **Execute Test Scenarios:**
   - Follow each scenario step-by-step
   - Document results in test log
   - Take screenshots of issues
   - Note any unexpected behavior

4. **Report Findings:**
   - Create issue tickets for bugs
   - Document successful flows
   - Suggest improvements

---

**Test Plan Created:** April 9, 2026  
**Ready for Execution:** ✅ YES  
**Estimated Time:** 2-3 hours for complete testing  
**Status:** All imports fixed, cache cleared, ready to test
