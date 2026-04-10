'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus, Phone, CreditCard, MapPin,
  CheckCircle, AlertCircle, RefreshCw, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

export default function FarmerOnboarding() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    aadhaar: '',
    bankAccount: '',
    ifsc: '',
    district: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.aadhaar) {
      toast.error('Name, Phone, and Aadhaar are required');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/fpo/farmer/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to onboard farmer');
      }

      toast.success('Farmer onboarded successfully!');
      setSuccess(true);
      setForm({ name: '', phone: '', aadhaar: '', bankAccount: '', ifsc: '', district: '' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto mt-20"
      >
        <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border-2 border-green-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Farmer Onboarded!</h2>
          <p className="text-slate-500 mb-8">The farmer has been successfully added to your FPO network.</p>
          <button
            onClick={() => setSuccess(false)}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all"
          >
            <UserPlus size={20} className="inline mr-2" />
            Add Another Farmer
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <UserPlus size={180} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-2">Onboard Farmer 🧑‍🌾</h2>
          <p className="text-white/80 font-medium max-w-lg">Add a new farmer to your FPO network. Works offline and requires only essential identity data to get started.</p>
        </div>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-100 space-y-6"
      >
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
          <p className="text-xs font-black text-purple-700 uppercase tracking-widest mb-1">Required Fields</p>
          <p className="text-[11px] text-purple-600/70 font-bold">Name, Phone, and Aadhaar are mandatory. Bank details can be added later.</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
            Farmer Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Ramesh Patil"
            required
            className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all placeholder:text-slate-300"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
            <Phone size={12} className="inline mr-1" /> Phone Number *
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="e.g. 9876543210"
            required
            maxLength={10}
            className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all placeholder:text-slate-300"
          />
        </div>

        {/* Aadhaar */}
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
            <CreditCard size={12} className="inline mr-1" /> Aadhaar Number *
          </label>
          <input
            type="text"
            value={form.aadhaar}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            placeholder="e.g. 1234 5678 9012"
            required
            maxLength={14}
            className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all placeholder:text-slate-300"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
            <MapPin size={12} className="inline mr-1" /> District / Location
          </label>
          <input
            type="text"
            value={form.district}
            onChange={(e) => handleChange('district', e.target.value)}
            placeholder="e.g. Nashik"
            className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all placeholder:text-slate-300"
          />
        </div>

        {/* Bank Details (Optional) */}
        <details className="group">
          <summary className="cursor-pointer text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 py-2 hover:text-purple-600 transition-colors">
            <span className="group-open:hidden">▶</span>
            <span className="hidden group-open:inline">▼</span>
            Bank Details (Optional — can add later)
          </summary>
          <div className="mt-4 space-y-4 pl-4 border-l-2 border-purple-100">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Bank Account</label>
              <input
                type="text"
                value={form.bankAccount}
                onChange={(e) => handleChange('bankAccount', e.target.value)}
                placeholder="Account number"
                className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">IFSC Code</label>
              <input
                type="text"
                value={form.ifsc}
                onChange={(e) => handleChange('ifsc', e.target.value)}
                placeholder="e.g. SBIN0001234"
                className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
        </details>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
            submitting
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 active:scale-[0.98]'
          }`}
        >
          {submitting ? (
            <>
              <RefreshCw size={24} className="animate-spin" />
              Onboarding...
            </>
          ) : (
            <>
              <UserPlus size={24} />
              Onboard Farmer
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
}
