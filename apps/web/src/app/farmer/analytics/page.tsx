'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Loader2, TrendingUp, ShoppingCart, Package, 
  IndianRupee, BarChart3 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function FarmerAnalyticsPage() {
  const { farmerData, loading, fetchFarmerAnalytics } = useAnalytics();
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchFarmerAnalytics(timeRange);
  }, [timeRange, fetchFarmerAnalytics]);

  if (loading && !farmerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!farmerData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const { summary, chartTimeSeries, topCrops, activeCrops, soldCrops } = farmerData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
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
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalOrders || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quantity Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalQuantitySold?.toLocaleString() || 0} kg
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{summary.completedEarnings?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Pending: ₹{summary.pendingEarnings?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
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
            <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Crops */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Top Performing Crops</h2>
          {topCrops.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No crop data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCrops}>
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

        {/* Crop Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Crop Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 w-3 h-3 rounded-full"></div>
                <span className="font-medium">Active Listings</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{activeCrops}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 w-3 h-3 rounded-full"></div>
                <span className="font-medium">Sold Crops</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{soldCrops}</span>
            </div>
          </div>

          {topCrops.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Crop Performance Details</h3>
              <div className="space-y-2">
                {topCrops.map((crop, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{crop.name}</p>
                      <p className="text-sm text-gray-600">{crop.quantity} kg sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{crop.revenue?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{crop.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
