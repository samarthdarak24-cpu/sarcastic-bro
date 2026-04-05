import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const SustainabilityTab: React.FC<{ data: any }> = ({ data }) => {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Sustainability Score: 78</h2>
            <p className="text-green-100">Grade B+ - Excellent Progress</p>
          </div>
          <Award className="w-24 h-24 opacity-50" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Carbon Footprint</h2>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 mb-2">45 tons</div>
            <p className="text-slate-600 mb-4">CO₂ equivalent per year</p>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <TrendingUp className="w-5 h-5 rotate-180" />
              <span className="font-medium">15% reduction from last year</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Certifications</h2>
          <div className="space-y-3">
            {['Organic Certified', 'Fair Trade', 'Rainforest Alliance'].map((cert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-slate-800">{cert}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SustainabilityTab;
