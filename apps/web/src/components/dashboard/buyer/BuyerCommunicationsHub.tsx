'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, Globe, Users, Video, BarChart3, Heart, Bell, CheckCircle, Shield,
  Phone, Mic, Paperclip, Smile, Clock, TrendingUp, Award, Lock, Zap, User, Search,
  Download, Share2, Flag, AlertCircle, CheckCircle2, XCircle, Filter, Calendar,
  MoreVertical, ThumbsUp, ThumbsDown, Copy, Archive, Pin, Eye, RefreshCw, Settings,
  Voicemail, Copy as CopyIcon
} from 'lucide-react';
import { PremiumFeatureLayout } from './shared/PremiumFeatureLayout';
import { motion as framer } from 'framer-motion';

interface SubFeature {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
}

interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'voice';
  translations?: Record<string, string>;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantVerified: boolean;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
  typingIndicator: boolean;
}

const subFeatures: SubFeature[] = [
  { id: 'realtime-chat', name: 'Real-Time Chat', icon: MessageCircle, description: 'Instant messaging with indicators', color: 'blue' },
  { id: 'ai-translation', name: 'AI Translation', icon: Globe, description: '10+ languages support', color: 'cyan' },
  { id: 'smart-matching', name: 'Smart Matching', icon: Users, description: 'AI-powered connections', color: 'indigo' },
  { id: 'video-calls', name: 'Video Calls', icon: Video, description: 'HD product inspection', color: 'purple' },
  { id: 'quick-templates', name: 'Quick Templates', icon: Zap, description: 'Pre-built responses', color: 'amber' },
  { id: 'negotiation-tracker', name: 'Negotiation Tracker', icon: TrendingUp, description: 'Deal progress tracking', color: 'emerald' },
  { id: 'sentiment-analysis', name: 'Sentiment Analysis', icon: Heart, description: 'Mood tracking', color: 'rose' },
  { id: 'smart-notifications', name: 'Smart Notifications', icon: Bell, description: 'Priority alerts', color: 'orange' },
  { id: 'analytics', name: 'Conversation Analytics', icon: BarChart3, description: 'Performance metrics', color: 'pink' },
  { id: 'trust-verification', name: 'Trust & Verification', icon: Shield, description: 'Verified badges', color: 'green' },
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantName: 'Rajesh Kumar',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
    participantVerified: true,
    lastMessage: 'Great! We can close the deal at ₹45/kg',
    lastMessageTime: new Date(Date.now() - 5 * 60000),
    unreadCount: 2,
    typingIndicator: false,
    messages: [
      {
        id: '1',
        sender: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
        content: 'Hi Rajesh, interested in 500kg of premium tomatoes?',
        timestamp: new Date(Date.now() - 20 * 60000),
        read: true,
        type: 'text',
        sentiment: 'positive',
      },
      {
        id: '2',
        sender: 'Rajesh Kumar',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
        content: 'Yes, perfect! What\'s your asking price?',
        timestamp: new Date(Date.now() - 15 * 60000),
        read: true,
        type: 'text',
        sentiment: 'positive',
      },
      {
        id: '3',
        sender: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
        content: 'Minimum ₹50/kg for premium grade. Small discount available for bulk orders.',
        timestamp: new Date(Date.now() - 10 * 60000),
        read: true,
        type: 'text',
        sentiment: 'neutral',
      },
      {
        id: '4',
        sender: 'Rajesh Kumar',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
        content: 'Great! We can close the deal at ₹45/kg',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false,
        type: 'text',
        sentiment: 'positive',
      },
    ],
  },
];

const messageTemplates = [
  { id: '1', title: 'Price Inquiry', content: 'Hi, what\'s your current price for {{product}}? Interested in {{quantity}} {{unit}}.' },
  { id: '2', title: 'Quality Check', content: 'Can you provide quality grades and certification details? What\'s your grading standard?' },
  { id: '3', title: 'Bulk Order', content: 'We need {{quantity}} {{unit}} of {{product}}. Can you supply regularly? What bulk discounts do you offer?' },
  { id: '4', title: 'Delivery Terms', content: 'What\'s your delivery timeline? Do you handle logistics or is buyer responsibility?' },
  { id: '5', title: 'Payment Terms', content: 'What payment methods do you accept? Can we arrange partial advance payment?' },
  { id: '6', title: 'Availability', content: 'When can you deliver {{quantity}} {{unit}}? Are you available year-round?' },
];

const sentimentData = [
  { timestamp: '10:00 AM', positive: 65, neutral: 20, negative: 15 },
  { timestamp: '11:00 AM', positive: 70, neutral: 18, negative: 12 },
  { timestamp: '12:00 PM', positive: 75, neutral: 15, negative: 10 },
  { timestamp: '1:00 PM', positive: 80, neutral: 12, negative: 8 },
  { timestamp: '2:00 PM', positive: 85, neutral: 10, negative: 5 },
];

const negotiationDeals = [
  {
    id: '1',
    product: 'Premium Tomatoes',
    seller: 'Rajesh Kumar',
    quantity: 500,
    unit: 'kg',
    initialPrice: 50,
    currentPrice: 45,
    status: 'near-closing',
    progress: 85,
    lastUpdate: new Date(Date.now() - 5 * 60000),
  },
  {
    id: '2',
    product: 'Basmati Rice',
    seller: 'Arjun Singh',
    quantity: 1000,
    unit: 'kg',
    initialPrice: 100,
    currentPrice: 92,
    status: 'in-progress',
    progress: 60,
    lastUpdate: new Date(Date.now() - 30 * 60000),
  },
];

export function BuyerCommunicationsHub() {
  const [activeSubFeature, setActiveSubFeature] = useState('realtime-chat');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(mockConversations[0]?.id || null);
  const [messageInput, setMessageInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showTemplates, setShowTemplates] = useState(false);
  const [callActive, setCallActive] = useState(false);

  const currentConversation = mockConversations.find(c => c.id === selectedConversation);

  const stats = [
    {
      label: 'Active Chats',
      value: '12',
      icon: MessageCircle,
      color: 'blue',
      trend: '+3',
    },
    {
      label: 'Response Rate',
      value: '96%',
      icon: TrendingUp,
      color: 'emerald',
      trend: '+5%',
    },
    {
      label: 'Deals Closed',
      value: '8',
      icon: CheckCircle2,
      color: 'green',
      trend: '+2',
    },
    {
      label: 'Avg Sentiment',
      value: '4.8/5',
      icon: Heart,
      color: 'rose',
      trend: '+0.3',
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim() && currentConversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
        content: messageInput,
        timestamp: new Date(),
        read: false,
        type: 'text',
        sentiment: 'neutral',
      };
      currentConversation.messages.push(newMessage);
      setMessageInput('');
    }
  };

  const renderRealtimeChat = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="lg:col-span-1 border-r border-slate-200 overflow-y-auto">
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
          {mockConversations.map((conv) => (
            <motion.button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              whileHover={{ x: 4 }}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedConversation === conv.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img src={conv.participantAvatar} alt={conv.participantName} className="w-10 h-10 rounded-full" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-900 truncate">{conv.participantName}</p>
                    {conv.participantVerified && <Shield size={12} className="text-green-600 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && (
                    <div className="mt-1">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                        {conv.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {currentConversation && (
        <div className="lg:col-span-3 flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={currentConversation.participantAvatar} alt={currentConversation.participantName} className="w-10 h-10 rounded-full" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900">{currentConversation.participantName}</p>
                  {currentConversation.participantVerified && (
                    <Shield size={16} className="text-green-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500">Online • Last active just now</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCallActive(!callActive)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Phone size={20} className={callActive ? 'text-green-600' : 'text-slate-600'} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <MoreVertical size={20} className="text-slate-600" />
              </motion.button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentConversation.messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-4 py-2 rounded-lg flex items-end gap-2 ${
                  msg.sender === 'You'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-900 rounded-bl-none'
                }`}>
                  <div>
                    <p className="text-sm">{msg.content}</p>
                    <div className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-blue-100' : 'text-slate-500'} flex items-center gap-1`}>
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.sender === 'You' && msg.read && (
                        <CheckCircle size={12} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {currentConversation.typingIndicator && (
              <motion.div animate={{ opacity: [0.5, 1] }} transition={{ repeat: Infinity }} className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <div className="w-2 h-2 rounded-full bg-slate-400" />
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4 space-y-3">
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-2 mb-3"
              >
                {messageTemplates.slice(0, 4).map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setMessageInput(template.content);
                      setShowTemplates(false);
                    }}
                    className="text-left p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <p className="text-xs font-bold text-blue-900">{template.title}</p>
                    <p className="text-xs text-blue-700 truncate">{template.content}</p>
                  </motion.button>
                ))}
              </motion.div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTemplates(!showTemplates)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Zap size={20} className={showTemplates ? 'text-blue-600' : 'text-slate-600'} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Paperclip size={20} className="text-slate-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-bold"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAITranslation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
          <p className="text-sm font-bold text-cyan-900 mb-3">ORIGINAL MESSAGE</p>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-slate-700">"Great deal! When can you deliver?"</p>
          </div>
          <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold">
            <option value="en">English</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="de">German (Deutsch)</option>
            <option value="zh">Chinese (中文)</option>
            <option value="ja">Japanese (日本語)</option>
            <option value="ar">Arabic (العربية)</option>
            <option value="pt">Portuguese (Português)</option>
            <option value="ru">Russian (Русский)</option>
          </select>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <p className="text-sm font-bold text-green-900 mb-3">TRANSLATED MESSAGE</p>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-slate-700">
              {selectedLanguage === 'hi' && '"बहुत अच्छा सौदा! आप कब डिलीवर कर सकते हैं?"'}
              {selectedLanguage === 'es' && '"¡Muy buen trato! ¿Cuándo puedes entregar?"'}
              {selectedLanguage === 'fr' && '"Super affaire! Quand peux-tu livrer?"'}
              {selectedLanguage === 'de' && '"Großartig! Wann kannst du liefern?"'}
              {selectedLanguage === 'zh' && '"很好的交易!你什么时候可以交付?"'}
              {selectedLanguage === 'ja' && '"素晴らしいディール!いつ配達できますか?"'}
              {selectedLanguage === 'ar' && '"صفقة رائعة! متى تستطيع التسليم?"'}
              {selectedLanguage === 'pt' && '"Ótimo negócio! Quando você pode entregar?"'}
              {selectedLanguage === 'ru' && '"Отличная сделка! Когда вы можете доставить?"'}
              {selectedLanguage === 'en' && '"Great deal! When can you deliver?"'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold text-sm flex items-center justify-center gap-2"
          >
            <CopyIcon size={16} />
            Copy Translation
          </motion.button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
        <p className="text-sm font-bold text-indigo-900 mb-4">SUPPORTED LANGUAGES</p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
            { code: 'es', name: 'Spanish', flag: '🇪🇸' },
            { code: 'fr', name: 'French', flag: '🇫🇷' },
            { code: 'de', name: 'German', flag: '🇩🇪' },
            { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
            { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
            { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
            { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
            { code: 'ru', name: 'Russian', flag: '🇷🇺' },
          ].map((lang) => (
            <motion.div key={lang.code} whileHover={{ scale: 1.05 }} className="p-3 bg-white rounded-lg border border-indigo-200 text-center hover:bg-indigo-50 cursor-pointer transition-colors">
              <p className="text-2xl mb-1">{lang.flag}</p>
              <p className="text-xs font-bold text-indigo-900">{lang.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSmartMatching = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Rajesh Kumar', match: 95, crops: 'Tomatoes, Onions', rating: 4.9, location: 'Maharashtra' },
          { name: 'Arjun Singh', match: 88, crops: 'Wheat, Rice', rating: 4.7, location: 'Punjab' },
          { name: 'Priya Sharma', match: 82, crops: 'Vegetables, Herbs', rating: 4.8, location: 'Haryana' },
        ].map((supplier, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900">{supplier.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{supplier.location}</p>
              </div>
              <div className="text-center">
                <div className="relative w-12 h-12 inline-flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white font-bold">
                  {supplier.match}%
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">Crops: {supplier.crops}</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(supplier.rating) ? 'text-yellow-400' : 'text-slate-300'}>★</span>
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700">{supplier.rating}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-bold text-sm"
            >
              Connect
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderVideoCallsInterface = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-slate-900 rounded-2xl p-8 text-white flex flex-col items-center justify-center min-h-[400px]">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-6 shadow-2xl">
          <Video size={64} />
        </motion.div>
        {callActive ? (
          <>
            <p className="text-2xl font-bold mb-2">Connected with Rajesh Kumar</p>
            <p className="text-purple-200 mb-8">00:45 - HD Video Call in Progress</p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transition-all"
                onClick={() => setCallActive(false)}
              >
                <Phone size={24} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} className="w-16 h-16 rounded-full bg-slate-600 hover:bg-slate-700 flex items-center justify-center text-white shadow-lg transition-all">
                <Mic size={24} />
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold mb-2">Start HD Video Call</p>
            <p className="text-purple-200 mb-8">Crystal clear product inspection calls</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCallActive(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-xl transition-all font-bold"
            >
              Start Video Call
            </motion.button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Screen Sharing', 'Product Overlay', 'Quality Inspector', 'Live Chat Enabled'].map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center gap-3"
          >
            <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
            <p className="font-bold text-slate-900">{feature}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderQuickTemplates = () => (
    <div className="space-y-4">
      {messageTemplates.map((template, idx) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl p-6 border border-amber-200 hover:shadow-lg transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-lg">{template.title}</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy size={16} className="text-amber-600" />
            </motion.button>
          </div>
          <p className="text-slate-600 text-sm mb-4">{template.content}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-bold text-sm"
          >
            Use Template
          </motion.button>
        </motion.div>
      ))}
    </div>
  );

  const renderNegotiationTracker = () => (
    <div className="space-y-6">
      {negotiationDeals.map((deal, idx) => (
        <motion.div
          key={deal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-6 border border-emerald-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{deal.product}</h3>
              <p className="text-sm text-slate-600">With {deal.seller}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${deal.status === 'near-closing' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {deal.status === 'near-closing' ? 'Near Closing' : 'In Progress'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-600 mb-1">QUANTITY</p>
              <p className="font-bold text-slate-900">{deal.quantity} {deal.unit}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">INITIAL PRICE</p>
              <p className="font-bold text-slate-900">₹{deal.initialPrice}/kg</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">CURRENT OFFER</p>
              <p className="font-bold text-green-600">₹{deal.currentPrice}/kg</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-slate-600">NEGOTIATION PROGRESS</p>
              <p className="text-sm font-bold text-emerald-600">{deal.progress}%</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${deal.progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Last updated {Math.floor((Date.now() - deal.lastUpdate.getTime()) / 60000)} minutes ago
          </p>

          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-bold text-sm">
              Accept & Close
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-bold text-sm">
              Negotiate More
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderSentimentAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-6 border border-green-300 text-center">
          <p className="text-4xl font-black text-green-600 mb-2">78%</p>
          <p className="font-bold text-green-900">Positive</p>
          <p className="text-xs text-green-700 mt-2">Constructive tone</p>
        </motion.div>
        <motion.div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6 border border-blue-300 text-center">
          <p className="text-4xl font-black text-blue-600 mb-2">18%</p>
          <p className="font-bold text-blue-900">Neutral</p>
          <p className="text-xs text-blue-700 mt-2">Factual information</p>
        </motion.div>
        <motion.div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-xl p-6 border border-red-300 text-center">
          <p className="text-4xl font-black text-red-600 mb-2">4%</p>
          <p className="font-bold text-red-900">Negative</p>
          <p className="text-xs text-red-700 mt-2">Concerns raised</p>
        </motion.div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl p-6 border border-indigo-200">
        <p className="font-bold text-slate-900 mb-4">SENTIMENT TREND</p>
        <div className="space-y-3">
          {sentimentData.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <p className="text-xs font-bold text-slate-600 w-16">{entry.timestamp}</p>
              <div className="flex-1 h-6 bg-white rounded-lg overflow-hidden flex">
                <div style={{ width: `${entry.positive}%` }} className="bg-green-500" />
                <div style={{ width: `${entry.neutral}%` }} className="bg-blue-400" />
                <div style={{ width: `${entry.negative}%` }} className="bg-red-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl p-4 border border-amber-300 flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 mb-1">Insight</p>
          <p className="text-sm text-amber-800">Seller showing very positive sentiment. Great opportunity to finalize the deal!</p>
        </div>
      </div>
    </div>
  );

  const renderSmartNotifications = () => (
    <div className="space-y-4">
      {[
        { priority: 'high', title: 'Urgent: Price Drop Alert', message: 'Tomatoes price dropped 12% - Miss this and pay 6% more tomorrow', timestamp: '2 min ago', icon: AlertCircle, color: 'red' },
        { priority: 'high', title: 'Deal Closing Soon', message: 'Rajesh Kumar waiting for your response - expires in 30 mins', timestamp: '5 min ago', icon: Clock, color: 'orange' },
        { priority: 'medium', title: 'New Supplier Match', message: '95% match found for Basmati Rice from Punjab', timestamp: '15 min ago', icon: Users, color: 'blue' },
        { priority: 'medium', title: 'Message from Arjun Singh', message: 'Can you offer better terms for bulk orders?', timestamp: '25 min ago', icon: MessageCircle, color: 'indigo' },
        { priority: 'low', title: 'Review Received', message: 'New 5-star review from a past buyer', timestamp: '1 hour ago', icon: Star, color: 'yellow' },
      ].map((notif, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`rounded-xl p-4 border-l-4 flex items-start gap-4 hover:shadow-lg transition-all ${
            notif.priority === 'high'
              ? 'bg-red-50 border-red-500'
              : notif.priority === 'medium'
              ? 'bg-blue-50 border-blue-500'
              : 'bg-slate-50 border-slate-300'
          }`}
        >
          <div className={`p-2 rounded-lg text-${notif.color}-600 bg-${notif.color}-100 flex-shrink-0`}>
            <notif.icon size={20} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900">{notif.title}</p>
            <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
            <p className="text-xs text-slate-500 mt-2">{notif.timestamp}</p>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} className="text-slate-400 hover:text-slate-600">
            ✕
          </motion.button>
        </motion.div>
      ))}
    </div>
  );

  const renderConversationAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages', value: '2,456', trend: '+18%', color: 'blue' },
          { label: 'Response Rate', value: '96%', trend: '+5%', color: 'emerald' },
          { label: 'Avg Response Time', value: '42s', trend: '-12%', color: 'indigo' },
          { label: 'Conversion Rate', value: '68%', trend: '+22%', color: 'rose' },
        ].map((stat, idx) => (
          <motion.div key={idx} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-xl p-4 border border-${stat.color}-200`}>
            <p className="text-xs font-bold text-slate-600 uppercase mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</p>
            <p className={`text-xs font-bold text-${stat.color}-600`}>{stat.trend} this week</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <p className="font-bold text-slate-900 mb-4">KEY INSIGHTS</p>
        <div className="space-y-4">
          {[
            'Best performing time: 10-11 AM (45% of deals closed)',
            'Most used template: "Price Inquiry" - 34% of messages',
            'Average deal closure time: 2.3 hours',
            'Top performing supplier: Rajesh Kumar (95% conversion)',
            'Communication channel effectiveness: +28% with templates enabled',
          ].map((insight, idx) => (
            <motion.div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <TrendingUp size={16} className="text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-sm text-slate-700">{insight}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrustVerification = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300 text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full" />
            <div className="absolute inset-1 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-green-900 mb-2">VERIFIED</p>
          <p className="text-sm text-green-700">Identity verified and blockchain backed</p>
          <motion.button whileHover={{ scale: 1.05 }} className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold">
            View Credentials
          </motion.button>
        </motion.div>

        <motion.div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-300">
          <p className="font-bold text-slate-900 mb-4">VERIFICATION BADGES</p>
          <div className="space-y-3">
            {[
              { badge: '✓ Email Verified', status: 'verified' },
              { badge: '✓ Phone Verified', status: 'verified' },
              { badge: '✓ GST Registered', status: 'verified' },
              { badge: '✓ Bank Account Verified', status: 'verified' },
              { badge: '✓ Blockchain ID', status: 'verified' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-green-600" />
                <p className="text-sm font-bold text-slate-800">{item.badge}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
        <p className="font-bold text-slate-900 mb-4">BLOCKCHAIN CREDENTIALS</p>
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-white p-3 rounded-lg border border-indigo-200 break-all">
            <p className="text-gray-500">Wallet: 0x742d35Cc6634C0532925a3b844Bc871...(truncated)</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-indigo-200 break-all">
            <p className="text-gray-500">Verification ID: VID-2024-04-0847-RAJESH</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-bold text-sm">
            View Full Blockchain Record
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderSubFeature = (featureId: string) => {
    switch (featureId) {
      case 'realtime-chat':
        return renderRealtimeChat();
      case 'ai-translation':
        return renderAITranslation();
      case 'smart-matching':
        return renderSmartMatching();
      case 'video-calls':
        return renderVideoCallsInterface();
      case 'quick-templates':
        return renderQuickTemplates();
      case 'negotiation-tracker':
        return renderNegotiationTracker();
      case 'sentiment-analysis':
        return renderSentimentAnalysis();
      case 'smart-notifications':
        return renderSmartNotifications();
      case 'analytics':
        return renderConversationAnalytics();
      case 'trust-verification':
        return renderTrustVerification();
      default:
        return null;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Communications Hub"
      description="Complete buyer-farmer communication and negotiation platform"
      icon={MessageCircle}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
