# Authentication Testing Guide

## Quick Start

### Option 1: Use Test HTML Page (Easiest)
1. Open `apps/web/test-auth.html` in your browser
2. Click the test buttons to verify authentication
3. Check browser console for detailed logs

### Option 2: Manual Testing

#### Step 1: Start Servers

**Terminal 1 - API Server:**
```bash
cd apps/api
npm run dev
```
API runs on http://localhost:3001

**Terminal 2 - Web App:**
```bash
cd apps/web
npm run dev
```
Web app runs on http://localhost:3000

## Test Credentials (Works with Mock & Real API)

### Farmer Account
- **Email**: `farmer@test.com`
- **Password**: `Test@123`
- **Expected Dashboard**: http://localhost:3000/farmer/dashboard

### Buyer Account
- **Email**: `buyer@test.com`
- **Password**: `Test@123`
- **Expected Dashboard**: http://localhost:3000/buyer/dashboard

### FPO Account
- **Email**: `fpo@test.com`
- **Password**: `Test@123`
- **Expected Dashboard**: http://localhost:3000/fpo/dashboard

## Testing Steps

### 1. Test Registration
1. Go to http://localhost:3000/register
2. Fill in the form:
   - Name: Test Farmer
   - Email: testfarmer@example.com
   - Password: Test@1234
   - Phone: +919876543210
   - Role: Select FARMER
3. Click "Create Account"
4. Should redirect to /farmer/dashboard
5. Check browser console for logs
6. Check localStorage for token and user data

### 2. Test Login
1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: testfarmer@example.com
   - Password: Test@1234
3. Click "Sign In"
4. Should redirect to /farmer/dashboard
5. Verify user name appears in sidebar

### 3. Test Protected Routes
1. Open browser in incognito mode
2. Try to access http://localhost:3000/farmer/dashboard
3. Should redirect to /login
4. Login and verify redirect back to dashboard

### 4. Test Role-Based Access
1. Login as FARMER
2. Try to access http://localhost:3000/buyer/dashboard
3. Should redirect to /farmer/dashboard (correct role dashboard)

### 5. Test Logout
1. Login to any dashboard
2. Click logout button in sidebar
3. Should redirect to /login
4. Verify localStorage is cleared
5. Try accessing dashboard again - should redirect to login

## Expected Console Logs

### Successful Login:
```
🔵 Login function called
🚀 Attempting login to: http://localhost:3001/api/auth/login
📡 Response status: 200
✅ Login successful (backend): { user: {...}, role: 'FARMER' }
🔀 Routing user with role: FARMER
```

### Successful Registration:
```
✅ Registration successful: { user: {...}, role: 'FARMER' }
✅ Stored in localStorage: { token: '...', user: '...' }
🔀 Routing user with role: FARMER
```

### Auth Guard Check:
```
🔐 AuthGuard check: { hasToken: true, user: {...}, allowedRoles: ['FARMER'] }
✅ User authorized
```

## Troubleshooting

### If API is not running:
- The app will fallback to mock authentication
- You'll see: "🔄 Backend unavailable, falling back to mock authentication"
- Mock users work with any password

### If redirects don't work:
- Check browser console for errors
- Verify localStorage has 'token' and 'user' keys
- Clear localStorage and try again

### If role mismatch:
- User will be redirected to their correct dashboard
- Check console for: "❌ User role not allowed"

## Database Check (if using real API)

Check if users exist in database:
```bash
cd apps/api
npx prisma studio
```

Look in the User table for test accounts.
