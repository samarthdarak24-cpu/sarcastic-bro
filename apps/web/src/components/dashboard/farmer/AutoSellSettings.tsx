"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Clock, 
  TrendingUp,
  Package,
  Activity,
  AlertCircle,
  History,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import api from "@/services/api";
import toast from "react-hot-toast";

export function AutoSellSettings() {
  const [rules, setRules] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  // New Rule Form
  const [formData, setFormData] = useState({
    productId: "",
    minPrice: "",
    quantity: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rulesRes, productsRes] = await Promise.all([
        api.get("/orders/auto-sell/rules"),
        api.get("/products/farmer/me")
      ]);
      setRules(rulesRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/orders/auto-sell/rules", {
        ...formData,
        minPrice: parseFloat(formData.minPrice),
        quantity: parseFloat(formData.quantity)
      });
      toast.success("Auto-Sell rule activated! ⚡");
      setShowAdd(false);
      setFormData({ productId: "", minPrice: "", quantity: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to create rule.");
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await api.delete(`/orders/auto-sell/rules/${id}`);
      toast.success("Rule removed.");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete rule.");
    }
  };

  const triggerMatch = async () => {
    try {
      await api.post("/orders/auto-sell/trigger");
      toast.success("Matching engine triggered manually.");
      fetchData();
    } catch (error) {
      toast.error("Engine failure.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-startup-soft bg-startup-gradient text-white p-6 rounded-[2rem] relative overflow-hidden">
             <div className="relative z-10">
                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                    <Zap size={24} className="animate-pulse" />
                </div>
                <h3 className="text-xl font-black mb-1">Smart Deal Engine</h3>
                <p className="text-white/70 text-xs font-bold">Automated trading is currently ACTIVE</p>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-10">
                <Activity size={160} />
             </div>
        </Card>

        <Card className="border-none shadow-startup-soft bg-white p-6 rounded-[2rem] flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-2">
                <Clock className="text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neut-400">Next Check</span>
             </div>
             <p className="text-2xl font-black text-neut-900 tracking-tighter">In 04:52m</p>
        </Card>

        <Card className="border-none shadow-startup-soft bg-white p-6 rounded-[2rem] flex flex-col justify-center">
              <Button 
                onClick={triggerMatch}
                variant="outline" 
                className="h-full border-2 border-dashed border-neut-100 font-black text-neut-400 rounded-3xl hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                <Play size={20} className="mr-2" /> Trigger Manual Match
              </Button>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-neut-900 tracking-tight">Active Rules</h2>
        <Button 
            onClick={() => setShowAdd(!showAdd)}
            className="rounded-2xl bg-neut-900 hover:bg-neut-800 text-white font-black px-6 shadow-xl shadow-neut-900/20"
        >
            <Plus size={20} className="mr-2" /> Create New Rule
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-none shadow-xl bg-white p-8 rounded-[2.5rem]">
                <form onSubmit={handleCreateRule} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neut-400 ml-1">Select Product</label>
                        <select 
                            className="w-full h-12 bg-neut-50 border-none rounded-xl px-4 font-bold text-sm focus:ring-2 focus:ring-brand-primary outline-none appearance-none"
                            value={formData.productId}
                            onChange={(e) => setFormData({...formData, productId: e.target.value})}
                            required
                        >
                            <option value="">Choose product...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neut-400 ml-1">Min Price (₹)</label>
                        <Input 
                            type="number" 
                            className="h-12 bg-neut-50 border-none rounded-xl px-4 font-bold"
                            value={formData.minPrice}
                            onChange={(e) => setFormData({...formData, minPrice: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neut-400 ml-1">Max Quantity</label>
                        <Input 
                            type="number" 
                            className="h-12 bg-neut-50 border-none rounded-xl px-4 font-bold"
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                            required
                        />
                    </div>
                    <Button type="submit" className="h-12 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-black">
                        Activate Engine
                    </Button>
                </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule) => (
          <motion.div key={rule.id} layout>
            <Card className="border-none shadow-startup-soft bg-white p-8 rounded-[2.5rem] group hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-neut-50 rounded-2xl flex items-center justify-center text-neut-900 shadow-sm border border-neut-50">
                            <Package size={28} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-neut-900 tracking-tight">{rule.product.name}</h4>
                            <p className="text-[10px] font-black uppercase text-neut-400 tracking-widest">Active Smart Rule</p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-neut-400 hover:text-error hover:bg-error/5 rounded-xl"
                    >
                        <Trash2 size={20} />
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-neut-50/50 p-4 rounded-2xl border border-neut-50">
                        <p className="text-[10px] font-black uppercase text-neut-400 tracking-widest mb-1">Threshold</p>
                        <p className="text-xl font-black text-neut-900">₹{rule.minPrice}<span className="text-xs text-neut-400">/unit</span></p>
                    </div>
                    <div className="bg-neut-50/50 p-4 rounded-2xl border border-neut-50">
                        <p className="text-[10px] font-black uppercase text-neut-400 tracking-widest mb-1">Max Bulk</p>
                        <p className="text-xl font-black text-neut-900">{rule.quantity}<span className="text-xs text-neut-400"> units</span></p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-neut-50">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
                        <span className="text-xs font-black text-success uppercase">Listening For Matches</span>
                    </div>
                    <Switch checked={rule.isActive} />
                </div>
            </Card>
          </motion.div>
        ))}

        {rules.length === 0 && !loading && (
             <div className="md:col-span-2 h-[300px] flex flex-col items-center justify-center text-center opacity-50">
                <AlertCircle size={48} className="text-neut-300 mb-4" />
                <p className="text-neut-500 font-bold">No active rules found. <br /> Create one to start automating your sales.</p>
             </div>
        )}
      </div>

      {/* Trigger History Section */}
      <div className="space-y-6 pt-12">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-neut-100 rounded-xl flex items-center justify-center text-neut-400">
                <History className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-black text-neut-900 tracking-tight">Execution History</h3>
        </div>

        <Card className="border-none shadow-startup-soft bg-white p-2 rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neut-50">
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-neut-400 tracking-widest leading-none">Timestamp</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-neut-400 tracking-widest leading-none">Product</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-neut-400 tracking-widest leading-none">Matched Price</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-neut-400 tracking-widest leading-none">Quantity</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-neut-400 tracking-widest leading-none">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neut-50">
                        {MOCK_HISTORY.map((item, idx) => (
                            <tr key={idx} className="group hover:bg-neut-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-neut-900">{item.timestamp}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-brand-primary/5 rounded-lg flex items-center justify-center text-brand-primary">
                                            <Package size={14} />
                                        </div>
                                        <p className="text-sm font-black text-neut-900">{item.product}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-black text-neut-900 text-sm">₹{item.price}</td>
                                <td className="px-8 py-6 text-sm font-bold text-neut-500">{item.quantity} kg</td>
                                <td className="px-8 py-6">
                                    <Badge tone="brand" className="rounded-lg h-6 px-3 font-black text-[9px] bg-brand-primary/10 text-brand-primary border-none">
                                        SUCCESSFUL MATCH
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-8 bg-neut-50/30 border-t border-neut-50 text-center">
                <Button variant="ghost" className="text-neut-400 font-black text-xs hover:bg-transparent hover:text-brand-primary">
                    VIEW ALL HISTORICAL TRIGGERS <ArrowRight size={14} className="ml-2" />
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
}

const MOCK_HISTORY = [
    { timestamp: "2024-11-04 14:12", product: "Organic Wheat", price: 42.50, quantity: 500, status: "SUCCESS" },
    { timestamp: "2024-11-02 09:45", product: "Tomato (Grade A)", price: 28.00, quantity: 200, status: "SUCCESS" },
    { timestamp: "2024-10-28 16:30", product: "Basmati Rice", price: 92.00, quantity: 1000, status: "SUCCESS" },
];
