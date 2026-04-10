import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, Shield, FileText, CheckCircle, Clock, 
  AlertTriangle, Building, MapPin, Camera, Upload, 
  CreditCard, Landmark, Info, ChevronRight, X
} from 'lucide-react';
import { useKYC, KYCProfile } from '@/hooks/useKYC';
import { useTranslation } from 'react-i18next';

interface KYCManagerProps {
  role: 'FARMER' | 'BUYER' | 'FPO';
}

export default function KYCManager({ role }: KYCManagerProps) {
  const { t } = useTranslation();
  const { data, loading, error, submitDetails, uploadDocuments } = useKYC();
  const [activeTab, setActiveTab] = useState<'details' | 'documents'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    aadhaar: '',
    gst: '',
    pan: '',
    bankAccount: '',
    ifsc: '',
    bankName: '',
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setFormData({
        aadhaar: data.aadhaar || '',
        gst: data.gst || '',
        pan: data.pan || '',
        bankAccount: data.bankAccount || '',
        ifsc: data.ifsc || '',
        bankName: data.bankName || '',
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitDetails(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsSubmitting(true);
    try {
      await uploadDocuments(selectedFiles, selectedTypes);
      setSelectedFiles([]);
      setSelectedTypes([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFiles(prev => [...prev, file]);
      setSelectedTypes(prev => [...prev, type]);
    }
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="h-10 w-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statusConfig = {
    'NOT_SUBMITTED': { color: 'text-slate-400 bg-slate-100', icon: Info, label: t('kyc.notSubmitted') },
    'PENDING': { color: 'text-amber-600 bg-amber-50', icon: Clock, label: t('kyc.pending') },
    'VERIFIED': { color: 'text-green-600 bg-green-50', icon: CheckCircle, label: t('kyc.verified') },
    'REJECTED': { color: 'text-red-600 bg-red-50', icon: AlertTriangle, label: t('kyc.rejected') },
  };

  const currentStatus = data?.kycStatus || 'NOT_SUBMITTED';
  const config = statusConfig[currentStatus];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-slate-900">{t('kyc.title')}</h2>
          <p className="text-slate-500 mt-1">
            {role === 'FARMER' ? t('kyc.farmerDesc') : 
             role === 'BUYER' ? t('kyc.buyerDesc') : 
             t('kyc.fpoDesc')}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black text-sm border ${config.color}`}>
           <StatusIcon size={18} />
           {config.label}
        </div>
      </div>

      {currentStatus === 'REJECTED' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700"
        >
          <AlertTriangle size={20} />
          <div>
            <p className="font-black text-sm">{t('kyc.rejected')}</p>
            <p className="text-xs font-medium opacity-80">{data?.rejectionReason}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <button 
            onClick={() => setActiveTab('details')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'details' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
          >
            <CreditCard size={18} />
            {t('kyc.identityDetails')}
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'documents' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
          >
            <FileText size={18} />
            {t('kyc.uploadProofs')}
          </button>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl mt-8">
            <Shield className="mb-4" size={32} />
            <h4 className="text-lg font-black mb-2">{t('kyc.secureStorageTitle')}</h4>
            <p className="text-xs font-medium opacity-80 leading-relaxed">
              {t('kyc.secureStorageDesc')}
            </p>
          </div>
        </div>

        {/* Form Area */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
          {activeTab === 'details' ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {role === 'FARMER' && (
                  <div className="col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('kyc.aadhaar')}</label>
                    <input 
                      type="text" 
                      value={formData.aadhaar}
                      onChange={(e) => setFormData({...formData, aadhaar: e.target.value})}
                      placeholder={t('kyc.aadhaarPlaceholder')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                    />
                  </div>
                )}
                
                {(role === 'BUYER' || role === 'FPO') && (
                  <div className="col-span-1">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('kyc.gst')}</label>
                    <input 
                      type="text" 
                      value={formData.gst}
                      onChange={(e) => setFormData({...formData, gst: e.target.value})}
                      placeholder="GSTIN"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                    />
                  </div>
                )}

                <div className={role === 'FARMER' ? 'col-span-2' : 'col-span-1'}>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('kyc.pan')}</label>
                  <input 
                    type="text" 
                    value={formData.pan}
                    onChange={(e) => setFormData({...formData, pan: e.target.value})}
                    placeholder={t('kyc.panPlaceholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                  />
                </div>

                <div className="col-span-2">
                   <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 mb-4 py-2 border-b border-slate-100">
                      <Landmark size={18} className="text-indigo-500" />
                      {t('kyc.bankDetails')}
                   </h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('kyc.bankName')}</label>
                        <input 
                          type="text" 
                          value={formData.bankName}
                          onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                          placeholder={t('kyc.bankNamePlaceholder')}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('kyc.accountNumber')}</label>
                        <input 
                          type="text" 
                          value={formData.bankAccount}
                          onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('kyc.ifsc')}</label>
                        <input 
                          type="text" 
                          value={formData.ifsc}
                          onChange={(e) => setFormData({...formData, ifsc: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                        />
                      </div>
                   </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || currentStatus === 'VERIFIED'}
                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
              >
                {isSubmitting ? t('kyc.saving') : t('kyc.updateDetails')}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
               <div className="grid grid-cols-1 gap-6">
                  {[
                    { type: 'AADHAAR', label: t('kyc.docIdentity'), required: true },
                    { type: 'BANK_PASSBOOK', label: t('kyc.docBank'), required: true },
                    { type: 'GST_CERTIFICATE', label: t('kyc.docGst'), required: role !== 'FARMER' },
                  ].map((doc) => (
                    <div key={doc.type} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                             <FileText size={24} />
                          </div>
                          <div>
                             <p className="font-black text-slate-900">{doc.label}</p>
                             <p className="text-xs text-slate-400 font-bold uppercase">{doc.type}</p>
                          </div>
                       </div>
                       <div className="relative">
                          <input 
                            type="file" 
                            id={`file-${doc.type}`}
                            className="hidden" 
                            onChange={(e) => onFileChange(e, doc.type)}
                          />
                          <label 
                            htmlFor={`file-${doc.type}`}
                            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black shadow-sm cursor-pointer hover:bg-slate-900 hover:text-white transition-all inline-flex items-center gap-2"
                          >
                             <Camera size={14} /> {t('kyc.uploadDocs')}
                          </label>
                       </div>
                    </div>
                  ))}
               </div>

               {selectedFiles.length > 0 && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-slate-900 rounded-3xl text-white">
                    <h5 className="font-black text-sm mb-4 flex items-center gap-2">
                       <Upload size={16} /> {t('kyc.selectedFiles')} ({selectedFiles.length})
                    </h5>
                    <div className="space-y-2 mb-6">
                       {selectedFiles.map((file, i) => (
                         <div key={i} className="flex items-center justify-between text-xs p-2 bg-white/10 rounded-lg">
                            <span className="truncate max-w-[200px]">{file.name}</span>
                            <span className="font-bold text-indigo-300 uppercase">{selectedTypes[i]}</span>
                         </div>
                       ))}
                    </div>
                    <button 
                      onClick={handleFileUpload}
                      disabled={isSubmitting}
                      className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-xl"
                    >
                      {isSubmitting ? t('kyc.uploadingToCloudinary') : t('kyc.startSecureUpload')}
                    </button>
                 </motion.div>
               )}

               <div className="border-t border-slate-100 pt-8 mt-8">
                  <h4 className="font-black text-slate-900 mb-4">{t('kyc.uploadedDocuments')}</h4>
                  <div className="grid grid-cols-2 gap-4">
                     {data?.kycDocuments.map((doc) => (
                       <div key={doc.id} className="relative group rounded-2xl overflow-hidden border border-slate-100 h-32 bg-slate-50">
                          <img src={doc.documentUrl} alt={doc.type} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
                             <p className="text-[10px] font-black text-white uppercase tracking-wider">{doc.type}</p>
                             <p className="text-[9px] text-white/60">Verified: {doc.verifiedAt ? new Date(doc.verifiedAt).toLocaleDateString() : 'Pending'}</p>
                          </div>
                       </div>
                     ))}
                     {data?.kycDocuments.length === 0 && (
                       <div className="col-span-2 py-10 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">
                          {t('kyc.noDocs')}
                       </div>
                     )}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
