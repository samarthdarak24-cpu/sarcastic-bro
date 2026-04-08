/* ========================================================================
   Chat Room Controller — REST API Endpoints
   Handles HTTP requests for chat operations
   ======================================================================== */

import { Request, Response } from 'express';
import { ChatRoomService } from './chat-room.service';
import { authenticateToken } from '../../middleware/auth.middleware';

export class ChatRoomController {
  /**
   * GET /api/chat-rooms/{chatRoomId}
   * Get chat room details
   */
  static async getChatRoom(req: Request, res: Response) {
    try {
      const { chatRoomId } = req.params;
      const userId = (req as any).userId;

      const chatRoom = await (ChatRoomService as any).getOrCreateChatRoom(chatRoomId);

      // Verify user has access
      if (
        userId !== chatRoom.farmerId &&
        userId !== chatRoom.buyerId
      ) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json(chatRoom);
    } catch (error: any) {
      console.error('Error getting chat room:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/orders/{orderId}/chat
   * Get or create chat room for an order
   */
  static async getOrCreateChatRoom(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = (req as any).userId;

      const chatRoom = await ChatRoomService.getOrCreateChatRoom(orderId);

      // Verify user is part of the order
      if (userId !== chatRoom.farmerId && userId !== chatRoom.buyerId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json(chatRoom);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/chat-rooms/{chatRoomId}/messages
   * Get messages with pagination
   */
  static async getMessages(req: Request, res: Response) {
    try {
      const { chatRoomId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = (req as any).userId;

      // Verify access
      const chatRoom = await (ChatRoomService as any).getOrCreateChatRoom(chatRoomId);
      if (userId !== chatRoom.farmerId && userId !== chatRoom.buyerId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await ChatRoomService.getMessages(
        chatRoomId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/chat-rooms/{chatRoomId}/messages
   * Send a message
   */
  static async sendMessage(req: Request, res: Response) {
    try {
      const { chatRoomId } = req.params;
      const { content, type, fileUrl, fileName, fileSize, mimeType } = req.body;
      const userId = (req as any).userId;

      if (!content?.trim()) {
        return res.status(400).json({ error: 'Message content is required' });
      }

      const message = await ChatRoomService.sendMessage({
        chatRoomId,
        senderId: userId,
        content,
        type: type || 'text',
        fileUrl,
        fileName,
        fileSize,
        mimeType,
      });

      res.status(201).json(message);
    } catch (error: any) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/chat-rooms/{chatRoomId}/search
   * Search messages
   */
  static async searchMessages(req: Request, res: Response) {
    try {
      const { chatRoomId } = req.params;
      const { q, page = 1, limit = 20 } = req.query;
      const userId = (req as any).userId;

      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      // Verify access
      const chatRoom = await (ChatRoomService as any).getOrCreateChatRoom(chatRoomId);
      if (userId !== chatRoom.farmerId && userId !== chatRoom.buyerId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await ChatRoomService.searchMessages(
        chatRoomId,
        q as string,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error searching:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/chat-rooms
   * Get user's chat rooms (inbox)
   */
  static async getUserChatRooms(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { page = 1, limit = 20 } = req.query;

      const result = await ChatRoomService.getUserChatRooms(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error getting chat rooms:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/chat-rooms/{chatRoomId}/messages/{messageId}/seen
   * Mark message as seen
   */
  static async markMessageAsSeen(req: Request, res: Response) {
    try {
      const { chatRoomId, messageId } = req.params;
      const userId = (req as any).userId;

      const message = await ChatRoomService.markMessageAsSeen(messageId, userId);

      res.json(message);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /api/chat-rooms/{chatRoomId}/messages/{messageId}
   * Delete a message
   */
  static async deleteMessage(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const userId = (req as any).userId;

      const message = await ChatRoomService.deleteMessage(messageId, userId);

      res.json(message);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/chat-rooms/{chatRoomId}/messages/{messageId}
   * Edit a message
   */
  static async editMessage(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const { content } = req.body;
      const userId = (req as any).userId;

      if (!content?.trim()) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const message = await ChatRoomService.editMessage(
        messageId,
        userId,
        content
      );

      res.json(message);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/chat-rooms/{chatRoomId}/messages/{messageId}/reactions
   * Add reaction to message
   */
  static async addReaction(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const { emoji } = req.body;
      const userId = (req as any).userId;

      if (!emoji) {
        return res.status(400).json({ error: 'Emoji is required' });
      }

      const message = await ChatRoomService.addMessageReaction(
        messageId,
        userId,
        emoji
      );

      res.json(message);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/chat-rooms/{chatRoomId}/archive
   * Archive chat room
   */
  static async archiveChatRoom(req: Request, res: Response) {
    try {
      const { chatRoomId } = req.params;
      const userId = (req as any).userId;

      const chatRoom = await ChatRoomService.archiveChatRoom(chatRoomId, userId);

      res.json(chatRoom);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
