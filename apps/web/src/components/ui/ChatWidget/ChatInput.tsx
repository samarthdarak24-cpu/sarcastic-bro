'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBrowserSpeechRecognition } from '@/hooks/useBrowserSpeechRecognition';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder: string;
  language?: 'en' | 'hi' | 'mr';
}

export default function ChatInput({ onSend, disabled, placeholder, language = 'en' }: ChatInputProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  // Use browser's built-in speech recognition (more reliable)
  const {
    isListening,
    transcript,
    isSupported: browserSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useBrowserSpeechRecognition({
    language,
    continuous: false,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal && text && text.trim()) {
        // Final result - auto-send
        onSend(text.trim());
        resetTranscript();
      }
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
    },
  });

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="space-y-2">
      {/* Browser Compatibility Warning */}
      {!browserSupported && (
        <div className="text-xs text-amber-600 px-2 py-1 bg-amber-50 rounded border border-amber-200">
          Voice input not available. Your browser doesn't support speech recognition. Please use text input or try Chrome/Edge.
        </div>
      )}
      
      {/* Voice Error Display */}
      {voiceError && (
        <div className="text-xs text-red-600 px-2">
          {voiceError}
        </div>
      )}
      
      {/* Live Transcription Display */}
      {isListening && transcript && (
        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-blue-800 font-medium mb-1">
                {t("ai_assistant.listening")}
              </p>
              <p className="text-sm text-blue-900 italic">
                "{transcript}"
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className="flex gap-2 items-end">
        {/* Voice Button - Only show if browser supports it */}
        {browserSupported && (
          <button
            onClick={handleVoiceToggle}
            disabled={disabled}
            className={`h-[42px] w-[42px] rounded-xl 
              flex items-center justify-center
              transition-all duration-200
              hover:scale-105 active:scale-95
              flex-shrink-0 shadow-sm
              ${isListening 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
              disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            <Mic size={18} className="text-white" />
          </button>
        )}

        {/* Text Input */}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? t("ai_assistant.listening") : placeholder}
          disabled={disabled || isListening}
          rows={1}
          className="flex-1 resize-none rounded-xl px-4 py-2.5 
            bg-white
            border-2 border-blue-600
            text-black
            placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            text-sm
            max-h-32 overflow-y-auto"
          style={{ 
            minHeight: '42px',
            scrollbarWidth: 'thin'
          }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim() || isListening}
          className="h-[42px] w-[42px] rounded-xl bg-blue-600 hover:bg-blue-700 
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center
            transition-all duration-200
            hover:scale-105 active:scale-95
            flex-shrink-0 shadow-sm"
          aria-label="Send message"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>

      {isListening && (
        <div className="flex items-center gap-2 px-2 text-xs text-red-600">
          <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          <span>{t("ai_assistant.listening")}</span>
        </div>
      )}
    </div>
  );
}
