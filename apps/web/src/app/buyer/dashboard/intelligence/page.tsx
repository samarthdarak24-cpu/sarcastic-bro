'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PriceIntelligence } from '@/components/dashboard/buyer/PriceIntelligence';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';

export default function IntelligencePage() {
  const { user } = useAuth('BUYER');

  if (!user || user.role !== 'BUYER') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <PriceIntelligence />
    </DashboardLayout>
  );
}
