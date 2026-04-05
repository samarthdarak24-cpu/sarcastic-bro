"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Star,
  TrendingUp,
  Award,
  Shield,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  Globe,
  AlertTriangle,
  Network,
  TrendingDown,
  MessageCircle,
  ShieldCheck,
  BarChart2,
  LineChart,
  Bell,
  Sparkles,
  Target,
  Activity,
  Zap,
} from "lucide-react";
import { PremiumSubFeatures } from "./PremiumSubFeatures";
import { premiumSubFeatures } from "@/services/buyerFeaturesService";

export function SupplierInsightsPremium() {
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "comparison" | "features">("overview");
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
      riskScore: 15,
      responseTime: 45,
      priceCompetitiveness: 92,
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
      riskScore: 8,
      responseTime: 30,
      priceCompetitiveness: 88,
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
      riskScore: 22,
      responseTime: 60,
      priceCompetitiveness: 85,
      image: "https://images.unsplash.com/photo-1596040033229-a0b3b7e8e8e8?w=400",
    },
  ];

  const performanceMetrics = [
    { label: "Total Suppliers", value: "1,247", icon: Users, color: "blue", trend: "+12 this month" },
    { label: "Verified Partners", value: "892", icon: ShieldCheck, color: "emerald", trend: "71.5% verified" },
    { label: "Avg Performance", value: "94.2%", icon: TrendingUp, color: "amber", trend: "+2.3% vs last month" },
    { label: "Active Contracts", value: "3,456", icon: Package, color: "indigo", trend: "18 expiring soon" },
  ];

  const riskDistribution = [
    { level: "Low Risk", count: 892, percentage: 71.5, color: "emerald" },
    { level: "Medium Risk", count: 298, percentage: 23.9, color: "amber" },
    { level: "High Risk", count: 57, percentage: 4.6, color: "red" },
  ];

  const qualityTrends = [
    { month: "Jan", score: 92 },
    { month: "Feb", score: 93 },
    { month: "Mar", score: 94 },
    { month: "Apr", score: 95 },
    { month: "May", score: 94 },
    { month: "Jun", score: 96 },
  ];

  const topPerformers = [
    { name: "Green Valley Exports", score: 98, badge: "🥇" },
    { name: "Ramesh Agro Farms", score: 96, badge: "🥈" },
    { name: "Organic Harvest Co.", score: 94, badge: "🥉" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Supplier Intelligence</h1>
        <p className="text-slate-500 font-medium">AI-powered insights into supplier performance and reliability</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {["overview", "analytics", "comparison", "features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className={`h-12 w-12 bg-${metric.color}-50 rounded-xl flex items-center justify-center text-${metric.color}-600 mb-4`}>
                    <metric.icon size={24} />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-slate-600 font-medium mb-2">{metric.label}</p>
                  <p className="text-xs font-bold text-emerald-600">{metric.trend}</p>
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
                  onClick={() => setSelectedSupplier(supplier.id)}
                  className={`bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                    selectedSupplier === supplier.id
                      ? "border-emerald-600 shadow-2xl"
                      : "border-slate-200 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="relative h-40">
                    <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 px-4 py-2 bg-amber-500 text-white rounded-full font-black text-sm">
                      {supplier.badge}
                    </div>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-900">
                      Risk: {supplier.riskScore}%
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
                        <div className="h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center">
                          <CheckCircle size={18} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span className="text-lg font-black text-slate-900">{supplier.rating}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-slate-900 mb-1">{supplier.orders}</p>
                        <p className="text-xs text-slate-500 font-medium">Orders</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-emerald-600 mb-1">{supplier.onTime}%</p>
                        <p className="text-xs text-slate-500 font-medium">On-Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-blue-600 mb-1">{supplier.responseTime}m</p>
                        <p className="text-xs text-slate-500 font-medium">Response</p>
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
                          <span className="text-slate-600">Price Competitiveness</span>
                          <span className="text-slate-900 font-bold">{supplier.priceCompetitiveness}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${supplier.priceCompetitiveness}%` }}
                            transition={{ duration: 1, delay: idx * 0.2 + 0.1 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Risk Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Risk Distribution</h3>
                  <p className="text-slate-500 font-medium">Supplier risk assessment overview</p>
                </div>
              </div>

              <div className="space-y-4">
                {riskDistribution.map((risk, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-slate-700">{risk.level}</span>
                      <span className="text-sm font-bold text-slate-900">{risk.count} suppliers ({risk.percentage}%)</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${risk.percentage}%` }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                        className={`h-full bg-${risk.color}-500 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Quality Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <LineChart size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Quality Trends</h3>
                  <p className="text-slate-500 font-medium">Average quality score over time</p>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between gap-4">
                {qualityTrends.map((data, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.score / 100) * 100}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">
                        {data.score}%
                      </div>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-slate-600">
                      {data.month}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-amber-600 rounded-xl flex items-center justify-center text-white">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Top Performers</h3>
                  <p className="text-slate-600 font-medium">Highest rated suppliers this month</p>
                </div>
              </div>

              <div className="space-y-3">
                {topPerformers.map((performer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-200"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{performer.badge}</span>
                      <p className="font-black text-slate-900">{performer.name}</p>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{performer.score}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Predictions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <Brain size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">AI Predictions</h3>
                  <p className="text-slate-600 font-medium">Predictive analytics for supplier performance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Expected Growth", value: "+15%", icon: TrendingUp, color: "emerald" },
                  { label: "Risk Reduction", value: "-8%", icon: Shield, color: "blue" },
                  { label: "Quality Improvement", value: "+3.2%", icon: Sparkles, color: "amber" },
                ].map((prediction, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-blue-200">
                    <prediction.icon className={`text-${prediction.color}-600 mb-3`} size={24} />
                    <p className="text-3xl font-black text-slate-900 mb-1">{prediction.value}</p>
                    <p className="text-slate-600 font-medium">{prediction.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Comparison Tab */}
        {activeTab === "comparison" && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg overflow-x-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <BarChart2 size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Multi-Supplier Comparison</h3>
                  <p className="text-slate-500 font-medium">Side-by-side performance analysis</p>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-4 font-black text-slate-900">Supplier</th>
                    <th className="text-center py-4 px-4 font-black text-slate-900">Rating</th>
                    <th className="text-center py-4 px-4 font-black text-slate-900">Quality</th>
                    <th className="text-center py-4 px-4 font-black text-slate-900">On-Time</th>
                    <th className="text-center py-4 px-4 font-black text-slate-900">Risk</th>
                    <th className="text-center py-4 px-4 font-black text-slate-900">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier, idx) => (
                    <motion.tr
                      key={supplier.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img src={supplier.image} alt={supplier.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{supplier.name}</p>
                            <p className="text-xs text-slate-500">{supplier.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-900">{supplier.rating}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="font-bold text-emerald-600">{supplier.quality}%</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="font-bold text-blue-600">{supplier.onTime}%</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          supplier.riskScore < 20 ? "bg-emerald-100 text-emerald-700" :
                          supplier.riskScore < 40 ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {supplier.riskScore}%
                        </span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="font-bold text-indigo-600">{supplier.priceCompetitiveness}%</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
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
            <PremiumSubFeatures features={premiumSubFeatures.supplierInsights} category="Supplier Insights" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
