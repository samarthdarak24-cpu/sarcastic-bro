'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, FileText, CheckCircle, Clock, AlertTriangle, 
  Upload, Camera, CreditCard, Landmark, User, MapPin,
  Phone, Mail, Calendar, RefreshCw, Eye, Download,
  Lock, Database, Fingerprint, Scan, CheckSquare,
  AlertCircle, Info, ChevronRight, X, FileCheck
} from 'lucide-react';
import { toast } from 'sonner';

// Quick Action Component
function QuickAction({ icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface KYCDocument {
  id: string;
  type: string;
  documentUrl: string;
  uploadedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

const MOCK_KYC_DATA = {
  kycStatus: 'PENDING' as 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED',
  aadhaar: '1234 5678 9012',
  pan: 'ABCDE1234F',
  bankName: 'State Bank of India',
  bankAccount: '1234567890',
  ifsc: 'SBIN0001234',
  kycDocuments: [
    {
      id: '1',
      type: 'AADHAAR_FRONT',
      documentUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
      uploadedAt: new Date().toISOString(),
      status: 'VERIFIED' as const
    },
    {
      id: '2',
      type: 'PAN_CARD',
      documentUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=400',
      uploadedAt: new Date().toISOString(),
      status: 'PENDING' as const
    }
  ]
};

export default function KYC() {
  const [activeTab, setActiveTab] = useState<'identity' | 'documents' | 'bank'>('identity');
  const [kycData, setKycData] = useState(MOCK_KYC_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    aadhaar: '',
    pan: '',
    bankName: '',
    bankAccount: '',
    ifsc: '',
  });

  useEffect(() => {
    setFormData({
      aadhaar: kycData.aadhaar || '',
      pan: kycData.pan || '',
      bankName: kycData.bankName || '',
      bankAccount: kycData.bankAccount || '',
      ifsc: kycData.ifsc || '',
    });
  }, [kycData]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('KYC data refreshed');
    } catch (error) {
      toast.error('Failed to refresh');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('KYC details updated successfully');
    } catch (error) {
      toast.error('Failed to update details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFiles(prev => [...prev, file]);
      toast.success(`${type} selected for upload`);
    }
  };

  const statusConfig = {
    'NOT_SUBMITTED': { 
      color: 'bg-slate-100 text-slate-600 border-slate-200', 
      icon: Info, 
      label: 'Not Submitted',
      gradient: 'from-slate-400 to-slate-500'
    },
    'PENDING': { 
      color: 'bg-amber-50 text-amber-600 border-amber-200', 
      icon: Clock, 
      label: 'Under Review',
      gradient: 'from-amber-400 to-orange-500'
    },
    'VERIFIED': { 
      color: 'bg-green-50 text-green-600 border-green-200', 
      icon: CheckCircle, 
      label: 'Verified',
      gradient: 'from-green-400 to-emerald-500'
    },
    'REJECTED': { 
      color: 'bg-red-50 text-red-600 border-red-200', 
      icon: AlertTriangle, 
      label: 'Rejected',
      gradient: 'from-red-400 to-rose-500'
    },
  };

  const currentStatus = kycData.kycStatus;
  const config = statusConfig[currentStatus];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Premium Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${config.gradient} rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl`}
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Shield size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Shield size={28} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black">KYC Verification 🔐</h2>
                <p className="text-white/80 font-medium text-sm">Complete your identity verification for secure transactions</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="text-xs font-black text-white/70 uppercase">Status</span>
                <p className="text-xl font-black flex items-center gap-2">
                  <StatusIcon size={20} />
                  {config.label}
                </p>
              </div>
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="text-xs font-black text-white/70 uppercase">Documents</span>
                <p className="text-xl font-black">{kycData.kycDocuments.length}/3</p>
              </div>
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="text-xs font-black text-white/70 uppercase">Completion</span>
                <p className="text-xl font-black">
                  {Math.round((kycData.kycDocuments.filter(d => d.status === 'VERIFIED').length / 3) * 100)}%
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="p-4 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:bg-white/30 transition-all text-white shadow-xl"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* KYC Sub-Features */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
          <QuickAction icon={<Fingerprint size={14}/>} label="Biometric Auth" />
          <QuickAction icon={<Scan size={14}/>} label="OCR Scan" />
          <QuickAction icon={<Database size={14}/>} label="UIDAI Verify" />
          <QuickAction icon={<Lock size={14}/>} label="Encrypted Storage" />
          <QuickAction icon={<CheckSquare size={14}/>} label="Auto-Validation" />
          <QuickAction icon={<FileCheck size={14}/>} label="Doc Verification" />
          <QuickAction icon={<AlertCircle size={14}/>} label="Fraud Detection" />
        </div>
      </motion.div>

      {/* Status Alert */}
      {currentStatus === 'REJECTED' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-red-50 border-2 border-red-200 rounded-3xl flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div>
            <h4 className="font-black text-red-900 text-lg mb-1">KYC Verification Rejected</h4>
            <p className="text-red-700 text-sm font-medium">
              Your documents were rejected. Please review the feedback and resubmit with correct information.
            </p>
          </div>
        </motion.div>
      )}

      {currentStatus === 'VERIFIED' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-green-50 border-2 border-green-200 rounded-3xl flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <div>
            <h4 className="font-black text-green-900 text-lg mb-1">KYC Verified Successfully! 🎉</h4>
            <p className="text-green-700 text-sm font-medium">
              Your identity has been verified. You can now access all platform features.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <button
            onClick={() => setActiveTab('identity')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${
              activeTab === 'identity'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-200'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-100'
            }`}
          >
            <User size={20} />
            <span>Identity Details</span>
            {activeTab === 'identity' && <ChevronRight size={16} className="ml-auto" />}
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${
              activeTab === 'documents'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-200'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-100'
            }`}
          >
            <FileText size={20} />
            <span>Upload Documents</span>
            {activeTab === 'documents' && <ChevronRight size={16} className="ml-auto" />}
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${
              activeTab === 'bank'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-200'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-100'
            }`}
          >
            <Landmark size={20} />
            <span>Bank Details</span>
            {activeTab === 'bank' && <ChevronRight size={16} className="ml-auto" />}
          </button>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl mt-6">
            <Lock className="mb-4" size={32} />
            <h4 className="text-lg font-black mb-2">Secure & Encrypted</h4>
            <p className="text-xs font-medium opacity-90 leading-relaxed">
              All your documents are encrypted with AES-256 and stored securely in compliance with data protection regulations.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-100"
            >
              {activeTab === 'identity' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-100">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <CreditCard size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Identity Information</h3>
                      <p className="text-sm text-slate-500 font-medium">Provide your government-issued ID details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Aadhaar Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.aadhaar}
                          onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                          placeholder="1234 5678 9012"
                          maxLength={14}
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 pl-12 font-black outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
                        />
                        <CreditCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-400 mt-2 font-medium">12-digit unique identification number</p>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        PAN Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.pan}
                          onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 pl-12 font-black outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all uppercase"
                        />
                        <FileText size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-400 mt-2 font-medium">Permanent Account Number for tax purposes</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || currentStatus === 'VERIFIED'}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Update Identity Details
                      </>
                    )}
                  </button>
                </form>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-100">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <Upload size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Document Upload</h3>
                      <p className="text-sm text-slate-500 font-medium">Upload clear photos of your documents</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { type: 'AADHAAR_FRONT', label: 'Aadhaar Card (Front)', icon: CreditCard, required: true },
                      { type: 'AADHAAR_BACK', label: 'Aadhaar Card (Back)', icon: CreditCard, required: true },
                      { type: 'PAN_CARD', label: 'PAN Card', icon: FileText, required: true },
                      { type: 'BANK_PASSBOOK', label: 'Bank Passbook / Cancelled Cheque', icon: Landmark, required: false },
                    ].map((doc) => {
                      const uploaded = kycData.kycDocuments.find(d => d.type === doc.type);
                      const DocIcon = doc.icon;
                      
                      return (
                        <div
                          key={doc.type}
                          className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                            uploaded
                              ? 'bg-green-50 border-green-200'
                              : 'bg-slate-50 border-slate-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${
                              uploaded ? 'bg-green-100' : 'bg-white'
                            }`}>
                              <DocIcon size={24} className={uploaded ? 'text-green-600' : 'text-slate-400'} />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 flex items-center gap-2">
                                {doc.label}
                                {doc.required && <span className="text-xs text-red-500">*</span>}
                              </p>
                              <p className="text-xs text-slate-500 font-bold uppercase">{doc.type}</p>
                              {uploaded && (
                                <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                                  <CheckCircle size={12} />
                                  {uploaded.status === 'VERIFIED' ? 'Verified' : 'Under Review'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {uploaded && (
                              <button className="p-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                                <Eye size={18} className="text-slate-600" />
                              </button>
                            )}
                            <div className="relative">
                              <input
                                type="file"
                                id={`file-${doc.type}`}
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload(e, doc.type)}
                              />
                              <label
                                htmlFor={`file-${doc.type}`}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-black shadow-lg cursor-pointer hover:from-green-600 hover:to-emerald-700 transition-all inline-flex items-center gap-2"
                              >
                                <Camera size={16} />
                                {uploaded ? 'Re-upload' : 'Upload'}
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Uploaded Documents Gallery */}
                  {kycData.kycDocuments.length > 0 && (
                    <div className="mt-8 pt-8 border-t-2 border-slate-100">
                      <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                        <FileCheck size={20} className="text-green-600" />
                        Uploaded Documents ({kycData.kycDocuments.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {kycData.kycDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="relative group rounded-2xl overflow-hidden border-2 border-slate-200 h-40 bg-slate-50 hover:border-green-300 transition-all"
                          >
                            <img
                              src={doc.documentUrl}
                              alt={doc.type}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col justify-end">
                              <p className="text-[10px] font-black text-white uppercase tracking-wider mb-1">
                                {doc.type.replace(/_/g, ' ')}
                              </p>
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-[9px] font-bold px-2 py-1 rounded ${
                                    doc.status === 'VERIFIED'
                                      ? 'bg-green-500 text-white'
                                      : doc.status === 'PENDING'
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-red-500 text-white'
                                  }`}
                                >
                                  {doc.status}
                                </span>
                                <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
                                  <Download size={12} className="text-white" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bank' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-100">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <Landmark size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Bank Account Details</h3>
                      <p className="text-sm text-slate-500 font-medium">For receiving payments and transactions</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        placeholder="State Bank of India"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={formData.bankAccount}
                        onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                        placeholder="1234567890"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={formData.ifsc}
                        onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                        placeholder="SBIN0001234"
                        maxLength={11}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all uppercase"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 flex items-start gap-3">
                    <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-blue-900 mb-1">Bank Verification Required</p>
                      <p className="text-xs text-blue-700 font-medium">
                        Please upload a cancelled cheque or bank passbook to verify your account details.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || currentStatus === 'VERIFIED'}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Update Bank Details
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
