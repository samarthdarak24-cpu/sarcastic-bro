'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import AIProcurementAdvancedFixed from '@/components/dashboard/buyer/AIProcurementAdvancedFixed';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';
import { Suspense } from 'react';

/**
 * AI Procurement Assistant Page
 * 
 * Provides AI-powered procurement recommendations and automation for buyers.
 * Features include:
 * - Smart product recommendations based on purchase history and market trends
 * - Demand forecasting and price optimization
 * - Automated ordering and supplier matching
 * - Quality prediction and risk analysis
 * - Budget optimization and seasonal insights
 * - Performance tracking and alert system
 * 
 * @route /buyer/dashboard/procurement
 */
export default function ProcurementPage() {
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Procurement Assistant</h1>
          <p className="text-slate-600">
            Intelligent procurement with AI-powered recommendations, demand forecasting, and automated ordering
          </p>
        </div>
        <Suspense fallback={
          <div className="flex items-center justify-center h-96">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <AIProcurementAdvancedFixed />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
