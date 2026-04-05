"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function NewHeroSection() {
  const [counters, setCounters] = useState({ farmers: 0, gmv: 0, quality: 0 });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { farmers: 450000, gmv: 1200, quality: 98.5 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounters({
        farmers: Math.floor(targets.farmers * progress),
        gmv: Math.floor(targets.gmv * progress),
        quality: parseFloat((targets.quality * progress).toFixed(1)),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images Collage */}
      <div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-5">
        <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80" alt="" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80" alt="" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80" alt="" className="w-full h-full object-cover" />
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 animated-gradient" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { width: 25, height: 32, left: 10, top: 20, delay: 0, duration: 4 },
          { width: 23, height: 37, left: 22, top: 45, delay: 0.5, duration: 4.5 },
          { width: 28, height: 22, left: 34, top: 70, delay: 1, duration: 5 },
          { width: 27, height: 28, left: 46, top: 20, delay: 1.5, duration: 5.5 },
          { width: 30, height: 24, left: 58, top: 45, delay: 2, duration: 6 },
          { width: 35, height: 23, left: 70, top: 70, delay: 2.5, duration: 6.5 },
          { width: 24, height: 35, left: 82, top: 20, delay: 3, duration: 7 },
          { width: 26, height: 33, left: 94, top: 45, delay: 3.5, duration: 7.5 },
        ].map((particle, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              background: i % 2 === 0 
                ? "rgba(34, 197, 94, 0.1)" 
                : "rgba(14, 165, 233, 0.1)",
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-[60%_40%] gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
            >
              <span className="text-[#111827]">Grow with Confidence.</span>
              <br />
              <span className="text-[#111827]">Trade with </span>
              <span className="text-[#22c55e]">Trust.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-[#6b7280] leading-relaxed mb-10 max-w-2xl"
            >
              The world-class portal for ODOP products. Direct sourcing, AI-driven quality assurance, 
              and real-time supply chain intelligence for the modern agricultural ecosystem.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/register?type=farmer">
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-xl shadow-lg hover:shadow-2xl transition-all"
                >
                  For Farmers
                </motion.button>
              </Link>

              <Link href="/register?type=buyer">
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] rounded-xl shadow-lg hover:shadow-2xl transition-all"
                >
                  For Buyers
                </motion.button>
              </Link>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-8 items-center"
            >
              {/* Stat 1 */}
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#22c55e] mb-1">
                  {counters.farmers.toLocaleString()}+
                </div>
                <div className="text-sm text-[#6b7280] font-medium">Farmers Empowered</div>
              </div>

              <div className="h-12 w-px bg-[#22c55e]/30" />

              {/* Stat 2 */}
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#0ea5e9] mb-1">
                  ₹{counters.gmv}Cr
                </div>
                <div className="text-sm text-[#6b7280] font-medium">Monthly GMV</div>
              </div>

              <div className="h-12 w-px bg-[#22c55e]/30" />

              {/* Stat 3 */}
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#f59e0b] mb-1">
                  {counters.quality}%
                </div>
                <div className="text-sm text-[#6b7280] font-medium">Quality Accuracy</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-6 bg-[#22c55e]/20 rounded-3xl blur-3xl animate-pulse" />
              
              {/* Mockup Image Container */}
              <div className="relative glass-effect rounded-3xl p-3 shadow-2xl overflow-hidden group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img 
                    src="/farmer_demo.png" 
                    alt="Farmer Dashboard Preview" 
                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Subtle Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 to-transparent flex items-end p-8">
                    <div>
                      <div className="text-xl font-bold text-white mb-2">AI-Powered Farmer Hub</div>
                      <div className="text-sm text-white/80">Real-time Grade Analysis & Yield Predictions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card 1: Yield */}
              <motion.div
                animate={{ x: [0, 5, 0], y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-12 top-1/4 glass-effect-white rounded-2xl p-4 shadow-xl border border-white/50 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#22c55e]/10 flex items-center justify-center text-xl">
                    🌾
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Estimated Yield</div>
                    <div className="text-lg font-black text-[#111827]">+24.5%</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Stat Card 2: AI Grading */}
              <motion.div
                animate={{ x: [0, -5, 0], y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-8 bottom-1/4 glass-effect-white rounded-2xl p-4 shadow-xl border border-white/50 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center text-xl">
                    📸
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">AI Quality Grade</div>
                    <div className="text-lg font-black text-[#0ea5e9]">GRADE A+</div>
                  </div>
                </div>
              </motion.div>

              {/* Verified Badge */}
              <motion.div
                animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 glass-effect rounded-2xl px-6 py-4 shadow-2xl border-2 border-[#22c55e] bg-white/90 z-30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#22c55e] flex items-center justify-center text-white">
                    <span className="text-xl">✓</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">ODOP Certified</div>
                    <div className="text-[10px] font-bold text-[#22c55e]">Verified Portal</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#6b7280] rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
