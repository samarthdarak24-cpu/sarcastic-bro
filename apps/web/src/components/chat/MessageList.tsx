'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';

interface MessageListProps {
  messages: any[];
  currentUserId: string;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function MessageList({
  messages,
  currentUserId,
  loading,
  messagesEndRef
}: MessageListProps) {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isOwn = message.senderId === currentUserId;
          
          return (
            <motion.div
              key={message.id || index}
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
                  <p className="text-sm break-words">{message.content}</p>
                  
                  {message.translatedContent && (
                    <p className="text-xs mt-2 pt-2 border-t border-white/20 opacity-80">
                      🌐 {message.translatedContent}
                    </p>
                  )}
                  
                  {message.sentiment && (
                    <span className="text-xs opacity-70 ml-2">
                      {message.sentiment === 'positive' && '😊'}
                      {message.sentiment === 'neutral' && '😐'}
                      {message.sentiment === 'negative' && '😠'}
                    </span>
                  )}
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
  );
}
