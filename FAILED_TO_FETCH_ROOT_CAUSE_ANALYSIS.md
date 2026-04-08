# "Failed to Fetch" Error - Complete Root Cause Analysis

## Executive Summary
The "Failed to fetch" errors occurring throughout the application stem from **multiple interconnected issues** rather than a single problem. The root causes involve hardcoded URLs, missing centralized configuration, inadequate error handling, and lack of timeout protection.

---

## ROOT CAUSES IDENTIFIED

### 1. **Hardcoded Localhost URLs with Different Ports**
**Problem**: Components make fetch calls to hardcoded URLs pointing to different ports without any centralization or fallback mechanism.

**Affected Components**:
- `CropQualityDetector.tsx`: `http://localhost:8000/api/v1/trust/quality-scan`
- `AIQualityShield.tsx`: `http://localhost:8001/quality-shield/scan`
- `EscrowHub.tsx`: `http://localhost:8000/api/v1/trust/escrow/MY_ORDER`
- `BulkAggregationEngine.tsx`: `http://localhost:8000/api/v1/trust/aggregation-lots`
- Chat components: `http://localhost:3001/api` (via axios)

**Why This Fails**:
- If any service isn't running on the expected port, the fetch fails silently
- No way to redirect to a different port or fallback service
- Different ports suggest different services that may not all be running
- No environment-based configuration

**Impact**: 
- Users see "Failed to fetch" when services are offline
- No graceful degradation
- No indication of which service is down

---

### 2. **Missing Centralized API Configuration**
**Problem**: Each component independently manages its own API URLs without a single source of truth.

**Current State**:
```
.env.local:
  NEXT_PUBLIC_API_URL=http://localhost:3001  (only one URL defined)

Components:
  - Use hardcoded URLs (8000, 8001, 3001)
  - No environment variable usage for most endpoints
  - No API configuration service
```

**Why This Fails**:
- Inconsistent URL management across codebase
- Difficult to change API endpoints (requires code changes)
- No way to switch between development/staging/production
- Services on different ports aren't coordinated

**Impact**:
- Maintenance nightmare
- Difficult to debug which service is being called
- Can't easily switch environments

---

### 3. **Inadequate Error Handling & No Fallback Mechanisms**
**Problem**: Fetch calls fail without proper error handling or fallback strategies.

**Current Implementation Issues**:
- Some components have timeout protection (15 seconds in AIQualityShield)
- Some don't have any timeout (CropQualityDetector has 10 second timeout)
- No retry logic with exponential backoff
- No graceful degradation to mock data
- Error messages shown to users instead of handled silently

**Why This Fails**:
- Network timeouts cause unhandled promise rejections
- Users see raw error messages
- No way to continue using app if one service is down
- No attempt to recover from transient failures

**Impact**:
- Poor user experience
- App appears broken when services are temporarily unavailable
- No resilience to network issues

---

### 4. **Inconsistent Timeout Protection**
**Problem**: Different components use different timeout values or none at all.

**Current State**:
- `AIQualityShield.tsx`: 15 second timeout ✓
- `CropQualityDetector.tsx`: 10 second timeout ✓
- Other components: No timeout ✗
- Socket.io: Has reconnection logic but no initial connection timeout

**Why This Fails**:
- Requests can hang indefinitely
- Users wait forever for responses
- No consistent behavior across app
- Some services may be slow, causing different timeouts

**Impact**:
- Unpredictable wait times
- Frozen UI
- Inconsistent user experience

---

### 5. **No Service Health Checking**
**Problem**: App doesn't know if services are available before making requests.

**Current State**:
- No health check endpoints called
- No service availability detection
- No pre-flight checks
- Errors only discovered when fetch fails

**Why This Fails**:
- Can't proactively inform users of service issues
- Can't switch to fallback mode before attempting requests
- No way to know which services are available

**Impact**:
- Users attempt operations that will fail
- No early warning system
- Wasted network requests

---

### 6. **Socket.io Connection Issues**
**Problem**: WebSocket connections fail with CSP violations and connection refused errors.

**Current State**:
- CSP headers allow `ws: wss: localhost:* 127.0.0.1:*` ✓
- Socket.io configured with fallback to polling ✓
- But connection errors not handled gracefully
- No indication to user when socket is disconnected

**Why This Fails**:
- Connection errors thrown but not caught
- No fallback UI state
- Users don't know socket is disconnected
- Real-time features fail silently

**Impact**:
- Real-time features don't work
- No indication to user
- App appears broken

---

### 7. **Environment Variable Misalignment**
**Problem**: `.env.local` only defines one API URL but components need multiple.

**Current State**:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Missing**:
- `NEXT_PUBLIC_QUALITY_SCAN_URL` (for port 8000)
- `NEXT_PUBLIC_QUALITY_SHIELD_URL` (for port 8001)
- `NEXT_PUBLIC_ESCROW_URL` (for port 8000)
- `NEXT_PUBLIC_AGGREGATION_URL` (for port 8000)
- Timeout configuration
- Retry configuration
- Fallback mode configuration

**Why This Fails**:
- Components can't use environment variables for all endpoints
- Forced to use hardcoded URLs
- No way to configure behavior without code changes

**Impact**:
- Inflexible configuration
- Difficult to deploy to different environments

---

## FAILURE SCENARIOS

### Scenario 1: Service on Port 8000 is Down
```
User uploads crop image
  ↓
CropQualityDetector tries: http://localhost:8000/api/v1/trust/quality-scan
  ↓
Connection refused (port 8000 not listening)
  ↓
Fetch fails with "Failed to fetch"
  ↓
Error caught, mock data generated ✓ (but user sees error message)
```

### Scenario 2: Service on Port 8001 is Down
```
User uploads image to AIQualityShield
  ↓
AIQualityShield tries: http://localhost:8001/quality-shield/scan
  ↓
Connection refused (port 8001 not listening)
  ↓
Timeout after 15 seconds
  ↓
Mock data generated ✓ (but user sees "Note" message)
```

### Scenario 3: Network Timeout
```
User initiates real-time scan
  ↓
Socket.io tries to connect to ws://localhost:3001/socket.io/
  ↓
Network latency causes timeout
  ↓
Connection error not handled
  ↓
Real-time features fail silently
```

### Scenario 4: Multiple Services Down
```
User navigates dashboard
  ↓
Multiple components try to fetch from different ports
  ↓
All fail with "Failed to fetch"
  ↓
App appears completely broken
  ↓
No indication which services are down
```

---

## IMPACT ASSESSMENT

### User Experience Impact
- ❌ Confusing error messages
- ❌ App appears broken when services are offline
- ❌ No indication of what's wrong
- ❌ No way to continue using app
- ❌ Unpredictable behavior

### Developer Experience Impact
- ❌ Difficult to debug which service is failing
- ❌ Hardcoded URLs scattered throughout codebase
- ❌ No centralized configuration
- ❌ Inconsistent error handling patterns
- ❌ Difficult to add new services

### System Reliability Impact
- ❌ No resilience to service failures
- ❌ No graceful degradation
- ❌ No fallback mechanisms
- ❌ No health checking
- ❌ No retry logic

---

## SOLUTION ARCHITECTURE

### Phase 1: Centralized Configuration
- Create `apiConfig.ts` with all endpoint definitions
- Move all URLs to environment variables
- Create API client factory with consistent error handling

### Phase 2: Robust Error Handling
- Implement timeout protection for all requests
- Add retry logic with exponential backoff
- Create fallback data generators
- Add service health checking

### Phase 3: Graceful Degradation
- Show info messages instead of errors
- Use mock data when services unavailable
- Maintain app functionality with degraded features
- Provide user feedback on service status

### Phase 4: Real-Time Improvements
- Improve Socket.io error handling
- Add connection status indicator
- Implement automatic reconnection
- Add fallback to polling

### Phase 5: Monitoring & Debugging
- Add request logging
- Create service status dashboard
- Add performance metrics
- Create troubleshooting guide

---

## SUMMARY

The "Failed to fetch" errors are not a single bug but a **systemic issue** caused by:

1. **Architectural**: Hardcoded URLs, no centralized configuration
2. **Operational**: Multiple services on different ports, no coordination
3. **Implementation**: Inconsistent error handling, missing timeouts
4. **Resilience**: No fallback mechanisms, no health checking
5. **UX**: Error messages shown to users instead of handled gracefully

**The solution requires a comprehensive refactor** of how the application handles API communication, error handling, and service coordination.

---

## NEXT STEPS

1. ✅ Create centralized API configuration
2. ✅ Implement robust error handling utilities
3. ✅ Add timeout protection to all requests
4. ✅ Implement retry logic
5. ✅ Create service health checker
6. ✅ Update all components to use new system
7. ✅ Add user-facing status indicators
8. ✅ Create troubleshooting guide
