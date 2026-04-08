'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCheck, Clock } from 'lucide-react';

interface ConversationListProps {
  conversations: any[];
  selectedConversation: any;
  onSelect: (conversation: any) => void;
  loading: boolean;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelect,
  loading
}: ConversationListProps) {
  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-xl">
              <div className="h-12 w-12 bg-slate-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <MessageSquare size={48} className="text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No conversations yet</p>
        <p className="text-sm text-slate-400 mt-2">Start chatting with buyers or farmers</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
      {conversations.map((conversation) => (
        <motion.button
          key={conversation.id}
          onClick={() => onSelect(conversation)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${
            selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {conversation.otherUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {conversation.otherUser?.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 truncate">
                  {conversation.otherUser?.name || 'Unknown User'}
                </h3>
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
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
