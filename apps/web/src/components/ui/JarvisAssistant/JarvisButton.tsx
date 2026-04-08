/**
 * Floating JARVIS Activation Button
 * Always visible, pulsing when active
 */

import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { JarvisWidget } from './JarvisWidget';

interface JarvisButtonProps {
  userRole: 'FARMER' | 'BUYER';
}

export const JarvisButton: React.FC<JarvisButtonProps> = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        title="Activate JARVIS"
      >
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
        
        {/* Icon */}
        <Zap size={28} className="relative z-10 group-hover:rotate-12 transition-transform" />
        
        {/* Label */}
        <div className="absolute -top-12 right-0 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <span className="text-white text-sm font-bold">JARVIS AI</span>
        </div>
      </button>

      {/* Widget */}
      <JarvisWidget
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userRole={userRole}
      />
    </>
  );
};

export default JarvisButton;
