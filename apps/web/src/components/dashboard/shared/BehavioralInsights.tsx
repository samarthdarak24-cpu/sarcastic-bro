"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Target, 
  ArrowUpRight,
  BrainCircuit,
  Zap,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import toast from "react-hot-toast";

interface Insight {
  title: string;
  message: string;
  type: string;
}

export function BehavioralInsights() {
  const [data, setData] = useState<{ score: number, insights: Insight[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await api.get("/ai/behavior/insights");
      setData(response.data.data);
    } catch (error) {
      // toast.error("Behavioral engine is synchronizing...");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!data) return null;

  return (
    <Card className="border-none shadow-startup-soft bg-white p-8 rounded-[3rem] overflow-hidden relative">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-neut-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-neut-900/20">
                 <BrainCircuit size={24} />
              </div>
              <div>
                 <h3 className="text-xl font-black text-neut-900 tracking-tight">Behavioral Intelligence</h3>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-neut-400 tracking-widest">Efficiency Score</span>
                    <Badge tone="brand" className="h-4 px-1 rounded-sm font-black">{data.score}%</Badge>
                 </div>
              </div>
           </div>
           <Sparkles size={24} className="text-brand-primary animate-pulse" />
        </div>

        <div className="space-y-4">
           {data.insights.map((insight, idx) => (
             <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-neut-50/50 p-6 rounded-[2rem] border border-neut-50 flex gap-4 group hover:bg-white hover:shadow-lg transition-all"
             >
                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${
                    insight.type === 'SUCCESS' ? 'bg-success/10 text-success' : 
                    insight.type === 'TREND_UP' ? 'bg-secondary/10 text-secondary' : 
                    'bg-brand-primary/10 text-brand-primary'
                }`}>
                    {insight.type === 'SUCCESS' ? <Target size={20} /> : <Zap size={20} />}
                </div>
                <div>
                   <h4 className="text-sm font-black text-neut-900 mb-1">{insight.title}</h4>
                   <p className="text-xs font-bold text-neut-500 leading-relaxed">{insight.message}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} className="text-neut-400" />
                </div>
             </motion.div>
           ))}
        </div>

        <div className="mt-8 pt-8 border-t border-neut-100 flex items-center gap-4 text-neut-400">
           <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-neut-100" />
              ))}
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing with 1.2k global nodes</p>
        </div>
      </div>
      
      {/* Background patterns */}
      <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-brand-primary opacity-5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -left-20 -top-20 h-64 w-64 bg-secondary opacity-5 rounded-full blur-3xl" />
    </Card>
  );
}

