"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, TrendingDown, Lock, Clock, CheckCircle, Plus, X } from "lucide-react";
import { buyerPreBookingService } from "@/services/buyerPreBookingService";
import { buyerBulkProductService } from "@/services/buyerBulkProductService";
import { useSocket } from "@/hooks/useSocket";
import toast from "react-hot-toast";

export function PreBookingHub() {
  const [preBookings, setPreBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bulkProducts, setBulkProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    bulkProductId: '',
    quantity: 0,
    pricePerUnit: 0,
    targetDate: '',
    notes: ''
  });
  const socket = useSocket();

  useEffect(() => {
    loadPreBookings();
    loadBulkProducts();
    setupSocketListeners();
  }, []);

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('pre-booking:accepted', (data: any) => {
      toast.success(`Pre-booking accepted for ${data.productName}!`, {
        icon: '✅',
      });
      loadPreBookings();
    });

    return () => {
      socket.off('pre-booking:accepted');
    };
  };

  const loadPreBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const { preBookings: data } = await buyerPreBookingService.getPreBookings({}, token);
      setPreBookings(data || []);
    } catch (error) {
      console.error('Failed to load pre-bookings:', error);
      toast.error('Failed to load pre-bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadBulkProducts = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const { products } = await buyerBulkProductService.getBulkProducts({}, token);
      setBulkProducts(products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleCreatePreBooking = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      await buyerPreBookingService.createPreBooking({
        bulkProductId: formData.bulkProductId,
        quantity: formData.quantity,
        pricePerUnit: formData.pricePerUnit,
        targetDate: new Date(formData.targetDate),
        notes: formData.notes
      }, token);

      toast.success('Pre-booking created successfully!');
      setShowCreateModal(false);
      setFormData({ bulkProductId: '', quantity: 0, pricePerUnit: 0, targetDate: '', notes: '' });
      loadPreBookings();
    } catch (error) {
      console.error('Failed to create pre-booking:', error);
      toast.error('Failed to create pre-booking');
    }
  };

  const handleCancelPreBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this pre-booking?')) return;

    try {
      const token = localStorage.getItem('token') || '';
      await buyerPreBookingService.cancelPreBooking(id, token);
      toast.success('Pre-booking cancelled');
      loadPreBookings();
    } catch (error) {
      console.error('Failed to cancel pre-booking:', error);
      toast.error('Failed to cancel pre-booking');
    }
  };

  const stats = {
    active: preBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
    totalSavings: preBookings.reduce((sum, b) => {
      const marketPrice = b.pricePerUnit * 1.15; // Assume 15% market premium
      return sum + ((marketPrice - b.pricePerUnit) * b.quantity);
    }, 0),
    upcoming: preBookings.filter(b => new Date(b.targetDate) > new Date()).length
  };

  return (
    <div className="space-y-6">
      {/* Removed large header to save space */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        {/* Compact header removed */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="h-12 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          New Pre-Booking
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Bookings", value: stats.active.toString(), icon: Lock, color: "blue" },
          { label: "Total Savings", value: `₹${Math.round(stats.totalSavings).toLocaleString()}`, icon: TrendingDown, color: "emerald" },
          { label: "Upcoming Harvest", value: stats.upcoming.toString(), icon: Calendar, color: "amber" },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
            <div className={`h-12 w-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : preBookings.length === 0 ? (
        <div className="text-center py-20">
          <Lock size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No pre-bookings yet</h3>
          <p className="text-slate-500 mb-6">Start locking prices for future harvests</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="h-12 px-8 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Create First Pre-Booking
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {preBookings.map((booking, idx) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">{booking.bulkProduct?.name || 'Product'}</h3>
                  <p className="text-slate-500 font-medium">{booking.quantity} {booking.bulkProduct?.unit || 'kg'}</p>
                </div>
                <div className={`px-4 py-2 ${
                  booking.status === 'CONFIRMED' ? "bg-emerald-50 text-emerald-600" : 
                  booking.status === 'PENDING' ? "bg-amber-50 text-amber-600" :
                  "bg-slate-50 text-slate-600"
                } rounded-full font-bold text-sm flex items-center gap-1`}>
                  {booking.status === 'CONFIRMED' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  {booking.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Locked Price</p>
                  <p className="text-xl font-black text-blue-600">₹{booking.pricePerUnit}/{booking.bulkProduct?.unit || 'kg'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Target Date</p>
                  <p className="text-xl font-black text-slate-900">{new Date(booking.targetDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Total Value</p>
                  <p className="text-xl font-black text-emerald-600">₹{booking.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600">{booking.notes}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
                  View Details
                </button>
                {booking.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelPreBooking(booking.id)}
                    className="h-12 px-6 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Pre-Booking Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-slate-900">Create Pre-Booking</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Product</label>
                  <select
                    value={formData.bulkProductId}
                    onChange={(e) => {
                      const product = bulkProducts.find(p => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        bulkProductId: e.target.value,
                        pricePerUnit: product?.pricePerUnit || 0
                      });
                    }}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a product...</option>
                    {bulkProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ₹{product.pricePerUnit}/{product.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price per Unit</label>
                    <input
                      type="number"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) || 0 })}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Target Harvest Date</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Add any special requirements..."
                  />
                </div>

                {formData.quantity > 0 && formData.pricePerUnit > 0 && (
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-700">Total Value</span>
                      <span className="text-3xl font-black text-blue-600">
                        ₹{(formData.quantity * formData.pricePerUnit).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 h-12 px-6 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePreBooking}
                    disabled={!formData.bulkProductId || !formData.quantity || !formData.targetDate}
                    className="flex-1 h-12 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Pre-Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
