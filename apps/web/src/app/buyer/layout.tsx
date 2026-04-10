'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['BUYER']}>
      {children}
    </AuthGuard>
  );
}
