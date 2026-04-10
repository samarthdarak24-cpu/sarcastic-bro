# AgriTrust - Complete Agri-Trading Platform

A production-ready agricultural B2B marketplace connecting Farmers, Buyers, and FPOs (Farmer Producer Organizations) with real-time features, escrow payments, and market intelligence.

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **Charts**: Recharts
- **i18n**: react-i18next (Hindi, Marathi, English)
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **File Upload**: Multer + Cloudinary
- **Payment**: Razorpay integration

## 📋 Features

### Farmer Dashboard
- Farm management with photos
- Crop listing with quality grades
- Market price transparency (6 months historical data)
- Order tracking with status updates
- Earnings dashboard with transaction history
- FPO linking and logistics requests
- Real-time notifications

### Buyer Dashboard
- Marketplace with aggregated lots
- Advanced filters (crop, grade, district, quantity)
- Quality certificate viewer
- Bulk ordering with escrow payment
- Order tracking and delivery approval
- Wallet management (Razorpay)
- Real-time chat with FPOs

### FPO Dashboard
- Farmer onboarding and management
- Delegated crop listing
- Bulk aggregation engine
- Quality certificate upload and verification
- Order management and dispatch
- Escrow payout distribution
- Logistics coordination

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mvpm-hackathon
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/api
npm install

# Install frontend dependencies
cd ../web
npm install
cd ../..
```

3. **Setup Backend**

```bash
cd apps/api

# Copy environment file
cp .env.example .env

# The .env is already configured for SQLite development

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database with realistic data
npx ts-node prisma/seed.ts
```

4. **Start Backend Server**

```bash
# From apps/api directory
npm run dev
```

Backend will start on `http://localhost:3001`

5. **Start Frontend**

```bash
# From apps/web directory (in a new terminal)
npm run dev
```

Frontend will start on `http://localhost:3000`

## 🔐 Login Credentials

After seeding, use these credentials (password for all: `Test@1234`):

| Role | Email | Phone | Description |
|------|-------|-------|-------------|
| FPO Admin | fpo@test.com | 9876543210 | Marathwada Kisan Sangha |
| Farmer | farmer@test.com | 9876543211 | Suresh Jadhav |
| Buyer | buyer@test.com | 9876543220 | Mahesh Agarwal |

## 📊 Database Schema

### Core Models
- **User**: Farmers, Buyers, FPO admins with KYC
- **Farm**: Farm details with location and photos
- **FPO**: Farmer Producer Organizations
- **FPOFarmer**: Farmers managed by FPOs
- **Crop**: Individual crop listings
- **AggregatedLot**: Bulk lots created by FPOs
- **Order**: Purchase orders with escrow
- **EscrowTransaction**: Payment escrow management
- **Wallet**: User wallet balances
- **WalletTransaction**: Transaction history
- **MarketPrice**: Historical price data (4320 records seeded)
- **Message**: Chat messages
- **QualityCertificate**: Quality certificates
- **FarmerEarning**: Payout tracking

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (phone/email + password)
- `GET /api/auth/me` - Get current user

### Farmer Routes
- `POST /api/farmer/farm` - Add farm details
- `POST /api/farmer/crop` - List new crop
- `GET /api/farmer/crops` - Get my crops
- `GET /api/farmer/orders` - Get my orders
- `GET /api/farmer/earnings` - Get earnings
- `GET /api/farmer/market-prices` - Get market prices

### Buyer Routes
- `GET /api/buyer/marketplace` - Browse marketplace
- `POST /api/buyer/order` - Place order
- `GET /api/buyer/orders` - Get my orders
- `POST /api/buyer/wallet/add` - Add funds
- `POST /api/buyer/delivery/approve/:orderId` - Approve delivery

### FPO Routes
- `POST /api/fpo/register` - Register FPO
- `POST /api/fpo/farmer/onboard` - Onboard farmer
- `GET /api/fpo/farmers` - List farmers
- `POST /api/fpo/crop/list` - List crop for farmer
- `POST /api/fpo/aggregate` - Create aggregated lot
- `POST /api/fpo/certificate/upload` - Upload certificate
- `GET /api/fpo/orders` - Get orders
- `POST /api/fpo/payout` - Distribute payouts

### Shared Routes
- `GET /api/market-prices` - Public price data
- `POST /api/chat/send` - Send message
- `GET /api/chat/messages/:userId` - Get messages

## 🔄 Real-time Features (Socket.io)

- Order status updates
- New order notifications
- Chat messages
- Farmer join requests
- Dispatch notifications

## 💰 Escrow System Flow

1. Buyer places order → Razorpay captures payment
2. `EscrowTransaction` created with status = `HELD`
3. FPO dispatches → Order status = `IN_TRANSIT`
4. Buyer approves delivery → Escrow status = `RELEASED`
5. System calculates farmer shares:
   ```
   farmerShare = (farmerCropQty / totalLotQty) * totalAmount - platformFee(2%)
   ```
6. `FarmerEarning` records created
7. If dispute → status = `REFUNDED`

## 📈 Market Price Transparency

- 6 months of historical data for 6 crops × 4 districts
- Crops: Wheat, Rice, Soybean, Cotton, Onion, Tomato
- Districts: Nanded, Latur, Pune, Nashik
- Real-time price comparison
- Fair price indicators

## 🌍 Multi-language Support

- English (en)
- Hindi (hi)
- Marathi (mr)

Language switcher in navbar. Translations stored in `apps/web/src/i18n/`

## 📁 Project Structure

```
mvpm-hackathon/
├── apps/
│   ├── api/                    # Backend (Express + Prisma)
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Seed script
│   │   └── src/
│   │       ├── routes/         # API routes
│   │       ├── controllers/    # Route handlers
│   │       ├── middleware/     # Auth, validation
│   │       ├── services/       # Business logic
│   │       └── socket/         # Socket.io handlers
│   └── web/                    # Frontend (Next.js)
│       └── src/
│           ├── app/
│           │   ├── farmer/     # Farmer dashboard
│           │   ├── buyer/      # Buyer dashboard
│           │   ├── fpo/        # FPO dashboard
│           │   ├── login/      # Login page
│           │   └── register/   # Registration
│           ├── components/     # Reusable components
│           ├── services/       # API clients
│           └── hooks/          # Custom hooks
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=agritrust-secret-key
PORT=3001
CLIENT_URL=http://localhost:3000

# Optional
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

## 🧪 Testing

```bash
# Backend tests
cd apps/api
npm test

# Frontend tests
cd apps/web
npm test
```

## 📦 Production Deployment

### Backend
```bash
cd apps/api
npm run build
npm start
```

### Frontend
```bash
cd apps/web
npm run build
npm start
```

### Database Migration (PostgreSQL)
```bash
# Update .env to use PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/agritrust

# Run migrations
npx prisma migrate deploy

# Seed production data
npx ts-node prisma/seed.ts
```

## 🎯 Key Features Implemented

✅ Role-based authentication (Farmer/Buyer/FPO)
✅ Real database with Prisma ORM
✅ Complete CRUD operations
✅ Escrow payment system
✅ Market price transparency
✅ Bulk aggregation engine
✅ Quality certificate management
✅ Real-time chat (Socket.io)
✅ Order tracking with status updates
✅ Wallet management
✅ Multi-language support (i18n)
✅ Responsive design
✅ Production-ready error handling
✅ Comprehensive seed data

## 📝 License

MIT

## 👥 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for AgriTrust
