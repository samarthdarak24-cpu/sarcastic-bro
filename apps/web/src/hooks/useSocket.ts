import { useEffect, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

/**
 * Hook for real-time order status updates
 */
export const useOrderUpdates = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleOrderUpdate = (data: any) => {
      console.log('Order update received:', data);
      if (callback) callback(data);
      
      // Show toast notification
      toast.success(`Order ${data.orderNumber} is now ${data.status}`, {
        icon: '📦',
        duration: 4000
      });
    };
    
    socket.on('order-status-update', handleOrderUpdate);
    
    return () => {
      socket.off('order-status-update', handleOrderUpdate);
    };
  }, [callback]);
};

/**
 * Hook for real-time price updates
 */
export const usePriceUpdates = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handlePriceUpdate = (data: any) => {
      console.log('Price update received:', data);
      if (callback) callback(data);
    };
    
    socket.on('price-update', handlePriceUpdate);
    
    return () => {
      socket.off('price-update', handlePriceUpdate);
    };
  }, [callback]);
};

/**
 * Hook for real-time shipment tracking
 */
export const useShipmentTracking = (orderId?: string, callback?: (data: any) => void) => {
  useEffect(() => {
    if (!orderId) return;
    
    const socket = getSocket();
    
    // Join order-specific room
    socket.emit('join-order-room', orderId);
    
    const handleLocationUpdate = (data: any) => {
      console.log('Shipment location update:', data);
      if (callback) callback(data);
    };
    
    socket.on('shipment-location-update', handleLocationUpdate);
    
    return () => {
      socket.emit('leave-order-room', orderId);
      socket.off('shipment-location-update', handleLocationUpdate);
    };
  }, [orderId, callback]);
};

/**
 * Hook for real-time proposal updates
 */
export const useProposalUpdates = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleProposalUpdate = (data: any) => {
      console.log('Proposal update received:', data);
      if (callback) callback(data);
      
      // Show toast notification
      toast.info(`Proposal ${data.proposalId} status: ${data.status}`, {
        icon: '💼',
        duration: 4000
      });
    };
    
    socket.on('proposal-update', handleProposalUpdate);
    
    return () => {
      socket.off('proposal-update', handleProposalUpdate);
    };
  }, [callback]);
};

/**
 * Hook for real-time message notifications
 */
export const useMessageNotifications = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleNewMessage = (data: any) => {
      console.log('New message received:', data);
      if (callback) callback(data);
      
      // Show toast notification
      toast(`New message from ${data.senderName}`, {
        icon: '💬',
        duration: 3000
      });
    };
    
    socket.on('new-message', handleNewMessage);
    
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [callback]);
};

/**
 * Hook for real-time notifications
 */
export const useNotifications = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleNotification = (data: any) => {
      console.log('Notification received:', data);
      if (callback) callback(data);
      
      // Show toast based on notification type
      const icons: Record<string, string> = {
        ORDER: '📦',
        MESSAGE: '💬',
        PROPOSAL: '💼',
        TENDER: '📋',
        SYSTEM: '🔔',
        KYC: '✅'
      };
      
      toast(data.message, {
        icon: icons[data.type] || '🔔',
        duration: 4000
      });
    };
    
    socket.on('notification', handleNotification);
    
    return () => {
      socket.off('notification', handleNotification);
    };
  }, [callback]);
};

/**
 * Hook for typing indicators in chat
 */
export const useTypingIndicator = (conversationId?: string) => {
  const socket = getSocket();
  
  const startTyping = useCallback(() => {
    if (conversationId) {
      socket.emit('typing-start', { conversationId });
    }
  }, [conversationId, socket]);
  
  const stopTyping = useCallback(() => {
    if (conversationId) {
      socket.emit('typing-stop', { conversationId });
    }
  }, [conversationId, socket]);
  
  const onTyping = useCallback((callback: (data: any) => void) => {
    socket.on('user-typing', callback);
    return () => socket.off('user-typing', callback);
  }, [socket]);
  
  return { startTyping, stopTyping, onTyping };
};

/**
 * Hook for online/offline status
 */
export const useOnlineStatus = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleUserOnline = (data: any) => {
      console.log('User online:', data);
      if (callback) callback({ ...data, status: 'online' });
    };
    
    const handleUserOffline = (data: any) => {
      console.log('User offline:', data);
      if (callback) callback({ ...data, status: 'offline' });
    };
    
    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);
    
    return () => {
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
    };
  }, [callback]);
};

/**
 * Hook for tender notifications
 */
export const useTenderNotifications = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleTenderUpdate = (data: any) => {
      console.log('Tender update received:', data);
      if (callback) callback(data);
      
      toast.info(`Tender ${data.tenderTitle}: ${data.message}`, {
        icon: '📋',
        duration: 5000
      });
    };
    
    socket.on('tender-update', handleTenderUpdate);
    
    return () => {
      socket.off('tender-update', handleTenderUpdate);
    };
  }, [callback]);
};

/**
 * Hook for quality scan results
 */
export const useQualityScanResults = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleScanComplete = (data: any) => {
      console.log('Quality scan complete:', data);
      if (callback) callback(data);
      
      toast.success(`Quality scan complete: Grade ${data.grade}`, {
        icon: '🔬',
        duration: 4000
      });
    };
    
    socket.on('quality-scan-complete', handleScanComplete);
    
    return () => {
      socket.off('quality-scan-complete', handleScanComplete);
    };
  }, [callback]);
};
