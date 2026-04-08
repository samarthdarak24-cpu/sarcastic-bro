'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, FileText, DollarSign, MapPin, Package, Star, AlertCircle,
  Users, BarChart3, Zap, CheckCircle, Clock, TrendingUp, Settings, Plus,
  Search, Filter, Download, Share2, Phone, Video, MoreVertical, Paperclip,
  Smile, Mic, Image as ImageIcon, FileUp, X, ChevronRight, ChevronLeft,
  Eye, Lock, Unlock, Flag, Award, Shield, Truck, CreditCard, FileCheck,
  MessageSquare, Bell, ThumbsUp, ThumbsDown, Copy, Edit, Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  sender: string;
  senderRole: 'farmer' | 'buyer' | 'agent';
  content: string;
  type: 'text' | 'quote' | 'contract' | 'payment' | 'location' | 'product' | 'review';
  timestamp: Date;
  attachments?: any[];
  reactions?: string[];
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
  type: 'direct' | 'group' | 'negotiation';
}

export function AgriChatAdvanced() {
  const [activeTab, setActiveTab] = useState<'messages' | 'quotes' | 'contracts' | 'payments' | 'analytics'>('messages');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Farmer Rajesh',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      lastMessage: 'Can you provide a quote for 500kg tomatoes?',
      unread: 2,
      status: 'online',
      type: 'direct'
    },
    {
      id: '2',
      name: 'Buyer Group',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Group',
      lastMessage: 'Group negotiation for bulk order',
      unread: 0,
      status: 'online',
      type: 'group'
    }
  ]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ============================================
  // SUBFEATURE 1: Real-time Messaging
  // ============================================
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'You',
        senderRole: 'farmer',
        content: inputMessage,
        type: 'text',
        timestamp: new Date(),
        reactions: []
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  // ============================================
  // SUBFEATURE 2: Smart Quote Generation
  // ============================================
  const handleGenerateQuote = (data: any) => {
    const quoteMessage: Message = {
      id: `quote-${Date.now()}`,
      sender: 'You',
      senderRole: 'farmer',
      content: `Quote: ${data.quantity}kg @ ₹${data.price}/kg`,
      type: 'quote',
      timestamp: new Date(),
      attachments: [{ type: 'quote', data }]
    };
    setMessages([...messages, quoteMessage]);
    setShowQuoteModal(false);
  };

  // ============================================
  // SUBFEATURE 3: Negotiation Assistant
  // ============================================
  const getNegotiationSuggestions = () => {
    return [
      { type: 'price', suggestion: 'Consider reducing price by 5-10%', impact: 'high' },
      { type: 'quantity', suggestion: 'Offer bulk discount for 500kg+', impact: 'medium' },
      { type: 'terms', suggestion: 'Flexible payment terms available', impact: 'medium' }
    ];
  };

  // ============================================
  // SUBFEATURE 4: Contract Management
  // ============================================
  const handleCreateContract = (data: any) => {
    const contractMessage: Message = {
      id: `contract-${Date.now()}`,
      sender: 'You',
      senderRole: 'farmer',
      content: 'Contract created for review',
      type: 'contract',
      timestamp: new Date(),
      attachments: [{ type: 'contract', data }]
    };
    setMessages([...messages, contractMessage]);
    setShowContractModal(false);
  };

  // ============================================
  // SUBFEATURE 5: Payment Integration
  // ============================================
  const handleInitiatePayment = (data: any) => {
    const paymentMessage: Message = {
      id: `payment-${Date.now()}`,
      sender: 'You',
      senderRole: 'farmer',
      content: `Payment request: ₹${data.amount}`,
      type: 'payment',
      timestamp: new Date(),
      attachments: [{ type: 'payment', data }]
    };
    setMessages([...messages, paymentMessage]);
    setShowPaymentModal(false);
  };

  // ============================================
  // SUBFEATURE 6: Location & Logistics Tracking
  // ============================================
  const handleTrackShipment = () => {
    const locationMessage: Message = {
      id: `location-${Date.now()}`,
      sender: 'System',
      senderRole: 'agent',
      content: 'Shipment tracking enabled',
      type: 'location',
      timestamp: new Date()
    };
    setMessages([...messages, locationMessage]);
  };

  // ============================================
  // SUBFEATURE 7: Product Catalog Integration
  // ============================================
  const handleShareProduct = (product: any) => {
    const productMessage: Message = {
      id: `product-${Date.now()}`,
      sender: 'You',
      senderRole: 'farmer',
      content: `Shared product: ${product.name}`,
      type: 'product',
      timestamp: new Date(),
      attachments: [{ type: 'product', data: product }]
    };
    setMessages([...messages, productMessage]);
  };

  // ============================================
  // SUBFEATURE 8: AI-Powered Recommendations
  // ============================================
  const getRecommendations = () => {
    return [
      { title: 'Price Optimization', description: 'Increase price by 10% based on market trends', action: 'Apply' },
      { title: 'New Buyer', description: 'Premium buyer interested in your products', action: 'Contact' },
      { title: 'Quality Improvement', description: 'Your Grade A+ rate is 95%', action: 'View' }
    ];
  };

  // ============================================
  // SUBFEATURE 9: Document Management
  // ============================================
  const handleUploadDocument = (file: any) => {
    const docMessage: Message = {
      id: `doc-${Date.now()}`,
      sender: 'You',
      senderRole: 'farmer',
      content: `Document uploaded: ${file.name}`,
      type: 'text',
      timestamp: new Date(),
      attachments: [{ type: 'document', file }]
    };
    setMessages([...messages, docMessage]);
    setShowDocumentModal(false);
  };

  // ============================================
  // SUBFEATURE 10: Quality Assurance Feedback
  // ============================================
  const handleSubmitQualityFeedback = (feedback: any) => {
    const feedbackMessage: Message = {
      id: `feedback-${Date.now()}`,
      sender: 'You',
      senderRole: 'farmer',
      content: `Quality feedback: ${feedback.rating}★`,
      type: 'text',
      timestamp: new Date(),
      attachments: [{ type: 'feedback', data: feedback }]
    };
    setMessages([...messages, feedbackMessage]);
  };

  // ============================================
  // SUBFEATURE 11: Dispute Resolution
  // ============================================
  const handleInitiateDispute = (dispute: any) => {
    const disputeMessage: Message = {
      id: `dispute-${Date.now()}`,
      sender: 'You',
      senderRole: 'farmer',
      content: `Dispute initiated: ${dispute.issueType}`,
      type: 'text',
      timestamp: new Date(),
      attachments: [{ type: 'dispute', data: dispute }]
    };
    setMessages([...messages, disputeMessage]);
    setShowDisputeModal(false);
  };

  // ============================================
  // SUBFEATURE 12: Notification & Alerts
  // ============================================
  const handleNotifications = () => {
    return [
      { type: 'message', title: 'New message from Buyer', time: '2 min ago' },
      { type: 'payment', title: 'Payment received', time: '1 hour ago' },
      { type: 'alert', title: 'Price alert', time: '3 hours ago' }
    ];
  };

  // ============================================
  // SUBFEATURE 13: Reputation & Reviews
  // ============================================
  const handleSubmitReview = (review: any) => {
    const reviewMessage: Message = {
      id: `review-${Date.now()}`,
      sender: 'You',
      senderRole: 'farmer',
      content: `Review submitted: ${review.rating}★`,
      type: 'text',
      timestamp: new Date(),
      attachments: [{ type: 'review', data: review }]
    };
    setMessages([...messages, reviewMessage]);
    setShowReviewModal(false);
  };

  // ============================================
  // SUBFEATURE 14: Group Chat & Collaboration
  // ============================================
  const handleCreateGroup = () => {
    // Create group chat
  };

  // ============================================
  // SUBFEATURE 15: Analytics & Insights
  // ============================================
  const getAnalytics = () => {
    return {
      totalConversations: 24,
      activeConversations: 8,
      totalMessages: 342,
      successfulDeals: 12,
      totalValue: 125000,
      conversionRate: 0.5
    };
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-slate-200">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900">AgriChat Advanced</h1>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              15 Integrated Subfeatures for Farmer-Buyer Collaboration
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-600 cursor-pointer" />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <Settings className="w-6 h-6 text-slate-600 cursor-pointer" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 border-none shadow-lg rounded-2xl bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900">Conversations</h2>
                  <Plus className="w-5 h-5 text-blue-600 cursor-pointer" />
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {conversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedConversation === conv.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full" />
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                              conv.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{conv.name}</p>
                          <p className="text-xs text-slate-600 truncate">{conv.lastMessage}</p>
                        </div>
                        {conv.unread > 0 && (
                          <Badge className="bg-blue-600 text-white">{conv.unread}</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="p-6 border-none shadow-lg rounded-2xl bg-white h-[700px] flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={conversations.find((c) => c.id === selectedConversation)?.avatar}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-bold text-slate-900">
                          {conversations.find((c) => c.id === selectedConversation)?.name}
                        </p>
                        <p className="text-xs text-slate-600">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-slate-600 cursor-pointer hover:text-blue-600" />
                      <Video className="w-5 h-5 text-slate-600 cursor-pointer hover:text-blue-600" />
                      <MoreVertical className="w-5 h-5 text-slate-600 cursor-pointer" />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-600">No messages yet. Start a conversation!</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.senderRole === 'farmer' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.senderRole === 'farmer'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-900'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="pt-4 border-t-2 border-slate-200 space-y-3">
                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setShowQuoteModal(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs whitespace-nowrap hover:bg-emerald-200"
                      >
                        <DollarSign className="w-4 h-4" />
                        Quote
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setShowContractModal(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold text-xs whitespace-nowrap hover:bg-purple-200"
                      >
                        <FileCheck className="w-4 h-4" />
                        Contract
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setShowPaymentModal(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-xs whitespace-nowrap hover:bg-blue-200"
                      >
                        <CreditCard className="w-4 h-4" />
                        Payment
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleTrackShipment}
                        className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold text-xs whitespace-nowrap hover:bg-orange-200"
                      >
                        <Truck className="w-4 h-4" />
                        Track
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setShowReviewModal(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-bold text-xs whitespace-nowrap hover:bg-yellow-200"
                      >
                        <Star className="w-4 h-4" />
                        Review
                      </motion.button>
                    </div>

                    {/* Message Input */}
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-5 h-5 text-slate-600 cursor-pointer hover:text-blue-600" />
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Smile className="w-5 h-5 text-slate-600 cursor-pointer hover:text-blue-600" />
                      <Mic className="w-5 h-5 text-slate-600 cursor-pointer hover:text-blue-600" />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleSendMessage}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: MessageCircle, label: 'Messaging', color: 'from-blue-500 to-cyan-500' },
            { icon: DollarSign, label: 'Quotes', color: 'from-emerald-500 to-teal-500' },
            { icon: FileCheck, label: 'Contracts', color: 'from-purple-500 to-pink-500' },
            { icon: CreditCard, label: 'Payments', color: 'from-orange-500 to-red-500' },
            { icon: Truck, label: 'Logistics', color: 'from-indigo-500 to-blue-500' },
            { icon: Package, label: 'Products', color: 'from-green-500 to-emerald-500' },
            { icon: Zap, label: 'AI Recommendations', color: 'from-yellow-500 to-orange-500' },
            { icon: FileText, label: 'Documents', color: 'from-slate-500 to-gray-500' },
            { icon: Star, label: 'Quality', color: 'from-pink-500 to-rose-500' },
            { icon: AlertCircle, label: 'Disputes', color: 'from-red-500 to-orange-500' },
            { icon: Bell, label: 'Notifications', color: 'from-cyan-500 to-blue-500' },
            { icon: Award, label: 'Reviews', color: 'from-amber-500 to-yellow-500' },
            { icon: Users, label: 'Groups', color: 'from-violet-500 to-purple-500' },
            { icon: BarChart3, label: 'Analytics', color: 'from-teal-500 to-green-500' },
            { icon: Shield, label: 'Security', color: 'from-gray-500 to-slate-500' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg cursor-pointer`}
            >
              <feature.icon className="w-6 h-6 mb-2" />
              <p className="text-xs font-bold">{feature.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Analytics Section */}
        {activeTab === 'analytics' && (
          <Card className="p-6 border-none shadow-lg rounded-2xl bg-white">
            <h3 className="text-xl font-black text-slate-900 mb-4">Chat Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Conversations', value: '24', icon: MessageCircle },
                { label: 'Active Chats', value: '8', icon: Users },
                { label: 'Successful Deals', value: '12', icon: CheckCircle },
                { label: 'Total Value', value: '₹125K', icon: TrendingUp }
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-600 font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
