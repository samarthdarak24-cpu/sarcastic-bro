import prisma from '../../prisma/client';

interface FarmerFilters {
  search?: string;
  isActive?: boolean;
  page: number;
  limit: number;
}

interface FarmerData {
  name: string;
  phone: string;
  aadhaar: string;
  bankAccount?: string;
  ifsc?: string;
  district?: string;
  photos?: string[];
}

export class FarmerService {
  /**
   * Get all farmers for an FPO
   */
  async getFarmers(fpoUserId: string, filters: FarmerFilters) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const where: any = { fpoId: fpo.id };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { aadhaar: { contains: filters.search } }
      ];
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [farmers, total] = await Promise.all([
      prisma.fPOFarmer.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { crops: true }
          }
        }
      }),
      prisma.fPOFarmer.count({ where })
    ]);

    return {
      farmers,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit)
      }
    };
  }

  /**
   * Add new farmer to FPO
   */
  async addFarmer(fpoUserId: string, data: FarmerData) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    // Check if farmer already exists
    const existing = await prisma.fPOFarmer.findFirst({
      where: {
        fpoId: fpo.id,
        OR: [
          { phone: data.phone },
          { aadhaar: data.aadhaar }
        ]
      }
    });

    if (existing) {
      throw new Error('Farmer with this phone or Aadhaar already exists');
    }

    const farmer = await prisma.fPOFarmer.create({
      data: {
        fpoId: fpo.id,
        name: data.name,
        phone: data.phone,
        aadhaar: data.aadhaar,
        bankAccount: data.bankAccount,
        ifsc: data.ifsc,
        district: data.district || fpo.district,
        photos: data.photos || [],
        isActive: true
      }
    });

    return farmer;
  }

  /**
   * Get farmer by ID
   */
  async getFarmerById(fpoUserId: string, farmerId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const farmer = await prisma.fPOFarmer.findFirst({
      where: {
        id: farmerId,
        fpoId: fpo.id
      },
      include: {
        crops: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { crops: true }
        }
      }
    });

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    return farmer;
  }

  /**
   * Update farmer details
   */
  async updateFarmer(fpoUserId: string, farmerId: string, data: Partial<FarmerData>) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const farmer = await prisma.fPOFarmer.findFirst({
      where: {
        id: farmerId,
        fpoId: fpo.id
      }
    });

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const updated = await prisma.fPOFarmer.update({
      where: { id: farmerId },
      data: {
        name: data.name,
        phone: data.phone,
        bankAccount: data.bankAccount,
        ifsc: data.ifsc,
        district: data.district,
        photos: data.photos
      }
    });

    return updated;
  }

  /**
   * Deactivate farmer
   */
  async deactivateFarmer(fpoUserId: string, farmerId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const farmer = await prisma.fPOFarmer.findFirst({
      where: {
        id: farmerId,
        fpoId: fpo.id
      }
    });

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    await prisma.fPOFarmer.update({
      where: { id: farmerId },
      data: { isActive: false }
    });
  }

  /**
   * Get farmer's products
   */
  async getFarmerProducts(fpoUserId: string, farmerId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const farmer = await prisma.fPOFarmer.findFirst({
      where: {
        id: farmerId,
        fpoId: fpo.id
      }
    });

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const products = await prisma.crop.findMany({
      where: { fpoFarmerId: farmerId },
      orderBy: { createdAt: 'desc' }
    });

    return products;
  }
}
