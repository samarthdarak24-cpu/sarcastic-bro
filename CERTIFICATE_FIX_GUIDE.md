# Quality Certificate "Failed to Fetch" Fix

## Problem
The "Failed to fetch certificates" error appears because the API endpoint requires authentication, but the user is not logged in or the authentication token is missing/invalid.

## Root Cause
The `/api/quality-certificate/my/certificates` endpoint uses the `authenticate` middleware which requires a valid JWT token in the Authorization header. When:
- User is not logged in
- Token is expired or invalid
- Token is missing from localStorage

The API returns a 401 error, which is displayed as "Failed to fetch certificates".

## What Was Fixed

### 1. Better Error Handling in API Controller
**File:** `apps/api/src/modules/quality-certificate/quality-certificate.controller.ts`

Added explicit authentication check with clear error message:
```typescript
const user = (req as any).user;

if (!user || !user.id) {
  return res.status(401).json({ error: 'Authentication required. Please log in.' });
}
```

### 2. Improved Error Messages in Hook
**File:** `apps/web/src/hooks/useQualityCertificate.ts`

Added specific error handling for different scenarios:
- Authentication errors → "Please log in to view your certificates"
- Network errors → "Unable to connect to server"
- Generic errors → Original error message
- Sets empty array on error to prevent UI crashes

### 3. User-Friendly UI for Auth Errors
**File:** `apps/web/src/components/dashboard/farmer/QualityCertificate.tsx`

Added a prominent warning banner when user needs to log in, with a button to redirect to login page.

## How to Test

1. **Without Login:**
   - Open the farmer dashboard
   - Navigate to Quality Certificate section
   - You should see: "Authentication Required" message with "Go to Login" button

2. **With Login:**
   - Log in as a farmer
   - Navigate to Quality Certificate section
   - Certificates should load successfully (or show empty state if none exist)

3. **Network Error:**
   - Stop the API server
   - Try to fetch certificates
   - You should see: "Unable to connect to server" message

## Solution for Users

The user needs to:
1. **Log in** to the application with valid credentials
2. Ensure the **API server is running** (default: http://localhost:3001)
3. Check that their **authentication token hasn't expired**

## API Endpoint Details

- **Endpoint:** `GET /api/quality-certificate/my/certificates`
- **Authentication:** Required (JWT Bearer token)
- **Authorization:** Any authenticated user (FARMER, FPO, BUYER)
- **Response:** Array of QualityCertificate objects

## Common Issues

1. **"Please log in to view your certificates"**
   - Solution: User needs to log in

2. **"Unable to connect to server"**
   - Solution: Start the API server with `cd apps/api && npm run dev`

3. **Certificates not showing after login**
   - Check browser console for errors
   - Verify token is stored in localStorage
   - Check API server logs for errors

## Technical Flow

```
User Opens Dashboard
    ↓
Component calls fetchMyCertificates()
    ↓
Hook calls API: GET /api/quality-certificate/my/certificates
    ↓
API checks authentication middleware
    ↓
If no token → 401 error → "Please log in"
If token valid → Query database → Return certificates
```
