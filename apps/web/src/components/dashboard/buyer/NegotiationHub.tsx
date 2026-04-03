"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Gavel, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Tag,
  Clock,
  MoreVertical,
  Layers,
  Zap,
  Target,
  ArrowRight,
  User,
  Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const negotiations = [
  { id: "NEG-102", product: "Guntur Chillies", supplier: "Sunita Devi", currentPrice: 140, offerPrice: 132, status: "Counter Offer", time: "2h ago", avatar: "SD" },
  { id: "NEG-105", product: "Basmati Rice", supplier: "Ramesh Kumar", currentPrice: 85, offerPrice: 83.5, status: "Pending", time: "5h ago", avatar: "RK" },
  { id: "NEG-108", product: "Organic Turmeric", supplier: "ITC Hub", currentPrice: 120, offerPrice: 118, status: "Accepted", time: "1d ago", avatar: "I" },
];

export function NegotiationHub() {
  const [selectedNeg, setSelectedNeg] = useState(negotiations[0]);
  const [newOffer, setNewOffer] = useState("");
  const [messages, setMessages] = useState<any[]>([
    { id: 1, role: "supplier", text: "Proposed standard rate based on current Mandi index.", offer: 85, time: "10:30 AM" },
    { id: 2, role: "buyer", text: "Bulk requirement of 2 Tons. Asking for ₹82/kg.", offer: 82, time: "2:45 PM" },
    { id: 3, role: "supplier", text: "Minimum we can do is ₹83.5/kg for this grade.", offer: 83.5, time: "Just Now" }
  ]);

  const handleSendOffer = () => {
    if (!newOffer) return;
    const msg = {
       id: messages.length + 1,
       role: "buyer",
       text: `Sending counter offer: ₹${newOffer}/kg.`,
       offer: parseFloat(newOffer),
       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    toast.success(`Counter offer of ₹${newOffer}/kg sent to ${selectedNeg.supplier}.`);
    setNewOffer("");
  };

  const handleAccept = () => {
     toast.success("Trade contract generated. Total amount ₹4.2L reserved in escrow.");
  };

  return (
    <div className="h-[calc(100vh-280px)] min-h-[600px] flex overflow-hidden rounded-[2.5rem] bg-white shadow-startup-soft border border-neut-100 text-neut-900">
      {/* Sidebar - Pending Offers */}
      <aside className="w-96 border-r border-neut-100 flex flex-col bg-neut-50/50">
        <div className="p-8 border-b border-neut-100 bg-white">
           <h2 className="text-2xl font-black tracking-tight mb-1">Contract Bids</h2>
           <p className="text-[10px] font-black uppercase text-neut-400 tracking-widest leading-loose">ACTIVE PRICE NEGOTIATIONS</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
           {negotiations.map((neg) => (
              <motion.div
                 key={neg.id}
                 whileHover={{ x: 4 }}
                 onClick={() => setSelectedNeg(neg)}
                 className={`p-6 rounded-3xl cursor-pointer transition-all border ${
                     selectedNeg.id === neg.id 
                     ? "bg-white border-brand-secondary shadow-startup-soft ring-4 ring-brand-secondary/5" 
                     : "bg-transparent border-transparent hover:bg-white hover:border-neut-100"
                 }`}
              >
                 <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 bg-brand-secondary/5 rounded-xl flex items-center justify-center text-brand-secondary font-black text-sm">
                       {neg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="font-extrabold text-sm text-neut-900 truncate">{neg.product}</h4>
                       <p className="text-[10px] font-black uppercase text-neut-400 tracking-widest">{neg.supplier}</p>
                    </div>
                    <Badge tone={neg.status === 'Accepted' ? 'brand' : 'ink'} className="rounded-lg h-6 font-black text-[9px] uppercase tracking-widest px-2">{neg.status}</Badge>
                 </div>
                 <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-neut-300 uppercase tracking-widest mb-0.5">Bid Avg</span>
                       <span className="text-lg font-black text-neut-900 tracking-tight">₹{neg.offerPrice}/kg</span>
                    </div>
                    <span className="text-[10px] font-black text-neut-400">{neg.time}</span>
                 </div>
              </motion.div>
           ))}
        </div>
      </aside>

      {/* Main Negotiation Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative">
         <div className="absolute inset-0 opacity-20 bg-grid pointer-events-none" />
         
         {selectedNeg ? (
            <div className="w-full h-full flex flex-col relative z-10 px-12 py-10">
               {/* Context Header */}
               <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-white rounded-[1.5rem] flex items-center justify-center text-brand-secondary shadow-startup-soft border-4 border-white"><Package size={28} /></div>
                      <div>
                         <h3 className="text-3xl font-black text-neut-900 tracking-tight">{selectedNeg.product}</h3>
                         <p className="text-sm font-bold text-neut-500">Bidding against <span className="text-brand-secondary">{selectedNeg.supplier}</span></p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <Button variant="outline" className="h-12 w-12 p-0 rounded-xl"><MoreVertical size={24} /></Button>
                   </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 h-[400px]">
                  {/* Chat / Timeline */}
                   <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] flex flex-col min-h-[400px]">
                      <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                         {messages.map((m) => (
                            <div key={m.id} className={`p-4 rounded-2xl flex gap-4 ${m.role === 'buyer' ? 'bg-brand-secondary/5 border border-brand-secondary/20 self-end ml-12' : 'bg-neut-50 border border-neut-100 mr-12'}`}>
                               <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 font-black ${m.role === 'buyer' ? 'bg-brand-secondary text-white' : 'bg-white text-neut-400'}`}>
                                  {m.role === 'buyer' ? 'ME' : selectedNeg.avatar}
                               </div>
                               <div className="flex-1">
                                  <p className="text-xs font-bold text-neut-900 mb-1">{m.text}</p>
                                  <div className="flex items-center gap-2">
                                     <Badge tone={m.role === 'buyer' ? 'brand' : 'ink'} className="rounded-lg h-5 font-black text-[9px] uppercase px-2 shadow-sm">
                                        {m.role === 'buyer' ? 'COUNTER' : 'OFFER'} ₹{m.offer}/kg
                                     </Badge>
                                     <span className="text-[10px] font-black text-neut-300">{m.time}</span>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </Card>

                  {/* Pricing Matrix / Control */}
                  <div className="space-y-8 flex flex-col h-full">
                     <Card className="border-none shadow-startup-medium bg-startup-gradient text-white overflow-hidden p-10 rounded-[2.5rem] relative flex-1">
                        <div className="gradient-blur top-0 right-0 opacity-30" />
                        <div className="relative z-10 space-y-10">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h4 className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">Contract Valuation</h4>
                                 <div className="text-4xl font-black text-white tracking-widest">₹1.67L</div>
                              </div>
                              <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center"><Gavel size={28} className="text-white" /></div>
                           </div>

                           <div className="space-y-6">
                              <div className="flex items-center justify-between text-white/70 font-bold text-sm">
                                 <span>Quantity</span>
                                 <span>2,000 kg (2 Ton)</span>
                              </div>
                              <div className="flex items-center justify-between text-white/70 font-bold text-sm">
                                 <span>Logistics</span>
                                 <span>FOB Origin (Included)</span>
                              </div>
                              <div className="flex items-center justify-between text-white font-black text-xl pt-6 border-t border-white/10">
                                 <span>Closing Rate</span>
                                 <span className="text-success shadow-glow-success">₹83.50<small className="text-[10px] text-white/40 ml-1">/kg</small></span>
                              </div>
                           </div>

                           <Button 
                              variant="secondary" 
                              className="h-16 w-full rounded-2xl bg-white text-brand-secondary hover:bg-white/90 font-black text-xl shadow-lg shadow-neut-900/10 active:scale-95 transition-transform"
                              onClick={handleAccept}
                           >
                              Reserve Trade Funds
                              <ArrowRight size={24} className="ml-3" />
                           </Button>
                        </div>
                     </Card>

                     {/* Quick Counter Offer */}
                     <div className="bg-white rounded-3xl p-6 shadow-startup-soft flex items-center gap-4 border border-neut-100">
                        <div className="relative flex-1 group">
                           <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neut-400 font-black text-sm">₹</div>
                           <Input 
                              type="number"
                              placeholder="Offer your price..." 
                              value={newOffer}
                              onChange={(e) => setNewOffer(e.target.value)}
                              className="h-14 w-full pl-10 pr-12 rounded-2xl bg-neut-50 border-neut-100 focus:bg-white text-lg font-black transition-all"
                           />
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-neut-200">/KG</div>
                        </div>
                        <Button 
                           variant="gradient" 
                           onClick={handleSendOffer}
                           className="h-14 px-10 rounded-2xl font-black text-lg shadow-lg shadow-brand-secondary/20"
                        >
                           Counter
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <div className="text-center space-y-6">
               <div className="h-32 w-32 bg-neut-50 rounded-[3rem] flex items-center justify-center text-neut-100 mx-auto animate-pulse">
                  <Gavel size={64} />
               </div>
               <h3 className="text-3xl font-black text-neut-900 tracking-tight">Access Bargaining Power</h3>
               <p className="text-neut-400 font-medium max-w-sm mx-auto text-lg leading-relaxed">Select a procurement bid to start a real-time negotiation with the supplier.</p>
            </div>
         )}
      </main>
    </div>
  );
}
