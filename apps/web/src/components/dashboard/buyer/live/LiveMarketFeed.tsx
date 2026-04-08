"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface MarketPrice {
  crop: string;
  price: number;
  change: number;
  volume: string;
  trend: "up" | "down";
  lastUpdated: string;
}

export default function LiveMarketFeed() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchPrices = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/api/buyer/cockpit/live-prices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrices(data.data || []);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      // Fallback to mock data
      setPrices(getMockPrices());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getMockPrices = (): MarketPrice[] => [
    { crop: "Tomato", price: 45, change: 2.5, volume: "1.2T", trend: "up", lastUpdated: new Date().toISOString() },
    { crop: "Onion", price: 32, change: -1.8, volume: "850kg", trend: "down", lastUpdated: new Date().toISOString() },
    { crop: "Wheat", price: 28, change: 0.5, volume: "2.5T", trend: "up", lastUpdated: new Date().toISOString() },
    { crop: "Rice (Basmati)", price: 85, change: 3.2, volume: "1.8T", trend: "up", lastUpdated: new Date().toISOString() },
    { crop: "Potato", price: 22, change: -0.5, volume: "1.5T", trend: "down", lastUpdated: new Date().toISOString() },
    { crop: "Cotton", price: 95, change: 1.2, volume: "500kg", trend: "up", lastUpdated: new Date().toISOString() },
    { crop: "Sugarcane", price: 38, change: 0.8, volume: "3.2T", trend: "up", lastUpdated: new Date().toISOString() },
    { crop: "Soybean", price: 68, change: -2.1, volume: "900kg", trend: "down", lastUpdated: new Date().toISOString() }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Loading live market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">📊 Live Market Feed</h2>
          <p className="text-slate-600">Real-time mandi prices across India</p>
        </div>
        <button
          onClick={fetchPrices}
          className="h-12 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Activity size={16} className="text-green-600" />
        <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
        <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse ml-2" />
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {prices.map((item, idx) => (
          <motion.div
            key={item.crop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{item.crop}</h3>
                <p className="text-xs text-slate-500">Volume: {item.volume}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                item.trend === "up" ? "bg-green-100" : "bg-red-100"
              }`}>
                {item.trend === "up" ? (
                  <TrendingUp size={20} className="text-green-600" />
                ) : (
                  <TrendingDown size={20} className="text-red-600" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">₹{item.price}</span>
                <span className="text-sm text-slate-500">/kg</span>
              </div>
              
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                item.change >= 0 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {item.change >= 0 ? "+" : ""}{item.change}%
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <button className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm">
                Source Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Market Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="text-sm text-green-700 font-bold mb-2">Trending Up</div>
          <div className="text-3xl font-black text-green-900">
            {prices.filter(p => p.trend === "up").length}
          </div>
          <div className="text-sm text-green-600 mt-1">Crops gaining value</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
          <div className="text-sm text-red-700 font-bold mb-2">Trending Down</div>
          <div className="text-3xl font-black text-red-900">
            {prices.filter(p => p.trend === "down").length}
          </div>
          <div className="text-sm text-red-600 mt-1">Crops losing value</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-bold mb-2">Avg Change</div>
          <div className="text-3xl font-black text-blue-900">
            +{(prices.reduce((sum, p) => sum + p.change, 0) / prices.length).toFixed(1)}%
          </div>
          <div className="text-sm text-blue-600 mt-1">Market momentum</div>
        </div>
      </div>
    </div>
  );
}
