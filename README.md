# 🌾 ODOP Connect - Agriculture Marketplace Platform

## Complete B2B Agriculture Marketplace with AI-Powered Features

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- SQLite (included)

### Installation

```bash
# 1. Install backend dependencies
cd apps/api
npm install

# 2. Install frontend dependencies
cd ../web
npm install

# 3. Install AI service dependencies
cd ../ai-service
pip install -r requirements.txt

# 4. Setup database
cd ../api
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Configuration

```bash
# Backend (.env)
cd apps/api
cp .env.example .env

# Add required keys:
OPENAI_API_KEY=sk-your-key-here  # For AgriVoice AI
JWT_SECRET=your-secret-key
```

### Start Services

```bash
# Terminal 1 - Backend API
cd apps/api
npm run dev
# → http://localhost:3001

# Terminal 2 - Frontend
cd apps/web
npm run dev
# → http://localhost:3000

# Terminal 3 - AI Service
cd apps/ai-service
python -m uvicorn app.main:app --reload --port 8000
# → http://localhost:8000
```

### Test Login

```
Farmer: farmer@test.com / password123
Buyer: buyer@test.com / password123
```

---

## 🎯 Key Features

### 🎤 AgriVoice AI (Voice Assistant)
- **Multilingual voice commands** (Hindi, English, Marathi)
- **Whisper + GPT-4 integration** for accurate understanding
- **Natural voice responses** with OpenAI TTS
- **Context-aware AI** that remembers conversation
- **11-step complete workflow** from voice to action

**Quick Test:**
```
1. Login → Click mic button (bottom right)
2. Say: "2 किलो प्याज कार्ट में जोड़ो"
3. Watch it execute!
```

### 🤖 AI-Powered Features
- **Smart Product Hub** - AI product recommendations
- **Crop Advisor** - ML-based crop suggestions
- **Price Predictor** - Market price forecasting
- **Quality Detector** - Image-based quality grading
- **Pest Detection** - AI pest identification
- **Weather Insights** - Smart weather analysis

### 🌾 Farmer Features
- Product management and listing
- Real-time market price tracking
- Tender participation
- Auto-sell rules
- Farm insights dashboard
- Logistics management
- Trust & identity verification
- Escrow payments

### 🛒 Buyer Features
- Smart product sourcing
- AI procurement assistant
- Bulk order management
- Pre-booking system
- Supplier insights
- Negotiation hub
- Order tracking
- Blockchain traceability

### 💰 Financial Features
- AgriPay wallet system
- Escrow payments
- Invoice management
- Payment tracking
- Financial analytics

### 🔗 Blockchain Features
- Supply chain traceability
- Smart contracts
- Fraud prevention
- Trust scoring
- Immutable records

---

## 📁 Project Structure

```
.
├── apps/
│   ├── api/                    # Backend API (Node.js/Express)
│   │   ├── src/
│   │   │   ├── modules/        # Feature modules
│   │   │   ├── services/       # Business logic
│   │   │   ├── middleware/     # Auth, error handling
│   │   │   └── config/         # Configuration
│   │   └── prisma/             # Database schema
│   │
│   ├── web/                    # Frontend (Next.js/React)
│   │   ├── src/
│   │   │   ├── app/            # Pages
│   │   │   ├── components/     # UI components
│   │   │   ├── services/       # API services
│   │   │   └── hooks/          # React hooks
│   │   └── public/             # Static assets
│   │
│   └── ai-service/             # AI/ML Service (Python/FastAPI)
│       ├── app/
│       │   ├── routers/        # API endpoints
│       │   └── services/       # ML models
│       └── ml_models/          # Trained models
│
├── README.md                   # This file
└── README_AGRIVOICE.md        # Voice assistant docs
```

---

## 🔧 Technology Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time updates
- **React Hot Toast** - Notifications
- **Lucide Icons** - Icon library

### Backend
- **Node.js + Express** - API server
- **Prisma** - Database ORM
- **SQLite** - Database
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **Zod** - Validation

### AI/ML
- **Python + FastAPI** - ML API
- **OpenAI API** - Whisper, GPT-4, TTS
- **Scikit-learn** - ML models
- **Pandas** - Data processing

---

## 🎤 AgriVoice AI Setup

### Quick Setup (2 minutes)

```bash
# 1. Get OpenAI API key
# Visit: https://platform.openai.com/api-keys

# 2. Add to .env
echo "OPENAI_API_KEY=sk-your-key" >> apps/api/.env

# 3. Restart backend
cd apps/api && npm run dev

# 4. Test voice commands!
```

### Voice Commands Examples

**Hindi:**
```
"2 किलो प्याज कार्ट में जोड़ो"
"मंडी भाव बताओ"
"ऑर्डर प्लेस करो"
```

**English:**
```
"Add 2kg onions to cart"
"Check market price"
"Place my order"
```

**See full documentation:** `README_AGRIVOICE.md`

---

## 📊 API Endpoints

### Authentication
```
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Products
```
GET    /products
POST   /products
PUT    /products/:id
DELETE /products/:id
```

### Orders
```
GET    /orders
POST   /orders
PUT    /orders/:id
DELETE /orders/:id
```

### Voice Assistant
```
POST /voice/process           # Complete workflow
POST /voice/transcribe        # Whisper only
POST /voice/classify-intent   # GPT only
POST /voice/execute           # Execute action
POST /voice/text-to-speech    # TTS only
```

### AI Features
```
POST /ai/crop-advisor
POST /ai/price-prediction
POST /ai/quality-detection
POST /ai/pest-detection
```

---

## 🌐 Environment Variables

### Backend (apps/api/.env)
```env
# Required
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-key

# Optional
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
AI_SERVICE_URL=http://localhost:8000
```

### Frontend (apps/web/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

## 🧪 Testing

### Test Accounts
```
Farmer:
  Email: farmer@test.com
  Password: password123

Buyer:
  Email: buyer@test.com
  Password: password123
```

### Test Voice Commands
```bash
# 1. Login as farmer or buyer
# 2. Click microphone button
# 3. Say: "2 किलो प्याज कार्ट में जोड़ो"
# 4. Verify item added to cart
```

---

## 📈 Features Status

### ✅ Completed Features
- User authentication & authorization
- Product management (CRUD)
- Order management
- Cart functionality
- Real-time notifications (Socket.IO)
- AgriVoice AI (Whisper + GPT)
- AI crop advisor
- Price prediction
- Quality detection
- Pest detection
- Weather insights
- Blockchain traceability
- Escrow payments
- Tender system
- Logistics management
- Multi-language support (i18n)
- Responsive design

### 🚧 In Progress
- Payment gateway integration
- Advanced analytics
- Mobile app

---

## 💰 Pricing (AgriVoice AI)

### OpenAI API Costs
- **Whisper:** $0.006/minute
- **GPT-4:** ~$0.001/command
- **TTS:** ~$0.0005/response

**Total per user:** ~$0.23/month  
**For 1000 users:** ~$225/month

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Node version
node --version  # Should be 18+

# Reinstall dependencies
cd apps/api
rm -rf node_modules package-lock.json
npm install

# Reset database
npx prisma generate
npx prisma db push
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 18+

# Reinstall dependencies
cd apps/web
rm -rf node_modules package-lock.json .next
npm install
```

### Voice assistant not working
```bash
# Check OpenAI API key
cat apps/api/.env | grep OPENAI_API_KEY

# Add if missing
echo "OPENAI_API_KEY=sk-your-key" >> apps/api/.env

# Restart backend
cd apps/api && npm run dev
```

---

## 📚 Documentation

- **README.md** - This file (main documentation)
- **README_AGRIVOICE.md** - Voice assistant complete guide
- **START_HERE.md** - Quick start guide
- **HOW_TO_LOGIN.md** - Login instructions

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🎉 Quick Commands

```bash
# Start everything
npm run dev          # In apps/api
npm run dev          # In apps/web
python main.py       # In apps/ai-service

# Database
npx prisma studio    # Open database GUI
npx prisma db seed   # Seed test data

# Build for production
npm run build        # In apps/api
npm run build        # In apps/web
```

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review troubleshooting section
3. Check browser console for errors
4. Verify all services are running

---

## ✨ Highlights

- 🎤 **Voice-First Interface** - Speak commands in Hindi, English, or Marathi
- 🤖 **AI-Powered** - GPT-4 for understanding, Whisper for speech
- 🌾 **Agriculture-Focused** - Built specifically for farmers and buyers
- 💰 **Cost-Effective** - ~$0.23 per user per month
- 🚀 **Production-Ready** - Complete, tested, and deployable
- 🌐 **Multi-Language** - Full i18n support
- ⚡ **Real-Time** - Socket.IO for live updates
- 🔒 **Secure** - JWT auth, role-based access

---

**Version:** 4.0  
**Last Updated:** April 5, 2026  
**Status:** Production Ready 🚀

---

## 🎯 Next Steps

1. **Setup:** Follow Quick Start above
2. **Configure:** Add OpenAI API key
3. **Test:** Try voice commands
4. **Explore:** Check all features
5. **Deploy:** When ready for production

**Happy Farming! 🌾**
