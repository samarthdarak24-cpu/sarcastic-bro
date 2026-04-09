'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, Clock, CheckCircle, AlertTriangle, RefreshCw, Package,
  MapPin, Phone, Mail, Navigation, TrendingUp, DollarSign,
  Calendar, User, FileText, Download, Search, Filter,
  BarChart3, ThermometerSun, Droplets, Box, ArrowRight,
  ExternalLink, Star, Shield, Zap, Route, Activity,
  AlertCircle, Info, Settings, Bell, Eye, Edit, Trash2,
  Plus, Send, MessageSquare, Camera, FileCheck, Layers
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShipmentItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  weight: number;
  value: number;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
  temperature?: number;
  humidity?: number;
}

interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED' | 'CANCELLED';
  origin: string;
  destination: string;
  carrier: string;
  carrierLogo?: string;
  trackingNumber: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  currentLocation?: string;
  distance: number;
  weight: number;
  temperature?: number;
  humidity?: number;
  cost: number;
  items: ShipmentItem[];
  timeline: TimelineEvent[];
  createdAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  carrierContact?: string;
  carrierEmail?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  rating?: number;
  insurance: boolean;
  insuranceAmount?: number;
  specialInstructions?: string;
  vehicleType: string;
  driverName?: string;
  driverPhone?: string;
  estimatedCost: number;
  actualCost?: number;
  delayReason?: string;
  proofOfDelivery?: string;
}

interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: string;
  capacity: number;
  currentLocation: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  driver: string;
  lastMaintenance: string;
}

interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: string;
  cost: number;
  frequency: string;
}

export default function LogisticsManagerPremium() {
  const [activeTab, setActiveTab] = useState<'overview' | 'shipments' | 'tracking' | 'vehicles' | 'routes' | 'analytics' | 'costs' | 'alerts' | 'reports' | 'settings'>('overview');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'cost' | 'distance'>('date');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [shipments, searchQuery, statusFilter, sortBy]);

  const loadData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockShipments: Shipment[] = [
        {
          id: '1',
          shipmentNumber: 'SHP-001',
          orderId: 'ORD-2024-001',
          status: 'IN_TRANSIT',
          origin: 'Nashik Farm, Maharashtra',
          destination: 'Mumbai Market, Maharashtra',
          carrier: 'BlueDart Express',
          trackingNumber: 'BD123456789IN',
          estimatedDelivery: '2024-04-06T18:00:00',
          currentLocation: 'Thane Junction',
          distance: 185,
          weight: 1200,
          temperature: 22,
          humidity: 65,
          cost: 8500,
          estimatedCost: 8500,
          priority: 'HIGH',
          rating: 4.5,
          carrierContact: '+91 98765 43210',
          carrierEmail: 'support@bluedart.com',
          insurance: true,
          insuranceAmount: 50000,
          vehicleType: 'Refrigerated Truck',
          driverName: 'Rajesh Kumar',
          driverPhone: '+91 98765 00001',
          items: [
            { id: '1', productName: 'Organic Wheat', quantity: 500, unit: 'kg', weight: 500, value: 25000 },
            { id: '2', productName: 'Basmati Rice', quantity: 700, unit: 'kg', weight: 700, value: 42000 }
          ],
          timeline: [
            { id: '1', timestamp: '2024-04-06T08:00:00', location: 'Nashik Farm', status: 'PICKED_UP', description: 'Package picked up', temperature: 20, humidity: 60 },
            { id: '2', timestamp: '2024-04-06T10:30:00', location: 'Nashik Hub', status: 'IN_TRANSIT', description: 'Departed from sorting facility', temperature: 21, humidity: 62 },
            { id: '3', timestamp: '2024-04-06T14:00:00', location: 'Thane Junction', status: 'IN_TRANSIT', description: 'In transit - checkpoint', temperature: 22, humidity: 65 }
          ],
          createdAt: '2024-04-06T07:00:00',
          dispatchedAt: '2024-04-06T08:00:00'
        },
        {
          id: '2',
          shipmentNumber: 'SHP-002',
          orderId: 'ORD-2024-002',
          status: 'PENDING',
          origin: 'Pune Warehouse, Maharashtra',
          destination: 'Delhi Hub, Delhi',
          carrier: 'Rivigo Logistics',
          trackingNumber: 'RV987654321IN',
          estimatedDelivery: '2024-04-08T12:00:00',
          distance: 1450,
          weight: 2500,
          temperature: 18,
          humidity: 55,
          cost: 15000,
          estimatedCost: 15000,
          priority: 'MEDIUM',
          carrierContact: '+91 87654 32109',
          carrierEmail: 'care@rivigo.com',
          insurance: true,
          insuranceAmount: 75000,
          vehicleType: 'Container Truck',
          specialInstructions: 'Handle with care - fragile items',
          items: [
            { id: '3', productName: 'Tomatoes', quantity: 1000, unit: 'kg', weight: 1000, value: 40000 },
            { id: '4', productName: 'Onions', quantity: 1500, unit: 'kg', weight: 1500, value: 45000 }
          ],
          timeline: [
            { id: '4', timestamp: '2024-04-06T06:00:00', location: 'Pune Warehouse', status: 'PENDING', description: 'Awaiting pickup' }
          ],
          createdAt: '2024-04-06T06:00:00'
        }
      ];

      setShipments(mockShipments);
      setLoading(false);
    }, 1000);
  };

  const filterAndSort = () => {
    let filtered = [...shipments];
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredShipments(filtered);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Logistics Manager</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div>
            <p>Shipments: {filteredShipments.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
