'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Gavel, FileText, Calendar, Clock, CheckCircle,
  AlertCircle, TrendingUp, DollarSign, Users, Award,
  ArrowRight, Eye, Download, Upload, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TenderBidsHubFarmer() {
  const router = useRouter();
  const [activeTenders, setActiveTenders] = useState(12);
  const [wonBids, setWonBids] = useState(8);

  const stats = [
    {
      label: 'Active Tenders',
      value: activeTenders.toString(),
      icon: Target,
      color: 'blue',
      trend: '+3 new'
    },
    {
      label: 'Bids Won',
      value: wonBids.toString(),
      icon: Award,
      color: 'green',
      trend: '67% success'
    },
    {
      label: 'Total Value',
      value: '₹45.2L',
      icon: DollarSign,
      color: 'purple',
      trend: '+12%'
    },
    {
      label: 'Avg. Margin',
      value: '18.5%',
      icon: TrendingUp,
      color: 'emerald',
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
              <div className={`h-12 w-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon size={24} className={`text-${stat.color}-600`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
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
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <Target size={32} className="mb-4" />
          <h3 className="text-xl font-black mb-2">Find New Tenders</h3>
          <p className="text-blue-100 mb-4">Discover government and private sector opportunities</p>
          <button className="h-10 px-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all">
            Browse Tenders
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <FileText size={32} className="mb-4" />
          <h3 className="text-xl font-black mb-2">Bid Templates</h3>
          <p className="text-green-100 mb-4">Pre-filled templates for faster bid submission</p>
          <button className="h-10 px-4 bg-white text-green-600 rounded-lg font-bold hover:bg-green-50 transition-all">
            Access Templates
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <Calendar size={32} className="mb-4" />
          <h3 className="text-xl font-black mb-2">Bid Calendar</h3>
          <p className="text-purple-100 mb-4">Track deadlines and important dates</p>
          <button className="h-10 px-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-all">
            View Calendar
          </button>
        </motion.div>
      </div>
    </div>
  );
}