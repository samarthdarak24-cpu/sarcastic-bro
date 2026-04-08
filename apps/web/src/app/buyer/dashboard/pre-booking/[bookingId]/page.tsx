'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingDown,
  Lock,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  User,
  MapPin,
  DollarSign,
  AlertCircle,
  ArrowLeft,
  Phone,
  Mail,
  Edit,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSocket } from '@/lib/socket';

interface PreBooking {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  targetPrice: number;
  harvestDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  supplier?: {
    id: string;
    name: string;
    location: string;
    contactEmail: string;
    contactPhone: string;
    rating: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PreBookingDetailPage() {
  const { user } = useAuth('BUYER');
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<PreBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`/api/buyer/pre-bookings/${bookingId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // if (!response.ok) throw new Error('Failed to fetch booking');
        // const data = await response.json();
        // setBooking(data.data);

        // Mock data for now
        await new Promise((resolve) => setTimeout(resolve, 800));
        setBooking({
          id: bookingId,
          productName: 'Premium Wheat',
          category: 'Grains',
          quantity: 2000,
          unit: 'kg',
          targetPrice: 40,
          harvestDate: '2024-03-15',
          status: 'CONFIRMED',
          supplier: {
            id: 'supplier-1',
            name: 'Green Valley Farms',
            location: 'Punjab, India',
            contactEmail: 'contact@greenvalley.com',
            contactPhone: '+91 98765 43210',
            rating: 4.8,
          },
          notes: 'Organic certified wheat, Grade A quality required',
          createdAt: '2024-01-10T10:30:00Z',
          updatedAt: '2024-01-12T14:20:00Z',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load booking');
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  // Real-time updates via Socket.io
  useEffect(() => {
    if (!bookingId) return;

    const socket = getSocket();

    const handlePreBookingUpdate = (data: any) => {
      if (data.bookingId === bookingId) {
        console.log('Pre-booking update received:', data);
        setBooking((prev) => (prev ? { ...prev, ...data.updates } : null));
        toast.success(`Booking status updated: ${data.updates.status}`);
      }
    };

    const handlePreBookingAccepted = (data: any) => {
      if (data.bookingId === bookingId) {
        console.log('Pre-booking accepted:', data);
        setBooking((prev) => (prev ? { ...prev, status: 'CONFIRMED', supplier: data.supplier } : null));
        toast.success('Your pre-booking has been accepted by a supplier!', {
          icon: '🎉',
          duration: 5000,
        });
      }
    };

    socket.on('pre-booking:update', handlePreBookingUpdate);
    socket.on('pre-booking:accepted', handlePreBookingAccepted);

    return () => {
      socket.off('pre-booking:update', handlePreBookingUpdate);
      socket.off('pre-booking:accepted', handlePreBookingAccepted);
    };
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this pre-booking?')) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/buyer/pre-bookings/${bookingId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });

      toast.success('Pre-booking cancelled successfully');
      router.push('/buyer/dashboard/pre-booking');
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleEditBooking = () => {
    // TODO: Navigate to edit page or open modal
    toast('Edit functionality coming soon', { icon: '🚧' });
  };

  if (!user || user.role !== 'BUYER') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout navItems={buyerNav} userRole="BUYER">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-3xl" />
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !booking) {
    return (
      <DashboardLayout navItems={buyerNav} userRole="BUYER">
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
            <h2 className="text-2xl font-bold text-red-900 mb-2">Error Loading Booking</h2>
            <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
            <button
              onClick={() => router.push('/buyer/dashboard/pre-booking')}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
            >
              Back to Pre-Bookings
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statusConfig = {
    PENDING: { color: 'amber', icon: Clock, label: 'Pending' },
    CONFIRMED: { color: 'emerald', icon: CheckCircle, label: 'Confirmed' },
    COMPLETED: { color: 'blue', icon: Package, label: 'Completed' },
    CANCELLED: { color: 'red', icon: XCircle, label: 'Cancelled' },
  };

  const currentStatus = statusConfig[booking.status];
  const StatusIcon = currentStatus.icon;

  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => router.push('/buyer/dashboard/pre-booking')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Pre-Bookings
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">{booking.productName}</h1>
              <p className="text-slate-500 font-medium">Booking ID: {booking.id}</p>
            </div>
            <div className="flex gap-3">
              {booking.status === 'PENDING' && (
                <>
                  <button
                    onClick={handleEditBooking}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-${currentStatus.color}-50 rounded-3xl p-6 border border-${currentStatus.color}-200`}
          >
            <div className={`h-12 w-12 bg-${currentStatus.color}-100 rounded-2xl flex items-center justify-center text-${currentStatus.color}-600 mb-4`}>
              <StatusIcon size={24} />
            </div>
            <p className="text-2xl font-black text-slate-900 mb-1">{currentStatus.label}</p>
            <p className="text-slate-500 font-medium text-sm">Current Status</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
              <Package size={24} />
            </div>
            <p className="text-2xl font-black text-slate-900 mb-1">
              {booking.quantity} {booking.unit}
            </p>
            <p className="text-slate-500 font-medium text-sm">Quantity</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
              <DollarSign size={24} />
            </div>
            <p className="text-2xl font-black text-slate-900 mb-1">₹{booking.targetPrice}/{booking.unit}</p>
            <p className="text-slate-500 font-medium text-sm">Target Price</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
              <Calendar size={24} />
            </div>
            <p className="text-2xl font-black text-slate-900 mb-1">
              {new Date(booking.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-slate-500 font-medium text-sm">Harvest Date</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-6">Booking Details</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-2">Product Name</p>
                  <p className="text-lg font-bold text-slate-900">{booking.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-2">Category</p>
                  <p className="text-lg font-bold text-slate-900">{booking.category}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-2">Created On</p>
                  <p className="text-lg font-bold text-slate-900">
                    {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-2">Last Updated</p>
                  <p className="text-lg font-bold text-slate-900">
                    {new Date(booking.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {booking.notes && (
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-2">Notes</p>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-slate-700">{booking.notes}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500 font-medium mb-2">Total Estimated Value</p>
                <p className="text-3xl font-black text-blue-600">₹{(booking.quantity * booking.targetPrice).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          {/* Supplier Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              {booking.supplier ? 'Supplier Information' : 'Awaiting Supplier'}
            </h2>

            {booking.supplier ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                    {booking.supplier.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900">{booking.supplier.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span className="text-sm font-bold text-slate-700">{booking.supplier.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Location</p>
                      <p className="text-sm font-bold text-slate-900">{booking.supplier.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Email</p>
                      <p className="text-sm font-bold text-slate-900">{booking.supplier.contactEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Phone</p>
                      <p className="text-sm font-bold text-slate-900">{booking.supplier.contactPhone}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                  Contact Supplier
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-medium">Waiting for supplier to accept this pre-booking</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-6">Booking Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                <CheckCircle size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">Booking Created</p>
                <p className="text-sm text-slate-500">
                  {new Date(booking.createdAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {booking.status !== 'PENDING' && (
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Supplier Confirmed</p>
                  <p className="text-sm text-slate-500">
                    {new Date(booking.updatedAt).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div
                className={`h-10 w-10 ${
                  booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                } rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <Calendar size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">Expected Harvest</p>
                <p className="text-sm text-slate-500">
                  {new Date(booking.harvestDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
