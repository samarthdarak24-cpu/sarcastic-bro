import { Test, TestingModule } from '@nestjs/testing';
import { CropService } from '../crop.service';
import { PrismaService } from '../prisma.service';

describe('CropService', () => {
  let service: CropService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            notification: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CropService>(CropService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createCrop', () => {
    it('should create a crop with all required fields', async () => {
      const cropData = {
        name: 'Wheat',
        category: 'Grains',
        price: 500,
        quantity: 100,
        farmerId: '1',
        description: 'High quality wheat',
        location: 'Punjab',
      };

      jest.spyOn(prismaService.product, 'create').mockResolvedValue({
        id: '1',
        ...cropData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.createCrop(cropData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Wheat');
      expect(result.price).toBe(500);
      expect(prismaService.product.create).toHaveBeenCalled();
    });

    it('should validate price is positive', async () => {
      const invalidCrop = {
        name: 'Wheat',
        price: -100,
        quantity: 100,
        farmerId: '1',
      };

      await expect(service.createCrop(invalidCrop as any)).rejects.toThrow(
        'Price must be positive'
      );
    });

    it('should validate quantity is positive', async () => {
      const invalidCrop = {
        name: 'Wheat',
        price: 500,
        quantity: -10,
        farmerId: '1',
      };

      await expect(service.createCrop(invalidCrop as any)).rejects.toThrow(
        'Quantity must be positive'
      );
    });
  });

  describe('getCropById', () => {
    it('should retrieve crop by ID', async () => {
      const cropId = '1';
      const mockCrop = {
        id: cropId,
        name: 'Wheat',
        price: 500,
        quantity: 100,
      };

      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(mockCrop as any);

      const result = await service.getCropById(cropId);

      expect(result).toEqual(mockCrop);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: cropId },
      });
    });

    it('should return null if crop not found', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);

      const result = await service.getCropById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateCrop', () => {
    it('should update crop with new data', async () => {
      const cropId = '1';
      const updateData = { price: 600, quantity: 80 };

      jest.spyOn(prismaService.product, 'update').mockResolvedValue({
        id: cropId,
        ...updateData,
      } as any);

      const result = await service.updateCrop(cropId, updateData);

      expect(result.price).toBe(600);
      expect(result.quantity).toBe(80);
    });
  });

  describe('deleteCrop', () => {
    it('should delete crop and notify farmer', async () => {
      const cropId = '1';
      const farmerId = '1';

      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue({
        id: cropId,
        farmerId,
      } as any);

      jest.spyOn(prismaService.product, 'delete').mockResolvedValue({
        id: cropId,
      } as any);

      jest.spyOn(prismaService.notification, 'create').mockResolvedValue({} as any);

      await service.deleteCrop(cropId);

      expect(prismaService.product.delete).toHaveBeenCalledWith({
        where: { id: cropId },
      });
      expect(prismaService.notification.create).toHaveBeenCalled();
    });
  });

  describe('getCropsByFarmer', () => {
    it('should retrieve all crops for a farmer', async () => {
      const farmerId = '1';
      const mockCrops = [
        { id: '1', name: 'Wheat', farmerId },
        { id: '2', name: 'Rice', farmerId },
      ];

      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(mockCrops as any);

      const result = await service.getCropsByFarmer(farmerId);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Wheat');
    });
  });

  describe('outOfStockAutomation', () => {
    it('should mark crop as out of stock when quantity reaches 0', async () => {
      const cropId = '1';

      jest.spyOn(prismaService.product, 'update').mockResolvedValue({
        id: cropId,
        quantity: 0,
        isActive: false,
      } as any);

      await service.updateCrop(cropId, { quantity: 0 });

      expect(prismaService.product.update).toHaveBeenCalled();
    });
  });
});
