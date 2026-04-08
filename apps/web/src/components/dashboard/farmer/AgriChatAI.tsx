"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  TrendingUp,
  Camera,
  Leaf,
  DollarSign,
  Users,
  Lightbulb,
  Trash2,
  Loader2,
  Bot,
} from "lucide-react";
import { chatService, ChatMessage } from "@/services/aiChatService";
import { useAuthStore } from "@/store/authStore";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";

export function AgriChatAI() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load conversation history
    if (user?.id) {
      chatService.loadHistoryFromStorage(user.id);
      const history = chatService.getHistory();
      if (history.length > 0) {
        setMessages(history);
      } else {
        // Welcome message with user's name
        const userName = user.name || 'Farmer';
        setMessages([
          {
            role: "assistant",
            content: `Hello ${userName}! 🌾 I'm AgriMaster AI, your super advanced agricultural intelligence assistant.

I can help you with:
💰 **Market Analysis** - Real-time prices and trends
🌱 **Crop Guidance** - What to grow and when
🔬 **Quality Assessment** - Improve your harvest
🤝 **Buyer Connections** - Find the right markets
🐛 **Pest Management** - Identify and treat issues
🌤️ **Weather Insights** - Smart farming decisions

Ask me anything - I'm designed to provide intelligent, detailed answers just like ChatGPT!`,
            timestamp: new Date(),
          },
        ]);
      }
    }

    // Load suggestions
    loadSuggestions();
  }, [user]);

  useEffect(() => {
    // Save history when messages change
    if (user?.id && messages.length > 1) {
      chatService.saveHistoryToStorage(user.id);
    }
    scrollToBottom();
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSuggestions = async () => {
    const sug = await chatService.getSuggestions();
    setSuggestions(sug.slice(0, 4));
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    setInput("");
    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get AI response using streaming
      let fullResponse = "";
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      
      // Add empty assistant message for streaming
      setMessages((prev) => [...prev, assistantMessage]);
      const messageIndex = messages.length + 1; // Index of the assistant message

      await chatService.sendMessageStream(
        textToSend,
        {
          name: user?.name,
          location: user?.district || user?.state,
          products: user?.products || [],
          role: user?.role || 'FARMER'
        },
        // On chunk received
        (chunk: string) => {
          fullResponse += chunk;
          setMessages((prev) => prev.map((msg, idx) => 
            idx === messageIndex ? { ...msg, content: fullResponse } : msg
          ));
        },
        // On complete
        (response) => {
          setMessages((prev) => prev.map((msg, idx) => 
            idx === messageIndex ? { 
              ...msg, 
              content: response.response,
              actions: response.actions 
            } : msg
          ));
          
          if (response.suggestions) {
            setSuggestions(response.suggestions.slice(0, 4));
          }
          setIsLoading(false);
        },
        // On error
        (error) => {
          console.error("Stream error:", error);
          setMessages((prev) => prev.map((msg, idx) => 
            idx === messageIndex ? { 
              ...msg, 
              content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." 
            } : msg
          ));
          setIsLoading(false);
        }
      );

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    } finally {
      scrollToBottom();
    }
  };

  const executeAction = async (action: any, messageIndex: number) => {
    try {
      setIsLoading(true);
      
      // Remove action from message to prevent double-execution
      setMessages(prev => prev.map((msg, i) => 
        i === messageIndex ? { ...msg, actions: [] } : msg
      ));

      let result;
      switch (action.type) {
        case 'PLACE_ORDER':
          result = await orderService.createOrder(action.params);
          break;
        case 'CREATE_PRODUCT':
          result = await productService.createProduct(action.params);
          break;
        case 'NAVIGATE':
          window.location.href = action.target;
          return;
        default:
          throw new Error("Unknown action type");
      }

      // Use result if needed
      console.log('Action result:', result);

      // Add confirmation message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Action completed successfully! ${action.type === 'PLACE_ORDER' ? 'Order has been placed.' : 'Product has been created.'}`,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.error("Action Execution Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Failed to execute action: ${error.message || 'Unknown error'}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to clear the conversation history?")) {
      await chatService.clearHistory();
      const userName = user?.name || 'Farmer';
      setMessages([
        {
          role: "assistant",
          content: `Hello ${userName}! 🌾 I'm AgriMaster AI, your super advanced agricultural intelligence assistant. I can answer any question about farming, markets, technology, or business. What would you like to know?`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-3">
              <Bot className="text-blue-600" size={40} />
              AgriMaster AI
            </h1>
            <p className="text-slate-500 font-medium">Super Advanced Intelligence • ChatGPT-like responses • Answers anything</p>
          </div>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium"
          >
            <Trash2 size={18} />
            Clear History
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[650px]"
        >
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-blue-600">AI Assistant</span>
                      </div>
                    )}
                    <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
                    
                    {/* Action Cards */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-4 space-y-3 pt-4 border-t border-black/10">
                        {msg.actions.map((action, actionIdx) => (
                          <div key={actionIdx} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                            <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Suggested Action</p>
                            <h4 className="font-bold mb-3">{action.type.replace('_', ' ')}</h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => executeAction(action, idx)}
                                className="flex-1 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => {
                                  setMessages(prev => prev.map((m, i) => i === idx ? { ...m, actions: [] } : m));
                                }}
                                className="px-4 py-2 bg-black/20 text-white rounded-lg text-sm font-bold hover:bg-black/30 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.timestamp && (
                      <p className="text-xs mt-2 opacity-60">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    )}
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
                <div className="bg-slate-100 p-4 rounded-2xl flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin text-blue-600" />
                  <span className="text-sm font-medium text-slate-600">AI is thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask anything about farming, prices, quality, buyers..."
                className="flex-1 h-14 px-6 bg-white border border-slate-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading}
                className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={24} />
              <h3 className="text-xl font-black">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug)}
                  disabled={isLoading}
                  className="w-full text-left p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all font-medium text-sm disabled:opacity-50"
                >
                  {sug}
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI Capabilities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
          >
            <h3 className="text-xl font-black text-slate-900 mb-4">AI Capabilities</h3>
            <div className="space-y-4">
              {[
                { label: "Price Predictions", icon: DollarSign, color: "text-green-600" },
                { label: "Quality Analysis", icon: Camera, color: "text-purple-600" },
                { label: "Crop Advice", icon: Leaf, color: "text-emerald-600" },
                { label: "Buyer Matching", icon: Users, color: "text-blue-600" },
                { label: "Market Trends", icon: TrendingUp, color: "text-orange-600" },
                { label: "Smart Insights", icon: Lightbulb, color: "text-yellow-600" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="font-medium text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
