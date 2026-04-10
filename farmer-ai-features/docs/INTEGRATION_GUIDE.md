# AI Features Integration Guide

Complete step-by-step guide to integrate AI Quality Scan and AI Chatbot features into your farmer dashboard.

---

## 📋 Prerequisites

### Required Software
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for database)
- AI Service running on port 8001 (optional, has fallback)
- N8N with LLM integration (for chatbot)

### Required Dependencies
```json
{
  "dependencies": {
    "framer-motion": "^10.x",
    "lucide-react": "^0.x",
    "react-hot-toast": "^2.x",
    "axios": "^1.x",
    "@prisma/client": "^5.x"
  }
}
```

---

## 🚀 Step-by-Step Integration

### Step 1: Install Dependencies

```bash
# Navigate to your frontend directory
cd apps/web

# Install required packages
npm install framer-motion lucide-react react-hot-toast

# Navigate to your backend directory
cd ../api

# Install required packages (if not already installed)
npm install axios @prisma/client
```

---

### Step 2: Copy Frontend Files

#### 2.1 Copy Components
```bash
# From the farmer-ai-features directory
cp frontend/components/AIQualityShield.tsx <your-project>/apps/web/src/components/dashboard/farmer/
cp frontend/components/AIQualityShieldPremium.tsx <your-project>/apps/web/src/components/dashboard/farmer/
cp frontend/components/FloatingAIChatbot.tsx <your-project>/apps/web/src/components/ui/
```

#### 2.2 Copy Configuration Files
```bash
cp frontend/config/apiConfig.ts <your-project>/apps/web/src/config/
cp frontend/config/n8n.ts <your-project>/apps/web/src/config/
```

---

### Step 3: Copy Backend Files

#### 3.1 Copy Controller and Service
```bash
# Copy quality controller
cp backend/controllers/farmer-quality.controller.ts <your-project>/apps/api/src/modules/farmer/

# Copy quality service
cp backend/services/farmer-quality.service.ts <your-project>/apps/api/src/modules/farmer/
```

#### 3.2 Update Route Registration

Add to your `apps/api/src/app.ts`:

```typescript
import farmerQualityRoutes from './modules/farmer/farmer-quality.controller';

// Add this line with other routes
app.use('/api/farmers', farmerQualityRoutes);
```

---

### Step 4: Database Setup

#### 4.1 Add Prisma Schema

Add to your `schema.prisma`:

```prisma
model QualityScan {
  id          String   @id @default(cuid())
  farmerId    String
  productId   String?
  imageUrl    String
  grade       String
  score       Int
  defects     Int
  freshness   Int
  color       Int
  size        Int
  createdAt   DateTime @default(now())
  
  farmer      User     @relation(fields: [farmerId], references: [id])
  product     Product? @relation(fields: [productId], references: [id])
  
  @@index([farmerId])
  @@index([productId])
}

model ChatMessage {
  id        String   @id @default(cuid())
  userId    String
  role      String   // "user" or "assistant"
  content   String   @db.Text
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
  
  @@index([userId])
}
```

#### 4.2 Run Migration

```bash
cd apps/api
npx prisma migrate dev --name add_ai_features
npx prisma generate
```

---

### Step 5: Environment Configuration

#### 5.1 Frontend Environment

Create or update `apps/web/.env.local`:

```bash
# Copy from env-examples/.env.frontend.example
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_QUALITY_SCAN_URL=http://localhost:8000
NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
NEXT_PUBLIC_ENABLE_AI_CHAT=true
```

#### 5.2 Backend Environment

Create or update `apps/api/.env`:

```bash
# Copy from env-examples/.env.backend.example
AI_SERVICE_URL=http://localhost:8001
QUALITY_SCAN_SERVICE_URL=http://localhost:8000
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

---

### Step 6: Integrate into Farmer Dashboard

#### 6.1 Import Components

In your farmer dashboard page (e.g., `apps/web/src/app/farmer/dashboard/page.tsx`):

```tsx
import AIQualityShield from "@/components/dashboard/farmer/AIQualityShield";
import FloatingAIChatbot from "@/components/ui/FloatingAIChatbot";
```

#### 6.2 Add to Dashboard Layout

```tsx
export default function FarmerDashboard() {
  const [userName, setUserName] = useState("Farmer Name");
  
  return (
    <div>
      {/* Your existing dashboard content */}
      
      {/* Add AI Quality Shield as a section */}
      <section id="ai-quality">
        <AIQualityShield />
      </section>
      
      {/* Add Floating Chatbot (appears on all pages) */}
      <FloatingAIChatbot 
        userRole="FARMER" 
        userName={userName} 
      />
    </div>
  );
}
```

#### 6.3 Add Navigation Item (Optional)

```tsx
const navigationItems = [
  // ... existing items
  {
    id: 'ai-quality',
    label: 'AI Quality Scan',
    icon: <Sparkles />,
    href: '/farmer/dashboard#ai-quality'
  }
];
```

---

### Step 7: Setup N8N Chatbot (Optional)

#### 7.1 Install N8N

```bash
npm install -g n8n
```

#### 7.2 Create N8N Workflow

1. Start N8N: `n8n start`
2. Open http://localhost:5678
3. Create new workflow:
   - Add "Webhook" node (trigger)
   - Add "OpenAI" or "Ollama" node (LLM)
   - Add "Respond to Webhook" node
4. Configure webhook URL
5. Copy webhook URL to environment variables

#### 7.3 Test Chatbot

```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What crops should I plant?",
    "userRole": "farmer",
    "userName": "Test Farmer"
  }'
```

---

### Step 8: Setup AI Quality Service (Optional)

#### 8.1 Using Mock Service (Default)

The service automatically falls back to mock analysis if AI service is unavailable.

#### 8.2 Using Real AI Service

If you have an AI service:

1. Ensure it's running on port 8001
2. Endpoint should be: `POST /quality-shield/scan`
3. Request format:
```json
{
  "imageUrl": "base64_or_url"
}
```
4. Response format:
```json
{
  "grade": "A+",
  "score": 95,
  "defects": 2,
  "freshness": 90,
  "color": 95,
  "size": 88,
  "recommendations": ["..."]
}
```

---

## 🧪 Testing

### Test AI Quality Scan

```typescript
// In your browser console or test file
const testQualityScan = async () => {
  const response = await fetch('/api/farmers/quality/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: JSON.stringify({
      imageUrl: 'data:image/jpeg;base64,...'
    })
  });
  
  const result = await response.json();
  console.log('Quality Analysis:', result);
};
```

### Test Chatbot

```typescript
const testChatbot = async () => {
  const response = await fetch('/api/n8n/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Hello, I need help with my crops',
      userRole: 'farmer',
      userName: 'Test Farmer'
    })
  });
  
  const result = await response.json();
  console.log('Chat Response:', result);
};
```

---

## 🎨 Customization

### Customize Colors

Edit `apps/web/src/config/n8n.ts`:

```typescript
export const n8nConfig = {
  colors: {
    primaryColor: '#10b981', // Change to your brand color
    accentColor: '#059669',
    // ... other colors
  }
};
```

### Customize AI Quality Shield

Edit `AIQualityShieldPremium.tsx`:

```tsx
// Change gradient colors
className="bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-600"

// Change to your preferred colors
className="bg-gradient-to-br from-green-600 via-emerald-600 to-green-600"
```

---

## 🐛 Troubleshooting

### Issue: AI Quality Scan not working

**Solution:**
1. Check if AI service is running: `curl http://localhost:8001/health`
2. Check environment variables are set correctly
3. Check browser console for errors
4. Verify authentication token is valid

### Issue: Chatbot not responding

**Solution:**
1. Check N8N is running: `curl http://localhost:5678`
2. Verify webhook URL is correct
3. Check N8N workflow is activated
4. Check backend logs for errors

### Issue: Images not uploading

**Solution:**
1. Check file size (should be < 10MB)
2. Verify image format (PNG, JPG supported)
3. Check Cloudinary configuration (if using)
4. Check browser console for errors

### Issue: Database errors

**Solution:**
1. Run migrations: `npx prisma migrate dev`
2. Generate Prisma client: `npx prisma generate`
3. Check database connection string
4. Verify database is running

---

## 📊 Monitoring

### Check Service Health

```bash
# Check main API
curl http://localhost:3001/health

# Check AI Quality Service
curl http://localhost:8001/health

# Check N8N
curl http://localhost:5678/healthz
```

### View Logs

```bash
# Backend logs
cd apps/api
npm run dev

# Frontend logs
cd apps/web
npm run dev
```

---

## 🚀 Production Deployment

### Frontend

```bash
cd apps/web
npm run build
npm run start
```

### Backend

```bash
cd apps/api
npm run build
npm run start:prod
```

### Environment Variables

Ensure all production environment variables are set:
- Use HTTPS URLs
- Set secure JWT secrets
- Configure production database
- Set up proper CORS origins

---

## 📚 Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [N8N Documentation](https://docs.n8n.io/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

## 🆘 Support

If you encounter issues:
1. Check this guide thoroughly
2. Review the main project README
3. Check component source code for inline documentation
4. Review API logs for error messages

---

## ✅ Integration Checklist

- [ ] Dependencies installed
- [ ] Frontend components copied
- [ ] Backend files copied
- [ ] Database schema updated
- [ ] Migrations run
- [ ] Environment variables configured
- [ ] Components integrated into dashboard
- [ ] N8N workflow created (optional)
- [ ] AI service configured (optional)
- [ ] Testing completed
- [ ] Documentation reviewed

---

**Congratulations!** 🎉 You've successfully integrated AI Quality Scan and AI Chatbot features into your farmer dashboard.
