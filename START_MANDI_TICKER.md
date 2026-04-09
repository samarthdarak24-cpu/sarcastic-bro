# Quick Start: Live Mandi Price Ticker

## ✅ Fixed Issues
Your trending live mandi ticker is now working! Here's what was fixed:

1. **Visibility**: Changed from fixed to sticky positioning
2. **Overlap**: Adjusted header position to prevent hiding the ticker
3. **Live Updates**: Connected to real-time price store

## 🚀 How to See It

### Option 1: Start the Full App
```bash
# Start all services (API + Web + AI)
npm run dev
```

Then open: http://localhost:3000

### Option 2: Start Just the Web App
```bash
# Start only the frontend
npm run dev:web
```

Then open: http://localhost:3000

### Option 3: Test the Ticker Standalone
```bash
# Open the test file in your browser
start test-mandi-prices.html
```

## 📍 Where to Find It

The live mandi ticker appears at the **top of every dashboard page**:

1. Login to your account
2. Go to any dashboard:
   - Farmer Dashboard: `/farmer/dashboard`
   - Buyer Dashboard: `/buyer/dashboard`
3. Look at the very top - you'll see a green bar with "LIVE MANDI"
4. Watch the prices scroll automatically!

## 🎯 What You'll See

```
┌─────────────────────────────────────────────────────────┐
│ 🟢 LIVE MANDI ● │ Tomato ₹28.0 ↑ 2.1% │ Wheat ₹42.0... │
└─────────────────────────────────────────────────────────┘
```

### Features:
- ✅ **Scrolling Animation**: Prices scroll continuously
- ✅ **Live Updates**: Prices change every 8 seconds
- ✅ **Color Indicators**: 
  - 🟢 Green = Price going up
  - 🔴 Red = Price going down
  - ⚪ Gray = Stable
- ✅ **Flash Effect**: Prices flash when they update
- ✅ **Connection Status**: Pulsing dot shows live connection

## 🔧 Troubleshooting

### "I don't see the ticker"

**Check 1**: Are you logged in?
- The ticker only shows on dashboard pages
- Login at: http://localhost:3000/login

**Check 2**: Is the web app running?
```bash
npm run dev:web
```

**Check 3**: Check browser console (F12)
- Look for "[Socket] ✅ Connected" message
- If you see errors, the backend might not be running

### "Prices aren't updating"

**Check 1**: Is the backend running?
```bash
npm run dev:api
```

**Check 2**: Check the connection indicator
- Look for the pulsing green dot next to "LIVE MANDI"
- 🟢 Green = Connected
- 🔴 Red = Disconnected

**Check 3**: Open browser console (F12)
- You should see price updates logged
- Look for "RealtimeProvider" messages

### "Animation is not smooth"

**Check 1**: Clear browser cache
```
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)
```

**Check 2**: Try a different browser
- Chrome, Firefox, or Edge recommended

## 📊 Current Crops Displayed

The ticker shows live prices for 8 crops:
1. 🍅 Tomato
2. 🌾 Wheat
3. 🍚 Rice
4. 🧅 Onion
5. 🥔 Potato
6. 🌶️ Chilli
7. 🟡 Turmeric
8. 🫚 Ginger

## 🎨 Customization

### Change Update Speed
Edit `apps/web/src/providers/RealtimeProvider.tsx`:
```typescript
// Change from 8000 (8 seconds) to your preferred interval
setInterval(() => {
  // Price update logic
}, 8000); // ← Change this number
```

### Change Animation Speed
Edit `apps/web/src/app/globals.css`:
```css
.animate-ticker {
  animation: ticker 30s linear infinite; /* ← Change 30s */
}
```

### Add More Crops
Edit `apps/web/src/components/ui/LivePriceTicker.tsx`:
```typescript
const INITIAL_CROPS = [
  { id: "tomato", name: "Tomato", price: 28 },
  // Add your crop here:
  { id: "mango", name: "Mango", price: 150 },
];
```

## 📱 Mobile View

The ticker is fully responsive:
- On mobile: Scrolls horizontally
- On tablet: Shows more items
- On desktop: Full width display

## ✨ What's Next?

### Connect to Real Market Data
Currently using simulated prices. To connect real data:

1. Update backend API to fetch real mandi prices
2. Emit real-time updates via Socket.IO
3. Remove simulation in `RealtimeProvider.tsx`

### Add More Features
- Historical price charts
- Price alerts
- Favorite crops
- Regional price comparison

## 🆘 Still Having Issues?

1. **Check all services are running**:
   ```bash
   node check-services.js
   ```

2. **Restart everything**:
   ```bash
   # Stop all services (Ctrl+C)
   # Then restart
   npm run dev
   ```

3. **Check the logs**:
   - Backend logs: Terminal running `npm run dev:api`
   - Frontend logs: Browser console (F12)

## ✅ Success Checklist

- [ ] Web app is running on http://localhost:3000
- [ ] I can see the login page
- [ ] I'm logged into a dashboard
- [ ] I see the green "LIVE MANDI" bar at the top
- [ ] Prices are scrolling across the screen
- [ ] The green dot is pulsing (connected)
- [ ] Prices update every few seconds

---

**Need Help?** Check `MANDI_TICKER_FIX.md` for technical details.
