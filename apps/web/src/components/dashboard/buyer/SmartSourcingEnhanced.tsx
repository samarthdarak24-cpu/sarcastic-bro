"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  MapPin,
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Award,
  Shield,
  BarChart3,
  Percent,
  TrendingDown,
} from "lucide-react";
import { PremiumSubFeatures } from "./PremiumSubFeatures";
import { premiumSubFeatures } from "@/services/buyerFeaturesService";

export function SmartSourcingEnhanced() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"suppliers" | "features">("suppliers");

  const suppliers = [
    {
      id: 1,
      name: "Ramesh Agro Farms",
      location: "Punjab",
      rating: 4.8,
      products: 45,
      verified: true,
      price: "₹42/kg",
      category: "Grains",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
      aiMatch: 94,
      negotiationPower: "High",
    },
    {
      id: 2,
      name: "Green Valley Exports",
      location: "Maharashtra",
      rating: 4.9,
      products: 67,
      verified: true,
      price: "₹38/kg",
      category: "Vegetables",
      image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400",
      aiMatch: 98,
      negotiationPower: "Very High",
    },
    {
      id: 3,
      name: "Organic Harvest Co.",
      location: "Kerala",
      rating: 4.7,
      products: 34,
      verified: true,
      price: "₹55/kg",
      category: "Spices",
      image: "https://images.unsplash.com/photo-1596040033229-a0b3b7e8e8e8?w=400",
      aiMatch: 87,
      negotiationPower: "Medium",
    },
    {
      id: 4,
      name: "Fresh Produce Hub",
      location: "Gujarat",
      rating: 4.6,
      products: 89,
      verified: false,
      price: "₹35/kg",
      category: "Fruits",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400",
      aiMatch: 82,
      negotiationPower: "Medium",
    },
  ];

  const categories = ["All", "Grains", "Vegetables", "Fruits", "Spices", "Pulses"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Smart Sourcing</h1>
          <p className="text-slate-500 font-medium">AI-powered supplier discovery and negotiation</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            <Zap size={18} />
            AI Match
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        {["suppliers", "features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab === "suppliers" ? "Suppliers" : "Premium Features"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Suppliers Tab */}
        {activeTab === "suppliers" && (
          <motion.div
            key="suppliers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Search & Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search suppliers, products, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button className="h-14 px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                  <Filter size={18} />
                  Filters
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-3 mt-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier, idx) => (
                <motion.div
                  key={supplier.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {supplier.verified && (
                      <div className="absolute top-4 right-4 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <Shield size={18} className="text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full font-bold text-sm text-slate-900">
                      {supplier.category}
                    </div>

                    {/* AI Match Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-xs flex items-center gap-1">
                      <Zap size={12} />
                      {supplier.aiMatch}% Match
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black text-slate-900 mb-2">{supplier.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                      <MapPin size={14} />
                      <span className="font-medium">{supplier.location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-900">{supplier.rating}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-500">
                        {supplier.products} products
                      </div>
                    </div>

                    {/* Negotiation Power */}
                    <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Negotiation Power</span>
                        <span className={`text-xs font-black ${
                          supplier.negotiationPower === "Very High"
                            ? "text-emerald-600"
                            : supplier.negotiationPower === "High"
                            ? "text-blue-600"
                            : "text-amber-600"
                        }`}>
                          {supplier.negotiationPower}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Starting at</p>
                        <p className="text-2xl font-black text-blue-600">{supplier.price}</p>
                      </div>
                      <button className="h-12 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
                        Connect
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats Banner */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Active Suppliers", value: "1,247", icon: Target },
                  { label: "Products Listed", value: "45K+", icon: Package },
                  { label: "Avg Response", value: "2.4hrs", icon: Clock },
                  { label: "Success Rate", value: "94%", icon: Award },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <stat.icon size={32} className="mx-auto mb-3 opacity-80" />
                    <p className="text-3xl font-black mb-1">{stat.value}</p>
                    <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PremiumSubFeatures features={premiumSubFeatures.smartSourcing} category="Smart Sourcing" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
