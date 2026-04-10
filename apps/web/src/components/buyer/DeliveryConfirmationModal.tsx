'use client';

import { useState } from 'react';
import buyerAPI from '@/services/buyer';
import { Loader2, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface DeliveryConfirmationModalProps {
  orderId: string;
  orderDetails: {
    productName: string;
    quantity: number;
    totalAmount: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeliveryConfirmationModal({
  orderId,
  orderDetails,
  onClose,
  onSuccess,
}: DeliveryConfirmationModalProps) {
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!confirmed) {
      setError('Please confirm that you want to release the payment');
      return;
    }

    setConfirming(true);
    setError('');

    try {
      await buyerAPI.confirmDelivery(orderId);
      onSuccess();
    } catch (err: any) {
      console.error('Delivery confirmation failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to confirm delivery');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Confirm Delivery</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Important</p>
                <p className="text-sm text-yellow-800">
                  This action will release the escrow payment to the seller. Please ensure you have received the order in satisfactory condition.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{orderDetails.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span>{orderDetails.quantity} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-green-600">₹{orderDetails.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                I confirm that I have received the order in satisfactory condition and authorize the release of ₹{orderDetails.totalAmount.toLocaleString()} from escrow to the seller
              </span>
            </label>
          </div>

          {/* Optional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Add any notes about the delivery condition..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={confirming}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming || !confirmed}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {confirming ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirming...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Confirm & Release Payment
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
