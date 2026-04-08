"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function BenefitsComparisonSection() {
  const { t } = useTranslation();

  const farmerBenefits = [
    { 
      icon: "💰", 
      title: t("landing.benefits.farmer.income"),
      gradient: "from-amber-500 to-orange-600"
    },
    { 
      icon: "⚡", 
      title: t("landing.benefits.farmer.ai_grading"),
      gradient: "from-yellow-400 to-amber-500"
    },
    { 
      icon: "📱", 
      title: t("landing.benefits.farmer.pricing"),
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      icon: "🔒", 
      title: t("landing.benefits.farmer.payments"),
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      icon: "🚚", 
      title: t("landing.benefits.farmer.logistics"),
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      icon: "📊", 
      title: t("landing.benefits.farmer.analytics"),
      gradient: "from-indigo-500 to-purple-600"
    },
  ];

  const buyerBenefits = [
    { 
      icon: "✓", 
      title: t("landing.benefits.buyer.verified"),
      gradient: "from-green-500 to-teal-600"
    },
    { 
      icon: "🌾", 
      title: t("landing.benefits.buyer.direct"),
      gradient: "from-lime-500 to-green-600"
    },
    { 
      icon: "💳", 
      title: t("landing.benefits.buyer.flexible"),
      gradient: "from-blue-500 to-indigo-600"
    },
    { 
      icon: "Box", 
      title: t("landing.benefits.buyer.bulk"),
      gradient: "from-orange-500 to-red-600"
    },
    { 
      icon: "🔍", 
      title: t("landing.benefits.buyer.traceability"),
      gradient: "from-cyan-500 to-blue-600"
    },
    { 
      icon: "⏱️", 
      title: t("landing.benefits.buyer.fast"),
      gradient: "from-pink-500 to-rose-600"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-bold rounded-full shadow-lg">
              ✨ {t("landing.benefits.badge")}
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 mb-4">
            {t("landing.benefits.title")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("landing.benefits.subtitle")}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Farmer Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Decorative Frame */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl blur opacity-20"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg"
                  >
                    👨‍🌾
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{t("landing.benefits.for_farmers")}</h3>
                    <p className="text-green-100 text-sm">{t("landing.benefits.maximize_profits")}</p>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {farmerBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative"
                  >
                    {/* Card Glow Effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${benefit.gradient} rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300`}></div>
                    
                    <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-xl p-4 border border-slate-200 shadow-md group-hover:shadow-xl transition-all duration-300">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center text-2xl mb-3 shadow-lg`}
                      >
                        {benefit.icon}
                      </motion.div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">
                        {benefit.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Buyer Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Decorative Frame */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 rounded-3xl blur opacity-20"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg"
                  >
                    🏢
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{t("landing.benefits.for_buyers")}</h3>
                    <p className="text-blue-100 text-sm">{t("landing.benefits.quality_guaranteed")}</p>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {buyerBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative"
                  >
                    {/* Card Glow Effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${benefit.gradient} rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300`}></div>
                    
                    <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-xl p-4 border border-slate-200 shadow-md group-hover:shadow-xl transition-all duration-300">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center text-2xl mb-3 shadow-lg`}
                      >
                        {benefit.icon === "Box" ? "📦" : benefit.icon}
                      </motion.div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">
                        {benefit.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
