import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../config/cloudinary';

/**
 * Get current user's KYC profile including documents
 */
export const getKYCProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        kycStatus: true,
        rejectionReason: true,
        aadhaar: true,
        gst: true,
        pan: true,
        bankAccount: true,
        ifsc: true,
        bankName: true,
        kycDocuments: {
          select: {
            id: true,
            type: true,
            documentUrl: true,
            verifiedAt: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Submit KYC text details (Aadhaar, GST, etc.)
 */
export const submitKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { aadhaar, gst, pan, bankAccount, ifsc, bankName } = req.body;

    // First check if user exists to provide a better error message if not
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return res.status(404).json({ error: 'User not found in database. Your session might be stale.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        aadhaar,
        gst,
        pan,
        bankAccount,
        ifsc,
        bankName,
        kycStatus: 'PENDING'
      }
    });

    res.json({
      message: 'KYC details submitted successfully',
      kycStatus: updatedUser.kycStatus
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload KYC documents via Multer/Cloudinary
 */
export const uploadKYCDocuments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const files = req.files as Express.Multer.File[];
    const { documentTypes } = req.body; // Expect JSON array of types matching files

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No documents uploaded' });
    }

    const types = JSON.parse(documentTypes || '[]');
    const uploads = [];

    for (let i = 0; i < files.length; i++) {
      const type = types[i] || 'AADHAAR';
      const url = await uploadToCloudinary(files[i].buffer, 'kyc');
      
      uploads.push({
        userId,
        type,
        documentUrl: url
      });
    }

    await prisma.kyCDocument.createMany({
      data: uploads
    });

    res.status(201).json({
      message: `${files.length} KYC documents uploaded successfully`,
      count: files.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Verify KYC status for a user
 */
export const verifyKYCAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { status, rejectionReason } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: status, // VERIFIED, REJECTED
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        kycVerified: status === 'VERIFIED'
      }
    });

    // Notify user via socket (if connected)
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${userId}`).emit('kyc_status_update', {
        status: updatedUser.kycStatus,
        reason: updatedUser.rejectionReason
      });
    }

    res.json({
      message: `KYC status updated to ${status} for user ${userId}`,
      user: {
        id: updatedUser.id,
        kycStatus: updatedUser.kycStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all KYC profiles for verification
 */
export const getAllKYCProfiles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profiles = await prisma.user.findMany({
      include: {
        kycDocuments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(profiles);
  } catch (error) {
    next(error);
  }
};
