"use client";

import React from "react";
import { motion } from "framer-motion";

interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniChart({ data, color = "var(--brand-primary)", height = 60 }: MiniChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const step = 100 / (data.length - 1);
  
  const points = data.map((val, i) => {
    const x = i * step;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="w-full relative group" style={{ height: `${height}px` }}>
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area Fill */}
        <motion.polyline
          points={areaPoints}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Path Line */}
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="drop-shadow-lg"
        />
        
        {/* Animated Point */}
        <motion.circle
          cx="100"
          cy={100 - ((data[data.length - 1] - min) / range) * 100}
          r="4"
          fill="white"
          stroke={color}
          strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        />
      </svg>
    </div>
  );
}
