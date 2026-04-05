import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", hover = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`backdrop-blur-xl bg-white/[0.08] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] rounded-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}
