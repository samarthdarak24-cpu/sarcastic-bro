"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { farmerNav } from "@/lib/nav-config";
import { 
  Package, DollarSign, ShoppingBag,
  Sparkles, ArrowRight, ShieldCheck, Zap, 
  TrendingUp, Activity, BarChart3, Clock,
  MapPin, Bell, Search, Filter, Database, Link2
} from "lucide-react";
import { farmerService, FarmerActivity, FarmerMetrics } from "@/services/farmerService";
import { LiveStatCard } from "@/components/ui/LiveStatCard";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

// Command Center Components
import FarmInsights from "@/components/dashboard/farmer/FarmInsights";
import LiveMandiFeed from "@/components/dashboard/farmer/LiveMandiFeed";
import ExportOpportunities from "@/components/dashboard/farmer/ExportOpportunities";
import { AgriChatConnectPremium } from "@/components/shared/AgriChatConnectPremium";
import { AgriAgentWidget } from "@/components/ui/AgriAgent/AgriAgentWidget";

function FarmerOverviewContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth('FARMER');
  const { t } = useTranslation();
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [stats, setStats] = useState<FarmerMetrics & { loading: boolean }>({
    totalCropsValue: 0,
    activeOrders: 0,
    pendingPayments: 0,
    profitGain: 0,
    loading: true
  });

  const [recentActivity, setRecentActivity] = useState<FarmerActivity[]>([]);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 30000); // Auto-refresh metrics every 30s
      return () => clearInterval(interval);
    }
  }, [authLoading, user]);

  const loadDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      const [metrics, activity] = await Promise.all([
        farmerService.getMetrics(),
        farmerService.getRecentActivity()
      ]);
      setStats({ ...metrics, loading: false });
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <DashboardLayout navItems={farmerNav} userRole="FARMER">
      <div className="flex flex-col gap-10 min-h-full">
        {/* ✨ COMMAND CENTER HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-2 leading-tight uppercase italic flex items-center gap-4">
                    Farmer Command Center <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </h1>
                <h2 className="text-xl md:text-2xl font-black text-emerald-600 mb-2">
                    Welcome, Rajesh Kumar!
                </h2>
                <p className="text-slate-500 font-bold text-sm md:text-base xl:text-lg italic leading-relaxed">
                    Analyzing 12.4TB of Agricultural Intelligence for your farm today.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-slate-900 text-white rounded-2xl px-6 py-3 flex items-center gap-4 shadow-xl shadow-slate-900/20">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">System Health</span>
                      <span className="text-xs font-black text-emerald-400 text-right uppercase tracking-tighter italic">Optimized 100%</span>
                   </div>
                   <div className="h-10 w-1 bg-slate-800" />
                   <button 
                     onClick={loadDashboardData}
                     className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all group"
                   >
                       <Zap size={18} className="text-amber-400 group-active:scale-95 group-hover:rotate-12" />
                   </button>
                </div>
            </div>
        </div>

        {/* 📊 KPI GRID - COMMAND CENTER STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <LiveStatCard title="TOTAL CROPS VALUE" value={stats.totalCropsValue} prefix="₹" icon={<Database size={22} />} color="blue" loading={stats.loading} live />
          <LiveStatCard title="ACTIVE ORDERS" value={stats.activeOrders} icon={<ShoppingBag size={22} />} color="indigo" loading={stats.loading} live />
          <LiveStatCard title="PENDING PAYMENTS" value={stats.pendingPayments} prefix="₹" icon={<DollarSign size={22} />} color="amber" loading={stats.loading} live />
          <LiveStatCard title="MARKET PROFIT GAIN" value={stats.profitGain} suffix="%" icon={<TrendingUp size={22} />} color="emerald" loading={stats.loading} live />
        </div>

        {/* 🚀 MAIN COMMAND CENTER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Market Pulse (Live Feed) */}
          <div className="lg:col-span-4 h-[600px]">
             <LiveMandiFeed />
          </div>

          {/* MIDDLE: Farm Intelligence Hub */}
          <div className="lg:col-span-8 flex flex-col gap-12">
             {/* Performance Insights */}
             <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-slate-200/50 shadow-2xl flex flex-col min-h-[400px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all scale-150 rotate-12">
                   <Activity size={200} />
                </div>
                <div className="flex items-center justify-between w-full mb-10 relative z-10">
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Farm Yield Insights</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Prediction Engine v4.2</p>
                   </div>
                   <button onClick={() => setShowDetailModal(true)} className="h-10 px-6 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-slate-900/20">
                      Full Detail <ArrowRight size={14} />
                   </button>
                </div>
                <div className="flex-1 w-full relative z-10">
                   <FarmInsights compact />
                </div>
             </div>

             {/* Bottom Grid Components */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <ExportOpportunities />
                
                {/* Recent Intelligence Log */}
                <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-200/50 shadow-xl flex flex-col">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Intelligence Feed</h3>
                      <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                         <Bell size={16} />
                      </div>
                   </div>
                   <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">
                      {recentActivity.map((activity, i) => {
                        const Icon = activity.type === 'order' ? ShoppingBag : activity.type === 'price' ? Zap : activity.type === 'quality' ? ShieldCheck : Package;
                        const color = activity.status === 'success' ? 'emerald' : activity.status === 'warning' ? 'amber' : activity.status === 'info' ? 'blue' : 'indigo';
                        return (
                          <div key={i} className="flex gap-5 border-b border-slate-100/50 pb-6 last:border-0 group cursor-pointer">
                             <div className={`h-12 w-12 shrink-0 rounded-2xl bg-${color}-100 flex items-center justify-center text-${color}-600 shadow-lg shadow-${color}-200/50 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                <Icon size={22} />
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                   <p className="font-bold text-slate-900 text-sm md:text-base leading-tight truncate">{activity.title}</p>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                      <Clock size={10} /> {activity.time}
                                   </span>
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter leading-relaxed line-clamp-2">{activity.desc}</p>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* 🤖 GLOBAL AGRI ASSISTANT BUTTON */}
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4 scale-125">
           <div className="bg-slate-900 text-white rounded-2xl px-6 py-3 shadow-2xl animate-in slide-in-from-right duration-1000 hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 leading-none">AI Agent Ready</p>
              <p className="text-xs font-black italic tracking-tighter text-blue-300 uppercase leading-none">"How can I help your farm today?"</p>
           </div>
           <button
             className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative ring-4 ring-white"
           >
             <Link2 size={32} className="group-hover:rotate-12 transition-transform" />
             <div className="absolute inset-0 bg-white/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="absolute -top-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
                <div className="h-2 w-2 bg-white rounded-full animate-ping" />
             </div>
           </button>
        </div>
      </div>
      
      {/* AgriAgent Widget (Self-Closing) */}
      <AgriAgentWidget userRole="FARMER" isOpen={false} onClose={() => {}} />

      {/* FULL DETAIL AI PREDICITION MODAL */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={() => setShowDetailModal(false)} />
             
             <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} className="relative w-full max-w-6xl bg-slate-900 border border-slate-700 shadow-[0_0_100px_rgba(0,0,0,1)] rounded-[3rem] overflow-hidden flex flex-col h-[85vh]">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                         <Activity size={32} />
                      </div>
                      <div>
                         <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Farm Yield Insights <span className="text-emerald-400">FULL</span></h2>
                         <p className="text-sm font-bold text-slate-500 tracking-widest uppercase flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Active AI Prediction Engine v4.2 Telemetry
                         </p>
                      </div>
                   </div>
                   <button onClick={() => setShowDetailModal(false)} className="h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Deep Weather Matrix */}
                      <div className="bg-white/5 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                         <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                         <div className="flex justify-between items-center mb-8">
                            <h3 className="text-white font-black italic uppercase text-xl">Deep Weather Matrix</h3>
                            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing...</span>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            {[
                               { label: 'Ambient Temp', val: `${(Math.random() * 5 + 25).toFixed(1)}°C`, icon: '🌡️' },
                               { label: 'Wind Velocity', val: `${(Math.random() * 10 + 5).toFixed(1)} km/h`, icon: '💨' },
                               { label: 'UV Index Scan', val: `${(Math.random() * 3 + 6).toFixed(1)}/10`, icon: '☀️' },
                               { label: 'Rainfall Est', val: `${(Math.random() * 20).toFixed(0)}mm`, icon: '🌧️' }
                            ].map((stat, i) => (
                               <div key={i} className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                                  <span className="text-2xl mb-2 block">{stat.icon}</span>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                                  <p className="text-2xl font-black text-white">{stat.val}</p>
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* Soil Health Telemetry */}
                      <div className="bg-white/5 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                         <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                         <div className="flex justify-between items-center mb-8">
                            <h3 className="text-white font-black italic uppercase text-xl">Soil Diagnostics</h3>
                            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Optimal</span>
                         </div>
                         <div className="space-y-4">
                            {[
                               { label: 'Moisture Depth', val: 65, color: 'blue' },
                               { label: 'NPK Nitrogen', val: 88, color: 'purple' },
                               { label: 'pH Balance (6.8)', val: 75, color: 'emerald' },
                               { label: 'Organic Matter', val: 42, color: 'rose' }
                            ].map((bar, i) => (
                               <div key={i}>
                                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                     <span className="text-slate-400">{bar.label}</span>
                                     <span className={`text-${bar.color}-400`}>{bar.val + Math.floor(Math.random() * 10 - 5)}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                                     <motion.div initial={{width:0}} animate={{width:`${bar.val}%`}} transition={{duration:1, delay: i*0.1}} className={`h-full bg-${bar.color}-500 rounded-full`} />
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* Financial Terminal */}
                      <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-8">
                         <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-white font-black italic uppercase text-2xl">Financial Accrual Engine</h3>
                            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Active PnL</div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Projected Harvest Value</p>
                               <p className="text-4xl font-black text-white mt-2">₹{(125000 + Math.random()*5000).toLocaleString('en-IN', {maximumFractionDigits:0})}</p>
                               <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mt-2">+12% vs LY</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Live Irrigation Cost</p>
                               <p className="text-4xl font-black text-white mt-2">₹{(2400 + Math.random()*100).toLocaleString('en-IN', {maximumFractionDigits:0})}</p>
                               <p className="text-rose-400 text-xs font-black uppercase tracking-widest mt-2">-5% Efficiency</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.15)] flex flex-col justify-center">
                               <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest">AI Auto-Hedging</p>
                               <p className="text-xl font-black text-white mt-2 italic">Active Protection</p>
                               <button className="mt-4 bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest py-2 rounded-lg w-full">View Smart Contract</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default function FarmerOverviewPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white font-black text-2xl uppercase tracking-[0.5em] italic">
        <div className="h-20 w-20 border-8 border-indigo-500 border-t-white rounded-full animate-spin mb-8 shadow-2xl shadow-indigo-500/50" />
        Synchronizing...
      </div>
    }>
      <FarmerOverviewContent />
    </Suspense>
  );
}
