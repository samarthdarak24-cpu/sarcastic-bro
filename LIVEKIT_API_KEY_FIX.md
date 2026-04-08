# 🔑 LiveKit API Key - Invalid Key Error Fix

## Problem
```
ConnectionError: could not establish signal connection: invalid API key
```

## Root Cause
The LiveKit API key in `.env` files is invalid, expired, or doesn't match the LiveKit URL.

---

## ✅ Solution: Get Valid LiveKit Credentials

### Step 1: Create LiveKit Account
1. Go to https://cloud.livekit.io/
2. Sign up for free account
3. Create a new project

### Step 2: Get API Credentials
1. Go to Settings → API Keys
2. Copy your API Key
3. Copy your API Secret
4. Copy your LiveKit URL (e.g., `wss://your-project.livekit.cloud`)

### Step 3: Update Environment Files

**File 1: `apps/voice-assistant/.env`**
```env
LIVEKIT_API_KEY=your_api_key_here
LIVEKIT_API_SECRET=your_api_secret_here
LIVEKIT_URL=wss://your-project.livekit.cloud

OPENAI_API_KEY=sk-proj-...
```

**File 2: `apps/voice-assistant/agent-starter-react/.env.local`**
```env
LIVEKIT_API_KEY=your_api_key_here
LIVEKIT_API_SECRET=your_api_secret_here
LIVEKIT_URL=wss://your-project.livekit.cloud
```

### Step 4: Restart Services
```bash
# Kill existing processes
taskkill /F /IM node.exe
taskkill /F /IM python.exe

# Restart voice assistant frontend
cd apps/voice-assistant/agent-starter-react
npm run dev

# Restart voice assistant backend
cd apps/voice-assistant
python app.py
```

### Step 5: Test
1. Go to http://localhost:3000/farmer/dashboard
2. Click green microphone button
3. Click "Open Voice Assistant"
4. Click "Start call"
5. Should connect without error

---

## 🔍 Verify Credentials

### Check if Credentials are Valid
```bash
# Test LiveKit connection
curl -X POST https://your-project.livekit.cloud/api/rooms \
  -H "Authorization: Bearer <API_KEY>:<API_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"name":"test-room"}'
```

### Check Environment Variables
```bash
# Verify .env files have correct values
cat apps/voice-assistant/.env
cat apps/voice-assistant/agent-starter-react/.env.local
```

---

## 📋 Troubleshooting

### Error: "invalid API key"
**Solution:** 
- Verify API key is correct
- Check API secret is correct
- Ensure LiveKit URL matches your project
- Regenerate credentials if needed

### Error: "could not establish signal connection"
**Solution:**
- Check internet connection
- Verify LiveKit URL is accessible
- Check firewall settings
- Try different LiveKit region

### Error: "LIVEKIT_API_KEY is not defined"
**Solution:**
- Ensure .env file exists
- Verify environment variables are set
- Restart services after updating .env
- Check file permissions

---

## 🎯 Quick Fix Checklist

- [ ] Created LiveKit account at https://cloud.livekit.io/
- [ ] Copied API Key
- [ ] Copied API Secret
- [ ] Copied LiveKit URL
- [ ] Updated `apps/voice-assistant/.env`
- [ ] Updated `apps/voice-assistant/agent-starter-react/.env.local`
- [ ] Restarted voice assistant frontend
- [ ] Restarted voice assistant backend
- [ ] Tested connection
- [ ] Voice assistant working

---

## 🚀 Alternative: Use Demo Mode

If you don't have LiveKit credentials, you can use a demo/mock mode:

### Option 1: Use LiveKit Cloud Free Tier
- Go to https://cloud.livekit.io/
- Sign up (free tier available)
- Get credentials
- Update .env files

### Option 2: Self-Host LiveKit (Advanced)
- Install LiveKit server locally
- Update LIVEKIT_URL to local server
- Update API credentials

### Option 3: Use Alternative Service
- Consider using Twilio (has voice API)
- Or use WebRTC alternative
- Update backend accordingly

---

## 📞 Support

### LiveKit Documentation
- https://docs.livekit.io/
- https://docs.livekit.io/guides/getting-started/

### Common Issues
- https://docs.livekit.io/guides/troubleshooting/

### Contact LiveKit Support
- https://livekit.io/contact

---

## ✨ Summary

The voice assistant requires valid LiveKit credentials to work. Follow these steps:

1. **Get credentials** from https://cloud.livekit.io/
2. **Update .env files** with your credentials
3. **Restart services**
4. **Test connection**

Once you have valid credentials, the voice assistant will work perfectly!

---

## 🎉 Next Steps

1. Create LiveKit account
2. Get API credentials
3. Update environment files
4. Restart services
5. Enjoy voice conversations!

**Status:** Ready to fix once you have valid LiveKit credentials
