'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Package, AlertCircle, CheckCircle } from 'lucide-react';
import SubfeaturePage from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function LiveDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await buyerFeatureService.cockpit.getLiveDashboard();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubfeaturePage
      title="Live Dashboard"
      description="Real-time command center with live KPIs and market updates"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error || undefined}
      onRetry={loadData}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold">Active Orders</h3>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{data?.activeOrders || 0}</p>
          <p className="text-sm text-slate-400">+12% from last week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold">Total Spent</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">₹{data?.totalSpent || 0}</p>
          <p className="text-sm text-slate-400">This month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold">Suppliers</h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{data?.activeSuppliers || 0}</p>
          <p className="text-sm text-slate-400">Verified & active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold">Reputation</h3>
            <BarChart3 className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{data?.reputationScore || 0}%</p>
          <p className="text-sm text-slate-400">Trust score</p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {data?.recentActivity?.map((activity: any, idx: number) => (
            <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-700/50 last:border-0">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                {activity.type === 'order' ? (
                  <Package className="w-5 h-5 text-blue-500" />
                ) : activity.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{activity.title}</p>
                <p className="text-slate-400 text-sm">{activity.description}</p>
                <p className="text-slate-500 text-xs mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mt-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Market Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.marketUpdates?.map((update: any, idx: number) => (
            <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
              <p className="text-white font-semibold mb-2">{update.title}</p>
              <p className="text-slate-400 text-sm">{update.description}</p>
              <p className="text-slate-500 text-xs mt-2">{update.time}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </SubfeaturePage>
  );
}
