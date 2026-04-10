import { Request, Response } from 'express';
import prisma from '../config/database';
import { io } from '../index';
import { uploadToCloudinary } from '../config/cloudinary';

export const createCrop = async (req: Request, res: Response) => {
  try {
    const { cropName, category, variety, quantity, pricePerKg, grade, expectedHarvestDate, qualityCertUrl } = req.body;
    
    // Auth context
    const userId = (req as any).user?.id || req.body.farmerId;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    // Handle Image Uploads (only if Cloudinary is configured)
    const images: string[] = [];
    if (req.files && Array.isArray(req.files) && process.env.CLOUDINARY_API_KEY) {
      try {
        for (const file of req.files as Express.Multer.File[]) {
          const url = await uploadToCloudinary(file.buffer, 'crops');
          images.push(url);
        }
      } catch (uploadError) {
        console.warn('Image upload failed, continuing without images:', uploadError);
        // Continue without images rather than failing the entire request
      }
    }

    const crop = await prisma.crop.create({
      data: {
        cropName,
        category,
        variety,
        quantity: parseFloat(quantity),
        pricePerKg: parseFloat(pricePerKg),
        grade: (grade as any) || 'A',
        images,
        expectedHarvestDate: expectedHarvestDate ? new Date(expectedHarvestDate) : null,
        qualityCertUrl,
        status: 'LISTED',
        farmerId: userId,
      }
    });

    // Real-time broadcast to buyers that a new crop is listed
    io.emit('new_crop_listing', crop);

    res.status(201).json({ success: true, crop });
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ success: false, message: 'Failed to create crop listing', error: (error as Error).message });
  }
};

export const getMarketplaceCrops = async (req: Request, res: Response) => {
  try {
    const { category, grade, minPrice, maxPrice } = req.query;
    
    let whereClause: any = {
      status: 'LISTED'
    };

    if (category) whereClause.category = String(category);
    if (grade) whereClause.grade = String(grade);
    if (minPrice || maxPrice) {
      whereClause.pricePerKg = {};
      if (minPrice) whereClause.pricePerKg.gte = parseFloat(String(minPrice));
      if (maxPrice) whereClause.pricePerKg.lte = parseFloat(String(maxPrice));
    }

    const crops = await prisma.crop.findMany({
      where: whereClause,
      include: {
        farmer: {
          select: { name: true, farm: true }
        },
        fpoFarmer: {
          select: { name: true, fpo: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, crops });
  } catch (error) {
    console.error('Fetch marketplace crops error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch crops' });
  }
};

export const getMyCrops = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.query.farmerId; // fallback
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const crops = await prisma.crop.findMany({
      where: { farmerId: String(userId) },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, crops });
  } catch (error) {
    console.error('Fetch my crops error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch your crops' });
  }
};

export const getCropById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const crop = await prisma.crop.findUnique({
      where: { id },
      include: {
        farmer: {
          select: { id: true, name: true, phone: true, farm: true }
        },
        fpoFarmer: {
          select: { id: true, name: true, phone: true, fpo: { select: { id: true, name: true } } }
        }
      }
    });

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.status(200).json({ success: true, crop });
  } catch (error) {
    console.error('Get crop by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch crop details' });
  }
};

export const updateCrop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const { cropName, category, variety, quantity, pricePerKg, grade, expectedHarvestDate, qualityCertUrl, status } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Verify ownership
    const existingCrop = await prisma.crop.findUnique({ where: { id } });
    if (!existingCrop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (existingCrop.farmerId !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this crop' });
    }

    // Build update data
    const updateData: any = {};
    if (cropName !== undefined) updateData.cropName = cropName;
    if (category !== undefined) updateData.category = category;
    if (variety !== undefined) updateData.variety = variety;
    if (quantity !== undefined) updateData.quantity = parseFloat(quantity);
    if (pricePerKg !== undefined) updateData.pricePerKg = parseFloat(pricePerKg);
    if (grade !== undefined) updateData.grade = grade;
    if (expectedHarvestDate !== undefined) updateData.expectedHarvestDate = expectedHarvestDate ? new Date(expectedHarvestDate) : null;
    if (qualityCertUrl !== undefined) updateData.qualityCertUrl = qualityCertUrl;
    if (status !== undefined) updateData.status = status;

    const crop = await prisma.crop.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ success: true, crop });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ success: false, message: 'Failed to update crop' });
  }
};

export const deleteCrop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Verify ownership before deletion
    const crop = await prisma.crop.findUnique({ where: { id } });
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.farmerId !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this crop' });
    }

    await prisma.crop.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete crop' });
  }
};
