"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, TrendingUp, DollarSign, Shield, Package, AlertCircle, 
  CheckCircle2, Clock, Truck, FileText, Lock, BarChart3, 
  Activity, Award, Zap, Target, Navigation, Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';

export default function GlobalExportAudit() {
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedQuality, setSelectedQuality] = useState('premium');
  const [animatedValues, setAnimatedValues] = useState({
    globalRank: 0,
    profitPotential: 0,
    complianceScore: 0,
    riskScore: 0
  });

  const countUpRef = useRef<any>({});

  const mandiLiveData = [
    { mandi: 'Delhi Azadpur', crop: 'Wheat', todayPrice: 2850, yesterdayPrice: 2820, change: 1.06, volume: 1250, trend: 'up' },
    { mandi: 'Mumbai APMC', crop: 'Wheat', todayPrice: 2920, yesterdayPrice: 2900, change: 0.69, volume: 980, trend: 'up' },
    { mandi: 'Bangalore KR Market', crop: 'Wheat', todayPrice: 2880, yesterdayPrice: 2910, change: -1.03, volume: 750, trend: 'down' },
    { mandi: 'Kolkata Posta', crop: 'Wheat', todayPrice: 2800, yesterdayPrice: 2780, change: 0.72, volume: 620, trend: 'up' },
    { mandi: 'Pune Market Yard', crop: 'Wheat', todayPrice: 2900, yesterdayPrice: 2920, change: -0.68, volume: 890, trend: 'down' },
    { mandi: 'Hyderabad Gaddiannaram', crop: 'Wheat', todayPrice: 2870, yesterdayPrice: 2850, change: 0.70, volume: 540, trend: 'up' },
    { mandi: 'Chennai Koyambedu', crop: 'Wheat', todayPrice: 2950, yesterdayPrice: 2930, change: 0.68, volume: 430, trend: 'up' },
    { mandi: 'Jaipur Muhana', crop: 'Wheat', todayPrice: 2830, yesterdayPrice: 2860, change: -1.05, volume: 710, trend: 'down' },
    { mandi: 'Lucknow Alambagh', crop: 'Wheat', todayPrice: 2810, yesterdayPrice: 2800, change: 0.36, volume: 820, trend: 'up' },
    { mandi: 'Ahmedabad Jamalpur', crop: 'Wheat', todayPrice: 2890, yesterdayPrice: 2870, change: 0.70, volume: 650, trend: 'up' }
  ];

  const mandiHistoricalData = [
    { date: '1 Jan', delhi: 2650, mumbai: 2720, bangalore: 2680, kolkata: 2600 },
    { date: '5 Jan', delhi: 2680, mumbai: 2750, bangalore: 2710, kolkata: 2630 },
    { date: '10 Jan', delhi: 2720, mumbai: 2780, bangalore: 2740, kolkata: 2660 },
    { date: '15 Jan', delhi: 2750, mumbai: 2810, bangalore: 2770, kolkata: 2690 },
    { date: '20 Jan', delhi: 2780, mumbai: 2840, bangalore: 2800, kolkata: 2720 },
    { date: '25 Jan', delhi: 2810, mumbai: 2870, bangalore: 2830, kolkata: 2750 },
    { date: '30 Jan', delhi: 2850, mumbai: 2920, bangalore: 2880, kolkata: 2800 }
  ];

  const globalPriceData = [
    { country: 'India', price: 2850, priceINR: 2850, profit: 0, demand: 85, risk: 20, flag: '🇮🇳' },
    { country: 'Germany', price: 42, priceINR: 3479, profit: 22, demand: 92, risk: 45, flag: '🇩🇪' },
    { country: 'USA', price: 38, priceINR: 3154, profit: 11, demand: 88, risk: 35, flag: '🇺🇸' },
    { country: 'UAE', price: 140, priceINR: 3080, profit: 8, demand: 78, risk: 30, flag: '🇦🇪' },
    { country: 'UK', price: 35, priceINR: 3675, profit: 29, demand: 90, risk: 50, flag: '🇬🇧' },
    { country: 'Netherlands', price: 40, priceINR: 3320, profit: 16, demand: 86, risk: 40, flag: '🇳🇱' },
    { country: 'France', price: 41, priceINR: 3403, profit: 19, demand: 89, risk: 42, flag: '🇫🇷' },
    { country: 'Japan', price: 4200, priceINR: 3360, profit: 18, demand: 82, risk: 55, flag: '🇯🇵' }
  ];

  const priceHistoryData = [
    { month: 'Jul', india: 2650, germany: 3200, usa: 2950, uae: 2880 },
    { month: 'Aug', india: 2700, germany: 3280, usa: 3020, uae: 2920 },
    { month: 'Sep', india: 2750, germany: 3350, usa: 3080, uae: 2980 },
    { month: 'Oct', india: 2780, germany: 3400, usa: 3120, uae: 3020 },
    { month: 'Nov', india: 2820, germany: 3450, usa: 3150, uae: 3050 },
    { month: 'Dec', india: 2850, germany: 3479, usa: 3154, uae: 3080 }
  ];

  const demandHeatmapData = [
    { region: 'Europe', q1: 88, q2: 92, q3: 85, q4: 90 },
    { region: 'North America', q1: 82, q2: 86, q3: 88, q4: 84 },
    { region: 'Middle East', q1: 75, q2: 78, q3: 80, q4: 76 },
    { region: 'Asia Pacific', q1: 70, q2: 72, q3: 75, q4: 73 }
  ];

  const seasonalDemandData = [
    { month: 'Jan', demand: 85, prediction: 88 },
    { month: 'Feb', demand: 82, prediction: 86 },
    { month: 'Mar', demand: 78, prediction: 82 },
    { month: 'Apr', demand: 72, prediction: 75 },
    { month: 'May', demand: 68, prediction: 70 },
    { month: 'Jun', demand: 70, prediction: 73 }
  ];

  const exportCostBreakdown = [
    { category: 'Logistics', value: 12, color: '#22c55e' },
    { category: 'Documentation', value: 5, color: '#10b981' },
    { category: 'Insurance', value: 8, color: '#14b8a6' },
    { category: 'Customs', value: 10, color: '#06b6d4' },
    { category: 'Packaging', value: 7, color: '#0ea5e9' }
  ];

  const complianceChecklist = [
    { country: 'Germany', items: ['Phytosanitary Certificate', 'Origin Certificate', 'Quality Report', 'Organic Certification'], completed: 3, total: 4 },
    { country: 'USA', items: ['FDA Registration', 'Phytosanitary Certificate', 'Commercial Invoice', 'Packing List'], completed: 4, total: 4 },
    { country: 'UAE', items: ['Halal Certificate', 'Origin Certificate', 'Quality Report'], completed: 2, total: 3 }
  ];

  const blockchainCertificates = [
    { id: 'BC-2024-001', type: 'Export Certificate', country: 'Germany', status: 'Verified', hash: '0x7a8f...3d2e' },
    { id: 'BC-2024-002', type: 'Quality Certificate', country: 'USA', status: 'Verified', hash: '0x9b2c...5f1a' },
    { id: 'BC-2024-003', type: 'Origin Certificate', country: 'UAE', status: 'Pending', hash: '0x4e6d...8c9b' }
  ];

  const buyerTrustScores = [
    { buyer: 'EuroAgri GmbH', country: 'Germany', score: 94, orders: 28, flag: '🇩🇪' },
    { buyer: 'US Grain Corp', country: 'USA', score: 91, orders: 22, flag: '🇺🇸' },
    { buyer: 'Dubai Foods LLC', country: 'UAE', score: 88, orders: 15, flag: '🇦🇪' }
  ];

  const exportHistory = [
    { date: '2024-01-15', country: 'Germany', amount: '50 MT', value: '₹17.4L', status: 'Delivered' },
    { date: '2024-01-10', country: 'USA', amount: '30 MT', value: '₹9.5L', status: 'In Transit' },
    { date: '2024-01-05', country: 'UAE', amount: '25 MT', value: '₹7.7L', status: 'Delivered' }
  ];

  const shippingRoutes = [
    { route: 'Mumbai → Hamburg', days: 18, cost: '₹45k/MT', reliability: 95 },
    { route: 'Mumbai → New York', days: 22, cost: '₹52k/MT', reliability: 92 },
    { route: 'Mumbai → Dubai', days: 8, cost: '₹28k/MT', reliability: 98 }
  ];

  const policyAlerts = [
    { country: 'EU', alert: 'New organic standards effective Feb 2024', severity: 'warning', date: '2024-01-20' },
    { country: 'USA', alert: 'Tariff reduction on wheat imports', severity: 'good', date: '2024-01-18' },
    { country: 'UAE', alert: 'Increased demand for premium quality', severity: 'good', date: '2024-01-15' }
  ];

  const aiRecommendations = [
    {
      action: 'Export to Germany',
      confidence: 92,
      reason: 'Highest profit margin (22%) with strong demand',
      timeline: 'Ship within 5 days',
      expectedProfit: '₹3.8L per 50MT'
    },
    {
      action: 'Wait 3-5 days',
      confidence: 78,
      reason: 'UK prices expected to rise 5% based on seasonal trends',
      timeline: 'Monitor daily',
      expectedProfit: 'Additional ₹1.2L potential'
    },
    {
      action: 'Avoid Japan',
      confidence: 85,
      reason: 'High risk (55%) and complex documentation requirements',
      timeline: 'Current conditions',
      expectedProfit: 'Risk outweighs profit'
    }
  ];

  useEffect(() => {
    const targets = {
      globalRank: 7,
      profitPotential: 24,
      complianceScore: 92,
      riskScore: 35
    };

    Object.keys(targets).forEach(key => {
      let current = 0;
      const target = targets[key as keyof typeof targets];
      const increment = target / 60;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 16);

      countUpRef.current[key] = timer;
    });

    return () => {
      Object.values(countUpRef.current).forEach((timer: any) => clearInterval(timer));
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-morphism rounded-xl p-3 shadow-lg border border-white/20">
          <p className="text-white text-xs font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs font-semibold">
              {entry.name}: ₹{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg animate-pulse-glow-green">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                🌍 Global Export Intelligence Hub
              </h1>
              <p className="text-gray-600 font-medium mt-1">
                AI-Powered Export Decision Engine • Real-time Mandi Prices • Smart Profit Optimizer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping-slow" />
            <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">LIVE MARKET DATA</span>
          </div>
        </motion.div>

        {/* Best Market Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-farmer-premium bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-5xl">🎯</div>
              <div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">AI RECOMMENDED MARKET</div>
                <div className="text-2xl font-black text-gradient-green">🇩🇪 Germany</div>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Profit Increase</div>
                  <div className="text-xl font-black text-emerald-600">+22%</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Risk Level</div>
                  <div className="text-xl font-black text-amber-600">Medium</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Delivery Time</div>
                  <div className="text-xl font-black text-gray-900">18 Days</div>
                </div>
              </div>
            </div>
            <button className="btn-farmer-primary">
              Start Export Process →
            </button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Global Rank', value: animatedValues.globalRank, suffix: 'th', icon: Award, trend: '+2', color: 'emerald' },
            { label: 'Profit Potential', value: animatedValues.profitPotential, suffix: '%', icon: TrendingUp, trend: '+6%', color: 'blue' },
            { label: 'Compliance Score', value: animatedValues.complianceScore, suffix: '%', icon: CheckCircle2, trend: '+10%', color: 'teal' },
            { label: 'Risk Score', value: animatedValues.riskScore, suffix: '%', icon: AlertCircle, trend: '-13%', color: 'amber' }
          ].map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card-farmer-premium hover-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${kpi.color}-50 rounded-xl`}>
                  <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
                </div>
                <span className={`badge-farmer-${kpi.color === 'amber' ? 'warning' : 'success'}`}>
                  {kpi.trend}
                </span>
              </div>
              <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">{kpi.label}</div>
              <div className={`text-4xl font-black text-${kpi.color}-600 tracking-tighter`}>
                {kpi.value}{kpi.suffix}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Mandi Market Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-farmer-premium"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                📊 Live Mandi Market
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping-slow" />
              </h2>
              <p className="text-sm text-gray-600 font-medium mt-1">
                Real-time prices from major Indian mandis • Updated every 5 minutes
              </p>
            </div>
            <div className="flex gap-2">
              {['Today', 'Week', 'Month'].map((period) => (
                <button
                  key={period}
                  className={period === 'Today' ? 'btn-farmer-primary text-xs py-2 px-4' : 'btn-outline-farmer text-xs py-2 px-4'}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Mandi Table */}
          <div className="overflow-x-auto custom-scrollbar mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">MANDI</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">CROP</th>
                  <th className="text-right py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">TODAY</th>
                  <th className="text-right py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">YESTERDAY</th>
                  <th className="text-right py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">CHANGE</th>
                  <th className="text-right py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">VOLUME (MT)</th>
                  <th className="text-center py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">TREND</th>
                </tr>
              </thead>
              <tbody>
                {mandiLiveData.map((mandi, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-emerald-50/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-bold text-gray-900">{mandi.mandi}</td>
                    <td className="py-4 px-4 text-gray-600 font-medium">{mandi.crop}</td>
                    <td className="py-4 px-4 text-right font-black text-emerald-600">₹{mandi.todayPrice}</td>
                    <td className="py-4 px-4 text-right text-gray-500 font-semibold">₹{mandi.yesterdayPrice}</td>
                    <td className={`py-4 px-4 text-right font-bold ${mandi.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {mandi.change > 0 ? '+' : ''}{mandi.change}%
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">{mandi.volume}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`badge-farmer-${mandi.trend === 'up' ? 'success' : 'warning'}`}>
                        {mandi.trend === 'up' ? '↑ UP' : '↓ DOWN'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mandi Historical Chart */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4">30-Day Price Trends Across Major Mandis</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mandiHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="delhi" stroke="#22c55e" strokeWidth={3} dot={false} name="Delhi" />
                <Line type="monotone" dataKey="mumbai" stroke="#10b981" strokeWidth={3} dot={false} name="Mumbai" />
                <Line type="monotone" dataKey="bangalore" stroke="#14b8a6" strokeWidth={3} dot={false} name="Bangalore" />
                <Line type="monotone" dataKey="kolkata" stroke="#06b6d4" strokeWidth={3} dot={false} name="Kolkata" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-4">
          {[
            { label: 'All Countries', value: 'all' },
            { label: 'Germany', value: 'germany' },
            { label: 'USA', value: 'usa' },
            { label: 'UAE', value: 'uae' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedCountry(filter.value)}
              className={selectedCountry === filter.value ? 'btn-farmer-primary text-xs' : 'btn-outline-farmer text-xs'}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Global Price Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 card-farmer-premium"
          >
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              Global Price Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={globalPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="country" stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="priceINR" radius={[12, 12, 0, 0]}>
                  {globalPriceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Export vs Local Profit Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-farmer-premium"
          >
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Profit Calculator
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Local Sale (India)</div>
                <div className="text-3xl font-black text-gray-500">₹2,85,000</div>
                <div className="text-xs text-gray-500 font-semibold mt-1">per 100 MT</div>
              </div>
              <div className="h-px bg-gray-200" />
              <div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Export Sale (Germany)</div>
                <div className="text-3xl font-black text-emerald-600">₹3,47,900</div>
                <div className="text-xs text-emerald-600 font-bold mt-1">+22% profit • ₹62,900 extra</div>
              </div>
              <button className="btn-farmer-primary w-full">
                Calculate Custom Profit
              </button>
            </div>
          </motion.div>
        </div>

        {/* Continue with more sections... */}
        {/* Due to length constraints, I'll add the remaining sections in the next part */}
        
      </motion.div>
    </div>
  );
}
