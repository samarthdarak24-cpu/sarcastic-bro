"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Plus,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import toast from "react-hot-toast";

export function TenderParticipation() {
  const [activeTab, setActiveTab] = useState("Market");
  const [tenders, setTenders] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTender, setSelectedTender] = useState<any>(null);
  const [bidForm, setBidForm] = useState({
      priceOffer: 0,
      message: ""
  });

  React.useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
        if (activeTab === "Market") {
            const res = await api.get("/tenders");
            setTenders(res.data.data || []);
        } else {
            const res = await api.get("/tenders/my-applications");
            setMyBids(res.data.data || []);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handleBidSubmit = async () => {
    if (!selectedTender) return;
    if (bidForm.priceOffer <= 0) return toast.error("Please enter a valid price offer.");
    
    try {
        await api.post(`/tenders/${selectedTender.id}/apply`, {
            priceOffer: bidForm.priceOffer,
            message: bidForm.message
        });
        toast.success("Bid submitted successfully!");
        setSelectedTender(null);
        fetchData();
        setBidForm({ priceOffer: 0, message: "" });
    } catch (error) {
        toast.error("Failed to submit bid. You may have already applied.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="startup-headline text-3xl font-black text-neut-900 flex items-center gap-3">
            Tender Hub
            <FileText className="text-brand-primary" size={28} />
          </h2>
          <p className="text-neut-500 font-medium">Bidding on high-volume government and private agricultural tenders</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-neut-100 rounded-2xl">
          {["Market", "My Bids", "Wins"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab ? "bg-white text-neut-900 shadow-startup-soft" : "text-neut-500 hover:text-neut-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Filters */}
        <div className="space-y-6">
          <Card className="border-none shadow-startup-soft bg-white p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-neut-400">FILTERS</CardTitle>
            </CardHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neut-400">CATEGORY</label>
                <select className="w-full h-11 bg-neut-50 border-none rounded-xl text-xs font-bold px-4">
                  <option>All Produce</option>
                  <option>Grains</option>
                  <option>Spices</option>
                  <option>Vegetables</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neut-400">MIN. VOLUME</label>
                <Input placeholder="e.g. 50 Tons" className="h-11 rounded-xl bg-neut-50 border-none" />
              </div>
              <Button className="w-full h-11 bg-neut-900 text-white font-black rounded-xl">Apply Filters</Button>
            </div>
          </Card>

          <Card className="border-none shadow-startup-soft bg-brand-primary text-white p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Calendar size={80} />
            </div>
            <h4 className="text-lg font-black leading-tight mb-2">Tender Calendar</h4>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-6">Upcoming Deadlines</p>
            <div className="space-y-4 relative z-10">
               {[1, 2].map((i) => (
                 <div key={i} className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-3">
                   <Clock size={16} />
                   <div className="text-[10px] font-black uppercase">15 APR - NAFED PULSES</div>
                 </div>
               ))}
            </div>
          </Card>
        </div>

        {/* Tender Grid or My Bids */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>
            ) : (
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {(activeTab === "Market" ? tenders : myBids).map((item, i) => {
                        const tender = activeTab === "Market" ? item : item.tender;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="border-none shadow-startup-soft hover:shadow-startup-medium transition-all group bg-white h-full overflow-hidden relative">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                        tender.status === 'AWARDED' ? 'bg-success' : 'bg-brand-primary'
                                    }`} />
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge tone="brand" className="text-[8px] font-black uppercase border-neut-100">{tender.tenderId || `TND-${item.id.slice(0,4)}`}</Badge>
                                                    <Badge className="bg-success/10 text-success border-none text-[8px] font-black">{tender.status}</Badge>
                                                </div>
                                                <h3 className="text-xl font-black text-neut-900 group-hover:text-brand-primary transition-colors leading-tight">{tender.title}</h3>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-neut-400">ISSUING ENTITY</span>
                                                <div className="flex items-center gap-2 text-xs font-bold text-neut-700">
                                                    <Building2 size={12} className="text-brand-primary" /> {tender.creator?.name || "Global Agro"}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-neut-400">VOL / PRICE</span>
                                                <div className="flex items-center gap-2 text-xs font-bold text-neut-700">
                                                    {tender.quantity} {tender.unit} @ ₹{tender.maxPrice}
                                                </div>
                                            </div>
                                            {activeTab === "My Bids" && (
                                                <div className="space-y-1 col-span-2 p-3 bg-neut-50 rounded-xl">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-neut-400">YOUR OFFER</span>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-black text-neut-900">₹{item.priceOffer} / {tender.unit}</span>
                                                        <Badge className={item.status === 'ACCEPTED' ? 'bg-success text-white' : 'bg-neut-200 text-neut-500'}>{item.status}</Badge>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {activeTab === "Market" && (
                                            <div className="pt-6 border-t border-neut-50 flex gap-4">
                                                {selectedTender?.id === item.id ? (
                                                    <div className="w-full space-y-4">
                                                        <Input 
                                                            type="number" 
                                                            placeholder="Your Price Offer..." 
                                                            className="h-12 rounded-xl bg-neut-50 border-none font-bold"
                                                            onChange={(e) => setBidForm({...bidForm, priceOffer: parseFloat(e.target.value)})}
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button onClick={handleBidSubmit} variant="gradient" className="flex-1 h-11 rounded-xl text-xs font-black">CONFIRM BID</Button>
                                                            <Button onClick={() => setSelectedTender(null)} variant="outline" className="h-11 rounded-xl px-4 font-black">×</Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Button variant="outline" className="flex-1 h-11 rounded-xl text-xs font-black border-neut-100">VIEW DETAILS</Button>
                                                        <Button variant="gradient" onClick={() => setSelectedTender(item)} className="flex-1 h-11 rounded-xl text-xs font-black">PARTICIPATE</Button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
