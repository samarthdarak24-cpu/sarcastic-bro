"use client";

import { motion } from "framer-motion";

export function PlatformDemoSection() {
  const features = [
    {
      title: "AI Quality Detection",
      description: "Upload crop images and get instant quality grades",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80",
      badge: "98.5% Accurate",
      color: "#22c55e",
    },
    {
      title: "Real-time Marketplace",
      description: "Connect with verified buyers instantly",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80",
      badge: "450K+ Users",
      color: "#0ea5e9",
    },
    {
      title: "Smart Logistics",
      description: "Track your shipments with blockchain",
      image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&q=80",
      badge: "Real-time GPS",
      color: "#f59e0b",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #22c55e 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#111827] mb-4">
            Platform Features in Action
          </h2>
          <p className="text-lg text-[#6b7280]">
            See how our technology transforms agricultural trading
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="glass-effect rounded-2xl overflow-hidden shadow-xl">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <div 
                    className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-sm font-bold backdrop-blur-sm"
                    style={{ backgroundColor: `${feature.color}CC` }}
                  >
                    {feature.badge}
                  </div>

                  {/* Play Icon Overlay */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[20px] border-t-[12px] border-b-[12px] border-l-[#22c55e] border-t-transparent border-b-transparent ml-1" />
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#111827] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="mt-4 text-sm font-bold flex items-center gap-2 group/btn"
                    style={{ color: feature.color }}
                  >
                    <span>Learn More</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Explore All Features →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
