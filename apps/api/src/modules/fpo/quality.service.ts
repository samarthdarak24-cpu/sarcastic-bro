import prisma from '../../prisma/client';

export class QualityService {
  /**
   * Get pending quality certificates for verification
   */
  async getPendingCertificates(fpoUserId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const fpoCropIds = await prisma.crop.findMany({
      where: { fpoId: fpo.id },
      select: { id: true }
    });

    const fpoLotIds = await prisma.aggregatedLot.findMany({
      where: { fpoId: fpo.id },
      select: { id: true }
    });

    const certificates = await prisma.qualityCertificate.findMany({
      where: {
        verifiedByFPO: false,
        OR: [
          { cropId: { in: fpoCropIds.map(c => c.id) } },
          { lotId: { in: fpoLotIds.map(l => l.id) } }
        ]
      },
      orderBy: { uploadedAt: 'desc' }
    });

    return certificates;
  }

  /**
   * Verify quality certificate
   */
  async verifyCertificate(fpoUserId: string, certificateId: string, approved: boolean, aiScore?: number) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const certificate = await prisma.qualityCertificate.findUnique({
      where: { id: certificateId }
    });

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    // Update certificate
    const updated = await prisma.qualityCertificate.update({
      where: { id: certificateId },
      data: {
        verifiedByFPO: approved,
        aiScore: aiScore
      }
    });

    // If approved, update the crop/lot with certificate URL
    if (approved && certificate.cropId) {
      await prisma.crop.update({
        where: { id: certificate.cropId },
        data: { qualityCertUrl: certificate.fileUrl }
      });
    } else if (approved && certificate.lotId) {
      await prisma.aggregatedLot.update({
        where: { id: certificate.lotId },
        data: { qualityCertUrl: certificate.fileUrl }
      });
    }

    return updated;
  }

  /**
   * Upload quality certificate for product/lot
   */
  async uploadCertificate(fpoUserId: string, data: {
    cropId?: string;
    lotId?: string;
    fileUrl: string;
  }) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    if (!data.cropId && !data.lotId) {
      throw new Error('Either cropId or lotId must be provided');
    }

    // Verify ownership
    if (data.cropId) {
      const crop = await prisma.crop.findFirst({
        where: { id: data.cropId, fpoId: fpo.id }
      });
      if (!crop) {
        throw new Error('Product not found');
      }
    }

    if (data.lotId) {
      const lot = await prisma.aggregatedLot.findFirst({
        where: { id: data.lotId, fpoId: fpo.id }
      });
      if (!lot) {
        throw new Error('Lot not found');
      }
    }

    const certificate = await prisma.qualityCertificate.create({
      data: {
        cropId: data.cropId,
        lotId: data.lotId,
        uploadedBy: fpoUserId,
        fileUrl: data.fileUrl,
        verifiedByFPO: true // Auto-verified since FPO is uploading
      }
    });

    // Update product/lot with certificate URL
    if (data.cropId) {
      await prisma.crop.update({
        where: { id: data.cropId },
        data: { qualityCertUrl: data.fileUrl }
      });
    } else if (data.lotId) {
      await prisma.aggregatedLot.update({
        where: { id: data.lotId },
        data: { qualityCertUrl: data.fileUrl }
      });
    }

    return certificate;
  }

  /**
   * Get all certificates for FPO
   */
  async getAllCertificates(fpoUserId: string, filters: any) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const fpoCropIds = await prisma.crop.findMany({
      where: { fpoId: fpo.id },
      select: { id: true }
    });

    const fpoLotIds = await prisma.aggregatedLot.findMany({
      where: { fpoId: fpo.id },
      select: { id: true }
    });

    const where: any = {
      OR: [
        { cropId: { in: fpoCropIds.map(c => c.id) } },
        { lotId: { in: fpoLotIds.map(l => l.id) } }
      ]
    };

    if (filters.verifiedByFPO !== undefined) {
      where.verifiedByFPO = filters.verifiedByFPO === 'true';
    }

    const certificates = await prisma.qualityCertificate.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit
    });

    const total = await prisma.qualityCertificate.count({ where });

    return {
      certificates,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit)
      }
    };
  }
}
