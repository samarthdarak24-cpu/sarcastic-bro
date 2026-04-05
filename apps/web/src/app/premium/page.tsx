"use client";

import { AnimatedHero } from "@/components/landing/AnimatedHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { 
  ShieldCheck, TrendingUp, Truck, Store, Zap, 
  BarChart3, Users, Sparkles, ArrowRight, CheckCircle,
  Sprout, Building2, MessageSquare, Bell
} from "lucide-react";
import Link from "next/link";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as any },
});

export default function PremiumLanding() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#0f172a]/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <span className="text-[17px] font-bold text-white">
              <span className="text-emerald-400">FarmGuard</span> Connect
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {["Features", "Pricing", "About"].map(item => (
              <Link key={item} href={`#${item.toLowerCase()}`} 
                className="text-[13px] font-medium text-white/50 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" 
              className="text-[13px] font-medium text-white/50 hover:text-white px-4 py-2 rounded-lg transition-colors">
              Log in
            </Link>
            <Link href="/auth/register"
              className="text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-all shadow-lg shadow-emerald-600/20">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <AnimatedHero />

      {/* Features Section */}
      <section id="features" className="py-32 bg-[#0f172a] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-5">
          <motion.div {...fadeIn()} className="text-center mb-20">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400 mb-4 block">
              Platform Features
            </span>
            <h2 className="text-[42px] sm:text-[52px] font-black text-white tracking-[-0.03em] mb-5">
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
            <p className="text-[16px] text-white/40 max-w-xl mx-auto">
              Built for scale, designed for simplicity. Every feature crafted to help you trade smarter.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { 
                icon: TrendingUp, 
                title: "AI Pricing", 
                desc: "Fair market rates, automatically calculated.",
                color: "from-emerald-500 to-green-500",
                delay: 0
              },
              { 
                icon: ShieldCheck, 
                title: "Verified Quality", 
                desc: "Every product certified at source.",
                color: "from-sky-500 to-blue-500",
                delay: 0.1
              },
              { 
                icon: Truck, 
                title: "Real-time Logistics", 
                desc: "Track every shipment, live updates.",
                color: "from-amber-500 to-orange-500",
                delay: 0.2
              },
              { 
                icon: Store, 
                title: "Direct Marketplace", 
                desc: "Zero middlemen, full margin control.",
                color: "from-violet-500 to-purple-500",
                delay: 0.3
              },
            ].map((feature) => (
              <motion.div key={feature.title} {...fadeIn(feature.delay)}>
                <GlassCard className="p-8 h-full group cursor-pointer">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <feature.icon size={24} className="text-white" />
                  </motion.div>
                  <h3 className="text-[17px] font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-[14px] text-white/40 leading-relaxed">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Dashboard Demo */}
      <section id="demo" className="py-32 bg-[#0a0f1a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5">
          <motion.div {...fadeIn()} className="text-center mb-16">
            <h2 className="text-[42px] sm:text-[52px] font-black text-white tracking-[-0.03em] mb-5">
              See it in action.
            </h2>
            <p className="text-[16px] text-white/40 max-w-xl mx-auto">
              A glimpse into the future of agricultural commerce.
            </p>
          </motion.div>

          <motion.div
            {...fadeIn(0.2)}
            whileHover={{ rotateY: 5, rotateX: 5 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-5xl mx-auto"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-3xl blur-3xl scale-105" />
            
            <GlassCard className="p-8 relative">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[12px] text-white/30 font-medium uppercase tracking-wider mb-2">
                    Revenue Overview
                  </p>
                  <p className="text-[32px] font-black text-white tracking-tight">₹4,80,000</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full mt-2">
                    <TrendingUp size={10} /> +24.5% this month
                  </span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Bell size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <MessageSquare size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Mock Chart */}
              <div className="flex items-end gap-2 h-40 mb-8">
                {[30, 50, 40, 70, 55, 85, 65, 90, 75, 95, 80, 100].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                    className="flex-1 rounded-lg bg-gradient-to-t from-emerald-500 to-teal-400 relative group cursor-pointer"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: -10 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 px-2 py-1 rounded text-[10px] text-white font-semibold whitespace-nowrap"
                    >
                      ₹{(height * 1000).toLocaleString()}
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Mock Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Active Orders", value: "142", trend: "+12%", up: true },
                  { label: "New Buyers", value: "38", trend: "+8%", up: true },
                  { label: "Pending", value: "7", trend: "-3%", up: false },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/[0.03] border border-white/10 rounded-xl p-4 cursor-pointer"
                  >
                    <p className="text-[11px] text-white/30 font-medium mb-2">{stat.label}</p>
                    <p className="text-[24px] font-black text-white mb-1">{stat.value}</p>
                    <span className={`text-[11px] font-semibold ${stat.up ? "text-emerald-400" : "text-amber-400"}`}>
                      {stat.trend}
                    </span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Split Section - Farmer vs Buyer */}
      <section className="py-32 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div {...fadeIn()} className="text-center mb-16">
            <h2 className="text-[42px] sm:text-[52px] font-black text-white tracking-[-0.03em]">
              Built for both sides.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Farmer Card */}
            <motion.div {...fadeIn(0.1)}>
              <GlassCard className="p-10 h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/30"
                  >
                    <Sprout size={28} className="text-white" />
                  </motion.div>
                  
                  <h3 className="text-[28px] font-black text-white mb-3">For Farmers</h3>
                  <p className="text-[15px] text-white/40 mb-8">Sell directly. Earn more. Grow faster.</p>
                  
                  <ul className="space-y-4 mb-10">
                    {["AI-powered fair pricing", "Direct buyer connections", "Real-time order tracking"].map(item => (
                      <motion.li
                        key={item}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 text-[14px] text-white/60"
                      >
                        <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                  
                  <Link href="/auth/register">
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 text-[14px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                    >
                      Join as Farmer <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>

            {/* Buyer Card */}
            <motion.div {...fadeIn(0.2)}>
              <GlassCard className="p-10 h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-8 shadow-xl shadow-sky-500/30"
                  >
                    <Building2 size={28} className="text-white" />
                  </motion.div>
                  
                  <h3 className="text-[28px] font-black text-white mb-3">For Buyers</h3>
                  <p className="text-[15px] text-white/40 mb-8">Source smarter. Scale faster. Save more.</p>
                  
                  <ul className="space-y-4 mb-10">
                    {["Verified quality produce", "Smart procurement tools", "Pan-India logistics"].map(item => (
                      <motion.li
                        key={item}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 text-[14px] text-white/60"
                      >
                        <CheckCircle size={16} className="text-sky-400 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                  
                  <Link href="/auth/register">
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 text-[14px] font-bold text-white bg-sky-600 hover:bg-sky-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-sky-600/20"
                    >
                      Join as Buyer <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-[#0a0f1a] relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/20 rounded-full blur-[140px]"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
          <motion.div {...fadeIn()}>
            <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-[48px] sm:text-[64px] font-black text-white tracking-[-0.04em] mb-6">
              Ready to transform<br />your agri-business?
            </h2>
            <p className="text-[17px] text-white/40 mb-12 max-w-2xl mx-auto">
              Join thousands of farmers and buyers building transparent, profitable supply chains.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-10 py-5 rounded-xl font-bold text-[16px] bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-[0_0_50px_rgba(34,197,94,0.5)] hover:shadow-[0_0_80px_rgba(34,197,94,0.7)] transition-all flex items-center gap-3"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 blur-2xl"
                  />
                  <span className="relative z-10">Get Started Free</span>
                  <ArrowRight size={20} className="relative z-10" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f1a] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <p className="text-[12px] text-white/25">
            &copy; 2026 FarmGuard Connect. Built with ❤️ for Indian agriculture.
          </p>
        </div>
      </footer>
    </div>
  );
}
