"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-center pointer-events-none"
    >
      <div className="max-w-7xl w-full flex items-center justify-between px-6 py-3 glass-card premium-blur rounded-full pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-startup-soft group-hover:scale-110 transition-transform">
            O
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-neut-900">
            ODOP <span className="text-brand-primary">Connect</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-semibold text-neut-600 hover:text-brand-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-semibold text-neut-600 hover:text-brand-primary transition-colors">How it works</Link>
          <Link href="#stats" className="text-sm font-semibold text-neut-600 hover:text-brand-primary transition-colors">Market Stats</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-neut-900 hover:text-brand-primary transition-colors">
            Login
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm" className="rounded-full px-6 shadow-md shadow-brand-primary/20">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
