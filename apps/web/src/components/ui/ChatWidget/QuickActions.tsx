'use client';

import { QuickAction } from '@/types/chat';
import { Sparkles, TrendingUp, HelpCircle, Package } from 'lucide-react';

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
  disabled: boolean;
}

const iconMap = {
  price: TrendingUp,
  quality: Package,
  market: TrendingUp,
  help: HelpCircle,
};

export default function QuickActions({ actions, onActionClick, disabled }: QuickActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon ? iconMap[action.category || 'help'] : Sparkles;
        
        return (
          <button
            key={action.id}
            onClick={() => onActionClick(action)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-1.5 
              bg-white 
              hover:bg-blue-50
              text-black
              rounded-lg text-xs
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              border border-blue-600
              shadow-sm hover:shadow"
          >
            {Icon && <Icon size={14} className="text-blue-600" />}
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
