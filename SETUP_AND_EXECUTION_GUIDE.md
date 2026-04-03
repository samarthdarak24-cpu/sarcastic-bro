# 🚀 ODOP CONNECT - QUICK START & EXECUTION GUIDE

## PART 1: ENVIRONMENT SETUP

### Step 1: Install Dependencies

#### Frontend (`apps/web/`)
```bash
cd apps/web
npm install

# Required packages (already in package.json or add these):
npm install next@latest
npm install react@latest react-dom@latest
npm install typescript
npm install -D tailwindcss postcss autoprefixer
npm install axios
npm install zustand
npm install @reduxjs/toolkit react-redux
npm install framer-motion
npm install recharts
npm install socket.io-client
npm install dexie
npm install react-hot-toast
npm install zod
npm install react-hook-form
npm install next-intl
npm install lucide-react # Icons
npm install clsx # Conditional classNames
```

#### Backend (`apps/api/`)
```bash
cd apps/api
npm install

# Required packages:
npm install express
npm install typescript
npm install -D @types/node @types/express
npm install prisma @prisma/client
npm install dotenv
npm install jsonwebtoken
npm install bcryptjs
npm install axios
npm install multer # File upload
npm install pdfkit # PDF generation
npm install qrcode # QR code
npm install socket.io
npm install cors
npm install morgan # Logging
npm install joi # Validation
npm install redis # Caching
npm install nodemon -D # Dev
npm install ts-node -D # TS runner
```

#### AI Service (`apps/ai-service/`)
```bash
cd apps/ai-service
python -m venv venv
.\venv\Scripts\activate  # Windows
# or source venv/bin/activate  # Mac/Linux

pip install fastapi
pip install uvicorn
pip install python-multipart
pip install pillow # Image processing
pip install numpy
pip install scipy
pip install scikit-learn
pip install opencv-python
```

---

### Step 2: Environment Variables

#### Frontend (`apps/web/.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=ODOP Connect
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Backend (`apps/api/.env`)
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./dev.db"  # SQLite for dev
# For PostgreSQL: postgresql://user:password@localhost:5432/odop
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_secret_min_32_chars
REFRESH_TOKEN_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
AI_SERVICE_URL=http://localhost:8000
```

#### AI Service (`apps/ai-service/.env`)
```bash
FASTAPI_ENV=development
PORT=8000
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
```

---

### Step 3: Database Setup

#### Initialize Prisma
```bash
cd apps/api

# Create migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Run seeders (optional)
npx ts-node src/prisma/seed.ts
```

#### Verify Database
```bash
# View database
npx prisma studio

# This opens http://localhost:5555 in browser
```

---

### Step 4: Directory Structure Verification

```bash
ODOP-PROJECT/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/        # Pages
│   │   │   ├── components/ # React components
│   │   │   ├── services/   # API services
│   │   │   ├── store/      # Redux store
│   │   │   ├── lib/        # Utilities
│   │   │   ├── types/      # TypeScript types
│   │   │   ├── middleware.ts
│   │   │   ├── config/
│   │   │   └── hooks/
│   │   ├── public/
│   │   ├── node_modules/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.js
│   │   └── .env.local
│   │
│   ├── api/                 # Express backend
│   │   ├── src/
│   │   │   ├── modules/    # Feature modules
│   │   │   ├── middleware/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   ├── config/
│   │   │   ├── prisma/
│   │   │   ├── app.ts
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── uploads/
│   │   ├── node_modules/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env
│   │
│   └── ai-service/         # FastAPI Python
│       ├── app/
│       │   ├── main.py
│       │   ├── routers/
│       │   ├── services/
│       │   └── schemas.py
│       ├── venv/
│       ├── requirements.txt
│       ├── Dockerfile
│       └── .env
│
├── packages/
│   └── database/          # Shared Prisma
│       ├── prisma/
│       └── package.json
│
└── docker/
    └── docker-compose.yml
```

---

## PART 2: DEVELOPMENT SERVER STARTUP

### Method 1: Terminal Windows (Simple)

#### Terminal 1: PostgreSQL + Redis (Docker)
```bash
docker run -d --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15
docker run -d --name redis -p 6379:6379 redis:7
```

#### Terminal 2: Backend
```bash
cd apps/api
npm run dev

# Expected output:
# Server running on http://localhost:3001
```

#### Terminal 3: Frontend
```bash
cd apps/web
npm run dev

# Expected output:
# ▲ Next.js 14.0.0
# ✓ ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

#### Terminal 4: AI Service
```bash
cd apps/ai-service
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Expected output:
# Uvicorn running on http://127.0.0.1:8000
```

### Method 2: Docker Compose (Production-like)

```bash
cd docker
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Method 3: Dev Container (VS Code)

If using Dev Container:
```bash
# Open VS Code and select "Reopen in Container"
# Then run:

npm run dev:all
```

---

## PART 3: TESTING THE SETUP

### 1. Test Frontend is Running
```bash
# Open browser
http://localhost:3000

# Expected: Landing page loads
```

### 2. Test Backend is Running
```bash
curl http://localhost:3001/health

# Expected: {"status":"ok"}
```

### 3. Test AI Service
```bash
curl http://localhost:8000/health

# Expected: {"status":"ok"}
```

### 4. Test Database Connection
```bash
cd apps/api
npx prisma studio

# Expected: http://localhost:5555 opens
```

### 5. Test API Endpoint
```bash
curl -X GET http://localhost:3001/users/profile

# Expected: {"message":"Unauthorized"} or user data if authenticated
```

---

## PART 4: CREATE INITIAL USER

### Option 1: Via API (Postman)

1. Open Postman
2. Create new POST request:
   ```
   URL: http://localhost:3001/auth/register
   
   Body (JSON):
   {
     "name": "John Farmer",
     "email": "farmer@example.com",
     "password": "password123",
     "role": "FARMER",
     "phone": "+919876543210"
   }
   ```

3. Send and copy the token from response

### Option 2: Via Database

```bash
cd apps/api
npx prisma studio

# Navigate to User table
# Click "Add record"
# Fill in:
# - name: John Farmer
# - email: farmer@example.com
# - password: [hash using bcryptjs]
# - role: FARMER
# - phone: +919876543210
```

### Option 3: Create Seed File

Create `apps/api/src/prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create farmer
  const farmer = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'farmer@example.com',
      password: hashedPassword,
      role: 'FARMER',
      phone: '+919876543210',
      district: 'Pampore',
      state: 'Jammu & Kashmir',
      kycStatus: 'VERIFIED',
      isActive: true,
    },
  });

  // Create buyer
  const buyer = await prisma.user.create({
    data: {
      name: 'Amit Buyer',
      email: 'buyer@example.com',
      password: hashedPassword,
      role: 'BUYER',
      phone: '+919876543211',
      district: 'New Delhi',
      state: 'Delhi',
      kycStatus: 'VERIFIED',
      isActive: true,
    },
  });

  console.log({ farmer, buyer });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Run:
```bash
npx ts-node src/prisma/seed.ts
```

---

## PART 5: FIRST LOGIN TEST

### Step 1: Access Frontend
```
http://localhost:3000
```

### Step 2: Click "Sign In"

### Step 3: Enter Credentials
```
Email: farmer@example.com
Password: password123
```

### Step 4: Click Login

### Step 5: Verify
- [x] Redirect to dashboard
- [x] User name shows in top right
- [x] Sidebar shows farmer menu

### Step 6: Test Logout
- Click user menu → Logout
- Should redirect to login page

---

## PART 6: API TESTING WITH POSTMAN

### 1. Create Collection

**Name:** ODOP Connect API

### 2. Add Variables

In Collection → Variables:
```
base_url: http://localhost:3001
token: [copy from login response]
farmer_id: [farmer user id]
buyer_id: [buyer user id]
```

### 3. Test Endpoints

#### Register
```
POST {{base_url}}/auth/register

Body:
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "FARMER"
}
```

#### Login
```
POST {{base_url}}/auth/login

Body:
{
  "email": "farmer@example.com",
  "password": "password123"
}

Response: {
  "token": "eyJhbGc...",
  "refreshToken": "...",
  "user": {...}
}
```

#### Get Current User
```
GET {{base_url}}/auth/me

Headers:
Authorization: Bearer {{token}}
```

#### Get Products
```
GET {{base_url}}/products

Headers:
Authorization: Bearer {{token}}
```

#### Create Product (Farmer)
```
POST {{base_url}}/products

Headers:
Authorization: Bearer {{token}}

Body:
{
  "name": "Kashmir Saffron",
  "description": "Premium saffron",
  "category": "Spices",
  "price": 240000,
  "unit": "kg",
  "quantity": 100,
  "district": "Pampore",
  "state": "Jammu & Kashmir",
  "qualityGrade": "A+",
  "qualityScore": 95
}
```

---

## PART 7: GIT SETUP

### Initialize Repository
```bash
# From project root
git init
git add .
git commit -m "Initial commit: ODOP Connect project setup"

# Add remote
git remote add origin your-repo-url
git push -u origin main
```

### Branch Convention
```bash
# Feature
git checkout -b feature/authentication

# Bugfix
git checkout -b bugfix/login-validation

# Commit
git commit -m "feat: Add JWT authentication"

# Push
git push origin feature/authentication

# Create Pull Request on GitHub
```

---

## PART 8: COMMON ISSUES & SOLUTIONS

### Issue 1: Port Already in Use
```
Error: listen EADDRINUSE :::3001
```
**Solution:**
```bash
# Kill process on port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### Issue 2: Database Connection Failed
```
Error: Could not connect to the database server
```
**Solution:**
```bash
# Check DATABASE_URL in .env
# Make sure PostgreSQL is running:
docker ps

# If not running:
docker run -d --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15
```

### Issue 3: Module Not Found
```
Error: Cannot find module 'axios'
```
**Solution:**
```bash
npm install
npm install axios
# Or reinstall node_modules:
rm -rf node_modules
npm install
```

### Issue 4: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
Check backend `.env`:
```
CORS_ORIGIN=http://localhost:3000
```

### Issue 5: JWT Token Invalid
```
Error: Invalid or expired token
```
**Solution:**
```bash
# Get new token by logging in
# Or check JWT_SECRET in .env is same on all services
```

---

## PART 9: MONITORING & DEBUGGING

### Backend Debugging

#### Enable Debug Logging
In `src/index.ts`:
```typescript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

#### Console Logs in API
```typescript
console.log('[DEBUG]', 'User logged in:', userId);
```

#### Check Network Requests
DevTools → Network tab → Filter XHR

#### Test with cURL
```bash
curl -X GET http://localhost:3001/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Debugging

#### DevTools Console
Press F12 → Console → Check for errors

#### Redux DevTools
Install Redux DevTools extension in browser

#### Network Monitoring
DevTools → Network → Check API calls

#### React DevTools
Install React DevTools extension

---

## PART 10: PRODUCTION CHECKLIST

Before deploying to production:

```bash
# Frontend
[ ] npm run build            # Build succeeds
[ ] npm run lint             # No errors
[ ] Package.json versions locked
[ ] Environment variables set
[ ] API endpoints point to production

# Backend
[ ] npm run build            # Build succeeds
[ ] npm run lint             # No errors
[ ] Database migrations run
[ ] Seed data executed
[ ] Error logging configured
[ ] Rate limiting enabled
[ ] CORS properly configured

# Security
[ ] JWT secrets are strong (32+ chars)
[ ] Passwords hashed with bcryptjs
[ ] Environment secrets not in code
[ ] HTTPS enabled
[ ] SQL injection prevented (Prisma ORM handles this)
[ ] XSS prevention enabled

# Performance
[ ] Images optimized
[ ] Code splitting enabled
[ ] Caching configured
[ ] Database indexes set
[ ] API rate limiting

# DevOps
[ ] Docker images built
[ ] docker-compose tested
[ ] Health checks configured
[ ] Logging setup
[ ] Monitoring enabled
[ ] Backups configured
```

---

## PART 11: QUICK COMMANDS REFERENCE

```bash
# Frontend
npm run dev               # Start dev server
npm run build            # Build for production
npm run lint             # Run linting
npm run test             # Run tests

# Backend
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run migration:new    # Create new migration
npm run db:seed          # Run seeders

# Database
npx prisma studio       # Open DB UI
npx prisma migrate dev  # Run migrations
npx prisma generate     # Generate Prisma client

# Docker
docker-compose up       # Start all services
docker-compose down     # Stop all services
docker-compose ps       # View running containers
docker-compose logs -f  # View logs

# Git
git status              # Check status
git add .              # Stage all changes
git commit -m "msg"    # Commit
git push               # Push to remote
git pull               # Pull from remote
```

---

## SUMMARY OF NEXT STEPS

1. ✅ Install all dependencies
2. ✅ Setup environment variables
3. ✅ Initialize database
4. ✅ Start all 4 services (Frontend, Backend, Database, AI)
5. ✅ Test frontend loads (http://localhost:3000)
6. ✅ Test backend responds (http://localhost:3001/health)
7. ✅ Create test user via seed or API
8. ✅ Test login flow
9. ✅ Test API endpoints with Postman
10. ✅ Push to Git
11. ✅ Proceed with COMPREHENSIVE_BUILD_PROMPT.md

---

END OF SETUP GUIDE

Run this in order and refer back when having issues.
