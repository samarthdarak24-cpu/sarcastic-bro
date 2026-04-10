'use client';

import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { logisticsService, RequestPickupData, AssignDriverData, UpdateLocationData } from '@/services/logistics';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface UseLogisticsReturn {
  logistics: any;
  loading: boolean;
  error: string | null;
  requestPickup: (data: RequestPickupData) => Promise<any>;
  assignDriver: (data: AssignDriverData) => Promise<any>;
  updateLocation: (data: UpdateLocationData) => Promise<any>;
  markDelivered: (logisticsId: string, data: any) => Promise<any>;
  refreshLogistics: () => Promise<void>;
  isConnected: boolean;
}

export function useLogistics(logisticsId?: string): UseLogisticsReturn {
  const [logistics, setLogistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Setup Socket.io connection
  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('auth_token'),
      },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);

      // Join logistics room if ID provided
      if (logisticsId) {
        socketInstance.emit('join:logistics', logisticsId);
        console.log('Joined logistics room:', logisticsId);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Listen for location updates
    socketInstance.on('logistics:location-updated', (data) => {
      console.log('Location updated:', data);
      setLogistics((prev: any) => 
        prev ? {
          ...prev,
          currentLat: data.lat,
          currentLng: data.lng,
          status: data.status || prev.status,
        } : prev
      );
    });

    // Listen for status updates
    socketInstance.on('logistics:status-updated', (data) => {
      console.log('Status updated:', data);
      setLogistics((prev: any) => 
        prev ? {
          ...prev,
          status: data.status,
        } : prev
      );
    });

    // Listen for delivery completion
    socketInstance.on('logistics:delivery-completed', (data) => {
      console.log('Delivery completed:', data);
      setLogistics((prev: any) => 
        prev ? {
          ...prev,
          status: 'DELIVERED',
        } : prev
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [logisticsId]);

  // Fetch logistics data
  const fetchLogistics = useCallback(async () => {
    if (!logisticsId) return;

    setLoading(true);
    setError(null);

    try {
      // This would need to be implemented in the service
      // For now, we'll rely on the pages to fetch data
    } catch (err: any) {
      setError(err.message || 'Failed to fetch logistics');
    } finally {
      setLoading(false);
    }
  }, [logisticsId]);

  // Request pickup (Farmer)
  const requestPickup = async (data: RequestPickupData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await logisticsService.requestPickup(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to request pickup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Assign driver (FPO)
  const assignDriver = async (data: AssignDriverData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await logisticsService.assignDriver(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to assign driver');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update location (Driver/FPO)
  const updateLocation = async (data: UpdateLocationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await logisticsService.updateLocation(data);

      // Also emit via Socket.io for real-time updates
      if (socket && socket.connected) {
        socket.emit('logistics:update-location', {
          logisticsId: data.logisticsId,
          lat: data.lat,
          lng: data.lng,
          status: data.status,
        });
      }

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update location');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark as delivered
  const markDelivered = async (logisticsId: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await logisticsService.markDelivered(logisticsId, data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to mark as delivered');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh logistics data
  const refreshLogistics = async () => {
    await fetchLogistics();
  };

  return {
    logistics,
    loading,
    error,
    requestPickup,
    assignDriver,
    updateLocation,
    markDelivered,
    refreshLogistics,
    isConnected,
  };
}

// Hook for fetching multiple logistics
export function useLogisticsList(role: 'farmer' | 'fpo' | 'buyer') {
  const [logisticsList, setLogisticsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogistics = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      switch (role) {
        case 'farmer':
          response = await logisticsService.getFarmerLogistics();
          break;
        case 'fpo':
          response = await logisticsService.getFPOLogistics(status);
          break;
        case 'buyer':
          response = await logisticsService.getBuyerLogistics();
          break;
        default:
          throw new Error('Invalid role');
      }
      setLogisticsList(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch logistics');
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchLogistics();
  }, [fetchLogistics]);

  return {
    logisticsList,
    loading,
    error,
    refresh: fetchLogistics,
  };
}

// Hook for fetching active logistics (backward compatibility)
export function useActiveLogistics() {
  const [activeLogistics, setActiveLogistics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveLogistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get user role from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const role = user?.role?.toLowerCase() || 'farmer';

      let response;
      switch (role) {
        case 'farmer':
          response = await logisticsService.getFarmerLogistics();
          break;
        case 'fpo':
          response = await logisticsService.getFPOLogistics();
          break;
        case 'buyer':
          response = await logisticsService.getBuyerLogistics();
          break;
        default:
          response = await logisticsService.getFarmerLogistics();
      }
      
      const data = response.data || response;
      // Filter for active logistics (not delivered or cancelled)
      const active = Array.isArray(data) 
        ? data.filter((item: any) => 
            item.status !== 'DELIVERED' && item.status !== 'CANCELLED'
          )
        : [];
      
      setActiveLogistics(active);
    } catch (err: any) {
      console.error('Failed to fetch active logistics:', err);
      setError(err.message || 'Failed to fetch logistics');
      setActiveLogistics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    activeLogistics,
    loading,
    error,
    fetchActiveLogistics,
  };
}
