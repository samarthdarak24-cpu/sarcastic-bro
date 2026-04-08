'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, QuickAction } from '@/types/chat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import ChatHeader from './ChatHeader';
import { useTranslation } from 'react-i18next';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  quickActions: QuickAction[];
  onSendMessage: (text: string) => void;
  onActionClick?: (action: QuickAction) => void;
  onClose: () => void;
  userRole: 'FARMER' | 'BUYER';
  showSlowConnectionWarning?: boolean;
  streamingMessage?: string;
  errorState?: {type: string; message: string} | null;
  language?: 'en' | 'hi' | 'mr';
  onLanguageChange?: (lang: 'en' | 'hi' | 'mr') => void;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  isSpeaking?: boolean;
  ttsSupported?: boolean;
  onClearHistory?: () => void;
}

export default function ChatPanel({
  messages,
  isLoading,
  quickActions,
  onSendMessage,
  onActionClick,
  onClose,
  showSlowConnectionWarning = false,
  streamingMessage = '',
  errorState = null,
  language = 'en',
  onLanguageChange,
  voiceEnabled = true,
  onToggleVoice,
  isSpeaking = false,
  ttsSupported = false,
  onClearHistory,
}: ChatPanelProps) {
  const { t } = useTranslation();

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
          bg-white
          rounded-2xl shadow-2xl 
          flex flex-col overflow-hidden
          border border-blue-200"
      >
        {/* Header */}
        <ChatHeader
          onClose={onClose}
          language={language}
          onLanguageChange={onLanguageChange}
          voiceEnabled={voiceEnabled}
          onToggleVoice={onToggleVoice}
          isSpeaking={isSpeaking}
          ttsSupported={ttsSupported}
          onClearHistory={onClearHistory}
        />

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
                ⚠️ {t("ai_assistant.slow_conn")}
              </p>
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <div className="px-4 py-3 border-t border-blue-100 bg-white">
            <QuickActions 
              actions={quickActions} 
              onActionClick={onActionClick || ((action) => onSendMessage(action.query))}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-blue-200 bg-white">
          <ChatInput
            onSend={onSendMessage}
            disabled={isLoading}
            placeholder={t("ai_assistant.placeholder")}
            language={language}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
