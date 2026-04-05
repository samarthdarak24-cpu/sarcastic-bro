"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target } from "lucide-react";

export function PriceIntelligence() {
  const priceData = [
    { product: "Wheat", current: "₹42/kg", change: -5.2, trend: "down", forecast: "Stable" },
    { product: "Rice", current: "₹38/kg", change: 3.1, trend: "up", forecast: "Rising" },
    { product: "Pulses", current: "₹85/kg", change: -2.8, trend: "down", forecast: "Declining" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Price Intelligence</h1>
        <p className="text-slate-500 font-medium">Real-time market analytics</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {priceData.map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-slate-900">{item.product}</h3>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.trend === "up" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                {item.trend === "up" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 mb-2">{item.current}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-sm font-bold ${item.trend === "up" ? "text-red-600" : "text-emerald-600"}`}>
                {item.change > 0 ? "+" : ""}{item.change}%
              </span>
              <span className="text-sm text-slate-500 font-medium">vs last week</span>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">Forecast</p>
              <p className="text-sm font-bold text-slate-900">{item.forecast}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-black mb-4">Market Insights</h2>
        <p className="text-blue-100 font-medium mb-6">AI-powered predictions suggest optimal buying window in next 3-5 days for wheat procurement.</p>
        <button className="h-12 px-8 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all">
          View Full Analysis
        </button>
      </motion.div>
    </div>
  );
}
