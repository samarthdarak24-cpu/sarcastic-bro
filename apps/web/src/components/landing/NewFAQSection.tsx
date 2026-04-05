"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function NewFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does AI quality grading work?",
      a: "Our AI analyzes crop images to assign grades (A+, A, B, C) with 98.5% accuracy.",
      icon: "🤖",
      color: "#a855f7"
    },
    {
      q: "Is FarmGuard free to use?",
      a: "Yes! Registration is free. We charge only 2-3% commission on successful transactions.",
      icon: "💰",
      color: "#22c55e"
    },
    {
      q: "How do I get paid?",
      a: "Payments are processed within 24-48 hours through our secure AgriPay system.",
      icon: "💳",
      color: "#0ea5e9"
    },
    {
      q: "What crops are supported?",
      a: "We support 50+ crops including vegetables, fruits, grains, and pulses.",
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
              Digital Assistant
            </div>
            <h2 className="text-4xl font-black text-[#1e293b] mb-6 leading-tight">
              Got Questions?<br/>
              <span className="text-green-500">Ask FarmBot.</span>
            </h2>
            
            <div className="glass-effect p-6 rounded-3xl border-2 border-green-500/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-green-500/10 transition-colors" />
              <div className="relative flex items-center gap-4">
                <div className="text-5xl animate-bounce-slow">🤖</div>
                <div>
                  <div className="text-sm font-bold text-[#1e293b]">FarmBot AI</div>
                  <div className="text-[10px] text-[#64748b]">Online & Ready to help</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/50 rounded-2xl text-xs text-slate-600 italic">
                "I can help you understand our AI grading, payment cycles, and marketplace policies instantly!"
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
            <span>Still have questions?</span>
            <button className="font-bold text-green-600 hover:underline">Contact Support →</button>
          </div>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
              <span key={link} className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer">{link}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
