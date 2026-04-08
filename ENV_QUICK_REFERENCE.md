# ⚡ Environment Variables - Quick Reference

## 📍 File Locations

```
apps/web/.env.local          → Frontend
apps/api/.env                → Backend API
apps/ai-service/.env         → AI Service
```

---

## 🎯 Minimum Required (Development)

### Frontend (apps/web/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001
```

### Backend (apps/api/.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/odop_connect
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3001
AI_SERVICE_URL=http://localhost:8001
```

### AI Service (apps/ai-service/.env)
```env
PORT=8001
YOLO_MODEL=yolov8n
```

---

## 🔥 Most Important Variables

| Service | Variable | Value |
|---------|----------|-------|
| Frontend | `NEXT_PUBLIC_API_URL` | `http://localhost:3001` |
| Frontend | `NEXT_PUBLIC_QUALITY_SHIELD_URL` | `http://localhost:8001` |
| Backend | `DATABASE_URL` | PostgreSQL connection string |
| Backend | `JWT_SECRET` | Strong random string |
| Backend | `PORT` | `3001` |
| AI Service | `PORT` | `8001` |

---

## 🚀 Quick Setup

```bash
# 1. Frontend
cd apps/web
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
echo "NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001" >> .env.local

# 2. Backend
cd apps/api
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/odop_connect" > .env
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env
echo "PORT=3001" >> .env
echo "AI_SERVICE_URL=http://localhost:8001" >> .env

# 3. AI Service
cd apps/ai-service
echo "PORT=8001" > .env
echo "YOLO_MODEL=yolov8n" >> .env
```

---

## 🎨 Feature Flags

### Enable Bulk Analysis
```env
# Frontend
NEXT_PUBLIC_ENABLE_BULK_ANALYSIS=true
```

### Enable Blockchain
```env
# Frontend
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
```

### Enable Real-time
```env
# Frontend
NEXT_PUBLIC_ENABLE_REALTIME=true
```

---

## 🔒 Security

### Generate Strong JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Never Commit
```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

---

## ✅ Verify Setup

```bash
# Check if files exist
ls apps/web/.env.local
ls apps/api/.env
ls apps/ai-service/.env

# Test services
curl http://localhost:3001/health
curl http://localhost:8001/health
```

---

## 🆘 Common Issues

### Frontend can't connect to backend
```env
# Make sure these match:
NEXT_PUBLIC_API_URL=http://localhost:3001  # Frontend
PORT=3001                                   # Backend
```

### AI Service not responding
```env
# Make sure these match:
NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001  # Frontend
PORT=8001                                              # AI Service
```

### Database connection failed
```env
# Check PostgreSQL is running:
DATABASE_URL=postgresql://postgres:password@localhost:5432/odop_connect
```

---

## 📚 Full Documentation

See `ENV_SETUP_GUIDE.md` for complete details.
