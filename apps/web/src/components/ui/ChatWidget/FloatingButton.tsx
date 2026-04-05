'use client';

import { motion } from 'framer-motion';

interface FloatingButtonProps {
  onClick: () => void;
  unreadCount: number;
  isExpanded: boolean;
  position: 'bottom-right' | 'bottom-left';
}

export default function FloatingButton({
  onClick,
  unreadCount,
  isExpanded,
  position,
}: FloatingButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[1000] 
        h-16 w-16 md:h-20 md:w-20 
        rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 
        text-white shadow-2xl hover:shadow-blue-500/50
        transition-all duration-300 
        flex items-center justify-center
        hover:scale-110 active:scale-95
        group relative overflow-hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotate: isExpanded ? 180 : 0,
      }}
      transition={{ duration: 0.3 }}
      aria-label={isExpanded ? 'Close chat' : 'Open chat'}
      aria-expanded={isExpanded}
      style={{ position: 'fixed', bottom: '24px', right: '24px' }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      
      {/* Pulse animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-400 opacity-75"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Modern Chat Icon - Custom SVG */}
      <svg
        className="relative z-10 transition-transform group-hover:scale-110"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chat bubble */}
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.99 3.06 16.27L2 22L7.73 20.94C9.01 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* AI sparkle dots */}
        <circle cx="8" cy="11" r="1.5" fill="url(#gradient1)" />
        <circle cx="12" cy="11" r="1.5" fill="url(#gradient1)" />
        <circle cx="16" cy="11" r="1.5" fill="url(#gradient1)" />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      {/* AI Sparkle effect */}
      <motion.div
        className="absolute top-2 right-2 h-2 w-2 rounded-full bg-yellow-300"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Unread badge */}
      {unreadCount > 0 && !isExpanded && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600
            flex items-center justify-center text-xs font-bold text-white
            border-2 border-white shadow-lg"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.div>
      )}
    </motion.button>
  );
}
