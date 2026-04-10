# Government Compliance Module - Troubleshooting Guide

## ✅ **What Was Fixed:**

### 1. **Route Configuration Issue**
**Problem:** Routes were incorrectly mounted multiple times
**Fix:** Updated `compliance.routes.ts` to mount controller once at root

```typescript
// BEFORE (WRONG):
router.use('/liveliness', complianceController);
router.use('/aadhaar', complianceController);
// ... mounted 8 times!

// AFTER (CORRECT):
router.use('/', complianceController);
```

### 2. **Database Schema Missing**
**Problem:** `ComplianceLog` model didn't exist in Prisma schema
**Fix:** Added model with proper relations

```prisma
model ComplianceLog {
  id        String   @id @default(uuid())
  userId    String
  type      String
  status    String
  details   Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 3. **User Model Missing Relation**
**Problem:** User model didn't have `complianceLogs` field
**Fix:** Added relation field to User model

```prisma
model User {
  // ... existing fields
  complianceLogs ComplianceLog[]
}
```

### 4. **Non-existent Field Reference**
**Problem:** Service referenced `aadhaarVerified` field that doesn't exist
**Fix:** Removed the field reference, using only `kycStatus`

## 🧪 **How to Test:**

### **Method 1: Via Website**
1. Start API server: `cd apps/api && npm run dev`
2. Start web server: `cd apps/web && npm run dev`
3. Login as buyer
4. Click "Gov Compliance" in sidebar
5. Test all 7 features

### **Method 2: Via Browser Console**
Open browser console on `/buyer/compliance` and run:

```javascript
// Get auth token
const token = localStorage.getItem('token');

// Test Family Links
fetch('http://localhost:3001/api/compliance/family-links', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);

// Test Subsidies
fetch('http://localhost:3001/api/compliance/subsidies', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);

// Test Blacklist
fetch('http://localhost:3001/api/compliance/blacklist-check', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);

// Test Re-KYC
fetch('http://localhost:3001/api/compliance/rekyc-timer', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);
```

### **Method 3: Via cURL**
```bash
# Get your token first (check browser localStorage)
TOKEN="your_jwt_token_here"

# Test Family Links
curl http://localhost:3001/api/compliance/family-links \
  -H "Authorization: Bearer $TOKEN"

# Test Subsidies
curl http://localhost:3001/api/compliance/subsidies \
  -H "Authorization: Bearer $TOKEN"

# Test Blacklist
curl http://localhost:3001/api/compliance/blacklist-check \
  -H "Authorization: Bearer $TOKEN"

# Test Re-KYC
curl http://localhost:3001/api/compliance/rekyc-timer \
  -H "Authorization: Bearer $TOKEN"
```

### **Method 4: Via Test Script**
```bash
cd apps/api
npx ts-node scripts/test-compliance.ts
```

## 🔍 **Common Issues & Solutions:**

### **Issue 1: 404 Not Found**
**Symptom:** API returns 404 error
**Solution:**
1. Check API server is running on port 3001
2. Verify routes are mounted in `app.ts`:
   ```typescript
   app.use('/api/compliance', complianceRoutes);
   ```
3. Restart API server

### **Issue 2: 401 Unauthorized**
**Symptom:** API returns 401 error
**Solution:**
1. Make sure you're logged in
2. Check token exists in localStorage
3. Token format: `Authorization: Bearer <token>`
4. Token might be expired - login again

### **Issue 3: 500 Internal Server Error**
**Symptom:** API returns 500 error
**Solution:**
1. Check API server console for errors
2. Verify database is running
3. Run `npx prisma db push` to sync schema
4. Check ComplianceLog table exists

### **Issue 4: Frontend Not Showing Data**
**Symptom:** Page loads but no data appears
**Solution:**
1. Open browser console (F12)
2. Check for API errors
3. Verify network requests in Network tab
4. Check if compliance service is imported correctly

### **Issue 5: Database Error**
**Symptom:** Prisma errors about missing tables
**Solution:**
```bash
cd apps/api
npx prisma db push
npx prisma generate
```

## 📊 **Expected Responses:**

### **Family Links Response:**
```json
{
  "success": true,
  "data": {
    "familyMembers": [
      {
        "id": "member_1",
        "name": "Rajesh Kumar",
        "relation": "Self",
        "aadhaarLast4": "1234",
        "kycStatus": "VERIFIED"
      }
    ],
    "totalMembers": 4,
    "primaryHolder": "Rajesh Kumar"
  }
}
```

### **Subsidies Response:**
```json
{
  "success": true,
  "data": {
    "eligible": true,
    "subsidies": [
      {
        "scheme": "PM-KISAN",
        "amount": 6000,
        "status": "ACTIVE",
        "nextDisbursement": "2025-04-01T00:00:00.000Z"
      }
    ],
    "totalAmount": 8500
  }
}
```

### **Blacklist Response:**
```json
{
  "success": true,
  "data": {
    "isBlacklisted": false,
    "status": "CLEAR"
  }
}
```

### **Re-KYC Response:**
```json
{
  "success": true,
  "data": {
    "kycRequired": false,
    "lastKycDate": "2024-06-15T00:00:00.000Z",
    "nextKycDue": "2025-06-15T00:00:00.000Z",
    "daysRemaining": 120,
    "status": "VALID"
  }
}
```

## 🔧 **Manual Testing Steps:**

1. **Start Backend:**
   ```bash
   cd apps/api
   npm run dev
   ```
   Look for: `✓ Database connected` and server running on port 3001

2. **Start Frontend:**
   ```bash
   cd apps/web
   npm run dev
   ```
   Look for: `Local: http://localhost:3000`

3. **Login:**
   - Go to `http://localhost:3000`
   - Login with buyer credentials
   - Get JWT token

4. **Test Compliance Page:**
   - Go to `http://localhost:3000/buyer/compliance`
   - Click on each tab:
     - Family - Should show 4 family members
     - Subsidies - Should show subsidy list with amounts
     - Blacklist - Should show "CLEAR" status
     - Re-KYC - Should show days remaining

5. **Check Browser Console:**
   - Press F12
   - Go to Console tab
   - Look for any errors
   - Check Network tab for API calls

## 📝 **Files Modified:**

1. ✅ `apps/api/src/modules/compliance/compliance.routes.ts` - Fixed route mounting
2. ✅ `apps/api/src/modules/compliance/gov-compliance.service.ts` - Removed non-existent field
3. ✅ `apps/api/prisma/schema.prisma` - Added ComplianceLog model
4. ✅ `apps/api/src/app.ts` - Routes already mounted correctly

## 🎯 **Quick Verification:**

Run this in your browser console when on `/buyer/compliance`:

```javascript
// Quick test all 4 APIs
const token = localStorage.getItem('token');
const baseUrl = 'http://localhost:3001/api/compliance';

const tests = [
  { name: 'Family Links', endpoint: '/family-links' },
  { name: 'Subsidies', endpoint: '/subsidies' },
  { name: 'Blacklist', endpoint: '/blacklist-check' },
  { name: 'Re-KYC', endpoint: '/rekyc-timer' }
];

Promise.all(tests.map(async test => {
  const res = await fetch(baseUrl + test.endpoint, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log(`${test.name}:`, data.success ? '✅' : '❌', data);
  return { name: test.name, success: data.success };
})).then(results => {
  console.log('\n=== TEST SUMMARY ===');
  results.forEach(r => console.log(`${r.success ? '✅' : '❌'} ${r.name}`));
});
```

## 📞 **Need Help?**

If still not working:
1. Check API server logs for errors
2. Check browser console for errors
3. Verify database is running
4. Make sure you're logged in as BUYER
5. Try restarting both servers

## ✅ **All Fixed!**

The following are now working:
- ✅ Family Links - Shows 4 family members with KYC status
- ✅ Subsidies - Shows government subsidies with amounts
- ✅ Blacklist - Shows clearance status
- ✅ Re-KYC Timer - Shows KYC validity and days remaining

Visit: `http://localhost:3000/buyer/compliance`
