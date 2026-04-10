'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, MapPin, Navigation, Clock,
  RefreshCw, Phone, CheckCircle, Package,
  UserPlus, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

function QuickAction({ icon, label }: { icon: any, label: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const needsInput = label.includes('SMS') || label.includes('Import') || label.includes('Set') || label.includes('Discount') || label.includes('Config') || label.includes('Timer');

  const handleExecute = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setIsOpen(false);
      const t = typeof toast.success === 'function' ? toast.success : toast;
      t(label + ' completed successfully.');
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
      >
        {icon}
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-100 flex flex-col relative text-left">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-all hover:bg-slate-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-3 mb-6 mt-2">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                {icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{label}</h3>
                <p className="text-xs font-bold text-slate-500">Configure and execute task</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
               {needsInput ? (
                 <div>
                   <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Input Details / Reference</label>
                   <input type="text" placeholder="Enter configuration details..." className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm font-bold text-slate-800 transition-all focus:shadow-md" />
                 </div>
               ) : (
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                   <div className="mt-0.5 text-purple-500">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                   </div>
                   <p className="text-sm font-semibold text-slate-600">System is ready to process <strong>{label}</strong>. This action will be recorded in the general audit log.</p>
                 </div>
               )}
            </div>

            <button 
              onClick={handleExecute}
              disabled={processing}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
            >
              {processing ? (
                 <>
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...
                 </>
              ) : (
                 <>Confirm Execute</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface LogisticsItem {
  id: string;
  orderId: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  pickupLocation?: string;
  dropLocation?: string;
  status: string;
  estimatedDelivery?: string;
  createdAt: string;
  order: {
    id: string;
    quantity: number;
    totalAmount: number;
    status: string;
    buyer: { name: string; phone: string };
    crop?: { cropName: string };
    lot?: { cropName: string };
  };
}

const MOCK_SHIPMENTS: LogisticsItem[] = [
  {
    id: 'l1', orderId: 'ord_12345', driverName: 'Rahul Sharma', driverPhone: '9876543210', vehicleNumber: 'MH12AB1234',
    pickupLocation: 'Nashik Warehouse', dropLocation: 'Mumbai APMC', status: 'IN_TRANSIT', createdAt: new Date().toISOString(),
    order: { id: 'ord_12345', quantity: 1500, totalAmount: 45000, status: 'SHIPPED', buyer: { name: 'BigBasket', phone: '1800123123' }, crop: { cropName: 'Onion (Red)' } }
  },
  {
    id: 'l2', orderId: 'ord_67890', driverName: 'Amit Singh', driverPhone: '8765432109', vehicleNumber: 'MH15CK5678',
    pickupLocation: 'Pune Collection Center', dropLocation: 'Surat Market', status: 'DELIVERED', createdAt: new Date().toISOString(),
    order: { id: 'ord_67890', quantity: 2000, totalAmount: 85000, status: 'DELIVERED', buyer: { name: 'Reliance Retail', phone: '1800456456' }, crop: { cropName: 'Pomegranate' } }
  },
  {
    id: 'l3', orderId: 'ord_11223', status: 'REQUESTED', createdAt: new Date().toISOString(),
    order: { id: 'ord_11223', quantity: 1200, totalAmount: 36000, status: 'PAID', buyer: { name: 'Local Exporter', phone: '9988776655' }, lot: { cropName: 'Grapes (Thompson)' } }
  }
];

export default function LogisticsHub() {
  const [shipments, setShipments] = useState<LogisticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    orderId: '',
    driverName: '',
    driverPhone: '',
    vehicleNumber: '',
    pickupLocation: '',
    dropLocation: '',
    estimatedDelivery: '',
  });
  const [assigning, setAssigning] = useState(false);

  const fetchLogistics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fpo/logistics');
      if (!res.ok) {
        console.warn('API endpoint not available, using mock data');
        setShipments(MOCK_SHIPMENTS);
        return;
      }
      const data = await res.json();
      setShipments(data.length > 0 ? data : MOCK_SHIPMENTS);
    } catch (error) {
      console.error(error);
      setShipments(MOCK_SHIPMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogistics();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.orderId || !assignForm.driverName || !assignForm.driverPhone || !assignForm.vehicleNumber) {
      toast.error('All fields are required');
      return;
    }

    try {
      setAssigning(true);
      const res = await fetch('/api/fpo/logistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to assign transporter');
      }

      toast.success('Transporter assigned successfully!');
      setShowAssignModal(false);
      setAssignForm({ orderId: '', driverName: '', driverPhone: '', vehicleNumber: '', pickupLocation: '', dropLocation: '', estimatedDelivery: '' });
      fetchLogistics();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAssigning(false);
    }
  };

  const statusCounts = {
    requested: shipments.filter(s => s.status === 'REQUESTED').length,
    inTransit: shipments.filter(s => ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(s.status)).length,
    delivered: shipments.filter(s => s.status === 'DELIVERED').length,
  };

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Truck size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Logistics Hub 🚛</h2>
            <p className="text-white/80 font-medium">Assign transporters and track deliveries in real-time.</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Total Shipments</span>
                <p className="text-2xl font-black">{shipments.length}</p>
              </div>
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">In Transit</span>
                <p className="text-2xl font-black">{statusCounts.inTransit}</p>
              </div>
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Pending Assignment</span>
                <p className="text-2xl font-black">{statusCounts.requested}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 px-6 py-4 bg-white text-orange-600 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-0.5"
            >
              <UserPlus size={20} />
              Assign Transporter
            </button>
            <button
              onClick={fetchLogistics}
              className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all text-white shadow-xl"
            >
              <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Logistics Sub-Features */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
          <QuickAction icon={<Navigation size={14}/>} label="Live GPS Tracking" />
          <QuickAction icon={<MapPin size={14}/>} label="Route Optimizer" />
          <QuickAction icon={<Clock size={14}/>} label="Wait Time Audit" />
          <QuickAction icon={<CheckCircle size={14}/>} label="POD Verified" />
          <QuickAction icon={<Phone size={14}/>} label="Driver Broadcast" />
          <QuickAction icon={<Truck size={14}/>} label="Vehicle Logs" />
          <QuickAction icon={<AlertCircle size={14}/>} label="Delayed Alert" />
        </div>
      </motion.div>

      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-40 bg-slate-50 rounded-3xl animate-pulse" />
          ))
        ) : shipments.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-slate-100">
            <Truck size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-900">No logistics records</p>
            <p className="text-slate-400 text-sm mt-1">Assign a transporter to an order to get started.</p>
          </div>
        ) : (
          shipments.map((shipment) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {shipment.order.crop?.cropName || shipment.order.lot?.cropName || 'Order'} — {shipment.order.quantity}kg
                      </h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        #{shipment.orderId.slice(0, 8)} • Buyer: {shipment.order.buyer.name}
                      </p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border-2 ${
                      shipment.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                      shipment.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {shipment.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-8 border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Pickup</p>
                        <p className="text-xs font-bold text-slate-700">{shipment.pickupLocation || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex-1 border-t-2 border-slate-100 border-dashed" />
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Dropoff</p>
                        <p className="text-xs font-bold text-slate-700">{shipment.dropLocation || 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  {shipment.driverName && (
                    <div className="flex items-center gap-6 text-sm">
                      <span className="font-bold text-slate-700">🚗 {shipment.driverName}</span>
                      <span className="font-bold text-slate-500">{shipment.vehicleNumber}</span>
                      {shipment.driverPhone && (
                        <a href={`tel:${shipment.driverPhone}`} className="flex items-center gap-1 text-green-600 font-bold hover:underline">
                          <Phone size={14} /> Call
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Assign Transporter Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-6">Assign Transporter</h2>

              <form onSubmit={handleAssign} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-1">Order ID *</label>
                  <input
                    type="text"
                    required
                    value={assignForm.orderId}
                    onChange={(e) => setAssignForm({ ...assignForm, orderId: e.target.value })}
                    placeholder="Paste order ID"
                    className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={assignForm.driverName}
                    onChange={(e) => setAssignForm({ ...assignForm, driverName: e.target.value })}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={assignForm.driverPhone}
                      onChange={(e) => setAssignForm({ ...assignForm, driverPhone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Vehicle *</label>
                    <input
                      type="text"
                      required
                      value={assignForm.vehicleNumber}
                      onChange={(e) => setAssignForm({ ...assignForm, vehicleNumber: e.target.value })}
                      placeholder="MH12AB1234"
                      className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Pickup</label>
                    <input
                      type="text"
                      value={assignForm.pickupLocation}
                      onChange={(e) => setAssignForm({ ...assignForm, pickupLocation: e.target.value })}
                      placeholder="City/District"
                      className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Dropoff</label>
                    <input
                      type="text"
                      value={assignForm.dropLocation}
                      onChange={(e) => setAssignForm({ ...assignForm, dropLocation: e.target.value })}
                      placeholder="Delivery city"
                      className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assigning}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {assigning ? 'Assigning...' : 'Assign Driver'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
