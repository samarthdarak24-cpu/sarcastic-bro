'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Award,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Clock,
  Star,
  ShoppingBag,
  MessageSquare,
  Shield,
} from 'lucide-react';

interface ReputationHistoryEntry {
  date: Date;
  score: number;
  change: number;
  reason: string;
  category: 'order' | 'payment' | 'review' | 'badge' | 'dispute' | 'communication';
  impact: number;
}

export default function ReputationHistoryPage() {
  const { user } = useAuth('BUYER');
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<ReputationHistoryEntry[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    // Fetch reputation history from API
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call to /api/buyer/reputation/history
        // const response = await fetch('/api/buyer/reputation/history');
        // const data = await response.json();
        
        // Mock data for now
        const mockData: ReputationHistoryEntry[] = [
          {
            date: new Date('2024-03-20'),
            score: 92,
            change: 3,
            reason: 'Received 5-star review from Rajesh Kumar',
            category: 'review',
            impact: 3,
          },
          {
            date: new Date('2024-03-18'),
            score: 89,
            change: 2,
            reason: 'Completed order on time with prompt payment',
            category: 'order',
            impact: 2,
          },
          {
            date: new Date('2024-03-15'),
            score: 87,
            change: 5,
            reason: 'Earned "Reliable Buyer" badge',
            category: 'badge',
            impact: 5,
          },
          {
            date: new Date('2024-03-12'),
            score: 82,
            change: 2,
            reason: 'Payment made within 24 hours',
            category: 'payment',
            impact: 2,
          },
          {
            date: new Date('2024-03-08'),
            score: 80,
            change: -3,
            reason: 'Delayed response to supplier inquiry',
            category: 'communication',
            impact: -3,
          },
          {
            date: new Date('2024-03-05'),
            score: 83,
            change: 4,
            reason: 'Positive feedback from multiple suppliers',
            category: 'review',
            impact: 4,
          },
          {
            date: new Date('2024-03-01'),
            score: 79,
            change: 1,
            reason: 'Successful order completion',
            category: 'order',
            impact: 1,
          },
          {
            date: new Date('2024-02-25'),
            score: 78,
            change: -2,
            reason: 'Minor dispute resolved',
            category: 'dispute',
            impact: -2,
          },
        ];
        
        setHistoryData(mockData);
      } catch (error) {
        console.error('Failed to fetch reputation history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user, timeRange]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order':
        return ShoppingBag;
      case 'payment':
        return Clock;
      case 'review':
        return Star;
      case 'badge':
        return Award;
      case 'dispute':
        return AlertCircle;
      case 'communication':
        return MessageSquare;
      default:
        return Activity;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'order':
        return 'blue';
      case 'payment':
        return 'emerald';
      case 'review':
        return 'amber';
      case 'badge':
        return 'purple';
      case 'dispute':
        return 'red';
      case 'communication':
        return 'indigo';
      default:
        return 'slate';
    }
  };

  if (!user || user.role !== 'BUYER') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentScore = historyData.length > 0 ? historyData[0].score : 0;
  const previousScore = historyData.length > 1 ? historyData[1].score : currentScore;
  const scoreChange = currentScore - previousScore;

  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <div className="p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
            Reputation History
          </h1>
          <p className="text-slate-500 font-medium">
            Track your reputation score changes over time
          </p>
        </motion.div>

        {/* Current Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Current Reputation Score
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-blue-600">{currentScore}</span>
                <span className="text-2xl text-slate-500 font-bold">/100</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {scoreChange > 0 ? (
                  <ArrowUp className="text-emerald-600" size={20} />
                ) : scoreChange < 0 ? (
                  <ArrowDown className="text-red-600" size={20} />
                ) : (
                  <Minus className="text-slate-600" size={20} />
                )}
                <span
                  className={`font-bold ${
                    scoreChange > 0
                      ? 'text-emerald-600'
                      : scoreChange < 0
                      ? 'text-red-600'
                      : 'text-slate-600'
                  }`}
                >
                  {scoreChange > 0 ? '+' : ''}
                  {scoreChange} points from last update
                </span>
              </div>
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
                  strokeDasharray={`${(currentScore / 100) * 565.48} 565.48`}
                  initial={{ strokeDasharray: '0 565.48' }}
                  animate={{ strokeDasharray: `${(currentScore / 100) * 565.48} 565.48` }}
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
                  <p className="text-sm text-slate-600 font-medium">
                    {currentScore >= 90
                      ? 'Excellent'
                      : currentScore >= 75
                      ? 'Good'
                      : currentScore >= 60
                      ? 'Fair'
                      : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Time Range Filter */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: 'all', label: 'All Time' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-6 py-3 font-bold text-sm rounded-xl transition-all whitespace-nowrap ${
                timeRange === range.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-600'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* History Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Score Timeline</h3>
              <p className="text-slate-500 font-medium">
                Detailed history of reputation changes
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {historyData.map((entry, idx) => {
                const CategoryIcon = getCategoryIcon(entry.category);
                const color = getCategoryColor(entry.category);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative pl-12 pb-8 border-l-2 border-slate-200 last:border-l-0 last:pb-0"
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-0 top-0 -translate-x-1/2 h-8 w-8 bg-${color}-100 border-4 border-white rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <CategoryIcon className={`text-${color}-600`} size={16} />
                    </div>

                    {/* Content */}
                    <div className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-black text-slate-900">
                              {entry.score}
                            </span>
                            <div
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                                entry.change > 0
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : entry.change < 0
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {entry.change > 0 ? (
                                <TrendingUp size={14} />
                              ) : entry.change < 0 ? (
                                <TrendingDown size={14} />
                              ) : (
                                <Minus size={14} />
                              )}
                              {entry.change > 0 ? '+' : ''}
                              {entry.change}
                            </div>
                          </div>
                          <p className="text-slate-700 font-medium mb-2">{entry.reason}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar size={14} />
                            <span className="font-medium">
                              {entry.date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700 capitalize`}
                        >
                          {entry.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">
              {historyData.filter((e) => e.change > 0).length}
            </p>
            <p className="text-slate-600 font-medium">Positive Changes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <Activity size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">
              {historyData.length}
            </p>
            <p className="text-slate-600 font-medium">Total Events</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <Shield size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">
              {Math.max(...historyData.map((e) => e.score))}
            </p>
            <p className="text-slate-600 font-medium">Peak Score</p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
