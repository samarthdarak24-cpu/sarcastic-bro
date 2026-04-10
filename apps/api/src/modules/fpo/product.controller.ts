import { Router, Response } from 'express';
import { ProductService } from './product.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const productService = new ProductService();

/**
 * GET /api/fpo/products
 * Get all products
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const filters = {
      status: req.query.status as string,
      category: req.query.category as string,
      isAggregated: req.query.isAggregated as string,
      farmerId: req.query.farmerId as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await productService.getProducts(fpoId, filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/products
 * Add product on behalf of farmer
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await productService.addProductForFarmer(fpoId, req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/products/:id
 * Get product details
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await productService.getProductById(fpoId, req.params.id);
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * PUT /api/fpo/products/:id
 * Update product
 */
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await productService.updateProduct(fpoId, req.params.id, req.body);
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/fpo/products/:id
 * Delete product
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await productService.deleteProduct(fpoId, req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
