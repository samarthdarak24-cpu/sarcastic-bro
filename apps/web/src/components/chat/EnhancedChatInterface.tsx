'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Paperclip, Mic, Video, Phone, MoreVertical, 
  Globe, Smile, Image as ImageIcon, FileText, MapPin,
  TrendingUp, Zap, Star, Shield, CheckCircle, Clock
} from 'lucide-react';
import { chatService, type Message, type Conversation } from '@/services/chatService';
import toast from 'react-hot-toast';

interface EnhancedChatInterfaceProps {
  conversation: Conversation;
  onVideoCall?: (conversationId: string) => void;
  onVoiceCall?: (conversationId: string) => void;
}

export default function EnhancedChatInterface({ 
  conversation, 
  onVideoCall,
  onVoiceCall 
}: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showFeatures, setShowFeatures] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await chatService.getMessages(conversation.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: conversation.id,
      senderId: 'current-user',
      content: newMessage,
      timestamp: new Date(),
      read: false,
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const sentiment = await chatService.analyzeSentiment(newMessage);
      
      // Smart Negotiator Integration
      if (newMessage.toLowerCase().includes('price') || newMessage.toLowerCase().includes('negotiate')) {
        toast.loading('AI Negotiator analyzing deal...', { id: 'negotiator' });
      }

      const sentMessage = await chatService.sendMessage(conversation.id, newMessage);
      sentMessage.sentiment = sentiment;
      
      setMessages(prev => prev.map(m => 
        m.id === tempMessage.id ? sentMessage : m
      ));

      // Simulate typing indicator
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        // Simulate response (in real app, this comes from socket)
        simulateResponse();
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const simulateResponse = () => {
    const responses = [
      "AgriChat Pro Suggestion: I've analyzed this buyer's past transaction history and they have a 98% reliability score. It's safe to proceed with a bulk order.",
      "Smart Negotiator Alpha: Current market trends for this crop show a 5% upward trend next week. I recommend holding firm on your price of ₹45/kg.",
      "Blockchain Verification: User credentials verified on Polygon Mainnet. Deal security level: SECURE.",
      "Logistics Insight: I found 3 transport providers available for your location who can deliver this 1000kg batch by Friday.",
      "Crop Grade Analysis: Based on the photo you sent (Grade A), the current fair market value is ₹42-₹48/kg.",
    ];
    
    const response: Message = {
      id: `resp-${Date.now()}`,
      conversationId: conversation.id,
      senderId: conversation.otherUser.id,
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      read: false,
      sentiment: 'positive',
    };
    
    setMessages(prev => [...prev, response]);
  };

  const handleTranslate = async (messageId: string) => {
    try {
      const translated = await chatService.translateMessage(messageId, selectedLanguage);
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, translated } : m
      ));
      toast.success('Message translated!');
    } catch (error) {
      toast.error('Translation failed');
    }
  };

  const quickReplies = [
    "What's the price?",
    "Is it available?",
    "Can you deliver?",
    "Send me details",
    "I'm interested",
    "Thank you!",
  ];

  const features = [
    { 
      id: 'translate', 
      icon: Globe, 
      label: 'Translate', 
      color: 'blue',
      action: () => {
        setTranslationEnabled(!translationEnabled);
        toast.success(translationEnabled ? 'Translation disabled' : 'Translation enabled');
      }
    },
    { 
      id: 'video', 
      icon: Video, 
      label: 'Video Call', 
      color: 'red',
      action: () => {
        if (onVideoCall) {
          onVideoCall(conversation.id);
          toast.success('Starting video call...');
        }
      }
    },
    { 
      id: 'voice', 
      icon: Phone, 
      label: 'Voice Call', 
      color: 'green',
      action: () => {
        if (onVoiceCall) {
          onVoiceCall(conversation.id);
          toast.success('Starting voice call...');
        }
      }
    },
    { 
      id: 'negotiate', 
      icon: TrendingUp, 
      label: 'Negotiate', 
      color: 'purple',
      action: () => {
        setNewMessage('I would like to discuss the pricing. ');
        toast('Negotiation mode activated', { icon: '🤝' });
      }
    },
    { 
      id: 'template', 
      icon: Zap, 
      label: 'Templates', 
      color: 'amber',
      action: () => {
        setShowFeatures(!showFeatures);
      }
    },
  ];

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'border-l-4 border-green-500';
      case 'negative': return 'border-l-4 border-red-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-3xl shadow-lg border-2 border-white">
                  {conversation.otherUser.avatar}
                </div>
                {conversation.otherUser.online && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white ring-2 ring-green-100" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-xl font-black text-slate-900">{conversation.otherUser.name}</h3>
                  <div className="flex items-center gap-1 bg-indigo-100 px-2 py-0.5 rounded-md">
                    <Shield size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase">Verified Master</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 font-bold flex items-center gap-2">
                  <span className={conversation.otherUser.online ? 'text-green-600' : 'text-slate-400'}>
                    ● {conversation.otherUser.online ? 'Online Now' : 'Last seen recently'}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-blue-600 uppercase tracking-wider text-xs">{conversation.otherUser.role} PRO</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {features.slice(0, 3).map((feature) => (
              <button
                key={feature.id}
                onClick={feature.action}
                className={`h-10 w-10 rounded-xl bg-${feature.color}-100 hover:bg-${feature.color}-200 flex items-center justify-center transition-all`}
                title={feature.label}
              >
                <feature.icon size={20} className={`text-${feature.color}-600`} />
              </button>
            ))}
            <button className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
              <MoreVertical size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Feature Bar */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={feature.action}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all whitespace-nowrap"
            >
              <feature.icon size={16} />
              <span className="text-sm font-medium">{feature.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = message.senderId === 'current-user';
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : `bg-slate-100 text-slate-900 rounded-bl-none ${getSentimentColor(message.sentiment)}`
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.translated && translationEnabled && (
                        <p className="text-xs mt-2 opacity-75 italic border-t border-white/20 pt-2">
                          {message.translated}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-2">
                      <span className="text-xs text-slate-500">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.sentiment && (
                        <span className={`text-xs ${
                          message.sentiment === 'positive' ? 'text-green-600' :
                          message.sentiment === 'negative' ? 'text-red-600' :
                          'text-slate-500'
                        }`}>
                          {message.sentiment === 'positive' ? '😊' : 
                           message.sentiment === 'negative' ? '😟' : '😐'}
                        </span>
                      )}
                      {!isOwn && translationEnabled && (
                        <button
                          onClick={() => handleTranslate(message.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Translate
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-bl-none p-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Replies */}
      {showFeatures && (
        <div className="px-4 py-2 border-t border-slate-200 bg-slate-50">
          <p className="text-xs font-bold text-slate-600 mb-2">Quick Replies:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => setNewMessage(reply)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm hover:bg-blue-50 hover:border-blue-300 transition-all whitespace-nowrap"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center">
            <Paperclip size={20} className="text-slate-600" />
          </button>
          <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center">
            <Smile size={20} className="text-slate-600" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 h-10 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center">
            <Mic size={20} className="text-slate-600" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="h-10 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
