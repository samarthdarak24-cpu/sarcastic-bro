'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BulkOrders } from '@/components/dashboard/buyer/BulkOrders';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';

export default function BulkTradePage() {
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
      <div className="p-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Bulk Trade System</h1>
        <BulkOrders />
      </div>
    </DashboardLayout>
  );
}
