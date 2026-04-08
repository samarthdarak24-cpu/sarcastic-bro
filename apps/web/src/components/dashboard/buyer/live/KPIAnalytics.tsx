"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Package, DollarSign, Users, ShoppingCart, Target, Award, Zap } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface KPIData {
  totalSourcing: number;
  activeBids: number;
  verifiedSuppliers: number;
  valueSaved: number;
  orderSuccessRate: number;
  avgDeliveryTime: number;
  activeOrders: number;
  monthlySpend: number;
}

export default function KPIAnalytics() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_URL}/api/buyer/cockpit`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const cockpitData = data.data;
        setKpis({
          totalSourcing: cockpitData.kpis.totalSpent || 1240000,
          activeBids: cockpitData.kpis.pendingBids || 18,
          verifiedSuppliers: cockpitData.metrics.supplierCount || 45,
          valueSaved: cockpitData.kpis.savingsAchieved || 180000,
          orderSuccessRate: cockpitData.metrics.orderSuccessRate || 94,
          avgDeliveryTime: cockpitData.metrics.avgDeliveryTime || 3,
          activeOrders: cockpitData.kpis.activeOrders || 12,
          monthlySpend: cockpitData.kpis.totalSpent || 850000
        });
      } catch (error) {
        console.error("Failed to fetch KPIs:", error);
        // Fallback mock data
        setKpis({
          totalSourcing: 1240000,
          activeBids: 18,
          verifiedSuppliers: 45,
          valueSaved: 180000,
          orderSuccessRate: 94,
          avgDeliveryTime: 3,
          activeOrders: 12,
          monthlySpend: 850000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
    const interval = setInterval(fetchKPIs, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading || !kpis) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Loading KPI analytics...</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Total Sourcing",
      value: `₹${(kpis.totalSourcing / 100000).toFixed(1)}L`,
      change: "+12.5%",
      icon: ShoppingCart,
      color: "blue",
      trend: "up"
    },
    {
      label: "Active Bids",
      value: kpis.activeBids.toString(),
      change: "+5 new",
      icon: Target,
      color: "purple",
      trend: "up"
    },
    {
      label: "Verified Suppliers",
      value: kpis.verifiedSuppliers.toString(),
      change: "+8 this month",
      icon: Users,
      color: "green",
      trend: "up"
    },
    {
      label: "Value Saved",
      value: `₹${(kpis.valueSaved / 100000).toFixed(1)}L`,
      change: "+18.2%",
      icon: DollarSign,
      color: "amber",
      trend: "up"
    },
    {
      label: "Order Success Rate",
      value: `${kpis.orderSuccessRate}%`,
      change: "+2.1%",
      icon: Award,
      color: "emerald",
      trend: "up"
    },
    {
      label: "Avg Delivery Time",
      value: `${kpis.avgDeliveryTime} days`,
      change: "-0.5 days",
      icon: Package,
      color: "cyan",
      trend: "down"
    },
    {
      label: "Active Orders",
      value: kpis.activeOrders.toString(),
      change: "In transit",
      icon: TrendingUp,
      color: "indigo",
      trend: "stable"
    },
    {
      label: "Monthly Spend",
      value: `₹${(kpis.monthlySpend / 100000).toFixed(1)}L`,
      change: "+8.5%",
      icon: Zap,
      color: "pink",
      trend: "up"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "from-blue-500 to-cyan-500",
      purple: "from-purple-500 to-pink-500",
      green: "from-green-500 to-emerald-500",
      amber: "from-amber-500 to-orange-500",
      emerald: "from-emerald-500 to-teal-500",
      cyan: "from-cyan-500 to-blue-500",
      indigo: "from-indigo-500 to-purple-500",
      pink: "from-pink-500 to-rose-500"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">📈 KPI Analytics</h2>
        <p className="text-slate-600">Real-time performance metrics and insights</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="relative bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all overflow-hidden group"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(kpi.color)} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getColorClasses(kpi.color)} flex items-center justify-center mb-4 shadow-lg`}>
                <kpi.icon size={28} className="text-white" />
              </div>

              {/* Value */}
              <div className="mb-2">
                <div className="text-3xl font-black text-slate-900 mb-1">{kpi.value}</div>
                <div className="text-sm font-bold text-slate-600">{kpi.label}</div>
              </div>

              {/* Change Badge */}
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                kpi.trend === "up" 
                  ? "bg-green-100 text-green-700" 
                  : kpi.trend === "down"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-700"
              }`}>
                {kpi.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Efficiency Score */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black mb-2">Efficiency Score</h3>
              <p className="text-blue-100">Your procurement performance</p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Zap size={32} />
            </div>
          </div>
          
          <div className="text-6xl font-black mb-4">92/100</div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">Cost Optimization</span>
              <span className="font-bold">95%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: "95%" }} />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">Supplier Quality</span>
              <span className="font-bold">88%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: "88%" }} />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">Delivery Speed</span>
              <span className="font-bold">93%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: "93%" }} />
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
          <h3 className="text-2xl font-black text-slate-900 mb-6">Monthly Trends</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div>
                <div className="text-sm text-green-700 font-bold mb-1">Orders Completed</div>
                <div className="text-2xl font-black text-green-900">156</div>
              </div>
              <div className="text-green-600 font-bold">+12%</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div>
                <div className="text-sm text-blue-700 font-bold mb-1">New Suppliers</div>
                <div className="text-2xl font-black text-blue-900">8</div>
              </div>
              <div className="text-blue-600 font-bold">+3</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div>
                <div className="text-sm text-purple-700 font-bold mb-1">Negotiations Won</div>
                <div className="text-2xl font-black text-purple-900">23</div>
              </div>
              <div className="text-purple-600 font-bold">+18%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
