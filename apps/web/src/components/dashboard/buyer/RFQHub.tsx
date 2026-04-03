"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, FileText, CheckCircle2, Clock, XCircle, MoreVertical, Filter, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const mockRFQs = [
  { id: "RFQ-2024-001", title: "Bulk Organic Wheat - Cluster A", status: "Published", responses: 12, date: "2024-04-01", budget: "₹12,00,000" },
  { id: "RFQ-2024-002", title: "Premium Saffron Grade 1", status: "Draft", responses: 0, date: "2024-04-02", budget: "₹5,50,000" },
  { id: "RFQ-2024-003", title: "Dehydrated Onion Flakes", status: "Closed", responses: 45, date: "2024-03-28", budget: "₹8,00,000" },
  { id: "RFQ-2024-004", title: "Frozen Mango Pulp - Bulk", status: "Published", responses: 8, date: "2024-04-03", budget: "₹15,00,000" },
];

export function RFQHub() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-2 p-1 bg-neut-100 rounded-2xl w-fit">
          {["All", "Published", "Draft", "Closed"].map((tab) => (
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

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400 group-focus-within:text-brand-secondary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter RFQs..." 
              className="h-12 w-64 glass-card pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-secondary/20 border-neut-100" 
            />
          </div>
          <Button variant="gradient" className="h-12 px-6 rounded-xl">
            <Plus size={20} className="mr-2" />
            Create new RFQ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockRFQs.filter(rfq => activeTab === "All" || rfq.status === activeTab).map((rfq, i) => (
          <motion.div
            key={rfq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-none shadow-startup-soft hover:shadow-startup-medium transition-all group overflow-hidden bg-white/80 backdrop-blur-xl">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    rfq.status === 'Published' ? 'bg-brand-primary/10 text-brand-primary' :
                    rfq.status === 'Draft' ? 'bg-brand-secondary/10 text-brand-secondary' : 'bg-neut-100 text-neut-400'
                  }`}>
                    <FileText size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-black uppercase tracking-widest text-neut-400">{rfq.id}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        rfq.status === 'Published' ? 'bg-success/10 text-success' :
                        rfq.status === 'Draft' ? 'bg-brand-secondary/10 text-brand-secondary' : 'bg-neut-200 text-neut-600'
                      }`}>
                        {rfq.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-neut-900 group-hover:text-brand-secondary transition-colors">{rfq.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-bold text-neut-400 uppercase tracking-widest mb-1">Responses</p>
                    <p className="font-black text-neut-900">{rfq.responses} Leads</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-neut-400 uppercase tracking-widest mb-1">Target Budget</p>
                    <p className="font-black text-neut-900">{rfq.budget}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <MoreVertical size={20} className="text-neut-400" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl hover:bg-brand-secondary hover:text-white border-neut-200">
                      <ArrowUpRight size={20} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 text-center">
        <p className="text-neut-400 text-sm font-medium">Showing 4 of 28 total requests. <button className="text-brand-secondary font-bold hover:underline">Load more history</button></p>
      </div>
    </div>
  );
}
