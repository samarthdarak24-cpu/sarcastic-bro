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

      console.log('🔐 AuthGuard check:', { 
        hasToken: !!token, 
        user, 
        userRole: user?.role,
        allowedRoles,
        timestamp: new Date().toISOString()
      });

      if (!token || !user) {
        console.log('❌ No token or user, redirecting to login');
        router.push('/login');
        return;
      }

      console.log('🔍 Checking if role is allowed:', {
        userRole: user.role,
        allowedRoles,
        isIncluded: allowedRoles.includes(user.role)
      });

      if (!allowedRoles.includes(user.role)) {
        console.log('❌ User role not allowed:', user.role, 'Allowed:', allowedRoles);
        // Redirect to correct dashboard based on role
        if (user.role === 'FARMER') {
          console.log('↪️ Redirecting to farmer dashboard');
          router.push('/farmer/dashboard');
        } else if (user.role === 'BUYER') {
          console.log('↪️ Redirecting to buyer dashboard');
          router.push('/buyer/dashboard');
        } else if (user.role === 'FPO') {
          console.log('↪️ Redirecting to FPO dashboard');
          router.push('/fpo/dashboard');
        } else {
          console.log('↪️ Unknown role, redirecting to login');
          router.push('/login');
        }
        return;
      }

      console.log('✅ User authorized for this page');
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
