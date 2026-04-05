"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Percent,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Award,
  Brain,
  Globe,
  AlertTriangle,
  Network,
  Lock,
  Sparkles,
  TrendingDown,
  Bell,
  Clock,
  Target,
  FileText,
  Rocket,
  Shield,
  Share2,
  Trophy,
  CheckCircle,
  MessageCircle,
  Package,
  ShieldCheck,
  BarChart2,
  LineChart,
  Users,
  Bot,
  Heart,
  BookOpen,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap size={24} />,
  Percent: <Percent size={24} />,
  BarChart3: <BarChart3 size={24} />,
  TrendingUp: <TrendingUp size={24} />,
  TrendingDown: <TrendingDown size={24} />,
  MessageSquare: <MessageSquare size={24} />,
  Award: <Award size={24} />,
  Brain: <Brain size={24} />,
  Globe: <Globe size={24} />,
  AlertTriangle: <AlertTriangle size={24} />,
  Network: <Network size={24} />,
  Bell: <Bell size={24} />,
  Clock: <Clock size={24} />,
  Target: <Target size={24} />,
  FileText: <FileText size={24} />,
  Rocket: <Rocket size={24} />,
  Shield: <Shield size={24} />,
  Share2: <Share2 size={24} />,
  Trophy: <Trophy size={24} />,
  CheckCircle: <CheckCircle size={24} />,
  MessageCircle: <MessageCircle size={24} />,
  Package: <Package size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  BarChart2: <BarChart2 size={24} />,
  LineChart: <LineChart size={24} />,
  Users: <Users size={24} />,
  Bot: <Bot size={24} />,
  Heart: <Heart size={24} />,
  BookOpen: <BookOpen size={24} />,
};

interface SubFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  premium: boolean;
}

interface PremiumSubFeaturesProps {
  features: SubFeature[];
  category: "Smart Sourcing" | "My Reputation" | "Supplier Insights" | "Negotiation Hub";
}

export function PremiumSubFeatures({ features, category }: PremiumSubFeaturesProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    "Smart Sourcing": {
      bg: "from-blue-50 to-cyan-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    "My Reputation": {
      bg: "from-purple-50 to-pink-50",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    "Supplier Insights": {
      bg: "from-emerald-50 to-teal-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    "Negotiation Hub": {
      bg: "from-orange-50 to-amber-50",
      text: "text-orange-600",
      border: "border-orange-200",
    },
  };

  const colors = categoryColors[category];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className={colors.text} size={28} />
          <h2 className="text-3xl font-black text-slate-900">{category}</h2>
        </div>
        <p className="text-slate-500 font-medium">Premium features to enhance your sourcing strategy</p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedFeature(feature.id)}
            className={`relative group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
              selectedFeature === feature.id
                ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-xl`
                : `bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg`
            }`}
          >
            {/* Premium Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
              <Lock size={12} />
              Premium
            </div>

            {/* Icon */}
            <div
              className={`h-14 w-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
                selectedFeature === feature.id
                  ? `${colors.text} bg-white/50`
                  : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
              }`}
            >
              {iconMap[feature.icon]}
            </div>

            {/* Content */}
            <h3 className="text-lg font-black text-slate-900 mb-2">{feature.name}</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">{feature.description}</p>

            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Feature Details Panel */}
      {selectedFeature && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-3xl p-8`}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {features.find((f) => f.id === selectedFeature)?.name}
              </h3>
              <p className="text-slate-600 font-medium">
                {features.find((f) => f.id === selectedFeature)?.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Real-time data updates",
              "AI-powered insights",
              "Custom reports",
              "Priority support",
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${colors.text}`} />
                <span className="text-slate-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="mt-6 h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
            Unlock Feature
          </button>
        </motion.div>
      )}
    </div>
  );
}
