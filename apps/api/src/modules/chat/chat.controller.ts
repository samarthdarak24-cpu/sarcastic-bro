/* ========================================================================
   Chat Controller — Advanced Chat & Communication System
   ======================================================================== */

import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import prisma from '../../prisma/client';

export class ChatController {
  /**
   * GET /chat/conversations
   * Get all conversations for the authenticated user
   */
  async getConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const conversations = await ChatService.getConversations(userId);

      res.json({
        success: true,
        data: conversations,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /chat/messages/:conversationId
   * Get messages in a conversation
   */
  async getMessages(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const messages = await ChatService.getMessages(conversationId, limit);

      res.json({
        success: true,
        data: messages,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /chat/send
   * Send a message
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { conversationId, receiverId, content, type, translate, targetLanguage } = req.body;

      if (!receiverId || !content) {
        return res.status(400).json({
          success: false,
          message: 'receiverId and content are required',
        });
      }

      const message = await ChatService.sendMessage({
        conversationId,
        senderId: userId,
        receiverId,
        content,
        type,
        translate,
        targetLanguage,
      });

      res.json({
        success: true,
        data: message,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /chat/translate
   * Translate a message
   */
  async translateMessage(req: Request, res: Response) {
    try {
      const { messageId, targetLanguage } = req.body;

      if (!messageId || !targetLanguage) {
        return res.status(400).json({
          success: false,
          message: 'messageId and targetLanguage are required',
        });
      }

      // Get message
      const message = await prisma.chatMessage.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found',
        });
      }

      const translatedText = await ChatService.translateText(message.content, targetLanguage);

      res.json({
        success: true,
        data: {
          original: message.content,
          translated: translatedText,
          targetLanguage,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /chat/templates
   * Get quick message templates
   */
  async getTemplates(req: Request, res: Response) {
    try {
      const userRole = (req as any).user.role;
      const templates = await ChatService.getTemplates(userRole);

      res.json({
        success: true,
        data: templates,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /chat/matching/find
   * Find best matches for buyer-farmer connections
   */
  async findMatches(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const criteria = req.body;

      const matches = await ChatService.findMatches(userId, criteria);

      res.json({
        success: true,
        data: matches,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /chat/analytics/:conversationId
   * Get conversation analytics
   */
  async getAnalytics(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const analytics = await ChatService.getConversationAnalytics(conversationId);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PATCH /chat/messages/:messageId/read
   * Mark message as read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      await ChatService.markAsRead(messageId);

      res.json({
        success: true,
        message: 'Message marked as read',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
