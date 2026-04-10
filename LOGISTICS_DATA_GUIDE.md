# 🚚 Logistics Feature - Data & Testing Guide

## ✅ Database Seeded Successfully

The logistics feature now has **3 complete logistics entries** in the database with different statuses to test all scenarios.

---

## 📊 Logistics Data Summary

### 1. **DELIVERED** Logistics (Completed)
- **Logistics ID**: `afcb2468-d7e2-4af8-a418-eef3cc3c41a6`
- **Tracking Number**: TRK-998877
- **Status**: DELIVERED ✅
- **Carrier**: Marathwada Transport Co.
- **Driver**: Ramesh Kumar (9876543230)
- **Vehicle**: MH-31-AB-1234
- **Route**: Nanded FPO Center → Agarwal Agro Industries, Aurangabad
- **Crop**: Wheat (1300kg)
- **Buyer**: Mahesh Agarwal
- **Events**: 6 tracking events (REQUESTED → ASSIGNED → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED)

### 2. **IN_TRANSIT** Logistics (Active Delivery)
- **Logistics ID**: `c61719a1-aa08-4f7f-8035-f2c2ccf2d1d8`
- **Tracking Number**: TRK-112233
- **Status**: IN_TRANSIT 🚚
- **Carrier**: RapidAgri Logistics
- **Driver**: Suresh Patil (9876543231)
- **Vehicle**: MH-12-CD-5678
- **Route**: Latur FPO Warehouse → NutriGrain Processing Plant, Pune
- **Crop**: Soybean (900kg)
- **Buyer**: NutriGrain Pvt Ltd
- **Current Location**: Indapur Hub, Pune Highway (Lat: 18.1167, Lng: 75.0167)
- **ETA**: 2 days
- **Events**: 4 tracking events (REQUESTED → ASSIGNED → PICKED_UP → IN_TRANSIT)

### 3. **REQUESTED** Logistics (Needs Driver Assignment)
- **Logistics ID**: `4cfed8cf-3209-4c5c-a0b9-858322db1c77`
- **Tracking Number**: Not assigned yet
- **Status**: REQUESTED 📋
- **Driver**: Not assigned
- **Route**: Pune Farm, Junnar Taluka → Agarwal Agro Industries, Aurangabad
- **Crop**: Onion (500kg - Nasik Red)
- **Buyer**: Mahesh Agarwal
- **Events**: 1 event (REQUESTED)

---

## 🔐 Login Credentials for Testing

| Role | Email | Phone | Password |
|------|-------|-------|----------|
| **FPO Admin** | fpo@test.com | 9876543210 | Test@1234 |
| **Farmer 1** | farmer@test.com | 9876543211 | Test@1234 |
| **Buyer 1** | buyer@test.com | 9876543220 | Test@1234 |

---

## 🌐 Frontend Pages to Test

### For FPO Admin (fpo@test.com)
1. **Logistics Dashboard**: `http://localhost:3000/fpo/logistics`
   - View all 3 logistics entries
   - See stats: 1 REQUESTED, 1 IN_TRANSIT, 1 DELIVERED
   - Assign driver to the REQUESTED logistics
   - Track active deliveries

### For Buyer (buyer@test.com)
1. **Tracking Page**: `http://localhost:3000/buyer/tracking`
   - View incoming deliveries (2 orders)
   - Click on IN_TRANSIT order for live tracking
   - See map with driver location
   - View delivery timeline
   - Confirm delivery when ready

### For Farmer (farmer@test.com)
1. **Logistics Page**: `http://localhost:3000/farmer/logistics`
   - View their shipments
   - Request new pickup
   - Track active deliveries

---

## 🔌 API Endpoints to Test

### Get FPO Logistics (All entries)
```bash
GET http://localhost:3001/api/logistics/fpo
Authorization: Bearer <FPO_TOKEN>
```

### Get Buyer Logistics
```bash
GET http://localhost:3001/api/logistics/buyer
Authorization: Bearer <BUYER_TOKEN>
```

### Get Farmer Logistics
```bash
GET http://localhost:3001/api/logistics/farmer
Authorization: Bearer <FARMER_TOKEN>
```

### Get Specific Order Logistics
```bash
GET http://localhost:3001/api/logistics/order/{orderId}
Authorization: Bearer <TOKEN>
```

### Assign Driver (FPO only)
```bash
POST http://localhost:3001/api/logistics/assign
Authorization: Bearer <FPO_TOKEN>
Content-Type: application/json

{
  "logisticsId": "4cfed8cf-3209-4c5c-a0b9-858322db1c77",
  "driverName": "Test Driver",
  "driverPhone": "9876543299",
  "vehicleNumber": "MH-01-XY-9999",
  "estimatedDelivery": "2026-04-15T10:00:00Z",
  "notes": "Test assignment"
}
```

### Update Location (Live Tracking)
```bash
POST http://localhost:3001/api/logistics/location
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "logisticsId": "c61719a1-aa08-4f7f-8035-f2c2ccf2d1d8",
  "lat": 18.3000,
  "lng": 74.5000,
  "status": "IN_TRANSIT"
}
```

### Mark as Delivered
```bash
POST http://localhost:3001/api/logistics/{id}/deliver
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "deliveryProof": ["https://example.com/proof1.jpg"],
  "deliveryNotes": "Delivered successfully"
}
```

---

## 🗺️ Map Coordinates in Data

### DELIVERED Order
- **Pickup**: Nanded (19.1383, 77.3210)
- **Drop**: Aurangabad (19.8597, 75.3433)
- **Final**: Aurangabad (19.8597, 75.3433)

### IN_TRANSIT Order
- **Pickup**: Latur (18.4088, 76.5604)
- **Drop**: Pune (18.5204, 73.8567)
- **Current**: Indapur (18.1167, 75.0167) ← Driver is here now!

### REQUESTED Order
- **Pickup**: Junnar, Pune (19.2403, 73.8398)
- **Drop**: Aurangabad (19.8597, 75.3433)

---

## 🎯 Testing Checklist

### FPO Dashboard Tests
- [ ] View all 3 logistics entries
- [ ] See correct status counts (1 REQUESTED, 1 IN_TRANSIT, 1 DELIVERED)
- [ ] Filter by status
- [ ] Assign driver to REQUESTED logistics
- [ ] View driver details for assigned logistics
- [ ] Call driver (phone link)

### Buyer Tracking Tests
- [ ] View 2 incoming deliveries
- [ ] Click on IN_TRANSIT order
- [ ] See live map with driver location at Indapur
- [ ] View delivery timeline with 4 events
- [ ] See driver info (Suresh Patil, 9876543231)
- [ ] See ETA countdown
- [ ] Test "Confirm Delivery" button on DELIVERED order

### Farmer Tests
- [ ] View their shipments
- [ ] Request new pickup for confirmed order
- [ ] See status updates

### Real-time Tests (Socket.io)
- [ ] Join logistics room
- [ ] Receive location updates
- [ ] Receive status change notifications
- [ ] See live map updates

---

## 📱 What You'll See

### FPO Logistics Page
```
┌─────────────────────────────────────────┐
│  Logistics Dashboard                    │
├─────────────────────────────────────────┤
│  📊 Total: 3  📋 Requested: 1           │
│  🚚 In Transit: 1  ✅ Delivered: 1      │
├─────────────────────────────────────────┤
│  [REQUESTED] Onion - 500kg              │
│  Pune → Aurangabad                      │
│  [Assign Driver] button                 │
├─────────────────────────────────────────┤
│  [IN_TRANSIT] Soybean - 900kg           │
│  Latur → Pune                           │
│  Driver: Suresh Patil                   │
│  Current: Indapur Hub                   │
├─────────────────────────────────────────┤
│  [DELIVERED] Wheat - 1300kg             │
│  Nanded → Aurangabad                    │
│  Driver: Ramesh Kumar                   │
│  Delivered 2 days ago                   │
└─────────────────────────────────────────┘
```

### Buyer Tracking Page (IN_TRANSIT)
```
┌─────────────────────────────────────────┐
│  Live Tracking - Soybean Order          │
├─────────────────────────────────────────┤
│  🗺️  [MAP SHOWING]                     │
│  📍 Driver at Indapur Hub               │
│  🚚 Moving towards Pune                 │
├─────────────────────────────────────────┤
│  Driver: Suresh Patil                   │
│  Phone: 9876543231 [Call] 📞            │
│  Vehicle: MH-12-CD-5678                 │
├─────────────────────────────────────────┤
│  Timeline:                              │
│  ✅ REQUESTED - 3 days ago              │
│  ✅ ASSIGNED - 2 days ago               │
│  ✅ PICKED_UP - 1 day ago               │
│  🚚 IN_TRANSIT - 6 hours ago            │
│  ⏳ OUT_FOR_DELIVERY                    │
│  ⏳ DELIVERED                           │
├─────────────────────────────────────────┤
│  ETA: 2 days                            │
└─────────────────────────────────────────┘
```

---

## 🚀 Next Steps

1. **Start the servers** (if not running):
   ```bash
   # Terminal 1 - Backend
   cd apps/api
   npm run dev

   # Terminal 2 - Frontend
   cd apps/web
   npm run dev
   ```

2. **Login as FPO Admin**:
   - Go to `http://localhost:3000/login`
   - Email: `fpo@test.com`
   - Password: `Test@1234`
   - Navigate to `/fpo/logistics`

3. **Login as Buyer**:
   - Email: `buyer@test.com`
   - Password: `Test@1234`
   - Navigate to `/buyer/tracking`

4. **Test the features**:
   - Assign driver to REQUESTED logistics
   - View live tracking for IN_TRANSIT logistics
   - See completed delivery details

---

## ✨ Features Working

✅ Database seeded with 3 logistics entries
✅ All status types represented (REQUESTED, IN_TRANSIT, DELIVERED)
✅ Driver information included
✅ GPS coordinates for mapping
✅ Tracking events timeline
✅ Order relationships intact
✅ FPO, Farmer, and Buyer data linked
✅ Ready for frontend testing
✅ API endpoints available
✅ Socket.io real-time updates ready

---

**Built with ❤️ for AgriTrust - Transforming Agricultural Logistics**
