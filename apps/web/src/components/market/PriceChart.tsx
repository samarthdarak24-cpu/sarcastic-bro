import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';
import { MarketPrice } from '../../hooks/useMarketPrices';

interface PriceChartProps {
  data: MarketPrice[];
  crop: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, crop }) => {
  const chartData = data.map(p => ({
    date: new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    modal: p.modalPrice,
    min: p.minPrice,
    max: p.maxPrice,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-xl p-4 rounded-2xl">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-8">
              <span className="text-sm text-gray-600">Max Price</span>
              <span className="text-sm font-bold text-rose-600">₹{payload[0].value}</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-sm text-gray-600">Modal Price</span>
              <span className="text-sm font-extrabold text-blue-700">₹{payload[1].value}</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-sm text-gray-600">Min Price</span>
              <span className="text-sm font-bold text-emerald-600">₹{payload[2].value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            dx={-10}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="max"
            stroke="transparent"
            fill="transparent"
          />
          <Area
            type="monotone"
            dataKey="modal"
            stroke="#1d4ed8"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorModal)"
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="min"
            stroke="transparent"
            fill="transparent"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
