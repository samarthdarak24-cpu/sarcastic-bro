/**
 * AgriChat Socket.io - Real-time Communication
 * 15 Integrated Subfeatures with WebSocket Support
 * Converted to plain class for Express compatibility
 */

import { Server, Socket } from 'socket.io';

export class AgriChatSocket {
  private io: Server;
  private activeUsers = new Map<string, string>();
  private conversations = new Map<string, Set<string>>();

  constructor() {}

  setServer(io: Server) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`[AgriChat] User connected: ${socket.id}`);

      // ============================================
      // SUBFEATURE 1: Real-time Messaging
      // ============================================
      socket.on('agri-chat:join-conversation', (data: any) => {
        const { conversationId, userId } = data;
        socket.join(`conversation-${conversationId}`);
        this.activeUsers.set(socket.id, userId);

        if (!this.conversations.has(conversationId)) {
          this.conversations.set(conversationId, new Set());
        }
        this.conversations.get(conversationId)!.add(userId);

        this.io.to(`conversation-${conversationId}`).emit('agri-chat:user-joined', {
          userId,
          timestamp: new Date(),
          activeUsers: Array.from(this.conversations.get(conversationId)!)
        });
      });

      socket.on('agri-chat:send-message', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:message-received', {
          id: `msg-${Date.now()}`,
          conversationId,
          ...data,
          timestamp: new Date()
        });
      });

      socket.on('agri-chat:typing', (data: any) => {
        const { conversationId, userId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:user-typing', {
          userId,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 2: Smart Quote Generation
      // ============================================
      socket.on('agri-chat:quote-generated', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:quote-update', {
          ...data,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 3: Negotiation Assistant
      // ============================================
      socket.on('agri-chat:negotiation-update', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:negotiation-suggestion', {
          ...data,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 4: Contract Management
      // ============================================
      socket.on('agri-chat:contract-created', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:contract-update', {
          ...data,
          timestamp: new Date()
        });
      });

      socket.on('agri-chat:contract-signed', (data: any) => {
        const { conversationId, contractId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:contract-signed', {
          contractId,
          signedBy: data.userId,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 5: Payment Integration
      // ============================================
      socket.on('agri-chat:payment-initiated', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:payment-update', {
          ...data,
          timestamp: new Date()
        });
      });

      socket.on('agri-chat:payment-confirmed', (data: any) => {
        const { conversationId, paymentId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:payment-confirmed', {
          paymentId,
          amount: data.amount,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 6: Location & Logistics Tracking
      // ============================================
      socket.on('agri-chat:shipment-update', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:shipment-location', {
          ...data,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 7: Product Catalog Integration
      // ============================================
      socket.on('agri-chat:product-shared', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:product-shared', {
          ...data,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 8: AI-Powered Recommendations
      // ============================================
      socket.on('agri-chat:request-recommendations', (data: any) => {
        const { conversationId, userId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:recommendations', {
          userId,
          recommendations: [],
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 9: Document Management
      // ============================================
      socket.on('agri-chat:document-uploaded', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:document-shared', {
          ...data,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 10: Quality Assurance Feedback
      // ============================================
      socket.on('agri-chat:quality-feedback', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:quality-update', {
          ...data,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 11: Dispute Resolution
      // ============================================
      socket.on('agri-chat:dispute-initiated', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:dispute-alert', {
          ...data,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 12: Notification & Alerts
      // ============================================
      socket.on('agri-chat:notification-preference', (data: any) => {
        const { userId } = data;
        socket.join(`user-${userId}`);
      });

      // ============================================
      // SUBFEATURE 13: Reputation & Reviews
      // ============================================
      socket.on('agri-chat:review-submitted', (data: any) => {
        const { conversationId } = data;
        this.io.to(`conversation-${conversationId}`).emit('agri-chat:review-update', {
          ...data,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 14: Group Chat & Collaboration
      // ============================================
      socket.on('agri-chat:join-group', (data: any) => {
        const { groupId, userId } = data;
        socket.join(`group-${groupId}`);
        this.io.to(`group-${groupId}`).emit('agri-chat:group-member-joined', {
          userId,
          timestamp: new Date()
        });
      });

      socket.on('agri-chat:group-message', (data: any) => {
        const { groupId } = data;
        this.io.to(`group-${groupId}`).emit('agri-chat:group-message-received', {
          ...data,
          timestamp: new Date()
        });
      });

      // ============================================
      // SUBFEATURE 15: Analytics & Insights
      // ============================================
      socket.on('agri-chat:request-analytics', (data: any) => {
        const { userId } = data;
        socket.emit('agri-chat:analytics-data', {
          userId,
          analytics: {},
          timestamp: new Date()
        });
      });

      // ============================================
      // Disconnect Handler
      // ============================================
      socket.on('disconnect', () => {
        const userId = this.activeUsers.get(socket.id);
        this.activeUsers.delete(socket.id);

        // Notify all conversations
        this.conversations.forEach((users, conversationId) => {
          if (users.has(userId!)) {
            users.delete(userId!);
            this.io.to(`conversation-${conversationId}`).emit('agri-chat:user-left', {
              userId,
              timestamp: new Date(),
              activeUsers: Array.from(users)
            });
          }
        });

        console.log(`[AgriChat] User disconnected: ${socket.id}`);
      });
    });
  }

  // ============================================
  // Broadcast Methods
  // ============================================

  broadcastToConversation(conversationId: string, event: string, data: any) {
    this.io.to(`conversation-${conversationId}`).emit(event, {
      ...data,
      timestamp: new Date()
    });
  }

  broadcastToUser(userId: string, event: string, data: any) {
    this.io.to(`user-${userId}`).emit(event, {
      ...data,
      timestamp: new Date()
    });
  }

  broadcastToGroup(groupId: string, event: string, data: any) {
    this.io.to(`group-${groupId}`).emit(event, {
      ...data,
      timestamp: new Date()
    });
  }

  broadcastToAll(event: string, data: any) {
    this.io.emit(event, {
      ...data,
      timestamp: new Date()
    });
  }

  getActiveUsers(): number {
    return this.activeUsers.size;
  }

  getConversationUsers(conversationId: string): string[] {
    return Array.from(this.conversations.get(conversationId) || []);
  }
}

export const setupAgriChatSocket = (io: Server) => {
  const agriChatSocket = new AgriChatSocket();
  agriChatSocket.setServer(io);
  return agriChatSocket;
};
