import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, Target } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const BenchmarkingTab: React.FC<{ data: any }> = ({ data }) => {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Ranking: #12 of 150</h2>
            <p className="text-purple-100">Top 8% in your region</p>
          </div>
          <Trophy className="w-24 h-24 opacity-50" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Your Score', value: '87', icon: Target, color: 'green' },
          { label: 'Regional Average', value: '72', icon: Users, color: 'blue' },
          { label: 'Top Performer', value: '95', icon: Trophy, color: 'purple' }
        ].map((metric, index) => (
          <motion.div key={index} variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
            <div className={`p-3 rounded-xl bg-${metric.color}-100 w-fit mx-auto mb-4`}>
              <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
            </div>
            <h3 className="text-4xl font-bold text-slate-800 mb-2">{metric.value}</h3>
            <p className="text-sm text-slate-600">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Performance Comparison</h2>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
          <p className="text-slate-500">Comparative performance chart</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BenchmarkingTab;
