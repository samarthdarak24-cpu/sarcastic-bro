"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, AlertCircle, MapPin } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface OrderActivity {
  id: string;
  type: "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";
  title: string;
  description: string;
  timestamp: string;
  status: string;
  orderId: string;
}

export default function OrderActivityFeed() {
  const [activities, setActivities] = useState<OrderActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_URL}/api/buyer/cockpit`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const recentActivity = data.data.recentActivity || [];
        setActivities(recentActivity.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setActivities(getMockActivities());
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const getMockActivities = (): OrderActivity[] => [
    {
      id: "1",
      type: "placed",
      title: "New Order Placed",
      description: "Basmati Rice 1000kg - Order #ORD-1234",
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      status: "processing",
      orderId: "ORD-1234"
    },
    {
      id: "2",
      type: "confirmed",
      title: "Order Confirmed",
      description: "Tomatoes 500kg - Order #ORD-1233",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      status: "confirmed",
      orderId: "ORD-1233"
    },
    {
      id: "3",
      type: "shipped",
      title: "Order Shipped",
      description: "Wheat 2000kg - Order #ORD-1232",
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      status: "in_transit",
      orderId: "ORD-1232"
    },
    {
      id: "4",
      type: "delivered",
      title: "Order Delivered",
      description: "Onions 800kg - Order #ORD-1231",
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
      status: "delivered",
      orderId: "ORD-1231"
    },
    {
      id: "5",
      type: "shipped",
      title: "Order Shipped",
      description: "Cotton 300kg - Order #ORD-1230",
      timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
      status: "in_transit",
      orderId: "ORD-1230"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "placed": return Package;
      case "confirmed": return CheckCircle;
      case "shipped": return Truck;
      case "delivered": return CheckCircle;
      case "cancelled": return AlertCircle;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "placed": return "blue";
      case "confirmed": return "green";
      case "shipped": return "purple";
      case "delivered": return "emerald";
      case "cancelled": return "red";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Loading activity feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">📦 Order Activity Feed</h2>
          <p className="text-slate-600">Real-time order updates and tracking</p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
          <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-green-700">LIVE</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-bold mb-1">In Progress</div>
          <div className="text-3xl font-black text-blue-900">12</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
          <div className="text-sm text-purple-700 font-bold mb-1">In Transit</div>
          <div className="text-3xl font-black text-purple-900">8</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
          <div className="text-sm text-green-700 font-bold mb-1">Delivered Today</div>
          <div className="text-3xl font-black text-green-900">5</div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
          <div className="text-sm text-amber-700 font-bold mb-1">Pending</div>
          <div className="text-3xl font-black text-amber-900">3</div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
        <h3 className="text-xl font-black text-slate-900 mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {activities.map((activity, idx) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer group"
              >
                {/* Timeline Line */}
                {idx < activities.length - 1 && (
                  <div className="absolute left-[52px] top-[72px] w-0.5 h-16 bg-slate-200" />
                )}

                {/* Icon */}
                <div className={`h-12 w-12 rounded-xl bg-${color}-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={`text-${color}-600`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-black text-slate-900">{activity.title}</h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700`}>
                      {activity.status.replace("_", " ").toUpperCase()}
                    </span>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      Track Order →
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Map View */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 border-2 border-slate-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">Live Tracking Map</h3>
            <p className="text-slate-600">8 shipments in transit</p>
          </div>
          <MapPin size={32} className="text-blue-600" />
        </div>
        
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="text-slate-400 mb-4">
            <MapPin size={48} className="mx-auto mb-2" />
            <p className="font-bold">Interactive map view</p>
            <p className="text-sm">Track all shipments in real-time</p>
          </div>
          <button className="h-12 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
            View Full Map
          </button>
        </div>
      </div>
    </div>
  );
}
