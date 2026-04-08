'use client';

import { X, Sparkles, Languages, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  onClose: () => void;
  language?: 'en' | 'hi' | 'mr';
  onLanguageChange?: (lang: 'en' | 'hi' | 'mr') => void;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  isSpeaking?: boolean;
  ttsSupported?: boolean;
  onClearHistory?: () => void;
}

export default function ChatHeader({
  onClose,
  language = 'en',
  onLanguageChange,
  voiceEnabled = true,
  onToggleVoice,
  isSpeaking = false,
  ttsSupported = false,
  onClearHistory,
}: ChatHeaderProps) {
  const { t } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const languageLabels = {
    en: 'English',
    hi: 'हिंदी',
    mr: 'मराठी',
  };

  const handleLanguageSelect = (lang: 'en' | 'hi' | 'mr') => {
    onLanguageChange?.(lang);
    setShowLanguageMenu(false);
  };

  const handleClearHistory = () => {
    onClearHistory?.();
    setShowClearConfirm(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-black font-bold text-base">{t("ai_assistant.title")}</h3>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500 shadow-sm" />
            <span className="text-gray-600 text-xs font-medium">{t("ai_assistant.online")}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Voice Toggle - Only show if TTS is supported */}
        {ttsSupported && (
          <button
            onClick={onToggleVoice}
            className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
              voiceEnabled 
                ? 'bg-blue-100 hover:bg-blue-200' 
                : 'hover:bg-gray-100'
            } ${isSpeaking ? 'animate-pulse' : ''}`}
            aria-label={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
            title={voiceEnabled ? 'Voice ON - AI will speak' : 'Voice OFF - Text only'}
          >
            {voiceEnabled ? (
              <Volume2 size={18} className={isSpeaking ? 'text-blue-600' : 'text-blue-600'} />
            ) : (
              <VolumeX size={18} className="text-gray-500" />
            )}
          </button>
        )}
        
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Select language"
            title={`Voice language: ${languageLabels[language]}`}
          >
            <Languages size={18} className="text-gray-700" />
          </button>
          
          {showLanguageMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-blue-200 py-1 z-10 min-w-[120px]"
            >
              {(['en', 'hi', 'mr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                    language === lang ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-black'
                  }`}
                >
                  {languageLabels[lang]}
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Clear History Button */}
        <div className="relative">
          <button
            onClick={() => setShowClearConfirm(!showClearConfirm)}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Clear chat history"
            title="Clear chat history"
          >
            <Trash2 size={18} className="text-gray-700" />
          </button>
          
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-red-200 p-3 z-10 min-w-[200px]"
            >
              <p className="text-sm text-black mb-3">Clear all chat history?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleClearHistory}
                  className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-black rounded text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          aria-label="Close chat"
        >
          <X size={20} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
