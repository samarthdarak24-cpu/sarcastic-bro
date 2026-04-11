// ========================================================================
// FPO Linking Controller
// Handles farmer-FPO linking requests and approvals
// ========================================================================

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── FARMER ENDPOINTS ───────────────────────────────────────────────────

/**
 * Search FPOs by district
 * GET /api/farmer/fpo/search?district=Nanded
 */
export const searchFPOs = async (req: Request, res: Response) => {
  try {
    const { district } = req.query;

    const where: any = {};
    if (district && typeof district === 'string') {
      where.district = {
        contains: district,
        mode: 'insensitive',
      };
    }

    const fpos = await prisma.fPO.findMany({
      where,
      include: {
        admin: {
          select: {
            name: true,
            phone: true,
          },
        },
        _count: {
          select: {
            farmers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      fpos: fpos.map((fpo) => ({
        id: fpo.id,
        name: fpo.name,
        registrationNo: fpo.registrationNo,
        district: fpo.district,
        state: fpo.state,
        bankAccount: fpo.bankAccount,
        ifsc: fpo.ifsc,
        commissionRate: fpo.commissionRate,
        farmerCount: fpo._count.farmers,
        adminName: fpo.admin.name,
        adminPhone: fpo.admin.phone,
      })),
    });
  } catch (error: any) {
    console.error('Search FPOs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search FPOs',
    });
  }
};

/**
 * Create FPO link request
 * POST /api/farmer/fpo/link-request
 */
export const createLinkRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { fpoId, message } = req.body;

    if (!fpoId) {
      return res.status(400).json({
        success: false,
        error: 'FPO ID is required',
      });
    }

    // Check if FPO exists
    const fpo = await prisma.fPO.findUnique({
      where: { id: fpoId },
    });

    if (!fpo) {
      return res.status(404).json({
        success: false,
        error: 'FPO not found',
      });
    }

    // Get farmer details
    const farmer = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farm: true,
      },
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
      });
    }

    // Check if already linked
    if (farmer.fpoLinkStatus === 'LINKED') {
      return res.status(400).json({
        success: false,
        error: 'You are already linked to an FPO',
      });
    }

    // Check if request already exists
    const existingRequest = await prisma.fPOLinkRequest.findFirst({
      where: {
        farmerId: userId,
        fpoId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        error: 'You already have a pending request to this FPO',
      });
    }

    // Create link request
    const linkRequest = await prisma.fPOLinkRequest.create({
      data: {
        farmerId: userId,
        fpoId,
        farmerName: farmer.name,
        farmerPhone: farmer.phone,
        farmerDistrict: farmer.farm?.district || null,
        farmerAadhaar: farmer.aadhaar || null,
        message: message || null,
        status: 'PENDING',
      },
    });

    // Update farmer status to PENDING
    await prisma.user.update({
      where: { id: userId },
      data: { fpoLinkStatus: 'PENDING' },
    });

    res.status(201).json({
      success: true,
      message: 'Link request sent successfully',
      request: linkRequest,
    });
  } catch (error: any) {
    console.error('Create link request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create link request',
    });
  }
};

/**
 * Get farmer's FPO link status
 * GET /api/farmer/fpo/my-status
 */
export const getMyFPOStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const farmer = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        fpoLinkStatus: true,
        linkedFpoId: true,
      },
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
      });
    }

    let fpoDetails = null;
    if (farmer.linkedFpoId) {
      fpoDetails = await prisma.fPO.findUnique({
        where: { id: farmer.linkedFpoId },
        select: {
          id: true,
          name: true,
          registrationNo: true,
          district: true,
          state: true,
          commissionRate: true,
        },
      });
    }

    // Get pending requests
    const pendingRequests = await prisma.fPOLinkRequest.findMany({
      where: {
        farmerId: userId,
        status: 'PENDING',
      },
      include: {
        farmer: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      status: farmer.fpoLinkStatus,
      fpo: fpoDetails,
      pendingRequests: pendingRequests.map((req) => ({
        id: req.id,
        fpoId: req.fpoId,
        status: req.status,
        message: req.message,
        createdAt: req.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Get FPO status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get FPO status',
    });
  }
};

/**
 * Unlink from FPO
 * DELETE /api/farmer/fpo/unlink
 */
export const unlinkFromFPO = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const farmer = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!farmer || farmer.fpoLinkStatus !== 'LINKED') {
      return res.status(400).json({
        success: false,
        error: 'You are not linked to any FPO',
      });
    }

    // Update user status
    await prisma.user.update({
      where: { id: userId },
      data: {
        fpoLinkStatus: 'NONE',
        linkedFpoId: null,
      },
    });

    // Deactivate FPOFarmer record
    await prisma.fPOFarmer.updateMany({
      where: {
        phone: farmer.phone,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    res.json({
      success: true,
      message: 'Successfully unlinked from FPO',
    });
  } catch (error: any) {
    console.error('Unlink from FPO error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unlink from FPO',
    });
  }
};

// ─── FPO ENDPOINTS ──────────────────────────────────────────────────────

/**
 * Get all link requests for FPO
 * GET /api/fpo/link-requests?status=PENDING
 */
export const getFPOLinkRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { status } = req.query;

    // Get FPO for this admin
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: userId },
    });

    if (!fpo) {
      return res.status(404).json({
        success: false,
        error: 'FPO not found for this user',
      });
    }

    const where: any = { fpoId: fpo.id };
    if (status && typeof status === 'string') {
      where.status = status;
    }

    const requests = await prisma.fPOLinkRequest.findMany({
      where,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            farm: {
              select: {
                location: true,
                district: true,
                areaAcres: true,
                soilType: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      requests: requests.map((req) => ({
        id: req.id,
        farmerId: req.farmerId,
        farmerName: req.farmerName,
        farmerPhone: req.farmerPhone,
        farmerDistrict: req.farmerDistrict,
        farmerAadhaar: req.farmerAadhaar,
        message: req.message,
        status: req.status,
        rejectionReason: req.rejectionReason,
        reviewedAt: req.reviewedAt,
        createdAt: req.createdAt,
        farmerDetails: req.farmer,
      })),
    });
  } catch (error: any) {
    console.error('Get link requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get link requests',
    });
  }
};

/**
 * Approve link request
 * POST /api/fpo/link-requests/:id/approve
 */
export const approveLinkRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    // Get FPO for this admin
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: userId },
    });

    if (!fpo) {
      return res.status(404).json({
        success: false,
        error: 'FPO not found for this user',
      });
    }

    // Get link request
    const linkRequest = await prisma.fPOLinkRequest.findUnique({
      where: { id },
      include: {
        farmer: true,
      },
    });

    if (!linkRequest) {
      return res.status(404).json({
        success: false,
        error: 'Link request not found',
      });
    }

    if (linkRequest.fpoId !== fpo.id) {
      return res.status(403).json({
        success: false,
        error: 'This request is not for your FPO',
      });
    }

    if (linkRequest.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: 'This request has already been processed',
      });
    }

    // Update request status
    await prisma.fPOLinkRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });

    // Update farmer status
    await prisma.user.update({
      where: { id: linkRequest.farmerId },
      data: {
        fpoLinkStatus: 'LINKED',
        linkedFpoId: fpo.id,
      },
    });

    // Create FPOFarmer record
    await prisma.fPOFarmer.create({
      data: {
        fpoId: fpo.id,
        name: linkRequest.farmerName,
        phone: linkRequest.farmerPhone,
        aadhaar: linkRequest.farmerAadhaar || '',
        bankAccount: linkRequest.farmer.bankAccount,
        ifsc: linkRequest.farmer.ifsc,
        district: linkRequest.farmerDistrict,
        photos: [],
        isActive: true,
      },
    });

    res.json({
      success: true,
      message: 'Link request approved successfully',
    });
  } catch (error: any) {
    console.error('Approve link request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve link request',
    });
  }
};

/**
 * Reject link request
 * POST /api/fpo/link-requests/:id/reject
 */
export const rejectLinkRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { reason } = req.body;

    // Get FPO for this admin
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: userId },
    });

    if (!fpo) {
      return res.status(404).json({
        success: false,
        error: 'FPO not found for this user',
      });
    }

    // Get link request
    const linkRequest = await prisma.fPOLinkRequest.findUnique({
      where: { id },
    });

    if (!linkRequest) {
      return res.status(404).json({
        success: false,
        error: 'Link request not found',
      });
    }

    if (linkRequest.fpoId !== fpo.id) {
      return res.status(403).json({
        success: false,
        error: 'This request is not for your FPO',
      });
    }

    if (linkRequest.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: 'This request has already been processed',
      });
    }

    // Update request status
    await prisma.fPOLinkRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason || 'No reason provided',
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });

    // Update farmer status back to NONE
    await prisma.user.update({
      where: { id: linkRequest.farmerId },
      data: {
        fpoLinkStatus: 'NONE',
      },
    });

    res.json({
      success: true,
      message: 'Link request rejected',
    });
  } catch (error: any) {
    console.error('Reject link request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject link request',
    });
  }
};

/**
 * Get all linked farmers for FPO
 * GET /api/fpo/linked-farmers
 */
export const getLinkedFarmers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // Get FPO for this admin
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: userId },
    });

    if (!fpo) {
      return res.status(404).json({
        success: false,
        error: 'FPO not found for this user',
      });
    }

    const farmers = await prisma.fPOFarmer.findMany({
      where: { fpoId: fpo.id },
      include: {
        crops: {
          select: {
            id: true,
            cropName: true,
            quantity: true,
            pricePerKg: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      farmers: farmers.map((farmer) => ({
        id: farmer.id,
        name: farmer.name,
        phone: farmer.phone,
        aadhaar: farmer.aadhaar,
        district: farmer.district,
        bankAccount: farmer.bankAccount,
        ifsc: farmer.ifsc,
        isActive: farmer.isActive,
        photos: farmer.photos,
        cropsCount: farmer.crops.length,
        crops: farmer.crops,
        createdAt: farmer.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Get linked farmers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get linked farmers',
    });
  }
};

/**
 * Toggle farmer active/inactive status
 * PUT /api/fpo/farmers/:id/toggle-status
 */
export const toggleFarmerStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    // Get FPO for this admin
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: userId },
    });

    if (!fpo) {
      return res.status(404).json({
        success: false,
        error: 'FPO not found for this user',
      });
    }

    // Get farmer
    const farmer = await prisma.fPOFarmer.findUnique({
      where: { id },
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
      });
    }

    if (farmer.fpoId !== fpo.id) {
      return res.status(403).json({
        success: false,
        error: 'This farmer is not part of your FPO',
      });
    }

    // Toggle status
    const updatedFarmer = await prisma.fPOFarmer.update({
      where: { id },
      data: {
        isActive: !farmer.isActive,
      },
    });

    res.json({
      success: true,
      message: `Farmer ${updatedFarmer.isActive ? 'activated' : 'deactivated'} successfully`,
      farmer: updatedFarmer,
    });
  } catch (error: any) {
    console.error('Toggle farmer status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle farmer status',
    });
  }
};
