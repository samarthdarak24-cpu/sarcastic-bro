'use client';

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Truck, DollarSign, TrendingUp as TrendingUpIcon,
  Clock, Box, Sun, ChevronRight, Home,
  ShoppingCart, Activity, UserCheck, Package, FileCheck,
  Building2, BarChart3, MapPin, Wallet, Languages, Store
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import AIQualityShield from "@/components/dashboard/farmer/AIQualityShield";
import CropListing from "@/components/dashboard/farmer/CropListing";
import QualityCertificate from "@/components/dashboard/farmer/QualityCertificate";
import MarketPrices from "@/components/dashboard/farmer/MarketPrices";
import Earnings from "@/components/dashboard/farmer/Earnings";
import Orders from "@/components/dashboard/farmer/Orders";
import KYC from "@/components/dashboard/farmer/KYC";
import FPOLinking from "@/components/dashboard/farmer/FPOLinking";
import Logistics from "@/components/dashboard/farmer/Logistics";
import Certificates from "@/components/dashboard/farmer/Certificates";
import LanguageSettings from "@/components/dashboard/farmer/LanguageSettings";

const navItems = [
  { label: 'Dashboard', href: '/farmer/dashboard', section: 'dashboard', icon: <Home /> },
  { label: 'KYC & Profile', href: '/farmer/dashboard', section: 'kyc', icon: <UserCheck /> },
  { label: 'Crop Listing', href: '/farmer/dashboard', section: 'crops', icon: <Package /> },
  { label: 'Quality Certificate', href: '/farmer/dashboard', section: 'certificate', icon: <FileCheck /> },
  { label: 'FPO Linking', href: '/farmer/dashboard', section: 'fpo', icon: <Building2 /> },
  { label: 'Market Prices', href: '/farmer/dashboard', section: 'market', icon: <BarChart3 /> },
  { label: 'My Orders', href: '/farmer/dashboard', section: 'myorders', icon: <ShoppingCart /> },
  { label: 'Order Tracking', href: '/farmer/dashboard', section: 'orders', icon: <MapPin /> },
  { label: 'Wallet', href: '/farmer/dashboard', section: 'wallet', icon: <Wallet /> },
  { label: 'Analytics', href: '/farmer/dashboard', section: 'analytics', icon: <Activity /> },
  { label: 'Escrow Payments', href: '/farmer/dashboard', section: 'escrow', icon: <DollarSign /> },
  { label: 'Earnings', href: '/farmer/dashboard', section: 'earnings', icon: <Wallet /> },
  { label: 'Logistics', href: '/farmer/dashboard', section: 'logistics', icon: <Truck /> },
  { label: 'Language', href: '/farmer/dashboard', section: 'language', icon: <Languages /> },
];

function FarmerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedSection = searchParams.get('section') || 'dashboard';
  
  const [userData, setUserData] = useState({
    name: "Rajesh Kumar",
    role: "Premium Farmer",
    location: "Pune, Maharashtra",
    avatar: null as string | null,
    email: "rajesh@farmguard.in",
    phone: "+91 9876543210",
    farmSize: "12 Acres",
  });

  const [stats, setStats] = useState({
    activeOrders: '0',
    revenueToday: '₹0',
    productsListed: '0',
    pendingPayments: '0'
  });

  const [revenueData] = useState([65, 78, 85, 72, 90, 88, 95]);
  const [currentTemp, setCurrentTemp] = useState(24);
  const [weatherCondition, setWeatherCondition] = useState("Clear Skies");
  const [marketTrendsData, setMarketTrendsData] = useState([
    { name: 'Tomatoes', price: 42, change: 8.4, available: '2.5T' },
    { name: 'Potatoes', price: 28, change: -3.1, available: '5T' },
    { name: 'Wheat', price: 35, change: 5.2, available: '10T' },
    { name: 'Rice', price: 48, change: 12.5, available: '8T' },
    { name: 'Onions', price: 32, change: -2.4, available: '3T' },
    { name: 'Carrots', price: 38, change: 6.8, available: '1.5T' }
  ]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/farmer/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data) {
        setStats({
          activeOrders: String(data.pendingOrders || 0),
          revenueToday: `₹${((data.totalEarnings || 0) / 1000).toFixed(1)}k`,
          productsListed: String(data.totalCrops || 0),
          pendingPayments: String(data.pendingOrders || 0)
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUserData({ ...userData, ...JSON.parse(userString) });
    }
    fetchStats();

    const interval = setInterval(() => {
      setCurrentTemp(prev => {
        const fluctuation = Math.random() * 0.4 - 0.2;
        return Number(Math.max(18, Math.min(42, prev + fluctuation)).toFixed(1));
      });

      setMarketTrendsData(prev => prev.map(trend => {
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

  const showDashboard = selectedSection === 'dashboard';
  const showAI = selectedSection === 'ai';
  const showCrops = selectedSection === 'crops';
  const showCertificate = selectedSection === 'certificate';
  const showMarket = selectedSection === 'market';
  const showEarnings = selectedSection === 'earnings';
  const showOrders = selectedSection === 'orders';
  const showMyOrders = selectedSection === 'myorders';
  const showKYC = selectedSection === 'kyc';
  const showFPO = selectedSection === 'fpo';
  const showLogistics = selectedSection === 'logistics';
  const showWallet = selectedSection === 'wallet';
  const showAnalytics = selectedSection === 'analytics';
  const showEscrow = selectedSection === 'escrow';
  const showLang = selectedSection === 'language';

  return (
    <DashboardLayout navItems={navItems} userRole="farmer">
      <AnimatePresence mode="wait">
        {showDashboard && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Welcome Header (Matches Buyer's Header styling) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 p-8 text-white shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-black mb-2">Welcome Back, {userData.name}! 🌾</h1>
                    <p className="text-green-50 text-lg">Your farm is thriving. Here's your complete overview.</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <Sparkles size={32} className="text-yellow-300" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-8">
                  {[
                    { label: 'Active Orders', value: stats.activeOrders, icon: ShoppingCart, color: 'from-blue-400 to-cyan-500' },
                    { label: 'Revenue Today', value: stats.revenueToday, icon: TrendingUpIcon, color: 'from-amber-400 to-orange-500' },
                    { label: 'Products Listed', value: stats.productsListed, icon: Box, color: 'from-purple-400 to-pink-500' },
                    { label: 'Pending Payments', value: stats.pendingPayments, icon: Clock, color: 'from-rose-400 to-red-500' },
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
                      <p className="text-xs text-green-100 font-medium">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Crop Analyzer Promo (Keeping this but scaling it neatly like buyer components) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => router.push('/farmer/dashboard?section=ai')}
              className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-lg">
                  <Sparkles size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-cyan-100 text-cyan-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Featured</span>
                    <h3 className="text-xl font-black text-slate-800">Advanced AI Crop Analyzer</h3>
                  </div>
                  <p className="text-slate-500 font-medium">Production-grade quality analysis with real defect detection & grading.</p>
                </div>
                <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
                  Launch Scanner <ChevronRight size={18} />
                </div>
              </div>
            </motion.div>

            {/* Dashboard Grid (MATCHING BUYER'S 12-COL LAYOUT!) */}
            <div className="grid grid-cols-12 gap-6">
              {/* Revenue Chart (8 columns) */}
              <div className="col-span-8 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Revenue Overview</h3>
                    <p className="text-sm text-slate-500">Last 7 days performance</p>
                  </div>
                </div>
                <div className="flex items-end justify-between h-48 gap-3">
                  {revenueData.map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 + i * 0.1 }}
                      className={`flex-1 ${i === revenueData.length - 1 ? 'bg-gradient-to-t from-emerald-600 to-green-400' : 'bg-gradient-to-t from-green-500 to-emerald-400'} rounded-t-xl relative group cursor-pointer`}
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

              {/* Weather Widget (4 columns) */}
              <div className="col-span-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-green-100 mb-1">LOCAL FORECAST</p>
                    <h3 className="text-4xl font-black">{currentTemp}°C</h3>
                  </div>
                  <Sun size={48} className="text-yellow-200" />
                </div>
                <p className="text-sm text-green-100 mb-6">{weatherCondition}</p>
                <div className="bg-white/20 p-4 rounded-xl mt-4 backdrop-blur">
                   <p className="text-sm font-medium text-white">Ideal conditions for harvesting wheat today.</p>
                </div>
              </div>

              {/* Market Trends (12 columns! This was only 6 in original farmer, making it squished) */}
              <div className="col-span-12 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-xl font-black text-slate-900 mb-6">Live Market Prices</h3>
                <div className="grid grid-cols-6 gap-4">
                  {marketTrendsData.map((trend) => (
                    <motion.div
                      key={trend.name}
                      whileHover={{ y: -4 }}
                      className="bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-green-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">{trend.name}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {trend.change >= 0 ? '+' : ''}{trend.change}%
                        </span>
                      </div>
                      <p className="text-2xl font-black text-slate-900">₹{trend.price}/kg</p>
                      <p className="text-xs text-slate-500 mt-1">{trend.available} estimated</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showAI && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AIQualityShield />
          </motion.div>
        )}

        {showCrops && (
          <motion.div
            key="crops"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CropListing />
          </motion.div>
        )}

        {showCertificate && (
          <motion.div
            key="certificate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <QualityCertificate />
          </motion.div>
        )}

        {showMarket && (
          <motion.div
            key="market"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <MarketPrices />
          </motion.div>
        )}

        {showEarnings && (
          <motion.div
            key="earnings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Earnings />
          </motion.div>
        )}

        {showOrders && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Orders />
          </motion.div>
        )}

        {showKYC && (
          <motion.div
            key="kyc"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <KYC />
          </motion.div>
        )}

        {showFPO && (
          <motion.div
            key="fpo"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FPOLinking />
          </motion.div>
        )}

        {showMyOrders && (
          <motion.div
            key="myorders"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Orders />
          </motion.div>
        )}

        {showLogistics && (
          <motion.div
            key="logistics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Logistics />
          </motion.div>
        )}

        {showWallet && (
          <motion.div
            key="wallet"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Wallet Coming Soon</h3>
            <p className="text-slate-500">Digital wallet feature is under development.</p>
          </motion.div>
        )}

        {showAnalytics && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={40} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-slate-500">Advanced analytics dashboard is under development.</p>
          </motion.div>
        )}

        {showEscrow && (
          <motion.div
            key="escrow"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign size={40} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Escrow Payments Coming Soon</h3>
            <p className="text-slate-500">Secure escrow payment system is under development.</p>
          </motion.div>
        )}

        {showLang && (
          <motion.div
            key="language"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <LanguageSettings />
          </motion.div>
        )}

        {!showDashboard && !showAI && !showCrops && !showCertificate && !showMarket && !showEarnings && !showOrders && !showMyOrders && !showKYC && !showFPO && !showLogistics && !showWallet && !showAnalytics && !showEscrow && !showLang && (
           <motion.div
             key="other"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center"
           >
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Activity size={40} className="text-green-600" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">Section Coming Soon</h3>
             <p className="text-slate-500">This feature is currently under active development.</p>
           </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default function FarmerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FarmerDashboardContent />
    </Suspense>
  );
}
