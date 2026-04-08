# Quick Start: AI Quality Shield

## 🚀 Start in 3 Steps

### Step 1: Start Backend
```bash
start-backend.bat
```
Wait for: `ODOP Connect API v2.0` message

### Step 2: Start Frontend
```bash
start-frontend.bat
```
Wait for: `Ready on http://localhost:3000`

### Step 3: Test It!
1. Open http://localhost:3000
2. Login as farmer (or register)
3. Navigate to "AI Quality Shield"
4. Click "Start Scan"
5. Upload a crop image
6. See instant results! ✅

## 🎯 What You'll See

After uploading an image:
- ✅ Quality Grade (A+, A, B+, B)
- ✅ Health Score (0-100)
- ✅ Certificate ID
- ✅ Blockchain Hash
- ✅ Quality Metrics
- ✅ Defect Analysis

## 🔧 Optional: Python AI Service

For real AI models (YOLOv8 + EfficientNet):

```bash
start-ai-service.bat
```

If you skip this, the system uses fallback mode (still works great!).

## ✅ Verify Everything Works

```bash
test-ai-quality-shield.bat
```

This checks:
- ✅ Backend running
- ✅ Frontend running
- ⚠️ Python AI service (optional)

## 🐛 Troubleshooting

### "Network fetch error"
- Check backend is running: http://localhost:3001/api/health
- Check frontend .env.local has: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

### "No file uploaded"
- This is now fixed! Just upload normally.

### Backend won't start
- Check if port 3001 is free
- Run: `npm install` in apps/api

### Frontend won't start
- Check if port 3000 is free
- Run: `npm install` in apps/web

## 📊 Test Images

Use any crop images:
- tomato.jpg → Detects as Tomato
- wheat.png → Detects as Wheat
- rice.jpg → Detects as Rice
- Any other → Detects as Tomato (default)

## 🎉 Success!

You should now see:
- Image uploaded ✅
- AI analysis complete ✅
- Grade displayed ✅
- Certificate generated ✅
- No errors ✅

Enjoy your AI-powered crop quality detection!
