"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  User,
  Video,
  Phone,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Filter,
  Globe,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Shield,
  Bell,
  Settings,
  BarChart3,
  Heart,
  Target,
  Users,
  Activity,
  Award,
  Sparkles,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

// This component can be used by both farmers and buyers
interface AgriChatConnectPremiumProps {
  userRole: "FARMER" | "BUYER";
}

export function AgriChatConnectPremium({ userRole }: AgriChatConnectPremiumProps) {
  const [activeTab, setActiveTab] = useState<"conversations" | "analytics" | "settings" | "features">("conversations");
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      name: userRole === "FARMER" ? "ABC Traders Ltd" : "Ramesh Kumar Farms",
      role: userRole === "FARMER" ? "Buyer" : "Farmer",
      avatar: userRole === "FARMER" ? "🏢" : "👨‍🌾",
      lastMessage: "Can you supply 500kg tomatoes by next week?",
      time: "10 mins ago",
      unread: 2,
      online: true,
      verified: true,
      sentiment: 0.8,
      responseTime: "15 mins",
    },
    {
      id: 2,
      name: userRole === "FARMER" ? "Fresh Mart Pvt Ltd" : "Green Valley Farms",
      role: userRole === "FARMER" ? "Buyer" : "Farmer",
      avatar: userRole === "FARMER" ? "🛒" : "🌾",
      lastMessage: "What's your best price for organic wheat?",
      time: "1 hour ago",
      unread: 0,
      online: true,
      verified: true,
      sentiment: 0.6,
      responseTime: "25 mins",
    },
    {
      id: 3,
      name: userRole === "FARMER" ? "XYZ Exports" : "Organic Harvest Co.",
      role: userRole === "FARMER" ? "Buyer" : "Farmer",
      avatar: userRole === "FARMER" ? "🌍" : "🌱",
      lastMessage: "Thanks for the quality produce!",
      time: "2 hours ago",
      unread: 0,
      online: false,
      verified: true,
      sentiment: 0.9,
      responseTime: "10 mins",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: userRole === "FARMER" ? "buyer" : "farmer",
      content: "Hi! I saw your listing. Are the tomatoes still available?",
      time: "9:45 AM",
      read: true,
      translated: false,
      sentiment: 0.7,
    },
    {
      id: 2,
      sender: userRole,
      content: "Yes, we have fresh tomatoes available. What quantity do you need?",
      time: "9:47 AM",
      read: true,
      translated: false,
      sentiment: 0.8,
    },
    {
      id: 3,
      sender: userRole === "FARMER" ? "buyer" : "farmer",
      content: "I need around 500kg. What's your price?",
      time: "9:50 AM",
      read: true,
      translated: false,
      sentiment: 0.6,
    },
    {
      id: 4,
      sender: userRole,
      content: "For 500kg, I can offer ₹40/kg. Grade A quality, harvested yesterday.",
      time: "9:52 AM",
      read: true,
      translated: false,
      sentiment: 0.7,
    },
    {
      id: 5,
      sender: userRole === "FARMER" ? "buyer" : "farmer",
      content: "Can you supply by next week?",
      time: "10:00 AM",
      read: false,
      translated: false,
      sentiment: 0.5,
    },
  ];

  const quickTemplates = [
    "Yes, available in stock",
    "What quantity do you need?",
    "Can we schedule a video call?",
    "Let me check and get back to you",
  ];

  const analyticsData = {
    responseTime: { avg: "18 mins", trend: "-5 mins" },
    messageVolume: { total: 1247, trend: "+12%" },
    conversionRate: { rate: "34%", trend: "+8%" },
    satisfaction: { score: 4.6, trend: "+0.3" },
  };

  const sentimentBreakdown = [
    { label: "Positive", value: 68, color: "emerald" },
    { label: "Neutral", value: 24, color: "amber" },
    { label: "Negative", value: 8, color: "red" },
  ];

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

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">AgriChat Connect</h1>
        <p className="text-slate-500 font-medium">
          {userRole === "FARMER" ? "Connect with buyers directly" : "Connect with farmers directly"}
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {["conversations", "analytics", "settings", "features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Conversations Tab */}
        {activeTab === "conversations" && (
          <motion.div
            key="conversations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]"
          >
            {/* Conversation List */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-lg overflow-y-auto">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all ${
                      selectedConversation === conv.id
                        ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-500 shadow-lg"
                        : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="text-3xl">{conv.avatar}</div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 truncate">{conv.name}</h4>
                            {conv.verified && <Shield size={14} className="text-blue-600" />}
                          </div>
                          {conv.unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-2">{conv.role}</p>
                        <p className="text-sm text-slate-600 truncate mb-2">{conv.lastMessage}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-bold">{conv.time}</span>
                          <div className="flex items-center gap-1">
                            <Heart
                              size={12}
                              className={`${
                                conv.sentiment > 0.7
                                  ? "text-emerald-500"
                                  : conv.sentiment > 0.4
                                  ? "text-amber-500"
                                  : "text-red-500"
                              }`}
                            />
                            <span className="text-xs font-bold text-slate-500">
                              {Math.round(conv.sentiment * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-lg flex flex-col">
              {/* Chat Header */}
              {selectedConv && (
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="text-4xl">{selectedConv.avatar}</div>
                        {selectedConv.online && (
                          <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-slate-900">{selectedConv.name}</h3>
                          {selectedConv.verified && <Shield size={16} className="text-blue-600" />}
                        </div>
                        <p className="text-sm text-slate-600 font-medium">
                          {selectedConv.online ? "🟢 Online" : "⚫ Offline"} • Avg response: {selectedConv.responseTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all">
                        <Video size={20} />
                      </button>
                      <button className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all">
                        <Phone size={20} />
                      </button>
                      <button className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.sender === userRole ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        msg.sender === userRole ? "bg-blue-100" : "bg-slate-100"
                      }`}
                    >
                      {msg.sender === userRole ? "👤" : selectedConv?.avatar}
                    </div>
                    <div className={`flex-1 ${msg.sender === userRole ? "text-right" : ""}`}>
                      <div
                        className={`inline-block p-4 rounded-2xl max-w-[80%] ${
                          msg.sender === userRole
                            ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white"
                            : "bg-slate-50 text-slate-900"
                        }`}
                      >
                        <p className="font-medium">{msg.content}</p>
                        {msg.translated && (
                          <p className="text-xs mt-2 opacity-75 flex items-center gap-1">
                            <Globe size={12} /> Translated
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-slate-400 font-bold">{msg.time}</p>
                        {msg.sender === userRole && (
                          <CheckCircle size={12} className={msg.read ? "text-blue-600" : "text-slate-300"} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Templates */}
              <div className="px-6 py-3 border-t border-slate-100">
                <div className="flex gap-2 overflow-x-auto">
                  {quickTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessage(template)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-600 whitespace-nowrap transition-all"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-6 border-t border-slate-200">
                <div className="flex gap-3">
                  <button className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all">
                    <Paperclip size={20} />
                  </button>
                  <button className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all">
                    <ImageIcon size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && setMessage("")}
                    className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="h-12 w-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Avg Response Time", value: analyticsData.responseTime.avg, trend: analyticsData.responseTime.trend, icon: Clock, color: "blue" },
                { label: "Message Volume", value: analyticsData.messageVolume.total, trend: analyticsData.messageVolume.trend, icon: MessageSquare, color: "emerald" },
                { label: "Conversion Rate", value: analyticsData.conversionRate.rate, trend: analyticsData.conversionRate.trend, icon: Target, color: "amber" },
                { label: "Satisfaction Score", value: analyticsData.satisfaction.score, trend: analyticsData.satisfaction.trend, icon: Star, color: "indigo" },
              ].map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
                >
                  <div className={`h-12 w-12 bg-${metric.color}-50 rounded-xl flex items-center justify-center text-${metric.color}-600 mb-4`}>
                    <metric.icon size={24} />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-slate-600 font-medium mb-2">{metric.label}</p>
                  <p className="text-xs font-bold text-emerald-600">{metric.trend}</p>
                </motion.div>
              ))}
            </div>

            {/* Sentiment Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Sentiment Analysis</h3>
                  <p className="text-slate-500 font-medium">Overall conversation mood breakdown</p>
                </div>
              </div>

              <div className="space-y-4">
                {sentimentBreakdown.map((sentiment, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-slate-700">{sentiment.label}</span>
                      <span className="text-sm font-bold text-slate-900">{sentiment.value}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sentiment.value}%` }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                        className={`h-full bg-${sentiment.color}-500 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Chat Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Language Preferences</h4>
                  <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>Tamil</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Notification Settings</h4>
                  <div className="space-y-3">
                    {["New messages", "Video call requests", "Deal updates"].map((setting, idx) => (
                      <label key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <span className="font-medium text-slate-700">{setting}</span>
                        <input type="checkbox" defaultChecked className="h-5 w-5" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <feature.icon size={24} />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">{feature.name}</h4>
                <p className="text-sm text-slate-600 font-medium mb-4">{feature.description}</p>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${feature.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="text-xs font-bold text-slate-600">{feature.active ? "Active" : "Inactive"}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
