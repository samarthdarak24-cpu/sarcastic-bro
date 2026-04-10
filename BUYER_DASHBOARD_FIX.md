# Buyer Dashboard Login Fix Guide

## Problem
You're unable to see the buyer dashboard after logging in as a buyer.

## Root Causes
1. **Authentication flow issues** - Token/user data not being stored properly
2. **Routing issues** - Redirect not working correctly
3. **Backend API not responding** - API endpoints failing
4. **AuthGuard blocking access** - Role verification failing

## Solution Steps

### Step 1: Check if Backend is Running

Open a terminal and run:
```bash
cd apps/api
npm run dev
```

The backend should start on `http://localhost:3001`

### Step 2: Check if Frontend is Running

Open another terminal and run:
```bash
cd apps/web
npm run dev
```

The frontend should start on `http://localhost:3000`

### Step 3: Use the Debug Tool

1. Open your browser and go to: `http://localhost:3000/debug-buyer-login.html`
2. Click "Check Current State" to see your login status
3. Click "Clear & Login as Buyer" to perform a fresh login
4. Watch the console logs to see what's happening

### Step 4: Manual Login Test

1. Go to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `buyer@test.com`
   - Password: `Farmer123`
3. Click "Sign In"
4. Open browser DevTools (F12) and check the Console tab for any errors

### Step 5: Check Browser Console

Look for these log messages:
- ✅ `Login successful` - Good!
- ✅ `User role: BUYER` - Good!
- ✅ `Redirecting to /buyer/dashboard` - Good!
- ❌ Any red error messages - These indicate the problem

### Step 6: Verify localStorage

After login, open DevTools Console and run:
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

You should see:
- Token: A long string (JWT token)
- User: JSON object with role: "BUYER"

### Step 7: Manual Navigation

If login works but redirect fails, try manually navigating:
```javascript
window.location.href = '/buyer/dashboard';
```

## Common Issues & Fixes

### Issue 1: "Backend not running" error
**Fix:** Start the backend API server
```bash
cd apps/api
npm install
npm run dev
```

### Issue 2: "Invalid credentials" error
**Fix:** The test user might not exist. Create it:
```bash
cd apps/api
npx prisma db push
npx ts-node prisma/seed.ts
```

### Issue 3: Blank page after login
**Fix:** Check browser console for errors. Common causes:
- Missing dependencies
- API endpoint failures
- Component rendering errors

### Issue 4: Redirects to wrong dashboard
**Fix:** Clear localStorage and login again:
```javascript
localStorage.clear();
window.location.href = '/login';
```

### Issue 5: "AuthGuard" blocking access
**Fix:** The AuthGuard checks if you have the right role. Verify:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('My role:', user.role); // Should be "BUYER"
```

## Quick Test Credentials

### Buyer Account
- Email: `buyer@test.com`
- Password: `Farmer123`
- Expected Dashboard: `http://localhost:3000/buyer/dashboard`

### Other Test Accounts (for comparison)
- Farmer: `farmer@test.com` / `Farmer123`
- FPO: `fpo@test.com` / `Farmer123`

## Debugging Checklist

- [ ] Backend API is running on port 3001
- [ ] Frontend is running on port 3000
- [ ] Can access login page at `/login`
- [ ] Login form accepts credentials
- [ ] Console shows "Login successful"
- [ ] localStorage has token and user data
- [ ] User role is "BUYER"
- [ ] Browser redirects to `/buyer/dashboard`
- [ ] Dashboard page loads without errors
- [ ] Can see buyer dashboard content

## Still Not Working?

If you've tried all the above and it's still not working, check:

1. **Network tab** in DevTools - Look for failed API calls
2. **Console errors** - Look for JavaScript errors
3. **React DevTools** - Check if components are rendering
4. **Database** - Verify buyer user exists in the database

Run this to check the database:
```bash
cd apps/api
npx prisma studio
```

Then check the `User` table for a user with email `buyer@test.com` and role `BUYER`.

## Emergency Fix: Direct Access

If nothing else works, you can bypass the login temporarily:

1. Open browser console
2. Run:
```javascript
localStorage.setItem('token', 'test-token');
localStorage.setItem('user', JSON.stringify({
  id: '2',
  email: 'buyer@test.com',
  name: 'Test Buyer',
  role: 'BUYER'
}));
window.location.href = '/buyer/dashboard';
```

This will set fake credentials and navigate to the dashboard. This helps identify if the issue is with login or the dashboard itself.

## Next Steps

Once you can access the dashboard, you should see:
- Welcome message with your name
- Order statistics
- Wallet balance
- Market trends
- Navigation sidebar with buyer-specific options

If you see a blank page or errors, share the console error messages for further debugging.
