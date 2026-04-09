"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, User, Sparkles, Brain, 
  ChevronLeft, Trash2, Globe, MessageCircle,
  TrendingUp, ShieldCheck, Leaf, Volume2, VolumeX
} from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speak = (text: string, index: number) => {
    if (typeof window === 'undefined') return;
    
    // Stop if already speaking this message
    if (isSpeaking === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to set language
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    window.speechSynthesis.cancel();
    setIsSpeaking(index);
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Namaste! I am the AgriVoice Intelligence Engine. I am trained on 12 Indian crops and the full AgriVoice ecosystem. How can I help you grow your business today?",
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/n8n/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          userRole: "farmer", // Default for now, could be dynamic
          language: language
        })
      });

      const data = await response.json();

      if (data.response) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.response,
          timestamp: new Date()
        }]);
      } else {
        throw new Error("Empty response");
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologized, but I'm having trouble connecting to my knowledge base. Please ensure Ollama is running.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/farmer/dashboard">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ChevronLeft className="text-slate-400 hover:text-white cursor-pointer" />
            </motion.div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">AgriVoice Intelligence</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-500 font-medium">Qwen 2.5 Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-800 border-none rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
          <button 
            onClick={clearHistory}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full flex flex-col p-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === "assistant" ? "bg-emerald-500" : "bg-slate-700"
                }`}>
                  {msg.role === "assistant" ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm relative group/msg min-w-[120px] ${
                  msg.role === "user" 
                    ? "bg-emerald-600 text-white rounded-tr-none" 
                    : "bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap pr-6">{msg.content}</p>
                  
                  {msg.role === "assistant" && (
                    <button 
                      onClick={() => speak(msg.content, idx)}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all ${
                        isSpeaking === idx 
                          ? "bg-emerald-500 text-white animate-pulse" 
                          : "text-slate-500 hover:text-white hover:bg-slate-700 opacity-0 group-hover/msg:opacity-100"
                      }`}
                      title="Listen"
                    >
                      {isSpeaking === idx ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                  
                  <span className="text-[10px] opacity-50 mt-2 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse delay-75" />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse delay-150" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {!isLoading && messages.length < 3 && (
          <div className="py-4 flex flex-wrap gap-2 justify-center">
            {[
              { label: "Onion Rot Prevention", icon: <ShieldCheck size={14} /> },
              { label: "Market Price Trends", icon: <TrendingUp size={14} /> },
              { label: "AI Grading Help", icon: <Sparkles size={14} /> },
              { label: "Tomato Grade A Tips", icon: <Leaf size={14} /> }
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => setInput(chip.label)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 flex items-center gap-2 transition-all hover:border-emerald-500/50"
              >
                {chip.icon}
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about farming, prices, or AgriVoice..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                input.trim() 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105" 
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
