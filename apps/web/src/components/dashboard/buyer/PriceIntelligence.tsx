"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Calendar, AlertCircle, Target, Activity, Sun, Droplets } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Generate mock historical data for the past 12 months
const generateHistoricalData = (basePrice: number, volatility: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, idx) => ({
    month,
    price: basePrice + (Math.random() - 0.5) * volatility,
    forecast: idx >= 9 ? basePrice + (Math.random() - 0.3) * volatility : null,
    confidenceHigh: idx >= 9 ? basePrice + (Math.random() + 0.2) * volatility : null,
    confidenceLow: idx >= 9 ? basePrice - (Math.random() + 0.2) * volatility : null,
  }));
};

export function PriceIntelligence() {
  const [selectedProduct, setSelectedProduct] = useState("Wheat");

  const priceData = [
    { 
      product: "Wheat", 
      current: "₹42/kg", 
      currentValue: 42,
      change: -5.2, 
      trend: "down", 
      forecast: "Stable",
      historicalData: generateHistoricalData(42, 8),
      seasonalPattern: "Peak: Nov-Jan, Low: Apr-Jun",
      supplyDemand: "Balanced",
      optimalWindow: "Next 2-3 weeks"
    },
    { 
      product: "Rice", 
      current: "₹38/kg", 
      currentValue: 38,
      change: 3.1, 
      trend: "up", 
      forecast: "Rising",
      historicalData: generateHistoricalData(38, 6),
      seasonalPattern: "Peak: Jul-Sep, Low: Jan-Mar",
      supplyDemand: "High Demand",
      optimalWindow: "Wait 4-6 weeks"
    },
    { 
      product: "Pulses", 
      current: "₹85/kg", 
      currentValue: 85,
      change: -2.8, 
      trend: "down", 
      forecast: "Declining",
      historicalData: generateHistoricalData(85, 12),
      seasonalPattern: "Peak: Mar-May, Low: Oct-Dec",
      supplyDemand: "Oversupply",
      optimalWindow: "Immediate purchase"
    },
  ];

  const selectedData = priceData.find(p => p.product === selectedProduct) || priceData[0];

  return (
    <div className="p-6 space-y-6">
      {/* Removed large header to save space */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Compact header removed */}
      </motion.div>

      {/* Price Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {priceData.map((item, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }} 
            className={`bg-white rounded-3xl p-6 border-2 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
              selectedProduct === item.product ? 'border-blue-500' : 'border-slate-200'
            }`}
            onClick={() => setSelectedProduct(item.product)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-slate-900">{item.product}</h3>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                item.trend === "up" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
              }`}>
                {item.trend === "up" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 mb-2">{item.current}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-sm font-bold ${
                item.trend === "up" ? "text-red-600" : "text-emerald-600"
              }`}>
                {item.change > 0 ? "+" : ""}{item.change}%
              </span>
              <span className="text-sm text-slate-500 font-medium">vs last week</span>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">3-Month Forecast</p>
              <p className="text-sm font-bold text-slate-900">{item.forecast}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Historical Price Trends Chart */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              {selectedProduct} Price Trends
            </h2>
            <p className="text-sm text-slate-500">12-month historical data with 3-month forecast</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <span className="text-slate-600">Actual</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-slate-600">Forecast</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={selectedData.historicalData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#colorPrice)" 
              name="Actual Price (₹/kg)"
            />
            <Area 
              type="monotone" 
              dataKey="forecast" 
              stroke="#10b981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              fill="url(#colorForecast)" 
              name="Forecast (₹/kg)"
            />
            <Area 
              type="monotone" 
              dataKey="confidenceHigh" 
              stroke="#94a3b8" 
              strokeWidth={1}
              fill="none"
              strokeDasharray="2 2"
              name="Upper Confidence"
            />
            <Area 
              type="monotone" 
              dataKey="confidenceLow" 
              stroke="#94a3b8" 
              strokeWidth={1}
              fill="none"
              strokeDasharray="2 2"
              name="Lower Confidence"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Market Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <Sun className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Seasonal Pattern</h3>
          </div>
          <p className="text-slate-700 font-medium">{selectedData.seasonalPattern}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Supply-Demand</h3>
          </div>
          <p className="text-slate-700 font-medium">{selectedData.supplyDemand}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 border border-emerald-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Target className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Optimal Window</h3>
          </div>
          <p className="text-slate-700 font-medium">{selectedData.optimalWindow}</p>
        </motion.div>
      </div>

      {/* AI-Powered Insights */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.7 }} 
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-2">AI Market Insights</h2>
            <p className="text-blue-100 font-medium">
              Based on historical trends, seasonal patterns, and current market conditions, our AI recommends:
            </p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Calendar size={18} />
              Optimal Purchase Timing
            </h4>
            <p className="text-blue-100">
              {selectedProduct === "Wheat" && "Purchase within the next 2-3 weeks to capitalize on the current downward trend before seasonal demand increases."}
              {selectedProduct === "Rice" && "Wait 4-6 weeks for prices to stabilize. Current upward trend expected to peak in 3 weeks."}
              {selectedProduct === "Pulses" && "Immediate purchase recommended. Oversupply situation and declining prices present excellent buying opportunity."}
            </p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <TrendingUp size={18} />
              Price Forecast Confidence
            </h4>
            <p className="text-blue-100">
              3-month forecast confidence: <span className="font-bold">87%</span>. Based on 5 years of historical data and current market indicators.
            </p>
          </div>
        </div>

        <button className="h-12 px-8 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all">
          View Detailed Analysis Report
        </button>
      </motion.div>
    </div>
  );
}
