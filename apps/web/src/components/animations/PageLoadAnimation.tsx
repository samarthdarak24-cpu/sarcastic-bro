"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PageLoadAnimationProps {
  children: React.ReactNode;
  showLoadingBar?: boolean;
}

export function PageLoadAnimation({
  children,
  showLoadingBar = true,
}: PageLoadAnimationProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {/* Animated Loading Bar */}
      {showLoadingBar && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 z-[100]"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{
            scaleX: isLoaded ? 0 : 1,
            opacity: isLoaded ? 0 : 1,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={() => {
            if (isLoaded) {
              // Complete any animations
            }
          }}
        />
      )}

      {/* Page Container Exit Animation */}
      <motion.div
        initial={{ opacity: 0.95, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      {/* Smooth Scroll Indicator */}
      <motion.div
        className="fixed bottom-8 right-8 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className="text-xs text-gray-400 flex items-center gap-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-1 bg-emerald-500 rounded-full" />
          Scroll to explore
        </motion.div>
      </motion.div>
    </>
  );
}
