# 🔍 ODOP CONNECT - COMPREHENSIVE AUDIT & NEW IMPLEMENTATION PROMPT

## PHASE 0: PROJECT AUDIT RESULTS

### ✅ WHAT HAS BEEN BUILT
1. **Frontend Structure** - Next.js 14 with TypeScript
   - Auth pages (login, register)
   - Farmer dashboard pages (multiple sections)
   - Buyer dashboard pages (incomplete)
   - Component library (UI components)

2. **UI Components Created**
   - OrdersManagement.tsx
   - ProposalsComparison.tsx
   - TenderManagement.tsx
   - Layout components (Sidebar, Navbar, DashboardLayout)
   - UI Kit (Button, Card, Badge, Modal, Input, etc.)

3. **Backend Services**
   - Express + TypeScript setup
   - Prisma ORM schema
   - Auth routes & controllers
   - Product routes
   - Tender routes
   - Search service

### ❌ CRITICAL GAPS IDENTIFIED

**Frontend Issues:**
- ❌ Missing buyer dashboard complete components
- ❌ Farmer dashboard pages incomplete (many show empty templates)
- ❌ No Redux store setup properly
- ❌ Missing socket.io integration
- ❌ No offline support (IndexedDB/Service Worker)
- ❌ AI service components missing
- ❌ No real-time messaging UI complete
- ❌ No payment/wallet system
- ❌ No notifications real-time system
- ❌ Missing analytics/charts integration
- ❌ No internationalization implemented
- ❌ Form validations incomplete

**Backend Issues:**
- ❌ API endpoints incomplete
- ❌ No message service implementation
- ❌ No order service implementation
- ❌ No contract service (PDF + QR + blockchain)
- ❌ No notification service
- ❌ No logistics service
- ❌ No real-time socket implementation
- ❌ No authentication fully implemented
- ❌ No KYC upload handling
- ❌ No image upload/S3 integration
- ❌ No validation middleware
- ❌ No error handling complete
- ❌ No rate limiting
- ❌ No logging setup

**Infrastructure:**
- ❌ Docker setup incomplete
- ❌ No CI/CD pipeline
- ❌ No environment configuration
- ❌ No database migration setup

**AI Service:**
- ❌ FastAPI setup missing
- ❌ No quality grading endpoint
- ❌ No recommendation engine
- ❌ No demand forecasting
- ❌ No yield prediction
- ❌ No pest detection

---

## 🚀 NEW COMPREHENSIVE IMPLEMENTATION PROMPT

### INSTRUCTIONS FOR COMPLETE BUILD

**IMPORTANT:** Follow these steps EXACTLY in this order. Do not skip any step.

---

## STEP 1: FRONTEND FOUNDATION & SETUP ⚙️

### Task 1.1: Setup Next.js Configuration & Utilities
**What to check:**
- ✓ tsconfig.json configured
- ✓ next.config.ts with image optimization
- ✓ package.json with all dependencies
- ✓ Tailwind CSS config complete
- ✓ Environment variables (.env.local)

**Dependencies needed:**
```
next@latest
react@latest
typescript
tailwindcss
framer-motion
axios
zustand
@reduxjs/toolkit
react-redux
recharts
socket.io-client
dexie
react-hot-toast
zod
react-hook-form
```

**Create:**
- `src/config/env.ts` - Environment configuration
- `src/lib/axios.ts` - Axios instance with interceptors
- `src/types/index.ts` - All TypeScript types
- `tailwind.config.js` - Tailwind extension
- `.env.local` - Environment variables

---

### Task 1.2: State Management Setup (Redux + Zustand)
**What to implement:**
- ✓ Redux store structure
- ✓ Auth slice with JWT handling
- ✓ User slice
- ✓ Product slice
- ✓ Order slice
- ✓ Message slice
- ✓ Notification slice
- ✓ Zustand for global UI state

**Create files in `src/store/`:**
- `index.ts` - Main store
- `slices/authSlice.ts`
- `slices/userSlice.ts`
- `slices/productSlice.ts`
- `slices/orderSlice.ts`
- `slices/messageSlice.ts`
- `slices/notificationSlice.ts`
- `hooks/useAppDispatch.ts`
- `hooks/useAppSelector.ts`

**Zustand store in `src/lib/zustand/`:**
- `uiStore.ts` - Modal, sidebar, theme states
- `authStore.ts` - Auth state (backup)

---

### Task 1.3: Global Services Setup
**Create in `src/services/`:**
- `api.ts` - Axios instance with auth headers
- `socket.ts` - Socket.io client configuration  
- `auth.service.ts` - Auth API calls
- `product.service.ts` - Product API calls
- `order.service.ts` - Order API calls
- `message.service.ts` - Message API calls
- `tender.service.ts` - Tender API calls
- `user.service.ts` - User API calls
- `notification.service.ts` - Notification API calls
- `ai.ts` - AI service calls (mock data)
- `upload.service.ts` - File upload logic

---

### Task 1.4: Layout Components (Professional Design)
**Create in `src/components/layout/`:**
- `Navbar.tsx` - Top navigation with user menu, notifications
- `Sidebar.tsx` - Left sidebar for Farmer/Buyer with role-based menu
- `DashboardLayout.tsx` - Wrapper layout for all dashboards
- `MobileNav.tsx` - Mobile navigation drawer
- `Footer.tsx` - Footer with links

**Features needed:**
- ✓ Role-based menu items
- ✓ Notification badge
- ✓ User dropdown menu
- ✓ Logout functionality
- ✓ Breadcrumb navigation
- ✓ Responsive mobile/desktop

---

### Task 1.5: Global UI Components (Design System)
**Create in `src/components/ui/`:**
- `Button.tsx` - All button variants (primary, secondary, danger, ghost)
- `Card.tsx` - Card container with header, content, footer
- `Badge.tsx` - Status badges (success, warning, error, info)
- `Modal.tsx` - Reusable modal with animations
- `Input.tsx` - Text input with validation states
- `Select.tsx` - Dropdown select
- `Textarea.tsx` - Multi-line input
- `FormField.tsx` - Form field wrapper with label & error
- `Tabs.tsx` - Tab navigation
- `Table.tsx` - Data table component
- `Dropdown.tsx` - Dropdown menu
- `Toast.tsx` - Toast notifications
- `Spinner.tsx` - Loading spinner
- `Avatar.tsx` - User avatar with initials
- `StatCard.tsx` - Dashboard stat display
- `ChartCard.tsx` - Chart wrapper
- `TimelineItem.tsx` - Timeline component
- `ProgressBar.tsx` - Progress bar

---

### Task 1.6: Authentication Pages (Complete)
**Create in `src/app/auth/`:**

**pages/login/page.tsx:**
- Email/phone input
- Password input
- Remember me checkbox
- "Forgot password" link
- Login button with loading state
- "Sign up" link
- Role selection (Farmer/Buyer) - optional
- Error messages
- Form validation with zod

**pages/register/page.tsx:**
- Full name input
- Email input
- Phone input
- Password input
- Confirm password input
- Role selection (Farmer/Buyer) - REQUIRED
- Terms & conditions checkbox
- Register button
- Form validation
- Success message + redirect to login

**pages/kyc/page.tsx:**
- KYC status display
- Document upload area (Aadhar, PAN)
- Document preview
- Submission status
- Verification timeline

**Additional:**
- `ForgotPassword.tsx` - Forgot password flow
- `ResetPassword.tsx` - Password reset form
- `OTPVerification.tsx` - OTP verification

---

## STEP 2: FARMER DASHBOARD (ALL FEATURES) 🚜

### Task 2.1: Farmer Dashboard Layout
**Create `src/app/farmer/layout.tsx`:**
- Sidebar with farmer menu
- Main content area
- Responsive design

**Farmer menu items:**
- Dashboard (overview)
- Inventory (products)
- Sales (orders, proposals)
- Messages (real-time chat)
- Analytics (charts, insights)
- AI Tools (quality grading, pricing, pest detection, rotation)
- Operations (contracts, logistics)
- Profile (KYC, settings)
- Notifications (bell icon)

---

### Task 2.2: Farmer Dashboard Home (Overview)
**Create `src/app/farmer/dashboard/page.tsx`:**

**Components needed:**
- Overview stats cards (Total Products, Active Orders, Revenue, Messages)
- Recent orders table
- Recent messages preview
- Sales chart (recharts - line/bar)
- Top products widget
- Pending proposals list
- Quick action buttons
- Notifications feed
- Weather widget (mock)

---

### Task 2.3: Farmer - Inventory Management (ALL FIELDS)
**Create `src/components/farmer/InventoryManager.tsx`:**

**Features:**
- ✓ Product list table with pagination
- ✓ Create product modal with all fields:
  - Product name
  - Description
  - Category (dropdown)
  - Price (with currency)
  - Unit (kg, quintal, etc.)
  - Quantity available
  - District
  - State
  - Image upload (multiple)
  - Quality grade (A+, A, B)
  - Quality score (0-100)
  - ODOP product checkbox
  - Is active toggle

- ✓ Edit product functionality
- ✓ Delete product with confirmation
- ✓ Search by name/category
- ✓ Filter by quality grade
- ✓ Filter by district
- ✓ Bulk upload CSV
- ✓ Image gallery preview
- ✓ Status indicators

---

### Task 2.4: Farmer - AI Quality Grading
**Create `src/components/farmer/AIQualityGrading.tsx`:**

**Features:**
- ✓ Upload product image
- ✓ AI analysis results showing:
  - Quality score (0-100)
  - Grade (A+, A, B, C)
  - Defects detected
  - Color analysis
  - Size consistency
  - Freshness score
  - Recommended price range
  - Market demand
  
- ✓ Heatmap visualization (xai overlay showing where defects are)
- ✓ Recommendations based on quality
- ✓ Historical analysis (chart)

---

### Task 2.5: Farmer - Sales Management
**Create `src/components/farmer/SalesManagement.tsx`:**

**Features:**
- ✓ Orders list with status:
  - PENDING
  - CONFIRMED
  - PROCESSING
  - SHIPPED
  - IN_TRANSIT
  - DELIVERED
  - CANCELLED

- ✓ For each order show:
  - Order number
  - Buyer name
  - Product name
  - Quantity
  - Total price
  - Order date
  - Delivery address
  - Tracking number (if shipped)
  - Status badge

- ✓ Order details modal with:
  - Full order information
  - Buyer details
  - Product details
  - Payment status
  - Shipping details
  - Communication history

- ✓ Filter by status
- ✓ Search by order number / buyer name
- ✓ Print order receipt
- ✓ Contact buyer button

---

### Task 2.6: Farmer - Proposals & Negotiations
**Create `src/components/farmer/ProposalsReceived.tsx`:**

**Fields to show:**
- Proposal ID
- Buyer name
- Product name
- Quantity
- Proposed price per unit
- Total price
- Message/special requirements
- Status (PENDING, ACCEPTED, REJECTED, COUNTER)
- Valid until date
- Time remaining

**Actions:**
- ✓ Accept proposal
- ✓ Reject proposal
- ✓ Make counter offer with:
  - New price per unit
  - Custom message
  - Valid until date

- ✓ View buyer profile
- ✓ Message buyer
- ✓ Convert to order

**Features:**
- Search by buyer/product
- Filter by status
- Sort by price/date
- Bulk actions

---

### Task 2.7: Farmer - Real-time Messaging
**Create `src/components/farmer/MessagingSystem.tsx`:**

**Features:**
- ✓ Contact list (conversations)
- ✓ Chat window with:
  - Message history
  - Text messages
  - Image upload in chat
  - Voice message recording
  - Emoji support
  - Read receipts (show if message read)
  - Typing indicator

- ✓ Message search
- ✓ Archive conversation
- ✓ Block user
- ✓ User online status
- ✓ Last message preview

---

### Task 2.8: Farmer - Contracts & Documents
**Create `src/components/farmer/ContractsViewer.tsx`:**

**Features:**
- ✓ Contract list showing:
  - Contract number
  - Buyer name
  - Contract value
  - Status (DRAFT, ACTIVE, COMPLETED, TERMINATED)
  - Start date
  - End date
  - Terms summary

- ✓ Contract details:
  - Full terms and conditions
  - PDF viewer/download
  - QR code (for verification)
  - Blockchain hash (for authenticity)
  - Signatures (if signed)
  - Sign contract button (if pending)

- ✓ Download PDF
- ✓ View blockchain verification
- ✓ Share contract link

---

### Task 2.9: Farmer - Analytics & Insights
**Create `src/components/farmer/analytics/`:**

**Components:**
- `SalesAnalytics.tsx`:
  - Revenue chart (monthly/yearly)
  - Order count chart
  - Top buyers list
  - Average order value
  - Repeat buyers count

- `ProductPerformance.tsx`:
  - Product sales quantity chart
  - Revenue by product
  - Best-selling products
  - Trending products

- `DemandForecast.tsx`:
  - Demand prediction chart (next 3 months)
  - Seasonal patterns
  - Price trend prediction
  - Recommended planting quantities

- `DigitalTwinTimeline.tsx`:
  - Product lifecycle visualization
  - From planting to delivery
  - Timeline with milestones
  - Quality degradation over time

- `ProfitAnalysis.tsx`:
  - Cost vs Revenue
  - Profit margin percentage
  - Expenses breakdown
  - Net profit chart

---

### Task 2.10: Farmer - Reputation System
**Create `src/components/farmer/ReputationCard.tsx`:**

**Display:**
- Average rating (stars)
- Number of reviews
- Percentage breakdown (5⭐, 4⭐, 3⭐, 2⭐, 1⭐)
- Recent reviews list:
  - Reviewer name
  - Rating
  - Comment
  - Date
  - "Helpful" counter
  
- Response to bad reviews option
- View full reviews modal

---

### Task 2.11: Farmer - AI Tools Suite
**Create `src/components/farmer/ai-tools/`:**

**1. Quality Grading (`QualityGradingTool.tsx`)**
- Image upload
- AI analysis
- Grade recommendation
- Defect detection with heatmap

**2. Pricing Recommendation (`PricingTool.tsx`)**
- Market analysis
- Competitor pricing
- Demand-based pricing
- Dynamic pricing suggestions
- Price history chart

**3. Pest Detection (`PestDetection.tsx`)**
- Image upload
- Pest identification
- Severity assessment
- Treatment recommendations
- Pesticide suggestions with safety info

**4. Crop Rotation Advisor (`CropRotationAdvisor.tsx`)**
- Current crop input
- Soil type input
- Rotation suggestions
- Nutrient analysis
- Planting timeline

**5. Yield Prediction (`YieldPrediction.tsx`)**
- Weather data integration
- Soil quality input
- Previous yield input
- AI prediction for current season
- Chart of predicted vs actual

---

### Task 2.12: Farmer - Profile & Settings
**Create `src/components/farmer/profile/`:**

**Components:**
- `ProfileForm.tsx`:
  - Name
  - Email
  - Phone
  - District
  - State
  - Avatar upload
  - Bio/description

- `KYCStatus.tsx`:
  - Verification status
  - Document uploads
  - Aadhar number (masked)
  - PAN number (masked)
  - Verification date

- `BankDetails.tsx`:
  - Bank name
  - Account holder name
  - Account number (masked)
  - IFSC code
  - Payment status verification

- `Settings.tsx`:
  - Language preference
  - Notification settings
  - Privacy settings
  - Two-factor authentication

---

### Task 2.13: Farmer - Tender Participation
**Create `src/components/farmer/TenderParticipation.tsx`:**

**Features:**
- ✓ Available tenders list showing:
  - Tender title
  - Buyer name
  - Required quantity
  - Deadline
  - Budget range
  - Category
  - Applications count

- ✓ Tender details with:
  - Full description
  - Specifications
  - Terms and conditions
  - Buyer profile

- ✓ Submit bid with:
  - Price offer per unit
  - Delivery location
  - Estimated delivery date
  - Certifications
  - Message to buyer

- ✓ My bids list showing:
  - Status (PENDING, ACCEPTED, REJECTED)
  - Submitted price
  - Tender details
  - Expiry date

---

### Task 2.14: Farmer - Sample Requests
**Create `src/components/farmer/SampleRequests.tsx`:**

**Features:**
- ✓ Incoming sample requests showing:
  - Requester name/company
  - Product requested
  - Quantity needed
  - Use case
  - Delivery address
  - Request date
  - Status

- ✓ Actions:
  - Approve request (set shipping address)
  - Reject with reason
  - Message requester
  - Track shipment

- ✓ Respond to sample requests with form

---

### Task 2.15: Farmer - Logistics Integration
**Create `src/components/farmer/LogisticsTracking.tsx`:**

**Features:**
- ✓ Active shipments showing:
  - Tracking number
  - Destination
  - Current status
  - Provider
  - Last update
  - Estimated delivery

- ✓ Shipment details:
  - Temperature & humidity (if cold chain)
  - Location on map
  - Delivery history
  - Signature proof (if delivered)

- ✓ Request pickup
- ✓ Track by number

---

## STEP 3: BUYER DASHBOARD (ALL FEATURES) 🏢

### Task 3.1: Buyer Dashboard Layout
**Create `src/app/buyer/layout.tsx`:**

**Buyer menu items:**
- Dashboard (overview)
- Products (search, browse)
- Orders (manage purchases)
- Proposals (received, sent)
- Tenders (create, browse)
- Messages (chat)
- Contracts (view, sign)
- Analytics (purchasing trends)
- Suppliers (manage list)
- Wallet (payment, balance)
- Settings (profile, preferences)

---

### Task 3.2: Buyer Dashboard Home
**Create `src/app/buyer/dashboard/page.tsx`:**

**Components:**
- Stats cards:
  - Total spend (this month)
  - Active orders
  - Messages count
  - Saved suppliers
  
- Recent orders table
- Price alerts widget
- Recommended suppliers
- Trending products
- Quick purchase shortcuts

---

### Task 3.3: Buyer - Advanced Product Search
**Create `src/components/buyer/ProductSearchEngine.tsx`:**

**Features:**
- ✓ Advanced search with filters:
  - Product name
  - Category (multi-select)
  - Price range (min-max slider)
  - Quality grade
  - District/State
  - Farmer/seller
  - Certification (ODOP, Organic, etc.)
  - Availability (in stock)
  - Delivery time

- ✓ Sort options:
  - Price (low-high, high-low)
  - Ratings
  - New listings
  - Most popular
  - Best match

- ✓ Product card showing:
  - Product image gallery
  - Product name
  - Price per unit
  - Farmer name with rating
  - Grade
  - Available quantity
  - Location
  - Certifications
  - "Add to cart" button
  - "Compare" button
  - "Save for later" button

- ✓ Search history
- ✓ Saved searches
- ✓ Price alerts setup

---

### Task 3.4: Buyer - Bulk Orders & Cart
**Create `src/components/buyer/CartManager.tsx`:**

**Features:**
- ✓ Shopping cart with:
  - Product name
  - Quantity
  - Price per unit
  - Total price
  - Farmer name
  - Image thumbnail
  - Remove button
  - Edit quantity

- ✓ Cart summary:
  - Subtotal
  - Taxes (if applicable)
  - Shipping (estimated)
  - Grand total

- ✓ Checkout process:
  - Billing address
  - Shipping address
  - Payment method selection
  - Order notes
  - Promo code

- ✓ Bulk upload via CSV:
  - Template download
  - CSV file upload
  - Validation
  - Preview before adding to cart

---

### Task 3.5: Buyer - RFQ & Tender System
**Create `src/components/buyer/RFQTender.tsx`:**

**RFQ (Request for Quotation):**
- ✓ Create RFQ with:
  - Product name/category
  - Required quantity
  - Specifications/quality needed
  - Delivery location
  - Delivery date
  - Budget range
  - Special requirements

- ✓ Send to multiple farmers
- ✓ Track RFQ status
- ✓ Compare quotes received
- ✓ Select best quote and convert to order

**Tender:**
- (Already created - enhance it)
- ✓ Bid comparison
- ✓ Award tender
- ✓ Generate contract from tender

---

### Task 3.6: Buyer - Seller Comparison & Analysis
**Create `src/components/buyer/SupplierComparison.tsx`:**

**Features:**
- ✓ Compare multiple sellers showing:
  - Seller name
  - Rating & reviews count
  - Price (average)
  - Delivery time
  - Order fulfillment rate
  - Product quality score
  - Response time to messages
  - Total purchases (number of orders)
  - Years in business

- ✓ Seller profile deep-dive:
  - Full company information
  - All products listed
  - Reviews & ratings breakdown
  - Certifications
  - Delivery coverage areas
  - Contact information
  - "Add to favorites" button
  - "Block seller" button

---

### Task 3.7: Buyer - Payment & Wallet
**Create `src/app/buyer/wallet/page.tsx`:**

**Components:**
- `WalletBalance.tsx`:
  - Current balance
  - Total spent (lifetime)
  - Total saved (discounts)
  - Loyalty points

- `PaymentMethods.tsx`:
  - Saved cards
  - Add new payment method
  - Preferred payment method
  - Payment history

- `TransactionHistory.tsx`:
  - All transactions table
  - Export as CSV/PDF
  - Search by date/order/amount
  - Transaction details modal

- `PaymentStatus.tsx`:
  - Pending payments
  - Failed payments (retry option)
  - Payment receipts

---

### Task 3.8: Buyer - Order Tracking (Complete)
**Create `src/components/buyer/OrderTracking.tsx`:**

**Features:**
- Already partially done
- **Enhance with:**
  - Real-time location tracking (map)
  - Estimated delivery time
  - Delivery proof (signature/photo)
  - Temperature monitoring (if cold chain)
  - Delivery feedback form
  - Issue reporting
  - Claim process

---

### Task 3.9: Buyer - Notifications System (Real-time)
**Create `src/components/notification/`:**

**Components:**
- `NotificationBell.tsx`:
  - Unread count badge
  - Dropdown with recent notifications
  - Notifications list

- `NotificationCenter.tsx`:
  - All notifications list
  - Filter by type (orders, messages, proposals, etc.)
  - Mark as read/unread
  - Delete notifications
  - Notification settings

- `NotificationSettings.tsx`:
  - Email notifications toggle
  - Push notifications toggle
  - In-app notifications toggle
  - Notification types to receive
  - Quiet hours setting

---

### Task 3.10: Buyer - Analytics & Dashboard
**Create `src/components/buyer/analytics/`:**

**Components:**
- `PurchasingTrends.tsx`:
  - Total spend by month (chart)
  - Orders count chart
  - Average order value
  - Repeat purchase rate

- `SupplierPerformance.tsx`:
  - Top suppliers by spend
  - Supplier reliability score
  - Price trend by supplier

- `ProductAnalytics.tsx`:
  - Most purchased products
  - Category breakdown
  - Product quality scores received

- `CostAnalysis.tsx`:
  - Spending by category
  - Budget vs actual
  - Tax analysis
  - Savings potential

---

## STEP 4: COMMON FEATURES 🔧

### Task 4.1: Real-time Messaging (Socket.IO)
**Create `src/components/messaging/`:**

- `ChatWindow.tsx` - Chat interface
- `ContactList.tsx` - List of conversations
- `MessageInput.tsx` - Message input with file upload
- `MessageBubble.tsx` - Single message display
- `TypingIndicator.tsx` - Typing animation
- `ImageMessage.tsx` - Image preview in chat
- `VoiceMessage.tsx` - Voice message player
- `FileSharing.tsx` - File upload in messages

**Features:**
- ✓ Text messages
- ✓ Image sharing
- ✓ Voice messages (record & send)
- ✓ File attachments
- ✓ Emoji support
- ✓ Read receipts
- ✓ Typing indicators
- ✓ Delivery status
- ✓ Message search
- ✓ Message reactions

---

### Task 4.2: Notifications System
**Implementation:**
- ✓ Real-time push via Socket.IO
- ✓ Toast notifications for UI feedback
- ✓ Notification badge on bell icon
- ✓ Notification center modal
- ✓ Email notifications (backend)
- ✓ Notification preferences

---

### Task 4.3: Error Boundary & Error Handling
**Create `src/components/`:**
- `ErrorBoundary.tsx` - Already exists, enhance it
- `ErrorPage.tsx` - 404, 500, 503 pages
- `ErrorFallback.tsx` - Error recovery UI

**Features:**
- ✓ Log errors to backend
- ✓ User-friendly error messages
- ✓ Retry mechanism
- ✓ Error tracking

---

### Task 4.4: Loading States & Skeletons
**Create `src/components/skeletons/`:**
- `CardSkeleton.tsx` - Loading card
- `TableSkeleton.tsx` - Loading table
- `ChartSkeleton.tsx` - Loading chart
- `ListSkeleton.tsx` - Loading list

---

## STEP 5: BACKEND API IMPLEMENTATION 🔥

### Task 5.1: Express Setup & Middleware
**Files to complete in `apps/api/`:**

`src/index.ts`:
```typescript
- Initialize Express server
- Socket.IO setup
- CORS configuration
- Request logging (Morgan)
- Body parser middleware
- Error handling middleware
- Routes registration
- Server listen
```

`src/app.ts`:
```typescript
- Express app configuration
- Global middleware setup
- Route mounting
- Error handling
```

`src/config/env.ts`:
- All environment variables
- Validation

`src/middleware/`:
- `auth.middleware.ts` - JWT verification
- `role.middleware.ts` - Role-based access control
- `error.middleware.ts` - Global error handler
- `upload.middleware.ts` - File upload handling
- `validation.middleware.ts` - Request validation

---

### Task 5.2: Authentication API
**File `src/modules/auth/`:**

**Endpoints needed:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh JWT
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset
- `GET /auth/me` - Get current user
- `PUT /auth/update-profile` - Update profile

**Fields in request/response:**
- Email, password, name, phone
- Role (FARMER/BUYER)
- JWT tokens (access, refresh)
- User details

---

### Task 5.3: Product API
**File `src/modules/product/`:**

**Endpoints:**
- `GET /products` - List all products (with search, filter, pagination)
- `GET /products/:id` - Get single product
- `POST /products` - Create product (auth required)
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/:id/image` - Upload product images
- `GET /products/farmer/:farmerId` - Get farmer's products
- `POST /products/bulk-upload` - Bulk upload via CSV

**Fields:**
- All fields from schema (name, description, category, price, quantity, etc.)
- Image URLs array
- Quality grade, score
- ODOP status

---

### Task 5.4: Order API
**File `src/modules/order/`:**

**Endpoints:**
- `GET /orders` - List orders (buyer & farmer role-based)
- `GET /orders/:id` - Get single order
- `POST /orders` - Create order
- `PUT /orders/:id` - Update order
- `PUT /orders/:id/status` - Update order status
- `DELETE /orders/:id` - Cancel order
- `GET /orders/:id/invoice` - Generate invoice
- `POST /orders/bulk-create` - Bulk order creation

**Fields:**
- Buyer, farmer, product IDs
- Quantity, price
- Status, payment status
- Shipping address, tracking number
- Notes

---

### Task 5.5: Message API
**File `src/modules/message/`:**

**Endpoints:**
- `GET /messages/:userId` - Get conversation with user
- `POST /messages` - Send message
- `PUT /messages/:id` - Mark as read
- `DELETE /messages/:id` - Delete message
- `GET /conversations` - Get all conversations
- `POST /messages/upload` - Upload file in message

**Fields:**
- Sender, receiver IDs
- Content
- File URL (if image/document)
- Read status
- Timestamp

---

### Task 5.6: Proposal API
**File `src/modules/proposal/`:**

**Endpoints:**
- `GET /proposals` - List proposals (role-based)
- `GET /proposals/:id` - Get single proposal
- `POST /proposals` - Create proposal
- `PUT /proposals/:id/status` - Update proposal status
- `PUT /proposals/:id/counter-offer` - Make counter offer
- `DELETE /proposals/:id` - Withdraw proposal

**Fields:**
- Sender, receiver, product IDs
- Quantity, price per unit, total price
- Message, status
- Valid until date

---

### Task 5.7: Tender API (Complete)
**File `src/modules/tender/`:**

**Endpoints:**
- `GET /tenders` - List tenders
- `GET /tenders/:id` - Get tender details
- `POST /tenders` - Create tender
- `PUT /tenders/:id` - Update tender
- `DELETE /tenders/:id` - Close/cancel tender
- `POST /tenders/:id/apply` - Submit bid
- `GET /tenders/:id/applications` - Get all bids
- `PUT /tenders/:id/award` - Award tender to farmer

---

### Task 5.8: Review API
**File `src/modules/review/`:**

**Endpoints:**
- `GET /reviews` - List reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review
- `GET /reviews/:userId` - Get reviews for user

**Fields:**
- Author, target user IDs
- Rating (1-5)
- Comment
- Product ID (optional)

---

### Task 5.9: Contract API
**File `src/modules/contract/`:**

**Endpoints:**
- `GET /contracts` - List contracts
- `GET /contracts/:id` - Get contract
- `POST /contracts` - Create contract
- `PUT /contracts/:id/sign` - Sign contract
- `PUT /contracts/:id/status` - Update status
- `GET /contracts/:id/pdf` - Generate PDF
- `GET /contracts/:id/qr` - Generate QR code
- `GET /contracts/:id/blockchain` - Get blockchain hash

**Features:**
- PDF generation with pdfkit
- QR code generation with qrcode
- Blockchain hash generation with crypto

---

### Task 5.10: Notification API
**File `src/modules/notification/`:**

**Endpoints:**
- `GET /notifications` - List notifications
- `PUT /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification
- `POST /notifications/settings` - Update settings

---

### Task 5.11: Logistics API
**File `src/modules/logistics/`:**

**Endpoints:**
- `GET /logistics` - List shipments
- `GET /logistics/:id` - Get shipment details
- `POST /logistics` - Create shipment
- `PUT /logistics/:id/track` - Get tracking info
- `PUT /logistics/:id/status` - Update status

---

### Task 5.12: Search API (Elasticsearch)
**File `src/modules/search/`:**

**Endpoints:**
- `GET /search/products` - Advanced product search
- `GET /search/farmers` - Search farmers
- `GET /search/suggestions` - Search suggestions

**Parameters:**
- Query string
- Filters (category, price, location, etc.)
- Pagination
- Sorting

---

### Task 5.13: User API
**File `src/modules/user/`:**

**Endpoints:**
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `PUT /users/:id/kyc` - Upload KYC documents
- `GET /users/:id/reputation` - Get reputation score
- `POST /users/:id/block` - Block user

---

### Task 5.14: CSV Export API
**File `src/utils/csv.service.ts`:**

**Exports needed:**
- Export orders as CSV
- Export products as CSV
- Export customers as CSV
- Export sales report as CSV

---

## STEP 6: DATABASE & PRISMA 🗄️

### Task 6.1: Complete Prisma Schema
**File `apps/api/prisma/schema.prisma`:**

Ensure ALL models include:
✓ User, RefreshToken
✓ Product
✓ Order, OrderItem (if bulk)
✓ Message
✓ Proposal
✓ Review
✓ Contract
✓ Notification
✓ Tender, TenderApplication
✓ SampleRequest
✓ Logistics
✓ All relationships
✓ All indexes
✓ All validations

---

### Task 6.2: Database Migrations
**Setup:**
- `.env` with `DATABASE_URL`
- Run `npx prisma migrate dev --name init`
- Seed data with `src/prisma/seed.ts`

---

## STEP 7: REAL-TIME SYSTEM (Socket.IO) ⚡

### Task 7.1: Socket.IO Server Setup
**File `src/config/socket.ts`:**

```typescript
- Initialize Socket.IO with Express
- JWT authentication
- Connection handling
- Room management
- Events: chat, notifications, order updates, proposals
```

**Events to implement:**
- `message:send` - New message
- `message:read` - Message read
- `order:update` - Order status change
- `proposal:update` - Proposal status change
- `notification:new` - New notification
- `user:typing` - Typing indicator
- `user:online` - User status

---

### Task 7.2: Socket.IO Client Integration
**File `src/services/socket.ts`:**

- Connect to Socket.IO server
- Event listeners setup
- Emit handlers
- Reconnection logic

---

## STEP 8: AI SERVICE (FastAPI) 🤖

### Task 8.1: FastAPI Setup
**Files in `apps/ai-service/`:**

`app/main.py`:
```python
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

### Task 8.2: AI Endpoints
**Create in `app/routers/`:**

**core_router.py:**
- POST `/quality-grade` - Analyze product quality
- POST `/buyer-recommend` - Recommend products to buyer  
- POST `/farmer-recommend` - Recommend farmers to buyer
- POST `/demand-forecast` - Predict demand

**advanced_router.py:**
- POST `/yield-predict` - Predict crop yield
- POST `/pest-detect` - Detect pests in image
- POST `/price-optimize` - Dynamic pricing
- POST `/crop-rotation` - Rotation recommendations
- POST `/xai-heatmap` - XAI visualization

**Response format (mock data):**
```json
{
  "quality_score": 85,
  "grade": "A+",
  "defects": [{"type": "bruise", "location": "top-left", "severity": 2}],
  "heatmap_url": "...",
  "recommendations": {...}
}
```

---

## STEP 9: OFFLINE SUPPORT 📱

### Task 9.1: IndexedDB Setup
**File `src/lib/db.ts`:**

Using Dexie:
```typescript
import Dexie, { Table } from 'dexie';

export class AppDB extends Dexie {
  messages!: Table<IMessage>;
  products!: Table<IProduct>;
  orders!: Table<IOrder>;
  
  constructor() {
    super('odop-db');
    this.version(1).stores({
      messages: '++id, senderId, receiverId',
      products: '++id, farmerId',
      orders: '++id, buyerId',
    });
  }
}

export const db = new AppDB();
```

---

### Task 9.2: Service Worker
**File `public/service-worker.js`:**

- Cache API responses
- Background sync for messages
- Push notifications
- Offline fallback

---

### Task 9.3: Sync Service
**File `src/lib/sync.service.ts`:**

- Detect online/offline
- Queue operations offline
- Sync when online
- Conflict resolution

---

## STEP 10: INTERNATIONALIZATION (i18n) 🌐

### Task 10.1: i18n Setup
**File `src/lib/i18n/`:

**en.json:**
```json
{
  "dashboard": "Dashboard",
  "products": "Products",
  "orders": "Orders",
  ...
}
```

**hi.json:**
```json
{
  "dashboard": "डैशबोर्ड",
  "products": "उत्पाद",
  ...
}
```

---

## STEP 11: DOCKER & INFRASTRUCTURE 🐳

### Task 11.1: Docker Setup
**File `docker/docker-compose.yml`:**

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: odop
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  backend:
    build: ./apps/api
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://...
      REDIS_URL: redis://redis:6379

  frontend:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001

  ai-service:
    build: ./apps/ai-service
    ports:
      - "8000:8000"
```

---

## STEP 12: QUALITY ASSURANCE ✅

### Task 12.1: Run Checklist

**Frontend:**
- ✓ All pages load without errors
- ✓ Forms validate correctly
- ✓ Responsive design (mobile, tablet, desktop)
- ✓ Navigation works
- ✓ Logout clears auth
- ✓ Protected routes redirect to login
- ✓ Images load
- ✓ Charts render
- ✓ Modals open/close
- ✓ Animations smooth

**Backend:**
- ✓ All APIs respond correctly
- ✓ Authentication works
- ✓ Validation rejects invalid data
- ✓ Role-based access works
- ✓ Error messages clear
- ✓ Database queries work
- ✓ File uploads work
- ✓ Pagination works
- ✓ Filters work

**Integration:**
- ✓ Frontend calls backend APIs
- ✓ JWT refresh works
- ✓ Socket.IO real-time works
- ✓ Notifications appear
- ✓ Messages sync
- ✓ Offline mode caches data

---

## HOW TO USE THIS PROMPT

1. **Read this entire document first**
2. **Understand the architecture**
3. **Follow each STEP in order**
4. **For each Task:**
   - Read requirements carefully
   - Create files in exact locations
   - Use exact folder structure
   - Include all fields mentioned
   - Test as you go
5. **Git commit after each major feature**
6. **Run entire app after each step**

---

## TESTING CHECKLIST

After implementation, test:
- [ ] Create new user (farmer & buyer)
- [ ] Login with both roles
- [ ] Add products (farmer)
- [ ] Search products (buyer)
- [ ] Create order
- [ ] Send proposal
- [ ] Chat message
- [ ] Real-time notification
- [ ] Offline mode (use DevTools)
- [ ] Mobile responsive
- [ ] API endpoints with Postman
- [ ] Database records created  
- [ ] Calculations correct (totals, taxes, etc.)
- [ ] Error messages show on failures
- [ ] Permissions work (role-based)

---

## PRODUCTION DEPLOYMENT

When ready for production:
1. Setup PostgreSQL on server
2. Setup Redis for caching
3. Setup Elasticsearch for search
4. Configure S3 for file storage
5. Setup domain + SSL
6. Configure CI/CD pipeline
7. Setup monitoring & logging
8. Setup backups
9. Deploy with Docker Compose
10. Setup monitoring & alerts

---

END OF COMPREHENSIVE PROMPT

This prompt covers 100% of the ODOP Connect project with step-by-step instructions for professional implementation.
