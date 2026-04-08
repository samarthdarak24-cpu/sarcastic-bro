"use client";

import React, { Suspense, useEffect as useEffectLang, useState as useStateLang } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { buyerNav } from "@/lib/nav-config";
import { 
  TrendingUp, Package, DollarSign, ShoppingCart, 
  Sparkles, Users, 
  Target, ShoppingBag, ArrowRight, Zap, ShieldCheck
} from "lucide-react";

import BuyerCommandCenter from "@/components/dashboard/buyer/BuyerCommandCenter";
import AIIntelligenceHub from "@/components/dashboard/buyer/AIIntelligenceHub";
import SourcingProcurementHub from "@/components/dashboard/buyer/SourcingProcurementHub";
import OrdersTrackingHub from "@/components/dashboard/buyer/OrdersTrackingHub";
import PaymentsFinanceHub from "@/components/dashboard/buyer/PaymentsFinanceHub";
import TrustReputationHub from "@/components/dashboard/buyer/TrustReputationHub";
import { NegotiationHubPremium } from "@/components/dashboard/buyer/NegotiationHubPremium";
import { SecurityHubLive } from "@/components/shared/SecurityHubLive";

function BuyerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSection = searchParams.get("section") || "Overview";
  const { user } = useAuth('BUYER');
    const [, setLang] = useStateLang(i18n.language);
  useEffectLang(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => { i18n.off("languageChanged", handler); };
  }, [i18n]);

  if (!user || user.role !== "BUYER") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading buyer dashboard...</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "AI Intelligence": return <AIIntelligenceHub />;
      case "Sourcing": return <SourcingProcurementHub />;
      case "Orders": return <OrdersTrackingHub />;
      case "Payments": return <PaymentsFinanceHub />;
      case "Bidding": return <NegotiationHubPremium />;
      case "Trust": return <TrustReputationHub />;
      case "Security": return <SecurityHubLive userRole="BUYER" />;
      case "Overview":
      default: return null;
    }
  };

  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <div className="flex flex-col gap-10 min-h-full">
        {/* ✨ SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-black tracking-tight text-slate-900 mb-2 leading-tight">
                    {activeSection === "Overview" ? "Welcome back, {{name}}! 👋" : activeSection}
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-base xl:text-lg italic leading-relaxed">
                    {activeSection === "Overview" 
                        ? "Your global procurement command center." 
                        : "Executing your {{section}} protocol."}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button 
                  className="h-12 px-6 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                >
                    <Zap size={18} className="text-blue-500" />
                    {"Market Synchronization"}
                </button>
            </div>
        </div>

        {activeSection === "Overview" ? (
          <BuyerCommandCenter />
        ) : (
          <div className="flex-1 min-h-[500px] bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-2xl overflow-hidden relative group z-10">
             <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white -z-10 pointer-events-none" />
             <div className="relative z-10 w-full">
                {renderSection()}
             </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-black text-xl uppercase tracking-widest animate-pulse">
        {"Initializing Node..."}
      </div>
    }>
      <BuyerDashboardContent />
    </Suspense>
  );
}
