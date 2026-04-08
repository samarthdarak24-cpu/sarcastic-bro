import type { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ContractService } from "./contract.service";
import {
  createContractSchema,
  listContractSchema,
  updateContractSchema,
  signContractSchema,
} from "./contract.validation";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/response";

export class ContractController {
  static async createContract(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const data = createContractSchema.parse(req.body);
    const contract = await ContractService.createContract(userId, data);
    return sendCreated(res, contract, "Contract created successfully");
  }

  static async listContracts(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const filters = listContractSchema.parse(req.query);
    const { contracts, pagination } = await ContractService.listContracts(userId, filters);
    return sendPaginated(res, contracts, pagination.total, pagination.page, pagination.limit);
  }

  static async getContractById(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const contract = await ContractService.getContractById(userId, req.params.id);
    return sendSuccess(res, contract, "Contract retrieved");
  }

  static async updateContract(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const data = updateContractSchema.parse(req.body);
    const contract = await ContractService.updateContract(userId, req.params.id, data);
    return sendSuccess(res, contract, "Contract updated successfully");
  }

  static async signContract(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const contract = await ContractService.signContract(userId, req.params.id);
    return sendSuccess(res, contract, "Contract signed successfully");
  }

  static async deleteContract(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const result = await ContractService.deleteContract(userId, req.params.id);
    return sendSuccess(res, result, "Contract deleted successfully");
  }
}
