'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder: string;
}

export default function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('');

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

  return (
    <div className="flex gap-2 items-end">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-xl px-4 py-2.5 
          bg-white dark:bg-slate-900 
          border border-slate-300 dark:border-slate-600
          text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          text-sm
          max-h-32 overflow-y-auto"
        style={{ 
          minHeight: '42px',
          scrollbarWidth: 'thin'
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="h-[42px] w-[42px] rounded-xl bg-blue-600 hover:bg-blue-700 
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center
          transition-all duration-200
          hover:scale-105 active:scale-95
          flex-shrink-0"
        aria-label="Send message"
      >
        <Send size={18} className="text-white" />
      </button>
    </div>
  );
}
