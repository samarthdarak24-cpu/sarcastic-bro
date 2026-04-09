# 🎯 How to See Live Mandi Ticker - Step by Step

## 🚀 Quick Start (3 Steps)

### Step 1: Start the Application
Double-click this file:
```
start-with-mandi.bat
```

OR run in terminal:
```bash
npm run dev
```

### Step 2: Open Your Browser
Go to the test page:
```
http://localhost:3000/test-mandi
```

### Step 3: Look at the Top!
You should see a **green bar** with "LIVE MANDI" and scrolling prices!

---

## 📍 Where to Find the Ticker

The Live Mandi Ticker appears at the **TOP** of these pages:

### ✅ Test Page (Easiest to See)
```
http://localhost:3000/test-mandi
```
**Why use this?** No login required, ticker is clearly visible

### ✅ Farmer Dashboard
```
http://localhost:3000/farmer/dashboard
```
**Login required** - Use farmer credentials

### ✅ Buyer Dashboard
```
http://localhost:3000/buyer/dashboard
```
**Login required** - Use buyer credentials

### ✅ Any Dashboard Page
The ticker appears on ALL pages that use `DashboardLayout`:
- `/farmer/quality`
- `/farmer/live`
- `/buyer/suppliers`
- `/buyer/search`
- And many more!

---

## 🎨 What It Looks Like

```
┌──────────────────────────────────────────────────────────────────┐
│ 🟢 LIVE MANDI ● │ Tomato ₹28.0 ↑2.1% │ Wheat ₹42.0 ↓1.5% │ ... │
└──────────────────────────────────────────────────────────────────┘
```

**Key Features:**
1. **Green Background** - "LIVE MANDI" label on the left
2. **Pulsing Dot** - Shows connection status (green = connected)
3. **Scrolling Prices** - Moves from right to left continuously
4. **Price Changes** - Updates every 8 seconds with flash effect
5. **Indicators** - ↑ (up), ↓ (down), — (stable)

---

## 🔍 Troubleshooting "I Don't See It"

### Issue 1: Services Not Running

**Check if running:**
```bash
node check-services.js
```

**Expected output:**
```
✅ API Server         RUNNING
✅ Web App           RUNNING
```

**If not running:**
```bash
npm run dev
```

### Issue 2: Wrong Page

The ticker only shows on:
- ✅ Dashboard pages (after login)
- ✅ Test page (no login needed)

It does NOT show on:
- ❌ Login page
- ❌ Landing page
- ❌ Public pages

**Solution:** Go to `http://localhost:3000/test-mandi`

### Issue 3: Browser Cache

**Clear cache:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page with `Ctrl + F5`

### Issue 4: Zoom Level

**Reset zoom:**
- Press `Ctrl + 0` (Windows) or `Cmd + 0` (Mac)
- This resets zoom to 100%

### Issue 5: Hidden Behind Elements

**Check z-index:**
1. Press `F12` to open DevTools
2. Click "Elements" tab
3. Find the ticker element
4. Check if `z-index: 100` is applied

**If still hidden:**
- Scroll to the very top of the page
- The ticker is "sticky" and stays at the top

---

## 🎬 Visual Guide

### What You Should See:

**1. At the Very Top of Page:**
```
┌─────────────────────────────────────────┐
│ 🟢 LIVE MANDI ● │ Scrolling prices... │
├─────────────────────────────────────────┤
│         Dashboard Header                │
├─────────────────────────────────────────┤
│         Page Content                    │
```

**2. The Ticker Bar:**
- Height: ~42px
- Background: White
- Border: Gray bottom border
- Position: Sticky at top

**3. The Label:**
- Background: Emerald green (#059669)
- Text: "LIVE MANDI" in white
- Icon: Pulsing activity icon
- Dot: Green pulsing (connected) or red (disconnected)

**4. The Prices:**
- Format: `Crop ₹Price ↑X.X%`
- Colors: Green (up), Red (down), Gray (stable)
- Animation: Scrolls continuously
- Updates: Every 8 seconds with flash

---

## 📱 Device Compatibility

### Desktop (Recommended)
- ✅ Chrome, Firefox, Edge, Safari
- ✅ Full width display
- ✅ All features visible

### Tablet
- ✅ Responsive layout
- ✅ Horizontal scroll
- ✅ Touch-friendly

### Mobile
- ✅ Optimized for small screens
- ✅ Swipe to see more prices
- ✅ Compact display

---

## 🧪 Quick Tests

### Test 1: Is the ticker visible?
```
1. Go to: http://localhost:3000/test-mandi
2. Look at the very top
3. See green "LIVE MANDI" bar? ✅ Working!
```

### Test 2: Is it scrolling?
```
1. Watch the prices
2. They should move from right to left
3. Continuous loop (30 seconds per cycle)
4. Scrolling? ✅ Working!
```

### Test 3: Are prices updating?
```
1. Watch a specific price (e.g., Tomato)
2. Wait 8 seconds
3. Price should flash and change
4. Updating? ✅ Working!
```

### Test 4: Is connection active?
```
1. Look at the dot next to "LIVE MANDI"
2. Green and pulsing? ✅ Connected!
3. Red? ❌ Check backend is running
```

---

## 🎯 Success Checklist

Mark each item as you verify:

- [ ] Services are running (`npm run dev`)
- [ ] Browser is open to test page
- [ ] Green "LIVE MANDI" bar is visible at top
- [ ] Prices are scrolling from right to left
- [ ] Connection dot is green and pulsing
- [ ] Prices update every 8 seconds
- [ ] Flash animation appears on update
- [ ] No errors in browser console (F12)

**All checked?** 🎉 Your Live Mandi Ticker is working perfectly!

---

## 📊 Current Crops Displayed

The ticker shows these 8 crops:

1. 🍅 **Tomato** - Starting price: ₹28/kg
2. 🌾 **Wheat** - Starting price: ₹42/kg
3. 🍚 **Rice** - Starting price: ₹88/kg
4. 🧅 **Onion** - Starting price: ₹35/kg
5. 🥔 **Potato** - Starting price: ₹22/kg
6. 🌶️ **Chilli** - Starting price: ₹140/kg
7. 🟡 **Turmeric** - Starting price: ₹120/kg
8. 🫚 **Ginger** - Starting price: ₹95/kg

Prices fluctuate ±3% every 8 seconds to simulate real market conditions.

---

## 🔧 Advanced Configuration

### Change Update Speed
Edit: `apps/web/src/providers/RealtimeProvider.tsx`
```typescript
setInterval(() => {
  // Update logic
}, 8000); // ← Change to 5000 for 5 seconds
```

### Change Scroll Speed
Edit: `apps/web/src/app/globals.css`
```css
.animate-ticker {
  animation: ticker 30s linear infinite; /* ← Change 30s */
}
```

### Add More Crops
Edit: `apps/web/src/components/ui/LivePriceTicker.tsx`
```typescript
const INITIAL_CROPS = [
  // ... existing crops
  { id: "mango", name: "Mango", price: 150 }, // ← Add here
];
```

---

## 📞 Need Help?

### Quick Fixes

**Problem:** Can't see ticker
**Solution:** Go to `http://localhost:3000/test-mandi`

**Problem:** Not scrolling
**Solution:** Hard refresh with `Ctrl + Shift + R`

**Problem:** Prices not updating
**Solution:** Check console for errors (F12)

**Problem:** Red connection dot
**Solution:** Restart backend: `npm run dev:api`

### Get More Help

1. Check: `VERIFY_MANDI_TICKER.md` - Detailed troubleshooting
2. Check: `MANDI_TICKER_FIX.md` - Technical details
3. Run: `node check-services.js` - Service status
4. Check browser console (F12) for errors

---

## ✨ Summary

**To see the Live Mandi Ticker:**

1. Run: `npm run dev` or `start-with-mandi.bat`
2. Open: `http://localhost:3000/test-mandi`
3. Look at the top of the page
4. See the green "LIVE MANDI" bar with scrolling prices!

**That's it!** 🎉

The ticker is now visible and working on all dashboard pages.

---

**Last Updated:** 2024
**Status:** ✅ Fully Implemented and Working
