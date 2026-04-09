'use client';

import React, { useState } from 'react';

interface PreBooking {
  id: string;
  productName: string;
  quantity: number;
  expectedDate: string;
  status: string;
}

export const PreBookingHubComponent: React.FC<{ buyerId: string }> = ({ buyerId }) => {
  const [bookings, setBookings] = useState<PreBooking[]>([]);
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');

  const createBooking = async (productId: string) => {
    if (!quantity || !date) return;
    try {
      const response = await fetch('/api/pre-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: parseFloat(quantity), expectedDate: date }),
      });
      const booking = await response.json();
      setBookings(prev => [...prev, booking]);
      setQuantity('');
      setDate('');
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Pre-Booking Hub</h2>
      
      <div className="space-y-3">
        {bookings.map(booking => (
          <div key={booking.id} className="border rounded-lg p-4">
            <p className="font-semibold">{booking.productName}</p>
            <p className="text-gray-600">{booking.quantity} units</p>
            <p className="text-sm text-gray-500">Expected: {new Date(booking.expectedDate).toLocaleDateString()}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
