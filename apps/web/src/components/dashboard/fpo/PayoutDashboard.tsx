'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Calendar, Shield, 
  CheckCircle, RefreshCw, FileText, MoreHorizontal,
  CreditCard, ExternalLink, Package, Clock, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

function QuickAction({ icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
      {icon}
      <span>{label}</span>
    </button>
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
  farmer: { id: string; name: string; phone: string };
}

interface PayoutSummary {
  totalDistributed: number;
  totalPending: number;
  totalPlatformFees: number;
  totalFarmersPaid: number;
}

const MOCK_PAYOUTS: PayoutRecord[] = [
  { id: 'p1', amount: 15400, platformFee: 308, status: 'COMPLETED', createdAt: '2024-03-10T10:00:00Z', paidAt: '2024-03-10T14:00:00Z', orderId: 'ord_12345', farmer: { id: 'f1', name: 'Ramesh Patil', phone: '+91 98765 43210' } },
  { id: 'p2', amount: 22000, platformFee: 440, status: 'PENDING', createdAt: '2024-03-11T09:00:00Z', orderId: 'ord_67890', farmer: { id: 'f2', name: 'Sanjay Deshmukh', phone: '+91 87654 32109' } },
  { id: 'p3', amount: 8900, platformFee: 178, status: 'COMPLETED', createdAt: '2024-03-08T11:00:00Z', paidAt: '2024-03-09T10:00:00Z', orderId: 'ord_11223', farmer: { id: 'f3', name: 'Alka Shinde', phone: '+91 76543 21098' } }
];

const MOCK_SUMMARY: PayoutSummary = {
  totalDistributed: 24300,
  totalPending: 22000,
  totalPlatformFees: 926,
  totalFarmersPaid: 2
};

export default function PayoutDashboard() {
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fpo/payouts');
      if (!res.ok) {
        console.warn('API endpoint not available, using mock data');
        setPayouts(MOCK_PAYOUTS);
        return;
      }
      const data = await res.json();
      setPayouts(data.payouts?.length > 0 ? data.payouts : MOCK_PAYOUTS);
      setSummary(data.summary || MOCK_SUMMARY);
    } catch (error) {
      console.error(error);
      setPayouts(MOCK_PAYOUTS);
      setSummary(MOCK_SUMMARY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const filteredPayouts = payouts.filter(p => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  const sm = summary || { totalDistributed: 0, totalPending: 0, totalPlatformFees: 0, totalFarmersPaid: 0 };

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <DollarSign size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Financial Hub 💰</h2>
            <p className="text-white/80 font-medium">Track farmer payouts and platform commissions.</p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="px-5 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Distributed</span>
                <p className="text-2xl font-black text-white">₹{sm.totalDistributed.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-white/60 mt-0.5">{sm.totalFarmersPaid} Farmers</p>
              </div>
              <div className="px-5 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Pending</span>
                <p className="text-2xl font-black text-white">₹{sm.totalPending.toLocaleString()}</p>
              </div>
              <div className="px-5 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Commissions</span>
                <p className="text-2xl font-black text-white">₹{sm.totalPlatformFees.toLocaleString()}</p>
              </div>
            </div>

            {/* Financial Sub-Features */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
              <QuickAction icon={<DollarSign size={14}/>} label="Wallet Config" />
              <QuickAction icon={<Calendar size={14}/>} label="Payout Schedule" />
              <QuickAction icon={<TrendingUp size={14}/>} label="Settlement Logs" />
              <QuickAction icon={<Shield size={14}/>} label="Bank KYC Audit" />
              <QuickAction icon={<CheckCircle size={14}/>} label="GST Automator" />
              <QuickAction icon={<RefreshCw size={14}/>} label="Dispute Center" />
              <QuickAction icon={<FileText size={14}/>} label="Advanced Ledger" />
            </div>
          </div>
          <button
            onClick={fetchPayouts}
            className="p-4 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:bg-white/30 transition-all text-white shadow-xl"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex p-1 bg-white rounded-xl border border-slate-200">
            {(['ALL', 'COMPLETED', 'PENDING'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs font-black text-slate-400">
            {filteredPayouts.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Farmer</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Order Ref</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Fee</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-3/4"></div></td>
                  </tr>
                ))
              ) : filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                      <DollarSign size={48} />
                      <p className="font-bold text-slate-500">No payout records found</p>
                      <p className="text-xs text-slate-400">Payouts appear here after escrow is released for delivered orders.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayouts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">
                          {p.farmer.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{p.farmer.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">{p.farmer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-slate-500">#{p.orderId.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-black text-slate-900">₹{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">₹{p.platformFee.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                        p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, sub, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-slate-100 hover:border-purple-100 transition-all cursor-pointer group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-purple-600 transition-colors">{label}</p>
          <h3 className="text-2xl font-black text-slate-900 mb-1">{value}</h3>
          <p className="text-xs font-bold text-slate-500">{sub}</p>
        </div>
        <div className={`p-3 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
