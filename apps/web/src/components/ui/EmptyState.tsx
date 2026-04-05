"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Leaf,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex-col flex items-center justify-center p-12 text-center rounded-[2.5rem] border border-dashed border-neut-200 bg-white/50 backdrop-blur-xl min-h-[400px]"
    >
      <div className="h-20 w-20 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mb-6">
        <Icon size={40} className="stroke-[1.5]" />
      </div>
      <h3 className="text-2xl font-black text-neut-900 tracking-tight mb-2">{title}</h3>
      <p className="text-lg text-neut-500 font-medium max-w-md mb-8">{description}</p>
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          variant="gradient"
          className="h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-brand-primary/20"
        >
          <Plus size={18} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
