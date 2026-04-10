# Login Debug Guide

## 🔍 Step-by-Step Troubleshooting

### Step 1: Clear Everything
Open browser console (F12) and run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Step 2: Check Current State
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
```

### Step 3: Manual Login Test
After logging in, immediately run in console:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('Current user role:', user?.role);
console.log('Expected dashboard:', 
  user?.role === 'FARMER' ? '/farmer/dashboard' :
  user?.role === 'BUYER' ? '/buyer/dashboard' :
  user?.role === 'FPO' ? '/fpo/dashboard' : 'UNKNOWN'
);
```

### Step 4: Force Correct Dashboard
If you're on the wrong dashboard, run:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
if (user?.role === 'FARMER') {
  window.location.href = '/farmer/dashboard';
} else if (user?.role === 'BUYER') {
  window.location.href = '/buyer/dashboard';
} else if (user?.role === 'FPO') {
  window.location.href = '/fpo/dashboard';
}
```

## 🚨 Common Issues & Solutions

### Issue 1: Redirects to Wrong Dashboard
**Cause:** Stale localStorage data
**Solution:**
1. Open DevTools (F12)
2. Go to Application tab → Storage → Clear site data
3. Close ALL tabs for localhost:3000
4. Open fresh tab and login again

### Issue 2: Stuck on Login Page
**Cause:** API server not running or network error
**Solution:**
1. Check API server is running: http://localhost:3001
2. Check browser console for errors
3. Verify credentials are correct (password is case-sensitive)

### Issue 3: Blank Page After Login
**Cause:** JavaScript error or missing component
**Solution:**
1. Check browser console for red errors
2. Hard refresh: Ctrl + Shift + R
3. Clear cache and try again

## 📋 Test Credentials

| Role   | Email            | Password  | Expected Dashboard                    |
|--------|------------------|-----------|---------------------------------------|
| Farmer | farmer@test.com  | Farmer123 | http://localhost:3000/farmer/dashboard |
| Buyer  | buyer@test.com   | Farmer123 | http://localhost:3000/buyer/dashboard  |
| FPO    | fpo@test.com     | Farmer123 | http://localhost:3000/fpo/dashboard    |

**IMPORTANT:** Password is `Farmer123` with capital F!

## 🔧 Advanced Debugging

### Check API Response
Open Network tab in DevTools, then login. Look for the `/api/auth/login` request:
1. Click on the request
2. Go to Response tab
3. Verify the response contains:
   ```json
   {
     "user": {
       "role": "FARMER" // or BUYER or FPO
     },
     "token": "..."
   }
   ```

### Monitor localStorage Changes
Run this before logging in:
```javascript
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  console.log('📝 localStorage.setItem:', key, value);
  originalSetItem.apply(this, arguments);
};
```

### Check AuthGuard Behavior
After reaching dashboard, run:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User role:', user?.role);
console.log('Current path:', window.location.pathname);
console.log('Match:', 
  (window.location.pathname.includes('farmer') && user?.role === 'FARMER') ||
  (window.location.pathname.includes('buyer') && user?.role === 'BUYER') ||
  (window.location.pathname.includes('fpo') && user?.role === 'FPO')
);
```

## 🎯 Quick Fix Script

Copy and paste this entire script in console to force correct dashboard:

```javascript
(function() {
  console.log('🔧 Running login fix script...');
  
  // Get current user
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.error('❌ No user found in localStorage');
    console.log('➡️ Redirecting to login...');
    window.location.href = '/login';
    return;
  }
  
  const user = JSON.parse(userStr);
  console.log('✅ Found user:', user.name, '- Role:', user.role);
  
  // Determine correct dashboard
  let correctDashboard;
  if (user.role === 'FARMER') {
    correctDashboard = '/farmer/dashboard';
  } else if (user.role === 'BUYER') {
    correctDashboard = '/buyer/dashboard';
  } else if (user.role === 'FPO') {
    correctDashboard = '/fpo/dashboard';
  } else {
    console.error('❌ Unknown role:', user.role);
    return;
  }
  
  console.log('🎯 Correct dashboard:', correctDashboard);
  console.log('📍 Current path:', window.location.pathname);
  
  // Check if we're on the wrong dashboard
  if (!window.location.pathname.startsWith(correctDashboard)) {
    console.log('⚠️ Wrong dashboard! Redirecting...');
    window.location.href = correctDashboard;
  } else {
    console.log('✅ Already on correct dashboard!');
  }
})();
```

## 📞 Still Not Working?

1. **Close ALL browser tabs** for localhost:3000
2. **Restart the web server:**
   ```bash
   cd apps/web
   npm run dev
   ```
3. **Clear browser cache completely:**
   - Chrome: Settings → Privacy → Clear browsing data → All time
   - Firefox: Settings → Privacy → Clear Data
4. **Try incognito/private window**
5. **Check console logs** - share any red errors

## ✅ Success Indicators

After successful login, you should see in console:
```
🧹 Clearing old localStorage data before login
🔵 Starting login with email: [your-email]
✅ Login successful - Full response: {...}
✅ User role: [FARMER/BUYER/FPO]
💾 Stored user in localStorage: {...}
🔀 Routing user with role: [FARMER/BUYER/FPO]
➡️ Redirecting to /[role]/dashboard
🔐 AuthGuard check: { userRole: '[ROLE]', allowedRoles: ['[ROLE]'] }
✅ User authorized for this page
```

If you see different logs, share them for further debugging!
