"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  FileText,
  History,
  Activity,
  Users,
  Calendar,
  Shield,
  Zap,
  TrendingUp,
  Award,
  RefreshCw,
  Eye
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function EscrowHub() {
  const [activeFeature, setActiveFeature] = useState('account-management');

  const features = [
    { id: 'account-management', icon: ShieldCheck, label: 'Account Management', color: 'blue' },
    { id: 'agreement-builder', icon: FileText, label: 'Agreement Builder', color: 'purple' },
    { id: 'milestone-release', icon: CheckCircle2, label: 'Milestone Release', color: 'green' },
    { id: 'dispute-resolution', icon: AlertCircle, label: 'Dispute Center', color: 'orange' },
    { id: 'smart-contract', icon: Zap, label: 'Smart Contracts', color: 'cyan' },
    { id: 'payment-schedule', icon: Calendar, label: 'Payment Schedule', color: 'red' },
    { id: 'security-guarantees', icon: Shield, label: 'Security Dashboard', color: 'emerald' },
    { id: 'transaction-history', icon: History, label: 'Transaction History', color: 'indigo' },
    { id: 'refund-management', icon: TrendingUp, label: 'Refund Manager', color: 'pink' },
    { id: 'compliance-tracking', icon: Award, label: 'Compliance Tracking', color: 'amber' }
  ];
  const mockEscrowTransactions = [
    { 
      id: "ESC-9218", 
      buyer: "Global Foods Corp", 
      amount: "₹4,25,000", 
      status: "Held in Escrow",
      releaseCondition: "Delivery Confirmation",
      date: "Nov 04, 2024",
      urgent: true
    },
    { 
      id: "ESC-8152", 
      buyer: "Eco-Harvest Markets", 
      amount: "₹1,28,000", 
      status: "Released",
      releaseCondition: "Quality Inspection Pass",
      date: "Nov 01, 2024",
      urgent: false
    },
    { 
      id: "ESC-7421", 
      buyer: "Pioneer Agri-Trade", 
      amount: "₹92,000", 
      status: "Pending Deposit",
      releaseCondition: "Contract Signing",
      date: "Oct 28, 2024",
      urgent: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Secure Escrow Hub</h1>
              <p className="text-gray-600">Zero-risk trading with automated escrow protection</p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹12.4M</p>
              <p className="text-xs text-gray-600">Total Protected</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p className="text-xs text-gray-600">Safe Release Rate</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Lock className="w-5 h-5 text-blue-500" />
                <RefreshCw className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">14</p>
              <p className="text-xs text-gray-600">Active Holds</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-cyan-500" />
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">247</p>
              <p className="text-xs text-gray-600">Completed Deals</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {features.map((feature, idx) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveFeature(feature.id)}
              className={`
                p-5 rounded-xl transition-all cursor-pointer
                ${activeFeature === feature.id
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl scale-105'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 hover:shadow-lg'
                }
              `}
            >
              <feature.icon className="w-7 h-7 mb-2 mx-auto" />
              <p className="text-sm font-medium text-center">{feature.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {features.find(f => f.id === activeFeature)?.label}
            </h2>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
              <span className="text-sm text-gray-500">Live Escrow</span>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Account Management */}
              {activeFeature === 'account-management' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-6">
                    {mockEscrowTransactions.map((tx, i) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-2xl hover:border-emerald-500/20 transition-all cursor-pointer relative overflow-hidden">
                          {tx.urgent && <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 animate-pulse" />}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 flex-1">
                              <div className={`h-14 w-14 rounded-xl ${tx.status === 'Released' ? 'bg-green-100 text-green-600' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center transition-all`}>
                                {tx.status === 'Released' ? <CheckCircle2 size={28} /> : <Lock size={28} />}
                              </div>
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <p className="text-sm font-bold text-slate-400 uppercase">{tx.id}</p>
                                  <Badge className={`font-bold text-xs ${tx.status === 'Released' ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {tx.status}
                                  </Badge>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">{tx.buyer}</h4>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 text-right">
                              <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-slate-400">Total Amount</p>
                                <p className="text-2xl font-bold text-slate-900">{tx.amount}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-slate-400">Release Condition</p>
                                <p className="text-sm font-bold text-slate-900 flex items-center justify-end gap-2">
                                  {tx.releaseCondition} <ArrowUpRight size={14} />
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Agreement Builder */}
              {activeFeature === 'agreement-builder' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
                      <FileText className="w-16 h-16 text-purple-500 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Party Agreements</h3>
                      <p className="text-sm text-gray-600 mb-6">Create custom escrow agreements with multiple parties and conditions</p>
                      <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all">
                        Create New Agreement
                      </button>
                      <div className="mt-6 space-y-3">
                        {[
                          { name: 'Standard Sale Agreement', parties: 2, status: 'Active' },
                          { name: 'Bulk Order Contract', parties: 3, status: 'Draft' },
                          { name: 'Export Deal Template', parties: 4, status: 'Active' }
                        ].map((agreement, idx) => (
                          <div key={idx} className="p-4 bg-white rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{agreement.name}</p>
                                <p className="text-xs text-gray-500">{agreement.parties} parties</p>
                              </div>
                              <Badge className={`text-xs ${agreement.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {agreement.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8">
                      <Users className="w-16 h-16 text-blue-500 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Templates</h3>
                      <p className="text-sm text-gray-600 mb-6">Pre-built agreement templates for common agricultural transactions</p>
                      <div className="space-y-3">
                        {[
                          { name: 'Crop Purchase Agreement', uses: 247 },
                          { name: 'Quality Guarantee Contract', uses: 189 },
                          { name: 'Delivery Milestone Deal', uses: 156 },
                          { name: 'Export Compliance Agreement', uses: 98 }
                        ].map((template, idx) => (
                          <div key={idx} className="p-4 bg-white rounded-lg hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{template.name}</p>
                                <p className="text-xs text-gray-500">{template.uses} uses</p>
                              </div>
                              <Eye className="w-4 h-4 text-blue-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Milestone Release System */}
              {activeFeature === 'milestone-release' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Milestone-Based Payment Release
                    </h3>
                    <div className="space-y-6">
                      {[
                        { milestone: 'Contract Signed', amount: '₹1,00,000', status: 'Released', date: 'Nov 01, 2024' },
                        { milestone: 'Quality Inspection Passed', amount: '₹1,50,000', status: 'Released', date: 'Nov 05, 2024' },
                        { milestone: 'Goods Shipped', amount: '₹1,00,000', status: 'Pending', date: 'Nov 10, 2024' },
                        { milestone: 'Delivery Confirmed', amount: '₹75,000', status: 'Locked', date: 'Nov 15, 2024' }
                      ].map((milestone, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                milestone.status === 'Released' ? 'bg-green-500' : 
                                milestone.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-300'
                              }`}>
                                {milestone.status === 'Released' && <CheckCircle2 className="w-5 h-5 text-white" />}
                                {milestone.status === 'Pending' && <Clock className="w-5 h-5 text-white" />}
                                {milestone.status === 'Locked' && <Lock className="w-5 h-5 text-white" />}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{milestone.milestone}</h4>
                                <p className="text-xs text-gray-500">{milestone.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900">{milestone.amount}</p>
                              <Badge className={`text-xs mt-1 ${
                                milestone.status === 'Released' ? 'bg-green-100 text-green-700' : 
                                milestone.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {milestone.status}
                              </Badge>
                            </div>
                          </div>
                          {milestone.status === 'Pending' && (
                            <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-all">
                              Release Payment
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Default for other features */}
              {!['account-management', 'agreement-builder', 'milestone-release'].includes(activeFeature) && (
                <div className="text-center py-12">
                  <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">
                    {features.find(f => f.id === activeFeature)?.label}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Advanced escrow protection features</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
