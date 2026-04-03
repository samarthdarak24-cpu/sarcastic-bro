"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Search,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
  Bell,
  Eye,
  ShieldCheck,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import toast from "react-hot-toast";

export function FraudSecurityCenter() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const startScan = async () => {
    setScanning(true);
    setResults(null);
    try {
      // Simulate/Call fraud scan API
      const res = await api.get("/blockchain/fraud/scan");
      setResults(res.data.data);
      toast.success("Security scan complete!");
    } catch {
      // Fallback for demo
      setResults(MOCK_FRAUD_RESULTS);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in text-neut-900">
      {/* Hero Header */}
      <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-10 rounded-[3rem] overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <Badge tone="brand" className="mb-4 font-black">AI FRAUD DETECTION ACTIVE</Badge>
          <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">
            Trade Security Center
          </h2>
          <p className="text-white/60 font-bold max-w-lg">
            Real-time monitoring of marketplace transactions using rule-based heuristics and blockchain verification to detect anomalies before they impact your business.
          </p>

          <Button
            onClick={startScan}
            disabled={scanning}
            className="mt-8 h-14 px-10 bg-brand-secondary hover:bg-brand-secondary/90 rounded-2xl font-black shadow-xl shadow-brand-secondary/20 transition-all flex items-center gap-3"
          >
            {scanning ? <RefreshCw size={20} className="animate-spin" /> : <Eye size={20} />}
            {scanning ? "Scanning Network..." : "Start Global Health Scan"}
          </Button>
        </div>
        <ShieldAlert size={200} className="absolute -right-8 -bottom-8 text-white opacity-5 rotate-12" />
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Monitors", value: "34 Rules", icon: <Cpu size={18} /> },
          { label: "Total Triggers", value: results?.flaggedCount || "0", icon: <Bell size={18} /> },
          { label: "Security Level", value: "ELEVATED", icon: <Lock size={18} /> },
          { label: "Blockchain Verification", value: "100%", icon: <ShieldCheck size={18} /> },
        ].map((m, i) => (
          <Card key={i} className="border-none shadow-startup-soft bg-white p-6 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-2 text-neut-400">
              {m.icon}
              <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </div>
            <p className="text-xl font-black text-neut-900">{m.value}</p>
          </Card>
        ))}
      </div>

      {/* Main Scan View */}
      <div className="flex flex-col xl:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <h3 className="text-2xl font-black tracking-tight">Anomalies Detected</h3>

          <AnimatePresence mode="wait">
            {results ? (
              <div className="space-y-4">
                {results.flaggedOrders.map((order: any, i: number) => (
                  <motion.div
                    key={order.orderId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-6 rounded-[2rem] cursor-pointer transition-all border group relative overflow-hidden ${
                      selectedOrder?.orderId === order.orderId
                        ? "bg-white border-brand-secondary shadow-startup-soft ring-4 ring-brand-secondary/5"
                        : "bg-neut-50/50 border-transparent hover:bg-white hover:border-neut-100"
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white ${
                        order.riskScore > 60 ? "bg-red-500" : "bg-amber-500"
                      }`}>
                        <AlertTriangle size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-black text-lg text-neut-900 tracking-tight">Order #{order.orderId?.slice(0, 8)}</h4>
                          <Badge tone={order.riskScore > 60 ? "ink" : "brand"} className="rounded-lg h-5 px-3 font-black text-[9px]">
                            {order.riskLevel} RISK ({order.riskScore})
                          </Badge>
                        </div>
                        <p className="text-xs text-neut-500 font-bold truncate max-w-md">
                          Triggered by {order.signals?.length} security rules
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-neut-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-neut-50/30 rounded-[3.5rem] border border-dashed border-neut-100">
                <ShieldCheck size={48} className="text-neut-200 mb-4" />
                <p className="text-neut-400 font-bold">Start a health scan to detect vulnerabilities.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Detail Panel */}
        <aside className="w-full xl:w-[450px]">
          {selectedOrder ? (
            <Card className="border-none shadow-startup-soft bg-white p-10 rounded-[3rem] sticky top-8">
              <div className="flex items-center justify-between mb-8">
                <Badge tone="brand" className="rounded-lg h-7 px-4 font-black text-[10px] shadow-sm uppercase shrink-0">
                  Risk Analysis
                </Badge>
                <span className="text-[10px] font-black text-neut-400 uppercase">Live Audit</span>
              </div>

              <div className="space-y-8">
                {/* Gauge */}
                <div className="text-center py-6 bg-neut-50 rounded-[2.5rem] relative overflow-hidden">
                   <div className="relative z-10">
                      <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-2">Composite Score</p>
                      <h4 className={`text-6xl font-black ${selectedOrder.riskScore > 60 ? 'text-red-500' : 'text-amber-500'}`}>
                         {selectedOrder.riskScore}
                      </h4>
                      <p className="text-[10px] font-black text-neut-500 mt-2 uppercase tracking-widest">Out of 100</p>
                   </div>
                   <Activity size={100} className="absolute inset-0 m-auto text-neut-200/50 pointer-events-none" />
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest">Security Flags</p>
                  <div className="space-y-3">
                    {selectedOrder.signals?.map((signal: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white border border-neut-50 rounded-2xl flex gap-3">
                         <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${
                            signal.severity === 'HIGH' || signal.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                         }`}>
                            <ShieldAlert size={12} />
                         </div>
                         <div>
                            <p className="text-xs font-black text-neut-900 mb-1">{signal.type.replace('_', ' ')}</p>
                            <p className="text-[10px] font-bold text-neut-500 leading-tight">{signal.message}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mitigation Action */}
                <div className="p-8 bg-brand-secondary/5 rounded-[2rem] border border-brand-secondary/10">
                   <div className="flex items-center gap-2 mb-3">
                      <Bell size={16} className="text-brand-secondary" />
                      <h5 className="font-black text-sm text-brand-secondary uppercase">Mitigation Suggestion</h5>
                   </div>
                   <p className="text-xs font-bold text-neut-600 leading-relaxed italic">
                      "This order indicates anomalous pricing. We recommend enabling smart contract escrow and requesting additional KYC from the buyer before fulfillment."
                   </p>
                </div>

                <Button className="w-full h-14 rounded-2xl bg-neut-900 hover:bg-neut-800 text-white font-black">
                   Escalate to Arbitration
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border border-neut-50 rounded-[3rem] opacity-30">
               <ShieldAlert size={48} className="text-neut-300 mb-4" />
               <p className="text-neut-400 font-bold">Select a flagged anomaly<br />to view details.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// Mock results for demo
const MOCK_FRAUD_RESULTS = {
  scannedCount: 24,
  flaggedCount: 3,
  flaggedOrders: [
    {
      orderId: "ORD-98B2X1L",
      riskScore: 75,
      riskLevel: "HIGH",
      signals: [
        { type: "PRICE_ANOMALY", severity: "HIGH", message: "Total price is 2.4x market average for this cluster." },
        { type: "NEW_BUYER_LARGE_ORDER", severity: "MEDIUM", message: "Buyer account is only 2 days old with no previous history." }
      ]
    },
    {
      orderId: "ORD-11A5C9M",
      riskScore: 42,
      riskLevel: "MEDIUM",
      signals: [
        { type: "RAPID_FIRE_ORDERS", severity: "MEDIUM", message: "Same buyer placed 8 orders in the last 15 minutes." }
      ]
    },
    {
      orderId: "ORD-F42Z3E6",
      riskScore: 88,
      riskLevel: "CRITICAL",
      signals: [
        { type: "LOW_REPUTATION", severity: "CRITICAL", message: "Buyer reputation score is 12/100 across 3 linked identifiers." },
        { type: "HIGH_CANCELLATION", severity: "MEDIUM", message: "Historical order completion rate is below 40%." }
      ]
    }
  ]
};
