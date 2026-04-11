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
      const payload = {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        orderId: data.orderId,
        createdAt: new Date(),
      };
      io.to(`chat:${roomId}`).emit('new-message', payload);
      io.to(`chat:${roomId}`).emit('message_received', payload);
      io.to(`user:${data.receiverId}`).emit('message_received', payload);
    });

    // Order status update
    socket.on('order-status-update', (data: { orderId: string; status: string; userId: string }) => {
      const payload = {
        orderId: data.orderId,
        status: data.status,
        timestamp: new Date(),
      };
      io.to(`user:${data.userId}`).emit('order-updated', payload);
      io.to(`user:${data.userId}`).emit('order_updated', payload);
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

    // ==================== LOGISTICS EVENTS ====================

    // Join logistics tracking room
    socket.on('join:logistics', (logisticsId: string) => {
      socket.join(`logistics:${logisticsId}`);
      console.log(`User ${socket.user?.id} joined logistics room: ${logisticsId}`);
    });

    // Driver sends location update (live tracking)
    socket.on('logistics:update-location', async (data: { logisticsId: string; lat: number; lng: number; status?: string }) => {
      try {
        // Emit location update to all users tracking this logistics
        io.to(`logistics:${data.logisticsId}`).emit('logistics:location-updated', {
          lat: data.lat,
          lng: data.lng,
          status: data.status,
          timestamp: new Date(),
          updatedBy: socket.user?.id,
        });

        console.log(`Location updated for logistics ${data.logisticsId}:`, { lat: data.lat, lng: data.lng });
      } catch (error) {
        console.error('Error updating logistics location:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // Request status update for logistics
    socket.on('logistics:request-status', (logisticsId: string) => {
      // This could trigger a push notification to driver/FPO for status update
      io.to(`logistics:${logisticsId}`).emit('logistics:status-requested', {
        logisticsId,
        requestedBy: socket.user?.id,
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
