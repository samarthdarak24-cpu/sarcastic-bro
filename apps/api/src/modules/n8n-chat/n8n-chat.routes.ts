import { Router } from 'express';
import { N8nChatController } from './n8n-chat.controller';

const router = Router();

// POST /api/n8n/chat - Handle chat messages
router.post('/chat', N8nChatController.handleChat);

export default router;
