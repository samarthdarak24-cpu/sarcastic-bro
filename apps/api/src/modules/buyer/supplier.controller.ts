import { Router, Response } from 'express';
import { SupplierService } from './supplier.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const supplierService = new SupplierService();

// GET /api/buyer/suppliers - List suppliers with filters
router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      search: req.query.search as string,
      district: req.query.district as string,
      state: req.query.state as string,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      category: req.query.category as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await supplierService.getSuppliers(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/suppliers/:id - Get supplier detail
router.get('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    res.json(supplier);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// GET /api/buyer/suppliers/:id/analytics - Get supplier analytics
router.get('/:id/analytics', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const analytics = await supplierService.getSupplierAnalytics(req.params.id);
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/suppliers/:id/products - Get supplier products
router.get('/:id/products', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await supplierService.getSupplierProducts(req.params.id, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
