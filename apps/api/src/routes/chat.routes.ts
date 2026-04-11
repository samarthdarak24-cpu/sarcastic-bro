// ========================================================================
// Chat Routes — /api/chat/*
// ========================================================================

import { Router, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// ─── GET /api/chat/messages/:userId — Get messages with a user ─────────
router.get('/messages/:userId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user!.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: myId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: myId,
        read: false,
      },
      data: { read: true },
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/chat/send — Send a message ──────────────────────────────
router.post('/send', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { receiverId, content, orderId } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'receiverId and content are required' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user!.id,
        receiverId,
        content,
        orderId: orderId || null,
      },
    });

    // Emit via Socket.IO for real-time delivery
    const io = req.app.get('io');
    if (io) {
      const roomId = [req.user!.id, receiverId].sort().join('-');
      io.to(`chat:${roomId}`).emit('new-message', message);
      io.to(`user:${receiverId}`).emit('notification', {
        title: 'New Message',
        message: `You have a new message`,
        type: 'CHAT',
        timestamp: new Date(),
      });
    }

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/chat/contacts — List users you've chatted with ───────────
router.get('/contacts', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const myId = req.user!.id;

    // Get distinct user IDs from messages
    const sentTo = await prisma.message.findMany({
      where: { senderId: myId },
      distinct: ['receiverId'],
      select: { receiverId: true },
    });

    const receivedFrom = await prisma.message.findMany({
      where: { receiverId: myId },
      distinct: ['senderId'],
      select: { senderId: true },
    });

    const contactIds = new Set([
      ...sentTo.map(m => m.receiverId),
      ...receivedFrom.map(m => m.senderId),
    ]);

    const contacts = await prisma.user.findMany({
      where: { id: { in: Array.from(contactIds) } },
      select: { id: true, name: true, role: true, phone: true },
    });

    // Get unread counts
    const contactsWithUnread = await Promise.all(
      contacts.map(async contact => {
        const unread = await prisma.message.count({
          where: { senderId: contact.id, receiverId: myId, read: false },
        });
        return { ...contact, unreadCount: unread };
      })
    );

    res.json(contactsWithUnread);
  } catch (error) {
    next(error);
  }
});

export default router;
