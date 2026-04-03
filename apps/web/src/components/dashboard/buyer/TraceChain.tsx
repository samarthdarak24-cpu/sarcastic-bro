"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Fingerprint, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Zap, 
  MapPin, 
  CheckCircle2,
  Box,
  Layers,
  ArrowRight,
  Link as LinkIcon,
  Search,
  Lock,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MOCK_BLOCKS = [
  { id: "TX-9901", type: "Genesis", hash: "0x882a...119b", prevHash: "0x0000...0000", data: "Seed Certification: Organic Basmati S3", timestamp: "12 Oct 2023", location: "Kurnool Seed Lab" },
  { id: "TX-9905", type: "Cultivation", hash: "0xa21b...99cc", prevHash: "0x882a...119b", data: "Soil Health Audit: Ph 6.8, Nitrogen Optimal", timestamp: "05 Nov 2023", location: "Farm KG-22" },
  { id: "TX-9912", type: "Harvest", hash: "0x77dd...eea2", prevHash: "0xa21b...99cc", data: "Yield: 1.2 Tons, Moisture: 12%", timestamp: "18 Jan 2024", location: "Farm KG-22" },
  { id: "TX-9945", type: "Quality", hash: "0x11cc...bb21", prevHash: "0x77dd...eea2", data: "AI Grade: A+, Pesticide Zero-Trace", timestamp: "22 Jan 2024", location: "ODOP Hub" },
  { id: "TX-9988", type: "Logistics", hash: "0xffee...66aa", prevHash: "0x11cc...bb21", data: "FOB Origin: Sealed for Transit", timestamp: "Just Now", location: "In Transit" },
];

export function TraceChain() {
  const [activeBlock, setActiveBlock] = useState(MOCK_BLOCKS[4]);

  return (
    <div className="space-y-12 animate-fade-in text-neut-900 border-neut-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-neut-100">
         <div>
            <h2 className="text-3xl font-black tracking-tight mb-1">TraceChain Ledger</h2>
            <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest leading-loose flex items-center gap-2">
                <Lock size={12} className="text-brand-secondary" />
                IMMUTABLE ESG SUPPLY CHAIN LOGS (SOLANA-MOCKED)
            </p>
         </div>
         <Badge tone="brand" className="h-10 px-4 rounded-xl flex items-center justify-center font-black gap-2">
            <Globe size={14} className="animate-spin-slow" />
            LIVE ON MAINNET
         </Badge>
      </div>

      <div className="flex flex-col xl:flex-row gap-10">
         {/* Ledger Stream */}
         <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neut-100 to-transparent" />
               <span className="text-[10px] font-black text-neut-300 uppercase tracking-[0.3em]">Block Sequence</span>
               <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neut-100 to-transparent" />
            </div>
            
            <div className="flex flex-col gap-6">
               {MOCK_BLOCKS.map((block, i) => (
                  <motion.div
                     key={block.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     onClick={() => setActiveBlock(block)}
                     className={`relative p-8 rounded-[2rem] cursor-pointer transition-all border group ${
                        activeBlock.id === block.id 
                        ? "bg-white border-brand-secondary shadow-startup-soft ring-4 ring-brand-secondary/5" 
                        : "bg-neut-50/50 border-transparent hover:bg-white hover:border-neut-100"
                     }`}
                  >
                     <div className="flex items-center gap-6">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${
                           activeBlock.id === block.id ? "bg-brand-secondary text-white" : "bg-neut-100 text-neut-400"
                        }`}>
                           {block.type === 'Genesis' && <Fingerprint size={24} />}
                           {block.type === 'Cultivation' && <Box size={24} />}
                           {block.type === 'Harvest' && <Layers size={24} />}
                           {block.type === 'Quality' && <ShieldCheck size={24} />}
                           {block.type === 'Logistics' && <Zap size={24} />}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                              <h4 className="font-black text-lg text-neut-900 tracking-tight">{block.type} Verification</h4>
                              <span className="text-[10px] font-black text-neut-400 font-mono">{block.hash}</span>
                           </div>
                           <p className="text-sm font-bold text-neut-500">{block.data}</p>
                        </div>
                     </div>
                     {i < MOCK_BLOCKS.length - 1 && (
                        <div className="absolute -bottom-6 left-[3.75rem] h-6 flex flex-col items-center gap-1 opacity-20">
                           <div className="w-1 h-1 rounded-full bg-neut-400" />
                           <div className="w-1 h-1 rounded-full bg-neut-400" />
                        </div>
                     )}
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Detailed View */}
         <aside className="w-full xl:w-[450px] space-y-8">
            <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] sticky top-8 outline outline-4 outline-neut-50">
               <div className="flex items-center justify-between mb-10">
                  <Badge tone="brand" className="rounded-lg h-7 px-4 font-black text-[10px] shadow-sm uppercase">Immutable Signature</Badge>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-neut-300"><Search size={20} /></Button>
               </div>
               
               <div className="space-y-8">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest">Transaction Hash</p>
                     <p className="font-mono text-sm font-bold text-neut-900 break-all bg-neut-50 p-4 rounded-2xl">{activeBlock.hash}</p>
                  </div>

                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest">Parent Hash</p>
                     <p className="font-mono text-sm font-bold text-neut-400 break-all">{activeBlock.prevHash}</p>
                  </div>

                  <div className="h-px bg-neut-50" />

                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1 text-neut-400">Timestamp</p>
                        <p className="text-sm font-black text-neut-900">{activeBlock.timestamp}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1 text-neut-400">Node Location</p>
                        <p className="text-sm font-black text-neut-900">{activeBlock.location}</p>
                     </div>
                  </div>

                  <div className="p-8 bg-neut-900 rounded-[2rem] text-white space-y-4 shadow-startup-medium">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-brand-secondary rounded-lg flex items-center justify-center"><CheckCircle2 size={16} /></div>
                        <h4 className="font-black text-lg tracking-tight">Audit Passed</h4>
                     </div>
                     <p className="text-white/50 text-xs font-medium leading-relaxed italic">"Digital double of the physical asset verified via satellite telemetry and IoT harvest markers."</p>
                  </div>

                  <Button variant="gradient" className="h-14 w-full rounded-2xl font-black shadow-lg shadow-brand-secondary/20 active:scale-95 transition-transform">
                     Download Certificate
                     <ArrowRight size={20} className="ml-3" />
                  </Button>
               </div>
            </Card>
         </aside>
      </div>
    </div>
  );
}
