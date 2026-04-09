'use client';

import React, { useState, useEffect } from 'react';

interface Insights {
  totalSpending: number;
  averageOrderValue: number;
  topSuppliers: Array<{ name: string; orders: number }>;
  recommendations: Array<{ name: string; reason: string }>;
}

export const BuyerInsightsDashboardComponent: React.FC<{ buyerId: string }> = ({ buyerId }) => {
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    loadInsights();
  }, [buyerId]);

  const loadInsights = async () => {
    try {
      const response = await fetch(`/api/buyer-insights/${buyerId}`);
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  if (!insights) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Buyer Insights</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Total Spending</p>
          <p className="text-2xl font-bold text-blue-600">₹{insights.totalSpending}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Avg Order Value</p>
          <p className="text-2xl font-bold text-green-600">₹{insights.averageOrderValue}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Top Suppliers</h3>
        <div className="space-y-2">
          {insights.topSuppliers.map((supplier, idx) => (
            <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
              <span>{supplier.name}</span>
              <span className="font-semibold">{supplier.orders} orders</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Recommendations</h3>
        <div className="space-y-2">
          {insights.recommendations.map((rec, idx) => (
            <div key={idx} className="p-2 bg-yellow-50 rounded">
              <p className="font-semibold text-sm">{rec.name}</p>
              <p className="text-xs text-gray-600">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
