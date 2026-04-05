"use client";

import { motion } from "framer-motion";

export function HowItWorksSection() {
  const steps = [
    { icon: "📝", title: "Sign Up", desc: "Create account in 2 minutes", color: "#22c55e" },
    { icon: "📦", title: "List Products", desc: "Add crops with AI grading", color: "#0ea5e9" },
    { icon: "🤝", title: "Connect", desc: "Match with buyers instantly", color: "#f59e0b" },
    { icon: "💰", title: "Get Paid", desc: "Secure blockchain payments", color: "#22c55e" },
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
              🚀 Simple Process
            </div>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Start selling in 4 easy steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-blue-200 to-yellow-200 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100"
                >
                  {/* Step Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, delay: index * 0.2 + 0.3 }}
                    className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-black shadow-lg"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                    className="text-6xl mb-4"
                  >
                    {step.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600">
                    {step.desc}
                  </p>

                  {/* Bottom Line */}
                  <div 
                    className="h-1 w-full rounded-full mt-4"
                    style={{ backgroundColor: `${step.color}30` }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
