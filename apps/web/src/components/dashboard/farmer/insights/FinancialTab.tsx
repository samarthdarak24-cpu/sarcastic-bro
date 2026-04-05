import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, PieChart, ArrowUpRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface FinancialTabProps {
  data: any;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ data }) => {
  const metrics = [
    { label: 'Total Revenue', value: '₹4,50,000', change: '+15%', trend: 'up', color: 'green' },
    { label: 'Total Expenses', value: '₹2,80,000', change: '-5%', trend: 'down', color: 'red' },
    { label: 'Net Profit', value: '₹1,70,000', change: '+25%', trend: 'up', color: 'blue' },
    { label: 'ROI', value: '60.7%', change: '+8%', trend: 'up', color: 'purple' }
  ];

  const expenses = [
    { category: 'Seeds', amount: 50000, percentage: 18, color: 'blue' },
    { category: 'Fertilizer', amount: 80000, percentage: 29, color: 'green' },
    { category: 'Labor', amount: 100000, percentage: 36, color: 'purple' },
    { category: 'Equipment', amount: 50000, percentage: 18, color: 'orange' }
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
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                <DollarSign className={`w-6 h-6 text-${metric.color}-600`} />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Expense Breakdown</h2>
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{expense.category}</span>
                  <span className="text-sm font-bold text-slate-800">₹{expense.amount.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${expense.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className={`h-full bg-gradient-to-r from-${expense.color}-400 to-${expense.color}-600`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Revenue Forecast</h2>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <p className="text-slate-500">Revenue forecast chart</p>
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp} className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Projected Revenue</h2>
            <p className="text-green-100 mb-4">Next quarter forecast</p>
            <div className="text-4xl font-bold">₹5,20,000</div>
          </div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            <ArrowUpRight className="w-8 h-8" />
            +15.6%
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinancialTab;
