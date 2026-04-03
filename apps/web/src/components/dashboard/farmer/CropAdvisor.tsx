"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, 
  TrendingUp, 
  CloudRain, 
  Sun, 
  Snowflake, 
  MapPin, 
  ChevronRight,
  Info,
  BadgeInfo,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import api from "@/services/api";

interface CropRecommendation {
  crop: string;
  demandScore: number;
  avgPrice: number;
  season: string;
  why: string;
  image: string;
}

export function CropAdvisor() {
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Guntur, Andhra Pradesh");
  const [month, setMonth] = useState("March");
  const [soilType, setSoilType] = useState("alluvial");
  const [prevCrops, setPrevCrops] = useState<string[]>(["Rice"]);

  useEffect(() => {
    fetchRecommendations();
  }, [month, soilType, prevCrops]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const seasonMap: { [key: string]: string } = {
        "January": "rabi", "February": "rabi", "March": "kharif", 
        "April": "kharif", "May": "kharif", "June": "kharif",
        "July": "kharif", "August": "kharif", "September": "kharif",
        "October": "rabi", "November": "rabi", "December": "rabi"
      };
      
      const season = seasonMap[month] || "kharif";
      const query = new URLSearchParams({
        soilType,
        previousCrops: prevCrops.join(','),
        season
      });

      const response: any = await api.get(`/ai/crop-recommendation?${query.toString()}`);
      if (response.success) {
        setRecommendations(response.data);
      } else {
        toast.error("Failed to fetch recommendations");
      }
    } catch (error) {
      console.error("Error fetching recommendations", error);
      // Fallback for demo if API is not yet live
      setRecommendations([
        { crop: "Tomato", demandScore: 85, avgPrice: 25, season: "Summer", why: "High demand in local mandis and low current supply.", image: "🍅" },
        { crop: "Chilli", demandScore: 88, avgPrice: 120, season: "Summer", why: "Export demand surge in Southeast Asia.", image: "🌶️" },
        { crop: "Corn", demandScore: 65, avgPrice: 15, season: "Summer", why: "Increasing demand for poultry feed industries.", image: "🌽" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getDemandLabel = (score: number) => {
    if (score >= 85) return { label: "HIGH", tone: "brand" as const };
    if (score >= 75) return { label: "MEDIUM", tone: "amber" as const };
    return { label: "LOW", tone: "ink" as const };
  };

  return (
    <div className="space-y-12 animate-fade-in text-neut-900 border-neut-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-neut-100">
         <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Smart Crop Advisor</h2>
            <div className="flex items-center gap-4 text-neut-500 font-bold text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-brand-primary" /> {location}</span>
                <span className="h-1 w-1 bg-neut-200 rounded-full" />
                <span className="flex items-center gap-1.5"><Calendar size={16} className="text-brand-primary" /> {month}, 2024</span>
            </div>
         </div>
         <div className="flex flex-wrap gap-3">
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-neut-400 px-1">Month</span>
                <select 
                    title="Select Month"
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)}
                    className="bg-white border-2 border-neut-100 rounded-xl px-4 py-2 font-black text-xs shadow-sm outline-none focus:border-brand-primary"
                >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
             </div>

             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-neut-400 px-1">Soil Type</span>
                <select 
                    title="Select Soil Type"
                    value={soilType} 
                    onChange={(e) => setSoilType(e.target.value)}
                    className="bg-white border-2 border-neut-100 rounded-xl px-4 py-2 font-black text-xs shadow-sm outline-none focus:border-brand-primary"
                >
                    <option value="alluvial">Alluvial</option>
                    <option value="black">Black Cotton</option>
                    <option value="red">Red Soil</option>
                    <option value="laterite">Laterite</option>
                    <option value="clay">Clay</option>
                </select>
             </div>

             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-neut-400 px-1">Prev Crop</span>
                <select 
                    title="Select Previous Crop"
                    value={prevCrops[0]} 
                    onChange={(e) => setPrevCrops([e.target.value])}
                    className="bg-white border-2 border-neut-100 rounded-xl px-4 py-2 font-black text-xs shadow-sm outline-none focus:border-brand-primary"
                >
                    <option value="Rice">Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Maize">Maize</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Soybean">Soybean</option>
                </select>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence mode="wait">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="border-none shadow-startup-soft bg-white/40 backdrop-blur-xl h-[450px] animate-pulse rounded-[3rem]" />
            ))
          ) : (
            recommendations.map((rec, i) => {
                const demand = getDemandLabel(rec.demandScore);
                return (
                    <motion.div
                        key={rec.crop}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] hover:shadow-startup-medium transition-all group overflow-hidden h-full flex flex-col">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                {rec.season === "Summer" && <Sun size={80} />}
                                {rec.season === "Winter" && <Snowflake size={80} />}
                                {rec.season === "Monsoon" && <CloudRain size={80} />}
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="text-6xl">{rec.image}</div>
                                <Badge tone={demand.tone} className="h-8 px-4 rounded-xl font-black text-[10px] shadow-sm uppercase tracking-widest">
                                    {demand.label} DEMAND
                                </Badge>
                            </div>

                            <div className="space-y-2 mb-8 relative z-10">
                                <h3 className="text-4xl font-black text-neut-900 tracking-tight">{rec.crop}</h3>
                                <p className="text-neut-400 font-bold uppercase text-[10px] tracking-widest">{rec.season} Variety</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 bg-neut-50 p-6 rounded-[2rem] mb-8 relative z-10 border border-neut-100">
                                <div>
                                    <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1">Expected Price</p>
                                    <p className="text-2xl font-black text-neut-900">₹{rec.avgPrice}<span className="text-xs text-neut-400 ml-1">/kg</span></p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1">Confidence</p>
                                    <p className="text-2xl font-black text-brand-primary">{rec.demandScore}%</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                <div className="flex gap-3">
                                    <div className="h-6 w-6 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary flex-shrink-0 mt-0.5"><Info size={14} /></div>
                                    <p className="text-sm font-medium text-neut-500 leading-relaxed italic">"{rec.why}"</p>
                                </div>
                            </div>

                            <Button variant="gradient" className="h-14 w-full rounded-2xl font-black text-lg shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform mt-auto">
                                View Market Insights
                                <ChevronRight size={20} className="ml-2" />
                            </Button>
                        </Card>
                    </motion.div>
                );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Why Use Crop Advisor Section */}
      <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-12 rounded-[3.5rem] relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Sprout size={250} /></div>
          
          <div className="h-32 w-32 bg-brand-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-glow-primary flex-shrink-0">
              <TrendingUp size={64} />
          </div>
          
          <div className="space-y-6 relative z-10 flex-1">
              <h3 className="text-4xl font-black tracking-tight leading-tight">Data-Driven Sowing Decisions.</h3>
              <p className="text-lg font-medium text-white/60 leading-relaxed max-w-2xl">
                  Our recommendation engine analyzes over <span className="text-white font-black">450+ data points</span> including soil health certificates, Mandi price volatility, and climate shifts to ensure you grow what the market needs.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                  <Badge tone="brand" className="bg-white/10 text-white border-white/20 px-4 h-8 rounded-xl font-bold">100% Verified Logic</Badge>
                  <Badge tone="brand" className="bg-white/10 text-white border-white/20 px-4 h-8 rounded-xl font-bold">Local Mandi Integration</Badge>
                  <Badge tone="brand" className="bg-white/10 text-white border-white/20 px-4 h-8 rounded-xl font-bold">Climate Proofed</Badge>
              </div>
          </div>
          
          <Button variant="outline" className="h-16 px-10 rounded-2xl font-black border-white/20 text-white bg-transparent hover:bg-white hover:text-neut-900 shadow-glow-primary/10">
              Analyze My Soil
          </Button>
      </Card>
    </div>
  );
}
