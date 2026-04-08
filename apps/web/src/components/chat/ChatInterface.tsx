'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Phone, Video, MoreVertical, Smile, Paperclip,
  Check, CheckCheck, Globe, Zap, TrendingUp, BarChart3
} from 'lucide-react';
import { chatService } from '@/services/chatService';
import { useSocket, useMessageNotifications, useTypingIndicator } from '@/hooks/useSocket';
import toast from 'react-hot-toast';
import MessageList from './MessageList';
import QuickTemplates from './QuickTemplates';
import TranslationToggle from './TranslationToggle';

interface ChatInterfaceProps {
  conversation: any;
  onVideoCall: (conversationId: string) => void;
}

export default function ChatInterface({ conversation, onVideoCall }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const socket = useSocket();
  const { startTyping, stopTyping, onTyping } = useTypingIndicator(conversation?.id);

  useEffect(() => {
    if (conversation?.id) {
      loadMessages();
      joinConversation();
    }

    return () => {
      if (conversation?.id) {
        leaveConversation();
      }
    };
  }, [conversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const cleanup = onTyping((data: any) => {
      if (data.userId === conversation?.otherUser?.id) {
        setTyping(data.isTyping);
      }
    });
    return cleanup;
  }, [conversation, onTyping]);

  useMessageNotifications((data) => {
    if (data.conversationId === conversation?.id) {
      setMessages(prev => [...prev, data]);
      chatService.markAsRead(data.messageId);
    }
  });

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await chatService.getMessages(conversation.id);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const joinConversation = () => {
    if (socket) {
      socket.emit('chat:join', { conversationId: conversation.id });
    }
  };

  const leaveConversation = () => {
    if (socket) {
      socket.emit('chat:leave', { conversationId: conversation.id });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const message = await chatService.sendMessage({
        conversationId: conversation.id,
        receiverId: conversation.otherUser.id,
        content: newMessage.trim(),
        translate: translationEnabled
      });

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      stopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    if (value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleTemplateSelect = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col h-[700px]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
            {conversation.otherUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{conversation.otherUser?.name}</h3>
            <p className="text-xs text-slate-500">
              {typing ? 'typing...' : conversation.otherUser?.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TranslationToggle
            enabled={translationEnabled}
            onToggle={setTranslationEnabled}
          />
          
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Quick Templates"
          >
            <Zap size={20} className="text-slate-600" />
          </button>

          <button
            onClick={() => onVideoCall(conversation.id)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Video Call"
          >
            <Video size={20} className="text-slate-600" />
          </button>

          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Phone size={20} className="text-slate-600" />
          </button>

          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreVertical size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Quick Templates */}
      {showTemplates && (
        <QuickTemplates
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={conversation.currentUserId}
        loading={loading}
        messagesEndRef={messagesEndRef}
      />

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
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
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={translationEnabled ? "Type a message (will be translated)..." : "Type a message..."}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
