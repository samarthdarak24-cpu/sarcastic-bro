"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Award, ShieldCheck } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function TrustSection() {
  const stats = [
    { icon: Users, value: 50000, suffix: "+", label: "Active Farmers", color: "emerald" },
    { icon: TrendingUp, value: 1000000, suffix: "+", label: "Transactions", color: "blue" },
    { icon: Award, value: 10, suffix: "Cr+", label: "Trade Value", color: "yellow" },
    { icon: ShieldCheck, value: 98, suffix: "%", label: "Trust Score", color: "purple" }
  ];

  return (
    <section className="py-20 relative bg-gradient-to-b from-white to-[#FFF8E7] grain-texture">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="field-block p-8 hover:-translate-y-2 hover:border-[#6B4F3A]">
                <div className="w-14 h-14 rounded-2xl harvest-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform pulse-glow">
                  <stat.icon size={28} className="text-white" />
                </div>
                <p className="text-4xl font-black text-[#3E2F23] mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm font-semibold text-[#6B4F3A]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
