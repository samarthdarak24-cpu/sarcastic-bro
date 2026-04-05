import axios from 'axios';
import { mockAuthService } from './mockAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

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
    try {
      // Use mock service if enabled or if backend is not available
      if (USE_MOCK) {
        return await mockAuthService.login(credentials.email, credentials.password);
      }

      const response = await axios.post(`${API_URL}/auth/login`, {
        identifier: credentials.email,
        email: credentials.email,
        password: credentials.password
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
      
      console.log('✅ Login successful:', { user: data.user, role: data.user.role });
      
      // Return normalized response
      return {
        token,
        tokens: data.tokens,
        user: data.user
      };
    } catch (error: any) {
      // Fallback to mock service if backend fails
      const isNetworkError = error.code === 'ERR_NETWORK' || 
                            error.code === 'ECONNREFUSED' || 
                            error.message?.includes('Network Error') ||
                            !error.response;
      
      if (!USE_MOCK && isNetworkError) {
        console.warn('⚠️ Backend unavailable, using mock authentication');
        console.warn('💡 To use real database: Start backend with "start-backend.bat"');
        return await mockAuthService.login(credentials.email, credentials.password);
      }
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Use mock service if enabled or if backend is not available
      if (USE_MOCK) {
        return await mockAuthService.register(data);
      }

      const response = await axios.post(`${API_URL}/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone || undefined
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
      
      console.log('✅ Registration successful:', { user: responseData.user, role: responseData.user.role });
      
      // Return normalized response
      return {
        token,
        tokens: responseData.tokens,
        user: responseData.user
      };
    } catch (error: any) {
      // Fallback to mock service if backend fails
      const isNetworkError = error.code === 'ERR_NETWORK' || 
                            error.code === 'ECONNREFUSED' || 
                            error.message?.includes('Network Error') ||
                            !error.response;
      
      if (!USE_MOCK && isNetworkError) {
        console.warn('⚠️ Backend unavailable, using mock authentication');
        console.warn('💡 To use real database: Start backend with "start-backend.bat"');
        return await mockAuthService.register(data);
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
