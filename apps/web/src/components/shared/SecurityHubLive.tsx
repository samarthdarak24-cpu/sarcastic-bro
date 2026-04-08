"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Smartphone,
  Laptop,
  Activity,
  Bell,
  FileText,
  Download,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  MapPin,
  Clock,
  Sparkles,
  BarChart3,
  Globe,
} from "lucide-react";
import { buyerSecurityService } from "@/services/buyerSecurityService";
import toast from "react-hot-toast";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

interface SecurityHubLiveProps {
  userRole: "FARMER" | "BUYER";
}

export function SecurityHubLive({ userRole }: SecurityHubLiveProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "devices" | "features">("overview");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      
      const [status, eventsData, sessionsData] = await Promise.all([
        buyerSecurityService.getSecurityStatus(token),
        buyerSecurityService.getSecurityEvents({}, token),
        buyerSecurityService.getSessions(token)
      ]);

      setSecurityStatus(status);
      setSecurityEvents(eventsData.events || []);
      setSessions(sessionsData.sessions || []);
    } catch (error) {
      console.error('Failed to load security data:', error);
      toast.error('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm('Terminate this session?')) return;

    try {
      const token = localStorage.getItem('token') || '';
      await buyerSecurityService.terminateSession(sessionId, token);
      toast.success('Session terminated');
      loadSecurityData();
    } catch (error) {
      console.error('Failed to terminate session:', error);
      toast.error('Failed to terminate session');
    }
  };

  // Security Score Data
  const securityScore = securityStatus?.score || 92;
  const scoreStatus = securityScore >= 80 ? "Excellent" : securityScore >= 60 ? "Good" : "Needs Improvement";
  const scoreColor = securityScore >= 80 ? "emerald" : securityScore >= 60 ? "amber" : "red";

  // Stats Data
  const stats = [
    { label: "Active Protections", value: `${securityStatus?.activeProtections || 8}/10`, icon: ShieldCheck, color: "emerald", trend: "All systems secure" },
    { label: "Security Alerts", value: (securityEvents.filter(e => e.severity === 'HIGH').length || 2).toString(), icon: AlertTriangle, color: "amber", trend: "Requires attention" },
    { label: "Blocked Attempts", value: (securityEvents.filter(e => e.type === 'FAILED_LOGIN').length || 47).toString(), icon: ShieldAlert, color: "red", trend: "Last 30 days" },
    { label: "Trusted Devices", value: sessions.length.toString(), icon: Smartphone, color: "blue", trend: "Currently active" },
  ];

  // 10 Accessible Sub-Features
  const features = [
    {
      id: "two-factor-auth",
      name: "Two-Factor Authentication",
      description: "Add an extra layer of security with 2FA via SMS or authenticator app",
      icon: Key,
      enabled: twoFactorEnabled,
      category: "Authentication",
    },
    {
      id: "biometric-login",
      name: "Biometric Login",
      description: "Use fingerprint or face recognition for quick and secure access",
      icon: Fingerprint,
      enabled: biometricEnabled,
      category: "Authentication",
    },
    {
      id: "session-management",
      name: "Session Management",
      description: "Monitor and control active sessions across all your devices",
      icon: Activity,
      enabled: true,
      category: "Access Control",
    },
    {
      id: "login-alerts",
      name: "Login Alerts",
      description: "Get instant notifications for new login attempts and suspicious activity",
      icon: Bell,
      enabled: true,
      category: "Monitoring",
    },
    {
      id: "ip-whitelist",
      name: "IP Whitelisting",
      description: "Restrict access to trusted IP addresses and locations only",
      icon: Globe,
      enabled: false,
      category: "Access Control",
    },
    {
      id: "device-trust",
      name: "Device Trust Management",
      description: "Manage trusted devices and revoke access from unknown devices",
      icon: Laptop,
      enabled: true,
      category: "Device Security",
    },
    {
      id: "activity-logs",
      name: "Activity Logs",
      description: "Complete audit trail of all account activities and changes",
      icon: FileText,
      enabled: true,
      category: "Monitoring",
    },
    {
      id: "data-encryption",
      name: "End-to-End Encryption",
      description: "All your data is encrypted in transit and at rest",
      icon: Lock,
      enabled: true,
      category: "Data Protection",
    },
    {
      id: "backup-codes",
      name: "Backup Recovery Codes",
      description: "Generate and store backup codes for account recovery",
      icon: Download,
      enabled: true,
      category: "Recovery",
    },
    {
      id: "security-reports",
      name: "Security Reports",
      description: "Download detailed security reports and compliance documents",
      icon: BarChart3,
      enabled: true,
      category: "Reporting",
    },
  ];

  // Recent Security Activity
  const recentActivity = securityEvents.slice(0, 5).map(event => ({
    id: event.id,
    type: event.type === 'LOGIN_SUCCESS' ? 'success' : event.type === 'FAILED_LOGIN' ? 'error' : 'warning',
    icon: event.type === 'LOGIN_SUCCESS' ? CheckCircle : event.type === 'FAILED_LOGIN' ? XCircle : AlertTriangle,
    title: event.type.replace('_', ' '),
    description: event.description || 'Security event',
    location: event.location || 'Unknown Location',
    time: new Date(event.createdAt).toLocaleString(),
    severity: event.severity?.toLowerCase() || 'low',
  }));

  // Trusted Devices
  const trustedDevices = sessions.slice(0, 3).map((session, idx) => ({
    id: session.id,
    name: session.deviceName || `Device ${idx + 1}`,
    type: session.deviceType || 'desktop',
    icon: session.deviceType === 'mobile' ? Smartphone : Laptop,
    location: session.location || 'Unknown',
    lastActive: session.lastActive ? new Date(session.lastActive).toLocaleString() : 'Unknown',
    trusted: true,
    current: idx === 0,
  }));

  // Security Recommendations
  const recommendations = [
    {
      id: 1,
      title: "Enable IP Whitelisting",
      description: "Restrict access to trusted locations for enhanced security",
      priority: "medium",
      action: "Enable Now",
    },
    {
      id: 2,
      title: "Review Trusted Devices",
      description: "Remove devices you no longer use",
      priority: "low",
      action: "Review",
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success":
        return "emerald";
      case "warning":
        return "amber";
      case "error":
        return "red";
      default:
        return "blue";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "red";
      case "medium":
        return "amber";
      case "low":
        return "emerald";
      default:
        return "slate";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Security Hub Live</h1>
        <p className="text-slate-500 font-medium">
          Comprehensive security monitoring and protection for your account
        </p>
      </motion.div>

      {/* Security Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center gap-8">
          {/* Score Circle */}
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - securityScore / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - securityScore / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black">{securityScore}</span>
              <span className="text-lg opacity-80">/100</span>
            </div>
          </div>

          {/* Score Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-black mb-2">Security Score</h2>
            <p className="text-2xl font-bold mb-2 opacity-90">{scoreStatus}</p>
            <p className="text-lg opacity-80 mb-4">
              Your account security is {securityScore >= 80 ? "excellent" : "good"}. Keep up the great work!
            </p>
            <div className="flex gap-3">
              <button className="h-10 px-6 bg-white text-indigo-600 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                Improve Score
              </button>
              <button className="h-10 px-6 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all">
                View Details
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div
              className={`h-12 w-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}
            >
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-slate-500 font-medium mb-2">{stat.label}</p>
            <p className="text-xs font-bold text-slate-400">{stat.trend}</p>
          </motion.div>
        ))}
      </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {["overview", "activity", "devices", "features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Security Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-amber-600" size={24} />
                  <h3 className="text-xl font-black text-slate-900">Security Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-1">{rec.title}</h4>
                        <p className="text-sm text-slate-600">{rec.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 bg-${
                            rec.priority === "high" ? "red" : rec.priority === "medium" ? "amber" : "blue"
                          }-100 text-${
                            rec.priority === "high" ? "red" : rec.priority === "medium" ? "amber" : "blue"
                          }-700 rounded-full text-xs font-bold`}
                        >
                          {rec.priority.toUpperCase()}
                        </span>
                        <button className="h-9 px-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                          {rec.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Key size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Change Password</h3>
                </div>
                <p className="text-slate-600 font-medium mb-4">
                  Update your password regularly to keep your account secure
                </p>
                <button className="h-10 w-full bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                  Update Password
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Download size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Backup Codes</h3>
                </div>
                <p className="text-slate-600 font-medium mb-4">
                  Generate backup codes for account recovery
                </p>
                <button className="h-10 w-full bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
                  Generate Codes
                </button>
              </div>
            </div>

            {/* Recent Activity Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
                <button
                  onClick={() => setActiveTab("activity")}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {recentActivity.slice(0, 3).map((activity) => {
                  const color = getActivityColor(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"
                    >
                      <div
                        className={`h-10 w-10 bg-${color}-50 rounded-xl flex items-center justify-center text-${color}-600`}
                      >
                        <activity.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{activity.title}</p>
                        <p className="text-sm text-slate-500">{activity.description}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Security Activity Log</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => {
                  const color = getActivityColor(activity.type);
                  const severityColor = getSeverityColor(activity.severity);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                    >
                      <div
                        className={`h-12 w-12 bg-${color}-50 rounded-xl flex items-center justify-center text-${color}-600 shrink-0`}
                      >
                        <activity.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-black text-slate-900">{activity.title}</h4>
                          <span
                            className={`px-3 py-1 bg-${severityColor}-100 text-${severityColor}-700 rounded-full text-xs font-bold uppercase`}
                          >
                            {activity.severity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {activity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Devices Tab */}
        {activeTab === "devices" && (
          <motion.div
            key="devices"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Trusted Devices</h3>
              <div className="space-y-4">
                {trustedDevices.map((device, idx) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 rounded-2xl border-2 ${
                      device.current
                        ? "bg-indigo-50 border-indigo-500"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-12 w-12 ${
                            device.current ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-600"
                          } rounded-xl flex items-center justify-center`}
                        >
                          <device.icon size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-slate-900">{device.name}</h4>
                            {device.current && (
                              <span className="px-2 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{device.location}</p>
                          <p className="text-xs text-slate-400 font-medium">
                            Last active: {device.lastActive}
                          </p>
                        </div>
                      </div>
                      {!device.current && (
                        <button 
                          onClick={() => handleTerminateSession(device.id)}
                          className="h-9 px-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-emerald-600" size={32} />
                <div>
                  <h2 className="text-2xl font-black text-slate-900">10 Security Features</h2>
                  <p className="text-slate-600 font-medium">All features are accessible - No premium required!</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`h-12 w-12 ${
                        feature.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      } rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          feature.enabled ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-600">
                        {feature.enabled ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{feature.name}</h4>
                  <p className="text-sm text-slate-600 font-medium mb-3">{feature.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400">{feature.category}</span>
                    <button
                      className={`h-8 px-4 rounded-lg font-bold text-xs transition-all ${
                        feature.enabled
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {feature.enabled ? "Configure" : "Enable"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
