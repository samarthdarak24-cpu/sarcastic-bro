# 🚀 ODOP Connect - Quick Start Guide

## Prerequisites Installation

### 1. Install PostgreSQL

**Windows:**
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer (recommended version: 15.x or 16.x)
3. During installation:
   - Set password for postgres user: `postgres`
   - Port: `5432` (default)
   - Remember the password you set!
4. Add PostgreSQL to PATH (installer usually does this)
5. Verify installation:
   ```bash
   psql --version
   ```

**Quick Install with Chocolatey (Windows):**
```bash
choco install postgresql
```

**Alternative: Use Docker (Recommended for Quick Testing)**
```bash
docker run --name odop-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=odop_connect -p 5432:5432 -d postgres:15
```

### 2. Verify PostgreSQL is Running

```bash
# Check if PostgreSQL service is running
Get-Service postgresql*

# Or connect to verify
psql -U postgres -h localhost
# Password: postgres
# Then type: \q to quit
```

## Database Setup

### Step 1: Update Environment Variables

The `.env` file in `apps/api/.env` is already configured with:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/odop_connect
```

If you used a different password during PostgreSQL installation, update it:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/odop_connect
```

### Step 2: Create Database Schema

```bash
cd apps/api
npm run db:push
```

This will:
- Create the `odop_connect` database
- Generate all tables, relationships, and indexes
- Set up the Prisma client

### Step 3: Seed Test Data

```bash
cd apps/api
npm run db:seed
```

This creates:
- Test farmer account: `farmer@test.com` / `Farmer123`
- Test buyer account: `buyer@test.com` / `Buyer123`
- Sample products, orders, and marketplace data

## Running the Application

### Terminal 1: Start Backend API

```bash
cd apps/api
npm run dev
```

Backend will run on: http://localhost:3001

### Terminal 2: Start Frontend

```bash
cd apps/web
npm run dev
```

Frontend will run on: http://localhost:3000

## Testing the Application

### 1. Login as Farmer
- URL: http://localhost:3000/login
- Email: `farmer@test.com`
- Password: `Farmer123`
- Navigate to Farmer Dashboard

### 2. Login as Buyer (in another browser/incognito)
- URL: http://localhost:3000/login
- Email: `buyer@test.com`
- Password: `Buyer123`
- Navigate to Buyer Dashboard

### 3. Test Real-Time Features

Open both dashboards side-by-side and test:

1. **Product Management** (Farmer)
   - Create a new product
   - Watch it appear in real-time in buyer's marketplace

2. **Order Flow**
   - Buyer: Place an order
   - Farmer: See order notification in real-time
   - Farmer: Accept/reject order
   - Buyer: See status update instantly

3. **Chat System**
   - Open AgriChat in both dashboards
   - Send messages
   - Verify real-time delivery

4. **Market Intelligence**
   - Check live mandi prices
   - View real-time market trends

5. **Tender System**
   - Buyer: Create a tender
   - Farmer: See tender notification
   - Farmer: Submit proposal
   - Buyer: Review proposals in real-time

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   Get-Service postgresql*
   ```
2. Check if you can connect:
   ```bash
   psql -U postgres -h localhost
   ```
3. Verify DATABASE_URL in `apps/api/.env`

### Issue: "Port 3001 already in use"

**Solution:**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear caches and reinstall
cd apps/web
Remove-Item -Recurse -Force .next, node_modules/.cache
npm install

cd ../api
Remove-Item -Recurse -Force node_modules/.cache
npm install
```

### Issue: Build errors with SmartProductHub

**Solution:**
```bash
cd apps/web
Remove-Item -Recurse -Force .next
npm run dev
```

## Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database schema created (`npm run db:push`)
- [ ] Test data seeded (`npm run db:seed`)
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Can login as farmer
- [ ] Can login as buyer
- [ ] Real-time updates working (Socket.IO connected)
- [ ] Products visible in marketplace
- [ ] Orders can be created and tracked
- [ ] Chat messages delivered instantly

## Next Steps

Once everything is running:

1. Review `FARMER_BUYER_FEATURE_TEST_PLAN.md` for comprehensive testing scenarios
2. Test all 15 feature scenarios listed
3. Verify real-time Socket.IO updates for each feature
4. Check browser console for any errors
5. Monitor backend logs for Socket.IO connections

## Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Check backend terminal for error logs
3. Verify Socket.IO connection status in browser console:
   ```javascript
   // In browser console
   localStorage.getItem('token') // Should show JWT token
   ```
4. Check network tab for failed API calls

## Quick Commands Reference

```bash
# Backend
cd apps/api
npm run dev          # Start development server
npm run db:push      # Update database schema
npm run db:seed      # Seed test data
npm run db:studio    # Open Prisma Studio (database GUI)

# Frontend
cd apps/web
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter

# Database
psql -U postgres -h localhost -d odop_connect  # Connect to database
```

## Environment Variables Quick Reference

Key variables in `apps/api/.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Authentication secret
- `PORT` - Backend port (3001)
- `CORS_ORIGINS` - Allowed frontend origins

## Success Indicators

When everything is working correctly, you should see:

**Backend Terminal:**
```
✓ Database connected
✓ Socket.IO initialized
✓ Server running on port 3001
```

**Frontend Terminal:**
```
✓ Ready in 2.5s
✓ Local: http://localhost:3000
```

**Browser Console:**
```
Socket.IO connected
JWT token found
User authenticated
```

---

**Ready to start? Follow the steps above and you'll be up and running in minutes!** 🎉
