# 🎯 Complete Navigation Guide - Landing → Login → Dashboards

## 📍 Step-by-Step Navigation Flow

### Step 1: Landing Page
**URL:** http://localhost:3000

**What you should see:**
- Hero section with "ODOP Connect" branding
- Features showcase
- How it works section
- Testimonials
- Call-to-action buttons

**Actions:**
- Click "Get Started" button → Goes to `/login`
- Click "Login" in navbar → Goes to `/login`
- Click "Sign Up" → Goes to `/register`

---

### Step 2: Login Page
**URL:** http://localhost:3000/login

**What you should see:**
- Split screen design (50/50)
- Left side: Project info with features
- Right side: Login form with glass effect
- Demo credentials displayed at bottom

**Login Credentials:**

| Role   | Email            | Password  | Dashboard Redirect                    |
|--------|------------------|-----------|---------------------------------------|
| Farmer | farmer@test.com  | Farmer123 | http://localhost:3000/farmer/dashboard |
| Buyer  | buyer@test.com   | Farmer123 | http://localhost:3000/buyer/dashboard  |
| FPO    | fpo@test.com     | Farmer123 | http://localhost:3000/fpo/dashboard    |

**Actions:**
1. Enter email and password
2. Click "Sign In" button
3. Wait for redirect (should happen automatically)

---

### Step 3: Dashboards

#### 🌾 Farmer Dashboard
**URL:** http://localhost:3000/farmer/dashboard

**Theme:** Green

**Sections:**
- Overview (default)
- Marketplace
- My Orders
- Logistics
- KYC Verification (NEW PREMIUM DESIGN)
- FPO Linking
- Quality Certificates
- Language Settings

**What you should see:**
- Green gradient sidebar
- "Farmer Dashboard" title
- Navigation menu on left
- Main content area on right

---

#### 🛒 Buyer Dashboard
**URL:** http://localhost:3000/buyer/dashboard

**Theme:** Blue

**Sections:**
- Overview (default)
- Marketplace
- My Orders
- Analytics
- Payments
- Logistics
- Settings

**What you should see:**
- Blue gradient sidebar
- "Buyer Hub" title
- Navigation menu on left
- Main content area on right

---

#### 🚜 FPO Dashboard
**URL:** http://localhost:3000/fpo/dashboard

**Theme:** Purple

**Sections:**
- Overview (default)
- Farmer Onboarding
- Farmer Management
- Incoming Crops
- Bulk Aggregation
- Market Listings
- Manage Orders
- Logistics Hub
- Financial Hub
- Quality Certs
- Farmer KYC

**What you should see:**
- Purple gradient sidebar
- "FPO Hub" title
- Navigation menu on left
- Main content area on right

---

## 🚀 Quick Access Methods

### Method 1: Normal Flow (Recommended for Testing)
```
1. Go to: http://localhost:3000
2. Click "Get Started" or "Login"
3. Enter credentials
4. Click "Sign In"
5. Automatically redirected to dashboard
```

### Method 2: Direct Login
```
1. Go to: http://localhost:3000/login
2. Enter credentials
3. Click "Sign In"
4. Automatically redirected to dashboard
```

### Method 3: Test Page (Bypass Login)
```
1. Go to: http://localhost:3000/test-dashboards
2. Click any dashboard button
3. Instantly access dashboard
```

### Method 4: Direct Dashboard Access
```
1. Open browser console (F12)
2. Run this code:

// For Farmer
localStorage.setItem('token', 'test-token');
localStorage.setItem('user', JSON.stringify({id:'1',email:'farmer@test.com',name:'Test Farmer',role:'FARMER'}));
window.location.href = '/farmer/dashboard';

// For Buyer
localStorage.setItem('token', 'test-token');
localStorage.setItem('user', JSON.stringify({id:'2',email:'buyer@test.com',name:'Test Buyer',role:'BUYER'}));
window.location.href = '/buyer/dashboard';

// For FPO
localStorage.setItem('token', 'test-token');
localStorage.setItem('user', JSON.stringify({id:'3',email:'fpo@test.com',name:'Test FPO',role:'FPO'}));
window.location.href = '/fpo/dashboard';
```

---

## 🔧 Troubleshooting

### Issue: Landing Page Not Loading
**Symptoms:** Blank page or error at http://localhost:3000

**Solutions:**
1. Check if web server is running:
   ```bash
   # In apps/web directory
   npm run dev
   ```
2. Check console for errors (F12)
3. Try hard refresh: `Ctrl + Shift + R`
4. Clear browser cache

---

### Issue: Login Page Not Loading
**Symptoms:** Can't access http://localhost:3000/login

**Solutions:**
1. Try direct URL: http://localhost:3000/login
2. Clear localStorage:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
3. Check browser console for errors

---

### Issue: Login Not Working
**Symptoms:** Click "Sign In" but nothing happens

**Solutions:**
1. **Check API server is running:**
   ```bash
   # In apps/api directory
   npm run dev
   ```
   Should see: "Server running on port 3001"

2. **Verify credentials:**
   - Email: `farmer@test.com` (or buyer/fpo)
   - Password: `Farmer123` (capital F!)

3. **Check browser console:**
   - Press F12
   - Look for error messages
   - Should see: "✅ Login successful"

4. **Clear localStorage and try again:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

---

### Issue: Wrong Dashboard After Login
**Symptoms:** Login as Farmer but see Buyer dashboard

**Solutions:**
1. **Clear localStorage completely:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Close ALL browser tabs** for localhost:3000

3. **Open fresh tab** and login again

4. **Use test page instead:**
   http://localhost:3000/test-dashboards

---

### Issue: Dashboard Not Loading
**Symptoms:** Blank page or infinite loading

**Solutions:**
1. **Check console for errors** (F12)
2. **Verify localStorage has user data:**
   ```javascript
   console.log(localStorage.getItem('user'));
   console.log(localStorage.getItem('token'));
   ```
3. **Try direct access with console:**
   ```javascript
   localStorage.setItem('token', 'test-token');
   localStorage.setItem('user', JSON.stringify({
     id: '1',
     email: 'farmer@test.com',
     name: 'Test Farmer',
     role: 'FARMER'
   }));
   window.location.href = '/farmer/dashboard';
   ```

---

## ✅ Verification Checklist

### Landing Page ✓
- [ ] Page loads at http://localhost:3000
- [ ] Hero section visible
- [ ] "Get Started" button works
- [ ] "Login" button in navbar works
- [ ] No console errors

### Login Page ✓
- [ ] Page loads at http://localhost:3000/login
- [ ] Login form visible
- [ ] Demo credentials shown
- [ ] Can enter email/password
- [ ] "Sign In" button clickable
- [ ] No console errors

### Farmer Dashboard ✓
- [ ] Loads at http://localhost:3000/farmer/dashboard
- [ ] Green theme visible
- [ ] Sidebar shows "Farmer Dashboard"
- [ ] Can navigate between sections
- [ ] KYC section has premium design
- [ ] No console errors

### Buyer Dashboard ✓
- [ ] Loads at http://localhost:3000/buyer/dashboard
- [ ] Blue theme visible
- [ ] Sidebar shows "Buyer Hub"
- [ ] Can navigate between sections
- [ ] No console errors

### FPO Dashboard ✓
- [ ] Loads at http://localhost:3000/fpo/dashboard
- [ ] Purple theme visible
- [ ] Sidebar shows "FPO Hub"
- [ ] Can navigate between sections
- [ ] All components load without errors
- [ ] No console errors

---

## 🎯 Complete URL Map

```
Landing Page:        http://localhost:3000
Login Page:          http://localhost:3000/login
Register Page:       http://localhost:3000/register
Test Page:           http://localhost:3000/test-dashboards

Farmer Dashboard:    http://localhost:3000/farmer/dashboard
Buyer Dashboard:     http://localhost:3000/buyer/dashboard
FPO Dashboard:       http://localhost:3000/fpo/dashboard
```

---

## 🔍 Debug Commands

### Check if servers are running:
```bash
# Check web server (should show port 3000)
netstat -ano | findstr :3000

# Check API server (should show port 3001)
netstat -ano | findstr :3001
```

### Check localStorage in browser:
```javascript
// See all stored data
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));

// Parse user data
const user = JSON.parse(localStorage.getItem('user'));
console.log('User Role:', user?.role);
console.log('User Email:', user?.email);
```

### Force redirect to correct dashboard:
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

---

## 📞 Still Having Issues?

1. **Restart both servers:**
   ```bash
   # Terminal 1 - API Server
   cd apps/api
   npm run dev

   # Terminal 2 - Web Server
   cd apps/web
   npm run dev
   ```

2. **Clear everything:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

3. **Close all browser tabs** for localhost:3000

4. **Open fresh incognito window**

5. **Use the test page:** http://localhost:3000/test-dashboards

---

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. **Landing page loads** with animations
2. **Login page** shows split-screen design
3. **After login**, console shows:
   ```
   ✅ Login successful
   ✅ User role: FARMER (or BUYER/FPO)
   ➡️ Redirecting to /farmer/dashboard
   ```
4. **Dashboard loads** with correct theme color
5. **No red errors** in console
6. **Can navigate** between sections smoothly

---

**🚀 EASIEST METHOD: Use the test page at http://localhost:3000/test-dashboards**

This bypasses all authentication and gives you instant access to all 3 dashboards!
