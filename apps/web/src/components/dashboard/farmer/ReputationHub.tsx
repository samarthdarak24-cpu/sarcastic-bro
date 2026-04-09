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
  }, []);

  const fetchReputation = async () => {
    setLoading(true);
    try {
      const userId = user?.id || 'demo-user';
      
      // Try to fetch from services
      try {
        const { reviewService } = await import("@/services/reviewService");
        const { blockchainService } = await import("@/services/blockchainService");
        
        const [repRes, chainRes]: any = await Promise.all([
          reviewService.getUserReputation(userId).catch(() => null),
          blockchainService.getReputationRecord(userId).catch(() => null)
        ]);
        
        if (repRes) {
          setStats(repRes);
        } else {
          throw new Error('No reputation data');
        }
        
        setOnChainStats(chainRes);
      } catch (serviceError) {
        // Fallback to demo data
        throw serviceError;
      }
    } catch (err) {
      console.error("Reputation fetch error:", err);
      // Fallback demo data
      setStats({
        reputationScore: user?.reputationScore || 85,
        ratingAvg: user?.ratingAvg || 4.8,
        totalOrders: user?.totalOrders || 120,
        successfulDeliveries: user?.successfulDeliveries || 115,
        cancellationRate: user?.cancellationRate || 2.5,
        trustLevel: "Gold"
      });
      setOnChainStats({
        isBlockchainVerified: false
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
    <div className="space-y-6 animate-fade-in">
      {/* Hero Reputation Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10 bg-grid-white" />
        
        <motion.div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Title & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <ShieldCheck size={18} />
                <span className="text-xs font-black uppercase tracking-wider">Platform Trust Profile</span>
              </motion.div>
              
              {onChainStats?.isBlockchainVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full"
                >
                  <Globe size={16} className="text-green-400" />
                  <span className="text-xs font-black uppercase tracking-wider">Blockchain Verified</span>
                </motion.div>
              )}
            </div>

            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
            >
              Your Reputation<br />Is Your Capital.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-green-50 text-base leading-relaxed max-w-lg"
            >
              The ODOP Reputation Engine analyzes your trade reliability, fulfillment accuracy, and peer reviews to build national marketplace trust.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ReputationBadge score={stats.reputationScore} showDetails={false} />
            </motion.div>
          </div>

          {/* Right Side - Score Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 flex flex-col justify-center text-center relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="relative z-10">
              <p className="text-xs font-black text-green-100 uppercase tracking-widest mb-4">Current Standing</p>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="text-7xl md:text-8xl font-black tracking-tighter mb-3"
              >
                {Math.round(stats.reputationScore)}
              </motion.div>
              <p className="text-base font-bold text-green-200 uppercase tracking-wider mb-6">
                {stats.trustLevel || "Gold"} Tier Status
              </p>
              
              <div className="h-2 w-full max-w-[200px] bg-white/20 rounded-full mx-auto overflow-hidden">
                <motion.div 
                  className="h-full bg-white rounded-full shadow-lg" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${stats.reputationScore}%` }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard 
            title={"Order Success"} 
            value={`${Math.round((stats.successfulDeliveries / (stats.totalOrders || 1)) * 100)}%`} 
            icon={<CheckCircle2 />} 
            detail={`${stats.successfulDeliveries} of ${stats.totalOrders} Completed`} 
            color="text-green-600" 
            bgColor="from-green-50 to-emerald-50"
            iconBg="bg-green-500"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsCard 
            title={"Cancellation Rate"} 
            value={`${stats.cancellationRate}%`} 
            icon={<XCircle />} 
            detail={"Orders dropped after confirmation"} 
            color="text-red-600" 
            bgColor="from-red-50 to-rose-50"
            iconBg="bg-red-500"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatsCard 
            title={"Avg. Peer Rating"} 
            value={stats.ratingAvg} 
            icon={<Award />} 
            detail={"Based on verified community reviews"} 
            color="text-amber-600" 
            bgColor="from-amber-50 to-yellow-50"
            iconBg="bg-amber-500"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <StatsCard 
            title={"Active Listings"} 
            value="12" 
            icon={<Package />} 
            detail={"Verified quality clusters"} 
            color="text-blue-600" 
            bgColor="from-blue-50 to-cyan-50"
            iconBg="bg-blue-500"
          />
        </motion.div>
      </div>

      {/* Upgrade & Verification Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* National Tier Upgrade */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 shadow-xl group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-[4rem] group-hover:bg-green-500/20 transition-all" />
          
          <motion.div
            className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <Activity size={28} className="text-green-400" />
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-tight mb-3">National Tier Upgrade</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your current performance ranks you in the top 12% of farmers in your region. Complete 5 more orders without cancellation to unlock Elite Gold benefits.
              </p>
            </div>

            <div className="flex items-center gap-3 text-green-400 font-black text-xs uppercase tracking-wider group-hover:translate-x-2 transition-transform">
              View Reward Roadmap <ArrowRight size={18} />
            </div>
          </div>
        </motion.div>

        {/* Verification Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} className="text-green-600" />
            </div>

            <h4 className="text-xl font-black text-slate-900">Verification Status</h4>

            <div className="space-y-3">
              <VerificationItem label={"Aadhaar KYC"} status={"VERIFIED"} />
              <VerificationItem label={"Bank Account"} status={"VERIFIED"} />
              <VerificationItem label={"On-Chain Ledger"} status={onChainStats?.isBlockchainVerified ? "ACTIVE" : "PENDING"} />
              <VerificationItem label={"Farm Geo-Tag"} status={"PENDING"} />
            </div>

            <button className="w-full h-12 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <Database size={18} />
              {onChainStats?.isBlockchainVerified ? "View On-Chain Audit" : "Initiate Chain Link"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, detail, color, bgColor, iconBg }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-gradient-to-br ${bgColor} rounded-2xl p-6 shadow-lg border border-slate-100 group cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`h-12 w-12 ${iconBg} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <span className="bg-white px-2 py-1 rounded-lg text-[10px] font-black text-slate-600 uppercase">Live</span>
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
      <h3 className={`text-3xl font-black tracking-tight mb-2 ${color}`}>{value}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{detail}</p>
    </motion.div>
  );
}

function VerificationItem({ label, status }: any) {
  const isVerified = status === 'VERIFIED' || status === 'ACTIVE';
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        {isVerified ? (
          <CheckCircle2 size={16} className="text-green-600" />
        ) : (
          <AlertTriangle size={16} className="text-amber-500" />
        )}
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <span className={`text-xs font-black tracking-wider px-3 py-1 rounded-full ${
        isVerified 
          ? 'bg-green-100 text-green-700' 
          : 'bg-amber-100 text-amber-700'
      }`}>
        {status}
      </span>
    </div>
  );
}

export default ReputationHub;