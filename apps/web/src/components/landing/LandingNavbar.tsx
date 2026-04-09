"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowRight, Zap, Globe, ShieldCheck, Target, Activity, MessageSquare, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
    // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", icon: <Zap size={14} />, key: "home" },
    { label: "Intelligent Sourcing", href: "#features", icon: <Target size={14} />, key: "intelligent_sourcing" },
    { label: "Trade Network", href: "#how-it-works", icon: <Globe size={14} />, key: "trade_network" },
    { label: "Market Intel", href: "#stats", icon: <Activity size={14} />, key: "market_intel" },
    { label: "Contact", href: "#contact", icon: <MessageSquare size={14} />, key: "contact" },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6B4F3A] via-[#E9C46A] to-[#F4A261] origin-left z-[101]"
        style={{ scaleX }}
      />
      
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-[100] px-6 py-6 flex items-center justify-center pointer-events-none transition-all duration-700 ${
          scrolled ? "py-4" : "py-8"
        }`}
      >
        <div
          className={`max-w-[1400px] w-full flex items-center justify-between px-10 py-4 rounded-[2rem] pointer-events-auto transition-all duration-700 relative overflow-hidden group ${
            scrolled
              ? "bg-white/95 backdrop-blur-2xl border-2 border-[#E9C46A]/30 shadow-[0_20px_50px_rgba(107,79,58,0.15)]"
              : "bg-white/90 backdrop-blur-xl border-2 border-[#E9C46A]/20 shadow-lg"
          }`}
        >
          {/* subtle glow line */}
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#E9C46A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4 group/logo">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="h-12 w-12 bg-gradient-to-br from-[#6B4F3A] to-[#3E2F23] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#6B4F3A]/30 transition-all group-hover/logo:shadow-[#6B4F3A]/50"
            >
              <Leaf size={24} />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-[#3E2F23] leading-none">
                FarmGuard<span className="text-[#F4A261]">.</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#6B4F3A] group-hover/logo:text-[#F4A261] transition-colors">AI PLATFORM</span>
            </div>
          </Link>

          {/* Desktop Nav Mesh */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="group/link flex items-center gap-2"
              >
                <span className="text-[#6B4F3A] group-hover/link:text-[#F4A261] transition-colors">{link.icon}</span>
                <span className="text-[11px] font-black text-[#3E2F23] uppercase tracking-[0.15em] relative py-1">
                   {link.label}
                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F4A261] transition-all group-hover/link:w-full" />
                </span>
              </Link>
            ))}
          </div>

          {/* Action Deck */}
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:inline text-[11px] font-black uppercase tracking-widest text-[#6B4F3A] hover:text-[#3E2F23] transition-colors">
              Node Entry
            </Link>
            <Link href="/register">
              <Button variant="gradient" className="h-12 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest bg-gradient-to-r from-[#6B4F3A] to-[#3E2F23] hover:from-[#3E2F23] hover:to-[#6B4F3A] shadow-lg shadow-[#6B4F3A]/20 hover:scale-105 active:scale-95 transition-all">
                Get Started
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>

            {/* Tactical Menu Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden h-12 w-12 bg-[#FFF8E7] rounded-xl flex flex-col items-center justify-center gap-1.5 relative border-2 border-[#E9C46A]"
            >
                <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-[#3E2F23] rounded-full" />
                <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="h-0.5 w-6 bg-[#3E2F23] rounded-full" />
                <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-[#3E2F23] rounded-full" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Overlay Mesh */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-gradient-to-br from-[#FFF8E7] to-[#FFE8CC] backdrop-blur-3xl pt-32 px-10 flex flex-col gap-10 lg:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-4xl font-black text-[#3E2F23] tracking-tighter flex items-center gap-6"
                >
                  <span className="text-[#F4A261]">{link.icon}</span>
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="mt-auto pb-20 space-y-6">
               <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="gradient" className="w-full h-20 rounded-[2rem] text-xl font-black uppercase tracking-widest bg-gradient-to-r from-[#6B4F3A] to-[#3E2F23] shadow-2xl">Get Started</Button>
               </Link>
               <div className="text-center">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-black uppercase tracking-widest text-[#6B4F3A]">Login</Link>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
