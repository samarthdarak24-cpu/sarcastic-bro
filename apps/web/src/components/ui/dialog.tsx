import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" 
        onClick={() => onOpenChange?.(false)} 
      />
      <div className="relative z-50 w-full max-w-lg scale-105 animate-in zoom-in-95 duration-200">
        {React.Children.map(children, (child: any) => 
          React.cloneElement(child, { onClose: () => onOpenChange?.(false) })
        )}
      </div>
    </div>
  );
};

export const DialogContent = ({ className, children, onClose }: any) => (
  <div className={cn("bg-white p-6 shadow-2xl rounded-3xl border border-[var(--border)]", className)}>
    <button 
      onClick={onClose}
      className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 opacity-60 hover:opacity-100 transition-all"
    >
      <X size={18} />
    </button>
    {children}
  </div>
);

export const DialogHeader = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-6", className)} {...props} />
);

export const DialogTitle = ({ className, ...props }: any) => (
  <h2 className={cn("text-2xl font-black text-gray-900 leading-none tracking-tight", className)} {...props} />
);

export const DialogDescription = ({ className, ...props }: any) => (
  <p className={cn("text-sm font-medium text-gray-500 mt-2", className)} {...props} />
);
