# "Failed to Fetch" Error - Troubleshooting Guide

## Quick Diagnosis

### Step 1: Check Service Status
Open browser console (F12) and run:
```javascript
// Check which services are running
const status = await fetch('http://localhost:3001/health').then(r => r.ok ? 'Main API: ✓' : 'Main API: ✗').catch(() => 'Main API: ✗');
console.log(status);

const quality = await fetch('http://localhost:8000/health').then(r => r.ok ? 'Quality Scan: ✓' : 'Quality Scan: ✗').catch(() => 'Quality Scan: ✗');
console.log(quality);

const shield = await fetch('http://localhost:8001/health').then(r => r.ok ? 'AI Shield: ✓' : 'AI Shield: ✗').catch(() => 'AI Shield: ✗');
console.log(shield);
```

### Step 2: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Perform the action that fails
4. Look for failed requests (red X)
5. Click on failed request to see:
   - Status code
   - Response headers
   - Error message

### Step 3: Check Console for Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages with `[API]` prefix
4. Note the service name and error type

---

## Common Issues & Solutions

### Issue 1: "Failed to fetch" - Connection Refused

**Symptoms**:
- Error: `Failed to fetch` or `net::ERR_CONNECTION_REFUSED`
- Happens when uploading images or scanning crops
- Specific to certain features

**Root Cause**:
- Backend service not running on expected port
- Firewall blocking connection
- Wrong port number in configuration

**Solutions**:

1. **Check if service is running**:
   ```bash
   # Check if port 8000 is listening
   netstat -an | grep 8000
   
   # Or use lsof
   lsof -i :8000
   ```

2. **Start the missing service**:
   ```bash
   # Start Quality Scan service (port 8000)
   cd apps/ai-service
   python -m uvicorn main:app --host 0.0.0.0 --port 8000
   
   # Start AI Quality Shield (port 8001)
   cd apps/ai-service
   python -m uvicorn quality_shield:app --host 0.0.0.0 --port 8001
   
   # Start Main API (port 3001)
   cd apps/api
   npm run dev
   ```

3. **Verify configuration**:
   - Check `.env.local` for correct URLs
   - Ensure `NEXT_PUBLIC_API_URL=http://localhost:3001`
   - Ensure `NEXT_PUBLIC_QUALITY_SCAN_URL=http://localhost:8000`
   - Ensure `NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001`

4. **Check firewall**:
   ```bash
   # Windows: Check if port is blocked
   netsh advfirewall firewall show rule name=all | findstr 8000
   
   # Linux: Check firewall
   sudo ufw status
   ```

---

### Issue 2: Timeout Errors

**Symptoms**:
- Request takes 15+ seconds then fails
- "Request timeout" or "AbortError" in console
- Happens intermittently

**Root Cause**:
- Service is slow or unresponsive
- Network latency
- Service processing large request

**Solutions**:

1. **Check service performance**:
   ```bash
   # Monitor service logs
   # Look for slow requests or errors
   ```

2. **Increase timeout** (if needed):
   - Edit `.env.local`
   - Increase `NEXT_PUBLIC_API_TIMEOUT_LONG=30000` to `60000`
   - Restart frontend

3. **Check network**:
   - Run speed test: `ping localhost`
   - Check if network is congested
   - Try from different network

4. **Restart service**:
   ```bash
   # Kill and restart the service
   # This often resolves timeout issues
   ```

---

### Issue 3: CORS Errors

**Symptoms**:
- Error: `Access to XMLHttpRequest blocked by CORS policy`
- Request shows in Network tab but fails
- Specific to certain endpoints

**Root Cause**:
- Backend not configured for CORS
- Frontend and backend on different origins
- Missing CORS headers

**Solutions**:

1. **Check backend CORS configuration**:
   - Verify `apps/api/src/app.ts` has CORS enabled
   - Should have: `app.use(cors())`

2. **Check CSP headers**:
   - Open DevTools → Network tab
   - Click on request → Response Headers
   - Look for `Content-Security-Policy`
   - Should allow `connect-src 'self' http: https: ws: wss: localhost:* 127.0.0.1:*`

3. **Verify next.config.ts**:
   - Check `apps/web/next.config.ts`
   - CSP headers should be properly configured
   - Restart frontend if changed

---

### Issue 4: WebSocket Connection Errors

**Symptoms**:
- Error: `WebSocket connection to 'ws://localhost:3001/socket.io/' failed`
- Real-time features don't work
- Chat messages don't sync

**Root Cause**:
- Socket.io server not running
- WebSocket port blocked
- CSP headers blocking WebSocket

**Solutions**:

1. **Check Socket.io server**:
   ```bash
   # Verify main API is running (includes Socket.io)
   curl http://localhost:3001/socket.io/
   ```

2. **Check WebSocket port**:
   ```bash
   # Verify port 3001 is listening
   netstat -an | grep 3001
   ```

3. **Check CSP headers**:
   - Should allow: `ws: wss: localhost:* 127.0.0.1:*`
   - Check `apps/web/next.config.ts`

4. **Enable Socket.io fallback**:
   - Socket.io automatically falls back to polling
   - Check browser console for fallback message
   - Should still work, just slower

---

### Issue 5: Service Returns 500 Error

**Symptoms**:
- Network tab shows `500 Internal Server Error`
- Service is running but returns error
- Specific to certain requests

**Root Cause**:
- Bug in backend code
- Invalid request data
- Missing dependencies

**Solutions**:

1. **Check service logs**:
   ```bash
   # Look at service console output
   # Should show error stack trace
   ```

2. **Verify request data**:
   - Check what data is being sent
   - Ensure all required fields present
   - Ensure data types are correct

3. **Check service dependencies**:
   ```bash
   # Verify all dependencies installed
   pip list  # For Python services
   npm list  # For Node services
   ```

4. **Restart service**:
   ```bash
   # Kill and restart
   # Often resolves transient errors
   ```

---

### Issue 6: Intermittent Failures

**Symptoms**:
- Sometimes works, sometimes fails
- No clear pattern
- Happens randomly

**Root Cause**:
- Service crashes intermittently
- Network instability
- Resource exhaustion

**Solutions**:

1. **Check service stability**:
   ```bash
   # Monitor service for crashes
   # Look for restart messages
   ```

2. **Check system resources**:
   ```bash
   # Check CPU and memory usage
   top  # Linux/Mac
   tasklist  # Windows
   ```

3. **Enable debug logging**:
   - Edit `.env.local`
   - Set `NEXT_PUBLIC_API_DEBUG_LOGGING=true`
   - Check console for detailed logs

4. **Check for memory leaks**:
   - Monitor service memory over time
   - Restart if memory keeps growing

---

## Advanced Debugging

### Enable API Debug Logging

1. Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_DEBUG_LOGGING=true
   ```

2. Restart frontend

3. Open console and look for `[API]` prefixed messages

4. Messages will show:
   - Request URL and method
   - Timeout value
   - Retry attempts
   - Fallback usage
   - Response time

### Check Service Status Programmatically

```javascript
// In browser console
import { serviceStatusMonitor } from '@/utils/serviceStatus';

// Get current status
const status = await serviceStatusMonitor.getSystemStatus();
console.log(status);

// Subscribe to status changes
const unsubscribe = serviceStatusMonitor.subscribe((status) => {
  console.log('Status changed:', status);
});

// Start monitoring
serviceStatusMonitor.startMonitoring(5000); // Check every 5 seconds
```

### Monitor Network Requests

```javascript
// In browser console
// Log all fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('[FETCH]', args[0]);
  return originalFetch.apply(this, args);
};
```

---

## Service Startup Checklist

### Before Starting Frontend

- [ ] Main API running on port 3001
  ```bash
  cd apps/api && npm run dev
  ```

- [ ] Quality Scan service running on port 8000
  ```bash
  cd apps/ai-service && python -m uvicorn main:app --host 0.0.0.0 --port 8000
  ```

- [ ] AI Quality Shield running on port 8001
  ```bash
  cd apps/ai-service && python -m uvicorn quality_shield:app --host 0.0.0.0 --port 8001
  ```

- [ ] Database running (if required)
  ```bash
  # Check if database is accessible
  ```

- [ ] Environment variables configured
  ```bash
  # Check .env.local has all required variables
  ```

### Verify Services

```bash
# Test each service
curl http://localhost:3001/health
curl http://localhost:8000/health
curl http://localhost:8001/health

# All should return 200 OK
```

---

## Performance Optimization

### Reduce Timeout for Faster Feedback

If services are consistently fast, reduce timeouts:

```
NEXT_PUBLIC_API_TIMEOUT_MEDIUM=5000  # 5 seconds instead of 10
NEXT_PUBLIC_API_TIMEOUT_LONG=15000   # 15 seconds instead of 30
```

### Disable Retries for Faster Failure

If you want faster failure feedback:

```
NEXT_PUBLIC_API_RETRY_MAX_ATTEMPTS=1  # No retries
```

### Increase Retries for Reliability

If network is unstable:

```
NEXT_PUBLIC_API_RETRY_MAX_ATTEMPTS=5  # More retries
NEXT_PUBLIC_API_RETRY_INITIAL_DELAY=500  # Shorter initial delay
```

---

## Getting Help

### Collect Diagnostic Information

When reporting issues, provide:

1. **Browser console output** (F12 → Console)
   - Copy all `[API]` prefixed messages
   - Copy any error messages

2. **Network tab** (F12 → Network)
   - Screenshot of failed requests
   - Response headers and body

3. **Service logs**
   - Output from running services
   - Any error messages

4. **Environment configuration**
   - Content of `.env.local` (without secrets)
   - Port numbers being used

5. **System information**
   - Operating system
   - Node.js version
   - Python version (if applicable)

### Common Questions

**Q: Why does it say "Using fallback data"?**
A: The backend service is unavailable, so the app is using mock data to keep working.

**Q: Why is it so slow?**
A: Check if services are running. If they are, check network latency and service performance.

**Q: Why does it work sometimes but not always?**
A: Services may be crashing intermittently. Check service logs for errors.

**Q: Can I use the app without all services?**
A: Yes! The app uses fallback data when services are unavailable. Features will be limited but app will still work.

---

## Prevention

### Monitor Services

```bash
# Create a monitoring script
# Check services every minute
# Alert if any go down
```

### Set Up Logging

```bash
# Enable comprehensive logging
# Store logs for analysis
# Alert on errors
```

### Regular Testing

```bash
# Test each service regularly
# Verify all endpoints work
# Check response times
```

### Documentation

```bash
# Keep service documentation updated
# Document all endpoints
# Document expected response times
```
