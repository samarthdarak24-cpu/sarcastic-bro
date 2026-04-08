"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, X } from 'lucide-react';
import { simpleAIService } from '@/services/simpleAIService';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function SimpleAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const textToSend = input.trim();
    
    if (!textToSend || isLoading) return;

    setInput('');
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get AI response
      const response = await simpleAIService.chat(textToSend);
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-sm text-white/90">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-8 shadow-2xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              
              <p className="text-lg text-white/70 text-center max-w-2xl mb-8">
                I'm here to help you with farming advice, market prices, and platform features. Ask me anything!
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  { text: "What are today's prices?", icon: "💰" },
                  { text: "How to improve yield?", icon: "🌾" },
                  { text: "Find buyers near me", icon: "📍" },
                  { text: "Weather forecast", icon: "🌤️" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(item.text);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="p-4 rounded-xl bg-white/10 border-2 border-purple-500/30 text-white font-semibold hover:bg-white/20 hover:border-purple-500/50 transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            messages.map((message) => (
              <div key={message.id} className="flex gap-4 items-start">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-gradient-to-r from-pink-500 to-orange-500'
                }`}>
                  {message.role === 'user' ? (
                    <span className="text-xl">👤</span>
                  ) : (
                    <Sparkles className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1">
                  <div className={`p-4 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-purple-600/20 border border-purple-500/30'
                      : 'bg-white/10 border border-white/20'
                  }`}>
                    <p className="text-white/95 whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  
                  <div className="text-xs text-white/40 mt-2 px-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-4 pb-6 pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border-2 border-purple-500/30 backdrop-blur-sm">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50 resize-none min-h-[44px] max-h-[120px] py-2"
              rows={1}
            />
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg cursor-pointer'
                  : 'bg-white/10 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
