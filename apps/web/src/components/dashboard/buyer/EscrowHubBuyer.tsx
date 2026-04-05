"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Shield, CheckCircle, Clock, DollarSign } from "lucide-react";

export function EscrowHubBuyer() {
  const escrows = [
    { id: 1, order: "ORD-1001", amount: "₹42,000", status: "locked", release: "On Delivery" },
    { id: 2, order: "ORD-1002", amount: "₹19,000", status: "pending", release: "Quality Check" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Safe-Lock Hub</h1>
        <p className="text-slate-500 font-medium">Secure escrow payments</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Locked Funds", value: "₹2.4L", icon: Lock, color: "blue" },
          { label: "Active Escrows", value: "12", icon: Shield, color: "indigo" },
          { label: "Released", value: "₹8.9L", icon: CheckCircle, color: "emerald" },
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
        {escrows.map((escrow, idx) => (
          <motion.div key={escrow.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{escrow.order}</h3>
                <p className="text-slate-500 font-medium">Escrow Payment</p>
              </div>
              <div className={`px-4 py-2 ${escrow.status === "locked" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"} rounded-full font-bold text-sm`}>
                {escrow.status}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Amount</p>
                <p className="text-2xl font-black text-slate-900">{escrow.amount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Release Trigger</p>
                <p className="text-lg font-black text-blue-600">{escrow.release}</p>
              </div>
            </div>
            <button className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
