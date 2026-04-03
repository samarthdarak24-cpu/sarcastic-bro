# 🎨 FarmGuard Professional UI - Quick Start Guide

## Overview
All UI components and design patterns have been professionally redesigned. This guide helps you use the new system.

---

## 🚀 What's New

### ✅ Landing Page (`/`)
- Modern hero section with animations
- Feature showcase with icons
- Testimonials section
- Success metrics display
- Professional footer

### ✅ Login Page (`/auth/login`)
- Clean, professional layout
- Role selector (Farmer/Buyer)
- Smooth animations
- Google Sign-In
- Beautiful error handling

### ✅ Register Page (`/auth/register`)
- 3-step registration flow
- Progress indicator
- Smooth transitions
- Location selection
- Form validation

### ✅ New Components
- `FormField` - Professional form inputs
- `PrimaryButton` - Gradient buttons

---

## 🎯 How to Use the New Components

### FormField Component

#### Basic Usage
```jsx
import { FormField } from "@/components/ui";
import { Mail } from "lucide-react";

export function MyForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <FormField
      id="email"
      label="Email Address"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="you@example.com"
      icon={<Mail size={18} />}
      error={error}
    />
  );
}
```

#### With Helper Text
```jsx
<FormField
  id="phone"
  label="Phone Number"
  type="phone"
  placeholder="9876543210"
  helperText="Optional - Used for order updates"
  icon={<Phone size={18} />}
/>
```

#### As Textarea
```jsx
<FormField
  id="message"
  label="Message"
  variant="textarea"
  placeholder="Enter your message..."
  helperText="Max 500 characters"
/>
```

#### As Select Dropdown
```jsx
<FormField
  id="state"
  label="Select State"
  variant="select"
  options={[
    { value: "maharashtra", label: "Maharashtra" },
    { value: "karnataka", label: "Karnataka" },
  ]}
  placeholder="Choose a state..."
  icon={<MapPin size={18} />}
/>
```

#### With Right Icon (Password Toggle)
```jsx
<FormField
  id="password"
  label="Password"
  type={showPassword ? "text" : "password"}
  rightIcon={
    <button onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  }
/>
```

---

### PrimaryButton Component

#### Basic Usage
```jsx
import { PrimaryButton } from "@/components/ui";

<PrimaryButton onClick={handleSubmit}>
  Submit Form
</PrimaryButton>
```

#### With Icon
```jsx
import { PrimaryButton } from "@/components/ui";
import { ArrowRight } from "lucide-react";

<PrimaryButton icon={<ArrowRight size={18} />}>
  Continue
</PrimaryButton>
```

#### Different Variants
```jsx
{/* Emerald (default) */}
<PrimaryButton variant="emerald">Primary Action</PrimaryButton>

{/* Blue */}
<PrimaryButton variant="blue">Farmer Action</PrimaryButton>

{/* Secondary */}
<PrimaryButton variant="secondary">Cancel</PrimaryButton>

{/* Ghost */}
<PrimaryButton variant="ghost">Skip</PrimaryButton>
```

#### Different Sizes
```jsx
<PrimaryButton size="sm">Small</PrimaryButton>
<PrimaryButton size="md">Medium</PrimaryButton>
<PrimaryButton size="lg">Large</PrimaryButton>
```

#### Loading State
```jsx
<PrimaryButton loading={isLoading} disabled={isLoading}>
  Submit
</PrimaryButton>
```

#### Full Width
```jsx
<PrimaryButton fullWidth>
  Full Width Button
</PrimaryButton>
```

#### Complete Example
```jsx
<PrimaryButton
  variant="emerald"
  size="lg"
  loading={isSubmitting}
  icon={<ArrowRight size={18} />}
  iconPosition="right"
  fullWidth
  onClick={handleFormSubmit}
>
  Create Account
</PrimaryButton>
```

---

## 🎨 Design Tokens

### Colors

#### Primary
- **Emerald**: `#059669` (use with `from-emerald-600 to-emerald-700`)
- **Blue**: `#2563eb` (use with `from-blue-600 to-blue-700`)

#### Usage in Tailwind
```jsx
// Backgrounds
className="bg-emerald-600 hover:bg-emerald-700"

// Text
className="text-emerald-600"

// Borders
className="border-emerald-200"

// Gradients
className="bg-gradient-to-r from-emerald-600 to-emerald-700"

// Hover gradients
className="hover:from-emerald-700 hover:to-emerald-800"

// Shadows
className="shadow-lg shadow-emerald-600/30"

// Rings
className="ring-emerald-100"
```

### Spacing

```jsx
// Padding
className="p-6"  // All sides
className="px-8 py-4"  // Horizontal + Vertical

// Gaps
className="gap-4"  // Between flex/grid items

// Margins
className="mb-4 mt-2"
```

### Typography

```jsx
// Headings
className="text-4xl font-black"  // H1
className="text-2xl font-bold"   // H2
className="text-lg font-bold"    // H3

// Body
className="text-base font-medium"
className="text-sm font-semibold"

// Small
className="text-xs font-bold"
```

### Border Radius

```jsx
className="rounded-lg"  // 8px - buttons, inputs
className="rounded-xl"  // 12px - cards
className="rounded-2xl" // 16px - large cards
```

---

## 🎭 Common Patterns

### Success Card
```jsx
<div className="bg-white p-6 rounded-2xl border border-emerald-100">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
      <CheckCircle2 size={24} className="text-emerald-600" />
    </div>
    <div>
      <p className="font-bold text-gray-900">Success!</p>
      <p className="text-sm text-gray-600">Your action was completed</p>
    </div>
  </div>
</div>
```

### Error Alert
```jsx
<div className="p-4 rounded-lg bg-red-50 border border-red-200">
  <div className="flex items-start gap-3">
    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-semibold text-red-900">Error</p>
      <p className="text-red-700 text-sm">Something went wrong</p>
    </div>
  </div>
</div>
```

### Feature Card
```jsx
<div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-emerald-400 hover:shadow-lg transition-all group">
  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
    <TrendingUp size={26} className="text-emerald-700" />
  </div>
  <h3 className="font-bold text-lg text-gray-900 mb-2">Feature Title</h3>
  <p className="text-gray-600 text-sm">Feature description goes here</p>
</div>
```

### Stat Card
```jsx
<div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
  <div className="flex items-center justify-between mb-4">
    <div>
      <p className="text-xs font-semibold text-gray-600 uppercase">Revenue</p>
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

## 📱 Responsive Patterns

### Mobile-First Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Auto stacks on mobile, 2 cols on tablet, 4 cols on desktop */}
</div>
```

### Responsive Padding
```jsx
<div className="px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-24">
  {/* Padding scales with screen size */}
</div>
```

### Hide/Show Elements
```jsx
<div className="hidden md:block">
  {/* Only visible on medium screens and up */}
</div>

<button className="md:hidden">
  {/* Only visible on mobile */}
</button>
```

---

## 🎬 Animations with Framer Motion

### Basic Fade-in
```jsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Fade-in with Bottom Slide
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Hover Scale
```jsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Hover me
</motion.button>
```

### List Item Animation
```jsx
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.1 }}
>
  Item
</motion.div>
```

---

## ✅ Best Practices

### Do's ✅
- Use FormField for all text inputs
- Use PrimaryButton for CTAs
- Keep color consistent (emerald for main, blue for alt)
- Use proper spacing (multiples of 4)
- Add hover states to interactive elements
- Test on mobile before desktop

### Don'ts ❌
- Don't mix styling patterns
- Don't skip error states
- Don't use undefined icons
- Don't forget loading states
- Don't mix color variants unnecessarily
- Don't ignore accessibility

---

## 📚 Resources

- **Design Guide**: See `UI_DESIGN_GUIDE.md`
- **Component Docs**: Check component files for JSDoc comments
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **Lucide Icons**: https://lucide.dev

---

## 🆘 Troubleshooting

### Button not styling correctly?
- Check variant prop (emerald, blue, secondary, ghost)
- Ensure you're using PrimaryButton, not regular button
- Check disabled prop isn't set

### Form field not showing icon?
- Pass icon prop with JSX element
- Make sure icon size is 18
- Check if icon is imported correctly

### Colors not matching?
- Use exact color names (emerald-600, blue-600)
- Check for typos in Tailwind classes
- Verify gradient syntax: `from-emerald-600 to-emerald-700`

### Animations not working?
- Import motion from framer-motion
- Use initial, animate, transition props
- Check for layout shifts

---

## 🎓 Learning Resources

### Getting Started with New Components
1. Look at `src/components/auth/LoginForm.tsx` for FormField usage
2. Check `src/app/page.tsx` for button patterns
3. Review `UI_DESIGN_GUIDE.md` for design tokens

### Implementing in Your Pages
1. Import from `@/components/ui`
2. Use FormField for inputs
3. Use PrimaryButton for CTAs
4. Follow spacing guidelines
5. Add animations with Framer Motion

---

## 🚀 Next: Deploy and Monitor

After implementing:
1. Test on mobile devices
2. Check accessibility with screen readers
3. Monitor user engagement
4. Gather feedback
5. Iterate based on metrics

---

**Happy Building! 🎨**

Last Updated: March 31, 2024
