"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Link, CheckCircle, Lock, Award } from "lucide-react";

export function BlockchainTraceBuyer() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Blockchain Trace</h1>
        <p className="text-slate-500 font-medium">Immutable supply chain records</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Verified Orders", value: "234", icon: CheckCircle, color: "emerald" },
          { label: "Blockchain Txns", value: "1,247", icon: Link, color: "blue" },
          { label: "Trust Score", value: "98%", icon: Shield, color: "indigo" },
          { label: "Certifications", value: "45", icon: Award, color: "amber" },
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <Shield size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-1">Latest Transaction</h2>
            <p className="text-slate-400 font-medium">Order #ORD-1001 - Verified on Chain</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="text-slate-400 text-sm font-medium mb-1">Block Hash</p>
            <p className="text-white font-mono text-xs">0x7a8f...3d2e</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="text-slate-400 text-sm font-medium mb-1">Timestamp</p>
            <p className="text-white font-medium">Jan 18, 2024 14:32</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
