import axios from 'axios';
import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401s and other errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method
      });
      
      const networkError: any = new Error('Network error. Please check your internet connection.');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }
    
    if (error.response?.status === 401) {
      authService.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Better error messages
    let message = 'Something went wrong';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    
    // Only log errors for non-notification endpoints to avoid console spam
    const url = error.config?.url || '';
    if (!url.includes('/notifications')) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: message,
        data: error.response?.data
      });
    }
    
    // Preserve the full error response for validation errors
    const enrichedError: any = new Error(message);
    enrichedError.response = error.response;
    enrichedError.status = error.response?.status;
    return Promise.reject(enrichedError);
  }
);

export default api;
