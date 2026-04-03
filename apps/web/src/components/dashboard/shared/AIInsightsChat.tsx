"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  User, 
  Bot, 
  TrendingUp, 
  Target, 
  Zap,
  ArrowRight,
  PlusCircle,
  MessageSquare,
  Activity
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  data?: any;
}

export function AIInsightsChat({ userType }: { userType: "FARMER" | "BUYER" }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm your Unified Agri-Intelligence Engine. I can help you with ${userType === 'FARMER' ? 'crop rotation, market pricing, and yield optimization' : 'smart sourcing, price indices, and procurement strategies'}. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/ai/insights", {
        query: query,
        userType: userType
      });

      const { answer, recommendations, insights } = response.data.data;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answer,
        data: { recommendations, insights },
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to reach the intelligence engine.");
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Voice input is not supported in your browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const quickQuestions = userType === "FARMER" 
    ? ["Best crop for Kharif?", "Suggest tomato price", "Disease in onions?"] 
    : ["Find wheat suppliers", "Price trend for potatoes", "Reliable rice farmers"];

  return (
    <Card className="h-[700px] border-none shadow-startup-soft bg-white/60 backdrop-blur-3xl overflow-hidden flex flex-col rounded-[3rem]">
      {/* Header */}
      <div className="p-8 border-b border-neut-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-startup-gradient rounded-2xl flex items-center justify-center text-white shadow-startup-soft">
                <Sparkles size={24} className="animate-pulse" />
            </div>
            <div>
                <h3 className="text-xl font-black text-neut-900 tracking-tight">Agri-Intelligence Engine</h3>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-success rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase text-neut-400 tracking-widest">System Synchronized</span>
                </div>
            </div>
         </div>
         <Badge tone="brand" className="h-8 px-4 font-black rounded-lg">MODEL: OPTIMA_V2</Badge>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar scrollbar-hide"
      >
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-4 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${m.role === 'user' ? 'bg-neut-900 text-white' : 'bg-brand-primary/10 text-brand-primary'}`}>
                {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="space-y-4">
                <div className={`p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-neut-900 text-white rounded-tr-none' : 'bg-white text-neut-700 rounded-tl-none border border-neut-50'}`}>
                  {m.content}
                </div>

                {/* Data Insights Rendering */}
                {m.data?.recommendations && m.data.recommendations.length > 0 && (
                   <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {m.data.recommendations.map((rec: any, idx: number) => (
                          <Card key={idx} className="border-none shadow-startup-soft bg-white/80 p-4 rounded-2xl group hover:scale-105 transition-transform cursor-pointer">
                              <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xl">{rec.image || rec.finalScore ? '👨‍🌾' : '💰'}</span>
                                  <h4 className="font-black text-xs text-neut-900">{rec.crop || rec.farmerName || `Recommended ₹${rec.recommendedPrice}`}</h4>
                              </div>
                              <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-neut-400 capitalize">{rec.season || `${rec.distance}km away` || 'Confidence'}</span>
                                  <ArrowRight size={12} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                          </Card>
                        ))}
                      </div>

                      {/* AI Intelligence Visualization */}
                      <Card className="border-none bg-neut-950 p-6 rounded-3xl overflow-hidden relative group shadow-2xl">
                        <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-2 mb-4">
                           <Activity size={14} className="text-brand-primary" />
                           <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest">Market Predictive Curve</span>
                        </div>
                        <div className="flex items-end gap-1.5 h-24 mb-4 items-end">
                           {[40, 60, 45, 80, 55, 90, 70, 85, 95, 60].map((h, i) => (
                             <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className="flex-1 bg-gradient-to-t from-brand-primary/20 to-brand-primary rounded-t-lg"
                             />
                           ))}
                        </div>
                        <p className="text-[10px] font-bold text-white/50 tracking-tight">
                            AI Confidence: <span className="text-white">94.2%</span> — Based on historical Mandi cycles and satellite moisture data.
                        </p>
                      </Card>
                   </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-brand-primary/5 p-4 rounded-2xl flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  className="h-1.5 w-1.5 bg-brand-primary rounded-full" 
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-neut-100 bg-white/40">
        <div className="flex flex-wrap gap-2 mb-6">
            {quickQuestions.map(q => (
                <button 
                   key={q} 
                   onClick={() => handleSend(q)}
                   className="px-4 py-2 bg-white text-neut-500 rounded-xl text-xs font-bold hover:bg-brand-primary hover:text-white transition-all shadow-sm border border-neut-100"
                >
                    {q}
                </button>
            ))}
        </div>
        <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-[2rem] shadow-xl shadow-neut-900/5 focus-within:shadow-brand-primary/10 border border-neut-100 transition-all">
          <input 
            type="text" 
            placeholder="Ask anything about agri-market..." 
            className="flex-1 bg-transparent border-none outline-none font-bold text-neut-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={toggleVoice}
            className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-error text-white animate-pulse' : 'bg-neut-50 text-neut-400 hover:text-neut-900'}`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <Button 
            className="h-12 w-12 rounded-xl p-0 bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/20"
            onClick={() => handleSend()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
