"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Shield, AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReputationBadgeProps {
  score: number;
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export function ReputationBadge({ score, className = "", showDetails = false, compact = false }: ReputationBadgeProps) {
  const getLevel = (s: number) => {
    if (s >= 80) return { label: "Gold", color: "text-brand-primary", bg: "bg-brand-primary/10", border: "border-brand-primary/20", icon: Award, tone: "brand" as const };
    if (s >= 50) return { label: "Silver", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Shield, tone: "amber" as const };
    return { label: "Risky", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: AlertTriangle, tone: "ink" as const };
  };

  const level = getLevel(score);
  const Icon = level.icon;

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border ${level.bg} ${level.border} ${className}`}>
        <Icon size={12} className={level.color} />
        <span className={`text-[10px] font-black uppercase tracking-tighter ${level.color}`}>{level.label}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border w-fit ${level.bg} ${level.border}`}>
        <Icon size={20} className={level.color} />
        <span className={`text-sm font-black uppercase tracking-widest ${level.color}`}>
          {level.label} Tier Status
        </span>
      </div>
      
      {showDetails && (
        <div className="space-y-4">
           <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-neut-400 uppercase tracking-widest">Reputation Flow</span>
              <span className="text-sm font-black text-neut-900">{Math.round(score)}/100</span>
           </div>
           <div className="h-2 w-full bg-neut-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${score >= 80 ? 'bg-brand-primary' : score >= 50 ? 'bg-amber-500' : 'bg-red-500 shadow-glow-error'}`}
              />
           </div>
           <p className="text-[10px] font-bold text-neut-400 leading-relaxed max-w-[240px]">
             {score >= 80 ? "Top-tier reliability. Eligible for premium trade loops and bulk auctions." : 
              score >= 50 ? "Standard verification status. Active and dependable trade history." : 
              "High-risk indicator. Improved fulfillment timing needed to restore tier status."}
           </p>
        </div>
      )}
    </div>
  );
}
