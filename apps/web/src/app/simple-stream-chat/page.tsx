'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Zap, Leaf, TrendingUp, Bug, FlaskConical, Target, Sparkles, Trash2, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  agentName?: string;
  agentEmoji?: string;
}

interface Agent {
  type: string;
  name: string;
  emoji: string;
  description: string;
  active: boolean;
  icon: any;
  color: string;
}

// ─── Call the Next.js API route (server-side proxy to Gemini) ────────────────
async function getAIResponse(
  userMessage: string, 
  agentType: string,
  chatHistory: { role: string; text: string }[]
): Promise<string> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      agentType,
      chatHistory: chatHistory.slice(-8)
    })
  });

  const data = await response.json();
  
  if (!response.ok || !data.success) {
    console.error('AI API error:', data);
    throw new Error(data.error || 'AI response failed');
  }

  return data.response;
}

export default function SimpleStreamChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const [agents, setAgents] = useState<Agent[]>([
    { type: 'crop_advisor', name: 'Crop Advisor', emoji: '🌾', description: 'Expert in crop cultivation, sowing, irrigation', active: false, icon: Leaf, color: 'emerald' },
    { type: 'market_analyst', name: 'Market Analyst', emoji: '📈', description: 'Mandi prices, trends, best time to sell', active: false, icon: TrendingUp, color: 'blue' },
    { type: 'pest_expert', name: 'Pest Expert', emoji: '🐛', description: 'Pest identification & disease management', active: false, icon: Bug, color: 'orange' },
    { type: 'soil_scientist', name: 'Soil Scientist', emoji: '🧪', description: 'Soil testing, fertilizers, soil health', active: false, icon: FlaskConical, color: 'purple' },
    { type: 'general_advisor', name: 'General Advisor', emoji: '🎯', description: 'Schemes, subsidies, weather, general advice', active: false, icon: Target, color: 'cyan' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addMessage('System', '✅ AgriChat AI ready! Click **▶ Start Agent** on any agent, then ask any question.', 'system');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (sender: string, text: string, type: 'user' | 'agent' | 'system', agentEmoji?: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      text,
      sender: type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agentName: sender,
      agentEmoji
    }]);
  };

  const startAgent = (agentType: string) => {
    const agent = agents.find(a => a.type === agentType);
    if (!agent) return;
    setAgents(prev => prev.map(a => a.type === agentType ? { ...a, active: true } : a));
    addMessage('System', `${agent.emoji} **${agent.name}** activated! Ask any question — real-time AI powered.`, 'system');
    setChatHistory([]);
  };

  const stopAgent = (agentType: string) => {
    const agent = agents.find(a => a.type === agentType);
    if (!agent) return;
    setAgents(prev => prev.map(a => a.type === agentType ? { ...a, active: false } : a));
    addMessage('System', `${agent.emoji} ${agent.name} deactivated.`, 'system');
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('You', userMessage, 'user');

    const activeAgents = agents.filter(a => a.active);
    if (activeAgents.length === 0) {
      addMessage('System', '⚠️ No active agents. Click **▶ Start Agent** on any agent first.', 'system');
      return;
    }

    setLoading(true);
    const agent = activeAgents[0];

    try {
      const response = await getAIResponse(userMessage, agent.type, chatHistory);
      addMessage(agent.name, response, 'agent', agent.emoji);
      setChatHistory(prev => [...prev, 
        { role: 'user', text: userMessage },
        { role: 'model', text: response }
      ]);
    } catch (error: any) {
      console.error('AI error:', error);
      addMessage('System', `❌ AI response failed: ${error.message}. Please check your API key and try again.`, 'system');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setChatHistory([]);
    addMessage('System', '🗑️ Chat cleared. Start chatting!', 'system');
  };

  const activeCount = agents.filter(a => a.active).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">AgriChat AI</h1>
                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Powered by Google Gemini • Real-time AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={clearChat} className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-emerald-700">{activeCount} Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Agent Panel */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Bot className="w-4 h-4 text-emerald-600" /> AI Agents
            </h3>
            
            {agents.map(agent => {
              const Icon = agent.icon;
              return (
                <div key={agent.type} className={`rounded-2xl p-4 transition-all duration-300 border-2 ${
                  agent.active 
                    ? 'bg-white border-emerald-300 shadow-lg shadow-emerald-100' 
                    : 'bg-white/60 border-transparent hover:border-slate-200 hover:shadow-md'
                }`}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      agent.active 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900">{agent.emoji} {agent.name}</span>
                      {agent.active && (
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-600 uppercase">Live AI</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{agent.description}</p>
                  <button
                    onClick={() => agent.active ? stopAgent(agent.type) : startAgent(agent.type)}
                    className={`w-full text-xs px-3 py-2 rounded-xl font-bold transition-all ${
                      agent.active
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {agent.active ? '■ Stop Agent' : '▶ Start Agent'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col" style={{ height: '680px' }}>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl rounded-br-md px-5 py-3 shadow-lg'
                        : message.sender === 'system'
                        ? 'bg-slate-100 text-slate-600 rounded-2xl px-5 py-3 border border-slate-200'
                        : 'bg-white text-slate-800 rounded-2xl rounded-bl-md px-5 py-4 shadow-md border border-slate-100'
                    }`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        {message.sender === 'user' ? (
                          <User className="w-3.5 h-3.5" />
                        ) : message.sender === 'system' ? (
                          <Bot className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <span className="text-sm">{message.agentEmoji}</span>
                        )}
                        <span className="text-xs font-bold opacity-80">{message.agentName}</span>
                        <span className="text-[10px] opacity-50">{message.timestamp}</span>
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap" 
                        dangerouslySetInnerHTML={{ 
                          __html: message.text
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>') 
                        }} 
                      />
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-600 px-5 py-3 rounded-2xl shadow-md border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        <span className="text-xs font-bold text-slate-400">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-100 p-4 bg-slate-50/50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder={activeCount > 0 ? "Ask anything about agriculture..." : "Start an agent first..."}
                    className="flex-1 h-12 px-5 bg-white border-2 border-slate-200 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-300"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !inputMessage.trim()}
                    className="h-12 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </button>
                </div>
                
                {activeCount > 0 && messages.length <= 4 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[
                      'How to grow wheat?',
                      'Current tomato prices',
                      'How to control aphids?',
                      'PM-KISAN eligibility',
                      'Best fertilizer for rice'
                    ].map((s, i) => (
                      <button key={i} onClick={() => setInputMessage(s)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}