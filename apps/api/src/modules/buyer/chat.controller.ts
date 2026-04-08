import { Router, Response } from 'express';
import { ChatService } from './chat.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const chatService = new ChatService();

router.post('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatService.sendMessage(req.user!.id, message);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const history = await chatService.getChatHistory(req.user!.id, limit);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/history', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const result = await chatService.clearChatHistory(req.user!.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
