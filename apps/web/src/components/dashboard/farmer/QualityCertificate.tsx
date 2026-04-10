'use client';

import { useEffect, useState } from 'react';
import { useQualityCertificate } from '@/hooks/useQualityCertificate';
import { qualityCertificateService } from '@/services/qualityCertificate';
import { Upload, FileText, CheckCircle, XCircle, Calendar, Award, Trash2, Plus, X, Camera, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QualityCertificate() {
  const {
    certificates,
    loading,
    error,
    fetchMyCertificates,
    uploadCertificate,
    deleteCertificate,
  } = useQualityCertificate();

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [showAIQualityScan, setShowAIQualityScan] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
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
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchMyCertificates();
  }, []);

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.cropId) {
      alert('Please select a file and enter crop ID');
      return;
    }

    setUploading(true);
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
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
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

  if (loading && certificates.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Show authentication error prominently
  if (error && error.includes('log in')) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Certifications ({certificates.length})</h2>
          <p className="text-slate-500 font-medium">Manage and verify your crop quality standards</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex-1 md:flex-none bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-200"
          >
            {showUploadForm ? <X size={20} /> : <Plus size={20} />}
            {showUploadForm ? 'Cancel' : 'Securely Upload Document'}
          </button>
        </div>
      </div>

      {!showUploadForm && certificates.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => setShowUploadForm(true)}
            className="group cursor-pointer bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-green-500 transition-all hover:bg-green-50/30"
          >
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Pick PDF or File</h3>
            <p className="text-slate-500">Upload existing quality documents</p>
          </div>
          <div 
            onClick={handleCameraCapture}
            className="group cursor-pointer bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-blue-500 transition-all hover:bg-blue-50/30"
          >
            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Scan Certificate</h3>
            <p className="text-slate-500">Use capture for instant verification</p>
          </div>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {uploadSuccess && (
          <motion.div
            key="upload-success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-4"
          >
            Certificate uploaded successfully!
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-4"
          >
            {error}
          </motion.div>
        )}

        {showCameraCapture && (
          <motion.div
            key="camera-capture"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Capture Certificate</h3>
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
              <div className="space-y-4">
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
                  <Award size={64} className="mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-4">Use your device camera to capture the certificate</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageCapture}
                      className="hidden"
                    />
                    <span className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer hover:bg-blue-700 inline-block">
                      Open Camera
                    </span>
                  </label>
                </div>
                <p className="text-sm text-slate-500 text-center">
                  Tip: Ensure good lighting and the certificate is clearly visible
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200">
                  <img
                    src={capturedImage}
                    alt="Captured certificate"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleRetakePhoto}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                  >
                    Retake Photo
                  </button>
                  <button
                    onClick={handleUseCapturedImage}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                  >
                    Use This Photo
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {showUploadForm && (
          <motion.div
            key="upload-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-6 overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-4">Upload New Certificate</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Crop ID *
                  </label>
                  <input
                    type="text"
                    value={uploadData.cropId}
                    onChange={(e) => setUploadData({ ...uploadData, cropId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Certificate Type
                  </label>
                  <select
                    value={uploadData.certificateType}
                    onChange={(e) => setUploadData({ ...uploadData, certificateType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="FPO_VERIFIED">FPO Verified</option>
                    <option value="LAB_TEST">Lab Test</option>
                    <option value="ORGANIC">Organic</option>
                    <option value="GOVERNMENT">Government</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Certificate Number
                  </label>
                  <input
                    type="text"
                    value={uploadData.certificateNumber}
                    onChange={(e) => setUploadData({ ...uploadData, certificateNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Issuer Name
                  </label>
                  <input
                    type="text"
                    value={uploadData.issuerName}
                    onChange={(e) => setUploadData({ ...uploadData, issuerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={uploadData.issueDate}
                    onChange={(e) => setUploadData({ ...uploadData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={uploadData.expiryDate}
                    onChange={(e) => setUploadData({ ...uploadData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Certificate File *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400 font-semibold"
              >
                {uploading ? 'Uploading...' : 'Upload Certificate'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
          <FileText size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Certificates Yet</h3>
          <p className="text-slate-500">Upload your first quality certificate to build buyer trust</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <motion.div
              key={`cert-${cert.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-slate-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Award className="text-green-600" size={24} />
                  <h3 className="font-bold text-lg">{getCertificateTypeLabel(cert.certificateType)}</h3>
                </div>
                {cert.verifiedByFPO ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <XCircle className="text-gray-400" size={24} />
                )}
              </div>

              {cert.certificateNumber && (
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-medium">Number:</span> {cert.certificateNumber}
                </p>
              )}

              {cert.issuerName && (
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-medium">Issuer:</span> {cert.issuerName}
                </p>
              )}

              {cert.aiScore && (
                <div className="mb-3 bg-green-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">AI Score:</span>
                  <span className="ml-2 text-lg font-bold text-green-600">{cert.aiScore}/100</span>
                </div>
              )}

              {cert.issueDate && (
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                  <Calendar size={14} />
                  {new Date(cert.issueDate).toLocaleDateString()}
                </p>
              )}

              {cert.notes && (
                <p className="text-sm text-slate-600 mb-3 italic bg-slate-50 p-2 rounded">{cert.notes}</p>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = cert.fileUrl;
                    link.target = '_blank';
                    link.download = `certificate-${cert.certificateNumber || cert.id}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  Download
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete Certificate"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
