# N8N Chat Backend Setup & Troubleshooting

## Quick Start

### 1. Verify Backend is Running
```bash
# Terminal 1 - Start Backend
cd apps/api
npm run dev
```

You should see:
```
✓ Server running on http://localhost:3001
```

### 2. Test Health Endpoint
```bash
curl http://localhost:3001/api/n8n/health
```

Expected response:
```json
{
  "success": true,
  "message": "N8N Chat service is running",
  "timestamp": "2024-04-08T16:12:00.000Z"
}
```

### 3. Test Chat Endpoint
```bash
curl -X POST http://localhost:3001/api/n8n/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput":"Check crop health"}'
```

Expected response:
```json
{
  "output": "I can help you with crop management! Here are some tips...",
  "sessionId": "session_1712600940000_abc123def"
}
```

### 4. Start Frontend
```bash
# Terminal 2 - Start Frontend
cd apps/web
npm run dev
```

### 5. Test Chat Widget
- Open http://localhost:3000
- Click green leaf button (bottom-right)
- Type a message
- Should see response from backend

---

## Troubleshooting

### Issue: "Failed to fetch" Error

**Cause**: Backend not running or CORS issue

**Solution**:
1. Check if backend is running on port 3001
   ```bash
   lsof -i :3001  # macOS/Linux
   netstat -ano | findstr :3001  # Windows
   ```

2. If not running, start it:
   ```bash
   cd apps/api && npm run dev
   ```

3. Test health endpoint:
   ```bash
   curl http://localhost:3001/api/n8n/health
   ```

4. Check browser console for detailed error (F12 → Console)

---

### Issue: "HTTP 404" Error

**Cause**: Wrong endpoint path

**Solution**:
- Verify endpoint is: `http://localhost:3001/api/n8n/chat`
- Check `.env.local` has correct URL:
  ```env
  NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:3001/api/n8n/chat
  ```

---

### Issue: "HTTP 500" Error

**Cause**: Backend error processing message

**Solution**:
1. Check backend logs for error details
2. Verify request body format:
   ```json
   {
     "chatInput": "your message here"
   }
   ```

3. Test with curl:
   ```bash
   curl -X POST http://localhost:3001/api/n8n/chat \
     -H "Content-Type: application/json" \
     -d '{"chatInput":"hi"}'
   ```

---

### Issue: CORS Error in Browser

**Cause**: CORS not properly configured

**Solution**:
1. Verify CORS is enabled in `apps/api/src/app.ts`:
   ```typescript
   app.use(cors({
     origin: env.CORS_ORIGINS,
     credentials: true,
     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
     allowedHeaders: ["Content-Type", "Authorization"],
   }));
   ```

2. Check `apps/api/src/config/env.ts` for CORS_ORIGINS:
   ```typescript
   CORS_ORIGINS: process.env.CORS_ORIGINS || "*"
   ```

3. Restart backend after changes

---

### Issue: No Response from Bot

**Cause**: Service not processing messages correctly

**Solution**:
1. Check N8N service is instantiated in controller
2. Verify `chatInput` field is being sent (not `message`)
3. Test service directly:
   ```bash
   curl -X POST http://localhost:3001/api/n8n/chat \
     -H "Content-Type: application/json" \
     -d '{"chatInput":"Check crop health"}'
   ```

---

## Environment Configuration

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# N8N Chat Configuration
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:3001/api/n8n/chat
```

### Backend (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGINS=*
```

---

## File Structure

```
apps/
├── api/
│   └── src/
│       ├── app.ts (CORS configured here)
│       └── modules/
│           └── n8n-chat/
│               ├── n8n-chat.controller.ts (handles requests)
│               ├── n8n-chat.service.ts (processes messages)
│               └── n8n-chat.routes.ts (defines endpoints)
└── web/
    └── src/
        ├── components/
        │   └── chat/
        │       └── PremiumChatWidget.tsx (sends requests)
        └── .env.local (webhook URL)
```

---

## API Endpoints

### Health Check
```
GET /api/n8n/health
```

Response:
```json
{
  "success": true,
  "message": "N8N Chat service is running",
  "timestamp": "2024-04-08T16:12:00.000Z"
}
```

### Chat Message
```
POST /api/n8n/chat
Content-Type: application/json

{
  "chatInput": "Check crop health",
  "sessionId": "optional-session-id"
}
```

Response:
```json
{
  "output": "I can help you with crop management!...",
  "sessionId": "session_1712600940000_abc123def"
}
```

---

## Debugging Steps

### 1. Check Backend Logs
```bash
# Terminal running backend
# Look for errors or warnings
```

### 2. Check Browser Console
```
F12 → Console tab
Look for fetch errors or network issues
```

### 3. Check Network Tab
```
F12 → Network tab
Click on POST request to /api/n8n/chat
Check:
- Status code (should be 200)
- Request headers
- Response body
```

### 4. Test with Postman/Insomnia
- Create POST request to `http://localhost:3001/api/n8n/chat`
- Set header: `Content-Type: application/json`
- Set body: `{"chatInput":"hi"}`
- Send and check response

---

## Common Messages & Responses

### Crop-related
- Input: "crop", "plant", "growing"
- Response: Crop management tips

### Weather-related
- Input: "weather", "rain", "forecast"
- Response: Weather management advice

### Market-related
- Input: "price", "market", "sell"
- Response: Market intelligence tips

### Pest-related
- Input: "pest", "disease", "bug"
- Response: Pest management advice

### Soil-related
- Input: "soil", "fertilizer", "nutrient"
- Response: Soil health tips

### Water-related
- Input: "water", "irrigation", "rain"
- Response: Water management tips

---

## Production Deployment

### Before Going Live
1. ✅ Test all endpoints with curl
2. ✅ Verify CORS configuration
3. ✅ Check error handling
4. ✅ Add rate limiting
5. ✅ Enable HTTPS
6. ✅ Set proper environment variables

### Environment Variables (Production)
```env
# Backend
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://yourdomain.com

# Frontend
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://yourdomain.com/api/n8n/chat
```

---

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review backend logs
3. Test endpoints with curl
4. Check browser console
5. Verify environment configuration

---

**Last Updated**: April 8, 2024
**Status**: ✅ Ready for Production
