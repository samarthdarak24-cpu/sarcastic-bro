import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { buyerSupplierService } from '@/services/buyerSupplierService';
import { buyerBidService } from '@/services/buyerBidService';
import { buyerPreBookingService } from '@/services/buyerPreBookingService';
import { buyerReputationService } from '@/services/buyerReputationService';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Buyer Services', () => {
  const mockToken = 'test-token-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buyerSupplierService', () => {
    it('should fetch suppliers with filters', async () => {
      const mockResponse = {
        data: {
          suppliers: [
            { id: '1', businessName: 'Test Supplier', rating: 4.5 }
          ],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await buyerSupplierService.getSuppliers(
        { district: 'Pune', minRating: 4.0 },
        mockToken
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/buyer/suppliers'),
        expect.objectContaining({
          params: { district: 'Pune', minRating: 4.0 },
          headers: { Authorization: `Bearer ${mockToken}` }
        })
      );

      expect(result.suppliers).toHaveLength(1);
      expect(result.suppliers[0].businessName).toBe('Test Supplier');
    });

    it('should fetch supplier by ID', async () => {
      const mockResponse = {
        data: { id: '1', businessName: 'Test Supplier', rating: 4.5 }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await buyerSupplierService.getSupplierById('1', mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/buyer/suppliers/1'),
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` }
        })
      );

      expect(result.id).toBe('1');
    });

    it('should fetch supplier analytics', async () => {
      const mockResponse = {
        data: {
          totalOrders: 50,
          completedOrders: 45,
          totalRevenue: 250000,
          avgDeliveryTime: 3
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await buyerSupplierService.getSupplierAnalytics('1', mockToken);

      expect(result.totalOrders).toBe(50);
      expect(result.completedOrders).toBe(45);
    });
  });

  describe('buyerBidService', () => {
    it('should fetch bids with filters', async () => {
      const mockResponse = {
        data: {
          bids: [
            { id: '1', productId: 'p1', pricePerUnit: 420, status: 'PENDING' }
          ],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await buyerBidService.getBids({ status: 'PENDING' }, mockToken);

      expect(result.bids).toHaveLength(1);
      expect(result.bids[0].status).toBe('PENDING');
    });

    it('should place a new bid', async () => {
      const mockResponse = {
        data: {
          id: '1',
          productId: 'p1',
          quantity: 100,
          pricePerUnit: 420,
          status: 'PENDING'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const bidData = {
        productId: 'p1',
        quantity: 100,
        pricePerUnit: 420,
        validUntil: new Date('2024-12-31'),
        notes: 'Test bid'
      };

      const result = await buyerBidService.placeBid(bidData, mockToken);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/buyer/bids'),
        bidData,
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` }
        })
      );

      expect(result.id).toBe('1');
      expect(result.status).toBe('PENDING');
    });

    it('should update a bid', async () => {
      const mockResponse = {
        data: {
          id: '1',
          status: 'ACCEPTED'
        }
      };

      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      const result = await buyerBidService.updateBid('1', { status: 'ACCEPTED' }, mockToken);

      expect(result.status).toBe('ACCEPTED');
    });
  });

  describe('buyerPreBookingService', () => {
    it('should fetch pre-bookings', async () => {
      const mockResponse = {
        data: {
          preBookings: [
            { id: '1', quantity: 500, status: 'PENDING' }
          ],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await buyerPreBookingService.getPreBookings({}, mockToken);

      expect(result.preBookings).toHaveLength(1);
    });

    it('should create a pre-booking', async () => {
      const mockResponse = {
        data: {
          id: '1',
          bulkProductId: 'bp1',
          quantity: 500,
          status: 'PENDING'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const bookingData = {
        bulkProductId: 'bp1',
        quantity: 500,
        pricePerUnit: 450,
        targetDate: new Date('2024-12-01'),
        notes: 'Test booking'
      };

      const result = await buyerPreBookingService.createPreBooking(bookingData, mockToken);

      expect(result.id).toBe('1');
      expect(result.status).toBe('PENDING');
    });

    it('should cancel a pre-booking', async () => {
      const mockResponse = {
        data: {
          id: '1',
          status: 'CANCELLED'
        }
      };

      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const result = await buyerPreBookingService.cancelPreBooking('1', mockToken);

      expect(result.status).toBe('CANCELLED');
    });
  });

  describe('buyerReputationService', () => {
    it('should fetch reputation', async () => {
      const mockResponse = {
        data: {
          userId: 'u1',
          score: 95.5,
          totalPurchases: 50,
          trustScore: 4.8
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await buyerReputationService.getReputation(mockToken);

      expect(result.score).toBe(95.5);
      expect(result.totalPurchases).toBe(50);
    });

    it('should fetch reputation history', async () => {
      const mockResponse = {
        data: {
          history: [
            { id: '1', action: 'PURCHASE', scoreBefore: 90, scoreAfter: 95, change: 5 }
          ],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await buyerReputationService.getReputationHistory(1, 20, mockToken);

      expect(result.history).toHaveLength(1);
      expect(result.history[0].change).toBe(5);
    });

    it('should fetch reputation breakdown', async () => {
      const mockResponse = {
        data: {
          overall: 95.5,
          trustScore: 4.8,
          breakdown: {
            paymentReliability: 98,
            orderCompletion: 95,
            cancellationRate: 2
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await buyerReputationService.getReputationBreakdown(mockToken);

      expect(result.overall).toBe(95.5);
      expect(result.breakdown.paymentReliability).toBe(98);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        buyerSupplierService.getSuppliers({}, mockToken)
      ).rejects.toThrow('Network error');
    });

    it('should handle 401 unauthorized', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 401, data: { error: 'Unauthorized' } }
      });

      await expect(
        buyerSupplierService.getSuppliers({}, mockToken)
      ).rejects.toMatchObject({
        response: { status: 401 }
      });
    });

    it('should handle 404 not found', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 404, data: { error: 'Not found' } }
      });

      await expect(
        buyerSupplierService.getSupplierById('invalid-id', mockToken)
      ).rejects.toMatchObject({
        response: { status: 404 }
      });
    });
  });
});
