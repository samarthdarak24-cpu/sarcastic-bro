"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, PieChart, BarChart3, Globe, Layers, ArrowUpRight, 
  Target, Sparkles, Filter, Calendar, Activity, Zap, Box,
  ArrowRight, ShieldCheck, Database, Cpu, TrendingDown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

const FORECAST_DATA = [
  { week: "W1", demand: 60, projected: 62 },
  { week: "W2", demand: 65, projected: 68 },
  { week: "W3", demand: 72, projected: 75 },
  { week: "W4", demand: 85, projected: 92 },
  { week: "W5", demand: 98, projected: 110 },
  { week: "W6", demand: 110, projected: 125 },
  { week: "W7", demand: 120, projected: 140 },
  { week: "W8", demand: 140, projected: 160 },
];

export function BuyerDemandForecast() {
  return (
    <div className="space-y-16 animate-fade-in w-full pb-20">
      {/* 🚀 Predictive Intelligence Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-neut-100 max-w-[1800px] mx-auto px-6">
          <div>
              <div className="flex items-center gap-4 mb-2">
                 <h2 className="text-4xl font-black tracking-tighter">Demand Prediction</h2>
                 <Badge tone="brand" className="h-8 px-4 rounded-xl flex items-center justify-center font-black gap-2 shadow-sm uppercase text-[9px] tracking-[0.2em] border-none">
                    <Target size={14} className="text-brand-secondary animate-pulse" />
                    NEURAL ENGINE v2.0
                 </Badge>
              </div>
              <p className="text-sm font-bold text-neut-400 uppercase tracking-widest leading-loose">Anticipatory procurement via historical nodes and market sentiment.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="h-12 px-6 rounded-2xl font-black border-neut-200">
                  <Calendar size={18} className="mr-2" />
                  Q3 FORECAST
              </Button>
              <Button variant="gradient" className="h-12 px-10 rounded-2xl font-black shadow-glow-secondary btn-glow uppercase tracking-tight">
                  SYNC INVENTORY
              </Button>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 max-w-[1800px] mx-auto px-6">
        {/* 📊 Main Predictive Analysis Deck */}
        <Card className="xl:col-span-2 border-none shadow-2xl bg-white p-12 rounded-[4.5rem] relative overflow-hidden flex flex-col min-h-[600px] group transition-all duration-700 hover:shadow-brand-secondary/10">
          <div className="absolute top-0 right-0 p-12 -z-10 group-hover:scale-110 transition-transform duration-700 opacity-20"><TrendingUp size={300} className="text-neut-50" /></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16 relative z-10">
              <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neut-300">Projected Inbound Volume</span>
                  <div className="flex items-baseline gap-4">
                      <h3 className="text-7xl font-black text-neut-900 tracking-tighter leading-none">1,840</h3>
                      <span className="text-2xl font-black text-neut-300 tracking-tighter">TONS</span>
                  </div>
                  <div className="flex items-center gap-2 text-success font-black text-[10px] uppercase tracking-widest bg-success/5 px-4 py-2 rounded-xl border border-success/10 w-fit">
                      <TrendingUp size={14} /> 
                      +4.2% OPTIMIZATION PROJECTED
                  </div>
              </div>
              <div className="max-w-[300px] p-6 bg-neut-50 rounded-[2rem] border border-neut-100 flex items-start gap-4 italic font-bold text-xs text-neut-500 leading-relaxed shadow-inner">
                  <Sparkles size={20} className="text-brand-secondary shrink-0" />
                  "Seasonal spike in Basmati demand is expected in 3 weeks. Procurement nodes should be locked at L3 stage to ensure supply security."
              </div>
          </div>

          <div className="flex-1 h-full min-h-[400px] relative z-10">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={FORECAST_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                      <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                   <XAxis 
                      dataKey="week" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#8e8e93', dy: 20 }} 
                   />
                   <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#8e8e93', dx: -20 }} 
                   />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '1.5rem', color: '#fff' }}
                      itemStyle={{ fontStyle: 'bold', fontSize: '14px', color: '#fff' }}
                      cursor={{ stroke: '#0ea5e9', strokeWidth: 2 }}
                   />
                   <Area 
                      type="monotone" 
                      dataKey="demand" 
                      stroke="#0ea5e9" 
                      strokeWidth={6} 
                      fillOpacity={1} 
                      fill="url(#colorDemand)" 
                      animationDuration={2000}
                   />
                   <Area 
                      type="monotone" 
                      dataKey="projected" 
                      stroke="#22c55e" 
                      strokeDasharray="10 10"
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorProjected)" 
                   />
                </AreaChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-8 flex justify-between text-[9px] font-black uppercase tracking-[0.4em] text-neut-400 decoration-neut-100 underline decoration-2 underline-offset-8 relative z-10 transition-colors group-hover:text-neut-900">
             <span>L1_QUARTERLY_START</span>
             <span className="text-brand-secondary">PEAK_PROVISION_POINT</span>
          </div>
        </Card>

        {/* ⚙️ Inventory Strategy Side */}
        <div className="space-y-12">
           <Card className="border-none shadow-2xl bg-neut-950 text-white p-12 rounded-[4rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 -z-10 group-hover:scale-110 transition-transform duration-700 -rotate-12">
                 <Database size={240} className="text-brand-secondary" />
              </div>
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                 <div className="h-16 w-16 bg-white/10 rounded-[1.25rem] flex items-center justify-center text-brand-secondary shadow-2xl transition-all group-hover:rotate-12">
                    <Box size={32} />
                 </div>
                 <Badge tone="brand" className="h-6 px-3 bg-brand-secondary text-white border-none text-[8px] font-black tracking-widest uppercase">Safety Locked</Badge>
              </div>

              <div className="space-y-10 relative z-10">
                 <h3 className="text-2xl font-black tracking-tighter leading-tight uppercase">Buffered Integrity</h3>
                 <div className="space-y-8">
                    {[ 
                      { label: "Safety Stock Buffer", val: 82, color: "bg-brand-secondary" },
                      { label: "Optimal Reorder Point", val: 65, color: "bg-brand-primary" }
                    ].map((m) => (
                      <div key={m.label} className="space-y-3">
                         <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/40">
                            <span>{m.label}</span>
                            <span className="text-white">{m.val}%</span>
                         </div>
                         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                               initial={{ width: 0 }}
                               animate={{ width: `${m.val}%` }}
                               transition={{ duration: 1.5, ease: "circOut" }}
                               className={`h-full rounded-full ${m.color} shadow-glow-secondary`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>
                 <Button className="w-full h-16 bg-white text-neut-900 hover:bg-neut-50 font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl">
                    ADJUST REORDER MATRICES
                    <ArrowRight size={20} />
                 </Button>
              </div>
           </Card>

           <Card className="border-none shadow-2xl bg-white p-10 rounded-[4rem] flex flex-col justify-between group overflow-hidden relative text-neut-900 transition-all duration-700 hover:shadow-brand-secondary/10">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity"><Target size={140} className="text-brand-secondary" /></div>
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-neut-50 rounded-xl flex items-center justify-center text-brand-secondary shadow-inner"><Cpu size={24} /></div>
                    <span className="text-[9px] font-black text-brand-secondary uppercase tracking-[0.4em]">Accuracy Rating</span>
                 </div>
                 <h4 className="text-4xl font-black tracking-tighter leading-none text-neut-900">94.2% <span className="text-sm font-black text-neut-300 tracking-widest uppercase">Confidence</span></h4>
                 <div className="pt-4 flex items-center gap-3 text-[10px] font-black text-neut-400 uppercase tracking-widest border-t border-neut-50">
                    <ShieldCheck size={14} className="text-success" />
                    Validated by Historical Flow
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
