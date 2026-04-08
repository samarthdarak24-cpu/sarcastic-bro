'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Search, Phone, Video, MoreVertical,
  Check, CheckCheck, Paperclip, Smile, Mic, Image as ImageIcon,
  ArrowLeft, User, Clock, Star, Archive, Trash2, Pin
} from 'lucide-react';
import { useMessageNotifications, useTypingIndicator, useSocket } from '@/hooks/useSocket';
import { messagingService } from '@/services/messagingService';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
  type: 'text' | 'image' | 'voice';
  fileUrl?: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

interface Conversation {
  conversationId: string;
  otherUser: {
    id: string;
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isRead: boolean;
  } | null;
  lastMessageAt: string;
  unreadCount?: number;
}

export default function DirectMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState<{ userId: string; userName: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const socket = useSocket();
  const isConnected = socket?.connected || false;

  // Use Socket.IO hooks for real-time updates
  useMessageNotifications((data) => {
    // Add message to current conversation if it's selected
    if (selectedConversation && data.senderId === selectedConversation.otherUser.id) {
      fetchMessages(selectedConversation.otherUser.id);
      // Mark as read automatically
      if (data.messageId) {
        messagingService.markAsRead(data.messageId);
      }
    }
    // Refresh conversations list
    fetchConversations();
  });

  const { startTyping, stopTyping, onTyping } = useTypingIndicator(selectedConversation?.conversationId);

  // Listen for typing indicators
  useEffect(() => {
    if (!selectedConversation) return;

    const cleanup = onTyping((data: any) => {
      if (data.userId === selectedConversation.otherUser.id) {
        if (data.isTyping) {
          setTyping({ userId: data.userId, userName: data.userName });
        } else {
          setTyping(null);
        }
      }
    });

    return cleanup;
  }, [selectedConversation, onTyping]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messagingService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    try {
      const data = await messagingService.getMessages(otherUserId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    try {
      setSending(true);
      const message = await messagingService.sendMessage(
        selectedConversation.otherUser.id,
        newMessage.trim()
      );
      
      if (message) {
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        stopTyping();
        
        // Update conversation list
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleNewMessage = (data: any) => {
    // Add message to current conversation if it's selected
    if (selectedConversation && data.senderId === selectedConversation.otherUser.id) {
      setMessages(prev => [...prev, data]);
      
      // Mark as read automatically
      markAsRead(data.messageId);
    }

    // Refresh conversations list
    fetchConversations();
  };

  const handleTyping = (data: { userId: string; userName: string; isTyping: boolean }) => {
    if (selectedConversation && data.userId === selectedConversation.otherUser.id) {
      if (data.isTyping) {
        setTyping({ userId: data.userId, userName: data.userName });
      } else {
        setTyping(null);
      }
    }
  };

  const handleMessageRead = (data: { messageId: string }) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === data.messageId ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg
      )
    );
  };

  const markAsRead = async (messageId: string) => {
    try {
      await messagingService.markAsRead(messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const emitTyping = (isTyping: boolean) => {
    if (!selectedConversation) return;

    clearTimeout(typingTimeoutRef.current);

    if (isTyping) {
      startTyping();
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    } else {
      stopTyping();
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.otherUser.id);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col border-r border-slate-200`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-slate-900">Messages</h2>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-slate-500">{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageSquare size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No conversations yet</p>
              <p className="text-sm text-slate-400 mt-2">Start chatting with buyers or farmers</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.conversationId}
                  onClick={() => selectConversation(conversation)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedConversation?.conversationId === conversation.conversationId
                      ? 'bg-blue-50'
                      : 'hover:bg-slate-50'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                        {conversation.otherUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900 truncate">{conversation.otherUser.name}</h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-slate-400">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600 truncate flex-1">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount && conversation.unreadCount > 0 && (
                            <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {selectedConversation.otherUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedConversation.otherUser.name}</h3>
                  <p className="text-xs text-slate-500">
                    {typing ? `${typing.userName} is typing...` : 'Online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Phone size={20} className="text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Video size={20} className="text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === getCurrentUserId();
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isOwn
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-slate-900 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-slate-400">
                          {formatTime(message.createdAt)}
                        </span>
                        {isOwn && (
                          message.isRead ? (
                            <CheckCheck size={14} className="text-blue-500" />
                          ) : (
                            <Check size={14} className="text-slate-400" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Smile size={22} className="text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Paperclip size={22} className="text-slate-600" />
              </button>
              
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  emitTyping(true);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {newMessage.trim() ? (
                <button
                  onClick={sendMessage}
                  disabled={sending}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              ) : (
                <button className="p-3 hover:bg-slate-100 rounded-xl transition-colors">
                  <Mic size={22} className="text-slate-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50">
          <div className="text-center">
            <MessageSquare size={64} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Select a conversation</h3>
            <p className="text-slate-500">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
