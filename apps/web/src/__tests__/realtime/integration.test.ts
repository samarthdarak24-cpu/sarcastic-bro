/**
 * Real-Time Integration Tests
 * End-to-end tests for complete real-time workflows
 */

import { io, Socket } from 'socket.io-client';

describe('Real-Time Integration Tests', () => {
  let farmerSocket: Socket;
  let buyerSocket: Socket;
  const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const FARMER_ID = 'farmer-123';
  const BUYER_ID = 'buyer-456';

  beforeEach((done) => {
    let connectedCount = 0;

    farmerSocket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });

    buyerSocket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });

    const checkBothConnected = () => {
      connectedCount++;
      if (connectedCount === 2) {
        farmerSocket.emit('join-user-room', FARMER_ID);
        buyerSocket.emit('join-user-room', BUYER_ID);
        setTimeout(done, 100);
      }
    };

    farmerSocket.on('connect', checkBothConnected);
    buyerSocket.on('connect', checkBothConnected);

    farmerSocket.connect();
    buyerSocket.connect();
  });

  afterEach(() => {
    if (farmerSocket.connected) farmerSocket.disconnect();
    if (buyerSocket.connected) buyerSocket.disconnect();
  });

  describe('Complete Order Flow', () => {
    test('should handle complete order lifecycle', (done) => {
      const orderId = 'order-integration-123';
      const orderNumber = 'ORD-INT-001';
      const statuses = ['PENDING', 'ACCEPTED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
      let currentStatusIndex = 0;

      // Buyer receives order updates
      buyerSocket.on('order-status-update', (data) => {
        expect(data.orderId).toBe(orderId);
        expect(data.status).toBe(statuses[currentStatusIndex]);
        
        currentStatusIndex++;
        
        if (currentStatusIndex === statuses.length) {
          done();
        } else {
          // Simulate next status update
          setTimeout(() => {
            farmerSocket.emit('update-order-status', {
              orderId,
              orderNumber,
              status: statuses[currentStatusIndex],
            });
          }, 100);
        }
      });

      // Start the flow
      farmerSocket.emit('update-order-status', {
        orderId,
        orderNumber,
        status: statuses[0],
      });
    }, 10000);

    test('should sync order location updates', (done) => {
      const orderId = 'order-location-123';
      const locations = [
        { lat: 19.0760, lng: 72.8777, location: 'Mumbai' },
        { lat: 18.5204, lng: 73.8567, location: 'Pune' },
        { lat: 21.1458, lng: 79.0882, location: 'Nagpur' },
      ];
      let locationIndex = 0;

      buyerSocket.on('order:location-update', (data) => {
        expect(data.orderId).toBe(orderId);
        expect(data.location).toBe(locations[locationIndex].location);
        
        locationIndex++;
        
        if (locationIndex === locations.length) {
          done();
        } else {
          setTimeout(() => {
            farmerSocket.emit('update-order-location', {
              orderId,
              ...locations[locationIndex],
            });
          }, 100);
        }
      });

      // Start location updates
      farmerSocket.emit('update-order-location', {
        orderId,
        ...locations[0],
      });
    }, 5000);
  });

  describe('Real-Time Chat Flow', () => {
    test('should handle bidirectional messaging', (done) => {
      const conversationId = 'conv-123';
      const messages = [
        { from: 'farmer', content: 'Hello, I have fresh tomatoes' },
        { from: 'buyer', content: 'What is the price?' },
        { from: 'farmer', content: '₹50 per kg' },
        { from: 'buyer', content: 'I will take 100 kg' },
      ];
      let messageIndex = 0;

      farmerSocket.on('new-message', (data) => {
        if (data.senderId === BUYER_ID) {
          expect(data.content).toBe(messages[messageIndex].content);
          messageIndex++;
          
          if (messageIndex < messages.length && messages[messageIndex].from === 'farmer') {
            setTimeout(() => {
              farmerSocket.emit('send-message', {
                conversationId,
                senderId: FARMER_ID,
                content: messages[messageIndex].content,
              });
            }, 100);
          }
        }
      });

      buyerSocket.on('new-message', (data) => {
        if (data.senderId === FARMER_ID) {
          expect(data.content).toBe(messages[messageIndex].content);
          messageIndex++;
          
          if (messageIndex < messages.length) {
            if (messages[messageIndex].from === 'buyer') {
              setTimeout(() => {
                buyerSocket.emit('send-message', {
                  conversationId,
                  senderId: BUYER_ID,
                  content: messages[messageIndex].content,
                });
              }, 100);
            }
          } else {
            done();
          }
        }
      });

      // Start conversation
      farmerSocket.emit('send-message', {
        conversationId,
        senderId: FARMER_ID,
        content: messages[0].content,
      });
    }, 10000);

    test('should show typing indicators', (done) => {
      const conversationId = 'conv-typing-123';
      let typingReceived = false;
      let stoppedTyping = false;

      buyerSocket.on('user-typing', (data) => {
        if (data.userId === FARMER_ID) {
          if (data.isTyping) {
            typingReceived = true;
          } else {
            stoppedTyping = true;
          }

          if (typingReceived && stoppedTyping) {
            done();
          }
        }
      });

      // Farmer starts typing
      farmerSocket.emit('typing', {
        conversationId,
        userId: FARMER_ID,
        isTyping: true,
      });

      // Farmer stops typing after 1 second
      setTimeout(() => {
        farmerSocket.emit('typing', {
          conversationId,
          userId: FARMER_ID,
          isTyping: false,
        });
      }, 1000);
    }, 5000);
  });

  describe('Price Update Flow', () => {
    test('should broadcast price updates to all connected users', (done) => {
      const productId = 'tomato';
      const newPrice = 55;
      let farmerReceived = false;
      let buyerReceived = false;

      const checkBothReceived = () => {
        if (farmerReceived && buyerReceived) {
          done();
        }
      };

      farmerSocket.on('price-update', (data) => {
        if (data.productId === productId) {
          expect(data.newPrice).toBe(newPrice);
          farmerReceived = true;
          checkBothReceived();
        }
      });

      buyerSocket.on('price-update', (data) => {
        if (data.productId === productId) {
          expect(data.newPrice).toBe(newPrice);
          buyerReceived = true;
          checkBothReceived();
        }
      });

      // Emit price update
      farmerSocket.emit('update-price', {
        productId,
        newPrice,
      });
    }, 5000);
  });

  describe('Payment Flow', () => {
    test('should handle complete payment lifecycle', (done) => {
      const paymentId = 'pay-123';
      const orderId = 'order-123';
      const amount = 5000;
      const statuses = ['INITIATED', 'PROCESSING', 'SUCCESS'];
      let statusIndex = 0;

      buyerSocket.on('payment-update', (data) => {
        expect(data.paymentId).toBe(paymentId);
        expect(data.status).toBe(statuses[statusIndex]);
        
        statusIndex++;
        
        if (statusIndex === statuses.length) {
          done();
        } else {
          setTimeout(() => {
            farmerSocket.emit('update-payment-status', {
              paymentId,
              orderId,
              amount,
              status: statuses[statusIndex],
            });
          }, 100);
        }
      });

      // Start payment flow
      farmerSocket.emit('update-payment-status', {
        paymentId,
        orderId,
        amount,
        status: statuses[0],
      });
    }, 5000);
  });

  describe('Quality Scan Flow', () => {
    test('should notify farmer of quality scan completion', (done) => {
      const scanId = 'scan-123';
      const productId = 'product-123';
      const grade = 'A+';
      const score = 95;

      farmerSocket.on('quality-scan-complete', (data) => {
        expect(data.scanId).toBe(scanId);
        expect(data.productId).toBe(productId);
        expect(data.grade).toBe(grade);
        expect(data.score).toBe(score);
        done();
      });

      // Simulate quality scan completion
      buyerSocket.emit('complete-quality-scan', {
        scanId,
        productId,
        grade,
        score,
      });
    }, 5000);
  });

  describe('Tender Flow', () => {
    test('should handle tender bid notifications', (done) => {
      const tenderId = 'tender-123';
      const bidId = 'bid-456';
      let farmerNotified = false;
      let buyerNotified = false;

      const checkBothNotified = () => {
        if (farmerNotified && buyerNotified) {
          done();
        }
      };

      farmerSocket.on('tender-update', (data) => {
        expect(data.tenderId).toBe(tenderId);
        farmerNotified = true;
        checkBothNotified();
      });

      buyerSocket.on('bid:update', (data) => {
        expect(data.bidId).toBe(bidId);
        buyerNotified = true;
        checkBothNotified();
      });

      // Buyer places bid
      buyerSocket.emit('place-bid', {
        tenderId,
        bidId,
        amount: 10000,
      });
    }, 5000);
  });

  describe('System Announcements', () => {
    test('should broadcast announcements to all users', (done) => {
      const announcement = {
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight',
        type: 'info' as const,
      };
      let farmerReceived = false;
      let buyerReceived = false;

      const checkBothReceived = () => {
        if (farmerReceived && buyerReceived) {
          done();
        }
      };

      farmerSocket.on('system-announcement', (data) => {
        expect(data.title).toBe(announcement.title);
        farmerReceived = true;
        checkBothReceived();
      });

      buyerSocket.on('system-announcement', (data) => {
        expect(data.title).toBe(announcement.title);
        buyerReceived = true;
        checkBothReceived();
      });

      // Broadcast announcement
      farmerSocket.emit('broadcast-announcement', announcement);
    }, 5000);
  });
});
