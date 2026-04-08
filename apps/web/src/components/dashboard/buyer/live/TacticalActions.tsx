"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Users, Package, TrendingUp, Zap, ShoppingCart, 
  Target, DollarSign, MessageSquare, BarChart3, Shield 
} from "lucide-react";

export default function TacticalActions() {
  const router = useRouter();

  const actions = [
    {
      id: "source-suppliers",
      title: "Source Suppliers",
      description: "Find and connect with verified suppliers",
      icon: Users,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      stats: { available: 45, new: 8 },
      route: "/buyer/dashboard?section=Sourcing"
    },
    {
      id: "bulk-procurement",
      title: "Bulk Procurement",
      description: "Large-scale ordering and bulk deals",
      icon: Package,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      stats: { active: 12, volume: "2.4T" },
      route: "/buyer/dashboard?section=Sourcing"
    },
    {
      id: "ai-negotiator",
      title: "AI Negotiator",
      description: "Smart price negotiation assistant",
      icon: Zap,
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
      stats: { saved: "₹1.8L", deals: 23 },
      route: "/buyer/dashboard?section=Bidding"
    },
    {
      id: "quick-order",
      title: "Quick Order",
      description: "Fast-track order placement",
      icon: ShoppingCart,
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      stats: { pending: 5, completed: 156 },
      route: "/buyer/dashboard?section=Orders"
    },
    {
      id: "bid-manager",
      title: "Bid Manager",
      description: "Manage active bids and tenders",
      icon: Target,
      color: "red",
      gradient: "from-red-500 to-pink-500",
      stats: { active: 18, won: 34 },
      route: "/buyer/dashboard?section=Bidding"
    },
    {
      id: "payment-hub",
      title: "Payment Hub",
      description: "Escrow and payment management",
      icon: DollarSign,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      stats: { escrow: 8, pending: "₹2.4L" },
      route: "/buyer/dashboard?section=Payments"
    },
    {
      id: "supplier-chat",
      title: "Supplier Chat",
      description: "Direct communication with farmers",
      icon: MessageSquare,
      color: "indigo",
      gradient: "from-indigo-500 to-purple-500",
      stats: { unread: 5, active: 12 },
      route: "/chat"
    },
    {
      id: "analytics",
      title: "Analytics Dashboard",
      description: "Performance metrics and insights",
      icon: BarChart3,
      color: "cyan",
      gradient: "from-cyan-500 to-blue-500",
      stats: { reports: 8, alerts: 3 },
      route: "/buyer/live?sub=kpi-analytics"
    },
    {
      id: "blockchain-verify",
      title: "Blockchain Verify",
      description: "Supply chain verification",
      icon: Shield,
      color: "violet",
      gradient: "from-violet-500 to-purple-500",
      stats: { verified: 89, pending: 4 },
      route: "/buyer/dashboard?section=Orders"
    }
  ];

  const quickStats = [
    { label: "Actions Today", value: "23", change: "+5" },
    { label: "Pending Tasks", value: "8", change: "-2" },
    { label: "Completed", value: "156", change: "+12" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">⚡ Tactical Actions</h2>
        <p className="text-slate-600">Quick access to all procurement tools and features</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200"
          >
            <div className="text-sm text-blue-700 font-bold mb-2">{stat.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-black text-blue-900">{stat.value}</div>
              <div className="text-sm font-bold text-green-600">{stat.change}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, idx) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(action.route)}
            className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all text-left group"
          >
            {/* Icon with Gradient */}
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <action.icon size={32} className="text-white" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-black text-slate-900 mb-2">{action.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{action.description}</p>

            {/* Stats */}
            <div className="flex gap-2 mb-4">
              {Object.entries(action.stats).map(([key, value]) => (
                <div key={key} className="bg-slate-100 px-3 py-1 rounded-lg">
                  <span className="text-xs font-bold text-slate-900">{value}</span>
                  <span className="text-xs text-slate-500 ml-1">{key}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className={`h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center text-white font-bold group-hover:shadow-lg transition-all`}>
              Launch →
            </div>
          </motion.button>
        ))}
      </div>

      {/* Priority Actions Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Zap size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">Priority Actions Available</h3>
              <p className="text-purple-100">You have 3 urgent tasks requiring attention</p>
            </div>
          </div>
          <button className="h-12 px-6 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all">
            View All
          </button>
        </div>
      </motion.div>
    </div>
  );
}
