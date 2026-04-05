# How to Login - Quick Guide

## The Issue
You're seeing "A user with this email already exists" because you're trying to REGISTER instead of LOGIN.

## Solution: Use the Login Page

### Step 1: Navigate to Login
Go to: **http://localhost:3000/login**

OR click "Sign In" button on the homepage (not "Get Started")

### Step 2: Use These Credentials

**For Farmer Account:**
- Email: `farmer@test.com`
- Password: `password123`

**For Buyer Account:**
- Email: `buyer@test.com`  
- Password: `password123`

### Step 3: Click "Login" Button
NOT "Register" or "Sign Up"

## Common Mistakes

❌ **WRONG:** Going to `/register` or clicking "Get Started"
✅ **CORRECT:** Going to `/login` or clicking "Sign In"

❌ **WRONG:** Trying to create a new account with existing email
✅ **CORRECT:** Using the login form with existing credentials

## If You Want to Create a NEW Account

1. Go to `/register`
2. Use a DIFFERENT email (not farmer@test.com or buyer@test.com)
3. Choose your role (Farmer or Buyer)
4. Fill in all required fields
5. Click "Register"

## Quick Access URLs

- **Login Page:** http://localhost:3000/login
- **Register Page:** http://localhost:3000/register
- **Farmer Dashboard:** http://localhost:3000/farmer/dashboard (after login)
- **Buyer Dashboard:** http://localhost:3000/buyer/dashboard (after login)

## What Happens After Login

### Farmer Dashboard Features:
- Product Management
- AI Price Advisor
- Quality Detection
- Order Control Center
- Tender Participation
- Farm Insights
- Logistics Manager

### Buyer Dashboard Features:
- Sourcing Space (Browse Products)
- Order Tracker
- Negotiation Hub
- Supplier Insights
- Payment Center
- Analytics

## Still Having Issues?

1. **Clear browser cache** (Ctrl + Shift + Delete)
2. **Try incognito/private mode**
3. **Check console for errors** (F12 → Console tab)
4. **Verify all servers are running:**
   - Web: http://localhost:3000 ✅
   - API: http://localhost:3001 ✅
   - AI Service: http://localhost:8000 ✅

## Test the Platform

1. Login as Farmer
2. Add a product
3. Open another browser/incognito
4. Login as Buyer
5. Browse and order the product
6. See real-time updates in both dashboards!
