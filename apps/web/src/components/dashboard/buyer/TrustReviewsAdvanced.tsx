'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Star, MessageSquare, ThumbsUp, Shield, BarChart3, CheckCircle,
  AlertCircle, TrendingUp, Users, Eye, Zap, FileText,
  Award, Activity, Smartphone, Lock, Settings, Layers
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'review-system', name: 'Review System', icon: MessageSquare, description: 'Manage reviews', color: 'blue' },
  { id: 'rating-management', name: 'Rating Management', icon: Star, description: 'Manage ratings', color: 'indigo', badge: 'NEW' },
  { id: 'verified-purchases', name: 'Verified Purchases', icon: CheckCircle, description: 'Verified reviews', color: 'emerald' },
  { id: 'photo-video-reviews', name: 'Photo/Video Reviews', icon: Eye, description: 'Media reviews', color: 'purple' },
  { id: 'helpful-votes', name: 'Helpful Votes', icon: ThumbsUp, description: 'Vote on reviews', color: 'rose' },
  { id: 'response-management', name: 'Response Management', icon: MessageSquare, description: 'Respond to reviews', color: 'amber' },
  { id: 'review-analytics', name: 'Review Analytics', icon: BarChart3, description: 'Review insights', color: 'cyan' },
  { id: 'fraud-detection', name: 'Fraud Detection', icon: Shield, description: 'Detect fake reviews', color: 'teal' },
  { id: 'review-moderation', name: 'Review Moderation', icon: AlertCircle, description: 'Moderate reviews', color: 'violet' },
  { id: 'trending-reviews', name: 'Trending Reviews', icon: TrendingUp, description: 'Popular reviews', color: 'orange' },
  { id: 'comparison-reviews', name: 'Comparison Reviews', icon: Layers, description: 'Compare reviews', color: 'pink' },
  { id: 'review-insights', name: 'Review Insights', icon: Zap, description: 'Deep insights', color: 'red' }
];

const stats = [
  { label: 'Total Reviews', value: '1,247', icon: MessageSquare, color: 'blue', trend: '+24%' },
  { label: 'Avg Rating', value: '4.7/5', icon: Star, color: 'amber', trend: '+0.2' },
  { label: 'Verified %', value: '98.5%', icon: CheckCircle, color: 'emerald', trend: '+3%' },
  { label: 'Helpful Rate', value: '92%', icon: ThumbsUp, color: 'indigo', trend: '+5%' }
];

export default function TrustReviewsAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'review-system': return <ReviewSystem />;
      case 'rating-management': return <RatingManagement />;
      case 'verified-purchases': return <VerifiedPurchases />;
      case 'photo-video-reviews': return <PhotoVideoReviews />;
      case 'helpful-votes': return <HelpfulVotes />;
      case 'response-management': return <ResponseManagement />;
      case 'review-analytics': return <ReviewAnalytics />;
      case 'fraud-detection': return <FraudDetection />;
      case 'review-moderation': return <ReviewModeration />;
      case 'trending-reviews': return <TrendingReviews />;
      case 'comparison-reviews': return <ComparisonReviews />;
      case 'review-insights': return <ReviewInsights />;
      default: return <ReviewSystem />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Trust & Reviews"
      description="Comprehensive review and rating management system"
      icon={Star}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function ReviewSystem() {
  const reviews = [
    { id: 1, author: 'Rajesh Kumar', rating: 5, text: 'Excellent quality and fast delivery!', verified: true, helpful: 45 },
    { id: 2, author: 'Priya Singh', rating: 4, text: 'Good product, could improve packaging', verified: true, helpful: 32 },
    { id: 3, author: 'Amit Patel', rating: 5, text: 'Best supplier in the market', verified: true, helpful: 28 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Review System</h2>
          <p className="text-slate-500 font-medium mt-1">Manage all reviews</p>
        </div>
        <ActionButton variant="primary" icon={MessageSquare}>Write Review</ActionButton>
      </div>

      <div className="space-y-3">
        {reviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 border-2 border-slate-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-slate-900">{review.author}</h3>
                  {review.verified && (
                    <div className="h-5 w-5 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={14} className="text-emerald-600" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-slate-600 font-medium">
                  <ThumbsUp size={14} />
                  {review.helpful}
                </div>
              </div>
            </div>
            <p className="text-slate-700 font-medium">{review.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RatingManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Rating Management</h2>
        <p className="text-slate-500 font-medium mt-1">Manage your ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <MetricDisplay label="Overall Rating" value="4.7/5" icon={Star} color="amber" trend="+0.2" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Total Ratings" value="1,247" icon={BarChart3} color="blue" trend="+24%" />
        </PremiumCard>
      </div>
    </div>
  );
}

function VerifiedPurchases() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Verified Purchases</h2>
        <p className="text-slate-500 font-medium mt-1">Reviews from verified buyers</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">98.5% Verified</h3>
          <p className="text-slate-600 font-medium">All reviews from verified purchases</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function PhotoVideoReviews() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Photo/Video Reviews</h2>
        <p className="text-slate-500 font-medium mt-1">Media-rich reviews</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Photo Reviews" value="234" icon={Eye} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Video Reviews" value="45" icon={Eye} color="purple" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Engagement" value="+45%" icon={TrendingUp} color="emerald" />
        </PremiumCard>
      </div>
    </div>
  );
}

function HelpfulVotes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Helpful Votes</h2>
        <p className="text-slate-500 font-medium mt-1">Vote on review helpfulness</p>
      </div>

      <PremiumCard className="p-8">
        <div className="text-center">
          <ThumbsUp size={48} className="mx-auto text-blue-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">92% Helpful</h3>
          <p className="text-slate-600 font-medium">Average helpfulness rating</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function ResponseManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Response Management</h2>
        <p className="text-slate-500 font-medium mt-1">Respond to reviews</p>
      </div>

      <PremiumCard className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700">Response Rate</span>
            <span className="font-black text-slate-900">87%</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700">Avg Response Time</span>
            <span className="font-black text-slate-900">2.3 hours</span>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

function ReviewAnalytics() {
  const chartData = [
    { month: 'Jan', reviews: 45, rating: 4.5 },
    { month: 'Feb', reviews: 52, rating: 4.6 },
    { month: 'Mar', reviews: 48, rating: 4.7 },
    { month: 'Apr', reviews: 61, rating: 4.7 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Review Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Review trends and insights</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Monthly Reviews</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="reviews" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function FraudDetection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Fraud Detection</h2>
        <p className="text-slate-500 font-medium mt-1">Detect fake reviews</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">99.2% Authentic</h3>
          <p className="text-slate-600 font-medium">All reviews verified as authentic</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function ReviewModeration() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Review Moderation</h2>
        <p className="text-slate-500 font-medium mt-1">Moderate reviews</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Pending" value="3" icon={AlertCircle} color="amber" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Approved" value="1,244" icon={CheckCircle} color="emerald" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Rejected" value="0" icon={AlertCircle} color="red" />
        </PremiumCard>
      </div>
    </div>
  );
}

function TrendingReviews() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Trending Reviews</h2>
        <p className="text-slate-500 font-medium mt-1">Most popular reviews</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <TrendingUp size={48} className="mx-auto text-purple-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Top Trending</h3>
          <p className="text-slate-600 font-medium">"Best supplier in the market" - 1.2K helpful votes</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function ComparisonReviews() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Comparison Reviews</h2>
        <p className="text-slate-500 font-medium mt-1">Compare supplier reviews</p>
      </div>

      <PremiumCard className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700">Green Valley</span>
            <span className="font-black text-amber-600">4.8/5</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700">Organic Harvest</span>
            <span className="font-black text-amber-600">4.9/5</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700">Sunrise Traders</span>
            <span className="font-black text-amber-600">4.5/5</span>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

function ReviewInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Review Insights</h2>
        <p className="text-slate-500 font-medium mt-1">Deep review analytics</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Zap size={48} className="mx-auto text-blue-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Key Insights</h3>
          <p className="text-slate-600 font-medium">Quality and delivery are top-rated aspects</p>
        </div>
      </PremiumCard>
    </div>
  );
}
