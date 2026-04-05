"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden grain-texture">
      {/* Animated Background */}
      <div className="absolute inset-0 harvest-gradient" />
      
      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl"
            initial={{ 
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1920, 
              y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 1080
            }}
            animate={{
              x: [null, Math.random() * 200 - 100],
              y: [null, Math.random() * 200 - 100],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 px-5 py-2.5 rounded-full mb-8"
          >
            <Sparkles size={16} className="text-white" />
            <span className="text-sm font-bold text-white">Join 50,000+ Farmers</span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Ready to Transform
            <br />
            Your Farming Business?
          </h2>

          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of farmers earning better prices with AI-powered trading. 
            Start selling smarter today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 bg-white text-[#6B4F3A] font-black px-12 py-6 rounded-2xl shadow-2xl text-lg overflow-hidden btn-3d"
              >
                <span className="relative z-10">Start Free Today</span>
                <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-[#FFF8E7] opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border-2 border-white/50 text-white font-bold px-12 py-6 rounded-2xl hover:bg-white/20 transition-all text-lg"
            >
              Schedule Demo
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-12 border-t border-white/20"
          >
            <div className="text-center">
              <p className="text-3xl font-black text-white mb-1">2 Min</p>
              <p className="text-sm text-white/80 font-medium">Quick Setup</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white mb-1">₹0</p>
              <p className="text-sm text-white/80 font-medium">No Hidden Fees</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white mb-1">24/7</p>
              <p className="text-sm text-white/80 font-medium">Support</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
