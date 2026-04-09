'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, CheckCircle, AlertCircle, Camera, Sparkles } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface AnalysisResults {
  item_name: string;
  confidence: number;
  detection: {
    objects: Array<{
      class: string;
      confidence: number;
      bbox: number[];
    }>;
    count: number;
  };
  classification: {
    category: string;
    confidence: number;
  };
  quality: {
    score: number;
    freshness: 'fresh' | 'moderate' | 'stale';
    overall_score: number;
  };
  damage_analysis: {
    damage_detected: boolean;
    damage_level: string;
    condition: string;
    damage_score: number;
    good_area_percentage: number;
    damaged_area_percentage: number;
    damage_spots: Array<{
      type: string;
      severity: string;
      location: number[];
      area_pixels: number;
    }>;
    total_damage_spots: number;
    analysis: {
      bruises: number;
      rot_areas: number;
      texture_quality: string;
    };
  };
  recommendation: string;
  summary: {
    item: string;
    condition: string;
    freshness: string;
    good_area: string;
    damaged_area: string;
    total_spots: number;
  };
}

export function FruitVegetableAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      
      // Use FileReader to read the file as data URL
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

      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to analyze image. Make sure the AI service is running.');
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

  const getDamageLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'fresh': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'stale': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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
            AI Fruit & Vegetable Analyzer
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Powered by <span className="font-bold text-emerald-600">YOLOv8</span> & <span className="font-bold text-blue-600">EfficientNet</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
                    src={imagePreview || ''}
                    alt="Uploaded preview"
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
                    Analyze Image
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
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6 max-h-[600px] md:max-h-[800px] overflow-y-auto pr-2 custom-scrollbar"
          >
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Item Identification */}
                  <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-3xl p-8 shadow-2xl text-white">
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      Identified Item
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-black">
                          {results.item_name}
                        </span>
                        <span className="text-xl font-bold bg-white/20 px-4 py-2 rounded-xl">
                          {results.confidence}%
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                          className="bg-white h-3 rounded-full transition-all"
                          style={{ width: `${results.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Damage Analysis */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">
                      🔍 Damage Analysis
                    </h3>
                    
                    {/* Condition Badge */}
                    <div className={`mb-6 p-4 rounded-2xl border-2 ${getDamageLevelColor(results.damage_analysis.damage_level)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold">Condition:</span>
                        <span className="text-2xl font-black uppercase">
                          {results.damage_analysis.damage_level}
                        </span>
                      </div>
                      <p className="text-sm font-medium opacity-80">
                        {results.damage_analysis.condition}
                      </p>
                    </div>

                    {/* Good vs Damaged Areas */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-200">
                        <div className="text-sm font-bold text-green-700 mb-1">Good Area</div>
                        <div className="text-3xl font-black text-green-600">
                          {results.damage_analysis.good_area_percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                        <div className="text-sm font-bold text-red-700 mb-1">Damaged Area</div>
                        <div className="text-3xl font-black text-red-600">
                          {results.damage_analysis.damaged_area_percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Damage Spots */}
                    {results.damage_analysis.damage_detected && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-700">Damage Spots Found:</span>
                          <span className="text-xl font-black text-red-600">
                            {results.damage_analysis.total_damage_spots}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                            <div className="text-xs font-bold text-orange-700">Bruises</div>
                            <div className="text-2xl font-black text-orange-600">
                              {results.damage_analysis.analysis.bruises}
                            </div>
                          </div>
                          <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                            <div className="text-xs font-bold text-red-700">Rot Areas</div>
                            <div className="text-2xl font-black text-red-600">
                              {results.damage_analysis.analysis.rot_areas}
                            </div>
                          </div>
                        </div>

                        {/* Damage Spot Details */}
                        {results.damage_analysis.damage_spots.length > 0 && (
                          <div className="mt-4">
                            <div className="text-sm font-bold text-gray-700 mb-2">Spot Details:</div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {results.damage_analysis.damage_spots.map((spot, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                                  <span className="font-medium capitalize">{spot.type}</span>
                                  <span className={`px-2 py-1 rounded font-bold text-xs ${
                                    spot.severity === 'severe' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {spot.severity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!results.damage_analysis.damage_detected && (
                      <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-200 text-center">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                        <p className="text-green-700 font-bold">No damage detected!</p>
                        <p className="text-green-600 text-sm">This item is in excellent condition</p>
                      </div>
                    )}
                  </div>

                  {/* Quality Assessment */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl">
                    <h3 className="text-2xl font-black text-gray-900 mb-4">
                      ⭐ Quality Assessment
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-bold">Freshness:</span>
                        <span className={`px-4 py-2 rounded-xl font-bold ${getFreshnessColor(results.quality.freshness)}`}>
                          {results.quality.freshness.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-bold">Overall Score:</span>
                        <span className="text-2xl font-black text-blue-600">
                          {results.quality.overall_score.toFixed(1)}/100
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-bold">Texture:</span>
                        <span className="text-sm font-bold text-gray-600 capitalize">
                          {results.damage_analysis.analysis.texture_quality}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 shadow-xl text-white">
                    <h3 className="text-xl font-black mb-2">💡 Recommendation</h3>
                    <p className="text-lg font-medium">{results.recommendation}</p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-gray-900 rounded-3xl p-6 shadow-xl text-white">
                    <h3 className="text-xl font-black mb-4">📊 Summary</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400 font-medium">Item</div>
                        <div className="font-bold">{results.summary.item}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 font-medium">Condition</div>
                        <div className="font-bold capitalize">{results.summary.condition}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 font-medium">Good Area</div>
                        <div className="font-bold text-green-400">{results.summary.good_area}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 font-medium">Damaged Area</div>
                        <div className="font-bold text-red-400">{results.summary.damaged_area}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!results && !loading && (
              <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 font-medium">
                  Upload an image to see AI analysis results
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
