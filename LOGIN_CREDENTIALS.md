# 🔐 CORRECT Login Credentials for AgriTrust

## ⚠️ IMPORTANT: All passwords are `Farmer123` (case-sensitive!)

---

## Quick Access

### 🌾 Farmer Login
**Email:** `farmer@test.com`  
**Password:** `Farmer123`  
**Role:** FARMER  
**Name:** Suresh Jadhav

**Dashboard:** http://localhost:3000/farmer/dashboard  
**Logistics:** http://localhost:3000/farmer/dashboard?section=logistics

---

### 🏢 FPO Login
**Email:** `fpo@test.com`  
**Password:** `Farmer123` ⚠️ (NOT Fpo123!)  
**Role:** FPO  
**Name:** Rajendra Patil

**Dashboard:** http://localhost:3000/fpo/dashboard

---

### 🛒 Buyer Login
**Email:** `buyer@test.com`  
**Password:** `Farmer123`  
**Role:** BUYER

**Dashboard:** http://localhost:3000/buyer/dashboard

---

## All Test Accounts

| Role | Email | Password | Name |
|------|-------|----------|------|
| **FPO** | fpo@test.com | Farmer123 | Rajendra Patil |
| **Farmer** | farmer@test.com | Farmer123 | Suresh Jadhav |
| **Farmer** | ganesh@test.com | Farmer123 | Ganesh Bhosale |
| **Farmer** | prakash@test.com | Farmer123 | Prakash Shinde |
| **Farmer** | dmore@test.com | Farmer123 | Dnyaneshwar More |
| **Farmer** | ashok@test.com | Farmer123 | Ashok Deshmukh |
| **Buyer** | buyer@test.com | Farmer123 | (Buyer Account) |

---

## 🎯 Login Steps for FPO

1. **Go to:** http://localhost:3000/login
2. **Enter:**
   - Email: `fpo@test.com`
   - Password: `Farmer123` (capital F, NOT Fpo123)
3. **Click Login**
4. **Redirected to:** http://localhost:3000/fpo/dashboard

---

## Common Mistakes ❌

| Wrong ❌ | Correct ✅ |
|---------|-----------|
| Fpo123 | Farmer123 |
| farmer123 | Farmer123 |
| FARMER123 | Farmer123 |
| fpo123 | Farmer123 |

**Remember:** Password is case-sensitive! Must be exactly `Farmer123`

---

## Server URLs

- **Web:** http://localhost:3000
- **API:** http://localhost:3001
- **Login:** http://localhost:3000/login

---

## Quick Test

Try this in your browser console after going to login page:
```javascript
// This should work
fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'fpo@test.com',
    password: 'Farmer123'
  })
}).then(r => r.json()).then(console.log)
```

---

**TL;DR: Use `Farmer123` for ALL accounts, including FPO!** 🎉

### 1. Check API Server is Running
```bash
# Should be running on port 3001
curl http://localhost:3001/api/health
```

### 2. Check Database is Seeded
```bash
cd apps/api
npm run seed
```

### 3. Clear Browser Data
- Press `Ctrl + Shift + Delete`
- Clear cookies and cache
- Try again

### 4. Check Console for Errors
- Press `F12` to open DevTools
- Check Console tab for errors
- Check Network tab for failed requests

### 5. Verify API Connection
- Frontend: http://localhost:3002
- Backend: http://localhost:3001
- Make sure both are running

---

## Login Steps

1. **Go to Login Page:**
   ```
   http://localhost:3002/login
   ```

2. **Enter Credentials:**
   - Email: `farmer@test.com`
   - Password: `Farmer123`

3. **Click Login**

4. **You'll be redirected to:**
   ```
   http://localhost:3002/farmer/dashboard
   ```

5. **To Access Logistics:**
   ```
   http://localhost:3002/farmer/dashboard?section=logistics
   ```

---

## Common Issues & Solutions

### Issue: "Invalid credentials"
**Solution:** 
- Make sure API server is running on port 3001
- Run seed script: `cd apps/api && npm run seed`
- Check password is exactly: `Farmer123` (case-sensitive)

### Issue: "Cannot connect to server"
**Solution:**
- Start API server: `cd apps/api && npm run dev`
- Check it's running on port 3001
- Check `.env` file configuration

### Issue: "Redirected to login after successful login"
**Solution:**
- Clear browser cookies
- Check localStorage in DevTools
- Verify token is being saved

### Issue: "Page not found"
**Solution:**
- Make sure web server is running on port 3002
- Check URL is correct
- Try hard refresh: `Ctrl + Shift + R`

---

## Quick Start Commands

### Start API Server (Terminal 1)
```bash
cd apps/api
npm run dev
```

### Start Web Server (Terminal 2)
```bash
cd apps/web
npm run dev
```

### Seed Database (if needed)
```bash
cd apps/api
npm run seed
```

---

## Test Login via API

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "Farmer123"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Suresh Jadhav",
    "email": "farmer@test.com",
    "role": "FARMER"
  }
}
```

---

## Environment Check

Make sure these are running:
- ✅ API Server: http://localhost:3001
- ✅ Web Server: http://localhost:3002
- ✅ Database: SQLite (apps/api/prisma/dev.db)

---

## Need Help?

1. Check browser console (F12)
2. Check API server logs
3. Verify database has data
4. Try different browser
5. Clear all cache and cookies

---

**Remember:** All passwords are `Farmer123` for test accounts!
