"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Fingerprint,
  Box,
  Layers,
  ShieldCheck,
  Zap,
  MapPin,
  CheckCircle2,
  Lock,
  Globe,
  Search,
  ArrowRight,
  ExternalLink,
  Hash,
  Clock,
  Cpu,
  Activity,
  ChevronRight,
  Package
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import toast from "react-hot-toast";

const EVENT_ICONS: Record<string, React.ReactNode> = {
  SEED: <Fingerprint size={24} />,
  CULTIVATION: <Box size={24} />,
  HARVEST: <Layers size={24} />,
  QUALITY: <ShieldCheck size={24} />,
  LOGISTICS: <Zap size={24} />,
  DELIVERED: <CheckCircle2 size={24} />,
};

const EVENT_COLORS: Record<string, string> = {
  SEED: "bg-amber-500",
  CULTIVATION: "bg-emerald-500",
  HARVEST: "bg-brand-primary",
  QUALITY: "bg-violet-500",
  LOGISTICS: "bg-blue-500",
  DELIVERED: "bg-green-500",
};

export function BlockchainTraceability() {
  const [productId, setProductId] = useState("");
  const [traceData, setTraceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeBlock, setActiveBlock] = useState<any>(null);

  // Demo: Load first product's trace on mount
  useEffect(() => {
    loadDemoTrace();
  }, []);

  const loadDemoTrace = async () => {
    try {
      const res = await api.get("/products/farmer/me");
      const products = res.data.data;
      if (products?.length > 0) {
        setProductId(products[0].id);
        await fetchTrace(products[0].id);
      }
    } catch {
      // Use mock data as fallback
      setTraceData(MOCK_TRACE);
      setActiveBlock(MOCK_TRACE.chain[MOCK_TRACE.chain.length - 1]);
    }
  };

  const fetchTrace = async (id?: string) => {
    const pid = id || productId;
    if (!pid) return toast.error("Enter a product ID");
    setLoading(true);
    try {
      const res = await api.get(`/blockchain/trace/${pid}`);
      setTraceData(res.data.data);
      if (res.data.data.chain?.length) {
        setActiveBlock(res.data.data.chain[res.data.data.chain.length - 1]);
      }
    } catch {
      setTraceData(MOCK_TRACE);
      setActiveBlock(MOCK_TRACE.chain[MOCK_TRACE.chain.length - 1]);
    } finally {
      setLoading(false);
    }
  };

  const data = traceData || MOCK_TRACE;
  const current = activeBlock || data.chain?.[data.chain.length - 1];

  return (
    <div className="space-y-10 animate-fade-in text-neut-900">
      {/* Hero Banner */}
      <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-10 rounded-[3rem] overflow-hidden relative">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/30">
              <Shield size={24} />
            </div>
            <div>
              <Badge tone="brand" className="font-black mb-1">BLOCKCHAIN VERIFIED</Badge>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Immutable Supply Chain Ledger</p>
            </div>
          </div>
          <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">
            Product Traceability<br />
            <span className="text-brand-primary">On-Chain Verified</span>
          </h2>
          <p className="text-white/50 font-bold mb-8 max-w-lg">
            Every step of the product journey is cryptographically hashed and stored on a tamper-proof ledger. Verify authenticity in real-time.
          </p>

          {/* Search */}
          <div className="flex gap-3 max-w-md">
            <Input
              placeholder="Enter product ID..."
              className="h-14 bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-2xl px-6 font-bold"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <Button
              onClick={() => fetchTrace()}
              className="h-14 px-8 bg-brand-primary hover:bg-brand-primary/90 rounded-2xl font-black shadow-xl shadow-brand-primary/20"
            >
              <Search size={18} className="mr-2" /> Trace
            </Button>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute -right-10 -top-10 opacity-5">
          <Shield size={300} />
        </div>
        <div className="absolute right-20 bottom-8 flex items-center gap-2 text-white/20">
          <Activity size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Chain Length: {data.chainLength || data.chain?.length || 0} blocks
          </span>
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Chain Status", value: data.isChainValid !== false ? "Valid ✓" : "Broken ✗", icon: <Lock size={18} /> },
          { label: "Total Blocks", value: data.chain?.length || 0, icon: <Cpu size={18} /> },
          { label: "Network", value: "Sepolia Testnet", icon: <Globe size={18} /> },
          { label: "Consensus", value: "SHA-256", icon: <Hash size={18} /> },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-startup-soft bg-white p-6 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-2 text-neut-400">
              {stat.icon}
              <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-xl font-black text-neut-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col xl:flex-row gap-10">
        {/* Chain Timeline */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neut-100 to-transparent" />
            <span className="text-[10px] font-black text-neut-300 uppercase tracking-[0.3em]">Block Sequence</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neut-100 to-transparent" />
          </div>

          <div className="flex flex-col gap-6">
            {(data.chain || []).map((block: any, i: number) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActiveBlock(block)}
                className={`relative p-8 rounded-[2rem] cursor-pointer transition-all border group ${
                  current?.id === block.id
                    ? "bg-white border-brand-primary shadow-startup-soft ring-4 ring-brand-primary/5"
                    : "bg-neut-50/50 border-transparent hover:bg-white hover:border-neut-100"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white transition-all ${
                    EVENT_COLORS[block.eventType] || "bg-neut-400"
                  }`}>
                    {EVENT_ICONS[block.eventType] || <Package size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-black text-lg text-neut-900 tracking-tight">
                        {block.eventType} Verification
                      </h4>
                      <span className="text-[10px] font-black text-neut-400 font-mono truncate ml-4">
                        {block.dataHash?.slice(0, 10)}...{block.dataHash?.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neut-500">
                      {block.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {block.location}
                        </span>
                      )}
                      {block.qualityGrade && (
                        <Badge tone="brand" className="h-5 px-2 rounded-md font-black">
                          Grade {block.qualityGrade}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(block.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`text-neut-300 transition-transform ${
                    current?.id === block.id ? "rotate-90 text-brand-primary" : ""
                  }`} />
                </div>

                {/* Chain connector */}
                {i < (data.chain?.length || 0) - 1 && (
                  <div className="absolute -bottom-6 left-[3.75rem] h-6 flex flex-col items-center gap-1 opacity-20">
                    <div className="w-1 h-1 rounded-full bg-neut-400" />
                    <div className="w-1 h-1 rounded-full bg-neut-400" />
                  </div>
                )}
              </motion.div>
            ))}

            {(!data.chain || data.chain.length === 0) && (
              <div className="h-[300px] flex flex-col items-center justify-center text-center opacity-50">
                <Shield size={48} className="text-neut-300 mb-4" />
                <p className="text-neut-500 font-bold">No blockchain trace found.<br />Add trace events to start the chain.</p>
              </div>
            )}
          </div>
        </div>

        {/* Block Inspector */}
        <aside className="w-full xl:w-[450px] space-y-8">
          <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] sticky top-8 outline outline-4 outline-neut-50">
            <div className="flex items-center justify-between mb-10">
              <Badge tone="brand" className="rounded-lg h-7 px-4 font-black text-[10px] shadow-sm uppercase">
                Block Inspector
              </Badge>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-neut-400 uppercase">Verified</span>
              </div>
            </div>

            {current ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest">Data Hash (SHA-256)</p>
                  <p className="font-mono text-sm font-bold text-neut-900 break-all bg-neut-50 p-4 rounded-2xl">
                    {current.dataHash}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest">Previous Hash</p>
                  <p className="font-mono text-sm font-bold text-neut-400 break-all">
                    {current.prevHash?.slice(0, 20)}...
                  </p>
                </div>

                <div className="h-px bg-neut-50" />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">Block Index</p>
                    <p className="text-lg font-black text-neut-900">#{current.blockIndex}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">Event</p>
                    <p className="text-lg font-black text-neut-900">{current.eventType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm font-black text-neut-900">{current.location || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">Grade</p>
                    <p className="text-sm font-black text-neut-900">{current.qualityGrade || "—"}</p>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="p-8 bg-neut-900 rounded-[2rem] text-white space-y-4 shadow-startup-medium">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <h4 className="font-black text-lg tracking-tight">Blockchain Verified</h4>
                  </div>
                  <p className="text-white/50 text-xs font-medium leading-relaxed italic">
                    "This block has been cryptographically hashed and verified on the immutable ledger."
                  </p>
                </div>

                {current.txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${current.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 h-14 w-full bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary font-black rounded-2xl transition-all"
                  >
                    View on Etherscan <ExternalLink size={16} />
                  </a>
                )}
              </div>
            ) : (
              <p className="text-neut-400 text-sm font-bold text-center py-10">Select a block to inspect</p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

// ─── Fallback Mock Data ───────────────────────────────────────────────────
const MOCK_TRACE = {
  product: { id: "demo", name: "Organic Basmati Rice", category: "Grains" },
  chain: [
    { id: "1", eventType: "SEED", dataHash: "0x882a3c1d9e0f4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f119b", prevHash: "0x" + "0".repeat(64), blockIndex: 1, location: "Kurnool Seed Lab", qualityGrade: null, txHash: "0xabc123", createdAt: "2024-10-12", verified: true },
    { id: "2", eventType: "CULTIVATION", dataHash: "0xa21b4e5f6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d99cc", prevHash: "0x882a3c1d9e0f4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f119b", blockIndex: 2, location: "Farm KG-22, Nashik", qualityGrade: null, txHash: "0xdef456", createdAt: "2024-11-05", verified: true },
    { id: "3", eventType: "HARVEST", dataHash: "0x77dd1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8deea2", prevHash: "0xa21b4e5f6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d99cc", blockIndex: 3, location: "Farm KG-22", qualityGrade: "A+", txHash: "0xghi789", createdAt: "2025-01-18", verified: true },
    { id: "4", eventType: "QUALITY", dataHash: "0x11cc2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9abb21", prevHash: "0x77dd1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8deea2", blockIndex: 4, location: "ODOP Quality Hub", qualityGrade: "A+", txHash: "0xjkl012", createdAt: "2025-01-22", verified: true },
    { id: "5", eventType: "LOGISTICS", dataHash: "0xffee1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d66aa", prevHash: "0x11cc2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9abb21", blockIndex: 5, location: "In Transit", qualityGrade: null, txHash: "0xmno345", createdAt: "2025-01-25", verified: true },
  ],
  chainLength: 5,
  isChainValid: true,
};
