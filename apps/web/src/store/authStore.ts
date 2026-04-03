import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'FARMER' | 'BUYER' | 'ADMIN';
  token?: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  district?: string;
  state?: string;
  language?: string;
  reputationScore?: number;
  ratingAvg?: number;
  totalOrders?: number;
  successfulDeliveries?: number;
  cancellationRate?: number;
  trustLevel?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'odop-auth-storage',
    }
  )
);
