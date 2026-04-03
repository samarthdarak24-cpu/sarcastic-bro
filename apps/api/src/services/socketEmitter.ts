/* ========================================================================
   Socket Emitter Service — Helper utilities for emitting real-time events
   Use these methods in services and controllers to push updates to clients
   ======================================================================== */

import { SocketService } from "../config/socket";

// ─── Type Definitions ──────────────────────────────────────────────────

export interface MessageEventData {
  conversationId: string;
  messageId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "image" | "file" | "voice";
  timestamp: Date;
  isRead: boolean;
  fileUrl?: string;
}

export interface OrderEventData {
  orderId: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "CANCELLED";
  farmerId?: string;
  buyerId?: string;
  productName?: string;
  quantity?: number;
  totalPrice?: number;
  updatedAt: Date;
  notes?: string;
}

export interface NotificationEventData {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  isRead?: boolean;
  actionUrl?: string;
}

export interface ProposalEventData {
  proposalId: string;
  senderId: string;
  senderName?: string;
  receiverId?: string;
  pricePerUnit: number;
  quantity: number;
  totalPrice: number;
  productName?: string;
  validUntil?: Date;
  status?: string;
  newPrice?: number;
  newQuantity?: number;
  orderId?: string;
  timestamp: Date;
}

export interface PresenceEventData {
  userId: string;
  lastSeen: Date;
  isOnline: boolean;
}

// ─── Socket Emitter Service ────────────────────────────────────────────

export class SocketEmitter {
  /**
   * Emit to a specific user across all their connections
   * @param userId - Target user ID
   * @param event - Event name
   * @param data - Event payload
   *
   * @example
   * SocketEmitter.emitToUser(userId, 'notification:new', notificationData);
   */
  public static emitToUser(userId: string, event: string, data: any): void {
    try {
      SocketService.emitToUser(userId, event, {
        ...data,
        emittedAt: new Date(),
      });
      console.log(`[Emit] Event '${event}' sent to user ${userId}`);
    } catch (err: any) {
      console.error(`[Emit] Failed to emit '${event}' to user ${userId}:`, err);
    }
  }

  /**
   * Emit to a specific room
   * @param roomName - Room identifier
   * @param event - Event name
   * @param data - Event payload
   *
   * @example
   * SocketEmitter.emitToRoom('conversation:conv123', 'message:new', messageData);
   */
  public static emitToRoom(roomName: string, event: string, data: any): void {
    try {
      SocketService.emitToRoom(roomName, event, {
        ...data,
        emittedAt: new Date(),
      });
      console.log(`[Emit] Event '${event}' sent to room '${roomName}'`);
    } catch (err: any) {
      console.error(`[Emit] Failed to emit '${event}' to room '${roomName}':`, err);
    }
  }

  /**
   * Broadcast event to all connected clients
   * @param event - Event name
   * @param data - Event payload
   *
   * @example
   * SocketEmitter.emitToAll('system:notification', broadcastData);
   */
  public static emitToAll(event: string, data: any): void {
    try {
      SocketService.emitToAll(event, {
        ...data,
        emittedAt: new Date(),
      });
      console.log(`[Emit] Event '${event}' broadcast to all clients`);
    } catch (err: any) {
      console.error(`[Emit] Failed to broadcast '${event}':`, err);
    }
  }

  // ─── Specialized Event Emitters ────────────────────────────────────────

  /**
   * Emit new message event to conversation room
   * @param conversationId - Conversation ID
   * @param messageData - Message details
   * @param recipientId - ID of message recipient (for notification)
   *
   * @example
   * SocketEmitter.emitMessageNew(convId, {
   *   conversationId, messageId, senderId, senderName,
   *   content, type, timestamp, isRead, fileUrl
   * }, buyerId);
   */
  public static emitMessageNew(
    conversationId: string,
    messageData: Partial<MessageEventData>,
    recipientId?: string
  ): void {
    try {
      // Emit to conversation room
      this.emitToRoom(`conversation:${conversationId}`, "message:new", {
        conversationId,
        ...messageData,
        timestamp: messageData.timestamp || new Date(),
      });

      // Also notify recipient
      if (recipientId && messageData.senderId !== recipientId) {
        this.emitToUser(recipientId, "message:notification", {
          conversationId,
          messageId: messageData.messageId,
          senderId: messageData.senderId,
          senderName: messageData.senderName,
          preview: messageData.content?.substring(0, 50),
          timestamp: messageData.timestamp || new Date(),
        });
      }

      console.log(
        `[Emit] Message sent to conversation:${conversationId}`
      );
    } catch (err: any) {
      console.error(`[Emit] emitMessageNew failed:`, err);
    }
  }

  /**
   * Emit message read status
   * @param conversationId - Conversation ID
   * @param messageId - Message ID
   * @param userId - User who read the message
   *
   * @example
   * SocketEmitter.emitMessageRead(convId, msgId, userId);
   */
  public static emitMessageRead(
    conversationId: string,
    messageId: string,
    userId: string
  ): void {
    try {
      this.emitToRoom(`conversation:${conversationId}`, "message:read", {
        conversationId,
        messageId,
        userId,
        readAt: new Date(),
      });
    } catch (err: any) {
      console.error(`[Emit] emitMessageRead failed:`, err);
    }
  }

  /**
   * Emit typing indicator
   * @param conversationId - Conversation ID
   * @param userId - User who is typing
   * @param isTyping - Whether user started or stopped typing
   *
   * @example
   * SocketEmitter.emitUserTyping(convId, userId, true);
   */
  public static emitUserTyping(
    conversationId: string,
    userId: string,
    isTyping: boolean
  ): void {
    try {
      this.emitToRoom(`conversation:${conversationId}`, "user:typing", {
        conversationId,
        userId,
        isTyping,
        timestamp: new Date(),
      });
    } catch (err: any) {
      console.error(`[Emit] emitUserTyping failed:`, err);
    }
  }

  /**
   * Emit new order event
   * @param orderId - Order ID
   * @param orderData - Order details
   * @param farmerId - Farmer ID (receives notification)
   * @param buyerId - Buyer ID (also notified)
   *
   * @example
   * SocketEmitter.emitOrderCreated(orderId, {
   *   orderId, orderNumber, productName, quantity, totalPrice
   * }, farmerId, buyerId);
   */
  public static emitOrderCreated(
    orderId: string,
    orderData: Partial<OrderEventData>,
    farmerId: string,
    buyerId: string
  ): void {
    try {
      const payload = {
        orderId,
        ...orderData,
        updatedAt: orderData.updatedAt || new Date(),
      };

      // Notify farmer
      this.emitToUser(farmerId, "order:created", payload);

      // Emit to order room
      this.emitToRoom(`order:${orderId}`, "order:created", payload);

      // Also create notification event
      this.emitNotification(farmerId, "ORDER", {
        title: "New Order Received",
        message: `New order received for ${orderData.productName}`,
        metadata: { orderId, buyerId, quantity: orderData.quantity },
      });

      console.log(`[Emit] Order ${orderId} created event emitted`);
    } catch (err: any) {
      console.error(`[Emit] emitOrderCreated failed:`, err);
    }
  }

  /**
   * Emit order status change
   * @param orderId - Order ID
   * @param status - New order status
   * @param farmerId - Affected farmer ID
   * @param buyerId - Affected buyer ID
   * @param notes - Optional status notes
   *
   * @example
   * SocketEmitter.emitOrderStatus(orderId, 'SHIPPED', farmerId, buyerId, 'Order dispatched');
   */
  public static emitOrderStatus(
    orderId: string,
    status: OrderEventData["status"],
    farmerId: string,
    buyerId: string,
    notes?: string
  ): void {
    try {
      const payload = {
        orderId,
        status,
        updatedAt: new Date(),
        notes,
      };

      // Both parties should be aware
      this.emitToUser(farmerId, "order:status", payload);
      this.emitToUser(buyerId, "order:status", payload);

      // Emit to order room
      this.emitToRoom(`order:${orderId}`, "order:status", payload);

      // Create notification for receiver
      const statusMessages: Record<string, string> = {
        PENDING: "Order is pending",
        CONFIRMED: "Order confirmed",
        PROCESSING: "Order is being processed",
        SHIPPED: "Order has been shipped",
        IN_TRANSIT: "Order is in transit",
        DELIVERED: "Order delivered",
        CANCELLED: "Order cancelled",
      };

      this.emitNotification(buyerId, "ORDER_STATUS", {
        title: "Order Status Updated",
        message: statusMessages[status] || `Order status: ${status}`,
        metadata: { orderId, status },
      });

      console.log(`[Emit] Order ${orderId} status changed to ${status}`);
    } catch (err: any) {
      console.error(`[Emit] emitOrderStatus failed:`, err);
    }
  }

  /**
   * Emit order cancellation
   * @param orderId - Order ID
   * @param farmerId - Farmer ID
   * @param buyerId - Buyer ID
   * @param reason - Cancellation reason
   *
   * @example
   * SocketEmitter.emitOrderCancelled(orderId, farmerId, buyerId, 'Out of stock');
   */
  public static emitOrderCancelled(
    orderId: string,
    farmerId: string,
    buyerId: string,
    reason?: string
  ): void {
    try {
      const payload = {
        orderId,
        status: "CANCELLED" as const,
        reason,
        cancelledAt: new Date(),
      };

      // Notify both parties
      this.emitToUser(farmerId, "order:cancelled", payload);
      this.emitToUser(buyerId, "order:cancelled", payload);
      this.emitToRoom(`order:${orderId}`, "order:cancelled", payload);

      // Notification
      this.emitNotification(buyerId, "ORDER_CANCELLED", {
        title: "Order Cancelled",
        message: reason || "Your order has been cancelled",
        metadata: { orderId },
      });

      console.log(`[Emit] Order ${orderId} cancelled`);
    } catch (err: any) {
      console.error(`[Emit] emitOrderCancelled failed:`, err);
    }
  }

  /**
   * Emit new notification to user
   * @param userId - Target user ID
   * @param notificationType - Type of notification
   * @param notificationData - Notification payload
   *
   * @example
   * SocketEmitter.emitNotification(userId, 'ORDER', {
   *   title: 'New Order',
   *   message: 'You received a new order',
   *   metadata: { orderId }
   * });
   */
  public static emitNotification(
    userId: string,
    notificationType: string,
    notificationData: {
      title?: string;
      message?: string;
      metadata?: Record<string, any>;
      actionUrl?: string;
      notificationId?: string;
    }
  ): void {
    try {
      const payload: Partial<NotificationEventData> = {
        userId,
        type: notificationType,
        title: notificationData.title,
        message: notificationData.message,
        metadata: notificationData.metadata,
        createdAt: new Date(),
        actionUrl: notificationData.actionUrl,
        notificationId: notificationData.notificationId,
      };

      this.emitToUser(userId, "notification:new", payload);
      console.log(
        `[Emit] Notification of type '${notificationType}' sent to user ${userId}`
      );
    } catch (err: any) {
      console.error(`[Emit] emitNotification failed:`, err);
    }
  }

  /**
   * Emit notification read status
   * @param userId - User ID
   * @param notificationId - Notification ID
   *
   * @example
   * SocketEmitter.emitNotificationRead(userId, notificationId);
   */
  public static emitNotificationRead(
    userId: string,
    notificationId: string
  ): void {
    try {
      this.emitToUser(userId, "notification:read", {
        notificationId,
        userId,
        readAt: new Date(),
      });
    } catch (err: any) {
      console.error(`[Emit] emitNotificationRead failed:`, err);
    }
  }

  /**
   * Emit notification deletion
   * @param userId - User ID
   * @param notificationId - Notification ID
   *
   * @example
   * SocketEmitter.emitNotificationDeleted(userId, notificationId);
   */
  public static emitNotificationDeleted(
    userId: string,
    notificationId: string
  ): void {
    try {
      this.emitToUser(userId, "notification:deleted", {
        notificationId,
        deletedAt: new Date(),
      });
    } catch (err: any) {
      console.error(`[Emit] emitNotificationDeleted failed:`, err);
    }
  }

  /**
   * Emit new proposal event
   * @param proposalId - Proposal ID
   * @param proposalData - Proposal details
   * @param receiverId - Receiver user ID
   *
   * @example
   * SocketEmitter.emitProposalNew(proposalId, {
   *   proposalId, senderId, senderName, pricePerUnit,
   *   quantity, totalPrice, productName, validUntil
   * }, receiverId);
   */
  public static emitProposalNew(
    proposalId: string,
    proposalData: Partial<ProposalEventData>,
    receiverId: string
  ): void {
    try {
      const payload = {
        proposalId,
        ...proposalData,
        timestamp: proposalData.timestamp || new Date(),
      };

      // Notify receiver
      this.emitToUser(receiverId, "proposal:new", payload);

      // Subscribe room (if needed for tracking)
      this.emitToRoom(`proposal:${proposalId}`, "proposal:new", payload);

      // Create notification
      this.emitNotification(receiverId, "PROPOSAL", {
        title: "New Proposal Received",
        message: `${proposalData.senderName} sent you a proposal for ${proposalData.quantity} units`,
        metadata: { proposalId, senderId: proposalData.senderId },
        actionUrl: `/proposals/received/${proposalId}`,
      });

      console.log(
        `[Emit] Proposal ${proposalId} created and sent to user ${receiverId}`
      );
    } catch (err: any) {
      console.error(`[Emit] emitProposalNew failed:`, err);
    }
  }

  /**
   * Emit proposal acceptance
   * @param proposalId - Proposal ID
   * @param orderId - Created order ID
   * @param senderId - Original sender (who created proposal)
   *
   * @example
   * SocketEmitter.emitProposalAccepted(proposalId, orderId, senderId);
   */
  public static emitProposalAccepted(
    proposalId: string,
    orderId: string,
    senderId: string
  ): void {
    try {
      const payload = {
        proposalId,
        orderId,
        status: "ACCEPTED",
        acceptedAt: new Date(),
      };

      // Notify sender
      this.emitToUser(senderId, "proposal:accepted", payload);

      // Emit to proposal room
      this.emitToRoom(`proposal:${proposalId}`, "proposal:accepted", payload);

      // Notification
      this.emitNotification(senderId, "PROPOSAL_ACCEPTED", {
        title: "Proposal Accepted",
        message: "Your proposal has been accepted and converted to an order",
        metadata: { proposalId, orderId },
        actionUrl: `/orders/${orderId}`,
      });

      console.log(`[Emit] Proposal ${proposalId} accepted`);
    } catch (err: any) {
      console.error(`[Emit] emitProposalAccepted failed:`, err);
    }
  }

  /**
   * Emit proposal rejection
   * @param proposalId - Proposal ID
   * @param senderId - Original sender
   * @param reason - Optional rejection reason
   *
   * @example
   * SocketEmitter.emitProposalRejected(proposalId, senderId, 'Price too high');
   */
  public static emitProposalRejected(
    proposalId: string,
    senderId: string,
    reason?: string
  ): void {
    try {
      const payload = {
        proposalId,
        status: "REJECTED",
        reason,
        rejectedAt: new Date(),
      };

      // Notify sender
      this.emitToUser(senderId, "proposal:rejected", payload);

      // Emit to proposal room
      this.emitToRoom(`proposal:${proposalId}`, "proposal:rejected", payload);

      // Notification
      this.emitNotification(senderId, "PROPOSAL_REJECTED", {
        title: "Proposal Rejected",
        message: reason || "Your proposal has been rejected",
        metadata: { proposalId },
      });

      console.log(`[Emit] Proposal ${proposalId} rejected`);
    } catch (err: any) {
      console.error(`[Emit] emitProposalRejected failed:`, err);
    }
  }

  /**
   * Emit counter proposal
   * @param proposalId - Original proposal ID
   * @param counterProposalData - Counter proposal details
   * @param receiverId - Who receives the counter
   *
   * @example
   * SocketEmitter.emitProposalCountered(proposalId, {
   *   proposalId, newPrice, newQuantity, senderId, senderName
   * }, receiverId);
   */
  public static emitProposalCountered(
    proposalId: string,
    counterProposalData: Partial<ProposalEventData>,
    receiverId: string
  ): void {
    try {
      const payload = {
        proposalId,
        ...counterProposalData,
        status: "COUNTERED",
        timestamp: counterProposalData.timestamp || new Date(),
      };

      // Notify receiver
      this.emitToUser(receiverId, "proposal:counter", payload);

      // Emit to proposal room
      this.emitToRoom(`proposal:${proposalId}`, "proposal:counter", payload);

      // Notification
      this.emitNotification(receiverId, "PROPOSAL_COUNTER", {
        title: "Counter Proposal Received",
        message: `${counterProposalData.senderName} sent a counter proposal`,
        metadata: {
          proposalId,
          newPrice: counterProposalData.newPrice,
          newQuantity: counterProposalData.newQuantity,
        },
        actionUrl: `/proposals/${proposalId}`,
      });

      console.log(`[Emit] Counter proposal for ${proposalId} sent to user ${receiverId}`);
    } catch (err: any) {
      console.error(`[Emit] emitProposalCountered failed:`, err);
    }
  }

  /**
   * Emit user online status
   * @param userId - User ID
   *
   * @example
   * SocketEmitter.emitUserOnline(userId);
   */
  public static emitUserOnline(userId: string): void {
    try {
      const payload: PresenceEventData = {
        userId,
        isOnline: true,
        lastSeen: new Date(),
      };

      this.emitToAll("user:online", payload);
      console.log(`[Emit] User ${userId} online status broadcast`);
    } catch (err: any) {
      console.error(`[Emit] emitUserOnline failed:`, err);
    }
  }

  /**
   * Emit user offline status
   * @param userId - User ID
   *
   * @example
   * SocketEmitter.emitUserOffline(userId);
   */
  public static emitUserOffline(userId: string): void {
    try {
      const payload: PresenceEventData = {
        userId,
        isOnline: false,
        lastSeen: new Date(),
      };

      this.emitToAll("user:offline", payload);
      console.log(`[Emit] User ${userId} offline status broadcast`);
    } catch (err: any) {
      console.error(`[Emit] emitUserOffline failed:`, err);
    }
  }

  /**
   * Emit system-wide event
   * @param eventName - Event name
   * @param data - Event data
   *
   * @example
   * SocketEmitter.emitSystemEvent('system:maintenance', { message: 'Server maintenance' });
   */
  public static emitSystemEvent(eventName: string, data: any): void {
    try {
      this.emitToAll(eventName, {
        ...data,
        timestamp: new Date(),
      });
      console.log(`[Emit] System event '${eventName}' broadcast`);
    } catch (err: any) {
      console.error(`[Emit] emitSystemEvent failed:`, err);
    }
  }

  /**
   * Get Socket.IO instance for advanced operations
   */
  public static getIO() {
    return SocketService.getIO();
  }

  /**
   * Check if user is online
   */
  public static isUserOnline(userId: string): boolean {
    return SocketService.isUserOnline(userId);
  }

  /**
   * Get all online users
   */
  public static getOnlineUsers(): string[] {
    return SocketService.getOnlineUsers();
  }
}

export default SocketEmitter;
