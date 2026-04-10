import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadToCloudinary } from '../../config/cloudinary';

const prisma = new PrismaClient();

// Upload quality certificate
export const uploadCertificate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    
    const {
      cropId,
      lotId,
      certificateType,
      certificateNumber,
      issuerName,
      issueDate,
      expiryDate,
      notes,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Certificate file is required' });
    }

    if (!cropId && !lotId) {
      return res.status(400).json({ error: 'Either cropId or lotId is required' });
    }

    // Verify ownership
    if (cropId) {
      const crop = await prisma.crop.findUnique({ where: { id: cropId } });
      if (!crop) {
        return res.status(404).json({ error: 'Crop not found' });
      }
      
      // Farmer can only upload for their own crops
      if (userRole === 'FARMER' && crop.farmerId !== userId) {
        return res.status(403).json({ error: 'Not authorized to upload certificate for this crop' });
      }
      
      // FPO can upload for crops in their FPO
      if (userRole === 'FPO') {
        const fpo = await prisma.fPO.findUnique({ where: { adminUserId: userId } });
        if (!fpo || crop.fpoId !== fpo.id) {
          return res.status(403).json({ error: 'Not authorized to upload certificate for this crop' });
        }
      }
    }

    if (lotId) {
      const lot = await prisma.aggregatedLot.findUnique({ where: { id: lotId } });
      if (!lot) {
        return res.status(404).json({ error: 'Aggregated lot not found' });
      }
      
      // Only FPO can upload for lots
      if (userRole !== 'FPO') {
        return res.status(403).json({ error: 'Only FPO can upload certificates for aggregated lots' });
      }
      
      const fpo = await prisma.fPO.findUnique({ where: { adminUserId: userId } });
      if (!fpo || lot.fpoId !== fpo.id) {
        return res.status(403).json({ error: 'Not authorized to upload certificate for this lot' });
      }
    }

    // Upload file to Cloudinary
    const fileUrl = await uploadToCloudinary(req.file.buffer, 'quality-certificates');

    // Create certificate record
    const certificate = await prisma.qualityCertificate.create({
      data: {
        cropId: cropId || null,
        lotId: lotId || null,
        uploadedBy: userId,
        certificateType: certificateType || 'FPO_VERIFIED',
        certificateNumber,
        issuerName,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        fileUrl,
        verifiedByFPO: userRole === 'FPO',
        verifiedBy: userRole === 'FPO' ? userId : null,
        verifiedAt: userRole === 'FPO' ? new Date() : null,
        notes,
      },
    });

    // Update crop/lot with certificate URL
    if (cropId) {
      await prisma.crop.update({
        where: { id: cropId },
        data: { qualityCertUrl: fileUrl },
      });
    }
    if (lotId) {
      await prisma.aggregatedLot.update({
        where: { id: lotId },
        data: { qualityCertUrl: fileUrl },
      });
    }

    res.status(201).json({
      message: 'Certificate uploaded successfully',
      certificate,
    });
  } catch (error) {
    console.error('Upload certificate error:', error);
    res.status(500).json({ error: 'Failed to upload certificate' });
  }
};

// Get certificate by ID
export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const certificate = await prisma.qualityCertificate.findUnique({
      where: { id },
      include: {
        crop: {
          include: {
            farmer: { select: { id: true, name: true, phone: true } },
            fpoFarmer: { select: { id: true, name: true, phone: true } },
          },
        },
        lot: {
          include: {
            fpo: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
};

// Get certificates for a crop
export const getCertificatesForCrop = async (req: Request, res: Response) => {
  try {
    const { cropId } = req.params;

    const certificates = await prisma.qualityCertificate.findMany({
      where: { cropId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json(certificates);
  } catch (error) {
    console.error('Get crop certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};

// Get certificates for an aggregated lot
export const getCertificatesForLot = async (req: Request, res: Response) => {
  try {
    const { lotId } = req.params;

    const certificates = await prisma.qualityCertificate.findMany({
      where: { lotId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json(certificates);
  } catch (error) {
    console.error('Get lot certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};

// Get my certificates
export const getMyCertificates = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const userId = user.id;
    const userRole = user.role;

    let certificates;

    if (userRole === 'FPO') {
      // FPO sees all certificates in their FPO
      const fpo = await prisma.fPO.findUnique({ where: { adminUserId: userId } });
      if (!fpo) {
        return res.status(404).json({ error: 'FPO not found' });
      }

      certificates = await prisma.qualityCertificate.findMany({
        where: {
          OR: [
            { uploadedBy: userId },
            {
              crop: { fpoId: fpo.id },
            },
            {
              lot: { fpoId: fpo.id },
            },
          ],
        },
        include: {
          crop: { select: { id: true, cropName: true, variety: true, quantity: true } },
          lot: { select: { id: true, cropName: true, totalQuantity: true } },
        },
        orderBy: { uploadedAt: 'desc' },
      });
    } else {
      // Farmer sees only their certificates
      certificates = await prisma.qualityCertificate.findMany({
        where: {
          OR: [
            { uploadedBy: userId },
            { crop: { farmerId: userId } },
          ],
        },
        include: {
          crop: { select: { id: true, cropName: true, variety: true, quantity: true } },
        },
        orderBy: { uploadedAt: 'desc' },
      });
    }

    res.json(certificates);
  } catch (error) {
    console.error('Get my certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates. Please try again.' });
  }
};

// Verify certificate (FPO only)
export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const { id } = req.params;

    if (userRole !== 'FPO') {
      return res.status(403).json({ error: 'Only FPO can verify certificates' });
    }

    const certificate = await prisma.qualityCertificate.findUnique({
      where: { id },
      include: { crop: true, lot: true },
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Verify FPO owns this crop/lot
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: userId } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    if (certificate.crop && certificate.crop.fpoId !== fpo.id) {
      return res.status(403).json({ error: 'Not authorized to verify this certificate' });
    }

    if (certificate.lot && certificate.lot.fpoId !== fpo.id) {
      return res.status(403).json({ error: 'Not authorized to verify this certificate' });
    }

    // Update verification status
    const updated = await prisma.qualityCertificate.update({
      where: { id },
      data: {
        verifiedByFPO: true,
        verifiedBy: userId,
        verifiedAt: new Date(),
      },
    });

    res.json({
      message: 'Certificate verified successfully',
      certificate: updated,
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
};

// Delete certificate
export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const { id } = req.params;

    const certificate = await prisma.qualityCertificate.findUnique({
      where: { id },
      include: { crop: true, lot: true },
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Check authorization
    if (userRole === 'FARMER' && certificate.uploadedBy !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this certificate' });
    }

    if (userRole === 'FPO') {
      const fpo = await prisma.fPO.findUnique({ where: { adminUserId: userId } });
      if (!fpo) {
        return res.status(404).json({ error: 'FPO not found' });
      }

      const isAuthorized =
        certificate.uploadedBy === userId ||
        (certificate.crop && certificate.crop.fpoId === fpo.id) ||
        (certificate.lot && certificate.lot.fpoId === fpo.id);

      if (!isAuthorized) {
        return res.status(403).json({ error: 'Not authorized to delete this certificate' });
      }
    }

    await prisma.qualityCertificate.delete({ where: { id } });

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
};

// Generate AI quality score (mock implementation)
export const generateAIScore = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { cropId } = req.body;

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    if (!cropId) {
      return res.status(400).json({ error: 'cropId is required' });
    }

    // Verify crop ownership
    const crop = await prisma.crop.findUnique({ where: { id: cropId } });
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files as Express.Multer.File[]) {
      const url = await uploadToCloudinary(file.buffer, 'crop-quality-images');
      imageUrls.push(url);
    }

    // Mock AI scoring (in production, call actual AI service)
    const aiScore = Math.random() * 20 + 75; // Random score between 75-95

    // Create AI-generated certificate
    const certificate = await prisma.qualityCertificate.create({
      data: {
        cropId,
        uploadedBy: userId,
        certificateType: 'AI_GENERATED',
        certificateNumber: `AI/${new Date().getFullYear()}/${crop.cropName.substring(0, 3).toUpperCase()}/${Date.now()}`,
        issuerName: 'AgriTrust AI Quality System',
        issueDate: new Date(),
        fileUrl: imageUrls[0], // Use first image as certificate
        aiScore: Math.round(aiScore * 10) / 10,
        notes: `AI analysis based on ${imageUrls.length} images. Quality score: ${Math.round(aiScore * 10) / 10}/100`,
      },
    });

    res.status(201).json({
      message: 'AI quality score generated successfully',
      certificate,
      aiScore: Math.round(aiScore * 10) / 10,
      imageUrls,
    });
  } catch (error) {
    console.error('Generate AI score error:', error);
    res.status(500).json({ error: 'Failed to generate AI score' });
  }
};
