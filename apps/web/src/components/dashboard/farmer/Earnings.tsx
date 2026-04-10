import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, IndianRupee, PieChart, Filter } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function Earnings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/farmer/earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to load earnings", err);
      setData({ totalRevenue: 0, totalPlatformFees: 0, walletBalance: 0, transactions: [], monthlyEarnings: {} });
    } finally {
      setLoading(false);
    }
  };

  // Format monthly earnings for Recharts
  const chartData = data?.monthlyEarnings 
    ? Object.entries(data.monthlyEarnings).map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleString('en-US', { month: 'short' }),
        amount
      }))
    : [
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 52000 },
        { month: 'Mar', amount: 48000 },
        { month: 'Apr', amount: 61000 },
      ];

  if (loading) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Earnings & Financials</h2>
          <p className="text-slate-500 mt-1 font-medium">Track your revenue, wallet balance, and platform payouts.</p>
        </div>
        <button className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3 rounded-xl font-black text-sm hover:shadow-xl transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20">
          Withdraw Funds <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Balance and Stats */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6">
           <div className="col-span-2 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <h4 className="text-xs font-black text-green-100 uppercase tracking-widest">Total Net Wallet Balance</h4>
                    </div>
                    <p className="text-5xl font-black flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold">₹</span>
                      {(data?.walletBalance || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-green-100 font-medium">Available for withdrawal</p>
                 </div>
                 <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                    <Wallet size={32} />
                 </div>
              </div>
              <div className="mt-8 flex gap-4 relative z-10">
                 <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                    <p className="text-xs font-bold text-green-100 mb-2 flex items-center gap-1"><ArrowUpRight size={12} /> Total Revenue</p>
                    <p className="text-2xl font-black">₹{(data?.totalRevenue || 0).toLocaleString('en-IN')}</p>
                 </div>
                 <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                    <p className="text-xs font-bold text-green-100 mb-2 flex items-center gap-1"><ArrowDownLeft size={12} /> Platform Fees</p>
                    <p className="text-2xl font-black">₹{(data?.totalPlatformFees || 0).toLocaleString('en-IN')}</p>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
           </div>

           {/* Chart */}
           <div className="col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   <TrendingUp className="text-green-600" /> Revenue Growth
                </h3>
              </div>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                       <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                         {chartData.map((_, index) => (
                           <Cell key={index} fill={index === chartData.length - 1 ? '#10b981' : '#cbd5e1'} />
                         ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Recent Payouts */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-900">Recent Payouts</h3>
             <button className="text-slate-400 hover:text-slate-600"><Filter size={18} /></button>
           </div>
           
           <div className="space-y-4">
              {data?.transactions && data.transactions.length > 0 ? (
                data.transactions.slice(0, 6).map((item: any) => (
                  <div key={item.id} className="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-green-100 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                       <p className="text-sm font-black text-slate-900">Payment {item.status}</p>
                       <p className="text-sm font-black text-green-600">₹{item.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          {item.status === 'PAID' ? <CheckCircle size={12} className="text-green-500" /> : <Clock size={12} className="text-orange-500" />}
                          {new Date(item.createdAt).toLocaleDateString()}
                       </div>
                       <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">View Order</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <PieChart className="text-slate-200 mx-auto mb-3" size={48} />
                  <p className="text-slate-500 font-bold">No payouts recorded yet</p>
                </div>
              )}
           </div>
           {data?.transactions.length > 6 && (
             <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all">
               View All History
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
