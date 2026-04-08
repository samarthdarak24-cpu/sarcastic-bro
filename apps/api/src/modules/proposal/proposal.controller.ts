import { Request, Response } from 'express';
import { ProposalService } from './proposal.service';

export class ProposalController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await ProposalService.create(userId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await ProposalService.getAll(userId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const result = await ProposalService.getById(req.params.id);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await ProposalService.update(req.params.id, userId, req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      await ProposalService.delete(req.params.id, userId);
      res.json({ success: true, message: 'Proposal deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
