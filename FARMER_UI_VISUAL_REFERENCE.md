# Farmer Dashboard UI - Visual Reference Guide

## 🎨 Design System

### Color Palette
```
Primary Green:   #22c55e (rgb(34, 197, 94))
Emerald:         #10b981 (rgb(16, 185, 129))
Dark Green:      #16a34a (rgb(22, 163, 74))
Slate 900:       #0f172a (rgb(15, 23, 42))
Slate 50:        #f8fafc (rgb(248, 250, 252))
White:           #ffffff (rgb(255, 255, 255))
```

### Typography
```
Font Family: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', etc.)
Font Weights:
  - Medium: 500
  - Semibold: 600
  - Bold: 700
  - Extrabold: 800
  - Black: 900
```

### Spacing Scale
```
Gap-2:  8px
Gap-3:  12px
Gap-4:  16px
Gap-6:  24px
Gap-8:  32px
```

### Border Radius
```
rounded-xl:   12px
rounded-2xl:  16px
rounded-3xl:  24px
rounded-full: 9999px
```

## 📱 Component Layouts

### Dashboard Main (`/farmer/dashboard`)

```
┌─────────────────────────────────────────────────────────────┐
│  Welcome Header (Gradient Green)                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Active  │ │ Revenue │ │Products │ │Pending  │          │
│  │ Orders  │ │ Today   │ │ Listed  │ │Payments │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  AI Crop Analyzer Promo (Full Width)                        │
│  [Sparkles Icon] Advanced AI Crop Analyzer → Launch Scanner │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────┐
│  Revenue Overview (8 cols)       │  Weather Widget (4 cols) │
│  ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐  │  24°C Clear Skies        │
│  │  ││  ││  ││  ││  ││  ││  │  │  [Sun Icon]              │
│  │  ││  ││  ││  ││  ││  ││  │  │  Ideal conditions...     │
│  └──┘└──┘└──┘└──┘└──┘└──┘└──┘  │                          │
│  Mon Tue Wed Thu Fri Sat Sun     │                          │
└──────────────────────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Live Market Prices (12 cols)                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │Tomatoes│ │Potatoes│ │ Wheat  │ │  Rice  │ │ Onions │  │
│  │₹42/kg  │ │₹28/kg  │ │₹35/kg  │ │₹48/kg  │ │₹32/kg  │  │
│  │+8.4%   │ │-3.1%   │ │+5.2%   │ │+12.5%  │ │-2.4%   │  │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Orders Component

```
┌─────────────────────────────────────────────────────────────┐
│  Order Management                    [Search] [Filter]      │
└─────────────────────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┐
│ Total    │ Pending  │In Transit│Delivered │
│ Orders   │          │          │          │
│   18     │    5     │    8     │    5     │
└──────────┴──────────┴──────────┴──────────┘

┌─────────────────────────────────────────────────────────────┐
│ [Package] Nashik Red Onion          [CONFIRMED]  ₹45,000   │
│           2500 Kg • Priya Sharma                 [v]        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Buyer Details  │ Tracking Status │ Payment Security    │ │
│ │ Priya Sharma   │ ✓ Confirmed     │ ₹45,000 in Escrow  │ │
│ │ +91 98765...   │ ○ Packaged      │ -₹2,250 Fee        │ │
│ │ Pune, MH       │ ○ Out for Pickup│ ₹42,750 Your Earn  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Crop Listing Component

```
┌─────────────────────────────────────────────────────────────┐
│  Live Crop Listing              [●] Live Marketplace        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────┐
│  [Package] New Crop Entry        │  Your Active Listings    │
│  Step 1 of 1                     │  [3]                     │
│                                  │                          │
│  Crop Name:    [____________]    │  ┌────────────────────┐ │
│  Category:     [Vegetables ▼]    │  │ LISTED             │ │
│                                  │  │ Tomatoes (Hybrid)  │ │
│  Variety:      [____________]    │  │ 2500 Kg @ ₹42/Kg   │ │
│  Quantity:     [____________]    │  └────────────────────┘ │
│  Price/Kg:     [____________]    │                          │
│                                  │  ┌────────────────────┐ │
│  [Upload Image Area]             │  │ LISTED             │ │
│  Click to upload high-res images │  │ Onions (Red)       │ │
│                                  │  │ 1500 Kg @ ₹38/Kg   │ │
│  [+ Publish to Live Marketplace] │  └────────────────────┘ │
└──────────────────────────────────┴──────────────────────────┘
```

### Market Prices Component

```
┌─────────────────────────────────────────────────────────────┐
│  Market Price Analytics    [District Filter] [Crop Filter]  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────┐
│  [TrendingUp] 7-Day Price Trend  │  AI Price Recommendation │
│  (Onion)                         │  Sell Now: Pune Mandi    │
│  [1W] 1M  1Y                     │  ₹2,350/quintal          │
│                                  │  Projected Gain: +12.5%  │
│  [Area Chart with gradient]      │                          │
│                                  │  Top Performing Mandis   │
│                                  │  • Pune      ₹2,350 ↑    │
│                                  │  • Nashik    ₹2,100 ↑    │
│                                  │  • Latur     ₹1,950 ↓    │
└──────────────────────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Live Price Feed                          [Download CSV]    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │Crop    │Variety│District│Min ₹│Max ₹│Modal ₹│Date     ││
│  │Tomatoes│Hybrid │Pune    │ 38  │ 46  │  42   │01 Apr   ││
│  │Onions  │Red    │Nashik  │ 30  │ 36  │  32   │01 Apr   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Earnings Component

```
┌─────────────────────────────────────────────────────────────┐
│  Earnings & Financials              [Withdraw Funds →]      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  [●] Total Net Wallet Balance                    [Wallet]   │
│  ₹ 1,45,000                                                 │
│  Available for withdrawal                                   │
│                                                             │
│  ┌──────────────────────┬──────────────────────┐          │
│  │ ↗ Total Revenue      │ ↙ Platform Fees      │          │
│  │   ₹1,52,250          │   ₹7,250             │          │
│  └──────────────────────┴──────────────────────┘          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────┐
│  [TrendingUp] Revenue Growth     │  Recent Payouts          │
│  [Bar Chart]                     │  ┌────────────────────┐ │
│  Jan  Feb  Mar  Apr              │  │ Payment PAID       │ │
│                                  │  │ ₹42,750  [View]    │ │
│                                  │  └────────────────────┘ │
│                                  │  ┌────────────────────┐ │
│                                  │  │ Payment PENDING    │ │
│                                  │  │ ₹38,500  [View]    │ │
│                                  │  └────────────────────┘ │
└──────────────────────────────────┴──────────────────────────┘
```

### FPO Linking Component

```
┌─────────────────────────────────────────────────────────────┐
│  FPO Network                        [Search FPOs...]        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────────────────────┐
│  [%] Aggregation     │  [Building] Maharashtra Farmers FPO  │
│  Benefit             │  ID: #abc123                         │
│  Beat Market Prices  │  Pune, Maharashtra • 5% Commission   │
│  15-20% more         │                [Request to Join →]   │
│  ✓ Quality Grading   ├──────────────────────────────────────┤
│  ✓ Lower Logistics   │  [Building] Nashik Agri Collective   │
│  ✓ Escrow Payouts    │  ID: #def456                         │
│                      │  Nashik, Maharashtra • 4% Commission │
│  Membership Guide    │                [Request to Join →]   │
│  1. Verify KYC       ├──────────────────────────────────────┤
│  2. FPO reviews you  │  [Building] Latur Farmers Union      │
│  3. Aggregate crops  │  ID: #ghi789                         │
│                      │  Latur, Maharashtra • 6% Commission  │
│                      │                [Request to Join →]   │
└──────────────────────┴──────────────────────────────────────┘
```

### Logistics Component

```
┌─────────────────────────────────────────────────────────────┐
│  Agri-Logistics Hub              [Open Fleet Manager ↗]    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────┐
│  [Package]           │  [Truck]             │
│  3                   │  Live                │
│  In-Transit Batches  │  Real-Time GPS Active│
│  [View Tracking →]   │  ●●●+12              │
└──────────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  [MapPin] Recent Movement                                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [Package] Nashik Red Onion    [IN_TRANSIT]            ││
│  │           Pune → Mumbai                                ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ [Package] Tomatoes Batch      [DELIVERED]             ││
│  │           Nashik → Pune                                ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  [CheckCircle] Safe Delivery, Guaranteed Payment            │
│  AgriTrust tracking ensures automatic payment trigger       │
│  • Photographic Evidence at Pickup                          │
│  • GPS Route Optimization                                   │
│  • Temperature Controlled (Optional)                        │
│  • Escrow Linked Release                                    │
│  [System Integration Progress: ███████░░ 75%]              │
└─────────────────────────────────────────────────────────────┘
```

## 🎭 Animation Behaviors

### Hover Effects
- **Cards**: Lift up 4px + shadow enhancement
- **Buttons**: Lift up 2px + shadow glow
- **Stats**: Scale 1.02 + border color change
- **Icons**: Rotate 5° + color shift

### Loading States
- **Spinner**: Rotating border animation
- **Skeleton**: Shimmer effect left to right
- **Progress**: Animated width expansion

### Transitions
- **Duration**: 0.3s for most interactions
- **Easing**: cubic-bezier(0.68, -0.55, 0.265, 1.55) for bouncy feel
- **Properties**: transform, opacity, box-shadow, border-color

### Entry Animations
- **Fade In**: Opacity 0 → 1 (0.8s)
- **Slide Up**: TranslateY(20px) → 0 (0.7s)
- **Scale Bounce**: Scale(0.8) → 1.05 → 1 (0.6s)
- **Stagger**: 0.05s delay per item

## 🎨 Visual Hierarchy

### Text Sizes
```
Hero Heading:     text-4xl (36px) font-black
Section Heading:  text-3xl (30px) font-black
Card Heading:     text-xl (20px) font-bold
Body Text:        text-sm (14px) font-medium
Caption:          text-xs (12px) font-medium
Badge:            text-[10px] font-black uppercase
```

### Shadows
```
Small:   shadow-sm   (0 1px 2px rgba(0,0,0,0.05))
Medium:  shadow-md   (0 4px 6px rgba(0,0,0,0.1))
Large:   shadow-lg   (0 10px 15px rgba(0,0,0,0.1))
XLarge:  shadow-xl   (0 20px 25px rgba(0,0,0,0.1))
2XLarge: shadow-2xl  (0 25px 50px rgba(0,0,0,0.25))
```

### Z-Index Layers
```
Background:  z-0
Content:     z-10
Overlay:     z-20
Modal:       z-30
Tooltip:     z-40
Notification: z-50
```

## 📐 Responsive Breakpoints

```
Mobile:   < 640px   (sm)
Tablet:   640-768px (md)
Laptop:   768-1024px (lg)
Desktop:  1024-1280px (xl)
Wide:     > 1280px (2xl)
```

### Layout Adjustments
- **Mobile**: Single column, stacked cards
- **Tablet**: 2-column grid, reduced padding
- **Desktop**: 12-column grid, full features

## 🎯 Interactive States

### Button States
```
Default:  bg-green-600 shadow-lg
Hover:    bg-green-700 shadow-xl translateY(-2px)
Active:   bg-green-800 shadow-md translateY(0)
Disabled: bg-gray-300 opacity-50 cursor-not-allowed
Loading:  bg-green-600 [spinner] pointer-events-none
```

### Input States
```
Default:  border-slate-200 bg-white
Focus:    border-green-500 ring-2 ring-green-500
Error:    border-red-500 ring-2 ring-red-500
Disabled: bg-slate-50 text-slate-400 cursor-not-allowed
```

### Card States
```
Default:  border-slate-200 shadow-md
Hover:    border-green-200 shadow-xl translateY(-4px)
Active:   border-green-500 shadow-2xl
Selected: border-green-500 bg-green-50
```

## 🌈 Gradient Combinations

### Primary Gradients
```
Green:    from-green-600 via-emerald-600 to-green-700
Success:  from-green-500 to-emerald-600
Warning:  from-amber-500 to-orange-600
Info:     from-blue-500 to-cyan-600
Dark:     from-slate-900 to-slate-800
```

### Background Gradients
```
Hero:     from-green-50 to-emerald-50
Card:     from-slate-50 to-white
Overlay:  from-slate-900/90 to-slate-800/90
```

## 🎪 Special Effects

### Glass Morphism
```css
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.3);
```

### Glow Effect
```css
box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
animation: pulse-glow 2s infinite;
```

### Shimmer Effect
```css
background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
animation: shimmer 2s infinite;
```

This visual reference should help you understand exactly what the UI should look like! 🎨✨
