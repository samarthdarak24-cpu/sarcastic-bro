"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  Link,
  Award,
  QrCode,
  FileText,
  AlertCircle,
  TrendingUp,
  Users,
  Zap,
  Eye,
  Download,
  Share2,
  Bell,
  BarChart3,
  Activity,
  Lock,
  Sparkles,
  Navigation,
  Calendar,
  Hash,
  Database,
} from "lucide-react";

interface BlockchainTraceLiveProps {
  userRole: "FARMER" | "BUYER";
}

export function BlockchainTraceLive({ userRole }: BlockchainTraceLiveProps) {
  const [activeTab, setActiveTab] = useState<"tracking" | "trace" | "blockchain" | "features">("tracking");
  const [selectedOrder, setSelectedOrder] = useState<string | null>("ORD-1001");

  // Sample orders data
  const orders = [
    {
      id: "ORD-1001",
      product: "Organic Wheat 1000kg",
      status: "In Transit",
      progress: 60,
      eta: "2 days",
      location: "Delhi Hub",
      buyer: "ABC Traders Ltd",
      farmer: "Ramesh Kumar Farms",
      price: "₹45,000",
      blockHash: "0x7a8f...3d2e",
      verified: true,
    },
    {
      id: "ORD-1002",
      product: "Basmati Rice 500kg",
      status: "Processing",
      progress: 30,
      eta: "5 days",
      location: "Mumbai Warehouse",
      buyer: "Fresh Mart Pvt Ltd",
      farmer: "Green Valley Farms",
      price: "₹32,500",
      blockHash: "0x9b2c...4f1a",
      verified: true,
    },
    {
      id: "ORD-1003",
      product: "Red Lentils 200kg",
      status: "Delivered",
      progress: 100,
      eta: "Completed",
      location: "Pune",
      buyer: "XYZ Exports",
      farmer: "Organic Harvest Co.",
      price: "₹18,000",
      blockHash: "0x3e5d...7c8b",
      verified: true,
    },
  ];

  // Blockchain trace steps
  const traceSteps = [
    {
      id: 1,
      title: "Farm Origin",
      location: "Punjab, India",
      date: "Jan 15, 2024 08:30 AM",
      verified: true,
      icon: MapPin,
      details: "Harvested from certified organic farm",
      blockHash: "0x1a2b...3c4d",
    },
    {
      id: 2,
      title: "Quality Inspection",
      location: "Processing Unit, Ludhiana",
      date: "Jan 16, 2024 10:15 AM",
      verified: true,
      icon: CheckCircle,
      details: "Grade A quality certified by FSSAI",
      blockHash: "0x5e6f...7g8h",
    },
    {
      id: 3,
      title: "Packaging & Labeling",
      location: "Warehouse, Chandigarh",
      date: "Jan 17, 2024 02:45 PM",
      verified: true,
      icon: Package,
      details: "Sealed and labeled with QR code",
      blockHash: "0x9i0j...1k2l",
    },
    {
      id: 4,
      title: "Dispatch",
      location: "Logistics Hub, Delhi",
      date: "Jan 18, 2024 06:00 AM",
      verified: true,
      icon: Truck,
      details: "Shipped via cold chain transport",
      blockHash: "0x3m4n...5o6p",
    },
    {
      id: 5,
      title: "In Transit",
      location: "Delhi to Mumbai Route",
      date: "Jan 18, 2024 02:30 PM",
      verified: false,
      icon: Navigation,
      details: "Real-time GPS tracking active",
      blockHash: "Pending...",
    },
  ];

  // 10 Sub-Features (All Accessible - No Premium)
  const features = [
    {
      id: "realtime-tracking",
      name: "Real-Time Tracking",
      description: "Live GPS tracking of all shipments with minute-by-minute updates",
      icon: Navigation,
      active: true,
    },
    {
      id: "blockchain-verify",
      name: "Blockchain Verification",
      description: "Immutable records on blockchain for complete transparency",
      icon: Shield,
      active: true,
    },
    {
      id: "qr-scanner",
      name: "QR Code Scanner",
      description: "Scan product QR codes to view complete journey history",
      icon: QrCode,
      active: true,
    },
    {
      id: "document-vault",
      name: "Document Vault",
      description: "Secure storage for certificates, invoices, and quality reports",
      icon: FileText,
      active: true,
    },
    {
      id: "smart-alerts",
      name: "Smart Alerts",
      description: "Automated notifications for status changes and delays",
      icon: Bell,
      active: true,
    },
    {
      id: "analytics-dashboard",
      name: "Analytics Dashboard",
      description: "Detailed insights on delivery times, success rates, and trends",
      icon: BarChart3,
      active: true,
    },
    {
      id: "multi-party-view",
      name: "Multi-Party View",
      description: "Shared visibility for farmers, buyers, and logistics partners",
      icon: Users,
      active: true,
    },
    {
      id: "dispute-resolution",
      name: "Dispute Resolution",
      description: "Blockchain-backed evidence for quick dispute settlement",
      icon: AlertCircle,
      active: true,
    },
    {
      id: "export-reports",
      name: "Export Reports",
      description: "Download detailed PDF reports for compliance and audits",
      icon: Download,
      active: true,
    },
    {
      id: "share-tracking",
      name: "Share Tracking Link",
      description: "Generate public tracking links to share with stakeholders",
      icon: Share2,
      active: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "emerald";
      case "In Transit":
        return "blue";
      case "Processing":
        return "amber";
      default:
        return "slate";
    }
  };

  const selectedOrderData = orders.find((o) => o.id === selectedOrder);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Blockchain Trace Live</h1>
        <p className="text-slate-500 font-medium">
          Real-time order tracking with blockchain verification
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Orders", value: "234", icon: Package, color: "blue", trend: "+12%" },
          { label: "In Transit", value: "45", icon: Truck, color: "indigo", trend: "Active" },
          { label: "Delivered", value: "189", icon: CheckCircle, color: "emerald", trend: "94.8%" },
          { label: "Blockchain Verified", value: "234", icon: Shield, color: "amber", trend: "100%" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div
              className={`h-12 w-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}
            >
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-slate-500 font-medium mb-2">{stat.label}</p>
            <p className="text-xs font-bold text-emerald-600">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {["tracking", "trace", "blockchain", "features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Order Tracking Tab */}
        {activeTab === "tracking" && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {orders.map((order, idx) => {
              const color = getStatusColor(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedOrder(order.id)}
                  className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                    selectedOrder === order.id
                      ? "border-blue-500 shadow-xl"
                      : "border-slate-200 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-slate-900">{order.id}</h3>
                        {order.verified && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                            <Shield size={12} />
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-slate-500 font-medium mb-1">{order.product}</p>
                      <p className="text-sm text-slate-400 font-medium">
                        {userRole === "BUYER" ? `From: ${order.farmer}` : `To: ${order.buyer}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-4 py-2 bg-${color}-50 text-${color}-600 rounded-full font-bold text-sm mb-2`}
                      >
                        {order.status}
                      </div>
                      <p className="text-lg font-black text-slate-900">{order.price}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-slate-600">Delivery Progress</span>
                      <span className="text-slate-900 font-bold">{order.progress}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${order.progress}%` }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600`}
                      />
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={16} />
                      <span className="text-sm font-medium">{order.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-slate-900">ETA: {order.eta}</div>
                      <button className="h-8 px-4 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-100 transition-all">
                        Track Live
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Blockchain Trace Tab */}
        {activeTab === "trace" && selectedOrderData && (
          <motion.div
            key="trace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Order Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Shield size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-1">{selectedOrderData.id}</h2>
                  <p className="text-blue-100 font-medium">{selectedOrderData.product}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-blue-200 text-sm font-medium mb-1">Block Hash</p>
                  <p className="text-white font-mono text-sm">{selectedOrderData.blockHash}</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-blue-200 text-sm font-medium mb-1">Status</p>
                  <p className="text-white font-bold">{selectedOrderData.status}</p>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />
              <div className="space-y-6">
                {traceSteps.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-20"
                  >
                    <div
                      className={`absolute left-0 h-16 w-16 rounded-2xl flex items-center justify-center ${
                        step.verified ? "bg-emerald-500" : "bg-amber-500"
                      } text-white shadow-lg`}
                    >
                      <step.icon size={24} />
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 mb-1">{step.title}</h3>
                          <p className="text-slate-500 font-medium mb-1">{step.location}</p>
                          <p className="text-sm text-slate-400 font-medium">{step.date}</p>
                        </div>
                        {step.verified && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                            <CheckCircle size={12} />
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-slate-600 font-medium mb-3">{step.details}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Hash size={14} className="text-slate-400" />
                        <span className="text-slate-400 font-mono">{step.blockHash}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Blockchain Details Tab */}
        {activeTab === "blockchain" && (
          <motion.div
            key="blockchain"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Blockchain Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Transactions", value: "1,247", icon: Database, color: "blue" },
                { label: "Verified Blocks", value: "1,247", icon: Lock, color: "emerald" },
                { label: "Trust Score", value: "98.5%", icon: Award, color: "amber" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
                >
                  <div
                    className={`h-12 w-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}
                  >
                    <stat.icon size={24} />
                  </div>
                  <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-slate-500 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Latest Transaction */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-900 rounded-3xl p-8 text-white"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                  <Shield size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-1">Latest Transaction</h2>
                  <p className="text-slate-400 font-medium">Order #ORD-1001 - Verified on Chain</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm font-medium mb-1">Block Hash</p>
                  <p className="text-white font-mono text-sm">0x7a8f3d2e9b1c4f5a6e8d2c3b4a5f6e7d</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm font-medium mb-1">Timestamp</p>
                  <p className="text-white font-medium">Jan 18, 2024 14:32:45 UTC</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm font-medium mb-1">Gas Used</p>
                  <p className="text-white font-medium">21,000 Wei</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm font-medium mb-1">Confirmations</p>
                  <p className="text-white font-medium">1,247 Blocks</p>
                </div>
              </div>
            </motion.div>

            {/* Recent Blockchain Activity */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Recent Blockchain Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    type: "Order Verified",
                    order: "ORD-1001",
                    hash: "0x7a8f...3d2e",
                    time: "2 mins ago",
                    status: "success",
                  },
                  {
                    type: "Quality Check",
                    order: "ORD-1002",
                    hash: "0x9b2c...4f1a",
                    time: "15 mins ago",
                    status: "success",
                  },
                  {
                    type: "Dispatch Logged",
                    order: "ORD-1003",
                    hash: "0x3e5d...7c8b",
                    time: "1 hour ago",
                    status: "success",
                  },
                ].map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{activity.type}</p>
                        <p className="text-sm text-slate-500 font-medium">
                          {activity.order} • {activity.hash}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-emerald-600" size={32} />
                <div>
                  <h2 className="text-2xl font-black text-slate-900">10 Powerful Features</h2>
                  <p className="text-slate-600 font-medium">All features are accessible - No premium required!</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon size={24} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{feature.name}</h4>
                  <p className="text-sm text-slate-600 font-medium mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${feature.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <span className="text-xs font-bold text-slate-600">
                      {feature.active ? "Active & Ready" : "Coming Soon"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
