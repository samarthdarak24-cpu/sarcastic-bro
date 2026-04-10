import { Router, Response } from 'express';
import { ChatService } from './chat.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const chatService = new ChatService();

/**
 * GET /api/fpo/chat/conversations
 * Get all conversations
 */
router.get('/conversations', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const conversations = await chatService.getConversations(fpoId);
    res.json({ success: true, data: conversations });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/chat/:buyerId
 * Get messages with specific buyer
 */
router.get('/:buyerId', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const messages = await chatService.getMessages(fpoId, req.params.buyerId, page, limit);
    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/chat/:buyerId
 * Send message to buyer
 */
router.post('/:buyerId', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { content, orderId } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const message = await chatService.sendMessage(fpoId, req.params.buyerId, content, orderId);
    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/chat/unread/count
 * Get unread message count
 */
router.get('/unread/count', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const count = await chatService.getUnreadCount(fpoId);
    res.json({ success: true, data: { count } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/chat/:buyerId/mark-read
 * Mark conversation as read
 */
router.post('/:buyerId/mark-read', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await chatService.markAsRead(fpoId, req.params.buyerId);
    res.json({ success: true, message: 'Marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
