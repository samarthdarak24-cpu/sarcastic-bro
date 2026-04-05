"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, TrendingUp, Truck, MessageSquare, Globe, Zap, BarChart3 } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: "AI Crop Detection",
      desc: "Upload photos, get instant quality grades (A/B/C) with 95% accuracy",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Smart Pricing",
      desc: "AI-powered price recommendations based on real-time market data",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: ShieldCheck,
      title: "Direct Farmer-to-Buyer",
      desc: "No middlemen. Connect directly with 10,000+ verified buyers",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Truck,
      title: "Real-Time Tracking",
      desc: "Track your shipments live with GPS and get delivery updates",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: MessageSquare,
      title: "Multilingual Support",
      desc: "Chat in Hindi, English, Marathi with built-in translation",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      title: "Market Intelligence",
      desc: "Get demand forecasts and crop recommendations powered by AI",
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      icon: Zap,
      title: "Instant Payments",
      desc: "Secure escrow system with instant payment release on delivery",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Track sales, revenue, and performance with beautiful charts",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <section className="py-32 relative grain-texture soil-pattern bg-gradient-to-b from-[#FFF8E7] to-[#FFE8CC]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-black mb-6">
            <span className="text-[#3E2F23]">Everything You Need to</span>
            <span className="block text-harvest mt-2">
              Grow & Prosper
            </span>
          </h2>
          <p className="text-xl text-[#6B4F3A] max-w-2xl mx-auto font-medium">
            Powerful AI-driven tools rooted in agricultural intelligence
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 harvest-gradient opacity-0 group-hover:opacity-100 rounded-3xl blur transition-opacity" />
              
              <div className="relative field-block p-8 h-full hover:border-[#6B4F3A] transition-all">
                <div className="w-16 h-16 rounded-2xl harvest-gradient flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform btn-3d">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2F23] mb-3">{feature.title}</h3>
                <p className="text-[#6B4F3A] leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
