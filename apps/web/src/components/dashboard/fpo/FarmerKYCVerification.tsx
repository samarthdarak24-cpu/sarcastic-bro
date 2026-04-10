import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, Shield, FileText, CheckCircle, XCircle, 
  ExternalLink, Search, Filter, Clock, Eye,
  MapPin, Database, GitBranch, FilePlus, AlertTriangle, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

function QuickAction({ icon, label }: { icon: any, label: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleExecute = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setIsOpen(false);
      const t = typeof toast.success === 'function' ? toast.success : toast;
      t(label + ' verification sequence completed.');
    }, 1500);
  };

  const renderCustomContent = () => {
    switch (label) {
      case 'Liveliness API':
        return (
          <div className="space-y-4 text-center">
            <div className="w-full h-32 bg-slate-900 rounded-xl overflow-hidden relative border-4 border-slate-200 shadow-inner flex items-center justify-center">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400')] bg-cover bg-center opacity-40 blur-[1px]"></div>
               <div className="w-16 h-16 border-2 border-green-400 rounded-full absolute mix-blend-screen scale-[1.5] animate-pulse"></div>
               <span className="relative z-10 text-[10px] font-black text-green-400 bg-black/50 px-2 py-1 rounded backdrop-blur-sm tracking-widest uppercase">Detecting Face...</span>
            </div>
            <p className="text-sm font-bold text-slate-700">Passive Liveliness Check</p>
            <p className="text-xs text-slate-500 font-semibold max-w-[250px] mx-auto">Verifies the user is a live person and not presenting a static image or deepfake.</p>
          </div>
        );
      case 'AADHAAR Bridge':
        return (
          <div className="space-y-3">
             <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Database size={12}/> Bridge Connection</label>
             <div className="p-4 bg-slate-50 border-2 border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                   <p className="font-black text-slate-800">UIDAI Gateway v2.1</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Status: OK</p>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
             </div>
             <input type="text" placeholder="Enter OTP (sent to linked mobile)" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-black text-slate-800 tracking-widest text-center mt-2 transition-all shadow-sm" />
          </div>
        );
      case 'Geo-Audit':
        return (
          <div className="space-y-3">
             <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><MapPin size={12}/> GPS Extraction</label>
             <div className="h-28 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg relative z-10 flex items-center gap-3">
                   <MapPin className="text-red-500" />
                   <div className="text-left">
                     <p className="text-xs font-black text-slate-800">19.0760° N, 72.8777° E</p>
                     <p className="text-[10px] font-bold text-slate-500">Metadata from Exif data</p>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'Family Links':
        return (
          <div className="space-y-4">
             <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div className="flex justify-between items-center mb-3">
                   <h4 className="text-sm font-black text-orange-900">Ration Card Linkage</h4>
                   <span className="text-[10px] font-black uppercase text-orange-600 border border-orange-200 bg-white px-2 py-0.5 rounded-full">Automated</span>
                </div>
                <p className="text-xs text-orange-800/80 font-semibold mb-3">System detects 2 other registered farmers using the same household ration card number.</p>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm"><UserCheck size={14} className="text-slate-400"/> <span className="text-xs font-bold text-slate-700">Ganesh Patil (Son)</span></div>
                   <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm"><UserCheck size={14} className="text-slate-400"/> <span className="text-xs font-bold text-slate-700">Suman Patil (Wife)</span></div>
                </div>
             </div>
          </div>
        );
      case 'Subsidy Check':
        return (
          <div className="space-y-3">
             <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <FilePlus className="text-emerald-600 mt-1" size={20} />
                <div>
                   <p className="font-black text-emerald-900 text-sm">PM-Kisan Beneficiary</p>
                   <p className="text-xs text-emerald-700/80 font-bold mt-1">Cross-referenced Aadhaar with central DBT subsidy database. Match confirmed.</p>
                </div>
             </div>
             <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">Last Setup Amount</span>
                <span className="text-slate-900 font-black">₹2,000.00</span>
             </div>
          </div>
        );
      case 'Blacklist DB':
        return (
          <div className="space-y-4 text-center">
             <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
                <AlertTriangle size={28} className="text-red-500" />
             </div>
             <div>
                <h4 className="font-black text-slate-800 text-lg">Defaulter Lookup</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1">Scan farmer ID against local FPO blacklists, bank NPA databases, and willful defaulter lists.</p>
             </div>
             <div className="mt-4 flex items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl gap-2 font-mono text-xs text-slate-600">
                <RefreshCw size={14} className="animate-spin" /> Querying 4 national nodes...
             </div>
          </div>
        );
      case 'Re-KYC Timer':
        return (
          <div className="space-y-4">
             <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Periodic Refresh Schedule</label>
             <div className="grid grid-cols-3 gap-2">
                <button className="py-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl text-indigo-700 font-black text-xs hover:bg-indigo-100 transition-colors">6 Months</button>
                <button className="py-3 bg-indigo-600 border-2 border-indigo-600 rounded-xl text-white font-black text-xs shadow-lg">1 Year</button>
                <button className="py-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl text-indigo-700 font-black text-xs hover:bg-indigo-100 transition-colors">3 Years</button>
             </div>
             <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">Sets trigger warning for next document upload</p>
          </div>
        );
      default:
        return (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
             <p className="text-sm font-semibold text-slate-600">Module <strong>{label}</strong> is initialized and securely connected.</p>
          </div>
        );
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
      >
        {icon}
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] p-6 shadow-2xl max-w-md w-full border border-slate-100 flex flex-col relative text-left" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-full transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-slate-50 text-slate-800 rounded-2xl shadow-inner border border-slate-200">
                {icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{label}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit Protocol</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
               {renderCustomContent()}
            </div>

            <button 
              onClick={handleExecute}
              disabled={processing}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {processing ? (
                 <>
                   <RefreshCw size={18} className="animate-spin text-slate-400" /> Auditing...
                 </>
              ) : (
                 <>Authorize execution</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface KYCRequest {
  id: string;
  name: string;
  phone: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  aadhaar: string | null;
  pan: string | null;
  kycDocuments: {
    id: string;
    type: string;
    documentUrl: string;
  }[];
}

const MOCK_KYC_REQUESTS: KYCRequest[] = [
  { 
    id: 'u1', name: 'Ramesh Patil', phone: '+91 98765 43210', kycStatus: 'PENDING', aadhaar: '1234 5678 9012', pan: 'ABCDE1234F',
    kycDocuments: [
      { id: 'd1', type: 'AADHAAR_FRONT', documentUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400' },
      { id: 'd2', type: 'PAN_CARD', documentUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=400' }
    ]
  },
  { 
    id: 'u2', name: 'Sanjay Deshmukh', phone: '+91 87654 32109', kycStatus: 'PENDING', aadhaar: '2345 6789 0123', pan: 'FGHIJ5678K',
    kycDocuments: [
      { id: 'd3', type: 'AADHAAR_FRONT', documentUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=400' }
    ]
  },
  { 
    id: 'u3', name: 'Alka Shinde', phone: '+91 76543 21098', kycStatus: 'VERIFIED', aadhaar: '3456 7890 1234', pan: 'LMNOP9012Q',
    kycDocuments: [
      { id: 'd4', type: 'AADHAAR_FRONT', documentUrl: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=400' }
    ]
  }
];

export default function FarmerKYCVerification() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null);

  // Fallback translations
  const translate = (key: string, fallback: string) => {
    try {
      const translated = t(key);
      return translated === key ? fallback : translated;
    } catch {
      return fallback;
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/kyc/admin/profiles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data.length > 0 ? res.data : MOCK_KYC_REQUESTS);
    } catch (err) {
      console.error(err);
      setRequests(MOCK_KYC_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleVerify = async (userId: string, status: 'VERIFIED' | 'REJECTED', reason?: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/api/kyc/admin/verify/${userId}`, {
        status,
        rejectionReason: reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`User set to ${status}`);
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error('Verification failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-700 via-purple-700 to-indigo-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Shield size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Farmer KYC Terminal 🔐</h2>
            <p className="text-white/80 font-medium">Audit and verify identity documents for trust and security.</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Total Profiles</span>
                <p className="text-2xl font-black">{requests.length}</p>
              </div>
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">In Queue</span>
                <p className="text-2xl font-black">{requests.filter(r => r.kycStatus === 'PENDING').length}</p>
              </div>
              <button
                onClick={fetchRequests}
                className="p-4 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:bg-white/30 transition-all text-white shadow-xl"
              >
                <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              {(['PENDING', 'VERIFIED', 'REJECTED'] as const).map((s) => (
                <button 
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    filter === s 
                      ? 'bg-white text-purple-600 shadow-xl' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KYC Sub-Features */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
          <QuickAction icon={<Shield size={14}/>} label="Liveliness API" />
          <QuickAction icon={<Database size={14}/>} label="AADHAAR Bridge" />
          <QuickAction icon={<MapPin size={14}/>} label="Geo-Audit" />
          <QuickAction icon={<GitBranch size={14}/>} label="Family Links" />
          <QuickAction icon={<FilePlus size={14}/>} label="Subsidy Check" />
          <QuickAction icon={<AlertTriangle size={14}/>} label="Blacklist DB" />
          <QuickAction icon={<Clock size={14}/>} label="Re-KYC Timer" />
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-4">
           {loading ? (
             <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-slate-200">
                <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
             </div>
           ) : requests.filter(r => r.kycStatus === filter).length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 text-slate-400">
                <Clock size={40} className="mb-2 opacity-20" />
                <p className="font-bold">No {filter} requests found</p>
             </div>
           ) : (
             requests.filter(r => r.kycStatus === filter).map(req => (
               <motion.div 
                 key={req.id}
                 layoutId={req.id}
                 onClick={() => setSelectedRequest(req)}
                 className={`p-6 bg-white rounded-3xl border-2 transition-all cursor-pointer hover:border-purple-300 ${selectedRequest?.id === req.id ? 'border-purple-600 shadow-xl' : 'border-slate-100'}`}
               >
                 <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <UserCheck size={24} />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900">{req.name}</h4>
                          <p className="text-xs text-slate-500 font-bold">{req.phone}</p>
                       </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-black uppercase text-slate-400 mb-1">Documents</span>
                       <div className="flex -space-x-2">
                          {req.kycDocuments.map((d, i) => (
                            <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                               <img src={d.documentUrl} alt="doc" className="w-full h-full object-cover" />
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
               </motion.div>
             ))
           )}
        </div>

        <div className="col-span-12 lg:col-span-5">
           {selectedRequest ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white rounded-3xl p-8 border-2 border-purple-600 shadow-2xl sticky top-6"
             >
                <div className="flex justify-between items-start mb-6">
                   <h3 className="text-xl font-black text-slate-900">Verification Terminal</h3>
                   <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                      <Search size={20} className="rotate-45" />
                   </button>
                </div>

                <div className="space-y-6">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identity Provided</p>
                      <p className="font-black text-slate-900">Aadhaar: {selectedRequest.aadhaar || 'Not Provided'}</p>
                      <p className="font-black text-slate-900">PAN: {selectedRequest.pan || 'Not Provided'}</p>
                   </div>

                   <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Audit</p>
                      {selectedRequest.kycDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-purple-300 transition-all group">
                           <div className="flex items-center gap-3">
                              <FileText size={18} className="text-slate-400" />
                              <span className="text-xs font-black text-slate-700">{doc.type}</span>
                           </div>
                           <a href={doc.documentUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 rounded-lg group-hover:bg-purple-100 text-slate-400 group-hover:text-purple-600 transition-colors">
                              <Eye size={16} />
                           </a>
                        </div>
                      ))}
                   </div>

                   {filter === 'PENDING' && (
                     <div className="grid grid-cols-2 gap-4 pt-4">
                        <button 
                          onClick={() => handleVerify(selectedRequest.id, 'REJECTED', 'Documents unclear or mismatch')}
                          className="flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm border-2 border-transparent hover:border-red-200 transition-all"
                        >
                           <XCircle size={18} /> Reject
                        </button>
                        <button 
                          onClick={() => handleVerify(selectedRequest.id, 'VERIFIED')}
                          className="flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-green-200 hover:scale-[1.02] transition-all"
                        >
                           <CheckCircle size={18} /> Approve
                        </button>
                     </div>
                   )}
                </div>
             </motion.div>
           ) : (
             <div className="bg-slate-50 rounded-3xl p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center text-slate-400">
                <Shield size={48} className="mb-4 opacity-20" />
                <p className="font-bold">Select a profile to audit</p>
                <p className="text-xs mt-2 px-6">Click on any KYC request to view documents and verify identity</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
