import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Camera, Upload, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface PestDetectionTabProps {
  data: any;
}

const PestDetectionTab: React.FC<PestDetectionTabProps> = ({ data }) => {
  const [scanning, setScanning] = useState(false);

  const handleImageUpload = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Pest Risk: Low</h2>
            <p className="text-green-100">Your crops are healthy and protected</p>
          </div>
          <Shield className="w-24 h-24 opacity-50" />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">AI Pest Detection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
            <Camera className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="font-semibold text-slate-800 mb-2">Take Photo</h3>
            <p className="text-sm text-slate-600 mb-4">Use camera to scan crops</p>
            <button className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
              Open Camera
            </button>
          </div>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="font-semibold text-slate-800 mb-2">Upload Image</h3>
            <p className="text-sm text-slate-600 mb-4">Upload existing photos</p>
            <button onClick={handleImageUpload} className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
              Choose File
            </button>
          </div>
        </div>
      </motion.div>

      {scanning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <p className="text-blue-800 font-medium">Analyzing image with AI...</p>
          </div>
        </motion.div>
      )}

      <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Scans</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-200"
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">No pests detected</h3>
                <p className="text-sm text-slate-600">Scanned 2 hours ago</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Healthy
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PestDetectionTab;
