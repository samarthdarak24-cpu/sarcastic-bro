'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Shield, CheckCircle, AlertCircle, 
  Clock, Package, Loader2 
} from 'lucide-react';

interface EscrowOrder {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  order?: {
    id?: string;
    crop?: { cropName?: string };
    lot?: { cropName?: string };
    product?: { name?: string };
    quantity?: number;
  };
}

interface EscrowSectionProps {
  escrows: EscrowOrder[];
  loading: boolean;
  onRefresh: () => void;
  onConfirmDelivery: (escrowId: string) => void;
  onRaiseDispute: (escrowId: string) => void;
}

export default function EscrowSection({
  escrows,
  loading,
  onRefresh,
  onConfirmDelivery,
  onRaiseDispute
}: EscrowSectionProps) {
  const [filter, setFilter] = useState<string>('all');
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowOrder | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const filteredEscrows = escrows.filter(escrow => {
    if (filter === 'all') return true;
    return escrow.status === filter;
  });

  const heldEscrows = escrows.filter(e => e.status === 'HELD');
  const releasedEscrows = escrows.filter(e => e.status === 'RELEASED');
  const refundedEscrows = escrows.filter(e => e.status === 'REFUNDED');
  
  const totalHeld = heldEscrows.reduce((sum, e) => sum + e.amount, 0);
  const totalReleased = releasedEscrows.reduce((sum, e) => sum + e.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HELD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RELEASED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DISPUTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HELD':
        return <Clock className="w-4 h-4" />;
      case 'RELEASED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REFUNDED':
        return <DollarSign className="w-4 h-4" />;
      case 'DISPUTED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const handleConfirmDelivery = (escrow: EscrowOrder) => {
    if (confirm('Confirm delivery? This will release funds to the seller.')) {
      onConfirmDelivery(escrow.id);
    }
  };

  const handleRaiseDispute = () => {
    if (!selectedEscrow || !disputeReason.trim()) {
      alert('Please provide a dispute reason');
      return;
    }
    onRaiseDispute(selectedEscrow.id);
    setShowDisputeModal(false);
    setDisputeReason('');
    setSelectedEscrow(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Protected</span>
          </div>
          <p className="text-3xl font-bold">₹{totalHeld.toLocaleString('en-IN')}</p>
          <p className="text-sm opacity-90 mt-1">{heldEscrows.length} orders in escrow</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Released</span>
          </div>
          <p className="text-3xl font-bold">₹{totalReleased.toLocaleString('en-IN')}</p>
          <p className="text-sm opacity-90 mt-1">{releasedEscrows.length} completed</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Refunded</span>
          </div>
          <p className="text-3xl font-bold">{refundedEscrows.length}</p>
          <p className="text-sm opacity-90 mt-1">Cancelled orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'HELD', 'RELEASED', 'REFUNDED', 'DISPUTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Escrow List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredEscrows.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No escrow orders</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Your escrow-protected orders will appear here'
                : `No ${filter} escrow orders found`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEscrows.map((escrow) => (
              <motion.div
                key={escrow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {escrow.order?.product?.name ||
                          escrow.order?.crop?.cropName ||
                          escrow.order?.lot?.cropName ||
                          'Order'}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(escrow.status)}`}>
                        {getStatusIcon(escrow.status)}
                        {escrow.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      {escrow.order?.quantity && (
                        <span>Quantity: {escrow.order.quantity} kg</span>
                      )}
                      <span>
                        Created: {new Date(escrow.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <p className="text-2xl font-bold text-gray-900">
                      ₹{escrow.amount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {escrow.status === 'HELD' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmDelivery(escrow)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Confirm Delivery
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEscrow(escrow);
                          setShowDisputeModal(true);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Raise Dispute
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Raise Dispute</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Dispute
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe the issue..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRaiseDispute}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Submit Dispute
              </button>
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setDisputeReason('');
                  setSelectedEscrow(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
