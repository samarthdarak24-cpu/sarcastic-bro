import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification.service';
import { PrismaService } from '../prisma.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createNotification', () => {
    it('should create notification', async () => {
      const notificationData = {
        userId: 'user-1',
        type: 'ORDER_PLACED',
        title: 'Order Placed',
        message: 'Your order has been placed successfully',
        relatedId: 'order-1',
      };

      jest.spyOn(prismaService.notification, 'create').mockResolvedValue({
        id: 'notif-1',
        ...notificationData,
        isRead: false,
        createdAt: new Date(),
      } as any);

      const result = await service.createNotification(notificationData);

      expect(result.type).toBe('ORDER_PLACED');
      expect(result.isRead).toBe(false);
    });
  });

  describe('getNotifications', () => {
    it('should retrieve user notifications', async () => {
      const userId = 'user-1';
      const mockNotifications = [
        { id: 'notif-1', type: 'ORDER_PLACED', isRead: false },
        { id: 'notif-2', type: 'PAYMENT_SUCCESS', isRead: true },
      ];

      jest.spyOn(prismaService.notification, 'findMany').mockResolvedValue(mockNotifications as any);

      const result = await service.getNotifications(userId);

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('ORDER_PLACED');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = 'notif-1';

      jest.spyOn(prismaService.notification, 'update').mockResolvedValue({
        id: notificationId,
        isRead: true,
      } as any);

      const result = await service.markAsRead(notificationId);

      expect(result.isRead).toBe(true);
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const notificationId = 'notif-1';

      jest.spyOn(prismaService.notification, 'delete').mockResolvedValue({
        id: notificationId,
      } as any);

      await service.deleteNotification(notificationId);

      expect(prismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: notificationId },
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread notifications', async () => {
      const userId = 'user-1';
      const mockNotifications = [
        { id: 'notif-1', isRead: false },
        { id: 'notif-2', isRead: false },
        { id: 'notif-3', isRead: true },
      ];

      jest.spyOn(prismaService.notification, 'findMany').mockResolvedValue(mockNotifications as any);

      const count = await service.getUnreadCount(userId);

      expect(count).toBe(2);
    });
  });

  describe('sendPushNotification', () => {
    it('should send push notification', async () => {
      const userId = 'user-1';
      const pushData = {
        title: 'New Order',
        body: 'You have a new order',
      };

      const result = await service.sendPushNotification(userId, pushData);

      expect(result).toBe(true);
    });
  });
});
