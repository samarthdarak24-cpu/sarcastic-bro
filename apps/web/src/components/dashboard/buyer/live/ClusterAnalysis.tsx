"use client";

import { motion } from "framer-motion";
import { MapPin, TrendingUp, Users, Package, Star } from "lucide-react";

export default function ClusterAnalysis() {
  const clusters = [
    {
      id: "1",
      name: "Maharashtra West",
      region: "Western India",
      score: 95,
      suppliers: 12,
      avgPrice: "₹42/kg",
      quality: "Grade A",
      specialties: ["Tomatoes", "Onions", "Cotton"],
      trend: "up",
      distance: "120 km",
      deliveryTime: "2-3 days"
    },
    {
      id: "2",
      name: "Punjab North",
      region: "Northern India",
      score: 88,
      suppliers: 8,
      avgPrice: "₹85/kg",
      quality: "Premium",
      specialties: ["Basmati Rice", "Wheat", "Cotton"],
      trend: "up",
      distance: "450 km",
      deliveryTime: "4-5 days"
    },
    {
      id: "3",
      name: "Karnataka South",
      region: "Southern India",
      score: 82,
      suppliers: 15,
      avgPrice: "₹38/kg",
      quality: "Grade A",
      specialties: ["Coffee", "Spices", "Vegetables"],
      trend: "stable",
      distance: "680 km",
      deliveryTime: "5-6 days"
    },
    {
      id: "4",
      name: "UP Central",
      region: "Central India",
      score: 76,
      suppliers: 10,
      avgPrice: "₹28/kg",
      quality: "Grade B",
      specialties: ["Wheat", "Sugarcane", "Potatoes"],
      trend: "down",
      distance: "280 km",
      deliveryTime: "3-4 days"
    },
    {
      id: "5",
      name: "Gujarat West",
      region: "Western India",
      score: 91,
      suppliers: 9,
      avgPrice: "₹52/kg",
      quality: "Grade A",
      specialties: ["Cotton", "Groundnut", "Cumin"],
      trend: "up",
      distance: "340 km",
      deliveryTime: "3-4 days"
    }
  ];

  const clusterStats = {
    totalClusters: 14,
    activeClusters: 8,
    totalSuppliers: 54,
    avgQuality: "Grade A"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">🗺️ Cluster Analysis</h2>
        <p className="text-slate-600">Geographic sourcing intelligence and regional insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-bold mb-2">Total Clusters</div>
          <div className="text-4xl font-black text-blue-900">{clusterStats.totalClusters}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="text-sm text-green-700 font-bold mb-2">Active Clusters</div>
          <div className="text-4xl font-black text-green-900">{clusterStats.activeClusters}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
          <div className="text-sm text-purple-700 font-bold mb-2">Total Suppliers</div>
          <div className="text-4xl font-black text-purple-900">{clusterStats.totalSuppliers}</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
          <div className="text-sm text-amber-700 font-bold mb-2">Avg Quality</div>
          <div className="text-4xl font-black text-amber-900">{clusterStats.avgQuality}</div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 border-2 border-slate-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">Regional Map</h3>
            <p className="text-slate-600">Interactive cluster visualization</p>
          </div>
          <MapPin size={32} className="text-blue-600" />
        </div>
        
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="text-slate-400 mb-4">
            <MapPin size={64} className="mx-auto mb-4" />
            <p className="text-lg font-bold">Interactive Map View</p>
            <p className="text-sm">Visualize all supplier clusters across India</p>
          </div>
          <button className="h-12 px-8 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
            Open Full Map
          </button>
        </div>
      </div>

      {/* Cluster Cards */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">Top Performing Clusters</h3>
        <div className="space-y-4">
          {clusters.map((cluster, idx) => (
            <motion.div
              key={cluster.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-6">
                {/* Score Badge */}
                <div className="flex-shrink-0">
                  <div className={`h-20 w-20 rounded-2xl flex flex-col items-center justify-center ${
                    cluster.score >= 90 ? "bg-green-100" :
                    cluster.score >= 80 ? "bg-blue-100" :
                    "bg-amber-100"
                  }`}>
                    <div className={`text-3xl font-black ${
                      cluster.score >= 90 ? "text-green-900" :
                      cluster.score >= 80 ? "text-blue-900" :
                      "text-amber-900"
                    }`}>
                      {cluster.score}
                    </div>
                    <div className="text-xs font-bold text-slate-600">SCORE</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 mb-1">{cluster.name}</h4>
                      <p className="text-sm text-slate-600">{cluster.region}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      cluster.trend === "up" ? "bg-green-100 text-green-700" :
                      cluster.trend === "down" ? "bg-red-100 text-red-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      <TrendingUp size={14} />
                      {cluster.trend.toUpperCase()}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={14} className="text-blue-600" />
                        <span className="text-xs text-slate-600 font-bold">Suppliers</span>
                      </div>
                      <div className="text-lg font-black text-slate-900">{cluster.suppliers}</div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Package size={14} className="text-green-600" />
                        <span className="text-xs text-slate-600 font-bold">Avg Price</span>
                      </div>
                      <div className="text-lg font-black text-slate-900">{cluster.avgPrice}</div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Star size={14} className="text-amber-600" />
                        <span className="text-xs text-slate-600 font-bold">Quality</span>
                      </div>
                      <div className="text-lg font-black text-slate-900">{cluster.quality}</div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-purple-600" />
                        <span className="text-xs text-slate-600 font-bold">Distance</span>
                      </div>
                      <div className="text-lg font-black text-slate-900">{cluster.distance}</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="text-xs text-slate-600 font-bold mb-2">Specialties:</div>
                    <div className="flex flex-wrap gap-2">
                      {cluster.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm">
                      Explore Cluster
                    </button>
                    <button className="h-10 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-sm">
                      View Suppliers
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
