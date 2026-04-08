"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Search, Menu, Command
} from "lucide-react";
import { authService } from "@/services/auth";
import { LivePriceTicker } from "@/components/ui/LivePriceTicker";
import { LiveNotificationBell } from "@/components/ui/LiveNotificationBell";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { JarvisButton } from "@/components/ui/JarvisAssistant/JarvisButton";

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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section");
  const user = authService.getUser();
    // Subscribe to language changes to force re-render
  const [, setLang] = useState(i18n.language);
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => { i18n.off("languageChanged", handler); };
  }, [i18n]);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const isFarmer = userRole?.toLowerCase() === 'farmer';
  const themeColor = isFarmer ? 'text-emerald-500' : 'text-blue-500';
  const themeBg = isFarmer ? 'bg-emerald-600' : 'bg-blue-600';
  const themeGlow = isFarmer ? 'shadow-emerald-500/20' : 'shadow-blue-500/20';

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans selection:bg-brand-primary selection:text-white">
      {/* 🚀 FIXED SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[60] bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "w-80" : "w-24"
        }`}
        style={{ minHeight: '100vh' }}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`h-10 w-10 ${themeBg} rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform`}>
              <Command size={20} />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="font-black text-lg tracking-tighter text-white">
                    FarmGuard<span className={themeColor}>.AI</span>
                </span>
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500">SMART FARMING v2.0</span>
              </div>
            )}
          </Link>
        </div>

        {/* Sidebar Nav - Scrollable internal */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-1">
          {navItems.map((item, index) => {
            const isCurrentPath = pathname === item.href;
            const isActive = item.section 
              ? (currentSection === item.section || (!currentSection && (item.section === "Overview" || item.section === "Cockpit"))) && isCurrentPath
              : isCurrentPath;
              
            const linkHref = item.section && item.href?.includes("dashboard") 
              ? `${item.href}?section=${item.section}` 
              : (item.href || '#');

            return (
              <Link key={`${item.label}-${index}`} href={linkHref}>
                <div
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group cursor-pointer relative
                    ${isActive
                      ? `bg-white/10 text-white shadow-xl`
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                      isActive ? `${themeBg} text-white shadow-lg ${themeGlow}` : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                  }`}>
                    {React.cloneElement(item.icon as any, { size: 18, strokeWidth: isActive ? 3 : 2 })}
                  </div>
                  
                  {sidebarOpen && (
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="font-bold text-[13px] tracking-tight truncate">
                          {t(item.label)}
                        </span>
                        {isActive && <span className="text-[8px] font-black uppercase tracking-relative opacity-40 text-blue-200">{"Live"}</span>}
                    </div>
                  )}

                  {item.badge && sidebarOpen && (
                    <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-black text-white animate-pulse">
                        {item.badge}
                    </div>
                  )}

                  {isActive && sidebarOpen && (
                      <div className={`absolute right-4 h-1.5 w-1.5 rounded-full ${themeBg} animate-pulse`} />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - User Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
            <Link href="/profile">
              <div className={`p-3 rounded-2xl border border-slate-800 flex items-center gap-3 transition-all hover:bg-white/5 group cursor-pointer ${sidebarOpen ? 'bg-slate-800/40' : 'justify-center'}`}>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-white font-black shadow-lg ${themeBg} shrink-0`}>
                      R
                  </div>
                  {sidebarOpen && (
                      <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-white truncate">Rajesh Kumar</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">{t(`auth.${userRole.toLowerCase()}` as any) || userRole}</p>
                      </div>
                  )}
                  {sidebarOpen && (
                      <button onClick={(e) => { e.preventDefault(); handleLogout(); }} className="text-slate-500 hover:text-red-500 transition-colors">
                          <LogOut size={14} />
                      </button>
                  )}
              </div>
            </Link>
        </div>
      </aside>

      {/* 🏔️ MAIN CONTENT AREA */}
      <main 
        className={`flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-80" : "ml-24"
        }`}
      >
        {/* LIVE PRICE TICKER */}
        <LivePriceTicker />

        {/* STICKY TOP HEADER */}
        <header className="h-20 px-6 md:px-10 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[50] shrink-0 shadow-sm">
            <div className="flex items-center gap-6 flex-1">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="h-10 w-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-all shadow-sm border border-slate-200"
                >
                  <Menu size={20} />
                </button>
                <div className="max-w-md w-full relative hidden md:block group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={18} />
                   <input 
                     placeholder={"Search anything..."} 
                     className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" 
                   />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 px-3 h-9 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{"Live"}</span>
                </div>
                {/* JARVIS temporarily disabled due to network issues - use AgriVoice instead */}
                {/* <JarvisButton userRole={userRole as 'FARMER' | 'BUYER'} /> */}
                <LiveNotificationBell />
                <LanguageSwitcher />
                <Link href="/profile">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-sm hover:scale-105 transition-transform cursor-pointer">
                    R
                  </div>
                </Link>
            </div>
        </header>

        {/* SCROLLABLE CANVAS */}
        <div className="flex-1 overflow-y-auto bg-transparent relative z-10 custom-scrollbar">
            <div className="min-h-full w-full max-w-[1600px] mx-auto px-6 md:px-12 py-8 md:py-12 space-y-10 flex flex-col bg-transparent">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname + currentSection}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex-1 w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>

                {/* Optional Static Footer to ensure no bottom-cut */}
                <div className="mt-auto pt-24 pb-12 flex items-center justify-between border-t border-slate-200/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{"© 2026 FarmGuard Technologies. All rights reserved."}</p>
                    <div className="flex gap-8">
                        <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest">{"Contact"}</Link>
                        <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest">{t('common.terms', 'Terms')}</Link>
                        <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest">{t('common.privacy', 'Privacy')}</Link>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* Main content area */}
    </div>
  );
}
