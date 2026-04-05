import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap, Target } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface OverviewTabProps {
  data: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
  const metrics = [
    {
      label: 'Overall Farm Health',
      value: '87%',
      change: '+5%',
      trend: 'up',
      color: 'green',
      icon: CheckCircle
    },
    {
      label: 'Predicted Yield',
      value: '12.5 tons',
      change: '+12%',
      trend: 'up',
      color: 'blue',
      icon: TrendingUp
    },
    {
      label: 'Resource Efficiency',
      value: '92%',
      change: '+3%',
      trend: 'up',
      color: 'purple',
      icon: Zap
    },
    {
      label: 'Risk Level',
      value: 'Low',
      change: '-15%',
      trend: 'down',
      color: 'emerald',
      icon: Target
    }
  ];

  const alerts = [
    { type: 'warning', message: 'Heavy rainfall expected in 48 hours', priority: 'high' },
    { type: 'info', message: 'Optimal harvest window: 5-7 days', priority: 'medium' },
    { type: 'success', message: 'Soil nitrogen levels improved', priority: 'low' }
  ];

  const insights = [
    {
      title: 'Irrigation Optimization',
      description: 'Reduce water usage by 15% with smart scheduling',
      impact: 'High',
      savings: '₹12,000/month'
    },
    {
      title: 'Pest Prevention',
      description: 'Early treatment can prevent 80% crop damage',
      impact: 'Critical',
      savings: '₹45,000'
    },
    {
      title: 'Market Timing',
      description: 'Prices expected to rise 8% in next 2 weeks',
      impact: 'Medium',
      savings: '₹25,000'
    }
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {metric.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</h3>
            <p className="text-sm text-slate-600">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerts & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Active Alerts
            </h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {alerts.length} Active
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.type === 'warning'
                    ? 'bg-orange-50 border-orange-500'
                    : alert.type === 'info'
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-slate-700 flex-1">{alert.message}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : alert.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              AI Recommendations
            </h2>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              Smart Insights
            </span>
          </div>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">{insight.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    insight.impact === 'Critical'
                      ? 'bg-red-100 text-red-700'
                      : insight.impact === 'High'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {insight.impact}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Potential Savings</span>
                  <span className="text-sm font-bold text-green-600">{insight.savings}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-6">Farm Performance Trends</h2>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <p className="text-slate-500">Chart visualization will render here</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverviewTab;
