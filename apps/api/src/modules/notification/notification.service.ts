import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";

export class NotificationService {
  static async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, any>;
  }) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    // Try to emit via Socket.IO if available
    try {
      const { SocketService } = require("../../config/socket");
      if (SocketService?.emitToUser) {
        SocketService.emitToUser(data.userId, "notification:new", notification);
      }
    } catch {}

    return notification;
  }

  static async getUserNotifications(
    userId: string,
    options?: { unreadOnly?: boolean; page?: number; limit?: number }
  ) {
    const skip = options ? (options.page! - 1) * options.limit! : 0;
    const take = options?.limit || 50;

    const where: any = { userId };
    if (options?.unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  static async getNotification(id: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw ApiError.notFound("Notification not found");
    }

    if (notification.userId !== userId) {
      throw ApiError.forbidden("No access to this notification");
    }

    return notification;
  }

  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  static async markAsRead(id: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw ApiError.notFound("Notification not found");
    }

    if (notification.userId !== userId) {
      throw ApiError.forbidden("No access to this notification");
    }

    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  static async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return result.count;
  }

  static async deleteNotification(id: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw ApiError.notFound("Notification not found");
    }

    if (notification.userId !== userId) {
      throw ApiError.forbidden("No access to this notification");
    }

    await prisma.notification.delete({
      where: { id },
    });
  }

  static async deleteAllNotifications(userId: string) {
    const result = await prisma.notification.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  static async getNotificationsByType(userId: string, type: string, limit: number = 20) {
    return prisma.notification.findMany({
      where: { userId, type },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
