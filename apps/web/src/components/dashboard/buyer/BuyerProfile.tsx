"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Globe, ShieldCheck, Mail, Phone, MapPin, CreditCard, PieChart, Briefcase, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function BuyerProfile() {
  return (
    <div className="space-y-8 animate-fade-in w-full pb-20 text-neut-900">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="startup-headline text-3xl font-black flex items-center gap-3">
            Company Profile
            <Building2 className="text-brand-secondary" size={28} />
          </h2>
          <p className="text-neut-500 font-medium">Manage corporate identity, procurement preferences, and billing</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-neut-200">
             Export Corporate Data
           </Button>
           <Button variant="gradient" className="h-12 px-8 rounded-xl font-bold">
             Save Changes
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Corporate Identity */}
          <Card className="border-none shadow-startup-soft bg-white p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Globe size={180} />
            </div>
            <CardHeader className="p-0 mb-10 flex flex-row items-center gap-8">
              <div className="h-24 w-24 bg-neut-950 rounded-3xl flex items-center justify-center text-white shadow-startup-medium">
                <Briefcase size={40} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black leading-tight">Global Agro Mart</h3>
                  <Badge className="bg-brand-secondary/10 text-brand-secondary border-none font-bold text-[9px] px-3 py-1 uppercase tracking-widest">Enterprise Buyer</Badge>
                </div>
                <p className="text-neut-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} /> Tech Hub, Bangalore, India
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neut-400">CORPORATE NAME</label>
                <Input defaultValue="Global Agro Mart Pvt Ltd" className="h-12 rounded-xl bg-neut-50 border-none shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neut-400">TAX IDENTIFIER (GSTIN)</label>
                <Input defaultValue="29AAAAA0000A1Z5" className="h-12 rounded-xl bg-neut-50 border-none shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neut-400">PRIMARY CONTACT</label>
                <Input defaultValue="Rahul Sharma (Procurement Head)" className="h-12 rounded-xl bg-neut-50 border-none shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neut-400">CORPORATE EMAIL</label>
                <Input defaultValue="procurement@globalagromart.com" className="h-12 rounded-xl bg-neut-50 border-none shadow-inner" />
              </div>
            </CardContent>
          </Card>

          {/* Billing Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-startup-soft bg-white p-8">
               <CardHeader className="p-0 mb-6 flex justify-between flex-row items-center text-neut-900">
                 <CardTitle className="text-lg font-black flex items-center gap-2">
                   <CreditCard size={20} className="text-brand-secondary" /> Payment Methods
                 </CardTitle>
                 <Plus size={18} className="text-neut-300 hover:text-brand-secondary cursor-pointer" />
               </CardHeader>
               <div className="space-y-4">
                 <div className="p-6 bg-neut-900 rounded-3xl text-white space-y-4 shadow-startup-soft">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-neut-500 uppercase tracking-widest">PRIMARY CARD</span>
                       <Building2 size={16} className="text-neut-500" />
                    </div>
                    <div className="text-xl font-black tracking-widest">XXXX XXXX XXXX 4402</div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span>GLOBAL AGRO LTD</span>
                       <span>12/26</span>
                    </div>
                 </div>
               </div>
            </Card>

            <Card className="border-none shadow-startup-soft bg-white p-8">
               <CardHeader className="p-0 mb-6 flex justify-between flex-row items-center text-neut-900">
                 <CardTitle className="text-lg font-black flex items-center gap-2">
                   <MapPin size={20} className="text-brand-secondary" /> Billing Nodes
                 </CardTitle>
                 <Plus size={18} className="text-neut-300 hover:text-brand-secondary cursor-pointer" />
               </CardHeader>
               <div className="space-y-4">
                 <div className="p-5 border border-neut-100 rounded-2xl space-y-2">
                    <h5 className="font-bold text-sm">H01 - Main Warehouse</h5>
                    <p className="text-xs text-neut-500 leading-relaxed">Level 4, Sector 12, Whitefield, Bangalore 560066</p>
                    <Badge className="bg-neut-900 text-white border-none font-bold text-[8px] uppercase tracking-widest">Primary</Badge>
                 </div>
               </div>
            </Card>
          </div>
        </div>

        {/* Procurement Analytics */}
        <div className="space-y-8">
          <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-10 h-full">
            <CardHeader className="p-0 mb-10">
              <CardTitle className="text-xl font-black flex items-center gap-4">
                Buying Power
                <ShieldCheck className="text-brand-secondary" size={24} />
              </CardTitle>
            </CardHeader>
            <div className="space-y-12">
               <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neut-500 leading-tight">ACTIVE CREDIT LIMIT</span>
                  <div className="text-4xl font-black mt-2 text-white">₹2,50,00,000</div>
                  <Progress value={65} className="h-1.5 mt-4" />
                  <p className="text-[10px] font-bold text-neut-500 mt-2 uppercase tracking-widest">65% Utilized for Q2 Operations</p>
               </div>

               <div className="grid grid-cols-2 gap-6">
                 {[ 
                   { label: "Successful Rounds", val: 142 },
                   { label: "Payment Index", val: 99.8 }
                 ].map((s) => (
                   <div key={s.label} className="p-5 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-[9px] font-black text-neut-500 uppercase tracking-widest leading-none">{s.label}</span>
                     <div className="text-xl font-black mt-2">{s.val}{s.label.includes('Index') ? '%' : ''}</div>
                   </div>
                 ))}
               </div>

               <div className="pt-8 border-t border-white/10">
                 <Button variant="outline" className="w-full h-11 border-white/10 hover:bg-white/5 text-white font-black rounded-xl">
                   View Compliance Log
                 </Button>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
