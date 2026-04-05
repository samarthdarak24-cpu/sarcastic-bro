'use client';

import React, { useState } from 'react';
import { 
  User, Package, Sparkles, Users, ShoppingCart, Lock,
  Truck, CheckCircle, TrendingUp, ArrowRight, Play, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  details: string[];
  metrics?: { label: string; value: string; color: string }[];
}

export default function RajJourneyDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: Step[] = [
    {
      id: 0,
      title: "The Problem",
      description: "Raj has 50kg tomatoes, middleman takes 30% cut",
      icon: User,
      color: "red",
      details: [
        "Raj grows 50kg of quality tomatoes",
        "Too small for bulk buyers",
        "Middleman offers ₹42/kg",
        "Middleman takes 30% commission",
        "Raj earns only ₹2,100"
      ],
      metrics: [
        { label: "Quantity", value: "50 kg", color: "slate" },
        { label: "Price Offered", value: "₹42/kg", color: "amber" },
        { label: "Earnings", value: "₹2,100", color: "red" },
        { label: "Middleman Cut", value: "30%", color: "red" }
      ]
    },
    {
      id: 1,
      title: "Raj Lists on FarmLink",
      description: "Upload crop with AI quality verification",
      icon: Package,
      color: "blue",
      details: [
        "Raj opens FarmLink app",
        "Uploads tomato photos",
        "Enters quantity: 50kg",
        "Sets base price: ₹42/kg",
        "Enables auto-aggregation"
      ],
      metrics: [
        { label: "Upload Time", value: "2 min", color: "blue" },
        { label: "Photos", value: "3 images", color: "blue" },
        { label: "Status", value: "Listed", color: "emerald" }
      ]
    },
    {
      id: 2,
      title: "AI Verifies Quality",
      description: "Instant quality scan and certification",
      icon: Sparkles,
      color: "purple",
      details: [
        "AI analyzes crop images",
        "Checks color, size, freshness",
        "Detects defects (if any)",
        "Generates quality score: 92/100",
        "Issues blockchain certificate"
      ],
      metrics: [
        { label: "Quality Score", value: "92/100", color: "emerald" },
        { label: "Grade", value: "A", color: "emerald" },
        { label: "Confidence", value: "96%", color: "blue" },
        { label: "Scan Time", value: "3 sec", color: "purple" }
      ]
    },
    {
      id: 3,
      title: "Auto-Clustering Magic",
      description: "AI finds 11 nearby farmers automatically",
      icon: Users,
      color: "emerald",
      details: [
        "System scans 50km radius",
        "Finds 11 farmers with tomatoes",
        "Checks quality compatibility",
        "Verifies location proximity",
        "Creates bulk lot: 500kg total",
        "Calculates bulk price: ₹48/kg"
      ],
      metrics: [
        { label: "Farmers Found", value: "11", color: "emerald" },
        { label: "Total Quantity", value: "500 kg", color: "blue" },
        { label: "Bulk Price", value: "₹48/kg", color: "emerald" },
        { label: "Formation Time", value: "24 hrs", color: "amber" }
      ]
    },
    {
      id: 4,
      title: "Buyer Discovers Lot",
      description: "Verified bulk lot appears in marketplace",
      icon: ShoppingCart,
      color: "indigo",
      details: [
        "Buyer searches for tomatoes",
        "Sees verified bulk lot: 500kg",
        "Trust score: 96/100",
        "Quality: 92/100",
        "Blockchain verified ✓",
        "AI certified ✓",
        "Places order"
      ],
      metrics: [
        { label: "Trust Score", value: "96/100", color: "emerald" },
        { label: "Quality", value: "92/100", color: "emerald" },
        { label: "Price", value: "₹48/kg", color: "blue" },
        { label: "Savings", value: "18%", color: "emerald" }
      ]
    },
    {
      id: 5,
      title: "Payment Locked in Escrow",
      description: "₹24,000 secured via smart contract",
      icon: Lock,
      color: "amber",
      details: [
        "Buyer deposits ₹24,000",
        "Smart contract locks funds",
        "Multi-stage release setup",
        "Advance: ₹4,800 (20%)",
        "Dispatch: ₹9,600 (40%)",
        "Delivery: ₹7,200 (30%)",
        "Final: ₹2,400 (10%)"
      ],
      metrics: [
        { label: "Total Locked", value: "₹24,000", color: "amber" },
        { label: "Advance Released", value: "₹4,800", color: "emerald" },
        { label: "Pending", value: "₹19,200", color: "slate" },
        { label: "Security", value: "100%", color: "emerald" }
      ]
    },
    {
      id: 6,
      title: "Delivery & Verification",
      description: "GPS tracking + quality check at delivery",
      icon: Truck,
      color: "blue",
      details: [
        "Logistics assigned",
        "GPS tracking active",
        "Temperature monitored",
        "Delivery to buyer location",
        "Quality re-verified on arrival",
        "Buyer confirms receipt",
        "All conditions met ✓"
      ],
      metrics: [
        { label: "Delivery Time", value: "48 hrs", color: "blue" },
        { label: "Quality Check", value: "Passed", color: "emerald" },
        { label: "GPS Verified", value: "Yes", color: "emerald" },
        { label: "Condition", value: "Fresh", color: "emerald" }
      ]
    },
    {
      id: 7,
      title: "Payment Auto-Released",
      description: "Smart contract distributes funds to all farmers",
      icon: CheckCircle,
      color: "emerald",
      details: [
        "All conditions verified",
        "Smart contract executes",
        "Funds distributed automatically",
        "Raj receives: ₹2,400",
        "Other 11 farmers paid",
        "Transaction recorded on blockchain",
        "No disputes, instant settlement"
      ],
      metrics: [
        { label: "Raj's Share", value: "₹2,400", color: "emerald" },
        { label: "Total Distributed", value: "₹24,000", color: "emerald" },
        { label: "Transaction Fee", value: "2%", color: "slate" },
        { label: "Settlement Time", value: "Instant", color: "emerald" }
      ]
    },
    {
      id: 8,
      title: "The Impact",
      description: "Raj earns ₹300 more, buyer pays less",
      icon: TrendingUp,
      color: "emerald",
      details: [
        "Before: ₹2,100 (with middleman)",
        "After: ₹2,400 (with FarmLink)",
        "Increase: +₹300 (+14%)",
        "No middleman commission",
        "Guaranteed payment",
        "Trust score increased",
        "Buyer saved 10% vs market"
      ],
      metrics: [
        { label: "Before", value: "₹2,100", color: "red" },
        { label: "After", value: "₹2,400", color: "emerald" },
        { label: "Increase", value: "+₹300", color: "emerald" },
        { label: "Percentage", value: "+14%", color: "emerald" }
      ]
    }
  ];

  const playDemo = async () => {
    setIsPlaying(true);
    setCurrentStep(0);

    for (let i = 0; i <= steps.length - 1; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (i < steps.length - 1) {
        setCurrentStep(i + 1);
      }
    }

    setIsPlaying(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
            Raj's Journey: From ₹2,100 to ₹2,400
          </h1>
          <p className="text-slate-500 font-medium">Interactive demo of the complete FarmLink flow</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDemo}
            disabled={isPlaying}
            className="h-12 px-6 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <button
            onClick={playDemo}
            disabled={isPlaying}
            className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play size={18} />
            {isPlaying ? 'Playing...' : 'Play Demo'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-slate-700">Progress</span>
          <span className="text-sm font-black text-emerald-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`h-2 w-2 rounded-full transition-all ${
                index <= currentStep ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Step Info */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <div className={`h-16 w-16 rounded-2xl bg-${currentStepData.color}-50 flex items-center justify-center text-${currentStepData.color}-600`}>
                <IconComponent size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Step {currentStep + 1}
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">{currentStepData.title}</h2>
                <p className="text-slate-600 font-medium">{currentStepData.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              {currentStepData.details.map((detail, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                >
                  <div className="h-6 w-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{detail}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          {currentStepData.metrics && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                {currentStepData.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-2xl bg-${metric.color}-50 border border-${metric.color}-100`}
                  >
                    <div className={`text-3xl font-black text-${metric.color}-600 mb-2`}>
                      {metric.value}
                    </div>
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {metric.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || isPlaying}
          className="h-12 px-6 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="text-sm font-bold text-slate-500">
          {currentStep + 1} / {steps.length}
        </div>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1 || isPlaying}
          className="h-12 px-6 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next <ArrowRight size={18} />
        </button>
      </div>

      {/* Summary Card */}
      {currentStep === steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
              Technology Replaces Middlemen
            </h2>
            <p className="text-emerald-50 text-lg font-medium mb-8 leading-relaxed">
              Raj earns ₹300 more, buyer pays less, and trust is guaranteed by AI + Blockchain + Escrow.
              No middlemen, just results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl font-black mb-2">+14%</div>
                <div className="text-emerald-100 text-sm font-bold uppercase tracking-wider">Farmer Income</div>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl font-black mb-2">-10%</div>
                <div className="text-emerald-100 text-sm font-bold uppercase tracking-wider">Buyer Cost</div>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl font-black mb-2">0%</div>
                <div className="text-emerald-100 text-sm font-bold uppercase tracking-wider">Middleman Cut</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
