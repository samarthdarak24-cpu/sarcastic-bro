"use client";

import { motion } from "framer-motion";

export function TechStackSection() {
  const highlights = [
    {
      icon: "⚡",
      title: "High Performance Frontend",
      description: "Built with Next.js 14, React, and TypeScript. Optimized for speed and reliability.",
      features: ["• App Router for optimal routing", "• Server-side rendering", "• Static generation", "• Image optimization"],
      color: "#0ea5e9",
    },
    {
      icon: "💾",
      title: "Robust Backend",
      description: "RESTful APIs with Express.js and PostgreSQL. Real-time updates with Socket.IO.",
      features: ["• Microservices architecture", "• Real-time messaging", "• Redis caching", "• Database optimization"],
      color: "#22c55e",
    },
    {
      icon: "🤖",
      title: "AI-Powered Services",
      description: "FastAPI for ML models. Quality grading, price prediction, and demand forecasting.",
      features: ["• TensorFlow models", "• Real-time inference", "• Heatmap generation", "• Async processing"],
      color: "#f59e0b",
    },
  ];

  const technologies = [
    "Next.js 14", "React", "TypeScript", "Express.js", 
    "PostgreSQL", "Redis", "Socket.IO", "Elasticsearch",
    "Docker", "FastAPI", "TensorFlow", "Prisma"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#111827]/95 to-[#0ea5e9]/10 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#f9fafb] mb-6">
            Revolutionary Technology
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Built on cutting-edge technology stack for scalability and performance
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-dark rounded-2xl p-8 hover:border-white/20 transition-all"
            >
              <div className="text-5xl mb-4" style={{ color: highlight.color }}>
                {highlight.icon}
              </div>
              <h3 className="text-xl font-bold text-[#f9fafb] mb-3">
                {highlight.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                {highlight.description}
              </p>
              <div className="space-y-1">
                {highlight.features.map((feature, i) => (
                  <div key={i} className="text-xs text-white/80">
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-b border-white/10 py-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, borderColor: "#22c55e" }}
                className="glass-dark rounded-lg px-4 py-3 text-center text-sm font-medium text-white border border-white/10 hover:border-[#22c55e] transition-all cursor-pointer"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
