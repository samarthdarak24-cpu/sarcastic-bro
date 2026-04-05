"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, TrendingUp, Target, Zap, Brain, BarChart3, ShoppingCart } from "lucide-react";

export function ProcurementAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI procurement assistant. How can I help you source products today?" },
  ]);
  const [input, setInput] = useState("");

  const suggestions = [
    "Find best wheat suppliers in Punjab",
    "Compare rice prices across regions",
    "Suggest bulk order strategy",
    "Analyze market trends for pulses",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I found 12 verified wheat suppliers in Punjab with competitive pricing. Would you like to see the comparison?" },
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">AI Procurement Assistant</h1>
        <p className="text-slate-500 font-medium">Powered by advanced machine learning</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"}`}>
                  <p className="font-medium">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything about procurement..."
                className="flex-1 h-14 px-6 bg-white border border-slate-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleSend} className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
                Send
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Suggestions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={24} />
              <h3 className="text-xl font-black">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(sug)}
                  className="w-full text-left p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all font-medium text-sm"
                >
                  {sug}
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
            <h3 className="text-xl font-black text-slate-900 mb-4">AI Insights</h3>
            <div className="space-y-4">
              {[
                { label: "Queries Processed", value: "1,247", icon: Brain },
                { label: "Avg Savings", value: "18%", icon: TrendingUp },
                { label: "Success Rate", value: "96%", icon: Target },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <stat.icon size={18} />
                    </div>
                    <span className="font-medium text-slate-600">{stat.label}</span>
                  </div>
                  <span className="text-xl font-black text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
