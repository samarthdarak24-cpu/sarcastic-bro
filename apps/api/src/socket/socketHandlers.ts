import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface AuthSocket extends Socket {
  user?: {
    id: string;
    role: string; // FARMER | BUYER | FPO
  };
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agritrust-secret-key') as { id: string; role: string };
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User connected: ${socket.user?.id} (${socket.user?.role})`);

    // Join user's personal room
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
    }

    // Join chat room
    socket.on('join-chat', (data: { userId: string; otherUserId: string }) => {
      const roomId = [data.userId, data.otherUserId].sort().join('-');
      socket.join(`chat:${roomId}`);
      console.log(`User ${data.userId} joined chat room: ${roomId}`);
    });

    // Send message
    socket.on('send-message', (data: { senderId: string; receiverId: string; content: string; orderId?: string }) => {
      const roomId = [data.senderId, data.receiverId].sort().join('-');
      io.to(`chat:${roomId}`).emit('new-message', {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        orderId: data.orderId,
        createdAt: new Date(),
      });
    });

    // Order status update
    socket.on('order-status-update', (data: { orderId: string; status: string; userId: string }) => {
      io.to(`user:${data.userId}`).emit('order-updated', {
        orderId: data.orderId,
        status: data.status,
        timestamp: new Date(),
      });
    });

    // Notification
    socket.on('send-notification', (data: { userId: string; title: string; message: string; type: string }) => {
      io.to(`user:${data.userId}`).emit('notification', {
        title: data.title,
        message: data.message,
        type: data.type,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.id}`);
    });
  });
};

// Helper function to emit notifications
export const emitNotification = (io: Server, userId: string, notification: { title: string; message: string; type: string }) => {
  io.to(`user:${userId}`).emit('notification', {
    ...notification,
    timestamp: new Date(),
  });
};

// Helper function to emit order updates
export const emitOrderUpdate = (io: Server, userId: string, orderId: string, status: string) => {
  io.to(`user:${userId}`).emit('order-updated', {
    orderId,
    status,
    timestamp: new Date(),
  });
};
