/**
 * Socket Service - Refactored
 * Centralized real-time event emission with standardized event names
 * Replaces the old socketService.ts with consistent event naming
 */

import { Server, Socket } from 'socket.io';
import {
  SOCKET_EVENTS,
  SOCKET_ROOMS,
  OrderEventPayload,
  ProductEventPayload,
  MessageEventPayload,
  TypingEventPayload,
  UserPresencePayload,
  PaymentEventPayload,
  RatingEventPayload,
  NotificationEventPayload,
  QualityEventPayload,
  ProposalEventPayload,
  TenderEventPayload,
  EscrowEventPayload,
  PriceAlertPayload,
} from '../types/socket-events';

export class SocketServiceRefactored {
  private io: Server;
  private eventLog: Map<string, any[]> = new Map();

  constructor(io: Server) {
    this.io = io;
    this.setupEventLogging();
  }

  /**
   * Setup event logging for audit trail
   */
  private setupEventLogging() {
    // Log all events for audit purposes
    this.io.on('connection', (socket: Socket) => {
      socket.onAny((eventName: string, ...args: any[]) => {
        if (!this.eventLog.has(eventName)) {
          this.eventLog.set(eventName, []);
        }
        this.eventLog.get(eventName)!.push({
          timestamp: new Date(),
          userId: socket.data.userId,
          data: args[0],
        });
      });
    });
  }

  /**
   * Get event log for audit purposes
   */
  getEventLog(eventName?: string, limit: number = 100): any[] {
    if (eventName) {
      return (this.eventLog.get(eventName) || []).slice(-limit);
    }
    const allEvents: any[] = [];
    this.eventLog.forEach((events) => allEvents.push(...events));
    return allEvents.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }

  /**
   * Clear event log
   */
  clearEventLog(eventName?: string) {
    if (eventName) {
      this.eventLog.delete(eventName);
    } else {
      this.eventLog.clear();
    }
  }

  // ========================================================================
  // ORDER EVENTS
  // ========================================================================

  /**
   * Emit when new order is placed (to farmer)
   */
  emitOrderNew(farmerId: string, payload: OrderEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(farmerId)).emit(SOCKET_EVENTS.ORDER.NEW, payload);
    console.log(`[Socket] Order:new → ${farmerId}`, payload.orderNumber);
  }

  /**
   * Emit when order status changes (to both farmer and buyer)
   */
  emitOrderStatusUpdated(orderId: string, payload: OrderEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.ORDER.STATUS_UPDATED, payload);
    console.log(`[Socket] Order:status:updated → ${orderId}`, payload.status);
  }

  /**
   * Emit when order location updates (to buyer)
   */
  emitOrderLocationUpdated(buyerId: string, payload: OrderEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(buyerId)).emit(SOCKET_EVENTS.ORDER.LOCATION_UPDATED, payload);
    console.log(`[Socket] Order:location:updated → ${buyerId}`);
  }

  /**
   * Emit when order is cancelled (to both parties)
   */
  emitOrderCancelled(orderId: string, payload: OrderEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.ORDER.CANCELLED, payload);
    console.log(`[Socket] Order:cancelled → ${orderId}`);
  }

  /**
   * Emit when order is delivered (to both parties)
   */
  emitOrderDelivered(orderId: string, payload: OrderEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.ORDER.DELIVERED, payload);
    console.log(`[Socket] Order:delivered → ${orderId}`);
  }

  /**
   * Emit when order is completed (to both parties)
   */
  emitOrderCompleted(orderId: string, payload: OrderEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.ORDER.COMPLETED, payload);
    console.log(`[Socket] Order:completed → ${orderId}`);
  }

  // ========================================================================
  // PRODUCT EVENTS
  // ========================================================================

  /**
   * Emit when new product is created (to all buyers)
   */
  emitProductCreated(payload: ProductEventPayload) {
    this.io.emit(SOCKET_EVENTS.PRODUCT.CREATED, payload);
    console.log(`[Socket] Product:created`, payload.name);
  }

  /**
   * Emit when product is updated (to all interested users)
   */
  emitProductUpdated(productId: string, payload: ProductEventPayload) {
    this.io.to(SOCKET_ROOMS.PRODUCT(productId)).emit(SOCKET_EVENTS.PRODUCT.UPDATED, payload);
    console.log(`[Socket] Product:updated → ${productId}`);
  }

  /**
   * Emit when product is deleted (to favorited buyers)
   */
  emitProductDeleted(productId: string, payload: ProductEventPayload) {
    this.io.to(SOCKET_ROOMS.PRODUCT(productId)).emit(SOCKET_EVENTS.PRODUCT.DELETED, payload);
    console.log(`[Socket] Product:deleted → ${productId}`);
  }

  /**
   * Emit when product quality is updated (to farmer)
   */
  emitProductQualityUpdated(farmerId: string, payload: ProductEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(farmerId)).emit(SOCKET_EVENTS.PRODUCT.QUALITY_UPDATED, payload);
    console.log(`[Socket] Product:quality:updated → ${farmerId}`);
  }

  /**
   * Emit when product price changes (to all buyers)
   */
  emitPriceUpdated(productId: string, payload: ProductEventPayload) {
    this.io.to(SOCKET_ROOMS.PRODUCT(productId)).emit(SOCKET_EVENTS.PRODUCT.PRICE_UPDATED, payload);
    console.log(`[Socket] Price:updated → ${productId}`);
  }

  /**
   * Emit when product goes out of stock (to interested buyers)
   */
  emitProductOutOfStock(productId: string, payload: ProductEventPayload) {
    this.io.to(SOCKET_ROOMS.PRODUCT(productId)).emit(SOCKET_EVENTS.PRODUCT.OUT_OF_STOCK, payload);
    console.log(`[Socket] Product:out-of-stock → ${productId}`);
  }

  // ========================================================================
  // MESSAGE EVENTS
  // ========================================================================

  /**
   * Emit when new message is sent (to recipient)
   */
  emitMessageNew(conversationId: string, payload: MessageEventPayload) {
    this.io.to(SOCKET_ROOMS.CONVERSATION(conversationId)).emit(SOCKET_EVENTS.MESSAGE.NEW, payload);
    console.log(`[Socket] Message:new → ${conversationId}`);
  }

  /**
   * Emit when user is typing (to other party)
   */
  emitMessageTyping(conversationId: string, payload: TypingEventPayload) {
    this.io.to(SOCKET_ROOMS.CONVERSATION(conversationId)).emit(SOCKET_EVENTS.MESSAGE.TYPING, payload);
  }

  /**
   * Emit when user stops typing (to other party)
   */
  emitMessageTypingStop(conversationId: string, payload: TypingEventPayload) {
    this.io.to(SOCKET_ROOMS.CONVERSATION(conversationId)).emit(SOCKET_EVENTS.MESSAGE.TYPING_STOP, payload);
  }

  /**
   * Emit when message is read (to sender)
   */
  emitMessageRead(conversationId: string, payload: MessageEventPayload) {
    this.io.to(SOCKET_ROOMS.CONVERSATION(conversationId)).emit(SOCKET_EVENTS.MESSAGE.READ, payload);
    console.log(`[Socket] Message:read → ${conversationId}`);
  }

  /**
   * Emit when message is deleted (to both parties)
   */
  emitMessageDeleted(conversationId: string, payload: MessageEventPayload) {
    this.io.to(SOCKET_ROOMS.CONVERSATION(conversationId)).emit(SOCKET_EVENTS.MESSAGE.DELETED, payload);
    console.log(`[Socket] Message:deleted → ${conversationId}`);
  }

  /**
   * Emit when message is edited (to both parties)
   */
  emitMessageEdited(conversationId: string, payload: MessageEventPayload) {
    this.io.to(SOCKET_ROOMS.CONVERSATION(conversationId)).emit(SOCKET_EVENTS.MESSAGE.EDITED, payload);
    console.log(`[Socket] Message:edited → ${conversationId}`);
  }

  // ========================================================================
  // USER PRESENCE EVENTS
  // ========================================================================

  /**
   * Emit when user comes online (to contacts)
   */
  emitUserOnline(userId: string, payload: UserPresencePayload) {
    this.io.emit(SOCKET_EVENTS.USER.ONLINE, payload);
    console.log(`[Socket] User:online → ${userId}`);
  }

  /**
   * Emit when user goes offline (to contacts)
   */
  emitUserOffline(userId: string, payload: UserPresencePayload) {
    this.io.emit(SOCKET_EVENTS.USER.OFFLINE, payload);
    console.log(`[Socket] User:offline → ${userId}`);
  }

  /**
   * Emit when user is typing (to contacts in conversation)
   */
  emitUserTyping(conversationId: string, payload: TypingEventPayload) {
    this.io.to(SOCKET_ROOMS.CONVERSATION(conversationId)).emit(SOCKET_EVENTS.USER.TYPING, payload);
  }

  /**
   * Emit when user goes away (to contacts)
   */
  emitUserAway(userId: string, payload: UserPresencePayload) {
    this.io.emit(SOCKET_EVENTS.USER.AWAY, payload);
    console.log(`[Socket] User:away → ${userId}`);
  }

  // ========================================================================
  // PAYMENT EVENTS
  // ========================================================================

  /**
   * Emit when payment is initiated (to both parties)
   */
  emitPaymentInitiated(orderId: string, payload: PaymentEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.PAYMENT.INITIATED, payload);
    console.log(`[Socket] Payment:initiated → ${orderId}`);
  }

  /**
   * Emit when payment succeeds (to both parties)
   */
  emitPaymentSuccess(orderId: string, payload: PaymentEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.PAYMENT.SUCCESS, payload);
    console.log(`[Socket] Payment:success → ${orderId}`);
  }

  /**
   * Emit when payment fails (to both parties)
   */
  emitPaymentFailed(orderId: string, payload: PaymentEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.PAYMENT.FAILED, payload);
    console.log(`[Socket] Payment:failed → ${orderId}`);
  }

  /**
   * Emit when payment is refunded (to both parties)
   */
  emitPaymentRefunded(orderId: string, payload: PaymentEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.PAYMENT.REFUNDED, payload);
    console.log(`[Socket] Payment:refunded → ${orderId}`);
  }

  /**
   * Emit when invoice is generated (to both parties)
   */
  emitInvoiceGenerated(orderId: string, payload: PaymentEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.PAYMENT.INVOICE_GENERATED, payload);
    console.log(`[Socket] Invoice:generated → ${orderId}`);
  }

  // ========================================================================
  // RATING & REPUTATION EVENTS
  // ========================================================================

  /**
   * Emit when new rating is submitted (to recipient)
   */
  emitRatingNew(userId: string, payload: RatingEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.RATING.NEW, payload);
    console.log(`[Socket] Rating:new → ${userId}`);
  }

  /**
   * Emit when reputation score updates (to user)
   */
  emitReputationUpdated(userId: string, payload: any) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.REPUTATION.UPDATED, payload);
    console.log(`[Socket] Reputation:updated → ${userId}`);
  }

  /**
   * Emit when user earns trust badge (to user)
   */
  emitTrustBadgeEarned(userId: string, payload: any) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.REPUTATION.BADGE_EARNED, payload);
    console.log(`[Socket] Trust:badge:earned → ${userId}`);
  }

  // ========================================================================
  // NOTIFICATION EVENTS
  // ========================================================================

  /**
   * Emit when new notification is created (to user)
   */
  emitNotificationNew(userId: string, payload: NotificationEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.NOTIFICATION.NEW, payload);
    console.log(`[Socket] Notification:new → ${userId}`);
  }

  /**
   * Emit when notification is read (to user)
   */
  emitNotificationRead(userId: string, payload: NotificationEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.NOTIFICATION.READ, payload);
    console.log(`[Socket] Notification:read → ${userId}`);
  }

  /**
   * Emit when notification is deleted (to user)
   */
  emitNotificationDeleted(userId: string, payload: NotificationEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.NOTIFICATION.DELETED, payload);
    console.log(`[Socket] Notification:deleted → ${userId}`);
  }

  // ========================================================================
  // QUALITY ANALYSIS EVENTS
  // ========================================================================

  /**
   * Emit when quality scan starts (to farmer)
   */
  emitQualityScanStarted(farmerId: string, payload: QualityEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(farmerId)).emit(SOCKET_EVENTS.QUALITY.SCAN_STARTED, payload);
    console.log(`[Socket] Quality:scan:started → ${farmerId}`);
  }

  /**
   * Emit when quality scan completes (to farmer)
   */
  emitQualityScanComplete(farmerId: string, payload: QualityEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(farmerId)).emit(SOCKET_EVENTS.QUALITY.SCAN_COMPLETE, payload);
    console.log(`[Socket] Quality:scan:complete → ${farmerId}`);
  }

  /**
   * Emit when quality certificate is generated (to farmer)
   */
  emitQualityCertificateGenerated(farmerId: string, payload: QualityEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(farmerId)).emit(SOCKET_EVENTS.QUALITY.CERTIFICATE_GENERATED, payload);
    console.log(`[Socket] Quality:certificate:generated → ${farmerId}`);
  }

  // ========================================================================
  // PROPOSAL & NEGOTIATION EVENTS
  // ========================================================================

  /**
   * Emit when new proposal is created (to recipient)
   */
  emitProposalNew(userId: string, payload: ProposalEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.PROPOSAL.NEW, payload);
    console.log(`[Socket] Proposal:new → ${userId}`);
  }

  /**
   * Emit when counter-proposal is made (to other party)
   */
  emitProposalCounter(userId: string, payload: ProposalEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.PROPOSAL.COUNTER, payload);
    console.log(`[Socket] Proposal:counter → ${userId}`);
  }

  /**
   * Emit when proposal is accepted (to both parties)
   */
  emitProposalAccepted(orderId: string, payload: ProposalEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.PROPOSAL.ACCEPTED, payload);
    console.log(`[Socket] Proposal:accepted → ${orderId}`);
  }

  /**
   * Emit when proposal is rejected (to proposer)
   */
  emitProposalRejected(userId: string, payload: ProposalEventPayload) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.PROPOSAL.REJECTED, payload);
    console.log(`[Socket] Proposal:rejected → ${userId}`);
  }

  /**
   * Emit when proposal expires (to both parties)
   */
  emitProposalExpired(orderId: string, payload: ProposalEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.PROPOSAL.EXPIRED, payload);
    console.log(`[Socket] Proposal:expired → ${orderId}`);
  }

  // ========================================================================
  // TENDER EVENTS
  // ========================================================================

  /**
   * Emit when tender is created (to all farmers)
   */
  emitTenderCreated(payload: TenderEventPayload) {
    this.io.emit(SOCKET_EVENTS.TENDER.CREATED, payload);
    console.log(`[Socket] Tender:created`, payload.title);
  }

  /**
   * Emit when bid is placed (to tender room)
   */
  emitTenderBidPlaced(tenderId: string, payload: TenderEventPayload) {
    this.io.to(SOCKET_ROOMS.TENDER(tenderId)).emit(SOCKET_EVENTS.TENDER.BID_PLACED, payload);
    console.log(`[Socket] Tender:bid:placed → ${tenderId}`);
  }

  /**
   * Emit when bid is updated (to tender room)
   */
  emitTenderBidUpdated(tenderId: string, payload: TenderEventPayload) {
    this.io.to(SOCKET_ROOMS.TENDER(tenderId)).emit(SOCKET_EVENTS.TENDER.BID_UPDATED, payload);
    console.log(`[Socket] Tender:bid:updated → ${tenderId}`);
  }

  /**
   * Emit when tender winner is announced (to all bidders)
   */
  emitTenderWinnerAnnounced(tenderId: string, payload: TenderEventPayload) {
    this.io.to(SOCKET_ROOMS.TENDER(tenderId)).emit(SOCKET_EVENTS.TENDER.WINNER_ANNOUNCED, payload);
    console.log(`[Socket] Tender:winner:announced → ${tenderId}`);
  }

  /**
   * Emit when tender is closed (to all bidders)
   */
  emitTenderClosed(tenderId: string, payload: TenderEventPayload) {
    this.io.to(SOCKET_ROOMS.TENDER(tenderId)).emit(SOCKET_EVENTS.TENDER.CLOSED, payload);
    console.log(`[Socket] Tender:closed → ${tenderId}`);
  }

  // ========================================================================
  // ESCROW EVENTS
  // ========================================================================

  /**
   * Emit when escrow is created (to both parties)
   */
  emitEscrowCreated(orderId: string, payload: EscrowEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.ESCROW.CREATED, payload);
    console.log(`[Socket] Escrow:created → ${orderId}`);
  }

  /**
   * Emit when funds are held in escrow (to both parties)
   */
  emitEscrowFundsHeld(orderId: string, payload: EscrowEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.ESCROW.FUNDS_HELD, payload);
    console.log(`[Socket] Escrow:funds:held → ${orderId}`);
  }

  /**
   * Emit when escrow funds are released (to both parties)
   */
  emitEscrowReleased(orderId: string, payload: EscrowEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.ESCROW.RELEASED, payload);
    console.log(`[Socket] Escrow:released → ${orderId}`);
  }

  /**
   * Emit when escrow is refunded (to both parties)
   */
  emitEscrowRefunded(orderId: string, payload: EscrowEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.ESCROW.REFUNDED, payload);
    console.log(`[Socket] Escrow:refunded → ${orderId}`);
  }

  /**
   * Emit when escrow is disputed (to both parties)
   */
  emitEscrowDisputed(orderId: string, payload: EscrowEventPayload) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.ESCROW.DISPUTED, payload);
    console.log(`[Socket] Escrow:disputed → ${orderId}`);
  }

  // ========================================================================
  // BLOCKCHAIN EVENTS
  // ========================================================================

  /**
   * Emit when blockchain transaction is recorded (to interested parties)
   */
  emitBlockchainTransactionRecorded(orderId: string, payload: any) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.BLOCKCHAIN.TRANSACTION_RECORDED, payload);
    console.log(`[Socket] Blockchain:transaction:recorded → ${orderId}`);
  }

  /**
   * Emit when blockchain trace is updated (to interested parties)
   */
  emitBlockchainTraceUpdated(orderId: string, payload: any) {
    this.io.to(SOCKET_ROOMS.ORDER(orderId)).emit(SOCKET_EVENTS.BLOCKCHAIN.TRACE_UPDATED, payload);
    console.log(`[Socket] Blockchain:trace:updated → ${orderId}`);
  }

  // ========================================================================
  // MARKET DATA EVENTS
  // ========================================================================

  /**
   * Emit price alert (to interested users)
   */
  emitPriceAlert(userId: string, payload: PriceAlertPayload) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.MARKET.PRICE_ALERT, payload);
    console.log(`[Socket] Market:price:alert → ${userId}`);
  }

  /**
   * Emit market trend update (to all users)
   */
  emitMarketTrendUpdate(payload: any) {
    this.io.to(SOCKET_ROOMS.MARKET).emit(SOCKET_EVENTS.MARKET.TREND_UPDATE, payload);
    console.log(`[Socket] Market:trend:update`);
  }

  /**
   * Emit demand forecast (to interested users)
   */
  emitDemandForecast(userId: string, payload: any) {
    this.io.to(SOCKET_ROOMS.USER(userId)).emit(SOCKET_EVENTS.MARKET.DEMAND_FORECAST, payload);
    console.log(`[Socket] Market:demand:forecast → ${userId}`);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  /**
   * Get Socket.IO instance
   */
  getIO(): Server {
    return this.io;
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.io.engine.clientsCount;
  }

  /**
   * Get users in a specific room
   */
  getUsersInRoom(room: string): string[] {
    const sockets = this.io.sockets.adapter.rooms.get(room);
    return sockets ? Array.from(sockets) : [];
  }

  /**
   * Broadcast error to all connected clients
   */
  broadcastError(error: { code: string; message: string; details?: any }) {
    this.io.emit(SOCKET_EVENTS.ERROR, {
      ...error,
      timestamp: new Date(),
    });
    console.error(`[Socket] Error broadcast:`, error);
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let socketServiceInstance: SocketServiceRefactored | null = null;

export function initializeSocketService(io: Server): SocketServiceRefactored {
  socketServiceInstance = new SocketServiceRefactored(io);
  return socketServiceInstance;
}

export function getSocketService(): SocketServiceRefactored {
  if (!socketServiceInstance) {
    throw new Error('Socket service not initialized. Call initializeSocketService first.');
  }
  return socketServiceInstance;
}
