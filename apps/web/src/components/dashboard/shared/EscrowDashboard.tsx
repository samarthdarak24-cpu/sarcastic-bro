"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  Truck,
  Package,
  ExternalLink,
  XCircle,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  HELD: { color: "bg-amber-500", icon: <Lock size={18} />, label: "Funds Locked" },
  RELEASED: { color: "bg-green-500", icon: <CheckCircle2 size={18} />, label: "Payment Released" },
  DISPUTED: { color: "bg-red-500", icon: <AlertTriangle size={18} />, label: "Dispute Active" },
  REFUNDED: { color: "bg-neut-400", icon: <XCircle size={18} />, label: "Refunded" },
};

export function EscrowDashboard() {
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEscrows();
  }, []);

  const fetchEscrows = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blockchain/escrow/me");
      setEscrows(res.data.data);
    } catch {
      // Use mock data for demo
      setEscrows(MOCK_ESCROWS);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async (escrowId: string) => {
    setActionLoading(escrowId);
    try {
      await api.patch(`/blockchain/escrow/${escrowId}/deliver`);
      toast.success("Delivery confirmed on-chain!");
      fetchEscrows();
    } catch {
      toast.error("Failed to confirm delivery");
    } finally {
      setActionLoading(null);
    }
  };

  const releasePayment = async (escrowId: string) => {
    setActionLoading(escrowId);
    try {
      await api.patch(`/blockchain/escrow/${escrowId}/release`);
      toast.success("Payment released from escrow! 💰");
      fetchEscrows();
    } catch {
      toast.error("Failed to release payment");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in text-neut-900">
      {/* Header */}
      <Card className="border-none shadow-startup-soft bg-startup-gradient text-white p-10 rounded-[3rem] overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <Badge tone="brand" className="mb-4 font-black">SMART CONTRACT ESCROW</Badge>
          <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">
            Trustless Payment System
          </h2>
          <p className="text-white/60 font-bold max-w-lg">
            Payments are automatically held in a smart contract until both parties confirm the transaction. No intermediaries, no risk.
          </p>
        </div>
        <DollarSign size={200} className="absolute -right-8 -bottom-8 text-white opacity-5 rotate-12" />
      </Card>

      {/* Escrow Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { step: 1, label: "Order Placed", desc: "Buyer initiates", icon: <Package size={20} /> },
          { step: 2, label: "Funds Locked", desc: "Escrow holds payment", icon: <Lock size={20} /> },
          { step: 3, label: "Product Delivered", desc: "Farmer ships", icon: <Truck size={20} /> },
          { step: 4, label: "Payment Released", desc: "Auto-settlement", icon: <CheckCircle2 size={20} /> },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-startup-soft bg-white p-6 rounded-[2rem] text-center relative">
            <div className="h-12 w-12 mx-auto bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-4">
              {s.icon}
            </div>
            <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">Step {s.step}</div>
            <h4 className="font-black text-neut-900">{s.label}</h4>
            <p className="text-[10px] font-bold text-neut-400 mt-1">{s.desc}</p>
            {i < 3 && (
              <ArrowRight size={16} className="absolute -right-3 top-1/2 -translate-y-1/2 text-neut-200 hidden md:block" />
            )}
          </Card>
        ))}
      </div>

      {/* Active Escrows */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black tracking-tight">Active Escrows</h3>

        {escrows.map((escrow, i) => {
          const config = STATUS_CONFIG[escrow.status] || STATUS_CONFIG.HELD;
          return (
            <motion.div
              key={escrow.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-none shadow-startup-soft bg-white p-8 rounded-[2.5rem] hover:shadow-xl transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Status Badge */}
                  <div className={`h-16 w-16 shrink-0 rounded-2xl flex items-center justify-center text-white ${config.color}`}>
                    {config.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-black text-neut-900 tracking-tight">
                        Order #{escrow.order?.orderNumber?.slice(0, 12) || escrow.orderId?.slice(0, 8)}
                      </h4>
                      <Badge tone="brand" className="h-5 px-2 rounded-md font-black">{config.label}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-xs text-neut-500">
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} /> ₹{escrow.amount?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {new Date(escrow.createdAt).toLocaleDateString()}
                      </span>
                      {escrow.escrowAddress && (
                        <span className="font-mono text-[10px] text-neut-400">
                          Contract: {escrow.escrowAddress?.slice(0, 10)}...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 shrink-0">
                    {escrow.status === "HELD" && !escrow.farmerDelivered && (
                      <Button
                        onClick={() => confirmDelivery(escrow.id)}
                        disabled={actionLoading === escrow.id}
                        className="bg-neut-900 hover:bg-neut-800 text-white rounded-xl font-black px-6"
                      >
                        {actionLoading === escrow.id ? <Loader2 size={16} className="animate-spin mr-2" /> : <Truck size={16} className="mr-2" />}
                        Mark Delivered
                      </Button>
                    )}
                    {escrow.status === "HELD" && escrow.farmerDelivered && (
                      <Button
                        onClick={() => releasePayment(escrow.id)}
                        disabled={actionLoading === escrow.id}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-black px-6"
                      >
                        {actionLoading === escrow.id ? <Loader2 size={16} className="animate-spin mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
                        Release Payment
                      </Button>
                    )}
                    {escrow.status === "RELEASED" && escrow.releaseTxHash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${escrow.releaseTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-brand-primary font-black text-sm hover:underline"
                      >
                        View Tx <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 pt-6 border-t border-neut-50">
                  <div className="flex items-center gap-2">
                    {["Deposited", "Delivering", "Confirmed", "Released"].map((step, idx) => {
                      const progress = escrow.status === "RELEASED" ? 4 :
                        escrow.farmerDelivered ? 3 :
                        escrow.status === "HELD" ? 1 : 0;
                      return (
                        <React.Fragment key={step}>
                          <div className={`h-2 flex-1 rounded-full transition-all ${
                            idx < progress ? "bg-brand-primary" : "bg-neut-100"
                          }`} />
                          {idx < 3 && <div className="w-1" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2">
                    {["Deposited", "Delivering", "Confirmed", "Released"].map((step) => (
                      <span key={step} className="text-[9px] font-black text-neut-400 uppercase tracking-widest">{step}</span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {escrows.length === 0 && !loading && (
          <div className="h-[200px] flex flex-col items-center justify-center text-center opacity-50">
            <Lock size={48} className="text-neut-300 mb-4" />
            <p className="text-neut-500 font-bold">No active escrows. Payment will be secured when orders are placed.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data for demo
const MOCK_ESCROWS = [
  { id: "esc-1", orderId: "ord-1", order: { orderNumber: "ORD-ABC123DEF" }, buyerId: "b1", farmerId: "f1", buyer: { name: "AgriTech Corp" }, farmer: { name: "Rajesh Kumar" }, amount: 125000, status: "HELD", escrowAddress: "0x7a5b3c2d1e0f4b5a6c7d8e9f0a1b2c3d4e5f6a7b", depositTxHash: "0xabc...", farmerDelivered: true, buyerConfirmed: false, createdAt: "2025-01-22" },
  { id: "esc-2", orderId: "ord-2", order: { orderNumber: "ORD-XYZ789GHI" }, buyerId: "b1", farmerId: "f2", buyer: { name: "AgriTech Corp" }, farmer: { name: "Sunita Devi" }, amount: 78500, status: "RELEASED", escrowAddress: "0x8b6c4d3e2f1a5b6c7d8e9f0a1b2c3d4e5f6a7b8c", depositTxHash: "0xdef...", releaseTxHash: "0xghi789release", farmerDelivered: true, buyerConfirmed: true, createdAt: "2025-01-15", releasedAt: "2025-01-20" },
  { id: "esc-3", orderId: "ord-3", order: { orderNumber: "ORD-LMN456OPQ" }, buyerId: "b1", farmerId: "f3", buyer: { name: "AgriTech Corp" }, farmer: { name: "Anil Sharma" }, amount: 45000, status: "HELD", escrowAddress: "0x9c7d5e4f3a2b1c6d7e8f9a0b1c2d3e4f5a6b7c8d", depositTxHash: "0xjkl...", farmerDelivered: false, buyerConfirmed: false, createdAt: "2025-01-25" },
];

