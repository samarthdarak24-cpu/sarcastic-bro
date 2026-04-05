import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Zap, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface SoilHealthTabProps {
  data: any;
}

const SoilHealthTab: React.FC<SoilHealthTabProps> = ({ data }) => {
  const [selectedField, setSelectedField] = useState('field-1');

  const soilMetrics = [
    { label: 'Nitrogen (N)', value: 245, unit: 'kg/ha', optimal: [200, 300], status: 'good', color: 'green' },
    { label: 'Phosphorus (P)', value: 45, unit: 'kg/ha', optimal: [40, 60], status: 'good', color: 'blue' },
    { label: 'Potassium (K)', value: 180, unit: 'kg/ha', optimal: [150, 200], status: 'good', color: 'purple' },
    { label: 'pH Level', value: 6.8, unit: '', optimal: [6.0, 7.5], status: 'good', color: 'emerald' },
    { label: 'Organic Matter', value: 3.2, unit: '%', optimal: [2.5, 4.0], status: 'good', color: 'amber' },
    { label: 'Moisture', value: 68, unit: '%', optimal: [60, 80], status: 'good', color: 'cyan' }
  ];

  const recommendations = [
    {
      title: 'Apply Nitrogen Fertilizer',
      description: 'Add 50 kg/ha of urea to maintain optimal nitrogen levels',
      priority: 'medium',
      cost: '₹3,500',
      impact: '+8% yield'
    },
    {
      title: 'Increase Organic Matter',
      description: 'Add compost or green manure to improve soil structure',
      priority: 'low',
      cost: '₹2,000',
      impact: '+5% water retention'
    },
    {
      title: 'pH Adjustment',
      description: 'Soil pH is optimal, maintain current practices',
      priority: 'info',
      cost: '₹0',
      impact: 'Stable'
    }
  ];

  const fields = [
    { id: 'field-1', name: 'North Field', area: '5 acres', health: 87 },
    { id: 'field-2', name: 'South Field', area: '3 acres', health: 92 },
    { id: 'field-3', name: 'East Field', area: '4 acres', health: 78 }
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Field Selector */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Select Field</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fields.map((field) => (
            <motion.button
              key={field.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedField(field.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedField === field.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">{field.name}</h3>
                <span className="text-xs text-slate-500">{field.area}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${field.health}%` }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
                <span className="text-sm font-medium text-green-600">{field.health}%</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* NPK Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {soilMetrics.map((metric, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                <Leaf className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
              {metric.status === 'good' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">{metric.label}</h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-slate-800">{metric.value}</span>
              <span className="text-sm text-slate-500">{metric.unit}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Optimal Range</span>
                <span>{metric.optimal[0]} - {metric.optimal[1]} {metric.unit}</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.value / metric.optimal[1]) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Soil Analysis Chart */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Soil Composition Analysis</h2>
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors text-sm font-medium">
            View History
          </button>
        </div>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <p className="text-slate-500">Interactive soil composition chart</p>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          AI-Powered Recommendations
        </h2>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-green-50 border border-slate-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-800">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : rec.priority === 'medium'
                        ? 'bg-orange-100 text-orange-700'
                        : rec.priority === 'low'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Cost:</span>
                      <span className="text-sm font-semibold text-slate-700">{rec.cost}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Impact:</span>
                      <span className="text-sm font-semibold text-green-600">{rec.impact}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Soil Health Score */}
      <motion.div
        variants={fadeInUp}
        className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Overall Soil Health Score</h2>
            <p className="text-green-100">Based on comprehensive analysis of all parameters</p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">87</div>
            <div className="text-green-100">Excellent</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SoilHealthTab;
