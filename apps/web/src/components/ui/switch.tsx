"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, className, disabled }: SwitchProps) {
  return (
    <div
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20",
        checked ? "bg-brand-secondary" : "bg-neut-200",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        initial={{ x: checked ? 20 : 2 }}
        className="absolute top-1 left-0 h-4 w-4 rounded-full bg-white shadow-sm ring-0"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  );
}
