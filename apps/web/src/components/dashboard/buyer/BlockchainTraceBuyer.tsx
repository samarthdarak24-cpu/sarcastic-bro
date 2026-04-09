"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Link, CheckCircle, Award } from "lucide-react";
import { buyerBlockchainService } from "@/services/buyerBlockchainService";
import { useSocket } from "@/hooks/useSocket";
import toast from "react-hot-toast";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

export function BlockchainTraceBuyer() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    loadTransactions();
    setupSocketListeners();
  }, []);

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('blockchain:tx-confirmed', (data: any) => {
      toast.success(`Transaction confirmed on block #${data.blockNumber}`, {
        icon: '⛓️',
      });
      loadTransactions();
    });

    return () => {
      socket.off('blockchain:tx-confirmed');
    };
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const { transactions: data } = await buyerBlockchainService.getTransactions({}, token);
      setTransactions(data || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load blockchain data');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    verified: transactions.filter(t => t.status === 'CONFIRMED').length,
    total: transactions.length,
    trustScore: 98,
    certifications: 45
  };

  const latestTx = transactions[0];

  return (
    <div className="space-y-6">
      {/* Removed large header to save space */}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Verified Orders", value: stats.verified.toString(), icon: CheckCircle, color: "emerald" },
              { label: "Blockchain Txns", value: stats.total.toString(), icon: Link, color: "blue" },
              { label: "Trust Score", value: `${stats.trustScore}%`, icon: Shield, color: "indigo" },
              { label: "Certifications", value: stats.certifications.toString(), icon: Award, color: "amber" },
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

          {latestTx && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 rounded-3xl p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                  <Shield size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-1">Latest Transaction</h2>
                  <p className="text-slate-400 font-medium">{latestTx.type} - Verified on Chain</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm font-medium mb-1">Transaction Hash</p>
                  <p className="text-white font-mono text-xs">{latestTx.txHash?.slice(0, 16)}...</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm font-medium mb-1">Timestamp</p>
                  <p className="text-white font-medium">{new Date(latestTx.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )}

          {transactions.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <Shield size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No blockchain records yet</h3>
              <p className="text-slate-500">Transactions will be recorded on the blockchain</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
