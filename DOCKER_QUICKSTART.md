# 🐳 Docker Quick Start - Logistics Feature

## 🚀 Get Started in 3 Steps

### Step 1: Start Docker
Make sure Docker Desktop is running on your machine.

### Step 2: Run the Start Script

**Windows:**
```bash
start-docker.bat
```

**Linux/Mac:**
```bash
chmod +x start-docker.sh
./start-docker.sh
```

**Or manually:**
```bash
docker-compose up -d
```

### Step 3: Access the App

🌐 **Frontend**: http://localhost:3000  
🔌 **Backend API**: http://localhost:3001  
🗄️ **Database**: localhost:5432

---

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **FPO Admin** | fpo@test.com | Test@1234 |
| **Buyer** | buyer@test.com | Test@1234 |
| **Farmer** | farmer@test.com | Test@1234 |

---

## 📦 Logistics Data (Pre-seeded)

The database comes with **3 logistics entries** ready to test:

### 1. ✅ DELIVERED - Wheat Order
- **Amount**: 1300kg
- **Route**: Nanded → Aurangabad
- **Driver**: Ramesh Kumar (9876543230)
- **Vehicle**: MH-31-AB-1234
- **Status**: Completed

### 2. 🚚 IN_TRANSIT - Soybean Order
- **Amount**: 900kg
- **Route**: Latur → Pune
- **Driver**: Suresh Patil (9876543231)
- **Vehicle**: MH-12-CD-5678
- **Current Location**: Indapur Hub
- **ETA**: 2 days

### 3. 📋 REQUESTED - Onion Order
- **Amount**: 500kg
- **Route**: Pune → Aurangabad
- **Driver**: Not assigned yet
- **Status**: Waiting for FPO to assign driver

---

## 🎯 Test the Logistics Feature

### For FPO Admin
1. Login with `fpo@test.com`
2. Go to: http://localhost:3000/fpo/logistics
3. You'll see:
   - Dashboard with 3 logistics entries
   - 1 REQUESTED (needs driver assignment)
   - 1 IN_TRANSIT (active delivery)
   - 1 DELIVERED (completed)
4. Click "Assign Driver" on the REQUESTED order

### For Buyer
1. Login with `buyer@test.com`
2. Go to: http://localhost:3000/buyer/tracking
3. You'll see:
   - 2 incoming deliveries
   - Live map showing driver location
   - Delivery timeline with events
   - Driver contact information

### For Farmer
1. Login with `farmer@test.com`
2. Go to: http://localhost:3000/farmer/logistics
3. You'll see:
   - Active shipments
   - Request pickup form
   - Status updates

---

## 🛠️ Common Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# API only
docker-compose logs -f api

# Web only
docker-compose logs -f web
```

### Stop Services
```bash
docker-compose stop
```

### Restart Services
```bash
docker-compose restart
```

### Reset Everything (⚠️ Deletes all data)
```bash
docker-compose down -v
docker-compose up -d
```

### Re-seed Database
```bash
docker-compose exec api npx prisma db seed
```

### Verify Logistics Data
```bash
docker-compose exec api npx ts-node verify-logistics.ts
```

### Open Prisma Studio (Database GUI)
```bash
docker-compose exec api npx prisma studio
```
Then visit: http://localhost:5555

---

## 🔌 Test API Endpoints

### Get FPO Token
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "fpo@test.com", "password": "Test@1234"}'
```

### Get All Logistics (FPO)
```bash
curl http://localhost:3001/api/logistics/fpo \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Buyer Logistics
```bash
curl http://localhost:3001/api/logistics/buyer \
  -H "Authorization: Bearer BUYER_TOKEN"
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Wait for database to be ready
docker-compose ps

# Restart API
docker-compose restart api
```

### Seed Errors
```bash
# View error logs
docker-compose logs api

# Fix issue and re-seed
docker-compose exec api npx prisma db seed
```

### Complete Reset
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

---

## 📊 Service Architecture

```
┌─────────────────┐
│   Frontend      │  Port 3000
│   (Next.js)     │  Hot reload enabled
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │  Port 3001 (mapped from 4000)
│   (Express)     │  Auto-seeded with data
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │  Port 5432
│   (Database)    │  Persistent volume
└─────────────────┘
```

---

## 📝 What's Configured

✅ **Auto-migration**: Database schema applied on startup  
✅ **Auto-seeding**: Logistics data loaded automatically  
✅ **Hot reload**: Code changes reflected immediately  
✅ **Health checks**: Database readiness verification  
✅ **Volume mounts**: Local code synced to containers  
✅ **Environment vars**: All config set in docker-compose.yml  

---

## 📚 Documentation

- [Docker Setup Guide](./DOCKER_SETUP_GUIDE.md) - Complete Docker documentation
- [Logistics Data Guide](./LOGISTICS_DATA_GUIDE.md) - Logistics feature details
- [Logistics Implementation](./LOGISTICS_IMPLEMENTATION.md) - Technical implementation

---

## 🎉 You're Ready!

The logistics feature is fully set up with Docker. Start exploring:

1. ✅ Database seeded with 3 logistics entries
2. ✅ All services running
3. ✅ Login credentials ready
4. ✅ API endpoints available
5. ✅ Frontend pages accessible

**Happy testing! 🚚📦**
