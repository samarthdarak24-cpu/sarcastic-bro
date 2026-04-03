# FarmGuard Professional UI Design Guide

## 🎨 Design System Overview

This guide documents the professional UI design patterns used throughout FarmGuard.

---

## Color Palette

### Primary Colors
- **Emerald** (For Buyers): `#059669` → `#047857`
- **Blue** (For Farmers): `#2563eb` → `#1d4ed8`

### Gradients
- Emerald Gradient: `from-emerald-600 to-emerald-700`
- Blue Gradient: `from-blue-600 to-blue-700`

### Neutral Colors
- Text: `#111827` (gray-900)
- Secondary Text: `#4b5563` (gray-600)
- Borders: `#e5e7eb` (gray-200)
- Background: `#ffffff` (white)

### Status Colors
- Success: `#10b981` (emerald-600)
- Error: `#ef4444` (red-600)
- Warning: `#f59e0b` (amber-600)
- Info: `#3b82f6` (blue-600)

---

## Typography

### Font Family
- Primary: Inter (system-ui, -apple-system, sans-serif)

### Font Weights & Sizes

#### Headings
- **H1**: 32-48px, font-black (900)
- **H2**: 28-36px, font-black (900)
- **H3**: 20-24px, font-bold (700)
- **H4**: 16-18px, font-bold (700)

#### Body
- **Large**: 16px, font-medium (500)
- **Regular**: 14px, font-medium (500)
- **Small**: 12px, font-semibold (600)
- **Tiny**: 11px, font-bold (700)

---

## Components

### 1. Buttons

#### Primary Button (CTA)
```jsx
<button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-600/30 transition-all">
  Primary Action →
</button>
```

**Features:**
- Gradient background
- 4px padding (py), 8px sides (px)
- Rounded corners (rounded-lg)
- Box shadow with brand color
- Hover scale effect

#### Secondary Button
```jsx
<button className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all">
  Secondary Action
</button>
```

#### Ghost Button
```jsx
<button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
  Link Action →
</button>
```

---

### 2. Form Inputs

#### Text Input with Icon
```jsx
<div className="relative group">
  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
  <input
    type="email"
    placeholder="you@example.com"
    className="w-full pl-12 pr-4 py-4 rounded-lg border-2 text-base font-medium text-gray-900 outline-none transition-all border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
  />
</div>
```

**Features:**
- Left padding (pl-12) for icon
- Border: 2px, gray-200 by default
- Focus state: emerald-500 border + emerald-100 ring
- Icon changes color on focus
- Rounded-lg corners

#### Error State
```jsx
<input className="border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" />
```

#### Error Message
```jsx
<p className="text-red-600 text-sm mt-2 flex items-center gap-1">
  <AlertCircle size={14} /> Error message
</p>
```

---

### 3. Cards

#### Feature Card
```jsx
<div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-emerald-400 hover:shadow-lg transition-all group">
  <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
    <Icon size={26} className="text-emerald-700" />
  </div>
  <h3 className="font-bold text-lg text-gray-900 mb-2">Title</h3>
  <p className="text-gray-600 text-sm leading-relaxed">Description</p>
</div>
```

**Features:**
- Padding: p-8
- Border: 1px, gray-100
- Border radius: rounded-2xl
- Hover: border-emerald-400 + shadow-lg
- Icon container: gradient background with transform on hover

#### Dashboard/Stat Card
```jsx
<div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
  <div className="flex items-center justify-between mb-4">
    <div>
      <p className="text-xs font-semibold text-gray-600 uppercase">Label</p>
      <p className="text-3xl font-black text-emerald-600 mt-1">₹2,40,000</p>
    </div>
    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
      <TrendingUp size={24} className="text-emerald-600" />
    </div>
  </div>
  <div className="flex items-center gap-2 text-sm">
    <span className="text-emerald-600 font-bold">↑ 18%</span>
    <span className="text-gray-600">from yesterday</span>
  </div>
</div>
```

---

### 4. Animations

#### Motion Variants (Framer Motion)
```jsx
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};
```

#### Hover Effects
- **Scale**: `whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}`
- **Lift**: `-translate-y-1` on hover
- **Slide**: `slide-in` animations for modals

#### Loading State
```jsx
<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
</svg>
```

---

### 5. Layout Patterns

#### Hero Section
- Padding: `py-24 px-6`
- Max-width: `max-w-7xl mx-auto`
- Grid: 2-column on desktop, 1-column on mobile
- Gap: `gap-12`

#### Section Container
```jsx
<section className="py-24 px-6 bg-white">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</section>
```

#### Feature Grid
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

---

### 6. Navigation

#### Header
- Fixed positioning: `fixed top-0 left-0 right-0 z-50`
- Background: `bg-white/80 backdrop-blur-md border-b border-gray-100`
- Padding: `py-4 px-6`

#### Mobile Navigation
```jsx
<motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: "auto" }}
  exit={{ opacity: 0, height: 0 }}
  className="md:hidden border-t border-gray-100 bg-white p-4 space-y-3"
>
  {/* Menu items */}
</motion.div>
```

---

### 7. Form Layouts

#### Multi-step Form Progress
```jsx
<div className="flex gap-2 mb-8">
  {steps.map((_, i) => (
    <motion.div
      key={i}
      className={`flex-1 h-1 rounded-full transition-colors ${
        i <= currentStep ? "bg-emerald-600" : "bg-gray-200"
      }`}
    />
  ))}
</div>
```

#### Role Toggle/Selector
```jsx
<div className="grid grid-cols-2 gap-3 mb-8 p-1 bg-gray-100 rounded-xl">
  {options.map((option) => (
    <button
      key={option.id}
      onClick={() => setSelected(option.id)}
      className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
        selected === option.id
          ? "bg-white text-emerald-600 shadow-md"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <option.icon size={18} />
      {option.label}
    </button>
  ))}
</div>
```

---

## Responsive Design

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px` (md)
- **Desktop**: `> 1024px` (lg)
- **Large**: `> 1280px` (xl)

### Common Patterns
- Hide on mobile: `hidden md:block`
- Stack on mobile: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Padding scale: `px-6 md:px-8 lg:px-12`

---

## Best Practices

### 1. Spacing
- Use multiples of 4: 4, 8, 12, 16, 24, 32, 48...
- Consistent padding: `p-6`, `p-8`
- Consistent gaps: `gap-4`, `gap-6`, `gap-8`

### 2. Colors
- Use Tailwind color scale (50-950)
- Always pair with hover states
- Maintain sufficient contrast (WCAG AA minimum)

### 3. Typography
- Hierarchy is crucial: H1 > H2 > H3 > Body
- Keep line-height: 1.5-1.6 for readability
- Max line length: 65-75 characters for body text

### 4. Interactions
- Always include hover states
- Use smooth transitions: `transition-all`, `transition-colors`
- Provide feedback: loading states, success/error messages

### 5. Accessibility
- Include alt text for images
- Use semantic HTML (`<button>`, `<input>`, etc.)
- Ensure focus states are visible
- Use ARIA labels where needed

---

## Recent Updates (March 2024)

✅ **Landing Page** - Completely redesigned with modern hero, features, testimonials sections
✅ **Login Form** - Professional multi-step design with role selection
✅ **Register Form** - Professional 3-step registration flow with location selection
✅ **Buttons & Cards** - Consistent gradient styling and hover effects
✅ **Forms** - Icon-integrated inputs with clear error states
✅ **Animations** - Smooth Framer Motion transitions throughout

---

## Usage Example

```jsx
import { motion } from "framer-motion";

export function Example() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-emerald-400 shadow-lg hover:shadow-xl transition-all"
    >
      <h2 className="text-3xl font-black text-gray-900 mb-4">
        Professional Design
      </h2>
      <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all">
        Get Started →
      </button>
    </motion.div>
  );
}
```

---

**Last Updated**: March 31, 2024
**Version**: 2.0 (Professional Design System)
