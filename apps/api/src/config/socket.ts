import { Server } from 'socket.io';

let io: Server | null = null;

export class SocketService {
  static setIO(ioInstance: Server) {
    io = ioInstance;
  }

  static getIO(): Server {
    if (!io) {
      throw new Error('Socket.IO not initialized');
    }
    return io;
  }

  static emitToUser(userId: string, event: string, data: any) {
    if (io) {
      io.to(`user:${userId}`).emit(event, data);
    }
  }

  static emitToRoom(room: string, event: string, data: any) {
    if (io) {
      io.to(room).emit(event, data);
    }
  }

  static broadcast(event: string, data: any) {
    if (io) {
      io.emit(event, data);
    }
  }
}
