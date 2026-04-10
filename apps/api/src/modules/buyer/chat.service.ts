import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BuyerChatService {
  /**
   * Send message to farmer/FPO
   */
  async sendMessage(senderId: string, receiverId: string, content: string, orderId?: string) {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        orderId,
        read: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    return message;
  }

  /**
   * Get chat history between buyer and farmer/FPO
   */
  async getChatHistory(userId: string, otherUserId: string, orderId?: string) {
    const where: any = {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    };

    if (orderId) {
      where.orderId = orderId;
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: otherUserId,
        read: false
      },
      data: { read: true }
    });

    return messages;
  }

  /**
   * Get all conversations for a buyer
   */
  async getConversations(buyerId: string) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: buyerId },
          { receiverId: buyerId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const partnerId = msg.senderId === buyerId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === buyerId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partnerId,
          partnerName: partner.name,
          partnerRole: partner.role,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0
        });
      }

      // Count unread messages
      if (msg.receiverId === buyerId && !msg.read) {
        const conv = conversationsMap.get(partnerId);
        conv.unreadCount++;
      }
    });

    return Array.from(conversationsMap.values());
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(userId: string) {
    const count = await prisma.message.count({
      where: {
        receiverId: userId,
        read: false
      }
    });

    return count;
  }

  /**
   * Mark messages as read
   */
  async markAsRead(userId: string, senderId: string) {
    await prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId,
        read: false
      },
      data: { read: true }
    });

    return { success: true };
  }
}
