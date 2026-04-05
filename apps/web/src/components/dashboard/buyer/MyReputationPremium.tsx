"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  MessageSquare,
  Award,
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Shield,
  Zap,
  Target,
  BarChart3,
  AlertCircle,
  Bell,
  Brain,
  FileText,
  Rocket,
  Share2,
  Lock,
  Trophy,
  TrendingDown,
  Activity,
  Users,
} from "lucide-react";
import { PremiumSubFeatures } from "./PremiumSubFeatures";
import { premiumSubFeatures } from "@/services/buyerFeaturesService";

export function MyReputationPremium() {
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "features" | "analytics" | "insights">("overview");
  const [selectedReview, setSelectedReview] = useState<number | null>(null);

  const reputationScore = 92;
  const trustBadges = [
    { name: "Gold Buyer", icon: Award, color: "amber" },
    { name: "Verified Partner", icon: Shield, color: "blue" },
    { name: "Quick Responder", icon: Zap, color: "emerald" },
    { name: "Top Performer", icon: Trophy, color: "purple" },
  ];

  const reputationTimeline = [
    { month: "Jan", score: 78 },
    { month: "Feb", score: 82 },
    { month: "Mar", score: 85 },
    { month: "Apr", score: 88 },
    { month: "May", score: 90 },
    { month: "Jun", score: 92 },
  ];

  const sentimentBreakdown = {
    positive: 234,
    neutral: 10,
    negative: 3,
    emotions: {
      happy: 156,
      satisfied: 78,
      neutral: 10,
      disappointed: 2,
      frustrated: 1,
    },
  };

  const competitorBenchmark = {
    yourScore: 92,
    industryAverage: 78,
    topPerformer: 96,
    yourRank: 12,
    totalBuyers: 1847,
  };

  const boostInsights = [
    {
      title: "Improve Response Time",
      impact: "+3 points",
      description: "Respond to inquiries within 30 minutes",
      icon: Clock,
      color: "blue",
    },
    {
      title: "Complete More Transactions",
      impact: "+2 points",
      description: "Aim for 5 more verified transactions this month",
      icon: Target,
      color: "emerald",
    },
    {
      title: "Request Supplier Reviews",
      impact: "+4 points",
      description: "Get 10 more reviews from satisfied suppliers",
      icon: MessageSquare,
      color: "amber",
    },
  ];

  const reviews = [
    {
      id: 1,
      supplier: "Ramesh Agro Farms",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent buyer! Quick payments and clear communication.",
      sentiment: "positive",
      helpful: 24,
    },
    {
      id: 2,
      supplier: "Green Valley Exports",
      rating: 4,
      date: "1 week ago",
      comment: "Good experience overall. Minor delay in order confirmation.",
      sentiment: "neutral",
      helpful: 12,
    },
    {
      id: 3,
      supplier: "Organic Harvest Co.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Outstanding buyer! Professional and reliable.",
      sentiment: "positive",
      helpful: 31,
    },
  ];

  const metrics = [
    {
      label: "Reputation Score",
      value: "92/100",
      icon: TrendingUp,
      color: "emerald",
      trend: "+5 this month",
    },
    {
      label: "Total Reviews",
      value: "247",
      icon: MessageSquare,
      color: "blue",
      trend: "+12 this month",
    },
    {
      label: "Avg Rating",
      value: "4.8",
      icon: Star,
      color: "amber",
      trend: "Stable",
    },
    {
      label: "Response Time",
      value: "1.2 hrs",
      icon: Clock,
      color: "indigo",
      trend: "-0.3 hrs",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">My Reputation</h1>
        <p className="text-slate-500 font-medium">Build and manage your buyer reputation</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {["overview", "reviews", "analytics", "insights", "features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Main Score Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Reputation Score</h2>
                  <p className="text-slate-600 font-medium mb-6">Your buyer credibility rating</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-blue-600">{reputationScore}</span>
                    <span className="text-2xl text-slate-500 font-bold">/100</span>
                  </div>
                  <p className="text-emerald-600 font-bold mt-4">↑ +5 points this month</p>
                </div>

                {/* Score Visualization */}
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      strokeDasharray={`${(reputationScore / 100) * 565.48} 565.48`}
                      initial={{ strokeDasharray: "0 565.48" }}
                      animate={{ strokeDasharray: `${(reputationScore / 100) * 565.48} 565.48` }}
                      transition={{ duration: 2 }}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 font-medium">Excellent</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className={`h-12 w-12 bg-${metric.color}-50 rounded-xl flex items-center justify-center text-${metric.color}-600 mb-4`}>
                    <metric.icon size={24} />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-slate-600 font-medium mb-2">{metric.label}</p>
                  <p className={`text-xs font-bold ${
                    metric.trend.includes("+") || metric.trend.includes("Stable")
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }`}>
                    {metric.trend}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-6">Earned Trust Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trustBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className={`bg-gradient-to-br from-${badge.color}-50 to-${badge.color}-100 rounded-2xl p-6 border border-${badge.color}-200 text-center`}
                  >
                    <div className={`h-16 w-16 bg-${badge.color}-600 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                      <badge.icon size={32} />
                    </div>
                    <p className="font-black text-slate-900">{badge.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Review Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Positive", value: "234", icon: ThumbsUp, color: "emerald" },
                { label: "Neutral", value: "10", icon: AlertCircle, color: "amber" },
                { label: "Negative", value: "3", icon: ThumbsDown, color: "red" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
                >
                  <div className={`h-12 w-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center text-${stat.color}-600 mb-4`}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-slate-600 font-medium">{stat.label} Reviews</p>
                </motion.div>
              ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedReview(review.id)}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                    selectedReview === review.id
                      ? "border-blue-600 shadow-lg"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">{review.supplier}</h4>
                      <p className="text-sm text-slate-500 font-medium">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-300"}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 font-medium mb-4">{review.comment}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <ThumbsUp size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-600 font-medium">{review.helpful} found helpful</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        review.sentiment === "positive"
                          ? "bg-emerald-100 text-emerald-700"
                          : review.sentiment === "neutral"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Reputation Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Reputation Timeline</h3>
                  <p className="text-slate-500 font-medium">Your reputation journey over time</p>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between gap-4">
                {reputationTimeline.map((data, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.score / 100) * 100}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">
                        {data.score}
                      </div>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-slate-600">
                      {data.month}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sentiment Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <Brain size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">AI Sentiment Analysis</h3>
                  <p className="text-slate-500 font-medium">Emotion detection across all reviews</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Overall Sentiment */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Overall Sentiment</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Positive", value: sentimentBreakdown.positive, color: "emerald", total: 247 },
                      { label: "Neutral", value: sentimentBreakdown.neutral, color: "amber", total: 247 },
                      { label: "Negative", value: sentimentBreakdown.negative, color: "red", total: 247 },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">{item.label}</span>
                          <span className="text-sm font-bold text-slate-900">{item.value}</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / item.total) * 100}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            className={`h-full bg-${item.color}-500 rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emotion Breakdown */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Emotion Detection</h4>
                  <div className="space-y-2">
                    {Object.entries(sentimentBreakdown.emotions).map(([emotion, count], idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                      >
                        <span className="text-sm font-medium text-slate-700 capitalize">{emotion}</span>
                        <span className="text-sm font-bold text-slate-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Verified Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Verified Transaction History</h3>
                  <p className="text-slate-600 font-medium">Blockchain-verified credibility</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Verified", value: "1,247", icon: Shield },
                  { label: "Success Rate", value: "98.7%", icon: Target },
                  { label: "Avg Transaction", value: "₹2.4L", icon: TrendingUp },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-emerald-200">
                    <stat.icon className="text-emerald-600 mb-3" size={24} />
                    <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-slate-600 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Competitor Benchmarking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Competitor Benchmarking</h3>
                  <p className="text-slate-500 font-medium">See how you compare to others</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "Your Score", value: competitorBenchmark.yourScore, color: "blue" },
                  { label: "Industry Avg", value: competitorBenchmark.industryAverage, color: "slate" },
                  { label: "Top Performer", value: competitorBenchmark.topPerformer, color: "emerald" },
                ].map((item, idx) => (
                  <div key={idx} className={`bg-${item.color}-50 rounded-2xl p-6 border border-${item.color}-200`}>
                    <p className="text-4xl font-black text-slate-900 mb-2">{item.value}</p>
                    <p className="text-slate-600 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                <div className="flex items-center gap-3">
                  <Trophy className="text-indigo-600" size={32} />
                  <div>
                    <p className="text-2xl font-black text-slate-900">
                      Rank #{competitorBenchmark.yourRank}
                    </p>
                    <p className="text-slate-600 font-medium">
                      Out of {competitorBenchmark.totalBuyers.toLocaleString()} buyers in your region
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reputation Boost Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <Rocket size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Reputation Boost Insights</h3>
                  <p className="text-slate-500 font-medium">Personalized recommendations to improve</p>
                </div>
              </div>

              <div className="space-y-4">
                {boostInsights.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-${insight.color}-50 rounded-2xl p-6 border border-${insight.color}-200`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 bg-${insight.color}-600 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                        <insight.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-black text-slate-900">{insight.title}</h4>
                          <span className={`px-3 py-1 bg-${insight.color}-600 text-white rounded-full text-sm font-bold`}>
                            {insight.impact}
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Performance Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-amber-600 rounded-xl flex items-center justify-center text-white">
                  <Trophy size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Performance Leaderboard</h3>
                  <p className="text-slate-600 font-medium">Top buyers in your category</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { rank: 1, name: "Premium Agro Corp", score: 96, badge: "🥇" },
                  { rank: 2, name: "Global Harvest Ltd", score: 94, badge: "🥈" },
                  { rank: 3, name: "Fresh Foods International", score: 93, badge: "🥉" },
                  { rank: 12, name: "You", score: 92, badge: "⭐", highlight: true },
                ].map((entry, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      entry.highlight
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-amber-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{entry.badge}</span>
                      <div>
                        <p className={`font-black ${entry.highlight ? "text-white" : "text-slate-900"}`}>
                          {entry.name}
                        </p>
                        <p className={`text-sm font-medium ${entry.highlight ? "text-blue-100" : "text-slate-500"}`}>
                          Rank #{entry.rank}
                        </p>
                      </div>
                    </div>
                    <div className={`text-2xl font-black ${entry.highlight ? "text-white" : "text-slate-900"}`}>
                      {entry.score}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Social Proof & Reputation Protection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                    <Share2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Social Proof Widgets</h3>
                    <p className="text-sm text-slate-500 font-medium">Showcase your reputation</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-black">
                      92
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Trusted Buyer</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">247 verified reviews</p>
                </div>

                <button className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors">
                  Generate Widget Code
                </button>
              </motion.div>

              {/* Reputation Protection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Reputation Protection</h3>
                    <p className="text-sm text-slate-500 font-medium">Fraud detection active</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {[
                    { label: "Fraud Attempts Blocked", value: "0", color: "emerald" },
                    { label: "Disputes Resolved", value: "2", color: "blue" },
                    { label: "Protection Score", value: "100%", color: "purple" },
                  ].map((stat, idx) => (
                    <div key={idx} className={`bg-${stat.color}-50 rounded-xl p-4 border border-${stat.color}-200`}>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-700">{stat.label}</p>
                        <p className="text-xl font-black text-slate-900">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Shield className="text-emerald-600" size={20} />
                    <p className="text-sm font-bold text-emerald-700">All systems protected</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Smart Response Templates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Smart Response Templates</h3>
                  <p className="text-slate-500 font-medium">AI-generated responses for reviews</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: "Positive Review", color: "emerald", icon: ThumbsUp },
                  { type: "Neutral Review", color: "amber", icon: MessageSquare },
                  { type: "Negative Review", color: "red", icon: ThumbsDown },
                ].map((template, idx) => (
                  <div
                    key={idx}
                    className={`bg-${template.color}-50 rounded-2xl p-6 border border-${template.color}-200 cursor-pointer hover:shadow-lg transition-all`}
                  >
                    <template.icon className={`text-${template.color}-600 mb-3`} size={24} />
                    <p className="font-black text-slate-900 mb-2">{template.type}</p>
                    <p className="text-sm text-slate-600 font-medium mb-4">
                      AI-crafted professional response
                    </p>
                    <button className={`w-full bg-${template.color}-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-${template.color}-700 transition-colors`}>
                      Generate Response
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PremiumSubFeatures features={premiumSubFeatures.myReputation} category="My Reputation" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
