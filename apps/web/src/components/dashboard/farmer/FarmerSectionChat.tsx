'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, Users, Search, Phone, Settings, Bell, Heart, TrendingUp,
  BarChart3, Shield, Clock, Filter, ChevronRight, Star, Award, Zap,
  Plus, X, CheckCircle2, AlertCircle, Forward, Archive, Pin, Eye, Leaf
} from 'lucide-react';

interface FarmerChatUser {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  reputationScore: number;
  totalDeals: number;
  responseTime: string;
  crops?: string[];
  farmSize?: string;
}

interface FarmerMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  read: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
  type: 'text' | 'image' | 'file';
}

interface FarmerGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  icon: string;
  messageCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  topic: string;
}

const mockFarmerUsers: FarmerChatUser[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop',
    verified: true,
    status: 'online',
    lastSeen: new Date(),
    reputationScore: 4.9,
    totalDeals: 58,
    responseTime: '< 1 min',
    crops: ['Tomato', 'Onion', 'Potato'],
    farmSize: '5 acres',
  },
  {
    id: '2',
    name: 'Priya Singh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
    verified: true,
    status: 'online',
    lastSeen: new Date(),
    reputationScore: 4.8,
    totalDeals: 42,
    responseTime: '< 2 min',
    crops: ['Wheat', 'Rice', 'Barley'],
    farmSize: '8 acres',
  },
  {
    id: '3',
    name: 'Vikram Nayak',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
    verified: true,
    status: 'away',
    lastSeen: new Date(Date.now() - 30 * 60000),
    reputationScore: 4.7,
    totalDeals: 35,
    responseTime: '< 5 min',
    crops: ['Cotton', 'Sugarcane'],
    farmSize: '10 acres',
  },
  {
    id: '4',
    name: 'Deepa Patil',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
    verified: false,
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 3600000),
    reputationScore: 4.4,
    totalDeals: 28,
    responseTime: '< 10 min',
    crops: ['Vegetables', 'Herbs'],
    farmSize: '3 acres',
  },
];

const mockFarmerGroups: FarmerGroup[] = [
  {
    id: '1',
    name: 'Organic Farming Network',
    description: 'Farmers practicing organic cultivation and sustainable farming',
    members: 456,
    icon: '🌱',
    messageCount: 2145,
    lastMessage: 'New organic certification requirements announced',
    lastMessageTime: new Date(Date.now() - 5 * 60000),
    unread: 8,
    topic: 'organic',
  },
  {
    id: '2',
    name: 'Crop Protection Hub',
    description: 'Discuss pest management and crop diseases',
    members: 234,
    icon: '🐛',
    messageCount: 892,
    lastMessage: 'Sharing strategies for managing early blight in tomatoes',
    lastMessageTime: new Date(Date.now() - 15 * 60000),
    unread: 3,
    topic: 'protection',
  },
  {
    id: '3',
    name: 'Market Rates Forum',
    description: 'Real-time market prices and trading opportunities',
    members: 678,
    icon: '📊',
    messageCount: 3456,
    lastMessage: 'Tomato prices up 12% this week',
    lastMessageTime: new Date(Date.now() - 1 * 3600000),
    unread: 0,
    topic: 'market',
  },
  {
    id: '4',
    name: 'Irrigation & Water Management',
    description: 'Best practices for water conservation and irrigation',
    members: 345,
    icon: '💧',
    messageCount: 1234,
    lastMessage: 'Drip irrigation ROI analysis shared',
    lastMessageTime: new Date(Date.now() - 2 * 3600000),
    unread: 2,
    topic: 'irrigation',
  },
];

export function FarmerSectionChat() {
  const [activeView, setActiveView] = useState<'messages' | 'groups' | 'directory'>('messages');
  const [selectedUser, setSelectedUser] = useState<string | null>(mockFarmerUsers[0]?.id || null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<FarmerMessage[]>([
    {
      id: '1',
      senderId: 'other-1',
      senderName: 'Rajesh Kumar',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop',
      content: 'Hey! Just harvested fresh tomatoes. Quality is excellent this season. Interested in bulk orders?',
      timestamp: new Date(Date.now() - 20 * 60000),
      read: true,
      sentiment: 'positive',
      type: 'text',
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
      content: 'That\'s great! I have a buyer looking for 500kg of Grade A tomatoes. Can you supply?',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: true,
      sentiment: 'positive',
      type: 'text',
    },
    {
      id: '3',
      senderId: 'other-1',
      sensorName: 'Rajesh Kumar',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop',
      content: 'Absolutely! I can supply 500kg by tomorrow. Pricing is ₹45/kg with free delivery within 20km.',
      timestamp: new Date(Date.now() - 10 * 60000),
      read: true,
      sentiment: 'positive',
      type: 'text',
    },
    {
      id: '4',
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
      content: 'Perfect! Let me confirm with the buyer. I\'ll send you the payment and delivery details within an hour.',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: true,
      sentiment: 'positive',
      type: 'text',
    },
  ]);

  const currentUser = mockFarmerUsers.find(u => u.id === selectedUser);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUser) {
      const newMessage: FarmerMessage = {
        id: Date.now().toString(),
        senderId: 'user',
        senderName: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
        content: messageInput,
        timestamp: new Date(),
        read: false,
        sentiment: 'neutral',
        type: 'text',
      };
      setConversationMessages([...conversationMessages, newMessage]);
      setMessageInput('');
      
      // Simulate response after 2 seconds
      setTimeout(() => {
        const responseMessage: FarmerMessage = {
          id: (Date.now() + 1).toString(),
          senderId: selectedUser,
          senderName: currentUser?.name || 'Farmer',
          senderAvatar: currentUser?.avatar || '',
          content: 'Great! I appreciate your quick response. Let\'s make this deal happen.',
          timestamp: new Date(),
          read: false,
          sentiment: 'positive',
          type: 'text',
        };
        setConversationMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-900 via-slate-900 to-green-900 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-md border-b border-green-500/20 p-6"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg"
            >
              <Leaf size={28} />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Farmer Hub Chat</h1>
              <p className="text-green-200 text-sm font-medium">Connect with buyers • Share harvests • Build network</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowNewChat(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            New Chat
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-hidden max-w-[1400px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full p-6">
          {/* Left Sidebar - User/Group List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-black/30 backdrop-blur-md rounded-[2rem] border border-green-500/20 flex flex-col overflow-hidden"
          >
            {/* Navigation Tabs */}
            <div className="flex border-b border-green-500/20 p-4 gap-2">
              {[
                { id: 'messages', label: 'Direct', icon: MessageCircle },
                { id: 'groups', label: 'Groups', icon: Users },
                { id: 'directory', label: 'Find', icon: Search },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  whileHover={{ scale: 1.05 }}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all text-xs font-bold flex items-center justify-center gap-1 ${
                    activeView === tab.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-white/5 text-green-200 hover:bg-white/10'
                  }`}
                >
                  <tab.icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Search Box */}
            <div className="p-4 border-b border-green-500/20">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-green-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm"
                />
              </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {activeView === 'messages' && (
                <div className="space-y-2 p-4">
                  {mockFarmerUsers.map((user) => (
                    <motion.button
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      whileHover={{ x: 4 }}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        selectedUser === user.id
                          ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-500'
                          : 'bg-white/5 hover:bg-white/10 border border-green-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                            user.status === 'online' ? 'bg-green-500' :
                            user.status === 'away' ? 'bg-yellow-500' :
                            'bg-slate-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white text-sm truncate">{user.name}</p>
                            {user.verified && <Shield size={12} className="text-green-400 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-green-300">{user.crops?.[0] || 'Farmer'} • {user.responseTime}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {activeView === 'groups' && (
                <div className="space-y-2 p-4">
                  {mockFarmerGroups.map((group) => (
                    <motion.button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      whileHover={{ x: 4 }}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        selectedGroup === group.id
                          ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-500'
                          : 'bg-white/5 hover:bg-white/10 border border-green-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{group.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm truncate">{group.name}</p>
                          <p className="text-xs text-green-300">{group.members} members</p>
                          {group.unread > 0 && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                              {group.unread} unread
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {activeView === 'directory' && (
                <div className="p-4 space-y-3">
                  <p className="text-green-300 text-center text-sm font-medium py-4">Featured Farmers</p>
                  {mockFarmerUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 border border-green-500/20 rounded-xl p-3 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                          <p className="font-bold text-white text-sm">{user.name}</p>
                          <p className="text-xs text-green-300">{user.crops?.join(', ')}</p>
                        </div>
                      </div>
                      <button className="w-full px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all">
                        Connect
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Side - Chat Area */}
          {(selectedUser || selectedGroup) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 bg-black/30 backdrop-blur-md rounded-[2rem] border border-green-500/20 flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              {currentUser && (
                <div className="border-b border-green-500/20 p-4 flex items-center justify-between bg-black/40">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full" />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                        currentUser.status === 'online' ? 'bg-green-500' :
                        currentUser.status === 'away' ? 'bg-yellow-500' :
                        'bg-slate-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                        {currentUser.verified && <Shield size={16} className="text-green-400" />}
                      </div>
                      <p className="text-xs text-green-300">
                        {currentUser.crops?.join(' • ')}{currentUser.farmSize && ` • ${currentUser.farmSize}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Phone size={20} className="text-green-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Settings size={20} className="text-green-400" />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {conversationMessages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-xl ${
                      message.senderId === 'user'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-br-none'
                        : 'bg-white/10 text-white rounded-bl-none border border-green-500/30'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'user' ? 'text-green-100' : 'text-green-300'
                      }`}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t border-green-500/20 p-4 bg-black/40">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-green-500/30 rounded-xl text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-bold flex items-center gap-2"
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowNewChat(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-green-900 rounded-[2rem] border border-green-500/30 p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">Start New Chat</h3>
                <button
                  onClick={() => setShowNewChat(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-green-200 mb-2">Search Farmers/Buyers</label>
                  <input
                    type="text"
                    placeholder="Find a farmer or buyer..."
                    className="w-full px-4 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {mockFarmerUsers.map((user) => (
                    <motion.button
                      key={user.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedUser(user.id);
                        setShowNewChat(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-green-500/20 rounded-lg transition-all"
                    >
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      <div className="text-left flex-1">
                        <p className="font-bold text-white text-sm">{user.name}</p>
                        <p className="text-xs text-green-300">{user.crops?.join(', ')}</p>
                      </div>
                      <ChevronRight size={16} className="text-green-400" />
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={() => setShowNewChat(false)}
                  className="w-full mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
