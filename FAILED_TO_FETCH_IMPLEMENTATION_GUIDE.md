# "Failed to Fetch" Error - Implementation Guide

## Overview

This guide explains how to use the new centralized API system to fix "Failed to fetch" errors throughout the application.

---

## New Files Created

### 1. `apps/web/src/config/apiConfig.ts`
Centralized configuration for all API endpoints, timeouts, and retry settings.

**Key Features**:
- All endpoint URLs in one place
- Configurable timeouts
- Retry configuration
- Service availability checking with caching

**Usage**:
```typescript
import { API_CONFIG, getEndpointUrl, isServiceAvailable } from '@/config/apiConfig';

// Get endpoint URL
const url = getEndpointUrl('quality', API_CONFIG.ENDPOINTS.QUALITY_SCAN);

// Check if service is available
const available = await isServiceAvailable('quality');

// Get timeout for operation
const timeout = getTimeout('long');
```

---

### 2. `apps/web/src/utils/apiClient.ts`
Robust API client with timeout, retry, and fallback support.

**Key Features**:
- Automatic timeout protection
- Retry logic with exponential backoff
- Fallback data support
- Consistent error handling
- Request logging

**Usage**:
```typescript
import { apiFetch, apiPost, apiPostFormData } from '@/utils/apiClient';

// Simple GET request
const response = await apiGet('/api/data', {
  timeout: 10000,
  fallbackData: { /* mock data */ }
});

if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}

// POST with form data (file upload)
const formData = new FormData();
formData.append('file', file);

const response = await apiPostFormData(
  'http://localhost:8000/api/v1/trust/quality-scan',
  formData,
  {
    timeout: 30000,
    service: 'quality',
    fallbackData: generateMockScanData(file),
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}: ${error.message}`);
    },
    onFallback: (reason) => {
      console.log(`Using fallback: ${reason}`);
    }
  }
);
```

---

### 3. `apps/web/src/utils/serviceStatus.ts`
Service status monitoring and reporting.

**Key Features**:
- Check individual service status
- Get system-wide status
- Subscribe to status changes
- Automatic monitoring
- Status caching

**Usage**:
```typescript
import { serviceStatusMonitor } from '@/utils/serviceStatus';

// Get current status
const status = await serviceStatusMonitor.getSystemStatus();
console.log(status.allServicesAvailable);

// Subscribe to changes
const unsubscribe = serviceStatusMonitor.subscribe((status) => {
  console.log('Services:', status.services);
});

// Start monitoring
serviceStatusMonitor.startMonitoring(30000); // Check every 30 seconds

// Stop monitoring
serviceStatusMonitor.stopMonitoring();
```

---

### 4. Updated `.env.local`
Comprehensive environment configuration with all API endpoints and settings.

**New Variables**:
- `NEXT_PUBLIC_QUALITY_SCAN_URL` - Quality Scan service
- `NEXT_PUBLIC_QUALITY_SHIELD_URL` - AI Quality Shield service
- `NEXT_PUBLIC_API_TIMEOUT_*` - Timeout settings
- `NEXT_PUBLIC_API_RETRY_*` - Retry settings
- `NEXT_PUBLIC_SERVICE_MONITORING_*` - Monitoring settings

---

## Migration Guide

### Step 1: Update Components to Use New API Client

**Before** (CropQualityDetector.tsx):
```typescript
const response = await fetch('http://localhost:8000/api/v1/trust/quality-scan?crop_type=' + cropType, {
  method: 'POST',
  signal: controller.signal,
});

if (!response.ok) {
  throw new Error(`API error: ${response.statusText}`);
}

const result = await response.json();
```

**After**:
```typescript
import { apiPostFormData } from '@/utils/apiClient';
import { API_CONFIG, getEndpointUrl } from '@/config/apiConfig';

const response = await apiPostFormData(
  getEndpointUrl('quality', API_CONFIG.ENDPOINTS.QUALITY_SCAN) + '?crop_type=' + cropType,
  formData,
  {
    timeout: API_CONFIG.TIMEOUT.LONG,
    service: 'quality',
    fallbackData: generateMockScanData(file),
    onFallback: (reason) => {
      console.warn('Using mock data:', reason);
    }
  }
);

if (response.success) {
  const result = response.data;
  // Use result
} else {
  console.error('Scan failed:', response.error);
}
```

---

### Step 2: Add Fallback Data Generators

Create mock data generators for each service:

```typescript
// In component or service file
function generateMockScanData(file: File) {
  return {
    certificate_id: `CERT-${Date.now()}`,
    crop_type: 'Tomato',
    grade: 'Grade A',
    health_score: 88,
    confidence: 0.95,
    moisture: 85,
    blockchain_hash: '0x...'
  };
}

function generateMockQualityShieldData() {
  return {
    success: true,
    overall_quality_score: 88,
    overall_grade: 'Grade A',
    total_detections: 1,
    detections: [/* ... */],
    technology_stack: {
      detection: 'YOLOv8',
      classification: 'EfficientNet',
      preprocessing: 'OpenCV',
      transfer_learning: 'ImageNet'
    }
  };
}
```

---

### Step 3: Add Error Handling UI

Show user-friendly messages instead of errors:

```typescript
import { isFallbackResponse, getErrorMessage } from '@/utils/apiClient';

const response = await apiPost(url, data, { fallbackData: mockData });

if (response.success) {
  if (isFallbackResponse(response)) {
    // Show info message, not error
    toast.info(`Using offline mode: ${response.fallbackReason}`);
  } else {
    toast.success('Operation completed');
  }
} else {
  // Show error only if no fallback
  toast.error(getErrorMessage(response));
}
```

---

### Step 4: Add Service Status Indicator

Create a component to show service status:

```typescript
import { useEffect, useState } from 'react';
import { serviceStatusMonitor } from '@/utils/serviceStatus';

export function ServiceStatusIndicator() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const unsubscribe = serviceStatusMonitor.subscribe(setStatus);
    serviceStatusMonitor.startMonitoring();
    return () => {
      unsubscribe();
      serviceStatusMonitor.stopMonitoring();
    };
  }, []);

  if (!status) return null;

  return (
    <div className={status.allServicesAvailable ? 'text-green-600' : 'text-yellow-600'}>
      {serviceStatusMonitor.getSummary(status)}
    </div>
  );
}
```

---

## Best Practices

### 1. Always Provide Fallback Data

```typescript
// ✓ Good - has fallback
const response = await apiGet(url, {
  fallbackData: mockData
});

// ✗ Bad - no fallback
const response = await apiGet(url);
```

### 2. Use Appropriate Timeouts

```typescript
// ✓ Good - appropriate timeout for operation
const response = await apiPost(url, data, {
  timeout: API_CONFIG.TIMEOUT.LONG  // 30 seconds for file upload
});

// ✗ Bad - too short timeout
const response = await apiPost(url, data, {
  timeout: 1000  // 1 second - will always timeout
});
```

### 3. Handle Fallback Responses

```typescript
// ✓ Good - checks if using fallback
if (response.success) {
  if (isFallbackResponse(response)) {
    // Show info message
    toast.info('Using offline mode');
  } else {
    // Show success message
    toast.success('Data loaded');
  }
}

// ✗ Bad - treats fallback same as real data
if (response.success) {
  toast.success('Data loaded');  // Misleading if using fallback
}
```

### 4. Use Service-Specific Configuration

```typescript
// ✓ Good - specifies service
const response = await apiPost(url, data, {
  service: 'quality',  // Helps with service availability checking
  timeout: API_CONFIG.TIMEOUT.LONG
});

// ✗ Bad - no service specified
const response = await apiPost(url, data, {
  timeout: API_CONFIG.TIMEOUT.LONG
});
```

### 5. Implement Retry Callbacks

```typescript
// ✓ Good - logs retry attempts
const response = await apiPost(url, data, {
  onRetry: (attempt, error) => {
    console.log(`Retry ${attempt}: ${error.message}`);
  },
  onFallback: (reason) => {
    console.log(`Using fallback: ${reason}`);
  }
});

// ✗ Bad - no visibility into retries
const response = await apiPost(url, data);
```

---

## Testing

### Test Fallback Behavior

```typescript
// Simulate service being down
const response = await apiGet('http://localhost:9999/api/data', {
  fallbackData: { test: 'data' },
  retries: 1  // Fail fast for testing
});

// Should return fallback data
console.assert(response.success === true);
console.assert(response.isFallback === true);
console.assert(response.data.test === 'data');
```

### Test Retry Logic

```typescript
// Monitor retry attempts
let retryCount = 0;
const response = await apiGet('http://localhost:9999/api/data', {
  fallbackData: { test: 'data' },
  onRetry: () => {
    retryCount++;
  }
});

// Should have retried 3 times
console.assert(retryCount === 3);
```

### Test Timeout

```typescript
// Should timeout after 1 second
const response = await apiGet('http://localhost:3001/slow-endpoint', {
  timeout: 1000,
  fallbackData: { test: 'data' }
});

// Should use fallback due to timeout
console.assert(response.isFallback === true);
```

---

## Monitoring & Debugging

### Enable Debug Logging

```
NEXT_PUBLIC_API_DEBUG_LOGGING=true
```

Then check console for `[API]` prefixed messages.

### Monitor Service Status

```typescript
// In browser console
import { serviceStatusMonitor } from '@/utils/serviceStatus';

const status = await serviceStatusMonitor.getSystemStatus();
console.table(status.services);
```

### Check Request Performance

```typescript
// In browser console
// Look for [API] messages showing response times
// Example: [API] Request completed in 245ms
```

---

## Troubleshooting

### Issue: Fallback data not being used

**Check**:
1. Is `fallbackData` provided?
2. Is service actually down? (Check with curl)
3. Are retries exhausted? (Check console logs)

### Issue: Timeout too short

**Check**:
1. Is service slow? (Check response time in Network tab)
2. Is network latency high? (Check ping)
3. Increase timeout in `.env.local`

### Issue: Too many retries

**Check**:
1. Is service down? (Check with curl)
2. Reduce `NEXT_PUBLIC_API_RETRY_MAX_ATTEMPTS`
3. Or increase `NEXT_PUBLIC_API_RETRY_INITIAL_DELAY`

---

## Performance Considerations

### Caching

Service availability is cached for 30 seconds to avoid excessive health checks.

```typescript
// Clear cache if needed
import { clearServiceCache } from '@/config/apiConfig';
clearServiceCache();
```

### Monitoring Overhead

Service monitoring runs every 30 seconds by default. Adjust if needed:

```typescript
// Check every 60 seconds instead
serviceStatusMonitor.startMonitoring(60000);
```

### Retry Delays

Exponential backoff prevents overwhelming services:
- Attempt 1: Immediate
- Attempt 2: 1 second delay
- Attempt 3: 2 second delay

Total time for 3 retries: ~3 seconds

---

## Next Steps

1. Update all components to use new API client
2. Add fallback data generators
3. Add service status indicator to dashboard
4. Enable debug logging in development
5. Test all features with services offline
6. Monitor service status in production
7. Create runbooks for common issues
