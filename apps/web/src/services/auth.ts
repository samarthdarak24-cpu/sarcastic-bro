import axios from 'axios';
import { mockAuthService } from './mockAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'FARMER' | 'BUYER' | 'FPO';
  phone?: string;
}

export interface AuthResponse {
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  token?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'FARMER' | 'BUYER' | 'FPO';
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔵 Login function called');
    console.log('🔵 API_URL:', API_URL);
    console.log('🔵 USE_MOCK_AUTH:', USE_MOCK_AUTH);
    console.log('🔵 Credentials:', { email: credentials.email, hasPassword: !!credentials.password });
    
    // If mock auth is explicitly enabled, use it
    if (USE_MOCK_AUTH) {
      console.log('🔧 Using mock authentication (NEXT_PUBLIC_USE_MOCK_AUTH=true)');
      return mockAuthService.login(credentials.email || credentials.phone || '', credentials.password);
    }

    try {
      const loginPayload: any = { password: credentials.password };
      
      if (credentials.phone) {
        loginPayload.phone = credentials.phone.trim();
        console.log('🚀 Attempting login with phone:', loginPayload.phone);
      } else if (credentials.email) {
        loginPayload.email = credentials.email.trim().toLowerCase();
        console.log('🚀 Attempting login with email:', loginPayload.email);
      }
      
      console.log('🚀 Attempting login to:', `${API_URL}/api/auth/login`);
      
      const response = await axios.post(`${API_URL}/api/auth/login`, loginPayload, {
        timeout: 5000 // 5 second timeout
      });
      
      console.log('📡 Raw API response:', response);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response data:', response.data);
      
      // Handle both direct response and nested data
      const data = response.data?.data || response.data;
      
      console.log('📦 Parsed data:', data);
      
      // Extract token from either tokens.accessToken or token field
      const token = data.tokens?.accessToken || data.token;
      const refreshToken = data.tokens?.refreshToken;
      
      console.log('🔑 Tokens extracted:', { hasAccessToken: !!token, hasRefreshToken: !!refreshToken });
      
      if (token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
        }
      }
      
      console.log('✅ Login successful (backend):', { user: data.user, role: data.user.role });
      
      // Return normalized response
      return {
        token,
        tokens: data.tokens,
        user: data.user
      };
    } catch (error: any) {
      // Log error in multiple ways to ensure we see it
      console.error('❌ Backend login error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
        name: error.name
      });
      
      // Also log the raw error
      console.error('Raw error:', error);
      
      // Log axios-specific error details
      if (error.isAxiosError) {
        console.error('Axios error details:', {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout
        });
      }
      
      // If it's a network error, fallback to mock auth
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
        console.log('🔄 Backend unavailable, falling back to mock authentication');
        try {
          return await mockAuthService.login(credentials.email || credentials.phone || '', credentials.password);
        } catch (mockError) {
          // If mock auth also fails, throw the original error with helpful message
          throw {
            ...error,
            message: 'Backend server is not running. Please start it with: cd apps/api && npm run dev',
            isMockFallbackError: true
          };
        }
      }
      
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // If mock auth is explicitly enabled, use it
    if (USE_MOCK_AUTH) {
      console.log('🔧 Using mock authentication (NEXT_PUBLIC_USE_MOCK_AUTH=true)');
      return mockAuthService.register(data);
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone || undefined
      }, {
        timeout: 5000 // 5 second timeout
      });
      
      // Handle both direct response and nested data
      const responseData = response.data?.data || response.data;
      
      // Extract token from either tokens.accessToken or token field
      const token = responseData.tokens?.accessToken || responseData.token;
      const refreshToken = responseData.tokens?.refreshToken;
      
      if (token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(responseData.user));
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
        }
      }
      
      console.log('✅ Registration successful (backend):', { user: responseData.user, role: responseData.user.role });
      
      // Return normalized response
      return {
        token,
        tokens: responseData.tokens,
        user: responseData.user
      };
    } catch (error: any) {
      console.error('❌ Backend registration error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        code: error.code,
        fullError: error
      });
      
      // If it's a network error, fallback to mock auth
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
        console.log('🔄 Backend unavailable, falling back to mock authentication');
        try {
          return await mockAuthService.register(data);
        } catch (mockError) {
          // If mock auth also fails, throw the original error with helpful message
          throw {
            ...error,
            message: 'Backend server is not running. Please start it with: cd apps/api && npm run dev',
            isMockFallbackError: true
          };
        }
      }
      
      throw error;
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!this.getToken();
  }
};
