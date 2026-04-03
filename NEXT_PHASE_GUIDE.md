# 🚀 NEXT PHASE - QUICK START GUIDE

## Where We Left Off ✅

You have a fully functional backend with:
- ✅ 25+ database models
- ✅ 45+ API endpoints  
- ✅ Authentication & KYC system
- ✅ Order, Message, Proposal, Review, Notification systems
- ✅ Product management
- ✅ Proper error handling & validation

## What's Next? 🎯

### PHASE 1: Advanced APIs (3 hours) [PRIORITY 1]

#### 1. Contract Management API
**Create:** `src/modules/contract/`
```
- contract.controller.ts
- contract.service.ts
- contract.routes.ts
- contract.validation.ts

Endpoints:
POST   /contracts              (Create/Upload contract)
GET    /contracts              (List contracts)
GET    /contracts/:id          (Get details + PDF)
PUT    /contracts/:id/sign     (Digital signature)
DELETE /contracts/:id          (Delete)
POST   /contracts/:id/generate-qr
POST   /contracts/:id/verify-hash
POST   /contracts/:id/export-pdf
```

#### 2. Tender Management API
**Create:** `src/modules/tender/` (mostly exists, enhance it)
```
Endpoints to add:
POST   /tenders/:id/apply     (Apply to tender)
GET    /tenders/:id/applications
PUT    /tenders/:id/award     (Award tender)
```

#### 3. Logistics & Shipment API
**Create:** `src/modules/logistics/` 
```
Endpoints:
GET    /logistics/providers    (List logistics providers)
POST   /logistics/book         (Book shipment)
GET    /logistics/:id/tracking (Track shipment)
GET    /logistics/myshipping   (My shipments)
```

#### 4. Sample Request API
**Create:** `src/modules/sampleRequest/`
```
Endpoints:
POST   /samples                (Request sample)
GET    /samples                (List requests)
PUT    /samples/:id/status     (Update status)
POST   /samples/:id/feedback   (Submit feedback)
```

#### 5. CSV/Export Service
**Create:** `src/services/csvService.ts` and endpoints:
```
POST   /export/orders         (Export orders to CSV)
POST   /export/products       (Export products to CSV)
POST   /export/analytics      (Export analytics)
```

---

### PHASE 2: Socket.IO Real-time (2 hours) [PRIORITY 2]

**File:** `src/config/socket.ts` (already exists, enhance it)

```typescript
// Add these events:

// Messages
socket.on('message:send', (data) => {
  // Broadcast to recipient
  io.to(recipientRoom).emit('message:received', data);
});

// Orders
socket.on('order:created', (data) => {
  // Notify farmer
}); 

socket.on('order:status-changed', (data) => {
  // Notify both parties
});

// Notifications
socket.on('notification:create', (data) => {
  // Send to user
});

// Presence
socket.on('user:online', (userId) => {
  // Track online users
});
```

**Frontend:** Create `src/hooks/useSocket.ts`
```typescript
export const useSocket = () => {
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);
  
  return socket;
};
```

---

### PHASE 3: AI Service (FastAPI) (2 hours) [PRIORITY 3]

**Location:** `apps/ai-service/main.py`

```python
from fastapi import FastAPI
import uvicorn

app = FastAPI()

# Endpoints:

@app.post("/quality-grade")
async def grade_product(image: UploadFile):
    """AI quality grading with heatmap"""
    return {
        "grade": "A",
        "score": 92.5,
        "defects": [],
        "heatmap_url": "/heatmap.png"
    }

@app.post("/recommendations")
async def get_recommendations(farmer_id: str):
    """Buyer recommendations for farmer"""
    return {"buyers": [...]}

@app.post("/forecast")
async def forecast_demand(product_id: str, months: int):
    """Demand forecasting"""
    return {"forecast_data": [...]}

@app.post("/pest-detect")
async def detect_pests(image: UploadFile):
    """Pest detection in crops"""
    return {"pest_type": "...", "severity": "high"}

@app.post("/yield-predict")
async def predict_yield(crop_data: dict):
    """Yield prediction model"""
    return {"predicted_yield": 1000}
```

**Run:**
```bash
cd apps/ai-service
python main.py
# Or: uvicorn main:app --reload --port 8000
```

---

### PHASE 4: Complete Buyer Dashboard (3 hours) [PRIORITY 4]

**Missing Components in `apps/web/src/app/(buyer)/`:**

```
1. search/page.tsx           - Product search with filters
2. supplier-recommendations/ - AI supplier matching
3. rfq/page.tsx             - RFQ management
4. supplier-comparison/      - Compare suppliers
5. inventory/page.tsx        - Inventory management
6. analytics/page.tsx        - Browse analytics
```

**Key Components to Create:**
```
- SearchProductCard.tsx
- SupplierMatchCard.tsx
- RFQForm.tsx
- SupplierComparison.tsx
- InventoryTable.tsx
- AnalyticsDashboard.tsx
```

---

### PHASE 5: Frontend Integration (2 hours) [PRIORITY 5]

**In `apps/web/src/`:

1. Update API client URLs
2. Create Redux slices for new modules
3. Connect forms to backend APIs
4. Add real-time updates via Socket.IO
5. Add error handling on frontend

**Key Files to Update:**
```
- services/api.ts (update endpoints)
- store/authSlice.ts
- Add: store/orderSlice.ts
- Add: store/messageSlice.ts
- Add: store/proposalSlice.ts
- Add: hooks/useSocket.ts
```

---

## File Structure for New Modules

```typescript
// Template for each new API module:

// 1. validation.ts
import { z } from "zod";
export const createSchema = z.object({
  // validation rules
});

// 2. service.ts
export class Service {
  static async create(userId: string, data: CreateInput) {
    // business logic
  }
}

// 3. controller.ts
export class Controller {
  static async create(req: Request, res: Response) {
    const data = createSchema.parse(req.body);
    const result = await Service.create(req.user!.userId, data);
    return sendCreated(res, result);
  }
}

// 4. routes.ts
const router = Router();
router.use(authMiddleware);
router.post("/", asyncHandler(Controller.create));
export default router;
```

---

## Database Migrations

When adding new fields/models:

```bash
# Create migration
npx prisma migrate dev --name add_feature_name

# Push to database
npx prisma db push

# Generate client
npx prisma generate

# View data
npx prisma studio
```

---

## Testing Each New Feature

### API Testing
```bash
# Install REST Client extension in VS Code
# Create .http files to test endpoints

POST http://localhost:3001/contracts
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": "value"
}
```

### Database Testing
```bash
# Use Prisma Studio
npx prisma studio  # Opens web UI for database

# Or write test queries directly
```

---

## Common Issues & Solutions

### Issue: Type errors after schema changes
**Solution:**
```bash
npx prisma generate
npm run build
```

### Issue: Socket.IO not connecting
**Solution:** Check CORS settings in `src/config/socket.ts`

### Issue: File uploads not working
**Solution:** Create upload directories:
```bash
mkdir -p apps/api/uploads/images
mkdir -p apps/api/uploads/kyc
mkdir -p apps/api/uploads/general
```

### Issue: JWT token expired
**Solution:** This is expected - use refresh endpoint to get new token

---

## Performance Tips

1. **Add pagination** to all list endpoints (already done)
2. **Use indexes** on frequently queried fields (already in schema)
3. **Implement caching** with Redis (future)
4. **Batch operations** for bulk updates
5. **Compress files** before upload

---

## Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] File upload directories created
- [ ] CORS configured properly
- [ ] JWT secrets changed for production
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] SSL certificates installed
- [ ] Backups configured
- [ ] Monitoring set up

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start backend
npm run build            # Build for production
npx prisma studio       # View database

# Database
npx prisma migrate dev   # Create migration
npx prisma db push       # Push changes
npx prisma generate      # Generate client

# Testing
npm test                 # Run tests
npm run test:watch      # Watch mode

# Deployment
npm run build            # Production build
npm start                # Run production
docker build .          # Build Docker image
docker run -p 3001:3001 odop-api  # Run container
```

---

## Documentation URLs

- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js](https://expressjs.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Socket.IO](https://socket.io/docs)
- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated:** April 3, 2026  
**Estimated Time to Complete:** 10-15 more hours  
**Current Status:** Ready for Advanced APIs Phase

Good luck! 🚀
