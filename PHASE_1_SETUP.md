# Phase 1: Core Infrastructure & Database Setup

This document outlines the setup and configuration for Phase 1 of the Real-Time Marketplace Ecosystem.

## Overview

Phase 1 establishes the foundational infrastructure for the real-time marketplace platform:

1. **PostgreSQL Database Schema** with Prisma ORM
2. **Redis Cache Layer** for session management and caching
3. **Environment Configuration** with comprehensive variable management
4. **S3-Compatible File Storage** for images and documents

## Completed Tasks

### Task 1.1: PostgreSQL Database Schema with Prisma ORM ✅

**Location:** `apps/api/prisma/schema.prisma`

**Models Implemented:**
- ✅ User (with role-based fields: FARMER, BUYER, ADMIN)
- ✅ Product (crop listings with quality grades)
- ✅ Order (with status tracking: PENDING → ACCEPTED → IN_TRANSIT → DELIVERED → COMPLETED)
- ✅ OrderTracking (delivery updates with location)
- ✅ Message (AgriChat with read receipts)
- ✅ Conversation (message threads between users)
- ✅ Payment (Razorpay integration fields)
- ✅ Rating (trust system with 1-5 stars)
- ✅ QualityScan (AI analysis results)
- ✅ Notification (real-time alerts)
- ✅ Favorite (saved farmers)

**Key Features:**
- PostgreSQL provider (switch from SQLite)
- Proper relationships with cascading deletes
- Performance indexes on frequently queried fields
- Enums for type safety (Role, Language, KycStatus, OrderStatus, etc.)
- JSON fields for flexible data storage

**Database Indexes:**
- User: email, role, reputationScore, district
- Product: farmerId, category, qualityGrade, isActive
- Order: farmerId, buyerId, status, orderNumber
- Message: conversationId, senderId, receiverId, isRead
- Notification: userId, isRead, type

### Task 1.2: Redis Cache Layer ✅

**Location:** `apps/api/src/services/redis.service.ts`

**Features Implemented:**
- Connection management with automatic retry
- Generic get/set operations with JSON serialization
- Session management (setSession, getSession, deleteSession)
- Product caching (cacheProduct, getCachedProduct, invalidateProductCache)
- User caching (cacheUser, getCachedUser, invalidateUserCache)
- TTL support for automatic expiration
- Batch operations (deleteMany)
- Health check functionality
- Error handling and logging

**Usage Example:**
```typescript
import { redisService } from './services/redis.service';

// Cache a product
await redisService.cacheProduct(productId, productData, 3600);

// Retrieve cached product
const cached = await redisService.getCachedProduct(productId);

// Invalidate cache
await redisService.invalidateProductCache(productId);
```

### Task 1.3: Environment Variables & Secrets Management ✅

**Location:** `apps/api/.env.example` and `apps/api/src/config/environment.ts`

**Environment Variables Configured:**

**Database:**
- `DATABASE_URL` - PostgreSQL connection string

**Server:**
- `PORT` - API server port (default: 3001)
- `NODE_ENV` - Environment (development/staging/production)
- `API_URL` - API base URL
- `FRONTEND_URL` - Frontend URL for CORS

**JWT Authentication:**
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `JWT_REFRESH_SECRET` - Refresh token secret
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: 30d)

**Redis:**
- `REDIS_URL` - Redis connection string
- `REDIS_PASSWORD` - Redis password (if required)
- `REDIS_DB` - Redis database number

**WebSocket (Socket.IO):**
- `WEBSOCKET_PORT` - WebSocket server port (default: 3002)
- `WEBSOCKET_CORS_ORIGIN` - CORS origin for WebSocket
- `WEBSOCKET_PING_INTERVAL` - Ping interval in ms
- `WEBSOCKET_PING_TIMEOUT` - Ping timeout in ms

**S3 Storage:**
- `S3_ENDPOINT` - S3 endpoint URL
- `S3_ACCESS_KEY_ID` - AWS access key
- `S3_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET_NAME` - S3 bucket name
- `S3_REGION` - AWS region
- `S3_USE_PATH_STYLE_URL` - Use path-style URLs (for MinIO)
- `S3_PUBLIC_URL` - Public URL for accessing files

**File Upload:**
- `MAX_FILE_SIZE` - Maximum file size (default: 10MB)
- `MAX_IMAGE_SIZE` - Maximum image size (default: 5MB)

**Payment Gateway (Razorpay):**
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret
- `RAZORPAY_WEBHOOK_SECRET` - Webhook secret

**AI Service:**
- `AI_SERVICE_URL` - Python FastAPI service URL
- `AI_SERVICE_TIMEOUT` - Timeout in ms
- `AI_QUALITY_ANALYSIS_ENABLED` - Enable/disable quality analysis

**Voice Service:**
- `VOICE_SERVICE_PROVIDER` - Provider (google, azure, etc.)
- `GOOGLE_CLOUD_PROJECT_ID` - Google Cloud project ID
- `GOOGLE_CLOUD_CREDENTIALS_PATH` - Path to credentials JSON

**Email Service:**
- `EMAIL_PROVIDER` - Provider (smtp, sendgrid, etc.)
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP port
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `EMAIL_FROM` - From email address
- `EMAIL_FROM_NAME` - From name

**Marketplace Configuration:**
- `DEFAULT_CURRENCY` - Currency (default: INR)
- `TAX_RATE` - Tax rate (default: 0.18 = 18%)
- `COMMISSION_RATE` - Commission rate (default: 0.05 = 5%)
- `MIN_ORDER_VALUE` - Minimum order value
- `MAX_ORDER_VALUE` - Maximum order value

**Quality Grades:**
- `QUALITY_GRADE_A_PLUS_MIN` - A+ threshold (default: 90)
- `QUALITY_GRADE_A_MIN` - A threshold (default: 75)
- `QUALITY_GRADE_B_PLUS_MIN` - B+ threshold (default: 60)
- `QUALITY_GRADE_B_MIN` - B threshold (default: 40)

**Feature Flags:**
- `FEATURE_REAL_TIME_ENABLED` - Enable real-time features
- `FEATURE_AI_QUALITY_ENABLED` - Enable AI quality analysis
- `FEATURE_VOICE_ENABLED` - Enable voice capabilities
- `FEATURE_PAYMENT_ENABLED` - Enable payment processing
- `FEATURE_NOTIFICATIONS_ENABLED` - Enable notifications

**Environment Configuration Service:**

Location: `apps/api/src/config/environment.ts`

```typescript
import { environmentConfig } from './config/environment';

// Get entire config
const config = environmentConfig.getConfig();

// Get specific value
const port = environmentConfig.get('port');

// Check environment
if (environmentConfig.isProduction()) {
  // Production-specific logic
}
```

### Task 1.4: File Storage Infrastructure ✅

**Location:** `apps/api/src/services/storage.service.ts`

**Features Implemented:**
- S3-compatible storage (AWS S3, MinIO, DigitalOcean Spaces)
- File upload with automatic naming
- Batch file uploads
- File deletion with URL parsing
- Presigned URL generation for temporary access
- File existence checking
- Specialized upload methods:
  - `uploadProductImages()` - Product images
  - `uploadQualityScanImage()` - Quality analysis images
  - `uploadInvoice()` - Invoice PDFs
  - `uploadChatAttachment()` - Chat files
- Health check functionality
- Error handling and logging

**Usage Example:**
```typescript
import { storageService } from './services/storage.service';

// Upload product images
const imageUrls = await storageService.uploadProductImages(files);

// Upload quality scan
const scanUrl = await storageService.uploadQualityScanImage(buffer, 'scan.jpg', 'image/jpeg');

// Generate presigned URL (valid for 1 hour)
const presignedUrl = await storageService.generatePresignedUrl(fileUrl, 3600);

// Delete file
await storageService.deleteFile(fileUrl);

// Health check
const isHealthy = await storageService.healthCheck();
```

## Additional Services Created

### Database Service
**Location:** `apps/api/src/config/database.ts`

Manages Prisma client lifecycle:
- Connection initialization
- Health checks
- Migration running
- Database seeding
- Data clearing (for testing)

### WebSocket Service
**Location:** `apps/api/src/config/websocket.ts`

Real-time communication infrastructure:
- Socket.IO server initialization
- User authentication and tracking
- Event broadcasting to users/rooms
- Online status management
- Specialized event emitters for different features

### Logger Utility
**Location:** `apps/api/src/utils/logger.ts`

Structured logging with context:
- Info, warn, error, debug levels
- Timestamp and context tracking
- JSON formatting support

## Setup Instructions

### 1. Install Dependencies

```bash
cd apps/api
npm install
```

### 2. Configure Environment

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Set Up PostgreSQL

```bash
# Create database
createdb marketplace_db

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/marketplace_db"
```

### 4. Set Up Redis

```bash
# Start Redis (if using Docker)
docker run -d -p 6379:6379 redis:latest

# Or install locally and start
redis-server
```

### 5. Set Up S3 Storage

**Option A: MinIO (Local Development)**
```bash
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"

# Create bucket
mc mb minio/marketplace
```

**Option B: AWS S3**
```bash
# Update .env with AWS credentials
S3_ENDPOINT="https://s3.amazonaws.com"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="your-bucket"
S3_REGION="us-east-1"
S3_USE_PATH_STYLE_URL=false
```

### 6. Run Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 7. Start Development Server

```bash
npm run dev
```

## Database Schema Diagram

```
User (1) ──→ (many) Product
User (1) ──→ (many) Order (as Farmer)
User (1) ──→ (many) Order (as Buyer)
User (1) ──→ (many) Message (as Sender)
User (1) ──→ (many) Message (as Receiver)
User (1) ──→ (many) Rating (as Giver)
User (1) ──→ (many) Rating (as Receiver)
User (1) ──→ (many) Notification
User (1) ──→ (many) Favorite

Product (1) ──→ (many) Order
Product (1) ──→ (many) QualityScan
Product (1) ──→ (many) Favorite

Order (1) ──→ (many) OrderTracking
Order (1) ──→ (1) Payment
Order (1) ──→ (1) Rating

Conversation (1) ──→ (many) Message
```

## Performance Considerations

### Indexes
- All foreign keys are indexed
- Frequently filtered fields have indexes
- Composite indexes for common query patterns

### Caching Strategy
- Product data cached for 1 hour
- User data cached for 1 hour
- Session data cached with 24-hour TTL
- Cache invalidation on updates

### Database Optimization
- Connection pooling via Prisma
- Query optimization with indexes
- Lazy loading of relations
- Pagination for large result sets

## Security Considerations

### Environment Variables
- Never commit `.env` file
- Use `.env.example` as template
- Rotate secrets regularly
- Use strong JWT secrets

### Database
- Use strong PostgreSQL passwords
- Enable SSL for database connections
- Regular backups
- Principle of least privilege for DB users

### File Storage
- Validate file types and sizes
- Scan uploads for malware
- Use presigned URLs for temporary access
- Implement access controls

### WebSocket
- Authenticate all connections
- Validate user permissions
- Rate limit events
- Sanitize message content

## Monitoring & Health Checks

### Health Check Endpoints (to be implemented in Phase 2)
- `/health` - Overall system health
- `/health/database` - Database connection
- `/health/redis` - Redis connection
- `/health/storage` - S3 storage
- `/health/websocket` - WebSocket server

### Metrics to Monitor
- Database query latency
- Redis hit/miss ratio
- S3 upload/download times
- WebSocket connection count
- Message delivery latency

## Next Steps (Phase 2)

Phase 2 will implement the backend services:
- Authentication Service
- Crop Management Service
- Order Management Service
- Chat Service (AgriChat)
- Payment Service
- Trust & Rating Service
- Notification Service
- Analytics Service
- Favorites Service

## Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -U user -d marketplace_db -h localhost

# Check Prisma connection
npm run db:generate
```

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping

# Check Redis logs
redis-cli info
```

### S3 Connection Issues
```bash
# Test S3 connection (MinIO)
mc ls minio/marketplace

# Check S3 credentials
aws s3 ls --profile default
```

### WebSocket Issues
```bash
# Check WebSocket port
netstat -an | grep 3002

# Enable debug logging
DEBUG=* npm run dev
```

## References

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
