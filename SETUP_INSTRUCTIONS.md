# 🚀 SETUP INSTRUCTIONS - FARMER-BUYER PLATFORM

## ✅ IMPORT ERROR FIXED

The `SmartProductHub` import error has been fixed. The component is now correctly imported as a named export.

---

## 📋 PREREQUISITES

Before running the application, ensure you have:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v14 or higher) - Running on localhost:5432
3. **npm** or **yarn**

---

## 🗄️ DATABASE SETUP

### Option 1: Using PostgreSQL (Recommended)

1. **Install PostgreSQL:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Start PostgreSQL Service:**
   ```bash
   # Windows (run as Administrator)
   net start postgresql-x64-14
   
   # Mac
   brew services start postgresql
   
   # Linux
   sudo service postgresql start
   ```

3. **Create Database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE odop_connect;
   
   # Exit
   \q
   ```

4. **Update .env file:**
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/odop_connect
   ```
   (Replace `postgres:postgres` with your username:password)

### Option 2: Using Docker (Easiest)

```bash
# Run PostgreSQL in Docker
docker run --name odop-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=odop_connect \
  -p 5432:5432 \
  -d postgres:14

# Check if running
docker ps
```

---

## 🛠️ INSTALLATION STEPS

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install API dependencies
cd apps/api
npm install

# Install Web dependencies
cd ../web
npm install

# Return to root
cd ../..
```

### 2. Setup Database Schema

```bash
cd apps/api

# Push schema to database
npm run db:push

# Seed database with test data
npm run db:seed
```

**Test Users Created:**
- **Farmer:** farmer@test.com / Password: Farmer123
- **Buyer:** buyer@test.com / Password: Buyer123

### 3. Clear Build Cache

```bash
# Clear Next.js cache
cd apps/web
rm -rf .next
# or on Windows PowerShell:
Remove-Item -Path ".next" -Recurse -Force

cd ../..
```

---

## 🚀 RUNNING THE APPLICATION

### Terminal 1 - Backend API

```bash
cd apps/api
npm run dev
```

**Expected Output:**
```
╔══════════════════════════════════════════╗
║   ODOP Connect API v2.0                  ║
║   Port: 3001                             ║
║   Mode: development                      ║
║   DB:   Connected ✓                      ║
║   WS:   Socket.IO Ready ✓               ║
╚══════════════════════════════════════════╝
```

**Backend URL:** http://localhost:3001

---

### Terminal 2 - Frontend

```bash
cd apps/web
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.2.1
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

**Frontend URL:** http://localhost:3000

---

### Terminal 3 - Prisma Studio (Optional)

```bash
cd apps/api
npm run db:studio
```

**Prisma Studio URL:** http://localhost:5555

---

## 🧪 TESTING THE APPLICATION

### 1. Login as Farmer

1. Open http://localhost:3000
2. Click "Login"
3. Enter credentials:
   - Email: `farmer@test.com`
   - Password: `Farmer123`
4. You should see the Farmer Dashboard

### 2. Login as Buyer (in another browser/incognito)

1. Open http://localhost:3000 in incognito/another browser
2. Click "Login"
3. Enter credentials:
   - Email: `buyer@test.com`
   - Password: `Buyer123`
4. You should see the Buyer Dashboard

### 3. Test Real-Time Features

**Test Product Creation:**
1. As Farmer: Navigate to Product Hub
2. Click "Add Product"
3. Fill form and submit
4. Product should appear instantly (no page refresh)
5. As Buyer: Check marketplace - product should appear instantly

**Test Order Creation:**
1. As Buyer: Find a product and click "Order"
2. Fill order form and submit
3. As Farmer: You should receive instant notification
4. Order should appear in OrderControlCenter immediately

**Test Chat:**
1. As Buyer: Navigate to Chat
2. Select a farmer and send message
3. As Farmer: Message should appear instantly
4. Reply - buyer should see message instantly

---

## 🔍 TROUBLESHOOTING

### Issue: Database Connection Error

**Error:** `Error: P1001: Can't reach database server`

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   sc query postgresql-x64-14
   
   # Mac/Linux
   ps aux | grep postgres
   ```

2. Verify DATABASE_URL in `apps/api/.env`:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/odop_connect
   ```

3. Test connection:
   ```bash
   psql -U postgres -d odop_connect
   ```

---

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

---

### Issue: Build Error - Import Not Found

**Error:** `Export default doesn't exist in target module`

**Solution:**
1. Clear Next.js cache:
   ```bash
   cd apps/web
   rm -rf .next
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

---

### Issue: Socket.IO Not Connecting

**Error:** WebSocket connection failed

**Solution:**
1. Check backend is running on port 3001
2. Verify CORS_ORIGINS in `apps/api/.env`:
   ```
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

3. Check browser console for errors
4. Verify JWT token in localStorage

---

## 📊 SEEDED TEST DATA

The database seed creates:

- **Users:** 5 Farmers + 5 Buyers + 2 Test accounts
- **Products:** 22 products (Banarasi Silk, Turmeric, Saffron, etc.)
- **Orders:** 15 orders in various statuses
- **Proposals:** 12 proposals (pending, accepted, rejected)
- **Reviews:** 20 reviews with ratings
- **Tenders:** 5 tenders with applications
- **Messages:** Chat conversations between farmers and buyers
- **Contracts:** 4 contracts in different states
- **Sample Requests:** 6 sample requests
- **Logistics:** Shipment tracking data

---

## 🎯 NEXT STEPS

1. ✅ Database setup complete
2. ✅ Services running
3. ✅ Test users created
4. ✅ Real-time Socket.IO working

**Now you can:**
- Test all 15 scenarios from `FARMER_BUYER_FEATURE_TEST_PLAN.md`
- Verify real-time updates work
- Check farmer-buyer interactions
- Test Socket.IO events

---

## 📞 SUPPORT

If you encounter any issues:

1. Check the console for errors
2. Verify all services are running
3. Check database connection
4. Clear cache and restart

**All imports are fixed and ready to run!** 🚀
