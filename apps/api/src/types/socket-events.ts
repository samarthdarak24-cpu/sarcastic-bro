/**
 * Socket.IO Event Definitions
 * Centralized event types for real-time communication
 * Ensures consistency across frontend and backend
 */

// ============================================================================
// CONNECTION EVENTS
// ============================================================================

export const SOCKET_EVENTS = {
  // Connection lifecycle
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_USER_ROOM: 'join-user-room',
  LEAVE_USER_ROOM: 'leave-user-room',

  // ========================================================================
  // ORDER EVENTS
  // ========================================================================
  ORDER: {
    NEW: 'order:new',
    STATUS_UPDATED: 'order:status:updated',
    LOCATION_UPDATED: 'order:location:updated',
    CANCELLED: 'order:cancelled',
    DELIVERED: 'order:delivered',
    COMPLETED: 'order:completed',
  },

  // ========================================================================
  // PRODUCT EVENTS
  // ========================================================================
  PRODUCT: {
    CREATED: 'product:created',
    UPDATED: 'product:updated',
    DELETED: 'product:deleted',
    QUALITY_UPDATED: 'product:quality:updated',
    PRICE_UPDATED: 'price:updated',
    OUT_OF_STOCK: 'product:out-of-stock',
  },

  // ========================================================================
  // MESSAGE EVENTS
  // ========================================================================
  MESSAGE: {
    NEW: 'message:new',
    TYPING: 'message:typing',
    TYPING_STOP: 'message:typing:stop',
    READ: 'message:read',
    DELETED: 'message:deleted',
    EDITED: 'message:edited',
  },

  // ========================================================================
  // USER PRESENCE EVENTS
  // ========================================================================
  USER: {
    ONLINE: 'user:online',
    OFFLINE: 'user:offline',
    TYPING: 'user:typing',
    AWAY: 'user:away',
  },

  // ========================================================================
  // PAYMENT EVENTS
  // ========================================================================
  PAYMENT: {
    INITIATED: 'payment:initiated',
    SUCCESS: 'payment:success',
    FAILED: 'payment:failed',
    REFUNDED: 'payment:refunded',
    INVOICE_GENERATED: 'invoice:generated',
  },

  // ========================================================================
  // RATING & REPUTATION EVENTS
  // ========================================================================
  RATING: {
    NEW: 'rating:new',
    UPDATED: 'rating:updated',
    FLAGGED: 'rating:flagged',
  },
  REPUTATION: {
    UPDATED: 'reputation:updated',
    BADGE_EARNED: 'trust:badge:earned',
  },

  // ========================================================================
  // NOTIFICATION EVENTS
  // ========================================================================
  NOTIFICATION: {
    NEW: 'notification:new',
    READ: 'notification:read',
    DELETED: 'notification:deleted',
  },

  // ========================================================================
  // QUALITY ANALYSIS EVENTS
  // ========================================================================
  QUALITY: {
    SCAN_STARTED: 'quality:scan:started',
    SCAN_COMPLETE: 'quality:scan:complete',
    CERTIFICATE_GENERATED: 'quality:certificate:generated',
  },

  // ========================================================================
  // PROPOSAL & NEGOTIATION EVENTS
  // ========================================================================
  PROPOSAL: {
    NEW: 'proposal:new',
    COUNTER: 'proposal:counter',
    ACCEPTED: 'proposal:accepted',
    REJECTED: 'proposal:rejected',
    EXPIRED: 'proposal:expired',
  },

  // ========================================================================
  // TENDER EVENTS
  // ========================================================================
  TENDER: {
    CREATED: 'tender:created',
    BID_PLACED: 'tender:bid:placed',
    BID_UPDATED: 'tender:bid:updated',
    WINNER_ANNOUNCED: 'tender:winner:announced',
    CLOSED: 'tender:closed',
  },

  // ========================================================================
  // ESCROW EVENTS
  // ========================================================================
  ESCROW: {
    CREATED: 'escrow:created',
    FUNDS_HELD: 'escrow:funds:held',
    RELEASED: 'escrow:released',
    REFUNDED: 'escrow:refunded',
    DISPUTED: 'escrow:disputed',
  },

  // ========================================================================
  // BLOCKCHAIN EVENTS
  // ========================================================================
  BLOCKCHAIN: {
    TRANSACTION_RECORDED: 'blockchain:transaction:recorded',
    TRACE_UPDATED: 'blockchain:trace:updated',
  },

  // ========================================================================
  // MARKET DATA EVENTS
  // ========================================================================
  MARKET: {
    PRICE_ALERT: 'market:price:alert',
    TREND_UPDATE: 'market:trend:update',
    DEMAND_FORECAST: 'market:demand:forecast',
  },

  // ========================================================================
  // ERROR EVENTS
  // ========================================================================
  ERROR: 'error',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
} as const;

// ============================================================================
// EVENT PAYLOAD TYPES
// ============================================================================

export interface OrderEventPayload {
  orderId: string;
  orderNumber: string;
  status: string;
  farmerId?: string;
  buyerId?: string;
  productName?: string;
  quantity?: number;
  totalPrice?: number;
  timestamp: Date;
}

export interface ProductEventPayload {
  productId: string;
  name: string;
  farmerId: string;
  price?: number;
  quantity?: number;
  qualityGrade?: string;
  imageUrls?: string[];
  timestamp: Date;
}

export interface MessageEventPayload {
  messageId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VOICE' | 'FILE';
  attachmentUrl?: string;
  timestamp: Date;
}

export interface TypingEventPayload {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface UserPresencePayload {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  timestamp: Date;
}

export interface PaymentEventPayload {
  paymentId: string;
  orderId: string;
  amount: number;
  status: string;
  method?: string;
  timestamp: Date;
}

export interface RatingEventPayload {
  ratingId: string;
  fromUserId: string;
  toUserId: string;
  orderId: string;
  stars: number;
  review?: string;
  timestamp: Date;
}

export interface NotificationEventPayload {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface QualityEventPayload {
  scanId: string;
  productId: string;
  grade: string;
  score: number;
  confidence: number;
  defects?: Array<{ type: string; location: string }>;
  certificateUrl?: string;
  timestamp: Date;
}

export interface ProposalEventPayload {
  proposalId: string;
  orderId: string;
  fromUserId: string;
  toUserId: string;
  proposedPrice: number;
  quantity?: number;
  expiresAt?: Date;
  timestamp: Date;
}

export interface TenderEventPayload {
  tenderId: string;
  title: string;
  quantity: number;
  basePrice: number;
  deadline?: Date;
  timestamp: Date;
}

export interface EscrowEventPayload {
  escrowId: string;
  orderId: string;
  amount: number;
  status: string;
  timestamp: Date;
}

export interface PriceAlertPayload {
  productId: string;
  productName: string;
  currentPrice: number;
  alertPrice: number;
  direction: 'UP' | 'DOWN';
  timestamp: Date;
}

// ============================================================================
// ROOM NAMING CONVENTIONS
// ============================================================================

export const SOCKET_ROOMS = {
  // User-specific room
  USER: (userId: string) => `user:${userId}`,

  // Order-specific room (both farmer and buyer join)
  ORDER: (orderId: string) => `order:${orderId}`,

  // Conversation room (both participants join)
  CONVERSATION: (conversationId: string) => `conversation:${conversationId}`,

  // Farmer's product room (all buyers interested in product join)
  PRODUCT: (productId: string) => `product:${productId}`,

  // Tender room (all bidders join)
  TENDER: (tenderId: string) => `tender:${tenderId}`,

  // Market data room (all interested users join)
  MARKET: 'market:data',

  // Admin room for system events
  ADMIN: 'admin:events',
} as const;

// ============================================================================
// SOCKET.IO CONFIGURATION
// ============================================================================

export const SOCKET_CONFIG = {
  // Reconnection settings
  RECONNECTION_DELAY: 1000, // 1 second
  RECONNECTION_DELAY_MAX: 5000, // 5 seconds
  RECONNECTION_ATTEMPTS: 5,

  // Timeout settings
  CONNECT_TIMEOUT: 10000, // 10 seconds
  PING_INTERVAL: 25000, // 25 seconds
  PING_TIMEOUT: 60000, // 60 seconds

  // Event latency target
  TARGET_LATENCY_MS: 2000, // 2 seconds as per design

  // Message queue settings
  MAX_QUEUED_EVENTS: 100,
  QUEUE_FLUSH_INTERVAL: 5000, // 5 seconds
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all event names for a category
 */
export function getEventsByCategory(category: keyof typeof SOCKET_EVENTS): string[] {
  const events = SOCKET_EVENTS[category];
  if (typeof events === 'object' && events !== null) {
    return Object.values(events) as string[];
  }
  return [];
}

/**
 * Validate event name
 */
export function isValidEvent(eventName: string): boolean {
  const allEvents = Object.values(SOCKET_EVENTS).flatMap((category) => {
    if (typeof category === 'object' && category !== null) {
      return Object.values(category);
    }
    return category;
  });
  return allEvents.includes(eventName);
}

/**
 * Get event category from event name
 */
export function getEventCategory(eventName: string): string | null {
  for (const [category, events] of Object.entries(SOCKET_EVENTS)) {
    if (typeof events === 'object' && events !== null) {
      if (Object.values(events).includes(eventName)) {
        return category;
      }
    }
  }
  return null;
}
