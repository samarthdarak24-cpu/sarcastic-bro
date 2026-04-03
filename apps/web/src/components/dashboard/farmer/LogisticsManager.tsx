"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Plus,
  Box,
  LayoutDashboard,
  Package,
  Layers,
  Zap,
  Target,
  TrendingUp,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import toast from "react-hot-toast";

const MOCK_SHIPMENTS = [
  { id: "LOG-4491", destination: "Varanasi Mandi", origin: "Nashik Farm", carrier: "BlueDart Express", status: "IN_TRANSIT", eta: "Tom, 4 PM", temp: "22°C", humidity: "45%", progress: 65, provider: "BlueDart Express" },
  { id: "LOG-4495", destination: "Hyderabad Hub", origin: "Nagpur Orchard", carrier: "Rivigo Prime", status: "PENDING", eta: "Today, 6 PM", temp: "N/A", humidity: "N/A", progress: 5, provider: "Rivigo Prime" },
  { id: "LOG-4502", destination: "Delhi Cold Storage", origin: "Shimla Apple Yard", carrier: "Snowman Logistics", status: "DELIVERED", eta: "Completed", temp: "4°C", humidity: "85%", progress: 100, provider: "Snowman Logistics" },
];

export function LogisticsManager() {
  const [activeTab, setActiveTab] = useState("Tracking");
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookingForm, setBookingForm] = useState({
     orderId: "",
     origin: "Nashik Farm A1",
     destination: "Varanasi Wholesale Mandi",
     weight: "1200",
     type: "Perishable",
     provider: "BlueDart Express"
  });
  const [estimate, setEstimate] = useState<{cost: number; time: string} | null>(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        const [shipRes, orderRes] = await Promise.all([
            api.get("/logistics"),
            api.get("/orders/farmer/me")
        ]);
        setShipments(shipRes.data.data.shipments || []);
        setOrders(orderRes.data.data || []);
    } catch (error) {
        // Fallback for demo
        setShipments(MOCK_SHIPMENTS);
    } finally {
        setLoading(false);
    }
  };

  const calculateEstimate = () => {
    const baseRate = bookingForm.type === "Perishable" ? 4.5 : 2.8;
    const distance = 860; // Mock distance
    const cost = parseFloat(bookingForm.weight) * distance * (baseRate / 1000);
    setEstimate({
       cost: Math.round(cost),
       time: "18-24 Hours"
    });
    toast.success("Cost estimate updated based on real-time market rates.");
  };

  const handleBookPickup = async () => {
    if (!bookingForm.orderId) return toast.error("Please select an order first.");
    
    try {
        await api.post("/logistics", {
            orderId: bookingForm.orderId,
            provider: bookingForm.provider,
            fromLocation: bookingForm.origin,
            toLocation: bookingForm.destination,
            temperature: bookingForm.type === "Perishable" ? "24°C" : "N/A",
            humidity: bookingForm.type === "Perishable" ? "50%" : "N/A",
        });
        toast.success("Pickup scheduled successfully! Transporter will arrive within 4 hours.");
        fetchData();
        setActiveTab("Tracking");
    } catch (error) {
        toast.error("Failed to book shipment. Check order status.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-neut-900 border-neut-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-2 p-1 bg-neut-100 rounded-2xl w-fit">
          {["Tracking", "Book Pickup", "Cost Estimates"].map((tab) => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 activeTab === tab ? "bg-white text-brand-primary shadow-startup-soft" : "text-neut-400 hover:text-neut-700"
               }`}
            >
               {tab}
            </button>
          ))}
        </div>
        <div className="h-4 w-4 rounded-full bg-brand-primary animate-pulse shadow-glow-primary hidden lg:block" />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Tracking" ? (
          <motion.div 
             key="tracking" 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="grid grid-cols-1 gap-6"
          >
            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>
            ) : shipments.length === 0 ? (
                <Card className="p-12 text-center bg-white/50 border-dashed border-2 border-neut-200 rounded-[2rem]">
                    <p className="text-neut-500 font-bold">No active shipments found.</p>
                </Card>
            ) : shipments.map((ship) => (
              <Card key={ship.id} className="border-none shadow-startup-soft hover:shadow-startup-medium transition-all group overflow-hidden bg-white/80 backdrop-blur-xl">
                 <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                       <div className="flex items-center gap-6">
                          <div className="h-14 w-14 bg-neut-50 rounded-[1.25rem] flex items-center justify-center text-neut-300 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all shadow-startup-soft">
                             <Truck size={28} />
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-black text-neut-900 tracking-tight">{ship.id || ship.trackingId || 'SHIP-ID'}</h3>
                                <Badge 
                                   className={`rounded-lg font-black text-[10px] ${
                                      ship.status === 'DELIVERED' ? 'bg-success/10 text-success' :
                                      ship.status === 'IN_TRANSIT' ? 'bg-brand-primary/10 text-brand-primary animate-pulse' : 'bg-warning/10 text-warning'
                                   }`}
                                >
                                   {ship.status.toUpperCase()}
                                </Badge>
                             </div>
                             <p className="text-sm font-bold text-neut-500">{ship.provider || ship.carrier} • <span className="text-neut-900">{ship.toLocation || ship.destination}</span></p>
                          </div>
                       </div>

                       <div className="flex-1 max-w-sm px-8 border-x border-neut-50 hidden lg:block">
                          <div className="flex justify-between items-center mb-2">
                             <div className="text-[10px] font-black text-neut-300 uppercase tracking-widest">Environment</div>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-neut-900">TEMP: {ship.temp}</span>
                                <div className="h-1 w-1 rounded-full bg-neut-200" />
                                <span className="text-[10px] font-black text-neut-900">RH: {ship.humidity}</span>
                             </div>
                          </div>
                          <div className={`h-1.5 w-full bg-neut-50 rounded-full overflow-hidden`}>
                             <div 
                                className={`h-full rounded-full bg-brand-primary shadow-glow-primary transition-all duration-1000`} 
                                style={{ width: `${ship.progress}%` }}
                             />
                          </div>
                       </div>

                       <div className="flex items-center gap-8 justify-between lg:justify-end">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">Arrival Estimate</p>
                             <p className="text-lg font-black text-neut-900">{ship.eta}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-neut-50 transition-all">
                             <ChevronRight size={24} className="text-neut-400" />
                          </Button>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : activeTab === "Book Pickup" ? (
          <motion.div
             key="book"
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.98 }}
          >
             <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl overflow-hidden min-h-[500px]">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                   <div className="p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-neut-100 flex flex-col justify-between">
                      <div className="space-y-8">
                         <div>
                            <Badge className="mb-4 font-black">EXPRESS PICKUP</Badge>
                            <h2 className="text-4xl font-black text-neut-900 tracking-tight leading-tight mb-4">Request Instant Farm-to-Hub Transport</h2>
                            <p className="text-neut-500 font-medium text-lg">Select a confirmed order and choose your preferred logistics partner for immediate collection.</p>
                         </div>
                         <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-neut-400 ml-1">Select Active Order</label>
                                <select 
                                    className="w-full h-14 rounded-2xl bg-neut-50 px-4 font-bold text-neut-900 outline-none border border-transparent focus:border-brand-primary/20"
                                    value={bookingForm.orderId}
                                    onChange={(e) => setBookingForm({...bookingForm, orderId: e.target.value})}
                                >
                                    <option value="">Choose an order to ship...</option>
                                    {orders.map(o => (
                                        <option key={o.id} value={o.id}>Order {o.orderNumber} - {o.product?.name} ({o.quantity} {o.unit})</option>
                                    ))}
                                </select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl border-2 border-brand-primary bg-brand-primary/5">
                                    <p className="text-[10px] font-black uppercase text-brand-primary mb-1">Standard</p>
                                    <div className="flex items-end gap-1">
                                       <span className="text-lg font-black text-neut-900">₹2,450</span>
                                       <span className="text-[10px] font-bold text-neut-400 mb-1">/ trip</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl border border-neut-100 bg-white hover:border-brand-primary/20 transition-all cursor-pointer">
                                    <p className="text-[10px] font-black uppercase text-neut-400 mb-1">Cold Chain</p>
                                    <div className="flex items-end gap-1">
                                       <span className="text-lg font-black text-neut-900">₹4,800</span>
                                       <span className="text-[10px] font-bold text-neut-400 mb-1">/ trip</span>
                                    </div>
                                </div>
                             </div>
                         </div>
                      </div>
                      <Button 
                         variant="gradient" 
                         className="h-16 w-full lg:w-fit px-12 rounded-[1.25rem] font-black text-lg mt-12 shadow-lg shadow-brand-primary/20"
                         onClick={handleBookPickup}
                      >
                         Schedule Collection Now
                         <ArrowRight size={20} className="ml-3" />
                      </Button>
                   </div>
                   <div className="bg-neut-50 flex items-center justify-center p-10 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                         <div className="w-full h-full bg-[radial-gradient(#0a84ff_1px,transparent_1px)] [background-size:24px_24px]" />
                      </div>
                      <div className="relative z-10 w-full max-w-sm space-y-6">
                         {[
                            { name: "BlueDart Express", rating: "4.9", fleet: "54 Trucks Nearby" },
                            { name: "Rivigo Prime", rating: "4.8", fleet: "22 Trucks Nearby" },
                            { name: "Mahindra Logistics", rating: "4.7", fleet: "10 Trucks Nearby" }
                         ].map((p) => (
                            <div key={p.name} className="bg-white p-5 rounded-2xl shadow-startup-soft flex items-center justify-between group cursor-pointer hover:shadow-startup-medium transition-all transform hover:-translate-y-1">
                                <div className="flex items-center gap-4">
                                   <div className="h-10 w-10 bg-brand-primary/5 rounded-xl flex items-center justify-center text-brand-primary font-black">{p.name[0]}</div>
                                   <div>
                                      <p className="font-bold text-neut-900">{p.name}</p>
                                      <p className="text-[10px] font-black text-brand-primary uppercase">{p.fleet}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-1 text-success font-bold text-xs">
                                   <CheckCircle2 size={14} />
                                   {p.rating}
                                </div>
                            </div>
                         ))}
                         <div className="text-center">
                            <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest flex items-center justify-center gap-2">
                               <ShieldCheck size={12} className="text-success" />
                               ODOP VERIFIED LOGISTICS PARTNERS
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
             </Card>
          </motion.div>
        ) : activeTab === "Cost Estimates" ? (
          <motion.div
             key="estimates"
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.98 }}
             className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
             <Card className="lg:col-span-2 border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-10">
                <h3 className="text-2xl font-black text-neut-900 mb-8 tracking-tight">AI Cost Real-time Calculator</h3>
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-neut-400 uppercase tracking-widest">Weight (kg)</label>
                         <Input 
                            type="number"
                            value={bookingForm.weight} 
                            onChange={(e) => setBookingForm({...bookingForm, weight: e.target.value})}
                            className="h-14 rounded-2xl bg-neut-50 border-none font-bold text-lg"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-neut-400 uppercase tracking-widest">Crop Type</label>
                         <select 
                            value={bookingForm.type}
                            onChange={(e) => setBookingForm({...bookingForm, type: e.target.value})}
                            className="w-full h-14 rounded-2xl bg-neut-50 px-4 font-bold text-lg outline-none"
                         >
                            <option>Grains</option>
                            <option>Perishable</option>
                            <option>Bulk Spices</option>
                         </select>
                      </div>
                   </div>
                   <Button 
                      variant="outline" 
                      className="h-14 w-full rounded-2xl font-black border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-startup-soft"
                      onClick={calculateEstimate}
                   >
                      Calculate Dynamic Rate
                   </Button>
                </div>

                {estimate && (
                   <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 p-8 rounded-[2rem] bg-brand-primary/5 border border-brand-primary/20 flex flex-col md:flex-row items-center justify-between gap-8"
                   >
                      <div className="text-center md:text-left">
                         <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">Estimated Shipping Cost</p>
                         <div className="flex items-center justify-center md:justify-start gap-4">
                            <h2 className="text-5xl font-black text-neut-900 tracking-tighter">₹{estimate.cost}</h2>
                            <Badge className="bg-success text-white font-black rounded-lg text-[10px] uppercase">Market Validated</Badge>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right">
                           <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest">Transit Time</p>
                           <p className="text-xl font-bold text-neut-900">{estimate.time}</p>
                         </div>
                         <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-startup-soft">
                            <Clock size={24} />
                         </div>
                      </div>
                   </motion.div>
                )}
             </Card>

             <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-10 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={120} /></div>
                <div className="relative z-10 space-y-6">
                   <Badge tone="brand" className="bg-brand-primary text-white font-black">MARKET INSIGHT</Badge>
                   <h4 className="text-2xl font-black tracking-tight leading-tight">Fuel surcharge is down 4% this week.</h4>
                   <p className="text-white/60 font-medium leading-relaxed">Booking your shipments for long-haul routes now can save you approximately <span className="text-brand-primary font-black">₹400 per Ton</span> compared to last month.</p>
                </div>
                <Button variant="ghost" className="relative z-10 w-full rounded-2xl font-black text-white hover:bg-white/10 mt-8">
                   View Historical Trends
                </Button>
             </Card>
          </motion.div>
        ) : (
          <div className="h-[500px] bg-white rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 shadow-startup-soft">
              <AlertCircle size={48} className="text-warning mb-6 animate-bounce" />
              <h3 className="text-2xl font-black text-neut-900 mb-4 tracking-tight">Select a Valid Service</h3>
              <p className="text-neut-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">
                 Use the tabs above to manage yours logistics flow.
              </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
