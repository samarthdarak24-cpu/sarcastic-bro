/* ========================================================================
   Socket Service — Real-time Event Emitters
   Handles all Socket.IO event emissions for real-time features
   ======================================================================== */

import { Server } from 'socket.io';

export class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Emit order status update to specific user
   */
  emitOrderUpdate(userId: string, data: {
    orderId: string;
    orderNumber: string;
    status: string;
    timestamp?: Date;
  }) {
    this.io.to(`user:${userId}`).emit('order-status-update', {
      ...data,
      timestamp: data.timestamp || new Date()
    });
    console.log(`[Socket] Order update sent to user:${userId}`, data);
  }

  /**
   * Emit price update for a product
   */
  emitPriceUpdate(productId: string, data: {
    newPrice: number;
    oldPrice?: number;
    change?: number;
    changePercent?: number;
  }) {
    this.io.emit('price-update', {
      productId,
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Price update for product:${productId}`, data);
  }

  /**
   * Emit shipment location update
   */
  emitShipmentLocation(orderId: string, data: {
    location: { lat: number; lng: number };
    status?: string;
    estimatedArrival?: Date;
  }) {
    this.io.to(`order:${orderId}`).emit('shipment-location-update', {
      orderId,
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Shipment location update for order:${orderId}`, data);
  }

  /**
   * Emit proposal status update
   */
  emitProposalUpdate(userId: string, data: {
    proposalId: string;
    status: string;
    message?: string;
  }) {
    this.io.to(`user:${userId}`).emit('proposal-update', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Proposal update sent to user:${userId}`, data);
  }

  /**
   * Emit new message notification
   */
  emitNewMessage(userId: string, data: {
    messageId: string;
    senderId: string;
    senderName: string;
    content: string;
    conversationId: string;
  }) {
    this.io.to(`user:${userId}`).emit('new-message', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] New message sent to user:${userId}`, data);
  }

  /**
   * Emit general notification
   */
  emitNotification(userId: string, data: {
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }) {
    this.io.to(`user:${userId}`).emit('notification', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Notification sent to user:${userId}`, data);
  }

  /**
   * Emit typing indicator
   */
  emitTyping(conversationId: string, data: {
    userId: string;
    userName: string;
    isTyping: boolean;
  }) {
    this.io.to(`conversation:${conversationId}`).emit('user-typing', {
      conversationId,
      ...data,
      timestamp: new Date()
    });
  }

  /**
   * Emit user online status
   */
  emitUserOnline(userId: string, data: {
    userName: string;
    status: 'online' | 'offline';
  }) {
    this.io.emit('user-status-change', {
      userId,
      ...data,
      timestamp: new Date()
    });
  }

  /**
   * Emit tender update
   */
  emitTenderUpdate(userId: string, data: {
    tenderId: string;
    tenderTitle: string;
    message: string;
    status?: string;
  }) {
    this.io.to(`user:${userId}`).emit('tender-update', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Tender update sent to user:${userId}`, data);
  }

  /**
   * Emit quality scan completion
   */
  emitQualityScanComplete(userId: string, data: {
    scanId: string;
    productId: string;
    grade: string;
    score: number;
    defects?: string[];
  }) {
    this.io.to(`user:${userId}`).emit('quality-scan-complete', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Quality scan complete for user:${userId}`, data);
  }

  /**
   * Emit payment status update
   */
  emitPaymentUpdate(userId: string, data: {
    paymentId: string;
    orderId: string;
    status: string;
    amount: number;
  }) {
    this.io.to(`user:${userId}`).emit('payment-update', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Payment update sent to user:${userId}`, data);
  }

  /**
   * Emit escrow status update
   */
  emitEscrowUpdate(userId: string, data: {
    escrowId: string;
    orderId: string;
    status: string;
    amount: number;
  }) {
    this.io.to(`user:${userId}`).emit('escrow-update', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Escrow update sent to user:${userId}`, data);
  }

  /**
   * Emit bid update (buyer-specific)
   */
  emitBidUpdate(userId: string, data: {
    bidId: string;
    status: string;
    counterOfferPrice?: number;
    message?: string;
  }) {
    this.io.to(`user:${userId}`).emit('bid:update', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Bid update sent to user:${userId}`, data);
  }

  /**
   * Emit counter offer (buyer-specific)
   */
  emitCounterOffer(userId: string, data: {
    bidId: string;
    counterOfferPrice: number;
    message?: string;
  }) {
    this.io.to(`user:${userId}`).emit('bid:counter-offer', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Counter offer sent to user:${userId}`, data);
  }

  /**
   * Emit order location update (buyer-specific)
   */
  emitOrderLocationUpdate(userId: string, data: {
    orderId: string;
    location: string;
    lat?: number;
    lng?: number;
    status: string;
  }) {
    this.io.to(`user:${userId}`).emit('order:location-update', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Order location update sent to user:${userId}`, data);
  }

  /**
   * Emit pre-booking accepted (buyer-specific)
   */
  emitPreBookingAccepted(userId: string, data: {
    preBookingId: string;
    productName: string;
    quantity: number;
    targetDate: Date;
  }) {
    this.io.to(`user:${userId}`).emit('pre-booking:accepted', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Pre-booking accepted sent to user:${userId}`, data);
  }

  /**
   * Emit chat response (buyer-specific)
   */
  emitChatResponse(userId: string, data: {
    message: string;
    context?: any;
  }) {
    this.io.to(`user:${userId}`).emit('chat:response', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Chat response sent to user:${userId}`);
  }

  /**
   * Emit reputation score change (buyer-specific)
   */
  emitReputationChange(userId: string, data: {
    oldScore: number;
    newScore: number;
    change: number;
    reason: string;
  }) {
    this.io.to(`user:${userId}`).emit('reputation:change', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Reputation change sent to user:${userId}`, data);
  }

  /**
   * Emit blockchain transaction confirmed (buyer-specific)
   */
  emitBlockchainTxConfirmed(userId: string, data: {
    txId: string;
    txHash: string;
    type: string;
    blockNumber: number;
  }) {
    this.io.to(`user:${userId}`).emit('blockchain:tx-confirmed', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Blockchain tx confirmed sent to user:${userId}`, data);
  }

  /**
   * Emit bulk trade matched (buyer-specific)
   */
  emitBulkTradeMatched(userId: string, data: {
    tradeId: string;
    supplierIds: string[];
    productName: string;
    quantity: number;
  }) {
    this.io.to(`user:${userId}`).emit('bulk-trade:matched', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Bulk trade matched sent to user:${userId}`, data);
  }

  /**
   * Emit to specific user
   */
  emitToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Event ${event} sent to user:${userId}`, data);
  }

  /**
   * Emit AI chat chunk for streaming
   */
  emitAIChatChunk(userId: string, data: {
    sessionId: string;
    content: string;
    type: 'content' | 'metadata' | 'done' | 'error';
    metadata?: any;
  }) {
    this.io.to(`user:${userId}`).emit('ai-chat-chunk', {
      ...data,
      timestamp: new Date()
    });
  }

  /**
   * Emit AI chat response completion
   */
  emitAIChatResponse(userId: string, data: {
    sessionId: string;
    response: string;
    suggestions?: string[];
    metadata?: any;
  }) {
    this.io.to(`user:${userId}`).emit('ai-chat-response', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] AI chat response sent to user:${userId}`);
  }

  /**
   * Emit conversation cleared event
   */
  emitConversationCleared(userId: string, data: {
    sessionId: string;
  }) {
    this.io.to(`user:${userId}`).emit('conversation-cleared', {
      ...data,
      timestamp: new Date()
    });
    console.log(`[Socket] Conversation cleared for user:${userId}`, data);
  }

  /**
   * Broadcast system announcement
   */
  broadcastAnnouncement(data: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    priority?: 'low' | 'medium' | 'high';
  }) {
    this.io.emit('system-announcement', {
      ...data,
      timestamp: new Date()
    });
    console.log('[Socket] System announcement broadcasted', data);
  }

  /**
   * Join user to their personal room
   */
  joinUserRoom(socketId: string, userId: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`user:${userId}`);
      console.log(`[Socket] User ${userId} joined personal room`);
    }
  }

  /**
   * Join order-specific room for tracking
   */
  joinOrderRoom(socketId: string, orderId: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`order:${orderId}`);
      console.log(`[Socket] Socket ${socketId} joined order:${orderId} room`);
    }
  }

  /**
   * Join conversation room for chat
   */
  joinConversationRoom(socketId: string, conversationId: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`conversation:${conversationId}`);
      console.log(`[Socket] Socket ${socketId} joined conversation:${conversationId} room`);
    }
  }

  /**
   * Leave room
   */
  leaveRoom(socketId: string, room: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.leave(room);
      console.log(`[Socket] Socket ${socketId} left room ${room}`);
    }
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.io.sockets.sockets.size;
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    const room = this.io.sockets.adapter.rooms.get(`user:${userId}`);
    return room ? room.size > 0 : false;
  }

  /**
   * Emit AgriChat message to room
   */
  emitAgriChatMessage(chatRoomId: string, message: any) {
    this.io.to(`agri-chat:${chatRoomId}`).emit('message_received', message);
    console.log(`[AgriChat] Message sent to room:${chatRoomId}`);
  }

  /**
   * Emit typing indicator
   */
  emitAgriChatTyping(chatRoomId: string, userId: string, isTyping: boolean) {
    this.io.to(`agri-chat:${chatRoomId}`).emit('typing', {
      userId,
      isTyping,
    });
  }

  /**
   * Emit user online status
   */
  emitAgriChatUserOnline(chatRoomId: string, userId: string) {
    this.io.to(`agri-chat:${chatRoomId}`).emit('user_online', userId);
  }

  /**
   * Emit user offline status
   */
  emitAgriChatUserOffline(chatRoomId: string, userId: string) {
    this.io.to(`agri-chat:${chatRoomId}`).emit('user_offline', userId);
  }

  /**
   * Join AgriChat room
   */
  joinAgriChatRoom(socketId: string, chatRoomId: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`agri-chat:${chatRoomId}`);
      console.log(`[AgriChat] Socket ${socketId} joined room ${chatRoomId}`);
    }
  }

  /**
   * Leave AgriChat room
   */
  leaveAgriChatRoom(socketId: string, chatRoomId: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.leave(`agri-chat:${chatRoomId}`);
      console.log(`[AgriChat] Socket ${socketId} left room ${chatRoomId}`);
    }
  }
}

// Singleton instance
let socketServiceInstance: SocketService | null = null;

export const initializeSocketService = (io: Server): SocketService => {
  socketServiceInstance = new SocketService(io);
  return socketServiceInstance;
};

export const getSocketService = (): SocketService => {
  if (!socketServiceInstance) {
    throw new Error('Socket service not initialized. Call initializeSocketService first.');
  }
  return socketServiceInstance;
};
