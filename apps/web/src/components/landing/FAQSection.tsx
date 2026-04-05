"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does FarmGuard work?",
      answer: "FarmGuard connects farmers directly with buyers through our AI-powered platform. Simply register, list your products with photos, and our AI grades the quality. Buyers can then make offers, and you choose the best one. We handle secure payments and logistics tracking."
    },
    {
      question: "Is there any commission or hidden fees?",
      answer: "No hidden fees! FarmGuard charges a small 2% transaction fee only when you successfully sell. Registration, listing products, and using AI quality grading are completely free."
    },
    {
      question: "How accurate is the AI quality grading?",
      answer: "Our AI quality grading system has 95%+ accuracy, trained on millions of crop images. It analyzes color, size, defects, and freshness to provide instant A/B/C grades. This helps you get better prices and builds buyer trust."
    },
    {
      question: "How do I receive payments?",
      answer: "Payments are processed through our secure escrow system. Once the buyer confirms delivery, funds are released to your bank account within 24 hours. We support UPI, bank transfer, and digital wallets."
    },
    {
      question: "Can I use FarmGuard in my local language?",
      answer: "Yes! FarmGuard supports Hindi, Marathi, and English. You can switch languages anytime from the settings. Our chat system also has built-in translation to help you communicate with buyers."
    },
    {
      question: "What if there's a dispute with a buyer?",
      answer: "We have a dedicated dispute resolution team. All transactions are protected by our escrow system, and we maintain complete records. Our team will mediate and ensure fair resolution within 48 hours."
    }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-bold">Got Questions?</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            Frequently Asked
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about FarmGuard
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-emerald-300 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">{faq.question}</span>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center transition-all ${openIndex === i ? 'bg-emerald-500' : ''}`}>
                  {openIndex === i ? (
                    <Minus size={20} className="text-white" />
                  ) : (
                    <Plus size={20} className="text-emerald-600" />
                  )}
                </div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === i ? "auto" : 0,
                  opacity: openIndex === i ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
