"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { GradientButton } from "../ui/GradientButton";
import { AnimatedCounter } from "../ui/AnimatedCounter";

export function AnimatedHero() {
    const words = ["Revolutionizing", "Digital", "Agriculture", "Efficiency"];
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0f172a]">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(14,165,233,0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(168,85,247,0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 pt-24 pb-20 w-full">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-full mb-8 backdrop-blur-xl">
              <Sparkles size={12} className="animate-pulse" />
              Leading Agritech Platform
            </span>
          </motion.div>

          {/* Animated headline */}
          <div className="mb-8">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className={`text-[56px] sm:text-[72px] lg:text-[96px] font-black tracking-[-0.04em] leading-[1.02] inline-block mr-4 ${
                  i % 2 === 0 ? "text-white" : "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-[18px] text-white/50 leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Empowering farmers and buyers with AI-driven intelligence, secure blockchain payments, and direct market access.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            <Link href="/auth/register">
              <GradientButton icon={<ArrowRight size={18} />}>
                Start for Free
              </GradientButton>
            </Link>
            <Link href="#demo">
              <GradientButton variant="secondary">
                Watch Demo
              </GradientButton>
            </Link>
          </motion.div>

          {/* Animated stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: 450000, suffix: "+", label: "Active Farmers" },
              { value: 750, suffix: "+", label: "Buyer Networks" },
              { value: 98, suffix: "%", label: "Success Rate" },
              { value: 150, suffix: "Cr+", label: "Trade Volume" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.7 + i * 0.1 }}
                className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-2xl p-6"
              >
                <div className="text-[36px] font-black text-emerald-400 mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[12px] text-white/40 font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
