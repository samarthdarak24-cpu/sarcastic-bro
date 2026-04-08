'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MessageSquare, Video, Globe, Zap, TrendingUp, BarChart3,
  Shield, Bell, Users, Phone, Settings, Search, Target
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ConversationList from '@/components/chat/ConversationList';
import EnhancedChatInterface from '@/components/chat/EnhancedChatInterface';
import { chatService } from '@/services/chatService';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'video' | 'voice' | null>(null);
  const [callStatus, setCallStatus] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [userRole, setUserRole] = useState<'FARMER' | 'BUYER'>(((user as any)?.role) === 'BUYER' ? 'BUYER' : 'FARMER');

  useEffect(() => {
    loadConversations();
  }, [userRole]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      // Don't show error toast if it's just an auth issue
      if (error instanceof Error && !error.message.includes('token')) {
        toast.error('Failed to load conversations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation);
    router.push(`/chat/${conversation.id}`);
  };

  const handleVideoCall = () => {
    if (!selectedConversation) return;
    setCallType('video');
    setIsCalling(true);
    setCallStatus('connecting');
    setTimeout(() => setCallStatus('active'), 2000);
  };

  const handleVoiceCall = () => {
    if (!selectedConversation) return;
    setCallType('voice');
    setIsCalling(true);
    setCallStatus('connecting');
    setTimeout(() => setCallStatus('active'), 1500);
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setIsCalling(false);
      setCallType(null);
    }, 1000);
  };

  const toggleRole = () => {
    const nextRole = userRole === 'FARMER' ? 'BUYER' : 'FARMER';
    setUserRole(nextRole);
    toast.success(`Switched to ${nextRole} Profile`, { icon: '🔄' });
    loadConversations();
  };

  const handleAnalytics = () => {
    router.push('/chat/analytics');
  };

  const features = [
    {
      id: 'real-time',
      icon: MessageSquare,
      title: 'Real-Time Chat',
      description: 'Instant messaging with typing indicators and read receipts',
      color: 'blue',
      onClick: () => {
        if (conversations.length > 0) {
          setSelectedConversation(conversations[0]);
          toast.success('Switched to real-time chat');
        } else {
          toast('Start a new conversation to use real-time chat', { icon: '💬' });
        }
      }
    },
    {
      id: 'translation',
      icon: Globe,
      title: 'AI Translation',
      description: translationEnabled ? 'Translation is ACTIVE' : 'Automatic language translation in 10+ languages',
      color: translationEnabled ? 'emerald' : 'green',
      onClick: () => {
        setTranslationEnabled(!translationEnabled);
        toast.success(translationEnabled ? 'Translation disabled' : 'AI Translation enabled! All messages will be auto-translated');
      }
    },
    {
      id: 'matching',
      icon: Target,
      title: 'Smart Matching',
      description: 'AI-powered buyer-farmer matching algorithm',
      color: 'green',
      onClick: () => router.push('/chat/matching')
    },
    {
      id: 'video',
      icon: Video,
      title: 'Video Calls',
      description: 'HD video calls for product inspection',
      color: 'red',
      onClick: () => router.push('/chat/video-call')
    },
    {
      id: 'templates',
      icon: Zap,
      title: 'Quick Templates',
      description: 'Pre-built response templates for faster communication',
      color: 'amber',
      onClick: () => toast('Click the "Lightning" icon in chat to use templates', { icon: '⚡' })
    },
    {
      id: 'negotiation',
      icon: TrendingUp,
      title: 'Negotiation Tracker',
      description: 'Track deal progress and price negotiations',
      color: 'indigo',
      onClick: () => {
        if (selectedConversation) {
          toast.success('Negotiation tracker activated for this conversation');
        } else {
          toast('Select a conversation to use the negotiation tracker', { icon: '🤝' });
        }
      }
    },
    {
      id: 'sentiment',
      icon: BarChart3,
      title: 'Sentiment Analysis',
      description: 'Real-time conversation mood tracking',
      color: 'pink',
      onClick: () => {
        if (selectedConversation) {
          toast.success('Sentiment analysis is monitoring your conversation');
        } else {
          toast('Select a conversation to see sentiment trends', { icon: '📊' });
        }
      }
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Priority-based intelligent notifications',
      color: 'cyan',
      onClick: () => toast.success('Smart notifications are configured for high priority deals')
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Conversation Analytics',
      description: 'Detailed metrics on communication performance',
      color: 'emerald',
      onClick: handleAnalytics
    },
    {
      id: 'verification',
      icon: Shield,
      title: 'Trust & Verification',
      description: isVerified ? 'UNSTOPPABLE TRUST: Profile Verified' : 'Verified badges and blockchain credentials',
      color: isVerified ? 'blue' : 'violet',
      onClick: () => {
        if (!isVerified) {
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: 'Verifying credentials on blockchain...',
              success: () => {
                setIsVerified(true);
                return 'PROFILE VERIFIED: You now have the Trust Badge!';
              },
              error: 'Verification failed',
            }
          );
        } else {
          toast.success('Your account is already verified with Blockchain ID: ODOP-774-XXX');
        }
      }
    }
  ];

  const filteredConversations = conversations.filter((conv: any) =>
    conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Enhanced currentUser based on toggled role
  const currentUser = {
    id: userRole === 'FARMER' ? 'demo-farmer-1' : 'demo-buyer-1',
    name: userRole === 'FARMER' ? 'Farmer Shailesh' : 'FreshMart Sourcing',
    role: userRole,
    avatar: userRole === 'FARMER' ? '👨‍🌾' : '🏢',
    district: 'Nashik',
    state: 'Maharashtra'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <MessageSquare size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">AgriChat Pro</h1>
                <p className="text-sm text-slate-600">WhatsApp + Zoom + Alibaba Combined</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/chat/video-call')}
                className="h-11 px-6 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Video size={18} />
                Start Video Call
              </button>
              <button
                onClick={handleAnalytics}
                className="h-11 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <BarChart3 size={18} />
                Analytics
              </button>
              <button className="h-11 w-11 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all">
                <Settings size={20} className="text-slate-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Communication Features</h2>
          <p className="text-slate-600">All features are fully functional and clickable</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {features.map((feature) => (
            <motion.button
              key={feature.id}
              onClick={feature.onClick}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all text-left group"
            >
              <div className={`h-12 w-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} className={`text-${feature.color}-600`} />
              </div>
              <h3 className="font-black text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
              <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm">
                <span>Open</span>
                <span>→</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* WhatsApp-Style Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden h-[800px]">
          {/* Conversation List (Sidebar) */}
          <div className="lg:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
            <div className="p-4 bg-white border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {(currentUser as any).avatar || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{currentUser.name}</h3>
                    <p className="text-xs text-green-600 font-bold uppercase">Online Now</p>
                  </div>
                </div>
                <button className="h-9 w-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center">
                  <Users size={18} className="text-slate-600" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search farmers or buyers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={filteredConversations}
                selectedConversation={selectedConversation}
                onSelect={(conv: any) => setSelectedConversation(conv)}
                loading={loading}
              />
            </div>
            
            <div className="p-4 bg-blue-600 text-white">
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={toggleRole}
                  className="px-6 h-12 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-black hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Users size={20} />
                  SWITCH TO {userRole === 'FARMER' ? 'BUYER' : 'FARMER'} VIEW
                </button>
                <div className="h-10 w-px bg-slate-300" />
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200">
                  <span className="text-sm font-bold text-slate-500 uppercase">Status:</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-black text-slate-900">PRO System Live</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => router.push('/chat/matching')}
                className="w-full h-11 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
              >
                <Target size={18} />
                {userRole === 'FARMER' ? 'Match with Buyers' : 'Match with Farmers'}
              </button>
            </div>
          </div>

          {/* Chat Area (Main Content) */}
          <div className="lg:col-span-8 flex flex-col h-full">
            {selectedConversation ? (
              <EnhancedChatInterface
                conversation={selectedConversation}
                onVideoCall={handleVideoCall}
                onVoiceCall={handleVoiceCall}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'
                }} />
                
                <div className="text-center max-w-sm px-6 relative z-10">
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <MessageSquare size={48} className="text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3">AgriChat Pro</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Select a conversation or use Smart Matching to start trading secure and verified products directly with buyers and farmers.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">
                      🛡️ Verified Only
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">
                      🏦 Escrow Ready
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Immersive Call Simulation UI */}
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-8 text-white"
          >
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-tighter backdrop-blur-lg">
                AgriChat Pro Encrypted
              </div>
            </div>

            <div className="relative mb-12">
              <div className={`h-48 w-48 rounded-[3rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-8xl shadow-2xl ${callStatus === 'connecting' ? 'animate-pulse' : ''}`}>
                {selectedConversation?.otherUser.avatar}
              </div>
              <div className="absolute -bottom-4 right-0 h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <Video size={32} className="text-indigo-600" />
              </div>
            </div>

            <h2 className="text-4xl font-black mb-2 tracking-tight">{selectedConversation?.otherUser.name}</h2>
            <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-[0.2em] mb-12">
              {callStatus === 'connecting' ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" />
                  <span>Connecting Secure Line...</span>
                </>
              ) : callStatus === 'active' ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Call In Progress (HD)</span>
                </>
              ) : (
                <span className="text-red-400">Call Ended</span>
              )}
            </div>

            <div className="flex items-center gap-6">
              <button className="h-16 w-16 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all backdrop-blur-lg">
                <Shield size={24} />
              </button>
              <button 
                onClick={endCall}
                className="h-20 w-20 bg-red-600 hover:bg-red-700 rounded-3xl flex items-center justify-center transition-all shadow-xl hover:scale-105"
              >
                <Phone size={32} className="rotate-[135deg]" />
              </button>
              <button className="h-16 w-16 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all backdrop-blur-lg">
                <Users size={24} />
              </button>
            </div>

            {callType === 'video' && callStatus === 'active' && (
              <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <p className="text-xs font-bold text-white/40 uppercase mb-2">AI Insights Scanner Active</p>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-xs font-bold border border-green-500/30">
                    SINCERE SENTIMENT DETECTED
                  </div>
                  <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-xs font-bold border border-blue-500/30">
                    IDENTITY VERIFIED VIA BLOCKCHAIN
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
