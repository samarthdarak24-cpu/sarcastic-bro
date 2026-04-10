import { useState, useCallback } from 'react';
import { 
  orderTrackingService, 
  OrderTrackingEvent, 
  OrderDetails, 
  AddTrackingEventData, 
  ConfirmDeliveryData 
} from '../services/orderTrackingService';
import { toast } from 'react-hot-toast';

export const useOrderTracking = () => {
  const [trackingEvents, setTrackingEvents] = useState<OrderTrackingEvent[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrackingEvents = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const events = await orderTrackingService.getTrackingEvents(orderId);
      setTrackingEvents(events);
      return events;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch tracking events';
      setError(msg);
      toast.error(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderDetails = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderTrackingService.getOrderDetails(orderId);
      setOrderDetails(order);
      setTrackingEvents(order.trackingEvents || []);
      return order;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch order details';
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTrackingEvent = async (orderId: string, data: AddTrackingEventData) => {
    setLoading(true);
    setError(null);
    try {
      const event = await orderTrackingService.addTrackingEvent(orderId, data);
      toast.success('Tracking update added successfully');
      // Refresh tracking events
      await fetchTrackingEvents(orderId);
      return event;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add tracking event';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async (orderId: string, data: ConfirmDeliveryData) => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderTrackingService.confirmDelivery(orderId, data);
      toast.success('Delivery confirmed! Payment released to seller.');
      setOrderDetails(order);
      return order;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to confirm delivery';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trackingEvents,
    orderDetails,
    loading,
    error,
    fetchTrackingEvents,
    fetchOrderDetails,
    addTrackingEvent,
    confirmDelivery,
  };
};
