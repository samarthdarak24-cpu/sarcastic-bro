import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const MaintenanceTab: React.FC<{ data: any }> = ({ data }) => {
  const equipment = [
    { name: 'Tractor', health: 85, nextMaintenance: 'May 1, 2026', status: 'good' },
    { name: 'Irrigation System', health: 92, nextMaintenance: 'June 15, 2026', status: 'good' },
    { name: 'Harvester', health: 78, nextMaintenance: 'April 20, 2026', status: 'warning' }
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Equipment Health: 85%</h2>
            <p className="text-blue-100">All systems operational</p>
          </div>
          <Wrench className="w-24 h-24 opacity-50" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {equipment.map((item, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.status === 'good' ? 'bg-green-100' : 'bg-orange-100'}`}>
                  <Wrench className={`w-6 h-6 ${item.status === 'good' ? 'text-green-600' : 'text-orange-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Next maintenance: {item.nextMaintenance}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800 mb-1">{item.health}%</div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'good' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.status === 'good' ? 'Good' : 'Needs Attention'}
                </span>
              </div>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.health}%` }}
                className={`h-full ${item.status === 'good' ? 'bg-green-500' : 'bg-orange-500'}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MaintenanceTab;
