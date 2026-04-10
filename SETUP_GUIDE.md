# AgriTrust Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Python 3.8+ (for AI service)

---

## 📦 Installation Steps

### 1. Install Dependencies
```bash
# Install all workspace dependencies
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (if not installed)
# Windows: Download from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Start PostgreSQL service
# Windows: Start from Services
# Mac/Linux: sudo service postgresql start

# Create database
psql -U postgres
CREATE DATABASE agritrust;
\q
```

#### Option B: Docker PostgreSQL
```bash
docker run --name agritrust-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=agritrust \
  -p 5432:5432 \
  -d postgres:14
```

### 3. Configure Environment Variables

#### Backend (.env)
Create `apps/api/.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agritrust?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Razorpay (Test Keys)
RAZORPAY_KEY_ID="rzp_test_dummy_id"
RAZORPAY_KEY_SECRET="rzp_test_dummy_secret"
RAZORPAY_WEBHOOK_SECRET="webhook_secret_key"

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

#### Frontend (.env.local)
Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Database Migration & Seed

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Start Development Servers

#### Option A: All Services (Recommended)
```bash
# From root directory
npm run dev
```

This starts:
- Web (Next.js) on http://localhost:3000
- API (Express) on http://localhost:5000
- AI Service (Python) on http://localhost:8000

#### Option B: Individual Services
```bash
# Terminal 1 - Web
npm run dev:web

# Terminal 2 - API
npm run dev:api

# Terminal 3 - AI Service
npm run dev:ai
```

---

## 🧪 Testing the Setup

### 1. Check API Health
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Access Web Application
Open browser: http://localhost:3000

### 3. Test Login
Use seeded accounts:

**Farmer:**
- Phone: 9876543210
- Password: password123

**Buyer:**
- Phone: 9876543211
- Password: password123

**FPO:**
- Phone: 9876543212
- Password: password123

---

## 🔧 Troubleshooting

### Database Connection Error
```
Error: Can't reach database server at localhost:5432
```

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   services.msc (look for PostgreSQL)
   
   # Mac/Linux
   sudo service postgresql status
   ```

2. Verify DATABASE_URL in `.env`
3. Check PostgreSQL port (default: 5432)
4. Ensure database `agritrust` exists

### Port Already in Use
```
Error: Port 5000 is already in use
```

**Solutions:**
1. Kill process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. Or change PORT in `.env`

### Prisma Client Not Generated
```
Error: @prisma/client did not initialize yet
```

**Solution:**
```bash
cd apps/api
npx prisma generate
```

### Module Not Found Errors
```
Error: Cannot find module 'xyz'
```

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Accessing Different Dashboards

### Farmer Dashboard
http://localhost:3000/farmer/dashboard

Features:
- Crop management
- Orders tracking
- Earnings & wallet
- FPO linking
- Analytics
- KYC verification

### Buyer Dashboard
http://localhost:3000/buyer/dashboard

Features:
- Marketplace browsing
- Order placement
- Wallet & payments
- Order tracking
- Analytics
- Supplier management

### FPO Dashboard
http://localhost:3000/fpo/dashboard

Features:
- Farmer management
- Crop aggregation
- Bulk listings
- Order management
- Commission tracking
- Analytics
- Link requests

---

## 🔐 Razorpay Integration (Production)

### Get Production Keys
1. Sign up at https://razorpay.com
2. Get API keys from Dashboard
3. Update `.env`:
   ```env
   RAZORPAY_KEY_ID="rzp_live_..."
   RAZORPAY_KEY_SECRET="..."
   ```

### Configure Webhook
1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-domain.com/api/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret to `.env`

---

## 🌐 Deployment

### Backend (API)

#### Option 1: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd apps/api
railway up
```

#### Option 2: Heroku
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create agritrust-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

### Frontend (Web)

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd apps/web
netlify deploy --prod
```

---

## 📊 Database Management

### View Data
```bash
cd apps/api
npx prisma studio
```

### Reset Database
```bash
cd apps/api
npx prisma migrate reset
```

### Create New Migration
```bash
cd apps/api
npx prisma migrate dev --name your_migration_name
```

### Generate Prisma Client
```bash
cd apps/api
npx prisma generate
```

---

## 🐛 Development Tips

### Hot Reload
All services support hot reload:
- Web: Next.js Fast Refresh
- API: nodemon watches for changes
- Changes reflect automatically

### Debugging

#### Backend
Add breakpoints in VS Code:
1. Open Debug panel (Ctrl+Shift+D)
2. Select "Attach to Node"
3. Set breakpoints
4. Start debugging

#### Frontend
Use React DevTools:
1. Install React DevTools extension
2. Open browser DevTools
3. Navigate to React tab

### Logs
- API logs: Console output
- Web logs: Browser console
- Database logs: Prisma logs in console

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Razorpay API Docs](https://razorpay.com/docs/api)
- [Socket.IO Documentation](https://socket.io/docs/v4/)

---

## 🆘 Getting Help

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review error messages carefully
3. Check console logs for both frontend and backend
4. Verify environment variables are set correctly
5. Ensure database is running and accessible

---

**Last Updated:** 2024
**Platform Version:** 1.0.0
