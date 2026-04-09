'use client';

import React, { useState, useEffect } from 'react';
import { marketDataService } from '@/services/marketDataService';

interface Analytics {
  totalSales: number;
  totalRevenue: number;
  topProducts: Array<{ name: string; sales: number }>;
  orderStats: Record<string, number>;
}

const FarmInsights: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [farmerId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock analytics data
      const data: Analytics = {
        totalSales: 150,
        totalRevenue: 45000,
        topProducts: [
          { name: 'Tomatoes', sales: 45 },
          { name: 'Onions', sales: 38 },
          { name: 'Wheat', sales: 32 }
        ],
        orderStats: {
          'Completed': 120,
          'Pending': 15,
          'Cancelled': 5
        }
      };
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading insights...</div>;
  if (!analytics) return <div className="p-6 text-center">No data available</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Farm Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Sales</p>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalSales}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">₹{analytics.totalRevenue}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Top Products</h3>
        <div className="space-y-2">
          {analytics.topProducts.map((product, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>{product.name}</span>
              <span className="font-semibold">{product.sales} sales</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Order Status Distribution</h3>
        <div className="space-y-2">
          {Object.entries(analytics.orderStats).map(([status, count]) => (
            <div key={status} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>{status}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmInsights;
