"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X,
  UserCircle,
  Activity,
  Globe,
  Layers,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  Navigation,
  CreditCard,
  Leaf,
  Volume2,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

interface NavItem {
  label: string;
  href?: string;
  section?: string;
  icon: any;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userRole: string;
}

export function DashboardLayout({ children, navItems, userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section");
  const { user, logout } = useAuthStore();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Load language from storage or user object if available mapping exists
    const storedLang = localStorage.getItem("preferredLanguage") || "en";
    i18n.changeLanguage(storedLang);
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("preferredLanguage", lng);
    setLangDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(t("dashboard") + ". " + t("hello") + " " + (user?.name || "Premium User"));
      // Try to set marathi voice if marathi is selected
      if (i18n.language === "mr") {
        utterance.lang = "mr-IN";
      } else {
        utterance.lang = "en-IN";
      }
      
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="min-h-screen bg-neut-50 flex overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 300 : 90 }}
        className="hidden lg:flex flex-col bg-white border-r border-neut-100 relative z-30 transition-all duration-300 shadow-xl shadow-neut-900/5"
      >
        <div className="p-8 flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="h-12 w-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
              O
            </div>
            {sidebarOpen && (
              <span className="font-heading font-black text-2xl tracking-tighter text-neut-900 group-hover:text-brand-primary transition-colors">
                ODOP<span className="text-brand-primary">.C</span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto custom-scrollbar scrollbar-hide">
          {navItems.map((item) => {
            const isCurrentPath = pathname === item.href;
            const isActive = item.section 
              ? (currentSection === item.section || (!currentSection && (item.section === "Overview" || item.section === "Cockpit"))) && isCurrentPath
              : isCurrentPath;
              
            const linkHref = item.section && item.href?.includes("dashboard") 
              ? `${item.href}?section=${item.section}` 
              : (item.href || '#');

            return (
              <Link key={item.label} href={linkHref}>
                <div className={`
                  flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all group cursor-pointer relative
                  ${isActive ? 'bg-brand-primary/5 text-brand-primary shadow-sm' : 'text-neut-400 hover:bg-neut-50 hover:text-neut-900'}
                `}>
                  {isActive && <div className="absolute left-1 top-4 bottom-4 w-1.5 bg-brand-primary rounded-full" />}
                  <item.icon size={22} className={`${isActive ? 'text-brand-primary' : 'group-hover:text-neut-900'} transition-colors`} />
                  {sidebarOpen && <span className={`font-black text-[13px] tracking-tight uppercase ${isActive ? 'text-neut-900' : 'text-neut-500'}`}>{item.label}</span>}
                  {sidebarOpen && item.badge && (
                    <span className="ml-auto bg-brand-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-brand-primary/20">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-neut-100">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} px-4 py-3 text-error hover:bg-error/10 hover:text-error rounded-2xl gap-3`}
          >
            <LogOut size={22} />
            {sidebarOpen && <span className="font-bold text-sm">{t("logout")}</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <header className="h-20 bg-white border-b border-neut-200 px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:flex hidden p-2 text-neut-400 hover:text-neut-900 transition-colors"
            >
              <Menu size={24} />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex p-2 text-neut-400 hover:text-neut-900"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex h-11 w-80 bg-neut-50 rounded-2xl border border-neut-200 px-4 items-center gap-3 group focus-within:border-brand-primary transition-all">
              <Search size={18} className="text-neut-400 group-focus-within:text-brand-primary" />
              <input type="text" placeholder={t("search_placeholder") || "Search..."} className="bg-transparent border-none outline-none text-sm font-medium w-full text-neut-700" />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 relative">
            {/* Language Toggle Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 p-2 px-3 rounded-xl bg-neut-50 hover:bg-neut-100 text-sm font-bold text-neut-700 transition-colors"
              >
                <Globe size={18} className="text-brand-primary" />
                <span className="hidden sm:inline">
                  {i18n.language === "mr" ? "मराठी" : i18n.language === "hi-en" ? "Hinglish" : "English"}
                </span>
                <ChevronDown size={14} />
              </button>
              
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-neut-100 py-2 z-50 overflow-hidden"
                  >
                    <button onClick={() => changeLanguage("en")} className="w-full text-left px-5 py-2.5 text-sm font-bold hover:bg-neut-50 flex items-center justify-between">
                      English <span className="text-xl">🇬🇧</span>
                    </button>
                    <button onClick={() => changeLanguage("mr")} className="w-full text-left px-5 py-2.5 text-sm font-bold hover:bg-neut-50 flex items-center justify-between">
                      मराठी <span className="text-xl">🇮🇳</span>
                    </button>
                    <button onClick={() => changeLanguage("hi-en")} className="w-full text-left px-5 py-2.5 text-sm font-bold hover:bg-neut-50 flex items-center justify-between">
                      Hinglish <span className="text-xl">💬</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Speech Assistant Button */}
            <button 
              onClick={toggleSpeech}
              title="Speak dashboard contents"
              className={`hidden sm:flex h-10 w-10 rounded-full items-center justify-center transition-colors ${
                isSpeaking ? 'bg-brand-primary text-white animate-pulse' : 'bg-neut-50 hover:bg-brand-primary/10 text-neut-500 hover:text-brand-primary'
              }`}
            >
              <Volume2 size={20} />
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative border-l border-neut-200 pl-4 md:pl-6">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 md:gap-4 text-left group"
              >
                <div className="hidden sm:block">
                  <p className="text-sm font-black text-neut-900 tracking-tight group-hover:text-brand-primary transition-colors">{user?.name || "Premium User"}</p>
                  <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{userRole}</p>
                </div>
                <div className="h-11 w-11 rounded-2xl overflow-hidden bg-startup-gradient flex items-center justify-center text-white font-bold text-lg shadow-startup-soft relative">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0] || "U"
                  )}
                </div>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, transformOrigin: "top right" }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-4 w-56 bg-white rounded-3xl shadow-startup-medium border border-neut-100 p-2 z-50 origin-top-right"
                  >
                    <div className="p-3 mb-2 border-b border-neut-50">
                      <p className="text-sm font-black text-neut-900 truncate">{user?.email || "user@example.com"}</p>
                      <p className="text-xs font-bold text-neut-400">ID: {user?.id?.substring(0,8) || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <Link href={`?section=Profile`} onClick={() => setProfileDropdownOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-primary/5 hover:text-brand-primary transition-colors text-sm font-bold text-neut-700 cursor-pointer">
                          <UserCircle size={18} />
                          {t("profile_settings")}
                        </div>
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-error/10 hover:text-error transition-colors text-sm font-bold text-error cursor-pointer">
                        <LogOut size={18} />
                        {t("logout")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-neut-50/50 relative">
          <div className="gradient-blur top-0 right-0 opacity-10" />
          {children}
        </div>
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-neut-900/40 backdrop-blur-sm z-40 lg:hidden" 
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between mb-8 border-b border-neut-100">
                <Link href="/" className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">O</div>
                  <span className="font-heading font-black text-xl tracking-tighter text-neut-900">ODOP <span className="text-brand-primary">Connect</span></span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-neut-400"><X size={24} /></button>
              </div>
              <nav className="flex-1 px-5 space-y-2 py-6 overflow-y-auto">
                {navItems.map((item) => {
                  const isCurrentPath = pathname === item.href;
                  const isActive = item.section 
                    ? (currentSection === item.section || (!currentSection && (item.section === "Overview" || item.section === "Cockpit"))) && isCurrentPath
                    : isCurrentPath;
                    
                  const linkHref = item.section && item.href?.includes("dashboard") 
                    ? `${item.href}?section=${item.section}` 
                    : (item.href || '#');

                  return (
                    <Link key={item.label} href={linkHref} onClick={() => setMobileMenuOpen(false)}>
                      <div className={`
                        flex items-center gap-4 px-5 py-4 rounded-2xl transition-all
                        ${isActive ? 'bg-brand-primary/10 text-brand-primary font-black' : 'text-neut-500 hover:bg-neut-50'}
                      `}>
                        <item.icon size={22} />
                        <span className="text-sm uppercase tracking-tight">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
