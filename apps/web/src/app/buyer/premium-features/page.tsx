"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Percent,
  BarChart3,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Award,
  Brain,
  Globe,
  AlertTriangle,
  Network,
  Bell,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap size={32} />,
  Percent: <Percent size={32} />,
  BarChart3: <BarChart3 size={32} />,
  TrendingUp: <TrendingUp size={32} />,
  TrendingDown: <TrendingDown size={32} />,
  MessageSquare: <MessageSquare size={32} />,
  Award: <Award size={32} />,
  Brain: <Brain size={32} />,
  Globe: <Globe size={32} />,
  AlertTriangle: <AlertTriangle size={32} />,
  Network: <Network size={32} />,
  Bell: <Bell size={32} />,
};

interface SubFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  benefits: string[];
}

const allFeatures: SubFeature[] = [
  // Smart Sourcing - 4 features
  {
    id: "ai-supplier-match",
    name: "AI Supplier Matching",
    description: "Intelligent algorithm matches your requirements with best suppliers",
    icon: "Zap",
    category: "Smart Sourcing",
    benefits: ["Real-time AI matching score", "Automatic recommendations", "Customizable criteria", "Performance ranking"],
  },
  {
    id: "bulk-negotiation",
    name: "Bulk Negotiation Engine",
    description: "Automated price negotiation for bulk orders with real-time analytics",
    icon: "Percent",
    category: "Smart Sourcing",
    benefits: ["Automated workflows", "Real-time analytics", "Bulk optimization", "Historical data"],
  },
  {
    id: "supplier-comparison",
    name: "Advanced Supplier Comparison",
    description: "Side-by-side comparison with quality, price, and delivery metrics",
    icon: "BarChart3",
    category: "Smart Sourcing",
    benefits: ["Multi-supplier matrix", "Custom metrics", "Export reports", "Trend analysis"],
  },
  {
    id: "price-optimization",
    name: "Dynamic Price Optimization",
    description: "Real-time price tracking and optimization recommendations",
    icon: "TrendingDown",
    category: "Smart Sourcing",
    benefits: ["Live monitoring", "Price predictions", "Cost suggestions", "Price trends"],
  },

  // My Reputation - 4 features
  {
    id: "reputation-score",
    name: "Dynamic Reputation Score",
    description: "Real-time reputation tracking with detailed performance breakdown",
    icon: "TrendingUp",
    category: "My Reputation",
    benefits: ["Live scoring (0-100)", "Monthly tracking", "Performance breakdown", "Score forecasting"],
  },
  {
    id: "review-management",
    name: "Review Management Hub",
    description: "Manage, respond to, and analyze all supplier reviews in one place",
    icon: "MessageSquare",
    category: "My Reputation",
    benefits: ["Centralized dashboard", "Sentiment analysis", "Auto responses", "Review insights"],
  },
  {
    id: "trust-badges",
    name: "Earned Trust Badges",
    description: "Unlock premium badges based on transaction history and ratings",
    icon: "Award",
    category: "My Reputation",
    benefits: ["Gold Buyer badge", "Verified Partner", "Quick Responder", "Custom achievements"],
  },
  {
    id: "reputation-alerts",
    name: "Reputation Alert System",
    description: "Get notified of reputation changes and review responses in real-time",
    icon: "Bell",
    category: "My Reputation",
    benefits: ["Real-time notifications", "Change alerts", "Response alerts", "Custom preferences"],
  },

  // Supplier Insights - 4 features
  {
    id: "predictive-analytics",
    name: "Predictive Performance Analytics",
    description: "AI-powered forecasting of supplier performance and reliability",
    icon: "Brain",
    category: "Supplier Insights",
    benefits: ["Price forecasting", "Demand prediction", "Risk assessment", "Reliability scoring"],
  },
  {
    id: "market-intelligence",
    name: "Market Intelligence Reports",
    description: "Comprehensive market trends and supplier benchmarking data",
    icon: "Globe",
    category: "Supplier Insights",
    benefits: ["Trend analysis", "Benchmarking", "Pricing data", "Regional insights"],
  },
  {
    id: "risk-assessment",
    name: "Supplier Risk Assessment",
    description: "Automated risk scoring with compliance and financial health checks",
    icon: "AlertTriangle",
    category: "Supplier Insights",
    benefits: ["Risk scoring", "Compliance check", "Financial analysis", "Mitigation tips"],
  },
  {
    id: "supplier-network",
    name: "Supplier Network Analysis",
    description: "Visualize supplier relationships and supply chain dependencies",
    icon: "Network",
    category: "Supplier Insights",
    benefits: ["Network visualization", "Dependency mapping", "Relationship analysis", "Resilience scoring"],
  },
];

const categoryColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  "Smart Sourcing": {
    bg: "from-blue-50 to-cyan-50",
    border: "border-blue-200",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  "My Reputation": {
    bg: "from-purple-50 to-pink-50",
    border: "border-purple-200",
    text: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
  },
  "Supplier Insights": {
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

export default function PremiumFeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["Smart Sourcing", "My Reputation", "Supplier Insights"];
  const filteredFeatures = selectedCategory
    ? allFeatures.filter((f) => f.category === selectedCategory)
    : allFeatures;

  const selectedFeatureData = allFeatures.find((f) => f.id === selectedFeature);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-blue-600" size={32} />
            <h1 className="text-5xl font-black text-slate-900">Premium Features</h1>
          </div>
          <p className="text-xl text-slate-600 font-medium">12 Powerful Sub-Features to Transform Your Sourcing</p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              selectedCategory === null
                ? "bg-slate-900 text-white shadow-lg"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            All Features (12)
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                selectedCategory === cat
                  ? `${categoryColors[cat].badge} shadow-lg`
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat} ({allFeatures.filter((f) => f.category === cat).length})
            </button>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence mode="wait">
            {filteredFeatures.map((feature, idx) => {
              const colors = categoryColors[feature.category];
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedFeature(feature.id)}
                  className={`relative group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                    selectedFeature === feature.id
                      ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-2xl scale-105`
                      : `bg-white ${colors.border} hover:shadow-xl hover:scale-102`
                  }`}
                >
                  {/* Premium Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                    <Lock size={12} />
                    Premium
                  </div>

                  {/* Icon */}
                  <div
                    className={`h-16 w-16 rounded-xl flex items-center justify-center mb-4 transition-all ${
                      selectedFeature === feature.id
                        ? `${colors.text} bg-white/50`
                        : `bg-slate-100 ${colors.text} group-hover:bg-slate-200`
                    }`}
                  >
                    {iconMap[feature.icon]}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-black text-slate-900 mb-2">{feature.name}</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">{feature.description}</p>

                  {/* Category Badge */}
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                    {feature.category}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Feature Details Panel */}
        <AnimatePresence>
          {selectedFeatureData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-gradient-to-br ${categoryColors[selectedFeatureData.category].bg} border-2 ${categoryColors[selectedFeatureData.category].border} rounded-3xl p-8 mb-12`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-6">
                  <div
                    className={`h-20 w-20 rounded-2xl flex items-center justify-center ${categoryColors[selectedFeatureData.category].text} bg-white/50`}
                  >
                    {iconMap[selectedFeatureData.icon]}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedFeatureData.name}</h2>
                    <p className="text-slate-600 font-medium text-lg">{selectedFeatureData.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {selectedFeatureData.benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 bg-white/50 rounded-xl p-4"
                  >
                    <div className={`h-2 w-2 rounded-full ${categoryColors[selectedFeatureData.category].text}`} />
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <button className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 group">
                Unlock Feature
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
        >
          <h3 className="text-2xl font-black text-slate-900 mb-6">Feature Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const count = allFeatures.filter((f) => f.category === cat).length;
              const colors = categoryColors[cat];
              return (
                <div key={cat} className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl p-6`}>
                  <p className={`text-sm font-bold ${colors.text} mb-2`}>{cat}</p>
                  <p className="text-4xl font-black text-slate-900 mb-2">{count}</p>
                  <p className="text-slate-600 font-medium">Premium Sub-Features</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
