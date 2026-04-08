'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Award, Star, Users, CheckCircle, AlertCircle,
  TrendingUp, Eye, MessageSquare, ThumbsUp, ThumbsDown,
  ArrowRight, Badge, Verified, Lock, Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TrustReputationHubFarmer() {
  const router = useRouter();
  const [trustScore, setTrustScore] = useState(4.8);
  const [totalReviews, setTotalReviews] = useState(156);

  const stats = [
    {
      label: 'Trust Score',
      value: `${trustScore}/5.0`,
      icon: Star,
      color: 'yellow',
      trend: '+0.2 this month'
    },
    {
      label: 'Total Reviews',
      value: totalReviews.toString(),
      icon: MessageSquare,
      color: 'blue',
      trend: '+12 new'
    },
    {
      label: 'Verification Level',
      value: 'Premium',
      icon: Shield,
      color: 'green',
      trend: 'Verified'
    },
    {
      label: 'Repeat Buyers',
      value: '89%',
      icon: Users,
      color: 'purple',
      trend: 'High loyalty'
    }
  ];

  const verifications = [
    {
      type: 'Identity Verification',
      status: 'verified',
      date: '2024-01-15',
      authority: 'Aadhaar KYC'
    },
    {
      type: 'Farm Ownership',
      status: 'verified',
      date: '2024-01-20',
      authority: 'Revenue Records'
    },
    {
      type: 'Quality Certification',
      status: 'verified',
      date: '2024-02-10',
      authority: 'APEDA Organic'
    },
    {
      type: 'Bank Account',
      status: 'verified',
      date: '2024-01-18',
      authority: 'Bank Verification'
    },
    {
      type: 'GST Registration',
      status: 'pending',
      date: null,
      authority: 'GSTN Portal'
    }
  ];

  const recentReviews = [
    {
      id: 1,
      buyer: 'Agro Traders Ltd.',
      rating: 5,
      comment: 'Excellent quality wheat. Delivered on time with proper packaging.',
      date: '2024-04-05',
      product: 'Wheat - 500kg',
      verified: true
    },
    {
      id: 2,
      buyer: 'Fresh Mart Chain',
      rating: 4,
      comment: 'Good quality tomatoes. Slight delay in delivery but overall satisfied.',
      date: '2024-04-03',
      product: 'Tomatoes - 200kg',
      verified: true
    },
    {
      id: 3,
      buyer: 'Organic Foods Co.',
      rating: 5,
      comment: 'Premium organic rice. Highly recommend this farmer.',
      date: '2024-04-01',
      product: 'Organic Rice - 1000kg',
      verified: true
    }
  ];

  const achievements = [
    {
      title: 'Top Rated Farmer',
      description: 'Maintained 4.5+ rating for 6 months',
      icon: Award,
      color: 'yellow',
      earned: '2024-03-15'
    },
    {
      title: 'Quality Champion',
      description: 'Zero quality complaints in 100+ orders',
      icon: CheckCircle,
      color: 'green',
      earned: '2024-02-20'
    },
    {
      title: 'Reliable Supplier',
      description: '95%+ on-time delivery rate',
      icon: Shield,
      color: 'blue',
      earned: '2024-01-10'
    },
    {
      title: 'Organic Certified',
      description: 'APEDA organic certification holder',
      icon: Verified,
      color: 'emerald',
      earned: '2024-02-10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Trust & Reputation Hub</h1>
          <p className="text-slate-600 mt-1">Build trust, manage reputation, and showcase your credibility</p>
        </div>
        <button className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all flex items-center gap-2">
          <Shield size={18} />
          Boost Trust Score
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon size={24} className={`text-${stat.color}-600`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-slate-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Trust Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-6">Trust Score Breakdown</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-bold text-slate-900">Quality Rating</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-green-600">4.9/5</div>
                <div className="flex">{renderStars(5)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-blue-600" />
                <span className="font-bold text-slate-900">Delivery Performance</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-blue-600">4.8/5</div>
                <div className="flex">{renderStars(5)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-purple-600" />
                <span className="font-bold text-slate-900">Communication</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-purple-600">4.7/5</div>
                <div className="flex">{renderStars(5)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-amber-600" />
                <span className="font-bold text-slate-900">Value for Money</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-amber-600">4.6/5</div>
                <div className="flex">{renderStars(5)}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-6">Verification Status</h2>
          
          <div className="space-y-3">
            {verifications.map((verification, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <h3 className="font-bold text-slate-900">{verification.type}</h3>
                  <p className="text-sm text-slate-600">{verification.authority}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(verification.status)}`}>
                    {verification.status.toUpperCase()}
                  </span>
                  {verification.date && (
                    <p className="text-xs text-slate-500 mt-1">{verification.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all">
            Complete Pending Verifications
          </button>
        </motion.div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">Recent Reviews</h2>
          <button className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all flex items-center gap-2">
            <Eye size={16} />
            View All Reviews
          </button>
        </div>

        <div className="space-y-4">
          {recentReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-slate-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{review.buyer}</h3>
                      {review.verified && (
                        <CheckCircle size={16} className="text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{review.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-xs text-slate-500">{review.date}</p>
                </div>
              </div>
              <p className="text-slate-700 italic">"{review.comment}"</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Achievements & Badges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br from-${achievement.color}-50 to-${achievement.color}-100 rounded-xl p-4 border border-${achievement.color}-200`}
            >
              <div className={`h-12 w-12 rounded-xl bg-${achievement.color}-200 flex items-center justify-center mb-3`}>
                <achievement.icon size={24} className={`text-${achievement.color}-600`} />
              </div>
              <h3 className="font-black text-slate-900 mb-1">{achievement.title}</h3>
              <p className="text-sm text-slate-600 mb-2">{achievement.description}</p>
              <p className="text-xs text-slate-500">Earned: {achievement.earned}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust Building Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <Shield size={32} className="mb-4" />
          <h3 className="text-xl font-black mb-2">Get Verified</h3>
          <p className="text-green-100 mb-4">Complete all verifications to boost trust</p>
          <button className="h-10 px-4 bg-white text-green-600 rounded-lg font-bold hover:bg-green-50 transition-all">
            Start Verification
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <Star size={32} className="mb-4" />
          <h3 className="text-xl font-black mb-2">Improve Rating</h3>
          <p className="text-blue-100 mb-4">Get tips to enhance your service quality</p>
          <button className="h-10 px-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all">
            View Tips
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <Globe size={32} className="mb-4" />
          <h3 className="text-xl font-black mb-2">Share Profile</h3>
          <p className="text-purple-100 mb-4">Showcase your reputation to attract buyers</p>
          <button className="h-10 px-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-all">
            Share Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}