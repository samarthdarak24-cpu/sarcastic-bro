'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SupplierInsightsPremium } from '@/components/dashboard/buyer/SupplierInsightsPremium';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'next/navigation';

export default function SupplierAnalyticsPage() {
  const { user } = useAuth('BUYER');
  const params = useParams();
  const supplierId = params.id as string;

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
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Supplier Analytics</h1>
        <p className="text-slate-600 mb-4">Supplier ID: {supplierId}</p>
        <SupplierInsightsPremium />
      </div>
    </DashboardLayout>
  );
}
