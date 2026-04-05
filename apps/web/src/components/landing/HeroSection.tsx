"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sprout, TrendingUp, Shield, Zap, Wheat } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#F5E6D3] via-[#FFF8E7] to-[#FFE8CC]">
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 grain-texture opacity-100" />
      
      {/* Soil Pattern */}
      <div className="absolute inset-0 soil-pattern" />
      
      {/* Organic Shapes Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#E9C46A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#F4A261]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#6B4F3A]/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Wheat Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
              opacity: [0.15, 0.35, 0.15]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Wheat className="w-16 h-16 text-[#6B4F3A]/30" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300/50 px-6 py-3 rounded-full mb-8 shadow-lg"
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-[#3E2F23] font-bold text-sm uppercase tracking-wider">
                AI-Powered Agriculture Intelligence
              </span>
            </motion.div>

            {/* Revolutionary Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-8">
              <span className="text-[#3E2F23]">From</span>{" "}
              <span className="text-[#6B4F3A]">Soil</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B4F3A] via-[#E9C46A] to-[#F4A261]">
                To Smart
              </span>
              <br />
              <span className="text-[#F4A261]">Profits</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#6B4F3A] mb-10 leading-relaxed font-medium max-w-xl">
              AI that <span className="font-black text-[#F4A261]">understands your farm</span>. 
              Connect with buyers, grade quality instantly, and earn{" "}
              <span className="font-black text-[#E9C46A]">40% more</span>.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: Sprout, text: "Real Farming", color: "from-green-600 to-emerald-600" },
                { icon: Shield, text: "100% Secure", color: "from-blue-600 to-cyan-600" },
                { icon: TrendingUp, text: "Higher Income", color: "from-orange-600 to-amber-600" }
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity`} />
                  <div className="relative flex items-center gap-2 bg-white border-2 border-amber-200 px-5 py-2.5 rounded-full shadow-md">
                    <item.icon className="w-5 h-5 text-[#6B4F3A]" />
                    <span className="text-[#3E2F23] font-bold text-sm">{item.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  className="group relative px-10 py-5 bg-gradient-to-r from-[#6B4F3A] to-[#3E2F23] text-white font-black text-lg rounded-2xl overflow-hidden btn-3d"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E9C46A] to-[#F4A261] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-3">
                    Start Growing Today
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white border-3 border-[#6B4F3A] text-[#3E2F23] font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
              >
                <Zap className="w-6 h-6 text-[#F4A261]" />
                See AI in Action
              </motion.button>
            </div>

            {/* Stats - Field Block Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { value: "50K+", label: "Farmers", icon: "🌾" },
                { value: "₹10Cr+", label: "Trade Value", icon: "💰" },
                { value: "98%", label: "Success Rate", icon: "⭐" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="field-block p-4 hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-3xl font-black text-[#3E2F23] mb-1">{stat.value}</p>
                  <p className="text-sm text-[#6B4F3A] font-semibold">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Image with AI Overlay */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Growing Plant Animation */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-64 origin-bottom"
            >
              <Sprout className="w-full h-full text-green-600/20" />
            </motion.div>

            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-6 bg-gradient-to-r from-[#E9C46A] via-[#F4A261] to-[#6B4F3A] rounded-3xl blur-3xl opacity-20 pulse-glow" />
              
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl p-4 shadow-2xl border-4 border-amber-200">
                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                    alt="Farmer with crops"
                    fill
                    className="object-cover"
                  />
                  {/* AI Scanning Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3E2F23]/60 via-transparent to-transparent" />
                  
                  {/* AI Scan Lines */}
                  <motion.div
                    animate={{ y: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E9C46A] to-transparent opacity-70"
                  />
                </div>

                {/* AI Quality Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute top-8 right-8 bg-white rounded-2xl px-6 py-4 shadow-2xl border-2 border-green-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute" />
                      <div className="w-4 h-4 bg-green-500 rounded-full" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">AI Detected</p>
                      <p className="text-3xl font-black text-green-600">Grade A+</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 font-semibold">
                    Quality: 98.5% • Fresh
                  </div>
                </motion.div>

                {/* Price Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-8 left-8 bg-gradient-to-br from-[#E9C46A] to-[#F4A261] rounded-2xl px-6 py-4 shadow-2xl"
                >
                  <p className="text-xs font-bold text-[#3E2F23] uppercase mb-1">Market Price</p>
                  <p className="text-4xl font-black text-white">₹45<span className="text-xl">/kg</span></p>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-white" />
                    <p className="text-sm text-white font-bold">+22% vs yesterday</p>
                  </div>
                </motion.div>
              </div>
            </div>
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
          className="w-6 h-10 border-2 border-[#6B4F3A] rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 bg-[#F4A261] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
