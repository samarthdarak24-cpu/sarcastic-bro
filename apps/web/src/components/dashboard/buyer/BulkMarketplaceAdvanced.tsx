'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  ShoppingBag, TrendingUp, Users, Package, MapPin, Zap, 
  Truck, CheckCircle, DollarSign, Calendar, Filter, Settings,
  LucideIcon
} from 'lucide-react';

interface SubFeature {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

const subFeatures: SubFeature[] = [
  { id: 'listings', name: 'Listings', icon: ShoppingBag, description: 'Bulk listings', color: 'blue' },
  { id: 'discovery', name: 'Discovery', icon: Package, description: 'Lot discovery', color: 'emerald' },
  { id: 'pricing', name: 'Pricing', icon: DollarSign, description: 'Bulk pricing', color: 'amber' },
  { id: 'filters', name: 'Filters', icon: Filter, description: 'Quantity filters', color: 'indigo' },
  { id: 'ratings', name: 'Ratings', icon: TrendingUp, description: 'Supplier ratings', color: 'rose' },
  { id: 'negotiations', name: 'Negotiations', icon: Users, description: 'Bulk negotiations', color: 'purple' },
  { id: 'orders', name: 'Orders', icon: CheckCircle, description: 'Batch orders', color: 'cyan' },
  { id: 'inventory', name: 'Inventory', icon: Package, description: 'Inventory management', color: 'violet' },
  { id: 'delivery', name: 'Delivery', icon: Truck, description: 'Delivery scheduling', color: 'orange' },
  { id: 'quality', name: 'Quality', icon: CheckCircle, description: 'Quality assurance', color: 'teal' },
  { id: 'terms', name: 'Terms', icon: Calendar, description: 'Payment terms', color: 'pink' },
  { id: 'logistics', name: 'Logistics', icon: MapPin, description: 'Logistics coordination', color: 'red' },
];

const marketData = [
  { name: 'Rice', listings: 45, price: 2400, suppliers: 12 },
  { name: 'Wheat', listings: 38, price: 2210, suppliers: 10 },
  { name: 'Corn', listings: 52, price: 2290, suppliers: 15 },
  { name: 'Soybean', listings: 28, price: 2000, suppliers: 8 },
  { name: 'Cotton', listings: 35, price: 2181, suppliers: 11 },
];

function BulkListings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Active Listings" value="1,247" icon={ShoppingBag} color="blue" trend="+18%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Total Quantity" value="45.2K" icon={Package} color="emerald" trend="+12%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Avg Lot Size" value="2.8T" icon={TrendingUp} color="amber" trend="+5%" />
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Listings</h3>
        <div className="space-y-3">
          {[
            { product: 'Basmati Rice', qty: '500kg', price: '₹45/kg', supplier: 'Ramesh Yadav' },
            { product: 'Wheat Grain', qty: '1000kg', price: '₹28/kg', supplier: 'Farmer Co-op' },
            { product: 'Cotton Bales', qty: '50 bales', price: '₹8500/bale', supplier: 'Cotton Mills' },
          ].map((listing, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{listing.product}</p>
                <p className="text-xs text-slate-600">{listing.supplier}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{listing.qty}</p>
                <p className="text-sm text-emerald-600">{listing.price}</p>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function LotDiscovery() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Market Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={marketData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="listings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="suppliers" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function BulkPricing() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Price Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </PremiumCard>
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Bulk Discounts</h3>
          <div className="space-y-3">
            {[
              { qty: '100-500 kg', discount: '5%' },
              { qty: '500-1000 kg', discount: '10%' },
              { qty: '1000-5000 kg', discount: '15%' },
              { qty: '5000+ kg', discount: '20%' },
            ].map((tier, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                <span className="font-medium text-slate-700">{tier.qty}</span>
                <span className="font-bold text-emerald-600">{tier.discount}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function QuantityFilters() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Filter Options</h3>
        <div className="space-y-4">
          {[
            { label: 'Minimum Quantity', value: '100 kg' },
            { label: 'Maximum Quantity', value: '10000 kg' },
            { label: 'Price Range', value: '₹20 - ₹100/kg' },
            { label: 'Quality Grade', value: 'A, B, C' },
          ].map((filter, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <span className="font-medium text-slate-700">{filter.label}</span>
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                {filter.value}
              </button>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function SupplierRatings() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Top Suppliers</h3>
        <div className="space-y-3">
          {[
            { name: 'Ramesh Yadav Group', rating: 4.8, reviews: 245, listings: 45 },
            { name: 'Farmer Co-operative', rating: 4.6, reviews: 189, listings: 38 },
            { name: 'Cotton Mills Ltd', rating: 4.7, reviews: 156, listings: 52 },
          ].map((supplier, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{supplier.name}</p>
                <span className="text-sm font-bold text-amber-600">★ {supplier.rating}</span>
              </div>
              <p className="text-xs text-slate-600">{supplier.reviews} reviews • {supplier.listings} listings</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function BulkNegotiations() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">23</div>
            <p className="text-sm font-medium text-slate-600">Active Negotiations</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">₹2.5L</div>
            <p className="text-sm font-medium text-slate-600">Avg Deal Value</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">87%</div>
            <p className="text-sm font-medium text-slate-600">Success Rate</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function BatchOrders() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {[
            { id: '#ORD-001', items: 5, qty: '2500kg', status: 'Confirmed', color: 'emerald' },
            { id: '#ORD-002', items: 3, qty: '1800kg', status: 'Processing', color: 'blue' },
            { id: '#ORD-003', items: 7, qty: '4200kg', status: 'Pending', color: 'amber' },
          ].map((order, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{order.id}</p>
                <p className="text-xs text-slate-600">{order.items} items • {order.qty}</p>
              </div>
              <span className={`px-3 py-1 bg-${order.color}-50 text-${order.color}-700 rounded-lg text-xs font-bold`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function InventoryManagement() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Inventory Status</h3>
        <div className="space-y-4">
          {[
            { product: 'Basmati Rice', stock: 5000, unit: 'kg', status: 'In Stock' },
            { product: 'Wheat Grain', stock: 3200, unit: 'kg', status: 'In Stock' },
            { product: 'Cotton Bales', stock: 45, unit: 'bales', status: 'Low Stock' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{item.product}</p>
                <span className={`text-xs font-bold ${item.status === 'In Stock' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-slate-600">{item.stock} {item.unit}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function DeliveryScheduling() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Scheduled Deliveries</h3>
        <div className="space-y-3">
          {[
            { date: 'Today', orders: 3, qty: '1200kg', status: 'On Track' },
            { date: 'Tomorrow', orders: 5, qty: '2800kg', status: 'On Track' },
            { date: 'Next Week', orders: 8, qty: '4500kg', status: 'Scheduled' },
          ].map((delivery, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{delivery.date}</p>
                <p className="text-xs text-slate-600">{delivery.orders} orders • {delivery.qty}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">{delivery.status}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function QualityAssurance() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Quality Score" value="94.5%" icon={CheckCircle} color="emerald" trend="+2%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Inspections" value="847" icon={TrendingUp} color="blue" trend="+12%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Rejections" value="2.1%" icon={Package} color="red" trend="-0.5%" />
        </PremiumCard>
      </div>
    </div>
  );
}

function PaymentTerms() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Options</h3>
        <div className="space-y-3">
          {[
            { term: 'Immediate Payment', discount: '2%' },
            { term: '7 Days Credit', discount: '0%' },
            { term: '15 Days Credit', discount: '-1%' },
            { term: '30 Days Credit', discount: '-2%' },
          ].map((option, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <span className="font-medium text-slate-700">{option.term}</span>
              <span className={`font-bold ${option.discount.startsWith('-') ? 'text-red-600' : 'text-emerald-600'}`}>
                {option.discount}
              </span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function LogisticsCoordination() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Logistics Partners</h3>
        <div className="space-y-3">
          {[
            { partner: 'Express Logistics', coverage: 'Pan-India', rating: 4.7 },
            { partner: 'Regional Transport', coverage: 'North India', rating: 4.5 },
            { partner: 'Cold Chain Pro', coverage: 'Specialized', rating: 4.9 },
          ].map((partner, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{partner.partner}</p>
                <p className="text-xs text-slate-600">{partner.coverage}</p>
              </div>
              <span className="text-sm font-bold text-amber-600">★ {partner.rating}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

export function BulkMarketplaceAdvanced() {
  const stats = [
    { label: 'Active Listings', value: '1,247', icon: ShoppingBag, color: 'blue', trend: '+18%' },
    { label: 'Total Quantity', value: '45.2K', icon: Package, color: 'emerald', trend: '+12%' },
    { label: 'Avg Deal Value', value: '₹2.5L', icon: DollarSign, color: 'amber', trend: '+15%' },
    { label: 'Success Rate', value: '87%', icon: CheckCircle, color: 'indigo', trend: '+5%' },
  ];

  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'listings': return <BulkListings />;
      case 'discovery': return <LotDiscovery />;
      case 'pricing': return <BulkPricing />;
      case 'filters': return <QuantityFilters />;
      case 'ratings': return <SupplierRatings />;
      case 'negotiations': return <BulkNegotiations />;
      case 'orders': return <BatchOrders />;
      case 'inventory': return <InventoryManagement />;
      case 'delivery': return <DeliveryScheduling />;
      case 'quality': return <QualityAssurance />;
      case 'terms': return <PaymentTerms />;
      case 'logistics': return <LogisticsCoordination />;
      default: return <BulkListings />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Bulk Marketplace"
      description="Discover and manage bulk agricultural products"
      icon={ShoppingBag}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
