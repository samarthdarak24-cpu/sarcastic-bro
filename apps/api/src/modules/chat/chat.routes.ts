/* ========================================================================
   Chat Routes — Advanced Chat & Communication System
   ======================================================================== */

import { Router } from 'express';
import { ChatController } from './chat.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const chatController = new ChatController();

// All routes require authentication
router.use(authenticate);

// Conversations
router.get('/conversations', chatController.getConversations.bind(chatController));

// Messages
router.get('/messages/:conversationId', chatController.getMessages.bind(chatController));
router.post('/send', chatController.sendMessage.bind(chatController));
router.patch('/messages/:messageId/read', chatController.markAsRead.bind(chatController));

// Translation
router.post('/translate', chatController.translateMessage.bind(chatController));

// Templates
router.get('/templates', chatController.getTemplates.bind(chatController));

// Smart Matching
router.post('/matching/find', chatController.findMatches.bind(chatController));

// Analytics
router.get('/analytics/:conversationId', chatController.getAnalytics.bind(chatController));

export default router;
