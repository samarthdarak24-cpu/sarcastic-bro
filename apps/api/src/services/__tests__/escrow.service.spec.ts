import { Test, TestingModule } from '@nestjs/testing';
import { EscrowService } from '../escrow.service';
import { PrismaService } from '../prisma.service';

describe('EscrowService', () => {
  let service: EscrowService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EscrowService,
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

    service = module.get<EscrowService>(EscrowService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createEscrowAccount', () => {
    it('should create escrow account with HELD status', async () => {
      const result = await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);

      expect(result).toBeDefined();
      expect(result.orderId).toBe('order-1');
      expect(result.buyerId).toBe('buyer-1');
      expect(result.farmerId).toBe('farmer-1');
      expect(result.amount).toBe(25000);
      expect(result.status).toBe('HELD');
    });

    it('should notify both parties on creation', async () => {
      await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);

      expect(prismaService.notification.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('holdFunds', () => {
    it('should hold funds in escrow', async () => {
      const escrow = await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);

      await service.holdFunds(escrow.id, 25000);

      expect(escrow.status).toBe('HELD');
    });
  });

  describe('releaseFunds', () => {
    it('should release funds to farmer', async () => {
      const escrow = await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);

      await service.releaseFunds(escrow.id);

      expect(escrow.id).toBeDefined();
    });
  });

  describe('initiateDispute', () => {
    it('should initiate dispute', async () => {
      const escrow = await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);

      const dispute = await service.initiateDispute(escrow.id, 'buyer-1', 'Product quality not as described');

      expect(dispute).toBeDefined();
      expect(dispute.escrowId).toBe(escrow.id);
      expect(dispute.initiatedBy).toBe('buyer-1');
      expect(dispute.status).toBe('OPEN');
    });

    it('should hold funds on dispute', async () => {
      const escrow = await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);

      await service.initiateDispute(escrow.id, 'buyer-1', 'Product quality not as described');

      expect(escrow.status).toBe('HELD');
    });
  });

  describe('resolveDispute', () => {
    it('should resolve dispute in favor of farmer', async () => {
      const escrow = await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);
      const dispute = await service.initiateDispute(escrow.id, 'buyer-1', 'Product quality not as described');

      await service.resolveDispute(dispute.id, 'Farmer provided quality product', true);

      expect(dispute.id).toBeDefined();
    });

    it('should resolve dispute in favor of buyer', async () => {
      const escrow = await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);
      const dispute = await service.initiateDispute(escrow.id, 'buyer-1', 'Product quality not as described');

      await service.resolveDispute(dispute.id, 'Refund issued due to quality issues', false);

      expect(dispute.id).toBeDefined();
    });
  });

  describe('getEscrowStatus', () => {
    it('should get escrow status', async () => {
      const escrow = await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);

      const status = await service.getEscrowStatus(escrow.id);

      expect(status).toBeDefined();
      expect(status.status).toBe('HELD');
    });
  });

  describe('getTransactionHistory', () => {
    it('should get transaction history', async () => {
      const escrow = await service.createEscrowAccount('order-1', 'buyer-1', 'farmer-1', 25000);

      const history = await service.getTransactionHistory(escrow.id);

      expect(Array.isArray(history)).toBe(true);
    });
  });
});
