import { Router, Response } from 'express';
import { PreBookingService } from './pre-booking.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const preBookingService = new PreBookingService();

router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await preBookingService.getPreBookings(req.user!.id, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { bulkProductId, quantity, pricePerUnit, targetDate, notes } = req.body;
    const preBooking = await preBookingService.createPreBooking({
      buyerId: req.user!.id,
      bulkProductId,
      quantity: parseFloat(quantity),
      pricePerUnit: parseFloat(pricePerUnit),
      targetDate: new Date(targetDate),
      notes
    });
    res.status(201).json(preBooking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const preBooking = await preBookingService.getPreBookingById(req.params.id);
    res.json(preBooking);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const preBooking = await preBookingService.updatePreBooking(req.params.id, req.body);
    res.json(preBooking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const preBooking = await preBookingService.cancelPreBooking(req.params.id);
    res.json(preBooking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
