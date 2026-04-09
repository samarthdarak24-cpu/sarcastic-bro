/**
 * Socket Connection Tests
 * Tests for WebSocket connection, authentication, and reconnection
 */

import { io, Socket } from 'socket.io-client';

describe('Socket Connection Tests', () => {
  let socket: Socket;
  const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  beforeEach(() => {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  });

  afterEach(() => {
    if (socket.connected) {
      socket.disconnect();
    }
  });

  describe('Connection Management', () => {
    test('should connect to socket server', (done) => {
      socket.on('connect', () => {
        expect(socket.connected).toBe(true);
        done();
      });
      socket.connect();
    });

    test('should disconnect from socket server', (done) => {
      socket.on('connect', () => {
        socket.disconnect();
      });

      socket.on('disconnect', () => {
        expect(socket.connected).toBe(false);
        done();
      });

      socket.connect();
    });

    test('should reconnect after disconnection', (done) => {
      let reconnectCount = 0;

      socket.on('connect', () => {
        if (reconnectCount === 0) {
          socket.disconnect();
        } else {
          expect(reconnectCount).toBe(1);
          done();
        }
      });

      socket.on('disconnect', () => {
        reconnectCount++;
        socket.connect();
      });

      socket.connect();
    }, 10000);

    test('should handle connection timeout', (done) => {
      const timeoutSocket = io('http://invalid-url:9999', {
        autoConnect: false,
        timeout: 1000,
      });

      timeoutSocket.on('connect_error', (error) => {
        expect(error).toBeDefined();
        timeoutSocket.disconnect();
        done();
      });

      timeoutSocket.connect();
    }, 5000);
  });

  describe('Authentication', () => {
    test('should authenticate with valid JWT token', (done) => {
      const token = 'valid-jwt-token';
      
      socket.auth = { token };
      socket.on('connect', () => {
        expect(socket.connected).toBe(true);
        done();
      });

      socket.connect();
    });

    test('should reject invalid JWT token', (done) => {
      const token = 'invalid-token';
      
      socket.auth = { token };
      socket.on('connect_error', (error) => {
        expect(error).toBeDefined();
        done();
      });

      socket.connect();
    }, 5000);
  });

  describe('Room Management', () => {
    test('should join user room', (done) => {
      const userId = 'test-user-123';

      socket.on('connect', () => {
        socket.emit('join-user-room', userId);
        
        socket.on('room-joined', (data) => {
          expect(data.room).toBe(`user:${userId}`);
          done();
        });
      });

      socket.connect();
    });

    test('should leave user room', (done) => {
      const userId = 'test-user-123';

      socket.on('connect', () => {
        socket.emit('join-user-room', userId);
        
        setTimeout(() => {
          socket.emit('leave-user-room', userId);
          done();
        }, 100);
      });

      socket.connect();
    });
  });
});
