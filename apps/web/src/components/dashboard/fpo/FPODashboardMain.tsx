'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Package, Truck, DollarSign, TrendingUp, TrendingDown,
  Clock, CheckCircle, AlertCircle, Building2, Leaf, BarChart3
} from 'lucide-react';

interface DashboardStats {
  totalFarmers: number;
  activeFarmers: number;
  totalCropsCollected: number;
  totalQuantityKg: number;
  activeAggregations: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  commissionEarned: number;
}

export default function FPODashboardMain() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFarmers: 25,
    activeFarmers: 20,
    totalCropsCollected: 45,
    totalQuantityKg: 3500,
    activeAggregations: 5,
    pendingOrders: 3,
    completedOrders: 12,
    totalRevenue: 245000,
    commissionEarned: 6125,
  });

  const [revenueData, setRevenueData] = useState([65, 78, 85, 72, 90, 88, 95]);
  const [marketTrends, setMarketTrends] = useState([
    { name: 'Tomatoes', price: 42, change: 8.4 },
    { name: 'Potatoes', price: 28, change: -3.1 },
    { name: 'Wheat', price: 35, change: 5.2 },
    { name: 'Rice', price: 48, change: 12.5 },
  ]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRevenueData(prev => {
        const newData = [...prev];
        const lastIndex = newData.length - 1;
        const fluctuation = (Math.random() * 6 - 3);
        newData[lastIndex] = Math.max(85, Math.min(105, newData[lastIndex] + fluctuation));
        return newData;
      });

      setMarketTrends(prev => prev.map(trend => {
        const priceFluctuation = (Math.random() * 2 - 1);
        const newPrice = Math.max(15, trend.price * (1 + (priceFluctuation / 100)));
        const newChange = trend.change + (Math.random() * 0.4 - 0.2);
        return { 
          ...trend, 
          price: Number(newPrice.toFixed(0)),
          change: Number(newChange.toFixed(1))
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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
            Manage {stats.totalFarmers} farmers, {stats.totalQuantityKg}kg crops collected
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farmers"
          value={stats.totalFarmers}
          subtitle={`${stats.activeFarmers} active`}
          icon={Users}
          gradient="from-blue-500 to-cyan-600"
          trend="+12%"
        />
        <StatCard
          title="Crops Collected"
          value={`${stats.totalQuantityKg} kg`}
          subtitle={`${stats.totalCropsCollected} batches`}
          icon={Leaf}
          gradient="from-purple-500 to-indigo-600"
          trend="+8%"
        />
        <StatCard
          title="Active Aggregations"
          value={stats.activeAggregations}
          subtitle={`${stats.pendingOrders} pending orders`}
          icon={Package}
          gradient="from-purple-500 to-indigo-600"
          trend="+5%"
        />
        <StatCard
          title="Commission Earned"
          value={`₹${stats.commissionEarned.toLocaleString()}`}
          subtitle={`Total: ₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-amber-500 to-orange-600"
          trend="+15%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Revenue Overview</h2>
              <p className="text-sm text-slate-500 mt-1">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl">
              <TrendingUp size={20} className="text-purple-600" />
              <span className="text-sm font-bold text-purple-600">+18.2%</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-64 gap-4">
            {revenueData.map((value, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-1 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-xl relative group cursor-pointer hover:from-purple-600 hover:to-indigo-500 transition-all"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                  ₹{(value * 1000).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </motion.div>

        {/* Market Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-6">Market Trends</h2>
          <div className="space-y-4">
            {marketTrends.map((trend, index) => (
              <motion.div
                key={trend.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="font-bold text-slate-900">{trend.name}</p>
                  <p className="text-sm text-slate-500">₹{trend.price}/kg</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-xl ${
                  trend.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {trend.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="text-sm font-bold">{Math.abs(trend.change)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Orders Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
      >
        <h2 className="text-2xl font-black text-slate-900 mb-6">Orders Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OrderStatusCard
            status="Pending"
            count={stats.pendingOrders}
            icon={Clock}
            color="from-yellow-500 to-amber-600"
          />
          <OrderStatusCard
            status="In Transit"
            count={5}
            icon={Truck}
            color="from-blue-500 to-cyan-600"
          />
          <OrderStatusCard
            status="Completed"
            count={stats.completedOrders}
            icon={CheckCircle}
            color="from-purple-500 to-indigo-600"
          />
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
      >
        <h2 className="text-2xl font-black text-slate-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            icon="🌾"
            message="New crop added: 200kg Tomatoes"
            time="2 hours ago"
          />
          <ActivityItem
            icon="📦"
            message="Order accepted from Buyer ABC"
            time="5 hours ago"
          />
          <ActivityItem
            icon="💰"
            message="Payment distributed to 3 farmers"
            time="1 day ago"
          />
        </div>
      </motion.div>
    </div>
  );
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

function ActivityItem({ icon, message, time }: any) {
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
