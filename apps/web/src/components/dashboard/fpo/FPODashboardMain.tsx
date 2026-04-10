'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Package, Truck, DollarSign, TrendingUp, TrendingDown,
  Clock, CheckCircle, AlertCircle, Building2, Leaf, BarChart3,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  totalFarmers: number;
  activeFarmers: number;
  totalCropsCollected: number;
  totalQuantityKg: number;
  activeAggregations: number;
  pendingOrders: number;
  completedOrders: number;
  inTransitOrders: number;
  totalRevenue: number;
  commissionEarned: number;
}

interface ActivityItem {
  id: string;
  icon: string;
  message: string;
  timestamp: string;
}

export default function FPODashboardMain() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsRes, activityRes] = await Promise.allSettled([
          fetch('/api/fpo/dashboard-stats'),
          fetch('/api/fpo/recent-activity'),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const data = await statsRes.value.json();
          setStats({
            totalFarmers: data.totalFarmers || 0,
            activeFarmers: data.totalFarmers || 0,
            totalCropsCollected: data.totalCrops || 0,
            totalQuantityKg: data.totalQuantity || 0,
            activeAggregations: data.activeLots || 0,
            pendingOrders: data.pendingOrders || 0,
            completedOrders: data.completedOrders || 0,
            inTransitOrders: data.inTransitOrders || 0,
            totalRevenue: data.escrowHeld || 0,
            commissionEarned: (data.escrowHeld || 0) * 0.05,
          });
        }

        if (activityRes.status === 'fulfilled' && activityRes.value.ok) {
          const actData = await activityRes.value.json();
          setActivity(actData);
        }
      } catch (error) {
        console.error('Error fetching FPO dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <RefreshCw size={48} className="text-purple-600 animate-spin" />
      </div>
    );
  }

  const s = stats || {
    totalFarmers: 0, activeFarmers: 0, totalCropsCollected: 0,
    totalQuantityKg: 0, activeAggregations: 0, pendingOrders: 0,
    completedOrders: 0, inTransitOrders: 0, totalRevenue: 0, commissionEarned: 0,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Building2 size={200} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Welcome to FPO Portal
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium">
            Manage {s.totalFarmers} farmers, {s.totalQuantityKg}kg crops collected
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farmers"
          value={s.totalFarmers}
          subtitle={`${s.activeFarmers} active`}
          icon={Users}
          gradient="from-blue-500 to-cyan-600"
          trend="+12%"
        />
        <StatCard
          title="Crops Collected"
          value={`${s.totalQuantityKg} kg`}
          subtitle={`${s.totalCropsCollected} batches`}
          icon={Leaf}
          gradient="from-purple-500 to-indigo-600"
          trend="+8%"
        />
        <StatCard
          title="Active Aggregations"
          value={s.activeAggregations}
          subtitle={`${s.pendingOrders} pending orders`}
          icon={Package}
          gradient="from-purple-500 to-indigo-600"
          trend="+5%"
        />
        <StatCard
          title="Commission Earned"
          value={`₹${s.commissionEarned.toLocaleString()}`}
          subtitle={`Total: ₹${s.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-amber-500 to-orange-600"
          trend="+15%"
        />
      </div>

      {/* Orders Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
      >
        <h2 className="text-2xl font-black text-slate-900 mb-6">Orders Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OrderStatusCard
            status="Pending"
            count={s.pendingOrders}
            icon={Clock}
            color="from-yellow-500 to-amber-600"
          />
          <OrderStatusCard
            status="In Transit"
            count={s.inTransitOrders}
            icon={Truck}
            color="from-blue-500 to-cyan-600"
          />
          <OrderStatusCard
            status="Completed"
            count={s.completedOrders}
            icon={CheckCircle}
            color="from-purple-500 to-indigo-600"
          />
        </div>
      </motion.div>

      {/* Recent Activity — from API */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
      >
        <h2 className="text-2xl font-black text-slate-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {activity.length > 0 ? (
            activity.map((item) => (
              <ActivityRow
                key={item.id}
                icon={item.icon}
                message={item.message}
                time={formatTimeAgo(item.timestamp)}
              />
            ))
          ) : (
            <>
              <ActivityRow icon="🌾" message="No recent activity yet" time="—" />
              <p className="text-sm text-slate-400 italic pl-16">Activity from crop submissions, orders, and payouts will appear here.</p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function StatCard({ title, value, subtitle, icon: Icon, gradient, trend }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-3xl p-6 shadow-lg border-2 border-slate-200 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`h-14 w-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon size={28} className="text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 px-3 py-1 bg-purple-50 rounded-xl">
            <TrendingUp size={16} className="text-purple-600" />
            <span className="text-sm font-bold text-purple-600">{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
    </motion.div>
  );
}

function OrderStatusCard({ status, count, icon: Icon, color }: any) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={32} className="opacity-80" />
        <span className="text-4xl font-black">{count}</span>
      </div>
      <p className="text-white/90 font-bold text-lg">{status}</p>
    </div>
  );
}

function ActivityRow({ icon, message, time }: any) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-slate-900">{message}</p>
        <p className="text-sm text-slate-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
