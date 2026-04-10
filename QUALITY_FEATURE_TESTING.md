# AI Quality Certification - Testing Guide

## ✅ Setup Complete

All dependencies installed and database table created!

## 🚀 How to Start

### 1. Start Backend
```bash
cd apps/api
npm run dev
```
Backend will run on: http://localhost:3001

### 2. Start Frontend
```bash
cd apps/web
npm run dev
```
Frontend will run on: http://localhost:3000

## 🧪 Testing the Feature

### Step 1: Login as Farmer
1. Go to http://localhost:3000
2. Login with farmer credentials
3. Navigate to Farmer Dashboard

### Step 2: Access AI Quality Scan
1. Click "AI Quality Scan" in the navigation menu
2. You should see three tabs:
   - **New Scan** - Upload and analyze images
   - **History** - View past scans
   - **Statistics** - View quality stats

### Step 3: Upload and Analyze
1. Click "Click to upload image" or drag & drop
2. Select a crop image (PNG, JPG, max 10MB)
3. Click "Analyze Quality" button
4. Wait for analysis (2-3 seconds)
5. View results:
   - Quality Grade (A+, A, B+, B, C)
   - Overall Score (0-100)
   - Freshness, Color, Size metrics
   - Defects count
   - Recommendations

### Step 4: View History
1. Click "History" tab
2. See all your past scans
3. Each scan shows:
   - Thumbnail image
   - Grade and score
   - Date and time
   - Defects count

### Step 5: View Statistics
1. Click "Statistics" tab
2. See your quality metrics:
   - Total scans
   - Average score
   - Quality trend
   - Grade distribution chart

## 🔧 API Endpoints

### Analyze Quality
```
POST /api/farmer/quality/analyze
Headers: Authorization: Bearer <token>
Body: { imageUrl: "base64_string" }
```

### Save Scan
```
POST /api/farmer/quality/save
Headers: Authorization: Bearer <token>
Body: {
  imageUrl: string,
  grade: string,
  score: number,
  defects: number,
  freshness: number,
  color: number,
  size: number
}
```

### Get History
```
GET /api/farmer/quality/history?page=1&limit=10
Headers: Authorization: Bearer <token>
```

### Get Statistics
```
GET /api/farmer/quality/stats
Headers: Authorization: Bearer <token>
```

## 🐛 Troubleshooting

### "Failed to analyze image"
**Causes:**
1. Not logged in - Check if JWT token exists in localStorage
2. Backend not running - Start backend with `npm run dev`
3. Database connection issue - Check DATABASE_URL in .env
4. CORS issue - Verify FRONTEND_URL in backend .env

**Solutions:**
1. Login again to get fresh token
2. Check backend console for errors
3. Verify PostgreSQL is running
4. Check browser console for detailed error

### "Unauthorized" Error
- Token expired or invalid
- Login again to get new token
- Check JWT_SECRET is set in backend .env

### Image Upload Issues
- File size > 10MB - Compress image
- Invalid format - Use PNG or JPG only
- Browser memory - Try smaller image

### Database Errors
- Table doesn't exist - Run `npx prisma db push`
- Connection failed - Check PostgreSQL is running
- Permission denied - Check database user permissions

## 📊 Expected Behavior

### Mock Mode (AI Service Unavailable)
- Analysis still works
- Returns random but realistic grades
- Saves to database
- Shows toast: "Analysis complete!"

### Real AI Mode (When AI Service Running)
- Connects to http://localhost:8001
- Real image analysis
- Accurate quality metrics
- Detailed recommendations

## 🎯 Success Criteria

✅ Can upload images
✅ Analysis completes in 2-3 seconds
✅ Results display correctly
✅ Scans save to database
✅ History shows past scans
✅ Statistics calculate correctly
✅ No console errors
✅ Smooth animations
✅ Responsive on mobile

## 📝 Notes

- Feature works in mock mode by default
- No external AI service required for testing
- All scans are saved to database
- History persists across sessions
- Statistics update in real-time
