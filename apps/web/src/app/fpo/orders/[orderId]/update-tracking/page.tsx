'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Package, MapPin, Upload, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TRACKING_STATUSES = [
  { value: 'PLACED', label: 'Order Placed' },
  { value: 'CONFIRMED', label: 'Order Confirmed' },
  { value: 'PACKED', label: 'Packed' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
];

export default function UpdateTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    status: '',
    location: '',
    latitude: '',
    longitude: '',
    description: '',
    photos: [] as string[],
  });

  useEffect(() => {
    loadOrder();
  }, [params.orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(response.data.order);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.status) {
      alert('Please select a status');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.orderId}/tracking`,
        {
          status: formData.status,
          location: formData.location || undefined,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
          description: formData.description || undefined,
          photos: formData.photos,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Tracking update added successfully');
      router.push('/fpo/orders');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add tracking update');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // In production, upload to Cloudinary
    // For now, using placeholder
    const photoUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, photos: [...formData.photos, ...photoUrls] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error || 'Order not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('updateTracking')}</h1>

      {/* Order Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t('orderDetails')}</h2>
        <div className="space-y-2 text-sm">
          <p><span className="text-gray-600">{t('orderId')}:</span> <span className="font-mono">{order.id}</span></p>
          <p><span className="text-gray-600">{t('quantity')}:</span> {order.quantity} kg</p>
          <p><span className="text-gray-600">{t('currentStatus')}:</span> <span className="font-semibold">{order.status}</span></p>
        </div>
      </div>

      {/* Update Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold">{t('addTrackingUpdate')}</h2>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('status')} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">{t('selectStatus')}</option>
            {TRACKING_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            {t('location')}
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Nanded, Maharashtra"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('latitude')}
            </label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              placeholder="19.1383"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('longitude')}
            </label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              placeholder="77.3210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('description')}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add any additional notes..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Upload className="w-4 h-4 inline mr-1" />
            {t('photos')}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          {formData.photos.length > 0 && (
            <div className="flex gap-2 mt-3">
              {formData.photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
        >
          {submitting ? t('submitting') : t('addUpdate')}
        </button>
      </form>
    </div>
  );
}
