"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  History,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Activity,
  Calculator,
  Plus,
  Info,
  Layers,
  Search
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/services/api";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  CLAIMED: "bg-amber-500",
  EXPIRED: "bg-neut-400",
  CANCELLED: "bg-red-500",
};

export function PriceProtectionHub() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  
  // Form state
  const [selectedProduct, setSelectedProduct] = useState("");
  const [insuredPrice, setInsuredPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [calculation, setCalculation] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [polRes, prodRes] = await Promise.all([
        api.get("/finance/insurance/my-policies"),
        api.get("/products/farmer/me"),
      ]);
      setPolicies(polRes.data.data);
      setProducts(prodRes.data.data);
    } catch {
      // Fallback for demo
      setPolicies(MOCK_POLICIES);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!insuredPrice || !quantity) return;
    try {
      const res = await api.post("/finance/insurance/calculate", {
        price: parseFloat(insuredPrice),
        quantity: parseFloat(quantity)
      });
      setCalculation(res.data.data);
    } catch {
      // Mock calculation for demo
      const total = parseFloat(insuredPrice) * parseFloat(quantity);
      setCalculation({ totalValue: total, premium: total * 0.025, rate: 2.5 });
    }
  };

  const handleCreatePolicy = async () => {
    if (!selectedProduct || !insuredPrice || !quantity) return;
    setSaving(true);
    try {
      await api.post("/finance/insurance/policy", {
        productId: selectedProduct,
        insuredPrice: parseFloat(insuredPrice),
        quantity: parseFloat(quantity),
        durationDays: 90
      });
      toast.success("Price Protection Policy Active! 🛡️");
      setCalculation(null);
      setSelectedProduct("");
      setInsuredPrice("");
      setQuantity("");
      fetchData();
    } catch {
      toast.error("Failed to create policy");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in text-neut-900">
      {/* Hero Header */}
      <Card className="border-none shadow-startup-soft bg-startup-gradient text-white p-12 rounded-[3.5rem] overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <Badge tone="brand" className="mb-4 font-black">PRICE PROTECTION ENGINE v2.0</Badge>
          <h2 className="text-5xl font-black tracking-tighter leading-none mb-4">
            Insure Your Harvest <br />
            Against <span className="text-brand-secondary italic">Market Crashes.</span>
          </h2>
          <p className="text-white/60 font-bold text-lg max-w-lg leading-relaxed">
            Specify your minimum floor price. If the Mandi price drops below it, we payout the difference instantly. No paperwork, just protection.
          </p>
        </div>
        <ShieldCheck size={300} className="absolute -right-12 -bottom-12 text-white opacity-5 rotate-12" />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Protection Form */}
        <div className="xl:col-span-2 space-y-10">
          <Card className="border-none shadow-startup-soft bg-white p-10 rounded-[3rem] outline outline-4 outline-neut-50">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-12 w-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                <Plus size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight">New Protection Policy</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neut-400 uppercase tracking-widest ml-1">Select Crop Cluster</label>
                <Select onValueChange={setSelectedProduct} value={selectedProduct}>
                  <SelectTrigger className="h-14 rounded-2xl border-neut-100 font-bold hover:border-brand-primary/30 transition-all bg-neut-50/50">
                    <SelectValue placeholder="Choose product..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="rounded-xl font-bold">
                        {p.name} ({p.quantity} {p.unit} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-neut-400 uppercase tracking-widest ml-1">Guaranteed Floor Price (per unit)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-300" size={18} />
                  <Input
                    placeholder="e.g. 45"
                    className="h-14 pl-12 rounded-2xl border-neut-100 font-bold bg-neut-50/50"
                    value={insuredPrice}
                    onChange={(e) => setInsuredPrice(e.target.value)}
                    onBlur={handleCalculate}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-neut-400 uppercase tracking-widest ml-1">Total Quantity to Insure</label>
                <Input
                  placeholder="e.g. 500"
                  className="h-14 rounded-2xl border-neut-100 font-bold bg-neut-50/50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onBlur={handleCalculate}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-neut-400 uppercase tracking-widest ml-1">Coverage Duration</label>
                <Badge tone="ink" className="h-14 w-full justify-center rounded-2xl font-black text-lg opacity-50 bg-neut-100 text-neut-400 border-none">
                  90 DAYS (STANDARD)
                </Badge>
              </div>
            </div>

            {calculation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-8 bg-brand-primary/5 rounded-[2.5rem] border border-brand-primary/10"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2">Policy Calculation</p>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-neut-400 uppercase">Insured Value</p>
                        <p className="text-xl font-black text-neut-900">₹{calculation.totalValue.toLocaleString()}</p>
                      </div>
                      <div className="h-8 w-px bg-neut-100" />
                      <div>
                        <p className="text-[10px] font-bold text-neut-400 uppercase">Premium ({calculation.rate}%)</p>
                        <p className="text-xl font-black text-brand-primary">₹{calculation.premium.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreatePolicy}
                    disabled={saving}
                    className="h-14 px-10 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-black shadow-xl shadow-brand-primary/20"
                  >
                    {saving ? "Activating..." : "Activate Protection"}
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Active Policies */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight">Active Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policies.length > 0 ? (
                policies.map((policy, i) => (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="border-none shadow-startup-soft bg-white p-8 rounded-[2.5rem] hover:shadow-xl transition-all relative overflow-hidden group">
                      <div className={`absolute top-0 right-0 h-24 w-24 opacity-5 group-hover:opacity-10 transition-opacity ${STATUS_COLORS[policy.status]}`}>
                         <ShieldCheck size={96} className="m-4" />
                      </div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white ${STATUS_COLORS[policy.status] || "bg-neut-400"}`}>
                          <Lock size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-neut-900">{policy.product?.name || "Product"}</h4>
                          <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest">Policy #{policy.policyNumber?.slice(0, 8)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-[9px] font-black text-neut-300 uppercase tracking-widest">Floor Price</p>
                          <p className="text-lg font-black text-neut-900">₹{policy.insuredPrice}/kg</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-neut-300 uppercase tracking-widest">Insured Qty</p>
                          <p className="text-lg font-black text-neut-900">{policy.quantity} kg</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-neut-50">
                        <Badge tone="brand" className={`rounded-xl font-black text-[9px] ${STATUS_COLORS[policy.status] || "bg-neut-400"}`}>
                           {policy.status}
                        </Badge>
                        <p className="text-[9px] font-bold text-neut-400">Ends {new Date(policy.endDate).toLocaleDateString()}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 h-[200px] flex flex-col items-center justify-center text-center opacity-50 bg-neut-50/50 rounded-[3rem] border border-dashed border-neut-200">
                  <ShieldCheck size={48} className="text-neut-200 mb-4" />
                  <p className="text-neut-400 font-bold italic text-sm">No active policies found.<br />Start protecting your harvest today.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Market Trends & Claims */}
        <aside className="space-y-10">
          <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-between min-h-[350px]">
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <Badge tone="brand" className="h-6 px-3 font-black text-[8px] bg-brand-secondary text-white border-none shrink-0">MARKET PULSE</Badge>
                   <div className="flex items-center gap-2 text-[8px] font-black text-white/40 uppercase tracking-widest">
                      <Activity size={10} className="text-brand-secondary animate-pulse" />
                      Live Feed
                   </div>
                </div>
                <h4 className="text-2xl font-black tracking-tight mb-4 leading-tight">Mandi Volatility <br />Alert ⚠️</h4>
                <p className="text-white/40 text-xs font-medium leading-relaxed">
                   Global spice supply chains are showing 12% increased volatility. Recommend insuring "Caldammon" and "Black Pepper" clusters before next week.
                </p>
             </div>
             <div className="mt-8 space-y-4">
                <MarketStat label="Avg Price Drop" value="-4.2%" trend="down" />
                <MarketStat label="Active Claims" value="124" trend="up" />
                <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                   View Detailed Market Report
                </Button>
             </div>
          </Card>

          <Card className="border-none shadow-startup-soft bg-white p-8 rounded-[3rem] border border-neut-50">
             <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                   <History size={20} />
                </div>
                <h4 className="text-xl font-black tracking-tight">Recent Payouts</h4>
             </div>
             
             <div className="space-y-4">
                {[
                  { id: '1', product: 'Wheat', amount: '₹12,450', date: '2 days ago' },
                  { id: '2', product: 'Rice', amount: '₹8,200', date: '5 days ago' },
                  { id: '3', product: 'Onions', amount: '₹4,100', date: '1 week ago' },
                ].map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-neut-50/50 rounded-2xl hover:bg-neut-50 transition-all border border-transparent hover:border-neut-100">
                     <div>
                        <p className="text-sm font-black text-neut-900">{p.product}</p>
                        <p className="text-[10px] font-bold text-neut-400">{p.date}</p>
                     </div>
                     <p className="font-black text-brand-primary">{p.amount}</p>
                  </div>
                ))}
             </div>

             <div className="mt-8 pt-8 border-t border-neut-50">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                   <CheckCircle2 size={16} className="text-emerald-600" />
                   <div className="text-[10px] font-bold text-emerald-800 leading-tight">
                      Total system payouts this quarter: <span className="font-black">₹18.4 Lakhs</span>
                   </div>
                </div>
             </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function MarketStat({ label, value, trend }: any) {
   return (
      <div className="flex items-center justify-between">
         <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</span>
         <div className="flex items-center gap-2">
            <span className="text-lg font-black">{value}</span>
            {trend === 'down' ? <TrendingDown size={14} className="text-red-400" /> : <TrendingUp size={14} className="text-emerald-400" />}
         </div>
      </div>
   );
}

// Mock Data
const MOCK_POLICIES = [
  { id: '1', policyNumber: 'POL-XP9821', product: { name: 'Basmati Rice' }, insuredPrice: 85, quantity: 1200, totalValue: 102000, premium: 2550, status: 'ACTIVE', endDate: '2025-04-12' },
  { id: '2', policyNumber: 'POL-ZN4421', product: { name: 'Organic Wheat' }, insuredPrice: 42, quantity: 5000, totalValue: 210000, premium: 5250, status: 'CLAIMED', endDate: '2025-01-20' },
];

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Basmati Rice', quantity: 2500, unit: 'kg' },
  { id: 'p2', name: 'Organic Wheat', quantity: 5000, unit: 'kg' },
  { id: 'p3', name: 'Potatoes (A Grade)', quantity: 1500, unit: 'kg' },
];
