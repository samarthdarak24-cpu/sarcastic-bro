import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from '../chat.service';
import { PrismaService } from '../prisma.service';

describe('ChatService', () => {
  let service: ChatService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: PrismaService,
          useValue: {
            message: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
            conversation: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('sendMessage', () => {
    it('should create message with TEXT type', async () => {
      const messageData = {
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Hello, is this product available?',
        type: 'TEXT',
      };

      jest.spyOn(prismaService.message, 'create').mockResolvedValue({
        id: 'msg-1',
        ...messageData,
        isRead: false,
        createdAt: new Date(),
      } as any);

      const result = await service.sendMessage(messageData);

      expect(result.content).toBe('Hello, is this product available?');
      expect(result.type).toBe('TEXT');
      expect(result.isRead).toBe(false);
    });

    it('should validate message length', async () => {
      const longMessage = 'a'.repeat(5001);

      await expect(
        service.sendMessage({
          conversationId: 'conv-1',
          senderId: 'user-1',
          content: longMessage,
          type: 'TEXT',
        })
      ).rejects.toThrow('Message exceeds maximum length');
    });
  });

  describe('getConversation', () => {
    it('should retrieve conversation with messages', async () => {
      const conversationId = 'conv-1';
      const mockMessages = [
        { id: 'msg-1', content: 'Hello', isRead: true },
        { id: 'msg-2', content: 'Hi there', isRead: false },
      ];

      jest.spyOn(prismaService.message, 'findMany').mockResolvedValue(mockMessages as any);

      const result = await service.getConversation(conversationId);

      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('Hello');
    });

    it('should support pagination', async () => {
      const conversationId = 'conv-1';
      const mockMessages = Array(20).fill(null).map((_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i}`,
      }));

      jest.spyOn(prismaService.message, 'findMany').mockResolvedValue(mockMessages as any);

      const result = await service.getConversation(conversationId, { skip: 0, take: 20 });

      expect(result).toHaveLength(20);
    });
  });

  describe('markMessageAsRead', () => {
    it('should update message read status', async () => {
      const messageId = 'msg-1';

      jest.spyOn(prismaService.message, 'update').mockResolvedValue({
        id: messageId,
        isRead: true,
      } as any);

      const result = await service.markMessageAsRead(messageId);

      expect(result.isRead).toBe(true);
    });
  });

  describe('searchMessages', () => {
    it('should search messages by keyword', async () => {
      const keyword = 'price';
      const mockResults = [
        { id: 'msg-1', content: 'What is the price?' },
        { id: 'msg-2', content: 'Price negotiation' },
      ];

      jest.spyOn(prismaService.message, 'findMany').mockResolvedValue(mockResults as any);

      const result = await service.searchMessages('conv-1', keyword);

      expect(result).toHaveLength(2);
      expect(result[0].content).toContain('price');
    });
  });

  describe('addEmojiReaction', () => {
    it('should add emoji reaction to message', async () => {
      const messageId = 'msg-1';
      const emoji = '👍';

      jest.spyOn(prismaService.message, 'update').mockResolvedValue({
        id: messageId,
        reactions: [emoji],
      } as any);

      const result = await service.addEmojiReaction(messageId, emoji);

      expect(result.reactions).toContain(emoji);
    });
  });

  describe('createConversation', () => {
    it('should create conversation between two users', async () => {
      const conversationData = {
        participantIds: ['user-1', 'user-2'],
        orderId: 'order-1',
      };

      jest.spyOn(prismaService.conversation, 'create').mockResolvedValue({
        id: 'conv-1',
        ...conversationData,
        createdAt: new Date(),
      } as any);

      const result = await service.createConversation(conversationData);

      expect(result.participantIds).toHaveLength(2);
    });
  });
});
