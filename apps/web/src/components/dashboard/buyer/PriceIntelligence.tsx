"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Target, 
  Calendar, 
  Search,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Sparkles,
  BarChart3,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const indexData = [
  { name: "Aug", national: 72, local: 68 },
  { name: "Sep", national: 75, local: 72 },
  { name: "Oct", national: 74, local: 78 },
  { name: "Nov", national: 82, local: 80 },
  { name: "Dec", national: 88, local: 92 },
  { name: "Jan", national: 85, local: 88 },
];

const categoryComparison = [
  { name: "Basmati", price: 85, trend: "+12%" },
  { name: "Wheat", price: 32, trend: "-2%" },
  { name: "Spices", price: 240, trend: "+5%" },
  { name: "Cotton", price: 110, trend: "+8%" },
];

export function PriceIntelligence() {
  const [selectedCrop, setSelectedCrop] = useState("Basmati Rice");
  const [forecastData, setForecastData] = useState(indexData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, [selectedCrop]);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/ai/forecast", {
        product_name: selectedCrop,
        district: "Nashik",
        months_ahead: 6,
        product_type: "GRAIN"
      });

      const data = response.data.forecast_data.map((d: any) => ({
        name: d.month_name,
        national: d.predicted_price,
        local: d.predicted_price * 0.92 // Mock local gap
      }));
      setForecastData(data);
    } catch (err) {
      console.error("Forecast Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in text-neut-900 border-neut-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-neut-100">
         <div>
            <h2 className="text-3xl font-black tracking-tight mb-1">Commodity Price Intelligence</h2>
            <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest leading-loose flex items-center gap-2">
                <Sparkles size={12} className="text-brand-secondary animate-pulse" />
                QUANTITATIVE MARKET ANALYSIS BY OPTIMA.AI
            </p>
         </div>
         <Badge tone="brand" className="h-10 px-4 rounded-xl flex items-center justify-center font-black">
            2 DIVERGENCE ALERTS ACTIVE
         </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Price Index Chart */}
         <Card className="lg:col-span-2 border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] min-h-[500px]">
             <CardHeader className="p-0 mb-10 border-b border-neut-50 pb-8 flex flex-row items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black tracking-tight mb-1">{selectedCrop} Index</h3>
                   <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest leading-loose">NATIONAL VS DIRECT SOURCED GAP ANALYSIS</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-brand-secondary" /> <span className="text-[10px] font-black text-neut-400 uppercase">DIRECT</span></div>
                      <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-neut-200" /> <span className="text-[10px] font-black text-neut-300 uppercase">MANDI AVG</span></div>
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-0 h-[320px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={forecastData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                         <linearGradient id="colorLocal" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0a84ff" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#0a84ff" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#8e8e93' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#8e8e93' }} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '1rem' }}
                      />
                      <Area type="monotone" dataKey="national" stroke="#f2f2f7" strokeWidth={2} fill="transparent" />
                      <Area type="monotone" dataKey="local" stroke="#0a84ff" strokeWidth={4} fill="url(#colorLocal)" />
                   </AreaChart>
                </ResponsiveContainer>
             </CardContent>
         </Card>

         {/* Divergence Card */}
         <Card className="border-none shadow-startup-medium bg-startup-gradient text-white overflow-hidden p-12 rounded-[3rem] relative flex flex-col justify-center">
             <div className="gradient-blur top-0 right-0 opacity-20" />
             <div className="relative z-10 text-center">
                <TrendingUp size={48} className="mx-auto mb-8 text-white/50" />
                <h4 className="text-3xl font-black tracking-tight mb-4">Direct Sourcing Opportunity</h4>
                <p className="text-white/60 text-lg font-medium mb-10">Direct sourcing rates for {selectedCrop} in Kurnool are currently <span className="text-success shadow-glow-success">₹12/kg lower</span> than national wholesale peaks.</p>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col items-center">
                   <div className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2">Estimated Saving</div>
                   <div className="text-5xl font-black text-white">₹2,400<small className="text-sm font-medium opacity-40 ml-1">/TON</small></div>
                </div>
             </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {categoryComparison.map((cat) => (
            <Card key={cat.name} className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] hover:shadow-startup-medium transition-all transform hover:-translate-y-1">
               <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-neut-50 rounded-xl flex items-center justify-center text-brand-secondary"><Globe size={24} /></div>
                  <Badge tone={cat.trend.includes('+') ? 'brand' : 'ink'} className="font-black text-[10px] rounded-lg h-6">
                      {cat.trend} MARKET
                   </Badge>
               </div>
               <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">{cat.name} Global Index</p>
               <h4 className="text-3xl font-black text-neut-900 tracking-tight">₹{cat.price}/kg</h4>
            </Card>
         ))}
      </div>
    </div>
  );
}
