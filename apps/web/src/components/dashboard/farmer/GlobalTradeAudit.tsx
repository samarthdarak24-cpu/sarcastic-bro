"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Globe, 
  BarChart3, 
  ArrowRight, 
  Target, 
  Zap,
  Sparkles,
  Activity,
  FileText,
  Award,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Package,
  Plane,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GlobalTradeAudit() {
  const [activeFeature, setActiveFeature] = useState('compliance-checker');

  const features = [
    { id: 'compliance-checker', icon: ShieldCheck, label: 'Compliance Checker', color: 'blue' },
    { id: 'documentation-mgmt', icon: FileText, label: 'Documentation Manager', color: 'purple' },
    { id: 'certification-tracking', icon: Award, label: 'Certification Tracking', color: 'green' },
    { id: 'customs-integration', icon: Globe, label: 'Customs Integration', color: 'orange' },
    { id: 'quality-standards', icon: Target, label: 'Quality Standards', color: 'cyan' },
    { id: 'regulatory-updates', icon: TrendingUp, label: 'Regulatory Updates', color: 'red' },
    { id: 'audit-reports', icon: BarChart3, label: 'Audit Reports', color: 'emerald' },
    { id: 'country-requirements', icon: Plane, label: 'Country Requirements', color: 'indigo' },
    { id: 'shipping-docs', icon: Package, label: 'Shipping Documentation', color: 'pink' },
    { id: 'compliance-score', icon: Sparkles, label: 'Compliance Score', color: 'amber' }
  ];

  const complianceSteps = [
    { region: "Global (Standard)", status: "Verified", score: 98, icon: Globe },
    { region: "United States (FDA)", status: "Pending", score: 72, icon: Target },
    { region: "European Union (EU Organic)", status: "In Progress", score: 85, icon: Target },
    { region: "UAE (ESMA Certification)", status: "Not Started", score: 45, icon: ShieldCheck },
  ];

  const checklistItems = [
    { label: "Pesticide Residue Analysis", status: "Pass", detail: "Level: 0.01mg/kg (Below Limit)", icon: <ShieldCheck className="text-green-500" /> },
    { label: "Phytosanitary Certification", status: "Pass", detail: "Verified by Regional Lab", icon: <ShieldCheck className="text-green-500" /> },
    { label: "Export Labeling Compliance", status: "Warning", detail: "Nutritional info format needs update", icon: <Target className="text-yellow-500" /> },
    { label: "Sustainable Sourcing Audit", status: "Pass", detail: "Certified Organic Cluster", icon: <ShieldCheck className="text-green-500" /> },
    { label: "Batch Traceability", status: "Pass", detail: "Blockchain Hash Root Verified", icon: <ShieldCheck className="text-green-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 p-6">
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
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Global Trade Audit</h1>
              <p className="text-gray-600">Export readiness and compliance verification</p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Globe className="w-5 h-5 text-orange-500" />
                <Activity className="w-4 h-4 text-orange-500 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Grade A</p>
              <p className="text-xs text-gray-600">Global Rank</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
              <p className="text-xs text-gray-600">Confidence Score</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-5 h-5 text-blue-500" />
                <RefreshCw className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">74+</p>
              <p className="text-xs text-gray-600">Standards Checked</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Plane className="w-5 h-5 text-cyan-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">EU-27</p>
              <p className="text-xs text-gray-600">Target Market</p>
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
                  ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-xl scale-105'
                  : 'bg-white hover:bg-orange-50 text-slate-700 hover:shadow-lg'
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
              <Activity className="w-5 h-5 text-orange-500 animate-pulse" />
              <span className="text-sm text-gray-500">Live Audit</span>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Compliance Checker */}
              {activeFeature === 'compliance-checker' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        Audit Checklist
                      </h3>
                      {checklistItems.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between group hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-orange-50 transition-all">
                              {item.icon}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.detail}</p>
                            </div>
                          </div>
                          <Badge className={`text-xs ${item.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {item.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-orange-500" />
                        Regional Compliance
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {complianceSteps.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-xl border border-slate-100 hover:border-orange-500 transition-all cursor-pointer bg-white hover:shadow-lg"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                  <step.icon size={20} />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">{step.region}</h4>
                                  <p className="text-xs text-gray-500">Score: {step.score}%</p>
                                </div>
                              </div>
                              <Badge className={`text-xs ${step.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {step.status}
                              </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${step.score > 90 ? 'bg-green-500' : step.score > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${step.score}%` }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Documentation Management */}
              {activeFeature === 'documentation-mgmt' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'Phytosanitary Certificate', status: 'Valid', expiry: 'Dec 2024', icon: Award },
                      { name: 'Certificate of Origin', status: 'Valid', expiry: 'Jan 2025', icon: FileText },
                      { name: 'Quality Inspection Report', status: 'Valid', expiry: 'Nov 2024', icon: ShieldCheck },
                      { name: 'Export License', status: 'Pending', expiry: 'N/A', icon: Globe },
                      { name: 'Organic Certification', status: 'Valid', expiry: 'Mar 2025', icon: Award },
                      { name: 'Customs Declaration', status: 'Draft', expiry: 'N/A', icon: Package }
                    ].map((doc, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer">
                        <doc.icon className="w-12 h-12 text-purple-500 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{doc.name}</h3>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${doc.status === 'Valid' ? 'bg-green-100 text-green-700' : doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                            {doc.status}
                          </Badge>
                          <p className="text-xs text-gray-500">{doc.expiry}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Certification Tracking */}
              {activeFeature === 'certification-tracking' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-500" />
                      Active Certifications
                    </h3>
                    <div className="space-y-4">
                      {[
                        { cert: 'USDA Organic', issuer: 'USDA', issued: 'Jan 2024', expires: 'Jan 2025', status: 'Active' },
                        { cert: 'EU Organic Certification', issuer: 'EU Commission', issued: 'Feb 2024', expires: 'Feb 2025', status: 'Active' },
                        { cert: 'Fair Trade Certified', issuer: 'Fair Trade USA', issued: 'Mar 2024', expires: 'Mar 2025', status: 'Active' },
                        { cert: 'GlobalGAP', issuer: 'FoodPLUS GmbH', issued: 'Apr 2024', expires: 'Apr 2025', status: 'Renewal Due' }
                      ].map((cert, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-bold text-gray-900">{cert.cert}</h4>
                              <p className="text-sm text-gray-600">Issued by: {cert.issuer}</p>
                            </div>
                            <Badge className={`text-xs ${cert.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {cert.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Issued</p>
                              <p className="font-medium text-gray-900">{cert.issued}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Expires</p>
                              <p className="font-medium text-gray-900">{cert.expires}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Default for other features */}
              {!['compliance-checker', 'documentation-mgmt', 'certification-tracking'].includes(activeFeature) && (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">
                    {features.find(f => f.id === activeFeature)?.label}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Advanced export compliance features</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
