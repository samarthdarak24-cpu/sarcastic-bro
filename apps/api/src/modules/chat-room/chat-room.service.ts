/* ========================================================================
   ChatRoom Service — WhatsApp-like Chat System
   Real-time messaging, status tracking, file uploads, search
   ======================================================================== */

import prisma from "../../prisma/client";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";

export class ChatRoomService {
  /**
   * Create or get ChatRoom for an Order
   * Automatically called when order is placed
   */
  static async getOrCreateChatRoom(orderId: string) {
    try {
      // Check if chat room already exists
      let chatRoom = await prisma.chatRoom.findUnique({
        where: { orderId },
        include: {
          farmer: { select: { id: true, name: true, avatarUrl: true } },
          buyer: { select: { id: true, name: true, avatarUrl: true } },
          order: true,
        },
      });

      if (chatRoom) return chatRoom;

      // Fetch order details
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          product: true,
          farmer: true,
          buyer: true,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // Create new chat room
      chatRoom = await prisma.chatRoom.create({
        data: {
          orderId,
          farmerId: order.farmerId,
          buyerId: order.buyerId,
          productName: order.product.name,
          orderAmount: order.totalPrice,
        },
        include: {
          farmer: { select: { id: true, name: true, avatarUrl: true } },
          buyer: { select: { id: true, name: true, avatarUrl: true } },
          order: true,
        },
      });

      return chatRoom;
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }
  }

  /**
   * Send Message (Feature 1 & 3: Real-time messaging with multiple message types)
   */
  static async sendMessage(data: {
    chatRoomId: string;
    senderId: string;
    content: string;
    type?: 'text' | 'image' | 'file' | 'voice';
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  }) {
    try {
      // Validate sender is part of chat room
      const chatRoom = await prisma.chatRoom.findUnique({
        where: { id: data.chatRoomId },
      });

      if (!chatRoom) {
        throw new Error("Chat room not found");
      }

      if (
        data.senderId !== chatRoom.farmerId &&
        data.senderId !== chatRoom.buyerId
      ) {
        throw new Error("Unauthorized: User not part of this chat");
      }

      // Create message
      const message = await prisma.chatRoomMessage.create({
        data: {
          chatRoomId: data.chatRoomId,
          senderId: data.senderId,
          content: data.content,
          type: data.type || 'text',
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          status: 'SENT',
          sentAt: new Date(),
        },
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
        },
      });

      // Update chat room last message
      await prisma.chatRoom.update({
        where: { id: data.chatRoomId },
        data: {
          lastMessageAt: new Date(),
          lastMessageBy: data.senderId,
        },
      });

      // Create search index for full-text search
      const searchableText = `${message.content} ${data.fileName || ''} `.toLowerCase();
      await prisma.messageSearchIndex.create({
        data: {
          messageId: message.id,
          chatRoomId: data.chatRoomId,
          searchableText,
        },
      }).catch(() => {}); // Ignore if feature not available

      // Cache message in Redis for faster retrieval
      const cacheKey = `chatroom:${data.chatRoomId}:messages`;
      await redis.lpush(cacheKey, JSON.stringify(message));
      await redis.expire(cacheKey, 3600); // Cache for 1 hour

      // Emit socket event for real-time delivery
      const socketService = getSocketService();
      socketService?.emitToRoom(data.chatRoomId, 'receive_message', {
        message,
        deliveredAt: new Date(),
      });

      return message;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Mark Message as Delivered (Feature 6: Message status tracking)
   */
  static async markMessageAsDelivered(messageId: string) {
    try {
      const message = await prisma.chatRoomMessage.update({
        where: { id: messageId },
        data: {
          status: 'DELIVERED',
          deliveredAt: new Date(),
        },
        include: {
          chatRoom: true,
          sender: { select: { id: true } },
        },
      });

      // Notify sender via socket
      const socketService = getSocketService();
      socketService?.emitToUser(message.sender.id, 'message_delivered', {
        messageId,
        deliveredAt: message.deliveredAt,
      });

      return message;
    } catch (error) {
      console.error("Error marking message as delivered:", error);
      throw error;
    }
  }

  /**
   * Mark Message as Seen (Feature 6 & Blue checkmark)
   */
  static async markMessageAsSeen(messageId: string, userId: string) {
    try {
      const message = await prisma.chatRoomMessage.findUnique({
        where: { id: messageId },
        include: { chatRoom: true, sender: { select: { id: true } } },
      });

      if (!message) {
        throw new Error("Message not found");
      }

      // Update message status
      const updatedMessage = await prisma.chatRoomMessage.update({
        where: { id: messageId },
        data: {
          status: 'SEEN',
          seenAt: new Date(),
        },
      });

      // Emit to sender about message being seen
      const socketService = getSocketService();
      socketService?.emitToUser(message.sender.id, 'message_seen', {
        messageId,
        seenAt: updatedMessage.seenAt,
        seenBy: userId,
      });

      return updatedMessage;
    } catch (error) {
      console.error("Error marking message as seen:", error);
      throw error;
    }
  }

  /**
   * Get Chat Messages with Pagination (Feature 8: Chat history)
   */
  static async getMessages(
    chatRoomId: string,
    page: number = 1,
    limit: number = 50
  ) {
    try {
      const skip = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        prisma.chatRoomMessage.findMany({
          where: { chatRoomId },
          include: {
            sender: { select: { id: true, name: true, avatarUrl: true } },
            reactions: {
              include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.chatRoomMessage.count({ where: { chatRoomId } }),
      ]);

      return {
        messages: messages.reverse(), // Reverse to get chronological order
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  }

  /**
   * Search Messages (Feature 9: Search functionality)
   */
  static async searchMessages(
    chatRoomId: string,
    searchQuery: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const skip = (page - 1) * limit;
      const searchLower = searchQuery.toLowerCase();

      const messages = await prisma.chatRoomMessage.findMany({
        where: {
          chatRoomId,
          OR: [
            { content: { contains: searchQuery } },
            { fileName: { contains: searchQuery } },
          ],
        },
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.chatRoomMessage.count({
        where: {
          chatRoomId,
          OR: [
            { content: { contains: searchQuery } },
            { fileName: { contains: searchQuery } },
          ],
        },
      });

      return {
        messages: messages.reverse(),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error searching messages:", error);
      throw error;
    }
  }

  /**
   * Get User's Chat Rooms (Inbox)
   */
  static async getUserChatRooms(userId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const [chatRooms, total] = await Promise.all([
        prisma.chatRoom.findMany({
          where: {
            OR: [{ farmerId: userId }, { buyerId: userId }],
            status: 'ACTIVE',
          },
          include: {
            farmer: { select: { id: true, name: true, avatarUrl: true } },
            buyer: { select: { id: true, name: true, avatarUrl: true } },
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              include: {
                sender: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { lastMessageAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.chatRoom.count({
          where: {
            OR: [{ farmerId: userId }, { buyerId: userId }],
            status: 'ACTIVE',
          },
        }),
      ]);

      return {
        chatRooms,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error getting user chat rooms:", error);
      throw error;
    }
  }

  /**
   * Delete Message (Bonus feature)
   */
  static async deleteMessage(messageId: string, userId: string) {
    try {
      const message = await prisma.chatRoomMessage.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        throw new Error("Message not found");
      }

      if (message.senderId !== userId) {
        throw new Error("Unauthorized: Can only delete your own messages");
      }

      const deletedMessage = await prisma.chatRoomMessage.update({
        where: { id: messageId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          content: '[Message deleted]',
        },
      });

      // Notify chat room
      const socketService = getSocketService();
      socketService?.emitToRoom(
        message.chatRoomId,
        'message_deleted',
        { messageId }
      );

      return deletedMessage;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }

  /**
   * Edit Message (Bonus feature)
   */
  static async editMessage(
    messageId: string,
    userId: string,
    newContent: string
  ) {
    try {
      const message = await prisma.chatRoomMessage.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        throw new Error("Message not found");
      }

      if (message.senderId !== userId) {
        throw new Error("Unauthorized: Can only edit your own messages");
      }

      const editedMessage = await prisma.chatRoomMessage.update({
        where: { id: messageId },
        data: {
          content: newContent,
          isEdited: true,
          editedAt: new Date(),
        },
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
        },
      });

      // Notify chat room
      const socketService = getSocketService();
      socketService?.emitToRoom(
        message.chatRoomId,
        'message_edited',
        editedMessage
      );

      return editedMessage;
    } catch (error) {
      console.error("Error editing message:", error);
      throw error;
    }
  }

  /**
   * Add Reaction to Message (Bonus feature)
   */
  static async addMessageReaction(
    messageId: string,
    userId: string,
    emoji: string
  ) {
    try {
      // Check if reaction already exists
      const existingReaction = await prisma.messageReaction.findUnique({
        where: {
          messageId_userId_emoji: {
            messageId,
            userId,
            emoji,
          },
        },
      });

      if (existingReaction) {
        // Remove reaction if it exists (toggle)
        await prisma.messageReaction.delete({
          where: {
            messageId_userId_emoji: {
              messageId,
              userId,
              emoji,
            },
          },
        });
      } else {
        // Add new reaction
        await prisma.messageReaction.create({
          data: {
            messageId,
            userId,
            emoji,
          },
        });
      }

      // Get updated message with reactions
      const message = await prisma.chatRoomMessage.findUnique({
        where: { id: messageId },
        include: {
          reactions: {
            include: {
              user: { select: { id: true, name: true } },
            },
          },
        },
      });

      // Notify chat room
      const socketService = getSocketService();
      socketService?.emitToRoom(
        message?.chatRoomId || '',
        'message_reaction_updated',
        { messageId, reactions: message?.reactions }
      );

      return message;
    } catch (error) {
      console.error("Error adding reaction:", error);
      throw error;
    }
  }

  /**
   * Archive Chat Room
   */
  static async archiveChatRoom(chatRoomId: string, userId: string) {
    try {
      const chatRoom = await prisma.chatRoom.findUnique({
        where: { id: chatRoomId },
      });

      if (!chatRoom) {
        throw new Error("Chat room not found");
      }

      if (
        userId !== chatRoom.farmerId &&
        userId !== chatRoom.buyerId
      ) {
        throw new Error("Unauthorized");
      }

      const archived = await prisma.chatRoom.update({
        where: { id: chatRoomId },
        data: { status: 'ARCHIVED' },
      });

      return archived;
    } catch (error) {
      console.error("Error archiving chat room:", error);
      throw error;
    }
  }
}
