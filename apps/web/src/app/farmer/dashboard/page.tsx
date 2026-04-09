"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Sparkles, Package, Truck, DollarSign, Gavel, Award,
  ShieldAlert, BarChart3, Brain, TrendingUp, Target,
  Camera, Leaf, Globe, Lock, Zap, ChevronRight, Menu,
  User, Cloud, Sun, CloudRain, Droplets, TrendingUp as TrendingUpIcon,
  Clock, CheckCircle, AlertCircle, Plus, Box, Archive, Sprout,
  LineChart, Lightbulb, ShoppingCart, MapPin, Settings,
  Wallet, Shield, Building, FileText, Briefcase, Star,
  Link as LinkIcon, LayoutDashboard, Home, Activity, X, RefreshCw, MessageSquare
} from "lucide-react";

import AIQualityShield from "@/components/dashboard/farmer/AIQualityShield";
import { BehavioralInsights } from "@/components/dashboard/farmer/BehavioralInsights";
import OrdersLogisticsComplete from "@/components/dashboard/farmer/OrdersLogisticsComplete";
import FarmInsights from "@/components/dashboard/farmer/FarmInsights";
import AgriIntelligence from "@/components/dashboard/farmer/AgriIntelligence";
import MarketIntelligenceHub from "@/components/dashboard/farmer/MarketIntelligenceHub";
import { SmartProductHub } from "@/components/dashboard/farmer/SmartProductHub";
import { SmartInventoryHub } from "@/components/dashboard/farmer/SmartInventoryHub";
import { AgriChatAdvanced } from "@/components/dashboard/farmer/AgriChatAdvanced";
import { CropQualityDetector } from "@/components/dashboard/farmer/CropQualityDetector";
import CropManagementHub from "@/components/dashboard/farmer/CropManagementHub";
import OrderControl from "@/components/dashboard/farmer/OrderControl";
import { LogisticsManager } from "@/components/dashboard/farmer/LogisticsManager";
import AutoSellRulesAdvanced from "@/components/dashboard/farmer/AutoSellRulesAdvanced";
import AgriPayCenter from "@/components/dashboard/farmer/AgriPayCenter";
import { EscrowHub } from "@/components/dashboard/farmer/EscrowHub";
import FinancialHub from "@/components/dashboard/farmer/FinancialHub";
import { PriceProtectionHub } from "@/components/dashboard/farmer/PriceProtectionHub";
import TenderBidsHub from "@/components/dashboard/farmer/TenderBidsHub";
import { TenderParticipation } from "@/components/dashboard/farmer/TenderParticipation";
import BulkAggregationEngine from "@/components/dashboard/farmer/BulkAggregationEngine";
import TrustIdentity from "@/components/dashboard/farmer/TrustIdentity";
import { ReputationHub } from "@/components/dashboard/farmer/ReputationHub";
import { BlockchainTrace } from "@/components/dashboard/farmer/BlockchainTrace";
import { SecurityDashboard } from "@/components/dashboard/farmer/SecurityDashboard";
import { ComplianceTracking } from "@/components/dashboard/farmer/ComplianceTracking";
import GlobalExportAudit from "@/components/dashboard/farmer/GlobalExportAudit";
import FloatingAIChatbot from "@/components/ui/FloatingAIChatbot";

// Feature categories with sub-features
const categories = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    color: 'green',
    features: []
  },
  {
    id: 'ai-quality-shield',
    name: 'AI Crop Analyzer',
    icon: Sparkles,
    color: 'cyan',
    features: []
  },
  {
    id: 'production',
    name: 'Production & Supply',
    icon: Leaf,
    color: 'emerald',
    features: [
      { id: 'product-hub', name: 'Product Hub', component: SmartProductHub, icon: Box, color: 'from-emerald-500 to-green-600' },
      { id: 'inventory', name: 'Inventory', component: SmartInventoryHub, icon: Archive, color: 'from-green-500 to-emerald-600' },
      { id: 'crop-management', name: 'Crop Management', component: CropManagementHub, icon: Sprout, color: 'from-lime-500 to-green-600' },
      { id: 'crop-quality', name: 'Crop Quality Detector', component: CropQualityDetector, icon: Camera, color: 'from-green-500 to-lime-600' },
    ]
  },
  {
    id: 'ai',
    name: 'AI Intelligence',
    icon: Sparkles,
    color: 'purple',
    features: [
      { id: 'ai-hub', name: 'Ultimate AI Hub', component: () => { if (typeof window !== 'undefined') window.location.href = '/ai-assistant'; return null; }, icon: Sparkles, color: 'from-amber-400 to-orange-500' },
      { id: 'ai-chat-bot', name: 'AI Chat Bot', component: AgriChatAdvanced, icon: MessageSquare, color: 'from-indigo-600 to-violet-600' },
      { id: 'farm-insights', name: 'Farm Insights', component: FarmInsights, icon: LineChart, color: 'from-purple-500 to-pink-600' },
      { id: 'agri-intelligence', name: 'Agri Intelligence', component: AgriIntelligence, icon: Brain, color: 'from-violet-500 to-purple-600' },
      { id: 'market-intelligence', name: 'Market Intelligence', component: MarketIntelligenceHub, icon: TrendingUp, color: 'from-indigo-500 to-purple-600' },
      { id: 'behavioral-insights', name: 'Behavioral Insights', component: BehavioralInsights, icon: Target, color: 'from-pink-500 to-purple-600' },
      { id: 'ai-quality-shield', name: 'AI Crop Analyzer', component: AIQualityShield, icon: Sparkles, color: 'from-cyan-500 to-blue-600' },
    ]
  },
  {
    id: 'orders',
    name: 'Orders & Logistics',
    icon: Truck,
    color: 'blue',
    features: [
      { id: 'orders-logistics-hub', name: 'Operations Hub', component: OrdersLogisticsComplete, icon: Activity, color: 'from-blue-500 to-cyan-600' },
      { id: 'order-control', name: 'Order Control', component: OrderControl, icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
      { id: 'logistics', name: 'Logistics', component: LogisticsManager, icon: MapPin, color: 'from-cyan-500 to-blue-600' },
      { id: 'auto-sell', name: 'Auto-Sell', component: AutoSellRulesAdvanced, icon: Settings, color: 'from-sky-500 to-blue-600' },
      { id: 'bulk-aggregation', name: 'Bulk Aggregation', component: BulkAggregationEngine, icon: Package, color: 'from-blue-500 to-indigo-600' },
    ]
  },
  {
    id: 'finance',
    name: 'Payments & Finance',
    icon: DollarSign,
    color: 'amber',
    features: [
      { id: 'agripay', name: 'AgriPay', component: AgriPayCenter, icon: Wallet, color: 'from-amber-500 to-orange-600' },
      { id: 'escrow', name: 'Escrow', component: EscrowHub, icon: Shield, color: 'from-yellow-500 to-amber-600' },
      { id: 'financial-hub', name: 'Financial Hub', component: FinancialHub, icon: Building, color: 'from-orange-500 to-amber-600' },
      { id: 'price-protection', name: 'Price Protection', component: PriceProtectionHub, icon: TrendingUp, color: 'from-amber-500 to-yellow-600' },
    ]
  },
  {
    id: 'bidding',
    name: 'Tenders & Bidding',
    icon: Gavel,
    color: 'rose',
    features: [
      { id: 'tender-bids', name: 'Tender Bids', component: TenderBidsHub, icon: FileText, color: 'from-rose-500 to-pink-600' },
      { id: 'tender-participation', name: 'My Tenders', component: TenderParticipation, icon: Briefcase, color: 'from-pink-500 to-rose-600' },
    ]
  },
  {
    id: 'trust',
    name: 'Trust & Reputation',
    icon: Award,
    color: 'teal',
    features: [
      { id: 'trust-identity', name: 'Trust Identity', component: TrustIdentity, icon: Star, color: 'from-teal-500 to-cyan-600' },
      { id: 'reputation-hub', name: 'Reputation', component: ReputationHub, icon: Award, color: 'from-cyan-500 to-teal-600' },
      { id: 'blockchain-trace', name: 'Blockchain', component: BlockchainTrace, icon: LinkIcon, color: 'from-emerald-500 to-teal-600' },
    ]
  },
  {
    id: 'security',
    name: 'Security & Compliance',
    icon: Lock,
    color: 'slate',
    features: [
      { id: 'security-dashboard', name: 'Security Dashboard', component: SecurityDashboard, icon: Lock, color: 'from-slate-500 to-gray-600' },
      { id: 'compliance-tracking', name: 'Compliance Tracking', component: ComplianceTracking, icon: CheckCircle, color: 'from-gray-500 to-slate-600' },
      { id: 'global-export', name: 'Global Export Audit', component: GlobalExportAudit, icon: Globe, color: 'from-blue-500 to-slate-600' },
    ]
  },
];

function FarmerDashboardContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('dashboard');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]); // Start with none expanded
  const [expandedFeatures, setExpandedFeatures] = useState<string[]>([]); // Track expanded features with subfeatures
  const mainContentRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const currentFeature = currentCategory?.features.find(f => f.id === selectedFeature);

  // Show dashboard overview when no feature is selected or dashboard is selected (but not AI Quality Shield)
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({
    name: "Samarth Darak",
    role: "Premium Farmer",
    location: "Pune, Maharashtra",
    secondaryLocation: "Baramati, Maharashtra",
    farmType: "Organic Horticulture",
    avatar: null as string | null,
    email: "samarth.d@agrivoice.in",
    phone: "+91 9876543210",
    farmSize: "12 Acres",
    experience: "8 Years"
  });

  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Real-time Dashboard Data
  const [revenueData, setRevenueData] = useState([65, 78, 85, 72, 90, 88, 95]);
  const [currentTemp, setCurrentTemp] = useState(24.2);
  const [weatherLocation, setWeatherLocation] = useState("Pune, IN");
  const [weatherCondition, setWeatherCondition] = useState("Syncing...");
  const [isWeatherSyncing, setIsWeatherSyncing] = useState(true);
  const [forecastData, setForecastData] = useState([
    { day: 'MON', temp: '22', icon: Sun }, 
    { day: 'TUE', temp: '24', icon: CloudRain }, 
    { day: 'WED', temp: '26', icon: Sun }, 
    { day: 'THU', temp: '21', icon: Cloud }
  ]);
  const [marketTrendsData, setMarketTrendsData] = useState([
    { name: 'Tomatoes', price: 42, change: 8.4 },
    { name: 'Potatoes', price: 28, change: -3.1 },
    { name: 'Wheat', price: 35, change: 5.2 },
    { name: 'Rice', price: 48, change: 12.5 },
    { name: 'Onions', price: 32, change: -2.4 },
    { name: 'Carrots', price: 38, change: 6.8 }
  ]);
  const [farmHealth, setFarmHealth] = useState([
    { label: 'Crop Vitality', value: 94, gradient: 'bg-gradient-to-r from-green-400 to-green-600' }, 
    { label: 'Soil Quality', value: 87, gradient: 'bg-gradient-to-r from-emerald-400 to-emerald-600' }, 
    { label: 'Water Level', value: 76, gradient: 'bg-gradient-to-r from-blue-400 to-blue-600' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time revenue updates
      setRevenueData(prev => {
        const newData = [...prev];
        const lastIndex = newData.length - 1;
        // Random fluctuation for today's value
        const fluctuation = (Math.random() * 6 - 3);
        newData[lastIndex] = Math.max(85, Math.min(105, newData[lastIndex] + fluctuation));
        return newData;
      });

      // Simulate temperature fluctuations
      setCurrentTemp(prev => {
        const fluctuation = Math.random() * 0.4 - 0.2;
        const newVal = prev + fluctuation;
        return Number(Math.max(18, Math.min(42, newVal)).toFixed(1));
      });

      // Occasionally change condition for realism
      if (Math.random() > 0.95) {
        const conditions = ["Clear Skies", "Partly Cloudy", "Light Rain", "High Humidity", "Strong Breeze"];
        setWeatherCondition(conditions[Math.floor(Math.random() * conditions.length)]);
      }

      // Simulate market price movements
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

      // Simulate farm health movements
      setFarmHealth(prev => prev.map(metric => {
        const healthFluctuation = (Math.random() * 1.5 - 0.75);
        return {
          ...metric,
          value: Math.max(50, Math.min(100, Number((metric.value + healthFluctuation).toFixed(0))))
        };
      }));
    }, 4000); // Update every 4 seconds for "live" feel

    return () => clearInterval(interval);
  }, []);

  // Fetch Real Local Weather based on Precise Geolocation
  useEffect(() => {
    const getLocalWeather = async () => {
      setIsWeatherSyncing(true);
      // 1. Try GPS Geolocation first for "where I am"
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://wttr.in/${latitude},${longitude}?format=j1`);
            const data = await res.json();
            
            if (data && data.nearest_area && data.nearest_area[0]) {
              const area = data.nearest_area[0].areaName[0].value;
              const region = data.nearest_area[0].region[0].value;
              setWeatherLocation(`${area}, ${region}`);
            }

            if (data && data.current_condition && data.current_condition[0]) {
              const cond = data.current_condition[0];
              setCurrentTemp(Number(cond.temp_C));
              setWeatherCondition(cond.weatherDesc[0].value);

              if (data.weather && data.weather.length > 0) {
                const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                const dynamicForecast = data.weather.slice(1, 5).map((w: any) => {
                  const date = new Date(w.date);
                  return {
                    day: days[date.getDay()],
                    temp: w.maxtempC,
                    icon: Number(w.hourly[4].chanceofrain) > 50 ? CloudRain : Sun
                  };
                });
                setForecastData(dynamicForecast);
              }
            }
          } catch (err) {
            console.error("GPS Weather Sync Failed:", err);
            setWeatherCondition("Local Forecast Ready");
          } finally {
            setIsWeatherSyncing(false);
          }
        }, (error) => {
          console.warn("Geolocation blocked, using profile location");
          const location = userData.location.split(',')[0];
          setWeatherLocation(`${location}, IN`);
          setIsWeatherSyncing(false);
        });
      } else {
        setIsWeatherSyncing(false);
      }
    };
    getLocalWeather();
  }, [userData.location]);

  useEffect(() => {
    // Simulate Automatic Sync on 'Login'
    setSyncing(true);
    const timer = setTimeout(() => {
      setSyncing(false);
      const savedProfile = localStorage.getItem('farmer_profile');
      if (savedProfile) {
        setUserData(JSON.parse(savedProfile));
      } else {
        localStorage.setItem('farmer_profile', JSON.stringify(userData));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleProfileSave = (newData: typeof userData) => {
    setUserData(newData);
    localStorage.setItem('farmer_profile', JSON.stringify(newData));
    setShowProfile(false);
    toast.success('Professional profile synchronized!');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, avatar: reader.result as string }));
        setUploading(false);
        toast.success('Avatar uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const showDashboard = (!selectedFeature || selectedCategory === 'dashboard') && selectedCategory !== 'ai-quality-shield' && !showProfile;
  
  // Show AI Quality Shield when that category is selected
  const showAIQualityShield = selectedCategory === 'ai-quality-shield';

  // Ensure navigation starts at top on mount
  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = 0;
    }
  }, []);

  // Scroll to top when category or feature changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedCategory, selectedFeature]);

  const toggleCategory = (categoryId: string) => {
    // If clicking dashboard, just show dashboard
    if (categoryId === 'dashboard') {
      setSelectedCategory('dashboard');
      setSelectedFeature(null);
      setExpandedCategories([]);
      return;
    }

    // If clicking AI Quality Shield, show it directly
    if (categoryId === 'ai-quality-shield') {
      setSelectedCategory('ai-quality-shield');
      setSelectedFeature(null);
      setExpandedCategories([]);
      return;
    }

    if (expandedCategories.includes(categoryId)) {
      // Collapse
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      // Expand
      setExpandedCategories([...expandedCategories, categoryId]);
    }
    setSelectedCategory(categoryId);
    setSelectedFeature(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Menu size={24} className="text-green-700" />
          </button>
          
          {/* Logo with Icon */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
              <motion.div
                className="absolute inset-0 bg-green-400 rounded-xl opacity-50 blur-md"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent tracking-tight">
                FarmGuard
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold">Smart Farming Platform</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-1 items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-200">
            {[
              { id: 'dashboard', label: 'Dashboard', category: 'dashboard', feature: null },
              { id: 'reports', label: 'Reports', category: 'finance', feature: 'financial-hub' },
              { id: 'inventory', label: 'Inventory', category: 'production', feature: 'inventory' },
              { id: 'ai-advisor', label: 'AI Advisor', category: 'intelligence', feature: 'ai-chat' },
            ].map((nav) => {
              const isActive = (nav.id === 'dashboard' && selectedCategory === 'dashboard') || 
                              (nav.feature && selectedFeature === nav.feature);
              
              return (
                <motion.button 
                  key={nav.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(nav.category);
                    setSelectedFeature(nav.feature);
                  }}
                  className={`relative px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className="relative z-10">{nav.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex items-center gap-4 bg-slate-100 pl-2 pr-4 py-1.5 rounded-full border border-slate-200 cursor-pointer group hover:bg-white hover:shadow-md transition-all duration-300"
            onClick={() => setShowProfile(true)}
          >
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center shadow-sm border-2 border-white overflow-hidden relative">
              {userData.avatar ? (
                <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-slate-400 group-hover:scale-110 transition-transform" />
              )}
              {syncing && (
                <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
                  <RefreshCw size={14} className="text-slate-600 animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900 leading-tight group-hover:text-green-600 transition-colors">
                {userData.name}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Signed as Farmer.
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-white via-green-50/20 to-emerald-50/30 shadow-2xl flex flex-col z-40 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 rounded-r-3xl border-r-2 border-green-100`}>
        
        {/* Collapse/Expand Button - Enhanced */}
        <motion.button
          whileHover={{ scale: 1.15, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-28 w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-2xl transition-all hidden md:flex border-2 border-white"
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronRight size={18} className="font-bold" />
          </motion.div>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-green-400 rounded-full opacity-40 blur-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>

        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => {
            setSelectedCategory('intelligence');
            setSelectedFeature('ai-chat');
          }}
          className={`px-5 py-6 flex items-center gap-3 border-b-2 border-green-100 flex-shrink-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50 cursor-pointer group ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-xl group-hover:shadow-green-500/30 transition-shadow">
              <Leaf size={28} className="text-white" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
            </motion.div>
          </motion.div>
          
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                FarmGuard<span className="text-emerald-500">.</span>
              </h2>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest animate-pulse">Connected to AI</p>
            </motion.div>
          )}
        </motion.div>
        
        {/* User Profile */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`px-5 py-4 flex items-center gap-3 border-b border-green-100/50 flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shadow-sm relative border border-slate-200 overflow-hidden"
            title={sidebarCollapsed ? userData.name : ""}
          >
            {userData.avatar ? (
              <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={22} className="text-slate-500" />
            )}
          </motion.div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-black text-slate-800 leading-tight">{userData.name}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Farmer Account</p>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation */}
        <nav ref={navRef} className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 pt-2 pb-20">
          <div className="w-full space-y-1">
          {categories.map((category, index) => {
            const isExpanded = expandedCategories.includes(category.id);
            const isActive = selectedCategory === category.id;
            const hasSubFeatures = category.features.length > 0;
            
            return (
              <motion.div 
                key={category.id} 
                className=""
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Category Button */}
                <motion.button
                  onClick={() => toggleCategory(category.id)}
                  whileHover={{ scale: 1.02, x: sidebarCollapsed ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                    isActive 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg shadow-green-200' 
                      : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                  } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  title={sidebarCollapsed ? category.name : ''}
                >
                  {/* Animated background on hover */}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  )}
                  
                  {/* Icon with animation */}
                  <motion.div
                    animate={isActive ? { 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                  >
                    <category.icon size={sidebarCollapsed ? 24 : 20} className={isActive ? 'drop-shadow-md' : ''} />
                  </motion.div>
                  
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm relative z-10 font-semibold">{category.name}</span>
                      
                      {/* Chevron with smooth rotation - only show if has sub-features */}
                      {hasSubFeatures && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="relative z-10"
                        >
                          <ChevronRight size={16} />
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Special glow for dashboard */}
                  {category.id === 'dashboard' && isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-20 blur-xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>

                {/* Sub-features - Show only when expanded and has features */}
                <AnimatePresence>
                  {isExpanded && hasSubFeatures && !sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="ml-2 flex flex-col gap-1 mt-1 overflow-hidden"
                    >
                      {category.features.map((feature, featureIndex) => {
                        const isFeatureActive = selectedFeature === feature.id && selectedCategory === category.id;
                        const FeatureIcon = feature.icon;
                        
                        return (
                          <motion.button
                            key={feature.id}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setSelectedFeature(feature.id);
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: featureIndex * 0.05 }}
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl group overflow-hidden ${
                              isFeatureActive
                                ? 'text-slate-900 shadow-md'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            {/* Background for active state */}
                            {isFeatureActive && (
                              <motion.div
                                layoutId="activeFeature"
                                className="absolute inset-0 bg-white border-2 border-blue-200 -z-10 rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}

                            {/* Icon with gradient background */}
                            <motion.div
                              className={`relative flex items-center justify-center w-10 h-10 rounded-xl ${
                                isFeatureActive 
                                  ? `bg-gradient-to-br ${feature.color} shadow-md` 
                                  : `bg-gradient-to-br ${feature.color} opacity-90 group-hover:opacity-100`
                              }`}
                              animate={isFeatureActive ? {
                                scale: [1, 1.05, 1],
                              } : {}}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <FeatureIcon 
                                size={18} 
                                className="text-white"
                              />
                            </motion.div>

                            {/* Feature name */}
                            <span className="relative z-10 flex-1 text-left text-sm">
                              {feature.name}
                            </span>

                            {/* Arrow for active state */}
                            {isFeatureActive && (
                              <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative z-10"
                              >
                                <ChevronRight size={16} className="text-slate-600" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main ref={mainContentRef} className={`pt-24 px-6 pb-12 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}`}>
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {showDashboard ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Welcome Header with Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-8 text-white shadow-2xl"
                >
                  <div className="absolute inset-0 opacity-10 bg-grid-white" />
                  
                  <motion.div
                    className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold mb-3">
                            SEASONAL UPDATE
                          </span>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-black mb-2">
                          Welcome Back, Farmer Lead! 👋
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-green-50 text-lg">
                          Your farm is thriving. Here's your complete overview.
                        </motion.p>
                      </div>
                      <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                        <Sparkles size={32} className="text-yellow-300" />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-8">
                      {[
                        { label: 'Active Orders', value: '24', icon: ShoppingCart, color: 'from-blue-400 to-cyan-500' },
                        { label: 'Revenue Today', value: '₹45.2k', icon: TrendingUpIcon, color: 'from-amber-400 to-orange-500' },
                        { label: 'Products Listed', value: '156', icon: Box, color: 'from-purple-400 to-pink-500' },
                        { label: 'Pending Payments', value: '8', icon: Clock, color: 'from-rose-400 to-red-500' },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
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
                </motion.div>

                {/* Advanced AI Crop Analyzer Promo Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    setSelectedCategory('ai-quality-shield');
                    setSelectedFeature(null);
                  }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 cursor-pointer overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                      <Sparkles size={40} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-cyan-100 text-cyan-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">New Featured Tech</span>
                        <h3 className="text-2xl font-black text-slate-800">Advanced AI Crop Analyzer</h3>
                      </div>
                      <p className="text-slate-500 font-medium">Production-grade quality analysis with real defect detection & grading.</p>
                      
                      <div className="flex gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <CheckCircle size={14} className="text-green-500" /> Multi-Object Detection
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <CheckCircle size={14} className="text-green-500" /> Quality Grading
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
                       Launch Scanner <ChevronRight size={18} />
                    </div>
                  </div>
                </motion.div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Revenue Chart */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="col-span-8 bg-white rounded-3xl p-6 shadow-lg border border-slate-200 relative overflow-hidden">
                    {/* Live Indicator */}
                    <div className="absolute top-6 right-36 flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">Live</span>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-black text-slate-900">Revenue Overview</h3>
                        <p className="text-sm text-slate-500">Last 7 days performance</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors">Week</button>
                        <button className="px-4 py-2 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">Month</button>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between h-48 gap-3">
                      {revenueData.map((height, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ height: 0 }} 
                          animate={{ height: `${height}%` }} 
                          transition={{ 
                            type: "spring", 
                            stiffness: 100, 
                            damping: 15,
                            delay: i === revenueData.length - 1 ? 0 : 0.8 + i * 0.1 
                          }} 
                          className={`flex-1 ${i === revenueData.length - 1 ? 'bg-gradient-to-t from-emerald-600 to-green-400' : 'bg-gradient-to-t from-green-500 to-emerald-400'} rounded-t-xl relative group cursor-pointer hover:from-green-600 hover:to-emerald-500 transition-all`}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            ₹{(height * 1000).toLocaleString()}
                          </div>
                          
                          {/* Live pulse on the current day's bar */}
                          {i === revenueData.length - 1 && (
                            <motion.div 
                              className="absolute inset-0 bg-white/20 rounded-t-xl"
                              animate={{ opacity: [0, 0.4, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day} className="flex-1 text-center">{day}</span>)}
                    </div>
                  </motion.div>

                  {/* Weather Widget */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="col-span-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <motion.div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs font-bold text-blue-100 mb-1 flex items-center gap-2">
                            LOCAL FORECAST • {weatherLocation}
                            {isWeatherSyncing && <RefreshCw size={10} className="animate-spin" />}
                          </p>
                          <motion.h3 
                            key={currentTemp}
                            initial={{ scale: 0.9, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-black"
                          >
                            {currentTemp}°C
                          </motion.h3>
                        </div>
                        <motion.div
                          animate={{ 
                            y: [0, -5, 0],
                            rotate: [0, 5, 0]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {weatherCondition.includes("Rain") ? <CloudRain size={48} className="text-blue-200" /> : <Sun size={48} className="text-yellow-200" />}
                        </motion.div>
                      </div>
                      
                      <motion.p 
                        key={weatherCondition}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-blue-100 mb-6 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-blue-300 rounded-full animate-ping" />
                        {weatherCondition}
                      </motion.p>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {forecastData.map((forecast, i) => (
                          <motion.div key={forecast.day} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.1 }} className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
                            <p className="text-xs font-bold mb-1">{forecast.day}</p>
                            <forecast.icon size={20} className="mx-auto mb-1" />
                            <p className="text-xs font-bold">{forecast.temp}°</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Recent Orders */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="col-span-7 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-slate-900">Recent Orders</h3>
                      <button className="text-green-600 text-sm font-bold hover:text-green-700 transition-colors">View All →</button>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { id: '#ORD-2847', product: 'Organic Tomatoes', qty: '500 kg', amount: '₹12,500', status: 'Delivered', iconBg: 'bg-gradient-to-br from-green-400 to-green-600', statusBg: 'bg-green-100 text-green-700' },
                        { id: '#ORD-2846', product: 'Fresh Potatoes', qty: '1000 kg', amount: '₹18,000', status: 'In Transit', iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600', statusBg: 'bg-blue-100 text-blue-700' },
                        { id: '#ORD-2845', product: 'Wheat Grain', qty: '2000 kg', amount: '₹45,000', status: 'Processing', iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600', statusBg: 'bg-amber-100 text-amber-700' },
                        { id: '#ORD-2844', product: 'Rice Premium', qty: '1500 kg', amount: '₹38,500', status: 'Pending', iconBg: 'bg-gradient-to-br from-slate-400 to-slate-600', statusBg: 'bg-slate-100 text-slate-700' },
                      ].map((order, i) => (
                        <motion.div key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.1 }} whileHover={{ x: 4, scale: 1.01 }} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${order.iconBg} flex items-center justify-center`}>
                              <Box size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{order.product}</p>
                              <p className="text-xs text-slate-500">{order.id} • {order.qty}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900">{order.amount}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.statusBg}`}>{order.status}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Active Notifications & Alerts */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="col-span-5 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-slate-900">Notifications & Alerts</h3>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">3 New</span>
                    </div>
                    
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-green-50 border border-green-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm mb-1">Payment Received</p>
                          <p className="text-xs text-slate-600 mb-2">Order #2847 - ₹12,500 credited</p>
                          <span className="text-xs text-slate-500 font-medium">5 min ago</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                          <AlertCircle size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm mb-1">Low Stock Alert</p>
                          <p className="text-xs text-slate-600 mb-2">Wheat inventory below 150kg</p>
                          <span className="text-xs text-slate-500 font-medium">1 hour ago</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Gavel size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm mb-1">New Tender Available</p>
                          <p className="text-xs text-slate-600 mb-2">500kg Organic Tomatoes - ₹25/kg</p>
                          <span className="text-xs text-slate-500 font-medium">2 hours ago</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 }}
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm mb-1">Quality Check Passed</p>
                          <p className="text-xs text-slate-600 mb-2">Batch #TB-2024 approved</p>
                          <span className="text-xs text-slate-500 font-medium">3 hours ago</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Market Trends */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="col-span-6 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-slate-900">Market Trends</h3>
                      <button className="text-green-600 text-sm font-bold hover:text-green-700 transition-colors">View All →</button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {marketTrendsData.map((trend, i) => (
                        <motion.div 
                          key={trend.name} 
                          initial={{ opacity: 0, scale: 0.9 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          transition={{ delay: 1.4 + i * 0.05 }} 
                          whileHover={{ y: -4 }} 
                          className="bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900 text-sm">{trend.name}</span>
                            <motion.span 
                              key={trend.change}
                              initial={{ opacity: 0.5 }}
                              animate={{ opacity: 1 }}
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                              {trend.change >= 0 ? '+' : ''}{trend.change}%
                            </motion.span>
                          </div>
                          <motion.p 
                            key={trend.price}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl font-black text-slate-900"
                          >
                            ₹{trend.price}/kg
                          </motion.p>
                          <div className="flex items-center gap-1 mt-2">
                            <TrendingUpIcon size={14} className={`${trend.change >= 0 ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Real-time</span>
                          </div>
                          
                          {/* Subtle highlight on update */}
                          <motion.div 
                            className="absolute inset-0 bg-green-400/5 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            key={`bg-${trend.price}`}
                            transition={{ duration: 1 }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Upcoming Tasks */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="col-span-6 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-slate-900">Today's Tasks</h3>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">4 Pending</span>
                    </div>
                    
                    <div className="space-y-3">
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} whileHover={{ x: 4 }} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <input type="checkbox" className="w-5 h-5 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Irrigation Check - Sector B</p>
                            <p className="text-xs text-slate-500 mt-1">08:00 AM</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">high</span>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span>
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }} whileHover={{ x: 4 }} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <input type="checkbox" className="w-5 h-5 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Quality Inspection - Tomato Batch</p>
                            <p className="text-xs text-slate-500 mt-1">10:30 AM</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">high</span>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7 }} whileHover={{ x: 4 }} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <input type="checkbox" className="w-5 h-5 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Fertilizer Application - North Field</p>
                            <p className="text-xs text-slate-500 mt-1">02:00 PM</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">medium</span>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8 }} whileHover={{ x: 4 }} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <input type="checkbox" className="w-5 h-5 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Harvest Planning Meeting</p>
                            <p className="text-xs text-slate-500 mt-1">04:00 PM</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">low</span>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-slate-900">Farm Health</h3>
                      <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-blue-700 tracking-wider">SENSORS LIVE</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {farmHealth.map((metric, i) => (
                        <motion.div key={metric.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.1 }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-700">{metric.label}</span>
                            <motion.span 
                              key={metric.value}
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className="text-sm font-black text-slate-900"
                            >
                              {metric.value}%
                            </motion.span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              animate={{ width: `${metric.value}%` }} 
                              transition={{ 
                                type: "spring",
                                stiffness: 50,
                                damping: 20
                              }} 
                              className={`h-full ${metric.gradient} rounded-full relative`}
                            >
                              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Payments */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="col-span-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <motion.div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <DollarSign size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-amber-100">TOTAL EARNINGS</p>
                          <h3 className="text-3xl font-black">₹2.4L</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-amber-100">Received</span>
                          <span className="font-bold">₹1.8L</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-amber-100">Pending</span>
                          <span className="font-bold">₹0.6L</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Inventory */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Inventory Status</h3>
                    
                    <div className="space-y-3">
                      {[
                        { name: 'Tomatoes', stock: 450, unit: 'kg', status: 'high', dotColor: 'bg-green-500' }, 
                        { name: 'Potatoes', stock: 280, unit: 'kg', status: 'medium', dotColor: 'bg-amber-500' }, 
                        { name: 'Wheat', stock: 120, unit: 'kg', status: 'low', dotColor: 'bg-red-500' }
                      ].map((item, i) => (
                        <motion.div key={item.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 + i * 0.1 }} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                            <span className="font-bold text-slate-900">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-600">{item.stock} {item.unit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : selectedFeature === 'financial-hub' ? (
              <motion.div
                key="reports"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <FinancialHub />
              </motion.div>
            ) : selectedFeature === 'inventory' ? (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <SmartInventoryHub />
              </motion.div>
            ) : selectedFeature === 'ai-chat' ? (
              <motion.div
                key="ai-advisor-hub"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <AgriChatAdvanced />
              </motion.div>
            ) : showAIQualityShield ? (
              <motion.div
                key="ai-quality-shield"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Feature Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <AIQualityShield />
                </div>
              </motion.div>
            ) : currentFeature && (
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <button 
                    onClick={() => setSelectedFeature(null)}
                    className="hover:text-green-600 transition-colors"
                  >
                    {currentCategory?.name}
                  </button>
                  <ChevronRight size={16} />
                  <span className="text-slate-900 font-medium">{currentFeature.name}</span>
                </div>

                {/* Feature Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <currentFeature.component />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

        {/* PROFILE MODAL */}
        <AnimatePresence>
          {showProfile && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowProfile(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-white"
              >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-600 to-emerald-700" />
                
                <div className="relative pt-16 px-8 pb-8">
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setShowProfile(false)}
                      className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mt-6 flex flex-col items-center -mt-10">
                    <div className="relative group">
                      <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center">
                        {userData.avatar ? (
                          <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center">
                            <User size={48} className="text-slate-400" />
                          </div>
                        )}
                        {(uploading || syncing) && (
                          <div className="absolute inset-2 bg-black/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <RefreshCw size={24} className="text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 p-3 bg-green-600 text-white rounded-xl shadow-lg cursor-pointer hover:bg-green-700 hover:scale-110 active:scale-95 transition-all">
                        <Camera size={20} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                      </label>
                    </div>
                    {syncing && <p className="mt-2 text-[10px] font-black text-green-600 uppercase animate-pulse">Syncing Cloud Profile...</p>}
                    <h3 className="mt-4 text-2xl font-black text-slate-900">{userData.name}</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{userData.role}</p>
                  </div>

                  <div className="mt-6 space-y-6 max-h-[450px] overflow-y-auto px-1 pr-3 scrollbar-hide">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text" 
                          value={userData.name}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          className="w-full h-11 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-green-500 outline-none font-bold text-slate-800 transition-all" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                          type="text" 
                          value={userData.phone}
                          onChange={(e) => setUserData({...userData, phone: e.target.value})}
                          className="w-full h-11 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-green-500 outline-none font-bold text-slate-800 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                        <input 
                          type="text" 
                          value={userData.location}
                          onChange={(e) => setUserData({...userData, location: e.target.value})}
                          className="w-full h-11 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-green-500 outline-none font-bold text-slate-800 transition-all" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secondary Location</label>
                        <input 
                          type="text" 
                          value={userData.secondaryLocation}
                          onChange={(e) => setUserData({...userData, secondaryLocation: e.target.value})}
                          className="w-full h-11 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-green-500 outline-none font-bold text-slate-800 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Farm Size</label>
                        <input 
                          type="text" 
                          value={userData.farmSize}
                          onChange={(e) => setUserData({...userData, farmSize: e.target.value})}
                          className="w-full h-11 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-green-500 outline-none font-bold text-slate-800 transition-all" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agri Experience</label>
                        <input 
                          type="text" 
                          value={userData.experience}
                          onChange={(e) => setUserData({...userData, experience: e.target.value})}
                          className="w-full h-11 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-green-500 outline-none font-bold text-slate-800 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Farm Type (Specialization)</label>
                      <input 
                        type="text" 
                        value={userData.farmType}
                        onChange={(e) => setUserData({...userData, farmType: e.target.value})}
                        className="w-full h-11 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-green-500 outline-none font-bold text-slate-800 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5 pb-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                      <input 
                        type="email" 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="w-full h-11 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-green-500 outline-none font-bold text-slate-800 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 flex gap-3 border-t border-slate-100">
                    <button 
                      onClick={() => setShowProfile(false)}
                      className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleProfileSave(userData)}
                      className="flex-[2] h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      Sync & Save
                      <CheckCircle size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* FAB */}
    </div>
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
      <FloatingAIChatbot userRole="FARMER" userName="Samarth Darak" />
    </Suspense>
  );
}

