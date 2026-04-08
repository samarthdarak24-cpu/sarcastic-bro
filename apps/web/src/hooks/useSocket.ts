import { useEffect, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

const onAny = (socket: any, events: string[], handler: (data: any) => void) => {
  events.forEach((event) => socket.on(event, handler));
  return () => events.forEach((event) => socket.off(event, handler));
};

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
    
    // Align with backend emitToUser(..., "order:status:updated", ...)
    const off = onAny(socket, ['order-status-update', 'order:status', 'order:status:updated'], handleOrderUpdate);
    
    return () => {
      off();
    };
  }, [callback]);
};

/**
 * Hook for real-time new order notifications (for farmers)
 */
export const useNewOrderNotifications = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleNewOrder = (data: any) => {
      console.log('New order received:', data);
      if (callback) callback(data);
      
      toast.success(`New order #${data.orderNumber} for ${data.productName}!`, {
        icon: '🔔',
        duration: 6000
      });
    };
    
    const off = onAny(socket, ['order:new'], handleNewOrder);
    
    return () => {
      off();
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
    
    const off = onAny(socket, ['price-update'], handlePriceUpdate);
    
    return () => {
      off();
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
    socket.emit('join-order-room', orderId); // legacy
    socket.emit('order:join', { orderId });
    
    const handleLocationUpdate = (data: any) => {
      console.log('Shipment location update:', data);
      if (callback) callback(data);
    };
    
    const off = onAny(socket, ['shipment-location-update'], handleLocationUpdate);
    
    return () => {
      socket.emit('leave-order-room', orderId); // legacy
      socket.emit('order:leave', { orderId });
      off();
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
      toast(`Proposal ${data.proposalId} status: ${data.status}`, {
        icon: '💼',
        duration: 4000
      });
    };

    
    const off = onAny(socket, ['proposal-update', 'proposal:new', 'proposal:counter', 'proposal:accepted', 'proposal:rejected'], handleProposalUpdate);
    
    return () => {
      off();
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
    
    const off = onAny(socket, ['new-message', 'message:new', 'message:received'], handleNewMessage);
    
    return () => {
      off();
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
    
    const off = onAny(socket, ['notification', 'notification:new'], handleNotification);
    
    return () => {
      off();
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
      socket.emit('typing-start', { conversationId }); // legacy
      socket.emit('message:typing', { conversationId, isTyping: true });
    }
  }, [conversationId, socket]);
  
  const stopTyping = useCallback(() => {
    if (conversationId) {
      socket.emit('typing-stop', { conversationId }); // legacy
      socket.emit('message:typing', { conversationId, isTyping: false });
    }
  }, [conversationId, socket]);
  
  const onTyping = useCallback((callback: (data: any) => void) => {
    const off = onAny(socket, ['user-typing', 'user:typing'], callback);
    return off;
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
    
    const offOnline = onAny(socket, ['user-online', 'user:online'], handleUserOnline);
    const offOffline = onAny(socket, ['user-offline', 'user:offline'], handleUserOffline);
    
    return () => {
      offOnline();
      offOffline();
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
      
      toast(`Tender ${data.tenderTitle}: ${data.message}`, {
        icon: '📋',
        duration: 5000
      });
    };
    
    const off = onAny(socket, ['tender-update'], handleTenderUpdate);
    
    return () => {
      off();
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
    
    const off = onAny(socket, ['quality-scan-complete'], handleScanComplete);
    
    return () => {
      off();
    };
  }, [callback]);
};

/**
 * Hook for new product notifications across the platform
 */
export const useProductCreated = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleProductCreated = (data: any) => {
      console.log('Real-time: New product created', data);
      if (callback) callback(data);
    };
    
    const off = onAny(socket, ['product:created'], handleProductCreated);
    
    return () => {
      off();
    };
  }, [callback]);
};

/**
 * Generic useSocket hook - returns the Socket.IO instance
 * Use this hook when you need direct access to the socket for custom events
 */
export const useSocket = () => {
  const socket = getSocket();
  return socket;
};
