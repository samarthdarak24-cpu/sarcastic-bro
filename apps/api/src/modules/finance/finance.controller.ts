import { Request, Response, NextFunction } from "express";
import { FinanceService } from "./finance.service";
import { InsuranceService } from "./insurance.service";
import { getSocketService } from "../../services/socketService";

export class FinanceController {
  /**
   * Get payment history for the logged in user.
   */
  static async getPaymentHistory(req: Request, res: Response, Next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const result = await FinanceService.getUserPayments(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      Next(error);
    }
  }

  /**
   * Get credit score for the user.
   */
  static async getCreditScore(req: Request, res: Response, Next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await FinanceService.calculateCreditScore(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      Next(error);
    }
  }

  /**
   * Get loan eligibility for the user.
   */
  static async getLoanEligibility(req: Request, res: Response, Next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await FinanceService.checkLoanEligibility(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      Next(error);
    }
  }

  // ─── Insurance / Price Protection ──────────────────────────────────

  /** POST /finance/insurance/calculate — Get premium for a policy */
  static async calculatePremium(req: Request, res: Response, next: NextFunction) {
    try {
      const { price, quantity } = req.body;
      const result = InsuranceService.calculatePremium(price, quantity);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** POST /finance/insurance/policy — Create a new protection policy */
  static async createPolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, insuredPrice, quantity, durationDays } = req.body;
      const policy = await InsuranceService.createPolicy(
        (req as any).user.id,
        productId,
        insuredPrice,
        quantity,
        durationDays
      );
      res.status(201).json({ success: true, data: policy });
    } catch (error) { next(error); }
  }

  /** GET /finance/insurance/my-policies — Get user's insurance history */
  static async getMyPolicies(req: Request, res: Response, next: NextFunction) {
    try {
      const policies = await InsuranceService.getFarmerPolicies((req as any).user.id);
      res.status(200).json({ success: true, data: policies });
    } catch (error) { next(error); }
  }

  /** POST /finance/insurance/check — Run automated claim assessment */
  static async checkClaims(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await InsuranceService.checkActivePolicies();
      res.status(200).json({ success: true, data: results });
    } catch (error) { next(error); }
  }

  // ... other methods as placeholders for MVP
  static async recordPayment(req: Request, res: Response, Next: NextFunction) {
    try {
      const { orderId, amount, method } = req.body;
      const userId = (req as any).user.id;
      
      // Emit real-time payment notification
      try {
        const socketService = getSocketService();
        socketService.emitPaymentUpdate(userId, {
          orderId,
          amount,
          status: 'COMPLETED',
          method,
          timestamp: new Date()
        });
      } catch (err) {
        console.error('Socket emission failed:', err);
      }
      
      res.status(200).json({ success: true, message: "Payment recorded." });
    } catch (error: any) {
      Next(error);
    }
  }

  static async getPaymentDetails(req: Request, res: Response, Next: NextFunction) {
    try {
      res.status(200).json({ success: true, data: { id: req.params.id, status: "COMPLETED" } });
    } catch (error: any) {
      Next(error);
    }
  }

  static async requestLoan(req: Request, res: Response, Next: NextFunction) {
    try {
      res.status(200).json({ success: true, message: "Loan request submitted." });
    } catch (error: any) {
      Next(error);
    }
  }
}
