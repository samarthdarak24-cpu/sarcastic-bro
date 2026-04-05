"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function StatsSection() {
  const [counters, setCounters] = useState({
    farmers: 0,
    gmv: 0,
    quality: 0,
  });

  useEffect(() => {
    const duration = 2500;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      farmers: 450000,
      gmv: 1200,
      quality: 98.5,
    };

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

  const stats = [
    {
      value: `${counters.farmers.toLocaleString()}+`,
      label: "Active Farmers",
      trend: "↑ 15% this month",
      icon: "👨‍🌾",
      color: "#22c55e",
    },
    {
      value: `₹${counters.gmv}Cr`,
      label: "Monthly Gross Merchandise Value",
      trend: "↑ 22% vs last month",
      icon: "💰",
      color: "#0ea5e9",
    },
    {
      value: `${counters.quality}%`,
      label: "AI Quality Grading Accuracy",
      trend: "✓ Verified",
      icon: "✓",
      color: "#f59e0b",
    },
  ];

  return (
    <section id="stats" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#111827] mb-6">
            Trusted by Thousands
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="glass-effect rounded-2xl p-8 text-center relative group cursor-pointer"
            >
              {/* Icon */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-4 text-4xl opacity-20"
              >
                {stat.icon}
              </motion.div>

              {/* Value */}
              <div
                className="text-5xl font-black mb-2"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm text-[#6b7280] font-medium mb-3">
                {stat.label}
              </div>

              {/* Trend */}
              <div
                className="text-xs font-bold"
                style={{ color: stat.color }}
              >
                {stat.trend}
              </div>

              {/* Hover Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"
                style={{ backgroundColor: stat.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
