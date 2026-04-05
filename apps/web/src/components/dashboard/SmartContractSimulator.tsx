'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Unlock, CheckCircle, Clock, AlertCircle,
  Zap, DollarSign, Users, Package, TrendingUp, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContractCondition {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'checking' | 'met' | 'failed';
  progress: number;
}

interface PaymentStage {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  status: 'locked' | 'pending' | 'released' | 'completed';
  condition: string;
  timestamp?: Date;
}

export default function SmartContractSimulator() {
  const [activeTab, setActiveTab] = useState<'overview' | 'conditions' | 'code'>('overview');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const [conditions, setConditions] = useState<ContractCondition[]>([
    {
      id: '1',
      name: 'Quality Verification',
      description: 'AI quality score must be ≥ 85/100',
      status: 'pending',
      progress: 0,
    },
    {
      id: '2',
      name: 'Quantity Confirmation',
      description: 'Delivered quantity matches order (±5% tolerance)',
      status: 'pending',
      progress: 0,
    },
    {
      id: '3',
      name: 'Delivery Confirmation',
      description: 'GPS verification + buyer signature',
      status: 'pending',
      progress: 0,
    },
    {
      id: '4',
      name: 'Blockchain Verification',
      description: 'Transaction recorded on immutable ledger',
      status: 'pending',
      progress: 0,
    },
  ]);

  const [paymentStages, setPaymentStages] = useState<PaymentStage[]>([
    {
      id: '1',
      name: 'Advance Payment',
      amount: 4800,
      percentage: 20,
      status: 'completed',
      condition: 'Order confirmation',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Dispatch Payment',
      amount: 9600,
      percentage: 40,
      status: 'locked',
      condition: 'Shipment dispatched',
    },
    {
      id: '3',
      name: 'Delivery Payment',
      amount: 7200,
      percentage: 30,
      status: 'locked',
      condition: 'Quality verified + delivered',
    },
    {
      id: '4',
      name: 'Final Settlement',
      amount: 2400,
      percentage: 10,
      status: 'locked',
      condition: 'No disputes for 7 days',
    },
  ]);

  const contractData = {
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    totalAmount: 24000,
    lockedAmount: 19200,
    releasedAmount: 4800,
    farmersCount: 12,
    buyerAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    status: 'active',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  };

  const simulateContract = async () => {
    setIsSimulating(true);
    setCurrentStage(0);

    // Simulate condition checking
    for (let i = 0; i < conditions.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setConditions((prev) =>
        prev.map((cond, idx) =>
          idx === i
            ? { ...cond, status: 'checking', progress: 50 }
            : cond
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setConditions((prev) =>
        prev.map((cond, idx) =>
          idx === i
            ? { ...cond, status: 'met', progress: 100 }
            : cond
        )
      );

      setCurrentStage(i + 1);
    }

    // Simulate payment release
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setPaymentStages((prev) =>
      prev.map((stage, idx) =>
        idx === 1
          ? { ...stage, status: 'released', timestamp: new Date() }
          : stage
      )
    );

    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setConditions((prev) =>
      prev.map((cond) => ({ ...cond, status: 'pending', progress: 0 }))
    );
    setPaymentStages((prev) =>
      prev.map((stage, idx) =>
        idx === 0
          ? stage
          : { ...stage, status: 'locked', timestamp: undefined }
      )
    );
    setCurrentStage(0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-3">
            <Shield className="text-emerald-500" size={36} />
            Smart Contract Simulator
          </h1>
          <p className="text-slate-500 font-medium">Visualize automated payment release conditions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetSimulation}
            disabled={isSimulating}
            className="h-12 px-6 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={simulateContract}
            disabled={isSimulating}
            className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Zap size={18} />
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* Contract Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Contract Address</div>
            <div className="text-white font-mono text-sm break-all">{contractData.contractAddress}</div>
          </div>
          <div>
            <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Total Amount</div>
            <div className="text-3xl font-black">₹{contractData.totalAmount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Status</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-lg font-bold uppercase">{contractData.status}</span>
            </div>
          </div>
          <div>
            <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Farmers</div>
            <div className="text-3xl font-black">{contractData.farmersCount}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-slate-200 shadow-sm">
        {['overview', 'conditions', 'code'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 h-12 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Payment Stages */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                  <DollarSign className="text-emerald-500" size={24} />
                  Multi-Stage Payment Release
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Automated payment distribution based on milestones</p>
              </div>

              <div className="space-y-4">
                {paymentStages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      stage.status === 'completed'
                        ? 'bg-emerald-50 border-emerald-200'
                        : stage.status === 'released'
                        ? 'bg-blue-50 border-blue-200'
                        : stage.status === 'pending'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                            stage.status === 'completed'
                              ? 'bg-emerald-500 text-white'
                              : stage.status === 'released'
                              ? 'bg-blue-500 text-white'
                              : stage.status === 'pending'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-300 text-slate-600'
                          }`}
                        >
                          {stage.status === 'completed' ? (
                            <CheckCircle size={24} />
                          ) : stage.status === 'released' ? (
                            <Unlock size={24} />
                          ) : stage.status === 'pending' ? (
                            <Clock size={24} />
                          ) : (
                            <Lock size={24} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{stage.name}</h3>
                          <p className="text-sm text-slate-600 font-medium">{stage.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900">₹{stage.amount.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 font-bold">{stage.percentage}% of total</div>
                      </div>
                    </div>
                    {stage.timestamp && (
                      <div className="text-xs text-slate-500 font-medium">
                        Released: {stage.timestamp.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Visualization */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Payment Progress</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-600">Released</span>
                  <span className="text-emerald-600">
                    ₹{contractData.releasedAmount.toLocaleString()} / ₹{contractData.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000"
                    style={{ width: `${(contractData.releasedAmount / contractData.totalAmount) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-2xl font-black text-emerald-600">₹{contractData.releasedAmount.toLocaleString()}</div>
                    <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Released</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-black text-slate-900">₹{contractData.lockedAmount.toLocaleString()}</div>
                    <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Locked</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'conditions' && (
          <motion.div
            key="conditions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg"
          >
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                <CheckCircle className="text-blue-500" size={24} />
                Release Conditions
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-1">All conditions must be met for payment release</p>
            </div>

            <div className="space-y-4">
              {conditions.map((condition, index) => (
                <div
                  key={condition.id}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    condition.status === 'met'
                      ? 'bg-emerald-50 border-emerald-200'
                      : condition.status === 'checking'
                      ? 'bg-blue-50 border-blue-200'
                      : condition.status === 'failed'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          condition.status === 'met'
                            ? 'bg-emerald-500 text-white'
                            : condition.status === 'checking'
                            ? 'bg-blue-500 text-white'
                            : condition.status === 'failed'
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        {condition.status === 'met' ? (
                          <CheckCircle size={20} />
                        ) : condition.status === 'checking' ? (
                          <Clock size={20} className="animate-spin" />
                        ) : condition.status === 'failed' ? (
                          <AlertCircle size={20} />
                        ) : (
                          <span className="font-black text-sm">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-900 mb-1">{condition.name}</h3>
                        <p className="text-sm text-slate-600 font-medium">{condition.description}</p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                        condition.status === 'met'
                          ? 'bg-emerald-100 text-emerald-600'
                          : condition.status === 'checking'
                          ? 'bg-blue-100 text-blue-600'
                          : condition.status === 'failed'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {condition.status}
                    </div>
                  </div>
                  {condition.status === 'checking' && (
                    <div className="mt-4">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${condition.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'code' && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-700 shadow-lg"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <Code className="text-emerald-400" size={24} />
                  Smart Contract Code
                </h2>
                <p className="text-slate-400 font-medium text-sm mt-1">Solidity implementation (simplified)</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs font-black text-emerald-400 uppercase tracking-wider">
                Ethereum L2
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-6 font-mono text-sm text-slate-300 overflow-x-auto">
              <pre className="whitespace-pre-wrap">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriEscrow {
    address public buyer;
    address[] public farmers;
    uint256 public totalAmount;
    uint256 public releasedAmount;
    
    enum Stage { Advance, Dispatch, Delivery, Final }
    mapping(Stage => bool) public stageCompleted;
    
    struct Condition {
        bool qualityVerified;
        bool quantityConfirmed;
        bool deliveryConfirmed;
        bool blockchainVerified;
    }
    
    Condition public conditions;
    
    event PaymentReleased(Stage stage, uint256 amount);
    event ConditionMet(string condition);
    
    function releasePayment(Stage stage) public {
        require(allConditionsMet(), "Conditions not met");
        require(!stageCompleted[stage], "Already released");
        
        uint256 amount = calculateStageAmount(stage);
        distributeFunds(amount);
        
        stageCompleted[stage] = true;
        releasedAmount += amount;
        
        emit PaymentReleased(stage, amount);
    }
    
    function allConditionsMet() internal view returns (bool) {
        return conditions.qualityVerified &&
               conditions.quantityConfirmed &&
               conditions.deliveryConfirmed &&
               conditions.blockchainVerified;
    }
    
    function distributeFunds(uint256 amount) internal {
        for (uint i = 0; i < farmers.length; i++) {
            uint256 share = calculateShare(farmers[i], amount);
            payable(farmers[i]).transfer(share);
        }
    }
}`}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
