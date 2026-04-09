"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, TrendingDown, Users, Package, Target } from "lucide-react";

export function BulkOrders() {
  const bulkDeals = [
    { id: 1, product: "Wheat", minQty: "5000kg", discount: "25%", suppliers: 12, price: "₹38/kg", image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400" },
    { id: 2, product: "Rice", minQty: "3000kg", discount: "20%", suppliers: 8, price: "₹32/kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
  ];

  return (
    <div className="space-y-6">
      {/* Removed large header to save space */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Deals", value: "24", icon: Target, color: "blue" },
          { label: "Avg Discount", value: "22%", icon: TrendingDown, color: "emerald" },
          { label: "Suppliers", value: "45", icon: Users, color: "indigo" },
          { label: "Volume", value: "120T", icon: Package, color: "amber" },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bulkDeals.map((deal, idx) => (
          <motion.div key={deal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <div className="relative h-48">
              <img src={deal.image} alt={deal.product} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 px-4 py-2 bg-emerald-500 text-white rounded-full font-black text-sm">
                {deal.discount} OFF
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-black text-slate-900 mb-4">{deal.product}</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Min Quantity</p>
                  <p className="text-lg font-black text-slate-900">{deal.minQty}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Bulk Price</p>
                  <p className="text-lg font-black text-blue-600">{deal.price}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users size={16} />
                  <span className="text-sm font-medium">{deal.suppliers} suppliers</span>
                </div>
              </div>
              <button className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                Request Quote
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
