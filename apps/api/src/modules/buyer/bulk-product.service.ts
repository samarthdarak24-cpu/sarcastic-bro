import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BulkProductService {
  async getBulkProducts(filters: {
    category?: string;
    district?: string;
    state?: string;
    minQuantity?: number;
    maxPrice?: number;
    qualityGrade?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) {
    const { 
      category, 
      district, 
      state, 
      minQuantity, 
      maxPrice, 
      qualityGrade,
      page = 1, 
      limit = 20,
      sortBy = 'createdAt'
    } = filters;
    
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true
    };

    if (category) where.category = category;
    if (district) where.district = district;
    if (state) where.state = state;
    if (minQuantity) where.minQuantity = { lte: minQuantity };
    if (maxPrice) where.pricePerUnit = { lte: maxPrice };
    if (qualityGrade) where.qualityGrade = qualityGrade;

    const orderBy: any = {};
    if (sortBy === 'price') orderBy.pricePerUnit = 'asc';
    else if (sortBy === 'quantity') orderBy.maxQuantity = 'desc';
    else orderBy.createdAt = 'desc';

    const [products, total] = await Promise.all([
      prisma.bulkProduct.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              userId: true,
              rating: true,
              responseTime: true
            }
          }
        },
        skip,
        take: limit,
        orderBy
      }),
      prisma.bulkProduct.count({ where })
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getBulkProductById(id: string) {
    const product = await prisma.bulkProduct.findUnique({
      where: { id },
      include: {
        supplier: {
          select: {
            id: true,
            userId: true,
            rating: true,
            responseTime: true
          }
        }
      }
    });

    if (!product) {
      throw new Error('Bulk product not found');
    }

    return product;
  }

  async createInquiry(data: {
    buyerId: string;
    productId: string;
    quantity: number;
    message?: string;
  }) {
    const product = await this.getBulkProductById(data.productId);

    // Create a proposal/inquiry
    const inquiry = await prisma.proposal.create({
      data: {
        senderId: data.buyerId,
        receiverId: product.supplier.userId,
        productId: data.productId,
        quantity: data.quantity,
        pricePerUnit: product.pricePerUnit,
        totalPrice: product.pricePerUnit * data.quantity,
        message: data.message,
        status: 'PENDING',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    // Create notification for supplier
    await prisma.notification.create({
      data: {
        userId: product.supplier.userId,
        type: 'PROPOSAL',
        title: 'New Bulk Inquiry',
        message: `You have received a new inquiry for ${data.quantity} ${product.unit} of ${product.name}`,
        metadata: JSON.stringify({ inquiryId: inquiry.id, productId: data.productId })
      }
    });

    return inquiry;
  }
}
