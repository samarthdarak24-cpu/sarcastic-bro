'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Sparkles, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIQualityShieldPremium() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock result
    const mockResult = {
      grade: ['A', 'A+', 'B', 'B+'][Math.floor(Math.random() * 4)],
      score: Math.floor(Math.random() * 20) + 80,
      defects: Math.floor(Math.random() * 5),
      freshness: Math.floor(Math.random() * 15) + 85,
      color: Math.floor(Math.random() * 10) + 90,
      size: Math.floor(Math.random() * 15) + 85,
    };
    
    setResult(mockResult);
    setAnalyzing(false);
    toast.success('Analysis complete!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black">AI Quality Certification</h1>
              <p className="text-cyan-100 font-medium">Upload crop images for instant AI analysis</p>
            </div>
          </div>
        </div>
        
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' as any }}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <Upload className="text-cyan-600" size={28} />
            Upload Crop Image
          </h2>

          {/* Image Preview */}
          <div className="mb-6">
            {selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200">
                <img src={selectedImage} alt="Crop" className="w-full h-64 object-cover" />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                  }}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-cyan-500 hover:bg-cyan-50/50 transition-all">
                <ImageIcon size={48} className="text-slate-400 mb-3" />
                <p className="text-slate-600 font-semibold mb-2">Click to upload image</p>
                <p className="text-sm text-slate-400">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Analyze Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzeImage}
            disabled={!selectedImage || analyzing}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
          >
            {analyzing ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Analyze Quality
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={28} />
            Analysis Results
          </h2>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Grade Badge */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
                  <p className="text-sm font-bold mb-2 opacity-90">Quality Grade</p>
                  <p className="text-6xl font-black">{result.grade}</p>
                  <p className="text-sm font-semibold mt-2 opacity-90">Overall Score: {result.score}/100</p>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <MetricBar label="Freshness" value={result.freshness} color="from-green-500 to-emerald-600" />
                  <MetricBar label="Color Quality" value={result.color} color="from-blue-500 to-cyan-600" />
                  <MetricBar label="Size Uniformity" value={result.size} color="from-purple-500 to-indigo-600" />
                </div>

                {/* Defects */}
                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="text-orange-500" size={24} />
                    <span className="font-bold text-slate-700">Defects Detected</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">{result.defects}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={40} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-semibold">Upload and analyze an image to see results</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="text-sm font-black text-slate-900">{value}%</span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' as any }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  );
}
