'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, Globe, Users, Video, BarChart3, Heart, Bell, CheckCircle, Shield,
  Phone, Mic, Paperclip, Smile, Clock, TrendingUp, Award, Lock, Zap, User, Search,
  Download, Share2, Flag, AlertCircle, CheckCircle2, XCircle, Filter, Calendar,
  MoreVertical, ThumbsUp, ThumbsDown, Copy, Archive, Pin, Eye, RefreshCw, Settings,
  Voicemail, Copy as CopyIcon, Leaf
} from 'lucide-react';
import { PremiumFeatureLayout } from '../buyer/shared/PremiumFeatureLayout';

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
  participantType: 'farmer' | 'buyer';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
  typingIndicator: boolean;
}

const subFeatures: SubFeature[] = [
  { id: 'realtime-chat', name: 'Real-Time Chat', icon: MessageCircle, description: 'Instant messaging with indicators', color: 'green' },
  { id: 'ai-translation', name: 'AI Translation', icon: Globe, description: '10+ languages support', color: 'cyan' },
  { id: 'smart-matching', name: 'Smart Matching', icon: Users, description: 'AI-powered buyer connections', color: 'indigo' },
  { id: 'video-calls', name: 'Video Calls', icon: Video, description: 'HD product quality inspection', color: 'purple' },
  { id: 'quick-templates', name: 'Quick Templates', icon: Zap, description: 'Pre-built response templates', color: 'amber' },
  { id: 'negotiation-tracker', name: 'Negotiation Tracker', icon: TrendingUp, description: 'Sale progress tracking', color: 'emerald' },
  { id: 'sentiment-analysis', name: 'Sentiment Analysis', icon: Heart, description: 'Buyer mood tracking', color: 'rose' },
  { id: 'smart-notifications', name: 'Smart Notifications', icon: Bell, description: 'Priority deal alerts', color: 'orange' },
  { id: 'analytics', name: 'Sale Analytics', icon: BarChart3, description: 'Performance metrics', color: 'pink' },
  { id: 'trust-verification', name: 'Trust & Verification', icon: Shield, description: 'Verified farm badges', color: 'green' },
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantName: 'Amit Patel',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
    participantVerified: true,
    participantType: 'buyer',
    lastMessage: 'Perfect! Ready to receive the shipment by 5 PM tomorrow',
    lastMessageTime: new Date(Date.now() - 5 * 60000),
    unreadCount: 2,
    typingIndicator: false,
    messages: [
      {
        id: '1',
        sender: 'Amit Patel',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
        content: 'Hi! Got your listing for premium tomatoes. Interested in 500kg.',
        timestamp: new Date(Date.now() - 20 * 60000),
        read: true,
        type: 'text',
        sentiment: 'positive',
      },
      {
        id: '2',
        sender: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
        content: 'Great! I have fresh harvest ready. Grade A quality at ₹45/kg.',
        timestamp: new Date(Date.now() - 15 * 60000),
        read: true,
        type: 'text',
        sentiment: 'positive',
      },
      {
        id: '3',
        sender: 'Amit Patel',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
        content: 'Can you do ₹42/kg for bulk? I can pay 50% upfront.',
        timestamp: new Date(Date.now() - 10 * 60000),
        read: true,
        type: 'text',
        sentiment: 'neutral',
      },
      {
        id: '4',
        sender: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
        content: 'Okay, ₹42/kg works if you take minimum 500kg. Free delivery within 20km.',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false,
        type: 'text',
        sentiment: 'positive',
      },
    ],
  },
  {
    id: '2',
    participantName: 'Priya Sharma',
    participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
    participantVerified: false,
    participantType: 'buyer',
    lastMessage: 'What are the bulk discounts for 2 tonnes?',
    lastMessageTime: new Date(Date.now() - 30 * 60000),
    unreadCount: 0,
    typingIndicator: false,
    messages: [
      {
        id: '1',
        sender: 'Priya Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
        content: 'Hello! Interested in your wheat crop.',
        timestamp: new Date(Date.now() - 35 * 60000),
        read: true,
        type: 'text',
        sentiment: 'positive',
      },
      {
        id: '2',
        sender: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
        content: 'Thanks for reaching out! We have excellent quality wheat available.',
        timestamp: new Date(Date.now() - 30 * 60000),
        read: true,
        type: 'text',
        sentiment: 'positive',
      },
    ],
  },
];

const messageTemplates = [
  { id: '1', title: 'Harvest Ready', content: 'Good news! Fresh {{crop}} harvest ready. Premium grade, {{quantity}} {{unit}} available at ₹{{price}}/{{unit}}.' },
  { id: '2', title: 'Quality Info', content: 'Our {{crop}} is {{certification}}-certified. Moisture {{moisture}}%, Protein {{protein}}%. Can provide samples on request.' },
  { id: '3', title: 'Bulk Offer', content: 'Special bulk offer: Buy {{quantity}} {{unit}}, get ₹{{discount}}/{{unit}} discount. Free delivery within {{distance}}km.' },
  { id: '4', title: 'Delivery Info', content: 'Can deliver within {{days}} days. We handle full logistics or you can arrange pickup. What suits you best?' },
  { id: '5', title: 'Payment Terms', content: 'Flexible payment: {{upfront}}% advance, {{remaining}}% on delivery. Accept bank transfer, UPI, and cheques.' },
  { id: '6', title: 'Certifications', content: 'Certified by {{certifications}}. All quality tests available. Can arrange third-party inspection if needed.' },
];

const sentimentData = [
  { timestamp: '10:00 AM', positive: 70, neutral: 20, negative: 10 },
  { timestamp: '11:00 AM', positive: 75, neutral: 15, negative: 10 },
  { timestamp: '12:00 PM', positive: 80, neutral: 15, negative: 5 },
  { timestamp: '1:00 PM', positive: 85, neutral: 10, negative: 5 },
  { timestamp: '2:00 PM', positive: 88, neutral: 10, negative: 2 },
];

const negotiationDeals = [
  {
    id: '1',
    product: 'Premium Tomatoes',
    buyer: 'Amit Patel',
    quantity: 500,
    unit: 'kg',
    initialPrice: 50,
    currentPrice: 42,
    status: 'near-closing',
    progress: 90,
    lastUpdate: new Date(Date.now() - 5 * 60000),
  },
  {
    id: '2',
    product: 'Basmati Rice',
    buyer: 'Priya Sharma',
    quantity: 2000,
    unit: 'kg',
    initialPrice: 100,
    currentPrice: 95,
    status: 'in-progress',
    progress: 65,
    lastUpdate: new Date(Date.now() - 30 * 60000),
  },
];

export function FarmerCommunicationsHub() {
  const [activeSubFeature, setActiveSubFeature] = useState('realtime-chat');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(mockConversations[0]?.id || null);
  const [messageInput, setMessageInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showTemplates, setShowTemplates] = useState(false);
  const [callActive, setCallActive] = useState(false);

  const currentConversation = mockConversations.find(c => c.id === selectedConversation);

  const stats = [
    {
      label: 'Active Buyers',
      value: '24',
      icon: Users,
      color: 'green',
      trend: '+5',
    },
    {
      label: 'Response Rate',
      value: '98%',
      icon: TrendingUp,
      color: 'emerald',
      trend: '+3%',
    },
    {
      label: 'Sales Closed',
      value: '12',
      icon: CheckCircle2,
      color: 'emerald',
      trend: '+3',
    },
    {
      label: 'Avg Sentiment',
      value: '4.9/5',
      icon: Heart,
      color: 'rose',
      trend: '+0.2',
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim() && currentConversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
        content: messageInput,
        timestamp: new Date(),
        read: false,
        type: 'text',
        sentiment: 'neutral',
      };
      currentConversation.messages.push(newMessage);
      setMessageInput('');
      
      // Simulate buyer response
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: currentConversation.participantName,
          senderAvatar: currentConversation.participantAvatar,
          content: 'Sounds good! Let\'s finalize the details. When can you ship?',
          timestamp: new Date(),
          read: false,
          type: 'text',
          sentiment: 'positive',
        };
        currentConversation.messages.push(response);
      }, 2000);
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
              placeholder="Search buyers..."
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
                  ? 'bg-green-50 border-2 border-green-500'
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
                <p className="text-xs text-slate-500">🟢 Online • Buyer</p>
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
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-900 rounded-bl-none'
                }`}>
                  <div>
                    <p className="text-sm">{msg.content}</p>
                    <div className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-green-100' : 'text-slate-500'} flex items-center gap-1`}>
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.sender === 'You' && msg.read && (
                        <CheckCircle size={12} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
                    className="text-left p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <p className="text-xs font-bold text-green-900">{template.title}</p>
                    <p className="text-xs text-green-700 truncate">{template.content}</p>
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
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTemplates(!showTemplates)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Zap size={20} className={showTemplates ? 'text-green-600' : 'text-slate-600'} />
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
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
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
            <p className="text-slate-700">"Ready to sell 500kg premium tomatoes at best price"</p>
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
              {selectedLanguage === 'hi' && '"500 किलो प्रीमियम टमाटर बेचने के लिए तैयार हूँ सर्वोत्तम कीमत पर"'}
              {selectedLanguage === 'es' && '"Listo para vender 500kg de tomates premium al mejor precio"'}
              {selectedLanguage === 'fr' && '"Prêt à vendre 500kg de tomates premium au meilleur prix"'}
              {selectedLanguage === 'de' && '"Bereit, 500 kg Premium-Tomaten zum besten Preis zu verkaufen"'}
              {selectedLanguage === 'zh' && '"准备以最优价格出售500公斤优质番茄"'}
              {selectedLanguage === 'ja' && '"最高の価格で500kgのプレミアムトマトを売る準備ができています"'}
              {selectedLanguage === 'ar' && '"جاهز لبيع 500 كجم من الطماطم الممتازة بأفضل سعر"'}
              {selectedLanguage === 'pt' && '"Pronto para vender 500kg de tomates premium pelo melhor preço"'}
              {selectedLanguage === 'ru' && '"Готов продать 500 кг премиум помидоров по лучшей цене"'}
              {selectedLanguage === 'en' && '"Ready to sell 500kg premium tomatoes at best price"'}
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
          { name: 'Amit Patel', match: 96, needs: 'Tomatoes, Onions', budget: '₹20 Lakhs', location: 'Mumbai' },
          { name: 'Priya Sharma', match: 92, needs: 'Wheat, Rice', budget: '₹35 Lakhs', location: 'Delhi' },
          { name: 'Vikram Singh', match: 87, needs: 'Cotton, Sugarcane', budget: '₹45 Lakhs', location: 'Rajasthan' },
        ].map((buyer, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900">{buyer.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{buyer.location}</p>
              </div>
              <div className="text-center">
                <div className="relative w-12 h-12 inline-flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white font-bold">
                  {buyer.match}%
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">Needs: {buyer.needs}</p>
            <p className="text-sm text-slate-600 mb-4">Budget: {buyer.budget}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold text-sm"
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
      <div className="bg-gradient-to-br from-green-900 via-slate-900 to-slate-900 rounded-2xl p-8 text-white flex flex-col items-center justify-center min-h-[400px]">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center mb-6 shadow-2xl">
          <Video size={64} />
        </motion.div>
        {callActive ? (
          <>
            <p className="text-2xl font-bold mb-2">Connected with {currentConversation?.participantName}</p>
            <p className="text-green-200 mb-8">01:23 - Quality Inspection Call in Progress</p>
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
            <p className="text-2xl font-bold mb-2">Start HD Quality Inspection Call</p>
            <p className="text-green-200 mb-8">Show your crops quality in real-time</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCallActive(true)}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:shadow-xl transition-all font-bold"
            >
              Start Video Call
            </motion.button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Screen Sharing', 'Crop Quality View', 'Live Certification', 'Direct Chat Enabled'].map((feature, idx) => (
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
          className="bg-gradient-to-r from-slate-50 to-green-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-lg">{template.title}</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy size={16} className="text-green-600" />
            </motion.button>
          </div>
          <p className="text-slate-600 text-sm mb-4">{template.content}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold text-sm"
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
              <p className="text-sm text-slate-600">Buyer: {deal.buyer}</p>
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
              <p className="text-xs text-slate-600 mb-1">ASKING PRICE</p>
              <p className="font-bold text-slate-900">₹{deal.initialPrice}/kg</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">AGREED PRICE</p>
              <p className="font-bold text-green-600">₹{deal.currentPrice}/kg</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-slate-600">SALE PROGRESS</p>
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
              Confirm Sale
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-bold text-sm">
              Continue Negotiating
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
          <p className="text-4xl font-black text-green-600 mb-2">82%</p>
          <p className="font-bold text-green-900">Buyer Interest</p>
          <p className="text-xs text-green-700 mt-2">Very interested in buying</p>
        </motion.div>
        <motion.div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6 border border-blue-300 text-center">
          <p className="text-4xl font-black text-blue-600 mb-2">16%</p>
          <p className="font-bold text-blue-900">Neutral</p>
          <p className="text-xs text-blue-700 mt-2">Still exploring options</p>
        </motion.div>
        <motion.div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-xl p-6 border border-red-300 text-center">
          <p className="text-4xl font-black text-red-600 mb-2">2%</p>
          <p className="font-bold text-red-900">Concerns</p>
          <p className="text-xs text-red-700 mt-2">Minor objections</p>
        </motion.div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl p-6 border border-indigo-200">
        <p className="font-bold text-slate-900 mb-4">BUYER SENTIMENT TREND</p>
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

      <div className="bg-green-50 rounded-xl p-4 border border-green-300 flex items-start gap-3">
        <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-green-900 mb-1">Excellent News!</p>
          <p className="text-sm text-green-800">Buyers are showing strong positive sentiment. Perfect time to finalize deals and increase prices!</p>
        </div>
      </div>
    </div>
  );

  const renderSmartNotifications = () => (
    <div className="space-y-4">
      {[
        { priority: 'high', title: 'URGENT: Buy Order Expires', message: 'Amit Patel\'s order for 500kg tomatoes expires in 15 minutes - CONFIRM NOW', timestamp: '1 min ago', icon: AlertCircle, color: 'red' },
        { priority: 'high', title: 'Price Peak Alert', message: 'Vegetable prices peaked today - Sell now or wait for next week?', timestamp: '5 min ago', icon: TrendingUp, color: 'orange' },
        { priority: 'medium', title: 'New Buyer Interested', message: 'Vikram Singh (92% match) interested in your wheat crop', timestamp: '12 min ago', icon: Users, color: 'blue' },
        { priority: 'medium', title: 'Message from Priya Sharma', message: 'Can you negotiate on ₹45/kg for bulk order?', timestamp: '20 min ago', icon: MessageCircle, color: 'indigo' },
        { priority: 'low', title: 'Great Review Received', message: 'New 5-star review from Amit Patel', timestamp: '1 hour ago', icon: Award, color: 'yellow' },
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

  const renderSaleAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sales', value: '₹5.2L', trend: '+42%', color: 'green' },
          { label: 'Active Buyers', value: '24', trend: '+8', color: 'emerald' },
          { label: 'Completion Rate', value: '94%', trend: '+12%', color: 'indigo' },
          { label: 'Avg Deal Size', value: '₹22K', trend: '+18%', color: 'rose' },
        ].map((stat, idx) => (
          <motion.div key={idx} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-xl p-4 border border-${stat.color}-200`}>
            <p className="text-xs font-bold text-slate-600 uppercase mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</p>
            <p className={`text-xs font-bold text-${stat.color}-600`}>{stat.trend} this month</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <p className="font-bold text-slate-900 mb-4">SALE INSIGHTS</p>
        <div className="space-y-4">
          {[
            'Peak selling hours: 8-10 AM (38% of sales completed)',
            'Most sold crop: Tomatoes (42% of total sales)',
            'Average buyer satisfaction: 4.8/5 stars',
            'Top buyer: Amit Patel (₹1.2L total purchases)',
            'Best performing month: March (₹2.1L sales)',
          ].map((insight, idx) => (
            <motion.div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <TrendingUp size={16} className="text-green-600 flex-shrink-0 mt-1" />
              <p className="text-sm text-slate-700">{insight}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFarmVerification = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300 text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full" />
            <div className="absolute inset-1 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-green-900 mb-2">VERIFIED FARM</p>
          <p className="text-sm text-green-700">All certifications verified and blockchain backed</p>
          <motion.button whileHover={{ scale: 1.05 }} className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold">
            View Farm Info
          </motion.button>
        </motion.div>

        <motion.div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-300">
          <p className="font-bold text-slate-900 mb-4">VERIFICATION BADGES</p>
          <div className="space-y-3">
            {[
              { badge: '✓ Organic Certified', status: 'verified' },
              { badge: '✓ Land Ownership Verified', status: 'verified' },
              { badge: '✓ GST Registered', status: 'verified' },
              { badge: '✓ Crop Insurance', status: 'verified' },
              { badge: '✓ Blockchain Farm ID', status: 'verified' },
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
        <p className="font-bold text-slate-900 mb-4">BLOCKCHAIN FARM CREDENTIALS</p>
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-white p-3 rounded-lg border border-indigo-200 break-all">
            <p className="text-gray-500">Farm Wallet: 0x8aE1234bcD56789eFg1h23iJkL45MnOpQr6...(truncated)</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-indigo-200 break-all">
            <p className="text-gray-500">Farm ID: FARM-2024-04-0542-FARMER-RAJESH</p>
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
        return renderSaleAnalytics();
      case 'trust-verification':
        return renderFarmVerification();
      default:
        return null;
    }
  };

  return (
    <PremiumFeatureLayout
      title="AgriChat Hub - Communications"
      description="Farm-to-buyer communication and negotiation platform"
      icon={Leaf}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
