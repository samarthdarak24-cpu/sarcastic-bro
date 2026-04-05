"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, Shield, Award, TrendingUp } from "lucide-react";

export function TrustReviews() {
  const reviews = [
    { id: 1, supplier: "Ramesh Agro", rating: 5, comment: "Excellent quality and timely delivery", buyer: "Amit Kumar", date: "2 days ago" },
    { id: 2, supplier: "Green Valley", rating: 4, comment: "Good products, slight delay in shipping", buyer: "Priya Singh", date: "1 week ago" },
    { id: 3, supplier: "Organic Harvest", rating: 5, comment: "Outstanding service and premium quality", buyer: "Raj Patel", date: "2 weeks ago" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Trust & Reviews</h1>
        <p className="text-slate-500 font-medium">Community-verified supplier ratings</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Reviews", value: "12.4K", icon: Star, color: "amber" },
          { label: "Verified Buyers", value: "8,945", icon: Shield, color: "blue" },
          { label: "Avg Rating", value: "4.7", icon: Award, color: "emerald" },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
            <div className={`h-12 w-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        {reviews.map((review, idx) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">{review.supplier}</h3>
                <p className="text-sm text-slate-500 font-medium">{review.buyer} • {review.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
            </div>
            <p className="text-slate-700 font-medium">{review.comment}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                <ThumbsUp size={16} />
                <span className="text-sm font-medium">Helpful (24)</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
