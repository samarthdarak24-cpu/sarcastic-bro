'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, ComposedChart, Legend,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import {
  TrendingUp, DollarSign, Globe, Zap, AlertCircle, Target,
  Calendar, MapPin, Package, CheckCircle, ArrowUpRight, ArrowDownLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MandiPrice {
  crop: string;
  price: number;
  trend: 'up' | 'down' | 'stable';
  priceChange: number;
  state: string;
  arrivals: number;
}

interface GlobalMarket {
  country: string;
  price: number;
  currency: string;
  demand: 'high' | 'medium' | 'low';
  profit: number;
}

interface ProfitComparison {
  crop: string;
  quantity: number;
  localProfit: number;
  exportProfit: number;
  bestCountry: string;
  profitDifference: number;
}

interface Recommendation {
  crop: string;
  recommendedCountry: string;
  profitPercentage: number;
  demandLevel: string;
  deliveryDays: number;
  riskLevel: string;
}

export const ExportIntelligenceHub = () => {
  const [activeTab, setActiveTab] = useState<'mandi' | 'global' | 'profit' | 'recommendations' | 'alerts'>('mandi');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState(100);
  const [destination, setDestination] = useState('UAE');

  const [mandiData, setMandiData] = useState<MandiPrice[]>([]);
  const [globalData, setGlobalData] = useState<GlobalMarket[]>([]);
  const [profitData, setProfitData] = useState<ProfitComparison | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demo
  const crops = ['Tomato', 'Onion', 'Potato', 'Wheat', 'Rice', 'Cotton'];
  const countries = ['UAE', 'Germany', 'USA', 'UK', 'China', 'Netherlands'];

  useEffect(() => {
    fetchMandiPrices();
  }, [selectedCrop]);

  const fetchMandiPrices = async () => {
    setLoading(true);
    try {
      // Mock API call
      const mockMandiData: MandiPrice[] = [
        {
          crop: selectedCrop,
          price: selectedCrop === 'Tomato' ? 2400 : selectedCrop === 'Onion' ? 2800 : 1600,
          trend: 'up' as const,
          priceChange: 150,
          state: 'Maharashtra',
          arrivals: 1250,
        },
        {
          crop: selectedCrop,
          price: selectedCrop === 'Tomato' ? 2250 : selectedCrop === 'Onion' ? 2650 : 1550,
          trend: 'up' as const,
          priceChange: 100,
          state: 'Karnataka',
          arrivals: 980,
        },
      ];

      const mockGlobalData: GlobalMarket[] = [
        {
          country: 'UAE',
          price: 4500,
          currency: 'AED',
          demand: 'high',
          profit: 2100,
        },
        {
          country: 'Germany',
          price: 5200,
          currency: 'EUR',
          demand: 'medium',
          profit: 2800,
        },
        {
          country: 'USA',
          price: 4800,
          currency: 'USD',
          demand: 'medium',
          profit: 2400,
        },
        {
          country: 'UK',
          price: 4900,
          currency: 'GBP',
          demand: 'high',
          profit: 2500,
        },
      ];

      const mockProfitData: ProfitComparison = {
        crop: selectedCrop,
        quantity,
        localProfit: quantity * (selectedCrop === 'Tomato' ? 400 : 600),
        exportProfit: quantity * (selectedCrop === 'Tomato' ? 2100 : 2800),
        bestCountry: destination,
        profitDifference: quantity * (selectedCrop === 'Tomato' ? 1700 : 2200),
      };

      const mockRecommendations: Recommendation[] = [
        {
          crop: selectedCrop,
          recommendedCountry: 'Germany',
          profitPercentage: 35,
          demandLevel: 'high',
          deliveryDays: 15,
          riskLevel: 'low',
        },
        {
          crop: selectedCrop,
          recommendedCountry: 'UAE',
          profitPercentage: 28,
          demandLevel: 'high',
          deliveryDays: 3,
          riskLevel: 'low',
        },
        {
          crop: selectedCrop,
          recommendedCountry: 'USA',
          profitPercentage: 22,
          demandLevel: 'medium',
          deliveryDays: 20,
          riskLevel: 'medium',
        },
      ];

      const mockAlerts = [
        {
          type: 'PRICE_SPIKE',
          severity: 'high',
          message: `${selectedCrop} price increased by ₹${150}! Sell now for maximum profit`,
          action: 'Export now',
          timestamp: new Date(),
        },
        {
          type: 'HIGH_DEMAND',
          severity: 'medium',
          message: `High demand detected in Germany for ${selectedCrop}`,
          action: 'Check export rates',
          timestamp: new Date(),
        },
      ];

      setMandiData(mockMandiData);
      setGlobalData(mockGlobalData);
      setProfitData(mockProfitData);
      setRecommendations(mockRecommendations);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMandiTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mandiData.map((data, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{data.state}</h3>
                <p className="text-sm text-gray-600">{data.crop}</p>
              </div>
              {data.trend === 'up' ? (
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowDownLeft className="w-5 h-5 text-red-600" />
              )}
            </div>

            <div className="mb-2">
              <p className="text-3xl font-bold text-green-700">₹{data.price}</p>
              <p className="text-sm text-gray-600">per quintal</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-600">Change</p>
                <p className="text-green-600 font-semibold">
                  +₹{data.priceChange}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Arrivals</p>
                <p className="font-semibold">{data.arrivals} tons</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Price Trend (7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mandiData.concat(mandiData)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderGlobalTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Global Price Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={globalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#3b82f6" radius={8}>
              {globalData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.demand === 'high'
                      ? '#10b981'
                      : entry.demand === 'medium'
                      ? '#f59e0b'
                      : '#ef4444'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {globalData.slice(0, 2).map((market, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">{market.country}</h4>
              <Globe className="w-5 h-5 text-blue-600" />
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-blue-600">
                {market.price}
              </p>
              <p className="text-sm text-gray-600">{market.currency}/quintal</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  market.demand === 'high'
                    ? 'bg-green-100 text-green-800'
                    : market.demand === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {market.demand} demand
              </span>
              <p className="text-green-600 font-bold">+₹{market.profit}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderProfitTab = () => (
    <div className="space-y-6">
      {profitData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Local Sale (Mandi)</h4>
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-orange-600">
                  ₹{profitData.localProfit.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Net profit for {quantity}Q</p>
              </div>

              <div className="bg-orange-100 rounded p-3">
                <p className="text-sm text-orange-900">
                  💰 Profit margin: ~16%
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Export (Recommended)</h4>
                <Globe className="w-5 h-5 text-green-600" />
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-green-600">
                  ₹{profitData.exportProfit.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">to {profitData.bestCountry}</p>
              </div>

              <div className="bg-green-100 rounded p-3">
                <p className="text-sm text-green-900 font-semibold">
                  ✅ +{Math.round((profitData.profitDifference / profitData.localProfit) * 100)}% more profit
                </p>
              </div>
            </motion.div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Profit Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Crop Quantity</span>
                <span className="font-semibold">{quantity} quintals</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Local Mandi Price</span>
                <span className="font-semibold">₹{Math.round(profitData.localProfit / quantity)}/Q</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Export Price ({profitData.bestCountry})</span>
                <span className="font-semibold">₹{Math.round(profitData.exportProfit / quantity)}/Q</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-semibold text-green-600">Additional Profit</span>
                <span className="text-lg font-bold text-green-600">
                  +₹{profitData.profitDifference.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="space-y-4">
      {recommendations.map((rec, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`border rounded-lg p-6 ${
            idx === 0
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {rec.recommendedCountry}
              </h4>
              <p className="text-sm text-gray-600">{rec.crop}</p>
            </div>
            {idx === 0 && (
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                ⭐ Top Pick
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600">Profit</p>
              <p className="text-xl font-bold text-green-600">+{rec.profitPercentage}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Demand</p>
              <p className="font-semibold text-gray-800">
                {rec.demandLevel === 'high' ? '🟢' : '🟡'} {rec.demandLevel}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Delivery</p>
              <p className="font-semibold">{rec.deliveryDays} days</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Risk</p>
              <p className={`font-semibold ${
                rec.riskLevel === 'low' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {rec.riskLevel}
              </p>
            </div>
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition">
            Get Export Details →
          </button>
        </motion.div>
      ))}
    </div>
  );

  const renderAlertsTab = () => (
    <div className="space-y-4">
      {alerts.map((alert, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`border rounded-lg p-4 flex gap-4 ${
            alert.severity === 'high'
              ? 'bg-red-50 border-red-300'
              : 'bg-yellow-50 border-yellow-300'
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 mt-1 ${
              alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
            }`}
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{alert.message}</h4>
            <p className="text-sm text-gray-600 mt-1">
              Action: {alert.action}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Global Export Intelligence Hub</h1>
          </div>
          <p className="text-emerald-100">
            Real-time mandi prices, global market analysis & AI-powered export recommendations
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                {crops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity (Quintals)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Export Country
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-20 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto">
            {['mandi', 'global', 'profit', 'recommendations', 'alerts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-6 py-4 font-semibold transition text-center border-b-2 ${
                  activeTab === tab
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Zap className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-gray-600 mt-4">Loading market data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'mandi' && renderMandiTab()}
            {activeTab === 'global' && renderGlobalTab()}
            {activeTab === 'profit' && renderProfitTab()}
            {activeTab === 'recommendations' && renderRecommendationsTab()}
            {activeTab === 'alerts' && renderAlertsTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default ExportIntelligenceHub;
