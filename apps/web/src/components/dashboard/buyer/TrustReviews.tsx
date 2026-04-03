"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Award,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  MapPin,
  ArrowRight,
  Filter,
  Search,
  Quote,
  ShieldAlert,
  Fingerprint,
  Zap,
  Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const REVIEWS = [
  { id: 1, buyer: "Reliance Retail", location: "Mumbai", rating: 5, comment: "Exceptional quality consistency in the last 12 procurement cycles. Verified organic traces are always accurate.", date: "2 days ago", verified: true, type: "Enterprise", avatar: "RR" },
  { id: 2, buyer: "ITC Food Division", location: "Bangalore", rating: 5, comment: "Logistics synchronization was handled with precision. Direct-from-farm gate procurement at its best.", date: "1 week ago", verified: true, type: "Horeca", avatar: "IF" },
  { id: 3, buyer: "BigBasket", location: "Hyderabad", rating: 4.8, comment: "High-fidelity quality grading (AI-verified) matched the delivery perfectly. Will repeat sourcing next week.", date: "3 days ago", verified: true, type: "Retail", avatar: "BB" },
  { id: 4, buyer: "Adani Wilmar", location: "Ahmedabad", rating: 5, comment: "Transparent pricing and secure escrow-backed payments provide great peace of mind for bulk orders.", date: "2 weeks ago", verified: true, type: "Enterprise", avatar: "AW" },
];

export function TrustReviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState(REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const filteredReviews = reviews.filter(r => 
    r.buyer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitReview = () => {
    if (!newReview.comment) return;
    const submited = {
       id: reviews.length + 1,
       buyer: "Me (Guest Buyer)",
       location: "Delhi",
       rating: newReview.rating,
       comment: newReview.comment,
       date: "Just now",
       verified: true,
       type: "Individual",
       avatar: "ME"
    };
    setReviews([submited, ...reviews]);
    setNewReview({ rating: 5, comment: "" });
    setShowForm(false);
    toast.success("Review submitted to the cryptanalytic ledger!");
  };

  return (
    <div className="space-y-12 animate-fade-in text-neut-900 border-neut-200">
      {/* Reputation Summary Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <Card className="lg:col-span-2 border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] relative overflow-hidden flex flex-col justify-center min-h-[350px]">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><ShieldCheck size={200} className="text-brand-primary" /></div>
             <div className="relative z-10 space-y-6">
                <Badge tone="brand" className="h-8 px-4 rounded-xl font-black text-[10px] tracking-widest shadow-sm uppercase">Reputation Infrastructure</Badge>
                <h2 className="text-5xl font-black text-neut-900 tracking-tight leading-none mb-4">Trust Verified across 450+ Procurement Cycles.</h2>
                <div className="flex flex-wrap gap-8 pt-4">
                   <div>
                       <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1">Avg Rating</p>
                       <div className="flex items-center gap-3">
                          <span className="text-4xl font-black text-neut-900">4.92</span>
                          <div className="flex gap-1 text-warning">
                             <Star size={20} fill="currentColor" />
                             <Star size={20} fill="currentColor" />
                             <Star size={20} fill="currentColor" />
                             <Star size={20} fill="currentColor" />
                             <Star size={20} fill="currentColor" />
                          </div>
                       </div>
                   </div>
                   <div className="w-px h-16 bg-neut-50 hidden md:block" />
                   <div>
                       <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1">Identity Trust</p>
                       <div className="flex items-center gap-3">
                          <span className="text-4xl font-black text-success">99.8%</span>
                          <Badge tone="brand" className="font-black text-[10px] rounded-lg h-6">
                             +2.4% MARKET
                          </Badge>
                       </div>
                   </div>
                </div>
             </div>
         </Card>

         <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-12 rounded-[3rem] flex flex-col justify-between group cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform"><Fingerprint size={80} className="text-white/5" /></div>
             <div className="space-y-4">
                <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-startup-soft transition-all group-hover:bg-brand-primary group-hover:shadow-glow-primary"><ShieldAlert size={28} /></div>
                <h3 className="text-2xl font-black tracking-tight leading-tight">Zero-Insecurity Framework</h3>
             </div>
             <p className="text-neut-400 font-medium my-8 leading-relaxed">Every review is cryptographically linked to a verified transaction, ensuring 100% testimonial transparency.</p>
             <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
                How it works <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
             </div>
         </Card>
      </div>

      {/* Review Feed Area */}
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-neut-100">
            <div>
               <h3 className="text-2xl font-black tracking-tight">Verified Testimonials</h3>
               <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest leading-loose">DIRECT BUYER FEEDBACK STREAM</p>
            </div>
             <div className="flex gap-4 flex-1 max-w-lg">
                <div className="relative group flex-1">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400 group-focus-within:text-brand-primary" />
                   <Input 
                     placeholder="Search testimonials..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-11 h-12 text-sm border-none shadow-startup-soft bg-white/80 rounded-2xl"
                   />
                </div>
                <Button onClick={() => setShowForm(!showForm)} variant="gradient" className="h-12 px-6 rounded-2xl font-black shadow-lg shadow-brand-primary/20">
                   Write Review
                </Button>
             </div>
          </div>

          <AnimatePresence>
             {showForm && (
                <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="overflow-hidden"
                >
                   <Card className="border-none shadow-startup-medium bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] mb-12">
                      <h4 className="text-xl font-black text-neut-900 mb-6">Share your Procurement Experience</h4>
                      <div className="space-y-6">
                         <div className="flex gap-2">
                            {[1,2,3,4,5].map(star => (
                               <Star 
                                  key={star} 
                                  size={32} 
                                  className={`cursor-pointer transition-colors ${newReview.rating >= star ? 'text-warning' : 'text-neut-200'}`}
                                  fill={newReview.rating >= star ? 'currentColor' : 'none'}
                                  onClick={() => setNewReview({...newReview, rating: star})}
                               />
                            ))}
                         </div>
                         <textarea 
                            className="w-full h-32 rounded-2xl bg-neut-50 p-6 font-medium text-neut-700 outline-none border-2 border-transparent focus:border-brand-primary/20 transition-all"
                            placeholder="Describe quality, delivery, and logistics..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                         />
                         <div className="flex justify-end gap-4">
                            <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl font-bold">Cancel</Button>
                            <Button onClick={handleSubmitReview} variant="gradient" className="h-12 px-10 rounded-xl font-black shadow-lg shadow-brand-primary/20">Submit Review</Button>
                         </div>
                      </div>
                   </Card>
                </motion.div>
             )}
          </AnimatePresence>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
               {filteredReviews.map((rev, i) => (
                  <motion.div
                    key={rev.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="border-none shadow-startup-soft bg-white/60 backdrop-blur-xl hover:shadow-startup-medium transition-all group overflow-hidden rounded-[2.5rem]">
                       <CardContent className="p-10 space-y-8">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary font-black text-xl shadow-startup-soft group-hover:scale-105 transition-transform">
                                   {rev.avatar}
                                </div>
                                <div>
                                   <div className="flex items-center gap-3 mb-1">
                                      <h4 className="text-xl font-black text-neut-900 tracking-tight">{rev.buyer}</h4>
                                      <Badge tone="brand" className="h-5 px-3 rounded-lg text-[8px] font-black uppercase"><ShieldCheck size={10} className="mr-1" /> VERIFIED</Badge>
                                   </div>
                                   <div className="flex items-center gap-2 text-neut-400 font-bold text-[10px] uppercase tracking-widest">
                                      <MapPin size={10} className="text-brand-primary" />
                                      {rev.location}
                                      <span className="h-1 w-1 rounded-full bg-neut-100 mx-1" />
                                      <Building2 size={10} className="text-brand-primary" />
                                      {rev.type}
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1">{rev.date}</p>
                                <div className="flex gap-0.5 text-warning">
                                   {Array(5).fill(0).map((_, ri) => (
                                      <Star key={ri} size={12} fill={ri < Math.floor(rev.rating) ? "currentColor" : "none"} stroke="currentColor" />
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="relative">
                             <Quote size={40} className="absolute -top-4 -left-4 text-brand-primary opacity-5 -z-10" />
                             <p className="text-lg font-medium text-neut-600 leading-relaxed italic z-10">"{rev.comment}"</p>
                          </div>

                          <div className="flex items-center justify-between pt-8 border-t border-neut-50">
                             <div className="flex -space-x-2">
                                {[1,2,3].map(j => (
                                   <div key={j} className="h-8 w-8 rounded-full border-2 border-white bg-neut-100 flex items-center justify-center text-[10px] font-black text-neut-400 overflow-hidden">
                                       <Zap size={12} />
                                   </div>
                                ))}
                                <div className="h-8 px-3 rounded-full border-2 border-white bg-neut-100 flex items-center justify-center text-[9px] font-black text-neut-400">
                                    +12 more endorsements
                                </div>
                             </div>
                             <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase text-neut-400 hover:text-brand-primary hover:bg-brand-primary/5">
                                <ThumbsUp size={14} className="mr-2" />
                                Helpfull? (14)
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
