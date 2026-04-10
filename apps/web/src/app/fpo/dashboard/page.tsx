'use client';

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Package, Sun,
  ChevronRight, Menu, Building2,
  Search, Bell, Settings, LogOut, BarChart3,
  Activity, Warehouse, DollarSign, UserPlus, UserCheck,
  FileText, Shield, Store, MessageCircle, Truck
} from "lucide-react";

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, section: 'dashboard' },
  { id: 'registration', label: 'FPO Registration', icon: Building2, section: 'registration' },
  { id: 'onboarding', label: 'Farmer Onboarding', icon: UserPlus, section: 'onboarding' },
  { id: 'management', label: 'Farmer Management', icon: Users, section: 'management' },
  { id: 'listing', label: 'Delegated Listing', icon: FileText, section: 'listing' },
  { id: 'aggregation', label: 'Bulk Aggregation', icon: Warehouse, section: 'aggregation' },
  { id: 'quality', label: 'Quality Verification', icon: Shield, section: 'quality' },
  { id: 'marketplace', label: 'Bulk Marketplace', icon: Store, section: 'marketplace' },
  { id: 'communication', label: 'Buyer Communication', icon: MessageCircle, section: 'communication' },
  { id: 'payout', label: 'Escrow Payout', icon: DollarSign, section: 'payout' },
  { id: 'logistics', label: 'Logistics & Dispatch', icon: Truck, section: 'logistics' },
];

function FPODashboardContent() {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  
  const [userData] = useState({
    name: "Sahakari FPO",
    role: "Farmer Producer Organization",
    members: "248 Farmers",
    avatar: null as string | null,
  });

  const [aggregationData] = useState([75, 82, 88, 85, 92, 89, 96]);
  const [currentTemp, setCurrentTemp] = useState(25);
  const [cropData, setCropData] = useState([
    { name: 'Tomatoes', qty: '4.2T', value: '₹1.8L', status: 'Ready' },
    { name: 'Potatoes', qty: '8.5T', value: '₹2.4L', status: 'Aggregating' },
    { name: 'Wheat', qty: '15T', value: '₹5.2L', status: 'Ready' },
    { name: 'Rice', qty: '12T', value: '₹5.8L', status: 'Ready' },
    { name: 'Onions', qty: '3.5T', value: '₹1.1L', status: 'Aggregating' },
    { name: 'Carrots', qty: '2.8T', value: '₹1.1L', status: 'Ready' }
  ]);

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
          setSidebarWidth(320);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp(prev => Number(Math.max(18, Math.min(42, prev + (Math.random() * 0.4 - 0.2))).toFixed(1)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Purple/Violet Theme */}
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
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-300/50 group-hover:bg-purple-300 transition-all" />
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

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = selectedSection === item.section;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedSection(item.section)}
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
            onClick={() => { setSidebarOpen(true); setSidebarWidth(320); }}
            className="fixed left-4 top-4 z-40 p-3 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-xl shadow-2xl hover:shadow-purple-400/50 transition-all"
          >
            <Menu size={24} />
          </button>
          <div
            onMouseDown={() => { setIsResizing(true); setSidebarOpen(true); setSidebarWidth(50); }}
            className="fixed left-0 top-0 bottom-0 w-3 hover:w-4 bg-transparent hover:bg-purple-300/40 cursor-col-resize transition-all z-40 group"
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-12 bg-white/95 group-hover:bg-white rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-xl border border-purple-200">
              <div className="flex flex-col items-center gap-0.5">
                <ChevronRight size={12} className="text-purple-600 rotate-180" />
                <ChevronRight size={12} className="text-purple-600" />
              </div>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-300/50 group-hover:bg-purple-300 transition-all" />
          </div>
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
            {selectedSection === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-400 via-violet-500 to-purple-500 p-8 text-white shadow-2xl">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h1 className="text-4xl font-black mb-2">Welcome, {userData.name}! 🌾</h1>
                        <p className="text-purple-50 text-lg">Empowering {userData.members} together.</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                        <Users size={32} className="text-yellow-300" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-8">
                      {[
                        { label: 'Active Farmers', value: '248', icon: Users, color: 'from-green-400 to-emerald-500' },
                        { label: 'Total Aggregated', value: '45.2T', icon: Warehouse, color: 'from-blue-400 to-cyan-500' },
                        { label: 'Bulk Orders', value: '32', icon: Package, color: 'from-pink-400 to-rose-500' },
                        { label: 'Pending Payouts', value: '₹8.5L', icon: DollarSign, color: 'from-purple-400 to-violet-500' },
                      ].map((stat, index) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.1 }} whileHover={{ y: -4 }} className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                            <stat.icon size={20} className="text-white" />
                          </div>
                          <p className="text-2xl font-black mb-1">{stat.value}</p>
                          <p className="text-xs text-white font-medium">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Aggregation Overview</h3>
                    <div className="flex items-end justify-between h-48 gap-3">
                      {aggregationData.map((height, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 + i * 0.1 }} className={`flex-1 ${i === aggregationData.length - 1 ? 'bg-gradient-to-t from-purple-500 to-violet-400' : 'bg-gradient-to-t from-purple-400 to-violet-300'} rounded-t-xl relative group cursor-pointer`}>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            {(height * 100).toFixed(0)}T
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day} className="flex-1 text-center">{day}</span>)}
                    </div>
                  </div>

                  <div className="col-span-4 bg-gradient-to-br from-violet-400 to-purple-500 rounded-3xl p-6 text-white shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-bold text-violet-50 mb-1">WEATHER</p>
                        <h3 className="text-4xl font-black">{currentTemp}°C</h3>
                      </div>
                      <Sun size={48} className="text-yellow-200" />
                    </div>
                    <p className="text-sm text-violet-50">Perfect for harvesting</p>
                  </div>

                  <div className="col-span-12 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Aggregated Crops Status</h3>
                    <div className="grid grid-cols-6 gap-4">
                      {cropData.map((crop) => (
                        <motion.div key={crop.name} whileHover={{ y: -4 }} className="bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900 text-sm">{crop.name}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${crop.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                              {crop.status}
                            </span>
                          </div>
                          <p className="text-2xl font-black text-slate-900">{crop.qty}</p>
                          <p className="text-xs text-slate-500 mt-1">{crop.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedSection !== 'dashboard' && (
              <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity size={40} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} Coming Soon</h3>
                <p className="text-slate-500">This section is under development.</p>
              </motion.div>
            )}
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
