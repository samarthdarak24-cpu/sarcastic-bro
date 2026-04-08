"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
export function NewNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Intelligent Sourcing", href: "#features" },
    { label: "Trade Network", href: "#how-it-works" },
    { label: "Market Intel", href: "#stats" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Premium FarmGuard Logo */}
              <motion.div
                className="relative flex items-center justify-center w-12 h-12 rounded-xl shadow-lg bg-white overflow-hidden"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              >
                <img src="/farmguard-logo.png" alt="FarmGuard Logo" className="w-full h-full object-cover" />
              </motion.div>

              {/* Text */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-2xl font-bold flex items-center"
              >
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 tracking-tighter text-3xl font-black inline-block"
                  animate={{ backgroundPosition: ['0% center', '200% center'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  Farm
                </motion.span>
                <span className="text-[#111827] tracking-tighter text-3xl font-black">Guard</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.href);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-sm font-medium text-[#6b7280] hover:text-[#22c55e] transition-colors relative group cursor-pointer"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#22c55e] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Login Button */}
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 text-sm font-semibold text-[#22c55e] border-2 border-[#22c55e] rounded-lg hover:bg-[#22c55e] hover:text-white transition-all duration-300"
                >
                  Login
                </motion.button>
              </Link>

              {/* Get Started Button */}
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#111827]"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white lg:hidden"
          >
            <div className="flex flex-col h-full pt-24 px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    const target = document.querySelector(link.href);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-2xl font-bold text-[#111827] py-4 border-b border-gray-200 cursor-pointer"
                >
                  {link.label}
                </motion.a>
              ))}

              <div className="mt-auto pb-8 space-y-4">
                {/* Language Switcher for Mobile */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <LanguageSwitcher />
                </div>
                
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full px-6 py-3 text-sm font-semibold text-[#22c55e] border-2 border-[#22c55e] rounded-lg">
                    Login
                  </button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <button className="w-full px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-lg">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
