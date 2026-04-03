"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2 group">
        {label && (
          <label className="block text-sm font-semibold text-neut-700 ml-1 group-focus-within:text-brand-primary transition-colors">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full glass-card px-4 py-2 text-sm text-neut-900 placeholder:text-neut-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-error focus:ring-error/20" : "border-neut-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs font-medium text-error ml-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
