'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Loader2, ShoppingBag, IndianRupee, Package, TrendingDown 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function BuyerAnalyticsPage() {
  const { buyerData, loading, fetchBuyerAnalytics } = useAnalytics();
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchBuyerAnalytics(timeRange);
  }, [timeRange, fetchBuyerAnalytics]);

  if (loading && !buyerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!buyerData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const { summary, chartTimeSeries, topPurchases, ordersByStatus } = buyerData;

  const statusData = [
    { name: 'Pending', value: ordersByStatus.pending, color: '#f59e0b' },
    { name: 'Confirmed', value: ordersByStatus.confirmed, color: '#3b82f6' },
    { name: 'In Transit', value: ordersByStatus.inTransit, color: '#8b5cf6' },
    { name: 'Delivered', value: ordersByStatus.delivered, color: '#10b981' },
    { name: 'Cancelled', value: ordersByStatus.cancelled, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Purchase Analytics</h1>
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
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{summary.totalSpent?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
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
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalQuantity?.toLocaleString() || 0} kg
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
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{summary.averageOrderValue?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Spending Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartTimeSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="spending" stroke="#ef4444" strokeWidth={2} name="Spending (₹)" />
            <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Purchases */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Top Purchases</h2>
          {topPurchases.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No purchase data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPurchases}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#10b981" name="Amount (₹)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Order Status Distribution</h2>
          {statusData.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No orders yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Purchase Details */}
      {topPurchases.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Purchase Details</h2>
          <div className="space-y-2">
            {topPurchases.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.quantity} kg purchased</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{item.amount?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{item.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
