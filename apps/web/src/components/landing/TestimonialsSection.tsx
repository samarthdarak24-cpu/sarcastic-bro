"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Wheat Farmer",
      location: "Punjab",
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&q=80",
      quote: "FarmGuard transformed my business. I now get 40% better prices and connect directly with buyers. The AI quality grading gives me confidence.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Cotton Farmer",
      location: "Maharashtra",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=200&q=80",
      quote: "The platform is so easy to use! I can chat with buyers in Marathi, track my orders, and get paid instantly. It's a game-changer for farmers like me.",
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "Vegetable Farmer",
      location: "Gujarat",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80",
      quote: "Best decision I made was joining FarmGuard. The AI tells me the best time to sell, and I've reduced wastage by 30%. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <section className="py-32 bg-[#3E2F23] text-white relative overflow-hidden grain-texture soil-pattern">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-black mb-6">
            <span className="text-white">Loved by Farmers</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E9C46A] to-[#F4A261] mt-2">
              Across India
            </span>
          </h2>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto">
            Real stories from real farmers who transformed their business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-[#6B4F3A]/30 to-[#F4A261]/30 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#E9C46A]/30 hover:border-[#E9C46A] transition-all">
                {/* Quote Icon */}
                <div className="w-12 h-12 rounded-2xl harvest-gradient flex items-center justify-center mb-6 pulse-glow">
                  <Quote size={24} className="text-white" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-[#E9C46A] fill-[#E9C46A]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#FFF8E7] leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-[#E9C46A]/20">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-[#E9C46A]/30">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-[#FFE8CC]">{testimonial.role} • {testimonial.location}</p>
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
