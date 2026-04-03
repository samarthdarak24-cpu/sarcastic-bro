"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Package,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  MoreVertical,
  ChevronRight,
  MessageSquare,
  Zap,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MiniChart } from "@/components/dashboard/MiniChart";

const suppliers = [
  { 
    id: "S1", 
    name: "Ramesh Kumar", 
    location: "Kurnool, AP", 
    rating: 4.8, 
    reviews: 142, 
    orders: 450, 
    experience: "12 yrs", 
    bio: "Multi-award winning Basmati and Wheat producer specializing in organic cultivation.", 
    verified: true, 
    avatar: "RK", 
    trustScore: 94,
    productionHistory: [45, 52, 48, 61, 58, 65, 72]
  },
  { 
    id: "S2", 
    name: "Sunita Devi", 
    location: "Guntur, AP", 
    rating: 4.9, 
    reviews: 89, 
    orders: 210, 
    experience: "8 yrs", 
    bio: "Leading producer of high-grade Guntur Chillies and Turmeric. ITC certified exporter.", 
    verified: true, 
    avatar: "SD", 
    trustScore: 98,
    productionHistory: [35, 42, 40, 48, 55, 60, 68]
  },
];

export function SupplierInsights() {
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]);

  return (
    <div className="space-y-12 animate-fade-in text-neut-900 border-neut-200">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Supplier List (Sidebar) */}
        <aside className="w-full lg:w-96 space-y-6">
           <div className="flex flex-col px-4 border-l-4 border-brand-secondary">
              <h2 className="text-2xl font-black tracking-tight">Verified Suppliers</h2>
              <p className="text-[10px] font-black uppercase text-neut-400 tracking-widest leading-loose">ODOP REGISTERED LISTINGS</p>
           </div>
           
           <div className="space-y-4">
              {suppliers.map((s) => (
                 <motion.div
                    key={s.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedSupplier(s)}
                    className={`p-6 rounded-[2rem] cursor-pointer transition-all border ${
                        selectedSupplier.id === s.id 
                        ? "bg-white border-brand-secondary shadow-startup-soft ring-4 ring-brand-secondary/5" 
                        : "bg-transparent border-transparent hover:bg-white hover:border-neut-100"
                    }`}
                 >
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-16 bg-brand-secondary/5 rounded-2xl flex items-center justify-center text-brand-secondary font-black text-xl">
                          {s.avatar}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-black text-neut-900 tracking-tight">{s.name}</h4>
                          <div className="flex items-center gap-1.5 text-neut-400 font-bold text-[10px]">
                             <MapPin size={10} className="text-brand-secondary" />
                             {s.location}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                             <div className="flex items-center gap-1 text-warning font-black text-[10px]">
                                <Star size={10} fill="currentColor" />
                                {s.rating}
                             </div>
                             <span className="h-1 w-1 rounded-full bg-neut-100" />
                             <span className="text-[10px] font-black text-neut-400">{s.reviews} reviews</span>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>
        </aside>

        {/* Supplier Profile Area */}
        <main className="flex-1 space-y-8 animate-in delay-100 duration-500 fade-in">
           <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl overflow-hidden rounded-[3rem]">
              <div className="h-40 bg-neut-900 relative">
                 <div className="absolute inset-0 opacity-20 bg-grid pointer-events-none" />
                 <div className="absolute -bottom-16 left-12 h-32 w-32 rounded-[2.5rem] bg-white shadow-startup-soft border-8 border-white flex items-center justify-center text-brand-secondary text-4xl font-black">
                    {selectedSupplier.avatar}
                 </div>
              </div>
              
              <CardContent className="pt-24 px-12 pb-12">
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-8 border-b border-neut-50">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <h2 className="text-5xl font-black tracking-tighter text-neut-900">{selectedSupplier.name}</h2>
                          {selectedSupplier.verified && (
                             <Badge tone="brand" className="h-8 px-4 rounded-xl flex items-center justify-center font-black gap-2 shadow-sm">
                                <ShieldCheck size={14} />
                                VERIFIED
                             </Badge>
                          )}
                       </div>
                       <p className="text-lg font-medium text-neut-500 max-w-xl">{selectedSupplier.bio}</p>
                    </div>
                     <div className="flex flex-col items-center justify-center p-8 bg-brand-secondary/5 rounded-[2rem] border border-brand-secondary/20">
                        <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mb-1">AI Trust Score</span>
                        <h2 className="text-4xl font-black text-neut-900">{selectedSupplier.trustScore}%</h2>
                        <div className="h-1.5 w-32 bg-neut-100 rounded-full mt-2 overflow-hidden">
                           <div className="h-full bg-success transition-all duration-1000" style={{ width: `${selectedSupplier.trustScore}%` }} />
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <Button variant="outline" className="h-14 px-8 rounded-2xl font-black border-neut-200">
                           <MessageSquare size={20} className="mr-2" />
                           Direct Chat
                        </Button>
                        <Button variant="gradient" className="h-14 px-10 rounded-2xl font-black shadow-lg shadow-brand-secondary/20 hover:scale-105 transition-transform">
                           Procure Now
                        </Button>
                     </div>
                 </div>

                 {/* KPI Stats Grid */}
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <DetailStat label="Market Exp" value={selectedSupplier.experience} icon={<Clock size={16} />} />
                    <DetailStat label="Trade Volume" value={selectedSupplier.orders} icon={<Layers size={16} />} />
                    <DetailStat label="Success Rate" value="99.2%" icon={<CheckCircle2 size={16} />} />
                    <DetailStat label="Certifications" value="12" icon={<Award size={16} />} />
                 </div>
              </CardContent>
           </Card>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Yield Prediction / Chart */}
              <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] min-h-[400px]">
                 <CardHeader className="p-0 border-b border-neut-50 pb-8 mb-8">
                    <h3 className="text-2xl font-black tracking-tight mb-1">Production Stability</h3>
                    <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest">REAL-TIME YIELD ANALYSIS (KG/ACRE)</p>
                 </CardHeader>
                  <CardContent className="p-0 h-48 mt-12 bg-neut-50/30 rounded-3xl relative flex flex-col justify-end overflow-hidden border border-neut-50">
                      <MiniChart data={selectedSupplier.productionHistory} height={150} color="#0a84ff" />
                      <div className="absolute top-6 right-6 flex items-center gap-2 text-success font-black text-sm">
                         <TrendingUp size={16} />
                         +14% VS REGIONAL AVG
                      </div>
                  </CardContent>
              </Card>

              {/* Reviews Area */}
              <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] flex flex-col min-h-[400px]">
                  <CardHeader className="p-0 border-b border-neut-50 pb-8 mb-8 flex flex-row items-center justify-between">
                     <div>
                        <h3 className="text-2xl font-black tracking-tight mb-1">Market Feedback</h3>
                        <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest">VERIFIED BUYER REVIEWS</p>
                     </div>
                     <Badge tone="ink" className="rounded-lg h-8 font-black">4.9 AVERAGE</Badge>
                  </CardHeader>
                  <CardContent className="p-0 space-y-6 flex-1 overflow-y-auto max-h-[300px] scrollbar-hide">
                     {[
                        { u: "Reliance Retail", r: 5, c: "Consistently delivering high-grade Basmati. Packaging is superior.", t: "2d ago" },
                        { u: "ITC Food Div", r: 5, c: "Direct farm-to-hub logistics handled flawlessly. Certified organic.", t: "1w ago" }
                     ].map((rev, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-neut-50/50 border border-neut-100 hover:border-brand-secondary/30 transition-all">
                           <div className="flex justify-between items-start mb-3">
                              <h5 className="font-extrabold text-sm text-neut-900">{rev.u}</h5>
                              <div className="flex items-center gap-0.5 text-warning">
                                 {Array(rev.r).fill(0).map((_, ri) => <Star key={ri} size={10} fill="currentColor" />)}
                              </div>
                           </div>
                           <p className="text-sm font-medium text-neut-500 mb-2 leading-relaxed italic">"{rev.c}"</p>
                           <p className="text-[9px] font-black uppercase text-neut-300 tracking-widest">{rev.t}</p>
                        </div>
                     ))}
                  </CardContent>
              </Card>
           </div>
        </main>
      </div>
    </div>
  );
}

function DetailStat({ label, value, icon }: any) {
   return (
      <div className="flex flex-col p-6 rounded-3xl bg-neut-50 border border-neut-100 hover:shadow-startup-soft transition-all">
         <div className="text-neut-400 mb-4">{icon}</div>
         <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-2xl font-black text-neut-900 tracking-tight">{value}</h4>
      </div>
   );
}
