/**
 * VoiceAssistantButton - Header button to activate AgriVoice AI
 */

import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { VoiceAssistantWidget } from './VoiceAssistantWidget';
import { useAuth } from '@/hooks/useAuth';

export const VoiceAssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const userRole = (user?.role || 'FARMER') as 'FARMER' | 'BUYER';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group"
        title="AgriVoice AI Assistant"
      >
        <Mic size={20} className="group-hover:animate-pulse" />
        
        {/* Pulsing indicator */}
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse border-2 border-white" />
        
        {/* Breathing glow effect */}
        <div className="absolute inset-0 rounded-xl bg-emerald-400 opacity-0 group-hover:opacity-30 animate-pulse-slow blur-md" />
      </button>

      <VoiceAssistantWidget
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userRole={userRole}
      />
    </>
  );
};

export default VoiceAssistantButton;
