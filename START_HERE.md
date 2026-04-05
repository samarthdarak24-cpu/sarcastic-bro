# 🎯 START HERE - Database Authentication Setup

## ✅ System Status

Your authentication is now configured to use **REAL DATABASE** with secure password storage!

```
❌ Mock Authentication (fake data)
✅ Database Authentication (real bcrypt + JWT)
```

## 🚀 3-Step Quick Start

### 1️⃣ First Time Setup
```bash
Double-click: setup-all.bat
```
This installs everything and creates the database with test users.

### 2️⃣ Start Backend (Terminal 1)
```bash
Double-click: start-backend.bat
```
✅ Backend API: http://localhost:3001

### 3️⃣ Start Frontend (Terminal 2)
```bash
Double-click: start-frontend.bat
```
✅ Frontend App: http://localhost:3000

## 🔑 Login Now!

Go to: **http://localhost:3000/login**

```
Email: farmer@test.com
Password: Farmer123
```

OR

```
Email: buyer@test.com
Password: Buyer123
```

## ✨ What You Can Do

### ✅ Login
- Use test accounts above
- Passwords verified against database
- JWT tokens issued for session

### ✅ Register
- Go to /register
- Create new account
- Password hashed with bcrypt
- Saved to database

### ✅ View Database
```bash
cd apps/api
npx prisma studio
```
See all users, hashed passwords, tokens

## 📁 Important Files

| File | Purpose |
|------|---------|
| `setup-all.bat` | First-time setup (run once) |
| `start-backend.bat` | Start API server |
| `start-frontend.bat` | Start web app |
| `README_AUTH.md` | Complete documentation |
| `QUICK_START.md` | Quick reference |

## 🔒 Security

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens (15min access, 7day refresh)
- ✅ Secure session management
- ✅ Protected API routes
- ✅ CORS configured

## 🎓 Test Accounts

### Demo (from login page)
- farmer@test.com / Farmer123
- buyer@test.com / Buyer123

### More Accounts (Password: Test@1234)
- ramesh@odop.in (Farmer)
- lakshmi@odop.in (Farmer)
- rajesh@buyer.in (Buyer)
- priya@buyer.in (Buyer)
- And 6 more...

## 🐛 Troubleshooting

### Can't login?
1. Check backend is running (Terminal 1)
2. Check frontend is running (Terminal 2)
3. Try: farmer@test.com / Farmer123
4. Check browser console (F12)

### Setup failed?
```bash
# Run setup again
setup-all.bat
```

### Database missing?
```bash
cd apps/api
npx prisma db push
npm run db:seed
```

## 📚 Documentation

- **README_AUTH.md** ← Read this for complete guide
- **DATABASE_AUTH_SETUP.md** ← Technical details
- **QUICK_START.md** ← Quick reference

## ✅ Verification

Run this to check everything:
```bash
node verify-setup.js
```

## 🎯 Next Steps

1. ✅ Run `setup-all.bat` (first time)
2. ✅ Run `start-backend.bat`
3. ✅ Run `start-frontend.bat`
4. ✅ Go to http://localhost:3000/login
5. ✅ Login with farmer@test.com / Farmer123
6. ✅ Explore the dashboard!

---

**Ready to start?** → Run `setup-all.bat` now!
