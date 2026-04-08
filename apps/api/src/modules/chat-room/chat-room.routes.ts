/* ========================================================================
   Chat Room Routes
   ======================================================================== */

import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { ChatRoomController } from './chat-room.controller';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * Chat Room Endpoints
 */

// Get user's chat rooms (inbox)
router.get('/', ChatRoomController.getUserChatRooms);

// Get or create chat room for order
router.get('/orders/:orderId/chat', ChatRoomController.getOrCreateChatRoom);

// Get specific chat room
router.get('/:chatRoomId', ChatRoomController.getChatRoom);

// Get messages in chat room (with pagination)
router.get('/:chatRoomId/messages', ChatRoomController.getMessages);

// Send message
router.post('/:chatRoomId/messages', ChatRoomController.sendMessage);

// Search messages
router.get('/:chatRoomId/search', ChatRoomController.searchMessages);

// Mark message as seen
router.put('/:chatRoomId/messages/:messageId/seen', ChatRoomController.markMessageAsSeen);

// Delete message
router.delete('/:chatRoomId/messages/:messageId', ChatRoomController.deleteMessage);

// Edit message  
router.put('/:chatRoomId/messages/:messageId', ChatRoomController.editMessage);

// Add reaction to message
router.post('/:chatRoomId/messages/:messageId/reactions', ChatRoomController.addReaction);

// Archive chat room
router.put('/:chatRoomId/archive', ChatRoomController.archiveChatRoom);

export default router;
