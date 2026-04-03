"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown,
  LayoutGrid,
  BarChart3,
  Calendar,
  Filter,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Zap,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { analyticsService, FarmInsightsData } from "@/services/analyticsService";
import toast from "react-hot-toast";

const CHART_COLORS = ["#0a84ff", "#ff9f0a", "#32d74b", "#bf5af2", "#ff375f"];

export function FarmInsights() {
  const [timeRange, setTimeRange] = useState("30d"); // 7d, 30d, 90d, 1y
  const [insights, setInsights] = useState<FarmInsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [timeRange]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const resp = await analyticsService.getFarmerInsights(timeRange);
      setInsights(resp);
    } catch (err) {
      toast.error("Failed to load Farm Insights data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !insights) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center text-center">
        <Zap size={48} className="text-brand-primary animate-pulse mb-6" />
        <h3 className="text-2xl font-black text-neut-900 tracking-tight">Syncing Market Intelligence...</h3>
      </div>
    );
  }

  // Inject beautiful demo data if account is empty (0 orders)
  const isDemo = insights.summary.totalOrders === 0;
  
  const displayInsights = isDemo ? {
    summary: { totalRevenue: 142500, totalOrders: 154, period: timeRange },
    chartTimeSeries: [
      { date: "Mon", revenue: 4200, orders: 12 },
      { date: "Tue", revenue: 5100, orders: 15 },
      { date: "Wed", revenue: 4800, orders: 14 },
      { date: "Thu", revenue: 6100, orders: 22 },
      { date: "Fri", revenue: 5800, orders: 18 },
      { date: "Sat", revenue: 7200, orders: 25 },
      { date: "Sun", revenue: 8500, orders: 32 }
    ],
    topProducts: [
      { name: "Basmati Rice", quantity: 450, revenue: 45000 },
      { name: "Turmeric", quantity: 250, revenue: 25000 },
      { name: "Walnuts", quantity: 200, revenue: 20000 },
      { name: "Garlic", quantity: 100, revenue: 10000 }
    ],
    priceComparison: [
      { productId: "d1", name: "Basmati Rice", category: "Grains", farmerPrice: 85, marketAverage: 78, premium: 8.9 },
      { productId: "d2", name: "Turmeric", category: "Spices", farmerPrice: 120, marketAverage: 125, premium: -4.0 },
      { productId: "d3", name: "Walnuts", category: "Nuts", farmerPrice: 450, marketAverage: 410, premium: 9.7 }
    ]
  } : insights;

  // Pre-process for Pie Chart
  const pieData = displayInsights.topProducts.map((p, i) => ({
    name: p.name,
    value: p.revenue,
    color: CHART_COLORS[i % CHART_COLORS.length]
  }));

  // Average Premium/Deficit Calculation
  const avgPremium = displayInsights.priceComparison.length ? 
    (displayInsights.priceComparison.reduce((acc, curr) => acc + curr.premium, 0) / displayInsights.priceComparison.length) : 0;

  return (
    <div className="space-y-10 animate-fade-in text-neut-900 border-neut-200">
      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value={`₹${(displayInsights.summary.totalRevenue || 0).toLocaleString()}`} icon={<DollarSign />} isPositive />
        <KPICard title="Total Orders" value={displayInsights.summary.totalOrders.toString()} icon={<ShoppingBag />} isPositive />
        <KPICard title="Premium vs Market" value={`${avgPremium > 0 ? '+' : ''}${avgPremium.toFixed(1)}%`} icon={avgPremium > 0 ? <TrendingUp /> : <TrendingDown />} isPositive={avgPremium > 0} />
        <KPICard title="Yield Stability" value={isDemo ? "94%" : "100%"} change={isDemo ? "+4.1%" : "+0.0%"} icon={<Target />} isPositive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2 rounded-[2.5rem] border-transparent shadow-startup-soft overflow-hidden">
          <CardHeader className="p-10 pb-0 border-b border-neut-100 bg-white/50 backdrop-blur-xl shrink-0 flex-row items-center justify-between">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                <div>
                   <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-1">
                      Revenue Velocity {isDemo && <Badge tone="amber" className="h-6 text-[10px] ml-2 bg-brand-primary">DEMO DATA</Badge>}
                   </h2>
                   <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest leading-loose">DAILY TRANSACTION VOLUME & MARKET SETTLEMENTS</p>
                </div>
                <div className="flex items-center gap-2 p-1 bg-neut-100 rounded-2xl">
                   {[
                     { label: 'W', val: '7d' }, 
                     { label: 'M', val: '30d' }, 
                     { label: 'Y', val: '1y' }
                   ].map((r) => (
                      <button 
                        key={r.label}
                        onClick={() => setTimeRange(r.val)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xs transition-all ${
                           timeRange === r.val
                           ? "bg-white text-neut-900 shadow-startup-soft" : "text-neut-400 hover:text-neut-600"
                        }`}
                      >
                         {r.label}
                      </button>
                   ))}
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-10 pt-12 h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayInsights.chartTimeSeries} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                   <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0a84ff" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0a84ff" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                   <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#8e8e93' }} 
                   />
                   <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#8e8e93' }} 
                   />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '1rem' }}
                      itemStyle={{ fontStyle: 'bold', fontSize: '12px' }}
                   />
                   <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0a84ff" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                      animationDuration={1500}
                   />
                </AreaChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products Distribution */}
        <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl flex flex-col min-h-[500px]">
           <CardHeader className="p-10 border-b border-neut-50">
              <h3 className="text-xl font-black tracking-tight">Category Yield</h3>
           </CardHeader>
           <CardContent className="flex-1 p-10 flex flex-col justify-between">
              <div className="h-64 mb-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                       >
                          {pieData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                 {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-bold text-neut-700">{item.name}</span>
                       </div>
                       <span className="text-sm font-black text-neut-900">₹{item.value.toLocaleString()}</span>
                    </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Comparison Widget */}
      <Card className="border-none shadow-startup-medium bg-startup-gradient text-white overflow-hidden p-12 relative flex flex-col md:flex-row items-center gap-12 justify-between">
          <div className="gradient-blur top-0 left-0 opacity-20" />
          <div className="relative z-10 max-w-lg">
             <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8"><Layers size={32} /></div>
             <h2 className="text-4xl font-black tracking-tight leading-tight mb-4">Benchmark Against National Mandis</h2>
             <p className="text-white/60 text-lg font-medium">See how your listed price compares to national indices in real-time. Optimize for maximum profitability.</p>
          </div>
          <div className="relative z-10 w-full md:w-auto">
             <div className="flex overflow-x-auto gap-6 pb-2 no-scrollbar">
                {displayInsights.priceComparison.slice(0, 3).map((comp, idx) => (
                    <div key={idx} className="flex gap-6 shrink-0">
                        <PriceComparisonCard label={`${comp.name} (Your Price)`} value={`₹${comp.farmerPrice}`} color="text-white" />
                        <PriceComparisonCard label={`${comp.name} (Mandi Avg)`} value={`₹${comp.marketAverage}`} color={comp.premium > 0 ? "text-success" : "text-warning"} detail={comp.premium !== 0 ? `${comp.premium > 0 ? '+' : ''}${comp.premium.toFixed(1)}%` : ""} />
                    </div>
                ))}
                {displayInsights.priceComparison.length === 0 && (
                    <div className="text-white/60 font-black tracking-widest text-sm uppercase">Add active products to view market comparisons.</div>
                )}
             </div>
          </div>
      </Card>
    </div>
  );
}

function KPICard({ title, value, change, icon, isPositive }: any) {
  return (
    <Card className="border-none shadow-startup-soft bg-white group hover:shadow-startup-medium transition-all transform hover:-translate-y-1">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="h-14 w-14 bg-neut-50 rounded-2xl flex items-center justify-center text-neut-300 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-startup-soft">
            {icon}
          </div>
          <Badge tone={isPositive ? 'brand' : 'ink'} className="font-black text-[10px] rounded-lg h-6">
             {change}
          </Badge>
        </div>
        <p className="text-neut-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-4xl font-black text-neut-900 tracking-tight">{value}</h3>
      </CardContent>
    </Card>
  );
}

function PriceComparisonCard({ label, value, color, detail }: any) {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] min-w-[180px] flex flex-col items-center">
            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2">{label}</p>
            <h4 className={`text-4xl font-black mb-2 ${color}`}>{value}</h4>
            {detail && <p className="text-[9px] font-black text-success tracking-widest">{detail}</p>}
        </div>
    );
}
