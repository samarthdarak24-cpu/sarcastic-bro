"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Volume2, VolumeX } from "lucide-react";

interface FloatingAIChatbotProps {
  userRole: "FARMER" | "BUYER";
  userName?: string;
}

export default function FloatingAIChatbot({ userRole, userName }: FloatingAIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: `Hello${userName ? ` ${userName}` : ""}! I'm your AI assistant. How can I help you today?`
    }
  ]);

  const speak = (text: string, index: number) => {
    if (typeof window === 'undefined') return;
    if (isSpeaking === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    // Language detection can be added here if needed, default to regional English/Hindi
    utterance.lang = 'hi-IN'; 
    utterance.onend = () => setIsSpeaking(null);
    window.speechSynthesis.cancel();
    setIsSpeaking(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user" as const, content: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3001/api/n8n/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          userRole: userRole.toLowerCase(),
          userName: userName
        }),
      });

      const data = await response.json();

      if (data.response) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.response
        }]);
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the AI brain right now. Please make sure Ollama is running with qwen2.5."
      }]);
    }
  };

  const themeColor = userRole === "FARMER" ? "green" : "blue";
  const gradientFrom = userRole === "FARMER" ? "from-green-500" : "from-blue-500";
  const gradientTo = userRole === "FARMER" ? "to-emerald-600" : "to-cyan-600";

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-${themeColor}-500/50 transition-all duration-300`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare size={28} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation */}
        <motion.div
          className={`absolute inset-0 bg-${themeColor}-400 rounded-full opacity-40 blur-md`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-4 flex items-center gap-3`}>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">AI Assistant</h3>
                <p className="text-white/80 text-xs">Always here to help</p>
              </div>
              <button 
                onClick={() => window.location.href = '/ai-assistant'}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                title="Open Full Screen"
              >
                <Sparkles size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl relative group/msg min-w-[100px] ${
                      msg.role === "user"
                        ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`
                        : "bg-white text-slate-800 shadow-sm border border-slate-200"
                    }`}
                  >
                    <p className="text-sm pr-6">{msg.content}</p>
                    
                    {msg.role === "assistant" && (
                      <button 
                        onClick={() => speak(msg.content, idx)}
                        className={`absolute top-2 right-2 p-1 rounded-md transition-all ${
                          isSpeaking === idx 
                            ? "bg-emerald-500 text-white" 
                            : "text-slate-400 hover:bg-slate-100 opacity-0 group-hover/msg:opacity-100"
                        }`}
                      >
                        {isSpeaking === idx ? <VolumeX size={12} /> : <Volume2 size={12} />}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className={`w-10 h-10 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all`}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
