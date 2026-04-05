import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Users } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const MarketTab: React.FC<{ data: any }> = ({ data }) => {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current Price', value: '₹2,500/kg', change: '+8%', icon: TrendingUp, color: 'green' },
          { label: 'Demand Level', value: 'High', change: '+12%', icon: Target, color: 'blue' },
          { label: 'Competitors', value: '45', change: '-3%', icon: Users, color: 'purple' },
          { label: 'Market Share', value: '12%', change: '+2%', icon: TrendingUp, color: 'emerald' }
        ].map((metric, index) => (
          <motion.div key={index} variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className={`p-3 rounded-xl bg-${metric.color}-100 w-fit mb-4`}>
              <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</h3>
            <p className="text-sm text-slate-600">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeInUp} className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Optimal Selling Time</h2>
            <p className="text-green-100 mb-4">AI predicts 8% price increase in 2 weeks</p>
            <div className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              <span>April 20, 2026</span>
            </div>
          </div>
          <div className="text-5xl font-bold">+8%</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MarketTab;
