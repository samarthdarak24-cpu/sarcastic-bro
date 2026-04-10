# 🚀 Quick Login Guide

## ⚠️ IMPORTANT: Password is `Farmer123` for ALL accounts!

---

## 🏢 FPO Login

```
URL:      http://localhost:3000/login
Email:    fpo@test.com
Password: Farmer123
```

**After login:** http://localhost:3000/fpo/dashboard

---

## 🌾 Farmer Login

```
URL:      http://localhost:3000/login
Email:    farmer@test.com
Password: Farmer123
```

**After login:** http://localhost:3000/farmer/dashboard

**Logistics:** http://localhost:3000/farmer/dashboard?section=logistics

---

## 🛒 Buyer Login

```
URL:      http://localhost:3000/login
Email:    buyer@test.com
Password: Farmer123
```

**After login:** http://localhost:3000/buyer/dashboard

---

## ✅ Checklist

- [ ] Servers running (check below)
- [ ] Using correct port (3000, not 3002)
- [ ] Password is exactly `Farmer123` (capital F)
- [ ] Email is correct
- [ ] Browser cache cleared

---

## 🔍 Check Servers

**Web Server:**
```
http://localhost:3000
```
Should show: Landing page

**API Server:**
```
http://localhost:3001/api/health
```
Should show: `{"status":"ok"}`

---

## 🐛 Still Not Working?

1. **Clear browser cache:** Ctrl + Shift + Delete
2. **Try incognito mode**
3. **Check browser console:** F12 → Console tab
4. **Verify servers are running:**
   ```bash
   # Terminal 1 - API
   cd apps/api
   npm run dev
   
   # Terminal 2 - Web
   cd apps/web
   npm run dev
   ```

---

## 📝 Common Errors

| Error | Solution |
|-------|----------|
| "Invalid credentials" | Use `Farmer123` not `Fpo123` |
| "Connection refused" | Start servers (see above) |
| "Cannot find page" | Use port 3000, not 3002 |
| Redirected to login | Clear cookies/cache |

---

**Remember: `Farmer123` works for FPO, Farmer, and Buyer!** ✨
