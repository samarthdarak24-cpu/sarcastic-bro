import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { getSocketService } from "../../services/socketService";

export class NotificationController {
  // GET /notifications
  static async getAll(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { page = "1", limit = "20", unreadOnly } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    if (unreadOnly === "true") where.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    res.json({
      success: true,
      data: { notifications, total, unreadCount, page: Number(page), limit: Number(limit) },
    });
  }

  // PATCH /notifications/read-all
  static async markAllRead(req: Request, res: Response) {
    const userId = req.user!.userId;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true, message: "All notifications marked as read" });
  }

  // PATCH /notifications/:id/read
  static async markOneRead(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    res.json({ success: true });
  }

  // DELETE /notifications/clear
  static async clearAll(req: Request, res: Response) {
    const userId = req.user!.userId;
    await prisma.notification.deleteMany({ where: { userId } });
    res.json({ success: true, message: "All notifications cleared" });
  }

  // POST /notifications/send (internal/admin use)
  static async send(req: Request, res: Response) {
    const { userId, type, title, message, metadata } = req.body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        type: type || "SYSTEM",
        title,
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Emit real-time via socket
    try {
      const socketService = getSocketService();
      socketService.emitNotification(userId, { type, title, message, metadata });
    } catch {}

    res.json({ success: true, data: notification });
  }
}
