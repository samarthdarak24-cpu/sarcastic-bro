import { Router, Response } from 'express';
import { SecurityService } from './security.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const securityService = new SecurityService();

router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const status = await securityService.getSecurityStatus(req.user!.id);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      eventType: req.query.eventType as string,
      riskLevel: req.query.riskLevel as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await securityService.getSecurityEvents(req.user!.id, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sessions', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await securityService.getSessions(req.user!.id);
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/sessions/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const result = await securityService.terminateSession(req.params.id, req.user!.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
