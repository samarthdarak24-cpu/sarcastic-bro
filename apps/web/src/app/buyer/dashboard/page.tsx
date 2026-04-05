"use client";

import React, { Suspense, useEffect as useEffectLang, useState as useStateLang } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { buyerNav } from "@/lib/nav-config";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { 
  TrendingUp, Package, DollarSign, ShoppingCart, 
  Sparkles, Users, 
  Target, ShoppingBag, ArrowRight, Zap, ShieldCheck, Globe
} from "lucide-react";

// Feature Components
import { SourcingSpace } from "@/components/dashboard/buyer/SourcingSpace";
import { OrderTracker } from "@/components/dashboard/buyer/OrderTracker";
import { NegotiationHub } from "@/components/dashboard/buyer/NegotiationHub";
import { NegotiationHubPremium } from "@/components/dashboard/buyer/NegotiationHubPremium";
import { PriceIntelligence } from "@/components/dashboard/buyer/PriceIntelligence";
import { SupplierInsights } from "@/components/dashboard/buyer/SupplierInsights";
import { SupplierInsightsPremium } from "@/components/dashboard/buyer/SupplierInsightsPremium";
import { TrustReviews } from "@/components/dashboard/buyer/TrustReviews";
import { ProcurementAssistant } from "@/components/dashboard/buyer/ProcurementAssistant";
import { PreBookingHub } from "@/components/dashboard/buyer/PreBookingHub";
import { TraceChain } from "@/components/dashboard/buyer/TraceChain";
import { BlockchainTraceLive } from "@/components/shared/BlockchainTraceLive";
import { BulkOrders } from "@/components/dashboard/buyer/BulkOrders";
import { RegionalClusterMap } from "@/components/dashboard/buyer/RegionalClusterMap";
import { AgriChat } from "@/components/dashboard/farmer/AgriChat";
import { AgriChatConnectPremium } from "@/components/shared/AgriChatConnectPremium";
import { BehavioralInsightsBuyer } from "@/components/dashboard/buyer/BehavioralInsightsBuyer";
import { BlockchainTraceBuyer } from "@/components/dashboard/buyer/BlockchainTraceBuyer";
import { EscrowHubBuyer } from "@/components/dashboard/buyer/EscrowHubBuyer";
import { AgriIntelligenceBuyer } from "@/components/dashboard/buyer/AgriIntelligenceBuyer";
import { SecurityHubLive } from "@/components/shared/SecurityHubLive";
import BulkDiscoveryDashboard from "@/components/dashboard/buyer/BulkDiscoveryDashboard";
import BulkTradeAdvanced from "@/components/dashboard/buyer/BulkTradeAdvanced";
import ClusterIntelligenceAdvanced from "@/components/dashboard/buyer/ClusterIntelligenceAdvanced";
import CockpitLiveComplete from "@/components/dashboard/buyer/CockpitLiveComplete";
import AIProcurementAdvancedFixed from "@/components/dashboard/buyer/AIProcurementAdvancedFixed";
import { MyReputationPremium } from "@/components/dashboard/buyer/MyReputationPremium";

function BuyerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSection = searchParams.get("section") || "Overview";
  const { user } = useAuth('BUYER');
  const { t, i18n } = useTranslation();
  const [, setLang] = useStateLang(i18n.language);
  useEffectLang(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => { i18n.off("languageChanged", handler); };
  }, [i18n]);

  if (!user || user.role !== "BUYER") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "Sourcing Space": return <SourcingSpace />;
      case "Bulk Marketplace": return <BulkDiscoveryDashboard />;
      case "Procurement": return <AIProcurementAdvancedFixed />;
      case "Reputation": return <MyReputationPremium />;
      case "Suppliers": return <SupplierInsightsPremium />;
      case "Reviews": return <TrustReviews />;
      case "Intelligence": return <PriceIntelligence />;
      case "Pre-Booking": return <PreBookingHub />;
      case "Bidding": return <NegotiationHubPremium />;
      case "Tracking": return <BlockchainTraceLive userRole="BUYER" />;
      case "Traceability": return <BlockchainTraceLive userRole="BUYER" />;
      case "Bulk Trade": return <BulkOrders />;
      case "Cluster Map": return <RegionalClusterMap />;
      case "Chat": return <AgriChatConnectPremium userRole="BUYER" />;
      case "Behavioral": return <BehavioralInsightsBuyer />;
      case "Blockchain": return <BlockchainTraceLive userRole="BUYER" />;
      case "Escrow": return <EscrowHubBuyer />;
      case "AI Insights": return <AgriIntelligenceBuyer />;
      case "Bulk Trade Desk": return <BulkTradeAdvanced />;
      case "Cluster Intelligence": return <ClusterIntelligenceAdvanced />;
      case "Cockpit Live": return <CockpitLiveComplete />;
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
                    {activeSection === "Overview" ? t('buyer_dashboard.welcome', { name: user?.fullName || 'User' }) : activeSection}
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-base xl:text-lg italic leading-relaxed">
                    {activeSection === "Overview" 
                        ? t('buyer_dashboard.overview') 
                        : t('buyer_dashboard.executing', { section: activeSection.toLowerCase() })}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button 
                  className="h-12 px-6 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                >
                    <Zap size={18} className="text-blue-500" />
                    {t('buyer_dashboard.market_sync')}
                </button>
            </div>
        </div>

        {activeSection === "Overview" ? (
          <div className="space-y-12">
            {/* 📊 KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard title={t('buyer_dashboard.total_sourcing')} value="₹12.4L" icon={<DollarSign />} trend="+15.2%" color="blue" />
              <StatCard title={t('buyer_dashboard.active_bids')} value="18" icon={<Target />} trend={t('buyer_dashboard.high_activity')} color="indigo" />
              <StatCard title={t('buyer_dashboard.verified_suppliers')} value="45" icon={<Users />} trend={t('buyer_dashboard.new_suppliers')} color="emerald" />
              <StatCard title={t('buyer_dashboard.value_saved')} value="₹1.8L" icon={<TrendingUp />} trend={t('buyer_dashboard.target_met')} color="amber" />
            </div>

            {/* 🚀 MAIN OVERVIEW GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* 📡 Neural Market Radar (Advanced SVG) */}
              <div className="lg:col-span-2 bg-slate-950 rounded-[4rem] p-12 border border-blue-500/10 shadow-2xl relative overflow-hidden group">
                 {/* Quantum Pulse Background */}
                 <div className="absolute inset-0 bg-grid-white opacity-[0.03]" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
                 
                 <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t('buyer_dashboard.neural_radar')}</h2>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">{t('buyer_dashboard.liquidity_scan')}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge className="bg-blue-600 text-white font-black text-[9px] h-7 px-4 rounded-lg uppercase tracking-widest border-none">{t('buyer_dashboard.confidence')}</Badge>
                            <Target className="text-blue-500 animate-spin-slow" size={24} />
                        </div>
                     </div>

                     <div className="flex-1 flex items-center justify-center relative min-h-[350px]">
                        {/* Recursive Radar Circles */}
                        {[...Array(3)].map((_, i) => (
                           <motion.div 
                             key={i}
                             animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                             transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "linear" }}
                             className="absolute border border-blue-500/30 rounded-full"
                             style={{ width: '200px', height: '200px' }}
                           />
                        ))}
                        
                        {/* Scanning Bar */}
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="absolute w-[300px] h-[300px] rounded-full border-t border-transparent border-l border-blue-500/20"
                        />

                        {/* Market Nodes */}
                        <div className="relative">
                            <motion.div 
                               animate={{ scale: [1, 1.2, 1] }} 
                               transition={{ repeat: Infinity, duration: 2 }}
                               className="h-6 w-6 bg-blue-600 rounded-lg shadow-glow-primary flex items-center justify-center text-white"
                            >
                               <ShoppingCart size={12} />
                            </motion.div>
                            
                            {/* Scattered Nodes */}
                            <div className="absolute -top-20 -left-32 h-3 w-3 bg-emerald-500 rounded-full animate-ping" />
                            <div className="absolute top-12 left-40 h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                            <div className="absolute -bottom-16 -right-24 h-4 w-4 bg-blue-400 rounded-full opacity-50 border border-white/20" />
                        </div>
                     </div>

                     <div className="mt-8 grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
                         {[
                            { label: "Alpha Clusters", val: "14 Nodes", color: "text-emerald-500" },
                            { label: "Price Delta", val: "-8.2%", color: "text-blue-500" },
                            { label: "Vibe Score", val: "Optimal", color: "text-indigo-400" }
                         ].map((spec, i) => (
                            <div key={i} className="text-center">
                               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{spec.label}</p>
                               <p className={`text-sm font-black italic uppercase ${spec.color}`}>{spec.val}</p>
                            </div>
                         ))}
                     </div>
                 </div>
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-8">
                  {/* Quick Actions */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                      <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-slate-400">{t('buyer_dashboard.tactical_actions')}</h2>
                      <div className="space-y-4">
                          <QuickAction label={t('buyer_dashboard.source_suppliers')} icon={<Users />} color="bg-blue-500" onClick={() => router.push('?section=Sourcing Space')} />
                          <QuickAction label={t('buyer_dashboard.bulk_procurement')} icon={<ShoppingBag />} color="bg-indigo-500" onClick={() => router.push('?section=Bulk Trade')} />
                          <QuickAction label={t('buyer_dashboard.ai_negotiator')} icon={<Sparkles />} color="bg-amber-500" onClick={() => router.push('?section=Bidding')} />
                      </div>
                  </div>

                  {/* Recent Activity Mini-Feed */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
                      <h2 className="text-xl font-black mb-6 text-slate-900 uppercase tracking-tighter">{t('buyer_dashboard.feed')}</h2>
                      <div className="space-y-6">
                        {[
                          { icon: ShoppingCart, title: t('buyer_dashboard.new_order'), desc: "Basmati Rice 1000kg - #ORD-99", color: "blue" },
                          { icon: ShieldCheck, title: t('buyer_dashboard.supplier_vetted'), desc: "Ramesh Yadav Group - Verified", color: "emerald" },
                          { icon: Package, title: t('buyer_dashboard.in_transit'), desc: "Order #ORD-99805 dispatched", color: "indigo" }
                        ].map((activity, i) => (
                              <div key={i} className="flex gap-4 group cursor-pointer">
                                  <div className={`h-10 w-10 shrink-0 rounded-xl bg-${activity.color}-50 flex items-center justify-center text-${activity.color}-600 group-hover:scale-110 transition-transform`}>
                                      <activity.icon size={18} />
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-sm font-bold text-slate-900 leading-tight">{activity.title}</p>
                                      <p className="text-xs font-medium text-slate-500 line-clamp-1">{activity.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
            </div>

            {/* Smart Buyer Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                    <Sparkles size={300} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">{t('buyer_dashboard.alpha_procure')}</h2>
                        <p className="text-blue-100 text-lg font-medium leading-relaxed">{t('buyer_dashboard.alpha_desc')}</p>
                    </div>
                    <button className="h-16 px-10 bg-white text-blue-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-glow hover:shadow-white/20">
                        {t('buyer_dashboard.analyze_clusters')}
                    </button>
                </div>
            </div>
          </div>
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

function StatCard({ title, value, icon, trend, color, loading }: any) {
  const colorMap: any = {
    emerald: 'bg-emerald-50 text-emerald-600 font-bold',
    blue: 'bg-blue-50 text-blue-600 font-bold',
    indigo: 'bg-indigo-50 text-indigo-600 font-bold',
    amber: 'bg-amber-50 text-amber-600 font-bold'
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
        <div className="flex justify-between items-start mb-6">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${colorMap[color]} group-hover:scale-110 transition-transform duration-500 shadow-sm border border-slate-100`}>
                {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {trend}
            </div>
        </div>
        <p className="text-slate-400 font-black text-[10px] md:text-[11px] uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl md:text-3xl xl:text-4xl font-black text-slate-900 tracking-tighter break-words leading-none">
            {loading ? '...' : value}
        </h3>
    </div>
  );
}

function QuickAction({ label, icon, color, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white transition-all group relative overflow-hidden"
        >
            <div className={`h-11 w-11 rounded-xl ${color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <span className="font-bold text-sm text-slate-100 group-hover:text-slate-900 transition-colors">{label}</span>
            <ArrowRight size={16} className="ml-auto text-slate-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
        </button>
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
