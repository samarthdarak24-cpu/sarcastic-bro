# Real-Time Crop Scanner - Integration Guide

## Step 1: Register Routes in Backend

Add to `apps/api/src/app.ts`:

```typescript
import realtimeScanRoutes from './modules/realtime-scan/realtime-scan.routes';

// Add this with other route registrations
app.use('/api/realtime-scan', realtimeScanRoutes);
```

## Step 2: Setup WebSocket Handler

Add to `apps/api/src/index.ts` (where Socket.io is initialized):

```typescript
import { setupRealtimeScanSocket } from './modules/realtime-scan/realtime-scan.socket';

// After io initialization
setupRealtimeScanSocket(io);
```

## Step 3: Update Database Schema

Add to `apps/api/prisma/schema.prisma`:

```prisma
model ScanSession {
  sessionId    String   @id @unique
  userId       String   @db.VarChar(255)
  startTime    DateTime
  endTime      DateTime?
  status       String   @default("active")
  metadata     String?  @db.Text
  detections   Detection[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId])
  @@index([status])
}

model Detection {
  detectionId  String   @id @default(cuid())
  sessionId    String
  session      ScanSession @relation(fields: [sessionId], references: [sessionId], onDelete: Cascade)
  grade        String
  score        Int
  confidence   Int
  defects      String?  @db.Text
  metrics      String?  @db.Text
  timestamp    DateTime @default(now())
  createdAt    DateTime @default(now())

  @@index([sessionId])
  @@index([timestamp])
}
```

Run migrations:
```bash
cd apps/api
npx prisma migrate dev --name add_realtime_scan
```

## Step 4: Add Environment Variables

Add to `apps/api/.env`:

```
# Real-time Scan Configuration
REALTIME_SCAN_ENABLED=true
REALTIME_SCAN_MAX_SESSIONS=100
REALTIME_SCAN_FRAME_TIMEOUT=10000
REALTIME_SCAN_MODEL_TIMEOUT=5000
```

Add to `apps/web/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_REALTIME_SCAN_ENABLED=true
```

## Step 5: Install Dependencies

```bash
# Frontend
cd apps/web
npm install socket.io-client

# Backend
cd apps/api
npm install socket.io
```

## Step 6: Add to Farmer Dashboard

Edit `apps/web/src/app/farmer/dashboard/page.tsx`:

```typescript
import { RealtimeCropScanner } from '@/components/dashboard/farmer/RealtimeCropScanner';

export default function FarmerDashboard() {
  return (
    <div className="space-y-6">
      {/* Existing components */}
      
      {/* Add Real-Time Scanner */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Real-Time Quality Scanner</h2>
        <RealtimeCropScanner />
      </section>
    </div>
  );
}
```

## Step 7: Add Navigation Link

Edit `apps/web/src/lib/nav-config.tsx`:

```typescript
{
  title: 'Real-Time Scanner',
  href: '/realtime-scanner',
  icon: 'camera',
  description: 'Advanced AI crop quality detection'
}
```

## Step 8: Update Socket Service

Edit `apps/api/src/services/socketService.ts`:

```typescript
import { setupRealtimeScanSocket } from '../modules/realtime-scan/realtime-scan.socket';

export class SocketService {
  private io: any;

  initialize(io: any) {
    this.io = io;
    
    // Setup namespaces
    setupRealtimeScanSocket(io);
    
    // Other socket setup...
  }
}
```

## Step 9: Add Middleware

Create `apps/api/src/middleware/realtime-scan.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

export const realtimeScanMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add rate limiting for scan endpoints
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Add to request
  (req as any).scanUserId = userId;
  next();
};
```

## Step 10: Testing

### Test REST API

```bash
# Initialize session
curl -X POST http://localhost:3001/api/realtime-scan/session/init \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Get session stats
curl -X GET http://localhost:3001/api/realtime-scan/session/SESSION_ID/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get scan history
curl -X GET http://localhost:3001/api/realtime-scan/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test WebSocket

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001/realtime-scan');

socket.on('connect', () => {
  console.log('Connected');
  
  // Initialize scan
  socket.emit('scan:init', { userId: 'test-user' }, (response) => {
    console.log('Session:', response.sessionId);
  });
});
```

## Step 11: Error Handling

Add error handling in `apps/api/src/middleware/error.middleware.ts`:

```typescript
export const realtimeScanErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.message.includes('Session not found')) {
    return res.status(404).json({ error: 'Scan session not found' });
  }
  
  if (error.message.includes('Detection failed')) {
    return res.status(500).json({ error: 'Detection processing failed' });
  }
  
  next(error);
};
```

## Step 12: Monitoring & Logging

Add logging to `apps/api/src/modules/realtime-scan/realtime-scan.service.ts`:

```typescript
import logger from '../../utils/logger';

export class RealtimeScanService {
  async initializeSession(userId: string): Promise<string> {
    logger.info(`[RealtimeScan] Session initialized for user: ${userId}`);
    // ... rest of code
  }

  async endSession(sessionId: string): Promise<any> {
    logger.info(`[RealtimeScan] Session ended: ${sessionId}`);
    // ... rest of code
  }
}
```

## Step 13: Performance Optimization

### Enable Caching

```typescript
import redis from 'redis';

const redisClient = redis.createClient();

export class RealtimeScanService {
  async getSessionStats(sessionId: string): Promise<any> {
    // Try cache first
    const cached = await redisClient.get(`scan:${sessionId}:stats`);
    if (cached) return JSON.parse(cached);
    
    // Fetch and cache
    const stats = await this.calculateStats(sessionId);
    await redisClient.setex(`scan:${sessionId}:stats`, 60, JSON.stringify(stats));
    
    return stats;
  }
}
```

### Add Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many scan requests'
});

router.post('/frame/process', scanLimiter, async (req, res) => {
  // ... handler
});
```

## Step 14: Security

### Add CORS Configuration

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Add Input Validation

```typescript
import { z } from 'zod';

const ProcessFrameSchema = z.object({
  sessionId: z.string().min(1),
  imageBuffer: z.string().min(100)
});

router.post('/frame/process', async (req, res) => {
  const validated = ProcessFrameSchema.parse(req.body);
  // ... process
});
```

## Step 15: Deployment

### Docker Configuration

Create `apps/api/Dockerfile.realtime`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Environment Setup

```bash
# Production
NODE_ENV=production
REALTIME_SCAN_ENABLED=true
REALTIME_SCAN_MAX_SESSIONS=500
DATABASE_URL=postgresql://user:pass@host/db
REDIS_URL=redis://host:6379
```

## Step 16: Monitoring

### Add Health Check

```typescript
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    activeSessions: realtimeScanService.getActiveSessions(),
    uptime: process.uptime()
  });
});
```

### Add Metrics

```typescript
import prometheus from 'prom-client';

const scanCounter = new prometheus.Counter({
  name: 'realtime_scans_total',
  help: 'Total number of scans'
});

const detectionGauge = new prometheus.Gauge({
  name: 'realtime_detections_active',
  help: 'Active detections'
});
```

## Step 17: Testing Suite

Create `apps/api/src/modules/realtime-scan/__tests__/realtime-scan.test.ts`:

```typescript
import { realtimeScanService } from '../realtime-scan.service';

describe('RealtimeScanService', () => {
  it('should initialize session', async () => {
    const sessionId = await realtimeScanService.initializeSession('test-user');
    expect(sessionId).toBeDefined();
  });

  it('should process detection frame', async () => {
    const sessionId = await realtimeScanService.initializeSession('test-user');
    const detection = await realtimeScanService.processDetectionFrame(sessionId, {
      imageBuffer: Buffer.from('test'),
      timestamp: Date.now()
    });
    expect(detection.grade).toBeDefined();
  });

  it('should end session', async () => {
    const sessionId = await realtimeScanService.initializeSession('test-user');
    const result = await realtimeScanService.endSession(sessionId);
    expect(result.sessionId).toBe(sessionId);
  });
});
```

## Step 18: Documentation

Update main README:

```markdown
## Real-Time Crop Quality Scanner

Advanced AI-powered real-time crop quality detection system.

### Features
- 30 FPS real-time video streaming
- Multi-model AI detection (YOLOv8, EfficientNet, CNN, ViT)
- GPU-accelerated processing
- WebSocket real-time updates
- Quality grading and defect detection

### Quick Start
1. Navigate to `/realtime-scanner`
2. Allow camera access
3. Start scanning

### Documentation
- [Setup Guide](./REALTIME_SCAN_SETUP.md)
- [Technical Details](./REALTIME_SCAN_ADVANCED_TECH.md)
- [Code Examples](./REALTIME_SCAN_EXAMPLES.md)
```

## Step 19: Verification Checklist

- [ ] Routes registered in app.ts
- [ ] WebSocket handler setup in index.ts
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Component added to dashboard
- [ ] Navigation link added
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Tests passing
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Documentation updated
- [ ] Deployment configured

## Step 20: Go Live

```bash
# Build
npm run build

# Test
npm run test

# Deploy
npm run deploy

# Monitor
npm run monitor
```

## Support

For issues:
1. Check logs: `docker logs realtime-scan-api`
2. Check metrics: `http://localhost:3001/metrics`
3. Check health: `http://localhost:3001/health`
4. Review documentation in REALTIME_SCAN_*.md files

---

**Integration Complete!** 🎉

Your real-time crop quality scanner is now fully integrated and ready for production use.
