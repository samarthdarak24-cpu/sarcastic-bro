'use client';

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, TrendingUp as TrendingUpIcon,
  Clock, Users, BarChart3,
  Activity, Sun, Building2, Wallet, Store, Filter,
  FileCheck, Package, DollarSign, CheckCircle, MessageCircle, MapPin
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const navItems = [
  { label: 'Dashboard', href: '/buyer/dashboard', section: 'dashboard', icon: <BarChart3 /> },
  { label: 'Business KYC', href: '/buyer/dashboard', section: 'kyc', icon: <Building2 /> },
  { label: 'Wallet System', href: '/buyer/dashboard', section: 'wallet', icon: <Wallet /> },
  { label: 'Aggregated Marketplace', href: '/buyer/dashboard', section: 'marketplace', icon: <Store /> },
  { label: 'Advanced Filters', href: '/buyer/dashboard', section: 'filters', icon: <Filter /> },
  { label: 'Quality Certificates', href: '/buyer/dashboard', section: 'certificates', icon: <FileCheck /> },
  { label: 'Bulk Order', href: '/buyer/dashboard', section: 'bulk-order', icon: <Package /> },
  { label: 'Escrow Payment', href: '/buyer/dashboard', section: 'escrow', icon: <DollarSign /> },
  { label: 'Delivery Approval', href: '/buyer/dashboard', section: 'delivery', icon: <CheckCircle /> },
  { label: 'Real-Time Chat', href: '/buyer/dashboard', section: 'chat', icon: <MessageCircle /> },
  { label: 'Order & Supply Tracking', href: '/buyer/dashboard', section: 'tracking', icon: <MapPin /> },
];

function BuyerDashboardContent() {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  
  const [userData] = useState({
    name: "Priya Sharma",
    role: "Premium Buyer",
    company: "Fresh Foods Ltd",
    avatar: null as string | null,
  });

  const [purchaseData] = useState([70, 85, 78, 92, 88, 95, 98]);
  const [currentTemp, setCurrentTemp] = useState(26);
  const [marketTrendsData, setMarketTrendsData] = useState([
    { name: 'Tomatoes', price: 42, change: 8.4, available: '2.5T' },
    { name: 'Potatoes', price: 28, change: -3.1, available: '5T' },
    { name: 'Wheat', price: 35, change: 5.2, available: '10T' },
    { name: 'Rice', price: 48, change: 12.5, available: '8T' },
    { name: 'Onions', price: 32, change: -2.4, available: '3T' },
    { name: 'Carrots', price: 38, change: 6.8, available: '1.5T' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp(prev => Number(Math.max(18, Math.min(42, prev + (Math.random() * 0.4 - 0.2))).toFixed(1)));
      setMarketTrendsData(prev => prev.map(trend => ({
        ...trend,
        price: Number(Math.max(15, trend.price * (1 + ((Math.random() * 2 - 1) / 100))).toFixed(0)),
        change: Number((trend.change + (Math.random() * 0.4 - 0.2)).toFixed(1))
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showDashboard = selectedSection === 'dashboard';

  return (
    <DashboardLayout navItems={navItems} userRole="buyer">
      <AnimatePresence mode="wait">
        {showDashboard && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Welcome Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-600 to-blue-700 p-8 text-white shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-black mb-2">Welcome Back, {userData.name}! 🛒</h1>
                    <p className="text-blue-50 text-lg">Your procurement dashboard is ready.</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <ShoppingBag size={32} className="text-yellow-300" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-8">
                  {[
                    { label: 'Active Orders', value: '18', icon: ShoppingBag, color: 'from-cyan-400 to-blue-500' },
                    { label: 'Total Spend', value: '₹2.8L', icon: TrendingUpIcon, color: 'from-amber-400 to-orange-500' },
                    { label: 'Suppliers', value: '42', icon: Users, color: 'from-purple-400 to-pink-500' },
                    { label: 'Pending Delivery', value: '5', icon: Clock, color: 'from-rose-400 to-red-500' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon size={20} className="text-white" />
                      </div>
                      <p className="text-2xl font-black mb-1">{stat.value}</p>
                      <p className="text-xs text-blue-100 font-medium">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Purchase Chart */}
              <div className="col-span-8 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Purchase Overview</h3>
                    <p className="text-sm text-slate-500">Last 7 days performance</p>
                  </div>
                </div>
                <div className="flex items-end justify-between h-48 gap-3">
                  {purchaseData.map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 + i * 0.1 }}
                      className={`flex-1 ${i === purchaseData.length - 1 ? 'bg-gradient-to-t from-blue-600 to-cyan-400' : 'bg-gradient-to-t from-blue-500 to-cyan-400'} rounded-t-xl relative group cursor-pointer`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        ₹{(height * 1000).toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day} className="flex-1 text-center">{day}</span>)}
                </div>
              </div>

              {/* Weather Widget */}
              <div className="col-span-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-cyan-100 mb-1">MARKET TEMP</p>
                    <h3 className="text-4xl font-black">{currentTemp}°C</h3>
                  </div>
                  <Sun size={48} className="text-yellow-200" />
                </div>
                <p className="text-sm text-cyan-100 mb-6">Optimal buying conditions</p>
              </div>

              {/* Market Trends */}
              <div className="col-span-12 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-xl font-black text-slate-900 mb-6">Live Market Prices</h3>
                <div className="grid grid-cols-6 gap-4">
                  {marketTrendsData.map((trend) => (
                    <motion.div
                      key={trend.name}
                      whileHover={{ y: -4 }}
                      className="bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">{trend.name}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {trend.change >= 0 ? '+' : ''}{trend.change}%
                        </span>
                      </div>
                      <p className="text-2xl font-black text-slate-900">₹{trend.price}/kg</p>
                      <p className="text-xs text-slate-500 mt-1">{trend.available} available</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!showDashboard && (
          <motion.div
            key="other"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={40} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Feature Coming Soon</h3>
            <p className="text-slate-500">This section is under development. Check back soon!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BuyerDashboardContent />
    </Suspense>
  );
}
