'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';

interface QuickTemplatesProps {
  onSelect: (template: string) => void;
  onClose: () => void;
}

export default function QuickTemplates({ onSelect, onClose }: QuickTemplatesProps) {
  const templates = [
    {
      category: 'Pricing',
      messages: [
        "What is your best price for this product?",
        "Can you offer a bulk discount?",
        "What are your payment terms?",
        "Is the price negotiable?"
      ]
    },
    {
      category: 'Availability',
      messages: [
        "What quantity do you have available?",
        "When can you deliver?",
        "Is this product in stock?",
        "What is the minimum order quantity?"
      ]
    },
    {
      category: 'Quality',
      messages: [
        "Can you provide quality certificates?",
        "What grade is this product?",
        "Do you have sample images?",
        "Can I inspect the product before buying?"
      ]
    },
    {
      category: 'Logistics',
      messages: [
        "Do you provide delivery?",
        "What are the shipping costs?",
        "How long does delivery take?",
        "Can you arrange transportation?"
      ]
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 max-h-[400px] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-amber-600" />
            <h3 className="font-bold text-slate-900">Quick Templates</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="space-y-4">
          {templates.map((category, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.messages.map((message, msgIdx) => (
                  <button
                    key={msgIdx}
                    onClick={() => onSelect(message)}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors text-sm text-slate-700 hover:text-blue-700"
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
