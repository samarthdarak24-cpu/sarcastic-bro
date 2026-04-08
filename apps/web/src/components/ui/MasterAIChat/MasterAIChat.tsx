"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Loader2, X, Minimize2, Maximize2,
  Bot, User, RefreshCw, Download, Copy, ThumbsUp, ThumbsDown,
  Zap, TrendingUp, Package, Cloud, DollarSign, Shield
} from 'lucide-react';
import { masterAIService, ChatMessage, UserProfile } from '@/services/masterAIService';
import toast from 'react-hot-toast';

interface MasterAIChatProps {
  userId: string;
  userProfile?: UserProfile;
  onClose?: () => void;
  defaultMinimized?: boolean;
  className?: string;
}

interface Message extends ChatMessage {
  id: string;
  isStreaming?: boolean;
  capability?: string;
  feedback?: 'positive' | 'negative' | null;
}

const capabilityIcons: Record<string, React.ReactNode> = {
  crop_advisory: <Package className="w-4 h-4" />,
  market_analysis: <TrendingUp className="w-4 h-4" />,
  price_prediction: <DollarSign className="w-4 h-4" />,
  weather_insights: <Cloud className="w-4 h-4" />,
  quality_assessment: <Shield className="w-4 h-4" />,
  general_query: <Sparkles className="w-4 h-4" />,
};

export function MasterAIChat({ 
  userId, 
  userProfile, 
  onClose,
  defaultMinimized = false,
  className = ''
}: MasterAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestions = async () => {
    try {
      const contextData = {
        role: userProfile?.role || 'user',
        location: userProfile?.location,
        crops: userProfile?.crops,
      };
      
      const sug = await masterAIService.getSuggestions(
        userId,
        'initial_conversation',
        contextData
      );
      
      setSuggestions(sug);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    
    if (!textToSend || isLoading) return;

    setInput('');
    setIsLoading(true);
    setSuggestions([]);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Create placeholder for AI response
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessageId(aiMessageId);

      // Stream response
      let fullResponse = '';
      
      for await (const chunk of masterAIService.chatStream(
        textToSend,
        userId,
        userProfile
      )) {
        fullResponse += chunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId
            ? { ...msg, content: fullResponse }
            : msg
        ));
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId
          ? { ...msg, isStreaming: false }
          : msg
      ));
      
      setStreamingMessageId(null);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response');
      
      // Remove failed message
      setMessages(prev => prev.filter(msg => !msg.isStreaming));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
    toast.success('Thank you for your feedback!');
  };

  const handleClearChat = () => {
    setMessages([]);
    masterAIService.clearSession();
    loadSuggestions();
    toast.success('Chat cleared');
  };

  const handleExportChat = () => {
    const chatText = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Chat exported');
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsMinimized(false)}
          className="group relative h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-110"
        >
          <Bot className="w-8 h-8 mx-auto animate-pulse" />
          <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold animate-bounce">
            AI
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="w-[450px] h-[700px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AgriMaster AI</h3>
                <p className="text-xs text-white/80">Your intelligent farming assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Clear
            </button>
            <button
              onClick={handleExportChat}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Welcome to AgriMaster AI</h4>
              <p className="text-sm text-slate-600 mb-6">
                Ask me anything about farming, markets, prices, or crops!
              </p>
              
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Try asking:
                  </p>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="w-full text-left p-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-sm transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`flex flex-col max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  
                  {message.isStreaming && (
                    <div className="flex items-center gap-1 mt-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs opacity-70">Thinking...</span>
                    </div>
                  )}
                </div>
                
                {/* Message Actions */}
                {message.role === 'assistant' && !message.isStreaming && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleCopy(message.content)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700 transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'positive')}
                      className={`p-1 hover:bg-slate-200 rounded transition-colors ${
                        message.feedback === 'positive' ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'negative')}
                      className={`p-1 hover:bg-slate-200 rounded transition-colors ${
                        message.feedback === 'negative' ? 'text-red-600' : 'text-slate-500'
                      }`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-slate-700" />
                </div>
              )}
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <p className="text-xs text-slate-500 mt-2 text-center">
            Powered by advanced AI • Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}
