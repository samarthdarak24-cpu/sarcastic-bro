"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radar, TrendingUp, Activity, Zap, Target } from "lucide-react";

export default function NeuralMarketRadar() {
  const [confidence, setConfidence] = useState(92);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence(prev => Math.min(100, Math.max(85, prev + (Math.random() - 0.5) * 3)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  const radarData = {
    alphaClusters: 14,
    priceDelta: -8.2,
    vibeScore: "Optimal",
    marketMomentum: 87,
    liquidityIndex: 94,
    volatilityScore: 23
  };

  const clusters = [
    { name: "Maharashtra West", score: 95, suppliers: 12, trend: "up" },
    { name: "Punjab North", score: 88, suppliers: 8, trend: "up" },
    { name: "Karnataka South", score: 82, suppliers: 15, trend: "stable" },
    { name: "UP Central", score: 76, suppliers: 10, trend: "down" },
    { name: "Gujarat West", score: 91, suppliers: 9, trend: "up" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">🎯 Neural Market Radar</h2>
          <p className="text-slate-600">AI-powered market intelligence and trend analysis</p>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Radar size={18} className={scanning ? "animate-spin" : ""} />
          {scanning ? "Scanning..." : "Deep Scan"}
        </button>
      </div>

      {/* Confidence Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black mb-2">Market Confidence</h3>
              <p className="text-blue-100">Subcontinental liquidity scan · Active</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold">LIVE</span>
            </div>
          </div>

          <div className="text-7xl font-black mb-4">{confidence}%</div>
          
          <div className="h-4 bg-white/20 rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Alpha Clusters</div>
              <div className="text-2xl font-black">{radarData.alphaClusters}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Price Delta</div>
              <div className="text-2xl font-black text-green-300">{radarData.priceDelta}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Vibe Score</div>
              <div className="text-2xl font-black">{radarData.vibeScore}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Activity size={24} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600 font-bold">Market Momentum</div>
              <div className="text-2xl font-black text-slate-900">{radarData.marketMomentum}%</div>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${radarData.marketMomentum}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600 font-bold">Liquidity Index</div>
              <div className="text-2xl font-black text-slate-900">{radarData.liquidityIndex}%</div>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 rounded-full" style={{ width: `${radarData.liquidityIndex}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Zap size={24} className="text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600 font-bold">Volatility Score</div>
              <div className="text-2xl font-black text-slate-900">{radarData.volatilityScore}%</div>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full" style={{ width: `${radarData.volatilityScore}%` }} />
          </div>
        </div>
      </div>

      {/* Regional Clusters */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">Regional Clusters</h3>
        <div className="space-y-3">
          {clusters.map((cluster, idx) => (
            <motion.div
              key={cluster.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  cluster.trend === "up" ? "bg-green-100" : cluster.trend === "down" ? "bg-red-100" : "bg-slate-100"
                }`}>
                  <Target size={24} className={
                    cluster.trend === "up" ? "text-green-600" : cluster.trend === "down" ? "text-red-600" : "text-slate-600"
                  } />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">{cluster.name}</h4>
                  <p className="text-sm text-slate-600">{cluster.suppliers} active suppliers</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">{cluster.score}</div>
                  <div className="text-xs text-slate-500">Score</div>
                </div>
                <button className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all">
                  Explore
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
