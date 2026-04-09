/**
 * Real-Time Performance Tests
 * Tests for latency, throughput, and performance metrics
 */

import { io, Socket } from 'socket.io-client';

describe('Real-Time Performance Tests', () => {
  let socket: Socket;
  const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  beforeEach((done) => {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });

    socket.on('connect', done);
    socket.connect();
  });

  afterEach(() => {
    if (socket.connected) {
      socket.disconnect();
    }
  });

  describe('Latency Tests', () => {
    test('should have latency < 2 seconds for order updates', (done) => {
      const startTime = Date.now();

      socket.on('order-status-update', () => {
        const latency = Date.now() - startTime;
        expect(latency).toBeLessThan(2000);
        done();
      });

      socket.emit('test-emit-order-update', {
        orderId: 'order-123',
        status: 'SHIPPED',
      });
    });

    test('should have latency < 2 seconds for price updates', (done) => {
      const startTime = Date.now();

      socket.on('price-update', () => {
        const latency = Date.now() - startTime;
        expect(latency).toBeLessThan(2000);
        done();
      });

      socket.emit('test-emit-price-update', {
        productId: 'tomato',
        newPrice: 50,
      });
    });

    test('should have latency < 1 second for messages', (done) => {
      const startTime = Date.now();

      socket.on('new-message', () => {
        const latency = Date.now() - startTime;
        expect(latency).toBeLessThan(1000);
        done();
      });

      socket.emit('test-emit-new-message', {
        messageId: 'msg-123',
        content: 'Test message',
      });
    });
  });

  describe('Throughput Tests', () => {
    test('should handle 100 rapid price updates', (done) => {
      let receivedCount = 0;
      const totalUpdates = 100;
      const startTime = Date.now();

      socket.on('price-update', () => {
        receivedCount++;
        
        if (receivedCount === totalUpdates) {
          const duration = Date.now() - startTime;
          const throughput = (totalUpdates / duration) * 1000; // events per second
          
          expect(receivedCount).toBe(totalUpdates);
          expect(throughput).toBeGreaterThan(10); // At least 10 events/sec
          done();
        }
      });

      // Emit 100 updates rapidly
      for (let i = 0; i < totalUpdates; i++) {
        socket.emit('test-emit-price-update', {
          productId: `product-${i}`,
          newPrice: 50 + i,
        });
      }
    }, 15000);

    test('should handle concurrent events of different types', (done) => {
      const events = {
        orders: 0,
        prices: 0,
        messages: 0,
      };
      const expectedEach = 10;

      socket.on('order-status-update', () => {
        events.orders++;
        checkCompletion();
      });

      socket.on('price-update', () => {
        events.prices++;
        checkCompletion();
      });

      socket.on('new-message', () => {
        events.messages++;
        checkCompletion();
      });

      function checkCompletion() {
        if (
          events.orders === expectedEach &&
          events.prices === expectedEach &&
          events.messages === expectedEach
        ) {
          expect(events.orders).toBe(expectedEach);
          expect(events.prices).toBe(expectedEach);
          expect(events.messages).toBe(expectedEach);
          done();
        }
      }

      // Emit mixed events
      for (let i = 0; i < expectedEach; i++) {
        socket.emit('test-emit-order-update', { orderId: `order-${i}` });
        socket.emit('test-emit-price-update', { productId: `product-${i}` });
        socket.emit('test-emit-new-message', { messageId: `msg-${i}` });
      }
    }, 10000);
  });

  describe('Connection Stability Tests', () => {
    test('should maintain connection for 30 seconds', (done) => {
      let disconnected = false;

      socket.on('disconnect', () => {
        disconnected = true;
      });

      setTimeout(() => {
        expect(disconnected).toBe(false);
        expect(socket.connected).toBe(true);
        done();
      }, 30000);
    }, 35000);

    test('should reconnect within 5 seconds after disconnect', (done) => {
      let reconnectTime: number;

      socket.on('disconnect', () => {
        reconnectTime = Date.now();
      });

      socket.on('connect', () => {
        if (reconnectTime) {
          const reconnectDuration = Date.now() - reconnectTime;
          expect(reconnectDuration).toBeLessThan(5000);
          done();
        }
      });

      // Force disconnect
      setTimeout(() => {
        socket.disconnect();
        socket.connect();
      }, 1000);
    }, 10000);
  });

  describe('Memory and Resource Tests', () => {
    test('should not leak memory with repeated connections', (done) => {
      const initialMemory = process.memoryUsage().heapUsed;
      let connectionCount = 0;
      const maxConnections = 10;

      function connectAndDisconnect() {
        const tempSocket = io(SOCKET_URL, {
          autoConnect: false,
          transports: ['websocket'],
        });

        tempSocket.on('connect', () => {
          tempSocket.disconnect();
          connectionCount++;

          if (connectionCount === maxConnections) {
            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;
            
            // Memory increase should be reasonable (< 50MB)
            expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
            done();
          } else {
            setTimeout(connectAndDisconnect, 100);
          }
        });

        tempSocket.connect();
      }

      connectAndDisconnect();
    }, 15000);
  });

  describe('Event Queue Tests', () => {
    test('should queue events during disconnection', (done) => {
      const queuedEvents: any[] = [];

      socket.on('disconnect', () => {
        // Emit events while disconnected
        for (let i = 0; i < 5; i++) {
          socket.emit('test-emit-price-update', {
            productId: `product-${i}`,
            newPrice: 50 + i,
          });
        }

        // Reconnect
        setTimeout(() => {
          socket.connect();
        }, 1000);
      });

      socket.on('connect', () => {
        if (queuedEvents.length > 0) {
          // Events should be delivered after reconnection
          expect(queuedEvents.length).toBeGreaterThan(0);
          done();
        }
      });

      socket.on('price-update', (data) => {
        queuedEvents.push(data);
      });

      // Disconnect after initial connection
      setTimeout(() => {
        socket.disconnect();
      }, 1000);
    }, 10000);
  });
});
