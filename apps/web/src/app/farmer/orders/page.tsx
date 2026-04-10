'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Order {
  id: string;
  quantity: number;
  totalAmount: number;
  status: string;
  escrowStatus: string;
  deliveryAddress: string;
  createdAt: string;
  buyer: {
    name: string;
    phone: string;
  };
  crop?: {
    cropName: string;
    variety: string;
    grade: string;
  };
  lot?: {
    cropName: string;
    totalQuantity: number;
  };
  escrowTransaction?: {
    amount: number;
    status: string;
    heldAt: string;
    releasedAt?: string;
  };
}

export default function FarmerOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders(token);
  }, [router]);

  const fetchOrders = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/farmer/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEscrowColor = (status: string) => {
    switch (status) {
      case 'HELD': return 'bg-orange-100 text-orange-800';
      case 'RELEASED': return 'bg-green-100 text-green-800';
      case 'REFUNDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'];
    return steps.indexOf(status) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/farmer')} className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-600">Track your order status and payments</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Your orders will appear here once buyers purchase your crops</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.crop?.cropName || order.lot?.cropName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Order ID: {order.id.substring(0, 8)}...
                      </p>
                      <p className="text-sm text-gray-600">
                        Buyer: {order.buyer.name} ({order.buyer.phone})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-600">{order.quantity} kg</p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Order Status</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="flex justify-between">
                      {['Listed', 'Confirmed', 'In Transit', 'Delivered'].map((step, index) => {
                        const currentStep = getStatusStep(order.status);
                        const isCompleted = index + 1 <= currentStep;
                        const isCurrent = index + 1 === currentStep;
                        
                        return (
                          <div key={step} className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted ? 'bg-green-600 text-white' : 
                              isCurrent ? 'bg-blue-600 text-white' : 
                              'bg-gray-200 text-gray-500'
                            }`}>
                              {isCompleted ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="text-sm font-medium">{index + 1}</span>
                              )}
                            </div>
                            <p className={`text-xs mt-2 ${isCompleted || isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                      <div 
                        className="h-full bg-green-600 transition-all duration-500"
                        style={{ width: `${((getStatusStep(order.status) - 1) / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Escrow Status */}
                <div className="p-6 border-b bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Payment Status</h4>
                      <p className="text-sm text-gray-600">
                        {order.escrowStatus === 'HELD' && 'Payment is held in escrow until delivery'}
                        {order.escrowStatus === 'RELEASED' && 'Payment has been released to your account'}
                        {order.escrowStatus === 'REFUNDED' && 'Payment was refunded to buyer'}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEscrowColor(order.escrowStatus)}`}>
                      {order.escrowStatus}
                    </span>
                  </div>
                  
                  {order.escrowTransaction && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Held Amount</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{order.escrowTransaction.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-600">
                          {order.escrowTransaction.releasedAt ? 'Released On' : 'Held Since'}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(order.escrowTransaction.releasedAt || order.escrowTransaction.heldAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Details */}
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                  <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Order placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
