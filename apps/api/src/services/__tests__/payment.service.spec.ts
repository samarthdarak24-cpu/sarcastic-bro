import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { PrismaService } from '../prisma.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PrismaService,
          useValue: {
            payment: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
            },
            invoice: {
              create: jest.fn(),
            },
            notification: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('initiatePayment', () => {
    it('should create payment with INITIATED status', async () => {
      const paymentData = {
        orderId: 'order-1',
        amount: 25000,
        method: 'RAZORPAY',
        buyerId: 'buyer-1',
      };

      jest.spyOn(prismaService.payment, 'create').mockResolvedValue({
        id: 'pay-1',
        ...paymentData,
        status: 'INITIATED',
        createdAt: new Date(),
      } as any);

      const result = await service.initiatePayment(paymentData);

      expect(result.status).toBe('INITIATED');
      expect(result.amount).toBe(25000);
    });

    it('should validate payment method', async () => {
      const invalidPayment = {
        orderId: 'order-1',
        amount: 25000,
        method: 'INVALID_METHOD',
        buyerId: 'buyer-1',
      };

      await expect(service.initiatePayment(invalidPayment as any)).rejects.toThrow(
        'Invalid payment method'
      );
    });

    it('should validate amount is positive', async () => {
      const invalidPayment = {
        orderId: 'order-1',
        amount: -1000,
        method: 'RAZORPAY',
        buyerId: 'buyer-1',
      };

      await expect(service.initiatePayment(invalidPayment as any)).rejects.toThrow(
        'Amount must be positive'
      );
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment and update status to SUCCESS', async () => {
      const paymentId = 'pay-1';
      const verificationData = {
        razorpayOrderId: 'order-123',
        razorpayPaymentId: 'pay-456',
        razorpaySignature: 'signature',
      };

      jest.spyOn(prismaService.payment, 'findUnique').mockResolvedValue({
        id: paymentId,
        status: 'INITIATED',
      } as any);

      jest.spyOn(prismaService.payment, 'update').mockResolvedValue({
        id: paymentId,
        status: 'SUCCESS',
      } as any);

      const result = await service.verifyPayment(paymentId, verificationData);

      expect(result.status).toBe('SUCCESS');
    });

    it('should handle payment verification failure', async () => {
      jest.spyOn(prismaService.payment, 'findUnique').mockResolvedValue({
        id: 'pay-1',
        status: 'INITIATED',
      } as any);

      jest.spyOn(prismaService.payment, 'update').mockResolvedValue({
        id: 'pay-1',
        status: 'FAILED',
      } as any);

      const result = await service.verifyPayment('pay-1', {
        razorpayOrderId: 'invalid',
        razorpayPaymentId: 'invalid',
        razorpaySignature: 'invalid',
      });

      expect(result.status).toBe('FAILED');
    });
  });

  describe('generateInvoice', () => {
    it('should generate invoice for successful payment', async () => {
      const paymentId = 'pay-1';

      jest.spyOn(prismaService.payment, 'findUnique').mockResolvedValue({
        id: paymentId,
        status: 'SUCCESS',
        amount: 25000,
        orderId: 'order-1',
      } as any);

      jest.spyOn(prismaService.invoice, 'create').mockResolvedValue({
        id: 'inv-1',
        paymentId,
        invoiceNumber: 'INV-001',
        pdfUrl: 'https://example.com/invoices/inv-1.pdf',
      } as any);

      const result = await service.generateInvoice(paymentId);

      expect(result.invoiceNumber).toBeDefined();
      expect(result.pdfUrl).toBeDefined();
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax correctly', async () => {
      const amount = 25000;
      const taxRate = 18; // 18% GST

      const tax = service.calculateTax(amount, taxRate);

      expect(tax).toBe(4500);
    });

    it('should handle zero tax rate', async () => {
      const amount = 25000;
      const tax = service.calculateTax(amount, 0);

      expect(tax).toBe(0);
    });
  });

  describe('getTransactionHistory', () => {
    it('should retrieve payment history for user', async () => {
      const buyerId = 'buyer-1';
      const mockPayments = [
        { id: 'pay-1', amount: 25000, status: 'SUCCESS' },
        { id: 'pay-2', amount: 15000, status: 'SUCCESS' },
      ];

      jest.spyOn(prismaService.payment, 'findMany').mockResolvedValue(mockPayments as any);

      const result = await service.getTransactionHistory(buyerId);

      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('SUCCESS');
    });
  });

  describe('refundPayment', () => {
    it('should refund successful payment', async () => {
      const paymentId = 'pay-1';

      jest.spyOn(prismaService.payment, 'findUnique').mockResolvedValue({
        id: paymentId,
        status: 'SUCCESS',
        amount: 25000,
      } as any);

      jest.spyOn(prismaService.payment, 'update').mockResolvedValue({
        id: paymentId,
        status: 'REFUNDED',
      } as any);

      const result = await service.refundPayment(paymentId);

      expect(result.status).toBe('REFUNDED');
    });

    it('should not refund non-successful payment', async () => {
      jest.spyOn(prismaService.payment, 'findUnique').mockResolvedValue({
        id: 'pay-1',
        status: 'FAILED',
      } as any);

      await expect(service.refundPayment('pay-1')).rejects.toThrow(
        'Cannot refund non-successful payment'
      );
    });
  });
});
