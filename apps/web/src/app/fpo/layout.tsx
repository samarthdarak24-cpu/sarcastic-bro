'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function FPOLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['FPO']}>
      {children}
    </AuthGuard>
  );
}
