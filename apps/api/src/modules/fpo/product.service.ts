import prisma from '../../prisma/client';
import { CropGrade } from '@prisma/client';

interface ProductData {
  farmerId: string;
  cropName: string;
  category: string;
  variety: string;
  quantity: number;
  pricePerKg: number;
  grade: CropGrade;
  qualityCertUrl?: string;
}

export class ProductService {
  /**
   * Add product on behalf of farmer (Delegated Listing)
   */
  async addProductForFarmer(fpoUserId: string, data: ProductData) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    // Verify farmer belongs to this FPO
    const farmer = await prisma.fPOFarmer.findFirst({
      where: {
        id: data.farmerId,
        fpoId: fpo.id,
        isActive: true
      }
    });

    if (!farmer) {
      throw new Error('Farmer not found or inactive');
    }

    const product = await prisma.crop.create({
      data: {
        fpoFarmerId: farmer.id,
        fpoId: fpo.id,
        cropName: data.cropName,
        category: data.category,
        variety: data.variety,
        quantity: data.quantity,
        pricePerKg: data.pricePerKg,
        grade: data.grade,
        qualityCertUrl: data.qualityCertUrl,
        status: 'LISTED',
        isAggregated: false
      }
    });

    return product;
  }

  /**
   * Get all products for FPO
   */
  async getProducts(fpoUserId: string, filters: any) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const where: any = { fpoId: fpo.id };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.isAggregated !== undefined) {
      where.isAggregated = filters.isAggregated === 'true';
    }

    if (filters.farmerId) {
      where.fpoFarmerId = filters.farmerId;
    }

    const [products, total] = await Promise.all([
      prisma.crop.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          fpoFarmer: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        }
      }),
      prisma.crop.count({ where })
    ]);

    return {
      products,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit)
      }
    };
  }

  /**
   * Update product details
   */
  async updateProduct(fpoUserId: string, productId: string, data: Partial<ProductData>) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const product = await prisma.crop.findFirst({
      where: {
        id: productId,
        fpoId: fpo.id
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const updated = await prisma.crop.update({
      where: { id: productId },
      data: {
        cropName: data.cropName,
        category: data.category,
        variety: data.variety,
        quantity: data.quantity,
        pricePerKg: data.pricePerKg,
        grade: data.grade,
        qualityCertUrl: data.qualityCertUrl
      }
    });

    return updated;
  }

  /**
   * Delete product
   */
  async deleteProduct(fpoUserId: string, productId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const product = await prisma.crop.findFirst({
      where: {
        id: productId,
        fpoId: fpo.id,
        isAggregated: false // Can't delete aggregated products
      }
    });

    if (!product) {
      throw new Error('Product not found or already aggregated');
    }

    await prisma.crop.delete({
      where: { id: productId }
    });
  }

  /**
   * Get product by ID
   */
  async getProductById(fpoUserId: string, productId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const product = await prisma.crop.findFirst({
      where: {
        id: productId,
        fpoId: fpo.id
      },
      include: {
        fpoFarmer: true,
        aggregatedLot: true
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }
}
