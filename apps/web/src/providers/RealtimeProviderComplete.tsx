'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// 4.8.1 - RealtimeProvider component
interface RealtimeContextType {
  socket: Socket | null;
  isConnected: boolean;
  subscribe: (event: string, callback: (data: any) => void) => () => void;
  emit: (event: string, data: any) => void;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export const RealtimeProviderComplete: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const eventSubscriptions = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // 4.1.2 - Configure Socket.IO client
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001/realtime', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
    });

    // 4.1.6 - Connection status tracking
    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setConnectionStatus('connected');
      reconnectAttempts.current = 0;
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    // 4.1.5 - Automatic reconnection logic
    socketInstance.on('reconnect_attempt', (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
      setConnectionStatus('reconnecting');
      reconnectAttempts.current = attempt;
    });

    socketInstance.on('reconnect', () => {
      console.log('WebSocket reconnected');
      setIsConnected(true);
      setConnectionStatus('connected');
      reconnectAttempts.current = 0;
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      setConnectionStatus('disconnected');
    });

    // 4.1.8.4 - Error handling
    socketInstance.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // 4.8.3 - Event subscription management
  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (!socket) return () => {};

    // Add to subscriptions map
    if (!eventSubscriptions.current.has(event)) {
      eventSubscriptions.current.set(event, new Set());
    }
    eventSubscriptions.current.get(event)!.add(callback);

    // Subscribe to socket event
    socket.on(event, callback);

    // Return unsubscribe function
    return () => {
      socket.off(event, callback);
      const callbacks = eventSubscriptions.current.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          eventSubscriptions.current.delete(event);
        }
      }
    };
  }, [socket]);

  const emit = useCallback((event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  }, [socket, isConnected]);

  const value: RealtimeContextType = {
    socket,
    isConnected,
    subscribe,
    emit,
    connectionStatus,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

// 4.8.2 - useSocket hook for component access
export const useSocket = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useSocket must be used within RealtimeProviderComplete');
  }
  return context;
};

// Custom hooks for specific event types

// 4.2.5 - Product event listeners
export const useProductEvents = (callbacks: {
  onProductCreated?: (product: any) => void;
  onProductUpdated?: (product: any) => void;
  onProductDeleted?: (productId: string) => void;
  onPriceUpdated?: (data: any) => void;
}) => {
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (callbacks.onProductCreated) {
      unsubscribers.push(subscribe('product:created', (data) => callbacks.onProductCreated!(data.product)));
    }
    if (callbacks.onProductUpdated) {
      unsubscribers.push(subscribe('product:updated', (data) => callbacks.onProductUpdated!(data.product)));
    }
    if (callbacks.onProductDeleted) {
      unsubscribers.push(subscribe('product:deleted', (data) => callbacks.onProductDeleted!(data.productId)));
    }
    if (callbacks.onPriceUpdated) {
      unsubscribers.push(subscribe('price:updated', callbacks.onPriceUpdated));
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [subscribe, callbacks]);
};

// 4.3.5 - Order event listeners
export const useOrderEvents = (callbacks: {
  onOrderNew?: (order: any) => void;
  onOrderStatusUpdated?: (data: any) => void;
  onOrderLocationUpdated?: (data: any) => void;
  onOrderCancelled?: (data: any) => void;
}) => {
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (callbacks.onOrderNew) {
      unsubscribers.push(subscribe('order:new', (data) => callbacks.onOrderNew!(data.order)));
    }
    if (callbacks.onOrderStatusUpdated) {
      unsubscribers.push(subscribe('order:status:updated', callbacks.onOrderStatusUpdated));
    }
    if (callbacks.onOrderLocationUpdated) {
      unsubscribers.push(subscribe('order:location:updated', callbacks.onOrderLocationUpdated));
    }
    if (callbacks.onOrderCancelled) {
      unsubscribers.push(subscribe('order:cancelled', callbacks.onOrderCancelled));
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [subscribe, callbacks]);
};

// 4.4.6 - Chat event listeners
export const useChatEvents = (callbacks: {
  onMessageNew?: (message: any) => void;
  onMessageTyping?: (data: any) => void;
  onMessageRead?: (data: any) => void;
  onUserOnline?: (data: any) => void;
  onUserOffline?: (data: any) => void;
}) => {
  const { subscribe, emit } = useSocket();

  const sendTypingIndicator = useCallback((recipientId: string, conversationId: string, isTyping: boolean) => {
    emit('message:typing', { recipientId, conversationId, isTyping });
  }, [emit]);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (callbacks.onMessageNew) {
      unsubscribers.push(subscribe('message:new', (data) => callbacks.onMessageNew!(data.message)));
    }
    if (callbacks.onMessageTyping) {
      unsubscribers.push(subscribe('message:typing', callbacks.onMessageTyping));
    }
    if (callbacks.onMessageRead) {
      unsubscribers.push(subscribe('message:read', callbacks.onMessageRead));
    }
    if (callbacks.onUserOnline) {
      unsubscribers.push(subscribe('user:online', callbacks.onUserOnline));
    }
    if (callbacks.onUserOffline) {
      unsubscribers.push(subscribe('user:offline', callbacks.onUserOffline));
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [subscribe, callbacks]);

  return { sendTypingIndicator };
};

// 4.5.5 - Payment event listeners
export const usePaymentEvents = (callbacks: {
  onPaymentInitiated?: (payment: any) => void;
  onPaymentSuccess?: (payment: any) => void;
  onPaymentFailed?: (data: any) => void;
  onInvoiceGenerated?: (invoice: any) => void;
}) => {
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (callbacks.onPaymentInitiated) {
      unsubscribers.push(subscribe('payment:initiated', (data) => callbacks.onPaymentInitiated!(data.payment)));
    }
    if (callbacks.onPaymentSuccess) {
      unsubscribers.push(subscribe('payment:success', (data) => callbacks.onPaymentSuccess!(data.payment)));
    }
    if (callbacks.onPaymentFailed) {
      unsubscribers.push(subscribe('payment:failed', callbacks.onPaymentFailed));
    }
    if (callbacks.onInvoiceGenerated) {
      unsubscribers.push(subscribe('invoice:generated', (data) => callbacks.onInvoiceGenerated!(data.invoice)));
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [subscribe, callbacks]);
};

// 4.6.4 - Quality event listeners
export const useQualityEvents = (callbacks: {
  onQualityScanStarted?: (data: any) => void;
  onQualityScanComplete?: (scan: any) => void;
  onQualityCertificateGenerated?: (certificate: any) => void;
}) => {
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (callbacks.onQualityScanStarted) {
      unsubscribers.push(subscribe('quality:scan:started', callbacks.onQualityScanStarted));
    }
    if (callbacks.onQualityScanComplete) {
      unsubscribers.push(subscribe('quality:scan:complete', (data) => callbacks.onQualityScanComplete!(data.scan)));
    }
    if (callbacks.onQualityCertificateGenerated) {
      unsubscribers.push(subscribe('quality:certificate:generated', (data) => callbacks.onQualityCertificateGenerated!(data.certificate)));
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [subscribe, callbacks]);
};

// 4.7.3 - Notification event listeners
export const useNotificationEvents = (callbacks: {
  onNotificationNew?: (notification: any) => void;
  onNotificationRead?: (data: any) => void;
}) => {
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (callbacks.onNotificationNew) {
      unsubscribers.push(subscribe('notification:new', (data) => callbacks.onNotificationNew!(data.notification)));
    }
    if (callbacks.onNotificationRead) {
      unsubscribers.push(subscribe('notification:read', callbacks.onNotificationRead));
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [subscribe, callbacks]);
};
