'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface MarketPrice {
  id: string;
  cropName: string;
  variety: string;
  grade: string;
  pricePerKg: number;
  district: string;
  recordedAt: string;
}

interface CurrentAverage {
  cropName: string;
  district: string;
  _avg: {
    pricePerKg: number;
  };
}

export default function FarmerMarketPrices() {
  const router = useRouter();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [averages, setAverages] = useState<CurrentAverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedDistrict, setSelectedDistrict] = useState('Nanded');
  const [crops, setCrops] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchMarketData();
  }, [router, selectedCrop, selectedDistrict]);

  const fetchMarketData = async () => {
    try {
      const [pricesRes, avgRes, cropsRes, districtsRes] = await Promise.all([
        axios.get(`${API_URL}/api/market-prices`, {
          params: { cropName: selectedCrop, district: selectedDistrict }
        }),
        axios.get(`${API_URL}/api/market-prices/summary`),
        axios.get(`${API_URL}/api/market-prices/crops`),
        axios.get(`${API_URL}/api/market-prices/districts`)
      ]);

      setPrices(pricesRes.data);
      setAverages(avgRes.data);
      setCrops(cropsRes.data);
      setDistricts(districtsRes.data);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    return prices
      .slice(0, 30)
      .reverse()
      .map(p => ({
        date: new Date(p.recordedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        price: p.pricePerKg
      }));
  };

  const getCurrentAverage = () => {
    const avg = averages.find(a => 
      a.cropName === selectedCrop && a.district === selectedDistrict
    );
    return avg?._avg.pricePerKg || 0;
  };

  const getMinMaxPrices = () => {
    if (prices.length === 0) return { min: 0, max: 0 };
    const priceValues = prices.map(p => p.pricePerKg);
    return {
      min: Math.min(...priceValues),
      max: Math.max(...priceValues)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const { min, max } = getMinMaxPrices();
  const currentAvg = getCurrentAverage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/farmer')} className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Market Prices</h1>
              <p className="text-sm text-gray-600">Real-time price transparency</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {crops.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Current Average</h3>
            <p className="text-3xl font-bold text-green-600">₹{currentAvg.toFixed(2)}/kg</p>
            <p className="text-xs text-gray-500 mt-2">Last 30 days average</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Lowest Price</h3>
            <p className="text-3xl font-bold text-red-600">₹{min.toFixed(2)}/kg</p>
            <p className="text-xs text-gray-500 mt-2">In last 6 months</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Highest Price</h3>
            <p className="text-3xl font-bold text-blue-600">₹{max.toFixed(2)}/kg</p>
            <p className="text-xs text-gray-500 mt-2">In last 6 months</p>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Price Trend - {selectedCrop} ({selectedDistrict})
          </h3>
          {getChartData().length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => `₹${Number(value).toFixed(2)}/kg`}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Price per kg"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No price data available for this selection</p>
            </div>
          )}
        </div>

        {/* Fair Price Indicator */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm p-6 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Price Indicator</h3>
              <p className="text-gray-700 mb-4">
                The current average price for {selectedCrop} in {selectedDistrict} is <span className="font-bold text-green-600">₹{currentAvg.toFixed(2)}/kg</span>.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Pricing Recommendation:</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Competitive Range</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{(currentAvg * 0.95).toFixed(2)} - ₹{(currentAvg * 1.05).toFixed(2)}/kg
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Premium Range</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{(currentAvg * 1.05).toFixed(2)} - ₹{(currentAvg * 1.15).toFixed(2)}/kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
