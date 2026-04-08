'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  MessageSquare,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Target,
  Bot,
  Send,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import toast from 'react-hot-toast';

interface BidDetail {
  id: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  unit: string;
  yourBid: number;
  currentBid: number;
  counterOfferPrice?: number;
  status: 'ACTIVE' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  counterOffers: Array<{
    id: string;
    price: number;
    timestamp: string;
    from: 'BUYER' | 'SUPPLIER';
  }>;
  aiRecommendation?: {
    suggestedPrice: number;
    confidence: number;
    reasoning: string;
    marketAverage: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
  sentiment: number;
  rounds: number;
}

export default function BidDetailPage() {
  const { user } = useAuth('BUYER');
  const params = useParams();
  const router = useRouter();
  const bidId = params.bidId as string;
  const socket = useSocket();

  const [bid, setBid] = useState<BidDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [counterOfferPrice, setCounterOfferPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'ai' | 'chat'>('overview');

  useEffect(() => {
    loadBidDetail();
    setupSocketListeners();
  }, [bidId]);

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('bid:update', (data: any) => {
      if (data.bidId === bidId) {
        setBid((prev) => prev ? { ...prev, ...data } : null);
        toast.success('Bid updated!', { icon: '🎯' });
      }
    });

    socket.on('bid:counter-offer', (data: any) => {
      if (data.bidId === bidId) {
        setBid((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            counterOffers: [...prev.counterOffers, data.counterOffer],
            currentBid: data.counterOffer.price,
          };
        });
        toast.success(`Counter offer: ₹${data.counterOffer.price}`, { icon: '💰' });
      }
    });

    return () => {
      socket.off('bid:update');
      socket.off('bid:counter-offer');
    };
  };

  const loadBidDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      // Mock data for now - replace with actual API call
      const mockBid: BidDetail = {
        id: bidId,
        productId: 'prod-123',
        productName: 'Premium Wheat',
        supplierId: 'supp-456',
        supplierName: 'Ramesh Agro Farms',
        quantity: 1000,
        unit: 'kg',
        yourBid: 42000,
        currentBid: 43500,
        counterOfferPrice: 43500,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        counterOffers: [
          {
            id: 'co-1',
            price: 45000,
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            from: 'SUPPLIER',
          },
          {
            id: 'co-2',
            price: 43500,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            from: 'SUPPLIER',
          },
        ],
        aiRecommendation: {
          suggestedPrice: 43200,
          confidence: 0.92,
          reasoning: 'Based on market trends and supplier history, this price is optimal',
          marketAverage: 44000,
          trend: 'DOWN',
        },
        sentiment: 0.75,
        rounds: 3,
      };
      setBid(mockBid);
    } catch (error) {
      console.error('Failed to load bid:', error);
      toast.error('Failed to load bid details');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceCounterOffer = async () => {
    if (!counterOfferPrice || !bid) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token') || '';
      // API call would go here
      toast.success('Counter offer placed!');
      setCounterOfferPrice('');
      loadBidDetail();
    } catch (error) {
      console.error('Failed to place counter offer:', error);
      toast.error('Failed to place counter offer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptBid = async () => {
    if (!bid) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token') || '';
      // API call would go here
      toast.success('Bid accepted!');
      loadBidDetail();
    } catch (error) {
      console.error('Failed to accept bid:', error);
      toast.error('Failed to accept bid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBid = async () => {
    if (!bid) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token') || '';
      // API call would go here
      toast.success('Bid cancelled');
      setTimeout(() => router.back(), 1000);
    } catch (error) {
      console.error('Failed to cancel bid:', error);
      toast.error('Failed to cancel bid');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'BUYER') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout navItems={buyerNav} userRole="BUYER">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!bid) {
    return (
      <DashboardLayout navItems={buyerNav} userRole="BUYER">
        <div className="p-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-bold"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="text-center py-20">
            <AlertCircle size={64} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Bid not found</h2>
            <p className="text-slate-500">The bid you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const timeRemaining = new Date(bid.expiresAt).getTime() - Date.now();
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  const statusColor = {
    ACTIVE: 'emerald',
    ACCEPTED: 'blue',
    REJECTED: 'red',
    EXPIRED: 'slate',
    CANCELLED: 'slate',
  };

  const statusIcon = {
    ACTIVE: Zap,
    ACCEPTED: CheckCircle,
    REJECTED: XCircle,
    EXPIRED: Clock,
    CANCELLED: XCircle,
  };

  const StatusIcon = statusIcon[bid.status];

  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-bold"
          >
            <ArrowLeft size={20} />
            Back to Bidding
          </button>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">{bid.productName}</h1>
              <p className="text-slate-500 font-medium">Bid with {bid.supplierName}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 bg-${statusColor[bid.status]}-50 text-${statusColor[bid.status]}-600 rounded-full font-bold`}>
              <StatusIcon size={20} />
              {bid.status}
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <p className="text-sm text-slate-500 font-medium mb-2">Your Bid</p>
            <p className="text-3xl font-black text-blue-600">₹{bid.yourBid.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">per {bid.unit}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <p className="text-sm text-slate-500 font-medium mb-2">Current Bid</p>
            <p className="text-3xl font-black text-slate-900">₹{bid.currentBid.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">Latest offer</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <p className="text-sm text-slate-500 font-medium mb-2">Quantity</p>
            <p className="text-3xl font-black text-emerald-600">{bid.quantity}</p>
            <p className="text-xs text-slate-500 mt-2">{bid.unit}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <p className="text-sm text-slate-500 font-medium mb-2">Time Remaining</p>
            <p className="text-3xl font-black text-amber-600">{hoursRemaining}h</p>
            <p className="text-xs text-slate-500 mt-2">{minutesRemaining}m left</p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
          {['overview', 'history', 'ai', 'chat'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Sentiment Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-slate-900">Negotiation Sentiment</h3>
                  <span className={`font-bold ${
                    bid.sentiment > 0.6 ? 'text-emerald-600' :
                    bid.sentiment > 0.3 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {bid.sentiment > 0.6 ? 'Positive' : bid.sentiment > 0.3 ? 'Neutral' : 'Negative'}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bid.sentiment * 100}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${
                      bid.sentiment > 0.6 ? 'bg-emerald-500' :
                      bid.sentiment > 0.3 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </motion.div>

              {/* Counter Offer Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 shadow-lg"
              >
                <h3 className="text-xl font-black text-slate-900 mb-4">Place Counter Offer</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Price per {bid.unit}
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <span className="absolute left-4 top-3 text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          value={counterOfferPrice}
                          onChange={(e) => setCounterOfferPrice(e.target.value)}
                          placeholder={bid.currentBid.toString()}
                          className="w-full h-12 pl-8 pr-4 border border-slate-300 rounded-xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
                        />
                      </div>
                      <button
                        onClick={handlePlaceCounterOffer}
                        disabled={submitting || !counterOfferPrice}
                        className="h-12 px-6 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        <Send size={18} />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3"
              >
                <button
                  onClick={handleAcceptBid}
                  disabled={submitting || bid.status !== 'ACTIVE'}
                  className="flex-1 h-12 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Accept Bid
                </button>
                <button
                  onClick={handleCancelBid}
                  disabled={submitting || bid.status !== 'ACTIVE'}
                  className="flex-1 h-12 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={20} />
                  Cancel Bid
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-xl font-black text-slate-900 mb-4">Counter Offer History</h3>
                <div className="space-y-3">
                  {bid.counterOffers.map((offer, idx) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${
                          offer.from === 'BUYER' ? 'bg-blue-600' : 'bg-emerald-600'
                        }`}>
                          {offer.from === 'BUYER' ? 'B' : 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{offer.from === 'BUYER' ? 'Your Offer' : 'Supplier Offer'}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(offer.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-black text-slate-900">₹{offer.price.toLocaleString()}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Recommendations Tab */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {bid.aiRecommendation && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                        <Brain size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">AI Recommendation</h3>
                        <p className="text-sm text-slate-600">Based on market analysis</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-600 font-medium mb-1">Suggested Price</p>
                        <p className="text-3xl font-black text-purple-600">₹{bid.aiRecommendation.suggestedPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-medium mb-1">Confidence</p>
                        <p className="text-3xl font-black text-emerald-600">{Math.round(bid.aiRecommendation.confidence * 100)}%</p>
                      </div>
                    </div>

                    <p className="text-slate-700 font-medium mb-4">{bid.aiRecommendation.reasoning}</p>

                    <button
                      onClick={() => {
                        setCounterOfferPrice(bid.aiRecommendation!.suggestedPrice.toString());
                        setActiveTab('overview');
                      }}
                      className="w-full h-12 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={20} />
                      Use This Price
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
                  >
                    <h3 className="text-xl font-black text-slate-900 mb-4">Market Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <span className="font-bold text-slate-700">Market Average</span>
                        <span className="text-2xl font-black text-slate-900">₹{bid.aiRecommendation.marketAverage.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <span className="font-bold text-slate-700">Price Trend</span>
                        <span className={`flex items-center gap-2 font-bold ${
                          bid.aiRecommendation.trend === 'DOWN' ? 'text-emerald-600' :
                          bid.aiRecommendation.trend === 'UP' ? 'text-red-600' : 'text-slate-600'
                        }`}>
                          <TrendingDown size={20} />
                          {bid.aiRecommendation.trend}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
            >
              <h3 className="text-xl font-black text-slate-900 mb-4">Chat with Supplier</h3>
              <div className="h-96 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">Chat feature coming soon</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
