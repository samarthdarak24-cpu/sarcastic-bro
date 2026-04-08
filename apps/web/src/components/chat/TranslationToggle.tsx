'use client';

import { Globe } from 'lucide-react';

interface TranslationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function TranslationToggle({ enabled, onToggle }: TranslationToggleProps) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={`p-2 rounded-lg transition-all ${
        enabled
          ? 'bg-blue-100 text-blue-600'
          : 'hover:bg-slate-100 text-slate-600'
      }`}
      title={enabled ? 'Translation enabled' : 'Enable translation'}
    >
      <Globe size={20} />
    </button>
  );
}
