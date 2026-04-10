# FPO Login Redirect Issue - Fixed

## Problem
When logging in as FPO user (fpo@test.com), the user was being redirected to the farmer dashboard instead of the FPO dashboard.

## Root Cause
The issue was caused by **stale localStorage data** from previous logins. When switching between different user roles (Farmer → FPO), the old user data remained in localStorage, causing the AuthGuard to read incorrect role information.

## Solution Applied

### 1. Clear localStorage Before Login
Updated `apps/web/src/app/login/page.tsx` to clear all authentication data BEFORE attempting login:

```typescript
// Clear any existing auth data BEFORE login to prevent stale data issues
if (typeof window !== 'undefined') {
  console.log('🧹 Clearing old localStorage data before login');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
}
```

### 2. Enhanced Logging
Added comprehensive console logging to track the authentication flow:
- Login page: Logs user role, redirect decision, and localStorage operations
- AuthGuard: Logs role verification and redirect decisions

### 3. Fixed Demo Credentials Display
Corrected the password shown on login page from "Fpo123" to "Farmer123" (all test accounts use the same password).

## How to Test

### Step 1: Clear Browser Cache
1. Open browser DevTools (F12)
2. Go to Application tab → Storage → Clear site data
3. Or use hard refresh: `Ctrl + Shift + R`

### Step 2: Login as FPO
1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: `fpo@test.com`
   - Password: `Farmer123` (capital F)
3. Click "Sign In"

### Step 3: Verify Redirect
- Should redirect to: `http://localhost:3000/fpo/dashboard`
- Should see FPO dashboard with purple theme
- Should see "FPO Hub" in sidebar

### Step 4: Check Console Logs
Open browser console (F12) and look for:
```
🧹 Clearing old localStorage data before login
🔵 Starting login with email: fpo@test.com
✅ Login successful - Full response: {...}
✅ User role: FPO
🔀 Routing user with role: FPO
➡️ Redirecting to /fpo/dashboard
🔐 AuthGuard check: { userRole: 'FPO', allowedRoles: ['FPO'] }
✅ User authorized for this page
```

## Test Credentials (All Passwords: Farmer123)

| Role   | Email            | Password  | Dashboard URL                    |
|--------|------------------|-----------|----------------------------------|
| Farmer | farmer@test.com  | Farmer123 | http://localhost:3000/farmer/dashboard |
| Buyer  | buyer@test.com   | Farmer123 | http://localhost:3000/buyer/dashboard  |
| FPO    | fpo@test.com     | Farmer123 | http://localhost:3000/fpo/dashboard    |

## Architecture Overview

### Authentication Flow
```
1. User enters credentials
2. Login page CLEARS localStorage
3. authService.login() calls API
4. API returns user object with role
5. Login page stores token + user in localStorage
6. Login page redirects based on role
7. Dashboard layout's AuthGuard verifies role
8. If role matches, show dashboard
9. If role doesn't match, redirect to correct dashboard
```

### Key Files Modified
1. `apps/web/src/app/login/page.tsx` - Added localStorage clearing + enhanced logging
2. `apps/web/src/components/auth/AuthGuard.tsx` - Enhanced logging for debugging
3. Demo credentials display - Fixed password from "Fpo123" to "Farmer123"

## Troubleshooting

### Issue: Still redirecting to wrong dashboard
**Solution:** 
1. Manually clear localStorage in DevTools:
   ```javascript
   localStorage.clear();
   ```
2. Close all browser tabs for localhost:3000
3. Open fresh tab and try again

### Issue: "Invalid credentials" error
**Solution:**
- Verify password is `Farmer123` (capital F, not lowercase)
- Check API server is running on port 3001
- Check database has seed data

### Issue: Blank page after login
**Solution:**
1. Check browser console for errors
2. Verify both servers are running:
   - API: http://localhost:3001
   - Web: http://localhost:3000
3. Check network tab for failed API calls

## Prevention

To prevent this issue in the future:
1. Always use "Logout" button to clear localStorage properly
2. When testing multiple roles, clear browser cache between tests
3. Use incognito/private windows for testing different roles simultaneously

## Related Files
- `apps/web/src/app/login/page.tsx` - Login form and redirect logic
- `apps/web/src/services/auth.ts` - Authentication service
- `apps/web/src/components/auth/AuthGuard.tsx` - Role-based access control
- `apps/web/src/app/fpo/layout.tsx` - FPO dashboard layout with AuthGuard
- `apps/api/src/modules/auth/auth.service.ts` - Backend authentication
- `apps/api/prisma/seed.ts` - Test user data

## Success Indicators
✅ FPO login redirects to `/fpo/dashboard`
✅ Purple-themed FPO dashboard loads
✅ Sidebar shows "FPO Hub" title
✅ Console logs show correct role: "FPO"
✅ localStorage contains correct user object with role: "FPO"
