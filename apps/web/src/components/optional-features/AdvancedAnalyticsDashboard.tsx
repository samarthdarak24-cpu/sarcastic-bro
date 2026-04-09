'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Leaf, BarChart3 } from 'lucide-react';

interface CropAnalytics {
  cropId: string;
  cropType: string;
  diseaseRisk: string;
  yieldTrend: number;
  profitMargin: number;
  totalProduction: number;
}

export const AdvancedAnalyticsDashboard: React.FC<{ farmerId: string }> = ({
  farmerId,
}) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [farmerId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `/api/analytics/dashboard/${farmerId}`
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-600 bg-red-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-4">No analytics data available</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Advanced Analytics Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Crops</p>
          <p className="text-2xl font-bold text-blue-600">
            {analytics.totalCrops}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Production</p>
          <p className="text-2xl font-bold text-green-600">
            {analytics.totalProduction} units
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Avg Profit Margin</p>
          <p className="text-2xl font-bold text-purple-600">
            {(analytics.averageProfit * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Insights</p>
          <p className="text-2xl font-bold text-orange-600">
            {analytics.insights?.length || 0}
          </p>
        </div>
      </div>

      {/* Crops Analysis */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Crop Analysis</h3>
        <div className="space-y-3">
          {analytics.crops?.map((crop: CropAnalytics) => (
            <div
              key={crop.cropId}
              className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedCrop(crop.cropId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {crop.cropType}
                  </h4>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-600">
                      Production: {crop.totalProduction} units
                    </span>
                    <span className="text-gray-600">
                      Price: ₹{crop.averagePrice}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(crop.diseaseRisk)}`}>
                    {crop.diseaseRisk} Risk
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span
                      className={
                        crop.yieldTrend > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {(crop.yieldTrend * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {analytics.insights && analytics.insights.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">Key Insights</h3>
          <ul className="space-y-2">
            {analytics.insights.map((insight: string, idx: number) => (
              <li key={idx} className="flex gap-2 text-sm text-blue-800">
                <span className="text-blue-600">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
