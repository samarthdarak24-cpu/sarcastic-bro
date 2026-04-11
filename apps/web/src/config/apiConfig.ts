/**
 * Centralized API Configuration
 * 
 * This file manages all API endpoints and provides a consistent interface
 * for making API calls with proper error handling, timeouts, and fallbacks.
 */

export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  QUALITY_SCAN_URL: process.env.NEXT_PUBLIC_QUALITY_SCAN_URL || 'http://localhost:8000',
  QUALITY_SHIELD_URL: process.env.NEXT_PUBLIC_QUALITY_SHIELD_URL || 'http://localhost:8001',
  
  // Timeout settings (in milliseconds)
  TIMEOUT: {
    SHORT: 5000,      // 5 seconds for quick operations
    MEDIUM: 10000,    // 10 seconds for standard operations
    LONG: 30000,      // 30 seconds for heavy operations
    SOCKET: 15000,    // 15 seconds for socket connections
  },

  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000,      // 1 second
    MAX_DELAY: 10000,          // 10 seconds
    BACKOFF_MULTIPLIER: 2,     // Exponential backoff
  },

  // Endpoints
  ENDPOINTS: {
    // Quality Scanning
    QUALITY_SCAN: '/api/v1/trust/quality-scan',
    QUALITY_SHIELD_SCAN: '/quality-shield/scan',
    
    // Escrow
    ESCROW: '/api/v1/trust/escrow',
    
    // Aggregation
    AGGREGATION_LOTS: '/api/v1/trust/aggregation-lots',
    
    // Chat
    CHAT: '/api/chat',
    N8N_CHAT: '/api/n8n/chat',
    
    // Health Check
    HEALTH: '/health',
  },

  // Service availability cache (in milliseconds)
  CACHE_DURATION: 30000, // 30 seconds
};

/**
 * Get full URL for an endpoint
 */
export function getEndpointUrl(service: 'main' | 'quality' | 'shield', endpoint: string): string {
  const baseUrl = {
    main: API_CONFIG.BASE_URL,
    quality: API_CONFIG.QUALITY_SCAN_URL,
    shield: API_CONFIG.QUALITY_SHIELD_URL,
  }[service];

  return `${baseUrl}${endpoint}`;
}

/**
 * Service availability cache
 */
const serviceCache = new Map<string, { available: boolean; timestamp: number }>();

/**
 * Check if a service is available (with caching)
 */
export async function isServiceAvailable(service: 'main' | 'quality' | 'shield'): Promise<boolean> {
  const cacheKey = `service-${service}`;
  const cached = serviceCache.get(cacheKey);

  // Return cached result if still valid
  if (cached && Date.now() - cached.timestamp < API_CONFIG.CACHE_DURATION) {
    return cached.available;
  }

  try {
    const baseUrl = {
      main: API_CONFIG.BASE_URL,
      quality: API_CONFIG.QUALITY_SCAN_URL,
      shield: API_CONFIG.QUALITY_SHIELD_URL,
    }[service];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT.SHORT);

    const response = await fetch(`${baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      signal: controller.signal,
      method: 'GET',
    });

    clearTimeout(timeoutId);

    const available = response.ok;
    serviceCache.set(cacheKey, { available, timestamp: Date.now() });
    return available;
  } catch (error) {
    serviceCache.set(cacheKey, { available: false, timestamp: Date.now() });
    return false;
  }
}

/**
 * Clear service availability cache
 */
export function clearServiceCache(): void {
  serviceCache.clear();
}

/**
 * Get timeout for operation type
 */
export function getTimeout(type: 'short' | 'medium' | 'long' | 'socket' = 'medium'): number {
  return API_CONFIG.TIMEOUT[type.toUpperCase() as keyof typeof API_CONFIG.TIMEOUT] || API_CONFIG.TIMEOUT.MEDIUM;
}

/**
 * Calculate retry delay with exponential backoff
 */
export function getRetryDelay(attempt: number): number {
  const delay = API_CONFIG.RETRY.INITIAL_DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF_MULTIPLIER, attempt - 1);
  return Math.min(delay, API_CONFIG.RETRY.MAX_DELAY);
}
