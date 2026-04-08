"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ProblemSection() {
  const { t } = useTranslation();

  const problems = [
    {
      icon: "🔗",
      title: t("landing.problem.middlemen_title"),
      description: t("landing.problem.middlemen_desc"),
      color: "#ef4444",
    },
    {
      icon: "❓",
      title: t("landing.problem.quality_title"),
      description: t("landing.problem.quality_desc"),
      color: "#f59e0b",
    },
    {
      icon: "👁️",
      title: t("landing.problem.opacity_title"),
      description: t("landing.problem.opacity_desc"),
      color: "#0ea5e9",
    },
    {
      icon: "🚚",
      title: t("landing.problem.logistics_title"),
      description: t("landing.problem.logistics_desc"),
      color: "#22c55e",
    },
  ];

  const stats = [
    { 
      value: "30-40%", 
      label: t("landing.problem.stat_commission"), 
      progress: 40, 
      color: "#ef4444" 
    },
    { 
      value: "60%", 
      label: t("landing.problem.stat_unsure"), 
      progress: 60, 
      color: "#f59e0b" 
    },
    { 
      value: t("common.currency_symbol") + "2-3 " + t("common.lakh"), 
      label: t("landing.problem.stat_loss"), 
      progress: 100, 
      color: "#22c55e" 
    },
  ];

  return (
    <section id="problem" className="py-20 bg-[#f9fafb] relative">
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
            {t("landing.problem.title")}
          </h2>
          <p className="text-lg text-[#6b7280] max-w-3xl mx-auto leading-relaxed">
            {t("landing.problem.subtitle")}
          </p>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="glass-effect rounded-2xl p-8 hover:shadow-xl transition-all group cursor-pointer"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-6xl mb-4"
                style={{ color: problem.color }}
              >
                {problem.icon}
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                {problem.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#6b7280] leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              {/* Value */}
              <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: stat.color }}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm text-[#6b7280] font-medium mb-4">
                {stat.label}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stat.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 + index * 0.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
