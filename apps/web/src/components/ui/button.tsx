"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = 
  | "primary" 
  | "secondary" 
  | "glass" 
  | "outline" 
  | "ghost" 
  | "danger" 
  | "gradient";

type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "variant"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-primary text-white shadow-startup-soft hover:bg-brand-primary/90",
  secondary: "bg-brand-secondary text-white shadow-startup-soft hover:bg-brand-secondary/90",
  glass: "glass-card text-neut-900 hover:bg-white/90",
  outline: "border-2 border-neut-200 bg-transparent text-neut-700 hover:border-neut-300 hover:bg-neut-50",
  ghost: "bg-transparent text-neut-600 hover:bg-neut-100",
  danger: "bg-error text-white hover:bg-error/90 shadow-startup-soft",
  gradient: "bg-startup-gradient text-white shadow-startup-medium hover:opacity-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs font-semibold",
  md: "h-12 px-6 text-sm font-semibold",
  lg: "h-14 px-8 text-base font-bold",
  icon: "h-11 w-11 p-0 flex items-center justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-startup-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
