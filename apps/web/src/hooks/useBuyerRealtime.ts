// ============================================================================
// Real-Time Update Hooks - Buyer Dashboard
// File: apps/web/src/hooks/useBuyerRealtime.ts
// ============================================================================

import { useEffect, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

// ──────────────────────────────────────────────────────────────────────────
// 1. BID UPDATES HOOK
// ──────────────────────────────────────────────────────────────────────────

export const useBidUpdates = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleBidUpdate = (data: any) => {
      console.log('[Socket] Bid updated:', data);
      if (callback) callback(data);
      
      toast.success(`Bid for ${data.productName} has been updated!`, {
        icon: '💰',
        duration: 4000
      });
    };
    
    const handleCounterOffer = (data: any) => {
      console.log('[Socket] Counter offer received:', data);
      if (callback) callback(data);
      
      toast.info(`Counter offer received for ${data.productName}: ₹${data.counterOffer}`, {
        icon: '🔄',
        duration: 5000
      });
    };
    
    socket.on('bid:updated', handleBidUpdate);
    socket.on('bid:counter-offer', handleCounterOffer);
    
    return () => {
      socket.off('bid:updated', handleBidUpdate);
      socket.off('bid:counter-offer', handleCounterOffer);
    };
  }, [callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// 2. ORDER TRACKING UPDATES HOOK
// ──────────────────────────────────────────────────────────────────────────

export const useOrderStatusUpdates = (orderId?: string, callback?: (data: any) => void) => {
  useEffect(() => {
    if (!orderId) return;
    
    const socket = getSocket();
    
    // Join order-specific room
    socket.emit('order:join', { orderId });
    
    const handleStatusUpdate = (data: any) => {
      console.log('[Socket] Order status updated:', data);
      if (callback) callback(data);
      
      const statusIcons: Record<string, string> = {
        'PENDING': '⏳',
        'CONFIRMED': '✅',
        'PROCESSING': '⚙️',
        'SHIPPED': '📦',
        'IN_TRANSIT': '🚚',
        'DELIVERED': '🎉',
        'CANCELLED': '❌'
      };
      
      toast.success(
        `Order #${data.orderNumber} is now ${data.status}`,
        { icon: statusIcons[data.status] || '📦', duration: 4000 }
      );
    };
    
    socket.on('order:status-updated', handleStatusUpdate);
    
    return () => {
      socket.off('order:status-updated', handleStatusUpdate);
    };
  }, [orderId, callback]);
};

export const useOrderLocationUpdates = (orderId?: string, callback?: (data: any) => void) => {
  useEffect(() => {
    if (!orderId) return;
    
    const socket = getSocket();
    
    const handleLocationUpdate = (data: any) => {
      console.log('[Socket] Order location updated:', data);
      if (callback) callback(data);
    };
    
    socket.on('order:location-updated', handleLocationUpdate);
    
    return () => {
      socket.off('order:location-updated', handleLocationUpdate);
    };
  }, [orderId, callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// 3. ESCROW STATUS CHANGES HOOK
// ──────────────────────────────────────────────────────────────────────────

export const useEscrowUpdates = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleStatusChange = (data: any) => {
      console.log('[Socket] Escrow status changed:', data);
      if (callback) callback(data);
      
      const statusMessages: Record<string, {icon: string; message: string}> = {
        'CREATED': { icon: '📋', message: 'Escrow order created' },
        'CONFIRMED': { icon: '✅', message: 'Delivery confirmed by you' },
        'RELEASED': { icon: '💰', message: 'Payment released to supplier' },
        'DISPUTED': { icon: '⚠️', message: 'Dispute raised' },
        'REFUNDED': { icon: '↩️', message: 'Amount refunded to you' }
      };
      
      const msg = statusMessages[data.status] || { icon: '📦', message: 'Status updated' };
      toast.success(msg.message, { icon: msg.icon, duration: 4000 });
    };
    
    socket.on('escrow:status-changed', handleStatusChange);
    
    return () => {
      socket.off('escrow:status-changed', handleStatusChange);
    };
  }, [callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// 4. PRE-BOOKING ACCEPTED HOOK
// ──────────────────────────────────────────────────────────────────────────

export const usePreBookingUpdates = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleAccepted = (data: any) => {
      console.log('[Socket] Pre-booking accepted:', data);
      if (callback) callback(data);
      
      toast.success(
        `Pre-booking accepted for ${data.productName}! Delivery: ${new Date(data.deliveryDate).toLocaleDateString()}`,
        { icon: '✅', duration: 5000 }
      );
    };
    
    const handleRejected = (data: any) => {
      console.log('[Socket] Pre-booking rejected:', data);
      if (callback) callback(data);
      
      toast.error(
        `Pre-booking for ${data.productName} was rejected`,
        { icon: '❌', duration: 4000 }
      );
    };
    
    socket.on('pre-booking:accepted', handleAccepted);
    socket.on('pre-booking:rejected', handleRejected);
    
    return () => {
      socket.off('pre-booking:accepted', handleAccepted);
      socket.off('pre-booking:rejected', handleRejected);
    };
  }, [callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// 5. INSTANT NOTIFICATIONS HOOK
// ──────────────────────────────────────────────────────────────────────────

export const useInstantNotifications = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleNewNotification = (data: any) => {
      console.log('[Socket] New notification:', data);
      if (callback) callback(data);
      
      const typeIcons: Record<string, string> = {
        'BID_UPDATE': '💰',
        'ORDER_STATUS': '📦',
        'PRICE_ALERT': '📊',
        'PRE_BOOKING_ACCEPTED': '✅',
        'ESCROW_STATUS': '🔐',
        'MESSAGE': '💬',
        'SYSTEM': 'ℹ️'
      };
      
      toast.success(data.title, {
        icon: typeIcons[data.type] || '🔔',
        description: data.message,
        duration: 5000
      });
    };
    
    socket.on('notification:new', handleNewNotification);
    
    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// 6. PRICE UPDATES HOOK
// ──────────────────────────────────────────────────────────────────────────

export const usePriceAlerts = (watchedProductIds?: string[], callback?: (data: any) => void) => {
  useEffect(() => {
    if (!watchedProductIds || watchedProductIds.length === 0) return;
    
    const socket = getSocket();
    
    // Subscribe to price updates for watched products
    watchedProductIds.forEach(productId => {
      socket.emit('subscribe:product-price', { productId });
    });
    
    const handlePriceUpdate = (data: any) => {
      console.log('[Socket] Price update:', data);
      if (callback) callback(data);
      
      const percentChange = data.priceChangePercent;
      
      if (percentChange < -10) {
        // Price dropped significantly
        toast.success(
          `Price dropped for ${data.productName}! -${Math.abs(percentChange).toFixed(1)}%`,
          { icon: '📉', duration: 5000 }
        );
      } else if (percentChange > 10) {
        // Price increased significantly
        toast.warning(
          `Price increased for ${data.productName}! +${percentChange.toFixed(1)}%`,
          { icon: '📈', duration: 5000 }
        );
      }
    };
    
    socket.on('price:updated', handlePriceUpdate);
    
    return () => {
      socket.off('price:updated', handlePriceUpdate);
      watchedProductIds.forEach(productId => {
        socket.emit('unsubscribe:product-price', { productId });
      });
    };
  }, [watchedProductIds, callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// 7. CHAT RESPONSES HOOK
// ──────────────────────────────────────────────────────────────────────────

export const useChatResponses = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleChatResponse = (data: any) => {
      console.log('[Socket] Chat response received:', data);
      if (callback) callback(data);
    };
    
    socket.on('chat:response', handleChatResponse);
    
    return () => {
      socket.off('chat:response', handleChatResponse);
    };
  }, [callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// 8. USER PRESENCE HOOK (Online Status)
// ──────────────────────────────────────────────────────────────────────────

export const useUserPresence = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    const handleUserOnline = (data: any) => {
      console.log('[Socket] User online:', data.userId);
      if (callback) callback({ ...data, status: 'online' });
    };
    
    const handleUserOffline = (data: any) => {
      console.log('[Socket] User offline:', data.userId);
      if (callback) callback({ ...data, status: 'offline' });
    };
    
    socket.on('user:online', handleUserOnline);
    socket.on('user:offline', handleUserOffline);
    
    return () => {
      socket.off('user:online', handleUserOnline);
      socket.off('user:offline', handleUserOffline);
    };
  }, [callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// 9. TYPING INDICATOR HOOK
// ──────────────────────────────────────────────────────────────────────────

export const useTypingIndicators = (conversationId?: string, callback?: (data: any) => void) => {
  useEffect(() => {
    if (!conversationId) return;
    
    const socket = getSocket();
    
    const handleUserTyping = (data: any) => {
      console.log('[Socket] User typing:', data);
      if (callback) callback(data);
    };
    
    socket.on('user:typing', handleUserTyping);
    
    return () => {
      socket.off('user:typing', handleUserTyping);
    };
  }, [conversationId, callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// 10. MARKET DATA REAL-TIME UPDATES
// ──────────────────────────────────────────────────────────────────────────

export const useMarketDataUpdates = (callback?: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket();
    
    socket.emit("subscribe:market-intelligence");
    
    const handleMarketUpdate = (data: any) => {
      console.log('[Socket] Market data updated:', data);
      if (callback) callback(data);
    };
    
    socket.on('market:updated', handleMarketUpdate);
    
    return () => {
      socket.off('market:updated', handleMarketUpdate);
      socket.emit("unsubscribe:market-intelligence");
    };
  }, [callback]);
};

// ──────────────────────────────────────────────────────────────────────────
// COMBINED HOOK FOR DASHBOARD
// ──────────────────────────────────────────────────────────────────────────

/**
 * Main hook for all buyer dashboard real-time updates
 * Use this in your main dashboard component
 */
export const useBuyerDashboardRealtime = (options?: {
  enableBids?: boolean;
  enableOrders?: boolean;
  enableEscrow?: boolean;
  enablePreBooking?: boolean;
  enableNotifications?: boolean;
  watchedProducts?: string[];
  onUpdate?: (event: string, data: any) => void;
}) => {
  const opts = {
    enableBids: true,
    enableOrders: true,
    enableEscrow: true,
    enablePreBooking: true,
    enableNotifications: true,
    ...options
  };
  
  // Attach all hooks
  useBidUpdates(opts.enableBids ? (data) => opts.onUpdate?.('bid', data) : undefined);
  useOrderStatusUpdates(undefined, opts.enableOrders ? (data) => opts.onUpdate?.('order', data) : undefined);
  useEscrowUpdates(opts.enableEscrow ? (data) => opts.onUpdate?.('escrow', data) : undefined);
  usePreBookingUpdates(opts.enablePreBooking ? (data) => opts.onUpdate?.('preBooking', data) : undefined);
  useInstantNotifications(opts.enableNotifications ? (data) => opts.onUpdate?.('notification', data) : undefined);
  usePriceAlerts(opts.watchedProducts, (data) => opts.onUpdate?.('price', data));
};

export default {
  useBidUpdates,
  useOrderStatusUpdates,
  useOrderLocationUpdates,
  useEscrowUpdates,
  usePreBookingUpdates,
  useInstantNotifications,
  usePriceAlerts,
  useChatResponses,
  useUserPresence,
  useTypingIndicators,
  useMarketDataUpdates,
  useBuyerDashboardRealtime
};
