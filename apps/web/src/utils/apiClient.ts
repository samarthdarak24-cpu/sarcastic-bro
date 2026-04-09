/**
 * Robust API Client
 * 
 * Provides consistent error handling, timeout protection, retry logic,
 * and fallback mechanisms for all API calls.
 */

import { API_CONFIG, getTimeout, getRetryDelay, isServiceAvailable } from '@/config/apiConfig';

export interface ApiRequestOptions {
  timeout?: number;
  retries?: number;
  fallbackData?: any;
  service?: 'main' | 'quality' | 'shield';
  onRetry?: (attempt: number, error: Error) => void;
  onFallback?: (reason: string) => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isFallback?: boolean;
  fallbackReason?: string;
}

/**
 * Make a fetch request with timeout, retry, and fallback support
 */
export async function apiFetch<T = any>(
  url: string,
  options: RequestInit & ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = getTimeout("medium"),
    retries = API_CONFIG.RETRY.MAX_ATTEMPTS,
    fallbackData,
    service = 'main',
    onRetry,
    onFallback,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  // Try to make the request with retries
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Check service availability first
      const available = await isServiceAvailable(service);
      if (!available && attempt === 1) {
        console.warn(`[API] Service ${service} appears to be unavailable`);
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          success: true,
          data,
          isFallback: false,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Log retry attempt
      if (attempt < retries) {
        const delay = getRetryDelay(attempt);
        console.warn(`[API] Attempt ${attempt}/${retries} failed, retrying in ${delay}ms:`, lastError.message);
        
        if (onRetry) {
          onRetry(attempt, lastError);
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed, use fallback if available
  if (fallbackData !== undefined) {
    const reason = lastError?.message || 'Service unavailable';
    console.warn(`[API] Using fallback data:`, reason);
    
    if (onFallback) {
      onFallback(reason);
    }

    return {
      success: true,
      data: fallbackData,
      isFallback: true,
      fallbackReason: reason,
    };
  }

  // No fallback available, return error
  return {
    success: false,
    error: lastError?.message || 'Unknown error',
    isFallback: false,
  };
}

/**
 * Make a POST request with form data (for file uploads)
 */
export async function apiPostFormData<T = any>(
  url: string,
  formData: FormData,
  options: Omit<ApiRequestOptions, 'body'> = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    method: 'POST',
    body: formData,
    ...options,
  });
}

/**
 * Make a POST request with JSON data
 */
export async function apiPost<T = any>(
  url: string,
  data: any,
  options: Omit<ApiRequestOptions, 'body'> = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Make a GET request
 */
export async function apiGet<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    method: 'GET',
    ...options,
  });
}

/**
 * Make a PUT request
 */
export async function apiPut<T = any>(
  url: string,
  data: any,
  options: Omit<ApiRequestOptions, 'body'> = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Make a DELETE request
 */
export async function apiDelete<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    method: 'DELETE',
    ...options,
  });
}

/**
 * Check if response is using fallback data
 */
export function isFallbackResponse<T>(response: ApiResponse<T>): boolean {
  return response.isFallback === true;
}

/**
 * Get error message from response
 */
export function getErrorMessage<T>(response: ApiResponse<T>): string {
  if (response.isFallback) {
    return `Using fallback data: ${response.fallbackReason || 'Service unavailable'}`;
  }
  return response.error || 'Unknown error';
}
