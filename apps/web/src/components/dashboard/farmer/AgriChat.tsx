"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, Send, Bot, User, Sparkles, TrendingUp,
  BarChart3, History, Settings, Zap, RefreshCw, Star,
  FileText, Target, Activity, Brain, Lightbulb, BookOpen
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

export function AgriChat() {
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I\'m your AI farming assistant. How can I help you today?', time: '10:00 AM' },
    { role: 'user', content: 'What\'s the best time to plant tomatoes?', time: '10:01 AM' },
    { role: 'bot', content: 'For tomatoes, the best planting time is during the warm season, typically 2-3 weeks after the last frost. In India, this is usually February-March for summer crops and June-July for monsoon crops.', time: '10:01 AM' }
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const conversations = [
    { id: 1, title: 'Tomato Planting Guide', date: '2024-04-05', messages: 12, category: 'Crops' },
    { id: 2, title: 'Pest Control Solutions', date: '2024-04-04', messages: 8, category: 'Disease' },
    { id: 3, title: 'Fertilizer Recommendations', date: '2024-04-03', messages: 15, category: 'Fertilizer' }
  ];

  const suggestions = [
    'How to improve soil health?',
    'Best irrigation practices',
    'Organic pest control methods',
    'Market price predictions'
  ];

  const insights = [
    { title: 'Crop Rotation', description: 'AI suggests rotating wheat with pulses', confidence: 92 },
    { title: 'Irrigation Schedule', description: 'Optimize water usage by 25%', confidence: 88 },
    { title: 'Harvest Timing', description: 'Best harvest window: Next 7 days', confidence: 95 }
  ];

  const analytics = [
    { metric: 'Questions Asked', value: '245', change: '+12%' },
    { metric: 'Avg Response Time', value: '2.3s', change: '-15%' },
    { metric: 'Accuracy Rate', value: '94%', change: '+5%' },
    { metric: 'Topics Covered', value: '48', change: '+8%' }
  ];

  const topics = [
    { name: 'Crop Management', questions: 45, lastAsked: '2 hours ago', icon: '🌾' },
    { name: 'Pest Control', questions: 32, lastAsked: '5 hours ago', icon: '🐛' },
    { name: 'Irrigation', questions: 28, lastAsked: '1 day ago', icon: '💧' },
    { name: 'Fertilizers', questions: 24, lastAsked: '1 day ago', icon: '🧪' },
    { name: 'Market Prices', questions: 38, lastAsked: '3 hours ago', icon: '💰' },
    { name: 'Weather', questions: 19, lastAsked: '6 hours ago', icon: '🌤️' },
    { name: 'Soil Health', questions: 22, lastAsked: '2 days ago', icon: '🌱' },
    { name: 'Harvest', questions: 15, lastAsked: '3 days ago', icon: '🚜' }
  ];

  const savedMessages = [
    { id: 1, content: 'Best time to plant tomatoes is February-March for summer crops', category: 'Crops', savedOn: '2024-04-05' },
    { id: 2, content: 'Use neem oil spray for organic pest control', category: 'Pest Control', savedOn: '2024-04-04' },
    { id: 3, content: 'Drip irrigation saves 25% water compared to flood irrigation', category: 'Irrigation', savedOn: '2024-04-03' },
    { id: 4, content: 'NPK ratio 19:19:19 is ideal for vegetable crops', category: 'Fertilizer', savedOn: '2024-04-02' }
  ];

  const trainingData = [
    { module: 'Crop Identification', progress: 85, lessons: 12, completed: 10 },
    { module: 'Disease Detection', progress: 60, lessons: 15, completed: 9 },
    { module: 'Market Analysis', progress: 45, lessons: 10, completed: 4 },
    { module: 'Soil Testing', progress: 92, lessons: 8, completed: 7 }
  ];

  const feedbackItems = [
    { id: 1, question: 'How to control aphids?', rating: 5, comment: 'Very helpful advice!', date: '2024-04-05' },
    { id: 2, question: 'Best fertilizer for wheat?', rating: 4, comment: 'Good information', date: '2024-04-04' },
    { id: 3, question: 'Irrigation schedule?', rating: 5, comment: 'Exactly what I needed', date: '2024-04-03' }
  ];

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'buyers', label: 'Buyer Chats', icon: User },
    { id: 'history', label: 'History', icon: History },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'topics', label: 'Topics', icon: BookOpen },
    { id: 'saved', label: 'Saved', icon: Star },
    { id: 'training', label: 'Training', icon: Target },
    { id: 'feedback', label: 'Feedback', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const buyerConversations = [
    { 
      id: 1, 
      buyer: 'ABC Traders Ltd', 
      lastMessage: 'Can you supply 500kg tomatoes by next week?',
      time: '10 mins ago',
      unread: 2,
      status: 'active',
      avatar: '🏢'
    },
    { 
      id: 2, 
      buyer: 'Fresh Mart Pvt Ltd', 
      lastMessage: 'What\'s your best price for organic wheat?',
      time: '1 hour ago',
      unread: 0,
      status: 'active',
      avatar: '🛒'
    },
    { 
      id: 3, 
      buyer: 'XYZ Exports', 
      lastMessage: 'Thanks for the quality produce!',
      time: '2 hours ago',
      unread: 0,
      status: 'completed',
      avatar: '🌍'
    },
    { 
      id: 4, 
      buyer: 'Green Valley Foods', 
      lastMessage: 'Do you have basmati rice available?',
      time: '5 hours ago',
      unread: 1,
      status: 'active',
      avatar: '🍚'
    }
  ];

  const [selectedBuyer, setSelectedBuyer] = useState(buyerConversations[0]);
  const [buyerMessages, setBuyerMessages] = useState([
    { sender: 'buyer', content: 'Hi! I saw your tomatoes listing. Are they still available?', time: '9:45 AM' },
    { sender: 'farmer', content: 'Yes, we have fresh tomatoes available. What quantity do you need?', time: '9:47 AM' },
    { sender: 'buyer', content: 'I need around 500kg. What\'s your price?', time: '9:50 AM' },
    { sender: 'farmer', content: 'For 500kg, I can offer ₹40/kg. Grade A quality, harvested yesterday.', time: '9:52 AM' },
    { sender: 'buyer', content: 'Can you supply by next week?', time: '10:00 AM' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { 
      role: 'user', 
      content: message, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setMessage('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'I understand your question. Let me provide you with detailed information...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Chat refreshed');
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">AgriChat AI.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl font-black gap-2 uppercase text-[9px]">
                <Sparkles size={14} className="animate-pulse" />
                AI POWERED
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Intelligent farming assistant powered by advanced AI
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-12 px-6 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-black border-2 border-slate-200"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin mr-2' : 'mr-2'} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <div className="w-full bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white shadow-lg scale-105'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200 min-h-[600px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {activeTab === 'chat' && (
              <div className="flex flex-col h-[600px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        msg.role === 'bot' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'
                      }`}>
                        {msg.role === 'bot' ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
                      </div>
                      <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block p-4 rounded-2xl ${
                          msg.role === 'bot' ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-50 to-cyan-50'
                        }`}>
                          <p className="text-slate-900 font-medium">{msg.content}</p>
                        </div>
                        <p className="text-xs text-slate-400 font-bold mt-2">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-slate-100 pt-6">
                  <div className="flex gap-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask me anything about farming..."
                      className="flex-1 h-14 rounded-2xl bg-slate-50 border-2 border-slate-200 font-medium"
                    />
                    <Button
                      onClick={handleSend}
                      className="h-14 px-8 rounded-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => setMessage(sug)}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-600 transition-all"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'buyers' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Buyer List */}
                <div className="lg:col-span-1 bg-slate-50 rounded-2xl p-4 overflow-y-auto">
                  <h3 className="text-lg font-black text-slate-900 mb-4">Conversations</h3>
                  <div className="space-y-2">
                    {buyerConversations.map((buyer) => (
                      <div
                        key={buyer.id}
                        onClick={() => setSelectedBuyer(buyer)}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          selectedBuyer.id === buyer.id 
                            ? 'bg-white shadow-lg border-2 border-blue-500' 
                            : 'bg-white hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{buyer.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-slate-900 truncate">{buyer.buyer}</h4>
                              {buyer.unread > 0 && (
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  {buyer.unread}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 truncate">{buyer.lastMessage}</p>
                            <p className="text-xs text-slate-400 mt-1">{buyer.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl border-2 border-slate-200">
                  {/* Chat Header */}
                  <div className="p-4 border-b-2 border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{selectedBuyer.avatar}</div>
                      <div>
                        <h3 className="font-black text-slate-900">{selectedBuyer.buyer}</h3>
                        <p className="text-sm text-slate-600">
                          {selectedBuyer.status === 'active' ? '🟢 Active' : '✅ Completed'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {buyerMessages.map((msg, i) => (
                      <div key={i} className={`flex items-start gap-3 ${msg.sender === 'farmer' ? 'flex-row-reverse' : ''}`}>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          msg.sender === 'buyer' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {msg.sender === 'buyer' ? '🏢' : '👨‍🌾'}
                        </div>
                        <div className={`flex-1 ${msg.sender === 'farmer' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-4 rounded-2xl max-w-[80%] ${
                            msg.sender === 'buyer' ? 'bg-slate-50' : 'bg-gradient-to-br from-green-50 to-emerald-50'
                          }`}>
                            <p className="text-slate-900 font-medium">{msg.content}</p>
                          </div>
                          <p className="text-xs text-slate-400 font-bold mt-2">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t-2 border-slate-100">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Type your message..."
                        className="flex-1 h-12 rounded-xl bg-slate-50 border-2 border-slate-200"
                      />
                      <Button className="h-12 px-6 rounded-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <Card key={conv.id} className="p-6 border-none shadow-lg bg-white rounded-[2rem] hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <MessageSquare size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900">{conv.title}</h3>
                          <p className="text-sm text-slate-600">{conv.messages} messages • {conv.date}</p>
                        </div>
                      </div>
                      <Badge tone="brand">{conv.category}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                {insights.map((insight, i) => (
                  <Card key={i} className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Brain size={48} className="text-purple-600" />
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2">{insight.title}</h3>
                          <p className="text-slate-600 font-medium">{insight.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-black text-purple-600 mb-1">{insight.confidence}%</p>
                        <p className="text-xs text-slate-400 font-bold">Confidence</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.map((sug, i) => (
                  <Card key={i} className="p-8 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem] hover:shadow-xl transition-all cursor-pointer">
                    <Lightbulb size={48} className="text-amber-600 mb-4" />
                    <p className="text-xl font-black text-slate-900">{sug}</p>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {analytics.map((stat, i) => (
                  <Card key={i} className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">{stat.metric}</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-600" />
                      <span className="text-sm font-bold text-green-600">{stat.change}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'topics' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <BookOpen size={32} className="text-indigo-600" />
                    Popular Topics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topics.map((topic, i) => (
                      <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="text-4xl">{topic.icon}</div>
                            <div>
                              <h4 className="text-xl font-black text-slate-900">{topic.name}</h4>
                              <p className="text-sm text-slate-600 font-bold">{topic.questions} questions</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 font-bold">Last asked: {topic.lastAsked}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Star size={32} className="text-amber-600" />
                    Saved Messages
                  </h3>
                  <div className="space-y-4">
                    {savedMessages.map((saved) => (
                      <div key={saved.id} className="bg-white rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge tone="brand">{saved.category}</Badge>
                          <p className="text-xs text-slate-400 font-bold">{saved.savedOn}</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mb-3">{saved.content}</p>
                        <div className="flex gap-3">
                          <Button className="h-10 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-black text-sm">
                            View Full Chat
                          </Button>
                          <Button className="h-10 px-6 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-black text-sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'training' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Target size={32} className="text-green-600" />
                    AI Training Modules
                  </h3>
                  <div className="space-y-6">
                    {trainingData.map((module, i) => (
                      <div key={i} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">{module.module}</h4>
                            <p className="text-sm text-slate-600 font-bold">
                              {module.completed} of {module.lessons} lessons completed
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-black text-green-600 mb-1">{module.progress}%</p>
                            <p className="text-xs text-slate-400 font-bold">Complete</p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all" 
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <Button className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black">
                          Continue Learning
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Activity size={32} className="text-pink-600" />
                    Your Feedback History
                  </h3>
                  <div className="space-y-4">
                    {feedbackItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <p className="text-lg font-black text-slate-900 mb-2">{item.question}</p>
                            <div className="flex items-center gap-2 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={20} 
                                  className={i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'} 
                                />
                              ))}
                            </div>
                            <p className="text-slate-600 font-medium italic">"{item.comment}"</p>
                          </div>
                          <p className="text-xs text-slate-400 font-bold">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 bg-white rounded-2xl p-8">
                    <h4 className="text-xl font-black text-slate-900 mb-4">Rate Your Recent Experience</h4>
                    <div className="flex items-center gap-3 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <button key={i} className="hover:scale-110 transition-all">
                          <Star size={32} className="text-slate-300 hover:text-yellow-500" />
                        </button>
                      ))}
                    </div>
                    <Input 
                      placeholder="Share your feedback..." 
                      className="h-14 rounded-2xl bg-slate-50 border-2 border-slate-200 font-medium mb-4"
                    />
                    <Button className="w-full h-12 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-black">
                      Submit Feedback
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Settings size={32} className="text-slate-600" />
                    Chat Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-xl font-black text-slate-900 mb-4">Language Preferences</h4>
                      <div className="space-y-3">
                        {['English', 'Hindi', 'Marathi', 'Tamil'].map((lang, i) => (
                          <label key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                            <input type="radio" name="language" className="h-5 w-5" defaultChecked={i === 0} />
                            <span className="text-lg font-bold text-slate-900">{lang}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-xl font-black text-slate-900 mb-4">Notification Settings</h4>
                      <div className="space-y-4">
                        {[
                          { label: 'New AI Insights', enabled: true },
                          { label: 'Daily Tips', enabled: true },
                          { label: 'Market Updates', enabled: false },
                          { label: 'Weather Alerts', enabled: true }
                        ].map((setting, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="text-lg font-bold text-slate-900">{setting.label}</span>
                            <div className={`w-14 h-8 rounded-full transition-all cursor-pointer ${
                              setting.enabled ? 'bg-green-500' : 'bg-slate-300'
                            }`}>
                              <div className={`h-6 w-6 bg-white rounded-full m-1 transition-all ${
                                setting.enabled ? 'translate-x-6' : ''
                              }`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-xl font-black text-slate-900 mb-4">Chat History</h4>
                      <div className="space-y-3">
                        <Button className="w-full h-12 bg-blue-600 text-white rounded-xl font-black">
                          Export Chat History
                        </Button>
                        <Button className="w-full h-12 bg-white border-2 border-red-200 text-red-600 rounded-xl font-black hover:bg-red-50">
                          Clear All Conversations
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
