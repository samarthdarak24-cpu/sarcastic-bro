# 🔍 Quick Setup Check

## Run These Commands to Verify Everything

### 1. Check if servers are running:

```bash
# Check web server (port 3000)
netstat -ano | findstr :3000

# Check API server (port 3001)  
netstat -ano | findstr :3001
```

**Expected output:**
```
TCP    0.0.0.0:3000    ...    LISTENING
TCP    0.0.0.0:3001    ...    LISTENING
```

---

### 2. Test URLs in Browser:

Open these URLs one by one:

1. **Landing Page:** http://localhost:3000
   - Should show: ODOP Connect homepage

2. **Login Page:** http://localhost:3000/login
   - Should show: Login form with demo credentials

3. **Test Page:** http://localhost:3000/test-dashboards
   - Should show: 3 colored buttons (Green/Blue/Purple)

4. **Farmer Dashboard:** http://localhost:3000/farmer/dashboard
   - Will redirect to login if not authenticated

5. **Buyer Dashboard:** http://localhost:3000/buyer/dashboard
   - Will redirect to login if not authenticated

6. **FPO Dashboard:** http://localhost:3000/fpo/dashboard
   - Will redirect to login if not authenticated

---

### 3. Quick Test (Copy-Paste in Browser Console):

Open browser console (F12) and run:

```javascript
// Test 1: Clear everything
localStorage.clear();
console.log('✅ Cleared localStorage');

// Test 2: Set farmer credentials
localStorage.setItem('token', 'test-token-' + Date.now());
localStorage.setItem('user', JSON.stringify({
  id: 'farmer-1',
  email: 'farmer@test.com',
  name: 'Test Farmer',
  role: 'FARMER'
}));
console.log('✅ Set farmer credentials');

// Test 3: Check what was stored
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Test 4: Go to farmer dashboard
console.log('➡️ Redirecting to farmer dashboard...');
window.location.href = '/farmer/dashboard';
```

---

## 🎯 FASTEST WAY TO TEST ALL 3 DASHBOARDS

### Option 1: Use Test Page
1. Go to: **http://localhost:3000/test-dashboards**
2. Click green button → Farmer Dashboard
3. Go back, click blue button → Buyer Dashboard
4. Go back, click purple button → FPO Dashboard

### Option 2: Use Console Commands
Open console (F12) and run each command:

**Farmer Dashboard:**
```javascript
localStorage.clear();
localStorage.setItem('token','t1');
localStorage.setItem('user',JSON.stringify({id:'1',role:'FARMER',email:'farmer@test.com',name:'Farmer'}));
location.href='/farmer/dashboard';
```

**Buyer Dashboard:**
```javascript
localStorage.clear();
localStorage.setItem('token','t2');
localStorage.setItem('user',JSON.stringify({id:'2',role:'BUYER',email:'buyer@test.com',name:'Buyer'}));
location.href='/buyer/dashboard';
```

**FPO Dashboard:**
```javascript
localStorage.clear();
localStorage.setItem('token','t3');
localStorage.setItem('user',JSON.stringify({id:'3',role:'FPO',email:'fpo@test.com',name:'FPO'}));
location.href='/fpo/dashboard';
```

---

## ✅ What Should Work:

1. ✅ Landing page loads
2. ✅ Login page loads
3. ✅ Test page loads with 3 buttons
4. ✅ Clicking test page buttons takes you to dashboards
5. ✅ Console commands take you to dashboards
6. ✅ Login with credentials redirects to correct dashboard

---

## ❌ If Something Doesn't Work:

### Landing Page Not Loading?
```bash
cd apps/web
npm run dev
```
Then go to: http://localhost:3000

### Login Not Working?
```bash
cd apps/api
npm run dev
```
Then try login again

### Dashboard Not Loading?
Use test page: http://localhost:3000/test-dashboards

---

## 🎉 Success Checklist:

- [ ] Web server running on port 3000
- [ ] API server running on port 3001
- [ ] Landing page loads
- [ ] Login page loads
- [ ] Test page loads
- [ ] Can access farmer dashboard
- [ ] Can access buyer dashboard
- [ ] Can access FPO dashboard
- [ ] No console errors

---

**🚀 RECOMMENDED: Just use http://localhost:3000/test-dashboards**

It's the fastest and most reliable way to access all dashboards!
