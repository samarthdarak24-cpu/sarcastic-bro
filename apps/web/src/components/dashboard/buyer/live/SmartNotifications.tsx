"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertTriangle, Info, Zap, Package, DollarSign, TrendingUp } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "urgent";
  category: "order" | "price" | "supplier" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
}

export default function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all");

  useEffect(() => {
    // Mock notifications
    setNotifications([
      {
        id: "1",
        type: "urgent",
        category: "price",
        title: "Price Alert: Tomatoes",
        message: "Tomato prices dropped 8% in Maharashtra. Optimal buying opportunity!",
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        read: false,
        actionable: true
      },
      {
        id: "2",
        type: "success",
        category: "order",
        title: "Order Delivered",
        message: "Order #ORD-1234 (Basmati Rice 1000kg) delivered successfully",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        read: false,
        actionable: false
      },
      {
        id: "3",
        type: "info",
        category: "supplier",
        title: "New Supplier Verified",
        message: "Ramesh Yadav Group completed verification. Grade A certified.",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        read: false,
        actionable: true
      },
      {
        id: "4",
        type: "warning",
        category: "order",
        title: "Delivery Delay",
        message: "Order #ORD-1233 delayed by 1 day due to weather conditions",
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        read: true,
        actionable: false
      },
      {
        id: "5",
        type: "success",
        category: "price",
        title: "Negotiation Won",
        message: "Successfully negotiated 12% discount on bulk wheat order",
        timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        read: true,
        actionable: false
      }
    ]);
  }, []);

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case "order": return Package;
      case "price": return DollarSign;
      case "supplier": return CheckCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "green";
      case "warning": return "amber";
      case "urgent": return "red";
      default: return "blue";
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

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.read;
    if (filter === "urgent") return notif.type === "urgent";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.type === "urgent").length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">📬 Smart Notifications</h2>
          <p className="text-slate-600">Real-time alerts and intelligent updates</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="h-12 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Mark All Read
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Bell size={24} className="text-blue-600" />
            <div className="text-sm text-blue-700 font-bold">Total Notifications</div>
          </div>
          <div className="text-4xl font-black text-blue-900">{notifications.length}</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={24} className="text-red-600" />
            <div className="text-sm text-red-700 font-bold">Urgent</div>
          </div>
          <div className="text-4xl font-black text-red-900">{urgentCount}</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
          <div className="flex items-center gap-3 mb-2">
            <Info size={24} className="text-amber-600" />
            <div className="text-sm text-amber-700 font-bold">Unread</div>
          </div>
          <div className="text-4xl font-black text-amber-900">{unreadCount}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: "all", label: "All", count: notifications.length },
          { id: "unread", label: "Unread", count: unreadCount },
          { id: "urgent", label: "Urgent", count: urgentCount }
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

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notif, idx) => {
          const Icon = getNotificationIcon(notif.category);
          const color = getNotificationColor(notif.type);
          
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-2xl p-6 border-2 ${
                notif.read ? "border-slate-200" : "border-blue-500"
              } hover:shadow-xl transition-all cursor-pointer group`}
              onClick={() => markAsRead(notif.id)}
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-black text-slate-900">{notif.title}</h3>
                        {!notif.read && (
                          <div className="h-2 w-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{notif.message}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700 whitespace-nowrap ml-2`}>
                      {notif.type.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-slate-500">{getTimeAgo(notif.timestamp)}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 capitalize">{notif.category}</span>
                    
                    {notif.actionable && (
                      <>
                        <span className="text-xs text-slate-400">•</span>
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                          Take Action →
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Smart Insights Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Zap size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">Smart Notification Engine</h3>
              <p className="text-purple-100">AI-powered alerts tailored to your procurement patterns</p>
            </div>
          </div>
          <button className="h-12 px-6 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all whitespace-nowrap">
            Configure
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
        <h3 className="text-xl font-black text-slate-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-3">
          {[
            { label: "Price Alerts", enabled: true, description: "Get notified of price changes" },
            { label: "Order Updates", enabled: true, description: "Track order status changes" },
            { label: "Supplier Alerts", enabled: true, description: "New suppliers and verifications" },
            { label: "AI Recommendations", enabled: false, description: "Smart procurement suggestions" }
          ].map((pref, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
            >
              <div>
                <div className="font-bold text-slate-900">{pref.label}</div>
                <div className="text-sm text-slate-600">{pref.description}</div>
              </div>
              <button
                className={`h-8 w-14 rounded-full transition-all ${
                  pref.enabled ? "bg-green-600" : "bg-slate-300"
                }`}
              >
                <div className={`h-6 w-6 bg-white rounded-full transition-all ${
                  pref.enabled ? "ml-7" : "ml-1"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
