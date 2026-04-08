"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { farmerNav } from "@/lib/nav-config";
import { Zap } from "lucide-react";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { financeService } from "@/services/financeService";
import { useRealtimeStore } from "@/store/realtimeStore";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
// Hub Components
import AIIntelligenceHubFarmer from "@/components/dashboard/farmer/AIIntelligenceHubFarmer";
import SupplyChainHubFarmer from "@/components/dashboard/farmer/SupplyChainHubFarmer";
import OrdersLogisticsHubFarmer from "@/components/dashboard/farmer/OrdersLogisticsHubFarmer";
import PaymentsTrustHubFarmer from "@/components/dashboard/farmer/PaymentsTrustHubFarmer";
import TenderBidsHubFarmer from "@/components/dashboard/farmer/TenderBidsHubFarmer";
import TrustReputationHubFarmer from "@/components/dashboard/farmer/TrustReputationHubFarmer";
import SecurityComplianceHubFarmer from "@/components/dashboard/farmer/SecurityComplianceHubFarmer";
import { AgriChatConnectPremium } from "@/components/shared/AgriChatConnectPremium";
import { AgriAgentWidget } from "@/components/ui/AgriAgent/AgriAgentWidget";
import FarmerCommandCenter from "@/components/dashboard/farmer/FarmerCommandCenter";

function FarmerDashboardContent() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") || "Overview";
  console.log('🎯 Active Section:', activeSection);
  const { user, loading: authLoading } = useAuth('FARMER');
  const { updateDashboardStats } = useRealtimeStore();
  const { t } = useTranslation();

  const [showAgriAgent, setShowAgriAgent] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      // Basic data loading for realtime store sync
      loadBasicData();
    }
  }, [authLoading, user]);

  const loadBasicData = async () => {
    try {
      const [productsData, ordersData, financialSummary] = await Promise.all([
        productService.getMyProducts().catch(() => ({ products: [] })),
        orderService.getMyOrders().catch(() => ({ orders: [] })),
        financeService.getFinancialSummary().catch(() => ({ totalRevenue: 142500 }))
      ]);

      const products = Array.isArray(productsData) ? productsData : (productsData.products || []);
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData.orders || []);
      const activeProducts = products.filter((p: any) => p.isActive).length;
      const deliveredOrders = orders.filter((o: any) => o.status === 'DELIVERED').length;
      const successRate = orders.length > 0 ? (deliveredOrders / orders.length) * 100 : 0;

      // Sync to realtime store
      updateDashboardStats({
        totalRevenue: financialSummary.totalRevenue || 142500,
        totalOrders: orders.length || 154,
        activeProducts: activeProducts || 24,
        successRate: successRate || 94.8,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const renderSection = () => {
    console.log('🎯 Rendering section:', activeSection);
    switch (activeSection) {
      case "AI Intelligence": return <AIIntelligenceHubFarmer />;
      case "Production": return <SupplyChainHubFarmer />;
      case "Orders": return <OrdersLogisticsHubFarmer />;
      case "Finance": return <PaymentsTrustHubFarmer />;
      case "Bidding": return <TenderBidsHubFarmer />;
      case "Trust": return <TrustReputationHubFarmer />;
      case "Security": return <SecurityComplianceHubFarmer />;
      case "Chat": return <AgriChatConnectPremium userRole="FARMER" />;
      case "Overview":
      default: return null;
    }
  };

  return (
    <DashboardLayout navItems={farmerNav} userRole="FARMER">
      <div className="flex flex-col gap-10 min-h-full">
        {/* ✨ SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-black tracking-tight text-slate-900 mb-2 leading-tight">
                    {activeSection === "Overview"
                      ? `Farmer Command Center`
                      : activeSection}
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-base xl:text-lg italic leading-relaxed">
                    {activeSection === "Overview"
                      ? "Welcome, Rajesh Kumar! Analyzing 12.4TB of Agricultural Intelligence for your farm today."
                      : `${t('common.loading')} ${activeSection.toLowerCase()}`}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={loadBasicData}
                  className="h-12 px-6 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                >
                    <Zap size={18} className="text-emerald-500" />
                    {t('common.refresh')}
                </button>
            </div>
        </div>

        {activeSection === "Overview" ? (
          <>
            <div className="bg-blue-500 text-white p-2 rounded mb-4 text-center font-bold">
              DEBUG: Rendering Overview Section - Should show FarmerCommandCenter
            </div>
            <FarmerCommandCenter />
          </>
        ) : (
          <div className="flex-1 w-full">
             {renderSection()}
          </div>
        )}
      </div>

      {/* 🤖 AgriAgent - Floating Button */}
      <button
        onClick={() => setShowAgriAgent(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50 group"
        title="Open AgriAgent - Autonomous AI Assistant"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full animate-pulse" />
      </button>

      {/* AgriAgent Widget */}
      <AgriAgentWidget
        userRole="FARMER"
        isOpen={showAgriAgent}
        onClose={() => setShowAgriAgent(false)}
      />
    </DashboardLayout>
  );
}

export default function FarmerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FarmerDashboardContent />
    </Suspense>
  );
}
