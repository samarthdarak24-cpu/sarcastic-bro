'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Camera, Upload, Sparkles, CheckCircle, AlertCircle, Loader2, 
  Image as ImageIcon, History, Award, Download, TrendingUp, BarChart3 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface QualityResult {
  grade: string;
  score: number;
  defects: number;
  freshness: number;
  color: number;
  size: number;
  recommendations?: string[];
}

interface QualityScan {
  id: string;
  imageUrl: string;
  grade: string;
  score: number;
  defects: number;
  freshness: number;
  color: number;
  size: number;
  createdAt: string;
  product?: {
    name: string;
    category: string;
  };
}

export default function AIQualityShieldComplete() {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<QualityResult | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'stats'>('scan');
  const [history, setHistory] = useState<QualityScan[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/farmer/quality/history?page=1&limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.data?.scans || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/farmer/quality/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }

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
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login first');
        setAnalyzing(false);
        return;
      }

      console.log('Sending analysis request...');
      const response = await fetch('http://localhost:3001/api/farmer/quality/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: selectedImage })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Analysis failed');
      }

      const analysisResult = data.data;
      setResult(analysisResult);
      toast.success('Analysis complete!');

      // Auto-save the scan
      await saveQualityScan(analysisResult);
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const saveQualityScan = async (analysisResult: QualityResult) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/farmer/quality/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: selectedImage,
          grade: analysisResult.grade,
          score: analysisResult.score,
          defects: analysisResult.defects,
          freshness: analysisResult.freshness,
          color: analysisResult.color,
          size: analysisResult.size
        })
      });
    } catch (error) {
      console.error('Failed to save scan:', error);
    }
  };

  const downloadCertificate = () => {
    if (!result) return;
    
    toast.success('Certificate download feature coming soon!');
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black">{t('aiQuality.title')}</h1>
                <p className="text-cyan-100 font-medium">{t('aiQuality.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'scan'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Camera size={20} />
          {t('aiQuality.newScan')}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <History size={20} />
          {t('aiQuality.history')}
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'stats'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BarChart3 size={20} />
          Statistics
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Upload Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Upload className="text-cyan-600" size={28} />
                Upload Crop Image
              </h2>

              <div className="mb-6">
                {selectedImage ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200">
                    <img src={selectedImage} alt="Crop" className="w-full h-64 object-cover" />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setResult(null);
                      }}
                      className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center font-bold"
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
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200">
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
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
                      <p className="text-sm font-bold mb-2 opacity-90">Quality Grade</p>
                      <p className="text-6xl font-black">{result.grade}</p>
                      <p className="text-sm font-semibold mt-2 opacity-90">Overall Score: {result.score}/100</p>
                    </div>

                    <div className="space-y-3">
                      <MetricBar label="Freshness" value={result.freshness} color="from-green-500 to-emerald-600" />
                      <MetricBar label="Color Quality" value={result.color} color="from-blue-500 to-cyan-600" />
                      <MetricBar label="Size Uniformity" value={result.size} color="from-purple-500 to-indigo-600" />
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-orange-500" size={24} />
                        <span className="font-bold text-slate-700">Defects Detected</span>
                      </div>
                      <span className="text-2xl font-black text-slate-900">{result.defects}</span>
                    </div>

                    {result.recommendations && result.recommendations.length > 0 && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="font-bold text-blue-900 mb-2">Recommendations:</p>
                        <ul className="space-y-1">
                          {result.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-blue-800">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={downloadCertificate}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <Download size={20} />
                      Download Certificate
                    </button>
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
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <History className="text-cyan-600" size={28} />
              Scan History
            </h2>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-cyan-600" size={40} />
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4">
                {history.map((scan) => (
                  <div key={scan.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                    <img src={scan.imageUrl} alt="Scan" className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-black ${
                          scan.grade === 'A+' || scan.grade === 'A' ? 'bg-green-100 text-green-700' :
                          scan.grade === 'B+' || scan.grade === 'B' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          Grade {scan.grade}
                        </span>
                        <span className="text-slate-600 font-semibold">Score: {scan.score}/100</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {new Date(scan.createdAt).toLocaleDateString()} at {new Date(scan.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Defects: {scan.defects}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History size={40} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-semibold">No scan history yet</p>
                <p className="text-sm text-slate-400 mt-2">Start scanning crops to build your history</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <BarChart3 className="text-cyan-600" size={28} />
              Quality Statistics
            </h2>

            {stats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white text-center">
                    <p className="text-sm font-bold mb-2 opacity-90">Total Scans</p>
                    <p className="text-4xl font-black">{stats.totalScans}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
                    <p className="text-sm font-bold mb-2 opacity-90">Average Score</p>
                    <p className="text-4xl font-black">{stats.averageScore}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white text-center">
                    <p className="text-sm font-bold mb-2 opacity-90">Quality Trend</p>
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp size={24} />
                      <p className="text-2xl font-black">+12%</p>
                    </div>
                  </div>
                </div>

                {stats.gradeDistribution && Object.keys(stats.gradeDistribution).length > 0 && (
                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-4">Grade Distribution</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.gradeDistribution).map(([grade, count]: [string, any]) => (
                        <div key={grade}>
                          <div className="flex justify-between mb-2">
                            <span className="font-bold text-slate-700">Grade {grade}</span>
                            <span className="font-black text-slate-900">{count} scans</span>
                          </div>
                          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                grade === 'A+' || grade === 'A' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                grade === 'B+' || grade === 'B' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                                'bg-gradient-to-r from-red-500 to-rose-600'
                              }`}
                              style={{ width: `${(count / stats.totalScans) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 size={40} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-semibold">No statistics available yet</p>
                <p className="text-sm text-slate-400 mt-2">Complete some scans to see your statistics</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  );
}
