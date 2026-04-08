'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Package,
  MapPin,
  Phone,
  Mail,
  Navigation,
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  FileText,
  Download,
  Search,
  Filter,
  BarChart3,
  ThermometerSun,
  Droplets,
  Box,
  ArrowRight,
  ExternalLink,
  Star,
  Shield,
  Zap,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface ShipmentItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  weight: number;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED' | 'CANCELLED';
  origin: string;
  destination: string;
  carrier: string;
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
}

export function LogisticsManager() {
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Enhanced Realistic Dummy Data
  const [shipments] = useState<Shipment[]>([
    {
      id: 'SHP-001',
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
      priority: 'HIGH',
      rating: 4.5,
      carrierContact: '+91 98765 43210',
      carrierEmail: 'support@bluedart.com',
      items: [
        { id: 'ITM-001', productName: 'Wheat', quantity: 500, unit: 'kg', weight: 500 },
        { id: 'ITM-002', productName: 'Rice', quantity: 700, unit: 'kg', weight: 700 },
      ],
      timeline: [
        { id: 'TL-001', timestamp: '2024-04-06T08:00:00', location: 'Nashik Farm', status: 'PICKED_UP', description: 'Package picked up from origin' },
        { id: 'TL-002', timestamp: '2024-04-06T10:30:00', location: 'Nashik Hub', status: 'IN_TRANSIT', description: 'Departed from Nashik sorting facility' },
        { id: 'TL-003', timestamp: '2024-04-06T14:00:00', location: 'Thane Junction', status: 'IN_TRANSIT', description: 'Package in transit - Thane checkpoint' },
      ],
      createdAt: '2024-04-06T07:00:00',
      dispatchedAt: '2024-04-06T08:00:00',
    },
    {
      id: 'SHP-002',
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
      priority: 'MEDIUM',
      carrierContact: '+91 87654 32109',
      carrierEmail: 'care@rivigo.com',
      items: [
        { id: 'ITM-003', productName: 'Tomatoes', quantity: 1000, unit: 'kg', weight: 1000 },
        { id: 'ITM-004', productName: 'Onions', quantity: 1500, unit: 'kg', weight: 1500 },
      ],
      timeline: [
        { id: 'TL-004', timestamp: '2024-04-06T06:00:00', location: 'Pune Warehouse', status: 'PENDING', description: 'Shipment created - awaiting pickup' },
      ],
      createdAt: '2024-04-06T06:00:00',
    },
    {
      id: 'SHP-003',
      shipmentNumber: 'SHP-003',
      orderId: 'ORD-2024-003',
      status: 'DELIVERED',
      origin: 'Bangalore Center, Karnataka',
      destination: 'Chennai Port, Tamil Nadu',
      carrier: 'Snowman Logistics',
      trackingNumber: 'SM456789123IN',
      estimatedDelivery: '2024-04-05T16:00:00',
      actualDelivery: '2024-04-05T15:30:00',
      distance: 350,
      weight: 800,
      temperature: 4,
      humidity: 85,
      cost: 6200,
      priority: 'URGENT',
      rating: 5.0,
      carrierContact: '+91 76543 21098',
      carrierEmail: 'support@snowman.com',
      items: [
        { id: 'ITM-005', productName: 'Grapes', quantity: 400, unit: 'kg', weight: 400 },
        { id: 'ITM-006', productName: 'Strawberries', quantity: 400, unit: 'kg', weight: 400 },
      ],
      timeline: [
        { id: 'TL-005', timestamp: '2024-04-05T08:00:00', location: 'Bangalore Center', status: 'PICKED_UP', description: 'Cold storage pickup completed' },
        { id: 'TL-006', timestamp: '2024-04-05T10:00:00', location: 'Hosur Checkpoint', status: 'IN_TRANSIT', description: 'Temperature maintained at 4°C' },
        { id: 'TL-007', timestamp: '2024-04-05T13:00:00', location: 'Chennai Outskirts', status: 'OUT_FOR_DELIVERY', description: 'Out for final delivery' },
        { id: 'TL-008', timestamp: '2024-04-05T15:30:00', location: 'Chennai Port', status: 'DELIVERED', description: 'Successfully delivered and signed' },
      ],
      createdAt: '2024-04-05T07:00:00',
      dispatchedAt: '2024-04-05T08:00:00',
      deliveredAt: '2024-04-05T15:30:00',
    },
    {
      id: 'SHP-004',
      shipmentNumber: 'SHP-004',
      orderId: 'ORD-2024-004',
      status: 'DELAYED',
      origin: 'Hyderabad Hub, Telangana',
      destination: 'Kolkata Market, West Bengal',
      carrier: 'Delhivery',
      trackingNumber: 'DL789123456IN',
      estimatedDelivery: '2024-04-07T10:00:00',
      currentLocation: 'Nagpur Junction - Delayed',
      distance: 1500,
      weight: 1500,
      temperature: 25,
      humidity: 70,
      cost: 11000,
      priority: 'LOW',
      rating: 3.0,
      carrierContact: '+91 65432 10987',
      carrierEmail: 'help@delhivery.com',
      items: [
        { id: 'ITM-007', productName: 'Potatoes', quantity: 800, unit: 'kg', weight: 800 },
        { id: 'ITM-008', productName: 'Carrots', quantity: 700, unit: 'kg', weight: 700 },
      ],
      timeline: [
        { id: 'TL-009', timestamp: '2024-04-05T14:00:00', location: 'Hyderabad Hub', status: 'PICKED_UP', description: 'Package collected from warehouse' },
        { id: 'TL-010', timestamp: '2024-04-06T02:00:00', location: 'Nagpur Junction', status: 'DELAYED', description: 'Delayed due to vehicle breakdown' },
      ],
      createdAt: '2024-04-05T13:00:00',
      dispatchedAt: '2024-04-05T14:00:00',
    },
    {
      id: 'SHP-005',
      shipmentNumber: 'SHP-005',
      orderId: 'ORD-2024-005',
      status: 'IN_TRANSIT',
      origin: 'Jaipur Farm, Rajasthan',
      destination: 'Ahmedabad Market, Gujarat',
      carrier: 'VRL Logistics',
      trackingNumber: 'VRL321654987IN',
      estimatedDelivery: '2024-04-06T20:00:00',
      currentLocation: 'Udaipur Checkpoint',
      distance: 620,
      weight: 1800,
      temperature: 28,
      humidity: 45,
      cost: 9800,
      priority: 'MEDIUM',
      rating: 4.0,
      carrierContact: '+91 54321 09876',
      carrierEmail: 'info@vrllogistics.com',
      items: [
        { id: 'ITM-009', productName: 'Mustard', quantity: 900, unit: 'kg', weight: 900 },
        { id: 'ITM-010', productName: 'Cumin', quantity: 900, unit: 'kg', weight: 900 },
      ],
      timeline: [
        { id: 'TL-011', timestamp: '2024-04-06T06:00:00', location: 'Jaipur Farm', status: 'PICKED_UP', description: 'Spices shipment collected' },
        { id: 'TL-012', timestamp: '2024-04-06T12:00:00', location: 'Udaipur Checkpoint', status: 'IN_TRANSIT', description: 'Quality check passed' },
      ],
      createdAt: '2024-04-06T05:00:00',
      dispatchedAt: '2024-04-06T06:00:00',
    },
    {
      id: 'SHP-006',
      shipmentNumber: 'SHP-006',
      orderId: 'ORD-2024-006',
      status: 'DELIVERED',
      origin: 'Lucknow Warehouse, Uttar Pradesh',
      destination: 'Patna Market, Bihar',
      carrier: 'TCI Express',
      trackingNumber: 'TCI654987321IN',
      estimatedDelivery: '2024-04-04T14:00:00',
      actualDelivery: '2024-04-04T13:45:00',
      distance: 520,
      weight: 950,
      cost: 7200,
      priority: 'HIGH',
      rating: 4.8,
      carrierContact: '+91 43210 98765',
      carrierEmail: 'support@tciexpress.in',
      items: [
        { id: 'ITM-011', productName: 'Lentils', quantity: 500, unit: 'kg', weight: 500 },
        { id: 'ITM-012', productName: 'Chickpeas', quantity: 450, unit: 'kg', weight: 450 },
      ],
      timeline: [
        { id: 'TL-013', timestamp: '2024-04-04T07:00:00', location: 'Lucknow Warehouse', status: 'PICKED_UP', description: 'Pulses shipment initiated' },
        { id: 'TL-014', timestamp: '2024-04-04T11:00:00', location: 'Varanasi Hub', status: 'IN_TRANSIT', description: 'Midway checkpoint cleared' },
        { id: 'TL-015', timestamp: '2024-04-04T13:45:00', location: 'Patna Market', status: 'DELIVERED', description: 'Delivered ahead of schedule' },
      ],
      createdAt: '2024-04-04T06:00:00',
      dispatchedAt: '2024-04-04T07:00:00',
      deliveredAt: '2024-04-04T13:45:00',
    },
    {
      id: 'SHP-007',
      shipmentNumber: 'SHP-007',
      orderId: 'ORD-2024-007',
      status: 'PENDING',
      origin: 'Chandigarh Hub, Punjab',
      destination: 'Shimla Market, Himachal Pradesh',
      carrier: 'DTDC Courier',
      trackingNumber: 'DTDC987321654IN',
      estimatedDelivery: '2024-04-07T16:00:00',
      distance: 115,
      weight: 600,
      temperature: 15,
      humidity: 60,
      cost: 4500,
      priority: 'LOW',
      carrierContact: '+91 32109 87654',
      carrierEmail: 'care@dtdc.com',
      items: [
        { id: 'ITM-013', productName: 'Apples', quantity: 600, unit: 'kg', weight: 600 },
      ],
      timeline: [
        { id: 'TL-016', timestamp: '2024-04-06T10:00:00', location: 'Chandigarh Hub', status: 'PENDING', description: 'Awaiting vehicle assignment' },
      ],
      createdAt: '2024-04-06T09:00:00',
    },
    {
      id: 'SHP-008',
      shipmentNumber: 'SHP-008',
      orderId: 'ORD-2024-008',
      status: 'IN_TRANSIT',
      origin: 'Indore Center, Madhya Pradesh',
      destination: 'Bhopal Market, Madhya Pradesh',
      carrier: 'Gati KWE',
      trackingNumber: 'GATI123789456IN',
      estimatedDelivery: '2024-04-06T17:00:00',
      currentLocation: 'Dewas Junction',
      distance: 195,
      weight: 1100,
      temperature: 24,
      humidity: 50,
      cost: 5800,
      priority: 'MEDIUM',
      rating: 4.2,
      carrierContact: '+91 21098 76543',
      carrierEmail: 'support@gati.com',
      items: [
        { id: 'ITM-014', productName: 'Soybeans', quantity: 1100, unit: 'kg', weight: 1100 },
      ],
      timeline: [
        { id: 'TL-017', timestamp: '2024-04-06T09:00:00', location: 'Indore Center', status: 'PICKED_UP', description: 'Soybean shipment collected' },
        { id: 'TL-018', timestamp: '2024-04-06T13:00:00', location: 'Dewas Junction', status: 'IN_TRANSIT', description: 'Halfway to destination' },
      ],
      createdAt: '2024-04-06T08:00:00',
      dispatchedAt: '2024-04-06T09:00:00',
    },
    {
      id: 'SHP-009',
      shipmentNumber: 'SHP-009',
      orderId: 'ORD-2024-009',
      status: 'DELIVERED',
      origin: 'Coimbatore Farm, Tamil Nadu',
      destination: 'Kochi Port, Kerala',
      carrier: 'Professional Couriers',
      trackingNumber: 'PC456123789IN',
      estimatedDelivery: '2024-04-03T18:00:00',
      actualDelivery: '2024-04-03T17:20:00',
      distance: 210,
      weight: 750,
      temperature: 20,
      humidity: 75,
      cost: 5500,
      priority: 'HIGH',
      rating: 4.7,
      carrierContact: '+91 10987 65432',
      carrierEmail: 'info@professionalcouriers.in',
      items: [
        { id: 'ITM-015', productName: 'Coconuts', quantity: 750, unit: 'kg', weight: 750 },
      ],
      timeline: [
        { id: 'TL-019', timestamp: '2024-04-03T10:00:00', location: 'Coimbatore Farm', status: 'PICKED_UP', description: 'Coconut shipment started' },
        { id: 'TL-020', timestamp: '2024-04-03T14:00:00', location: 'Palakkad Border', status: 'IN_TRANSIT', description: 'State border crossed' },
        { id: 'TL-021', timestamp: '2024-04-03T17:20:00', location: 'Kochi Port', status: 'DELIVERED', description: 'Export shipment delivered' },
      ],
      createdAt: '2024-04-03T09:00:00',
      dispatchedAt: '2024-04-03T10:00:00',
      deliveredAt: '2024-04-03T17:20:00',
    },
    {
      id: 'SHP-010',
      shipmentNumber: 'SHP-010',
      orderId: 'ORD-2024-010',
      status: 'IN_TRANSIT',
      origin: 'Amritsar Hub, Punjab',
      destination: 'Jammu Market, Jammu & Kashmir',
      carrier: 'Safexpress',
      trackingNumber: 'SFX789456123IN',
      estimatedDelivery: '2024-04-06T19:00:00',
      currentLocation: 'Pathankot Checkpoint',
      distance: 230,
      weight: 1300,
      temperature: 12,
      humidity: 55,
      cost: 7800,
      priority: 'URGENT',
      rating: 4.6,
      carrierContact: '+91 09876 54321',
      carrierEmail: 'care@safexpress.com',
      items: [
        { id: 'ITM-016', productName: 'Basmati Rice', quantity: 1300, unit: 'kg', weight: 1300 },
      ],
      timeline: [
        { id: 'TL-022', timestamp: '2024-04-06T08:00:00', location: 'Amritsar Hub', status: 'PICKED_UP', description: 'Premium rice shipment initiated' },
        { id: 'TL-023', timestamp: '2024-04-06T14:00:00', location: 'Pathankot Checkpoint', status: 'IN_TRANSIT', description: 'Security clearance completed' },
      ],
      createdAt: '2024-04-06T07:00:00',
      dispatchedAt: '2024-04-06T08:00:00',
    },
  ]);

  const statusCounts = useMemo(() => ({
    ALL: shipments.length,
    PENDING: shipments.filter(s => s.status === 'PENDING').length,
    IN_TRANSIT: shipments.filter(s => s.status === 'IN_TRANSIT').length,
    DELIVERED: shipments.filter(s => s.status === 'DELIVERED').length,
    DELAYED: shipments.filter(s => s.status === 'DELAYED').length,
  }), [shipments]);

  const filteredShipments = useMemo(() => {
    let filtered = shipments;
    
    if (filter !== 'ALL') {
      filtered = filtered.filter(s => s.status === filter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [shipments, filter, searchQuery]);

  const stats = useMemo(() => {
    const totalCost = shipments.reduce((sum, s) => sum + s.cost, 0);
    const totalDistance = shipments.reduce((sum, s) => sum + s.distance, 0);
    const totalWeight = shipments.reduce((sum, s) => sum + s.weight, 0);
    const deliveredCount = shipments.filter(s => s.status === 'DELIVERED').length;
    const onTimeRate = shipments.length > 0 ? ((deliveredCount / shipments.length) * 100).toFixed(1) : '0';
    
    return {
      totalCost,
      totalDistance,
      totalWeight,
      onTimeRate,
    };
  }, [shipments]);

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-500',
      IN_TRANSIT: 'bg-blue-500',
      DELIVERED: 'bg-green-500',
      DELAYED: 'bg-red-500',
      CANCELLED: 'bg-gray-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      IN_TRANSIT: 'bg-blue-100 text-blue-700 border-blue-300',
      DELIVERED: 'bg-green-100 text-green-700 border-green-300',
      DELAYED: 'bg-red-100 text-red-700 border-red-300',
      CANCELLED: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'text-slate-500',
      MEDIUM: 'text-blue-600',
      HIGH: 'text-orange-600',
      URGENT: 'text-red-600',
    };
    return colors[priority as keyof typeof colors] || 'text-slate-500';
  };

  const getProgress = (shipment: Shipment) => {
    if (shipment.status === 'DELIVERED') return 100;
    if (shipment.status === 'PENDING') return 10;
    if (shipment.status === 'DELAYED') return 45;
    if (shipment.status === 'IN_TRANSIT') return 65;
    return 0;
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToastMessage('Shipments refreshed successfully', 'success');
    }, 1500);
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (estimatedDelivery: string) => {
    const now = new Date();
    const eta = new Date(estimatedDelivery);
    const diff = eta.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 0) return 'Overdue';
    if (hours < 1) return 'Less than 1 hour';
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="logistics-manager">
      {/* Ultra-Compact Navbar-Style Header */}
      <div className="navbar-header">
        <h2 className="title">Logistics</h2>
        
        <div className="status-badges">
          <div className="badge in-transit">
            <Truck size={14} />
            <span>{statusCounts.IN_TRANSIT}</span>
          </div>
          
          <div className="badge pending">
            <Clock size={14} />
            <span>{statusCounts.PENDING}</span>
          </div>
          
          <div className="badge delivered">
            <CheckCircle size={14} />
            <span>{statusCounts.DELIVERED}</span>
          </div>
          
          <div className="badge delayed">
            <AlertTriangle size={14} />
            <span>{statusCounts.DELAYED}</span>
          </div>
        </div>

        <button 
          className="refresh-icon" 
          onClick={handleRefresh}
          disabled={loading}
          aria-label="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
        </button>
      </div>

      <div className="filter-tabs">
        {['ALL', 'PENDING', 'IN_TRANSIT', 'DELIVERED', 'DELAYED'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="shipments-layout">
        <div className="shipments-list">
          {loading ? (
            <div className="loading-state">Loading shipments...</div>
          ) : filteredShipments.length === 0 ? (
            <div className="empty-state">
              <p>No shipments found</p>
            </div>
          ) : (
            filteredShipments.map(shipment => (
              <div
                key={shipment.id}
                onClick={() => setSelectedShipment(shipment)}
                className={`shipment-item ${selectedShipment?.id === shipment.id ? 'selected' : ''}`}
              >
                <div className="shipment-header">
                  <h4>{shipment.shipmentNumber}</h4>
                  <span className={`status-badge ${getStatusColor(shipment.status)}`}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="shipment-route">{shipment.origin} → {shipment.destination}</p>
                <p className="shipment-carrier">Carrier: {shipment.carrier}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${getProgress(shipment)}%` }}></div>
                </div>
                <p className="shipment-eta">ETA: {getTimeRemaining(shipment.estimatedDelivery)}</p>
              </div>
            ))
          )}
        </div>

        <div className="shipment-details">
          {selectedShipment ? (
            <>
              <div className="details-header">
                <h3>Shipment {selectedShipment.shipmentNumber}</h3>
                <span className={`status-badge ${getStatusColor(selectedShipment.status)}`}>
                  {selectedShipment.status.replace('_', ' ')}
                </span>
              </div>

              <div className="details-info">
                <div className="info-row">
                  <span className="label">Origin:</span>
                  <span className="value">{selectedShipment.origin}</span>
                </div>
                <div className="info-row">
                  <span className="label">Destination:</span>
                  <span className="value">{selectedShipment.destination}</span>
                </div>
                <div className="info-row">
                  <span className="label">Carrier:</span>
                  <span className="value">{selectedShipment.carrier}</span>
                </div>
                <div className="info-row">
                  <span className="label">Tracking:</span>
                  <span className="value">{selectedShipment.trackingNumber}</span>
                </div>
                <div className="info-row">
                  <span className="label">Weight:</span>
                  <span className="value">{selectedShipment.weight} kg</span>
                </div>
                <div className="info-row">
                  <span className="label">Cost:</span>
                  <span className="value">₹{selectedShipment.cost.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">ETA:</span>
                  <span className="value">{formatDate(selectedShipment.estimatedDelivery)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Progress:</span>
                  <span className="value">{getProgress(selectedShipment)}%</span>
                </div>
              </div>

              <div className="actions-section">
                <button className="btn-track">Track Shipment</button>
                <button className="btn-contact">Contact Carrier</button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a shipment to view details</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .logistics-manager {
          background: #f8f9fa;
          min-height: 100vh;
        }

        /* Ultra-Compact Navbar Header - Single Row, Left-Aligned */
        .navbar-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          height: 48px;
        }

        .title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          line-height: 1;
        }

        .status-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 4px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          transition: all 0.2s;
        }

        .badge span {
          min-width: 16px;
          text-align: center;
        }

        .badge.in-transit {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge.in-transit svg {
          animation: pulse 2s ease-in-out infinite;
        }

        .badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .badge.pending svg {
          animation: pulse 2s ease-in-out infinite 0.5s;
        }

        .badge.delivered {
          background: #d1fae5;
          color: #065f46;
        }

        .badge.delayed {
          background: #fee2e2;
          color: #991b1b;
        }

        .badge.delayed svg {
          animation: pulse 2s ease-in-out infinite 1s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .refresh-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-left: auto;
          padding: 0;
        }

        .refresh-icon:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .refresh-icon:active {
          transform: scale(0.95);
        }

        .refresh-icon:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .refresh-icon svg {
          color: #6b7280;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background: white;
          cursor: pointer;
          font-weight: 500;
          font-size: 13px;
          transition: all 0.2s;
        }

        .filter-tab.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .shipments-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 20px;
          height: calc(100vh - 200px);
          padding: 0 20px 20px 20px;
        }

        @media (max-width: 1024px) {
          .shipments-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
        }

        @media (max-width: 640px) {
          .navbar-header {
            padding: 10px 16px;
            height: auto;
            flex-wrap: wrap;
          }

          .title {
            font-size: 15px;
          }

          .status-badges {
            gap: 6px;
          }

          .badge {
            padding: 3px 8px;
            font-size: 12px;
            gap: 4px;
          }

          .badge svg {
            width: 12px;
            height: 12px;
          }

          .refresh-icon {
            width: 28px;
            height: 28px;
          }

          .refresh-icon svg {
            width: 14px;
            height: 14px;
          }
        }

        .shipments-list {
          background: white;
          border-radius: 12px;
          padding: 16px;
          overflow-y: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .shipment-item {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          transition: all 0.2s;
        }

        .shipment-item:hover {
          border-color: #667eea;
          transform: translateX(4px);
        }

        .shipment-item.selected {
          background: #f3f4f6;
          border-color: #667eea;
        }

        .shipment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .shipment-header h4 {
          font-weight: 600;
          color: #1f2937;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .shipment-route {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 4px;
        }

        .shipment-carrier {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s;
        }

        .shipment-eta {
          font-size: 13px;
          font-weight: 600;
          color: #667eea;
        }

        .shipment-details {
          background: white;
          border-radius: 12px;
          padding: 24px;
          overflow-y: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .details-info {
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .info-row .label {
          color: #6b7280;
          font-weight: 500;
        }

        .info-row .value {
          font-weight: 600;
          color: #1f2937;
        }

        .actions-section {
          display: flex;
          gap: 12px;
        }

        .btn-track,
        .btn-contact {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .btn-track {
          background: #667eea;
          color: white;
        }

        .btn-contact {
          background: #10b981;
          color: white;
        }

        .btn-track:hover,
        .btn-contact:hover {
          transform: translateY(-2px);
        }

        .no-selection {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #9ca3af;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
