# 🔐 Authentication Setup & Testing

## Overview

The application has a complete authentication system with:
- ✅ Login & Registration pages
- ✅ Role-based access control (FARMER, BUYER, FPO)
- ✅ Protected dashboard routes
- ✅ Automatic redirects based on user role
- ✅ Real-time authentication with API
- ✅ Mock authentication fallback
- ✅ JWT token management
- ✅ Logout functionality

## Quick Start

### 1. Start Development Servers

**Windows:**
```bash
start-dev.bat
```

**Mac/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Manual:**
```bash
# Terminal 1 - API
cd apps/api
npm run dev

# Terminal 2 - Web
cd apps/web
npm run dev
```

### 2. Test Authentication

Open the test page: `apps/web/test-auth.html` in your browser

OR

Visit: http://localhost:3000/login

## Test Accounts

| Role   | Email              | Password  | Dashboard URL                          |
|--------|-------------------|-----------|----------------------------------------|
| Farmer | farmer@test.com   | Test@123  | http://localhost:3000/farmer/dashboard |
| Buyer  | buyer@test.com    | Test@123  | http://localhost:3000/buyer/dashboard  |
| FPO    | fpo@test.com      | Test@123  | http://localhost:3000/fpo/dashboard    |

## Testing Checklist

### ✅ Login Flow
1. Go to http://localhost:3000/login
2. Enter: `farmer@test.com` / `Test@123`
3. Click "Sign In"
4. Should redirect to `/farmer/dashboard`
5. Verify user name "Rajesh Kumar" appears in sidebar
6. Check browser console for success logs

### ✅ Registration Flow
1. Go to http://localhost:3000/register
2. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Password: Test@1234
   - Phone: +919876543210
   - Role: FARMER
3. Click "Create Account"
4. Should redirect to `/farmer/dashboard`
5. Verify new user data in sidebar

### ✅ Protected Routes
1. Open incognito/private window
2. Try: http://localhost:3000/farmer/dashboard
3. Should redirect to `/login`
4. Login and verify redirect back

### ✅ Role-Based Access
1. Login as FARMER
2. Try: http://localhost:3000/buyer/dashboard
3. Should redirect to `/farmer/dashboard`
4. Verify console shows role mismatch message

### ✅ Logout
1. Login to any dashboard
2. Click logout button (in sidebar footer)
3. Should redirect to `/login`
4. Verify localStorage cleared
5. Try accessing dashboard - should redirect to login

### ✅ Auto-Redirect (Already Logged In)
1. Login to any account
2. Go to http://localhost:3000 (home page)
3. Should auto-redirect to your dashboard
4. Go to `/login` - should redirect to dashboard

## Browser Console Logs

### Successful Login:
```
🔵 Login function called
🚀 Attempting login to: http://localhost:3001/api/auth/login
📡 Response status: 200
✅ Login successful (backend): { user: {...}, role: 'FARMER' }
🔀 Routing user with role: FARMER
```

### Auth Guard Check:
```
🔐 AuthGuard check: { hasToken: true, user: {...}, allowedRoles: ['FARMER'] }
✅ User authorized
```

### Mock Fallback (if API not running):
```
🔄 Backend unavailable, falling back to mock authentication
🔧 Mock Auth: Login attempt { email: 'farmer@test.com' }
✅ Mock Auth: Login successful { user: 'Rajesh Kumar', role: 'FARMER' }
```

## LocalStorage Data

After successful login, check browser DevTools > Application > LocalStorage:

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": "{\"id\":\"1\",\"name\":\"Rajesh Kumar\",\"email\":\"farmer@test.com\",\"role\":\"FARMER\"}",
  "refreshToken": "..." // optional
}
```

## API Endpoints

### Login
```
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "farmer@test.com",
  "password": "Test@123"
}
```

### Register
```
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test@1234",
  "role": "FARMER",
  "phone": "+919876543210"
}
```

## Troubleshooting

### Issue: "Backend unavailable" message
**Solution:** Start the API server
```bash
cd apps/api
npm run dev
```

### Issue: Redirects not working
**Solution:** 
1. Clear browser cache and localStorage
2. Check browser console for errors
3. Verify token exists in localStorage

### Issue: "Invalid credentials" error
**Solution:**
1. Verify you're using correct test credentials
2. Check API server is running
3. Try mock credentials if API is down

### Issue: Role mismatch redirect loop
**Solution:**
1. Clear localStorage
2. Logout and login again
3. Check user role in localStorage matches dashboard

### Issue: Page shows loading forever
**Solution:**
1. Check browser console for errors
2. Verify AuthGuard is working
3. Clear localStorage and try again

## File Structure

```
apps/web/src/
├── app/
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Registration page
│   ├── farmer/
│   │   ├── layout.tsx              # Farmer auth guard
│   │   └── dashboard/page.tsx      # Farmer dashboard
│   ├── buyer/
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Buyer auth guard
│   │   │   └── page.tsx            # Buyer dashboard
│   └── fpo/
│       ├── layout.tsx              # FPO auth guard
│       └── dashboard/page.tsx      # FPO dashboard
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx           # Auth protection component
│   └── dashboard/
│       └── DashboardLayout.tsx     # Unified dashboard layout
└── services/
    ├── auth.ts                     # Main auth service
    └── mockAuth.ts                 # Mock auth fallback
```

## Environment Variables

Create `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

Set `NEXT_PUBLIC_USE_MOCK_AUTH=true` to force mock authentication.

## Security Features

- ✅ JWT token authentication
- ✅ Password validation (min 8 chars, uppercase, lowercase, number)
- ✅ Protected routes with AuthGuard
- ✅ Role-based access control
- ✅ Automatic token refresh (if implemented)
- ✅ Secure logout (clears all tokens)
- ✅ XSS protection (no eval, sanitized inputs)

## Next Steps

1. ✅ Test all three roles (Farmer, Buyer, FPO)
2. ✅ Verify protected routes work
3. ✅ Test logout functionality
4. ✅ Check role-based redirects
5. ✅ Verify real-time user data display
6. ⏳ Add password reset functionality
7. ⏳ Add email verification
8. ⏳ Add 2FA (optional)

## Support

If you encounter issues:
1. Check browser console logs
2. Verify API server is running
3. Clear localStorage and try again
4. Check TEST_AUTH.md for detailed testing steps
5. Use test-auth.html for quick testing
