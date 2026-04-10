import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { MarketplaceService } from "./marketplace.service";

const router = Router();
const marketplaceService = new MarketplaceService();

/**
 * Get aggregated marketplace products with filters
 */
router.get("/products", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const {
    cropName,
    category,
    minGrade,
    district,
    state,
    minQuantity,
    maxPrice,
    page,
    limit
  } = req.query;

  const products = await marketplaceService.getAggregatedProducts({
    cropName: cropName as string,
    category: category as string,
    minGrade: minGrade as any,
    district: district as string,
    state: state as string,
    minQuantity: minQuantity ? parseFloat(minQuantity as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined
  });

  res.status(200).json({
    success: true,
    data: products
  });
}));

/**
 * Get product details (crop or aggregated lot)
 */
router.get("/products/:type/:id", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { type, id } = req.params;

  if (type !== 'crop' && type !== 'lot') {
    return res.status(400).json({
      success: false,
      message: "Invalid product type. Must be 'crop' or 'lot'"
    });
  }

  const product = await marketplaceService.getProductDetails(id, type as 'crop' | 'lot');

  res.status(200).json({
    success: true,
    data: product
  });
}));

/**
 * Get quality certificate and AI results for a product
 */
router.get("/products/:type/:id/quality", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { type, id } = req.params;

  if (type !== 'crop' && type !== 'lot') {
    return res.status(400).json({
      success: false,
      message: "Invalid product type. Must be 'crop' or 'lot'"
    });
  }

  const certificates = await marketplaceService.getQualityCertificate(id, type as 'crop' | 'lot');

  res.status(200).json({
    success: true,
    data: certificates
  });
}));

/**
 * Get available filters for marketplace
 */
router.get("/filters", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const filters = await marketplaceService.getAvailableFilters();

  res.status(200).json({
    success: true,
    data: filters
  });
}));

export default router;
