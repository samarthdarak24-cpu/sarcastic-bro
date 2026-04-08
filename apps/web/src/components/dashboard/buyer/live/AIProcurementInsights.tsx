"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Target, Zap, Brain, Lightbulb } from "lucide-react";

export default function AIProcurementInsights() {
  const insights = [
    {
      id: "1",
      type: "opportunity",
      title: "Price Optimization Opportunity",
      description: "Switch to Maharashtra suppliers for Tomatoes to save ₹12,000 (8% reduction)",
      impact: "High",
      savings: "₹12,000",
      confidence: 94,
      action: "Review Suppliers"
    },
    {
      id: "2",
      type: "trend",
      title: "Seasonal Demand Forecast",
      description: "Wheat prices expected to rise 12% in next 2 weeks. Consider pre-booking.",
      impact: "Medium",
      savings: "₹8,500",
      confidence: 87,
      action: "Pre-Book Now"
    },
    {
      id: "3",
      type: "quality",
      title: "Quality Upgrade Available",
      description: "Premium Grade A Rice available at only 5% premium from verified supplier",
      impact: "Medium",
      savings: "Quality+",
      confidence: 91,
      action: "View Options"
    },
    {
      id: "4",
      type: "efficiency",
      title: "Bulk Order Consolidation",
      description: "Combine 3 pending orders to unlock 15% volume discount",
      impact: "High",
      savings: "₹18,000",
      confidence: 96,
      action: "Consolidate"
    }
  ];

  const recommendations = [
    {
      title: "Optimal Sourcing Time",
      value: "Next 48 hours",
      description: "Market conditions favorable for bulk procurement",
      icon: Target
    },
    {
      title: "Best Performing Supplier",
      value: "Ramesh Yadav Group",
      description: "98% on-time delivery, Grade A quality",
      icon: TrendingUp
    },
    {
      title: "Cost Reduction Potential",
      value: "₹45,000/month",
      description: "By implementing AI recommendations",
      icon: Zap
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "red";
      case "Medium": return "amber";
      case "Low": return "green";
      default: return "slate";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">🤖 AI Procurement Insights</h2>
        <p className="text-slate-600">Smart recommendations powered by machine learning</p>
      </div>

      {/* AI Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
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
              <h3 className="text-2xl font-black mb-2">AI Procurement Score</h3>
              <p className="text-purple-100">Your procurement efficiency rating</p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Brain size={32} />
            </div>
          </div>

          <div className="text-7xl font-black mb-4">92/100</div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-sm text-purple-100 mb-1">Cost Efficiency</div>
              <div className="text-2xl font-black">95%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-sm text-purple-100 mb-1">Quality Score</div>
              <div className="text-2xl font-black">88%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-sm text-purple-100 mb-1">Speed</div>
              <div className="text-2xl font-black">93%</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <rec.icon size={24} className="text-blue-600" />
            </div>
            <div className="text-sm text-slate-600 font-bold mb-2">{rec.title}</div>
            <div className="text-2xl font-black text-slate-900 mb-2">{rec.value}</div>
            <p className="text-sm text-slate-600">{rec.description}</p>
          </motion.div>
        ))}
      </div>

      {/* AI Insights List */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">Smart Recommendations</h3>
        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={28} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-slate-600">{insight.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-${getImpactColor(insight.impact)}-100 text-${getImpactColor(insight.impact)}-700`}>
                      {insight.impact} Impact
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 mt-4 mb-4">
                    <div className="bg-green-50 px-4 py-2 rounded-lg">
                      <div className="text-xs text-green-700 font-bold mb-1">Potential Savings</div>
                      <div className="text-lg font-black text-green-900">{insight.savings}</div>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                      <div className="text-xs text-blue-700 font-bold mb-1">AI Confidence</div>
                      <div className="text-lg font-black text-blue-900">{insight.confidence}%</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="h-10 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                    {insight.action} →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Learning Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Lightbulb size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">AI is Learning Your Patterns</h3>
              <p className="text-blue-100">Recommendations improve as you use the platform</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">2,847</div>
            <div className="text-sm text-blue-100">Data Points Analyzed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
