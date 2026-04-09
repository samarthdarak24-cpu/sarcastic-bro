'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Award, Shield, TrendingUp, Users, CheckCircle,
  MessageCircle, ThumbsUp, Calendar, Eye, BarChart3, Target
} from 'lucide-react';

interface Review {
  id: string;
  buyer: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function TrustIdentity() {
  const [filter, setFilter] = useState<string>('all');

  const trustScore = {
    overall: 4.8,
    delivery: 4.9,
    quality: 4.7,
    communication: 4.8,
    reviews: 156
  };

  const reviews: Review[] = [
    { id: '1', buyer: 'Rajesh Kumar', rating: 5, comment: 'Excellent quality products! Fresh and well-packaged.', date: '2024-01-15', verified: true },
    { id: '2', buyer: 'Priya Sharma', rating: 4, comment: 'Good service, timely delivery. Will order again.', date: '2024-01-14', verified: true },
    { id: '3', buyer: 'Amit Patel', rating: 5, comment: 'Very satisfied with the quality and pricing.', date: '2024-01-13', verified: false },
    { id: '4', buyer: 'Sunita Devi', rating: 4, comment: 'Fresh products, professional handling.', date: '2024-01-12', verified: true },
  ];

  const stats = [
    { label: 'Trust Score', value: trustScore.overall.toFixed(1), icon: Star, color: 'from-yellow-500 to-amber-600', change: '+0.2' },
    { label: 'Total Reviews', value: trustScore.reviews, icon: MessageCircle, color: 'from-blue-500 to-cyan-600', change: '+12' },
    { label: 'Verified Buyers', value: '89%', icon: CheckCircle, color: 'from-green-500 to-emerald-600', change: '+5%' },
    { label: 'Repeat Orders', value: '67%', icon: TrendingUp, color: 'from-purple-500 to-pink-600', change: '+8%' },
  ];

  const metrics = [
    { label: 'Delivery', score: trustScore.delivery, color: 'from-green-500 to-emerald-600' },
    { label: 'Quality', score: trustScore.quality, color: 'from-blue-500 to-cyan-600' },
    { label: 'Communication', score: trustScore.communication, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 relative overflow-hidden group"
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />
            
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Trust Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      >
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <BarChart3 size={24} className="text-teal-600" />
          Performance Metrics
        </h3>
        <div className="space-y-4">
          {metrics.map((metric, idx) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{metric.label}</span>
                <span className="text-sm font-bold text-slate-600">{metric.score.toFixed(1)}/5.0</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.score / 5) * 100}%` }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.8 }}
                  className={`h-3 rounded-full bg-gradient-to-r ${metric.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MessageCircle size={24} className="text-blue-600" />
            Recent Reviews
          </h3>
          <div className="flex gap-2">
            {['all', 'verified'].map(tab => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filter === tab
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviews
            .filter(review => filter === 'all' || (filter === 'verified' && review.verified))
            .map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                      {review.buyer.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{review.buyer}</p>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle size={12} />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{review.date}</span>
                </div>
                <p className="text-sm text-slate-700">{review.comment}</p>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
