'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, MessageSquare, Clock, Users,
  ThumbsUp, ThumbsDown, Zap, Target, Award
} from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    {
      label: 'Total Messages',
      value: '1,247',
      change: '+12%',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      label: 'Active Conversations',
      value: '23',
      change: '+5',
      icon: Users,
      color: 'green'
    },
    {
      label: 'Avg Response Time',
      value: '2.5 min',
      change: '-15%',
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Positive Sentiment',
      value: '87%',
      change: '+3%',
      icon: ThumbsUp,
      color: 'emerald'
    }
  ];

  const conversationMetrics = [
    { name: 'Ramesh Kumar', messages: 145, sentiment: 'positive', responseTime: '1.2 min' },
    { name: 'Sunita Devi', messages: 98, sentiment: 'positive', responseTime: '2.8 min' },
    { name: 'Amit Traders', messages: 76, sentiment: 'neutral', responseTime: '3.5 min' },
    { name: 'Fresh Mart', messages: 54, sentiment: 'positive', responseTime: '1.8 min' },
    { name: 'Mohan Kumar', messages: 43, sentiment: 'neutral', responseTime: '4.2 min' },
  ];

  const sentimentData = [
    { label: 'Positive', value: 87, color: 'bg-green-500' },
    { label: 'Neutral', value: 10, color: 'bg-gray-400' },
    { label: 'Negative', value: 3, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl font-black text-slate-900">Conversation Analytics</h1>
                <p className="text-sm text-slate-600">Track your communication performance</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`h-10 px-4 rounded-xl font-medium transition-all ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon size={24} className={`text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-bold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Conversations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 mb-6">Top Conversations</h2>
              <div className="space-y-4">
                {conversationMetrics.map((conv, idx) => (
                  <div
                    key={conv.name}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{conv.name}</h3>
                        <p className="text-sm text-slate-600">{conv.messages} messages</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{conv.responseTime}</p>
                        <p className="text-xs text-slate-500">Avg response</p>
                      </div>
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        conv.sentiment === 'positive' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {conv.sentiment === 'positive' ? (
                          <ThumbsUp size={16} className="text-green-600" />
                        ) : (
                          <ThumbsUp size={16} className="text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 mb-6">Sentiment Analysis</h2>
              <div className="space-y-4">
                {sentimentData.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 shadow-lg text-white">
              <Award size={32} className="mb-4" />
              <h3 className="text-2xl font-black mb-2">Great Job!</h3>
              <p className="text-blue-100 mb-4">
                Your response time is 35% faster than average. Keep up the excellent communication!
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Zap size={16} />
                <span className="font-bold">Top 10% Communicator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-lg">
          <h2 className="text-xl font-black text-slate-900 mb-6">Message Activity</h2>
          <div className="flex items-end justify-between h-64 gap-2">
            {[45, 67, 89, 123, 98, 145, 167].map((value, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / 167) * 100}%` }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg hover:from-blue-700 hover:to-cyan-600 transition-all cursor-pointer"
                  title={`${value} messages`}
                />
                <span className="text-xs text-slate-600 font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
