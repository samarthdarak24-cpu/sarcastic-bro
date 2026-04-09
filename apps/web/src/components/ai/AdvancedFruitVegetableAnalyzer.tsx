'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, CheckCircle, AlertCircle, Camera, Sparkles, Award, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface AdvancedAnalysisResults {
  success: boolean;
  crop: string;
  confidence: number;
  total_items: number;
  good_items: number;
  damaged_items: number;
  average_damage: number;
  grade: string;
  recommendation: string;
  annotated_image?: string;
  items: Array<{
    bbox: number[];
    status: string;
    damage_percent: number;
    grade: string;
    defects: string[];
  }>;
  message?: string;
}

export function AdvancedFruitVegetableAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<AdvancedAnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        console.log('Image loaded as data URL');
        setImagePreview(dataUrl);
      };
      
      reader.onerror = (e) => {
        console.error('FileReader error:', e);
        setError('Failed to read image file');
      };
      
      reader.readAsDataURL(file);
      
      setImage(file);
      setResults(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 10485760 // 10MB
  });

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', image);

      // Call the new Real AI Service endpoint on port 8000
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      console.log('Analysis results:', data);
      setResults(data);
    } catch (err) {
      setError('Failed to analyze image. Make sure the Real AI service is running on port 8000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'from-green-500 to-emerald-600';
      case 'B': return 'from-blue-500 to-cyan-600';
      case 'C': return 'from-yellow-500 to-orange-500';
      case 'D': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'D': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl mb-4 md:mb-6 shadow-2xl">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4">
              Advanced AI Crop Analyzer
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-2">
              Production-Grade Quality Analysis
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Multi-Object Detection</span>
              <span>•</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Real Defect Analysis</span>
              <span>•</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Quality Grading</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 md:space-y-6"
            >
              {!imagePreview ? (
                <div
                  {...getRootProps()}
                  className={`border-4 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-300 hover:border-emerald-400 bg-white'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl font-bold text-gray-700 mb-2">
                    {isDragActive ? 'Drop image here' : 'Upload Image'}
                  </p>
                  <p className="text-gray-500">
                    Drag & drop or click to select
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    PNG, JPG or JPEG (MAX. 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border-4 border-emerald-200">
                  <div className="p-4">
                    <img
                      src={results?.annotated_image || imagePreview || ''}
                      alt="Analysis result"
                      className="w-full h-auto min-h-[400px] max-h-[600px] object-contain rounded-2xl bg-gray-50"
                      onError={(e) => {
                        console.error('Image failed to load:', imagePreview);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        setError('Failed to load image preview. Please try another image.');
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully');
                        setError(null);
                      }}
                    />
                  </div>
                  <button
                    onClick={clearImage}
                    className="absolute top-6 right-6 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-2xl z-10 border-2 border-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}

              {imagePreview && !results && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={analyzeImage}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing with Advanced AI...
                    </>
                  ) : (
                    <>
                      <Camera className="w-6 h-6" />
                      Analyze with AI
                    </>
                  )}
                </motion.button>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 md:space-y-6 max-h-[600px] md:max-h-[800px] overflow-y-auto pr-2 custom-scrollbar"
            >
              <AnimatePresence>
                {results && results.success && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Crop Identification */}
                    <div className={`bg-gradient-to-br ${getGradeColor(results.grade)} rounded-3xl p-6 shadow-2xl text-white`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Award className="w-6 h-6" />
                          <span className="text-sm font-bold opacity-90">IDENTIFIED</span>
                        </div>
                        <div className={`px-4 py-2 rounded-xl font-black text-2xl ${getGradeBadgeColor(results.grade)} border-2`}>
                          GRADE {results.grade}
                        </div>
                      </div>
                      <h2 className="text-4xl font-black mb-2">{results.crop}</h2>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/20 rounded-full h-3">
                          <div
                            className="bg-white h-3 rounded-full transition-all"
                            style={{ width: `${results.confidence}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold">{results.confidence}%</span>
                      </div>
                    </div>

                    {/* Bulk Analysis */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Bulk Analysis
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 p-4 rounded-2xl text-center">
                          <div className="text-3xl font-black text-gray-900">{results.total_items}</div>
                          <div className="text-xs font-bold text-gray-600 mt-1">Total Items</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-2xl text-center border-2 border-green-200">
                          <div className="text-3xl font-black text-green-600">{results.good_items}</div>
                          <div className="text-xs font-bold text-green-700 mt-1">Good</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-2xl text-center border-2 border-red-200">
                          <div className="text-3xl font-black text-red-600">{results.damaged_items}</div>
                          <div className="text-xs font-bold text-red-700 mt-1">Damaged</div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Item Breakdown */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-emerald-100">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-emerald-500" />
                        Item Analysis
                      </h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {results.items.map((item, idx) => (
                          <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${item.status === 'good' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-700">Item #{idx + 1}</span>
                              <span className="text-xs text-gray-500">{item.defects.join(', ') || 'No defects'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded-lg text-xs font-black ${item.status === 'good' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {item.grade} ({item.damage_percent}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quality Summary */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl">
                      <h3 className="text-xl font-black text-gray-900 mb-4">Quality Summary</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                          <span className="font-bold text-gray-700">Average Damage</span>
                          <span className="px-4 py-1 bg-blue-200 text-blue-800 rounded-full font-bold">
                            {results.average_damage}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                          <span className="font-bold text-gray-700">Health Index</span>
                          <span className="text-2xl font-black text-emerald-600">
                            {Math.round(100 - results.average_damage)}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 shadow-xl text-white">
                      <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Recommendation
                      </h3>
                      <p className="text-base font-medium leading-relaxed">{results.recommendation}</p>
                    </div>

                    {/* Advanced Logic Badge */}
                    <div className="bg-gray-900 rounded-3xl p-6 shadow-xl text-white">
                      <h3 className="text-lg font-black mb-2">Real AI Engine Logic</h3>
                      <p className="text-xs font-medium opacity-80 mb-2">Algorithm: 3-Layer Neural Pipeline</p>
                      <div className="grid grid-cols-1 gap-2 text-[10px] font-bold">
                        <div className="bg-white/10 p-2 rounded-lg">LAYER 1: CLIP Zero-Shot ID ({results.confidence}%)</div>
                        <div className="bg-white/10 p-2 rounded-lg">LAYER 2: YOLOv8 Spatial Detection</div>
                        <div className="bg-white/10 p-2 rounded-lg">LAYER 3: Automated Quality Grading ({results.grade})</div>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-yellow-800">
                          This is an AI-based estimation trained on major Indian crop datasets. 
                          Actual quality may vary. Please verify with manual inspection for official trade.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {results && !results.success && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-300 rounded-3xl p-8 text-center"
                  >
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h3 className="text-xl font-black text-red-900 mb-2">Analysis Failed</h3>
                    <p className="text-red-700 font-medium mb-4">{results.message}</p>
                    {results.confidence !== undefined && (
                      <p className="text-sm text-red-600">Confidence: {results.confidence.toFixed(1)}%</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!results && !loading && (
                <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 font-medium">
                    Upload an image to see advanced AI analysis
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Multi-object detection • Real defect analysis • Quality grading
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
