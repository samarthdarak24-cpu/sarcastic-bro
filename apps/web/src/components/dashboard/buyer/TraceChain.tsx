"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link, Shield, CheckCircle, MapPin, Package, Truck } from "lucide-react";

export function TraceChain() {
  const traceSteps = [
    { id: 1, title: "Farm Origin", location: "Punjab", date: "Jan 15, 2024", verified: true, icon: MapPin },
    { id: 2, title: "Quality Check", location: "Processing Unit", date: "Jan 16, 2024", verified: true, icon: CheckCircle },
    { id: 3, title: "Packaging", location: "Warehouse", date: "Jan 17, 2024", verified: true, icon: Package },
    { id: 4, title: "In Transit", location: "Delhi Hub", date: "Jan 18, 2024", verified: false, icon: Truck },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2">TraceChain</h1>
        <p className="text-slate-500 font-medium">Blockchain-verified supply chain</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Shield size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-1">Order #ORD-1001</h2>
            <p className="text-blue-100 font-medium">Wheat 1000kg - Blockchain Verified</p>
          </div>
        </div>
      </motion.div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />
        <div className="space-y-6">
          {traceSteps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-20"
            >
              <div className={`absolute left-0 h-16 w-16 rounded-2xl flex items-center justify-center ${step.verified ? "bg-emerald-500" : "bg-amber-500"} text-white shadow-lg`}>
                <step.icon size={24} />
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-black text-slate-900">{step.title}</h3>
                  {step.verified && <CheckCircle size={20} className="text-emerald-600" />}
                </div>
                <p className="text-slate-500 font-medium mb-1">{step.location}</p>
                <p className="text-sm text-slate-400 font-medium">{step.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
