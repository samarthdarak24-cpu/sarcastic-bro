import { Request, Response } from 'express';
import blockchainTraceService from './blockchain-trace.service';

export class BlockchainTraceController {
  async getSupplyChainJourney(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const data = await blockchainTraceService.getSupplyChainJourney(productId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSmartContractStatus(req: Request, res: Response) {
    try {
      const { contractAddress } = req.params;
      const data = await blockchainTraceService.getSmartContractStatus(contractAddress);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyProvenance(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { verificationCode } = req.body;
      const data = await blockchainTraceService.verifyProvenance(productId, verificationCode);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async calculateCarbonFootprint(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const data = await blockchainTraceService.calculateCarbonFootprint(productId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getConsensusStatus(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const data = await blockchainTraceService.getConsensusStatus(transactionId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async detectFraud(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const data = await blockchainTraceService.detectFraud(productId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCrossChainStatus(req: Request, res: Response) {
    try {
      const data = await blockchainTraceService.getCrossChainStatus();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateNFTCertificate(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { batchId } = req.body;
      const data = await blockchainTraceService.generateNFTCertificate(productId, batchId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAuditAnalytics(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      const { startDate, endDate } = req.query;
      const data = await blockchainTraceService.getAuditAnalytics(
        farmerId,
        {
          start: new Date(startDate as string),
          end: new Date(endDate as string)
        }
      );
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async validateCompliance(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { regulations } = req.body;
      const data = await blockchainTraceService.validateCompliance(productId, regulations);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new BlockchainTraceController();
