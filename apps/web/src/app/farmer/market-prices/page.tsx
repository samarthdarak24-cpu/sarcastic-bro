'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarketPrices } from '../../../hooks/useMarketPrices';
import { PriceCard } from '../../../components/market/PriceCard';
import { PriceChart } from '../../../components/market/PriceChart';
import { RecommendationCard } from '../../../components/market/RecommendationCard';

export default function FarmerMarketPrices() {
  const router = useRouter();
  const [selectedCrop, setSelectedCrop] = useState('Onion');
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');
  const [timePeriod, setTimePeriod] = useState<'7' | '30'>('30');

  const {
    prices,
    trends,
    recommendation,
    crops,
    districts,
    loading,
    error,
    refresh
  } = useMarketPrices(selectedCrop, selectedDistrict);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Derive stats from latest prices
  const latestPrice = prices[0];
  const minPrice = latestPrice?.minPrice ?? 0;
  const maxPrice = latestPrice?.maxPrice ?? 0;
  const modalPrice = latestPrice?.modalPrice ?? 0;

  // Loading state
  if (loading && prices.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-500 tracking-wide">Loading Market Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/farmer/dashboard')}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Market Prices</h1>
                <p className="text-xs font-medium text-gray-400 tracking-wider uppercase">Real-time Mandi Transparency Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-700">Live Sync</span>
              </span>
              <button
                onClick={refresh}
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all active:scale-95"
                title="Refresh"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ─── SEARCH FILTERS ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Crop Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Crop</label>
              <div className="relative">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all cursor-pointer"
                >
                  {(crops.length > 0 ? crops : ['Onion', 'Tomato', 'Soybean']).map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* District Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select District</label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all cursor-pointer"
                >
                  {(districts.length > 0 ? districts : ['Nashik', 'Pune', 'Latur']).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Time Period Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Time Period</label>
              <div className="flex bg-gray-50 rounded-2xl border border-gray-200 p-1">
                <button
                  onClick={() => setTimePeriod('7')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                    timePeriod === '7'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimePeriod('30')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                    timePeriod === '30'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── PRICE CARDS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PriceCard
            label="Minimum Price"
            price={minPrice}
            color="green"
            trend={modalPrice > minPrice ? 'up' : 'neutral'}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            }
          />
          <PriceCard
            label="Maximum Price"
            price={maxPrice}
            color="blue"
            trend={maxPrice > modalPrice ? 'up' : 'neutral'}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            }
          />
          <PriceCard
            label="Modal Price"
            price={modalPrice}
            color="amber"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* ─── TREND CHART ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900">Price Trend</h3>
              <p className="text-xs text-gray-400 mt-1">
                {selectedCrop} — {selectedDistrict} · Last {timePeriod} days
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full bg-blue-600" /> Modal
              </span>
            </div>
          </div>

          {trends.length > 0 ? (
            <div className="h-[400px]">
              <PriceChart data={trends} crop={selectedCrop} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="font-semibold">No trend data available</p>
              <p className="text-xs mt-1">Try changing crop or district</p>
            </div>
          )}
        </motion.div>

        {/* ─── AI RECOMMENDATION ─── */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RecommendationCard recommendation={recommendation} />
          </motion.div>
        )}

        {/* ─── RECENT ARRIVALS TABLE ─── */}
        {prices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 md:px-8 py-5 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900">Recent Arrivals</h3>
              <p className="text-xs text-gray-400 mt-0.5">Detailed price records from recent mandi arrivals</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Variety</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Min ₹</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Max ₹</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Modal ₹</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Qty (T)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {prices.slice(0, 10).map((p, i) => (
                    <tr key={p.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{p.variety}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{p.minPrice}</td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600">₹{p.maxPrice}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-blue-700">₹{p.modalPrice}</td>
                      <td className="px-6 py-4 text-right text-gray-500">{p.arrivalQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ─── ERROR STATE ─── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl p-4 text-sm font-medium flex items-center gap-3"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
