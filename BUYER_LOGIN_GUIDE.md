# 🔐 Buyer Login Guide

## ✅ Buyer Test Credentials

Use these credentials to login as a buyer:

### Buyer 1 (Mahesh Agarwal):
```
Email: buyer@test.com
Password: password123
```

### Buyer 2 (NutriGrain Pvt Ltd):
```
Email: nutrigrain@test.com
Password: password123
```

---

## 🚀 How to Login

1. **Open your browser** and go to:
   ```
   http://localhost:3000/login
   ```

2. **Enter credentials:**
   - Email: `buyer@test.com`
   - Password: `password123`

3. **Click "Sign In"**

4. **You will be redirected to:**
   ```
   http://localhost:3000/buyer/dashboard
   ```

---

## 🔧 If Login Fails

### Check 1: Servers Running
Make sure both servers are running:
- ✅ Web: http://localhost:3000
- ✅ API: http://localhost:3001

### Check 2: Database Seeded
Run the seed command to create test users:
```bash
cd apps/api
npm run seed
```

### Check 3: Clear Browser Cache
- Clear localStorage
- Clear cookies
- Try in incognito/private mode

### Check 4: Check Console
Open browser console (F12) and look for errors:
- Red errors indicate API issues
- Check network tab for failed requests

---

## 🎯 After Login

You should see:
- ✅ Buyer Dashboard with navigation sidebar
- ✅ 11 menu items (Dashboard, Marketplace, Orders, etc.)
- ✅ Stats cards showing your data
- ✅ Charts and visualizations

### Quick Navigation:
- **Dashboard:** Main overview
- **Escrow Payments:** `/buyer/dashboard?section=escrow`
- **My Orders:** `/buyer/dashboard?section=orders`
- **Wallet:** `/buyer/dashboard?section=wallet`
- **Analytics:** `/buyer/analytics`

---

## 🐛 Common Issues

### Issue 1: "Invalid credentials"
**Solution:** Make sure you're using the exact credentials:
- Email: `buyer@test.com` (lowercase)
- Password: `password123` (no spaces)

### Issue 2: "Connection refused"
**Solution:** Servers not running. Start them:
```bash
# Terminal 1 - API
cd apps/api
npm run dev

# Terminal 2 - Web
cd apps/web
npm run dev
```

### Issue 3: Redirects to wrong page
**Solution:** Clear localStorage:
```javascript
// In browser console (F12)
localStorage.clear()
location.reload()
```

### Issue 4: "User not found"
**Solution:** Database not seeded. Run:
```bash
cd apps/api
npm run seed
```

---

## 📊 What You Should See

### Login Page:
- Beautiful gradient background
- Two-panel design (farm image + form)
- Demo credentials shown at bottom
- Animated effects

### After Login (Buyer Dashboard):
```
┌─────────────────────────────────────┐
│  Navigation Sidebar                 │
│  ├─ 🏠 Dashboard                    │
│  ├─ 🏪 Marketplace                  │
│  ├─ 🛒 My Orders [3]                │
│  ├─ 💰 Wallet                       │
│  ├─ 📦 Bulk Orders                  │
│  ├─ 💵 Escrow Payments [2]          │
│  ├─ ✅ Delivery Approval [1]        │
│  ├─ 📜 Quality Certificates         │
│  ├─ 💬 Real-Time Chat [5]           │
│  ├─ 📍 Order Tracking               │
│  └─ 🏢 Business KYC                 │
└─────────────────────────────────────┘
```

---

## 🎉 Success Indicators

You're logged in successfully if you see:
- ✅ Your name in the dashboard header
- ✅ Navigation sidebar with 11 items
- ✅ Stats cards with numbers
- ✅ Charts and visualizations
- ✅ No error messages
- ✅ URL is `/buyer/dashboard`

---

## 🔄 Quick Reset

If everything is broken, do a full reset:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear database and reseed
cd apps/api
rm prisma/dev.db
npx prisma migrate dev
npm run seed

# 3. Clear web cache
cd ../web
rm -rf .next

# 4. Restart servers
cd apps/api
npm run dev

# In another terminal
cd apps/web
npm run dev

# 5. Clear browser
# - Open browser console (F12)
# - Run: localStorage.clear()
# - Reload page

# 6. Login again
# - Go to http://localhost:3000/login
# - Email: buyer@test.com
# - Password: password123
```

---

## 📞 Still Having Issues?

Check the browser console (F12) for error messages and share them for debugging.

Common error patterns:
- `401 Unauthorized` → Wrong credentials
- `404 Not Found` → API not running
- `500 Server Error` → Database issue
- `Network Error` → Servers not connected

---

## ✨ All Test Accounts

For reference, here are all test accounts:

```
FPO Admin:  fpo@test.com       / password123
Farmer 1:   farmer@test.com    / password123
Buyer 1:    buyer@test.com     / password123
Buyer 2:    nutrigrain@test.com / password123
```

---

**Happy Testing! 🚀**
