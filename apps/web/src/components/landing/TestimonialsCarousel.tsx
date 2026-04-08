"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
export function TestimonialsCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Tomato Farmer, Nashik",
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&q=80",
      quote: t("landing.testimonials.quote1", "My income increased by 45% with AI quality grading and direct buyer connections!"),
      metric: "45%",
      metricLabel: t("landing.testimonials.income_increase"),
    },
    {
      name: "Priya Deshmukh",
      role: "Organic Farmer, Pune",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
      quote: t("landing.testimonials.quote2", "The AI quality detection is amazing! I get A+ grades consistently."),
      metric: "A+",
      metricLabel: t("landing.testimonials.quality_grade"),
    },
    {
      name: "Amit Patil",
      role: "Rice Farmer, Solapur",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      quote: t("landing.testimonials.quote3", "Real-time market prices help me plan better. Blockchain tracking builds trust."),
      metric: "₹12L",
      metricLabel: t("landing.testimonials.monthly_gmv"),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
              ⭐ {t("landing.testimonials.badge")}
            </div>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            {t("landing.testimonials.title")}
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />

            <div className="relative z-10">
              {/* Quote */}
              <div className="text-6xl text-green-500 opacity-20 mb-4">"</div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-relaxed">
                {testimonials[activeIndex].quote}
              </p>

              {/* Profile & Metric */}
              <div className="flex items-center justify-between flex-wrap gap-6">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-full overflow-hidden border-4 border-green-500"
                  >
                    <img
                      src={testimonials[activeIndex].image}
                      alt={testimonials[activeIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">
                      {testimonials[activeIndex].name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonials[activeIndex].role}
                    </div>
                  </div>
                </div>

                {/* Metric */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl px-6 py-4 text-center"
                >
                  <div className="text-3xl font-black text-white">
                    {testimonials[activeIndex].metric}
                  </div>
                  <div className="text-xs text-white/80 font-medium">
                    {testimonials[activeIndex].metricLabel}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-8 bg-green-500" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
