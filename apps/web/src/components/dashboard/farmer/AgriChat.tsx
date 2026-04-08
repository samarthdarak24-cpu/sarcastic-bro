"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  MessageSquare, Video, Globe, Zap, TrendingUp, BarChart3,
  Shield, Bell, Users, ArrowRight, Sparkles
} from "lucide-react";

export function AgriChat() {
  const router = useRouter();

  // Automatically redirect to the new chat system
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/chat');
    }, 1500); // Give user 1.5 seconds to see the message
    return () => clearTimeout(timer);
  }, [router]);

  const features = [
    {
      id: 'real-time',
      icon: MessageSquare,
      title: 'Real-Time Chat',
      description: 'Instant messaging with typing indicators and read receipts',
      color: 'blue',
    },
    {
      id: 'translation',
      icon: Globe,
      title: 'AI Translation',
      description: 'Automatic language translation in 10+ languages',
      color: 'green',
    },
    {
      id: 'matching',
      icon: Users,
      title: 'Smart Matching',
      description: 'AI-powered buyer-farmer matching algorithm',
      color: 'purple',
    },
    {
      id: 'video',
      icon: Video,
      title: 'Video Calls',
      description: 'HD video calls for product inspection',
      color: 'red',
    },
    {
      id: 'templates',
      icon: Zap,
      title: 'Quick Templates',
      description: 'Pre-built response templates',
      color: 'amber',
    },
    {
      id: 'negotiation',
      icon: TrendingUp,
      title: 'Negotiation Tracker',
      description: 'Track deal progress',
      color: 'indigo',
    },
    {
      id: 'sentiment',
      icon: BarChart3,
      title: 'Sentiment Analysis',
      description: 'Real-time mood tracking',
      color: 'pink',
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Priority-based alerts',
      color: 'cyan',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics',
      description: 'Communication metrics',
      color: 'emerald',
    },
    {
      id: 'verification',
      icon: Shield,
      title: 'Trust & Verification',
      description: 'Verified badges',
      color: 'violet',
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">AgriChat</h1>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm flex items-center gap-2">
              <Sparkles size={16} className="animate-pulse" />
              AI POWERED
            </div>
          </div>
          <p className="text-lg text-slate-600 font-medium mb-6">
            Connect with buyers directly • Real-time messaging • AI-powered features
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3"
            >
              Open Chat System
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Redirecting Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border-2 border-blue-500 p-8 mb-8 text-center shadow-xl"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Redirecting to Chat System...</h3>
          <p className="text-slate-600">Taking you to the full-featured chat interface</p>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">All Features Available</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all"
              >
                <div className={`h-12 w-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                  <feature.icon size={24} className={`text-${feature.color}-600`} />
                </div>
                <h3 className="font-black text-slate-900 mb-2 text-sm">{feature.title}</h3>
                <p className="text-xs text-slate-600 mb-3">{feature.description}</p>
                <div className="flex items-center gap-2 text-green-600 font-bold text-xs">
                  <span>✓</span>
                  <span>Active</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-black mb-3">🎉 New Chat System Available!</h3>
          <p className="text-lg mb-4">
            All chat features have been upgraded to a new, more powerful system
          </p>
          <p className="text-sm opacity-90">
            You'll be automatically redirected in a moment, or click the button above to go now
          </p>
        </div>
      </div>
    </div>
  );
}

export default AgriChat;
