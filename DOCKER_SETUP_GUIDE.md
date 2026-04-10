# 🐳 Docker Setup Guide - Logistics Feature

## 🚀 Quick Start with Docker

Get the entire AgriTrust platform with logistics data running in minutes!

---

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 4GB RAM available
- Ports 3000, 3001, and 5432 available

---

## 🎯 Start Everything with One Command

```bash
# From the project root directory
docker-compose up -d
```

This will:
1. ✅ Start PostgreSQL database
2. ✅ Run database migrations
3. ✅ Seed the database with logistics data (3 entries)
4. ✅ Start the backend API (port 3001)
5. ✅ Start the frontend web app (port 3000)

---

## 📊 What's Included in the Seeded Data

### Logistics Entries (3 total)
- **1 DELIVERED** - Wheat order (1300kg) - Completed delivery
- **1 IN_TRANSIT** - Soybean order (900kg) - Currently at Indapur Hub
- **1 REQUESTED** - Onion order (500kg) - Waiting for driver assignment

### Users (8 total)
- **FPO Admin**: fpo@test.com / Test@1234
- **Farmers**: 5 farmers with crops
- **Buyers**: 2 buyers with wallets

### Other Data
- 10 crops listed
- 3 aggregated lots
- 3 orders with tracking
- Market price history (4320 records)
- Quality certificates
- Chat messages

---

## 🔍 Monitor the Services

### Check if all services are running
```bash
docker-compose ps
```

Expected output:
```
       Name                     Command               State           Ports
----------------------------------------------------------------------------------------
agritrust_api        docker-entrypoint.sh sh -c ...   Up      0.0.0.0:3001->4000/tcp
agritrust_db         docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp
agritrust_web        docker-entrypoint.sh node ...    Up      0.0.0.0:3000->3000/tcp
```

### View logs (all services)
```bash
docker-compose logs -f
```

### View logs (specific service)
```bash
# API logs
docker-compose logs -f api

# Database logs
docker-compose logs -f db

# Web logs
docker-compose logs -f web
```

---

## 🎨 Access the Application

### Frontend (Next.js)
- **URL**: http://localhost:3000
- **Status**: Hot reload enabled

### Backend API (Express)
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Status**: Auto-reload on file changes

### Database (PostgreSQL)
- **Host**: localhost
- **Port**: 5432
- **User**: postgres
- **Password**: postgres
- **Database**: agrivoice

---

## 🧪 Test the Logistics Feature

### 1. Login as FPO Admin
```
URL: http://localhost:3000/login
Email: fpo@test.com
Password: Test@1234
```

**Navigate to**: http://localhost:3000/fpo/logistics

You'll see:
- Dashboard with stats (3 total, 1 requested, 1 in transit, 1 delivered)
- All logistics entries with status
- Ability to assign driver to REQUESTED order
- Driver details for assigned orders

### 2. Login as Buyer
```
URL: http://localhost:3000/login
Email: buyer@test.com
Password: Test@1234
```

**Navigate to**: http://localhost:3000/buyer/tracking

You'll see:
- 2 incoming deliveries
- Live tracking map for IN_TRANSIT order
- Driver location at Indapur Hub
- Delivery timeline with events
- Confirm delivery button

### 3. Login as Farmer
```
URL: http://localhost:3000/login
Email: farmer@test.com
Password: Test@1234
```

**Navigate to**: http://localhost:3000/farmer/logistics

You'll see:
- Active shipments
- Request pickup form
- Status updates

---

## 🔌 Test API Endpoints

### Get FPO Token (Login)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fpo@test.com",
    "password": "Test@1234"
  }'
```

Copy the `accessToken` from the response.

### Get All Logistics (FPO)
```bash
curl http://localhost:3001/api/logistics/fpo \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Buyer Logistics
```bash
# First login as buyer@test.com to get token
curl http://localhost:3001/api/logistics/buyer \
  -H "Authorization: Bearer BUYER_TOKEN"
```

### Get Farmer Logistics
```bash
# First login as farmer@test.com to get token
curl http://localhost:3001/api/logistics/farmer \
  -H "Authorization: Bearer FARMER_TOKEN"
```

---

## 🛠️ Development Workflow

### Make Changes to Code

The Docker setup uses volume mounts, so changes are reflected immediately:

1. **Edit backend code**: `apps/api/src/**/*.ts`
   - Auto-restarts nodemon
   - No rebuild needed

2. **Edit frontend code**: `apps/web/src/**/*.tsx`
   - Next.js hot reload
   - Instant browser updates

3. **Edit Prisma schema**: `apps/api/prisma/schema.prisma`
   ```bash
   # Apply schema changes
   docker-compose exec api npx prisma migrate dev --name your_change_name
   
   # Regenerate client
   docker-compose exec api npx prisma generate
   ```

### Re-seed Database

If you want to reset and re-seed the database:

```bash
# Option 1: Re-run seed only
docker-compose exec api npx prisma db seed

# Option 2: Reset everything
docker-compose down -v
docker-compose up -d
```

⚠️ **Warning**: `docker-compose down -v` deletes all data!

---

## 📝 Useful Docker Commands

### Stop all services
```bash
docker-compose stop
```

### Start all services (after stop)
```bash
docker-compose start
```

### Stop and remove containers (keeps data)
```bash
docker-compose down
```

### Stop and remove everything (including data)
```bash
docker-compose down -v
```

### Rebuild services
```bash
docker-compose up -d --build
```

### Access API container shell
```bash
docker-compose exec api sh
```

### Access database container
```bash
docker-compose exec db psql -U postgres -d agrivoice
```

### Run Prisma Studio (Database GUI)
```bash
docker-compose exec api npx prisma studio
```
Then open: http://localhost:5555

---

## 🐛 Troubleshooting

### Port Already in Use

If you get port conflicts:

```bash
# Windows - Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432

# Kill the process
taskkill /PID <PID> /F
```

### Database Not Ready

If API fails to connect to database:

```bash
# Restart only the API (database should be ready)
docker-compose restart api
```

### Seed Errors

If seeding fails:

```bash
# Check logs
docker-compose logs api

# Fix the issue, then re-seed
docker-compose exec api npx prisma db seed
```

### Rebuild from Scratch

If something is broken:

```bash
# Stop everything
docker-compose down -v

# Remove any cached builds
docker system prune -f

# Start fresh
docker-compose up -d --build
```

### View Real-time Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

---

## 📦 Production Deployment

For production, use the production docker-compose file:

```bash
# Create production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

The production setup:
- Uses optimized builds
- Disables hot reload
- Sets NODE_ENV=production
- Uses environment variables from .env files

---

## 🎯 Logistics Feature Testing Checklist

After starting with Docker:

- [ ] Database seeded successfully (check logs)
- [ ] API responding at http://localhost:3001/health
- [ ] Frontend loading at http://localhost:3000
- [ ] Can login as FPO admin
- [ ] Can see 3 logistics entries in FPO dashboard
- [ ] Can login as buyer
- [ ] Can see tracking page with map
- [ ] Can login as farmer
- [ ] Can view farmer logistics

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Logistics Data Guide](./LOGISTICS_DATA_GUIDE.md)

---

## ✨ What's Different from Local Development

| Feature | Local | Docker |
|---------|-------|--------|
| Database | Manual setup | Auto-starts |
| Migrations | Manual run | Auto-runs |
| Seeding | Manual run | Auto-seeds |
| Hot Reload | npm run dev | Enabled via volumes |
| Environment | .env files | docker-compose env |
| Ports | Configurable | Fixed (3000, 3001, 5432) |

---

**Built with ❤️ for AgriTrust - Transforming Agricultural Logistics**
