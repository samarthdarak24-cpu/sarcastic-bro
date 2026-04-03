import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { sendSuccess, sendPaginated } from "../../utils/response";

export class NotificationController {
  static async getMyNotifications(req: Request, res: Response) {
    const { unread, page = "1", limit = "20" } = req.query;
    const result = await NotificationService.getUserNotifications(req.user!.userId, {
      unreadOnly: unread === "true",
      page: Number(page),
      limit: Number(limit),
    });
    return sendPaginated(res, result.notifications, result.total, Number(page), Number(limit));
  }

  static async getUnreadCount(req: Request, res: Response) {
    const count = await NotificationService.getUnreadCount(req.user!.userId);
    return sendSuccess(res, { unreadCount: count });
  }

  static async getNotification(req: Request, res: Response) {
    const notification = await NotificationService.getNotification(req.params.id, req.user!.userId);
    return sendSuccess(res, notification);
  }

  static async markAsRead(req: Request, res: Response) {
    const notification = await NotificationService.markAsRead(req.params.id, req.user!.userId);
    return sendSuccess(res, notification, "Notification marked as read");
  }

  static async markAllAsRead(req: Request, res: Response) {
    const count = await NotificationService.markAllAsRead(req.user!.userId);
    return sendSuccess(res, { markedCount: count }, "All notifications marked as read");
  }

  static async deleteNotification(req: Request, res: Response) {
    await NotificationService.deleteNotification(req.params.id, req.user!.userId);
    return sendSuccess(res, null, "Notification deleted");
  }

  static async deleteAllNotifications(req: Request, res: Response) {
    const count = await NotificationService.deleteAllNotifications(req.user!.userId);
    return sendSuccess(res, { deletedCount: count }, "All notifications deleted");
  }
}
