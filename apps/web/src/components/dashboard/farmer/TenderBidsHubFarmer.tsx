'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Gavel, FileText, Calendar, Clock, CheckCircle,
  AlertCircle, TrendingUp, DollarSign, Users, Award,
  ArrowRight, Eye, Download, Upload, Star, X, Search, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TenderBidsHubFarmer() {
  const router = useRouter();
  const [activeTenders, setActiveTenders] = useState(12);
  const [wonBids, setWonBids] = useState(8);
  const [showTendersModal, setShowTendersModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const stats = [
    {
      label: 'Active Tenders',
      value: activeTenders.toString(),
      icon: Target,
      classes: { bg: 'bg-blue-100', text: 'text-blue-600' },
      trend: '+3 new'
    },
    {
      label: 'Bids Won',
      value: wonBids.toString(),
      icon: Award,
      classes: { bg: 'bg-green-100', text: 'text-green-600' },
      trend: '67% success'
    },
    {
      label: 'Total Value',
      value: '₹45.2L',
      icon: DollarSign,
      classes: { bg: 'bg-purple-100', text: 'text-purple-600' },
      trend: '+12%'
    },
    {
      label: 'Avg. Margin',
      value: '18.5%',
      icon: TrendingUp,
      classes: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
      trend: 'Above avg'
    }
  ];

  const tenders = [
    {
      id: 'TND-2024-001',
      title: 'Wheat Procurement - Madhya Pradesh',
      organization: 'Food Corporation of India',
      quantity: '5000 MT',
      basePrice: '₹2,450/qtl',
      deadline: '2024-04-15',
      status: 'active',
      confidence: 85
    },
    {
      id: 'TND-2024-002',
      title: 'Rice Supply - Karnataka',
      organization: 'Karnataka State Food Commission',
      quantity: '3000 MT',
      basePrice: '₹3,800/qtl',
      deadline: '2024-04-20',
      status: 'bidding',
      confidence: 92
    },
    {
      id: 'TND-2024-003',
      title: 'Organic Pulses - Maharashtra',
      organization: 'Maharashtra Organic Board',
      quantity: '1500 MT',
      basePrice: '₹8,500/qtl',
      deadline: '2024-04-25',
      status: 'won',
      confidence: 100
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-600';
      case 'bidding': return 'bg-amber-100 text-amber-600';
      case 'won': return 'bg-green-100 text-green-600';
      case 'lost': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Tender & Bidding Hub</h1>
          <p className="text-slate-600 mt-1">Government tenders, contract farming, and bulk sales opportunities</p>
        </div>
        <button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2">
          <Upload size={18} />
          Submit New Bid
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl ${stat.classes.bg} flex items-center justify-center`}>
                <stat.icon size={24} className={stat.classes.text} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.classes.bg} ${stat.classes.text}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-slate-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Tenders */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">Active Tenders</h2>
          <div className="flex gap-3">
            <button className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all flex items-center gap-2">
              <Eye size={16} />
              View All
            </button>
            <button className="h-10 px-4 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg font-bold transition-all flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {tenders.map((tender, idx) => (
            <motion.div
              key={tender.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-slate-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-slate-900">{tender.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(tender.status)}`}>
                      {tender.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-2">{tender.organization}</p>
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <span>Quantity: {tender.quantity}</span>
                    <span>Base Price: {tender.basePrice}</span>
                    <span>Deadline: {tender.deadline}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600 mb-1">Win Confidence</div>
                  <div className="text-2xl font-black text-blue-600">{tender.confidence}%</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(tender.confidence / 20) ? 'text-yellow-400 fill-current' : 'text-slate-300'}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">Tender ID: {tender.id}</span>
                </div>
                <div className="flex gap-2">
                  <button className="h-8 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all">
                    View Details
                  </button>
                  {tender.status === 'active' && (
                    <button className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-1">
                      Place Bid
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <Target size={100} />
          </div>
          <Target size={32} className="mb-4 relative z-10" />
          <h3 className="text-xl font-black mb-2 relative z-10">Find New Tenders</h3>
          <p className="text-blue-100 mb-4 relative z-10">Discover government and private sector opportunities</p>
          <button 
            onClick={() => setShowTendersModal(true)}
            className="relative z-10 h-10 px-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
          >
            Browse Tenders
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <FileText size={100} />
          </div>
          <FileText size={32} className="mb-4 relative z-10" />
          <h3 className="text-xl font-black mb-2 relative z-10">Bid Templates</h3>
          <p className="text-green-100 mb-4 relative z-10">Pre-filled templates for faster bid submission</p>
          <button 
            onClick={() => setShowTemplatesModal(true)}
            className="relative z-10 h-10 px-4 bg-white text-green-600 rounded-lg font-bold hover:bg-green-50 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
          >
            Access Templates
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <Calendar size={100} />
          </div>
          <Calendar size={32} className="mb-4 relative z-10" />
          <h3 className="text-xl font-black mb-2 relative z-10">Bid Calendar</h3>
          <p className="text-purple-100 mb-4 relative z-10">Track deadlines and important dates</p>
          <button 
            onClick={() => setShowCalendarModal(true)}
            className="relative z-10 h-10 px-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
          >
            View Calendar
          </button>
        </motion.div>
      </div>

      {/* Modals using AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {/* Tenders Modal */}
        {showTendersModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm cursor-pointer" 
              onClick={() => setShowTendersModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Target size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Browse New Tenders</h2>
                </div>
                <button 
                  onClick={() => setShowTendersModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-white">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search tenders by keyword, location, or crop..." 
                    className="w-full h-12 pl-12 pr-4 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium outline-none transition-all"
                  />
                </div>
                <button className="h-12 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap">
                  <Filter size={18} />
                  Filters
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                <div className="grid gap-4">
                  {[
                    { title: "Millet Procurement for Mid-day Meal", org: "Govt of Maharashtra", date: "Closing in 5 days", value: "₹2.5 Cr" },
                    { title: "Organic Turmeric Export Order", org: "Spices Board India", date: "Closing in 12 days", value: "₹85L" },
                    { title: "Soybean Seed Supply - Kharif 2024", org: "National Seeds Corp", date: "Closing in 2 weeks", value: "₹1.2 Cr" },
                    { title: "Cotton Bales Procurement", org: "Cotton Corp of India", date: "Closing in 3 weeks", value: "₹5 Cr" }
                  ].map((t, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between group cursor-pointer gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{t.title}</h3>
                        <div className="text-slate-600 text-sm mt-1">{t.org}</div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium">
                          <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1"><Clock size={14} /> {t.date}</span>
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1"><DollarSign size={14} /> {t.value}</span>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto h-10 px-6 bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-lg font-bold transition-all shadow-sm">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Templates Modal */}
        {showTemplatesModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm cursor-pointer" 
              onClick={() => setShowTemplatesModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <FileText size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Document Templates</h2>
                </div>
                <button 
                  onClick={() => setShowTemplatesModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "Standard Govt Bid Proposal", type: "PDF/DOCX", desc: "Pre-formatted tender response for strict govt guidelines." },
                    { name: "Commercial Output Estimate", type: "Excel", desc: "Detailed breakdown of yield estimation and pricing calculations." },
                    { name: "Quality Assurance Declaration", type: "PDF", desc: "Standard template for asserting crop quality standards." },
                    { name: "Logistics Planning Template", type: "Excel/DOCX", desc: "Route mapping, cost estimation, and delivery timeline planner." }
                  ].map((template, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-green-300 transition-all group flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                          <FileText size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{template.type}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{template.name}</h3>
                      <p className="text-slate-600 text-sm mb-6 flex-1">{template.desc}</p>
                      <div className="flex gap-2 mt-auto">
                        <button className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm">
                          <Download size={16} /> Download
                        </button>
                        <button className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-all">
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Calendar Modal */}
        {showCalendarModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm cursor-pointer" 
              onClick={() => setShowCalendarModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Calendar size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Bid Calendar</h2>
                </div>
                <button 
                  onClick={() => setShowCalendarModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                <div className="bg-white border text-center p-4 border-slate-200 rounded-xl mb-6 shadow-sm flex items-center justify-between">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><ChevronLeft size={24}/></button>
                  <h3 className="text-xl font-bold text-slate-900">April 2024</h3>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><ChevronRight size={24}/></button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { date: "April 15", event: "TND-2024-001 (Wheat Procurement)", type: "Submission Deadline", classes: { border: 'hover:border-red-300', bgBox: 'bg-red-50', textBox: 'text-red-700', borderBox: 'border-red-200' } },
                    { date: "April 18", event: "Pre-bid Meeting: Organic Pulses", type: "Meeting", classes: { border: 'hover:border-blue-300', bgBox: 'bg-blue-50', textBox: 'text-blue-700', borderBox: 'border-blue-200' } },
                    { date: "April 20", event: "TND-2024-002 (Rice Supply)", type: "Submission Deadline", classes: { border: 'hover:border-red-300', bgBox: 'bg-red-50', textBox: 'text-red-700', borderBox: 'border-red-200' } },
                    { date: "April 22", event: "Results Announcement: FCI Corn", type: "Result", classes: { border: 'hover:border-green-300', bgBox: 'bg-green-50', textBox: 'text-green-700', borderBox: 'border-green-200' } },
                    { date: "April 25", event: "Document Verification: Pulse Tender", type: "Action Required", classes: { border: 'hover:border-amber-300', bgBox: 'bg-amber-50', textBox: 'text-amber-700', borderBox: 'border-amber-200' } }
                  ].map((item, i) => (
                    <div key={i} className={`bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6 shadow-sm transition-all ${item.classes.border}`}>
                      <div className="w-full sm:w-24 text-center sm:text-left sm:border-r border-slate-100 sm:pr-6">
                        <div className="text-sm text-slate-500 font-semibold uppercase">{item.date.split(' ')[0]}</div>
                        <div className="text-2xl font-black text-slate-900">{item.date.split(' ')[1]}</div>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{item.event}</h4>
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${item.classes.bgBox} ${item.classes.textBox} ${item.classes.borderBox}`}>
                          {item.type}
                        </span>
                      </div>
                      <button className="w-full sm:w-auto h-10 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 sm:bg-purple-50 sm:hover:bg-purple-600 sm:hover:text-white sm:text-purple-700 rounded-lg font-bold transition-all whitespace-nowrap shadow-sm">
                        Remind Me
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}