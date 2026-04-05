"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Target, BarChart3, Zap } from "lucide-react";

export function BehavioralInsightsBuyer() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Behavioral Insights</h1>
        <p className="text-slate-500 font-medium">AI-powered procurement patterns</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Purchase Pattern", value: "Optimized", icon: Brain, color: "blue" },
          { label: "Savings Potential", value: "₹2.4L", icon: TrendingUp, color: "emerald" },
          { label: "Efficiency Score", value: "92%", icon: Target, color: "indigo" },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
            <div className={`h-12 w-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Zap size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-1">Smart Recommendations</h2>
            <p className="text-blue-100 font-medium">Based on your procurement history</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <p className="font-bold mb-2">Optimal Buying Window</p>
            <p className="text-blue-100 text-sm">Purchase wheat in next 5-7 days for 12% savings</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <p className="font-bold mb-2">Supplier Recommendation</p>
            <p className="text-blue-100 text-sm">3 new verified suppliers match your quality criteria</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
