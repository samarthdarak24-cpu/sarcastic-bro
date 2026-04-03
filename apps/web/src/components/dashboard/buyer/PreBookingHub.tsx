"use client";

import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Calendar, 
  Package, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Plus,
  Search,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

export function PreBookingHub() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // New Contract Form
  const [formData, setFormData] = useState({
    farmerId: "",
    productName: "",
    quantity: "",
    totalValue: "",
    targetDate: "",
    terms: "Pre-booking for upcoming harvest. Quality guarantee required."
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contractsRes, farmersRes] = await Promise.all([
        api.get("/contracts?isPreBooking=true"),
        api.get("/users?role=FARMER")
      ]);
      setContracts(contractsRes.data.data.contracts);
      setFarmers(farmersRes.data.data.users || []);
    } catch (error) {
      toast.error("Failed to load pre-bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/contracts", {
        ...formData,
        isPreBooking: true,
        totalValue: parseFloat(formData.totalValue),
        quantity: parseFloat(formData.quantity)
      });
      toast.success("Safe-Lock contract proposed!");
      setShowCreate(false);
      setFormData({ farmerId: "", productName: "", quantity: "", totalValue: "", targetDate: "", terms: "Pre-booking..." });
      fetchData();
    } catch (error) {
      toast.error("Failed to propose contract.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-10 rounded-[3rem] overflow-hidden relative">
           <div className="relative z-10 max-w-2xl">
              <Badge tone="brand" className="mb-4 font-black">DEMAND LOCK SYSTEM</Badge>
              <h2 className="text-4xl font-black mb-4 tracking-tighter leading-none">Secure Future Harvests with Safe-Lock™</h2>
              <p className="text-neut-400 font-bold mb-8">Lock in prices and supply months before harvest. Protect your business from market volatility and demand spikes.</p>
              <Button 
                onClick={() => setShowCreate(!showCreate)}
                className="h-14 bg-brand-primary hover:bg-brand-primary/90 text-white font-black px-8 rounded-2xl shadow-xl shadow-brand-primary/20"
              >
                <Plus size={20} className="mr-2" /> Propose New Pre-Booking
              </Button>
           </div>
           <div className="absolute right-0 top-0 h-full w-1/3 bg-startup-gradient opacity-10 skew-x-12 translate-x-1/2" />
           <Lock size={200} className="absolute -right-12 -bottom-12 text-white opacity-5 rotate-12" />
      </Card>

      {showCreate && (
         <Card className="border-none shadow-xl bg-white p-10 rounded-[2.5rem]">
            <form onSubmit={handleCreate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-neut-400 ml-1">Select Farmer</label>
                        <select 
                            className="w-full h-14 bg-neut-50 border-none rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                            value={formData.farmerId}
                            onChange={(e) => setFormData({...formData, farmerId: e.target.value})}
                            required
                        >
                            <option value="">Search farmers...</option>
                            {farmers.map(f => <option key={f.id} value={f.id}>{f.name} ({f.district})</option>)}
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-neut-400 ml-1">Desired Product</label>
                        <Input 
                            placeholder="e.g. Basmati Rice"
                            className="h-14 bg-neut-50 border-none rounded-2xl px-6 font-bold"
                            value={formData.productName}
                            onChange={(e) => setFormData({...formData, productName: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-neut-400 ml-1">Target Delivery Date</label>
                        <Input 
                            type="date"
                            className="h-14 bg-neut-50 border-none rounded-2xl px-6 font-bold"
                            value={formData.targetDate}
                            onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-neut-400 ml-1">Quantity (MT)</label>
                            <Input 
                                type="number"
                                className="h-14 bg-neut-50 border-none rounded-2xl px-6 font-bold"
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-neut-400 ml-1">Total Value (₹)</label>
                            <Input 
                                type="number"
                                className="h-14 bg-neut-50 border-none rounded-2xl px-6 font-bold"
                                value={formData.totalValue}
                                onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button type="submit" className="flex-1 h-14 bg-neut-900 text-white font-black rounded-2xl">Create Safe-Lock Proposal</Button>
                    <Button onClick={() => setShowCreate(false)} variant="outline" className="h-14 px-8 border-2 rounded-2xl font-black">Cancel</Button>
                </div>
            </form>
         </Card>
      )}

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contracts.map((c) => (
          <Card key={c.id} className="border-none shadow-startup-soft bg-white p-10 rounded-[3rem] group hover:shadow-2xl transition-all">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="h-16 w-16 bg-brand-primary/5 rounded-[1.5rem] flex items-center justify-center text-brand-primary">
                        <Package size={32} />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-neut-900 tracking-tight">{c.productName}</h4>
                        <div className="flex items-center gap-2">
                           <Badge tone="brand" className="h-5 px-2 font-black rounded-md">{c.status}</Badge>
                           <span className="text-[10px] font-black text-neut-400 uppercase tracking-widest">ID: {c.contractNumber.split('-')[2]}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-neut-50/50 p-6 rounded-[2rem] border border-neut-50">
                     <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-neut-400" />
                        <span className="text-[10px] font-black uppercase text-neut-400 tracking-widest">Delivery</span>
                     </div>
                     <p className="text-lg font-black text-neut-900">{c.targetDate ? format(new Date(c.targetDate), 'MMM dd, yyyy') : 'TBD'}</p>
                  </div>
                  <div className="bg-neut-50/50 p-6 rounded-[2rem] border border-neut-50">
                     <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={14} className="text-brand-primary" />
                        <span className="text-[10px] font-black uppercase text-neut-400 tracking-widest">Secured Price</span>
                     </div>
                     <p className="text-lg font-black text-brand-primary">₹{c.totalValue}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-8 border-t border-neut-100">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-neut-100 rounded-full flex items-center justify-center font-black text-neut-400 text-xs">
                        {c.farmer?.name?.charAt(0)}
                     </div>
                     <div>
                        <p className="text-xs font-black text-neut-900">{c.farmer?.name}</p>
                        <p className="text-[10px] font-bold text-neut-400">Owner Farmer</p>
                     </div>
                  </div>
                  <Button variant="outline" className="rounded-xl font-black hover:bg-neut-900 hover:text-white transition-all">Manage Lock</Button>
               </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
