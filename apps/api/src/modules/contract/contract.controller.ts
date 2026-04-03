import type { Request, Response } from "express";
import { ContractService } from "./contract.service";
import {
  createContractSchema,
  listContractSchema,
  updateContractSchema,
  signContractSchema,
} from "./contract.validation";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/response";

export class ContractController {
  static async createContract(req: Request, res: Response) {
    const data = createContractSchema.parse(req.body);
    const contract = await ContractService.createContract(req.user!.userId, data);
    return sendCreated(res, contract, "Contract created successfully");
  }

  static async listContracts(req: Request, res: Response) {
    const filters = listContractSchema.parse(req.query);
    const { contracts, pagination } = await ContractService.listContracts(req.user!.userId, filters);
    return sendPaginated(res, contracts, pagination.total, pagination.page, pagination.limit);
  }

  static async getContractById(req: Request, res: Response) {
    const contract = await ContractService.getContractById(req.user!.userId, req.params.id);
    return sendSuccess(res, contract, "Contract retrieved");
  }

  static async updateContract(req: Request, res: Response) {
    const data = updateContractSchema.parse(req.body);
    const contract = await ContractService.updateContract(req.user!.userId, req.params.id, data);
    return sendSuccess(res, contract, "Contract updated successfully");
  }

  static async signContract(req: Request, res: Response) {
    const contract = await ContractService.signContract(req.user!.userId, req.params.id);
    return sendSuccess(res, contract, "Contract signed successfully");
  }

  static async deleteContract(req: Request, res: Response) {
    const result = await ContractService.deleteContract(req.user!.userId, req.params.id);
    return sendSuccess(res, result, "Contract deleted successfully");
  }
}
