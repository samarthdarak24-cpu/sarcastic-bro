import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  district?: string;
  fullName?: string;
}

export function useAuth(requiredRole?: 'FARMER' | 'BUYER') {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Only redirect if role is required and doesn't match
        if (requiredRole && parsedUser.role !== requiredRole) {
          console.warn(`User role ${parsedUser.role} doesn't match required role ${requiredRole}`);
          // Don't redirect, just log warning
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else if (requiredRole) {
      // Only redirect to login if a role is required and user is not authenticated
      // Don't redirect immediately, give components a chance to handle it
      console.log('No authentication found, but required role:', requiredRole);
    }

    setLoading(false);
  }, [requiredRole]);

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
