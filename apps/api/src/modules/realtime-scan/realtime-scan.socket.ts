import { Socket } from 'socket.io';
import { realtimeScanService } from './realtime-scan.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  sessionId?: string;
}

export function setupRealtimeScanSocket(io: any) {
  const scanNamespace = io.of('/realtime-scan');

  scanNamespace.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`[RealtimeScan] Client connected: ${socket.id}`);

    /**
     * Initialize scan session
     */
    socket.on('scan:init', async (data: any, callback: Function) => {
      try {
        const userId = socket.userId || data.userId;
        if (!userId) {
          return callback({ success: false, error: 'User ID required' });
        }

        const sessionId = await realtimeScanService.initializeSession(userId);
        socket.sessionId = sessionId;

        // Join room for this session
        socket.join(`scan:${sessionId}`);

        callback({
          success: true,
          sessionId,
          message: 'Scan session initialized'
        });

        console.log(`[RealtimeScan] Session initialized: ${sessionId}`);
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    /**
     * Process frame in real-time
     */
    socket.on('scan:frame', async (data: any, callback: Function) => {
      try {
        const { sessionId, imageBuffer } = data;

        if (!sessionId) {
          return callback({ success: false, error: 'Session ID required' });
        }

        const detection = await realtimeScanService.processDetectionFrame(sessionId, {
          imageBuffer: Buffer.from(imageBuffer, 'base64'),
          timestamp: Date.now()
        });

        // Broadcast detection to all clients in this session
        scanNamespace.to(`scan:${sessionId}`).emit('scan:detection', {
          sessionId,
          detection,
          timestamp: Date.now()
        });

        callback({
          success: true,
          detection
        });
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    /**
     * Get real-time stats
     */
    socket.on('scan:stats', async (data: any, callback: Function) => {
      try {
        const { sessionId } = data;

        if (!sessionId) {
          return callback({ success: false, error: 'Session ID required' });
        }

        const stats = await realtimeScanService.getSessionStats(sessionId);

        callback({
          success: true,
          stats
        });
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    /**
     * Pause scan
     */
    socket.on('scan:pause', (data: any, callback: Function) => {
      try {
        const { sessionId } = data;

        scanNamespace.to(`scan:${sessionId}`).emit('scan:paused', {
          sessionId,
          timestamp: Date.now()
        });

        callback({ success: true });
        console.log(`[RealtimeScan] Session paused: ${sessionId}`);
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    /**
     * Resume scan
     */
    socket.on('scan:resume', (data: any, callback: Function) => {
      try {
        const { sessionId } = data;

        scanNamespace.to(`scan:${sessionId}`).emit('scan:resumed', {
          sessionId,
          timestamp: Date.now()
        });

        callback({ success: true });
        console.log(`[RealtimeScan] Session resumed: ${sessionId}`);
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    /**
     * End scan session
     */
    socket.on('scan:end', async (data: any, callback: Function) => {
      try {
        const { sessionId } = data;

        if (!sessionId) {
          return callback({ success: false, error: 'Session ID required' });
        }

        const result = await realtimeScanService.endSession(sessionId);

        // Notify all clients in session
        scanNamespace.to(`scan:${sessionId}`).emit('scan:ended', {
          sessionId,
          result,
          timestamp: Date.now()
        });

        // Leave room
        socket.leave(`scan:${sessionId}`);

        callback({
          success: true,
          result
        });

        console.log(`[RealtimeScan] Session ended: ${sessionId}`);
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    /**
     * Handle disconnection
     */
    socket.on('disconnect', () => {
      console.log(`[RealtimeScan] Client disconnected: ${socket.id}`);

      if (socket.sessionId) {
        socket.leave(`scan:${socket.sessionId}`);
      }
    });

    /**
     * Error handling
     */
    socket.on('error', (error: any) => {
      console.error(`[RealtimeScan] Socket error: ${error}`);
    });
  });

  return scanNamespace;
}
