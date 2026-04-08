import { Router, Response } from 'express';
import { BulkProductService } from './bulk-product.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const bulkProductService = new BulkProductService();

// GET /api/buyer/bulk-products - List bulk products with filters
router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      district: req.query.district as string,
      state: req.query.state as string,
      minQuantity: req.query.minQuantity ? parseFloat(req.query.minQuantity as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      qualityGrade: req.query.qualityGrade as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      sortBy: req.query.sortBy as string
    };

    const result = await bulkProductService.getBulkProducts(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/bulk-products/:id - Get bulk product detail
router.get('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const product = await bulkProductService.getBulkProductById(req.params.id);
    res.json(product);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// POST /api/buyer/bulk-products/inquiry - Create inquiry
router.post('/inquiry', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, message } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const inquiry = await bulkProductService.createInquiry({
      buyerId: req.user!.id,
      productId,
      quantity: parseFloat(quantity),
      message
    });

    res.status(201).json(inquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
