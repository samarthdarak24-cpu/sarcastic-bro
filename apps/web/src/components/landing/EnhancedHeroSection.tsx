"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export function EnhancedHeroSection() {
  const [counters, setCounters] = useState({ farmers: 0, gmv: 0, quality: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Magnetic button effect
  const buttonX = useMotionValue(0);
  const buttonY = useMotionValue(0);
  const buttonSpringX = useSpring(buttonX, { stiffness: 300, damping: 20 });
  const buttonSpringY = useSpring(buttonY, { stiffness: 300, damping: 20 });

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

  // Mouse move effect for spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    buttonX.set(x * 0.3);
    buttonY.set(y * 0.3);
  };

  const handleButtonLeave = () => {
    buttonX.set(0);
    buttonY.set(0);
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-[110px]">
      {/* Morphing Blob Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="morph-blob absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-400/20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="morph-blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 270, 180, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="morph-blob absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-orange-400/20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Spotlight Effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)`
        }}
      />

      {/* Background Images Collage with Parallax */}
      <motion.div 
        className="absolute inset-0 grid grid-cols-3 gap-2 opacity-5"
        style={{ y }}
      >
        <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80" alt="" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80" alt="" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80" alt="" className="w-full h-full object-cover" />
      </motion.div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 animated-gradient" />

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { width: 25, height: 32, left: 10, top: 20, delay: 0, duration: 4, color: "green" },
          { width: 23, height: 37, left: 22, top: 45, delay: 0.5, duration: 4.5, color: "blue" },
          { width: 28, height: 22, left: 34, top: 70, delay: 1, duration: 5, color: "amber" },
          { width: 27, height: 28, left: 46, top: 20, delay: 1.5, duration: 5.5, color: "green" },
          { width: 30, height: 24, left: 58, top: 45, delay: 2, duration: 6, color: "blue" },
          { width: 35, height: 23, left: 70, top: 70, delay: 2.5, duration: 6.5, color: "amber" },
          { width: 24, height: 35, left: 82, top: 20, delay: 3, duration: 7, color: "green" },
          { width: 26, height: 33, left: 94, top: 45, delay: 3.5, duration: 7.5, color: "blue" },
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              background: particle.color === "green" 
                ? "rgba(34, 197, 94, 0.15)" 
                : particle.color === "blue"
                ? "rgba(14, 165, 233, 0.15)"
                : "rgba(245, 158, 11, 0.15)",
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              filter: "blur(2px)"
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full"
        style={{ opacity }}
      >
        <div className="grid lg:grid-cols-[60%_40%] gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Headline with Text reveal without cutoff */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
            >
              <motion.span 
                className="text-[#111827] inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Transform Your Farm into a
              </motion.span>
              <br />
              <motion.span 
                className="text-[#111827] inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Digital Powerhouse with{" "}
              </motion.span>
              <motion.span 
                className="text-[#22c55e] inline-block neon-text"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.6, 
                  type: "spring", 
                  stiffness: 150, 
                  damping: 15
                }}
              >
                Trust
              </motion.span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg md:text-xl text-[#6b7280] leading-relaxed mb-10 max-w-2xl"
            >
              Join India's most advanced agricultural marketplace powered by AI, blockchain, and real-time intelligence. Direct sourcing, transparent pricing, and verified quality.
            </motion.p>

            {/* CTA Buttons with Magnetic Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/register?type=farmer">
                <motion.button
                  className="magnetic-button px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-xl shadow-lg relative overflow-hidden"
                  style={{ x: buttonSpringX, y: buttonSpringY }}
                  onMouseMove={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileHover={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">I'm a Farmer</span>
                </motion.button>
              </Link>

              <Link href="/register?type=buyer">
                <motion.button
                  className="magnetic-button px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] rounded-xl shadow-lg relative overflow-hidden"
                  style={{ x: buttonSpringX, y: buttonSpringY }}
                  onMouseMove={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileHover={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">I'm a Buyer</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Statistics with Stagger Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap gap-8 items-center"
            >
              {/* Stat 1 */}
              <motion.div 
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 1.3,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <div className="text-3xl md:text-4xl font-black text-[#22c55e] mb-1 glow-pulse">
                  {counters.farmers.toLocaleString()}+
                </div>
                <div className="text-sm text-[#6b7280] font-medium">Farmers Empowered</div>
              </motion.div>

              <motion.div 
                className="h-12 w-px bg-[#22c55e]/30"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              />

              {/* Stat 2 */}
              <motion.div 
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 1.5,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <div className="text-3xl md:text-4xl font-black text-[#0ea5e9] mb-1 glow-pulse">
                  ₹{counters.gmv}Cr
                </div>
                <div className="text-sm text-[#6b7280] font-medium">Monthly GMV</div>
              </motion.div>

              <motion.div 
                className="h-12 w-px bg-[#22c55e]/30"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              />

              {/* Stat 3 */}
              <motion.div 
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 1.7,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <div className="text-3xl md:text-4xl font-black text-[#f59e0b] mb-1 glow-pulse">
                  {counters.quality}%
                </div>
                <div className="text-sm text-[#6b7280] font-medium">Quality Accuracy</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Static Mockup */}
          <div className="relative hidden lg:block">
            <div className="relative" style={{ transformStyle: "preserve-3d" }}>
              {/* Glow Effect - Static */}
              <div className="absolute -inset-6 bg-[#22c55e]/15 rounded-3xl blur-3xl opacity-50" />
              
              {/* Mockup Image Container - Static */}
              <div className="relative glass-effect rounded-3xl p-3 shadow-2xl overflow-hidden group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img 
                    src="/farmer_demo.png" 
                    alt="AI-Powered Farming Dashboard" 
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 to-transparent flex items-end p-8">
                    <div>
                      <div className="text-xl font-bold text-white mb-2">AI-Powered Farming</div>
                      <div className="text-sm text-white/80">Real-time insights and smart recommendations</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card 1: Yield - Static */}
              <div className="absolute -left-12 top-1/4 glass-effect-white rounded-2xl p-4 shadow-xl border border-white/50 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#22c55e]/10 flex items-center justify-center text-xl">
                    🌾
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Estimated Yield</div>
                    <div className="text-lg font-black text-[#111827]">+24.5%</div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card 2: AI Grading - Static */}
              <div className="absolute -right-8 bottom-1/4 glass-effect-white rounded-2xl p-4 shadow-xl border border-white/50 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center text-xl">
                    📸
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">AI Quality Grade</div>
                    <div className="text-lg font-black text-[#0ea5e9]">GRADE A+</div>
                  </div>
                </div>
              </div>

              {/* Verified Badge - Static */}
              <div className="absolute -top-6 -right-6 glass-effect rounded-2xl px-6 py-4 shadow-2xl border-2 border-[#22c55e] bg-white/90 z-30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#22c55e] flex items-center justify-center text-white">
                    <span className="text-xl">✓</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">ODOP Certified</div>
                    <div className="text-[10px] font-bold text-[#22c55e]">Verified Portal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#6b7280] rounded-full flex items-start justify-center p-2 cursor-pointer hover:border-[#22c55e] transition-colors"
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-[#22c55e] rounded-full"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
