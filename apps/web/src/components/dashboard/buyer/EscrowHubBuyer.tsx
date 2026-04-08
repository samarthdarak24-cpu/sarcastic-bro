"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, CheckCircle } from "lucide-react";
import { buyerEscrowService } from "@/services/buyerEscrowService";
import { useSocket } from "@/hooks/useSocket";
import toast from "react-hot-toast";
import { SkeletonList } from "@/components/ui/SkeletonLoader";

export function EscrowHubBuyer() {
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    loadEscrows();
    setupSocketListeners();
  }, []);

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('escrow-update', (data: any) => {
      toast.info(`Escrow ${data.status}`, {
        icon: '🔒',
      });
      loadEscrows();
    });

    return () => {
      socket.off('escrow-update');
    };
  };

  const loadEscrows = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const { escrows: data } = await buyerEscrowService.getEscrowOrders({}, token);
      setEscrows(data || []);
    } catch (error) {
      console.error('Failed to load escrows:', error);
      toast.error('Failed to load escrows');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (escrowId: string) => {
    if (!confirm('Confirm that you received the goods in good condition?')) return;

    try {
      const token = localStorage.getItem('token') || '';
      await buyerEscrowService.confirmDelivery(escrowId, token);
      toast.success('Delivery confirmed! Funds released to farmer.');
      loadEscrows();
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
      toast.error('Failed to confirm delivery');
    }
  };

  const handleRaiseDispute = async (escrowId: string) => {
    const reason = prompt('Please describe the issue:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('token') || '';
      await buyerEscrowService.raiseDispute(escrowId, reason, token);
      toast.success('Dispute raised. Our team will review it.');
      loadEscrows();
    } catch (error) {
      console.error('Failed to raise dispute:', error);
      toast.error('Failed to raise dispute');
    }
  };

  const stats = {
    locked: escrows.filter(e => e.status === 'LOCKED').reduce((sum, e) => sum + e.amount, 0),
    active: escrows.filter(e => e.status === 'LOCKED' || e.status === 'PENDING').length,
    released: escrows.filter(e => e.status === 'RELEASED').reduce((sum, e) => sum + e.amount, 0),
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Safe-Lock Hub</h1>
        <p className="text-slate-500 font-medium">Secure escrow payments</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Locked Funds", value: `₹${Math.round(stats.locked / 1000)}K`, icon: Lock, color: "blue" },
          { label: "Active Escrows", value: stats.active.toString(), icon: Shield, color: "indigo" },
          { label: "Released", value: `₹${Math.round(stats.released / 1000)}K`, icon: CheckCircle, color: "emerald" },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
            <div className={`h-12 w-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <SkeletonList />
      ) : escrows.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Lock size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No escrow payments yet</h3>
          <p className="text-slate-500">Escrow payments will appear here when you place orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {escrows.map((escrow, idx) => (
            <motion.div key={escrow.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">Order #{escrow.orderId?.slice(0, 8)}</h3>
                  <p className="text-slate-500 font-medium">Escrow Payment</p>
                </div>
                <div className={`px-4 py-2 ${
                  escrow.status === "LOCKED" ? "bg-blue-50 text-blue-600" : 
                  escrow.status === "RELEASED" ? "bg-emerald-50 text-emerald-600" :
                  "bg-amber-50 text-amber-600"
                } rounded-full font-bold text-sm`}>
                  {escrow.status}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Amount</p>
                  <p className="text-2xl font-black text-slate-900">₹{escrow.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Release Trigger</p>
                  <p className="text-lg font-black text-blue-600">On Delivery</p>
                </div>
              </div>
              {escrow.status === 'LOCKED' && (
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleConfirmDelivery(escrow.id)}
                    className="flex-1 h-12 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                  >
                    Confirm Delivery
                  </button>
                  <button 
                    onClick={() => handleRaiseDispute(escrow.id)}
                    className="h-12 px-6 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                  >
                    Raise Dispute
                  </button>
                </div>
              )}
              {escrow.status !== 'LOCKED' && (
                <button className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
                  View Details
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
