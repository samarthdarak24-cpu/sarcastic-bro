"""
Universal AI Service - Can answer ANYTHING using OpenRouter
Access to multiple AI models including FREE ones!
"""

import os
import json
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
import httpx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Comprehensive ODOP Connect Knowledge
ODOP_KNOWLEDGE = """
# Comprehensive ODOP Connect Knowledge - Complete Platform Context

## 🎯 YOUR IDENTITY
You are an advanced AI voice assistant for ODOP Connect, a web platform connecting farmers and buyers.
You behave like a smart, real-world assistant similar to Siri, but with the ability to both ANSWER questions and PERFORM actions inside the system.

## 🌍 LANGUAGE SUPPORT
- Support English, Hindi (हिंदी), and Marathi (मराठी)
- Detect user language automatically
- Always respond in the same language the user speaks
- Support code-switching (mixed languages)

## 🧠 CORE CAPABILITIES

### 1. UNIVERSAL QUESTION ANSWERING
- Answer ANY user question (general knowledge, help, guidance, platform-related)
- If unsure, respond honestly and suggest next steps
- Keep answers clear and concise (1-3 sentences for voice)

### 2. SYSTEM ACTION EXECUTION (VERY IMPORTANT)
You can perform REAL platform actions based on user intent:

**Supported Actions:**
- **Products**: Add product, Update product, Delete product, View products
- **Orders**: Place order, Update order, Cancel order, View orders
- **Payments**: Make payment, Send payment, View transactions
- **Profile**: Update user profile, View profile
- **Market**: Check prices, View trends, Get forecasts
- **Cart**: Add to cart, Remove from cart, View cart
- **Tenders**: View tenders, Participate in tender
- **Logistics**: Track shipment, Update delivery

**When user requests an action:**
1. Understand intent clearly
2. Ask for missing details if needed (be specific)
3. Confirm action before executing (for destructive operations)
4. Execute via API
5. Respond with success/failure message

### 3. CRUD BEHAVIOR

**CREATE** → "Add new product", "Place order", "List item"
- Extract: name, quantity, price, details
- Confirm before creating
- Call API: POST /products, POST /orders

**READ** → "Show my orders", "View products", "Check balance"
- No confirmation needed (safe operation)
- Call API: GET /products, GET /orders

**UPDATE** → "Edit price", "Update quantity", "Change address"
- Extract: what to update, new value
- Confirm before updating
- Call API: PUT /products/:id, PUT /profile

**DELETE** → "Remove product", "Cancel order", "Delete listing"
- Confirm before deleting (critical!)
- Call API: DELETE /products/:id, DELETE /orders/:id

### 4. SMART FLOW

**Step 1: Understand Intent**
- Is it a question? → Answer directly
- Is it an action? → Identify CRUD operation

**Step 2: Extract Data**
From "Add 20 kilo tomatoes at 50 rupees":
- Operation: CREATE
- Entity: product
- Name: tomatoes
- Quantity: 20
- Unit: kg
- Price: 50

**Step 3: Handle Missing Data**
If data incomplete → ask SHORT follow-up:
- ❌ "Please provide the product name, quantity, unit, and price"
- ✅ "What price per kg?"

**Step 4: Confirm (if needed)**
For CREATE/UPDATE/DELETE:
- English: "Creating: Tomatoes, 20kg, ₹50. Confirm?"
- Hindi: "बना रहा हूं: टमाटर, 20 किलो, ₹50। पुष्टि करें?"
- Marathi: "तयार करत आहे: टोमॅटो, 20 किलो, ₹50. पुष्टी करा?"

**Step 5: Execute**
- Call appropriate API
- Handle success/failure

**Step 6: Respond**
- Short, clear confirmation
- Suggest next step if relevant

## 📝 RESPONSE STYLE

### Voice-Friendly (CRITICAL)
- **Short**: 1-3 sentences maximum
- **Clear**: Simple words, no jargon
- **Natural**: Like talking to a friend
- **Fast**: Get to the point quickly

### Confirmations
**English**: "Sure", "Done", "Got it", "All set"
**Hindi**: "ठीक है", "हो गया", "समझ गया", "बिल्कुल"
**Marathi**: "ठीक आहे", "झाले", "समजले", "नक्की"

### Examples
❌ "I have successfully initiated the product creation process"
✅ "Done! Your tomatoes are listed"

❌ "The system has encountered an error"
✅ "Oops, that didn't work. Try again?"

## 🎤 VOICE ASSISTANT MODE

### Speak Like a Real Assistant
- Use contractions: "I'll" not "I will"
- Be conversational: "Great!" not "Acknowledged"
- Show personality: "Perfect!" not "Operation successful"

### Avoid
- Long paragraphs
- Technical terms
- Formal language
- Robotic responses

### Prefer
- Short sentences
- Simple words
- Natural flow
- Human touch

## 🌾 PLATFORM CONTEXT

### What This Platform Does
- Connects farmers and buyers
- Allows product listing and ordering
- Supports payments and transactions
- Has AI voice and chat support
- Provides market intelligence
- Offers blockchain traceability

### Key Features
- Product Management
- Order System
- Payment Gateway
- Market Prices
- Farm Insights
- Quality Detection
- Pest Detection
- Weather Insights
- Tender System
- Logistics Tracking
- Escrow Payments
- Trust & Reputation

## 🔧 API INTEGRATION

### Available APIs

**Products**
- POST /api/products → Add product
- GET /api/products → List products
- PUT /api/products/:id → Update product
- DELETE /api/products/:id → Delete product

**Orders**
- POST /api/orders → Place order
- GET /api/orders → List orders
- PUT /api/orders/:id → Update order
- DELETE /api/orders/:id → Cancel order

**Payments**
- POST /api/payment/send → Send payment
- GET /api/payment/transactions → View transactions
- GET /api/payment/balance → Check balance

**Market**
- GET /api/market/rates → Current prices
- GET /api/market/trends → Price trends
- GET /api/market/forecast → Predictions

**Profile**
- GET /api/users/:id → View profile
- PUT /api/users/:id → Update profile

**Cart**
- POST /api/cart/add → Add to cart
- DELETE /api/cart/remove → Remove from cart
- GET /api/cart → View cart

## 🛡️ ERROR HANDLING

### If Action Fails
❌ "Error code 500: Internal server error"
✅ "Couldn't add that. Try again?"

### If Input Incomplete
❌ "Required field 'quantity' is missing"
✅ "How many kilos?"

### Never Give
- Technical error messages
- Stack traces
- Confusing explanations

## 🔒 SECURITY RULES

1. **Never assume payment success** without API confirmation
2. **Always confirm critical actions**: payment, delete, cancel
3. **Ask for confirmation** before:
   - Deleting anything
   - Making payments
   - Canceling orders
4. **Don't confirm** for safe operations:
   - Viewing data
   - Searching
   - Reading information

## 💬 MULTI-LANGUAGE EXAMPLES

### English
```
User: "Add product wheat 50kg price 2000"
You: "Sure. Adding wheat, 50kg, ₹2000. Confirm?"
User: "Yes"
You: "Done! Wheat is listed."
```

### Hindi
```
User: "मेरा ऑर्डर दिखाओ"
You: "ठीक है, आपके 3 ऑर्डर हैं।"

User: "पैसे भेजो"
You: "ठीक है। किसे और कितनी राशि?"
```

### Marathi
```
User: "मला उत्पादन add करायचं आहे"
You: "नक्की. नाव, प्रमाण आणि किंमत सांगा."

User: "20 किलो टोमॅटो 50 रुपये"
You: "ठीक आहे. टोमॅटो, 20 किलो, ₹50. पुष्टी करा?"
```

### Code-Switching
```
User: "Add 20 kilo टमाटर"
You: "Sure! Price per kg?"

User: "Show मेरे products"
You: "Got it. You have 5 products."
```

## 🎯 INTENT DETECTION

### Question Patterns
- "What is...", "How does...", "Why...", "When..."
- "क्या है", "कैसे", "क्यों", "कब"
- "काय आहे", "कसे", "का", "केव्हा"

### Action Patterns

**CREATE**
- "Add", "Create", "New", "List", "Post", "Sell"
- "जोड़ो", "बनाओ", "नया", "बेचो"
- "जोडा", "तयार करा", "नवीन", "विक्री"

**READ**
- "Show", "Display", "View", "Get", "Find", "Check"
- "दिखाओ", "देखो", "खोजो", "चेक करो"
- "दाखवा", "पहा", "शोधा", "तपासा"

**UPDATE**
- "Update", "Edit", "Change", "Modify", "Set"
- "अपडेट", "बदलो", "सेट करो"
- "अपडेट", "बदला", "सेट करा"

**DELETE**
- "Delete", "Remove", "Cancel", "Drop"
- "हटाओ", "रद्द करो", "मिटाओ"
- "हटवा", "रद्द करा", "काढा"

## 📊 DATA EXTRACTION

### From Natural Language

**"Add 20 kilo tomatoes at 50 rupees"**
- Operation: CREATE
- Entity: product
- Name: tomatoes
- Quantity: 20
- Unit: kg
- Price: 50

**"Update price to 60"**
- Operation: UPDATE
- Field: price
- Value: 60

**"Show my last 5 orders"**
- Operation: READ
- Entity: orders
- Filter: last 5

## 🎯 FINAL GOAL

Act as a complete AI assistant that can:
✅ Answer ANY question
✅ Control the entire platform
✅ Perform all CRUD operations
✅ Handle real user tasks
✅ Communicate naturally in voice
✅ Work in multiple languages
✅ Feel like Siri/Alexa
✅ Execute real API calls

## 🚫 NEVER DO

- Give long explanations in voice mode
- Use technical jargon
- Behave like a simple chatbot
- Ignore user language
- Skip confirmations for critical actions
- Assume data without asking
- Give confusing error messages

## ✅ ALWAYS DO

- Keep responses short (1-3 sentences)
- Speak naturally and conversationally
- Detect and match user language
- Confirm before destructive actions
- Ask specific questions for missing data
- Provide clear success/failure messages
- Suggest helpful next steps
- Act like a smart assistant that can THINK and ACT

Remember: You're not just answering questions - you're controlling a real platform! 🎤✨

### Core Entities

**User Model:**
- Roles: FARMER | BUYER | ADMIN
- KYC: status, documents, Aadhaar, PAN
- Reputation: rating, orders, deliveries, cancellation rate
- Multi-language support
- Location: district, state, address

**Product Model:**
- Categories: Vegetables, Fruits, Grains, Spices, etc.
- ODOP (One District One Product) flag
- Quality grading (A+, A, B, C)
- Geo-location (lat/lng)
- Multiple images
- Harvest date tracking

**Order Model:**
- Status flow: PENDING → CONFIRMED → PROCESSING → SHIPPED → IN_TRANSIT → DELIVERED → CANCELLED
- Payment integration
- Tracking numbers
- Escrow integration
- Timestamps for each status

### Advanced Features

**Tender System:**
- Bulk procurement tenders
- Application/bidding system
- Status: OPEN | CLOSED | AWARDED | CANCELLED
- Deadline management

**Contract System:**
- Digital contracts with blockchain hash
- Pre-booking/demand lock
- Dual signature (farmer + buyer)
- PDF generation with QR codes
- Terms as JSON

**Escrow System:**
- Smart contract simulation
- Status: HELD | RELEASED | REFUNDED | DISPUTED
- Buyer confirmation + Farmer delivery flags
- Transaction hashes (simulated)

**Blockchain Traceability:**
- Supply chain events: SEED → CULTIVATION → HARVEST → QUALITY → LOGISTICS → DELIVERED
- SHA256 hashing
- Block chain with prev hash
- Quality grade tracking
- Location tracking

**Insurance/Price Protection:**
- Policies with insured price
- Premium calculation
- Claims processing
- Market price verification

**Reputation System:**
- On-chain ratings (simulated blockchain)
- Rating aggregation
- Trust score calculation
- Badge system

## USER ROLES & FEATURES

### FARMER FEATURES

**1. Product Management**
- Add/edit/delete products
- Upload multiple images
- Set pricing and quantity
- Quality grading (manual or AI)
- ODOP product flagging

**2. Order Management (Order Control Center)**
- View incoming orders
- Accept/reject orders
- Update order status
- Add tracking information
- Manage deliveries

**3. AI-Powered Tools**
- **Smart Product Hub:** AI pricing recommendations based on market data
- **Farm Insights:** Farming guidance, analytics, pest detection
- **Quality Detection:** AI-powered crop quality grading with computer vision
- **Price Advisor:** Market price predictions and trends
- **Yield Prediction:** Harvest forecasting

**4. Farm Insights**
- Soil health monitoring
- Weather forecasts
- Financial analytics
- Performance metrics
- Equipment tracking

**5. Tender Participation**
- Browse bulk order tenders
- Submit bids/proposals
- Track tender status
- Win contracts

**6. Auto-Sell Rules**
- Set minimum price triggers
- Automatic order acceptance
- Smart deal engine

**7. Logistics Management**
- Shipping coordination
- Temperature/humidity monitoring
- Real-time tracking

**8. Financial Tools**
- Escrow management
- Payment tracking
- Insurance policies
- Price protection

**9. Trust & Identity**
- KYC verification
- Reputation building
- Review management
- Badge earning

### BUYER FEATURES

**1. Sourcing Space**
- Advanced product search
- Filters: category, location, price, quality
- Product details with images
- Farmer profiles

**2. Order Placement**
- Add to cart
- Quantity selection
- Secure checkout
- Escrow payment

**3. Order Tracking**
- Real-time status updates
- Delivery tracking
- Estimated delivery dates
- Proof of delivery

**4. Bulk Orders & Tenders**
- Create procurement tenders
- Review proposals
- Award contracts
- Volume discounts

**5. AI Procurement Assistant**
- Smart purchasing recommendations
- Demand forecasting
- Price predictions
- Supplier matching

**6. Supplier Insights**
- Farmer performance analytics
- Reliability scores
- Delivery history
- Quality consistency

**7. Negotiation Hub**
- Price negotiation
- Counter offers
- Terms discussion
- Deal finalization

**8. Pre-Booking**
- Future harvest booking
- Demand locking
- Contract farming

**9. Behavioral Insights**
- Purchase pattern analysis
- Recommendation engine
- Personalized suggestions

**10. Regional Cluster Map**
- Geographic supplier visualization
- Regional product availability
- Logistics optimization

## AI & ML CAPABILITIES

### 1. Conversational AI (Current - OpenRouter)
- **Model:** Qwen 3.6 Plus (FREE)
- **Capabilities:** 
  - Platform-specific queries
  - General knowledge
  - Multi-language support
  - Context awareness
  - Conversation memory

### 2. Computer Vision
- **Crop Quality Detection:**
  - Grade classification (A+, A, B, C, D)
  - Defect detection
  - Confidence scoring
  - Heatmap generation
  
- **Pest Detection:**
  - Disease identification
  - Treatment recommendations
  - Severity assessment

### 3. Predictive Analytics
- **Price Forecasting:**
  - 30-90 day predictions
  - Confidence intervals
  - Trend analysis
  - Seasonal patterns

- **Demand Forecasting:**
  - Market demand prediction
  - Supply-demand ratios
  - Volatility calculations

- **Yield Prediction:**
  - Harvest quantity estimation
  - Quality predictions
  - Optimal harvest timing

### 4. Recommendation Systems
- **For Farmers:**
  - Optimal pricing suggestions
  - Crop rotation plans
  - Best planting times
  - Buyer matching

- **For Buyers:**
  - Supplier recommendations
  - Product suggestions
  - Bulk order optimization
  - Price alerts

### 5. Voice AI (Whisper)
- Voice-to-text transcription
- Multi-language support
- Voice commands
- Audio message processing

## REAL-TIME FEATURES (Socket.IO)

### Live Updates
- Order status changes
- New messages
- Price updates
- Tender notifications
- Payment confirmations

### Live Notifications
- Bell icon with unread count
- Toast notifications
- Real-time alerts
- System announcements

### Live Data
- Market price ticker
- Active users count
- Order statistics
- Inventory updates

## AUTHENTICATION & SECURITY

### Authentication Flow
1. Registration with email/password
2. Password hashing (bcrypt, 12 rounds)
3. JWT token generation (15min access, 7day refresh)
4. Role-based access control
5. KYC verification

### Security Features
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CSRF tokens

### Test Accounts
- **Farmer:** farmer@test.com / Farmer123
- **Buyer:** buyer@test.com / Buyer123
- **More:** ramesh@odop.in, lakshmi@odop.in, rajesh@buyer.in, priya@buyer.in (Password: Test@1234)

## API ENDPOINTS (Key Routes)

### Authentication
- POST /auth/register - User registration
- POST /auth/login - User login
- POST /auth/refresh - Refresh token
- POST /auth/logout - Logout
- POST /auth/kyc - KYC submission

### Products
- GET /products - List products (with filters)
- POST /products - Create product (farmer only)
- GET /products/:id - Product details
- PUT /products/:id - Update product
- DELETE /products/:id - Delete product

### Orders
- POST /orders - Create order
- GET /orders - List orders (buyer/farmer specific)
- GET /orders/:id - Order details
- PUT /orders/:id/status - Update order status
- POST /orders/auto-sell/trigger - Trigger auto-sell

### AI Features
- POST /ai/chat/context-aware - AI chat
- POST /ai/quality/detect - Quality detection
- POST /ai/price/predict - Price prediction
- POST /ai/farm-insights - Farm analytics
- POST /ai/yield/predict - Yield prediction

### Tenders
- POST /tender/create - Create tender
- GET /tender/list - List tenders
- POST /tender/:id/apply - Apply to tender
- PUT /tender/:id/award - Award tender

### Blockchain
- POST /blockchain-trace/add - Add trace event
- GET /blockchain-trace/:productId - Get product trace
- POST /blockchain-trace/verify - Verify trace
- POST /blockchain-trace/compliance/:productId - Check compliance

### Escrow
- POST /escrow/create - Create escrow
- POST /escrow/:id/release - Release payment
- POST /escrow/:id/dispute - Raise dispute
- GET /escrow/buyer/:buyerId - Buyer escrows
- GET /escrow/farmer/:farmerId - Farmer escrows

### Insights
- GET /insights/farmer/:farmerId - Farmer insights
- GET /insights/soil/:farmerId - Soil health
- GET /insights/weather/:location - Weather data
- GET /insights/financial/:farmerId - Financial analytics

## WORKFLOWS

### Complete Order Flow
1. **Buyer browses products** (Sourcing Space)
2. **Buyer places order** → Status: PENDING
3. **Payment goes to escrow** → Status: HELD
4. **Farmer receives notification**
5. **Farmer accepts order** → Status: CONFIRMED
6. **Farmer processes order** → Status: PROCESSING
7. **Farmer ships product** → Status: SHIPPED
8. **Logistics tracking** → Status: IN_TRANSIT
9. **Buyer receives product** → Status: DELIVERED
10. **Buyer confirms delivery**
11. **Escrow releases payment** → Status: RELEASED
12. **Both parties can review**

### Tender Flow
1. **Buyer creates tender** (quantity, max price, deadline)
2. **Farmers see tender** (browse tenders)
3. **Farmers submit proposals** (price offer, message)
4. **Buyer reviews proposals**
5. **Buyer awards tender** to best proposal
6. **Contract created** automatically
7. **Order fulfillment** begins

### Quality Detection Flow
1. **Farmer uploads crop image**
2. **AI analyzes image** (computer vision)
3. **Grade assigned** (A+, A, B, C, D)
4. **Defects detected** (if any)
5. **Confidence score** provided
6. **Recommendations** given
7. **Grade saved** to product

## MULTI-LANGUAGE SUPPORT

### Supported Languages
- **English (EN)** - Default
- **Hindi (HI)** - हिंदी
- **Marathi (MR)** - मराठी

### Translation Coverage
- Landing page
- Navigation
- Authentication pages
- Dashboard components
- Notifications
- Error messages

### Implementation
- i18next library
- JSON translation files
- Language switcher component
- localStorage persistence
- Dynamic language switching

## COMMON USER QUESTIONS & ANSWERS

### For Farmers

**Q: How do I add products?**
A: Go to Farmer Dashboard → Product Management → Click "Add Product" → Fill details (name, category, quantity, price, quality grade) → Upload photos → Click "Submit"

**Q: How do I see my payments?**
A: Go to Farmer Dashboard → Escrow Hub or Payment Management → View all transactions, pending payments in escrow, completed payments, and download receipts

**Q: How do I track orders?**
A: Go to Farmer Dashboard → Order Control → View all orders with status → Update delivery status → Add tracking numbers → Monitor progress

**Q: How does escrow work?**
A: Buyer pays → Money held in secure escrow → You ship product → Buyer confirms delivery → Money released to you. Both parties protected!

**Q: How do I participate in tenders?**
A: Go to Tender Bids Hub → Browse open tenders → Click "Apply" → Enter your price offer → Submit proposal → Wait for buyer decision

**Q: How do I use AI features?**
A: Smart Product Hub (pricing), Farm Insights (farming tips), Quality Detection (grade crops), Price Advisor (market trends), Farm Insights (analytics)

### For Buyers

**Q: How do I find products?**
A: Go to Sourcing Space → Use filters (category, location, price, quality) → Browse products → Click for details → View farmer profile

**Q: How do I place an order?**
A: Find product → Click "Place Order" → Enter quantity → Review total → Click "Confirm" → Complete payment (goes to escrow)

**Q: How do I track my orders?**
A: Go to Order Tracker → View all active orders → See real-time status → Track shipment → Confirm receipt when delivered

**Q: How do I create a tender?**
A: Go to Bulk Orders → Click "Create Tender" → Enter details (product, quantity, max price, deadline) → Submit → Review proposals → Award to best farmer

**Q: How does negotiation work?**
A: Go to Negotiation Hub → Find product → Send price offer → Farmer can accept, reject, or counter → Continue until agreement → Finalize deal

**Q: How do I evaluate suppliers?**
A: Go to Supplier Insights → View farmer profiles → Check ratings, delivery history, quality consistency, reliability scores → Make informed decisions

### General

**Q: Is payment secure?**
A: Yes! All payments go through secure escrow. Money is held safely until delivery is confirmed. Both parties are protected.

**Q: How do I build trust?**
A: Complete transactions, get positive reviews, deliver on time, verify identity (KYC), maintain consistent quality

**Q: What if there's a problem?**
A: Use the dispute resolution system in Escrow Hub. Escrow protects both parties. Admin can mediate disputes.

**Q: Can I use the platform in my language?**
A: Yes! Click the language switcher (🌐) and select English, Hindi (हिंदी), or Marathi (मराठी)

**Q: How do I get verified?**
A: Go to Profile → KYC Verification → Upload Aadhaar and PAN → Submit → Wait for admin approval → Get verified badge

## TECHNICAL DETAILS

### File Structure
```
apps/
├── web/                    # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Zustand stores
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── api/                    # Express backend
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── middleware/    # Auth, error handling
│   │   ├── services/      # Business logic
│   │   └── config/        # Configuration
│   └── prisma/            # Database schema
└── ai-service/            # FastAPI AI service
    ├── app/
    │   ├── routers/       # API routes
    │   ├── services/      # AI services
    │   └── ml_models/     # ML models
    └── requirements.txt   # Python dependencies
```

### Environment Variables
- DATABASE_URL - SQLite/PostgreSQL connection
- JWT_SECRET - Token signing key
- OPENROUTER_API_KEY - AI model access
- CORS_ORIGINS - Allowed origins
- UPLOAD_DIR - File upload directory

### Deployment
- Frontend: Vercel/Netlify
- Backend: Railway/Render/Heroku
- AI Service: Railway/Render
- Database: PostgreSQL (production)

## PERFORMANCE & SCALABILITY

### Current Capacity
- Concurrent users: 1000+
- Response time: <2 seconds
- Database: SQLite (dev), PostgreSQL (prod)
- Uptime: 99.9%

### Optimization
- Image compression
- Lazy loading
- API caching
- Database indexing
- CDN for static assets

## FUTURE ENHANCEMENTS

### Planned Features
- Mobile app (React Native)
- Payment gateway integration (Razorpay/Stripe)
- SMS notifications
- WhatsApp integration
- Advanced analytics dashboard
- Export/import functionality
- Bulk operations
- API rate limiting
- Admin dashboard
- Reporting system

### AI Improvements
- More ML models
- Better accuracy
- Faster inference
- Custom model training
- Edge deployment

## SUPPORT & DOCUMENTATION

### Getting Help
- Check documentation files
- Review API docs (/docs endpoint)
- Test with provided accounts
- Check browser console for errors
- Verify all services are running

### Common Issues
- **Can't login:** Use farmer@test.com / Farmer123
- **Services not starting:** Check ports 3000, 3001, 8001
- **Database errors:** Run `npx prisma db push`
- **AI not working:** Check OpenRouter API key in .env

This is the complete ODOP Connect platform knowledge base. Use this information to answer any user questions accurately and efficiently."""

class UniversalAI:
    """Universal AI that can answer ANYTHING - using Ollama (LOCAL, FREE, NO LIMITS!)"""
    
    def __init__(self):
        # Primary: Ollama (LOCAL AI - Best option!)
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "qwen2.5")
        
        # Fallback: OpenRouter (if Ollama not available)
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        self.openrouter_model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct:free")
        self.fallback_models = [
            "meta-llama/llama-3.1-8b-instruct:free",
            "google/gemma-2-9b-it:free",
            "microsoft/phi-3-mini-128k-instruct:free"
        ]
        
        # Create HTTP client
        self.http_client = httpx.AsyncClient(timeout=60.0)
        self.use_ollama = False
        self.use_openrouter = False
        
        # Check Ollama availability (BEST option - local, free, no limits!)
        try:
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            response = loop.run_until_complete(
                self.http_client.get(f"{self.ollama_url}/api/tags", timeout=5.0)
            )
            if response.status_code == 200:
                self.use_ollama = True
                logger.info(f"✅ Ollama connected - Using {self.ollama_model} model!")
                logger.info("🎉 LOCAL AI - No rate limits, works offline, multilingual!")
            loop.close()
        except Exception as e:
            logger.warning(f"⚠️ Ollama not available: {e}")
            logger.info("💡 Install Ollama: https://ollama.ai/download")
            logger.info("💡 Then run: ollama run qwen2.5")
        
        # Fallback to OpenRouter if Ollama not available
        if not self.use_ollama and self.openrouter_api_key and self.openrouter_api_key.startswith("sk-or-"):
            self.use_openrouter = True
            logger.info(f"✅ OpenRouter connected - Using {self.openrouter_model} model!")
            logger.warning("⚠️ OpenRouter has rate limits - Ollama is recommended!")
        
        if not self.use_ollama and not self.use_openrouter:
            logger.warning("⚠️ No AI backend available - using basic fallback responses")
            logger.info("💡 Install Ollama for best experience: ollama run qwen2.5")
        
        self.sessions: Dict[str, Any] = {}
        self.knowledge = ODOP_KNOWLEDGE
    
    async def create_session(self, user_id: str, user_profile: Optional[Dict] = None) -> str:
        """Create new conversation session"""
        session_id = f"session_{datetime.now().timestamp()}_{user_id}"
        
        self.sessions[session_id] = {
            "user_id": user_id,
            "user_profile": user_profile or {},
            "messages": [],
            "created_at": datetime.now(),
            "last_activity": datetime.now()
        }
        
        return session_id
    
    def _build_system_prompt(self) -> str:
        """Build Siri-style voice assistant system prompt with real-time data awareness"""
        return f"""You are an advanced AI voice assistant integrated with a LIVE web platform.
Your role is to understand, access, and use REAL-TIME data from the entire system to answer user queries and perform actions.

🌍 LANGUAGE SUPPORT:
- Support English, Hindi (हिंदी), and Marathi (मराठी)
- Detect user language automatically
- Always reply in the same language

🧠 CORE CAPABILITIES:

1. REAL-TIME DATA AWARENESS:
You have access to all live platform data through APIs:
- Products (inventory, prices, availability)
- Orders (status, tracking, history)
- Payments (transactions, balance, escrow)
- Users (profiles, reputation, KYC)
- Market data (prices, trends, forecasts)

ALWAYS base answers on LIVE data, not assumptions.

2. UNIVERSAL QUERY HANDLING:
Answer ANY question from the user:
- General knowledge: "What is photosynthesis?"
- Platform-related: "How do I add products?"
- Personal data: "Show my orders", "What's my balance?"

3. DATA FETCHING LOGIC:
When user asks about their data:
- "Show my orders" → Indicate you need to fetch from orders API
- "What is my balance?" → Indicate you need to fetch from payments API
- "Available products?" → Indicate you need to fetch from products API

Response format for data queries:
- If you don't have the data: "Let me check your [orders/products/balance]..."
- Then the frontend will fetch and provide the data
- Use the provided data to generate a natural response

4. ACTION EXECUTION (CRUD):
You can guide users to perform:

CREATE:
- Add product: Extract name, quantity, price
- Place order: Extract product, quantity
- Send payment: Extract recipient, amount

READ:
- View products/orders/transactions
- Check balance/status

UPDATE:
- Update product price/quantity
- Modify order details

DELETE:
- Delete product
- Cancel order

FLOW:
1. Understand intent
2. Extract required data
3. Ask if missing
4. Indicate action needed
5. Confirm result

5. SMART DECISION ENGINE:
- If query needs live data → indicate data fetch needed
- If query is general → answer normally
- If query is action → guide through steps

6. RESPONSE STYLE:
- Short, voice-friendly (1–3 sentences)
- Clear and natural
- No technical jargon

7. CONFIRMATIONS:
English: "Done", "Here are your orders", "Got it"
Hindi: "हो गया", "यह रहे आपके ऑर्डर", "ठीक है"
Marathi: "झाले", "हे तुमचे ऑर्डर आहेत", "ठीक आहे"

8. ERROR HANDLING:
- If data unavailable → "Unable to fetch data right now"
- If no data → "No records found"
- If missing input → ask clearly

9. SECURITY:
Confirm sensitive actions:
- Payments: "Confirm sending ₹500 to [name]?"
- Deletions: "Delete this product? Say yes or no."

10. CONTEXT MEMORY:
- Remember current conversation
- Use previous inputs for better responses

11. PLATFORM CONTEXT:
{self.knowledge}

🎯 FINAL GOAL:
You are not just a chatbot.
You are a REAL-TIME AI SYSTEM CONTROLLER that:
- Reads live data (when provided)
- Answers any question
- Guides through all operations
- Works like Siri

💬 RESPONSE EXAMPLES:

User: Show my orders
Assistant: Let me check your orders... [Frontend fetches data] You have 3 active orders: Tomatoes (20kg, ₹1000), Onions (15kg, ₹600), and Wheat (50kg, ₹2500).

User: मेरे ऑर्डर दिखाओ
Assistant: आपके ऑर्डर देख रहा हूं... [Data fetched] आपके 3 ऑर्डर हैं: टमाटर (20 किलो, ₹1000), प्याज (15 किलो, ₹600), और गेहूं (50 किलो, ₹2500)।

User: What is my balance?
Assistant: Checking your balance... [Data fetched] Your current balance is ₹15,450. You have ₹3,200 in escrow.

User: Add 20 kilo tomatoes at 50 rupees
Assistant: Creating product: Tomatoes, 20kg, ₹50 per kg. Total value ₹1000. Confirm?

User: What is photosynthesis?
Assistant: Photosynthesis is how plants make food using sunlight, water, and carbon dioxide. They produce oxygen as a byproduct.

Always prioritize real-time data over assumptions. When you need data, indicate it clearly so the frontend can fetch it."""
    
    async def chat(self, session_id: str, message: str, system_prompt: Optional[str] = None) -> str:
        """Main chat function - answers ANYTHING"""
        try:
            if session_id not in self.sessions:
                # Create session if it doesn't exist
                session_id = await self.create_session("anonymous")
            
            session = self.sessions[session_id]
            session["last_activity"] = datetime.now()
            
            # Add user message to history
            session["messages"].append({
                "role": "user",
                "content": message,
                "timestamp": datetime.now().isoformat()
            })
            
            if self.use_ollama:
                # Use Ollama - LOCAL AI (BEST!)
                response = await self._generate_ollama_response(session, message, system_prompt)
            elif self.use_openrouter:
                # Use OpenRouter - access to many AI models!
                response = await self._generate_openrouter_response(session, message, system_prompt)
            else:
                # Fallback to basic responses
                response = self._generate_fallback_response(message)
            
            # Add assistant response to history
            session["messages"].append({
                "role": "assistant",
                "content": response,
                "timestamp": datetime.now().isoformat()
            })
            
            return response
            
        except Exception as e:
            logger.error(f"Chat error: {e}")
            return f"I apologize, but I encountered an error: {str(e)}\n\nPlease try rephrasing your question, and I'll do my best to help!"
    
    async def _generate_ollama_response(self, session: Dict, message: str, system_prompt: Optional[str] = None) -> str:
        """Generate response using Ollama - LOCAL AI (no rate limits!)"""
        
        # Build messages for API
        final_system_prompt = system_prompt if system_prompt else self._build_system_prompt()
        messages = [
            {"role": "system", "content": final_system_prompt}
        ]
        
        # Add conversation history (last 10 messages for context)
        for msg in session["messages"][-10:]:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        try:
            logger.info(f"🤖 Calling Ollama with message: {message[:50]}...")
            
            payload = {
                "model": self.ollama_model,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "num_predict": 800
                }
            }
            
            response = await self.http_client.post(
                f"{self.ollama_url}/api/chat",
                json=payload,
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                result = data["message"]["content"].strip()
                logger.info(f"✅ Ollama response: {result[:100]}...")
                return result
            else:
                logger.error(f"❌ Ollama error: {response.status_code}")
                raise Exception(f"Ollama returned {response.status_code}")
                
        except Exception as e:
            logger.error(f"❌ Ollama failed: {type(e).__name__}: {str(e)}")
            logger.warning("⚠️ Falling back to basic responses")
            return self._generate_fallback_response(message)
    
    async def _generate_openrouter_response(self, session: Dict, message: str, system_prompt: Optional[str] = None) -> str:
        """Generate response using OpenRouter - tries multiple FREE models if rate-limited"""
        
        # Build messages for API
        final_system_prompt = system_prompt if system_prompt else self._build_system_prompt()
        messages = [
            {"role": "system", "content": final_system_prompt}
        ]
        
        # Add conversation history (last 10 messages for context)
        for msg in session["messages"][-10:]:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Try primary model first, then fallbacks
        models_to_try = [self.openrouter_model] + self.fallback_models
        
        for model in models_to_try:
            try:
                logger.info(f"Trying model: {model} with message: {message[:50]}...")
                
                headers = {
                    "Authorization": f"Bearer {self.openrouter_api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "ODOP Connect AI"
                }
                
                payload = {
                    "model": model,
                    "messages": messages,
                    "max_tokens": 800,
                    "temperature": 0.7,
                    "top_p": 0.9
                }
                
                response = await self.http_client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    result = data["choices"][0]["message"]["content"].strip()
                    logger.info(f"✅ Success with {model}: {result[:100]}...")
                    return result
                elif response.status_code == 429:
                    logger.warning(f"⚠️ Model {model} is rate-limited, trying next...")
                    continue
                else:
                    logger.error(f"❌ Model {model} error: {response.status_code}")
                    continue
                    
            except Exception as e:
                logger.error(f"❌ Model {model} exception: {type(e).__name__}: {str(e)}")
                continue
        
        # All models failed, use intelligent fallback
        logger.warning("⚠️ All OpenRouter models rate-limited, using intelligent fallback")
        return self._generate_fallback_response(message)
    
    def _generate_fallback_response(self, message: str) -> str:
        """Fallback response when no API key - Siri-style voice assistant"""
        message_lower = message.lower()
        
        # Detect language - check for Devanagari script
        has_devanagari = any('\u0900' <= char <= '\u097F' for char in message)
        
        # Marathi-specific detection
        is_marathi = any(char in message for char in ['ळ', 'ऱ']) or any(word in message for word in ['काय', 'कसं', 'आहे', 'आहेत', 'होते', 'असे'])
        
        # Hindi detection (Devanagari but not Marathi)
        is_hindi = has_devanagari and not is_marathi
        
        # Payment questions
        if any(word in message_lower for word in ["payment", "pay", "money", "escrow", "transaction", "पेमेंट", "पैसे", "रुपये", "पेमेंट"]):
            if is_marathi:
                return "नक्की. तुमचे पेमेंट पाहण्यासाठी डॅशबोर्डवर जा आणि Escrow Hub किंवा Payment Management वर क्लिक करा। तुम्हाला सर्व व्यवहार दिसतील."
            elif is_hindi:
                return "ज़रूर। अपने पेमेंट देखने के लिए डैशबोर्ड पर जाएं और Escrow Hub या Payment Management पर क्लिक करें। आपको सभी लेनदेन दिखेंगे।"
            else:
                return "Sure. To view your payments, go to your dashboard and click on Escrow Hub or Payment Management. You'll see all your transactions there."

        # Order tracking
        elif any(word in message_lower for word in ["track", "tracking", "order", "delivery", "ऑर्डर", "डिलीवरी", "ट्रैक"]):
            if is_marathi:
                return "ठीक आहे. तुमचे ऑर्डर ट्रॅक करण्यासाठी डॅशबोर्डवर जा आणि Order Tracker वर क्लिक करा। तुम्हाला सर्व ऑर्डर आणि त्यांची स्थिती दिसेल."
            elif is_hindi:
                return "ठीक है। अपने ऑर्डर ट्रैक करने के लिए डैशबोर्ड पर जाएं और Order Tracker पर क्लिक करें। आपको सभी ऑर्डर और उनकी स्थिति दिखेगी।"
            else:
                return "Got it. To track your orders, go to your dashboard and click on Order Tracker. You'll see all your orders and their current status."

        # Product management
        elif any(word in message_lower for word in ["add product", "create product", "list product", "sell", "प्रोडक्ट", "बेचना", "विकणे"]):
            if is_marathi:
                return "नक्की. प्रोडक्ट जोडण्यासाठी तुमच्या डॅशबोर्डवर जा, Product Management वर क्लिक करा, नंतर Add Product वर क्लिक करा। तपशील भरा आणि सबमिट करा."
            elif is_hindi:
                return "ज़रूर। प्रोडक्ट जोड़ने के लिए अपने डैशबोर्ड पर जाएं, Product Management पर क्लिक करें, फिर Add Product पर क्लिक करें। विवरण भरें और सबमिट करें।"
            else:
                return "Sure. To add a product, go to your dashboard, click on Product Management, then click Add Product. Fill in the details and submit."

        # Order placement
        elif any(word in message_lower for word in ["place order", "buy", "purchase", "खरीदना", "खरेदी"]):
            if is_marathi:
                return "ठीक आहे. ऑर्डर देण्यासाठी Sourcing Space वर जा, प्रोडक्ट शोधा, त्यावर क्लिक करा आणि Place Order बटण दाबा. मात्रा भरा आणि पेमेंट पूर्ण करा."
            elif is_hindi:
                return "ठीक है। ऑर्डर देने के लिए Sourcing Space पर जाएं, प्रोडक्ट खोजें, उस पर क्लिक करें और Place Order बटन दबाएं। मात्रा भरें और पेमेंट पूर्ण करें।"
            else:
                return "Alright. To place an order, go to Sourcing Space, search for a product, click on it, and press the Place Order button. Enter the quantity and complete payment."

        # Greetings
        elif any(word in message_lower for word in ["hello", "hi", "hey", "नमस्ते", "नमस्कार"]):
            if is_marathi:
                return "नमस्कार! मी तुमची ODOP Connect असिस्टंट आहे. मी तुम्हाला कशी मदत करू शकते?"
            elif is_hindi:
                return "नमस्ते! मैं आपकी ODOP Connect असिस्टेंट हूं। मैं आपकी कैसे मदद कर सकती हूं?"
            else:
                return "Hello! I'm your ODOP Connect assistant. How can I help you today?"

        # Help requests
        elif any(word in message_lower for word in ["help", "मदद", "साहाय्य"]):
            if is_marathi:
                return "नक्की! मी तुम्हाला प्रोडक्ट जोडणे, ऑर्डर ट्रॅक करणे, पेमेंट पाहणे आणि प्लॅटफॉर्म वापरण्यात मदत करू शकते. तुम्हाला काय माहिती हवी आहे?"
            elif is_hindi:
                return "ज़रूर! मैं आपको प्रोडक्ट जोड़ने, ऑर्डर ट्रैक करने, पेमेंट देखने और प्लेटफॉर्म इस्तेमाल करने में मदद कर सकती हूं। आपको क्या जानना है?"
            else:
                return "Sure! I can help you add products, track orders, view payments, and use the platform. What would you like to know?"

        # Default helpful response
        else:
            if is_marathi:
                return "मी तुमची ODOP Connect असिस्टंट आहे. मी तुम्हाला प्रोडक्ट व्यवस्थापन, ऑर्डर ट्रॅकिंग, पेमेंट आणि प्लॅटफॉर्म वैशिष्ट्यांबद्दल मदत करू शकते. तुम्हाला काय माहिती हवी आहे?"
            elif is_hindi:
                return "मैं आपकी ODOP Connect असिस्टेंट हूं। मैं आपको प्रोडक्ट मैनेजमेंट, ऑर्डर ट्रैकिंग, पेमेंट और प्लेटफॉर्म फीचर्स के बारे में मदद कर सकती हूं। आपको क्या जानना है?"
            else:
                return "I'm your ODOP Connect assistant. I can help you with product management, order tracking, payments, and platform features. What would you like to know?"
    
    async def get_conversation_summary(self, session_id: str) -> Dict[str, Any]:
        """Get conversation summary"""
        if session_id not in self.sessions:
            return {"error": "Session not found"}
        
        session = self.sessions[session_id]
        
        return {
            "session_id": session_id,
            "user_id": session["user_id"],
            "message_count": len(session["messages"]),
            "ollama_available": self.use_ollama,
            "openrouter_available": self.use_openrouter,
            "created_at": session["created_at"].isoformat(),
            "last_activity": session["last_activity"].isoformat()
        }
    
    def clear_session(self, session_id: str) -> bool:
        """Clear session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False
    
    def get_active_sessions(self) -> List[str]:
        """Get active sessions"""
        return list(self.sessions.keys())
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check"""
        return {
            "status": "healthy",
            "active_sessions": len(self.sessions),
            "backend": "ollama" if self.use_ollama else "openrouter" if self.use_openrouter else "fallback",
            "ollama_available": self.use_ollama,
            "ollama_model": self.ollama_model if self.use_ollama else None,
            "openrouter_available": self.use_openrouter,
            "openrouter_model": self.openrouter_model if self.use_openrouter else None,
            "can_answer_anything": self.use_ollama or self.use_openrouter,
            "timestamp": datetime.now().isoformat()
        }
    
    async def chat_with_context(
        self, 
        session_id: str, 
        message: str,
        user_id: Optional[str] = None,
        auth_token: Optional[str] = None,
        real_time_data: Optional[Dict] = None,
        system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Enhanced chat with real-time data context
        Automatically fetches data when needed and provides intelligent responses
        """
        try:
            from .data_context_service import data_context_service
            
            # Detect intent
            intent = await data_context_service.detect_intent(message)
            logger.info(f"Detected intent: {intent}")
            
            # If data query, fetch real-time data
            fetched_data = None
            if intent["requires_data"] and intent["entity_type"] and user_id:
                logger.info(f"Fetching {intent['entity_type']} data for user {user_id}")
                fetched_data = await data_context_service.fetch_user_data(
                    user_id, 
                    intent["entity_type"],
                    auth_token
                )
                logger.info(f"Data fetch result: {fetched_data.get('success', False)}")
            
            # Build enhanced message with data context
            enhanced_message = message
            if fetched_data and fetched_data.get("success"):
                data_summary = self._summarize_data(fetched_data["data"], intent["entity_type"])
                enhanced_message = f"{message}\n\n[REAL-TIME DATA FROM SYSTEM]: {data_summary}\n\nUse this live data to answer the user's question naturally."
                logger.info(f"Enhanced message with fetched data: {data_summary[:100]}...")
            elif real_time_data:
                # Use provided real-time data
                data_summary = self._summarize_data(real_time_data, intent["entity_type"])
                enhanced_message = f"{message}\n\n[REAL-TIME DATA FROM SYSTEM]: {data_summary}\n\nUse this live data to answer the user's question naturally."
                logger.info(f"Enhanced message with provided data: {data_summary[:100]}...")
            
            # Get AI response
            response = await self.chat(session_id, enhanced_message, system_prompt)
            
            return {
                "response": response,
                "intent": intent,
                "data_fetched": fetched_data is not None and fetched_data.get("success", False),
                "requires_confirmation": intent["requires_confirmation"],
                "data_summary": data_summary if (fetched_data or real_time_data) else None
            }
            
        except Exception as e:
            logger.error(f"Chat with context error: {e}")
            # Fallback to regular chat
            return {
                "response": await self.chat(session_id, message),
                "intent": {"intent_type": "general_question"},
                "data_fetched": False,
                "requires_confirmation": False,
                "data_summary": None
            }
    
    def _summarize_data(self, data: Any, entity_type: Optional[str]) -> str:
        """
        Summarize data for AI context
        Creates human-readable summaries of system data
        """
        try:
            if data is None:
                return "No data available"
            
            if isinstance(data, list):
                if len(data) == 0:
                    return "No records found in the system"
                
                if entity_type == "product":
                    summary = f"User has {len(data)} products in the system:\n"
                    for i, p in enumerate(data[:5], 1):
                        name = p.get('name', 'Unknown')
                        quantity = p.get('quantity', 0)
                        unit = p.get('unit', 'units')
                        price = p.get('price', 0)
                        status = p.get('status', 'active')
                        summary += f"{i}. {name}: {quantity} {unit} at ₹{price} per {unit} (Status: {status})\n"
                    if len(data) > 5:
                        summary += f"... and {len(data) - 5} more products"
                    return summary
                
                elif entity_type == "order":
                    summary = f"User has {len(data)} orders in the system:\n"
                    for i, o in enumerate(data[:5], 1):
                        order_id = o.get('id', 'N/A')
                        status = o.get('status', 'Unknown')
                        amount = o.get('totalAmount', 0)
                        product = o.get('productName', 'Unknown product')
                        summary += f"{i}. Order #{order_id}: {product} - {status} (₹{amount})\n"
                    if len(data) > 5:
                        summary += f"... and {len(data) - 5} more orders"
                    return summary
                
                elif entity_type == "payment":
                    total = sum(t.get('amount', 0) for t in data)
                    summary = f"User has {len(data)} transactions:\n"
                    for i, t in enumerate(data[:5], 1):
                        amount = t.get('amount', 0)
                        type_tx = t.get('type', 'Unknown')
                        status = t.get('status', 'Unknown')
                        summary += f"{i}. ₹{amount} - {type_tx} ({status})\n"
                    summary += f"Total transaction value: ₹{total}"
                    if len(data) > 5:
                        summary += f"\n... and {len(data) - 5} more transactions"
                    return summary
                
                elif entity_type == "tender":
                    summary = f"Found {len(data)} tenders:\n"
                    for i, t in enumerate(data[:5], 1):
                        title = t.get('title', 'Unknown')
                        status = t.get('status', 'Unknown')
                        deadline = t.get('deadline', 'N/A')
                        summary += f"{i}. {title} - {status} (Deadline: {deadline})\n"
                    if len(data) > 5:
                        summary += f"... and {len(data) - 5} more tenders"
                    return summary
                
                else:
                    return f"Found {len(data)} records in the system"
            
            elif isinstance(data, dict):
                # Handle single object or structured data
                if entity_type == "user":
                    name = data.get('name', 'Unknown')
                    role = data.get('role', 'Unknown')
                    email = data.get('email', 'N/A')
                    return f"User profile: {name} ({role}) - {email}"
                elif entity_type == "market":
                    return f"Market data: {str(data)[:200]}"
                else:
                    return f"Data: {str(data)[:200]}"
            
            return "Data available but format not recognized"
            
        except Exception as e:
            logger.error(f"Data summarization error: {e}")
            return "Data available but could not be summarized"
    
    async def close(self):
        """Close HTTP client"""
        await self.http_client.aclose()

# Global instance
universal_ai = UniversalAI()