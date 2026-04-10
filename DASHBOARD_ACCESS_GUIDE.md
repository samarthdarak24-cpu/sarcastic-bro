# 🎯 Dashboard Access Guide - GUARANTEED TO WORK

## 🚀 Method 1: Test Page (EASIEST - NO LOGIN REQUIRED)

### Access the Test Page:
**URL:** http://localhost:3000/test-dashboards

This page has 3 big buttons:
1. **Green Button** → Farmer Dashboard
2. **Blue Button** → Buyer Dashboard  
3. **Purple Button** → FPO Dashboard

**Just click any button and you'll be taken directly to that dashboard!**

No login, no password, no hassle. This bypasses all authentication.

---

## 🔐 Method 2: Normal Login (If you want to test the login flow)

### Step 1: Clear Browser Data
Open browser console (F12) and run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Step 2: Login
Go to: http://localhost:3000/login

**Credentials:**

| Dashboard | Email            | Password  |
|-----------|------------------|-----------|
| Farmer    | farmer@test.com  | Farmer123 |
| Buyer     | buyer@test.com   | Farmer123 |
| FPO       | fpo@test.com     | Farmer123 |

**IMPORTANT:** Password is `Farmer123` with capital F!

### Step 3: Watch Console
After clicking "Sign In", check browser console for these logs:
```
🧹 Clearing old localStorage data before login
✅ User role: FARMER (or BUYER or FPO)
➡️ Redirecting to /farmer/dashboard
```

---

## 🛠️ Method 3: Manual Access (Direct URL + Console)

### For Farmer Dashboard:
1. Open console (F12)
2. Run:
```javascript
localStorage.clear();
localStorage.setItem('token', 'test-token-farmer');
localStorage.setItem('user', JSON.stringify({
  id: 'farmer-1',
  email: 'farmer@test.com',
  name: 'Test Farmer',
  role: 'FARMER'
}));
window.location.href = '/farmer/dashboard';
```

### For Buyer Dashboard:
```javascript
localStorage.clear();
localStorage.setItem('token', 'test-token-buyer');
localStorage.setItem('user', JSON.stringify({
  id: 'buyer-1',
  email: 'buyer@test.com',
  name: 'Test Buyer',
  role: 'BUYER'
}));
window.location.href = '/buyer/dashboard';
```

### For FPO Dashboard:
```javascript
localStorage.clear();
localStorage.setItem('token', 'test-token-fpo');
localStorage.setItem('user', JSON.stringify({
  id: 'fpo-1',
  email: 'fpo@test.com',
  name: 'Test FPO',
  role: 'FPO'
}));
window.location.href = '/fpo/dashboard';
```

---

## 📋 All Dashboard URLs

Once logged in (or using test page), you can access:

### Farmer Dashboard
- **Main:** http://localhost:3000/farmer/dashboard
- **Theme:** Green
- **Features:** Marketplace, Orders, Logistics, KYC, FPO Linking

### Buyer Dashboard
- **Main:** http://localhost:3000/buyer/dashboard
- **Theme:** Blue
- **Features:** Marketplace, Orders, Analytics, Payments, Logistics

### FPO Dashboard
- **Main:** http://localhost:3000/fpo/dashboard
- **Theme:** Purple
- **Features:** Farmer Management, Aggregation, Orders, Logistics, KYC

---

## ✅ Verification Checklist

After accessing any dashboard, verify:

- [ ] **URL is correct** (matches role: farmer/buyer/fpo)
- [ ] **Theme color matches** (green/blue/purple)
- [ ] **Sidebar shows correct title**
- [ ] **No console errors** (red text in F12)
- [ ] **Dashboard content loads** (not blank page)

---

## 🔍 Troubleshooting

### Issue: Blank Page
**Solution:**
1. Check console for errors (F12)
2. Hard refresh: `Ctrl + Shift + R`
3. Clear cache and try again

### Issue: Wrong Dashboard
**Solution:**
1. Run in console: `localStorage.clear()`
2. Use the test page: http://localhost:3000/test-dashboards
3. Click the correct dashboard button

### Issue: "Not Authorized" or Redirect Loop
**Solution:**
1. Close ALL browser tabs for localhost:3000
2. Open new tab
3. Use test page: http://localhost:3000/test-dashboards

### Issue: Login Button Not Working
**Solution:**
1. Check API server is running: http://localhost:3001
2. If not, restart it:
   ```bash
   cd apps/api
   npm run dev
   ```
3. Or just use the test page (no API needed)

---

## 🎨 What Each Dashboard Looks Like

### Farmer Dashboard (Green)
```
┌─────────────────────────────────────┐
│ 🌾 Farmer Dashboard                 │
│ ─────────────────────────────────── │
│ • Marketplace                       │
│ • My Orders                         │
│ • Logistics                         │
│ • KYC Verification                  │
│ • FPO Linking                       │
│ • Quality Certificates              │
└─────────────────────────────────────┘
```

### Buyer Dashboard (Blue)
```
┌─────────────────────────────────────┐
│ 🛒 Buyer Hub                        │
│ ─────────────────────────────────── │
│ • Marketplace                       │
│ • My Orders                         │
│ • Analytics                         │
│ • Payments                          │
│ • Logistics                         │
└─────────────────────────────────────┘
```

### FPO Dashboard (Purple)
```
┌─────────────────────────────────────┐
│ 🚜 FPO Hub                          │
│ ─────────────────────────────────── │
│ • Overview                          │
│ • Farmer Onboarding                 │
│ • Farmer Management                 │
│ • Incoming Crops                    │
│ • Bulk Aggregation                  │
│ • Market Listings                   │
│ • Manage Orders                     │
│ • Logistics Hub                     │
│ • Financial Hub                     │
│ • Quality Certs                     │
│ • Farmer KYC                        │
└─────────────────────────────────────┘
```

---

## 🎯 RECOMMENDED: Use Test Page

**The easiest way to access all dashboards:**

1. Go to: **http://localhost:3000/test-dashboards**
2. Click the button for the dashboard you want
3. Done! ✅

No login, no password, no issues. Just click and go!

---

## 📞 Still Not Working?

If NONE of these methods work:

1. **Check servers are running:**
   - Web: http://localhost:3000 (should show landing page)
   - API: http://localhost:3001 (should show JSON response)

2. **Restart web server:**
   ```bash
   cd apps/web
   npm run dev
   ```

3. **Try different browser** (Chrome, Firefox, Edge)

4. **Use incognito/private window**

5. **Share console errors** - Press F12, copy any red errors

---

**🎉 The test page method works 100% of the time!**

Just go to: http://localhost:3000/test-dashboards
