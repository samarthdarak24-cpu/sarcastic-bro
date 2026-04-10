import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, CheckCircle2, FileText, Landmark, 
  ShieldCheck, ArrowRight, Loader2, Upload, AlertCircle, RefreshCw, Briefcase, Camera
} from 'lucide-react';
import { toast } from 'sonner';

const STEPS = [
  { id: 'business', title: 'Business Info', icon: Briefcase, desc: 'Company details' },
  { id: 'gst', title: 'GST Verification', icon: ShieldCheck, desc: 'API live check' },
  { id: 'bank', title: 'Bank Details', icon: Landmark, desc: 'Payout routing' },
  { id: 'docs', title: 'Documents', icon: FileText, desc: 'Upload proofs' }
];

export default function KYC() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(25);
  
  const [formData, setFormData] = useState({
    businessName: '',
    pan: '',
    gstin: '',
    accountNumber: '',
    ifsc: '',
    bankName: ''
  });

  const [gstData, setGstData] = useState<any>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      setProgress((currentStep + 2) * 25);
    }
  };

  const handleGstVerify = () => {
    if (!formData.gstin || formData.gstin.length < 15) {
      toast.error('Please enter a valid 15-digit GSTIN');
      return;
    }
    
    setIsVerifying(true);
    // Simulate external live GST API Check
    setTimeout(() => {
      setIsVerifying(false);
      setGstData({
         status: 'Active',
         legalName: 'AgroCorp Enterprises Pvt Ltd',
         address: '123, Tech Park, Andheri, Mumbai, MH - 400053',
         taxpayerType: 'Regular'
      });
      toast.success('GSTIN Verified Successfully with GSTN portal');
    }, 2500);
  };

  const handleComplete = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      toast.success('Buyer profile setup complete! Your account is now under final review.');
      setCurrentStep(4); // completion state
    }, 2000);
  };

  if (currentStep === 4) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 rounded-[32px] p-12 text-center text-white relative overflow-hidden shadow-2xl">
         <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full blur-[100px] opacity-20"></div>
         <div className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] mb-8">
            <CheckCircle2 size={48} className="text-white" />
         </div>
         <h2 className="text-4xl font-black mb-4">Profile Submitted for Audit</h2>
         <p className="text-slate-400 max-w-lg mx-auto mb-8 font-medium">
           Your business profile, GST verification, and bank details have been securely saved and pushed for final compliance review. You will receive an email once your account goes live.
         </p>
         <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
           Return to Dashboard
         </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-200">
      <div className="grid grid-cols-12 min-h-[600px]">
        
        {/* Left Sidebar Workflow */}
        <div className="col-span-12 md:col-span-4 bg-slate-50 border-r border-slate-100 p-8 relative">
           <div className="space-y-2 mb-10">
              <h3 className="text-2xl font-black text-slate-900">Buyer Profile</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inline Setup Workflow</p>
           </div>

           <div className="relative z-10 space-y-6">
              {STEPS.map((step, idx) => {
                 const isActive = idx === currentStep;
                 const isCompleted = idx < currentStep;
                 const TargetIcon = step.icon;

                 return (
                   <div key={step.id} className="flex items-start gap-4 group">
                      <div className="relative mt-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                           {isCompleted ? <CheckCircle2 size={18} /> : <TargetIcon size={18} />}
                        </div>
                        {idx !== STEPS.length - 1 && (
                           <div className={`absolute top-10 left-1/2 -mt-1 w-0.5 h-6 -translate-x-1/2 transition-colors duration-500 ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                        )}
                      </div>
                      <div>
                         <h4 className={`font-black transition-colors ${isActive ? 'text-blue-600 text-lg' : isCompleted ? 'text-slate-900 text-base' : 'text-slate-400 text-base'}`}>{step.title}</h4>
                         <p className="text-xs font-semibold text-slate-500">{step.desc}</p>
                      </div>
                   </div>
                 );
              })}
           </div>

           <div className="absolute bottom-0 left-0 w-full p-8">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                 <span>Trackable Status</span>
                 <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                 <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out relative" style={{width: `${progress}%`}}>
                   <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Form Content */}
        <div className="col-span-12 md:col-span-8 p-10 flex flex-col justify-between relative bg-white">
          <AnimatePresence mode="wait">
             
             {currentStep === 0 && (
               <motion.div key="step-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="mb-8">
                     <h2 className="text-3xl font-black text-slate-900 mb-2">Business Information</h2>
                     <p className="text-slate-500">Provide your registered company name and PAN detail for compliance checks.</p>
                  </div>
                  <div className="space-y-4">
                     <div>
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Registered Business Name</label>
                       <input type="text" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} placeholder="e.g., AgriTrust Enterprises" className="w-full border-2 border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-slate-800 transition-all text-lg" />
                     </div>
                     <div>
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Business PAN Number</label>
                       <input type="text" value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value.toUpperCase()})} placeholder="ABCDE1234F" maxLength={10} className="w-full border-2 border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-black text-slate-800 tracking-[0.2em] transition-all text-lg uppercase" />
                     </div>
                  </div>
               </motion.div>
             )}

             {currentStep === 1 && (
               <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="mb-8 flex items-start justify-between">
                     <div>
                       <h2 className="text-3xl font-black text-slate-900 mb-2">GST Verification</h2>
                       <p className="text-slate-500">Live API verification to prevent fraudulent wholesale buyer accounts.</p>
                     </div>
                     <ShieldCheck size={48} className="text-blue-100" />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">GSTIN (15 Digits)</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                       <input type="text" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value.toUpperCase()})} placeholder="27ABCDE1234F1Z5" maxLength={15} disabled={!!gstData || isVerifying} className="flex-1 border-2 border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-black text-slate-800 tracking-[0.2em] uppercase transition-all text-lg disabled:bg-slate-50 disabled:text-slate-500" />
                       <button onClick={handleGstVerify} disabled={isVerifying || !!gstData} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2">
                         {isVerifying ? <Loader2 className="animate-spin" /> : gstData ? <CheckCircle2 className="text-green-400" /> : 'Verify API'}
                       </button>
                    </div>
                  </div>

                  {gstData && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-3xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Building2 size={100} className="text-green-600" />
                       </div>
                       <div className="relative z-10 space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-green-700 font-mono">STATUS: {gstData.status}</span>
                          </div>
                          <div>
                             <p className="text-xs text-green-700/60 font-bold uppercase tracking-widest">Legal Name</p>
                             <p className="text-lg font-black text-green-900">{gstData.legalName}</p>
                          </div>
                          <div>
                             <p className="text-xs text-green-700/60 font-bold uppercase tracking-widest">Registered Address</p>
                             <p className="text-sm font-bold text-green-800">{gstData.address}</p>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </motion.div>
             )}

             {currentStep === 2 && (
               <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="mb-8">
                     <h2 className="text-3xl font-black text-slate-900 mb-2">Bank Details</h2>
                     <p className="text-slate-500">Configure your escrow withdrawal and platform fee payment source.</p>
                  </div>
                  <div className="space-y-4">
                     <div>
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Bank Name</label>
                       <input type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} placeholder="HDFC / SBI / ICICI" className="w-full border-2 border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-slate-800 transition-all text-lg" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Account Number</label>
                          <input type="password" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} placeholder="••••••••••••" className="w-full border-2 border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-black text-slate-800 transition-all tracking-[0.2em]" />
                        </div>
                        <div>
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">IFSC Code</label>
                          <input type="text" value={formData.ifsc} onChange={e => setFormData({...formData, ifsc: e.target.value.toUpperCase()})} placeholder="HDFC0001234" maxLength={11} className="w-full border-2 border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-black text-slate-800 transition-all uppercase tracking-[0.1em]" />
                        </div>
                     </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl">
                     <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                     <p className="text-xs font-semibold">Account title must exactly match the GST Legal Name <strong>{gstData?.legalName || 'provided earlier'}</strong> to pass autonomous banking clearance.</p>
                  </div>
               </motion.div>
             )}

             {currentStep === 3 && (
               <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="mb-8">
                     <h2 className="text-3xl font-black text-slate-900 mb-2">Document Upload</h2>
                     <p className="text-slate-500">Securely upload copies of your GST certificate and Cancelled Cheque.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="border-2 border-dashed border-slate-300 rounded-[24px] p-8 text-center bg-slate-50 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-all group">
                        <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                           <Camera size={24} className="text-slate-400" />
                        </div>
                        <p className="font-black text-slate-700">GST Form</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">PDF or image</p>
                     </div>
                     <div className="border-2 border-dashed border-slate-300 rounded-[24px] p-8 text-center bg-slate-50 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-all group">
                        <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                           <Upload size={24} className="text-slate-400" />
                        </div>
                        <p className="font-black text-slate-700">Blank Cheque</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Clear photo</p>
                     </div>
                  </div>
               </motion.div>
             )}

          </AnimatePresence>

          <div className="pt-8 mt-8 border-t border-slate-100 flex justify-end">
             {currentStep < 3 ? (
               <button 
                 onClick={handleNext} 
                 disabled={(currentStep === 1 && !gstData)}
                 className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
               >
                 Continue <ArrowRight size={20} />
               </button>
             ) : (
               <button 
                 onClick={handleComplete} 
                 disabled={isVerifying}
                 className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2"
               >
                 {isVerifying ? <Loader2 className="animate-spin" /> : 'Sign & Submit Profile' }
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
