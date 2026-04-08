'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AgriIntelligenceBuyer } from '@/components/dashboard/buyer/AgriIntelligenceBuyer';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';

export default function AIInsightsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-6">AI Insights Dashboard</h1>
        <AgriIntelligenceBuyer />
      </div>
    </DashboardLayout>
  );
}
