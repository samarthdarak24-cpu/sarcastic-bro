"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, PieChart, BarChart3, Globe, Layers, ArrowUpRight, Target, Sparkles, Filter, Calendar, Activity, Zap, Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MiniChart } from "@/components/dashboard/MiniChart";

export function BuyerDemandForecast() {
  return (
    <div className="space-y-8 animate-fade-in w-full pb-20 text-neut-900">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="startup-headline text-3xl font-black flex items-center gap-3">
            Demand Forecast AI
            <Target className="text-brand-secondary" size={28} />
          </h2>
          <p className="text-neut-500 font-medium">Predicting future procurement needs via historical nodes and market sentiment</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-neut-200">
             <Calendar size={18} className="mr-2" /> Q3 Forecast
          </Button>
          <Button variant="gradient" className="h-12 px-8 rounded-xl font-bold font-black shadow-lg shadow-brand-secondary/20">Sync Inventory</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Forecast Card */}
        <Card className="lg:col-span-2 border-none shadow-startup-soft bg-white p-10 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <TrendingUp size={180} />
           </div>
           
           <div className="space-y-12 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-neut-900">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neut-400">PROJECTED VOLUME</span>
                    <div className="text-5xl font-black mt-2">1,840 <span className="text-xl text-neut-400">Tons</span></div>
                    <div className="flex items-center gap-2 text-success font-bold text-xs mt-3 bg-success/5 px-3 py-1.5 rounded-lg w-fit">
                       <TrendingUp size={14} /> +4.2% Optimization Suggestion
                    </div>
                 </div>
                 <div className="bg-neut-50 rounded-3xl p-6 border border-neut-100 italic font-medium text-xs text-neut-500 leading-relaxed">
                    &ldquo;Seasonal spike in Basmati demand is expected in 3 weeks. Procurement nodes should be locked at L3 stage to ensure supply security.&rdquo;
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neut-400">DEMAND CURVE (ESTIMATED)</span>
                    <div className="h-48 mt-12 px-2">
                       <MiniChart data={[60, 65, 72, 85, 98, 110, 120, 140, 160]} color="var(--brand-secondary)" height={180} />
                    </div>
                    <div className="flex justify-between mt-6 text-[10px] font-black uppercase tracking-widest text-neut-300">
                       <span>WEEK 1</span>
                       <span>WEEK 4</span>
                       <span>WEEK 8</span>
                       <span>WEEK 12</span>
                       <span className="text-brand-secondary">PEAK DEMAND (LIV)</span>
                    </div>
                 </div>
              </div>
           </div>
        </Card>

        {/* Planning Stats Side */}
        <div className="space-y-6">
           <Card className="border-none shadow-startup-soft bg-neut-950 text-white p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Zap size={140} />
              </div>
              <CardHeader className="p-0 mb-8 pb-4 border-b border-white/10">
                 <CardTitle className="text-lg font-black flex items-center gap-3">
                   Inventory Strategy
                   <Box size={18} className="text-brand-secondary" />
                 </CardTitle>
              </CardHeader>
              <div className="space-y-8 relative z-10">
                 <div className="space-y-4">
                    {[ 
                      { label: "Safety Stock Level", val: 82 },
                      { label: "Optimal Reorder Point", val: 65 }
                    ].map((m) => (
                      <div key={m.label} className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neut-500">
                            <span>{m.label}</span>
                            <span>{m.val}%</span>
                         </div>
                         <Progress value={m.val} className="h-1 bg-white/5" />
                      </div>
                    ))}
                 </div>
                 <Button className="w-full h-12 bg-white text-neut-900 font-black rounded-xl">Adjust Reorder Points</Button>
              </div>
           </Card>

           <Card className="border-none shadow-startup-soft bg-white p-8 text-neut-900 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Sparkles size={100} />
              </div>
              <h4 className="text-lg font-black leading-tight mb-2">Confidence Index</h4>
              <div className="text-3xl font-black text-brand-secondary">94% <span className="text-sm text-neut-400">Score</span></div>
              <p className="text-[10px] font-bold text-neut-500 uppercase tracking-widest mt-4">ACCURACY RATING</p>
           </Card>
        </div>
      </div>
    </div>
  );
}
