'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Lock, Unlock, Clock, MapPin, 
  CheckCircle2, AlertTriangle, FileText, ArrowRight,
  TrendingDown, Check, Briefcase, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

type Contract = {
  id: string;
  backendId?: string;
  buyerName: string;
  crop: string;
  amount: string;
  status: string;
  progress: number;
  date: string;
  milestones: any[];
}

const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'ESC-7829-AF',
    buyerName: 'AgroCorp Enterprises',
    crop: 'Premium Saffron (10kg)',
    amount: '₹3,50,000',
    status: 'IN_TRANSIT',
    progress: 65,
    date: '10 Apr 2026',
    milestones: [
       { label: 'Funds Locked', done: true, time: '8 Apr, 10:00 AM' },
       { label: 'Quality Verification', done: true, time: '9 Apr, 02:30 PM' },
       { label: 'Logistics Transit', done: false, time: 'In Progress' },
       { label: 'Buyer Acceptance', done: false, time: 'Pending' },
    ]
  }
];

export default function Escrow() {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED' | 'DISPUTED'>('ACTIVE');
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingRelease, setIsProcessingRelease] = useState(false);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:3001/api/payments/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && data.payments && data.payments.length > 0) {
        const liveContracts = data.payments.map((p: any) => {
           const isComplete = p.status === 'COMPLETED';
           const isDisputed = p.status === 'FAILED';
           
           return {
             id: `ESC-${p.transactionId ? p.transactionId.substring(p.transactionId.length - 8).toUpperCase() : p.id.substring(0,8).toUpperCase()}`,
             backendId: p.id,
             buyerName: p.buyer?.name || 'Verified Buyer',
             crop: `Order #${p.orderId || 'TRNX'}`,
             amount: `₹${p.amount.toLocaleString()}`,
             status: isComplete ? 'COMPLETED' : isDisputed ? 'DISPUTED' : 'LOCKED',
             progress: isComplete ? 100 : isDisputed ? 0 : 25,
             date: new Date(p.createdAt).toLocaleDateString(),
             milestones: [
               { label: 'Funds Locked', done: true, time: new Date(p.createdAt).toLocaleDateString() },
               { label: 'Quality Verification', done: isComplete, time: isComplete ? 'Done' : 'Pending' },
               { label: 'Logistics Transit', done: isComplete, time: isComplete ? 'Done' : 'Pending' },
               { label: 'Buyer Acceptance', done: isComplete, time: isComplete ? 'Done' : 'Pending' },
             ]
           };
        });
        setContracts(liveContracts);
        setSelectedContract(liveContracts[0]);
      } else {
        // Fallback to mock if entirely empty (useful for demo presentation)
        setContracts(MOCK_CONTRACTS);
        setSelectedContract(MOCK_CONTRACTS[0]);
      }
    } catch (err) {
      console.error("Failed to load escrow history", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleEarlyRelease = async () => {
    if (!selectedContract?.backendId) {
      // Simulate the workflow for hackathon demo if using mock data
      setIsProcessingRelease(true);
      setTimeout(() => {
        setIsProcessingRelease(false);
        toast.success('Funds Successfully Directed to your Bank Interface! (Demo Mode)');
        
        const updatedContract = {
           ...selectedContract!,
           status: 'COMPLETED',
           progress: 100,
           milestones: selectedContract!.milestones.map(m => ({...m, done: true, time: new Date().toLocaleTimeString()}))
        };
        
        setContracts(prev => prev.map(c => c.id === selectedContract?.id ? updatedContract : c));
        setSelectedContract(updatedContract);
      }, 1500);
      return;
    }
    
    setIsProcessingRelease(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/payments/early-release', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({ paymentId: selectedContract.backendId })
      });
      const data = await res.json();
      
      if (data.success) {
         toast.success('Funds Successfully Directed to your Bank Interface!');
         fetchPayments(); // Refresh list to change status to COMPLETED
      } else {
         toast.error(data.message || 'Failed to release funds');
      }
    } catch (err) {
       toast.error('Network error during fund release');
    } finally {
       setIsProcessingRelease(false);
    }
  };

  const filteredContracts = contracts.filter(c => {
    if (activeTab === 'ACTIVE') return c.status !== 'COMPLETED' && c.status !== 'DISPUTED';
    return c.status === activeTab;
  });
  
  // Need to auto-select proper contract if selection becomes hidden
  useEffect(() => {
    if (filteredContracts.length > 0 && (!selectedContract || !filteredContracts.find(c => c.id === selectedContract.id))) {
       setSelectedContract(filteredContracts[0]);
    } else if (filteredContracts.length === 0) {
       setSelectedContract(null);
    }
  }, [activeTab, contracts]);

  const totalLocked = contracts.filter(c => c.status !== 'COMPLETED' && c.status !== 'DISPUTED')
                               .reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '')), 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-[32px] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl"
      >
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Lock size={200} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                     <ShieldCheck className="text-emerald-400" size={24} />
                  </div>
                  <span className="text-emerald-400 font-black tracking-widest text-sm uppercase">AgriTrust SecureVault</span>
               </div>
               <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">Escrow Payments.</h1>
               <p className="text-slate-400 font-medium max-w-xl text-lg">
                 100% Guaranteed Payouts. Funds are locked by the buyer upfront and released automatically when your crop reaches them safely.
               </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 min-w-[280px]">
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Locked Value</p>
               <h2 className="text-4xl font-black text-white mb-2">₹{totalLocked.toLocaleString()}</h2>
               <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-400/10 w-fit px-3 py-1 rounded-full">
                  <Unlock size={14} /> {contracts.filter(c => c.status !== 'COMPLETED' && c.status !== 'DISPUTED').length} Contracts Active
               </div>
            </div>
         </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Sidebar List */}
         <div className="lg:col-span-5 bg-white rounded-[32px] p-6 shadow-xl border border-slate-200">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
               {(['ACTIVE', 'COMPLETED', 'DISPUTED'] as const).map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${activeTab === tab ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <div className="space-y-4">
               {isLoading ? (
                  <div className="p-8 flex justify-center items-center">
                     <Loader2 className="animate-spin text-indigo-500" size={32} />
                  </div>
               ) : filteredContracts.length === 0 ? (
                 <div className="p-8 text-center text-slate-400">
                    <Briefcase size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="font-bold">No {activeTab.toLowerCase()} contracts</p>
                 </div>
               ) : (
                 filteredContracts.map(contract => (
                   <div 
                     key={contract.id} 
                     onClick={() => setSelectedContract(contract)}
                     className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedContract?.id === contract.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                   >
                      <div className="flex justify-between items-start mb-3">
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{contract.id}</p>
                            <h4 className="font-black text-slate-900">{contract.buyerName}</h4>
                         </div>
                         <span className="font-black text-indigo-700">{contract.amount}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-600 mb-4">{contract.crop}</p>
                      
                      <div className="flex items-center gap-3 mt-4">
                         <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${contract.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{width: `${contract.progress}%`}}></div>
                         </div>
                         <span className="text-[10px] font-black text-slate-500">{contract.progress}%</span>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         {/* Detail View */}
         <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
               {selectedContract ? (
                 <motion.div
                   key={selectedContract.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-200"
                 >
                    <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-8">
                       <div>
                          <div className="flex items-center gap-2 mb-3">
                             <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">Smart Contract {selectedContract.id}</span>
                             <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">{selectedContract.date}</span>
                          </div>
                          <h2 className="text-3xl font-black text-slate-900">{selectedContract.crop}</h2>
                          <p className="text-slate-500 font-medium mt-1">Purchased by {selectedContract.buyerName}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Locked Amount</p>
                          <h3 className="text-4xl font-black text-emerald-600">{selectedContract.amount}</h3>
                       </div>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><Clock size={20} className="text-indigo-500" /> Payment Release Milestones</h4>
                    
                    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-1/2 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                       {selectedContract.milestones.map((ms, idx) => (
                         <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8 min-h-[60px]">
                           <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-slate-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                              {ms.done ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Lock size={18} className="text-slate-300" />}
                           </div>
                           <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border-2 transition-all ${ms.done ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                              <h5 className={`font-black mb-1 ${ms.done ? 'text-emerald-900' : 'text-slate-400'}`}>{ms.label}</h5>
                              <p className={`text-xs font-bold ${ms.done ? 'text-emerald-600' : 'text-slate-400'}`}>{ms.time}</p>
                           </div>
                         </div>
                       ))}
                    </div>

                    {selectedContract.status === 'COMPLETED' ? (
                       <div className="mt-8 p-6 bg-emerald-50 rounded-2xl flex items-center justify-between border border-emerald-200">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Check size={24} /></div>
                             <div>
                                <h4 className="font-black text-emerald-900">Funds Released to Bank</h4>
                                <p className="text-xs font-bold text-emerald-700 mt-1">Transaction UTR: HDFC{Math.random().toString().substring(2, 10).toUpperCase()}</p>
                             </div>
                          </div>
                       </div>
                    ) : (
                       <div className="mt-8 p-6 bg-slate-50 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between items-center border-slate-200">
                          <div className="flex items-start gap-3">
                             <AlertTriangle size={24} className="text-amber-500 shrink-0" />
                             <p className="text-sm font-semibold text-slate-600 leading-snug">
                               Funds are securely locked in the AgriTrust Escrow account. They will be transferred to your registered bank account the moment the buyer accepts delivery.
                             </p>
                          </div>
                          <button 
                             onClick={handleEarlyRelease}
                             disabled={isProcessingRelease}
                             className={`shrink-0 whitespace-nowrap px-6 py-3 bg-indigo-600 text-white rounded-xl font-black transition-all hover:bg-indigo-700 flex items-center gap-2 ${isProcessingRelease ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                             {isProcessingRelease ? <Loader2 className="animate-spin" size={20} /> : 'Request Early Release'}
                          </button>
                       </div>
                    )}
                 </motion.div>
               ) : (
                 <div className="bg-white rounded-[32px] p-8 border border-slate-200 text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[400px]">
                    <Lock size={48} className="mb-4 opacity-20" />
                    <h3 className="text-xl font-bold">No Contract Selected</h3>
                    <p>Select a contract from the sidebar to view milestones.</p>
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
