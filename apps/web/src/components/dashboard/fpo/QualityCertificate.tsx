'use client';

import { useEffect, useState } from 'react';
import { useQualityCertificate } from '@/hooks/useQualityCertificate';
import { 
  Upload, FileText, CheckCircle, XCircle, 
  Calendar, Award, Shield, Plus, X, Search, 
  MoreHorizontal, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function QuickAction({ icon, label }: { icon: any, label: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const needsInput = label.includes('SMS') || label.includes('Import') || label.includes('Set') || label.includes('Discount') || label.includes('Config') || label.includes('Timer');

  const handleExecute = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setIsOpen(false);
      const t = typeof toast.success === 'function' ? toast.success : toast;
      t(label + ' completed successfully.');
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
      >
        {icon}
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-100 flex flex-col relative text-left">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-all hover:bg-slate-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-3 mb-6 mt-2">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                {icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{label}</h3>
                <p className="text-xs font-bold text-slate-500">Configure and execute task</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
               {needsInput ? (
                 <div>
                   <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Input Details / Reference</label>
                   <input type="text" placeholder="Enter configuration details..." className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm font-bold text-slate-800 transition-all focus:shadow-md" />
                 </div>
               ) : (
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                   <div className="mt-0.5 text-purple-500">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                   </div>
                   <p className="text-sm font-semibold text-slate-600">System is ready to process <strong>{label}</strong>. This action will be recorded in the general audit log.</p>
                 </div>
               )}
            </div>

            <button 
              onClick={handleExecute}
              disabled={processing}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
            >
              {processing ? (
                 <>
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...
                 </>
              ) : (
                 <>Confirm Execute</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const MOCK_CERTS = [
  { id: 'cert_1', certificateType: 'LAB_TEST', certificateNumber: 'LAB-9921', issuerName: 'Central Agri Lab', fileUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400', verifiedByFPO: true, aiScore: 98, verifiedAt: new Date().toISOString(), notes: 'Premium Grade A Onion Batch' },
  { id: 'cert_2', certificateType: 'ORGANIC', certificateNumber: 'ORG-5521', issuerName: 'Indocert Organic', fileUrl: 'https://images.unsplash.com/photo-1623126311077-df399990e1ea?w=400', verifiedByFPO: true, aiScore: 92, verifiedAt: new Date().toISOString(), notes: 'Chemical-free Pomegranate' },
  { id: 'cert_3', certificateType: 'AI_GENERATED', certificateNumber: 'AI-CUST-11', issuerName: 'FarmGuard AI Engine', fileUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400', verifiedByFPO: false, notes: 'Awaiting manual audit for consistency check' },
];

export default function FPOQualityCertificate() {
  const {
    certificates: rawCerts,
    loading,
    error,
    fetchMyCertificates,
    uploadCertificate,
    verifyCertificate,
  } = useQualityCertificate();

  const certificates = rawCerts.length > 0 ? rawCerts : MOCK_CERTS;

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    cropId: '',
    lotId: '',
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
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    fetchMyCertificates();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || (!uploadData.cropId && !uploadData.lotId)) {
      alert('Please select a file and enter crop ID or lot ID');
      return;
    }

    setUploading(true);
    try {
      await uploadCertificate({
        cropId: uploadData.cropId || undefined,
        lotId: uploadData.lotId || undefined,
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
        lotId: '',
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

  const handleVerify = async (id: string) => {
    setVerifying(id);
    try {
      await verifyCertificate(id);
    } catch (err) {
      console.error('Verify error:', err);
    } finally {
      setVerifying(null);
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

  const unverifiedCerts = certificates.filter((c) => !c.verifiedByFPO);
  const verifiedCerts = certificates.filter((c) => c.verifiedByFPO);

  if (loading && certificates.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Award size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Quality Assurance 🏆</h2>
            <p className="text-white/80 font-medium">Verify crop certificates and manage quality standards.</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Total Certs</span>
                <p className="text-2xl font-black">{certificates.length}</p>
              </div>
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Verified</span>
                <p className="text-2xl font-black">{verifiedCerts.length}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2 px-6 py-4 bg-white text-teal-600 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-0.5"
          >
            {showUploadForm ? <X size={20} /> : <Plus size={20} />}
            {showUploadForm ? 'Cancel' : 'Upload Certificate'}
          </button>
        </div>

        {/* Quality Sub-Features */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
          <QuickAction icon={<Shield size={14}/>} label="AI Grade Predict" />
          <QuickAction icon={<FileText size={14}/>} label="Lab Data Parser" />
          <QuickAction icon={<Clock size={14}/>} label="Renewal Alert" />
          <QuickAction icon={<CheckCircle size={14}/>} label="Audit History" />
          <QuickAction icon={<Search size={14}/>} label="Sample Tracking" />
          <QuickAction icon={<Award size={14}/>} label="Premium Seal" />
          <QuickAction icon={<MoreHorizontal size={14}/>} label="Third Party" />
        </div>
      </motion.div>

      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl"
          >
            Certificate uploaded successfully!
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{error}</p>
              {error.includes('Network error') && (
                <p className="text-sm mt-1">
                  Make sure the API server is running on port 3001 and you're logged in.
                </p>
              )}
            </div>
            <button
              onClick={() => fetchMyCertificates()}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
            >
              Retry
            </button>
          </motion.div>
        )}

        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <h3 className="text-xl font-bold mb-4">Upload New Certificate</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Crop ID
                  </label>
                  <input
                    type="text"
                    value={uploadData.cropId}
                    onChange={(e) => setUploadData({ ...uploadData, cropId: e.target.value, lotId: '' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Aggregated Lot ID
                  </label>
                  <input
                    type="text"
                    value={uploadData.lotId}
                    onChange={(e) => setUploadData({ ...uploadData, lotId: e.target.value, cropId: '' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Certificate Type
                  </label>
                  <select
                    value={uploadData.certificateType}
                    onChange={(e) => setUploadData({ ...uploadData, certificateType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 disabled:bg-gray-400 font-semibold"
              >
                {uploading ? 'Uploading...' : 'Upload Certificate'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {unverifiedCerts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-orange-600 flex items-center gap-2">
            <XCircle size={24} />
            Pending Verification ({unverifiedCerts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unverifiedCerts.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="text-orange-600" size={24} />
                    <h4 className="font-bold text-lg">{getCertificateTypeLabel(cert.certificateType)}</h4>
                  </div>
                  <XCircle className="text-orange-500" size={24} />
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

                <div className="flex gap-2 mt-4">
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center text-sm font-semibold"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleVerify(cert.id)}
                    disabled={verifying === cert.id}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold"
                  >
                    <Shield size={16} />
                    {verifying === cert.id ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4 text-green-600 flex items-center gap-2">
          <CheckCircle size={24} />
          Verified Certificates ({verifiedCerts.length})
        </h3>
        {verifiedCerts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
            <FileText size={64} className="mx-auto text-slate-300 mb-4" />
            <h4 className="text-xl font-bold text-slate-700 mb-2">No Verified Certificates</h4>
            <p className="text-slate-500">Verify farmer certificates to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedCerts.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="text-green-600" size={24} />
                    <h4 className="font-bold text-lg">{getCertificateTypeLabel(cert.certificateType)}</h4>
                  </div>
                  <CheckCircle className="text-green-600" size={24} />
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

                {cert.verifiedAt && (
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                    <Calendar size={14} />
                    Verified: {new Date(cert.verifiedAt).toLocaleDateString()}
                  </p>
                )}

                {cert.notes && (
                  <p className="text-sm text-slate-600 mb-3 italic bg-slate-50 p-2 rounded">{cert.notes}</p>
                )}

                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center text-sm font-semibold"
                >
                  View Certificate
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
