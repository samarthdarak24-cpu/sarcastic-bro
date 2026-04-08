# 🚀 AgriVoice Platform - Complete Setup Guide

> Complete B2B agricultural marketplace with AI-powered quality detection

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** 18+ and npm/yarn
- **Python** 3.10+
- **PostgreSQL** 14+
- **Git**
- **Windows/Linux/Mac** OS

## ⚡ Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended)

```bash
# Clone repository
git clone <your-repo-url>
cd agrivoice-platform

# Run setup script
# Windows
setup-all.bat

# Linux/Mac
chmod +x setup-all.sh
./setup-all.sh
```

### Option 2: Manual Setup

Follow the detailed steps below.

---

## 🔧 Detailed Setup Instructions

### 1. Database Setup (PostgreSQL)

```bash
# Install PostgreSQL (if not installed)
# Windows: Download from https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql
# Mac: brew install postgresql

# Create database
psql -U postgres
CREATE DATABASE agrivoice;
CREATE USER agrivoice_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE agrivoice TO agrivoice_user;
\q
```

### 2. Backend API Setup

```bash
# Navigate to backend
cd apps/api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `apps/api/.env`:**

```env
# Database Configuration
DATABASE_URL="postgresql://agrivoice_user:your_secure_password@localhost:5432/agrivoice?schema=public"

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Socket.io
SOCKET_PORT=3002

# AI Service
AI_SERVICE_URL=http://localhost:8001

# N8N LLM Integration (Optional)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/agri-chat
N8N_API_KEY=your_n8n_api_key_here
ENABLE_N8N_CHAT=false

# External APIs (Optional)
WEATHER_API_KEY=your_weather_api_key
MARKET_DATA_API_KEY=your_market_api_key

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Blockchain (Optional)
BLOCKCHAIN_NETWORK=polygon-mumbai
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here

# Redis (Optional - for production)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

```bash
# Run database migrations
npx prisma generate
npx prisma migrate dev

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

**Backend will run on:** http://localhost:3001

### 3. Frontend Setup

```bash
# Navigate to frontend (open new terminal)
cd apps/web

# Install dependencies
npm install

# Create .env.local file
cp .env.production.example .env.local
```

**Edit `apps/web/.env.local`:**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002

# AI Service
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8001

# App Configuration
NEXT_PUBLIC_APP_NAME=AgriVoice
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=false
NEXT_PUBLIC_ENABLE_PAYMENTS=false

# N8N Integration (Optional)
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/agri-chat
NEXT_PUBLIC_ENABLE_N8N_CHAT=false

# Google Maps (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=
```

```bash
# Start frontend development server
npm run dev
```

**Frontend will run on:** http://localhost:3000

### 4. AI Service Setup (Quality Detection)

```bash
# Navigate to AI service (open new terminal)
cd apps/ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
```

**Create `apps/ai-service/.env`:**

```env
# AI Service Configuration
AI_SERVICE_PORT=8001
AI_SERVICE_HOST=0.0.0.0

# Model Configuration
YOLO_MODEL=yolov8n.pt
EFFICIENTNET_MODEL=efficientnet_b0

# Processing Configuration
MAX_WORKERS=4
BATCH_SIZE=32
GPU_ENABLED=false

# Redis (Optional - for queue management)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Blockchain
BLOCKCHAIN_NETWORK=polygon-mumbai
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com

# Logging
LOG_LEVEL=INFO
```

```bash
# Start AI service
python main.py

# Or use startup script
# Windows
start-ai-service.bat

# Linux/Mac
chmod +x start-ai-service.sh
./start-ai-service.sh
```

**AI Service will run on:** http://localhost:8001

---

## 🎯 Access the Application

### Main Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **AI Service:** http://localhost:8001
- **API Docs:** http://localhost:3001/api-docs
- **AI Docs:** http://localhost:8001/docs

### Default Login Credentials

**Farmer Account:**
- Email: `farmer@test.com`
- Password: `password123`

**Buyer Account:**
- Email: `buyer@test.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`

---

## 🧪 Testing

### Backend Tests
```bash
cd apps/api
npm test
npm run test:e2e
```

### Frontend Tests
```bash
cd apps/web
npm test
npm run test:e2e
```

### AI Service Tests
```bash
cd apps/ai-service
python test_api.py
```

---

## 📦 Production Build

### Backend
```bash
cd apps/api
npm run build
npm start
```

### Frontend
```bash
cd apps/web
npm run build
npm start
```

### AI Service
```bash
cd apps/ai-service
uvicorn main:app --host 0.0.0.0 --port 8001 --workers 4
```

---

## 🐳 Docker Setup (Alternative)

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Create `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: agrivoice
      POSTGRES_USER: agrivoice_user
      POSTGRES_PASSWORD: your_secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./apps/api
    ports:
      - "3001:3001"
      - "3002:3002"
    environment:
      DATABASE_URL: postgresql://agrivoice_user:your_secure_password@postgres:5432/agrivoice
      AI_SERVICE_URL: http://ai-service:8001
    depends_on:
      - postgres

  frontend:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
      NEXT_PUBLIC_AI_SERVICE_URL: http://localhost:8001
    depends_on:
      - backend

  ai-service:
    build: ./apps/ai-service
    ports:
      - "8001:8001"
    environment:
      AI_SERVICE_PORT: 8001

volumes:
  postgres_data:
```

---

## 🔥 Key Features

### 1. AI Quality Detection
- **Endpoint:** http://localhost:8001/quality-shield/bulk-scan
- **Upload:** Crop images for instant quality analysis
- **Results:** Grade, pricing, export readiness

### 2. Real-time Chat (AgriChat)
- **Location:** Farmer/Buyer Dashboard
- **Features:** AI-powered recommendations, market insights

### 3. Tender System
- **Location:** Farmer Dashboard → Tender Participation
- **Features:** Browse tenders, submit proposals, track status

### 4. Blockchain Traceability
- **Location:** Dashboard → Blockchain Trace
- **Features:** Track product journey, verify authenticity

### 5. Smart Sourcing
- **Location:** Buyer Dashboard → Smart Sourcing
- **Features:** AI-powered supplier matching, bulk orders

---

## 🛠️ Troubleshooting

### Issue: Database connection failed
```bash
# Check PostgreSQL is running
# Windows
services.msc (look for PostgreSQL)

# Linux
sudo systemctl status postgresql

# Mac
brew services list
```

### Issue: Port already in use
```bash
# Find and kill process
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

### Issue: AI Service not loading models
```bash
# Models will auto-download on first run
# Or manually download:
cd apps/ai-service
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
```

### Issue: Frontend build errors
```bash
cd apps/web
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📚 Documentation

- **Main README:** `README.md`
- **AI Quality Shield:** `AI_QUALITY_SHIELD_README.md`
- **Implementation Guide:** `IMPLEMENTATION_GUIDE.md`
- **Architecture:** `AI_QUALITY_SHIELD_ARCHITECTURE.md`
- **API Reference:** http://localhost:3001/api-docs

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd apps/web
vercel deploy
```

### Railway (Backend)
```bash
cd apps/api
railway up
```

### AWS/GCP/Azure (AI Service)
```bash
cd apps/ai-service
# Follow cloud provider documentation
```

---

## 🔐 Security Notes

### Production Checklist
- [ ] Change all default passwords
- [ ] Update JWT_SECRET with strong random string
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Configure firewall rules
- [ ] Use environment-specific .env files
- [ ] Enable logging and monitoring

---

## 📞 Support

### Documentation
- Setup Guide: This file
- API Docs: http://localhost:3001/api-docs
- AI Docs: http://localhost:8001/docs

### Testing
```bash
# Test backend
curl http://localhost:3001/api/health

# Test AI service
curl http://localhost:8001/health

# Test frontend
curl http://localhost:3000
```

---

## 🎉 Success!

If all services are running:
- ✅ Backend: http://localhost:3001
- ✅ Frontend: http://localhost:3000
- ✅ AI Service: http://localhost:8001

**You're ready to use AgriVoice Platform!**

Login with default credentials and explore the features.

---

## 📝 Quick Commands Reference

```bash
# Start all services (separate terminals)
cd apps/api && npm run dev
cd apps/web && npm run dev
cd apps/ai-service && python main.py

# Or use batch files
start-backend.bat
start-frontend.bat
cd apps/ai-service && start-ai-service.bat

# Run tests
cd apps/api && npm test
cd apps/web && npm test
cd apps/ai-service && python test_api.py

# Build for production
cd apps/api && npm run build
cd apps/web && npm run build
cd apps/ai-service && uvicorn main:app --workers 4
```

---

**Built with ❤️ for AgriVoice Platform**

**Empowering Farmers with Technology**
