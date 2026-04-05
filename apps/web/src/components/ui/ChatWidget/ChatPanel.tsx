'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { ChatMessage, QuickAction } from '@/types/chat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  quickActions: QuickAction[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
  userRole: 'FARMER' | 'BUYER';
  showSlowConnectionWarning?: boolean;
  streamingMessage?: string;
  errorState?: {type: string; message: string} | null;
}

export default function ChatPanel({
  messages,
  isLoading,
  quickActions,
  onSendMessage,
  onClose,
  showSlowConnectionWarning = false,
  streamingMessage = '',
  errorState = null,
}: ChatPanelProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-28 md:bottom-32 right-4 md:right-6 z-[999]
          w-[calc(100vw-2rem)] md:w-[400px] 
          h-[calc(100vh-10rem)] md:h-[600px]
          bg-white dark:bg-slate-900 
          rounded-2xl shadow-2xl 
          flex flex-col overflow-hidden
          border border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">AI Assistant</h3>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80 text-xs">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close chat"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden relative">
          <MessageList messages={messages} isLoading={isLoading} streamingMessage={streamingMessage} />
          
          {/* Error State Banner */}
          {errorState && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute top-2 left-2 right-2 border rounded-lg p-3 shadow-sm ${
                errorState.type === 'API_KEY_MISSING' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                  : errorState.type === 'RATE_LIMIT'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
              }`}
            >
              <p className={`text-xs ${
                errorState.type === 'API_KEY_MISSING'
                  ? 'text-red-800 dark:text-red-200'
                  : errorState.type === 'RATE_LIMIT'
                  ? 'text-orange-800 dark:text-orange-200'
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}>
                {errorState.type === 'API_KEY_MISSING' && '🔑 '}
                {errorState.type === 'RATE_LIMIT' && '⏱️ '}
                {errorState.type === 'CONNECTION_ERROR' && '🌐 '}
                {errorState.message}
              </p>
            </motion.div>
          )}
          
          {/* Slow Connection Warning */}
          {showSlowConnectionWarning && !errorState && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-2 left-2 right-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 shadow-sm"
            >
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ Slow connection detected. Response may take longer than usual...
              </p>
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
            <QuickActions 
              actions={quickActions} 
              onActionClick={(action) => onSendMessage(action.query)}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <ChatInput
            onSend={onSendMessage}
            disabled={isLoading}
            placeholder="Ask me anything..."
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
