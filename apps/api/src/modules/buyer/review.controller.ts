import { Router, Response } from 'express';
import { ReviewService } from './review.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const reviewService = new ReviewService();

// GET /api/buyer/reviews - List reviews
router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      targetId: req.query.targetId as string,
      targetType: req.query.targetType as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await reviewService.getReviews(filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/reviews/:id - Get review detail
router.get('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    res.json({ success: true, data: review });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

// POST /api/buyer/reviews - Create review
router.post('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const { targetId, targetType, rating, comment, orderId } = req.body;

    if (!targetId || !targetType || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: targetId, targetType, rating, comment'
      });
    }

    const review = await reviewService.createReview({
      authorId: userId,
      targetId,
      targetType,
      rating,
      comment,
      orderId
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/buyer/reviews/:id - Update review
router.put('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;

    const review = await reviewService.updateReview(req.params.id, {
      rating,
      comment
    });

    res.json({ success: true, data: review });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/buyer/reviews/:id - Delete review
router.delete('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
