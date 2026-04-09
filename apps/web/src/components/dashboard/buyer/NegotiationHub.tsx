"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Zap, TrendingDown, Target, Clock, CheckCircle } from "lucide-react";

export function NegotiationHub() {
  const [activeNegotiations, setActiveNegotiations] = useState([
    { id: 1, supplier: "Ramesh Agro", product: "Wheat 1000kg", yourBid: "₹42,000", theirBid: "₹45,000", status: "active", savings: "₹3,000" },
    { id: 2, supplier: "Green Valley", product: "Rice 500kg", yourBid: "₹19,000", theirBid: "₹19,500", status: "active", savings: "₹500" },
  ]);

  return (
    <div className="space-y-6">
      {/* Removed large header to save space */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Bids", value: "12", icon: Target, color: "blue" },
          { label: "Avg Savings", value: "18%", icon: TrendingDown, color: "emerald" },
          { label: "Success Rate", value: "87%", icon: CheckCircle, color: "indigo" },
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

      <div className="space-y-4">
        {activeNegotiations.map((neg, idx) => (
          <motion.div key={neg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{neg.supplier}</h3>
                <p className="text-slate-500 font-medium">{neg.product}</p>
              </div>
              <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-sm">
                Active
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Your Bid</p>
                <p className="text-xl font-black text-blue-600">{neg.yourBid}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Their Bid</p>
                <p className="text-xl font-black text-slate-900">{neg.theirBid}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Potential Savings</p>
                <p className="text-xl font-black text-emerald-600">{neg.savings}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <Zap size={18} />
                AI Counter-Offer
              </button>
              <button className="h-12 px-6 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all">
                Message
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
