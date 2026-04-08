"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3 } from "lucide-react";

export default function ProfitTracker() {
  const profitData = {
    totalSavings: 180000,
    monthlySpend: 850000,
    savingsPercentage: 21.2,
    roi: 156,
    costReduction: 45000
  };

  const savingsBreakdown = [
    { category: "Price Negotiation", amount: 72000, percentage: 40, color: "blue" },
    { category: "Bulk Discounts", amount: 45000, percentage: 25, color: "green" },
    { category: "Supplier Optimization", amount: 36000, percentage: 20, color: "purple" },
    { category: "Quality Upgrades", amount: 27000, percentage: 15, color: "amber" }
  ];

  const monthlyTrend = [
    { month: "Jan", savings: 145000, spend: 920000 },
    { month: "Feb", savings: 162000, spend: 880000 },
    { month: "Mar", savings: 180000, spend: 850000 }
  ];

  const topSavingActions = [
    {
      action: "Switched to Maharashtra suppliers",
      savings: 28000,
      date: "Mar 15, 2026",
      impact: "High"
    },
    {
      action: "Bulk order consolidation",
      savings: 18000,
      date: "Mar 12, 2026",
      impact: "High"
    },
    {
      action: "Pre-booking wheat harvest",
      savings: 15000,
      date: "Mar 8, 2026",
      impact: "Medium"
    },
    {
      action: "Negotiated better rates",
      savings: 12000,
      date: "Mar 5, 2026",
      impact: "Medium"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">💰 Profit Tracker</h2>
        <p className="text-slate-600">Track savings, ROI, and cost optimization</p>
      </div>

      {/* Main Profit Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
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
              <h3 className="text-2xl font-black mb-2">Total Savings This Month</h3>
              <p className="text-green-100">Your procurement efficiency gains</p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <DollarSign size={32} />
            </div>
          </div>

          <div className="text-7xl font-black mb-6">₹{(profitData.totalSavings / 1000).toFixed(0)}K</div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-sm text-green-100 mb-1">Savings %</div>
              <div className="text-2xl font-black">{profitData.savingsPercentage}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-sm text-green-100 mb-1">ROI</div>
              <div className="text-2xl font-black">{profitData.roi}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-sm text-green-100 mb-1">Cost Cut</div>
              <div className="text-2xl font-black">₹{(profitData.costReduction / 1000).toFixed(0)}K</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Savings Breakdown */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <PieChart size={24} className="text-blue-600" />
          <h3 className="text-2xl font-black text-slate-900">Savings Breakdown</h3>
        </div>

        <div className="space-y-4">
          {savingsBreakdown.map((item, idx) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{item.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">{item.percentage}%</span>
                  <span className="font-black text-slate-900">₹{(item.amount / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`h-full bg-gradient-to-r ${
                    item.color === "blue" ? "from-blue-500 to-cyan-500" :
                    item.color === "green" ? "from-green-500 to-emerald-500" :
                    item.color === "purple" ? "from-purple-500 to-pink-500" :
                    "from-amber-500 to-orange-500"
                  } rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 size={24} className="text-purple-600" />
          <h3 className="text-2xl font-black text-slate-900">Monthly Trend</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {monthlyTrend.map((month, idx) => (
            <motion.div
              key={month.month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4"
            >
              <div className="text-sm text-slate-600 font-bold mb-2">{month.month}</div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-green-700 font-bold mb-1">Savings</div>
                  <div className="text-xl font-black text-green-900">₹{(month.savings / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-xs text-blue-700 font-bold mb-1">Spend</div>
                  <div className="text-xl font-black text-blue-900">₹{(month.spend / 1000).toFixed(0)}K</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Saving Actions */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">Top Saving Actions</h3>
        <div className="space-y-3">
          {topSavingActions.map((action, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-green-500 hover:shadow-lg transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">{action.action}</h4>
                  <p className="text-sm text-slate-600">{action.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  action.impact === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {action.impact}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-green-600">+₹{(action.savings / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-slate-500">Saved</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Projection Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <TrendingUp size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">Annual Projection</h3>
              <p className="text-blue-100">Based on current savings rate</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black">₹2.16M</div>
            <div className="text-sm text-blue-100">Estimated yearly savings</div>
          </div>
        </div>
      </div>
    </div>
  );
}
