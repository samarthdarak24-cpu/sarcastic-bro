/* ========================================================================
   Message Service — Business logic for messaging and conversations
   ======================================================================== */

import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";

interface SendMessageInput {
  receiverId: string;
  content: string;
  type?: string;
  fileUrl?: string;
}

export class MessageService {
  static async sendMessage(senderId: string, data: SendMessageInput) {
    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: data.receiverId },
    });

    if (!receiver) {
      throw ApiError.notFound("Receiver not found");
    }

    if (senderId === data.receiverId) {
      throw ApiError.badRequest("Cannot send message to yourself");
    }

    // Create or get conversation
    const [user1Id, user2Id] = [senderId, data.receiverId].sort();
    let conversation = await prisma.chatConversation.findUnique({
      where: { user1Id_user2Id: { user1Id, user2Id } },
    });

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: { user1Id, user2Id },
      });
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderId,
        content: data.content,
        type: data.type || "text",
        fileUrl: data.fileUrl,
      },
      include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
    });

    // Update conversation last message time
    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: data.receiverId,
        type: "MESSAGE",
        title: "New message",
        message: `${message.sender.name}: ${data.content.substring(0, 50)}`,
        metadata: JSON.stringify({ conversationId: conversation.id, senderId }),
      },
    });

    return message;
  }

  static async getConversations(userId: string, options: { page: number; limit: number }) {
    const skip = (options.page - 1) * options.limit;

    const [conversations, total] = await Promise.all([
      prisma.chatConversation.findMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        orderBy: { lastMessageAt: "desc" },
        skip,
        take: options.limit,
        include: {
          user1: { select: { id: true, name: true, avatarUrl: true } },
          user2: { select: { id: true, name: true, avatarUrl: true } },
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.chatConversation.count({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
      }),
    ]);

    const formatted = conversations.map((conv) => {
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0];
      return {
        ...conv,
        otherUser,
        lastMessage: lastMessage?.content || "",
        lastMessageAt: conv.lastMessageAt,
      };
    });

    return { conversations: formatted, total };
  }

  static async getConversation(userId: string, otherUserId: string, options: { page: number; limit: number }) {
    const skip = (options.page - 1) * options.limit;

    // Verify users exist
    const [user1, user2] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: otherUserId } }),
    ]);

    if (!user1 || !user2) {
      throw ApiError.notFound("User not found");
    }

    const [sortedId1, sortedId2] = [userId, otherUserId].sort();
    const conversation = await prisma.chatConversation.findUnique({
      where: { user1Id_user2Id: { user1Id: sortedId1, user2Id: sortedId2 } },
    });

    if (!conversation) {
      throw ApiError.notFound("Conversation not found");
    }

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: options.limit,
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.chatMessage.count({ where: { conversationId: conversation.id } }),
    ]);

    // Mark all as read
    await prisma.chatMessage.updateMany({
      where: { conversationId: conversation.id, senderId: otherUserId },
      data: { isRead: true, readAt: new Date() },
    });

    return { messages: messages.reverse(), total };
  }

  static async markAsRead(messageId: string, userId: string) {
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      throw ApiError.notFound("Message not found");
    }

    // Only receiver can mark as read
    const conversation = message.conversation;
    if (
      conversation.user1Id !== userId &&
      conversation.user2Id !== userId
    ) {
      throw ApiError.forbidden("No access to this message");
    }

    return prisma.chatMessage.update({
      where: { id: messageId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  static async deleteMessage(messageId: string, userId: string) {
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw ApiError.notFound("Message not found");
    }

    if (message.senderId !== userId) {
      throw ApiError.forbidden("Only sender can delete message");
    }

    await prisma.chatMessage.delete({
      where: { id: messageId },
    });
  }

  static async getUnreadCount(userId: string) {
    return prisma.chatMessage.count({
      where: {
        conversation: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        senderId: { not: userId },
        isRead: false,
      },
    });
  }
}
