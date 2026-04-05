"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Quote } from "lucide-react";

export function FarmerStorySection() {
  const stories = [
    {
      name: "Rajesh Kumar",
      role: "Tomato Farmer",
      location: "Nashik, Maharashtra",
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&q=80",
      quote: "Before FarmGuard, I struggled to get fair prices. Now with AI grading, my income increased by 45%!",
      increase: "+45%",
      metric: "Income"
    },
    {
      name: "Priya Sharma",
      role: "Cotton Farmer",
      location: "Vidarbha, Maharashtra",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=200&q=80",
      quote: "Direct buyer connections and instant payments changed everything. No more middlemen taking my profits.",
      increase: "50+",
      metric: "Buyers"
    },
    {
      name: "Amit Patel",
      role: "Wheat Farmer",
      location: "Pune, Maharashtra",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80",
      quote: "AI demand forecasting helped me reduce wastage by 30%. I now know exactly when to harvest and sell.",
      increase: "-30%",
      metric: "Wastage"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#FFFBEB] to-[#FFF8E7] grain-texture">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FEF3C7] to-[#FED7AA] border-2 border-[#FCD34D]/50 px-5 py-2 rounded-full mb-4">
            <span className="text-[#3E2F23] font-bold text-xs uppercase tracking-wider">
              Success Stories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#3E2F23] mb-3">
            Helping Farmers
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6B4F3A] via-[#E9C46A] to-[#F4A261]">
              Sell Better with AI
            </span>
          </h2>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="field-block p-6 h-full hover:scale-105 transition-all duration-300">
                {/* Quote Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-[#E9C46A] to-[#F4A261] rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Quote className="w-5 h-5 text-white" />
                </div>

                {/* Quote */}
                <p className="text-sm text-[#6B4F3A] leading-relaxed mb-4 italic line-clamp-3">
                  "{story.quote}"
                </p>

                {/* Metric Badge */}
                <div className="bg-white/70 rounded-xl p-3 mb-4 text-center">
                  <p className="text-3xl font-black text-[#3E2F23]">{story.increase}</p>
                  <p className="text-xs font-semibold text-[#6B4F3A]">{story.metric}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#E9C46A]/30">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#E9C46A]/50">
                    <Image
                      src={story.image}
                      alt={story.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[#3E2F23] text-sm">{story.name}</p>
                    <p className="text-xs text-[#6B4F3A]">{story.role}</p>
                    <p className="text-xs text-[#F4A261]">{story.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
