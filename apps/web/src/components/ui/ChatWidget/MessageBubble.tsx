'use client';

import { ChatMessage } from '@/types/chat';
import { Bot, User } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: ChatMessage;
  isLatest: boolean;
}

export default function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-md ${
        isUser 
          ? 'bg-blue-600' 
          : 'bg-blue-600'
      }`}>
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-blue-100 text-black rounded-tr-sm'
            : 'bg-gray-100 text-black rounded-tl-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-gray-600 mt-1 px-1">
          {format(new Date(message.timestamp), 'HH:mm')}
        </span>
      </div>
    </div>
  );
}
