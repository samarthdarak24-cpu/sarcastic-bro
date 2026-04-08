# 🔧 Environment Variables Setup Guide

Complete guide for configuring all environment variables in the ODOP Connect project.

---

## 📁 Environment Files Structure

```
project-root/
├── .env.example                    # Root example (reference only)
├── apps/
│   ├── web/
│   │   └── .env.local             # Frontend environment variables
│   ├── api/
│   │   └── .env                   # Backend API environment variables
│   └── ai-service/
│       └── .env                   # AI Service environment variables
```

---

## 🚀 Quick Setup (Development)

### 1. Frontend (.env.local)
```bash
cd apps/web
cp .env.local.example .env.local
```

**Minimum Required:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001
```

### 2. Backend API (.env)
```bash
cd apps/api
cp .env.example .env
```

**Minimum Required:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/odop_connect
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3001
AI_SERVICE_URL=http://localhost:8001
```

### 3. AI Service (.env)
```bash
cd apps/ai-service
cp .env.example .env
```

**Minimum Required:**
```env
HOST=0.0.0.0
PORT=8001
YOLO_MODEL=yolov8n
EFFICIENTNET_MODEL=efficientnet_b0
```

---

## 🔑 Critical Variables (Must Configure)

### Frontend (apps/web/.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |
| `NEXT_PUBLIC_QUALITY_SHIELD_URL` | AI Service URL | `http://localhost:8001` |

### Backend (apps/api/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | JWT signing key | `long-random-string-here` |
| `PORT` | Server port | `3001` |
| `AI_SERVICE_URL` | AI Service URL | `http://localhost:8001` |

### AI Service (apps/ai-service/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Service port | `8001` |
| `YOLO_MODEL` | YOLOv8 model | `yolov8n` |
| `EFFICIENTNET_MODEL` | EfficientNet model | `efficientnet_b0` |

---

## 🎯 Feature-Specific Configuration

### 1. Bulk Crop Analysis (AI Quality Shield)

**Frontend:**
```env
NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001
NEXT_PUBLIC_ENABLE_BULK_ANALYSIS=true
```

**AI Service:**
```env
YOLO_MODEL=yolov8n
MAX_DETECTIONS=100
DETECTION_CONFIDENCE=0.25
MIN_GOOD_QUALITY_SCORE=75
```

### 2. Payment Processing (Razorpay)

**Backend:**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

**Frontend:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### 3. Real-time Features (Socket.io)

**Frontend:**
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_REALTIME=true
```

**Backend:**
```env
REDIS_URL=redis://localhost:6379
```

### 4. AI Chat (N8N Integration)

**Frontend:**
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:3001/api/n8n/chat
```

**Backend:**
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat
OPENAI_API_KEY=sk-xxxxx
```

### 5. Blockchain Features

**Backend:**
```env
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your-api-key
BLOCKCHAIN_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
BLOCKCHAIN_PRIVATE_KEY=your_private_key
```

**Frontend:**
```env
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
```

### 6. Email Notifications

**Backend:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@odopconnect.com
```

### 7. Cloud Storage (AWS S3)

**Backend:**
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=odop-connect-uploads
```

---

## 🔒 Security Best Practices

### 1. JWT Secret Generation
```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Never Commit .env Files
```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo "apps/*/.env" >> .gitignore
echo "apps/*/.env.local" >> .gitignore
```

### 3. Use Different Secrets Per Environment
- Development: Simple secrets for testing
- Staging: Strong secrets, similar to production
- Production: Maximum strength, rotated regularly

### 4. Environment-Specific Values
```env
# Development
DATABASE_URL=postgresql://localhost:5432/odop_dev

# Production
DATABASE_URL=postgresql://prod-server:5432/odop_prod
```

---

## 🌍 Environment-Specific Setup

### Development
```env
NODE_ENV=development
DEBUG=true
ENABLE_API_DOCS=true
LOG_LEVEL=debug
```

### Staging
```env
NODE_ENV=staging
DEBUG=false
ENABLE_API_DOCS=true
LOG_LEVEL=info
```

### Production
```env
NODE_ENV=production
DEBUG=false
ENABLE_API_DOCS=false
LOG_LEVEL=error
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## 🔧 Optional Services Configuration

### Redis (Caching & Sessions)
```env
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
```

### Google Maps
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Analytics
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Weather API
```env
WEATHER_API_KEY=your_weather_api_key
```

### Market Data API
```env
MARKET_DATA_API_KEY=your_market_data_api_key
```

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend
**Solution:**
```env
# Check these match
# Frontend:
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend:
PORT=3001
```

### Issue: AI Service not responding
**Solution:**
```env
# Check these match
# Frontend:
NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001

# AI Service:
PORT=8001
HOST=0.0.0.0
```

### Issue: Database connection failed
**Solution:**
```env
# Verify PostgreSQL is running
# Check connection string format:
DATABASE_URL=postgresql://username:password@host:port/database

# Test connection:
psql postgresql://username:password@host:port/database
```

### Issue: JWT authentication failing
**Solution:**
```env
# Ensure JWT_SECRET is set and same across restarts
JWT_SECRET=your-super-secret-jwt-key-change-this

# Check token expiration
JWT_EXPIRES_IN=7d
```

---

## 📋 Environment Variables Checklist

### Before Starting Development
- [ ] All .env files created from examples
- [ ] Database URL configured
- [ ] JWT secret generated
- [ ] Service URLs match ports
- [ ] AI Service models configured

### Before Deploying to Production
- [ ] All secrets changed from defaults
- [ ] Strong JWT secret generated
- [ ] Database URL points to production
- [ ] NODE_ENV set to production
- [ ] Debug mode disabled
- [ ] API docs disabled
- [ ] Error tracking configured (Sentry)
- [ ] Payment gateway in live mode
- [ ] Email service configured
- [ ] Cloud storage configured
- [ ] SSL certificates installed
- [ ] CORS origins restricted

---

## 🚀 Quick Start Commands

### Setup All Environments
```bash
# Root
cp .env.example .env

# Frontend
cd apps/web
cp .env.local.example .env.local

# Backend
cd apps/api
cp .env.example .env

# AI Service
cd apps/ai-service
cp .env.example .env
```

### Verify Configuration
```bash
# Check frontend env
cd apps/web
cat .env.local | grep NEXT_PUBLIC

# Check backend env
cd apps/api
cat .env | grep -E "DATABASE_URL|JWT_SECRET|PORT"

# Check AI service env
cd apps/ai-service
cat .env | grep -E "PORT|YOLO_MODEL"
```

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [AWS S3 Setup](https://docs.aws.amazon.com/s3/)

---

## ✅ Verification

After setup, verify everything works:

```bash
# 1. Start all services
npm run dev:all

# 2. Check health endpoints
curl http://localhost:3001/health
curl http://localhost:8001/health

# 3. Open frontend
open http://localhost:3000

# 4. Test bulk scanner
open http://localhost:3000/bulk-scanner
```

---

## 🆘 Need Help?

If you encounter issues:
1. Check this guide first
2. Verify all .env files exist
3. Ensure services are running
4. Check logs for errors
5. Refer to service-specific documentation

**All environment variables are now configured and documented!** 🎉
