# FPO Linking - Quick Start Guide

## 🚀 Getting Started

### For Farmers

1. **Navigate to FPO Linking**
   - Go to Farmer Dashboard → FPO Linking
   - URL: `/farmer/fpo`

2. **Search for FPOs**
   - Enter district name (e.g., "Nanded", "Pune", "Nashik")
   - View FPO details: name, location, commission rate, farmer count

3. **Send Join Request**
   - Click "Send Join Request" button
   - Optional: Add a message
   - Status changes to "Pending"

4. **Wait for Approval**
   - FPO admin reviews your request
   - You'll see status update to "Linked" when approved
   - Or "Rejected" with reason if declined

5. **Manage Your FPO Link**
   - View current FPO details
   - Click "Unlink from FPO" to disconnect
   - Confirm in modal

---

### For FPO Admins

1. **Review Link Requests**
   - Go to FPO Dashboard → Link Requests
   - URL: `/fpo/link-requests`
   - Filter by status: Pending, Approved, Rejected, All

2. **Approve Farmers**
   - Click "Approve" button
   - Farmer is immediately linked
   - FPOFarmer record created automatically

3. **Reject Farmers**
   - Click "Reject" button
   - Enter optional rejection reason
   - Farmer receives rejection notification

4. **Manage Linked Farmers**
   - Go to FPO Dashboard → Linked Farmers
   - URL: `/fpo/linked-farmers`
   - View statistics: Total, Active, Inactive

5. **Search & Filter Farmers**
   - Search by name or phone number
   - Filter by status: Active, Inactive, All
   - View crops count for each farmer

6. **Activate/Deactivate Farmers**
   - Click "Activate" or "Deactivate" button
   - Farmer status toggles immediately
   - Inactive farmers' crops won't be aggregated

---

## 📊 Data Flow

```
Farmer                          FPO
  │                              │
  ├─ Search FPOs ────────────────┤
  │                              │
  ├─ Send Link Request ──────────┤
  │                              │
  │                    ┌─ Review Request
  │                    │
  │                    ├─ Approve/Reject
  │                    │
  ├─ Receive Status ◄──┤
  │                    │
  ├─ View FPO Details  │
  │                    │
  ├─ Unlink (optional) │
  │                    │
  └────────────────────┘
```

---

## 🔑 Key Features

### Farmer Features
- ✅ Search FPOs by district
- ✅ View FPO details (commission, farmer count)
- ✅ Send join requests with optional message
- ✅ Track request status (Pending/Linked/Rejected)
- ✅ View linked FPO details
- ✅ Unlink from FPO anytime
- ✅ Multi-language support (EN, HI, MR)

### FPO Features
- ✅ View all farmer link requests
- ✅ Filter requests by status
- ✅ Approve/reject with reasons
- ✅ View linked farmers list
- ✅ Search farmers by name/phone
- ✅ Filter farmers by status
- ✅ Activate/deactivate farmers
- ✅ View farmer statistics
- ✅ Multi-language support (EN, HI, MR)

---

## 🌐 Multi-Language Support

All pages support 3 languages:

| Language | Code | Status |
|----------|------|--------|
| English  | en   | ✅ Complete |
| Hindi    | hi   | ✅ Complete |
| Marathi  | mr   | ✅ Complete |

Switch languages in the app settings - all FPO Linking pages will update automatically.

---

## 📱 Mobile Responsive

All pages are fully responsive:
- **Mobile** (375px): Optimized for small screens
- **Tablet** (768px): 2-column layout
- **Desktop** (1024px+): Full layout

---

## 🔐 Security

- ✅ JWT token required for all API calls
- ✅ Role-based access control (FARMER, FPO)
- ✅ User ownership verification
- ✅ FPO admin verification
- ✅ Proper error handling

---

## 🎯 Common Tasks

### Task: Approve a Farmer Request
1. Go to `/fpo/link-requests`
2. Find the farmer in "Pending" tab
3. Click "Approve" button
4. Done! Farmer is now linked

### Task: Reject a Farmer Request
1. Go to `/fpo/link-requests`
2. Find the farmer in "Pending" tab
3. Click "Reject" button
4. Enter reason (optional)
5. Click "Confirm Reject"

### Task: Deactivate a Farmer
1. Go to `/fpo/linked-farmers`
2. Find the farmer in the table
3. Click "Deactivate" button
4. Farmer status changes to "Inactive"

### Task: Search for a Farmer
1. Go to `/fpo/linked-farmers`
2. Enter name or phone in search box
3. Results filter in real-time

### Task: Unlink from FPO (Farmer)
1. Go to `/farmer/fpo`
2. Click "Unlink from FPO" button
3. Confirm in modal
4. Status resets to "Not Linked"

---

## 🐛 Troubleshooting

### Issue: "Failed to search FPOs"
- Check internet connection
- Verify API is running on port 3001
- Check browser console for errors

### Issue: "Request already exists"
- You already have a pending request to this FPO
- Wait for approval or rejection
- Or unlink and try again

### Issue: "You are already linked to an FPO"
- You can only be linked to one FPO at a time
- Unlink first, then link to a different FPO

### Issue: Translations not showing
- Clear browser cache
- Refresh the page
- Check language setting in app

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Contact the development team

---

## 📚 Related Features

- **Aggregation**: Linked farmers' crops feed into FPO aggregation
- **Escrow**: Commission deducted from escrow on order completion
- **Notifications**: Real-time updates on approval/rejection
- **Chat**: FPO can message linked farmers
- **Payouts**: FPOPayoutSplit handles commission distribution

---

## ✅ Checklist for First Use

- [ ] Farmer: Search for FPOs in your district
- [ ] Farmer: Send join request to an FPO
- [ ] FPO: Review pending requests
- [ ] FPO: Approve a farmer request
- [ ] Farmer: Verify linked status
- [ ] FPO: View linked farmers list
- [ ] FPO: Deactivate a farmer
- [ ] Farmer: Unlink from FPO
- [ ] Test multi-language switching
- [ ] Test on mobile device

---

**Feature Status**: ✅ Production Ready
