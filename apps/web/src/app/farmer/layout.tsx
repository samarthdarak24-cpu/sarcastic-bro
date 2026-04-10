'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['FARMER']}>
      {children}
    </AuthGuard>
  );
}
