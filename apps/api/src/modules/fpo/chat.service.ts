import prisma from '../../prisma/client';

export class ChatService {
  /**
   * Get all conversations for FPO
   */
  async getConversations(fpoUserId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    // Get unique buyers who have messaged the FPO
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: fpoUserId },
          { receiverId: fpoUserId }
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
      const partnerId = msg.senderId === fpoUserId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === fpoUserId ? msg.receiver : msg.sender;

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
      if (msg.receiverId === fpoUserId && !msg.read) {
        const conv = conversationsMap.get(partnerId);
        conv.unreadCount++;
      }
    });

    return Array.from(conversationsMap.values());
  }

  /**
   * Get messages with a specific buyer
   */
  async getMessages(fpoUserId: string, buyerId: string, page: number = 1, limit: number = 50) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: fpoUserId, receiverId: buyerId },
          { senderId: buyerId, receiverId: fpoUserId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: buyerId,
        receiverId: fpoUserId,
        read: false
      },
      data: { read: true }
    });

    return messages.reverse(); // Return in chronological order
  }

  /**
   * Send message to buyer
   */
  async sendMessage(fpoUserId: string, buyerId: string, content: string, orderId?: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    // Verify buyer exists
    const buyer = await prisma.user.findUnique({
      where: { id: buyerId }
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    const message = await prisma.message.create({
      data: {
        senderId: fpoUserId,
        receiverId: buyerId,
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
        }
      }
    });

    return message;
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(fpoUserId: string) {
    const count = await prisma.message.count({
      where: {
        receiverId: fpoUserId,
        read: false
      }
    });

    return count;
  }

  /**
   * Mark conversation as read
   */
  async markAsRead(fpoUserId: string, buyerId: string) {
    await prisma.message.updateMany({
      where: {
        senderId: buyerId,
        receiverId: fpoUserId,
        read: false
      },
      data: { read: true }
    });
  }
}
