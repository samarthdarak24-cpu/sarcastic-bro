'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export function useAuth(requiredRole?: 'FARMER' | 'BUYER') {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      const currentUser = authService.getUser();

      console.log('useAuth check:', { isAuthenticated, currentUser, requiredRole });

      if (!isAuthenticated || !currentUser) {
        console.log('Not authenticated, redirecting to login');
        setLoading(false);
        window.location.href = '/login';
        return;
      }

      if (requiredRole && currentUser?.role !== requiredRole) {
        console.log('Role mismatch:', { currentRole: currentUser?.role, requiredRole });
        setLoading(false);
        // Redirect to correct dashboard
        if (currentUser?.role === 'FARMER') {
          window.location.href = '/farmer/dashboard';
        } else if (currentUser?.role === 'BUYER') {
          window.location.href = '/buyer/dashboard';
        } else {
          window.location.href = '/login';
        }
        return;
      }

      console.log('Auth check passed, setting user');
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  const logout = () => {
    authService.logout();
    router.push('/login');
  };

  return { user, loading, logout };
}
