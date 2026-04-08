"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  XCircle,
  Activity,
  Zap,
  ArrowRight,
  Globe,
  Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReputationBadge } from "@/components/ui/ReputationBadge";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";

export function ReputationHub() {
  const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
  const [onChainStats, setOnChainStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReputation();
  }, [user]);

  const fetchReputation = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { reviewService } = await import("@/services/reviewService");
      const { blockchainService } = await import("@/services/blockchainService");
      
      const [repRes, chainRes]: any = await Promise.all([
        reviewService.getUserReputation(user.id).catch(() => null),
        blockchainService.getReputationRecord(user.id).catch(() => null)
      ]);
      
      if (repRes) {
        setStats(repRes);
      } else {
        // Fallback for demo if API fails
        setStats({
          reputationScore: user?.reputationScore || 85,
          ratingAvg: user?.ratingAvg || 4.8,
          totalOrders: user?.totalOrders || 120,
          successfulDeliveries: user?.successfulDeliveries || 115,
          cancellationRate: user?.cancellationRate || 2.5,
          trustLevel: "Gold"
        });
      }
      
      setOnChainStats(chainRes);
    } catch (err) {
      console.error("Reputation fetch error:", err);
      // Fallback for demo if API fails
      setStats({
        reputationScore: user?.reputationScore || 85,
        ratingAvg: user?.ratingAvg || 4.8,
        totalOrders: user?.totalOrders || 120,
        successfulDeliveries: user?.successfulDeliveries || 115,
        cancellationRate: user?.cancellationRate || 2.5,
        trustLevel: "Gold"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Zap className="text-brand-primary animate-pulse" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in text-neut-900 border-neut-200">
      {/* Hero Reputation Section */}
      <Card className="border-none shadow-startup-medium bg-white overflow-hidden p-14 rounded-[4rem] relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <ShieldCheck size={200} className="text-brand-primary" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
             <div className="space-y-8">
                <div className="flex items-center gap-2">
                   <Badge tone="brand" className="h-10 px-6 rounded-2xl font-black text-lg bg-brand-primary/10 text-brand-primary border-none">
                      {"PLATFORM TRUST PROFILE"}
                   </Badge>
                   {onChainStats?.isBlockchainVerified && (
                      <Badge tone="brand" className="h-10 px-6 rounded-2xl font-black text-lg bg-neut-900 text-white border-none flex items-center gap-2">
                         <Globe size={18} className="text-brand-primary" />
                         {"BLOCKCHAIN VERIFIED"}
                      </Badge>
                   )}
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-neut-900 tracking-tighter leading-none">
                   {"Your Reputation Is Your Capital.".split("Is").map((p, i) => (
                     <React.Fragment key={i}>
                       {p} {i === 0 && <br />}
                     </React.Fragment>
                   ))}
                </h1>
                <p className="text-xl font-medium text-neut-500 leading-relaxed max-w-lg">
                   {"The ODOP Reputation Engine analyzes your trade reliability, fulfillment accuracy, and peer reviews to build national marketplace trust."}
                </p>
                <ReputationBadge score={stats.reputationScore} />
             </div>

             <div className="bg-neut-50 p-12 rounded-[3.5rem] border border-neut-100 flex flex-col justify-center text-center">
                <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-10">{"Current Standing"}</p>
                <div className="text-8xl font-black text-neut-900 tracking-tighter mb-4">{Math.round(stats.reputationScore)}</div>
                <p className="text-lg font-bold text-brand-primary uppercase tracking-widest">
                   {t("reputation.tier_status", { tier: stats.trustLevel })}
                </p>
                <div className="h-2 w-full max-w-[200px] bg-neut-200 rounded-full mx-auto mt-8 overflow-hidden">
                   <motion.div 
                      className="h-full bg-brand-primary" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${stats.reputationScore}%` }} 
                   />
                </div>
             </div>
          </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard 
            title={"Order Success"} 
            value={`${Math.round((stats.successfulDeliveries / (stats.totalOrders || 1)) * 100)}%`} 
            icon={<CheckCircle2 />} 
            detail={t("reputation.success_detail", { count: stats.successfulDeliveries, total: stats.totalOrders })} 
            color="text-success" 
          />
          <StatsCard 
            title={"Cancellation Rate"} 
            value={`${stats.cancellationRate}%`} 
            icon={<XCircle />} 
            detail={"Orders dropped after confirmation"} 
            color="text-error" 
          />
          <StatsCard 
            title={"Avg. Peer Rating"} 
            value={stats.ratingAvg} 
            icon={<Award />} 
            detail={"Based on verified community reviews"} 
            color="text-brand-primary" 
          />
          <StatsCard 
            title={"Active Listings"} 
            value="12" 
            icon={<Package />} 
            detail={"Verified quality clusters"} 
            color="text-amber-500" 
          />
      </div>

      {/* KYC & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 border-none shadow-startup-soft bg-neut-900 text-white p-12 rounded-[3.5rem] flex flex-col justify-between group overflow-hidden cursor-pointer relative">
             <div className="absolute top-0 right-0 p-8 h-24 w-24 bg-white/5 rounded-bl-[4rem] group-hover:bg-brand-primary/20 transition-all" />
             <div className="space-y-6">
                <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-brand-primary shadow-startup-soft">
                   <Activity size={32} />
                </div>
                <h3 className="text-3xl font-black tracking-tight leading-tight">{"National Tier Upgrade"}</h3>
                <p className="text-white/40 font-medium text-lg leading-relaxed max-w-lg">
                  {"Your current performance ranks you in the top 12% of farmers in your region. Complete 5 more orders without cancellation to unlock Elite Gold benefits."}
                </p>
             </div>
             <div className="mt-12 group-hover:translate-x-4 transition-transform flex items-center gap-4 text-brand-primary font-black uppercase text-xs tracking-widest">
                {"VIEW REWARD ROADMAP"} <ArrowRight size={20} />
             </div>
          </Card>

          <Card className="border-none shadow-startup-soft bg-white p-12 rounded-[3.5rem] border border-neut-50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-success/10 rounded-2xl flex items-center justify-center text-success mb-6"><ShieldCheck size={28} /></div>
                <h4 className="text-2xl font-black text-neut-900 tracking-tight">{"Verification Status"}</h4>
                <div className="space-y-4 pt-6">
                   <VerificationItem label={"Aadhaar KYC"} status={"VERIFIED"} />
                   <VerificationItem label={"Bank Account"} status={"VERIFIED"} />
                   <VerificationItem label={"On-Chain Ledger"} status={onChainStats?.isBlockchainVerified ? "ACTIVE" : "PENDING"} />
                   <VerificationItem label={"Farm Geo-Tag"} status={"PENDING"} />
                </div>
              </div>
              <Button variant="outline" className="h-14 w-full rounded-2xl font-black border-2 border-brand-primary text-brand-primary mt-12 flex items-center justify-center gap-2">
                <Database size={18} />
                {onChainStats?.isBlockchainVerified ? "VIEW ON-CHAIN AUDIT" : "INITIATE CHAIN LINK"}
              </Button>
          </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, detail, color }: any) {
  return (
    <Card key={title} className="border-none shadow-startup-soft bg-white group hover:shadow-startup-medium transition-all transform hover:-translate-y-1 p-8 rounded-[2.5rem]">
       <div className="flex justify-between items-start mb-6">
          <div className={`h-14 w-14 bg-neut-50 rounded-2xl flex items-center justify-center text-neut-300 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-startup-soft`}>
             {React.cloneElement(icon, { size: 28 })}
          </div>
          <Badge tone="brand" className="font-black text-[9px] rounded-lg">LIVE</Badge>
       </div>
       <p className="text-neut-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
       <h3 className={`text-3xl font-black tracking-tight ${color}`}>{value}</h3>
       <p className="text-[10px] font-bold text-neut-300 mt-2">{detail}</p>
    </Card>
  );
}

function VerificationItem({ label, status }: any) {
   return (
      <div className="flex items-center justify-between py-2 border-b border-neut-50 last:border-0">
         <span className="text-sm font-bold text-neut-700">{label}</span>
         <span className={`text-[10px] font-black tracking-widest ${status === 'VERIFIED' || status === 'सत्यापित' || status === 'पडताळणी झाली' || status === 'ACTIVE' || status === 'सक्रिय' ? 'text-success' : 'text-warning'}`}>{status}</span>
      </div>
   );
}
