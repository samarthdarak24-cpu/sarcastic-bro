/* ========================================================================
   Socket.IO Real-Time Service — ODOP Connect Platform
   Production-ready event handlers, room management, and authentication
   ======================================================================== */

import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "./env";
import prisma from "../prisma/client";
import { ChatSocketHandler } from "../services/chat-socket.service";

// ─── Types & Interfaces ────────────────────────────────────────────────

export interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      userId: string;
      email: string;
      role: string;
      iat?: number;
    };
    isAuthenticated?: boolean;
    connected?: boolean;
  };
}

export interface EventRateLimit {
  count: number;
  resetAt: number;
}

// ─── Global Socket Instance ────────────────────────────────────────────

export let io: Server;

// ─── Rate Limiting Setup ────────────────────────────────────────────────

const rateLimits = new Map<string, Map<string, EventRateLimit>>();
const MAX_EVENTS_PER_MINUTE = 60;
const MAX_EVENTS_PER_HOUR = 1000;

function checkRateLimit(userId: string, eventType: string): boolean {
  if (!rateLimits.has(userId)) {
    rateLimits.set(userId, new Map());
  }

  const userLimits = rateLimits.get(userId)!;
  const now = Date.now();

  if (!userLimits.has(eventType)) {
    userLimits.set(eventType, { count: 1, resetAt: now + 60000 });
    return true;
  }

  const limit = userLimits.get(eventType)!;

  if (now > limit.resetAt) {
    userLimits.set(eventType, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (limit.count >= MAX_EVENTS_PER_MINUTE) {
    console.warn(`[RateLimit] User ${userId} exceeded rate limit for ${eventType}`);
    return false;
  }

  limit.count++;
  return true;
}

// ─── Connection Tracking ────────────────────────────────────────────────

const userConnections = new Map<string, Set<string>>(); // userId -> Set of socketIds
const socketUserMap = new Map<string, string>(); // socketId -> userId

function addUserConnection(userId: string, socketId: string): void {
  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set());
  }
  userConnections.get(userId)!.add(socketId);
  socketUserMap.set(socketId, userId);

  socketUserMap.set(socketId, userId);
}

function removeUserConnection(socketId: string): string | null {
  const userId = socketUserMap.get(socketId);
  if (userId) {
    const connections = userConnections.get(userId);
    if (connections) {
      connections.delete(socketId);
      if (connections.size === 0) {
        userConnections.delete(userId);
      }
    }
  }
  socketUserMap.delete(socketId);
  return userId || null;
}

// ─── Socket Service ────────────────────────────────────────────────────

export class SocketService {
  /**
   * Initialize Socket.IO server with authentication, events, and middleware
   */
  public static initialize(server: HttpServer): void {
    io = new Server(server, {
      cors: {
        origin: env.CORS_ORIGINS,
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
      maxHttpBufferSize: 1e6, // 1MB
      pingInterval: 25000,
      pingTimeout: 60000,
    });

    // ─── Authentication Middleware ──────────────────────────────────────

    io.use((socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
        socket.data.user = {
          userId: decoded.userId || decoded.id,
          email: decoded.email,
          role: decoded.role || "user",
          iat: decoded.iat,
        };
        socket.data.isAuthenticated = true;
        next();
      } catch (err: any) {
        console.error("[Auth] Socket authentication failed:", err.message);
        next(new Error("Authentication error: Invalid token"));
      }
    });

    // ─── Connection Handler ────────────────────────────────────────────

    io.on("connection", (socket: AuthenticatedSocket) => {
      const userId = socket.data.user.userId;
      const socketId = socket.id;

      // Track connection
      addUserConnection(userId, socketId);
      socket.data.connected = true;

      console.log(`[Socket] ✓ User ${userId} connected (${socketId})`);

      // ─── Auto-join user-specific rooms ─────────────────────────────────

      // Personal notification room
      socket.join(`notifications:${userId}`);

      // User presence room (for online status)
      socket.join(`presence:${userId}`);

      // Emit online status to all connected clients
      io.emit("user:online", {
        userId,
        timestamp: new Date(),
      });

      // ─── Chat Room Socket Events (WhatsApp-like System) ──────────────────

      const chatSocketHandler = new ChatSocketHandler(io);
      chatSocketHandler.registerChatEvents(socket);

      // ─── Message Events ────────────────────────────────────────────────

      socket.on("message:send", (data: any, callback?: Function) => {
        if (!checkRateLimit(userId, "message:send")) {
          if (callback) callback({ error: "Rate limited" });
          return;
        }

        try {
          const {
            conversationId,
            receiverId,
            content,
            type = "text",
            messageId,
          } = data;

          if (!content || content.trim().length === 0) {
            if (callback) callback({ error: "Message cannot be empty" });
            return;
          }

          if (!conversationId || !receiverId) {
            if (callback) callback({ error: "Missing required fields" });
            return;
          }

          // Join conversation room
          socket.join(`conversation:${conversationId}`);

          // Broadcast to conversation room
          io.to(`conversation:${conversationId}`).emit("message:new", {
            conversationId,
            senderId: userId,
            senderName: socket.data.user.email,
            content,
            type,
            messageId,
            timestamp: new Date(),
            isRead: false,
          });

          // Also notify receiver specifically
          io.to(`notifications:${receiverId}`).emit("message:received", {
            conversationId,
            senderId: userId,
            messageId,
            timestamp: new Date(),
          });

          if (callback) callback({ success: true, messageId });
        } catch (err: any) {
          console.error("[Socket] message:send error:", err);
          if (callback) callback({ error: err.message });
        }
      });

      socket.on("message:read", (data: any, callback?: Function) => {
        if (!checkRateLimit(userId, "message:read")) {
          if (callback) callback({ error: "Rate limited" });
          return;
        }

        try {
          const { messageId, conversationId } = data;

          io.to(`conversation:${conversationId}`).emit("message:read", {
            messageId,
            userId,
            readAt: new Date(),
          });

          if (callback) callback({ success: true });
        } catch (err: any) {
          console.error("[Socket] message:read error:", err);
          if (callback) callback({ error: err.message });
        }
      });

      socket.on(
        "message:typing",
        (data: any, callback?: Function) => {
          if (!checkRateLimit(userId, "message:typing")) return;

          try {
            const { conversationId, isTyping } = data;
            io.to(`conversation:${conversationId}`).emit("user:typing", {
              conversationId,
              userId,
              isTyping,
              timestamp: new Date(),
            });
            if (callback) callback({ success: true });
          } catch (err: any) {
            console.error("[Socket] message:typing error:", err);
          }
        }
      );

      // ─── Order Events ──────────────────────────────────────────────────

      socket.on("order:join", (data: any) => {
        try {
          const { orderId } = data;
          if (orderId) {
            socket.join(`order:${orderId}`);
            console.log(`[Socket] User ${userId} joined room order:${orderId}`);
          }
        } catch (err: any) {
          console.error("[Socket] order:join error:", err);
        }
      });

      socket.on("order:status:subscribe", (data: any) => {
        try {
          const { orderId } = data;
          if (orderId) {
            socket.join(`order:${orderId}`);
          }
        } catch (err: any) {
          console.error("[Socket] order:status:subscribe error:", err);
        }
      });

      // ─── Conversation Events ────────────────────────────────────────────

      socket.on("conversation:join", (data: any) => {
        try {
          const { conversationId } = data;
          if (conversationId) {
            socket.join(`conversation:${conversationId}`);
            console.log(
              `[Socket] User ${userId} joined conversation:${conversationId}`
            );

            // Notify others in conversation that user is online
            io.to(`conversation:${conversationId}`).emit(
              "conversation:user:online",
              {
                conversationId,
                userId,
                timestamp: new Date(),
              }
            );
          }
        } catch (err: any) {
          console.error("[Socket] conversation:join error:", err);
        }
      });

      socket.on("conversation:leave", (data: any) => {
        try {
          const { conversationId } = data;
          if (conversationId) {
            socket.leave(`conversation:${conversationId}`);
            console.log(
              `[Socket] User ${userId} left conversation:${conversationId}`
            );
          }
        } catch (err: any) {
          console.error("[Socket] conversation:leave error:", err);
        }
      });

      // ─── Proposal Events ────────────────────────────────────────────────

      socket.on("proposal:subscribe", (data: any) => {
        try {
          const { proposalId } = data;
          if (proposalId) {
            socket.join(`proposal:${proposalId}`);
          }
        } catch (err: any) {
          console.error("[Socket] proposal:subscribe error:", err);
        }
      });

      // ─── Notification Events ────────────────────────────────────────────

      socket.on("notification:read", (data: any, callback?: Function) => {
        if (!checkRateLimit(userId, "notification:read")) return;

        try {
          const { notificationId } = data;
          io.to(`notifications:${userId}`).emit("notification:read", {
            notificationId,
            userId,
            readAt: new Date(),
          });
          if (callback) callback({ success: true });
        } catch (err: any) {
          console.error("[Socket] notification:read error:", err);
        }
      });

      socket.on("notification:delete", (data: any, callback?: Function) => {
        try {
          const { notificationId } = data;
          socket.emit("notification:deleted", {
            notificationId,
          });
          if (callback) callback({ success: true });
        } catch (err: any) {
          console.error("[Socket] notification:delete error:", err);
        }
      });

      // ─── Ping/Pong for Connection Keep-Alive ────────────────────────────

      socket.on("ping", (callback?: Function) => {
        if (callback) callback({ pong: true, timestamp: new Date() });
      });

      // ─── Disconnect Handler ─────────────────────────────────────────────

      socket.on("disconnect", (reason: string) => {
        const disconnectedUserId = removeUserConnection(socketId);
        socket.data.connected = false;

        console.log(
          `[Socket] User ${disconnectedUserId} disconnected (${socketId}) - Reason: ${reason}`
        );

        // Check if user has other active connections
        const remainingConnections = userConnections.get(disconnectedUserId || userId);
        if (!remainingConnections || remainingConnections.size === 0) {
          // User is fully offline
          io.emit("user:offline", {
            userId: disconnectedUserId || userId,
            timestamp: new Date(),
            reason,
          });
        }
      });

      // ─── Error Handler ──────────────────────────────────────────────────

      socket.on("error", (error: any) => {
        console.error(`[Socket] Error from user ${userId}:`, error);
      });
    });

    console.log("[Socket] ✓ Socket.IO server initialized");
  }

  /**
   * Emit event to specific user across all their connections
   */
  public static emitToUser(
    userId: string,
    event: string,
    payload: any
  ): void {
    if (io) {
      io.to(`notifications:${userId}`).emit(event, payload);
    }
  }

  /**
   * Emit event to specific room
   */
  public static emitToRoom(
    roomName: string,
    event: string,
    payload: any
  ): void {
    if (io) {
      io.to(roomName).emit(event, payload);
    }
  }

  /**
   * Broadcast event to all connected clients
   */
  public static emitToAll(event: string, payload: any): void {
    if (io) {
      io.emit(event, payload);
    }
  }

  /**
   * Get count of connected users
   */
  public static getConnectedUsersCount(): number {
    return userConnections.size;
  }

  /**
   * Get connected sockets for a user
   */
  public static getUserSockets(userId: string): Set<string> | null {
    return userConnections.get(userId) || null;
  }

  /**
   * Get user ID from socket ID
   */
  public static getUserIdFromSocket(socketId: string): string | null {
    return socketUserMap.get(socketId) || null;
  }

  /**
   * Check if user is online
   */
  public static isUserOnline(userId: string): boolean {
    const sockets = userConnections.get(userId);
    return sockets !== undefined && sockets.size > 0;
  }

  /**
   * Get all online users
   */
  public static getOnlineUsers(): string[] {
    return Array.from(userConnections.keys());
  }

  /**
   * Disconnect a specific socket (admin/moderation)
   */
  public static disconnectSocket(socketId: string, reason?: string): void {
    const socket = io?.sockets?.sockets?.get(socketId);
    if (socket) {
      socket.disconnect(true);
      console.log(`[Socket] Force disconnected ${socketId} - Reason: ${reason}`);
    }
  }

  /**
   * Disconnect all sockets for a user
   */
  public static disconnectUser(userId: string, reason?: string): void {
    const sockets = userConnections.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        const socket = io?.sockets?.sockets?.get(socketId);
        if (socket) {
          socket.disconnect(true);
        }
      });
      console.log(
        `[Socket] Force disconnected user ${userId} - Reason: ${reason}`
      );
    }
  }

  /**
   * Get socket server instance (for advanced usage)
   */
  public static getIO(): Server {
    return io;
  }
}

export default SocketService;
