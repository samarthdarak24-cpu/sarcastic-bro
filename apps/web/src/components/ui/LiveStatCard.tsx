"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

interface LiveStatCardProps {
  title: string;
  value: string | number;
  prevValue?: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
  live?: boolean;
  suffix?: string;
  prefix?: string;
}

function useCountUp(target: number, duration = 800) {
  const [current, setCurrent] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    if (prevRef.current === target) return;
    const start = prevRef.current;
    const diff = target - start;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return current;
}

export function LiveStatCard({ title, value, prevValue, icon, color, loading, live, suffix = "", prefix = "" }: LiveStatCardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const animated = useCountUp(numericValue);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prevValue !== undefined && prevValue !== value) {
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    }
  }, [value]);

  const colorMap: Record<string, string> = {
    emerald: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-indigo-500",
    indigo: "from-indigo-500 to-purple-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500",
  };

  const bgMap: Record<string, string> = {
    emerald: "bg-emerald-50",
    blue: "bg-blue-50",
    indigo: "bg-indigo-50",
    amber: "bg-amber-50",
    rose: "bg-rose-50",
  };

  const iconColorMap: Record<string, string> = {
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
        <div className="h-4 w-24 bg-slate-100 rounded mb-4" />
        <div className="h-8 w-32 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      animate={flash ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={`group relative bg-white rounded-2xl p-6 border shadow-sm overflow-hidden transition-all hover:shadow-lg ${
        flash ? 'border-emerald-300 shadow-emerald-100' : 'border-slate-100'
      }`}
    >
      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-emerald-100 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between mb-4">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={`h-14 w-14 rounded-2xl ${bgMap[color] || 'bg-slate-50'} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}
        >
          <div className={iconColorMap[color] || 'text-slate-600'}>
            {icon}
          </div>
        </motion.div>
        {live && (
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
          </div>
        )}
      </div>

      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-900 tabular-nums">
        {prefix}{typeof value === 'string' && value.includes('₹') ? `₹${animated.toLocaleString()}` : animated.toLocaleString()}{suffix}
      </p>
    </motion.div>
  );
}
