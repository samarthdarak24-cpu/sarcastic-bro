import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, MapPin, TrendingUp, TrendingDown, Info, Calendar, Package } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface MarketPriceData {
  id: string;
  cropName: string;
  variety: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number;
  date: string;
}

export default function MarketPrices() {
  const [prices, setPrices] = useState<MarketPriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterCrop, setFilterCrop] = useState('');
  
  // Mock trend data (would come from /api/market-prices/trends in production)
  const [trendData] = useState([
    { date: '01 Apr', price: 18.5, volume: 1200 },
    { date: '02 Apr', price: 19.2, volume: 1500 },
    { date: '03 Apr', price: 18.8, volume: 1100 },
    { date: '04 Apr', price: 20.5, volume: 1800 },
    { date: '05 Apr', price: 22.1, volume: 2200 },
    { date: '06 Apr', price: 21.4, volume: 1900 },
    { date: '07 Apr', price: 23.5, volume: 2500 },
  ]);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/market-prices`);
      const data = await res.json();
      setPrices(Array.isArray(data) ? data : (data?.history || []));
    } catch (err) {
      console.error("Failed to load market prices", err);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = Array.isArray(prices) 
    ? prices.filter(p => 
        (filterDistrict === '' || p.district?.toLowerCase().includes(filterDistrict.toLowerCase())) &&
        (filterCrop === '' || p.cropName?.toLowerCase().includes(filterCrop.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Market Price Analytics</h2>
          <p className="text-slate-500 mt-1 font-medium">Real-time mandi price transparency across Maharashtra.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Filter by District..." 
               value={filterDistrict}
               onChange={(e) => setFilterDistrict(e.target.value)}
               className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm font-medium w-48"
             />
           </div>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Filter by Crop..." 
               value={filterCrop}
               onChange={(e) => setFilterCrop(e.target.value)}
               className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm font-medium w-48"
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Trend Chart */}
        <div className="col-span-8 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
               <TrendingUp className="text-green-600" /> 7-Day Price Trend (Onion)
             </h3>
             <div className="flex bg-slate-100 p-1 rounded-lg">
               <button className="px-3 py-1 text-xs font-bold rounded-md bg-white text-slate-900 shadow-sm">1W</button>
               <button className="px-3 py-1 text-xs font-bold rounded-md text-slate-500">1M</button>
               <button className="px-3 py-1 text-xs font-bold rounded-md text-slate-500">1Y</button>
             </div>
           </div>
           
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={trendData}>
                 <defs>
                   <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `₹${value}`} />
                 <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 />
                 <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* AI Insight Card */}
        <div className="col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-green-400">AI Price Recommendation</span>
                </div>
                <h4 className="text-2xl font-black mb-2">Sell Now: Pune Mandi</h4>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Prices in Pune have hit a 3-month peak of ₹2,350/quintal. We predict a 5% drop next week as supply from Nashik increases.
                </p>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Info size={16} className="text-green-400" />
                    <span className="text-xs font-bold">Projected Gain</span>
                  </div>
                  <span className="text-lg font-black text-green-400">+12.5%</span>
                </div>
             </div>
             {/* Decorative Elements */}
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
             <h4 className="text-sm font-black text-slate-500 uppercase mb-4">Top Performing Mandis</h4>
             <div className="space-y-3">
               {[
                 { district: 'Pune', price: 2350, trend: 'up' },
                 { district: 'Nashik', price: 2100, trend: 'up' },
                 { district: 'Latur', price: 1950, trend: 'down' },
               ].map((mandi, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-slate-400" />
                       <span className="text-sm font-bold text-slate-800">{mandi.district}</span>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black">₹{mandi.price}</p>
                       {mandi.trend === 'up' ? (
                         <span className="text-[10px] text-green-600 font-bold flex items-center justify-end gap-0.5"><TrendingUp size={10} /> +2.4%</span>
                       ) : (
                         <span className="text-[10px] text-red-600 font-bold flex items-center justify-end gap-0.5"><TrendingDown size={10} /> -1.2%</span>
                       )}
                    </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Price Table */}
        <div className="col-span-12 bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Live Price Feed</h3>
            <button className="text-green-600 text-sm font-black hover:underline">Download CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Crop Name</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Variety</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">District</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase">Min ₹</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase">Max ₹</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase">Modal ₹</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-slate-500 font-medium">No price data found for these filters.</td>
                  </tr>
                ) : (
                  filteredPrices.slice(0, 15).map((price) => (
                    <tr key={price.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                             <Package size={16} />
                           </div>
                           <p className="font-bold text-slate-900">{price.cropName}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{price.variety}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <MapPin size={14} />
                          {price.district}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{price.minPrice}</td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600">₹{price.maxPrice}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-blue-700">₹{price.modalPrice}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Calendar size={14} />
                          {new Date(price.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
