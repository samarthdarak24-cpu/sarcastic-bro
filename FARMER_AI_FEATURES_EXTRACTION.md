# Farmer Dashboard AI Features Extraction Guide

## Overview
This document lists all files required to integrate **AI Quality Scan** and **AI Chatbot** features into the farmer dashboard.

---

## 🎯 Features to Extract

### 1. AI Quality Scan Feature
- **Purpose**: Upload crop images for instant AI-powered quality analysis
- **Functionality**: 
  - Image upload
  - AI analysis (grade, score, defects, freshness, color, size)
  - Quality certification generation
  - Real-time results display

### 2. AI Chatbot Feature
- **Purpose**: Floating AI assistant for real-time help
- **Functionality**:
  - Chat interface with AI
  - Voice synthesis (text-to-speech)
  - Context-aware responses based on user role
  - Integration with n8n webhook

---

## 📁 Required Files

### Frontend Components

#### AI Quality Scan Components
```
apps/web/src/components/dashboard/farmer/AIQualityShield.tsx
apps/web/src/components/dashboard/farmer/AIQualityShieldPremium.tsx
```

**Dependencies:**
- framer-motion (animations)
- lucide-react (icons)
- react-hot-toast (notifications)

**Features:**
- Image upload with preview
- AI analysis with loading states
- Results display with metrics (grade, score, freshness, color, size, defects)
- Animated progress bars
- Responsive design

#### AI Chatbot Component
```
apps/web/src/components/ui/FloatingAIChatbot.tsx
```

**Dependencies:**
- framer-motion (animations)
- lucide-react (icons)

**Features:**
- Floating chat button
- Expandable chat window
- Message history
- Text-to-speech for AI responses
- Role-based theming (FARMER/BUYER)
- Integration with n8n API

---

### Backend API Routes

#### Quality Analysis API
```
apps/api/src/modules/farmer/farmer-new.controller.ts
apps/api/src/modules/farmer/farmer.service.ts
```

**Endpoint:**
```
POST /api/farmers/quality/analyze
```

**Request Body:**
```json
{
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "grade": "A+",
  "score": 95,
  "defects": 2,
  "freshness": 90,
  "color": 95,
  "size": 88
}
```

#### Chat API
**Endpoint:**
```
POST /api/n8n/chat
```

**Request Body:**
```json
{
  "message": "string",
  "userRole": "farmer",
  "userName": "string"
}
```

**Response:**
```json
{
  "response": "AI generated response"
}
```

**Note:** The n8n chat routes are imported from `odop-connect-api` package (see node_modules).

---

### Configuration Files

#### API Configuration
```
apps/web/src/config/apiConfig.ts
```

**Key Settings:**
- `QUALITY_SCAN_URL`: http://localhost:8000
- `QUALITY_SHIELD_URL`: http://localhost:8001
- `N8N_CHAT`: /api/n8n/chat
- Timeout and retry configurations

#### N8N Configuration
```
apps/web/src/config/n8n.ts
```

**Key Settings:**
- Webhook URL configuration
- Chat appearance settings
- Color scheme for agricultural theme

---

### Environment Variables

#### Frontend (.env)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_QUALITY_SCAN_URL=http://localhost:8000
NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001
NEXT_PUBLIC_N8N_WEBHOOK_URL=your-n8n-webhook-url
NEXT_PUBLIC_ENABLE_AI_CHAT=true
```

#### Backend (.env)
```bash
# AI Services
AI_SERVICE_URL=http://localhost:8001
QUALITY_SCAN_SERVICE_URL=http://localhost:8000

# N8N Integration
N8N_WEBHOOK_URL=your-n8n-webhook-url
```

---

## 🔧 Integration Steps

### Step 1: Copy Frontend Components
1. Copy `AIQualityShield.tsx` and `AIQualityShieldPremium.tsx` to your farmer dashboard components
2. Copy `FloatingAIChatbot.tsx` to your shared UI components

### Step 2: Copy Configuration Files
1. Copy or merge `apiConfig.ts` settings
2. Copy or merge `n8n.ts` configuration

### Step 3: Install Dependencies
```bash
cd apps/web
npm install framer-motion lucide-react react-hot-toast
```

### Step 4: Backend Integration
1. Ensure farmer service has `analyzeQuality` method
2. Add n8n chat routes (or use odop-connect-api package)
3. Configure environment variables

### Step 5: Add to Farmer Dashboard
```tsx
import AIQualityShield from "@/components/dashboard/farmer/AIQualityShield";
import FloatingAIChatbot from "@/components/ui/FloatingAIChatbot";

// In your dashboard component
<AIQualityShield />
<FloatingAIChatbot userRole="FARMER" userName="Farmer Name" />
```

---

## 🎨 UI/UX Features

### AI Quality Shield
- **Color Scheme**: Cyan/Blue gradient
- **Animations**: Smooth transitions, loading states
- **Layout**: Two-column grid (upload | results)
- **Responsive**: Mobile-friendly design

### Floating Chatbot
- **Position**: Fixed bottom-right
- **Color Scheme**: Green for farmers, Blue for buyers
- **Animations**: Pulse effect, smooth expand/collapse
- **Features**: 
  - Message history
  - Voice synthesis
  - Full-screen mode link

---

## 🔌 API Integration Points

### Quality Analysis Flow
1. User uploads image → Frontend
2. Image converted to base64 → Frontend
3. POST to `/api/farmers/quality/analyze` → Backend
4. AI service processes image → AI Service (port 8001)
5. Results returned → Frontend displays

### Chat Flow
1. User sends message → Frontend
2. POST to `/api/n8n/chat` → Backend
3. N8N webhook processes with LLM → N8N Service
4. AI response returned → Frontend displays
5. Optional: Text-to-speech → Browser API

---

## 📊 Database Schema (if needed)

### Quality Scans Table
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
}
```

### Chat Messages Table
```prisma
model ChatMessage {
  id        String   @id @default(cuid())
  userId    String
  role      String   // "user" or "assistant"
  content   String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 🧪 Testing

### Quality Scan Testing
```typescript
// Test image upload
const testImage = "data:image/jpeg;base64,..."
const response = await fetch('/api/farmers/quality/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageUrl: testImage })
});
```

### Chat Testing
```typescript
// Test chat message
const response = await fetch('/api/n8n/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "What crops should I plant?",
    userRole: "farmer",
    userName: "Test Farmer"
  })
});
```

---

## 🚀 Deployment Checklist

- [ ] Frontend components copied
- [ ] Configuration files updated
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Backend routes configured
- [ ] AI services running (ports 8000, 8001)
- [ ] N8N webhook configured
- [ ] Database migrations run (if needed)
- [ ] Testing completed
- [ ] Documentation updated

---

## 📝 Notes

1. **AI Service**: The quality scan requires an AI service running on port 8001
2. **N8N Service**: The chatbot requires n8n with LLM integration
3. **Authentication**: Both features require authenticated farmer users
4. **Image Storage**: Consider using Cloudinary or S3 for image uploads
5. **Rate Limiting**: Implement rate limiting for AI API calls
6. **Error Handling**: Both features have fallback error messages
7. **Offline Mode**: Consider caching for offline functionality

---

## 🔗 Related Documentation

- `AI_QUALITY_SHIELD_README.md` - Detailed AI quality shield documentation
- `AI_QUALITY_SHIELD_ARCHITECTURE.md` - Architecture details
- `START.md` - Complete setup guide
- `QUALITY_CERTIFICATE_GUIDE.md` - Quality certificate features

---

## 📞 Support

For issues or questions:
1. Check the main README.md
2. Review START.md for setup instructions
3. Check API documentation at http://localhost:3001/api-docs
4. Review component source code for inline documentation
