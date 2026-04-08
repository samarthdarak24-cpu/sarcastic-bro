"use client";

import React, { Suspense, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { farmerNav } from "@/lib/nav-config";
import { 
  Zap, Globe, TrendingUp, TrendingDown, RefreshCw, MapPin, 
  Search, Filter, Activity, BarChart3, Database, MessageSquare, Target, ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import LiveMandiFeed from "@/components/dashboard/farmer/LiveMandiFeed";
import ExportOpportunities from "@/components/dashboard/farmer/ExportOpportunities";
import MarketIntelligenceHub from "@/components/dashboard/farmer/MarketIntelligenceHub";
import { motion, AnimatePresence } from "framer-motion";

function FarmerLiveContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'mandi' | 'global' | 'intelligence'>('mandi');
  const [activeModal, setActiveModal] = useState<'search' | 'variance' | null>(null);
  
  // Modal Interactions State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>(['Mumbai Premium Node', 'Rotterdam Port Sync', 'Dubai Export Hub']);
  
  const handleSearchExecute = () => {
    if(!searchQuery) return;
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults([
        `${searchQuery.split(' ')[0] || 'Crop'} Match in Tokyo Port`,
        `Direct Buyer: ${searchQuery} (UK route)`,
        `Surplus Node: ${searchQuery} (Lasalgaon)`
      ]);
      setIsSearching(false);
    }, 1500);
  };
  
  const [activeCrop, setActiveCrop] = useState('Wheat');
  const [processingVector, setProcessingVector] = useState<number | null>(null);
  const [successVector, setSuccessVector] = useState<number | null>(null);

  const handleActionVector = (index: number) => {
    setProcessingVector(index);
    setTimeout(() => {
       setProcessingVector(null);
       setSuccessVector(index);
    }, 2000);
  };
// Live Real-Time Dashboard Logic (Decoupled to embedded widget for performance)

  return (
    <DashboardLayout navItems={farmerNav} userRole="FARMER">
      <div className="flex flex-col gap-10 min-h-full">
        {/* ✨ LIVE COCKPIT HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/10 border border-slate-800">
                  <Zap size={36} className="animate-pulse" />
               </div>
               <div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2 leading-tight uppercase italic flex items-center gap-4">
                     Live Market Cockpit
                  </h1>
                  <div className="flex items-center gap-2 px-3 h-8 bg-emerald-50 rounded-xl border border-emerald-100 w-fit">
                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Syncing with 420+ Mandis</span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-1">
                  <button 
                     onClick={() => setActiveTab('mandi')}
                     className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'mandi' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                     Regional
                  </button>
                  <button 
                     onClick={() => setActiveTab('global')}
                     className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'global' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                     Global
                  </button>
                  <button 
                     onClick={() => setActiveTab('intelligence')}
                     className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'intelligence' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                     AI Forecast
                  </button>
               </div>
            </div>
        </div>

        {/* 📊 LIVE DATA CANVAS */}
        <div className="flex-1 w-full min-h-[700px] relative">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full"
              >
                 {activeTab === 'mandi' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-full">
                       <div className="lg:col-span-8 flex flex-col gap-8">
                          <div className="bg-slate-950 backdrop-blur-3xl rounded-[3rem] p-10 border border-slate-800 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] flex-1 flex flex-col relative overflow-hidden group">
                             <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
                             <div className="absolute top-0 right-0 p-8 text-emerald-500/10 scale-[2.5] -translate-y-1/3 translate-x-1/4">
                                <Database size={120} />
                             </div>
                             <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
                             {/* Real-time telemetry Engine decoupled to prevent massive DOM re-renders */}
                             <LiveMarketTerminalWidget />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div onClick={() => setActiveModal('search')} className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-1 hover:border-slate-700 cursor-pointer group">
                                <div className="h-16 w-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:bg-blue-500/20 transition-all border border-blue-500/20">
                                   <Search size={28} />
                                </div>
                                <div>
                                   <p className="font-black text-white text-xl uppercase tracking-tighter leading-none mb-2 italic">Mandi Search</p>
                                   <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none group-hover:text-blue-400 transition-colors">Global Sourcing Hub</p>
                                </div>
                                <div className="ml-auto text-slate-600 group-hover:text-blue-400 transition-colors"><ArrowRight size={20} /></div>
                             </div>
                             <div onClick={() => setActiveModal('variance')} className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-1 hover:border-slate-700 cursor-pointer group">
                                <div className="h-16 w-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.2)] group-hover:bg-rose-500/20 transition-all border border-rose-500/20">
                                   <Filter size={28} />
                                </div>
                                <div>
                                   <p className="font-black text-white text-xl uppercase tracking-tighter leading-none mb-2 italic">Price Variance</p>
                                   <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none group-hover:text-rose-400 transition-colors">Advanced Filtering</p>
                                </div>
                                <div className="ml-auto text-slate-600 group-hover:text-rose-400 transition-colors"><ArrowRight size={20} /></div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="lg:col-span-4 h-full">
                          <LiveMandiFeed />
                       </div>
                    </div>
                 )}
                 
                 {activeTab === 'global' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-full">
                       <div className="lg:col-span-4">
                          <ExportOpportunities />
                       </div>
                       <div className="lg:col-span-8 bg-slate-950 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-10 flex flex-col relative overflow-hidden border border-slate-800 group">
                          {/* Advanced Scanning Radar Grid Background */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
                          <div className="absolute inset-x-0 -bottom-1/2 h-full bg-gradient-to-t from-indigo-500/10 to-transparent blur-[100px]" />
                          
                          <div className="flex justify-between items-start mb-10 z-10">
                              <div>
                                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2 flex items-center gap-3">
                                    <Globe size={32} className="text-indigo-400 animate-spin-slow" />
                                    Global Network Intelligence
                                 </h3>
                                 <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">
                                    Satellite Tracking & Real-time Arbitrage AI
                                 </p>
                              </div>
                              <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl flex items-center gap-3 backdrop-blur-md">
                                 <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                 </div>
                                 <span className="text-xs font-black uppercase text-indigo-400 tracking-widest">Active Scan</span>
                              </div>
                          </div>

                          <div className="grid grid-cols-3 gap-6 mb-10 z-10">
                              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 p-4 opacity-10"><Database size={48} /></div>
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Live Processed Ports</p>
                                  <motion.p key={stats.volume} className="text-3xl font-black text-white" initial={{opacity:0.5}} animate={{opacity:1}}>{(3400 + stats.volume).toFixed(0).toLocaleString()}</motion.p>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={48} /></div>
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Buyer Signals</p>
                                  <motion.p key={stats.value} className="text-3xl font-black text-indigo-400" initial={{opacity:0.5}} animate={{opacity:1}}>{(14020 + stats.value / 10).toFixed(0).toLocaleString()}</motion.p>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={48} /></div>
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Global Match Rate</p>
                                  <motion.p key={stats.volume} className="text-3xl font-black text-emerald-400" initial={{opacity:0.5}} animate={{opacity:1}}>98.{(Math.random() * 9).toFixed(1)}%</motion.p>
                              </div>
                          </div>

                          <div className="flex-1 bg-black/40 border border-white/10 rounded-[2rem] p-6 font-mono text-xs overflow-hidden relative z-10 flex flex-col justify-end">
                              <div className="absolute top-4 left-6 flex items-center gap-2">
                                 <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Incoming Satellite Feed</span>
                              </div>
                              <div className="space-y-3">
                                 <AnimatePresence>
                                    {logs.map((log, index) => {
                                       let textColor = "text-slate-400";
                                       if (log.includes("[SYSTEM]")) textColor = "text-indigo-400/80";
                                       if (log.includes("[ANALYSIS]")) textColor = "text-purple-400";
                                       if (log.includes("[FETCH]")) textColor = "text-zinc-500";
                                       
                                       return (
                                          <motion.div 
                                             key={`${index}-${log}-global`}
                                             initial={{ opacity: 0, x: 20 }}
                                             animate={{ opacity: 1, x: 0 }}
                                             className={`${textColor} flex items-center gap-3`}
                                          >
                                             <span className="text-[10px] opacity-50">{new Date().toISOString().split('T')[1].slice(0,8)}</span>
                                             <span>{log.replace("[DATA]", "[EXPORT MATCHER]").replace("[ALERT]", "[PRICE ARBITRAGE]")}</span>
                                          </motion.div>
                                       )
                                    })}
                                 </AnimatePresence>
                              </div>
                          </div>
                          
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(99,102,241,1)]" />
                       </div>
                    </div>
                 )}
                 
                 {activeTab === 'intelligence' && (
                    <div className="h-full">
                       <MarketIntelligenceHub />
                    </div>
                 )}
              </motion.div>
           </AnimatePresence>

            {/* 🔥 ADVANCED OVERLAY MODALS */}
            <AnimatePresence>
               {activeModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                     <motion.div 
                        initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} 
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
                        onClick={() => setActiveModal(null)} 
                     />
                     
                     <motion.div 
                        initial={{opacity:0, scale:0.95, y:20}} 
                        animate={{opacity:1, scale:1, y:0}} 
                        exit={{opacity:0, scale:0.95, y:20}} 
                        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 shadow-[0_0_80px_-15px_rgba(0,0,0,1)] rounded-[2.5rem] overflow-hidden flex flex-col h-[80vh]"
                     >
                        {/* Overlay Header */}
                        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-slate-900/50">
                           <div className="flex items-center gap-4">
                              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${activeModal === 'search' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                 {activeModal === 'search' ? <Search size={28} /> : <Filter size={28} />}
                              </div>
                              <div>
                                 <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{activeModal === 'search' ? 'Global Mandi Sourcing Hub' : 'Price Variance Analytics'}</h2>
                                 <p className="text-sm font-bold text-slate-500 tracking-widest uppercase">{activeModal === 'search' ? 'Network Query & Matching System' : 'Real-time Arbitrage Signals'}</p>
                              </div>
                           </div>
                           <button onClick={() => setActiveModal(null)} className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all">
                              ✕
                           </button>
                        </div>
                        
                        {/* Modal Sandbox Body */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                           {activeModal === 'search' ? (
                              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                 <div className="relative">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                       <Search className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <input 
                                       type="text" 
                                       autoFocus
                                       value={searchQuery}
                                       onChange={(e) => setSearchQuery(e.target.value)}
                                       onKeyDown={(e) => e.key === 'Enter' && handleSearchExecute()}
                                       placeholder="Query Global Mandi Network (e.g. 'Wheat in Maharashtra', 'Export grade Tomato')" 
                                       className="w-full h-20 bg-slate-950 border border-slate-800 rounded-3xl pl-16 pr-6 text-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono shadow-inner"
                                    />
                                    <div className="absolute inset-y-0 right-4 flex items-center">
                                       <button onClick={handleSearchExecute} disabled={isSearching} className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-black uppercase text-sm tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer transition-colors">
                                          {isSearching ? 'Scanning...' : 'Execute'}
                                       </button>
                                    </div>
                                 </div>
                                 
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {isSearching ? (
                                       <div className="col-span-3 py-12 flex flex-col items-center justify-center text-blue-400 font-mono animate-pulse">
                                          <Search size={48} className="mb-4 opacity-50" />
                                          <p className="uppercase tracking-widest font-black text-xs">Deep Scanning 420+ Global Nodes...</p>
                                       </div>
                                    ) : (
                                       searchResults.map((result, i) => (
                                          <div key={`${result}-${i}`} className="bg-white/5 border border-white/5 rounded-3xl p-6 relative group overflow-hidden cursor-pointer hover:bg-white/10 transition-all hover:border-blue-500/30">
                                             <div className="absolute top-0 right-0 p-4 opacity-5"><Globe size={64} /></div>
                                             <div className="flex justify-between items-start mb-6 relative z-10">
                                                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Active Match</div>
                                                <span className="text-[10px] text-slate-500 font-mono">ID:{Math.random().toString().substring(2,6)}</span>
                                             </div>
                                             <div className="relative z-10">
                                                <p className="text-xl font-black text-white">{result}</p>
                                                <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-1">+{(Math.random() * 20 + 5).toFixed(1)}% Demand Spike</p>
                                             </div>
                                          </div>
                                       ))
                                    )}
                                 </div>
                                 
                                 <div className="h-64 w-full border border-slate-800 rounded-3xl overflow-hidden relative flex items-center justify-center bg-slate-950">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                                    <Database className="text-slate-800 h-32 w-32 animate-pulse" />
                                    <span className="absolute mt-40 font-mono text-xs text-blue-500/50 uppercase tracking-widest font-black">Satellite Network Map Render Pending...</span>
                                 </div>
                              </div>
                           ) : (
                              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                 <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                    {['Wheat', 'Rice (Basmati)', 'Tomato', 'Onion', 'Spices'].map((crop) => (
                                       <button 
                                          key={crop} 
                                          onClick={() => setActiveCrop(crop)}
                                          className={`px-6 py-3 rounded-2xl border font-black text-sm uppercase tracking-widest whitespace-nowrap transition-all ${activeCrop === crop ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]' : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'}`}
                                       >
                                          {crop}
                                       </button>
                                    ))}
                                 </div>
                                 
                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center h-64 relative overflow-hidden group hover:border-indigo-500/30 transition-all cursor-pointer">
                                       <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
                                       <TrendingUp className="text-indigo-500/50 h-20 w-20 mb-4 group-hover:scale-110 group-hover:text-indigo-400 transition-all" />
                                       <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Arbitrage Margin: {activeCrop === 'Wheat' ? '14%' : activeCrop === 'Tomato' ? '42%' : '28%'}</h3>
                                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">{activeCrop} Highest Profit Route Detected</p>
                                    </div>
                                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center h-64 relative overflow-hidden group hover:border-rose-500/30 transition-all cursor-pointer">
                                       <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />
                                       <Activity className="text-rose-500/50 h-20 w-20 mb-4 group-hover:scale-110 group-hover:text-rose-400 transition-all" />
                                       <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Volatility Alert</h3>
                                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">{activeCrop} price drops expected in {activeCrop === 'Tomato' ? '2' : '14'} hours</p>
                                    </div>
                                 </div>
                                 
                                 <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                       <h3 className="text-white font-black uppercase italic tracking-tighter">Live Arbitrage Vectors</h3>
                                       <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Active System Scan</span>
                                    </div>
                                    <div className="space-y-4">
                                       {[
                                          { src: 'Indore', dest: 'Dubai', profit: 4200 },
                                          { src: 'Maharashtra', dest: 'London', profit: 8900 },
                                          { src: 'Gujarat', dest: 'Hamburg', profit: 6400 }
                                       ].map((vector, i) => (
                                          <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                             <div className="flex items-center gap-4">
                                                <div className="text-rose-400"><TrendingUp size={24} /></div>
                                                <div>
                                                   <p className="font-bold text-white">Buy {activeCrop} in {vector.src} → Sell in {vector.dest}</p>
                                                   <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">Est. Profit: +₹{vector.profit.toLocaleString()}/qtl</p>
                                                </div>
                                             </div>
                                             <button 
                                                onClick={() => handleActionVector(i)}
                                                disabled={processingVector !== null || successVector === i}
                                                className={`px-6 py-2 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all ${
                                                   successVector === i 
                                                   ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                                                   : processingVector === i
                                                   ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] animate-pulse'
                                                   : 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.5)]'
                                                }`}
                                             >
                                                {successVector === i 
                                                   ? '✓ Route Locked' 
                                                   : processingVector === i 
                                                   ? 'Deploying...' 
                                                   : 'Action Vector'
                                                }
                                             </button>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </DashboardLayout>
  );
}

export default function FarmerLivePage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-slate-50 uppercase font-black tracking-widest animate-pulse">Initializing Cockpit...</div>}>
      <FarmerLiveContent />
    </Suspense>
  );
}

function LiveMarketTerminalWidget() {
  const [stats, setStats] = useState({ volume: 14.2, value: 1450 });
  const [logs, setLogs] = useState([
    "[SYSTEM] Connection established with Mumbai Mandi...",
    "[FETCH] Retrieving volatility index for Grains...",
    "[DATA] Wheat variety 'Premium' ⬆️ +4.2% in Indore",
  ]);

  useEffect(() => {
    // 1. Simulate Volatility in Global Traded Volumes
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        volume: Number((prev.volume + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        value: Number((prev.value + (Math.random() * 50 - 25)).toFixed(0)),
      }));
    }, 2000);

    // 2. Simulate High-Frequency Live Terminal Feed
    const mockLogs = [
      "[ALERT] High demand spike detected in Delhi North",
      "[SYNC] Cloud database updated with 14 new bids",
      "[DATA] Organic Onion premium surged +10% in Lasalgaon",
      "[SYSTEM] Global export arbitrage scan complete.",
      "[FETCH] Connecting to Rotterdam port data...",
      "[ANALYSIS] Price variance detected in Central India",
      "[ALERT] Tomato logistics warning: Route 4 delayed",
      "[DATA] Rice Karnal Mandi active bids: 402"
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, mockLogs[logIndex % mockLogs.length]];
        return newLogs.slice(-6); // Keep latest 6 logs for terminal view
      });
      logIndex++;
    }, 3500);

    return () => {
      clearInterval(statsInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
         <div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
               <Activity size={32} className="text-emerald-400" />
               Market Activity Terminal
            </h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1 text-emerald-400/80">Real-time Volume & Traded Value</p>
         </div>
         <div className="flex gap-4">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex flex-col items-center justify-center min-w-[140px] shadow-inner backdrop-blur-md">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Active Volume</p>
               <p className="font-black text-white text-2xl uppercase tracking-tighter italic"><span className="text-emerald-400 text-3xl">{stats.volume.toFixed(1)}</span>M T</p>
            </div>
            <div className="bg-emerald-950/40 p-5 rounded-3xl border border-emerald-500/20 flex flex-col items-center justify-center min-w-[140px] backdrop-blur-md">
               <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest leading-none mb-2">Traded Value</p>
               <p className="font-black text-emerald-400 text-2xl uppercase tracking-tighter italic">₹<span className="text-3xl">{stats.value.toLocaleString()}</span> Cr</p>
            </div>
         </div>
      </div>
      
      <div className="flex-1 w-full bg-black/60 rounded-[2rem] shadow-2xl flex flex-col p-6 border border-slate-800 font-mono text-xs overflow-hidden relative">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
             <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <span className="text-emerald-400 font-bold uppercase tracking-widest">Live Terminal Feed</span>
             </div>
             <span className="text-[10px] text-slate-600 tracking-widest">NODE 420-B CONNECTED</span>
          </div>
          <div className="space-y-3 text-slate-300 overflow-y-auto custom-scrollbar h-full flex flex-col justify-end">
            <AnimatePresence>
              {logs.map((log, index) => {
                let textColor = "text-slate-400";
                if (log.includes("[SYSTEM]")) textColor = "text-emerald-400/80";
                if (log.includes("[ALERT]")) textColor = "text-amber-400";
                if (log.includes("[DATA]")) textColor = "text-cyan-400";
                
                return (
                  <motion.div 
                    key={`${index}-${log}`} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 items-start"
                  >
                    <span className="text-[10px] opacity-40 whitespace-nowrap mt-0.5">{new Date().toISOString().split('T')[1].slice(0,8)}</span>
                    <span className={`${textColor} leading-tight`}>{log}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
       </div>
    </div>
  );
}
