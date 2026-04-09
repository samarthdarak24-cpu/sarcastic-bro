'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Lock, AlertTriangle, CheckCircle, Eye, Key,
  Smartphone, Globe, Activity, Clock, UserCheck, FileText,
  Bell, Settings, RefreshCw, XCircle
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'suspicious' | 'success';
  message: string;
  timestamp: string;
  location: string;
  device: string;
}

export function SecurityDashboard() {
  const [filter, setFilter] = useState<string>('all');

  const securityScore = 85;
  
  const stats = [
    { label: 'Security Score', value: `${securityScore}%`, icon: Shield, color: 'from-green-500 to-emerald-600', status: 'Good' },
    { label: 'Active Sessions', value: '3', icon: Activity, color: 'from-blue-500 to-cyan-600', status: 'Normal' },
    { label: 'Failed Attempts', value: '0', icon: XCircle, color: 'from-slate-500 to-gray-600', status: 'Secure' },
    { label: 'Last Scan', value: '2h ago', icon: Clock, color: 'from-purple-500 to-pink-600', status: 'Recent' },
  ];

  const securityFeatures = [
    { label: 'Two-Factor Authentication', enabled: true, icon: Smartphone },
    { label: 'Email Verification', enabled: true, icon: CheckCircle },
    { label: 'Login Alerts', enabled: true, icon: Bell },
    { label: 'Session Management', enabled: true, icon: Activity },
    { label: 'IP Whitelisting', enabled: false, icon: Globe },
    { label: 'Biometric Login', enabled: false, icon: UserCheck },
  ];

  const recentEvents: SecurityEvent[] = [
    { id: '1', type: 'login', message: 'Successful login from new device', timestamp: '2 hours ago', location: 'Mumbai, India', device: 'Chrome on Windows' },
    { id: '2', type: 'success', message: 'Password changed successfully', timestamp: '1 day ago', location: 'Mumbai, India', device: 'Mobile App' },
    { id: '3', type: 'login', message: 'Login from usual location', timestamp: '2 days ago', location: 'Mumbai, India', device: 'Chrome on Windows' },
    { id: '4', type: 'success', message: 'Security settings updated', timestamp: '3 days ago', location: 'Mumbai, India', device: 'Chrome on Windows' },
  ];

  const getEventIcon = (type: string) => {
    const icons = {
      login: Activity,
      password_change: Key,
      suspicious: AlertTriangle,
      success: CheckCircle,
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const getEventColor = (type: string) => {
    const colors = {
      login: 'from-blue-500 to-cyan-600',
      password_change: 'from-purple-500 to-pink-600',
      suspicious: 'from-red-500 to-rose-600',
      success: 'from-green-500 to-emerald-600',
    };
    return colors[type as keyof typeof colors] || 'from-slate-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 relative overflow-hidden group"
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />
            
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.status}
              </span>
            </div>
            
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      >
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Shield size={24} className="text-green-600" />
          Security Health
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 352" }}
                animate={{ strokeDasharray: `${(securityScore / 100) * 352} 352` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{securityScore}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-slate-900 mb-2">Your account is secure</p>
            <p className="text-sm text-slate-600 mb-4">
              All critical security features are enabled. Consider enabling IP whitelisting for additional protection.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              View Recommendations
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      >
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Lock size={24} className="text-blue-600" />
          Security Features
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {securityFeatures.map((feature, idx) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl border-2 ${
                feature.enabled
                  ? 'bg-green-50 border-green-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    feature.enabled
                      ? 'bg-green-100 text-green-600'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    <feature.icon size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{feature.label}</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  feature.enabled ? 'bg-green-500' : 'bg-slate-300'
                } relative`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    feature.enabled ? 'right-1' : 'left-1'
                  }`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Activity size={24} className="text-purple-600" />
            Recent Security Events
          </h3>
          <div className="flex gap-2">
            {['all', 'login', 'success'].map(tab => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filter === tab
                    ? 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {recentEvents
            .filter(event => filter === 'all' || event.type === filter)
            .map((event, idx) => {
              const EventIcon = getEventIcon(event.type);
              const eventColor = getEventColor(event.type);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${eventColor} flex items-center justify-center flex-shrink-0`}>
                    <EventIcon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm mb-1">{event.message}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {event.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe size={12} />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Smartphone size={12} />
                        {event.device}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </motion.div>
    </div>
  );
}

export default SecurityDashboard;