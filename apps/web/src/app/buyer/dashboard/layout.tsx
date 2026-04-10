'use client';

import { Suspense } from 'react';
import { LiveNotificationBell } from '@/components/ui/LiveNotificationBell';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['BUYER']}>
      <Suspense fallback={
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        {children}
      </Suspense>
      
      {/* Global Components - Available on all buyer dashboard pages */}
      <LiveNotificationBell />
    </AuthGuard>
  );
}
