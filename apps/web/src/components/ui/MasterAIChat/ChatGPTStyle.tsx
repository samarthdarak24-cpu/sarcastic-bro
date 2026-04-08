"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Loader2, Mic, X, Languages
} from 'lucide-react';
import { masterAIService, UserProfile } from '@/services/masterAIService';
import toast from 'react-hot-toast';

interface ChatGPTStyleProps {
  userId: string;
  userProfile?: UserProfile;
  fullScreen?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export function ChatGPTStyle({ 
  userId, 
  userProfile,
  fullScreen = true
}: ChatGPTStyleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    const textToSend = input.trim();
    
    if (!textToSend || isLoading) return;

    setInput('');
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };
      
      setMessages(prev => [...prev, aiMessage]);

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

      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response');
      setMessages(prev => prev.filter(msg => !msg.isStreaming));
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

  const containerClass = fullScreen 
    ? "fixed inset-0 z-50" 
    : "w-full h-full";

  return (
    <div className={`${containerClass} flex flex-col`} style={{ backgroundColor: '#1a1d2e' }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px 24px',
        borderRadius: '0 0 24px 24px'
      }}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: 'white',
                margin: 0,
                lineHeight: '1.2'
              }}>
                AI Assistant v2.0
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }}></div>
                <span style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500'
                }}>
                  Online • New UI
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <Languages className="w-5 h-5 text-white" />
            </button>
            <button style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6" style={{ 
        backgroundColor: '#1a1d2e'
      }}>
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)'
              }}>
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              
              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                maxWidth: '600px',
                lineHeight: '1.6',
                marginBottom: '40px'
              }}>
                I'm here to help you with farming advice, market prices, platform features, and more. Ask me anything!
              </p>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  { text: "How to increase profit?", icon: "💰" },
                  { text: "Market insights", icon: "📊" },
                  { text: "Crop protection", icon: "🌾" },
                  { text: "Weather forecast", icon: "🌤️" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(item.text);
                      setTimeout(() => handleSend(), 100);
                    }}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '2px solid rgba(102, 126, 234, 0.3)',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: message.role === 'user' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}>
                    {message.role === 'user' ? (
                      <span style={{ fontSize: '20px' }}>👤</span>
                    ) : (
                      <Sparkles className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      padding: '16px 20px',
                      borderRadius: '16px',
                      background: message.role === 'user'
                        ? 'rgba(102, 126, 234, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid ' + (message.role === 'user' 
                        ? 'rgba(102, 126, 234, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)'),
                      backdropFilter: 'blur(10px)'
                    }}>
                      <p style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        lineHeight: '1.6',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        fontWeight: '400'
                      }}>
                        {message.content}
                      </p>
                      
                      {message.isStreaming && (
                        <div className="flex items-center gap-1 mt-3">
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            animation: 'bounce 1s infinite'
                          }}></div>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            animation: 'bounce 1s infinite 0.2s'
                          }}></div>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            animation: 'bounce 1s infinite 0.4s'
                          }}></div>
                        </div>
                      )}
                    </div>
                    
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.4)',
                      marginTop: '8px',
                      paddingLeft: '4px'
                    }}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-4 pb-6 pt-4" style={{ 
        backgroundColor: '#1a1d2e'
      }}>
        <div className="max-w-4xl mx-auto">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <button style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(102, 126, 234, 0.2)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}>
              <Mic className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            </button>
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about farming..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '16px',
                resize: 'none',
                minHeight: '44px',
                maxHeight: '120px',
                padding: '10px 0',
                fontFamily: 'inherit',
                lineHeight: '1.5'
              }}
              rows={1}
            />
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: input.trim() && !isLoading
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                transition: 'all 0.2s',
                boxShadow: input.trim() && !isLoading 
                  ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                  : 'none'
              }}
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

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
