# 🚀 ODOP Connect - All Services Running

## ✅ Service Status

All three services are now running successfully!

### 1. Frontend (Next.js) ✅
- **Status**: Running
- **URL**: http://localhost:3000
- **Network**: http://172.29.48.1:3000
- **Framework**: Next.js 16.2.1 (Turbopack)
- **Terminal ID**: 2

### 2. Backend API (Express + Prisma) ✅
- **Status**: Running
- **URL**: http://localhost:4000
- **Features**:
  - Real-time Socket.IO connections
  - Live price updates (Mandi simulator)
  - System announcements
  - Database: SQLite with Prisma ORM
- **Terminal ID**: 3

### 3. AI Service (FastAPI) ✅
- **Status**: Running
- **URL**: http://localhost:8001
- **Models Loaded**:
  - ✓ YOLOv8 (Object Detection)
  - ✓ EfficientNet B3 (Feature Extraction)
- **Endpoints**:
  - Health: http://localhost:8001/health
  - Quality Scan: http://localhost:8001/quality-shield/scan
  - Trust Scan: http://localhost:8001/api/v1/trust/quality-scan
- **Terminal ID**: 5

## 🌐 Access the Application

**Main Website**: http://localhost:3000

### Available Pages:
- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Farmer Dashboard**: http://localhost:3000/farmer/dashboard
- **Buyer Dashboard**: http://localhost:3000/buyer/dashboard
- **Quality Scanner**: http://localhost:3000/quality-scanner
- **Profile**: http://localhost:3000/profile

## 🔧 Managing Services

### View Running Processes
All services are running in the background. You can see them in your terminal.

### Stop Services
If you need to stop any service, you can close the terminal or use Ctrl+C in the respective terminal window.

### Restart Services
To restart a service:
1. Stop the service (Ctrl+C)
2. Navigate to the service directory
3. Run the appropriate command:
   - Frontend: `npm run dev` (in apps/web)
   - Backend: `npm run dev` (in apps/api)
   - AI Service: `python main.py` (in apps/ai-service)

## 📊 Features Available

### Farmer Features
- Smart Product Hub
- Auto-Sell Engine
- Tender Participation
- Farm Insights (Weather, Soil, Pest Detection, Financial)
- Order Management
- AgriPay Center
- Trust & Identity
- AgriChat (AI Assistant)

### Buyer Features
- Smart Sourcing
- Tender Management
- Negotiation Hub
- Market Intelligence
- Blockchain Trace
- Supplier Insights
- Procurement Assistant
- Reputation Management

### AI Features
- Crop Quality Detection
- YOLOv8 Object Detection
- EfficientNet Classification
- Blockchain Certification
- Quality Grading (Premium, A, B, C, Rejected)

## 🎉 Ready to Use!

Your complete AgriVoice platform is now running with all services operational. Open http://localhost:3000 in your browser to start using the application!
