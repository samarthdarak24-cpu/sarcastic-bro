import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Zap, Gauge, Lightbulb } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const ResourcesTab: React.FC<{ data: any }> = ({ data }) => {
  const resources = [
    { label: 'Water Usage', value: '15,000 L', efficiency: 92, icon: Droplets, color: 'blue' },
    { label: 'Energy Consumption', value: '2,500 kWh', efficiency: 88, icon: Zap, color: 'yellow' },
    { label: 'Fuel Usage', value: '450 L', efficiency: 85, icon: Gauge, color: 'orange' }
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <motion.div key={index} variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className={`p-3 rounded-xl bg-${resource.color}-100 w-fit mb-4`}>
              <resource.icon className={`w-6 h-6 text-${resource.color}-600`} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{resource.value}</h3>
            <p className="text-sm text-slate-600 mb-3">{resource.label}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${resource.efficiency}%` }} className={`h-full bg-${resource.color}-500`} />
              </div>
              <span className="text-sm font-medium text-slate-700">{resource.efficiency}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeInUp} className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4">
          <Lightbulb className="w-12 h-12" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Potential Savings: ₹12,000/month</h2>
            <p className="text-purple-100">Implement smart irrigation to reduce water usage by 15%</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResourcesTab;
