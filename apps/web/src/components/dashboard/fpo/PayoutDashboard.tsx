'use client';

import { 
  DollarSign, TrendingUp, Calendar, Shield, 
  CheckCircle, RefreshCw, FileText, MoreHorizontal,
  CreditCard, ExternalLink, Package, Clock, AlertCircle,
  X, Download, Eye, ArrowUpRight, TrendingDown,
  ChevronRight, Building2, User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

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
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-sm"
      >
        {icon}
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-8 shadow-2xl max-w-md w-full border border-slate-100 flex flex-col relative text-left"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-all">
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                {icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{label}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Financial Service Module</p>
              </div>
            </div>
            
            <div className="space-y-5 mb-8">
               {needsInput ? (
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Input Parameters</label>
                   <input type="text" placeholder="Enter configuration value..." className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none text-sm font-black text-slate-800 transition-all bg-slate-50" />
                 </div>
               ) : (
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                   <div className="mt-0.5 text-emerald-500 bg-white p-2 rounded-lg shadow-sm">
                     <Shield size={18} />
                   </div>
                   <p className="text-sm font-bold text-slate-600 leading-relaxed">Verified FPO Node. This action for <strong>{label}</strong> is secured by AgriTrust Hub protocols.</p>
                 </div>
               )}
               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 italic text-[11px] font-bold text-amber-700">
                 System Note: All settlements are processed through smart-escrow contracts.
               </div>
            </div>

            <button 
              onClick={handleExecute}
              disabled={processing}
              className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
            >
              {processing ? (
                 <><RefreshCw className="animate-spin" size={20} /> Deploying...</>
              ) : (
                 <><CheckCircle size={20} /> Confirm Deployment</>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}

interface PayoutRecord {
  id: string;
  amount: number;
  platformFee: number;
  status: string;
  createdAt: string;
  paidAt?: string;
  orderId: string;
  farmer: { id: string; name: string; phone: string; bank?: string };
}

interface PayoutSummary {
  totalDistributed: number;
  totalPending: number;
  totalPlatformFees: number;
  totalFarmersPaid: number;
}

const MOCK_PAYOUTS: PayoutRecord[] = [
  { id: 'p1', amount: 15400, platformFee: 308, status: 'COMPLETED', createdAt: '2024-03-10T10:00:00Z', paidAt: '2024-03-10T14:00:00Z', orderId: 'ORD-7728-AZ', farmer: { id: 'f1', name: 'Ramesh Patil', phone: '+91 98765 43210', bank: 'SBI **** 1234' } },
  { id: 'p2', amount: 22000, platformFee: 440, status: 'PENDING', createdAt: '2024-03-11T09:00:00Z', orderId: 'ORD-9912-BX', farmer: { id: 'f2', name: 'Sanjay Deshmukh', phone: '+91 87654 32109', bank: 'HDFC **** 5566' } },
  { id: 'p3', amount: 8900, platformFee: 178, status: 'COMPLETED', createdAt: '2024-03-08T11:00:00Z', paidAt: '2024-03-09T10:00:00Z', orderId: 'ORD-1154-ST', farmer: { id: 'f3', name: 'Alka Shinde', phone: '+91 76543 21098', bank: 'Axis **** 9088' } },
  { id: 'p4', amount: 12500, platformFee: 250, status: 'PENDING', createdAt: '2024-03-12T14:30:00Z', orderId: 'ORD-3329-PN', farmer: { id: 'f4', name: 'Vijay Pawar', phone: '+91 91234 56789', bank: 'SBI **** 4321' } }
];

const MOCK_SUMMARY: PayoutSummary = {
  totalDistributed: 36800,
  totalPending: 34500,
  totalPlatformFees: 1258,
  totalFarmersPaid: 14
};

const CHART_DATA = [
  { name: 'Mon', payouts: 12000, fees: 240 },
  { name: 'Tue', payouts: 19000, fees: 380 },
  { name: 'Wed', payouts: 15400, fees: 308 },
  { name: 'Thu', payouts: 22000, fees: 440 },
  { name: 'Fri', payouts: 18000, fees: 360 },
  { name: 'Sat', payouts: 25000, fees: 500 },
  { name: 'Sun', payouts: 21000, fees: 420 },
];

export default function PayoutDashboard() {
  const [payouts, setPayouts] = useState<PayoutRecord[]>(MOCK_PAYOUTS);
  const [summary, setSummary] = useState<PayoutSummary | null>(MOCK_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<PayoutRecord | null>(null);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      // Demo delay
      await new Promise(r => setTimeout(r, 800));
      setPayouts(MOCK_PAYOUTS);
      setSummary(MOCK_SUMMARY);
      toast.success('Financial ledger updated');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayouts = payouts.filter(p => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  const sm = summary || { totalDistributed: 0, totalPending: 0, totalPlatformFees: 0, totalFarmersPaid: 0 };

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-700"
      >
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <DollarSign size={300} />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <TrendingUp size={32} />
               </div>
               <div>
                  <h2 className="text-4xl font-black mb-1">Financial Hub</h2>
                  <p className="text-slate-400 font-medium tracking-wide">AgriTrust Cooperative Settlement Gateway</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Distributed</p>
                <div className="flex items-end gap-2">
                   <p className="text-4xl font-black text-white">₹{sm.totalDistributed.toLocaleString()}</p>
                   <ArrowUpRight className="text-emerald-400 mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                </div>
                <p className="text-xs font-bold text-emerald-400/80 mt-2 flex items-center gap-1">
                   <CheckCircle size={12} /> {sm.totalFarmersPaid} Farmers Cleared
                </p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Escrow Pending</p>
                <p className="text-4xl font-black text-white">₹{sm.totalPending.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                   <p className="text-xs font-bold text-amber-500/80 tracking-wide uppercase">Awaiting Delivery</p>
                </div>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Platform Yield</p>
                <p className="text-4xl font-black text-white">₹{sm.totalPlatformFees.toLocaleString()}</p>
                <p className="text-xs font-bold text-slate-500 mt-2">Aggregated Commissions</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-10">
              <QuickAction icon={<CreditCard size={14}/>} label="Wallet Config" />
              <QuickAction icon={<Calendar size={14}/>} label="Payout Schedule" />
              <QuickAction icon={<Shield size={14}/>} label="Bank KYC Audit" />
              <QuickAction icon={<RefreshCw size={14}/>} label="Dispute Center" />
              <QuickAction icon={<FileText size={14}/>} label="Advanced Ledger" />
            </div>
          </div>

          <div className="w-full lg:w-[400px] h-[300px] bg-slate-900/50 backdrop-blur-sm rounded-[32px] p-6 border border-slate-700/50">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">7-Day Payout Trend</h4>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Payouts
                   </div>
                </div>
             </div>
             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="payouts" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPayout)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </motion.div>

      {/* ─── TRANSACTIONS LIST ─── */}
      <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50">
          <div>
             <h3 className="text-2xl font-black text-slate-900">Settlement Logs</h3>
             <p className="text-sm font-bold text-slate-500">Real-time status of all farmer payments</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex p-1.5 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
              {(['ALL', 'COMPLETED', 'PENDING'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === tab 
                      ? 'bg-slate-900 text-white shadow-xl scale-105' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button 
              onClick={fetchPayouts}
              className={`p-3 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 text-slate-600 shadow-sm transition-all ${loading ? 'opacity-50' : ''}`}
            >
               <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Farmer Profile</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Ref</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount (INR)</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Comm.</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8"><div className="h-6 bg-slate-100 rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredPayouts.map(p => (
                <tr 
                  key={p.id} 
                  onClick={() => setSelectedRecord(p)}
                  className="group hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
                        {p.farmer.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 group-hover:text-purple-700 transition-colors uppercase tracking-wide">{p.farmer.name}</p>
                        <p className="text-xs font-bold text-slate-400">{p.farmer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Package size={14} className="text-slate-300" />
                       <span className="text-xs font-black text-slate-500">#{p.orderId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <p className="text-lg font-black text-slate-900">₹{p.amount.toLocaleString()}</p>
                     <p className="text-[10px] font-bold text-slate-400">Total Settlement</p>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-slate-400 text-sm">₹{p.platformFee}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                       <Clock size={14} />
                       {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm ${
                      p.status === 'COMPLETED' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── RECORD DETAIL MODAL ─── */}
      <AnimatePresence>
         {selectedRecord && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
               onClick={() => setSelectedRecord(null)}
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }}
                  className="bg-white rounded-[40px] max-w-2xl w-full shadow-2xl relative overflow-hidden"
                  onClick={e => e.stopPropagation()}
               >
                  {/* Decorative Banner */}
                  <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600 p-8 flex items-end justify-between">
                     <div className="flex items-center gap-4 translate-y-12">
                        <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center p-1 border-4 border-white">
                           <div className="w-full h-full rounded-2xl bg-purple-100 flex items-center justify-center text-3xl font-black text-purple-600">
                             {selectedRecord.farmer.name[0]}
                           </div>
                        </div>
                        <div className="mb-2">
                           <h3 className="text-2xl font-black text-white">{selectedRecord.farmer.name}</h3>
                           <p className="text-purple-100 font-bold text-sm tracking-widest uppercase">Verified Farmer Partner</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedRecord(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                        <X size={20} />
                     </button>
                  </div>

                  <div className="p-8 pt-20">
                     <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Integrity</label>
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-sm font-black text-slate-900 mb-1">{selectedRecord.orderId}</p>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                                 <CheckCircle size={12} /> Escrow Released
                              </div>
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payout Method</label>
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-sm font-black text-slate-900 mb-1">{selectedRecord.farmer.bank}</p>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600">
                                 <Building2 size={12} /> IMPS Settlement
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-slate-900 rounded-[32px] p-8 text-white mb-8">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                           <span className="text-sm font-black text-slate-400 tracking-widest uppercase">Settlement Summary</span>
                           <Download size={18} className="text-slate-400 cursor-pointer hover:text-white" />
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-sm font-bold">
                              <span className="text-slate-400">Merchant Amount</span>
                              <span>₹{selectedRecord.amount.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm font-bold">
                              <span className="text-slate-400">AgriTrust Platform Fee (2%)</span>
                              <span className="text-rose-400">- ₹{selectedRecord.platformFee}</span>
                           </div>
                           <div className="flex justify-between items-center pt-4 border-t border-white/10">
                              <span className="text-lg font-black">Net Payout</span>
                              <span className="text-3xl font-black text-emerald-400">₹{(selectedRecord.amount - selectedRecord.platformFee).toLocaleString()}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <button className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all shadow-xl shadow-slate-200">
                           <FileText size={20} /> Generate PDF Receipt
                        </button>
                        <button className="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all">
                           Report Dispute
                        </button>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

function StatsCard({ label, value, sub, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group hover:shadow-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-emerald-600 transition-colors">{label}</p>
          <h3 className="text-4xl font-black text-slate-900 mb-2">{value}</h3>
          <p className="text-xs font-bold text-slate-500">{sub}</p>
        </div>
        <div className={`w-14 h-14 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg shadow-black/5`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
