'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: ('FARMER' | 'BUYER' | 'FPO')[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const user = authService.getUser();

      console.log('🔐 AuthGuard check:', { hasToken: !!token, user, allowedRoles });

      if (!token || !user) {
        console.log('❌ No token or user, redirecting to login');
        router.push('/login');
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        console.log('❌ User role not allowed:', user.role, 'Allowed:', allowedRoles);
        // Redirect to correct dashboard based on role
        if (user.role === 'FARMER') {
          router.push('/farmer/dashboard');
        } else if (user.role === 'BUYER') {
          router.push('/buyer/dashboard');
        } else if (user.role === 'FPO') {
          router.push('/fpo/dashboard');
        } else {
          router.push('/login');
        }
        return;
      }

      console.log('✅ User authorized');
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
