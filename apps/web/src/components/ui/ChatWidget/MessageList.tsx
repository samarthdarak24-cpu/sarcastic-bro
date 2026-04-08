'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import MessageBubble from './MessageBubble';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  streamingMessage?: string;
}

export default function MessageList({ messages, isLoading, streamingMessage = '' }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, streamingMessage]);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto p-4 scroll-smooth bg-white"
      style={{ scrollbarWidth: 'thin' }}
    >
      {/* Welcome Message */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-black mb-2">
            Welcome to AI Assistant!
          </h3>
          <p className="text-sm text-black max-w-xs">
            I'm here to help you with farming advice, market prices, platform features, and more. Ask me anything!
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isLatest={index === messages.length - 1}
        />
      ))}

      {/* Streaming Message */}
      {streamingMessage && (
        <div className="flex gap-2 mb-4">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] shadow-sm">
            <div className="text-sm text-black whitespace-pre-wrap">
              {streamingMessage}
              <span className="inline-block w-1 h-4 ml-1 bg-blue-600 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Typing Indicator */}
      {isLoading && !streamingMessage && (
        <div className="flex gap-2 mb-4">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
            <Loader2 size={16} className="text-white animate-spin" />
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
