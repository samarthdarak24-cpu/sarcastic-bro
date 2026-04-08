/* ========================================================================
   Message Controller — Real-time Chat and Messaging Endpoints
   Handles HTTP endpoints for chat and messaging features
   ======================================================================== */

import { Request, Response } from 'express';
import { MessageService } from './message.service';
import prisma from '../../prisma/client';

export class MessageController {
  /**
   * POST /api/messages
   * Send a message
   */
  static async sendMessage(req: Request, res: Response) {
    try {
      const senderId = req.user?.userId;
      if (!senderId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { receiverId, content, type, fileUrl } = req.body;

      if (!receiverId || !content) {
        return res.status(400).json({ error: 'Receiver ID and content are required' });
      }

      const message = await MessageService.sendMessage({
        senderId,
        receiverId,
        content,
        type,
        fileUrl,
      });

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message,
      });
    } catch (error: any) {
      console.error('[MessageController] Send message error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/messages/conversations
   * Get all conversations for the authenticated user
   */
  static async getConversations(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const conversations = await MessageService.getConversations(userId);

      res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error: any) {
      console.error('[MessageController] Get conversations error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/messages/conversation/:userId
   * Get messages in a conversation with a specific user
   */
  static async getConversationMessages(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { userId: otherUserId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!otherUserId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const messages = await MessageService.getConversationMessages(
        userId,
        otherUserId,
        limit
      );

      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error: any) {
      console.error('[MessageController] Get conversation messages error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/messages/:id/read
   * Mark a message as read
   */
  static async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id: messageId } = req.params;

      if (!messageId) {
        return res.status(400).json({ error: 'Message ID is required' });
      }

      const result = await MessageService.markAsRead(messageId, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('[MessageController] Mark as read error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/messages/typing
   * Emit typing indicator
   */
  static async emitTyping(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { conversationId, isTyping } = req.body;

      if (!conversationId || typeof isTyping !== 'boolean') {
        return res.status(400).json({ error: 'Conversation ID and isTyping are required' });
      }

      // Fetch user name from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      MessageService.emitTyping(conversationId, userId, user.name, isTyping);

      res.status(200).json({
        success: true,
        message: 'Typing indicator sent',
      });
    } catch (error: any) {
      console.error('[MessageController] Emit typing error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/messages/unread-count
   * Get unread message count
   */
  static async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const unreadCount = await MessageService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: { unreadCount },
      });
    } catch (error: any) {
      console.error('[MessageController] Get unread count error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/messages/search
   * Search messages within conversations
   */
  static async searchMessages(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { q: query } = req.query;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const messages = await MessageService.searchMessages(userId, query, limit);

      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error: any) {
      console.error('[MessageController] Search messages error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}
