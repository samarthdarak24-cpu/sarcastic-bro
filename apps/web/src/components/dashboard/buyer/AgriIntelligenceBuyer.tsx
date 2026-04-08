"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Target, Zap, BarChart3, Sparkles, Activity } from "lucide-react";
import { fadeIn, slideUp, staggerContainer, staggerItem } from "@/lib/animations";
import { buyerAnalyticsService } from "@/services/buyerAnalyticsService";
import toast from "react-hot-toast";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import "@/styles/buyer-dashboard.css";

export function AgriIntelligenceBuyer() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const { insights: data } = await buyerAnalyticsService.getInsights(token);
      setInsights(data || []);
    } catch (error) {
      console.error('Failed to load insights:', error);
      toast.error('Failed to load intelligence data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Market Signals", value: insights.filter(i => i.type === 'MARKET').length.toString(), icon: Target, color: "blue", bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { label: "Price Alerts", value: insights.filter(i => i.type === 'PRICE').length.toString(), icon: TrendingUp, color: "emerald", bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
    { label: "AI Predictions", value: "96%", icon: Brain, color: "indigo", bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
    { label: "Insights", value: insights.length.toString(), icon: Sparkles, color: "amber", bgColor: "bg-amber-50", textColor: "text-amber-600" },
  ];

  const displayInsights = insights.slice(0, 3).map(insight => ({
    icon: insight.type === 'PRICE' ? Zap : insight.type === 'SUPPLY' ? TrendingUp : Target,
    title: insight.title || 'Market Insight',
    desc: insight.description || 'AI-generated market intelligence',
    color: insight.type === 'PRICE' ? 'amber' : insight.type === 'SUPPLY' ? 'emerald' : 'blue'
  }));

  const defaultInsights = [
    { icon: Zap, title: "Price Drop Alert", desc: "Wheat prices expected to drop 8% in next 48 hours", color: "amber" },
    { icon: TrendingUp, title: "Supply Surge", desc: "New harvest from Punjab region increasing supply by 15%", color: "emerald" },
    { icon: Target, title: "Optimal Buy Signal", desc: "AI recommends bulk rice purchase within 3-5 days", color: "blue" },
  ];

  const insightsToShow = displayInsights.length > 0 ? displayInsights : defaultInsights;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={slideUp}>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Agri-Intelligence</h1>
        <p className="text-slate-500 font-medium text-lg">AI-powered market intelligence & predictions</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={staggerItem}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="card-premium hover-lift"
              >
                <div className={`h-14 w-14 ${stat.bgColor} rounded-2xl flex items-center justify-center ${stat.textColor} mb-4 shadow-sm`}>
                  <stat.icon size={28} strokeWidth={2.5} />
                </div>
                <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-grid-white opacity-5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                >
                  <Brain size={32} />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-black mb-1 tracking-tight">AI Market Analysis</h2>
                  <p className="text-indigo-100 font-medium">Real-time intelligence feed</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {insightsToShow.map((insight, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="glass-effect rounded-2xl p-5 hover:bg-white/20 transition-all cursor-pointer group/item"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 bg-${insight.color}-400/20 rounded-xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform`}>
                        <insight.icon size={24} className={`text-${insight.color}-300`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-lg mb-1">{insight.title}</p>
                        <p className="text-indigo-100 text-sm leading-relaxed">{insight.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card-premium hover-lift"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900">Price Trends</h3>
                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <BarChart3 size={20} />
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex flex-col items-center justify-center border border-blue-100">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BarChart3 size={64} className="text-blue-300 mb-4" />
                </motion.div>
                <p className="text-slate-500 font-bold text-sm">Live Price Analytics</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card-premium hover-lift"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900">Supply Forecast</h3>
                <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Activity size={20} />
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex flex-col items-center justify-center border border-emerald-100">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp size={64} className="text-emerald-300 mb-4" />
                </motion.div>
                <p className="text-slate-500 font-bold text-sm">Predictive Supply Model</p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
