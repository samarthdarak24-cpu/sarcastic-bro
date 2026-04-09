"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { useRealtimeStore } from "@/store/realtimeStore";

const INITIAL_CROPS = [
  { id: "tomato", name: "Tomato", price: 28 },
  { id: "wheat", name: "Wheat", price: 42 },
  { id: "rice", name: "Rice", price: 88 },
  { id: "onion", name: "Onion", price: 35 },
  { id: "potato", name: "Potato", price: 22 },
  { id: "chilli", name: "Chilli", price: 140 },
  { id: "turmeric", name: "Turmeric", price: 120 },
  { id: "ginger", name: "Ginger", price: 95 },
];

function TickerItem({ crop }: { crop: typeof INITIAL_CROPS[0] }) {
  const { livePrices, priceFlashIds } = useRealtimeStore();
    const live = livePrices[crop.id];
  const price = live?.price ?? crop.price;
  const direction = live?.direction ?? 'stable';
  const changePercent = live?.changePercent ?? 0;
  const isFlashing = priceFlashIds.has(crop.id);

  return (
    <motion.div
      animate={isFlashing ? {
        backgroundColor: direction === 'up' ? ['#f0fdf4', '#dcfce7', '#f0fdf4'] : ['#fef2f2', '#fee2e2', '#fef2f2']
      } : {}}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-2 px-4 py-1.5 rounded-lg shrink-0"
    >
      <span className="text-[11px] font-black text-gray-900 uppercase tracking-wide">{crop.name}</span>
      <span className={`text-[12px] font-black tabular-nums ${
        direction === 'up' ? 'text-emerald-700' :
        direction === 'down' ? 'text-red-600' : 'text-gray-900'
      }`}>
        ₹{price.toFixed(1)}
      </span>
      <span className={`flex items-center gap-0.5 text-[10px] font-bold ${
        direction === 'up' ? 'text-emerald-600' :
        direction === 'down' ? 'text-red-500' : 'text-gray-600'
      }`}>
        {direction === 'up' ? <TrendingUp size={10} /> :
         direction === 'down' ? <TrendingDown size={10} /> :
         <Minus size={10} />}
        {Math.abs(changePercent).toFixed(1)}%
      </span>
      <div className="w-px h-3 bg-gray-300 ml-1" />
    </motion.div>
  );
}

export function LivePriceTicker() {
  const { isConnected, livePrices } = useRealtimeStore();
  const trackRef = useRef<HTMLDivElement>(null);

  // Merge initial crops with live prices
  const displayCrops = INITIAL_CROPS.map(crop => ({
    ...crop,
    ...livePrices[crop.id]
  }));

  return (
    <div className="w-full bg-white border-b-2 border-gray-300 shadow-lg sticky top-0 left-0 right-0 z-[100]">
      <div className="flex items-center h-[42px]">
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white shrink-0 h-full">
          <Activity size={14} className="animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest">LIVE MANDI</span>
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-300 animate-pulse' : 'bg-red-400'}`} />
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden relative bg-white h-full">
          <div className="flex animate-ticker h-full items-center">
            {[...displayCrops, ...displayCrops].map((crop, i) => (
              <TickerItem key={`${crop.id}-${i}`} crop={crop} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
