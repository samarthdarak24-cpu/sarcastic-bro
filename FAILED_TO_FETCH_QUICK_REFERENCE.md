# "Failed to Fetch" Error - Quick Reference

## The Problem
App shows "Failed to fetch" errors when backend services are offline or slow, making it appear broken.

## The Root Cause
- Hardcoded URLs in components
- No centralized configuration
- Inconsistent error handling
- No fallback mechanisms
- No service coordination

## The Solution
4 new files provide centralized API management with automatic timeouts, retries, and fallbacks.

---

## Quick Start

### 1. Use the New API Client

**Instead of**:
```typescript
const response = await fetch('http://localhost:8000/api/v1/trust/quality-scan', {
  method: 'POST',
  body: formData
});
```

**Use**:
```typescript
import { apiPostFormData } from '@/utils/apiClient';
import { API_CONFIG, getEndpointUrl } from '@/config/apiConfig';

const response = await apiPostFormData(
  getEndpointUrl('quality', API_CONFIG.ENDPOINTS.QUALITY_SCAN),
  formData,
  {
    timeout: API_CONFIG.TIMEOUT.LONG,
    fallbackData: generateMockData()
  }
);
```

### 2. Check Response

```typescript
if (response.success) {
  // Use response.data
  if (response.isFallback) {
    toast.info('Using offline mode');
  }
} else {
  toast.error(response.error);
}
```

### 3. Monitor Services

```typescript
import { serviceStatusMonitor } from '@/utils/serviceStatus';

const status = await serviceStatusMonitor.getSystemStatus();
console.log(status.allServicesAvailable);
```

---

## Files Created

| File | Purpose |
|------|---------|
| `apps/web/src/config/apiConfig.ts` | Centralized API configuration |
| `apps/web/src/utils/apiClient.ts` | Robust API client with retries |
| `apps/web/src/utils/serviceStatus.ts` | Service monitoring |
| `apps/web/.env.local` | Updated with all endpoints |

---

## API Client Methods

```typescript
import { apiGet, apiPost, apiPut, apiDelete, apiPostFormData } from '@/utils/apiClient';

// GET request
const response = await apiGet(url, options);

// POST with JSON
const response = await apiPost(url, data, options);

// POST with form data (files)
const response = await apiPostFormData(url, formData, options);

// PUT request
const response = await apiPut(url, data, options);

// DELETE request
const response = await apiDelete(url, options);
```

---

## Options

```typescript
{
  timeout: 10000,                    // Request timeout in ms
  retries: 3,                        // Number of retry attempts
  fallbackData: { /* mock */ },      // Fallback if all retries fail
  service: 'quality',                // Service name for monitoring
  onRetry: (attempt, error) => {},   // Called on each retry
  onFallback: (reason) => {}         // Called when using fallback
}
```

---

## Timeouts

```typescript
API_CONFIG.TIMEOUT.SHORT    // 5 seconds - quick operations
API_CONFIG.TIMEOUT.MEDIUM   // 10 seconds - standard operations
API_CONFIG.TIMEOUT.LONG     // 30 seconds - heavy operations
API_CONFIG.TIMEOUT.SOCKET   // 15 seconds - socket connections
```

---

## Service Names

```typescript
'main'    // Main API (port 3001)
'quality' // Quality Scan service (port 8000)
'shield'  // AI Quality Shield (port 8001)
```

---

## Endpoints

```typescript
API_CONFIG.ENDPOINTS.QUALITY_SCAN        // /api/v1/trust/quality-scan
API_CONFIG.ENDPOINTS.QUALITY_SHIELD_SCAN // /quality-shield/scan
API_CONFIG.ENDPOINTS.ESCROW              // /api/v1/trust/escrow
API_CONFIG.ENDPOINTS.AGGREGATION_LOTS    // /api/v1/trust/aggregation-lots
API_CONFIG.ENDPOINTS.CHAT                // /api/chat
API_CONFIG.ENDPOINTS.N8N_CHAT            // /api/n8n/chat
```

---

## Common Patterns

### File Upload with Fallback
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await apiPostFormData(
  getEndpointUrl('quality', API_CONFIG.ENDPOINTS.QUALITY_SCAN),
  formData,
  {
    timeout: API_CONFIG.TIMEOUT.LONG,
    service: 'quality',
    fallbackData: generateMockScanData(file)
  }
);
```

### Check Service Availability
```typescript
const available = await isServiceAvailable('quality');
if (!available) {
  console.log('Quality service is offline');
}
```

### Monitor Service Status
```typescript
const unsubscribe = serviceStatusMonitor.subscribe((status) => {
  console.log('Services:', status.services);
});

serviceStatusMonitor.startMonitoring(30000); // Check every 30 seconds
```

### Handle Fallback Response
```typescript
if (response.success) {
  if (response.isFallback) {
    toast.info(`Using offline mode: ${response.fallbackReason}`);
  } else {
    toast.success('Data loaded');
  }
}
```

---

## Environment Variables

```env
# Service URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_QUALITY_SCAN_URL=http://localhost:8000
NEXT_PUBLIC_QUALITY_SHIELD_URL=http://localhost:8001

# Timeouts
NEXT_PUBLIC_API_TIMEOUT_MEDIUM=10000
NEXT_PUBLIC_API_TIMEOUT_LONG=30000

# Retries
NEXT_PUBLIC_API_RETRY_MAX_ATTEMPTS=3
NEXT_PUBLIC_API_RETRY_INITIAL_DELAY=1000

# Debug
NEXT_PUBLIC_API_DEBUG_LOGGING=true
```

---

## Debugging

### Enable Debug Logging
```env
NEXT_PUBLIC_API_DEBUG_LOGGING=true
```

Then check console for `[API]` messages.

### Check Service Status
```javascript
// In browser console
import { serviceStatusMonitor } from '@/utils/serviceStatus';
const status = await serviceStatusMonitor.getSystemStatus();
console.table(status.services);
```

### Test Fallback
```javascript
// In browser console
const response = await apiGet('http://localhost:9999/api/data', {
  fallbackData: { test: 'data' },
  retries: 1
});
console.log(response.isFallback); // Should be true
```

---

## Troubleshooting

### "Failed to fetch" Still Showing

1. Check if services are running:
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:8000/health
   curl http://localhost:8001/health
   ```

2. Check `.env.local` has correct URLs

3. Enable debug logging and check console

### Fallback Not Working

1. Verify `fallbackData` is provided
2. Check if service is actually down
3. Check console for retry messages

### Timeout Too Short

1. Check actual response time in Network tab
2. Increase timeout in `.env.local`
3. Restart frontend

---

## Response Structure

```typescript
interface ApiResponse<T> {
  success: boolean;           // true if successful or using fallback
  data?: T;                   // Response data
  error?: string;             // Error message if failed
  isFallback?: boolean;       // true if using fallback data
  fallbackReason?: string;    // Why fallback was used
}
```

---

## Helper Functions

```typescript
import { 
  isFallbackResponse,
  getErrorMessage,
  getEndpointUrl,
  isServiceAvailable,
  getTimeout,
  getRetryDelay
} from '@/config/apiConfig';

// Check if response is using fallback
if (isFallbackResponse(response)) { }

// Get error message
const msg = getErrorMessage(response);

// Get full endpoint URL
const url = getEndpointUrl('quality', '/api/v1/trust/quality-scan');

// Check service availability
const available = await isServiceAvailable('quality');

// Get timeout for operation
const timeout = getTimeout('long');

// Get retry delay for attempt
const delay = getRetryDelay(2); // 2 second delay for attempt 2
```

---

## Best Practices

✅ **Do**:
- Always provide `fallbackData`
- Use appropriate timeout for operation
- Check `isFallback` in response
- Specify `service` name
- Handle errors gracefully

❌ **Don't**:
- Use hardcoded URLs
- Ignore fallback responses
- Use very short timeouts
- Make requests without fallback
- Show raw error messages to users

---

## Performance

- Service checks cached for 30 seconds
- Retry delays: 1s, 2s, 4s (exponential backoff)
- Total retry time: ~3-7 seconds
- Fallback data generation: <100ms

---

## Documentation

- `FAILED_TO_FETCH_ROOT_CAUSE_ANALYSIS.md` - Root cause analysis
- `FAILED_TO_FETCH_TROUBLESHOOTING_GUIDE.md` - Troubleshooting
- `FAILED_TO_FETCH_IMPLEMENTATION_GUIDE.md` - Implementation details
- `FAILED_TO_FETCH_COMPLETE_SOLUTION.md` - Complete solution overview

---

## Support

For issues:
1. Check troubleshooting guide
2. Enable debug logging
3. Check service status
4. Review console messages
5. Check service logs
