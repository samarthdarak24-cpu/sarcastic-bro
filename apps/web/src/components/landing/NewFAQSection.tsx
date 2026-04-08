"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function NewFAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: t("landing.faq.q1"),
      a: t("landing.faq.a1"),
      icon: "🤖",
      color: "#a855f7"
    },
    {
      q: t("landing.faq.q2"),
      a: t("landing.faq.a2"),
      icon: "💰",
      color: "#22c55e"
    },
    {
      q: t("landing.faq.q3"),
      a: t("landing.faq.a3"),
      icon: "💳",
      color: "#0ea5e9"
    },
    {
      q: t("landing.faq.q4"),
      a: t("landing.faq.a4"),
      icon: "🌾",
      color: "#f59e0b"
    },
  ];

  return (
    <section className="py-16 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Heading & Bot Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3"
          >
            <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
              {t("landing.faq.badge")}
            </div>
            <h2 className="text-4xl font-black text-[#1e293b] mb-6 leading-tight">
              {t("landing.faq.title")}<br/>
              <span className="text-green-500">{t("landing.faq.ask_farmbot")}</span>
            </h2>
            
            <div className="glass-effect p-6 rounded-3xl border-2 border-green-500/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-green-500/10 transition-colors" />
              <div className="relative flex items-center gap-4">
                <div className="text-5xl animate-bounce-slow">🤖</div>
                <div>
                  <div className="text-sm font-bold text-[#1e293b]">{t("landing.faq.bot_name")}</div>
                  <div className="text-[10px] text-[#64748b]">{t("landing.faq.bot_status")}</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/50 rounded-2xl text-xs text-slate-600 italic">
                "{t("landing.faq.bot_message")}"
              </div>
            </div>
          </motion.div>

          {/* Right: Horizontal/Grid FAQ */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`cursor-pointer group p-6 rounded-2xl border-2 transition-all duration-300 ${
                  openIndex === index 
                  ? "bg-white border-green-500 shadow-xl" 
                  : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl transition-transform group-hover:scale-125 duration-300" style={{ textShadow: `0 0 20px ${faq.color}40` }}>
                      {faq.icon}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight">
                      {faq.q}
                    </h3>
                  </div>
                  <div className={`text-xl transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-green-500' : 'text-slate-300'}`}>
                    ↓
                  </div>
                </div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-50 mt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Horizontal Footer Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap justify-between items-center gap-6"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>{t("landing.faq.still_questions")}</span>
            <button className="font-bold text-green-600 hover:underline">{t("landing.faq.contact_support")} →</button>
          </div>
          <div className="flex gap-4">
            <span className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer">{t("common.privacy")}</span>
            <span className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer">{t("common.terms")}</span>
            <span className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer">{t("common.cookies")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
