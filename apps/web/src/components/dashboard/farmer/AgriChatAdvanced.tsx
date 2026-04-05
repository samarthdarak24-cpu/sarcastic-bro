'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Bot, TrendingUp, Cloud, Users, Mic, Globe, 
  Bell, FileText, DollarSign, Camera, Send, X, Loader2, 
  CheckCircle, AlertCircle, Image as ImageIcon, Sparkles,
  Phone, Video, MoreVertical, Search, Filter, Star
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  subFeature?: string;
  metadata?: any;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

const AgriChatAdvanced = () => {
  const [activeFeature, setActiveFeature] = useState<string>('crop-doctor');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const features = [
    { id: 'crop-doctor', name: 'AI Crop Doctor', icon: Bot, color: 'from-green-500 to-emerald-600', description: 'Disease diagnosis' },
    { id: 'market-intel', name: 'Market Intelligence', icon: TrendingUp, color: 'from-blue-500 to-cyan-600', description: 'Price predictions' },
    { id: 'weather', name: 'Weather Advisory', icon: Cloud, color: 'from-purple-500 to-pink-600', description: 'Weather alerts' },
    { id: 'expert-network', name: 'Expert Network', icon: Users, color: 'from-orange-500 to-red-600', description: 'Connect experts' },
    { id: 'voice', name: 'Voice Commands', icon: Mic, color: 'from-indigo-500 to-purple-600', description: 'Hands-free' },
    { id: 'translate', name: 'Multi-language', icon: Globe, color: 'from-teal-500 to-green-600', description: 'Regional languages' },
    { id: 'reminders', name: 'Smart Reminders', icon: Bell, color: 'from-yellow-500 to-orange-600', description: 'Task scheduler' },
    { id: 'community', name: 'Community Forum', icon: MessageSquare, color: 'from-pink-500 to-rose-600', description: 'Farmer chat' },
    { id: 'documents', name: 'Document Assistant', icon: FileText, color: 'from-cyan-500 to-blue-600', description: 'Scan & analyze' },
    { id: 'negotiation', name: 'Negotiation Coach', icon: DollarSign, color: 'from-emerald-500 to-teal-600', description: 'Price training' }
  ];

  useEffect(() => {
    loadChatSessions();
    loadWelcomeMessage();
  }, [activeFeature]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatSessions = async () => {
    const sessions: ChatSession[] = [
      { id: '1', title: 'Tomato Disease Query', lastMessage: 'Check these symptoms...', timestamp: new Date(), unread: 2 },
      { id: '2', title: 'Wheat Price Forecast', lastMessage: 'Market looking good', timestamp: new Date(Date.now() - 3600000), unread: 0 },
      { id: '3', title: 'Monsoon Planning', lastMessage: 'Rain expected next week', timestamp: new Date(Date.now() - 7200000), unread: 1 }
    ];
    setChatSessions(sessions);
  };

  const loadWelcomeMessage = () => {
    const feature = features.find(f => f.id === activeFeature);
    const welcomeMessages: Record<string, string> = {
      'crop-doctor': '🌱 Hi! I\'m your AI Crop Doctor. Upload a photo of your crop or describe the symptoms, and I\'ll diagnose the issue instantly.',
      'market-intel': '📊 Welcome to Market Intelligence! Ask me about price trends, demand forecasts, or the best time to sell your produce.',
      'weather': '🌤️ Weather Advisory here! Get hyperlocal weather updates and farming recommendations based on upcoming conditions.',
      'expert-network': '👨‍🌾 Connect with agricultural experts! Ask your questions and get professional advice within minutes.',
      'voice': '🎤 Voice Commands activated! Speak naturally and I\'ll help you with farming tasks hands-free.',
      'translate': '🌍 Multi-language support enabled! Chat in your preferred language - Hindi, Marathi, Tamil, and more.',
      'reminders': '⏰ Smart Reminders ready! I\'ll help you schedule and never miss important farming tasks.',
      'community': '💬 Welcome to the Community Forum! Connect with fellow farmers, share experiences, and learn together.',
      'documents': '📄 Document Assistant here! Upload bills, certificates, or reports and I\'ll extract and analyze the information.',
      'negotiation': '💰 Negotiation Coach ready! Practice your negotiation skills and learn strategies to get better prices.'
    };

    setMessages([{
      id: '1',
      type: 'bot',
      content: welcomeMessages[activeFeature] || 'How can I help you today?',
      timestamp: new Date(),
      subFeature: activeFeature
    }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      subFeature: activeFeature
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          feature: activeFeature,
          image: selectedImage ? await convertToBase64(selectedImage) : null,
          history: messages.slice(-5)
        })
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        subFeature: activeFeature,
        metadata: data.metadata
      };

      setMessages(prev => [...prev, botMessage]);
      setSelectedImage(null);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        subFeature: activeFeature
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      setIsRecording(true);
      // Start recording logic
      setTimeout(() => {
        setIsRecording(false);
        setInputValue('Sample voice transcription: How do I treat leaf curl in tomatoes?');
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                <Sparkles className="w-10 h-10 text-green-600" />
                AgriChat Advanced
              </h1>
              <p className="text-slate-600 mt-2">Your AI-powered farming assistant with 10 advanced features</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSidebar(!showSidebar)}
              className="px-4 py-2 bg-white rounded-xl shadow-lg border border-slate-200 hover:border-green-300 transition-all"
            >
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </motion.button>
          </div>

          {/* Feature Pills */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {features.map((feature) => (
              <motion.button
                key={feature.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeFeature === feature.id
                    ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                    : 'bg-white text-slate-700 hover:shadow-md border border-slate-200'
                }`}
              >
                <feature.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-sm font-semibold">{feature.name}</div>
                  <div className={`text-xs ${activeFeature === feature.id ? 'text-white/80' : 'text-slate-500'}`}>
                    {feature.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="col-span-12 lg:col-span-3"
              >
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800">Recent Chats</h3>
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    {chatSessions.map((session) => (
                      <motion.div
                        key={session.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-green-50 cursor-pointer transition-all border border-transparent hover:border-green-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-slate-800">{session.title}</div>
                            <div className="text-xs text-slate-500 mt-1">{session.lastMessage}</div>
                            <div className="text-xs text-slate-400 mt-1">
                              {session.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {session.unread > 0 && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              {session.unread}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium"
                      >
                        <Camera className="w-4 h-4" />
                        Scan Crop
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg text-sm font-medium"
                      >
                        <Phone className="w-4 h-4" />
                        Call Expert
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className={`${showSidebar ? 'col-span-12 lg:col-span-9' : 'col-span-12'}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col" style={{ height: '70vh' }}>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {features.find(f => f.id === activeFeature)?.icon && (
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      {React.createElement(features.find(f => f.id === activeFeature)!.icon, {
                        className: 'w-6 h-6 text-white'
                      })}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">
                      {features.find(f => f.id === activeFeature)?.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <Video className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-2xl p-4 ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-800 shadow-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          {message.metadata && (
                            <div className="mt-3 pt-3 border-t border-white/20">
                              {message.metadata.confidence && (
                                <div className="flex items-center gap-2 text-xs">
                                  <Star className="w-4 h-4" />
                                  Confidence: {message.metadata.confidence}%
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className={`text-xs text-slate-400 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                        <span className="text-sm text-slate-600">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-200">
                {selectedImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200"
                  >
                    <ImageIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 flex-1">{selectedImage.name}</span>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-green-100 transition-all"
                  >
                    <Camera className="w-5 h-5 text-slate-600" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVoiceRecord}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-600 hover:bg-green-100'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </motion.button>

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() && !selectedImage}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AgriChatAdvanced;
