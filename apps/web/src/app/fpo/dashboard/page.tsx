'use client';

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Package, Sun,
  ChevronRight, Menu, Building2,
  Search, Bell, Settings, LogOut, BarChart3,
  Activity, Warehouse, DollarSign, UserPlus, UserCheck,
  FileText, Shield, Store, MessageCircle, Truck, Inbox, Layers
} from "lucide-react";

// ─── NAV ITEMS (no duplicate IDs) ──────────────────────────────────────
const navItems = [
  { id: 'nav-dashboard',    label: 'Overview',            icon: BarChart3,      section: 'dashboard' },
  { id: 'nav-onboarding',   label: 'Farmer Onboarding',   icon: UserPlus,       section: 'onboarding' },
  { id: 'nav-management',   label: 'Farmer Management',   icon: Users,          section: 'management' },
  { id: 'nav-incoming',     label: 'Incoming Crops',      icon: Inbox,          section: 'incoming' },
  { id: 'nav-aggregation',  label: 'Bulk Aggregation',    icon: Warehouse,      section: 'aggregation' },
  { id: 'nav-listings',     label: 'Market Listings',     icon: Layers,         section: 'listings' },
  { id: 'nav-orders',       label: 'Manage Orders',       icon: Package,        section: 'orders' },
  { id: 'nav-logistics',    label: 'Logistics Hub',       icon: Truck,          section: 'logistics' },
  { id: 'nav-wallet',       label: 'Financial Hub',       icon: DollarSign,     section: 'wallet' },
  { id: 'nav-quality',      label: 'Quality Certs',       icon: Shield,         section: 'quality' },
  { id: 'nav-kyc',          label: 'Farmer KYC',          icon: UserCheck,      section: 'kyc' },
];

// ─── COMPONENT IMPORTS ─────────────────────────────────────────────────
import FPOQualityCertificate from "@/components/dashboard/fpo/QualityCertificate";
import FPODashboardMain from "@/components/dashboard/fpo/FPODashboardMain";
import IncomingCrops from "@/components/dashboard/fpo/IncomingCrops";
import AggregationManager from "@/components/dashboard/fpo/AggregationManager";
import OrderManagement from "@/components/dashboard/fpo/OrderManagement";
import FarmerManagement from "@/components/dashboard/fpo/FarmerManagement";
import FarmerOnboarding from "@/components/dashboard/fpo/FarmerOnboarding";
import BulkListings from "@/components/dashboard/fpo/BulkListings";
import LogisticsHub from "@/components/dashboard/fpo/LogisticsHub";
import PayoutDashboard from "@/components/dashboard/fpo/PayoutDashboard";
import FarmerKYCVerification from "@/components/dashboard/fpo/FarmerKYCVerification";

function FPODashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedSection = searchParams.get('section') || 'dashboard';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  const [userData] = useState({
    name: "Sahakari FPO",
    role: "Farmer Producer Organization",
    members: "248 Farmers",
  });

  // Handle sidebar resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      const newWidth = e.clientX;
      if (newWidth >= 0 && newWidth <= 600) {
        setSidebarWidth(newWidth);
        if (newWidth < 30) {
          setSidebarOpen(false);
          setSidebarWidth(300);
        } else {
          setSidebarOpen(true);
          if (newWidth < 150) {
            setSidebarCollapsed(true);
          } else {
            setSidebarCollapsed(false);
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // ─── SECTION RENDERER ─────────────────────────────────────────────────
  const renderSection = () => {
    switch (selectedSection) {
      case 'dashboard':
        return <FPODashboardMain />;
      case 'onboarding':
        return <FarmerOnboarding />;
      case 'management':
        return <FarmerManagement />;
      case 'incoming':
        return <IncomingCrops />;
      case 'aggregation':
        return <AggregationManager />;
      case 'listings':
        return <BulkListings />;
      case 'orders':
        return <OrderManagement />;
      case 'logistics':
        return <LogisticsHub />;
      case 'wallet':
        return <PayoutDashboard />;
      case 'quality':
        return <FPOQualityCertificate />;
      case 'kyc':
        return <FarmerKYCVerification />;
      default:
        return (
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={40} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
            </h3>
            <p className="text-slate-500">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : -sidebarWidth }}
        style={{ width: sidebarCollapsed ? 80 : sidebarWidth }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed left-0 top-0 h-screen bg-gradient-to-b from-purple-500 via-violet-500 to-purple-500 shadow-2xl z-50 flex flex-col"
      >
        <div
          onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
          className="absolute -right-1 top-0 bottom-0 w-3 hover:w-4 bg-transparent hover:bg-purple-300/40 cursor-col-resize transition-all z-50 group"
        >
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-12 bg-white/95 group-hover:bg-white rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-xl border border-purple-200">
            <div className="flex flex-col items-center gap-0.5">
              <ChevronRight size={12} className="text-purple-600 rotate-180" />
              <ChevronRight size={12} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className={`p-6 border-b border-purple-400/30 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'flex-col' : ''}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-white to-purple-100 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Building2 size={28} className="text-purple-600" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-black text-white">FPO Hub</h1>
                <p className="text-xs text-purple-100 font-semibold">Collective Platform</p>
              </div>
            )}
          </div>
        </div>

        <div className={`p-4 border-b border-purple-400/30 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Building2 size={24} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{userData.name}</p>
                <p className="text-xs text-purple-100">{userData.members}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = selectedSection === item.section;

            return (
              <button
                key={item.id}
                onClick={() => router.push(`/fpo/dashboard?section=${item.section}`)}
                title={sidebarCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white text-purple-600 shadow-lg font-bold'
                    : 'text-white hover:bg-white/20 hover:text-white'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="font-semibold text-sm">{item.label}</span>
                    {isActive && <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full" />}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-purple-400/30">
          <button title={sidebarCollapsed ? 'Settings' : ''} className={`w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 hover:text-white rounded-xl transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Settings size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-semibold text-sm">Settings</span>}
          </button>
          <button title={sidebarCollapsed ? 'Logout' : ''} className={`w-full flex items-center gap-3 px-4 py-3 text-red-100 hover:bg-red-500/20 hover:text-white rounded-xl transition-all mt-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <LogOut size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {!sidebarOpen && (
        <>
          <button
            onClick={() => { setSidebarOpen(true); setSidebarWidth(300); }}
            className="fixed left-4 top-4 z-40 p-3 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-xl shadow-2xl hover:shadow-purple-400/50 transition-all"
          >
            <Menu size={24} />
          </button>
          <div
            onMouseDown={() => { setIsResizing(true); setSidebarOpen(true); setSidebarWidth(50); }}
            className="fixed left-0 top-0 bottom-0 w-3 hover:w-4 bg-transparent hover:bg-purple-300/40 cursor-col-resize transition-all z-40 group"
          />
        </>
      )}

      <div className="flex-1 flex flex-col transition-all duration-300" style={{ marginLeft: sidebarOpen ? (sidebarCollapsed ? '80px' : `${sidebarWidth}px`) : '0px' }}>
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu size={24} className="text-slate-700" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search farmers, crops..." className="w-96 h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-purple-700">LIVE</span>
            </div>
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={22} className="text-slate-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                <Building2 size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function FPODashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FPODashboardContent />
    </Suspense>
  );
}
