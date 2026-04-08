import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";

export class NotificationService {
  private static readonly CACHE_TTL = 120; // 2 minutes

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

    // Invalidate user notification caches
    await redis.delPattern(`notifications:${data.userId}:*`);
    await redis.del(`notifications:unread:${data.userId}`);

    // Emit via Socket.IO for real-time delivery
    try {
      const socketService = getSocketService();
      socketService.emitNotification(data.userId, {
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
      });
    } catch (err) {
      console.warn("[Socket] Notification emission failed:", err);
    }

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

    // Generate cache key
    const cacheKey = `notifications:${userId}:${JSON.stringify(options || {})}`;

    // Try cache first
    const cached = await redis.get<{ notifications: any[]; total: number }>(cacheKey);
    if (cached) {
      return cached;
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

    const result = { notifications, total };

    // Cache the result
    await redis.set(cacheKey, result, this.CACHE_TTL);

    return result;
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
    // Try cache first
    const cacheKey = `notifications:unread:${userId}`;
    const cached = await redis.get<number>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    // Cache the count
    await redis.set(cacheKey, count, this.CACHE_TTL);

    return count;
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

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    // Invalidate caches
    await redis.delPattern(`notifications:${userId}:*`);
    await redis.del(`notifications:unread:${userId}`);

    return updated;
  }

  static async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    // Invalidate caches
    await redis.delPattern(`notifications:${userId}:*`);
    await redis.del(`notifications:unread:${userId}`);

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

    // Invalidate caches
    await redis.delPattern(`notifications:${userId}:*`);
    await redis.del(`notifications:unread:${userId}`);
  }

  static async deleteAllNotifications(userId: string) {
    const result = await prisma.notification.deleteMany({
      where: { userId },
    });

    // Invalidate caches
    await redis.delPattern(`notifications:${userId}:*`);
    await redis.del(`notifications:unread:${userId}`);

    return result.count;
  }

  static async getNotificationsByType(userId: string, type: string, limit: number = 20) {
    // Generate cache key
    const cacheKey = `notifications:${userId}:type:${type}:${limit}`;

    // Try cache first
    const cached = await redis.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const notifications = await prisma.notification.findMany({
      where: { userId, type },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Cache the result
    await redis.set(cacheKey, notifications, this.CACHE_TTL);

    return notifications;
  }

  /**
   * Bulk create notifications for multiple users
   */
  static async createBulk(notifications: Array<{
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, any>;
  }>) {
    const created = await prisma.notification.createMany({
      data: notifications.map(n => ({
        userId: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        metadata: n.metadata ? JSON.stringify(n.metadata) : null,
      })),
    });

    // Invalidate caches for all affected users
    const userIds = [...new Set(notifications.map(n => n.userId))];
    for (const userId of userIds) {
      await redis.delPattern(`notifications:${userId}:*`);
      await redis.del(`notifications:unread:${userId}`);
    }

    // Emit real-time notifications
    try {
      const socketService = getSocketService();
      for (const notification of notifications) {
        socketService.emitNotification(notification.userId, {
          type: notification.type,
          title: notification.title,
          message: notification.message,
          metadata: notification.metadata,
        });
      }
    } catch (err) {
      console.warn("[Socket] Bulk notification emission failed:", err);
    }

    return created;
  }
}
