# ⚡ Quick Start - ODOP Connect

## Current Status
✅ Frontend cache cleared
✅ Dependencies installed
✅ Prisma client regenerated
✅ Import errors fixed

## What You Need to Do Now

### Option 1: Install PostgreSQL (Recommended)

**Download & Install:**
1. Go to: https://www.postgresql.org/download/windows/
2. Download PostgreSQL 15 or 16
3. Run installer
4. Set password: `postgres`
5. Keep default port: `5432`

**After Installation:**
```bash
# Verify installation
psql --version

# Create database and tables
cd apps/api
npm run db:push

# Add test data
npm run db:seed

# Start backend
npm run dev
```

### Option 2: Use Docker (Fastest)

```bash
# Start PostgreSQL in Docker
docker run --name odop-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=odop_connect -p 5432:5432 -d postgres:15

# Wait 5 seconds, then:
cd apps/api
npm run db:push
npm run db:seed
npm run dev
```

### Option 3: Quick Test Without Database

If you just want to see the frontend UI without backend:

```bash
cd apps/web
npm run dev
```

Then visit: http://localhost:3000

(Note: Features won't work without backend, but you can see the UI)

## Start Both Services

**Terminal 1 - Backend:**
```bash
cd apps/api
npm run dev
```
Should see: `✓ Server running on port 3001`

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```
Should see: `✓ Ready on http://localhost:3000`

## Test Accounts

Once database is set up:
- **Farmer:** farmer@test.com / Farmer123
- **Buyer:** buyer@test.com / Buyer123

## What's Fixed

1. ✅ SmartProductHub import error - changed from default to named import
2. ✅ Build cache cleared - removed stale .next directory
3. ✅ Prisma client regenerated - matches PostgreSQL schema
4. ✅ All dependencies installed

## Next Steps

1. Install PostgreSQL (see options above)
2. Run `npm run db:push` in apps/api
3. Run `npm run db:seed` in apps/api
4. Start both services
5. Login and test features

## Need Help?

See `QUICK_START_GUIDE.md` for detailed troubleshooting and testing instructions.

---

**The code is ready - just need PostgreSQL running!** 🚀
