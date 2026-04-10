'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Loader2, TrendingUp, Users, Package, IndianRupee 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function FPOAnalyticsPage() {
  const { fpoData, loading, fetchFPOAnalytics } = useAnalytics();
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchFPOAnalytics(timeRange);
  }, [timeRange, fetchFPOAnalytics]);

  if (loading && !fpoData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!fpoData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const { summary, chartTimeSeries, topLots } = fpoData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">FPO Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{summary.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commission Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{summary.totalCommission?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Rate: {summary.commissionRate}%
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Farmers</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalFarmers || 0}</p>
              <p className="text-xs text-green-600 mt-1">
                Active: {summary.activeFarmers || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aggregated Lots</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalLots || 0}</p>
              <p className="text-xs text-green-600 mt-1">
                Active: {summary.activeLots || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartTimeSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (₹)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Lots */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Top Performing Lots</h2>
          {topLots.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No lot data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLots}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* FPO Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Total Orders</span>
                <span className="text-2xl font-bold text-green-600">{summary.totalOrders || 0}</span>
              </div>
              <div className="text-xs text-gray-600">
                Orders processed in selected period
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Avg Revenue per Order</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{summary.totalOrders && summary.totalRevenue 
                    ? (summary.totalRevenue / summary.totalOrders).toLocaleString(undefined, { maximumFractionDigits: 0 })
                    : 0}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                Average order value
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Commission Rate</span>
                <span className="text-2xl font-bold text-yellow-600">{summary.commissionRate}%</span>
              </div>
              <div className="text-xs text-gray-600">
                FPO commission on sales
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lot Performance Details */}
      {topLots.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Lot Performance Details</h2>
          <div className="space-y-2">
            {topLots.map((lot, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{lot.name}</p>
                  <p className="text-sm text-gray-600">{lot.quantity} kg sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{lot.revenue?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{lot.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
