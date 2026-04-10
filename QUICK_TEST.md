# Quick Login Test

## 🚀 Immediate Fix

**Try this RIGHT NOW:**

1. **Open browser console** (Press F12)

2. **Run this command:**
   ```javascript
   localStorage.clear(); location.reload();
   ```

3. **Login again** with your credentials

4. **Watch the console logs** - you should see the redirect happening

---

## 🎯 Test Each Dashboard

### Test 1: Farmer Dashboard
1. Clear localStorage: `localStorage.clear()`
2. Go to: http://localhost:3000/login
3. Login with:
   - Email: `farmer@test.com`
   - Password: `Farmer123`
4. Should redirect to: http://localhost:3000/farmer/dashboard
5. Should see: **Green theme** with "Farmer Dashboard"

### Test 2: Buyer Dashboard
1. Clear localStorage: `localStorage.clear()`
2. Go to: http://localhost:3000/login
3. Login with:
   - Email: `buyer@test.com`
   - Password: `Farmer123`
4. Should redirect to: http://localhost:3000/buyer/dashboard
5. Should see: **Blue theme** with "Buyer Dashboard"

### Test 3: FPO Dashboard
1. Clear localStorage: `localStorage.clear()`
2. Go to: http://localhost:3000/login
3. Login with:
   - Email: `fpo@test.com`
   - Password: `Farmer123`
4. Should redirect to: http://localhost:3000/fpo/dashboard
5. Should see: **Purple theme** with "FPO Hub"

---

## 🔍 What to Check in Console

After clicking "Sign In", you should see these logs in order:

```
🧹 Clearing old localStorage data before login
🔵 Starting login with email: [your-email]
✅ Login successful - Full response: {...}
✅ User role: FARMER (or BUYER or FPO)
💾 Stored user in localStorage: {...}
💾 Parsed stored user role: FARMER (or BUYER or FPO)
🔀 Routing user with role: FARMER (or BUYER or FPO)
🔀 Role comparison - FARMER: true (or false)
🔀 Role comparison - BUYER: false (or true)
🔀 Role comparison - FPO: false (or true)
➡️ Redirecting to /farmer/dashboard (or /buyer/dashboard or /fpo/dashboard)
```

Then after page loads:
```
🔐 AuthGuard check: { userRole: 'FARMER', allowedRoles: ['FARMER'] }
✅ User authorized for this page
```

---

## ❌ If Still Not Working

### Option 1: Force Redirect
After login, if you're on wrong dashboard, run in console:
```javascript
// For Farmer
localStorage.setItem('user', JSON.stringify({role: 'FARMER', email: 'farmer@test.com', name: 'Test Farmer', id: '1'}));
window.location.href = '/farmer/dashboard';

// For Buyer
localStorage.setItem('user', JSON.stringify({role: 'BUYER', email: 'buyer@test.com', name: 'Test Buyer', id: '2'}));
window.location.href = '/buyer/dashboard';

// For FPO
localStorage.setItem('user', JSON.stringify({role: 'FPO', email: 'fpo@test.com', name: 'Test FPO', id: '3'}));
window.location.href = '/fpo/dashboard';
```

### Option 2: Nuclear Reset
```javascript
// Clear everything
localStorage.clear();
sessionStorage.clear();
// Close ALL tabs
// Open new tab
// Login again
```

### Option 3: Check API Server
1. Open: http://localhost:3001
2. Should see API response (not "connection refused")
3. If not working, restart API server:
   ```bash
   cd apps/api
   npm run dev
   ```

---

## ✅ Success Checklist

- [ ] Console shows correct role after login
- [ ] URL matches role (farmer/buyer/fpo)
- [ ] Dashboard theme matches role (green/blue/purple)
- [ ] No console errors (red text)
- [ ] Can see dashboard content (not blank page)

---

## 📸 What You Should See

### Farmer Dashboard
- **URL:** `/farmer/dashboard`
- **Color:** Green theme
- **Sidebar:** "Farmer Dashboard" title
- **Sections:** Marketplace, Orders, Logistics, etc.

### Buyer Dashboard
- **URL:** `/buyer/dashboard`
- **Color:** Blue theme
- **Sidebar:** "Buyer Hub" title
- **Sections:** Marketplace, Orders, Analytics, etc.

### FPO Dashboard
- **URL:** `/fpo/dashboard`
- **Color:** Purple theme
- **Sidebar:** "FPO Hub" title
- **Sections:** Farmer Management, Aggregation, Orders, etc.

---

**Still having issues? Share the console logs and I'll help debug!** 🔧
