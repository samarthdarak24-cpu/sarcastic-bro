"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  TrendingDown,
  Target,
  CheckCircle,
  Brain,
  LineChart,
  Bot,
  Heart,
  BookOpen,
  DollarSign,
  Award,
  Activity,
} from "lucide-react";
import { PremiumSubFeatures } from "./PremiumSubFeatures";
import { premiumSubFeatures } from "@/services/buyerFeaturesService";
import { buyerBidService } from "@/services/buyerBidService";
import { useSocket } from "@/hooks/useSocket";
import toast from "react-hot-toast";
import { SkeletonList } from "@/components/ui/SkeletonLoader";

export function NegotiationHubPremium() {
  const [activeTab, setActiveTab] = useState<"active" | "analytics" | "templates" | "features">("active");
  const [selectedNegotiation, setSelectedNegotiation] = useState<string | null>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    loadBids();
    setupSocketListeners();
  }, []);

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('bid:update', (data: any) => {
      toast.success(`Bid ${data.status}: ${data.message || 'Updated'}`, {
        icon: '🎯',
      });
      loadBids();
    });

    socket.on('bid:counter-offer', (data: any) => {
      toast.info(`Counter offer received: ₹${data.counterOfferPrice}`, {
        icon: '💰',
      });
      loadBids();
    });

    return () => {
      socket.off('bid:update');
      socket.off('bid:counter-offer');
    };
  };

  const loadBids = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const { bids: data } = await buyerBidService.getBids({ status: 'PENDING' }, token);
      setBids(data || []);
    } catch (error) {
      console.error('Failed to load bids:', error);
      toast.error('Failed to load negotiations');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (productId: string, pricePerUnit: number) => {
    try {
      const token = localStorage.getItem('token') || '';
      await buyerBidService.placeBid({
        productId,
        quantity: 100,
        pricePerUnit,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes: 'AI-suggested counter offer'
      }, token);
      toast.success('Counter offer placed!');
      loadBids();
    } catch (error) {
      console.error('Failed to place bid:', error);
      toast.error('Failed to place counter offer');
    }
  };

  const activeNegotiations = bids.map((bid, idx) => ({
    id: bid.id,
    supplier: `Supplier #${bid.productId?.slice(0, 8)}`,
    product: `Product ${bid.quantity} units`,
    yourBid: bid.pricePerUnit,
    theirBid: bid.counterOfferPrice || bid.pricePerUnit * 1.1,
    status: bid.status,
    savings: (bid.counterOfferPrice || bid.pricePerUnit * 1.1) - bid.pricePerUnit,
    sentiment: 0.7 - (idx * 0.1),
    deadline: idx === 0 ? "5 hours" : `${idx + 1} days`,
    rounds: idx + 2,
    aiSuggestion: Math.round(bid.pricePerUnit * 1.05),
  }));

  const displayNegotiations = activeNegotiations.length > 0 ? activeNegotiations : [
    {
      id: '1',
      supplier: "Ramesh Agro Farms",
      product: "Wheat 1000kg",
      yourBid: 42000,
      theirBid: 45000,
      status: "active",
      savings: 3000,
      sentiment: 0.7,
      deadline: "2 days",
      rounds: 3,
      aiSuggestion: 43500,
    },
  ];

  const stats = {
    active: displayNegotiations.filter(b => b.status === 'PENDING' || b.status === 'active').length,
    totalSavings: displayNegotiations.reduce((sum, b) => sum + (b.savings || 0), 0),
    successRate: 87,
    totalSaved: 240000
  };

  const performanceMetrics = [
    { label: "Active Negotiations", value: stats.active.toString(), icon: Target, color: "blue", trend: "+3 this week" },
    { label: "Avg Savings", value: "18.5%", icon: TrendingDown, color: "emerald", trend: "+2.3% vs last month" },
    { label: "Success Rate", value: `${stats.successRate}%`, icon: CheckCircle, color: "indigo", trend: "↑ 5% improvement" },
    { label: "Total Saved", value: `₹${Math.round(stats.totalSaved / 1000)}K`, icon: DollarSign, color: "amber", trend: "This month" },
  ];

  const priceHistory = [
    { month: "Jan", avgPrice: 45000 },
    { month: "Feb", avgPrice: 44000 },
    { month: "Mar", avgPrice: 43500 },
    { month: "Apr", avgPrice: 43000 },
    { month: "May", avgPrice: 42500 },
    { month: "Jun", avgPrice: 42000 },
  ];

  const templates = [
    {
      id: 1,
      name: "Aggressive Buyer",
      description: "Start low, increase slowly",
      strategy: "60% start, 5% increments",
      winRate: 72,
      avgSavings: 22,
      color: "red",
    },
    {
      id: 2,
      name: "Fair Trade",
      description: "Balanced negotiation",
      strategy: "85% start, 3% increments",
      winRate: 89,
      avgSavings: 12,
      color: "blue",
    },
    {
      id: 3,
      name: "Quick Close",
      description: "Fast deal, slight premium",
      strategy: "95% start, 2% increments",
      winRate: 95,
      avgSavings: 6,
      color: "emerald",
    },
    {
      id: 4,
      name: "Bulk Discount",
      description: "Volume-based pricing",
      strategy: "70% start, 4% increments",
      winRate: 81,
      avgSavings: 18,
      color: "amber",
    },
  ];

  const sentimentData = [
    { label: "Very Positive", value: 35, color: "emerald" },
    { label: "Positive", value: 42, color: "blue" },
    { label: "Neutral", value: 18, color: "amber" },
    { label: "Negative", value: 5, color: "red" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Negotiation Hub</h1>
        <p className="text-slate-500 font-medium">AI-powered bidding and negotiation assistant</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {["active", "analytics", "templates", "features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Active Negotiations Tab */}
        {activeTab === "active" && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, idx) => (
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
                  <p className="text-xs font-bold text-emerald-600">{metric.trend}</p>
                </motion.div>
              ))}
            </div>

            {/* Active Negotiations List */}
            {loading ? (
              <SkeletonList />
            ) : displayNegotiations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <Target size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No active negotiations</h3>
                <p className="text-slate-500">Start bidding on products to see negotiations here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayNegotiations.map((neg, idx) => (
                <motion.div
                  key={neg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedNegotiation(neg.id)}
                  className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                    selectedNegotiation === neg.id
                      ? "border-orange-600 shadow-2xl"
                      : "border-slate-200 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">{neg.supplier}</h3>
                      <p className="text-slate-500 font-medium">{neg.product}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-sm">
                        Round {neg.rounds}
                      </div>
                      <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                        neg.deadline.includes("hour") ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {neg.deadline}
                      </div>
                    </div>
                  </div>

                  {/* Bid Comparison */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Your Bid</p>
                      <p className="text-xl font-black text-blue-600">₹{neg.yourBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Their Bid</p>
                      <p className="text-xl font-black text-slate-900">₹{neg.theirBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">AI Suggests</p>
                      <p className="text-xl font-black text-purple-600">₹{neg.aiSuggestion.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Savings</p>
                      <p className="text-xl font-black text-emerald-600">₹{neg.savings.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Sentiment Indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-slate-600">Negotiation Sentiment</span>
                      <span className={`font-bold ${
                        neg.sentiment > 0.6 ? "text-emerald-600" :
                        neg.sentiment > 0.3 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {neg.sentiment > 0.6 ? "Positive" : neg.sentiment > 0.3 ? "Neutral" : "Negative"}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${neg.sentiment * 100}%` }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className={`h-full ${
                          neg.sentiment > 0.6 ? "bg-emerald-500" :
                          neg.sentiment > 0.3 ? "bg-amber-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handlePlaceBid(neg.id, neg.aiSuggestion)}
                      className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Brain size={18} />
                      AI Counter-Offer
                    </button>
                    <button className="h-12 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                      <MessageSquare size={18} />
                      Chat
                    </button>
                    <button className="h-12 px-6 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
                      <Bot size={18} />
                      Auto-Bot
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
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
            {/* Price History Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <LineChart size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Price History Analytics</h3>
                  <p className="text-slate-500 font-medium">Historical price trends over 6 months</p>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between gap-4">
                {priceHistory.map((data, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.avgPrice / 50000) * 100}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">
                        ₹{data.avgPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-slate-600">
                      {data.month}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sentiment Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Sentiment Analysis</h3>
                  <p className="text-slate-500 font-medium">Overall negotiation sentiment breakdown</p>
                </div>
              </div>

              <div className="space-y-4">
                {sentimentData.map((sentiment, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-slate-700">{sentiment.label}</span>
                      <span className="text-sm font-bold text-slate-900">{sentiment.value}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sentiment.value}%` }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                        className={`h-full bg-${sentiment.color}-500 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Win Rate</h3>
                    <p className="text-slate-600 font-medium">Last 90 days</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-6xl font-black text-emerald-600 mb-2">87%</p>
                  <p className="text-slate-600 font-medium">52 successful deals out of 60</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 bg-amber-600 rounded-xl flex items-center justify-center text-white">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Avg Negotiation Time</h3>
                    <p className="text-slate-600 font-medium">Time to close deals</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-6xl font-black text-amber-600 mb-2">2.4</p>
                  <p className="text-slate-600 font-medium">days average</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Negotiation Templates Library</h3>
                  <p className="text-slate-600 font-medium">Pre-built strategies for different scenarios</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template, idx) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-black text-slate-900 mb-1">{template.name}</h4>
                        <p className="text-sm text-slate-500 font-medium">{template.description}</p>
                      </div>
                      <div className={`h-10 w-10 bg-${template.color}-50 rounded-full flex items-center justify-center text-${template.color}-600`}>
                        <Target size={20} />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <p className="text-sm font-bold text-slate-700 mb-1">Strategy</p>
                      <p className="text-sm text-slate-600 font-medium">{template.strategy}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Win Rate</p>
                        <p className="text-2xl font-black text-emerald-600">{template.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Avg Savings</p>
                        <p className="text-2xl font-black text-blue-600">{template.avgSavings}%</p>
                      </div>
                    </div>

                    <button className={`w-full h-10 bg-${template.color}-600 text-white rounded-xl font-bold hover:shadow-lg transition-all`}>
                      Apply Template
                    </button>
                  </motion.div>
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
            <PremiumSubFeatures features={premiumSubFeatures.negotiationHub} category="Negotiation Hub" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
