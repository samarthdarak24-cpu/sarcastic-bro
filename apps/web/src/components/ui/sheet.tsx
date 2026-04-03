import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export const Sheet = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange?.(false)} 
      />
      {React.Children.map(children, (child: any) => 
        React.cloneElement(child, { onClose: () => onOpenChange?.(false) })
      )}
    </div>
  );
};

export const SheetContent = ({ side = "left", className, children, onClose }: any) => {
  const sideClasses: any = {
    left: "left-0 h-full border-r animate-in slide-in-from-left",
    right: "right-0 h-full border-l animate-in slide-in-from-right",
    top: "top-0 w-full border-b animate-in slide-in-from-top",
    bottom: "bottom-0 w-full border-t animate-in slide-in-from-bottom",
  };

  return (
    <div className={cn("fixed z-50 bg-white p-6 shadow-xl w-64", sideClasses[side], className)}>
      <button 
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 opacity-60"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  );
};

export const SheetTrigger = ({ asChild, children, ...props }: any) => {
  if (asChild) {
    return React.cloneElement(children, props);
  }
  return <button {...props}>{children}</button>;
};
