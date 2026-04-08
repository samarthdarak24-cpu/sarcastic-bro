# "Failed to Fetch" Error - Architecture Diagram

## System Architecture

### Before (Broken)
```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ CropQuality      │  │ AIQuality        │               │
│  │ Detector         │  │ Shield           │               │
│  └────────┬─────────┘  └────────┬─────────┘               │
│           │                     │                          │
│  ┌────────▼─────────────────────▼────────┐               │
│  │  Hardcoded fetch() calls               │               │
│  │  - http://localhost:8000               │               │
│  │  - http://localhost:8001               │               │
│  │  - http://localhost:3001               │               │
│  │  No error handling, no retries         │               │
│  └────────┬─────────────────────┬────────┘               │
│           │                     │                          │
└───────────┼─────────────────────┼──────────────────────────┘
            │                     │
            ▼                     ▼
    ┌──────────────┐      ┌──────────────┐
    │ Port 8000    │      │ Port 8001    │
    │ (Offline)    │      │ (Offline)    │
    └──────────────┘      └──────────────┘
            │                     │
            ▼                     ▼
    ❌ Connection Refused  ❌ Connection Refused
    ❌ "Failed to fetch"   ❌ "Failed to fetch"
    ❌ App Broken          ❌ App Broken
```

### After (Fixed)
```
┌──────────────────────────────────────────────────────────────────┐
│                     React Frontend                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ CropQuality      │  │ AIQuality        │                    │
│  │ Detector         │  │ Shield           │                    │
│  └────────┬─────────┘  └────────┬─────────┘                    │
│           │                     │                               │
│  ┌────────▼─────────────────────▼────────────────────┐         │
│  │  apiClient (Robust API Client)                    │         │
│  │  ✓ Timeout protection (10-30s)                    │         │
│  │  ✓ Retry logic (exponential backoff)              │         │
│  │  ✓ Fallback data support                          │         │
│  │  ✓ Consistent error handling                      │         │
│  └────────┬──────────────────────────────────────────┘         │
│           │                                                     │
│  ┌────────▼──────────────────────────────────────────┐         │
│  │  apiConfig (Centralized Configuration)            │         │
│  │  ✓ All endpoints defined                          │         │
│  │  ✓ Timeout settings                               │         │
│  │  ✓ Retry settings                                 │         │
│  │  ✓ Service availability checking                  │         │
│  └────────┬──────────────────────────────────────────┘         │
│           │                                                     │
│  ┌────────▼──────────────────────────────────────────┐         │
│  │  serviceStatus (Service Monitoring)               │         │
│  │  ✓ Health checking                                │         │
│  │  ✓ Status caching                                 │         │
│  │  ✓ Status subscriptions                           │         │
│  │  ✓ Automatic monitoring                           │         │
│  └────────┬──────────────────────────────────────────┘         │
│           │                                                     │
└───────────┼─────────────────────────────────────────────────────┘
            │
    ┌───────┴────────────────────────────────────────┐
    │                                                │
    ▼                                                ▼
┌──────────────┐                            ┌──────────────┐
│ Port 8000    │                            │ Port 8001    │
│ (Offline)    │                            │ (Offline)    │
└──────────────┘                            └──────────────┘
    │                                                │
    ▼                                                ▼
❌ Connection Refused                    ❌ Connection Refused
    │                                                │
    ▼                                                ▼
✅ Retry 1 (1s delay)                    ✅ Retry 1 (1s delay)
✅ Retry 2 (2s delay)                    ✅ Retry 2 (2s delay)
✅ Retry 3 (4s delay)                    ✅ Retry 3 (4s delay)
    │                                                │
    ▼                                                ▼
✅ Use Fallback Data                     ✅ Use Fallback Data
✅ Show Info Message                     ✅ Show Info Message
✅ App Continues Working                 ✅ App Continues Working
```

---

## Request Flow

### Successful Request
```
Component
    │
    ▼
apiClient.apiPost(url, data, options)
    │
    ├─ Check service availability
    │
    ├─ Create AbortController with timeout
    │
    ├─ Make fetch request
    │
    ├─ Response OK?
    │   ├─ YES → Return { success: true, data }
    │   └─ NO → Throw error
    │
    └─ Return response
```

### Failed Request with Retry
```
Component
    │
    ▼
apiClient.apiPost(url, data, options)
    │
    ├─ Attempt 1
    │   ├─ Fetch fails (timeout/connection error)
    │   ├─ Log retry attempt
    │   └─ Wait 1 second
    │
    ├─ Attempt 2
    │   ├─ Fetch fails
    │   ├─ Log retry attempt
    │   └─ Wait 2 seconds
    │
    ├─ Attempt 3
    │   ├─ Fetch fails
    │   ├─ Log retry attempt
    │   └─ All retries exhausted
    │
    ├─ Fallback data available?
    │   ├─ YES → Return { success: true, data: fallback, isFallback: true }
    │   └─ NO → Return { success: false, error: message }
    │
    └─ Return response
```

---

## Component Integration

### Before
```
CropQualityDetector.tsx
    │
    ├─ State: [scanning, scanProgress, uploadedImages]
    │
    ├─ handleFileSelect()
    │   ├─ fetch('http://localhost:8000/...')
    │   ├─ No timeout
    │   ├─ No retry
    │   ├─ No fallback
    │   └─ Show error to user ❌
    │
    └─ Render UI
```

### After
```
CropQualityDetector.tsx
    │
    ├─ State: [scanning, scanProgress, uploadedImages]
    │
    ├─ handleFileSelect()
    │   ├─ apiPostFormData(url, formData, {
    │   │   timeout: TIMEOUT.LONG,
    │   │   service: 'quality',
    │   │   fallbackData: generateMockData(),
    │   │   onFallback: (reason) => toast.info(reason)
    │   │ })
    │   ├─ Check response.success
    │   ├─ Check response.isFallback
    │   ├─ Show appropriate message
    │   └─ Continue with data ✅
    │
    └─ Render UI
```

---

## Service Availability Checking

```
┌─────────────────────────────────────────┐
│  isServiceAvailable('quality')          │
├─────────────────────────────────────────┤
│                                         │
│  1. Check cache                         │
│     ├─ Found & valid? → Return cached  │
│     └─ Not found or expired? → Continue│
│                                         │
│  2. Make health check request           │
│     ├─ GET http://localhost:8000/health│
│     ├─ Timeout: 5 seconds               │
│     └─ Wait for response                │
│                                         │
│  3. Check response                      │
│     ├─ OK? → available = true           │
│     └─ Error? → available = false       │
│                                         │
│  4. Cache result                        │
│     └─ Valid for 30 seconds             │
│                                         │
│  5. Return result                       │
│     └─ true or false                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Retry Logic with Exponential Backoff

```
Attempt 1
├─ Delay: 0ms (immediate)
├─ Fetch request
└─ Fail → Continue

Attempt 2
├─ Delay: 1000ms (1 second)
├─ Fetch request
└─ Fail → Continue

Attempt 3
├─ Delay: 2000ms (2 seconds)
├─ Fetch request
└─ Fail → Use fallback

Total time: ~3 seconds
Formula: delay = INITIAL_DELAY * (MULTIPLIER ^ (attempt - 1))
         delay = 1000 * (2 ^ (attempt - 1))
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────┐
│  API Request                                    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ Request OK?    │
        └────┬───────┬───┘
             │       │
            YES      NO
             │       │
             ▼       ▼
        ┌────────┐  ┌──────────────────┐
        │Return  │  │ Retries left?    │
        │success │  └────┬──────────┬───┘
        └────────┘       │          │
                        YES        NO
                         │          │
                         ▼          ▼
                    ┌────────┐  ┌──────────────┐
                    │Retry   │  │Fallback data?│
                    │after   │  └────┬──────┬──┘
                    │delay   │       │      │
                    └────────┘      YES    NO
                                     │      │
                                     ▼      ▼
                                ┌────────┐ ┌──────┐
                                │Return  │ │Return│
                                │success │ │error │
                                │(fallbk)│ └──────┘
                                └────────┘
```

---

## Configuration Hierarchy

```
┌─────────────────────────────────────────┐
│  .env.local (Environment Variables)     │
├─────────────────────────────────────────┤
│  NEXT_PUBLIC_API_URL                    │
│  NEXT_PUBLIC_QUALITY_SCAN_URL           │
│  NEXT_PUBLIC_QUALITY_SHIELD_URL         │
│  NEXT_PUBLIC_API_TIMEOUT_*              │
│  NEXT_PUBLIC_API_RETRY_*                │
│  NEXT_PUBLIC_SERVICE_MONITORING_*       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  apiConfig.ts (Configuration Object)    │
├─────────────────────────────────────────┤
│  API_CONFIG = {                         │
│    BASE_URL,                            │
│    QUALITY_SCAN_URL,                    │
│    QUALITY_SHIELD_URL,                  │
│    TIMEOUT: { SHORT, MEDIUM, LONG },    │
│    RETRY: { MAX_ATTEMPTS, DELAYS },     │
│    ENDPOINTS: { ... }                   │
│  }                                      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  apiClient.ts (API Client)              │
├─────────────────────────────────────────┤
│  apiFetch()                             │
│  apiGet()                               │
│  apiPost()                              │
│  apiPostFormData()                      │
│  apiPut()                               │
│  apiDelete()                            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Components (React)                     │
├─────────────────────────────────────────┤
│  CropQualityDetector                    │
│  AIQualityShield                        │
│  EscrowHub                              │
│  BulkAggregationEngine                  │
│  Chat Components                        │
└─────────────────────────────────────────┘
```

---

## Service Status Monitoring

```
┌──────────────────────────────────────────┐
│  serviceStatusMonitor                    │
├──────────────────────────────────────────┤
│                                          │
│  startMonitoring(interval)               │
│  ├─ Check all services every N ms        │
│  ├─ Notify subscribers of changes        │
│  └─ Cache results for 30 seconds         │
│                                          │
│  getSystemStatus()                       │
│  ├─ Check all services                   │
│  ├─ Return: {                            │
│  │   allServicesAvailable: boolean,      │
│  │   services: [                         │
│  │     { name, available, url, time }    │
│  │   ]                                   │
│  │ }                                     │
│  └─ Notify subscribers                   │
│                                          │
│  subscribe(listener)                     │
│  ├─ Add listener to subscribers          │
│  └─ Return unsubscribe function          │
│                                          │
└──────────────────────────────────────────┘
```

---

## Data Flow Example: File Upload

```
User selects file
    │
    ▼
handleFileSelect(event)
    │
    ├─ Create FormData
    ├─ Append file
    │
    ▼
apiPostFormData(url, formData, {
  timeout: 30000,
  service: 'quality',
  fallbackData: generateMockData(),
  onFallback: (reason) => toast.info(reason)
})
    │
    ├─ Check service availability
    │   └─ GET http://localhost:8000/health
    │
    ├─ Attempt 1: POST file
    │   ├─ Timeout: 30 seconds
    │   └─ Fail → Retry
    │
    ├─ Attempt 2: POST file (after 1s delay)
    │   └─ Fail → Retry
    │
    ├─ Attempt 3: POST file (after 2s delay)
    │   └─ Fail → Use fallback
    │
    ▼
Return {
  success: true,
  data: mockData,
  isFallback: true,
  fallbackReason: 'Service unavailable'
}
    │
    ▼
if (response.success) {
  if (response.isFallback) {
    toast.info('Using offline mode')
  }
  // Use response.data
}
    │
    ▼
Update UI with results
    │
    ▼
User sees results (real or mock)
```

---

## Timeout Scenarios

```
Request Timeline
├─ 0ms: Request starts
├─ 100ms: Service processing
├─ 500ms: Service processing
├─ 1000ms: Service processing
├─ 5000ms: Service processing
├─ 10000ms: TIMEOUT (if timeout = 10s)
│   └─ AbortController aborts request
│   └─ Retry logic triggered
└─ 30000ms: TIMEOUT (if timeout = 30s)
    └─ AbortController aborts request
    └─ Retry logic triggered
```

---

## Service Ports

```
┌─────────────────────────────────────────┐
│  Frontend (Next.js)                     │
│  Port: 3000                             │
└─────────────────────────────────────────┘
            │
    ┌───────┼───────┬──────────┐
    │       │       │          │
    ▼       ▼       ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Main API│ │Quality │ │AI      │ │Database│
│        │ │Scan    │ │Shield  │ │        │
│Port    │ │Port    │ │Port    │ │Port    │
│3001    │ │8000    │ │8001    │ │5432    │
└────────┘ └────────┘ └────────┘ └────────┘
```

---

## Summary

The new architecture provides:

1. **Centralized Configuration** - All settings in one place
2. **Robust Error Handling** - Timeouts, retries, fallbacks
3. **Service Monitoring** - Health checking and status reporting
4. **Graceful Degradation** - App continues working with fallback data
5. **Better UX** - Info messages instead of errors
6. **Easier Debugging** - Logging and status tracking

This ensures the app continues working even when services are offline or slow.
