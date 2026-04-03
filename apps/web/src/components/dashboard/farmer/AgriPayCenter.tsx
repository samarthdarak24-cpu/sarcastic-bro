"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Download,
  Zap,
  MoreVertical,
  Search,
  CheckCircle,
  XCircle,
  Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { paymentService } from "@/services/paymentService";
import toast from "react-hot-toast";

export function AgriPayCenter() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getHistory();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const handleEarlyPaymentRequest = async (paymentId: string) => {
    setRequestLoading(true);
    try {
      const res = await paymentService.requestEarlyRelease(paymentId);
      if (res.success) {
        toast.success(res.message);
        fetchPayments();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setRequestLoading(false);
    }
  };

  const totals = payments.reduce((acc, curr) => {
      if (curr.status === 'COMPLETED') acc.settled += curr.amount;
      if (curr.status === 'PENDING') acc.pending += curr.amount;
      return acc;
  }, { settled: 0, pending: 0 });

  return (
    <div className="space-y-10 animate-fade-in text-neut-900 border-neut-200 pb-20 px-4 max-w-[1800px] mx-auto">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <KPICard title="Settled Balance" value={`₹${totals.settled.toLocaleString()}`} icon={<CreditCard />} badge="TOTAL PAID" tone="brand" />
        <KPICard title="Escrow Payouts" value={`₹${totals.pending.toLocaleString()}`} icon={<Clock size={24} />} badge="WAITING" tone="amber" />

        <Card className="border-none shadow-startup-medium bg-startup-gradient text-white relative overflow-hidden flex flex-col justify-center min-h-[220px]">
            <div className="gradient-blur top-0 right-0 opacity-20" />
            <div className="p-10 relative z-10 text-center space-y-4">
                <Zap size={40} className="mx-auto mb-2 text-white animate-pulse shadow-glow-primary" />
                <div>
                   <h4 className="text-2xl font-black mb-1">Instant Liquidity</h4>
                   <p className="text-white/60 text-sm font-medium">Release pending funds before delivery.</p>
                </div>
                <Button 
                   onClick={() => payments.find(p => p.status === 'PENDING') && handleEarlyPaymentRequest(payments.find(p => p.status === 'PENDING').id)}
                   disabled={requestLoading || !payments.some(p => p.status === 'PENDING')}
                   className="w-full h-14 bg-white text-brand-primary hover:bg-white/90 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform"
                >
                   {requestLoading ? "Processing..." : "Request Early Payment"}
                </Button>
            </div>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-neut-100">
         <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Financial Ledger</h2>
            <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest leading-loose">AUDITED TRANSACTION HISTORY & SETTLEMENTS</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative group w-full lg:w-80">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-neut-400 group-focus-within:text-brand-primary" />
                <Input placeholder="Search transaction ID..." className="pl-14 h-14 border-neut-100 rounded-2xl bg-white shadow-sm focus:bg-white" />
            </div>
            <Button variant="outline" className="h-14 w-14 rounded-2xl p-0 border-neut-100 bg-white"><Filter size={20} /></Button>
            <Button variant="outline" className="h-14 w-14 rounded-2xl p-0 border-neut-100 bg-white"><Download size={20} /></Button>
         </div>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
                Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-24 bg-neut-50 rounded-3xl animate-pulse" />
                ))
            ) : payments.length > 0 ? (
                payments.map((pay) => (
                    <motion.div
                       key={pay.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-startup-soft border border-neut-50 flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-startup-medium transition-all"
                    >
                       <div className="flex items-center gap-8 w-full md:w-auto">
                          <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-startup-soft transition-all ${
                              pay.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-brand-primary/10 text-brand-primary'
                          }`}>
                             {pay.status === 'COMPLETED' ? <CheckCircle size={28} /> : <Clock size={28} />}
                          </div>
                          <div className="min-w-0">
                             <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-black text-xl text-neut-900 tracking-tight truncate max-w-[200px]">{pay.transactionId || pay.id}</h4>
                                <Badge tone={pay.status === 'COMPLETED' ? 'brand' : 'amber'} className="rounded-lg h-7 px-3 font-black text-[9px] uppercase tracking-widest">{pay.status}</Badge>
                             </div>
                             <p className="text-xs font-bold text-neut-500">Order Ref: <span className="text-brand-primary">ORD-{pay.orderId.substring(0,6)}</span> • {new Date(pay.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>

                       <div className="hidden lg:flex flex-col items-center px-10 border-x border-neut-50">
                          <p className="text-[10px] font-black text-neut-400 uppercase mb-1">Source</p>
                          <p className="font-bold text-neut-900 text-sm">{pay.buyer?.name || 'Direct Procurement'}</p>
                       </div>

                       <div className="flex items-center gap-12 justify-between w-full md:w-auto">
                          <div className="text-right">
                             <p className="text-[9px] font-black text-neut-400 mb-1">Settlement</p>
                             <h4 className="text-2xl font-black text-neut-900 tracking-tighter">₹{pay.amount.toLocaleString()}</h4>
                          </div>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-neut-50/50 hover:bg-brand-primary hover:text-white transition-all opacity-0 group-hover:opacity-100">
                             <Download size={22} />
                          </Button>
                       </div>
                    </motion.div>
                ))
            ) : (
                <div className="h-[400px] bg-white rounded-[3rem] flex flex-col items-center justify-center text-center p-12 border border-dashed border-neut-200">
                    <div className="h-20 w-20 bg-neut-50 rounded-[2rem] flex items-center justify-center text-neut-200 mb-6"><CreditCard size={40} /></div>
                    <h4 className="text-2xl font-black text-neut-900 mb-2">No Transactions Found</h4>
                    <p className="text-neut-500 font-medium max-w-sm mx-auto">Your financial ledger is currently empty. Complete your first listing to start receiving trade payments.</p>
                </div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, badge, tone }: any) {
  return (
    <Card className="border-none shadow-startup-soft bg-white p-10 rounded-[2.5rem] group hover:shadow-startup-medium transition-all transform hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-8">
          <div className="h-16 w-16 bg-neut-50 rounded-[1.5rem] flex items-center justify-center text-neut-300 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-startup-soft">
            {icon}
          </div>
          <Badge tone={tone} className="text-[10px] font-black uppercase px-3 py-1 rounded-lg">{badge}</Badge>
        </div>
        <p className="text-neut-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-4xl font-black text-neut-900 tracking-tight">{value}</h3>
      </CardContent>
    </Card>
  );
}
