"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Download, 
  MoreVertical,
  Calendar,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const mockOrders = [
  { id: "ORD-1001", product: "Premium Basmati Rice", qty: "1,200kg", total: "₹1,02,000", status: "Delivered", date: "2024-03-15", cluster: "Varanasi" },
  { id: "ORD-1005", product: "Organic Turmeric", qty: "450kg", total: "₹63,000", status: "In Transit", date: "2024-03-22", cluster: "Sangli" },
  { id: "ORD-1009", product: "Kashmiri Walnuts", qty: "80kg", total: "₹52,000", status: "Processing", date: "2024-03-25", cluster: "Budgam" },
];

export function OrderHistoryList() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-2 p-1 bg-neut-100 rounded-2xl w-fit">
          {["All", "Pending", "Processing", "In Transit", "Delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab ? "bg-white text-neut-900 shadow-startup-soft" : "text-neut-500 hover:text-neut-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group flex-1 lg:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400" />
            <Input 
              placeholder="Search by ID or product..." 
              className="pl-11 h-12 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockOrders.filter(o => activeTab === "All" || o.status === activeTab).map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-startup-soft hover:shadow-startup-medium transition-all group overflow-hidden bg-white/80 backdrop-blur-xl relative">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                order.status === 'Delivered' ? 'bg-success' : 
                order.status === 'In Transit' ? 'bg-brand-primary' : 'bg-brand-secondary'
              }`} />
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-neut-50 rounded-2xl flex items-center justify-center text-neut-400 group-hover:bg-brand-secondary group-hover:text-white transition-all shadow-startup-soft">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-neut-900 text-white border-none font-black text-[9px] uppercase tracking-widest">{order.id}</Badge>
                      <span className="text-xs text-neut-400 font-bold">{order.date}</span>
                    </div>
                    <h3 className="text-xl font-black text-neut-900 mb-1">{order.product}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-neut-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {order.cluster} Hub</span>
                      <span className="flex items-center gap-1"><CreditCard size={12} /> Prepaid</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right hidden lg:block">
                    <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">STATUS</p>
                    <div className={`flex items-center gap-2 font-black text-sm uppercase tracking-tighter ${
                      order.status === 'Delivered' ? 'text-success' : 
                      order.status === 'In Transit' ? 'text-brand-primary' : 'text-brand-secondary'
                    }`}>
                      {order.status === 'Delivered' ? <CheckCircle2 size={16} /> : <Truck size={16} />}
                      {order.status}
                    </div>
                  </div>
                  <div className="text-right items-end justify-end flex flex-col">
                    <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1 text-right">VOLUME</p>
                    <p className="font-black text-neut-900 text-right">{order.qty}</p>
                    <p className="text-2xl font-black text-neut-900 mt-2">{order.total}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-12 w-12 rounded-2xl border-neut-100 hover:bg-white shadow-startup-soft">
                      <Download size={20} />
                    </Button>
                    <Button variant="gradient" size="sm" className="h-12 px-6 rounded-2xl font-bold bg-neut-900 hover:bg-black text-white">
                      Track <ArrowUpRight size={18} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
