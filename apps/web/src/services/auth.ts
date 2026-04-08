import axios from 'axios';
import { mockAuthService } from './mockAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'FARMER' | 'BUYER';
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
    role: 'FARMER' | 'BUYER';
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // If mock auth is explicitly enabled, use it
    if (USE_MOCK_AUTH) {
      console.log('🔧 Using mock authentication (NEXT_PUBLIC_USE_MOCK_AUTH=true)');
      return mockAuthService.login(credentials.email, credentials.password);
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      }, {
        timeout: 5000 // 5 second timeout
      });
      
      // Handle both direct response and nested data
      const data = response.data?.data || response.data;
      
      // Extract token from either tokens.accessToken or token field
      const token = data.tokens?.accessToken || data.token;
      const refreshToken = data.tokens?.refreshToken;
      
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
      console.error('❌ Backend login error:', error.response?.data || error.message);
      
      // If it's a network error, fallback to mock auth
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
        console.log('🔄 Backend unavailable, falling back to mock authentication');
        try {
          return await mockAuthService.login(credentials.email, credentials.password);
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
      const response = await axios.post(`${API_URL}/auth/register`, {
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
      console.error('❌ Backend registration error:', error.response?.data || error.message);
      
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
