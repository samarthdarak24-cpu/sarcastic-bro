"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export function AIDemoSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gradient-to-b from-[#FFF8E7] to-white grain-texture">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E0E7FF] to-[#DBEAFE] border-2 border-[#A5B4FC]/50 px-5 py-2 rounded-full mb-4">
            <Sparkles size={14} className="text-[#6366F1]" />
            <span className="text-[#3E2F23] font-bold text-xs uppercase tracking-wider">
              {t("landing.ai_demo.badge")}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#3E2F23] mb-3">
            {t("landing.ai_demo.title")}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
              {t("landing.ai_demo.subtitle")}
            </span>
          </h2>
        </motion.div>

        {/* Demo Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before - Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="field-block p-6">
              <h3 className="text-xl font-black text-[#3E2F23] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-[#6B4F3A] to-[#3E2F23] rounded-lg flex items-center justify-center text-white text-sm font-black">1</span>
                {t("landing.ai_demo.step1")}
              </h3>
              
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 border-2 border-[#E9C46A]/50">
                <Image
                  src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80"
                  alt="Tomato sample"
                  fill
                  className="object-cover"
                />
                {/* Scanning Animation */}
                <motion.div
                  animate={{ y: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6366F1] to-transparent opacity-70"
                />
              </div>

              <div className="bg-white/70 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-[#6B4F3A]">🔍 {t("landing.ai_demo.analyzing")}</p>
              </div>
            </div>
          </motion.div>

          {/* After - Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="field-block p-6">
              <h3 className="text-xl font-black text-[#3E2F23] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-[#E9C46A] to-[#F4A261] rounded-lg flex items-center justify-center text-white text-sm font-black">2</span>
                {t("landing.ai_demo.step2")}
              </h3>

              {/* Grade Badge */}
              <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-xl mb-4">
                <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">{t("landing.ai_demo.quality_grade")}</p>
                <p className="text-5xl font-black mb-1">A</p>
                <p className="text-sm opacity-90">{t("landing.ai_demo.premium_quality")}</p>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="bg-white/70 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#6B4F3A]">{t("landing.ai_demo.confidence")}</span>
                    <span className="text-lg font-black text-[#3E2F23]">92%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="bg-[#10B981] h-1.5 rounded-full"
                    />
                  </div>
                </div>

                <div className="bg-white/70 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#10B981]" />
                  <span className="text-xs font-semibold text-[#3E2F23]">{t("landing.ai_demo.no_defects")}</span>
                </div>

                <div className="bg-white/70 rounded-lg p-3">
                  <p className="text-xs font-semibold text-[#6B4F3A] mb-1">{t("landing.ai_demo.recommended_price")}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black text-[#3E2F23]">₹45<span className="text-sm">{t("landing.ai_demo.per_kg")}</span></p>
                    <div className="flex items-center gap-1 text-[#10B981]">
                      <TrendingUp size={12} />
                      <span className="text-xs font-bold">+18%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
