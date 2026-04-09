import { Server as SocketIOServer, Socket } from 'socket.io';
import { Logger } from '../utils/logger';

const logger = new Logger('WebSocketConfig');

interface SocketUser {
  userId: string;
  socketId: string;
  connectedAt: Date;
}

class WebSocketService {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds

  /**
   * Initialize WebSocket server
   */
  initialize(httpServer: any): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.WEBSOCKET_CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
      },
      pingInterval: parseInt(process.env.WEBSOCKET_PING_INTERVAL || '25000', 10),
      pingTimeout: parseInt(process.env.WEBSOCKET_PING_TIMEOUT || '60000', 10),
    });

    this.setupEventHandlers();
    logger.info('WebSocket server initialized');

    return this.io;
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', (data: { userId: string; token: string }) => {
        this.handleUserAuthentication(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleUserDisconnection(socket);
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  private handleUserAuthentication(socket: Socket, data: { userId: string; token: string }): void {
    const { userId } = data;

    // Store user connection
    const socketUser: SocketUser = {
      userId,
      socketId: socket.id,
      connectedAt: new Date(),
    };

    this.connectedUsers.set(socket.id, socketUser);

    // Track user's sockets
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }
    this.userSockets.get(userId)!.push(socket.id);

    // Join user-specific room
    socket.join(`user:${userId}`);

    logger.info(`User ${userId} authenticated with socket ${socket.id}`);
  }

  private handleUserDisconnection(socket: Socket): void {
    const socketUser = this.connectedUsers.get(socket.id);

    if (socketUser) {
      const { userId } = socketUser;

      // Remove from connected users
      this.connectedUsers.delete(socket.id);

      // Remove from user sockets
      const userSockets = this.userSockets.get(userId) || [];
      const index = userSockets.indexOf(socket.id);
      if (index > -1) {
        userSockets.splice(index, 1);
      }

      if (userSockets.length === 0) {
        this.userSockets.delete(userId);
        logger.info(`User ${userId} disconnected`);
      }
    }

    logger.info(`Client disconnected: ${socket.id}`);
  }

  /**
   * Get WebSocket server instance
   */
  getServer(): SocketIOServer {
    if (!this.io) {
      throw new Error('WebSocket server not initialized');
    }
    return this.io;
  }

  /**
   * Emit event to specific user
   */
  emitToUser(userId: string, event: string, data: any): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit(event, data);
    logger.debug(`Event emitted to user ${userId}: ${event}`);
  }

  /**
   * Emit event to multiple users
   */
  emitToUsers(userIds: string[], event: string, data: any): void {
    userIds.forEach((userId) => this.emitToUser(userId, event, data));
  }

  /**
   * Emit event to all connected clients
   */
  emitToAll(event: string, data: any): void {
    if (!this.io) return;

    this.io.emit(event, data);
    logger.debug(`Event emitted to all clients: ${event}`);
  }

  /**
   * Emit event to specific room
   */
  emitToRoom(room: string, event: string, data: any): void {
    if (!this.io) return;

    this.io.to(room).emit(event, data);
    logger.debug(`Event emitted to room ${room}: ${event}`);
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get user's socket IDs
   */
  getUserSockets(userId: string): string[] {
    return this.userSockets.get(userId) || [];
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.length > 0;
  }

  /**
   * Get all connected users
   */
  getConnectedUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }

  /**
   * Broadcast product event
   */
  broadcastProductEvent(event: string, data: any): void {
    this.emitToAll(`product:${event}`, data);
  }

  /**
   * Broadcast order event
   */
  broadcastOrderEvent(farmerId: string, buyerId: string, event: string, data: any): void {
    this.emitToUser(farmerId, `order:${event}`, data);
    this.emitToUser(buyerId, `order:${event}`, data);
  }

  /**
   * Broadcast message event
   */
  broadcastMessageEvent(senderId: string, receiverId: string, event: string, data: any): void {
    this.emitToUser(senderId, `message:${event}`, data);
    this.emitToUser(receiverId, `message:${event}`, data);
  }

  /**
   * Broadcast payment event
   */
  broadcastPaymentEvent(farmerId: string, buyerId: string, event: string, data: any): void {
    this.emitToUser(farmerId, `payment:${event}`, data);
    this.emitToUser(buyerId, `payment:${event}`, data);
  }

  /**
   * Broadcast quality event
   */
  broadcastQualityEvent(farmerId: string, event: string, data: any): void {
    this.emitToUser(farmerId, `quality:${event}`, data);
  }

  /**
   * Broadcast notification event
   */
  broadcastNotificationEvent(userId: string, event: string, data: any): void {
    this.emitToUser(userId, `notification:${event}`, data);
  }

  /**
   * Health check
   */
  isHealthy(): boolean {
    return this.io !== null;
  }
}

export const websocketService = new WebSocketService();
