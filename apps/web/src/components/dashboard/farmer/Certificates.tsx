import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, Upload, Trash2, ExternalLink, ShieldCheck, AlertCircle, CheckCircle, Info, Download, Filter, X, Calendar, Award, Camera, Sparkles } from 'lucide-react';
import { useQualityCertificate } from '@/hooks/useQualityCertificate';
import { qualityCertificateService } from '@/services/qualityCertificate';
import api from '@/services/api';

interface Crop {
  id: string;
  cropName: string;
  variety?: string;
  quantity: number;
  status: string;
}

export default function Certificates() {
  const {
    certificates,
    loading,
    error,
    fetchMyCertificates,
    uploadCertificate,
    deleteCertificate,
  } = useQualityCertificate();

  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [showAIQualityScan, setShowAIQualityScan] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'vault' | 'history'>('vault');
  const [aiScanImages, setAiScanImages] = useState<File[]>([]);
  const [aiScanCropId, setAiScanCropId] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [uploadData, setUploadData] = useState({
    cropId: '',
    certificateType: 'FPO_VERIFIED',
    certificateNumber: '',
    issuerName: '',
    issueDate: '',
    expiryDate: '',
    notes: '',
    file: null as File | null,
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loadingCrops, setLoadingCrops] = useState(false);

  useEffect(() => {
    fetchMyCertificates();
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoadingCrops(true);
    try {
      const response = await api.get('/api/crops/my-listings');
      if (response.data.success && response.data.crops) {
        setCrops(response.data.crops);
      }
    } catch (err) {
      console.error('Failed to fetch crops:', err);
    } finally {
      setLoadingCrops(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleCameraCapture = () => {
    setShowCameraCapture(true);
    setShowUploadForm(false);
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setUploadData({ ...uploadData, file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseCapturedImage = () => {
    setShowCameraCapture(false);
    setShowUploadForm(true);
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setUploadData({ ...uploadData, file: null });
  };

  const handleAIQualityScan = () => {
    setShowAIQualityScan(true);
    setShowUploadForm(false);
    setShowCameraCapture(false);
  };

  const handleAIImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAiScanImages(filesArray);
    }
  };

  const handleGenerateAIScore = async () => {
    if (!aiScanCropId || aiScanImages.length === 0) {
      setUploadError('Please select a crop and upload at least one image');
      return;
    }

    setGeneratingAI(true);
    setUploadError('');

    try {
      const result = await qualityCertificateService.generateAIScore(aiScanCropId, aiScanImages);
      setUploadSuccess(true);
      setShowAIQualityScan(false);
      setAiScanImages([]);
      setAiScanCropId('');
      await fetchMyCertificates();
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to generate AI quality score');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData.file) {
      setUploadError('Please select a file to upload');
      return;
    }

    if (!uploadData.cropId) {
      setUploadError('Please select a crop from the dropdown');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    
    try {
      await uploadCertificate({
        cropId: uploadData.cropId,
        certificateType: uploadData.certificateType,
        certificateNumber: uploadData.certificateNumber,
        issuerName: uploadData.issuerName,
        issueDate: uploadData.issueDate,
        expiryDate: uploadData.expiryDate,
        notes: uploadData.notes,
        file: uploadData.file,
      });
      
      setUploadSuccess(true);
      setShowUploadForm(false);
      setUploadData({
        cropId: '',
        certificateType: 'FPO_VERIFIED',
        certificateNumber: '',
        issuerName: '',
        issueDate: '',
        expiryDate: '',
        notes: '',
        file: null,
      });
      
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload certificate';
      if (errorMessage.includes('Crop not found')) {
        setUploadError('The selected crop no longer exists. Please refresh and try again.');
      } else {
        setUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      try {
        await deleteCertificate(id);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleDownload = (cert: any) => {
    const link = document.createElement('a');
    link.href = cert.fileUrl;
    link.target = '_blank';
    link.download = `certificate-${cert.certificateNumber || cert.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCertificateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      LAB_TEST: 'Lab Test',
      FPO_VERIFIED: 'FPO Verified',
      ORGANIC: 'Organic',
      GOVERNMENT: 'Government',
      AI_GENERATED: 'AI Generated',
    };
    return labels[type] || type;
  };

  // Show authentication error
  if (error && error.includes('log in')) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-yellow-800 mb-2">Authentication Required</h3>
              <p className="text-yellow-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Digital Vault: Quality Certificates</h2>
          <p className="text-slate-500 mt-1">Manage official lab reports and government certifications for your produce.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 text-xs font-black rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'vault' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCheck size={14} /> My Vault
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'history' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Audit History
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <CheckCircle size={20} />
            Certificate uploaded successfully!
          </motion.div>
        )}

        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <AlertCircle size={20} />
            {uploadError}
          </motion.div>
        )}

        {showCameraCapture && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Capture Certificate</h3>
              <button
                onClick={() => {
                  setShowCameraCapture(false);
                  setCapturedImage(null);
                  setUploadData({ ...uploadData, file: null });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {!capturedImage ? (
              <div className="space-y-6">
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-16 text-center">
                  <Award size={80} className="mx-auto text-slate-400 mb-6" />
                  <p className="text-slate-600 mb-6 text-lg">Use your device camera to capture the certificate</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageCapture}
                      className="hidden"
                    />
                    <span className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black cursor-pointer hover:bg-blue-700 inline-block shadow-lg">
                      Open Camera
                    </span>
                  </label>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-sm text-blue-700 font-medium">
                    <strong>Tips for best results:</strong>
                  </p>
                  <ul className="text-sm text-blue-600 mt-2 space-y-1 list-disc list-inside">
                    <li>Ensure good lighting</li>
                    <li>Keep certificate flat and fully visible</li>
                    <li>Avoid shadows and glare</li>
                    <li>Hold camera steady</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-3xl overflow-hidden border-4 border-slate-200 shadow-lg">
                  <img
                    src={capturedImage}
                    alt="Captured certificate"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleRetakePhoto}
                    className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all"
                  >
                    Retake Photo
                  </button>
                  <button
                    onClick={handleUseCapturedImage}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg"
                  >
                    Use This Photo
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {showAIQualityScan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-lg p-8 border-2 border-purple-200"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">AI Quality Scan</h3>
                  <p className="text-sm text-slate-600">Get instant AI-generated quality certificate</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAIQualityScan(false);
                  setAiScanImages([]);
                  setAiScanCropId('');
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Select Crop *</label>
                {loadingCrops ? (
                  <div className="w-full bg-white border border-purple-200 rounded-2xl px-5 py-4 text-sm text-slate-400">
                    Loading crops...
                  </div>
                ) : crops.length === 0 ? (
                  <div className="space-y-3">
                    <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 text-sm text-yellow-700">
                      No crops found. Please create a crop listing first.
                    </div>
                    <button
                      type="button"
                      onClick={() => window.location.href = '/farmer/crops/add'}
                      className="w-full py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all text-sm"
                    >
                      Create Crop Listing
                    </button>
                  </div>
                ) : (
                  <select 
                    required
                    value={aiScanCropId}
                    onChange={(e) => setAiScanCropId(e.target.value)}
                    className="w-full bg-white border-2 border-purple-200 rounded-2xl px-5 py-4 font-black outline-none appearance-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                  >
                    <option value="">Choose a crop...</option>
                    {crops.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.cropName} {crop.variety ? `(${crop.variety})` : ''} - {crop.quantity}kg
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                  Upload Crop Images * (Up to 5 images)
                </label>
                <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 bg-white hover:border-purple-500 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAIImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload size={48} className="mx-auto text-purple-400 mb-3" />
                    <p className="text-slate-700 font-bold mb-1">
                      {aiScanImages.length > 0 
                        ? `${aiScanImages.length} image(s) selected` 
                        : 'Click to upload crop images'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Take clear photos of your crop from different angles
                    </p>
                  </div>
                </div>
                {aiScanImages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {aiScanImages.map((file, index) => (
                      <div key={index} className="bg-purple-100 px-3 py-1 rounded-lg text-xs font-bold text-purple-700">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Sparkles size={24} className="text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-purple-900 mb-2">How AI Quality Scan Works</h4>
                    <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
                      <li>Upload 1-5 clear images of your crop</li>
                      <li>AI analyzes color, size, texture, and quality indicators</li>
                      <li>Generates quality score (0-100) instantly</li>
                      <li>Creates AI-verified certificate automatically</li>
                      <li>Increases buyer trust and pricing power</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateAIScore}
                disabled={generatingAI || !aiScanCropId || aiScanImages.length === 0}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingAI ? (
                  <>
                    <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate AI Quality Certificate
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'vault' ? (
        <div className="grid grid-cols-12 gap-8">
          {/* Upload Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 border border-blue-100">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Upload New Document</h3>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                Add lab tests, organic certifications, or GI-tag proofs to significantly increase your buyer trust and pricing power.
              </p>

              {!showUploadForm ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:scale-[1.01] transition-all"
                  >
                    Start Upload
                  </button>
                  <button
                    onClick={handleCameraCapture}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    <Camera size={20} />
                    Scan Certificate
                  </button>
                  <button
                    onClick={handleAIQualityScan}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black shadow-xl shadow-purple-200 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={20} />
                    AI Quality Scan
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select Crop *</label>
                    {loadingCrops ? (
                      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-400">
                        Loading crops...
                      </div>
                    ) : crops.length === 0 ? (
                      <div className="space-y-3">
                        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 text-sm text-yellow-700">
                          No crops found. Please create a crop listing first.
                        </div>
                        <button
                          type="button"
                          onClick={() => window.location.href = '/farmer/crops/add'}
                          className="w-full py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all text-sm"
                        >
                          Create Crop Listing
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <select 
                          required
                          value={uploadData.cropId}
                          onChange={(e) => setUploadData({ ...uploadData, cropId: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none appearance-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        >
                          <option value="">Choose a crop...</option>
                          {crops.map((crop) => (
                            <option key={crop.id} value={crop.id}>
                              {crop.cropName} {crop.variety ? `(${crop.variety})` : ''} - {crop.quantity}kg
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={fetchCrops}
                          className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                        >
                          Refresh crop list
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Certificate Type</label>
                    <select 
                      value={uploadData.certificateType}
                      onChange={(e) => setUploadData({ ...uploadData, certificateType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none appearance-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    >
                      <option value="FPO_VERIFIED">FPO Verified</option>
                      <option value="LAB_TEST">Lab Test</option>
                      <option value="ORGANIC">Organic</option>
                      <option value="GOVERNMENT">Government</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Certificate Number</label>
                    <input 
                      type="text" 
                      value={uploadData.certificateNumber}
                      onChange={(e) => setUploadData({ ...uploadData, certificateNumber: e.target.value })}
                      placeholder="Optional" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Issuer Name</label>
                    <input 
                      type="text" 
                      value={uploadData.issuerName}
                      onChange={(e) => setUploadData({ ...uploadData, issuerName: e.target.value })}
                      placeholder="Optional" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" 
                    />
                  </div>

                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 group hover:border-blue-400 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <Upload size={24} className="text-slate-400 group-hover:text-blue-500 mb-2" />
                    <span className="text-xs font-bold text-slate-500">
                      {uploadData.file ? uploadData.file.name : 'Pick PDF or Scan'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadForm(false);
                        setUploadError('');
                      }}
                      className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isUploading}
                      className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isUploading ? <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : 'Securely Upload Document'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Certificate List */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-600" /> Active Certifications ({certificates.length})
              </h3>
            </div>
            
            {loading && certificates.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
              </div>
            ) : certificates.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <FileCheck size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Certificates Yet</h3>
                <p className="text-slate-500">Upload your first quality certificate to build buyer trust</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <motion.div 
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <FileCheck size={20} />
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          cert.verifiedByFPO 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                        }`}>
                          {cert.verifiedByFPO ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2">
                        {getCertificateTypeLabel(cert.certificateType)}
                      </h4>
                      <div className="space-y-1">
                        {cert.certificateNumber && (
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Info size={12} /> Number: {cert.certificateNumber}
                          </p>
                        )}
                        {cert.issuerName && (
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Info size={12} /> Issuer: {cert.issuerName}
                          </p>
                        )}
                        {cert.issueDate && (
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Calendar size={12} /> {new Date(cert.issueDate).toLocaleDateString()}
                          </p>
                        )}
                        {cert.aiScore && (
                          <div className="mt-2 bg-green-50 p-2 rounded-lg">
                            <span className="text-xs font-bold text-slate-700">AI Score:</span>
                            <span className="ml-2 text-sm font-black text-green-600">{cert.aiScore}/100</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                      <button 
                        onClick={() => handleDownload(cert)}
                        className="flex-1 py-2.5 bg-slate-50 text-slate-900 rounded-xl font-black text-xs hover:bg-slate-100 border border-slate-100 flex items-center justify-center gap-2"
                      >
                        <Download size={14} /> Download
                      </button>
                      <button 
                        onClick={() => handleDelete(cert.id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <h5 className="font-black text-blue-900 text-sm">Need a Lab Test?</h5>
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                  AgriTrust partners with NABL approved labs in your district. Click here to book an on-farm sampling and get your digital report auto-uploaded!
                </p>
                <button className="text-xs font-black text-blue-600 uppercase hover:underline mt-2 flex items-center gap-1">
                  Find Partnered Lab <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
          <h3 className="text-xl font-black text-slate-900 mb-6">Audit History</h3>
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border-l-4 border-blue-500 bg-slate-50 p-4 rounded-r-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{getCertificateTypeLabel(cert.certificateType)}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Uploaded on {new Date(cert.uploadedAt).toLocaleString()}
                    </p>
                    {cert.verifiedAt && (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle size={14} /> Verified on {new Date(cert.verifiedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    cert.verifiedByFPO 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {cert.verifiedByFPO ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
              </div>
            ))}
            {certificates.length === 0 && (
              <p className="text-center text-slate-500 py-8">No audit history available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
