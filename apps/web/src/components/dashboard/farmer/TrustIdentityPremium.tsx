'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Award, CheckCircle, AlertCircle, Star, TrendingUp,
  Users, Eye, Lock, Zap, Activity, BarChart3, FileText, 
  Settings, Bell, Target, Sparkles, RefreshCw, Plus, Clock,
  ThumbsUp, MessageSquare, Camera, Upload, Download, Share2,
  Verified, ShieldCheck, BadgeCheck, UserCheck, Globe, Link2
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function TrustIdentityPremium() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);

  useEffect(() => {
    loadTrustData();
  }, [user]);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setVerificationProgress(prev => (prev >= 100 ? 0 : prev + 2));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const loadTrustData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Trust data refreshed');
    } catch (error) {
      console.error('Error loading trust data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const trustMetrics = {
    overallScore: 94.8,
    verificationLevel: 'Premium Verified',
    totalTransactions: 154,
    successRate: 98.2,
    responseTime: '2.3h',
    trustBadges: 8,
    endorsements: 47,
    disputes: 2
  };

  const verificationStatus = [
    { name: 'Identity', status: 'verified', score: 100, icon: UserCheck },
    { name: 'Business', status: 'verified', score: 100, icon: BadgeCheck },
    { name: 'Bank Account', status: 'verified', score: 100, icon: CheckCircle },
    { name: 'Phone', status: 'verified', score: 100, icon: CheckCircle },
    { name: 'Email', status: 'verified', score: 100, icon: CheckCircle },
    { name: 'Address', status: 'verified', score: 100, icon: CheckCircle },
    { name: 'Quality Cert', status: 'verified', score: 95, icon: Award },
    { name: 'Organic Cert', status: 'pending', score: 0, icon: Clock }
  ];

  const trustScoreHistory = [
    { month: 'Jan', score: 85 },
    { month: 'Feb', score: 87 },
    { month: 'Mar', score: 89 },
    { month: 'Apr', score: 91 },
    { month: 'May', score: 93 },
    { month: 'Jun', score: 94.8 }
  ];

  const reputationBreakdown = [
    { category: 'Quality', score: 96 },
    { category: 'Delivery', score: 98 },
    { category: 'Communication', score: 92 },
    { category: 'Pricing', score: 94 },
    { category: 'Reliability', score: 95 }
  ];

  const recentReviews = [
    { id: 1, buyer: 'Amit Traders', rating: 5, comment: 'Excellent quality tomatoes, always on time!', date: '2 days ago', verified: true },
    { id: 2, buyer: 'Fresh Mart', rating: 5, comment: 'Best supplier in the region. Highly recommended.', date: '5 days ago', verified: true },
    { id: 3, buyer: 'Organic Foods Co', rating: 4, comment: 'Good quality, minor delay in delivery.', date: '1 week ago', verified: true }
  ];

  const trustBadges = [
    { name: 'Top Seller', icon: Award, color: 'amber', earned: true },
    { name: 'Verified Organic', icon: Verified, color: 'green', earned: true },
    { name: 'Fast Responder', icon: Zap, color: 'blue', earned: true },
    { name: 'Quality Champion', icon: Star, color: 'purple', earned: true },
    { name: '100+ Sales', icon: Target, color: 'emerald', earned: true },
    { name: 'Premium Member', icon: ShieldCheck, color: 'indigo', earned: true },
    { name: 'Trusted Partner', icon: Users, color: 'pink', earned: true },
    { name: 'Eco Friendly', icon: Globe, color: 'teal', earned: false }
  ];

  const activityLog = [
    { action: 'Identity Verified', time: '2 hours ago', status: 'success' },
    { action: 'New Review Received', time: '5 hours ago', status: 'info' },
    { action: 'Trust Score Updated', time: '1 day ago', status: 'success' },
    { action: 'Badge Earned: Quality Champion', time: '3 days ago', status: 'success' }
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-200 h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Shield className="text-indigo-500" size={36} />
              Trust & Identity Hub
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-xl">
              <ShieldCheck size={16} className="text-indigo-600" />
              <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">AI-POWERED</span>
            </div>
          </div>
          <p className="text-slate-500 font-medium">AI-powered identity verification and trust management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadTrustData}
            disabled={refreshing}
            className="h-12 px-6 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2">
            <Upload size={18} />
            Upload Document
          </button>
        </div>
      </div>

      {/* Trust Score Hero Card */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={32} />
                <h2 className="text-2xl font-black">Overall Trust Score</h2>
              </div>
              <p className="text-indigo-100 font-medium">{trustMetrics.verificationLevel}</p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-black mb-1">{trustMetrics.overallScore}</div>
              <div className="text-sm font-bold text-indigo-100">out of 100</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl font-black mb-1">{trustMetrics.totalTransactions}</div>
              <div className="text-xs text-indigo-100 font-bold uppercase">Transactions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl font-black mb-1">{trustMetrics.successRate}%</div>
              <div className="text-xs text-indigo-100 font-bold uppercase">Success Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl font-black mb-1">{trustMetrics.responseTime}</div>
              <div className="text-xs text-indigo-100 font-bold uppercase">Avg Response</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl font-black mb-1">{trustMetrics.trustBadges}</div>
              <div className="text-xs text-indigo-100 font-bold uppercase">Trust Badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-slate-200 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'verification', label: 'Verification Status', icon: CheckCircle },
          { id: 'reputation', label: 'Reputation', icon: Star },
          { id: 'reviews', label: 'Reviews', icon: MessageSquare },
          { id: 'badges', label: 'Trust Badges', icon: Award },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Activity },
          { id: 'alerts', label: 'Smart Alerts', icon: Bell },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 h-12 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trust Score Trend */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Trust Score Trend</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={trustScoreHistory}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} domain={[80, 100]} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fill="url(#scoreGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Reputation Breakdown */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Reputation Breakdown</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={reputationBreakdown}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="category" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <PolarRadiusAxis domain={[0, 100]} style={{ fontSize: '10px' }} />
                    <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 'bold' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Verification Status</h2>
                <p className="text-slate-500 font-medium">Complete all verifications to unlock premium features</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {verificationStatus.map((item, i) => (
                  <div key={i} className={`p-6 rounded-2xl border-2 transition-all ${
                    item.status === 'verified' ? 'bg-emerald-50 border-emerald-200' :
                    item.status === 'pending' ? 'bg-amber-50 border-amber-200' :
                    'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        item.status === 'verified' ? 'bg-emerald-500 text-white' :
                        item.status === 'pending' ? 'bg-amber-500 text-white' :
                        'bg-slate-300 text-slate-600'
                      }`}>
                        <item.icon size={24} />
                      </div>
                      {item.status === 'verified' && (
                        <CheckCircle className="text-emerald-600" size={20} />
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black uppercase ${
                        item.status === 'verified' ? 'text-emerald-600' :
                        item.status === 'pending' ? 'text-amber-600' :
                        'text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                      {item.score > 0 && (
                        <span className="text-sm font-black text-slate-900">{item.score}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reputation' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Reputation Metrics</h2>
              <div className="space-y-4">
                {reputationBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900">{item.category}</span>
                        <span className="text-sm font-black text-indigo-600">{item.score}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Recent Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star className="text-amber-500 fill-amber-500" size={20} />
                  <span className="text-2xl font-black text-slate-900">4.9</span>
                  <span className="text-sm text-slate-500 font-medium">({trustMetrics.endorsements} reviews)</span>
                </div>
              </div>
              <div className="space-y-4">
                {recentReviews.map(review => (
                  <div key={review.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg">
                          {review.buyer.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{review.buyer}</h3>
                            {review.verified && (
                              <BadgeCheck className="text-indigo-600" size={16} />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 font-bold">{review.date}</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Trust Badges</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {trustBadges.map((badge, i) => (
                  <div key={i} className={`p-6 rounded-2xl border-2 text-center transition-all ${
                    badge.earned 
                      ? 'bg-gradient-to-br from-slate-50 to-white border-slate-200 hover:shadow-lg' 
                      : 'bg-slate-50 border-slate-100 opacity-50'
                  }`}>
                    <div className={`h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                      badge.earned 
                        ? `bg-${badge.color}-100 text-${badge.color}-600` 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <badge.icon size={32} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{badge.name}</h3>
                    {badge.earned ? (
                      <span className="text-xs font-black text-emerald-600 uppercase">Earned</span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 uppercase">Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Trust Analytics</h2>
              <div className="text-center py-12">
                <BarChart3 className="mx-auto text-slate-300 mb-4" size={64} />
                <p className="text-slate-500 font-medium">Detailed analytics and insights coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Verification Documents</h2>
              <div className="text-center py-12">
                <FileText className="mx-auto text-slate-300 mb-4" size={64} />
                <p className="text-slate-500 font-medium">Document management system</p>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Activity Log</h2>
              <div className="space-y-3">
                {activityLog.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                      activity.status === 'info' ? 'bg-blue-100 text-blue-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      <Activity size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900">{activity.action}</h3>
                      <p className="text-xs text-slate-500 font-medium">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Smart Alerts</h2>
              <div className="text-center py-12">
                <Bell className="mx-auto text-slate-300 mb-4" size={64} />
                <p className="text-slate-500 font-medium">AI-powered alert system</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Trust Settings</h2>
              <div className="text-center py-12">
                <Settings className="mx-auto text-slate-300 mb-4" size={64} />
                <p className="text-slate-500 font-medium">Configure trust and privacy settings</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
