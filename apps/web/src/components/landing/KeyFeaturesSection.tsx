"use client";

import { motion } from "framer-motion";

export function KeyFeaturesSection() {
    const features = [
    { 
      icon: "🤖", 
      title: "AI Quality Detection",
      description: "Instant crop quality analysis using computer vision",
      gradient: "from-emerald-500 to-green-600"
    },
    { 
      icon: "💬", 
      title: "Smart Chat Assistant",
      description: "24/7 AI-powered farming advice and support",
      gradient: "from-blue-500 to-cyan-600"
    },
    { 
      icon: "⛓️", 
      title: "Blockchain Traceability",
      description: "Complete transparency from farm to market",
      gradient: "from-purple-500 to-indigo-600"
    },
    { 
      icon: "🚚", 
      title: "Logistics Management",
      description: "Real-time tracking and delivery optimization",
      gradient: "from-orange-500 to-red-600"
    },
    { 
      icon: "📈", 
      title: "Market Intelligence",
      description: "Live pricing and demand forecasting",
      gradient: "from-pink-500 to-rose-600"
    },
    { 
      icon: "🔒", 
      title: "Secure Payments",
      description: "Escrow protection and instant settlements",
      gradient: "from-teal-500 to-cyan-600"
    },
    { 
      icon: "📊", 
      title: "Analytics Dashboard",
      description: "Comprehensive insights and reporting",
      gradient: "from-violet-500 to-purple-600"
    },
    { 
      icon: "🌍", 
      title: "Global Marketplace",
      description: "Connect with buyers worldwide",
      gradient: "from-sky-500 to-blue-600"
    },
    { 
      icon: "🏪", 
      title: "Direct Trading",
      description: "Eliminate middlemen, maximize profits",
      gradient: "from-amber-500 to-orange-600"
    },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-block mb-6"
          >
            <span className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg">
              ✨ Platform Features
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive tools for modern agriculture
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative"
            >
              {/* Hover Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`} />
              
              {/* Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 h-full"
              >
                {/* Icon Container */}
                <div className="mb-5">
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -15, 15, -15, 0],
                      scale: [1, 1.1, 1.1, 1.1, 1]
                    }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {feature.icon}
                  </motion.div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </div>

                {/* Animated Bottom Border */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl origin-left`}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
