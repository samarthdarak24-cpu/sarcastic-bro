'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Clock, CheckCircle, Truck, XCircle, 
  Search, Filter, Download, RefreshCw, Plus,
  TrendingUp, DollarSign, ShoppingCart, AlertCircle,
  Calendar, User, Phone, Mail, MapPin, FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { orderService } from '@/services/orderService';
import { useOrderUpdates, useNewOrderNotifications } from '@/hooks/useSocket';

interface Order {
  id: string;
  orderNumber: string;
  product: string; // mapped from product.name
  quantity: number;
  buyer: string; // mapped from buyer.name
  buyerEmail: string;
  buyerPhone: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  date: string;
  deliveryDate: string;
  shippingAddress: string;
  trackingNumber?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function OrderControl() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');

  useEffect(() => {
    loadOrders();
  }, []);

  // Real-time listeners
  useOrderUpdates((data) => {
    // If an existing order was updated
    setOrders(prev => prev.map(o => o.id === data.orderId ? { ...o, status: data.status.toLowerCase() } : o));
  });

  useNewOrderNotifications((data) => {
    // Reload orders when a new one arrives
    loadOrders();
  });

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, filter, searchQuery, sortBy]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      
      // Map API Order to Component Order
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        product: o.product?.name || 'Unknown Product',
        quantity: o.quantity,
        buyer: o.buyer?.name || 'Guest Buyer',
        buyerEmail: o.buyer?.email || '',
        buyerPhone: o.buyer?.phone || '',
        amount: o.totalPrice,
        status: o.status.toLowerCase() as any,
        paymentStatus: o.paymentStatus?.toLowerCase() as any || 'pending',
        date: o.createdAt,
        deliveryDate: o.expectedDelivery || o.createdAt, // Fallback
        shippingAddress: o.shippingAddress || 'No address provided',
        trackingNumber: o.trackingNumber,
        notes: o.notes,
        priority: (o.priority?.toLowerCase() as any) || 'medium'
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error('Failed to load real orders:', err);
      toast.error('Failed to load real orders. Using fallback.');
    } finally {
      setLoading(false);
    }
  };


  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        return b.amount - a.amount;
      } else {
        return a.status.localeCompare(b.status);
      }
    });

    setFilteredOrders(filtered);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: 'bg-yellow-500', icon: Clock, label: 'Pending' },
      confirmed: { color: 'bg-blue-500', icon: CheckCircle, label: 'Confirmed' },
      processing: { color: 'bg-purple-500', icon: Package, label: 'Processing' },
      shipped: { color: 'bg-indigo-500', icon: Truck, label: 'Shipped' },
      delivered: { color: 'bg-green-500', icon: CheckCircle, label: 'Delivered' },
      cancelled: { color: 'bg-red-500', icon: XCircle, label: 'Cancelled' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.amount, 0),
    avgOrderValue: orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.amount, 0) / orders.length) : 0
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handleExport = () => {
    toast.success('Exporting orders to CSV...');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Order Control Center
            </h1>
            <p className="text-gray-600 mt-1">Manage and track all your orders</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadOrders}
              disabled={loading}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white transition-all flex items-center gap-2"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              New Order
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6"
      >
        {[
          { label: 'Total Orders', value: stats.total, icon: ShoppingCart, color: 'from-blue-500 to-cyan-500' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
          { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'from-blue-500 to-indigo-500' },
          { label: 'Processing', value: stats.processing, icon: Package, color: 'from-purple-500 to-pink-500' },
          { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'from-indigo-500 to-purple-500' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Revenue', value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
          { label: 'Avg Order', value: `₹${(stats.avgOrderValue / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'from-orange-500 to-red-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order number, product, or buyer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-12 border border-gray-200 text-center"
            >
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4"
            >
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 cursor-pointer transition-all ${
                      selectedOrder?.id === order.id
                        ? 'border-orange-500 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{order.product}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusConfig.color} flex items-center gap-1`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                        <AlertCircle size={16} className={getPriorityColor(order.priority)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Buyer</p>
                        <p className="text-sm font-semibold text-gray-800">{order.buyer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="text-sm font-semibold text-gray-800">{order.quantity} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm font-bold text-green-600">₹{order.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Delivery Date</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="bg-gray-50 rounded-lg p-2 text-xs">
                        <span className="text-gray-600">Tracking: </span>
                        <span className="font-mono font-semibold text-gray-800">{order.trackingNumber}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 sticky top-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Details</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Number</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedOrder.orderNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Product</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedOrder.product}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Quantity</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedOrder.quantity} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-sm font-bold text-green-600">₹{selectedOrder.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <User size={12} /> Buyer Information
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{selectedOrder.buyer}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <Mail size={10} /> {selectedOrder.buyerEmail}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <Phone size={10} /> {selectedOrder.buyerPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <MapPin size={12} /> Shipping Address
                    </p>
                    <p className="text-sm text-gray-800">{selectedOrder.shippingAddress}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Date</p>
                      <p className="text-sm text-gray-800">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Delivery Date</p>
                      <p className="text-sm text-gray-800">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusConfig(selectedOrder.status).color}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        selectedOrder.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.trackingNumber && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                      <p className="text-sm font-mono font-semibold text-gray-800 bg-gray-50 p-2 rounded">
                        {selectedOrder.trackingNumber}
                      </p>
                    </div>
                  )}

                  {selectedOrder.notes && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FileText size={12} /> Notes
                      </p>
                      <p className="text-sm text-gray-800 bg-yellow-50 p-2 rounded">{selectedOrder.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    {selectedOrder.status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Confirm Order
                      </motion.button>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}
                        className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Start Processing
                      </motion.button>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')}
                        className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        Mark as Shipped
                      </motion.button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Mark as Delivered
                      </motion.button>
                    )}
                    {!['delivered', 'cancelled'].includes(selectedOrder.status) && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Cancel Order
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-12 border border-gray-200 text-center"
              >
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Select an order to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
