"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertTriangle, Info, Star, TrendingUp, Shield } from "lucide-react";

interface Alert {
  id: string;
  type: "success" | "warning" | "info" | "verified";
  title: string;
  message: string;
  supplier: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  read: boolean;
}

export default function SupplierAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");

  useEffect(() => {
    // Mock alerts data
    setAlerts([
      {
        id: "1",
        type: "verified",
        title: "New Verified Supplier",
        message: "Ramesh Yadav Group has been verified and added to your network",
        supplier: "Ramesh Yadav Group",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        priority: "high",
        read: false
      },
      {
        id: "2",
        type: "success",
        title: "Price Drop Alert",
        message: "Tomato prices dropped by 8% - Great time to source!",
        supplier: "Maharashtra Farmers Co-op",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        priority: "high",
        read: false
      },
      {
        id: "3",
        type: "info",
        title: "New Product Available",
        message: "Premium Basmati Rice now available from your preferred supplier",
        supplier: "Punjab Agri Exports",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        priority: "medium",
        read: false
      },
      {
        id: "4",
        type: "warning",
        title: "Stock Running Low",
        message: "Your regular supplier has limited stock of Wheat",
        supplier: "UP Grain Traders",
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        priority: "high",
        read: true
      },
      {
        id: "5",
        type: "success",
        title: "Quality Certification",
        message: "Supplier received Grade A quality certification",
        supplier: "Karnataka Organic Farms",
        timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        priority: "medium",
        read: true
      }
    ]);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success": return CheckCircle;
      case "warning": return AlertTriangle;
      case "verified": return Shield;
      default: return Info;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "success": return "green";
      case "warning": return "amber";
      case "verified": return "blue";
      default: return "slate";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "unread") return !alert.read;
    if (filter === "high") return alert.priority === "high";
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const highPriorityCount = alerts.filter(a => a.priority === "high").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">🔔 Supplier Alerts</h2>
          <p className="text-slate-600">Real-time notifications from your supplier network</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-red-100 px-4 py-2 rounded-full">
            <span className="text-sm font-bold text-red-700">{unreadCount} Unread</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Bell size={24} className="text-blue-600" />
            <div className="text-sm text-blue-700 font-bold">Total Alerts</div>
          </div>
          <div className="text-4xl font-black text-blue-900">{alerts.length}</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={24} className="text-red-600" />
            <div className="text-sm text-red-700 font-bold">High Priority</div>
          </div>
          <div className="text-4xl font-black text-red-900">{highPriorityCount}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="text-green-600" />
            <div className="text-sm text-green-700 font-bold">Verified Today</div>
          </div>
          <div className="text-4xl font-black text-green-900">3</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: "all", label: "All Alerts", count: alerts.length },
          { id: "unread", label: "Unread", count: unreadCount },
          { id: "high", label: "High Priority", count: highPriorityCount }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              filter === tab.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert, idx) => {
          const Icon = getAlertIcon(alert.type);
          const color = getAlertColor(alert.type);
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-2xl p-6 border-2 ${
                alert.read ? "border-slate-200" : "border-blue-500"
              } hover:shadow-xl transition-all cursor-pointer group`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`h-14 w-14 rounded-xl bg-${color}-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon size={28} className={`text-${color}-600`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 mb-1">{alert.title}</h3>
                      <p className="text-sm text-slate-600">{alert.message}</p>
                    </div>
                    {!alert.read && (
                      <div className="h-3 w-3 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Star size={14} className="text-amber-500" />
                      <span className="font-bold">{alert.supplier}</span>
                    </div>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{getTimeAgo(alert.timestamp)}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className={`text-xs font-bold ${
                      alert.priority === "high" ? "text-red-600" : 
                      alert.priority === "medium" ? "text-amber-600" : "text-slate-600"
                    }`}>
                      {alert.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all text-sm">
                      View Details
                    </button>
                    <button className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all text-sm">
                      Mark as Read
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Alert Preferences */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Bell size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">Alert Preferences</h3>
              <p className="text-purple-100">Customize your notification settings</p>
            </div>
          </div>
          <button className="h-12 px-6 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}
