"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, RadialBarChart, RadialBar, Legend, Cell, LineChart, Line,
  PieChart, Pie, Sector
} from 'recharts';
import { 
  Zap, TrendingUp, AlertCircle, ShoppingCart, Info, Search, 
  ShieldCheck, Activity, Cpu, Brain, Layers, Bell, Settings, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter, Save, 
  RefreshCw, MousePointer2, Target, Box, Clock, Globe,
  CheckCircle2, XCircle, BarChart3, Fingerprint, Database, 
  Maximize2, Minimize2, Share2, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/* --- STYLES & GLASSMORPHISM --- */
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
};

const primaryGradient = 'linear-gradient(135deg, #22c55e, #10b981)';

/* --- ANIMATION KEYFRAMES --- */
const globalCSS = `
  @keyframes pulse-ring {
    0% { transform: scale(0.33); }
    80%, 100% { opacity: 0; }
  }
  @keyframes pulse-dot {
    0% { transform: scale(0.8); }
    50% { transform: scale(1); }
    100% { transform: scale(0.8); }
  }
  .pulsing-dot {
    position: relative;
    width: 10px;
    height: 10px;
  }
  .pulsing-dot::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 30px; height: 30px;
    background-color: #22c55e;
    border-radius: 50%;
    animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  }
  .pulsing-dot::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 10px; height: 10px;
    background-color: #22c55e;
    border-radius: 50%;
    animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
  }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.01); }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
`;

/* --- CORE COMPONENTS --- */

/**
 * KPI Stat Card with Animated Counter & Trend
 */
const KPICard = ({ title, value, prefix = "", suffix = "", trend, trendType = "up", icon: Icon, data }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    let totalMiliseconds = 1500;
    let incrementTime = (totalMiliseconds / end) * 5;
    let timer = setInterval(() => {
      start += 5;
      setCurrentValue(start);
      if (start >= end) {
        setCurrentValue(end);
        clearInterval(timer);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      whileHover={{ translateY: -4, borderColor: 'rgba(34, 197, 94, 0.4)' }}
      style={glassStyle}
      className="p-5 rounded-2xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <Icon size={20} className="text-[#22c55e]" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trendType === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}%
        </div>
      </div>
      <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-white tracking-tighter">
          {prefix}{currentValue.toLocaleString()}{suffix}
        </h3>
        <div className="flex-1 h-8 opacity-40">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data}>
                <Area type="monotone" dataKey="val" stroke="#22c55e" fill="rgba(34, 197, 94, 0.2)" strokeWidth={2} />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Intelligent Action Item Component
 */
const ActionItem = ({ severity, title, desc, time, actionLabel, onAction }) => {
  const getSeverityStyle = () => {
    switch (severity) {
      case 'critical': return { color: 'text-red-400', border: 'border-red-400/20', bg: 'bg-red-400/10' };
      case 'warning': return { color: 'text-amber-400', border: 'border-amber-400/20', bg: 'bg-amber-400/10' };
      default: return { color: 'text-green-400', border: 'border-green-400/20', bg: 'bg-green-400/10' };
    }
  };
  const style = getSeverityStyle();

  return (
    <div className={`p-4 rounded-xl border ${style.border} ${style.bg} flex items-center justify-between gap-4 group transition-all hover:bg-opacity-20`}>
      <div className="flex gap-4 items-center">
        <div className={`p-2 rounded-lg ${style.bg} ${style.color}`}>
          {severity === 'critical' ? <AlertCircle size={20} /> : severity === 'warning' ? <Info size={20} /> : <CheckCircle2 size={20} />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <p className="text-xs text-[#94a3b8] mt-0.5 line-clamp-1">{desc}</p>
          <span className="text-[10px] text-white/30 uppercase mt-1 inline-block">{time}</span>
        </div>
      </div>
      {actionLabel && (
        <button 
          onClick={onAction}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${style.bg} ${style.color} hover:bg-[#fff] hover:text-[#000] active:scale-95`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/* --- FEATURE MODULES --- */

export default function SmartProductHubLive() {
  const { t } = useTranslation();
  
  // 1. STATE MANAGEMENT FOR LIVE UPDATES
  const [showModal, setShowModal] = useState(false);
  const [liveData, setLiveData] = useState(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${8 + i}:00`,
      price: 450 + Math.random() * 50,
      demand: 300 + Math.random() * 400,
      confidence: 85 + Math.random() * 10
    }));
  });

  const [alerts, setAlerts] = useState([
    { id: 1, severity: 'critical', title: 'Temperature Drift', desc: 'Silo 4 storage cooling variance detected (+1.2°C)', time: '2m ago' },
    { id: 2, severity: 'warning', title: 'Inventory Alert', desc: 'Premium Basmati SKU below safety threshold (12%)', time: '15m ago' },
    { id: 3, severity: 'good', title: 'Market Match', desc: 'AI found 3 high-intent buyers for your Tomato surplus.', time: '1h ago' },
  ]);

  const [automationRules, setAutomationRules] = useState([
    { id: 'price', label: 'Dynamic Price Adaptation', active: true, desc: 'Auto-adjust price based on localized node demand.' },
    { id: 'inventory', label: 'Smart Reserve Management', active: false, desc: 'Freeze inventory for certified high-value buyers.' },
    { id: 'logistics', label: 'Adaptive Fleet Routing', active: true, desc: 'Redirect shipments based on real-time traffic/fuel peaks.' },
  ]);

  const [history, setHistory] = useState([
    { id: 1, type: 'rule', event: 'Price Protection Active', desc: 'Floor price locked at ₹42.5/kg for 24h.', time: '2m ago' },
    { id: 2, type: 'sync', event: 'Global Hub Sync', desc: 'Inventory data propagate to Zone-8 complete.', time: '12m ago' },
    { id: 3, type: 'trade', event: 'Order Finalized', desc: 'Batch #A94 sold to Buyer ID: 0294.', time: '45m ago' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [riskFactor, setRiskFactor] = useState(12);

  // 2. LIVE SIMULATION EFFECT
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        next.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: last.price + (Math.random() * 10 - 5),
          demand: last.demand + (Math.random() * 20 - 10),
          confidence: Math.min(100, Math.max(70, last.confidence + (Math.random() * 4 - 2)))
        });
        return next;
      });
      setRiskFactor(prev => Math.min(100, Math.max(5, prev + (Math.random() * 2 - 1))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 3. HANDLERS
  const toggleRule = (id) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    setHistory(prev => [{
      id: Date.now(),
      type: 'rule',
      event: `Rule ${automationRules.find(r => r.id === id).active ? 'Deactivated' : 'Activated'}`,
      desc: `Policy: ${automationRules.find(r => r.id === id).label}`,
      time: 'Just now'
    }, ...prev.slice(0, 4)]);
  };

  const executeStrategy = () => {
    const win = window.confirm("Execute AI-driven re-allocation for Delhi Hub?");
    if (win) {
      setHistory(prev => [{
        id: Date.now(),
        type: 'trade',
        event: 'Allocated to Delhi Hub',
        desc: '600kg Tomato Batch #TR-94 Moved to Group Buy.',
        time: 'Just now'
      }, ...prev.slice(0, 4)]);
    }
  };

  const filteredAlerts = alerts.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen custom-scrollbar" 
      style={{ background: '#0f1117', color: '#fff', padding: '24px' }}
    >
      <style>{globalCSS}</style>

      {/* --- MODAL SYSTEM --- */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#000]/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#1a1d24] rounded-[2.5rem] border border-white/10 p-10 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22c55e] to-transparent" />
              <div className="flex justify-between items-start mb-8">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-[#22c55e]/10 rounded-2xl text-[#22c55e]">
                      <Brain size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Deep-Neural Analytics Report</h3>
                       <p className="text-xs text-[#94a3b8] font-medium uppercase tracking-widest mt-1 italic">Reference ID: HUB-9482-XCA</p>
                    </div>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                    <XCircle size={24} className="text-[#94a3b8]" />
                 </button>
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-[10px] font-black text-[#94a3b8] uppercase mb-2">Confidence Level</p>
                       <p className="text-xl font-black text-[#22c55e]">98.24%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-[10px] font-black text-[#94a3b8] uppercase mb-2">Impact Projection</p>
                       <p className="text-xl font-black text-blue-400">+₹142.5k / Mo</p>
                    </div>
                 </div>

                 <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                       <Cpu size={16} className="text-[#22c55e]" />
                       Core Reasoning
                    </h4>
                    <p className="text-xs text-[#94a3b8] leading-relaxed italic">
                      "Market mesh analysis indicates a localized supply shortage in N-Delhi clusters. By re-allocating Tier-1 inventory from surplus Silo 4, we minimize storage overhead while capturing a 14% price premium. This move is protected by the 'Dynamic Arbitrage' policy."
                    </p>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button className="flex-1 py-4 bg-[#22c55e] text-[#0f1117] rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                       Approve Tactical Shift
                    </button>
                    <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                       Export PDF
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="pulsing-dot" />
            <span className="text-[#22c55e] text-xs font-black uppercase tracking-widest bg-[#22c55e]/10 px-2 py-1 rounded-md">Live Platform Status</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Smart Product Hub <span className="text-[#22c55e]">3.0</span></h1>
          <p className="text-[#94a3b8] text-sm font-medium italic opacity-80">Hyper-autonomous production & inventory mesh-intelligence.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
            <input 
              type="text" 
              placeholder="Search assets, telemetry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] transition-all"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl relative group">
            <Bell size={20} className="group-hover:text-[#22c55e] transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f1117]" />
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#22c55e] to-[#10b981] rounded-2xl font-black text-sm text-[#0f1117] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Zap size={18} fill="currentColor" />
            Deploy Edge Node
          </button>
        </div>
      </header>

      {/* --- TOP: KPI MESH --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Mesh Value" value={142950} prefix="₹" trend={12.5} icon={TrendingUp} data={Array.from({length: 10}, () => ({val: Math.random() * 100}))} />
        <KPICard title="Network Load" value={884} trend={4.2} icon={Activity} data={Array.from({length: 10}, () => ({val: Math.random() * 100}))} />
        <KPICard title="Trust Vector" value={98} suffix="%" trend={1.5} icon={ShieldCheck} data={Array.from({length: 10}, () => ({val: Math.random() * 100}))} />
        <KPICard title="Active Satellites" value={12} trend={25} icon={Globe} data={Array.from({length: 10}, () => ({val: Math.random() * 100}))} />
      </section>

      {/* --- MIDDLE: MAIN INTELLIGENCE GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* SUB-FEATURE 2 & 3: ANALYTICS HUB */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-8 rounded-[2rem] overflow-hidden"
          style={glassStyle}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#22c55e]/10 rounded-2xl">
                <Target size={24} className="text-[#22c55e]" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Supply-Demand Vector Analysis</h3>
                <p className="text-xs text-[#94a3b8]">Live predictive modeling for Tier-1 production centers.</p>
              </div>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {['Hour', 'Day', 'Week', 'AI Max'].map(t => (
                <button key={t} className="px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-white/10 transition-all">
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1d24', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#22c55e" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={1000}
                />
                <Area 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorDemand)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* SIDEBAR: AI COGNITIVE CORE */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SUB-FEATURE 1: COGNITIVE INSIGHTS */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={glassStyle}
            className="p-6 rounded-[2rem]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain size={20} className="text-[#22c55e]" />
              <h3 className="text-lg font-black uppercase tracking-widest">Cognitive Core</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Market Arbitrage', val: 'Detecting 14% delta in Punjab region. Recommend shipping Batch #04.', confidence: 98, color: 'text-green-400' },
                { title: 'Climate Risk', val: 'Humidity spike predicted for Zone-4. Activate drying systems.', confidence: 92, color: 'text-amber-400' },
                { title: 'Price Peak', val: 'Next 4h expected to yield max profitability for Basmati.', confidence: 89, color: 'text-blue-400' },
              ].map((insight, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">{insight.title}</span>
                    <span className={`text-[10px] font-black ${insight.color}`}>{insight.confidence}% MATCH</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">{insight.val}</p>
                </div>
              ))}
              <button 
                onClick={() => setShowModal(true)}
                className="w-full py-3 rounded-xl border border-dashed border-white/20 text-[#94a3b8] text-xs font-black uppercase tracking-widest hover:border-[#22c55e] hover:text-[#22c55e] transition-all"
              >
                Generate Advanced Report
              </button>
            </div>
          </motion.div>

          {/* SUB-FEATURE 10: RISK SCORING */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={glassStyle}
            className="p-6 rounded-[2rem] bg-gradient-to-br from-white/[0.02] to-transparent"
          >
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                 <ShieldCheck size={20} className="text-[#22c55e]" />
                 Risk Mesh
               </h3>
               <span className="text-xs font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg">LIVE</span>
            </div>
            
            <div className="relative flex justify-center py-4">
               <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="120%" barSize={10} data={[
                      { name: 'Risk', value: riskFactor, fill: riskFactor > 70 ? '#f43f5e' : '#22c55e' }
                    ]}>
                      <RadialBar 
                        minAngle={15} 
                        clockWise={true} 
                        dataKey="value" 
                        cornerRadius={10} 
                        background={{ fill: 'rgba(255,255,255,0.05)' }} 
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-2">
                     <p className="text-sm font-black uppercase tracking-tighter text-[#94a3b8]">Security</p>
                     <p className="text-3xl font-black text-white">{(100 - riskFactor).toFixed(1)}%</p>
                  </div>
               </div>
            </div>
            <p className="text-[10px] text-center text-[#94a3b8] font-medium leading-relaxed mt-2">
              Network stability is <span className="text-green-400 font-bold">EXCELLENT</span>. No rogue triggers detected.
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- BOTTOM: 10 SUB-FEATURE PANELS --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* SUB-FEATURE 4: SMART ALERTS MESH */}
        <div style={glassStyle} className="p-8 rounded-[2rem] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <Bell className="text-red-400" size={20} />
               <span className="text-sm font-black uppercase tracking-widest">Active Alerts</span>
             </div>
             <span className="text-[10px] font-black bg-red-400/20 text-red-400 px-2.5 py-1 rounded-full uppercase italic">Hot</span>
          </div>
          <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[300px] pr-2">
            <AnimatePresence>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map(alert => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                  >
                    <ActionItem {...alert} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 opacity-40 italic text-xs">No matching alerts...</div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SUB-FEATURE 5: BEHAVIORAL PROFILE */}
        <div style={glassStyle} className="p-8 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-8">
            <Layers className="text-blue-400" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest">Farmer Pulse Profile</h3>
          </div>
          
          <div className="flex justify-between items-end gap-2 mb-8 px-4 h-32">
            {[
              { label: 'Decision Speed', val: 85, color: '#22c55e' },
              { label: 'Risk Appetite', val: 32, color: '#3b82f6' },
              { label: 'Node Activity', val: 74, color: '#a855f7' },
              { label: 'Trading IQ', val: 94, color: '#f59e0b' }
            ].map(b => (
              <div key={b.label} className="w-full relative group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${b.val}%` }}
                  className="w-full rounded-t-lg bg-opacity-40 hover:bg-opacity-80 transition-all cursor-crosshair pb-2"
                  style={{ backgroundColor: b.color }}
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase opacity-60 whitespace-nowrap">{b.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
             <p className="text-[10px] text-white font-bold leading-normal italic">
               Cluster Analysis: <span className="text-[#22c55e]">Ultra-Efficient Merchant</span>. Next tier unlock in 4.2k Trade Volume.
             </p>
          </div>
        </div>

        {/* SUB-FEATURE 6: HYPER-RECOMMENDATION ENGINE */}
        <div style={glassStyle} className="p-8 rounded-[2rem] flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="text-[#22c55e] animate-spin-slow" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest">Propellant IQ</h3>
          </div>

          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/10">
               <Fingerprint size={48} className="mx-auto mb-4 text-[#22c55e] opacity-80" />
               <p className="text-xs font-bold text-[#94a3b8] mb-1 uppercase tracking-tighter">Market Re-Allocation</p>
               <h4 className="text-sm font-black text-white">Execute Delhi Hub Surplus?</h4>
               <p className="text-[10px] text-white/40 mt-2 leading-relaxed">System projects a 24% ROI increase by shifting 420kg inventory to Delhi node clusters.</p>
            </div>
            
            <button 
              onClick={executeStrategy}
              className="w-full py-4 bg-white text-[#0f1117] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#22c55e] hover:text-white transition-all shadow-xl active:scale-95"
            >
              Trigger Execution
            </button>
          </div>
        </div>

        {/* SUB-FEATURE 7: NEURAL TIMELINE (LOGS) */}
        <div style={glassStyle} className="p-8 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-purple-400" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest">Neural History</h3>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {history.map(log => (
              <div key={log.id} className="relative pl-6 border-l-2 border-white/10 group">
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-[#0f1117]" />
                <span className="text-[9px] font-black uppercase text-white/30">{log.time}</span>
                <h5 className="text-[11px] font-black text-white leading-tight group-hover:text-blue-400 transition-colors uppercase italic">{log.event}</h5>
                <p className="text-[10px] text-[#94a3b8] leading-normal">{log.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL: LOGIC & VECTORS (SUB-FEATURE 8 & 9) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* SUB-FEATURE 9: AUTOMATION DESIGNER */}
        <div style={glassStyle} className="p-8 rounded-[3rem]">
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                  <Settings size={22} className="animate-pulse" />
                </div>
                <h3 className="text-xl font-black italic tracking-tighter uppercase">Automation Logic Flow</h3>
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-[#22c55e] transition-all">
               <Save size={14} /> Commit Changes
             </button>
          </div>

          <div className="space-y-4">
            {automationRules.map(rule => (
              <div key={rule.id} className={`p-5 rounded-3xl border transition-all cursor-pointer ${rule.active ? 'bg-white/[0.03] border-white/10' : 'bg-transparent border-transparent opacity-40'}`}>
                <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${rule.active ? 'bg-[#22c55e] shadow-[0_0_10px_#22c55e]' : 'bg-white/20'}`} />
                      <span className="text-md font-bold text-white tracking-tight">{rule.label}</span>
                   </div>
                   <div 
                    onClick={(e) => { e.stopPropagation(); toggleRule(rule.id); }}
                    className={`w-12 h-6 rounded-full relative p-1 transition-all ${rule.active ? 'bg-[#22c55e]' : 'bg-white/10'}`}
                   >
                     <div className={`h-4 w-4 rounded-full bg-white transition-all transform ${rule.active ? 'translate-x-6' : 'translate-x-0'}`} />
                   </div>
                </div>
                <p className="text-xs text-[#94a3b8] font-medium leading-relaxed pl-6">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SUB-FEATURE 8: DYNAMIC SYSTEM HEALTH (FILTERS) */}
        <div style={glassStyle} className="p-8 rounded-[3rem] bg-gradient-to-tr from-white/[0.01] to-transparent">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                <Database size={22} className="text-[#22c55e]" />
                Sensor Mesh Health
              </h3>
              <Filter size={20} className="text-[#94a3b8] hover:text-white cursor-pointer" />
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
             {[
               { icon: Activity, label: 'STABILITY', val: '99.9%', color: 'text-green-400' },
               { icon: Zap, label: 'THROUGHPUT', val: '1.2GB/s', color: 'text-blue-400' },
               { icon: Cpu, label: 'LATENCY', val: '14ms', color: 'text-[#22c55e]' },
               { icon: Database, label: 'MESH UPTIME', val: '100%', color: 'text-purple-400' },
               { icon: Box, label: 'LOAD BAL', val: 'Active', color: 'text-amber-400' },
               { icon: MoreHorizontal, label: 'NODES', val: '4.2k', color: 'text-[#94a3b8]' }
             ].map((m, i) => (
               <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                  <m.icon size={20} className={`mb-3 ${m.color} group-hover:scale-125 transition-transform`} />
                  <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">{m.label}</span>
                  <p className="text-md font-bold text-white mt-1 uppercase italic">{m.val}</p>
               </div>
             ))}
           </div>

           <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
              {['Infrastructure', 'Production', 'Supply Map', 'Node-8', 'Cluster Mesh'].map(tag => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[#94a3b8] cursor-pointer hover:bg-[#22c55e] hover:text-white transition-all uppercase">
                  #{tag}
                </span>
              ))}
           </div>
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <footer className="mt-12 py-16 px-12 rounded-[3.5rem] text-center relative overflow-hidden" 
        style={{ ...glassStyle, background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(34,197,94,0.08) 100%)' }}
      >
        <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-gradient-radial from-[#22c55e]/10 to-transparent blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-4xl font-black text-white tracking-tighter mb-6 uppercase italic">Propel Production to Global Levels</h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto text-base font-medium leading-relaxed mb-10">
            Harness the power of decentralized AI to optimize your harvest, secure Tier-1 contracts, and automate your entire global supply chain mesh.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-12 py-4 bg-white text-[#0f1117] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#22c55e] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Launch Global Mesh
            </button>
            <button className="px-12 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Mesh Specs (v3.0)
            </button>
          </div>
        </motion.div>
      </footer>
    </motion.div>
  );
}
