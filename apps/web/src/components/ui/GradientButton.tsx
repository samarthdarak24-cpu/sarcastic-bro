import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  icon?: ReactNode;
}

export function GradientButton({ 
  children, 
  onClick, 
  variant = "primary", 
  className = "",
  icon 
}: GradientButtonProps) {
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)]",
    secondary: "bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative px-8 py-4 rounded-xl font-bold text-[15px] 
        transition-all duration-300 ease-out
        flex items-center gap-2.5 justify-center
        ${variants[variant]}
        ${className}
      `}
    >
      {/* Pulse effect for primary */}
      {variant === "primary" && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon}
      </span>
    </motion.button>
  );
}
