'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProactiveNotificationProps {
  message: string;
  onDismiss: () => void;
  onAccept: () => void;
  autoHideDelay?: number;
}

export default function ProactiveNotification({
  message,
  onDismiss,
  onAccept,
  autoHideDelay = 10000,
}: ProactiveNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Wait for animation to complete
    }, autoHideDelay);

    return () => clearTimeout(timer);
  }, [autoHideDelay, onDismiss]);

  const handleAccept = () => {
    setIsVisible(false);
    setTimeout(onAccept, 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-32 right-6 z-[999]
            w-[320px] bg-white rounded-2xl shadow-2xl
            border border-blue-200 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-sm font-bold text-black">AI Assistant</span>
            </div>
            <button
              onClick={handleDismiss}
              className="h-7 w-7 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={16} className="text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-black leading-relaxed mb-4">
              {message}
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                  text-white rounded-lg text-sm font-medium
                  transition-colors duration-200 shadow-sm"
              >
                Ask AI
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 
                  text-black rounded-lg text-sm font-medium
                  transition-colors duration-200"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: autoHideDelay / 1000, ease: 'linear' }}
            className="h-1 bg-blue-600"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
