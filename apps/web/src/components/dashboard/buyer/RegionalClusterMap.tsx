"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Users, Package } from "lucide-react";

export function RegionalClusterMap() {
  const clusters = [
    { id: 1, region: "Punjab", suppliers: 245, products: "Wheat, Rice", strength: 95, color: "emerald" },
    { id: 2, region: "Maharashtra", suppliers: 189, products: "Vegetables, Fruits", strength: 88, color: "blue" },
    { id: 3, region: "Kerala", suppliers: 134, products: "Spices, Coconut", strength: 82, color: "amber" },
  ];

  return (
    <div className="space-y-6">
      {/* Removed large header to save space */}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 rounded-3xl p-8 text-white">
        <h2 className="text-2xl font-black mb-6">India Supply Map</h2>
        <div className="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
          <p className="text-slate-400 font-medium">Interactive Map Visualization</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clusters.map((cluster, idx) => (
          <motion.div key={cluster.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <div className={`h-12 w-12 bg-${cluster.color}-50 rounded-2xl flex items-center justify-center text-${cluster.color}-600 mb-4`}>
              <MapPin size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{cluster.region}</h3>
            <p className="text-slate-500 font-medium mb-4">{cluster.products}</p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 font-medium">Suppliers</span>
                <span className="text-sm font-black text-slate-900">{cluster.suppliers}</span>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-600">Cluster Strength</span>
                  <span className="text-slate-900 font-bold">{cluster.strength}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cluster.strength}%` }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                    className={`h-full bg-gradient-to-r from-${cluster.color}-500 to-${cluster.color}-600`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
