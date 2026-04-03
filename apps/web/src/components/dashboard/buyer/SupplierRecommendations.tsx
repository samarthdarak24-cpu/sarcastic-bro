"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Star, MapPin, TrendingUp, ShieldCheck, ArrowRight, Zap, Target, Sparkles, MessageSquare, Plus, Building2, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const recommendations = [
  { id: 1, name: "Brijesh Mishra", type: "Farmer", location: "Varanasi, UP", rating: 4.9, match: 98, capacity: "High", focus: "Organic Basmati" },
  { id: 2, name: "Sajad Ahmed", type: "Farmer", location: "Budgam, JK", rating: 4.7, match: 94, capacity: "Medium", focus: "Kashmiri Walnuts" },
  { id: 3, name: "Anita Devi", type: "Farmer", location: "Nashik, MH", rating: 4.8, match: 91, capacity: "High", focus: "Onions & Grapes" },
];

export function SupplierRecommendations() {
  return (
    <div className="space-y-10 animate-fade-in w-full pb-20 text-neut-900">
      {/* Header & Quick Filters */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-8 bg-white p-6 rounded-[2.5rem] shadow-startup-soft border border-neut-50">
        <div className="flex-1">
          <h2 className="startup-headline text-3xl font-black flex items-center gap-3">
            Supplier Leads
            <Sparkles className="text-brand-secondary" size={28} />
          </h2>
          <p className="text-neut-500 font-medium">AI-powered supplier matching based on your procurement needs</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {["Organic", "Institutional", "Export Ready", "Quick Trade"].map(label => (
            <button key={label} className="px-5 py-2.5 rounded-xl border border-neut-100 text-xs font-black uppercase tracking-widest hover:border-brand-secondary hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all">
              {label}
            </button>
          ))}
          <div className="h-8 w-px bg-neut-100 mx-2 hidden xl:block" />
          <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-neut-200 shadow-sm">Refine Matching AI</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main List Area - Now 3 Columns Wide */}
        <div className="lg:col-span-3 space-y-6">
           <div className="flex justify-between items-center px-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-brand-secondary animate-pulse" />
                <h4 className="text-xs font-black text-neut-400 uppercase tracking-widest leading-loose">TOP MATCHES FOR YOUR BUYING PROFILE</h4>
              </div>
              <Badge tone="brand" className="border-neut-100 text-[10px] font-black uppercase bg-brand-secondary/10 text-brand-secondary px-3 py-1">3 Potential Hooks Found</Badge>
           </div>
           
           <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
             {recommendations.map((rec, i) => (
               <motion.div
                 key={rec.id}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
               >
                 <Card className="border border-neut-50 shadow-startup-soft hover:shadow-startup-medium hover:border-brand-secondary/20 transition-all group bg-white relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${i === 0 ? 'bg-brand-secondary' : 'bg-neut-200'}`} />
                    <div className="p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative z-10">
                       <div className="flex items-center gap-10 flex-1">
                          <div className="h-24 w-24 bg-neut-50 rounded-[2.5rem] flex items-center justify-center text-neut-400 group-hover:bg-brand-secondary group-hover:text-white transition-all shadow-startup-soft shrink-0">
                             <Building2 size={40} />
                          </div>
                          <div className="space-y-3">
                             <div className="flex items-center gap-4">
                               <h3 className="text-3xl font-black text-neut-900 leading-none">{rec.name}</h3>
                               <Badge tone="brand" className="border-none font-black text-[10px] px-3 py-1 uppercase tracking-widest bg-brand-secondary/5 text-brand-secondary rounded-lg">{rec.type}</Badge>
                             </div>
                             <div className="flex items-center gap-6 text-sm font-bold text-neut-500">
                                <span className="flex items-center gap-2"><MapPin size={16} className="text-neut-300" /> {rec.location}</span>
                                <span className="flex items-center gap-2 font-black text-brand-secondary uppercase tracking-widest"><Star size={16} fill="var(--brand-secondary)" className="text-brand-secondary" /> {rec.rating} RATING</span>
                                <span className="h-4 w-px bg-neut-100" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-success bg-white border border-success/10 px-2 py-0.5 rounded-lg">{rec.capacity} CAPACITY</span>
                             </div>
                             <p className="text-xs font-medium text-neut-400">Specialization: <span className="text-neut-700">{rec.focus}</span></p>
                          </div>
                       </div>

                       <div className="flex items-center gap-10 justify-between xl:justify-end xl:pl-10 xl:border-l border-neut-50">
                          <div className="text-center">
                             <span className="text-[10px] font-black uppercase tracking-widest text-neut-300">MATCH SCORE</span>
                             <div className="text-4xl font-black text-neut-900 leading-none mt-2 gradient-text">{rec.match}%</div>
                          </div>
                          <div className="flex gap-4">
                             <Button variant="outline" className="h-16 px-8 rounded-2xl border-neut-200 hover:border-brand-secondary hover:text-brand-secondary transition-all font-black text-xs uppercase tracking-widest gap-3">
                               <MessageSquare size={18} />
                               Consult AI
                             </Button>
                             <Button className="h-16 w-16 rounded-2xl bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20 hover:scale-105 transition-all"><Plus size={28} /></Button>
                          </div>
                       </div>
                    </div>
                 </Card>
               </motion.div>
             ))}
           </div>
        </div>

        {/* Sidebar Stats Area - 1 Column Wide */}
        <div className="space-y-6">
           <Card className="border-none shadow-startup-soft bg-neut-950 text-white p-8 overflow-hidden relative min-h-[300px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Target size={180} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-secondary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Real-time Cluster Insight</span>
                </div>
                <h4 className="text-2xl font-black mb-1">Cluster Pulse</h4>
                <div className="h-1 w-12 bg-brand-secondary rounded-full mb-6" />
                <p className="text-sm text-neut-400 font-medium leading-relaxed italic">"Supply nodes for Organic Produce in the Varanasi Region are reaching peak quality. Recommended buy action."</p>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-6">
                 <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-secondary shadow-inner">
                    <TrendingUp size={28} />
                 </div>
                 <div>
                    <div className="text-xs font-black uppercase tracking-widest text-brand-secondary mb-1">94.2% SECURITY</div>
                    <div className="text-[9px] font-bold text-neut-500 uppercase tracking-tighter">Optimized for Supply Continuity</div>
                 </div>
              </div>
           </Card>

           <Card className="border border-neut-100 shadow-startup-soft bg-white p-8 text-neut-900 group hover:border-brand-secondary/20 transition-all">
              <div className="flex justify-between items-start mb-6">
                <h5 className="font-black text-sm uppercase tracking-widest text-neut-400">Global Reach</h5>
                <Globe size={20} className="text-neut-200 group-hover:text-brand-secondary transition-colors" />
              </div>
              <div className="text-5xl font-black text-neut-900 mb-2">8,404</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-success uppercase tracking-widest">
                <TrendingUp size={12} />
                <span>+12 this week</span>
              </div>
              <div className="mt-8 pt-6 border-t border-neut-50">
                <p className="text-[10px] font-bold text-neut-500 uppercase tracking-widest">TOTAL VERIFIED INSTITUTIONAL SUPPLIERS</p>
              </div>
           </Card>

           <div className="p-6 rounded-[2rem] bg-brand-secondary/5 border border-brand-secondary/10 text-center">
              <p className="text-xs font-bold text-brand-secondary mb-4 uppercase tracking-widest">Need custom sourcing?</p>
              <Button variant="ghost" className="text-brand-secondary font-black text-xs uppercase tracking-widest p-0 h-auto hover:bg-transparent hover:underline">Contact Sourcing Desk</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
