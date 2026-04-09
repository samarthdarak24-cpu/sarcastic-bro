'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Package, Truck, DollarSign, Gavel, Award,
  ShieldAlert, BarChart3, Brain, TrendingUp, Target,
  Camera, Leaf, Globe, Lock, MessageSquare, Zap,
  ArrowRight, ChevronRight
} from 'lucide-react';

// Feature Categories with their sub-features
const featureCategories = [
  {
    id: 'ai-intelligence',
    title: 'AI Intelligence',
    description: 'Smart insights powered by AI',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600',
    features: [
      { id: 'farm-insights', name: 'Farm Insights', icon: BarChart3, description: 'Weather, soil, pest detection' },
      { id: 'agri-intelligence', name: 'Agri Intelligence', icon: Brain, description: 'AI-powered recommendations' },
      { id: 'market-intelligence', name: 'Market Intelligence', icon: TrendingUp, description: 'Price trends & forecasts' },
      { id: 'behavioral-insights', name: 'Behavioral Insights', icon: Target, description: 'Buyer behavior analysis' },
    ]
  },
  {
    id: 'production',
    title: 'Production & Supply',
    description: 'Manage your products and inventory',
    icon: Package,
    color: 'from-green-500 to-emerald-600',
    features: [
      { id: 'product-hub', name: 'Product Hub', icon: Package, description: 'Manage all your products' },
      { id: 'inventory', name: 'Smart Inventory', icon: Leaf, description: 'Track stock levels' },
      { id: 'quality-scan', name: 'AI Quality Scan', icon: Camera, description: 'Scan crop quality instantly' },
      { id: 'crop-management', name: 'Crop Management', icon: Leaf, description: 'Plan and track crops' },
    ]
  },
  {
    id: 'orders',
    title: 'Orders & Logistics',
    description: 'Track orders and manage deliveries',
    icon: Truck,
    color: 'from-blue-500 to-cyan-600',
    features: [
      { id: 'order-control', name: 'Order Control', icon: Truck, description: 'Manage all orders' },
      { id: 'logistics', name: 'Logistics Manager', icon: Globe, description: 'Delivery tracking' },
      { id: 'auto-sell', name: 'Auto-Sell Rules', icon: Zap, description: 'Automated selling' },
    ]
  },
  {
    id: 'finance',
    title: 'Payments & Finance',
    description: 'Financial management and payments',
    icon: DollarSign,
    color: 'from-amber-500 to-orange-600',
    features: [
      { id: 'agripay', name: 'AgriPay Center', icon: DollarSign, description: 'Payment processing' },
      { id: 'escrow', name: 'Escrow Hub', icon: Lock, description: 'Secure transactions' },
      { id: 'financial-hub', name: 'Financial Hub', icon: BarChart3, description: 'Revenue & analytics' },
      { id: 'price-protection', name: 'Price Protection', icon: ShieldAlert, description: 'Lock in prices' },
    ]
  },
  {
    id: 'bidding',
    title: 'Tenders & Bidding',
    description: 'Participate in tenders and bids',
    icon: Gavel,
    color: 'from-rose-500 to-pink-600',
    features: [
      { id: 'tender-bids', name: 'Tender Bids Hub', icon: Gavel, description: 'Browse and bid' },
      { id: 'tender-participation', name: 'My Tenders', icon: Target, description: 'Active participations' },
      { id: 'bulk-aggregation', name: 'Bulk Aggregation', icon: Package, description: 'Group selling' },
    ]
  },
  {
    id: 'trust',
    title: 'Trust & Reputation',
    description: 'Build your reputation and trust',
    icon: Award,
    color: 'from-yellow-500 to-amber-600',
    features: [
      { id: 'trust-identity', name: 'Trust Identity', icon: Award, description: 'Your reputation score' },
      { id: 'reputation-hub', name: 'Reputation Hub', icon: Target, description: 'Reviews & ratings' },
      { id: 'blockchain-trace', name: 'Blockchain Trace', icon: Lock, description: 'Verify authenticity' },
    ]
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'Stay secure and compliant',
    icon: ShieldAlert,
    color: 'from-red-500 to-rose-600',
    features: [
      { id: 'security-dashboard', name: 'Security Dashboard', icon: ShieldAlert, description: 'Security overview' },
      { id: 'compliance', name: 'Compliance Tracking', icon: Lock, description: 'Regulatory compliance' },
      { id: 'export-audit', name: 'Export Audit', icon: Globe, description: 'Export compliance' },
    ]
  },
];

interface FarmerDashboardRedesignProps {
  onFeatureSelect: (categoryId: string, featureId: string) => void;
}

export default function FarmerDashboardRedesign({ onFeatureSelect }: FarmerDashboardRedesignProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Sparkles size={200} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Farmer Dashboard
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium">
            Everything you need to manage your farm, all in one place
          </p>
        </div>
      </motion.div>

      {/* Feature Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featureCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden hover:border-slate-300 transition-all duration-300 hover:shadow-2xl"
          >
            {/* Category Header */}
            <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <category.icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-1">{category.title}</h2>
                    <p className="text-white/80 text-sm font-medium">{category.description}</p>
                  </div>
                </div>
                <ChevronRight 
                  size={24} 
                  className={`transition-transform duration-300 ${
                    hoveredCategory === category.id ? 'translate-x-1' : ''
                  }`}
                />
              </div>
            </div>

            {/* Sub-features List */}
            <div className="p-6 space-y-3">
              {category.features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => onFeatureSelect(category.id, feature.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <feature.icon size={20} className="text-slate-700" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-slate-900 mb-0.5">{feature.name}</h3>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                  <ArrowRight 
                    size={20} 
                    className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" 
                  />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black mb-2">Need Help?</h3>
            <p className="text-white/90">Chat with AgriVoice AI for instant assistance</p>
          </div>
          <button className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold hover:bg-green-50 transition-colors flex items-center gap-2 shadow-lg">
            <MessageSquare size={20} />
            Open AgriChat
          </button>
        </div>
      </motion.div>
    </div>
  );
}
