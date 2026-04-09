import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, Socket> = new Map();
  private userRooms: Map<string, Set<string>> = new Map();
  private eventQueue: Map<string, any[]> = new Map();

  // 4.1.1 & 4.1.3 - Connection with JWT authentication
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      const userId = decoded.userId || decoded.id;

      client.data.userId = userId;
      client.data.userRole = decoded.role;

      // 4.1.4 - User room management
      this.connectedUsers.set(userId, client);
      client.join(`user:${userId}`);
      client.join(`role:${decoded.role}`);

      // 4.1.6 - Connection status tracking
      this.server.emit('connection:status', {
        userId,
        status: 'connected',
        timestamp: new Date(),
      });

      // 4.4.4 - User online event
      this.server.emit('user:online', {
        userId,
        timestamp: new Date(),
      });

      // 4.1.7 - Process queued events
      this.processQueuedEvents(userId);

      console.log(`User ${userId} connected`);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  // 4.1.5 - Handle disconnection
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    
    if (userId) {
      this.connectedUsers.delete(userId);
      
      // 4.4.5 - User offline event
      this.server.emit('user:offline', {
        userId,
        timestamp: new Date(),
      });

      console.log(`User ${userId} disconnected`);
    }
  }

  // 4.2.1 - Product created event
  emitProductCreated(product: any) {
    this.server.to('role:buyer').emit('product:created', {
      product,
      timestamp: new Date(),
    });
  }

  // 4.2.2 - Product updated event
  emitProductUpdated(product: any) {
    this.server.emit('product:updated', {
      product,
      timestamp: new Date(),
    });
  }

  // 4.2.3 - Product deleted event
  emitProductDeleted(productId: string) {
    this.server.emit('product:deleted', {
      productId,
      timestamp: new Date(),
    });
  }

  // 4.2.4 - Price updated event
  emitPriceUpdated(productId: string, newPrice: number, oldPrice: number) {
    this.server.emit('price:updated', {
      productId,
      newPrice,
      oldPrice,
      timestamp: new Date(),
    });
  }

  // 4.3.1 - Order new event
  emitOrderNew(order: any) {
    const farmerId = order.farmerId;
    const buyerId = order.buyerId;

    this.server.to(`user:${farmerId}`).emit('order:new', {
      order,
      timestamp: new Date(),
    });

    this.server.to(`user:${buyerId}`).emit('order:new', {
      order,
      timestamp: new Date(),
    });
  }

  // 4.3.2 - Order status updated event
  emitOrderStatusUpdated(orderId: string, status: string, userId: string) {
    this.server.to(`user:${userId}`).emit('order:status:updated', {
      orderId,
      status,
      timestamp: new Date(),
    });
  }

  // 4.3.3 - Order location updated event
  emitOrderLocationUpdated(orderId: string, location: any, userId: string) {
    this.server.to(`user:${userId}`).emit('order:location:updated', {
      orderId,
      location,
      timestamp: new Date(),
    });
  }

  // 4.3.4 - Order cancelled event
  emitOrderCancelled(orderId: string, userId: string, reason: string) {
    this.server.to(`user:${userId}`).emit('order:cancelled', {
      orderId,
      reason,
      timestamp: new Date(),
    });
  }

  // 4.4.1 - Message new event
  emitMessageNew(message: any, recipientId: string) {
    this.server.to(`user:${recipientId}`).emit('message:new', {
      message,
      timestamp: new Date(),
    });
  }

  // 4.4.2 - Typing indicator event
  @SubscribeMessage('message:typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const userId = client.data.userId;
    this.server.to(`user:${data.recipientId}`).emit('message:typing', {
      userId,
      conversationId: data.conversationId,
      isTyping: data.isTyping,
    });
  }

  // 4.4.3 - Message read event
  emitMessageRead(messageId: string, userId: string) {
    this.server.to(`user:${userId}`).emit('message:read', {
      messageId,
      timestamp: new Date(),
    });
  }

  // 4.5.1 - Payment initiated event
  emitPaymentInitiated(payment: any, userId: string) {
    this.server.to(`user:${userId}`).emit('payment:initiated', {
      payment,
      timestamp: new Date(),
    });
  }

  // 4.5.2 - Payment success event
  emitPaymentSuccess(payment: any, userId: string) {
    this.server.to(`user:${userId}`).emit('payment:success', {
      payment,
      timestamp: new Date(),
    });
  }

  // 4.5.3 - Payment failed event
  emitPaymentFailed(payment: any, userId: string, reason: string) {
    this.server.to(`user:${userId}`).emit('payment:failed', {
      payment,
      reason,
      timestamp: new Date(),
    });
  }

  // 4.5.4 - Invoice generated event
  emitInvoiceGenerated(invoice: any, userId: string) {
    this.server.to(`user:${userId}`).emit('invoice:generated', {
      invoice,
      timestamp: new Date(),
    });
  }

  // 4.6.1 - Quality scan started event
  emitQualityScanStarted(scanId: string, userId: string) {
    this.server.to(`user:${userId}`).emit('quality:scan:started', {
      scanId,
      timestamp: new Date(),
    });
  }

  // 4.6.2 - Quality scan complete event
  emitQualityScanComplete(scan: any, userId: string) {
    this.server.to(`user:${userId}`).emit('quality:scan:complete', {
      scan,
      timestamp: new Date(),
    });
  }

  // 4.6.3 - Quality certificate generated event
  emitQualityCertificateGenerated(certificate: any, userId: string) {
    this.server.to(`user:${userId}`).emit('quality:certificate:generated', {
      certificate,
      timestamp: new Date(),
    });
  }

  // 4.7.1 - Notification new event
  emitNotificationNew(notification: any, userId: string) {
    this.server.to(`user:${userId}`).emit('notification:new', {
      notification,
      timestamp: new Date(),
    });
  }

  // 4.7.2 - Notification read event
  emitNotificationRead(notificationId: string, userId: string) {
    this.server.to(`user:${userId}`).emit('notification:read', {
      notificationId,
      timestamp: new Date(),
    });
  }

  // 4.1.7 - Event queuing during disconnection
  private queueEvent(userId: string, event: any) {
    if (!this.eventQueue.has(userId)) {
      this.eventQueue.set(userId, []);
    }
    this.eventQueue.get(userId)!.push(event);
  }

  private processQueuedEvents(userId: string) {
    const queue = this.eventQueue.get(userId);
    if (queue && queue.length > 0) {
      const socket = this.connectedUsers.get(userId);
      if (socket) {
        queue.forEach((event) => {
          socket.emit(event.type, event.data);
        });
        this.eventQueue.delete(userId);
      }
    }
  }

  // Utility method to emit to specific user
  emitToUser(userId: string, event: string, data: any) {
    const socket = this.connectedUsers.get(userId);
    if (socket) {
      socket.emit(event, data);
    } else {
      // Queue event if user is offline
      this.queueEvent(userId, { type: event, data });
    }
  }

  // Get connection status
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }
}
