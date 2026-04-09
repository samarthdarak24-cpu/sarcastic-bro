"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Sparkles, Package, Truck, DollarSign, Gavel, Award,
  ShieldAlert, BarChart3, Brain, TrendingUp, Target,
  Search, Users, Globe, Lock, Zap, ChevronRight, Menu,
  User, ShoppingCart, MapPin, Settings,
  Wallet, Shield, Building, FileText, Briefcase, Star,
  Link as LinkIcon, LayoutDashboard, Home, Activity, X, RefreshCw, MessageSquare
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import BuyerCommandCenter from "@/components/dashboard/buyer/BuyerCommandCenter";
import AIIntelligenceHub from "@/components/dashboard/buyer/AIIntelligenceHub";
import SourcingProcurementHub from "@/components/dashboard/buyer/SourcingProcurementHub";
import OrdersTrackingHub from "@/components/dashboard/buyer/OrdersTrackingHub";
import PaymentsFinanceHub from "@/components/dashboard/buyer/PaymentsFinanceHub";
import TrustReputationHub from "@/components/dashboard/buyer/TrustReputationHub";
import { NegotiationHubPremium } from "@/components/dashboard/buyer/NegotiationHubPremium";
import { SecurityHubLive } from "@/components/shared/SecurityHubLive";

// Sub-feature components
import AIProcurement from "@/components/dashboard/buyer/AIProcurement";
import { AgriIntelligenceBuyer } from "@/components/dashboard/buyer/AgriIntelligenceBuyer";
import { BehavioralInsightsBuyer } from "@/components/dashboard/buyer/BehavioralInsightsBuyer";
import { RegionalClusterMap } from "@/components/dashboard/buyer/RegionalClusterMap";
import { SmartSourcingEnhanced } from "@/components/dashboard/buyer/SmartSourcingEnhanced";
import { SourcingSpace } from "@/components/dashboard/buyer/SourcingSpace";
import { BulkOrders } from "@/components/dashboard/buyer/BulkOrders";
import { PreBookingHub } from "@/components/dashboard/buyer/PreBookingHub";
import { SupplierInsights } from "@/components/dashboard/buyer/SupplierInsights";
import { OrderTracker } from "@/components/dashboard/buyer/OrderTracker";
import { BlockchainTraceBuyer } from "@/components/dashboard/buyer/BlockchainTraceBuyer";
import { EscrowHubBuyer } from "@/components/dashboard/buyer/EscrowHubBuyer";
import { ProcurementAssistant } from "@/components/dashboard/buyer/ProcurementAssistant";
import { NegotiationHub } from "@/components/dashboard/buyer/NegotiationHub";
import { TrustReviews } from "@/components/dashboard/buyer/TrustReviews";
import { MyReputationPremium } from "@/components/dashboard/buyer/MyReputationPremium";
import FloatingAIChatbot from "@/components/ui/FloatingAIChatbot";

// Feature categories with sub-features
const categories = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    color: 'blue',
    features: []
  },
  {
    id: 'ai',
    name: 'AI Intelligence',
    icon: Sparkles,
    color: 'purple',
    features: [
      { id: 'ai-procurement', name: 'AI Procurement', icon: Brain },
      { id: 'agri-intelligence', name: 'Agri Intelligence', icon: TrendingUp },
      { id: 'behavioral-insights', name: 'Behavioral Insights', icon: BarChart3 },
      { id: 'regional-clusters', name: 'Regional Clusters', icon: MapPin }
    ]
  },
  {
    id: 'sourcing',
    name: 'Sourcing & Procurement',
    icon: Search,
    color: 'emerald',
    features: [
      { id: 'smart-sourcing', name: 'Smart Sourcing', icon: Target },
      { id: 'sourcing-space', name: 'Sourcing Space', icon: Globe },
      { id: 'bulk-orders', name: 'Bulk Orders', icon: Package },
      { id: 'pre-booking', name: 'Pre-Booking Hub', icon: FileText },
      { id: 'supplier-insights', name: 'Supplier Insights', icon: Users }
    ]
  },
  {
    id: 'orders',
    name: 'Orders & Tracking',
    icon: Package,
    color: 'blue',
    features: [
      { id: 'order-tracker', name: 'Order Tracker', icon: Truck },
      { id: 'blockchain-trace', name: 'Blockchain Trace', icon: Shield }
    ]
  },
  {
    id: 'finance',
    name: 'Payments & Finance',
    icon: DollarSign,
    color: 'amber',
    features: [
      { id: 'escrow-hub', name: 'Escrow Hub', icon: Lock },
      { id: 'procurement-assistant', name: 'Procurement Assistant', icon: Briefcase }
    ]
  },
  {
    id: 'bidding',
    name: 'Negotiation & Bidding',
    icon: Gavel,
    color: 'rose',
    features: [
      { id: 'negotiation-hub', name: 'Negotiation Hub', icon: MessageSquare }
    ]
  },
  {
    id: 'trust',
    name: 'Trust & Reputation',
    icon: Award,
    color: 'teal',
    features: [
      { id: 'trust-reviews', name: 'Trust & Reviews', icon: Star },
      { id: 'my-reputation', name: 'My Reputation', icon: Award }
    ]
  },
  {
    id: 'security',
    name: 'Security & Compliance',
    icon: Lock,
    color: 'slate',
    features: []
  },
];

function BuyerDashboardContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('dashboard');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const mainContentRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth('BUYER');

  const currentCategory = categories.find(c => c.id === selectedCategory);

  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({
    name: "Buyer User",
    role: "Premium Buyer",
    location: "Mumbai, Maharashtra",
    secondaryLocation: "Pune, Maharashtra",
    businessType: "Wholesale Trading",
    avatar: null as string | null,
    email: "buyer@agrivoice.in",
    phone: "+91 9876543210",
    companySize: "50-100 Employees",
    experience: "5 Years"
  });

  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setSyncing(true);
    const timer = setTimeout(() => {
      setSyncing(false);
      const savedProfile = localStorage.getItem('buyer_profile');
      if (savedProfile) {
        setUserData(JSON.parse(savedProfile));
      } else {
        localStorage.setItem('buyer_profile', JSON.stringify(userData));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleProfileSave = (newData: typeof userData) => {
    setUserData(newData);
    localStorage.setItem('buyer_profile', JSON.stringify(newData));
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

  const showDashboard = selectedCategory === 'dashboard' && !showProfile;

  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedCategory, selectedFeature]);

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'dashboard') {
      setSelectedCategory('dashboard');
      setSelectedFeature(null);
      setExpandedCategories([]);
      return;
    }

    // Toggle expansion for categories with sub-features
    const category = categories.find(c => c.id === categoryId);
    if (category && category.features.length > 0) {
      if (expandedCategories.includes(categoryId)) {
        setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
      } else {
        setExpandedCategories([...expandedCategories, categoryId]);
      }
    } else {
      // For categories without sub-features, just select them
      setSelectedCategory(categoryId);
      setSelectedFeature(null);
      setExpandedCategories([]);
    }
  };

  const renderContent = () => {
    if (showDashboard) {
      return <BuyerCommandCenter />;
    }

    // Handle sub-features
    if (selectedFeature) {
      switch (selectedFeature) {
        // AI Intelligence sub-features
        case 'ai-procurement': return <AIProcurement />;
        case 'agri-intelligence': return <AgriIntelligenceBuyer />;
        case 'behavioral-insights': return <BehavioralInsightsBuyer />;
        case 'regional-clusters': return <RegionalClusterMap />;
        
        // Sourcing & Procurement sub-features
        case 'smart-sourcing': return <SmartSourcingEnhanced />;
        case 'sourcing-space': return <SourcingSpace />;
        case 'bulk-orders': return <BulkOrders />;
        case 'pre-booking': return <PreBookingHub />;
        case 'supplier-insights': return <SupplierInsights />;
        
        // Orders & Tracking sub-features
        case 'order-tracker': return <OrderTracker />;
        case 'blockchain-trace': return <BlockchainTraceBuyer />;
        
        // Payments & Finance sub-features
        case 'escrow-hub': return <EscrowHubBuyer />;
        case 'procurement-assistant': return <ProcurementAssistant />;
        
        // Negotiation & Bidding sub-features
        case 'negotiation-hub': return <NegotiationHub />;
        
        // Trust & Reputation sub-features
        case 'trust-reviews': return <TrustReviews />;
        case 'my-reputation': return <MyReputationPremium />;
        
        default: return <BuyerCommandCenter />;
      }
    }

    // Handle main categories
    switch (selectedCategory) {
      case 'ai': return <AIIntelligenceHub />;
      case 'sourcing': return <SourcingProcurementHub />;
      case 'orders': return <OrdersTrackingHub />;
      case 'finance': return <PaymentsFinanceHub />;
      case 'bidding': return <NegotiationHubPremium />;
      case 'trust': return <TrustReputationHub />;
      case 'security': return <SecurityHubLive userRole="BUYER" />;
      default: return <BuyerCommandCenter />;
    }
  };

  if (!user || user.role !== "BUYER") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading buyer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 flex justify-between items-center px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Menu size={24} className="text-blue-700" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
              <motion.div
                className="absolute inset-0 bg-blue-400 rounded-xl opacity-50 blur-md"
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
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                BuyerHub
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold">Smart Procurement Platform</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-1 items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-200">
            {[
              { id: 'dashboard', label: 'Dashboard', category: 'dashboard', feature: null, icon: LayoutDashboard },
              { id: 'sourcing', label: 'Sourcing', category: 'sourcing', feature: 'smart-sourcing', icon: Search },
              { id: 'orders', label: 'Orders', category: 'orders', feature: 'order-tracker', icon: Package },
              { id: 'ai-advisor', label: 'AI Advisor', category: 'ai', feature: 'ai-procurement', icon: Sparkles },
            ].map((nav) => {
              const isActive = (nav.id === 'dashboard' && selectedCategory === 'dashboard') || 
                              (nav.feature && selectedFeature === nav.feature);
              const NavIcon = nav.icon;
              
              return (
                <motion.button 
                  key={nav.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(nav.category);
                    setSelectedFeature(nav.feature);
                  }}
                  className={`relative px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                    isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <NavIcon size={14} className="relative z-10" />
                  <span className="relative z-10">{nav.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/20"
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
              <span className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                {userData.name}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Signed as Buyer.
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-white shadow-lg flex flex-col z-40 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-slate-200`}>
        
        <motion.button
          whileHover={{ scale: 1.15, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-28 w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-600 to-blue-700 text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-2xl transition-all hidden md:flex border-2 border-white"
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronRight size={18} className="font-bold" />
          </motion.div>
          
          <motion.div
            className="absolute inset-0 bg-blue-400 rounded-full opacity-40 blur-md"
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

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`px-5 py-6 flex items-center gap-3 border-b border-slate-200 flex-shrink-0 bg-white ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center shadow-xl">
              <ShoppingCart size={28} className="text-white" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 h-4 w-4 bg-cyan-500 rounded-full border-2 border-white flex items-center justify-center"
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
              <h2 className="text-lg font-black bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                BuyerHub<span className="text-cyan-500">.</span>
              </h2>
              <p className="text-[10px] text-cyan-600 font-black uppercase tracking-widest animate-pulse">Connected to AI</p>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`px-5 py-4 flex items-center gap-3 border-b border-slate-200 flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
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
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Buyer Account</p>
            </motion.div>
          )}
        </motion.div>

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
                <motion.button
                  onClick={() => toggleCategory(category.id)}
                  whileHover={{ scale: 1.02, x: sidebarCollapsed ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold shadow-lg shadow-blue-200' 
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  title={sidebarCollapsed ? category.name : ''}
                >
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  )}
                  
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
                      {hasSubFeatures && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="relative z-10"
                        >
                          <ChevronRight size={16} />
                        </motion.div>
                      )}
                    </>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {category.id === 'dashboard' && isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 opacity-20 blur-xl"
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

                {/* Sub-features */}
                {!sidebarCollapsed && hasSubFeatures && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 mt-1 space-y-1"
                  >
                    {category.features.map((feature) => (
                      <motion.button
                        key={feature.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedFeature(feature.id);
                        }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                          selectedFeature === feature.id
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <feature.icon size={16} />
                        <span className="text-xs font-medium">{feature.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main 
        ref={mainContentRef}
        className={`transition-all duration-300 pt-28 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-80'
        } px-6 pb-12 min-h-screen bg-slate-50`}
      >
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-black text-xl uppercase tracking-widest animate-pulse">
        {"Initializing Node..."}
      </div>
    }>
      <BuyerDashboardContent />
      <FloatingAIChatbot userRole="BUYER" userName="Buyer User" />
    </Suspense>
  );
}
