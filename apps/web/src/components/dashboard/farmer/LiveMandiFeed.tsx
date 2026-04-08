'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveMandiFeed() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Seed Data based on user requirements
  const initialData = [
    { commodity: 'Wheat', market: 'Indore Mandi', price: 2454.919, change: 45, trend: 'up' },
    { commodity: 'Rice', market: 'Karnal Mandi', price: 3803.457, change: -20, trend: 'down' },
    { commodity: 'Tomato', market: 'Azadpur Mandi', price: 1204.02, change: 150, trend: 'up' },
    { commodity: 'Onion', market: 'Lasalgaon Mandi', price: 2103.101, change: 10, trend: 'up' }
  ];

  const fetchMandiData = async () => {
    setLoading(true);
    // Simulate real-time data connection establish.
    setTimeout(() => {
      setData(initialData);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchMandiData();
    
    // Core advanced Real-time ticker
    const tickInterval = setInterval(() => {
      setData(current => current.map(item => {
        // Create realistic random market micro-fluctuations
        const volatility = Math.random() * 2 - 1; // -1 to 1
        const newPrice = item.price + volatility;
        return {
          ...item,
          price: Number(newPrice.toFixed(3)),
          // Update visual trend based on micro-fluctuation direction randomly to simulate active trading
          trend: volatility > 0 ? 'up' : 'down'
        };
      }));
    }, 2800); // Pulse every 2.8s like a real trading terminal
    
    return () => clearInterval(tickInterval);
  }, []);

  return (
    <div className="bg-slate-950 rounded-[3rem] border border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-full relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <TrendingUp size={24} />
           </div>
           <div>
              <h3 className="font-black text-white uppercase tracking-tighter text-xl italic">Live Mandi Prices</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 Real-time Sync Active
              </p>
           </div>
        </div>
        <button 
          onClick={fetchMandiData}
          disabled={loading}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 border border-white/5"
        >
           <RefreshCw size={18} className={loading ? 'animate-spin text-emerald-400' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative z-10">
        <div className="space-y-3">
          <AnimatePresence>
            {data.map((item) => (
              <motion.div 
                key={`${item.commodity}-${item.market}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group flex items-center justify-between border border-white/5 hover:border-white/10 cursor-pointer"
              >
                 <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                       {item.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                       <p className="font-black text-white leading-tight text-lg">{item.commodity}</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mt-1">
                          <MapPin size={12} className="text-slate-600" /> {item.market}
                       </p>
                    </div>
                 </div>
                 
                 <div className="text-right">
                    <motion.p 
                       key={item.price}
                       initial={{ color: "#fff" }}
                       animate={{ color: item.trend === 'up' ? "#34d399" : "#fb7185" }}
                       transition={{ duration: 0.8 }}
                       className="font-black text-white text-xl"
                    >
                       ₹{item.price.toLocaleString()}
                    </motion.p>
                    <p className={`text-[10px] font-black tracking-widest uppercase mt-1 ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                       {item.change >= 0 ? '+' : ''}{item.change} <span className="opacity-50">TODAY</span>
                    </p>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="p-6 bg-black/60 border-t border-white/5 flex items-center justify-between relative z-10 backdrop-blur-md">
         <span className="text-xs font-black uppercase tracking-widest text-slate-500">Regional Average</span>
         <span className="font-black text-xl text-emerald-400">₹2,480<span className="text-sm text-emerald-500/50">.00 / qtl</span></span>
      </div>
    </div>
  );
}
