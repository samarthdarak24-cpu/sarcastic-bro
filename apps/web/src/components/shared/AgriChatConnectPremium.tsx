"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Video,
  Globe,
  Zap,
  TrendingUp,
  BarChart3,
  Shield,
  Bell,
  Target,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// This component can be used by both farmers and buyers
interface AgriChatConnectPremiumProps {
  userRole: "FARMER" | "BUYER";
}

export function AgriChatConnectPremium({ userRole }: AgriChatConnectPremiumProps) {
  const router = useRouter();

  // Don't auto-redirect, let users stay in the dashboard
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push('/chat');
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // }, [router]);

  const features = [
    {
      id: "realtime-chat",
      name: "Real-Time Chat",
      description: "Instant messaging with typing indicators and read receipts",
      icon: MessageSquare,
      active: true,
    },
    {
      id: "ai-translation",
      name: "AI Translation",
      description: "Automatic language translation in 10+ languages",
      icon: Globe,
      active: true,
    },
    {
      id: "smart-matching",
      name: "Smart Matching",
      description: "AI-powered buyer-farmer matching algorithm",
      icon: Target,
      active: true,
    },
    {
      id: "video-calls",
      name: "Video Calls",
      description: "HD video calls for product inspection",
      icon: Video,
      active: true,
    },
    {
      id: "quick-templates",
      name: "Quick Templates",
      description: "Pre-built response templates for faster communication",
      icon: Zap,
      active: true,
    },
    {
      id: "negotiation-tracker",
      name: "Negotiation Tracker",
      description: "Track deal progress and price negotiations",
      icon: TrendingUp,
      active: true,
    },
    {
      id: "sentiment-analysis",
      name: "Sentiment Analysis",
      description: "Real-time conversation mood tracking",
      icon: Heart,
      active: true,
    },
    {
      id: "smart-notifications",
      name: "Smart Notifications",
      description: "Priority-based intelligent notifications",
      icon: Bell,
      active: true,
    },
    {
      id: "analytics",
      name: "Conversation Analytics",
      description: "Detailed metrics on communication performance",
      icon: BarChart3,
      active: true,
    },
    {
      id: "verification",
      name: "Trust & Verification",
      description: "Verified badges and blockchain credentials",
      icon: Shield,
      active: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">AgriChat Connect</h1>
          <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm flex items-center gap-2">
            <Sparkles size={16} className="animate-pulse" />
            AI POWERED
          </div>
        </div>
        <p className="text-slate-500 font-medium text-lg mb-6">
          {userRole === "FARMER" ? "Connect with buyers directly" : "Connect with farmers directly"}
        </p>
        <button
          onClick={() => router.push('/chat')}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3"
        >
          Open Full Chat System
          <ArrowRight size={20} />
        </button>
      </motion.div>

      {/* Redirecting Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border-2 border-blue-500 p-8 text-center shadow-xl"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Redirecting to Chat System...</h3>
        <p className="text-slate-600">Taking you to the full-featured chat interface with all 10 features</p>
      </motion.div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-6">All Features Available & Clickable</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, idx) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => router.push('/chat')}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group text-left"
            >
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              <h4 className="text-sm font-black text-slate-900 mb-2">{feature.name}</h4>
              <p className="text-xs text-slate-600 font-medium mb-4">{feature.description}</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-600">Active</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-blue-600 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Click to use</span>
                <ArrowRight size={14} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-black mb-3">🎉 Upgraded Chat System!</h3>
        <p className="text-lg mb-4">
          All chat features have been upgraded to a new, more powerful system
        </p>
        <p className="text-sm opacity-90 mb-6">
          Click any feature card above or wait to be automatically redirected
        </p>
        <button
          onClick={() => router.push('/chat')}
          className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-2"
        >
          Go to Chat Now
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
