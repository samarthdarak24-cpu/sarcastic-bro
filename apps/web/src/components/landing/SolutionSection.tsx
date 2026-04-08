"use client";

import { motion } from "framer-motion";
export function SolutionSection() {
    const benefits = [
    {
      icon: "🤝",
      title: t("landing.solution.direct_title"),
      description: t("landing.solution.direct_desc"),
      highlight: t("landing.solution.direct_highlight"),
      color: "#22c55e",
    },
    {
      icon: "🤖",
      title: t("landing.solution.quality_title"),
      description: t("landing.solution.quality_desc"),
      highlight: t("landing.solution.quality_highlight"),
      color: "#0ea5e9",
    },
    {
      icon: "⛓️",
      title: t("landing.solution.transparency_title"),
      description: t("landing.solution.transparency_desc"),
      highlight: t("landing.solution.transparency_highlight"),
      color: "#f59e0b",
    },
  ];

  return (
    <section id="solution" className="py-20 bg-white relative">
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
            {t("landing.solution.title")}
          </h2>
          <p className="text-lg text-[#6b7280] max-w-2xl mx-auto">
            {t("landing.solution.subtitle")}
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-[60%_40%] gap-12 items-center">
          {/* Left - Platform Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Dashboard Preview with Real Image */}
              <div className="relative glass-effect rounded-3xl p-4 shadow-2xl overflow-hidden">
                {/* Background Image - Farmer in Field */}
                <div className="absolute inset-0 opacity-10">
                  <img 
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80" 
                    alt="Farmer background"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Dashboard Mockup */}
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=100&q=80"
                          alt="Farmer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{t("landing.solution.mockup.farmer_name")}</div>
                        <div className="text-white/80 text-xs">{t("landing.solution.mockup.farmer_role")}</div>
                      </div>
                    </div>
                    <div className="text-white text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                      ⭐ 4.9
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-4 space-y-3">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-[#22c55e]/10 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-[#22c55e]">₹45K</div>
                        <div className="text-xs text-gray-600">{t("landing.solution.this_month")}</div>
                      </div>
                      <div className="bg-[#0ea5e9]/10 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-[#0ea5e9]">28</div>
                        <div className="text-xs text-gray-600">{t("landing.solution.orders")}</div>
                      </div>
                      <div className="bg-[#f59e0b]/10 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-[#f59e0b]">A+</div>
                        <div className="text-xs text-gray-600">{t("landing.solution.grade")}</div>
                      </div>
                    </div>

                    {/* Product Card */}
                    <div className="flex gap-3 bg-gray-50 rounded-lg p-3">
                      <img 
                        src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&q=80"
                        alt="Tomatoes"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-sm text-gray-800">{t("landing.solution.fresh_tomatoes")}</div>
                        <div className="text-xs text-gray-600">500 {t("landing.solution.kg_available")}</div>
                        <div className="text-sm font-bold text-[#22c55e] mt-1">₹35/kg</div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-[#22c55e] text-white text-xs font-bold py-2 rounded-lg">
                        📸 {t("landing.solution.ai_grade_btn")}
                      </button>
                      <button className="bg-[#0ea5e9] text-white text-xs font-bold py-2 rounded-lg">
                        💬 {t("landing.solution.chat_btn")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 glass-effect rounded-xl p-3 shadow-lg"
                >
                  <div className="text-xs font-bold text-[#22c55e]">✓ {t("landing.solution.verified")}</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 glass-effect rounded-xl p-3 shadow-lg"
                >
                  <div className="text-xs font-bold text-[#0ea5e9]">🔒 {t("landing.solution.blockchain")}</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Benefit Cards */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-all group"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="text-5xl mb-4"
                >
                  {benefit.icon}
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#111827] mb-2">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#6b7280] leading-relaxed mb-3">
                  {benefit.description}
                </p>

                {/* Highlight */}
                <div 
                  className="inline-block px-4 py-2 rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: benefit.color }}
                >
                  {benefit.highlight}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
