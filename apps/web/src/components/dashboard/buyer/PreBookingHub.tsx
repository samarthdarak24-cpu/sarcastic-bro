"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingDown, Lock, Clock, CheckCircle } from "lucide-react";

export function PreBookingHub() {
  const preBookings = [
    { id: 1, product: "Wheat", quantity: "2000kg", lockPrice: "₹40/kg", harvest: "March 2024", savings: "15%", status: "locked" },
    { id: 2, product: "Rice", quantity: "1500kg", lockPrice: "₹36/kg", harvest: "April 2024", savings: "12%", status: "pending" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Pre-Booking Hub</h1>
        <p className="text-slate-500 font-medium">Lock prices before harvest</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Bookings", value: "8", icon: Lock, color: "blue" },
          { label: "Total Savings", value: "₹45K", icon: TrendingDown, color: "emerald" },
          { label: "Upcoming Harvest", value: "3", icon: Calendar, color: "amber" },
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
        {preBookings.map((booking, idx) => (
          <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{booking.product}</h3>
                <p className="text-slate-500 font-medium">{booking.quantity}</p>
              </div>
              <div className={`px-4 py-2 ${booking.status === "locked" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"} rounded-full font-bold text-sm`}>
                {booking.status === "locked" ? <CheckCircle size={16} className="inline mr-1" /> : <Clock size={16} className="inline mr-1" />}
                {booking.status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Locked Price</p>
                <p className="text-xl font-black text-blue-600">{booking.lockPrice}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Harvest Date</p>
                <p className="text-xl font-black text-slate-900">{booking.harvest}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Savings</p>
                <p className="text-xl font-black text-emerald-600">{booking.savings}</p>
              </div>
            </div>

            <button className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
              View Contract
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
