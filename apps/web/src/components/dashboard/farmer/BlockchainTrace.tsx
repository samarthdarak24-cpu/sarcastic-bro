"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Link, Lock, FileCheck, Search, Eye, Users, 
  CheckCircle, Activity, Settings, Sparkles,
  Award, FileText, Globe, QrCode
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinimalHeader } from "./shared/MinimalHeader";
import toast from "react-hot-toast";

export function BlockchainTrace() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'provenance', label: 'Provenance', icon: Search },
    { id: 'smart-contracts', label: 'Smart Contracts', icon: FileText },
    { id: 'immutable-records', label: 'Records', icon: Lock },
    { id: 'certification', label: 'Certification', icon: Award },
    { id: 'audit-trail', label: 'Audit Trail', icon: FileCheck },
    { id: 'transparency', label: 'Transparency', icon: Eye },
    { id: 'consumer-portal', label: 'Consumer', icon: Users },
    { id: 'verification', label: 'Verification', icon: CheckCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Blockchain data refreshed');
    }, 1000);
  };

  const blockchainRecords = [
    { id: 'BLK001', product: 'Organic Wheat', blocks: 12, verified: true, timestamp: '2024-04-05 10:30' },
    { id: 'BLK002', product: 'Basmati Rice', blocks: 8, verified: true, timestamp: '2024-04-04 14:20' },
    { id: 'BLK003', product: 'Tomatoes', blocks: 15, verified: true, timestamp: '2024-04-03 09:15' }
  ];

  const smartContracts = [
    { id: 'SC001', name: 'Quality Guarantee', status: 'ACTIVE', executions: 24, value: '₹2.4L' },
    { id: 'SC002', name: 'Payment Terms', status: 'ACTIVE', executions: 18, value: '₹1.8L' },
    { id: 'SC003', name: 'Delivery Conditions', status: 'COMPLETED', executions: 32, value: '₹3.2L' }
  ];

  const certifications = [
    { name: 'Organic Certification', issuer: 'USDA', valid: '2025-12-31', verified: true },
    { name: 'Fair Trade', issuer: 'FLO', valid: '2025-06-30', verified: true },
    { name: 'ISO 22000', issuer: 'ISO', valid: '2026-03-15', verified: true }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <MinimalHeader title="Blockchain Trace" loading={refreshing} />
      
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        <div className="w-full bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white shadow-lg scale-105'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200 min-h-[600px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem]">
                    <Shield size={32} className="text-blue-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Total Records</p>
                    <p className="text-3xl font-black text-slate-900">247</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem]">
                    <CheckCircle size={32} className="text-green-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Verified</p>
                    <p className="text-3xl font-black text-slate-900">100%</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem]">
                    <Link size={32} className="text-purple-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Blocks</p>
                    <p className="text-3xl font-black text-slate-900">1,248</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem]">
                    <FileText size={32} className="text-amber-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Contracts</p>
                    <p className="text-3xl font-black text-slate-900">24</p>
                  </Card>
                </div>

                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">Recent Blockchain Activity</h3>
                  <div className="space-y-4">
                    {blockchainRecords.map((record) => (
                      <div key={record.id} className="bg-white rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Shield size={24} className="text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900">{record.product}</h4>
                            <p className="text-sm font-bold text-slate-600">{record.blocks} blocks • {record.timestamp}</p>
                          </div>
                        </div>
                        <Badge tone="brand">VERIFIED</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'provenance' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Search size={32} className="text-indigo-600" />
                    Provenance Verification
                  </h3>
                  <div className="bg-white rounded-2xl p-8 mb-6">
                    <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Track Product</label>
                    <div className="flex gap-4">
                      <Input className="flex-1 h-14 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" placeholder="Enter product ID or batch number" />
                      <Button className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black">
                        <Search size={20} className="mr-2" />
                        Track
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { stage: 'Farm Origin', location: 'Maharashtra, India', date: '2024-03-15', verified: true },
                      { stage: 'Quality Check', location: 'Processing Unit', date: '2024-03-16', verified: true },
                      { stage: 'Packaging', location: 'Distribution Center', date: '2024-03-17', verified: true },
                      { stage: 'Transport', location: 'In Transit', date: '2024-03-18', verified: true }
                    ].map((stage, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle size={24} className="text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900">{stage.stage}</h4>
                            <p className="text-sm font-bold text-slate-600">{stage.location} • {stage.date}</p>
                          </div>
                        </div>
                        <Badge tone="brand">VERIFIED</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'smart-contracts' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <FileText size={32} className="text-cyan-600" />
                    Smart Contracts
                  </h3>
                  <div className="space-y-4">
                    {smartContracts.map((contract) => (
                      <div key={contract.id} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">{contract.name}</h4>
                            <p className="text-sm font-bold text-slate-600">Contract ID: {contract.id}</p>
                          </div>
                          <Badge tone={contract.status === 'ACTIVE' ? 'brand' : 'ink'}>{contract.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Executions</p>
                            <p className="text-3xl font-black text-slate-900">{contract.executions}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Total Value</p>
                            <p className="text-3xl font-black text-green-600">{contract.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'immutable-records' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Lock size={32} className="text-green-600" />
                    Immutable Records
                  </h3>
                  <div className="space-y-4">
                    {blockchainRecords.map((record) => (
                      <div key={record.id} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-2xl font-black text-slate-900">{record.product}</h4>
                          <Badge tone="brand">IMMUTABLE</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-6 p-6 bg-slate-50 rounded-xl">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Record ID</p>
                            <p className="text-lg font-black text-slate-900">{record.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Blocks</p>
                            <p className="text-lg font-black text-slate-900">{record.blocks}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Timestamp</p>
                            <p className="text-sm font-bold text-slate-600">{record.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'certification' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Award size={32} className="text-amber-600" />
                    Certification Manager
                  </h3>
                  <div className="space-y-4">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                              <Award size={32} className="text-amber-600" />
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-slate-900 mb-1">{cert.name}</h4>
                              <p className="text-sm font-bold text-slate-600">Issued by: {cert.issuer}</p>
                            </div>
                          </div>
                          <Badge tone="brand">VERIFIED</Badge>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                          <p className="text-sm font-bold text-green-900">Valid until: {cert.valid}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'audit-trail' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <FileCheck size={32} className="text-purple-600" />
                    Audit Trail Explorer
                  </h3>
                  <div className="space-y-4">
                    {[
                      { action: 'Record Created', user: 'System', timestamp: '2024-04-05 10:30:15', hash: '0x7a8f...' },
                      { action: 'Quality Verified', user: 'Inspector #42', timestamp: '2024-04-05 11:45:22', hash: '0x9b2c...' },
                      { action: 'Contract Executed', user: 'Smart Contract', timestamp: '2024-04-05 14:20:08', hash: '0x3d5e...' },
                      { action: 'Shipment Logged', user: 'Logistics', timestamp: '2024-04-05 16:10:45', hash: '0x6f1a...' }
                    ].map((entry, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-black text-slate-900">{entry.action}</h4>
                          <Badge tone="ink">{entry.user}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-bold text-slate-400 uppercase mb-1">Timestamp</p>
                            <p className="font-bold text-slate-600">{entry.timestamp}</p>
                          </div>
                          <div>
                            <p className="font-bold text-slate-400 uppercase mb-1">Block Hash</p>
                            <p className="font-bold text-slate-600">{entry.hash}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'transparency' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Eye size={32} className="text-blue-600" />
                    Transparency Dashboard
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-3">Public Records</p>
                      <p className="text-5xl font-black text-blue-600 mb-2">247</p>
                      <CheckCircle size={24} className="text-blue-600 mx-auto" />
                    </div>
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-3">Verified Transactions</p>
                      <p className="text-5xl font-black text-green-600 mb-2">1,248</p>
                      <CheckCircle size={24} className="text-green-600 mx-auto" />
                    </div>
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-3">Consumer Views</p>
                      <p className="text-5xl font-black text-purple-600 mb-2">3.2K</p>
                      <Eye size={24} className="text-purple-600 mx-auto" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'consumer-portal' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Users size={32} className="text-pink-600" />
                    Consumer Portal
                  </h3>
                  <div className="bg-white rounded-2xl p-8 mb-6">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-48 w-48 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <QrCode size={120} className="text-slate-400" />
                      </div>
                    </div>
                    <p className="text-center text-lg font-black text-slate-900 mb-2">Scan to View Product Journey</p>
                    <p className="text-center text-sm font-bold text-slate-600">Consumers can scan this QR code to see complete traceability</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-2">Total Scans</p>
                      <p className="text-4xl font-black text-slate-900">3,247</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-2">Trust Score</p>
                      <p className="text-4xl font-black text-green-600">98%</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <CheckCircle size={32} className="text-green-600" />
                    Verification Status
                  </h3>
                  <div className="space-y-4">
                    {[
                      { item: 'Product Origin', status: 'VERIFIED', confidence: 100 },
                      { item: 'Quality Standards', status: 'VERIFIED', confidence: 98 },
                      { item: 'Organic Certification', status: 'VERIFIED', confidence: 100 },
                      { item: 'Supply Chain', status: 'VERIFIED', confidence: 95 }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-black text-slate-900">{item.item}</h4>
                          <Badge tone="brand">{item.status}</Badge>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full"
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                        <p className="text-sm font-bold text-slate-600 mt-2">Confidence: {item.confidence}%</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Settings size={32} className="text-slate-600" />
                    Blockchain Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-xl font-black text-slate-900 mb-4">Visibility Settings</h4>
                      <div className="space-y-3">
                        {['Make records publicly visible', 'Allow consumer QR scanning', 'Share with supply chain partners'].map((setting, i) => (
                          <label key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                            <input type="checkbox" className="h-5 w-5" defaultChecked={true} />
                            <span className="text-sm font-bold text-slate-900">{setting}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-xl font-black text-slate-900 mb-4">Notification Preferences</h4>
                      <div className="space-y-3">
                        {['New block created', 'Contract executed', 'Verification completed', 'Consumer scan alerts'].map((pref, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="text-sm font-bold text-slate-900">{pref}</span>
                            <div className={`w-14 h-8 rounded-full transition-all cursor-pointer ${i < 3 ? 'bg-green-500' : 'bg-slate-300'}`}>
                              <div className={`h-6 w-6 bg-white rounded-full m-1 transition-all ${i < 3 ? 'translate-x-6' : ''}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
