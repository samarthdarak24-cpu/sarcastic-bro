// Compatibility layer for old auth store
// This provides the same interface as before but uses the new auth service

import { authService } from '@/services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
  district?: string;
  state?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Create a simple store that wraps the auth service
export const useAuthStore = () => {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  return {
    user,
    isAuthenticated,
    setUser: (newUser: User | null) => {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('user');
      }
    },
    logout: () => {
      authService.logout();
    }
  };
};
