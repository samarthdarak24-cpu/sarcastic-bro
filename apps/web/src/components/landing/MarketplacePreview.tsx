"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Star, MapPin } from "lucide-react";

export function MarketplacePreview() {
  const products = [
    {
      name: "Premium Tomatoes",
      grade: "A",
      price: 45,
      location: "Nashik, MH",
      image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&q=80",
      rating: 4.8
    },
    {
      name: "Fresh Onions",
      grade: "A",
      price: 32,
      location: "Pune, MH",
      image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80",
      rating: 4.9
    },
    {
      name: "Organic Wheat",
      grade: "B",
      price: 28,
      location: "Punjab",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
      rating: 4.7
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            Browse Live
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Marketplace
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thousands of quality-verified products from farmers across India
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-200">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Grade Badge */}
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white font-black px-4 py-2 rounded-xl shadow-lg">
                    Grade {product.grade}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin size={14} />
                      <span className="text-xs font-medium">{product.location}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-black text-gray-900">₹{product.price}</p>
                      <p className="text-sm text-gray-500">per kg</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white shadow-lg"
                    >
                      <ShoppingCart size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-10 py-5 rounded-2xl shadow-xl transition-all"
          >
            View All Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
