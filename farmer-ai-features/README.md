# Farmer Dashboard AI Features Package

This package contains all the necessary files to integrate AI Quality Scan and AI Chatbot features into your farmer dashboard.

## 📦 Package Contents

```
farmer-ai-features/
├── README.md (this file)
├── frontend/
│   ├── components/
│   │   ├── AIQualityShield.tsx
│   │   ├── AIQualityShieldPremium.tsx
│   │   └── FloatingAIChatbot.tsx
│   └── config/
│       ├── apiConfig.ts
│       └── n8n.ts
├── backend/
│   ├── controllers/
│   │   └── farmer-quality.controller.ts
│   └── services/
│       └── farmer-quality.service.ts
├── types/
│   └── ai-features.types.ts
├── env-examples/
│   ├── .env.frontend.example
│   └── .env.backend.example
└── docs/
    └── INTEGRATION_GUIDE.md
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install framer-motion lucide-react react-hot-toast
```

### 2. Copy Files
- Copy `frontend/components/*` to your components directory
- Copy `frontend/config/*` to your config directory
- Copy `backend/*` to your API directory

### 3. Configure Environment
- Copy `.env.frontend.example` to `.env.local`
- Copy `.env.backend.example` to `.env`
- Update with your actual values

### 4. Import Components
```tsx
import AIQualityShield from './components/AIQualityShield';
import FloatingAIChatbot from './components/FloatingAIChatbot';

// In your farmer dashboard
<AIQualityShield />
<FloatingAIChatbot userRole="FARMER" userName={userName} />
```

## 📚 Documentation

See `docs/INTEGRATION_GUIDE.md` for detailed integration instructions.

## 🔧 Requirements

- React 18+
- Next.js 13+ (for frontend)
- Node.js 18+ (for backend)
- Express.js (for backend API)
- AI Service running on port 8001
- N8N with LLM integration

## 🎯 Features

### AI Quality Scan
- Upload crop images
- AI-powered quality analysis
- Grade and score calculation
- Defect detection
- Quality metrics (freshness, color, size)

### AI Chatbot
- Floating chat interface
- Real-time AI responses
- Text-to-speech support
- Role-based theming
- Message history

## 📄 License

Same as parent project
