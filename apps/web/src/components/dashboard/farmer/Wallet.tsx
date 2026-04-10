import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, CreditCard, Building, ShieldCheck, History, Plus, ChevronRight, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_WALLET_DATA = {
  balance: 285400,
  linkedBank: {
    bankName: 'HDFC Bank',
    accountNumber: '**** 1024',
    type: 'Savings',
    status: 'Verified'
  },
  recentActivity: [
    { id: 'W-001', type: 'INCOME', source: 'Order #ORD-7728', amount: 12500, date: new Date().toISOString(), status: 'SUCCESS' },
    { id: 'W-002', type: 'WITHDRAW', source: 'Bank Transfer', amount: 45000, date: new Date(Date.now() - 86400000).toISOString(), status: 'SUCCESS' },
    { id: 'W-003', type: 'INCOME', source: 'Escrow Release', amount: 84000, date: new Date(Date.now() - 172800000).toISOString(), status: 'SUCCESS' },
  ]
};

export default function Wallet() {
  const [wallet, setWallet] = useState(MOCK_WALLET_DATA);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = (type: 'TOPUP' | 'WITHDRAW') => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return toast.error("Please enter a valid amount");
    if (type === 'WITHDRAW' && val > wallet.balance) return toast.error("Insufficient balance");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setWallet(prev => ({
        ...prev,
        balance: type === 'TOPUP' ? prev.balance + val : prev.balance - val,
        recentActivity: [
          {
            id: `W-LAB-${Math.floor(Math.random() * 900) + 100}`,
            type,
            source: type === 'TOPUP' ? 'Wallet Top-up' : 'Bank Withdrawal',
            amount: val,
            date: new Date().toISOString(),
            status: 'SUCCESS'
          },
          ...prev.recentActivity
        ]
      }));
      toast.success(`${type === 'TOPUP' ? 'Top-up' : 'Withdrawal'} of ₹${val.toLocaleString()} successful!`);
      setIsTopUpOpen(false);
      setIsWithdrawOpen(false);
      setAmount('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">AgriTrust Wallet</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage your digital funds, bank links, and secure payouts.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsWithdrawOpen(true)}
            className="px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-black text-sm text-slate-700 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm"
          >
            <ArrowUpRight size={18} /> Withdraw
          </button>
          <button 
            onClick={() => setIsTopUpOpen(true)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
          >
            <Plus size={18} /> Top Up
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Wallet Overview */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden cursor-pointer"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                    <WalletIcon size={28} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Digital Vault</p>
                    <h4 className="text-4xl font-black italic tracking-tighter">AgriTrust Pay</h4>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> SECURE VAULT ACTIVE
                  </div>
                </div>
              </div>
              
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-4xl font-bold text-slate-500">₹</span>
                <h3 className="text-8xl font-black tracking-tighter drop-shadow-2xl">
                  {wallet.balance.toLocaleString('en-IN')}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-white/5 backdrop-blur-md rounded-[28px] p-6 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Inflow</p>
                       <p className="text-2xl font-black text-emerald-400 tracking-tight">+₹1,24,000</p>
                    </div>
                    <ArrowDownLeft className="text-emerald-500 group-hover:scale-110 transition-transform" size={24} />
                 </div>
                 <div className="bg-white/5 backdrop-blur-md rounded-[28px] p-6 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety Rating</p>
                       <div className="flex items-center gap-2 text-blue-400 font-extrabold text-2xl tracking-tight">AA+ Secure</div>
                    </div>
                    <ShieldCheck className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                 </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] -ml-24 -mb-24"></div>
          </motion.div>

          <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 <History size={26} className="text-slate-400" /> Transaction History
               </h3>
               <div className="flex bg-slate-100 p-1.5 rounded-xl gap-2">
                 <button className="px-5 py-1.5 bg-white shadow-sm rounded-lg text-xs font-black text-slate-900 transition-all">All</button>
                 <button className="px-5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">Income</button>
                 <button className="px-5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">Payouts</button>
               </div>
            </div>
            
            <div className="space-y-4">
              {wallet.recentActivity.map((item) => (
                <motion.div 
                  key={item.id} 
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedTxn(item)}
                  className="flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:bg-white hover:border-emerald-200 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${item.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                      {item.type === 'INCOME' ? <ArrowDownLeft size={28} /> : <ArrowUpRight size={28} />}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight">{item.source}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black tracking-tighter ${item.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {item.type === 'INCOME' ? '+' : '-'}₹{item.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                       <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase border border-blue-100">ID: {item.id}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 text-sm font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              View Detailed Ledgers <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900">Linked Bank</h3>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm flex items-center gap-2">
                  <CheckCircle2 size={14} /> VERIFIED
                </span>
             </div>
             
             <motion.div 
               whileHover={{ y: -4 }}
               onClick={() => setIsBankModalOpen(true)}
               className="p-8 bg-slate-900 rounded-[32px] shadow-2xl relative overflow-hidden group cursor-pointer"
             >
                <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 shadow-lg flex items-center justify-center border border-white/20">
                         <Building className="text-white" size={28} />
                      </div>
                      <div>
                        <p className="font-black text-white text-lg tracking-tight">{wallet.linkedBank.bankName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{wallet.linkedBank.type} ACCOUNT</p>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-3xl font-black text-white tracking-[0.2em]">{wallet.linkedBank.accountNumber}</p>
                      <button className="text-[10px] font-black text-emerald-400 uppercase hover:text-emerald-300 transition-colors mt-4">Revoke or Change Bank</button>
                   </div>
                </div>
                {/* Visual Chip */}
                <div className="absolute top-8 right-8 w-12 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-lg opacity-80"></div>
                <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
             </motion.div>

             <button 
               onClick={() => setIsCardModalOpen(true)}
               className="w-full mt-6 flex items-center justify-between p-5 bg-white border-2 border-dashed border-slate-200 text-slate-500 rounded-[28px] hover:border-slate-400 hover:text-slate-800 transition-all font-black text-sm uppercase tracking-widest group"
             >
                Add Secondary Card <Plus size={20} className="group-hover:rotate-90 transition-transform" />
             </button>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-[40px] p-8 flex flex-col items-center text-center shadow-lg shadow-amber-900/5">
             <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-amber-600 mb-6 shadow-xl border border-amber-100">
                <ShieldCheck size={36} />
             </div>
             <h4 className="text-2xl font-black text-amber-900 mb-2 tracking-tight">AgriTrust Assurance</h4>
             <p className="text-amber-700 font-bold text-sm leading-relaxed px-2">
               Your funds are protected under the DigiCrops Reserve Protocol. First ₹5,00,000 insured against platform defaults.
             </p>
             <button className="mt-6 text-xs font-black text-amber-900 underline underline-offset-4 uppercase tracking-widest hover:text-amber-700 transition-colors">Learn about safety &rarr;</button>
          </div>
        </div>
          {/* Action Modals */}
      <AnimatePresence>
        {(isTopUpOpen || isWithdrawOpen) && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
               className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
             >
                <button onClick={() => { setIsTopUpOpen(false); setIsWithdrawOpen(false); }} className="absolute top-8 right-8 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center transition-colors">
                  <X size={20} />
                </button>
                
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">
                  {isTopUpOpen ? 'Top Up Wallet' : 'Withdraw Funds'}
                </h2>
                <p className="text-slate-500 font-medium mb-8">
                  {isTopUpOpen ? 'Add funds to your digital vault for instant transactions.' : 'Transfer balance to your primary verified bank account.'}
                </p>

                <div className="space-y-6">
                   <div className="bg-slate-50 rounded-[28px] p-8 border-2 border-slate-100">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">Amount to {isTopUpOpen ? 'Deposit' : 'Withdraw'} (₹)</label>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent text-6xl font-black text-slate-900 outline-none placeholder:text-slate-200 tracking-tighter"
                      />
                   </div>

                   <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-[24px] border border-blue-100">
                      <AlertCircle size={24} className="text-blue-500 shrink-0" />
                      <p className="text-xs font-bold text-blue-700 leading-relaxed">
                        Funds will be processed via {isTopUpOpen ? 'Encrypted UPI' : 'Verified IMPS'} gateway. ETA: <b>Instant Payout</b>.
                      </p>
                   </div>

                   <button 
                     onClick={() => handleAction(isTopUpOpen ? 'TOPUP' : 'WITHDRAW')}
                     disabled={loading}
                     className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 hover:scale-[1.02] active:scale-95"
                   >
                     {loading ? (
                        <div className="h-6 w-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                     ) : (
                        <>{isTopUpOpen ? <Plus size={28} /> : <ArrowUpRight size={28} />} {isTopUpOpen ? 'Confirm Deposit' : 'Confirm Withdrawal'}</>
                     )}
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}

        {/* Add Card Subfeature */}
        {isCardModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
               className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative"
             >
                <button onClick={() => setIsCardModalOpen(false)} className="absolute top-8 right-8 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center"><X size={20} /></button>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm"><CreditCard size={32} /></div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Add Secondary Card</h2>
                <p className="text-slate-500 font-medium mb-8">Link a secondary Rupay/Visa card for instant input purchases.</p>
                <div className="space-y-4">
                   <input placeholder="Cardholder Name" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
                   <input placeholder="Card Number (0000 0000 0000 0000)" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
                   <div className="grid grid-cols-2 gap-4">
                      <input placeholder="MM/YY" className="bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
                      <input placeholder="CVV" className="bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
                   </div>
                   <button onClick={() => { toast.success("Card verification pending..."); setIsCardModalOpen(false); }} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all mt-4">Link Securely</button>
                </div>
             </motion.div>
          </motion.div>
        )}

        {/* Transaction Detail Subfeature (Receipt) */}
        {selectedTxn && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}
               className="bg-white rounded-[40px] p-12 max-w-md w-full shadow-2xl relative border-t-[12px] border-emerald-500"
             >
                <div className="text-center mb-8">
                   <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 border-4 border-white shadow-xl">
                      <CheckCircle2 size={48} />
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment Successful</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Receipt for Transaction</p>
                </div>
                
                <div className="bg-slate-50 rounded-[32px] p-8 space-y-4 mb-8">
                   <div className="flex justify-between border-b border-slate-200 pb-4">
                      <span className="text-slate-400 font-bold text-sm">Amount Paid</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">₹{selectedTxn.amount.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between py-1">
                      <span className="text-slate-400 font-bold text-sm">Source</span>
                      <span className="text-slate-800 font-black text-sm">{selectedTxn.source}</span>
                   </div>
                   <div className="flex justify-between py-1">
                      <span className="text-slate-400 font-bold text-sm">Date</span>
                      <span className="text-slate-800 font-black text-sm">{new Date(selectedTxn.date).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between py-1 border-t border-slate-200 pt-4">
                      <span className="text-slate-400 font-bold text-sm">Reference ID</span>
                      <span className="text-slate-400 font-black text-xs">{selectedTxn.id}</span>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => { toast.info("Downloading PDF Receipt..."); }} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:shadow-xl transition-all h-14 uppercase tracking-widest">Download</button>
                   <button onClick={() => setSelectedTxn(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all h-14 uppercase tracking-widest">Close</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
  );
}
