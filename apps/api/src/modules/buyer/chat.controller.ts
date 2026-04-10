import { Router, Response } from 'express';
import { BuyerChatService } from './chat.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';
import { SocketService } from '../../config/socket';

const router = Router();
const chatService = new BuyerChatService();

/**
 * Send a message to farmer/FPO
 */
router.post('/send', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, content, orderId } = req.body;
    if (!receiverId || !content) {
      return res.status(400).json({ error: 'receiverId and content are required' });
    }

    const message = await chatService.sendMessage(req.user!.id, receiverId, content, orderId);

    // Real-time chat events for both users
    const roomId = [req.user!.id, receiverId].sort().join('-');
    SocketService.emitToRoom(`chat:${roomId}`, 'new-message', message);
    SocketService.emitToUser(receiverId, 'message_received', message);
    SocketService.emitToUser(req.user!.id, 'message_received', message);

    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get chat history with a specific user
 */
router.get('/history/:otherUserId', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { otherUserId } = req.params;
    const { orderId } = req.query;
    
    const messages = await chatService.getChatHistory(req.user!.id, otherUserId, orderId as string);
    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all conversations
 */
router.get('/conversations', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await chatService.getConversations(req.user!.id);
    res.json({ success: true, data: conversations });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get unread message count
 */
router.get('/unread-count', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const count = await chatService.getUnreadCount(req.user!.id);
    res.json({ success: true, data: { count } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Mark messages as read
 */
router.post('/mark-read/:senderId', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { senderId } = req.params;
    await chatService.markAsRead(req.user!.id, senderId);
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
