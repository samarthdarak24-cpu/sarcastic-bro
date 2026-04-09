"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Star, TrendingUp, Award, Shield, MapPin, Package, Clock, CheckCircle, AlertCircle } from "lucide-react";

export function SupplierInsights() {
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);

  const suppliers = [
    {
      id: 1,
      name: "Ramesh Agro Farms",
      location: "Punjab",
      rating: 4.8,
      orders: 234,
      onTime: 96,
      quality: 98,
      verified: true,
      badge: "Gold",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
    },
    {
      id: 2,
      name: "Green Valley Exports",
      location: "Maharashtra",
      rating: 4.9,
      orders: 456,
      onTime: 98,
      quality: 99,
      verified: true,
      badge: "Platinum",
      image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400",
    },
    {
      id: 3,
      name: "Organic Harvest Co.",
      location: "Kerala",
      rating: 4.7,
      orders: 189,
      onTime: 94,
      quality: 97,
      verified: true,
      badge: "Silver",
      image: "https://images.unsplash.com/photo-1596040033229-a0b3b7e8e8e8?w=400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Removed large header to save space */}
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Compact header removed */}
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Suppliers", value: "1,247", icon: Users, color: "blue" },
          { label: "Verified Partners", value: "892", icon: Shield, color: "emerald" },
          { label: "Avg Rating", value: "4.7", icon: Star, color: "amber" },
          { label: "Active Orders", value: "3,456", icon: Package, color: "indigo" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className={`h-12 w-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {suppliers.map((supplier, idx) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-40">
              <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 px-4 py-2 bg-amber-500 text-white rounded-full font-black text-sm">
                {supplier.badge}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">{supplier.name}</h3>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={14} />
                    <span className="text-sm font-medium">{supplier.location}</span>
                  </div>
                </div>
                {supplier.verified && (
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={18} className="text-white" />
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                    <span className="text-xl font-black text-slate-900">{supplier.rating}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900 mb-1">{supplier.orders}</p>
                  <p className="text-xs text-slate-500 font-medium">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-emerald-600 mb-1">{supplier.onTime}%</p>
                  <p className="text-xs text-slate-500 font-medium">On-Time</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-slate-600">Quality Score</span>
                    <span className="text-slate-900 font-bold">{supplier.quality}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${supplier.quality}%` }}
                      transition={{ duration: 1, delay: idx * 0.2 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-slate-600">Delivery Rate</span>
                    <span className="text-slate-900 font-bold">{supplier.onTime}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${supplier.onTime}%` }}
                      transition={{ duration: 1, delay: idx * 0.2 + 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
                View Full Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
