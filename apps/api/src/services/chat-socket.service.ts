/* ========================================================================
   Socket.IO Chat Events Handler
   Real-time events for WhatsApp-like chat system
   ======================================================================== */

import { Server, Socket } from 'socket.io';
import prisma from '../prisma/client';
import { ChatRoomService } from '../modules/chat-room/chat-room.service';
import { redis } from './redis.service';

export class ChatSocketHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Register all chat socket event listeners
   */
  registerChatEvents(socket: Socket) {
    console.log(`[Socket] User connected: ${socket.id}, userId: ${socket.data.userId}`);

    // Join chat room
    socket.on('join-chat-room', this.handleJoinChatRoom.bind(this, socket));

    // Leave chat room
    socket.on('leave-chat-room', this.handleLeaveChatRoom.bind(this, socket));

    // Send message
    socket.on('send-message', this.handleSendMessage.bind(this, socket));

    // Typing indicator
    socket.on('user-typing', this.handleUserTyping.bind(this, socket));
    socket.on('user-stop-typing', this.handleUserStopTyping.bind(this, socket));

    // Mark message as read
    socket.on('mark-message-seen', this.handleMarkMessageSeen.bind(this, socket));

    // Online status
    socket.on('user-online', this.handleUserOnline.bind(this, socket));
    socket.on('user-offline', this.handleUserOffline.bind(this, socket));

    // Disconnect
    socket.on('disconnect', this.handleDisconnect.bind(this, socket));
  }

  /**
   * Feature 2 & 4: Join Chat Room
   * User joins specific chat room
   */
  private async handleJoinChatRoom(
    socket: Socket,
    data: { chatRoomId: string; userId: string }
  ) {
    try {
      const { chatRoomId, userId } = data;

      // Verify user is part of chat room
      const chatRoom = await prisma.chatRoom.findUnique({
        where: { id: chatRoomId },
      });

      if (!chatRoom || (userId !== chatRoom.farmerId && userId !== chatRoom.buyerId)) {
        socket.emit('error', { message: 'Unauthorized to join this room' });
        return;
      }

      // Join room
      socket.join(chatRoomId);
      socket.join(`user:${userId}`);
      socket.data.chatRoomId = chatRoomId;

      // Update online status
      await prisma.userOnlineStatus.upsert({
        where: {
          chatRoomId_userId: {
            chatRoomId,
            userId,
          },
        },
        update: {
          isOnline: true,
          lastSeenAt: new Date(),
          socketId: socket.id,
        },
        create: {
          chatRoomId,
          userId,
          isOnline: true,
          socketId: socket.id,
        },
      });

      // Get other participant
      const otherParticipant = userId === chatRoom.farmerId ? chatRoom.buyerId : chatRoom.farmerId;

      // Notify room that user came online
      this.io.to(chatRoomId).emit('user-online', {
        userId,
        isOnline: true,
        socketId: socket.id,
        timestamp: new Date(),
      });

      // Check if other user is also online
      const otherUserStatus = await prisma.userOnlineStatus.findUnique({
        where: {
          chatRoomId_userId: {
            chatRoomId,
            userId: otherParticipant,
          },
        },
      });

      // Send user the current online status of both participants
      socket.emit('room-joined', {
        chatRoomId,
        participantsOnlineStatus: {
          [userId]: true,
          [otherParticipant]: otherUserStatus?.isOnline || false,
        },
      });

      console.log(`[Socket] User ${userId} joined room ${chatRoomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  /**
   * Leave Chat Room
   */
  private async handleLeaveChatRoom(
    socket: Socket,
    data: { chatRoomId: string; userId: string }
  ) {
    try {
      const { chatRoomId, userId } = data;

      // Update offline status
      await prisma.userOnlineStatus.update({
        where: {
          chatRoomId_userId: {
            chatRoomId,
            userId,
          },
        },
        data: {
          isOnline: false,
          lastSeenAt: new Date(),
        },
      });

      // Leave room
      socket.leave(chatRoomId);

      // Notify room that user went offline
      this.io.to(chatRoomId).emit('user-offline', {
        userId,
        isOnline: false,
        lastSeenAt: new Date(),
      });

      console.log(`[Socket] User ${userId} left room ${chatRoomId}`);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  }

  /**
   * Feature 1 & 3: Send Message
   * Real-time message delivery
   */
  private async handleSendMessage(
    socket: Socket,
    data: {
      chatRoomId: string;
      content: string;
      type?: 'text' | 'image' | 'file' | 'voice';
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    }
  ) {
    try {
      const userId = socket.data.userId;

      // Send message through service
      const message = await ChatRoomService.sendMessage({
        chatRoomId: data.chatRoomId,
        senderId: userId,
        content: data.content,
        type: data.type || 'text',
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      });

      // Stop typing indicator
      await this.stopTypingIndicator(data.chatRoomId, userId);

      // Broadcast message to room
      this.io.to(data.chatRoomId).emit('receive-message', {
        message,
        sentAt: new Date(),
      });

      // Store in Redis cache for faster retrieval
      const cacheKey = `chatroom:${data.chatRoomId}:messages`;
      await redis.lpush(cacheKey, JSON.stringify(message));

      console.log(`[Socket] Message sent in room ${data.chatRoomId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  /**
   * Feature 5: Typing Indicator
   * Show when user is typing
   */
  private async handleUserTyping(
    socket: Socket,
    data: { chatRoomId: string; userId: string }
  ) {
    try {
      const { chatRoomId, userId } = data;

      // Create/update typing indicator
      const typingRecord = await prisma.typingIndicator.create({
        data: {
          chatRoomId,
          userId,
          expiresAt:  new Date(Date.now() + 3000), // Expires after 3 seconds
        },
      });

      // Broadcast typing status
      this.io.to(chatRoomId).emit('user-typing', {
        userId,
        isTyping: true,
        timestamp: new Date(),
      });

      console.log(`[Socket] User ${userId} is typing in room ${chatRoomId}`);
    } catch (error) {
      console.error('Error handling typing:', error);
    }
  }

  /**
   * Stop typing indicator
   */
  private async handleUserStopTyping(
    socket: Socket,
    data: { chatRoomId: string; userId: string }
  ) {
    try {
      const { chatRoomId, userId } = data;
      await this.stopTypingIndicator(chatRoomId, userId);
    } catch (error) {
      console.error('Error stopping typing:', error);
    }
  }

  private async stopTypingIndicator(chatRoomId: string, userId: string) {
    // Delete typing indicator
    await prisma.typingIndicator.deleteMany({
      where: {
        chatRoomId,
        userId,
      },
    });

    // Broadcast stop typing
    this.io.to(chatRoomId).emit('user-stop-typing', {
      userId,
      isTyping: false,
    });
  }

  /**
   * Feature 6: Mark Message as Seen
   * Show blue checkmarks
   */
  private async handleMarkMessageSeen(
    socket: Socket,
    data: { messageId: string; chatRoomId: string; userId: string }
  ) {
    try {
      const { messageId, chatRoomId, userId } = data;

      // Mark seen
      const message = await ChatRoomService.markMessageAsSeen(messageId, userId);

      // Broadcast to room
      this.io.to(chatRoomId).emit('message-seen', {
        messageId,
        seenBy: userId,
        seenAt: message.seenAt,
      });

      console.log(`[Socket] Message ${messageId} marked as seen by ${userId}`);
    } catch (error) {
      console.error('Error marking message seen:', error);
    }
  }

  /**
   * Feature 4: User Online Status
   */
  private async handleUserOnline(
    socket: Socket,
    data: { chatRoomId: string; userId: string }
  ) {
    try {
      const { chatRoomId, userId } = data;

      await prisma.userOnlineStatus.upsert({
        where: {
          chatRoomId_userId: {
            chatRoomId,
            userId,
          },
        },
        update: {
          isOnline: true,
          lastSeenAt: new Date(),
          socketId: socket.id,
        },
        create: {
          chatRoomId,
          userId,
          isOnline: true,
          socketId: socket.id,
        },
      });

      // Cache online status
      await redis.hset(
        `online:${chatRoomId}`,
        userId,
        JSON.stringify({
          isOnline: true,
          socketId: socket.id,
          timestamp: new Date(),
        })
      );

      this.io.to(chatRoomId).emit('user-online', {
        userId,
        isOnline: true,
        timestamp: new Date(),
      });

      console.log(`[Socket] User ${userId} is online in room ${chatRoomId}`);
    } catch (error) {
      console.error('Error handling user online:', error);
    }
  }

  /**
   * User Offline
   */
  private async handleUserOffline(
    socket: Socket,
    data: { chatRoomId: string; userId: string }
  ) {
    try {
      const { chatRoomId, userId } = data;

      const now = new Date();

      await prisma.userOnlineStatus.update({
        where: {
          chatRoomId_userId: {
            chatRoomId,
            userId,
          },
        },
        data: {
          isOnline: false,
          lastSeenAt: now,
        },
      });

      // Cache offline status
      await redis.hset(
        `online:${chatRoomId}`,
        userId,
        JSON.stringify({
          isOnline: false,
          lastSeenAt: now,
        })
      );

      this.io.to(chatRoomId).emit('user-offline', {
        userId,
        isOnline: false,
        lastSeenAt: now,
      });

      console.log(`[Socket] User ${userId} is offline in room ${chatRoomId}`);
    } catch (error) {
      console.error('Error handling user offline:', error);
    }
  }

  /**
   * Handle Disconnect
   */
  private async handleDisconnect(socket: Socket) {
    try {
      const userId = socket.data.userId;
      const chatRoomId = socket.data.chatRoomId;

      if (chatRoomId && userId) {
        // Set user offline
        await prisma.userOnlineStatus.update({
          where: {
            chatRoomId_userId: {
              chatRoomId,
              userId,
            },
          },
          data: {
            isOnline: false,
            lastSeenAt: new Date(),
            socketId: null,
          },
        }).catch(() => {}); // Ignore if not found

        // Notify room
        this.io.to(chatRoomId).emit('user-offline', {
          userId,
          isOnline: false,
          lastSeenAt: new Date(),
        });
      }

      console.log(`[Socket] User ${userId} disconnected: ${socket.id}`);
    } catch (error) {
      console.error('Error on disconnect:', error);
    }
  }

  /**
   * Emit message to specific room
   */
  emitToRoom(roomId: string, event: string, data: any) {
    this.io.to(roomId).emit(event, data);
  }

  /**
   * Emit message to specific user
   */
  emitToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data);
  }
}
