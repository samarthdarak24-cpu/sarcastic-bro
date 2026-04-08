"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { buyerNav } from "@/lib/nav-config";
import { Zap, Activity } from "lucide-react";

// Import all 10 subfeature components
import LiveMarketFeed from "@/components/dashboard/buyer/live/LiveMarketFeed";
import KPIAnalytics from "@/components/dashboard/buyer/live/KPIAnalytics";
import NeuralMarketRadar from "@/components/dashboard/buyer/live/NeuralMarketRadar";
import TacticalActions from "@/components/dashboard/buyer/live/TacticalActions";
import OrderActivityFeed from "@/components/dashboard/buyer/live/OrderActivityFeed";
import SupplierAlerts from "@/components/dashboard/buyer/live/SupplierAlerts";
import AIProcurementInsights from "@/components/dashboard/buyer/live/AIProcurementInsights";
import ClusterAnalysis from "@/components/dashboard/buyer/live/ClusterAnalysis";
import ProfitTracker from "@/components/dashboard/buyer/live/ProfitTracker";
import SmartNotifications from "@/components/dashboard/buyer/live/SmartNotifications";

function LiveCockpitContent() {
  const searchParams = useSearchParams();
  const subfeature = searchParams.get("sub") || "market-feed";
  const { user } = useAuth('BUYER');
    const [lastSync, setLastSync] = useState(new Date());

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!user || user.role !== "BUYER") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading live cockpit...</p>
        </div>
      </div>
    );
  }

  const renderSubfeature = () => {
    switch (subfeature) {
      case "market-feed": return <LiveMarketFeed />;
      case "kpi-analytics": return <KPIAnalytics />;
      case "neural-radar": return <NeuralMarketRadar />;
      case "tactical-actions": return <TacticalActions />;
      case "order-feed": return <OrderActivityFeed />;
      case "supplier-alerts": return <SupplierAlerts />;
      case "ai-insights": return <AIProcurementInsights />;
      case "cluster-analysis": return <ClusterAnalysis />;
      case "profit-tracker": return <ProfitTracker />;
      case "notifications": return <SmartNotifications />;
      default: return <LiveMarketFeed />;
    }
  };

  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <div className="flex flex-col gap-6 min-h-full">
        {/* Live Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                🔴 Live Cockpit
              </h1>
              <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-red-600">LIVE</span>
              </div>
            </div>
            <p className="text-slate-500 font-medium">
              Real-time command center · Last sync: {lastSync.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
              <Activity size={18} />
              Auto-Refresh: ON
            </button>
          </div>
        </div>

        {/* Subfeature Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "market-feed", label: "Live Market Feed", icon: "📊" },
            { id: "kpi-analytics", label: "KPI Analytics", icon: "📈" },
            { id: "neural-radar", label: "Neural Radar", icon: "🎯" },
            { id: "tactical-actions", label: "Tactical Actions", icon: "⚡" },
            { id: "order-feed", label: "Order Feed", icon: "📦" },
            { id: "supplier-alerts", label: "Supplier Alerts", icon: "🔔" },
            { id: "ai-insights", label: "AI Insights", icon: "🤖" },
            { id: "cluster-analysis", label: "Cluster Analysis", icon: "🗺️" },
            { id: "profit-tracker", label: "Profit Tracker", icon: "💰" },
            { id: "notifications", label: "Notifications", icon: "📬" }
          ].map((item) => (
            <a
              key={item.id}
              href={`/buyer/live?sub=${item.id}`}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                subfeature === item.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {item.icon} {item.label}
            </a>
          ))}
        </div>

        {/* Subfeature Content */}
        <div className="flex-1 min-h-[600px] bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-2xl">
          {renderSubfeature()}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function LiveCockpitPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Initializing Live Cockpit...</p>
        </div>
      </div>
    }>
      <LiveCockpitContent />
    </Suspense>
  );
}
