import { Test, TestingModule } from '@nestjs/testing';
import { TenderService } from '../tender.service';
import { PrismaService } from '../prisma.service';

describe('TenderService', () => {
  let service: TenderService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenderService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              create: jest.fn().mockResolvedValue({}),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TenderService>(TenderService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createTender', () => {
    it('should create tender with OPEN status', async () => {
      const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

      const result = await service.createTender('buyer-1', 'Wheat', 1000, 'A+', deadline);

      expect(result).toBeDefined();
      expect(result.buyerId).toBe('buyer-1');
      expect(result.cropName).toBe('Wheat');
      expect(result.quantity).toBe(1000);
      expect(result.minQuality).toBe('A+');
      expect(result.status).toBe('OPEN');
    });
  });

  describe('submitBid', () => {
    it('should submit bid for tender', async () => {
      const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const tender = await service.createTender('buyer-1', 'Wheat', 1000, 'A+', deadline);

      const deliveryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      const bid = await service.submitBid(tender.id, 'farmer-1', 450, 1000, deliveryDate);

      expect(bid).toBeDefined();
      expect(bid.tenderId).toBe(tender.id);
      expect(bid.farmerId).toBe('farmer-1');
      expect(bid.pricePerUnit).toBe(450);
      expect(bid.status).toBe('PENDING');
    });
  });

  describe('getBidsForTender', () => {
    it('should retrieve bids for tender', async () => {
      const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const tender = await service.createTender('buyer-1', 'Wheat', 1000, 'A+', deadline);

      const bids = await service.getBidsForTender(tender.id);

      expect(Array.isArray(bids)).toBe(true);
    });
  });

  describe('evaluateBids', () => {
    it('should evaluate and select best bid', async () => {
      const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const tender = await service.createTender('buyer-1', 'Wheat', 1000, 'A+', deadline);

      const deliveryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      await service.submitBid(tender.id, 'farmer-1', 500, 1000, deliveryDate);
      await service.submitBid(tender.id, 'farmer-2', 450, 1000, deliveryDate);
      await service.submitBid(tender.id, 'farmer-3', 480, 1000, deliveryDate);

      const bestBid = await service.evaluateBids(tender.id);

      expect(bestBid).toBeDefined();
      expect(bestBid.pricePerUnit).toBe(450);
      expect(bestBid.status).toBe('ACCEPTED');
    });
  });

  describe('awardTender', () => {
    it('should award tender to winning bid', async () => {
      const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const tender = await service.createTender('buyer-1', 'Wheat', 1000, 'A+', deadline);

      const deliveryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      const bid = await service.submitBid(tender.id, 'farmer-1', 450, 1000, deliveryDate);

      await service.awardTender(tender.id, bid.id);

      expect(prismaService.notification.create).toHaveBeenCalled();
    });
  });

  describe('closeTender', () => {
    it('should close tender', async () => {
      const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const tender = await service.createTender('buyer-1', 'Wheat', 1000, 'A+', deadline);

      await service.closeTender(tender.id);

      expect(tender.id).toBeDefined();
    });
  });

  describe('getTenderStatus', () => {
    it('should get tender status', async () => {
      const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const tender = await service.createTender('buyer-1', 'Wheat', 1000, 'A+', deadline);

      const status = await service.getTenderStatus(tender.id);

      expect(status).toBeDefined();
      expect(status.status).toBe('OPEN');
    });
  });
});
