'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, MapPin, Clock, CheckCircle, AlertCircle, TrendingUp,
  Truck, Eye, Zap, BarChart3, MessageSquare, Settings,
  Phone, FileText, Activity, Smartphone, Lock, Users
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'order-status', name: 'Order Status', icon: Package, description: 'Real-time status', color: 'blue' },
  { id: 'real-time-updates', name: 'Real-Time Updates', icon: Activity, description: 'Live notifications', color: 'indigo', badge: 'NEW' },
  { id: 'shipment-tracking', name: 'Shipment Tracking', icon: Truck, description: 'GPS tracking', color: 'emerald' },
  { id: 'delivery-estimates', name: 'Delivery Estimates', icon: Clock, description: 'ETA predictions', color: 'purple' },
  { id: 'route-visualization', name: 'Route Visualization', icon: MapPin, description: 'Map view', color: 'rose' },
  { id: 'proof-of-delivery', name: 'Proof of Delivery', icon: CheckCircle, description: 'Delivery proof', color: 'amber' },
  { id: 'issue-reporting', name: 'Issue Reporting', icon: AlertCircle, description: 'Report problems', color: 'cyan' },
  { id: 'notification-prefs', name: 'Notification Preferences', icon: Bell, description: 'Alert settings', color: 'teal' },
  { id: 'order-history', name: 'Order History', icon: FileText, description: 'Past orders', color: 'violet' },
  { id: 'bulk-tracking', name: 'Bulk Order Tracking', icon: Users, description: 'Multiple orders', color: 'orange' },
  { id: 'performance-analytics', name: 'Performance Analytics', icon: BarChart3, description: 'Metrics', color: 'pink' },
  { id: 'feedback-collection', name: 'Feedback Collection', icon: MessageSquare, description: 'Reviews', color: 'red' }
];

const stats = [
  { label: 'Active Orders', value: '12', icon: Package, color: 'blue', trend: '+3' },
  { label: 'On-Time Rate', value: '96.2%', icon: CheckCircle, color: 'emerald', trend: '+2%' },
  { label: 'Avg Delivery', value: '2.3 days', icon: Clock, color: 'purple', trend: '-0.5' },
  { label: 'Total Tracked', value: '847', icon: Eye, color: 'indigo', trend: '+45' }
];

export default function OrderTrackerAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'order-status': return <OrderStatus />;
      case 'real-time-updates': return <RealTimeUpdates />;
      case 'shipment-tracking': return <ShipmentTracking />;
      case 'delivery-estimates': return <DeliveryEstimates />;
      case 'route-visualization': return <RouteVisualization />;
      case 'proof-of-delivery': return <ProofOfDelivery />;
      case 'issue-reporting': return <IssueReporting />;
      case 'notification-prefs': return <NotificationPrefs />;
      case 'order-history': return <OrderHistory />;
      case 'bulk-tracking': return <BulkTracking />;
      case 'performance-analytics': return <PerformanceAnalytics />;
      case 'feedback-collection': return <FeedbackCollection />;
      default: return <OrderStatus />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Order Tracker"
      description="Real-time order tracking and delivery management"
      icon={Package}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function OrderStatus() {
  const orders = [
    { id: 'ORD-001', product: 'Basmati Rice 5000kg', status: 'in-transit', progress: 75, eta: '2024-01-20' },
    { id: 'ORD-002', product: 'Wheat 3000kg', status: 'delivered', progress: 100, eta: '2024-01-18' },
    { id: 'ORD-003', product: 'Corn 2000kg', status: 'processing', progress: 25, eta: '2024-01-22' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Order Status</h2>
        <p className="text-slate-500 font-medium mt-1">Track all your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{order.id}</h3>
                <p className="text-sm text-slate-600 font-medium">{order.product}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                order.status === 'in-transit' ? 'bg-blue-100 text-blue-600' :
                'bg-amber-100 text-amber-600'
              }`}>
                {order.status}
              </div>
            </div>
            <div className="mb-3">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${order.progress}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">{order.progress}% Complete</span>
              <span className="text-slate-600 font-medium">ETA: {order.eta}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RealTimeUpdates() {
  const updates = [
    { id: 1, event: 'Order Confirmed', time: '10:30 AM', status: 'completed' },
    { id: 2, event: 'Picked from Warehouse', time: '11:45 AM', status: 'completed' },
    { id: 3, event: 'In Transit', time: '2:15 PM', status: 'in-progress' },
    { id: 4, event: 'Out for Delivery', time: 'Pending', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Real-Time Updates</h2>
        <p className="text-slate-500 font-medium mt-1">Live order notifications</p>
      </div>

      <div className="space-y-3">
        {updates.map((update, idx) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-4 border border-slate-200"
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-black text-white ${
                update.status === 'completed' ? 'bg-emerald-500' :
                update.status === 'in-progress' ? 'bg-blue-500' :
                'bg-slate-300'
              }`}>
                {update.status === 'completed' ? <CheckCircle size={20} /> : update.id}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900">{update.event}</h3>
                <p className="text-sm text-slate-600 font-medium">{update.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ShipmentTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Shipment Tracking</h2>
        <p className="text-slate-500 font-medium mt-1">GPS-based tracking</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Truck size={48} className="mx-auto text-blue-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Current Location</h3>
          <p className="text-lg font-black text-blue-600 mb-2">Delhi - Gurgaon Highway</p>
          <p className="text-sm text-slate-600 font-medium">Moving towards destination</p>
        </div>
      </PremiumCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <MetricDisplay label="Distance Covered" value="245 km" icon={MapPin} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Remaining" value="125 km" icon={Clock} color="purple" />
        </PremiumCard>
      </div>
    </div>
  );
}

function DeliveryEstimates() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Delivery Estimates</h2>
        <p className="text-slate-500 font-medium mt-1">Predicted delivery times</p>
      </div>

      <div className="space-y-4">
        <PremiumCard className="p-6 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-slate-900">Estimated Delivery</h3>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-600">2024-01-20</div>
              <div className="text-xs text-slate-600 font-bold">2:30 PM - 4:30 PM</div>
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium">Confidence: 94%</p>
        </PremiumCard>

        <PremiumCard className="p-6">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Current Speed</span>
            <span className="font-black text-slate-900">65 km/h</span>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function RouteVisualization() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Route Visualization</h2>
        <p className="text-slate-500 font-medium mt-1">Map view of delivery route</p>
      </div>

      <PremiumCard className="p-8 bg-slate-100 rounded-2xl h-96 flex items-center justify-center">
        <div className="text-center">
          <MapPin size={64} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 font-medium">Map view loading...</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function ProofOfDelivery() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Proof of Delivery</h2>
        <p className="text-slate-500 font-medium mt-1">Delivery confirmation</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Delivered</h3>
          <p className="text-lg font-black text-emerald-600 mb-2">2024-01-18 at 3:45 PM</p>
          <p className="text-sm text-slate-600 font-medium">Signed by: Rajesh Kumar</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function IssueReporting() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Issue Reporting</h2>
          <p className="text-slate-500 font-medium mt-1">Report delivery issues</p>
        </div>
        <ActionButton variant="danger" icon={AlertCircle}>Report Issue</ActionButton>
      </div>

      <PremiumCard className="p-8 text-center">
        <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
        <h3 className="text-xl font-black text-slate-900">No Issues Reported</h3>
        <p className="text-slate-600 font-medium mt-2">All deliveries on track</p>
      </PremiumCard>
    </div>
  );
}

function NotificationPrefs() {
  const prefs = [
    { name: 'Order Confirmed', enabled: true },
    { name: 'Shipment Dispatched', enabled: true },
    { name: 'Out for Delivery', enabled: true },
    { name: 'Delivery Completed', enabled: true },
    { name: 'Delivery Delayed', enabled: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Notification Preferences</h2>
        <p className="text-slate-500 font-medium mt-1">Manage alert settings</p>
      </div>

      <div className="space-y-3">
        {prefs.map((pref, idx) => (
          <PremiumCard key={idx} className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900">{pref.name}</span>
              <div className={`h-6 w-11 rounded-full transition-all ${pref.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function OrderHistory() {
  const history = [
    { id: 'ORD-001', date: '2024-01-15', amount: '₹4,25,000', status: 'delivered' },
    { id: 'ORD-002', date: '2024-01-10', amount: '₹1,26,000', status: 'delivered' },
    { id: 'ORD-003', date: '2024-01-05', amount: '₹56,000', status: 'delivered' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Order History</h2>
        <p className="text-slate-500 font-medium mt-1">Past orders and details</p>
      </div>

      <div className="space-y-3">
        {history.map((item, idx) => (
          <PremiumCard key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">{item.id}</h3>
                <p className="text-sm text-slate-600 font-medium">{item.date}</p>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-900">{item.amount}</div>
                <div className="text-xs text-emerald-600 font-black uppercase">{item.status}</div>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function BulkTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Bulk Order Tracking</h2>
        <p className="text-slate-500 font-medium mt-1">Track multiple orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Total Orders" value="12" icon={Package} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="In Transit" value="5" icon={Truck} color="purple" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Delivered" value="7" icon={CheckCircle} color="emerald" />
        </PremiumCard>
      </div>
    </div>
  );
}

function PerformanceAnalytics() {
  const chartData = [
    { month: 'Jan', onTime: 96, delayed: 4 },
    { month: 'Feb', onTime: 94, delayed: 6 },
    { month: 'Mar', onTime: 97, delayed: 3 },
    { month: 'Apr', onTime: 96, delayed: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Performance Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Delivery performance metrics</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">On-Time Delivery Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={3} name="On-Time" />
          </LineChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function FeedbackCollection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Feedback Collection</h2>
        <p className="text-slate-500 font-medium mt-1">Rate your delivery experience</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <MessageSquare size={48} className="mx-auto text-purple-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-4">How was your delivery?</h3>
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-4xl hover:scale-110 transition-transform">
                ⭐
              </button>
            ))}
          </div>
          <button className="h-12 px-6 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all">
            Submit Feedback
          </button>
        </div>
      </PremiumCard>
    </div>
  );
}
