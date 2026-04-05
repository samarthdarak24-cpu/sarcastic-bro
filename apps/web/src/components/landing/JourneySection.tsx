"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Truck, Users, DollarSign } from "lucide-react";

export function JourneySection() {
  const stages = [
    {
      icon: Sparkles,
      number: "1",
      title: "IoT Scan",
      subtitle: "Smart Detection",
      description: "Upload crop images through our IoT-enabled system. Computer vision AI instantly analyzes quality, freshness, and grade.",
      emoji: "📸",
      stats: [
        { label: "Accuracy", value: "98%" },
        { label: "Time", value: "2 sec" }
      ]
    },
    {
      icon: ShieldCheck,
      number: "2",
      title: "Quality Grade",
      subtitle: "AI Certification",
      description: "Get instant quality certification (A/B/C grade). AI detects defects, ripeness, and market value to ensure fair pricing.",
      emoji: "✅",
      stats: [
        { label: "Grade", value: "A+" },
        { label: "Verified", value: "100%" }
      ]
    },
    {
      icon: Truck,
      number: "3",
      title: "Transport",
      subtitle: "Smart Logistics",
      description: "Connect with verified logistics partners. Real-time GPS tracking ensures safe delivery from farm to buyer's location.",
      emoji: "🚚",
      stats: [
        { label: "Tracking", value: "Live" },
        { label: "Partners", value: "50+" }
      ]
    },
    {
      icon: Users,
      number: "4",
      title: "Buyer Match",
      subtitle: "Direct Connection",
      description: "AI matches you with verified buyers offering best prices. No middlemen, direct negotiation, instant deal confirmation.",
      emoji: "🤝",
      stats: [
        { label: "Buyers", value: "10K+" },
        { label: "Response", value: "24hr" }
      ]
    },
    {
      icon: DollarSign,
      number: "5",
      title: "Profit",
      subtitle: "Secure Payment",
      description: "Receive instant payment after delivery confirmation. Blockchain-secured transactions ensure transparency and trust.",
      emoji: "💰",
      stats: [
        { label: "Increase", value: "+40%" },
        { label: "Payment", value: "24hr" }
      ]
    }
  ];

  return (
    <section className="relative py-16 bg-gradient-to-b from-[#FFF8E7] to-[#FFFBEB] grain-texture">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FEF3C7] to-[#FED7AA] border-2 border-[#FCD34D]/50 px-5 py-2 rounded-full mb-4">
            <span className="text-[#3E2F23] font-bold text-xs uppercase tracking-wider">
              Your Farming Journey
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#3E2F23] mb-3">
            From Upload to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6B4F3A] via-[#E9C46A] to-[#F4A261]">
              Profit in 5 Steps
            </span>
          </h2>
          <p className="text-base text-[#6B4F3A] max-w-2xl mx-auto">
            See how FarmGuard's IoT and AI technology transforms your farming business
          </p>
        </motion.div>

        {/* Journey Stages - Horizontal Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Card */}
              <div className="field-block p-6 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
                {/* Number Badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-[#6B4F3A] to-[#3E2F23] rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg z-10">
                  {stage.number}
                </div>

                {/* Icon & Emoji */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E9C46A] to-[#F4A261] rounded-xl flex items-center justify-center shadow-md">
                    <stage.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl">{stage.emoji}</div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-[#3E2F23] mb-1">
                  {stage.title}
                </h3>
                <p className="text-sm font-bold text-[#F4A261] mb-3">
                  {stage.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm text-[#6B4F3A] leading-relaxed mb-4 line-clamp-3">
                  {stage.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#6B4F3A] to-[#E9C46A]"
                    />
                  </div>
                  <p className="text-xs font-bold text-[#6B4F3A] mt-1.5">
                    Step {stage.number}/5
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  {stage.stats.map((stat, i) => (
                    <div key={i} className="bg-white/70 rounded-lg p-2 text-center">
                      <p className="text-lg font-black text-[#3E2F23]">
                        {stat.value}
                      </p>
                      <p className="text-[10px] font-semibold text-[#6B4F3A]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow Connector (Desktop) */}
              {index < stages.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 -translate-y-1/2 z-20">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[12px] border-l-[#E9C46A]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-gradient-to-r from-[#6B4F3A] to-[#3E2F23] text-white font-black text-base rounded-xl shadow-xl btn-3d hover:from-[#3E2F23] hover:to-[#6B4F3A] transition-all"
          >
            Start Your IoT Journey Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
