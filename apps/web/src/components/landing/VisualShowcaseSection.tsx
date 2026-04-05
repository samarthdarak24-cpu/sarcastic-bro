"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function VisualShowcaseSection() {
  const [activeTab, setActiveTab] = useState("images");

  const images = [
    {
      url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
      title: "Smart Farming",
      description: "Farmers using AI-powered quality detection",
    },
    {
      url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
      title: "Fresh Produce",
      description: "High-quality vegetables graded by AI",
    },
    {
      url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
      title: "Quality Tomatoes",
      description: "Grade A+ certified produce",
    },
    {
      url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
      title: "Direct Connection",
      description: "Farmers connecting with buyers",
    },
  ];

  const videos = [
    {
      thumbnail: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=800&q=80",
      title: "How AI Grading Works",
      duration: "2:30",
      description: "See how our AI analyzes crop quality in real-time",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
      title: "Farmer Success Story",
      duration: "3:15",
      description: "Rajesh Kumar shares his journey with ODOP Connect",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-[#f9fafb] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#111827] mb-4">
            See ODOP Connect in Action
          </h2>
          <p className="text-lg text-[#6b7280]">
            Real farmers, real results, real transformation
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("images")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "images"
                ? "bg-[#22c55e] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            📸 Gallery
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "videos"
                ? "bg-[#22c55e] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            🎥 Videos
          </button>
        </div>

        {/* Images Grid */}
        {activeTab === "images" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {images.map((image, index) => (
              <motion.div
                key={image.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-effect rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#111827] mb-1">{image.title}</h3>
                  <p className="text-sm text-[#6b7280]">{image.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Videos Grid */}
        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-effect rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
                    >
                      <div className="w-0 h-0 border-l-[20px] border-l-[#22c55e] border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                    </motion.div>
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#111827] mb-1">{video.title}</h3>
                  <p className="text-sm text-[#6b7280]">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
