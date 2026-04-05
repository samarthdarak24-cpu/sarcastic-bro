/* ========================================================================
   Message Controller — HTTP handlers for messaging
   ======================================================================== */

import type { Request, Response } from "express";
import { MessageService } from "./message.service";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/response";
import { getSocketService } from "../../services/socketService";

export class MessageController {
  static async sendMessage(req: Request, res: Response) {
    const { receiverId, content, type = "text", fileUrl } = req.body;
    if (!receiverId || !content) {
      return sendSuccess(res, { error: "receiverId and content required" });
    }
    const message = await MessageService.sendMessage(req.user!.userId, {
      receiverId,
      content,
      type,
      fileUrl,
    });
    
    // Emit real-time message notification
    try {
      const socketService = getSocketService();
      socketService.emitNewMessage(receiverId, {
        messageId: message.id,
        senderId: req.user!.userId,
        senderName: req.user!.email || 'User',
        content: message.content,
        conversationId: `${req.user!.userId}-${receiverId}`
      });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }
    
    return sendCreated(res, message, "Message sent");
  }

  static async getConversations(req: Request, res: Response) {
    const { page = "1", limit = "20" } = req.query;
    const result = await MessageService.getConversations(req.user!.userId, {
      page: Number(page),
      limit: Number(limit),
    });
    return sendPaginated(res, result.conversations, result.total, Number(page), Number(limit));
  }

  static async getConversation(req: Request, res: Response) {
    const { userId } = req.params;
    const { page = "1", limit = "50" } = req.query;
    const result = await MessageService.getConversation(req.user!.userId, userId, {
      page: Number(page),
      limit: Number(limit),
    });
    return sendPaginated(res, result.messages, result.total, Number(page), Number(limit));
  }

  static async markAsRead(req: Request, res: Response) {
    const { messageId } = req.params;
    const message = await MessageService.markAsRead(messageId, req.user!.userId);
    return sendSuccess(res, message, "Marked as read");
  }

  static async deleteMessage(req: Request, res: Response) {
    await MessageService.deleteMessage(req.params.messageId, req.user!.userId);
    return sendSuccess(res, null, "Message deleted");
  }

  static async getUnreadCount(req: Request, res: Response) {
    const count = await MessageService.getUnreadCount(req.user!.userId);
    return sendSuccess(res, { unreadCount: count });
  }
}
