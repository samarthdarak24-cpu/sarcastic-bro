/* ========================================================================
   Message Service — Real-time Chat and Messaging
   Manages conversations, messages, and real-time communication
   ======================================================================== */

import prisma from "../../prisma/client";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";

export class MessageService {
  /**
   * Send a message
   * Enhanced with Socket.IO real-time delivery
   */
  static async sendMessage(data: {
    senderId: string;
    receiverId: string;
    content: string;
    type?: 'text' | 'image' | 'voice';
    fileUrl?: string;
  }) {
    try {
      // Find or create conversation
      let conversation = await prisma.chatConversation.findFirst({
        where: {
          OR: [
            { user1Id: data.senderId, user2Id: data.receiverId },
            { user1Id: data.receiverId, user2Id: data.senderId },
          ],
        },
      });

      if (!conversation) {
        conversation = await prisma.chatConversation.create({
          data: {
            user1Id: data.senderId,
            user2Id: data.receiverId,
          },
        });
      }

      // Create message
      const message = await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          senderId: data.senderId,
          content: data.content,
          type: data.type || 'text',
          fileUrl: data.fileUrl,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Update conversation last message time
      await prisma.chatConversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });

      // Invalidate cache
      await redis.delPattern(`messages:conversation:${conversation.id}*`);
      await redis.delPattern(`messages:conversations:${data.senderId}`);
      await redis.delPattern(`messages:conversations:${data.receiverId}`);

      // Emit Socket.IO event to receiver
      try {
        const socketService = getSocketService();
        socketService.emitNewMessage(data.receiverId, {
          messageId: message.id,
          senderId: data.senderId,
          senderName: message.sender.name,
          content: data.content,
          conversationId: conversation.id,
        });
      } catch (socketError) {
        console.error('[Message] Socket.IO emission failed:', socketError);
      }

      return message;
    } catch (error: any) {
      console.error('[Message] Send message failed:', error.message);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  /**
   * Get conversations for a user
   * Enhanced with Redis caching (3 min TTL)
   */
  static async getConversations(userId: string) {
    try {
      // Try cache first
      const cacheKey = `messages:conversations:${userId}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Message] Conversations cache hit for user ${userId}`);
        return cached;
      }

      const conversations = await prisma.chatConversation.findMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        include: {
          user1: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          user2: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              content: true,
              createdAt: true,
              isRead: true,
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });

      // Format conversations
      const formatted = conversations.map((conv: any) => {
        const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
        const lastMessage = conv.messages[0];

        return {
          conversationId: conv.id,
          otherUser,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                isRead: lastMessage.isRead,
              }
            : null,
          lastMessageAt: conv.lastMessageAt,
        };
      });

      // Cache for 3 minutes
      await redis.set(cacheKey, formatted, 180);

      return formatted;
    } catch (error: any) {
      console.error('[Message] Get conversations failed:', error.message);
      throw new Error(`Failed to get conversations: ${error.message}`);
    }
  }

  /**
   * Get messages in a conversation
   * Enhanced with Redis caching (2 min TTL)
   */
  static async getConversationMessages(userId: string, otherUserId: string, limit: number = 50) {
    try {
      // Try cache first
      const cacheKey = `messages:conversation:${userId}:${otherUserId}:${limit}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Message] Conversation messages cache hit`);
        return cached;
      }

      // Find conversation
      const conversation = await prisma.chatConversation.findFirst({
        where: {
          OR: [
            { user1Id: userId, user2Id: otherUserId },
            { user1Id: otherUserId, user2Id: userId },
          ],
        },
      });

      if (!conversation) {
        return [];
      }

      const messages = await prisma.chatMessage.findMany({
        where: { conversationId: conversation.id },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      // Cache for 2 minutes
      await redis.set(cacheKey, messages, 120);

      return messages.reverse();
    } catch (error: any) {
      console.error('[Message] Get conversation messages failed:', error.message);
      throw new Error(`Failed to get conversation messages: ${error.message}`);
    }
  }

  /**
   * Mark message as read
   */
  static async markAsRead(messageId: string, userId: string) {
    try {
      // Verify user is the receiver
      const message = await prisma.chatMessage.findUnique({
        where: { id: messageId },
        include: {
          conversation: true,
        },
      });

      if (!message) {
        throw new Error('Message not found');
      }

      const isReceiver =
        (message.conversation.user1Id === userId && message.senderId !== userId) ||
        (message.conversation.user2Id === userId && message.senderId !== userId);

      if (!isReceiver) {
        throw new Error('Unauthorized: You can only mark received messages as read');
      }

      await prisma.chatMessage.update({
        where: { id: messageId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      // Invalidate cache
      await redis.delPattern(`messages:conversation:${message.conversationId}*`);

      return { success: true, message: 'Message marked as read' };
    } catch (error: any) {
      console.error('[Message] Mark as read failed:', error.message);
      throw new Error(`Failed to mark message as read: ${error.message}`);
    }
  }

  /**
   * Emit typing indicator
   */
  static emitTyping(conversationId: string, userId: string, userName: string, isTyping: boolean) {
    try {
      const socketService = getSocketService();
      socketService.emitTyping(conversationId, {
        userId,
        userName,
        isTyping,
      });
    } catch (error: any) {
      console.error('[Message] Emit typing failed:', error.message);
    }
  }

  /**
   * Get unread message count
   */
  static async getUnreadCount(userId: string) {
    try {
      // Get all conversations for user
      const conversations = await prisma.chatConversation.findMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        select: { id: true },
      });

      const conversationIds = conversations.map((c: any) => c.id);

      // Count unread messages
      const unreadCount = await prisma.chatMessage.count({
        where: {
          conversationId: { in: conversationIds },
          senderId: { not: userId },
          isRead: false,
        },
      });

      return unreadCount;
    } catch (error: any) {
      console.error('[Message] Get unread count failed:', error.message);
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  /**
   * Search messages within conversations
   */
  static async searchMessages(userId: string, query: string, limit: number = 20) {
    try {
      // Get all conversations for user
      const conversations = await prisma.chatConversation.findMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        select: { id: true },
      });

      const conversationIds = conversations.map((c: any) => c.id);

      // Search messages
      const messages = await prisma.chatMessage.findMany({
        where: {
          conversationId: { in: conversationIds },
          content: {
            contains: query,
          },
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          conversation: {
            include: {
              user1: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
              user2: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return messages;
    } catch (error: any) {
      console.error('[Message] Search messages failed:', error.message);
      throw new Error(`Failed to search messages: ${error.message}`);
    }
  }
}
