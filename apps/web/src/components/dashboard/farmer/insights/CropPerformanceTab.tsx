import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Award, AlertCircle, Sprout } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface CropPerformanceTabProps {
  data: any;
}

const CropPerformanceTab: React.FC<CropPerformanceTabProps> = ({ data }) => {
  const metrics = [
    { label: 'Current Yield', value: '12.5 tons', icon: Sprout, color: 'green' },
    { label: 'Predicted Yield', value: '14.2 tons', icon: TrendingUp, color: 'blue' },
    { label: 'Health Score', value: '92%', icon: Award, color: 'purple' },
    { label: 'Growth Stage', value: 'Flowering', icon: Target, color: 'emerald' }
  ];

  const growthStages = [
    { stage: 'Germination', status: 'completed', date: '2026-02-15' },
    { stage: 'Vegetative', status: 'completed', date: '2026-03-01' },
    { stage: 'Flowering', status: 'active', date: '2026-03-20' },
    { stage: 'Fruiting', status: 'upcoming', date: '2026-04-15' },
    { stage: 'Harvest', status: 'upcoming', date: '2026-05-15' }
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
          >
            <div className={`p-3 rounded-xl bg-${metric.color}-100 w-fit mb-4`}>
              <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</h3>
            <p className="text-sm text-slate-600">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Growth Timeline</h2>
          <div className="space-y-4">
            {growthStages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stage.status === 'completed' ? 'bg-green-100 text-green-600' :
                  stage.status === 'active' ? 'bg-blue-100 text-blue-600' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {stage.status === 'completed' ? '✓' : index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{stage.stage}</h3>
                  <p className="text-sm text-slate-500">{stage.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  stage.status === 'completed' ? 'bg-green-100 text-green-700' :
                  stage.status === 'active' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {stage.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Yield Prediction</h2>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <p className="text-slate-500">Yield prediction chart</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CropPerformanceTab;
