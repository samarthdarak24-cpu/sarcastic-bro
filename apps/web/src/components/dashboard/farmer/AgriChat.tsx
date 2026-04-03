"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Search, Send, Paperclip, Image as ImageIcon, 
  MoreVertical, Check, CheckCheck, Gavel, Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { messageService, ChatConversation, ChatMessage } from "@/services/messageService";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";

export function AgriChat() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  useEffect(() => {
    fetchConversations();

    if (socket) {
      socket.on("message:new", handleIncomingMessage);
      socket.on("user:online", handleUserPresence);
      socket.on("user:offline", handleUserPresence);
    }

    return () => {
      if (socket) {
        socket.off("message:new", handleIncomingMessage);
        socket.off("user:online", handleUserPresence);
        socket.off("user:offline", handleUserPresence);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.userId);
      if (socket) {
        socket.emit("conversation:join", { conversationId: selectedChat.id });
      }
    }
    return () => {
      if (selectedChat && socket) {
        socket.emit("conversation:leave", { conversationId: selectedChat.id });
      }
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const data = await messageService.getConversations();
      if (data && data.conversations && data.conversations.length > 0) {
        setConversations(data.conversations.map((c: any) => {
           const otherUser = c.user1Id === user?.id ? c.user2 : c.user1;
           return {
             id: c.id,
             userId: otherUser.id,
             name: otherUser.name,
             avatar: otherUser.name?.charAt(0) || "U",
             lastMessage: c.messages?.[0]?.content || "Start a conversation",
             lastMessageTime: c.lastMessageAt,
             unreadCount: 0,
             isOnline: true,
             role: otherUser.role
           };
        }));
      } else {
        // Inject DEMO DATA to showcase WhatsApp-like UI perfectly
        const demoConversations: ChatConversation[] = [
          { id: "demo-1", userId: "demo-u1", name: "Reliance Retail", avatar: "R", lastMessage: "Can we get 2 Tons of Basmati by Friday?", lastMessageTime: new Date().toISOString(), unreadCount: 2, isOnline: true, role: "Corporate Buyer" },
          { id: "demo-2", userId: "demo-u2", name: "BigBasket Sourcing", avatar: "B", lastMessage: "Pricing seems a bit high for this grade.", lastMessageTime: new Date(Date.now() - 86400000).toISOString(), unreadCount: 0, isOnline: false, role: "Online Retailer" },
          { id: "demo-3", userId: "demo-u3", name: "ITC Limited", avatar: "I", lastMessage: "Sample received. Quality is excellent.", lastMessageTime: new Date(Date.now() - 172800000).toISOString(), unreadCount: 0, isOnline: true, role: "Food Processor" }
        ];
        setConversations(demoConversations);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      if (userId.startsWith("demo-")) {
         // Show Demo Messages to match the WhatsApp UI request
         const isBuyerMsg = (text: string, minsAgo: number): ChatMessage => ({
            id: `msg-${Date.now()}-${Math.random()}`, conversationId: "demo", senderId: userId, type: "text", content: text, createdAt: new Date(Date.now() - minsAgo * 60000).toISOString()
         });
         const isMeMsg = (text: string, minsAgo: number): ChatMessage => ({
            id: `msg-${Date.now()}-${Math.random()}`, conversationId: "demo", senderId: user?.id || "me", type: "text", content: text, createdAt: new Date(Date.now() - minsAgo * 60000).toISOString()
         });
         
         if (userId === "demo-u1") {
            setMessages([
              isBuyerMsg("Hello! We are interested in your Premium Basmati Rice lot.", 120),
              isMeMsg("Sure, how much quantity are you looking for?", 115),
              isBuyerMsg("We need around 2 Tons. Can we negotiate on the ₹85/kg price?", 110),
              isMeMsg("What's your best offer?", 100),
              isBuyerMsg("We can do ₹82/kg for an immediate bulk order.", 2)
            ]);
         } else {
            setMessages([isBuyerMsg("Check our attached RFP for the upcoming quarter.", 60)]);
         }
         return;
      }

      const data = await messageService.getMessages(userId);
      if (data && data.messages) {
        setMessages(data.messages.reverse()); // latest at bottom
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleIncomingMessage = (msgData: any) => {
    setMessages(prev => {
      // Avoid duplicates
      if (prev.find(m => m.id === msgData.messageId)) return prev;
      return [...prev, {
        id: msgData.messageId,
        conversationId: msgData.conversationId,
        senderId: msgData.senderId,
        content: msgData.content,
        type: msgData.type,
        createdAt: msgData.timestamp
      }];
    });

    // Update conversation last message locally
    setConversations(prev => prev.map(c => 
      c.id === msgData.conversationId ? { ...c, lastMessage: msgData.content, lastMessageTime: msgData.timestamp, unreadCount: c.id !== selectedChat?.id ? c.unreadCount + 1 : 0 } : c
    ));
  };

  const handleUserPresence = (data: any) => {
    setConversations(prev => prev.map(c => 
      c.userId === data.userId ? { ...c, isOnline: data.timestamp ? true : false } : c
    ));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    
    // Optimistic UI updates
    const tempId = `temp-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempId,
      conversationId: selectedChat.id,
      senderId: user?.id || "",
      content: newMessage,
      type: "text",
      createdAt: new Date().toISOString()
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Emit to actual backend socket/api
    try {
      if (selectedChat.userId.startsWith("demo-")) {
         // Fake response for demo
         setTimeout(() => {
           setMessages(prev => [...prev, {
             id: `demo-reply-${Date.now()}`,
             conversationId: selectedChat.id,
             senderId: selectedChat.userId,
             content: "Thank you for the proposal. Let me review it.",
             type: "text",
             createdAt: new Date().toISOString()
           }]);
         }, 1000);
         return;
      }

      if (socket) {
        socket.emit("message:send", {
          conversationId: selectedChat.id,
          receiverId: selectedChat.userId,
          content: newMsg.content,
          type: "text"
        });
      } else {
        await messageService.sendMessage(selectedChat.userId, newMsg.content);
      }
    } catch (err) {
      toast.error("Message delivery failed");
    }
  };

  const handleNegotiate = () => {
    if (!selectedChat) return;
    toast.success(`Negotiation chamber opened with ${selectedChat.name}`);
  };

  return (
    <div className="h-[calc(100vh-280px)] min-h-[600px] flex overflow-hidden rounded-[2.5rem] bg-white shadow-startup-soft border border-neut-100 text-neut-900">
      {/* Sidebar */}
      <aside className="w-80 border-r border-neut-100 flex flex-col bg-neut-50/50">
        <div className="p-6 border-b border-neut-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black tracking-tight">AgriChat</h2>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl"><MoreVertical size={20} /></Button>
          </div>
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400" />
            <Input placeholder="Search buyers..." className="pl-10 h-11 border-neut-200 rounded-xl bg-neut-50" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.length === 0 && !loading && (
             <div className="text-center text-neut-400 mt-10 text-sm font-bold">No active conversations.</div>
          )}
          {conversations.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 border ${
                selectedChat?.id === chat.id 
                  ? "bg-white border-brand-primary shadow-startup-soft ring-4 ring-brand-primary/5" 
                  : "bg-transparent border-transparent hover:bg-white hover:border-neut-100"
              }`}
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary font-black text-lg">
                  {chat.avatar}
                </div>
                {chat.isOnline && <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-success rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-sm text-neut-900 truncate">{chat.name}</h4>
                </div>
                <p className="text-xs text-neut-500 font-medium truncate">{chat.lastMessage}</p>
              </div>
              {chat.unreadCount > 0 && <Badge tone="brand" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] animate-pulse">{chat.unreadCount}</Badge>}
            </motion.div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col items-center justify-center text-neut-900">
        {selectedChat ? (
          <>
            {/* Header */}
            <header className="h-20 w-full px-8 border-b border-neut-100 flex items-center justify-between bg-white/80 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary font-black">{selectedChat.avatar}</div>
                <div>
                  <h3 className="font-black text-neut-900 tracking-tight">{selectedChat.name}</h3>
                  <p className="text-[9px] font-black text-success uppercase tracking-widest leading-loose">{selectedChat.role || "BUYER"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                   onClick={handleNegotiate}
                   variant="outline" 
                   className="h-11 px-6 rounded-xl font-bold border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all transform hover:scale-105 shadow-startup-soft"
                >
                  <Gavel size={18} className="mr-2" />
                  Smart Negotiation
                </Button>
                <div className="h-8 w-px bg-neut-100 mx-1" />
                <Button variant="ghost" size="icon" className="h-10 w-10"><MoreVertical size={20} /></Button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 w-full overflow-y-auto p-8 space-y-6 bg-neut-50/10 custom-scrollbar">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] p-4 rounded-2xl shadow-startup-soft border ${
                        isMe 
                          ? "bg-brand-primary text-white border-brand-primary" 
                          : "bg-white text-neut-900 border-neut-100"
                      }`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                        <div className={`mt-2 flex items-center justify-end gap-1.5 text-[10px] ${isMe ? "text-white/60" : "text-neut-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {isMe && <CheckCheck size={12} />}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <footer className="p-6 w-full border-t border-neut-100 bg-white shadow-lg shadow-neut-900/5">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <Button variant="outline" type="button" size="icon" className="h-11 w-11 rounded-xl shrink-0"><Paperclip size={18} /></Button>
                <div className="relative flex-1 group">
                   <Input 
                      placeholder="Type your message securely..." 
                      className="h-12 w-full pl-6 pr-12 rounded-2xl border-neut-100 bg-neut-50 focus:bg-white transition-all text-sm font-medium"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                   />
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <Smile size={18} className="text-neut-300 cursor-pointer hover:text-neut-500" />
                       <ImageIcon size={18} className="text-neut-300 cursor-pointer hover:text-neut-500" />
                   </div>
                </div>
                <Button 
                   type="submit"
                   variant="gradient" 
                   className="h-12 w-12 rounded-2xl shrink-0 shadow-lg shadow-brand-primary/20 transform active:scale-95"
                >
                  <Send size={20} />
                </Button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 bg-brand-primary/5 text-brand-primary rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-6">
               <MessageSquare size={40} />
            </div>
            <h3 className="text-2xl font-black text-neut-900 tracking-tight">ODOP Secure Communications</h3>
            <p className="text-neut-400 font-bold mt-2">End-to-End Encrypted Agricultural Chat Network</p>
          </div>
        )}
      </main>
    </div>
  );
}
